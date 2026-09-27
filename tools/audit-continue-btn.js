/* Audit du bouton « Continuer » du mode scenario.
   Verifie que chaque mini-jeu expose bien une fleche compacte « → » dans la
   barre de titre (donc incapable de chevaucher le titre), avec ses attributs
   d'accessibilite, et que plus aucun bouton ne traine en `position: fixed`
   au-dessus de l'en-tete.

   Usage : node tools/audit-continue-btn.js            (resume)
           node tools/audit-continue-btn.js --verbose  (detail par jeu)   */
'use strict';

var fs = require('fs');
var path = require('path');

var DIR = path.join(__dirname, '..', 'true-detective');

/* Mini-jeux ou le bouton « Continuer » doit vivre dans l'en-tete. */
var HEADER_GAMES = [
    'asteroids.html', 'bataille-navale.html', 'breakout.html',
    'chemistry.html', 'coffre-code.html', 'connect4.html',
    'jackpot.html', 'marginal-tower.html', 'memory.html',
    'missile-command.html', 'pacman.html', 'pong.html',
    'puzzle.html', 'shooting.html', 'space-invaders.html', 'sudoku.html'
];

/* Mini-jeux ou le bouton reste volontairement en bas d'ecran : ces pages
   n'ont pas de conflit d'en-tete, on ne les touche pas. */
var FLOATING_GAMES = [
    'chess.html', 'montre-code.html',
    'reseau-alibis-1.html', 'reseau-alibis-2.html',
    'reseau-alibis-3.html', 'reseau-alibis-4.html'
];

var ARROW = '\u2192';
var problems = [];
var rows = [];

function read(file) {
    return fs.readFileSync(path.join(DIR, file), 'utf8');
}

function headerOf(html) {
    var start = html.indexOf('<header');
    if (start === -1) return null;
    var end = html.indexOf('</header>', start);
    return end === -1 ? null : html.substring(start, end);
}

/* Un bouton declare dans le HTML (balise statique). */
function staticContinueButton(html) {
    var idx = html.indexOf('id="story-continue-btn"');
    if (idx === -1) return null;
    var open = html.lastIndexOf('<button', idx);
    var close = html.indexOf('</button>', idx);
    if (open === -1 || close === -1) return null;
    return html.substring(open, close + 9);
}

/* Un bouton construit en JS (createElement) dans le bloc de scenario.
   L'id est pose APRES le createElement, donc on remonte a la creation
   depuis l'affectation de l'id. */
function dynamicContinueButton(html) {
    var idIdx = html.indexOf("continueBtn.id = 'story-continue-btn'");
    if (idIdx === -1) return null;
    var open = html.lastIndexOf("document.createElement('button')", idIdx);
    if (open === -1) return null;
    /* On s'arrete au prochain createElement pour ne pas capturer un autre
       bouton, et on inclut le id pose juste apres la creation. */
    var next = html.indexOf("document.createElement('button')", idIdx);
    return html.substring(open, next === -1 ? open + 900 : next);
}

/* Le bouton dynamique est-il insere dans l'en-tete (et pas ailleurs) ? */
function dynamicGoesToHeader(html) {
    var idIdx = html.indexOf("continueBtn.id = 'story-continue-btn'");
    if (idIdx === -1) return false;
    var seg = html.substring(idIdx, idIdx + 4000);
    return /header\.(insertBefore|appendChild)\(continueBtn\)/.test(seg)
        || /header\.querySelector\('\.sg-header-actions'\)/.test(seg);
}


function checkHeaderGame(file) {
    var html = read(file);
    var header = headerOf(html);
    if (!header) {
        problems.push(file + ' : aucun <header> trouve');
        return;
    }

    var btn = staticContinueButton(header);
    var kind = 'statique';
    var inHeader = false;
    if (btn) {
        inHeader = header.indexOf('story-continue-btn') !== -1;
    } else {
        btn = dynamicContinueButton(html);
        kind = 'dynamique';
        /* Le bouton est cree en JS : c'est le code qui l'insere dans
           l'en-tete qu'il faut inspecter, pas le HTML statique. */
        inHeader = dynamicGoesToHeader(html);
    }
    if (!btn) {
        problems.push(file + ' : aucun bouton #story-continue-btn');
        return;
    }

    /* La fleche doit etre le contenu du bouton (ou son aria-label). */
    var hasArrow = btn.indexOf(ARROW) !== -1;
    var hasLabel = btn.indexOf('aria-label') !== -1
        && btn.indexOf('Continuer') !== -1;

    /* Plus de geometrie fixe : c'est ce qui provoquait le chevauchement. */
    var stillFixed = /position:\s*fixed/.test(btn);
    var stillWide = /padding:\s*(8px 18px|10px 20px|6px 14px|8px 16px)/.test(btn);

    /* `display: inline-flex` obligatoire, mais la source depend du type :
       - bouton STATIQUE : le JS le montre via style.display = 'inline-flex'
         (il est masque par `display:none` au depart) ;
       - bouton DYNAMIQUE : il n'est cree qu'en mode scenario, donc jamais
         masque, et son affichage vient de la regle CSS contextuelle
         `.sg-header .btn-continue` (il faut donc que la feuille soit
         chargee). */
    var loadsSharedCss = html.indexOf('standalone-game.css') !== -1;
    var displaySet = kind === 'statique'
        ? /display\s*=\s*'inline-flex'/.test(html)
        : loadsSharedCss;
    if (!displaySet) {
        problems.push(file + ' : display:inline-flex incoherent');
    }

    if (!inHeader) problems.push(file + ' : bouton absent du <header>');
    if (!hasArrow) problems.push(file + ' : fleche absente du bouton');
    if (!hasLabel) problems.push(file + ' : aria-label="Continuer" manquant');
    if (stillFixed) problems.push(file + ' : bouton encore en position:fixed');
    if (stillWide) problems.push(file + ' : bouton garde un padding large');

    rows.push({
        jeu: file, type: kind,
        fleche: hasArrow ? 'oui' : 'NON',
        aria: hasLabel ? 'oui' : 'NON',
        compact: (stillFixed || stillWide) ? 'NON' : 'oui',
        header: inHeader ? 'oui' : 'NON'
    });
}

