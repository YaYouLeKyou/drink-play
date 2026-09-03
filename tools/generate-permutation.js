/* =====================================================================
   GENERATE-PERMUTATION — écrit une permutation dans phases.js + scenario.js
   Usage : node tools/generate-permutation.js <culpritId>
     culpritId : protecteur | femme-fatale | criminel | suspect
   Effets :
     1. phases.js  : remplace les textes des 8 hotspots de scene_fouille,
        son clue, et les clues des mini-jeux (carnet, pression, verrou,
        montre, coffre, chronologie, roue) par ceux de la permutation.
     2. scenario.js : force le coupable actif (randomCulprit/reset).
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PERM_PATH = path.join(ROOT, 'true-detective', 'permutations.js');
const PHASES_PATH = path.join(ROOT, 'true-detective', 'phases.js');
const SCENARIO_PATH = path.join(ROOT, 'true-detective', 'scenario.js');

const id = process.argv[2];
if (!id) {
    console.error('Usage: node tools/generate-permutation.js <culpritId>');
    console.error('   Culprits: protecteur | femme-fatale | criminel | suspect');
    process.exit(1);
}

delete require.cache[require.resolve(PERM_PATH)];
require(PERM_PATH);
const TDP = globalThis.TDPermutations;
if (!TDP || !TDP.list || TDP.list().indexOf(id) < 0) {
    console.error('Permutation inconnue : ' + id);
    console.error('   Disponibles : ' + (TDP && TDP.list ? TDP.list().join(' | ') : 'aucune'));
    process.exit(1);
}
const PERM = TDP.get(id);

function backup(file) {
    /* Sauvegarde atomique unique sans polluer le repo */
    try { fs.copyFileSync(file, file + '.bak'); } catch (_) {}
}
/* Échappe apostrophes et backslashes pour les chaînes JS entre quotes simples */
function esc(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/* --- util : extraire un bloc d'objet/array équilibré à partir d'un index --- */
function extractBalanced(src, startCharIdx, open, close) {
    let depth = 0, i = startCharIdx, inStr = null;
    for (; i < src.length; i++) {
        const c = src[i];
        if (inStr) { if (c === '\\') { i++; continue; } if (c === inStr) inStr = null; continue; }
        if (c === "'" || c === '"') { inStr = c; continue; }
        if (c === open) depth++;
        else if (c === close) { depth--; if (depth === 0) break; }
    }
    return src.slice(startCharIdx, i + 1);
}

/* ------------------------------------------------------------------ */
/* 1. phases.js : hotspots scene_fouille + clue                       */
/* ------------------------------------------------------------------ */
let phases = fs.readFileSync(PHASES_PATH, 'utf8');

const fouilleIdx = phases.indexOf("type: 'scene_fouille'");
if (fouilleIdx < 0) { console.error('scene_fouille introuvable dans phases.js'); process.exit(1); }

/* 1a. Régénère le bloc hotspots de la fouille */
const hs = phases.indexOf('hotspots: [', fouilleIdx);
let openBracket = phases.indexOf('[', hs);
const hotspotsBlock = extractBalanced(phases, openBracket, '[', ']');
const newHotspots = PERM.fouille.map(function (z) {
    return "{ label: '" + z.label + "', info: { fr: '" + esc(z.info.fr) + "', en: '" + esc(z.info.en) + "' } }";
}).join(',\n                    ');
const newHotspotsBlock = '[\n                    ' + newHotspots + '\n                ]';
phases = phases.replace(hotspotsBlock, newHotspotsBlock);

/* 1b. Remplace le clue d'un mini-jeu par type */
function replaceClueFor(type, newClue) {
    const idx0 = phases.indexOf("type: '" + type + "'");
    if (idx0 < 0) return;
    const ci = phases.indexOf('clue: {', idx0);
    if (ci < 0) return;
    const open = phases.indexOf('{', ci);
    const oldClueBlock = extractBalanced(phases, open, '{', '}');
    const fullOld = phases.slice(ci, open + oldClueBlock.length);
    const newClueBlock = "clue: { fr: '" + esc(newClue.fr) + "', en: '" + esc(newClue.en) + "' }";
    phases = phases.replace(fullOld, newClueBlock);
}

replaceClueFor('scene_fouille', PERM.fouilleClue);

const clueMap = {
    carnet_dechire: PERM.clues.carnet_dechire,
    pression: PERM.clues.pression,
    labo_verrou: PERM.clues.labo_verrou,
    montre_code: PERM.clues.montre_code,
    coffre_code: PERM.clues.coffre_code,
    chronologie: PERM.clues.chronologie,
    roue_alibis: PERM.clues.roue_alibis
};
Object.keys(clueMap).forEach(function (t) { if (clueMap[t]) replaceClueFor(t, clueMap[t]); });

backup(PHASES_PATH);
fs.writeFileSync(PHASES_PATH, phases, 'utf8');

/* ------------------------------------------------------------------ */
/* 2. scenario.js : forcer le coupable actif                          */
/* ------------------------------------------------------------------ */
let scenario = fs.readFileSync(SCENARIO_PATH, 'utf8');
backup(SCENARIO_PATH);
scenario = scenario.replace(
    /function randomCulprit\(\) \{ return '[a-z-]+'; \}/,
    "function randomCulprit() { return '" + id + "'; }"
);
scenario = scenario.replace(/state\.culprit = '[a-z-]+';/g, "state.culprit = '" + id + "';");
fs.writeFileSync(SCENARIO_PATH, scenario, 'utf8');

console.log('=== PERMUTATION APPLIQUÉE : ' + id + ' ===');
console.log('Coupable  : ' + PERM.coupable.fr);
console.log('Co-complice : ' + PERM.coComplice.fr);
console.log('Fausse piste : ' + PERM.faussePiste.fr);
console.log('Lame      : ' + PERM.lame.fr);
console.log('Heure     : ' + PERM.heure);
console.log('phases.js : hotspots scene_fouille + clues mis à jour.');
console.log('scenario.js : coupable actif = ' + id);
console.log('NOTE : npm run validate:scenario pour vérifier la cohérence.');