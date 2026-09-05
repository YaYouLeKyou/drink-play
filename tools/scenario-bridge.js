/* =====================================================================
   SCENARIO BRIDGE — le pont entre scenario-complet.md et l'app
   ---------------------------------------------------------------------
   - loadScenarioDoc()  : lit le document canonique (markdown)
   - saveScenarioDoc()  : écrit une nouvelle version (+ backup horodaté)
   - loadPhases()       : charge phases.js et retourne window.TDPhases
   - validate()         : compare le doc et l'app, liste les dérives
   Utilisé par le CLI (validate-scenario.js) et par le serveur (/api/scenario/*).
===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOC_PATH = path.join(ROOT, 'true-detective', 'scenario-complet.md');
const PHASES_PATH = path.join(ROOT, 'true-detective', 'phases.js');

function loadScenarioDoc() {
    return fs.readFileSync(DOC_PATH, 'utf8');
}

function saveScenarioDoc(content) {
    if (!content || typeof content !== 'string' || content.trim().length < 50) {
        throw new Error('Contenu de scénario invalide (trop court ou absent).');
    }
    try {
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupDir = path.dirname(DOC_PATH);
        fs.mkdirSync(backupDir, { recursive: true });
        const backup = path.join(backupDir, 'scenario-complet.backup-' + stamp + '.md');
        fs.copyFileSync(DOC_PATH, backup);
        fs.writeFileSync(DOC_PATH, content, 'utf8');
        return { saved: true, backup: path.basename(backup) };
    } catch (err) {
        throw new Error('Échec de sauvegarde du scénario : ' + (err.message || 'erreur inconnue'));
    }
}

function loadPhases() {
    delete require.cache[require.resolve(PHASES_PATH)];
    delete globalThis.TDPhases;
    require(PHASES_PATH);
    const phases = globalThis.TDPhases;
    if (!Array.isArray(phases)) throw new Error('phases.js n\'a pas exposé TDPhases');
    return phases;
}

/* Tous les mini-jeux déclarés dans l'app, avec leur config */
function collectMinigames(phases) {
    const found = [];
    phases.forEach(function (phase) {
        (phase.pages || []).forEach(function (page, pageIndex) {
            if (page.minigame) {
                found.push({
                    phaseId: phase.id, act: phase.act, pageIndex: pageIndex,
                    type: page.minigame.type, cfg: page.minigame
                });
            }
        });
    });
    return found;
}