function checkFloatingGame(file) {
    var html = read(file);
    /* Ces pages ne doivent PAS avoir ete converties : leur bouton reste
       ancre en bas d'ecran, hors du conflit d'en-tete. */
    var header = headerOf(html);
    if (header && header.indexOf('id="story-continue-btn"') !== -1) {
        problems.push(file + ' : bouton deplace dans l en-tete alors qu il est '
            + 'volontairement ancre en bas');
    }
    rows.push({
        jeu: file, type: 'flottant (inchange)', fleche: '-', aria: '-',
        compact: 'n/a', header: 'n/a'
    });
}

HEADER_GAMES.forEach(checkHeaderGame);
FLOATING_GAMES.forEach(checkFloatingGame);

/* La feuille partagee porte les deux fondations de la correction :
   la protection du titre et la regle compacte du bouton. */
var css = fs.readFileSync(path.join(DIR, 'standalone-game.css'), 'utf8');

/* On verifie la protection DANS le bloc .sg-title lui-meme : une regle
   identique ailleurs (sur .sg-hud, sur un autre jeu) ne protegerait pas
   l'en-tete. Les commentaires sont retires avant test, sinon le texte
   explicatif « Sans `min-width: 0` … » ferait passer une regle absente. */
var titleBlock = (css.match(/\.sg-title\s*\{([\s\S]*?)\}/) || [])[1] || '';
if (!titleBlock) {
    problems.push('standalone-game.css : bloc .sg-title introuvable');
}
var titleDecl = titleBlock.replace(/\/\*[\s\S]*?\*\//g, '');

function declares(decl, prop) {
    /* `\n    min-width: 0;` : on exige le `:` de la declaration, absent du
       commentaire, et un separateur ( ; ou } ) juste apres la valeur. */
    var re = new RegExp('(^|[;{\\s])' + prop + '\\s*:\\s*[^;}]*[;}]', 'i');
    return re.test(decl);
}

[['min-width', '0'], ['overflow', 'hidden'],
 ['text-overflow', 'ellipsis'], ['white-space', 'nowrap']].forEach(function (pair) {
    if (!declares(titleDecl, pair[0])) {
        problems.push('standalone-game.css : .sg-title ne protege pas le titre ('
            + pair[0] + ': ' + pair[1] + ' manquant)');
    }
});

if (css.indexOf('.sg-header .btn-continue') === -1) {
    problems.push('standalone-game.css : regle compacte du bouton absente');
}

var verbose = process.argv.indexOf('--verbose') !== -1;

console.log('=== AUDIT BOUTON « CONTINUER » (en-tete) ===\n');
if (verbose) {
    console.log('jeu'.padEnd(24) + 'type'.padEnd(18)
        + 'fleche  aria  compact  header');
    rows.forEach(function (r) {
        console.log(
            r.jeu.padEnd(24) + r.type.padEnd(18) + r.fleche.padEnd(8)
            + r.aria.padEnd(6) + r.compact.padEnd(9) + r.header
        );
    });
    console.log('');
} else {
    var bad = rows.filter(function (r) {
        return r.fleche === 'NON' || r.aria === 'NON'
            || r.compact === 'NON' || r.header === 'NON';
    });
    console.log('Mini-jeux verifies  : ' + rows.length);
    console.log('Non conformes       : ' + bad.length);
    if (bad.length) {
        console.log('');
        bad.forEach(function (r) { console.log('  - ' + r.jeu); });
    }
    console.log('');
}

if (problems.length) {
    console.log('ECHEC - ' + problems.length + ' probleme(s) :');
    problems.forEach(function (p) { console.log('  - ' + p); });
    process.exit(1);
}

console.log('OK - aucun chevauchement possible : fleche compacte dans le flux '
    + 'flex de l en-tete, titre protege par ellipsis.');

['min-width: 0', 'text-overflow: ellipsis', 'white-space: nowrap'].forEach(function (rule) {
    if (css.indexOf(rule) === -1) {
        problems.push('standalone-game.css : protection du titre manquante (' + rule + ')');
    }
});
if (css.indexOf('.sg-header .btn-continue') === -1) {
    problems.push('standalone-game.css : regle compacte du bouton absente');
}
