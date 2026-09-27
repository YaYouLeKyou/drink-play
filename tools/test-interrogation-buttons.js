/* Regle d'exclusion mutuelle pendant l'interrogatoire.
   Le bouton « 🔍 Interroger » (.interrogation-ask) est ancre en bas au centre
   de l'ecran (position: fixed, bottom: 20px, left: 50%). Le bouton
   « Continuer » (#continue-btn, .btn-continue) est ancre au MEME point
   (styles.css : bottom + left:50% + transform). Les deux se recouvrent donc
   exactement s'ils sont affiches ensemble.

   La regle : des que le bouton « Interroger » est affiche, « Continuer »
   doit etre absent — sur mobile ET sur desktop.

   Ce test verifie la source de app.js plutot que de rejouer le scenario dans
   un navigateur. Raison : atteindre une phase d'interrogatoire reelle
   demande de valider l'ecran d'accueil, le selecteur de mode, le selecteur
   de theme, puis d'attendre la frappe progressive du texte — un parcours
   trop instable pour servir de garde-fou (il casse sur des details
   d'interface sans rapport avec la regle testee). La verification porte donc
   sur la logique reellement executee, lue dans sa source.

   Usage : node tools/test-interrogation-buttons.js            */
'use strict';

var fs = require('fs');
var path = require('path');

var APP = path.join(__dirname, '..', 'true-detective', 'app.js');
var CSS = path.join(__dirname, '..', 'true-detective', 'styles.css');

var src = fs.readFileSync(APP, 'utf8');
var css = fs.readFileSync(CSS, 'utf8');

var problems = [];
var checks = [];

function check(label, ok, detail) {
    checks.push({ label: label, ok: ok });
    if (!ok) problems.push(label + (detail ? ' : ' + detail : ''));
}

/* Extrait le corps `{ … }` d'une fonction du source par comptage
   d'accolades. Robuste a l'indentation, contrairement a une recherche de
   fermeture par motifs d'indentation. */
function bodyOf(marker) {
    var start = src.indexOf(marker);
    if (start === -1) return null;
    var open = src.indexOf('{', start);
    if (open === -1) return null;
    var depth = 0;
    for (var i = open; i < src.length; i++) {
        if (src[i] === '{') depth++;
        else if (src[i] === '}') {
            depth--;
            if (depth === 0) return src.substring(open, i + 1);
        }
    }
    return null;
}

/* Idem pour un bloc `if (…) { … }` situe dans un corps donne. */
function blockOf(text, marker) {
    var start = text.indexOf(marker);
    if (start === -1) return null;
    var open = text.indexOf('{', start);
    if (open === -1) return null;
    var depth = 0;
    for (var i = open; i < text.length; i++) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') {
            depth--;
            if (depth === 0) return text.substring(open, i + 1);
        }
    }
    return null;
}

/* Retire les commentaires : sinon le texte explicatif
   (« le garde isMobile() d'avant… ») ferait croire a un garde present. */
function stripComments(text) {
    return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}

console.log('=== REGLE : « Interroger » et « Continuer » sont exclus ===\n');