/* Validation de cohérence doc <-> app */
function validate() {
    const issues = [];
    const warnings = [];
    const doc = loadScenarioDoc();
    const phases = loadPhases();
    const minigames = collectMinigames(phases);
    const docLower = doc.toLowerCase();

    /* 1. Chaque MINI-JEU `type` du doc existe dans l'app */
    const re = /mini[-_\s]?jeu\s+`([a-z_]+)`/gi;
    let m;
    const docTypes = new Set();
    while ((m = re.exec(doc)) !== null) docTypes.add(m[1]);
    const appTypes = new Set(minigames.map(function (x) { return x.type; }));
    docTypes.forEach(function (t) {
        if (!appTypes.has(t)) issues.push('Le doc référence le mini-jeu `' + t + '` absent de phases.js');
    });
    appTypes.forEach(function (t) {
        if (!docTypes.has(t)) warnings.push('Mini-jeu `' + t + '` présent dans phases.js mais non documenté');
    });

    /* 2. L'heure du crime NE doit PAS être établie dans l'intro */
    const intro = phases.find(function (p) { return p.id === 'intro-1'; });
    if (intro) {
        const p2 = (intro.pages[1] && intro.pages[1].text.fr) || '';
        if (p2.indexOf('22h09') !== -1) issues.push('intro-1/page2 mentionne encore 22h09 : l\'heure ne doit pas être établie');
        if (p2.toLowerCase().indexOf('montre') === -1) warnings.push('intro-1/page2 ne mentionne plus la montre');
    } else issues.push('Phase intro-1 introuvable dans phases.js');

    /* 3. Montre : code 1981 + doc aligné */
    const montre = minigames.find(function (x) { return x.type === 'montre_code'; });
    if (montre) {
        const code = (montre.cfg.code || []).join('');
        if (code !== '1981') issues.push('Code montre = ' + code + ' (attendu 1981)');
        if (docLower.indexOf('1981') === -1) issues.push('Le doc ne mentionne pas le code 1981');
        if (docLower.indexOf('face') === -1) issues.push('Le doc ne décrit pas la révélation de la FACE de la montre');
    } else issues.push('Mini-jeu montre_code absent de phases.js');

    /* 4. Coffre-fort : narrative text instead of minigame */
    const acte3 = phases.find(function (p) { return p.id === 'act3_1'; });
    if (acte3) {
        const pages = acte3.pages || [];
        const hasCoffreMinigame = pages.some(function (pg) {
            return pg.minigame && pg.minigame.type === 'coffre_code';
        });
        if (hasCoffreMinigame) {
            issues.push('minigame coffre_code encore présent dans phases.js (devrait être narrative)');
        }
        const hasCoffreNarrative = pages.some(function (pg) {
            return pg.text && (pg.text.fr || '').toLowerCase().indexOf('coffre') !== -1;
        });
        if (!hasCoffreNarrative) {
            warnings.push('L acte 3 / coffre n a pas de page narrative de remplacement');
        }
    } else {
        issues.push('Phase act3_1 (coffre) introuvable dans phases.js');
    }

    /* 5. Chaque mini-jeu doit avoir un clue */
    minigames.forEach(function (x) {
        if (!x.cfg.clue) {
            issues.push('Mini-jeu `' + x.type + '` (' + x.phaseId + ') sans indice de récompense (cfg.clue)');
        }
        if (x.cfg.clue && detectDocCoverage(x.cfg.clue.fr, docLower) < 0.25) {
            warnings.push('L\'indice de `' + x.type + '` est peu couvert dans le doc (mots-clés absents)');
        }
    });

    /* 6. Choix narratifs clés */
    const hasChoice = function (key) {
        return phases.some(function (p) {
            return (p.pages || []).some(function (pg) { return pg.choiceKey === key; });
        });
    };
    if (!hasChoice('choisirSuspect')) issues.push('Choix choisirSuspect absent');
    if (!hasChoice('accuser')) issues.push('Choix final accuser absent');
    if (docLower.indexOf('choisirsuspect') === -1) warnings.push('choisirSuspect non documenté');
    if (docLower.indexOf('accuser') === -1) warnings.push('accuser non documenté');

    /* 7. Fouille : 8 zones */
    const fouille = minigames.find(function (x) { return x.type === 'scene_fouille'; });
    if (fouille) {
        const n = (fouille.cfg.hotspots || []).length;
        if (n < 8) warnings.push('Fouille : ' + n + ' zones seulement (8 attendues)');
    }

    return {
        ok: issues.length === 0,
        issues: issues,
        warnings: warnings,
        stats: {
            phases: phases.length,
            minigames: minigames.length,
            docBytes: Buffer.byteLength(doc, 'utf8')
        }
    };
}

/* Couverture approximative du texte d'un indice dans le doc (0..1). */
function detectDocCoverage(text, docLower) {
    if (!text) return 1;
    const stop = new Set(['l', 'les', 'la', 'le', 'il', 'ils', 'elle', 'de', 'du', 'des', 'un', 'une', 'et', 'est', 'que', 'qui', 'pour', 'par', 'sur', 'dans', 'avec', 'plus', 'mais', 'pas', 'nues', 'nue', 'etait', 'votre']);
    const words = text.toLowerCase().replace(/[^a-zéèêàôîçùû0-9' ]/g, ' ').split(/\s+/)
        .filter(function (w) { return w.length > 3 && !stop.has(w) && isNaN(parseFloat(w)); });
    if (!words.length) return 1;
    let hits = 0;
    words.forEach(function (w) { if (docLower.indexOf(w) !== -1) hits++; });
    return hits / words.length;
}

/* Export du module (toujours en dernier — best practices) */
module.exports = {
    loadScenarioDoc: loadScenarioDoc,
    saveScenarioDoc: saveScenarioDoc,
    loadPhases: loadPhases,
    collectMinigames: collectMinigames,
    validate: validate,
    detectDocCoverage: detectDocCoverage,
    DOC_PATH: DOC_PATH
};