/* 1. Les deux boutons anchent au meme point : le conflit est reel. */
var askRule = (css.match(/#game-screen \.interrogation-ask\s*\{([\s\S]*?)\}/) || [])[1] || '';
var continueRule = (css.match(/^\.btn-continue\s*\{([\s\S]*?)\}/m) || [])[1] || '';

check('le bouton « Interroger » est ancre en bas au centre',
    /position:\s*fixed/.test(askRule) && /bottom:/.test(askRule)
    && /left:\s*50%/.test(askRule),
    'regle #game-screen .interrogation-ask introuvable ou differente');

/* 2. scrShowInterroAskButton : « Continuer » doit disparaitre des
       l'affichage du bouton « Interroger », SANS condition de largeur.
       On travaille sur le corps sans commentaires : mes propres
       commentaires d'explication mentionnent isMobile(), ce qui ferait
       passer un garde absent pour un garde present. */
var showBody = stripComments(bodyOf('function scrShowInterroAskButton()') || '');
check('fonction scrShowInterroAskButton trouvee', !!showBody);
if (showBody) {
    /* La classe est posee via className = '… interrogation-ask' : on
       cherche le nom de classe, pas le selecteur CSS '.interrogation-ask'
       qui n'apparait pas dans le JS. */
    var splitAt = showBody.indexOf('interrogation-ask');
    var askBranch = splitAt === -1 ? '' : showBody.substring(splitAt);
    var finalBranch = splitAt === -1 ? showBody : showBody.substring(0, splitAt);

    check('le bouton « Interroger » est cree dans cette fonction',
        splitAt !== -1);
    check('« Continuer » est masque quand « Interroger » est affiche',
        askBranch.indexOf("continueBtn.classList.add('hidden')") !== -1);
    /* Le garde fautif etait `if (isMobile())` : il ne masquait que sur
       mobile, laissant les deux boutons empiles sur tout le reste.

       On borne la recherche au BLOC `if (hasMoreQuestions) { ... }` : verifier
       toute la queue de la fonction donnerait un faux positif, car
       scrShowInterroAskButton contient plus loin le lancement du mini-jeu
       ( legitimement suivi d'un `remove('hidden')` ). */
    var askBlock = blockOf(showBody, 'if (hasMoreQuestions)') || '';
    check('le bloc hasMoreQuestions est identifiable', askBlock !== '');
    check('aucun garde isMobile() dans le bloc « Interroger »',
        askBlock.indexOf('isMobile()') === -1,
        'le bloc contient encore isMobile() : « Continuer » ne serait masque '
        + 'que sur mobile');
    /* Et l'autre sens : le bloc ne doit surtout pas rallumer le bouton. */
    check('le bloc « Interroger » ne rallume jamais « Continuer »',
        askBlock.indexOf("continueBtn.classList.remove('hidden')") === -1,
        'le bloc reaffiche « Continuer » alors que « Interroger » est affiche');
    check('la branche interrogatoire final masque aussi « Continuer »',
        finalBranch.indexOf("continueBtn.classList.add('hidden')") !== -1,
        'la branche finalInterrogation / act2_3 laisse « Continuer » visible '
        + 'pendant les questions');
}

/* 3. Fin d'interrogatoire : « Continuer » doit REAPPARAITRE, sinon la
       partie reste bloquee sur desktop apres le masquage inconditionnel. */
var endBody = stripComments(bodyOf('function scrEndInterrogation()') || '');
check('fonction scrEndInterrogation trouvee', !!endBody);
if (endBody) {
    check('« Continuer » reapparait en fin d interrogatoire',
        endBody.indexOf("continueBtn.classList.remove('hidden')") !== -1);
    check('« Continuer » est re-active en fin d interrogatoire',
        /continueBtn\.disabled\s*=\s*false/.test(endBody));
    check('aucun garde isMobile() ne conditionne la reapparition',
        endBody.indexOf('isMobile()') === -1,
        'la reapparition reste conditionnee a isMobile()');
}

/* 4. Les appelants ne doivent pas rallumer « Continuer » juste avant
       d'appeler scrShowInterroAskButton : cet affichage annulait la regle. */
var chunks = stripComments(src).split('scrShowInterroAskButton();');
var badCallers = 0;
for (var i = 1; i < chunks.length; i++) {
    if (/continueBtn\.classList\.remove\('hidden'\)/.test(chunks[i - 1].slice(-600))) {
        badCallers++;
    }
}
check('aucun appelant ne rallume « Continuer » avant scrShowInterroAskButton',
    badCallers === 0,
    badCallers + ' appelant(s) affichent « Continuer » juste avant l appel, '
    + 'ce qui peut reintroduire le conflit');

checks.forEach(function (c) {
    console.log((c.ok ? '  OK    ' : '  ECHEC ') + c.label);
});

console.log('\n' + checks.length + ' verification(s), '
    + (problems.length ? problems.length + ' en echec' : 'toutes valides'));

if (problems.length) {
    console.log('\nECHEC :');
    problems.forEach(function (p) { console.log('  - ' + p); });
    process.exit(1);
}
console.log('\nOK - « Continuer » est absent des que « Interroger » est affiche, '
    + 'sur mobile comme sur desktop.');

check('le bouton « Continuer » est ancre en bas au centre',
    /position:\s*fixed/.test(continueRule) && /bottom:/.test(continueRule)
    && /left:\s*50%/.test(continueRule),
    'regle .btn-continue introuvable ou differente');
check('les deux boutons partagent le meme point d ancrage',
    /bottom:/.test(askRule) && /bottom:/.test(continueRule)
    && /left:\s*50%/.test(askRule) && /left:\s*50%/.test(continueRule));
