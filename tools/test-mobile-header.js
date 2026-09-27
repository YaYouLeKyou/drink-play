/* Test de mise en page REEL sur viewport mobile.
   L'audit statique (audit-continue-btn.js) verifie le balisage ; ce script
   va plus loin : il ouvre chaque mini-jeu dans Chromium a des largeurs
   d'ecran typiques de mobile (360 / 390 / 430 px) et verifie qu'aucun
   chevauchement reel n'existe entre :
     - le titre de l'en-tete,
     - le bouton « Continuer » (→),
     - la roue des parametres (⚙),
     - le bouton hamburger (☰) et le bouton Retour.
   Il verifie aussi que rien ne deborde horizontalement de la fenetre.

   Prerequis : aucun. Le script monte son propre serveur express statique
   sur un port libre, comme les autres tests de tools/.

   Usage : node tools/test-mobile-header.js            (tous les jeux)
           node tools/test-mobile-header.js sudoku     (un seul jeu)   */
'use strict';

var path = require('path');
var express = require('express');
var puppeteer = require('puppeteer');

var WIDTHS = [360, 390, 430];

/* Mini-jeux dont l'en-tete contient le bouton « Continuer ». */
var GAMES = [
    'asteroids.html', 'bataille-navale.html', 'breakout.html',
    'chemistry.html', 'coffre-code.html', 'connect4.html',
    'jackpot.html', 'marginal-tower.html', 'memory.html',
    'missile-command.html', 'pacman.html', 'pong.html',
    'puzzle.html', 'shooting.html', 'space-invaders.html', 'sudoku.html'
];

/* ?story=1 force le mode scenario : c'est lui qui affiche le bouton
   « Continuer » (et masque le bouton Retour). */
var QUERY = '?story=1&lang=fr';

var only = process.argv.slice(2);
if (only.length) {
    /* Accepte `sudoku` comme `sudoku.html`. */
    GAMES = GAMES.filter(function (g) {
        var base = g.replace(/\.html$/, '');
        return only.indexOf(g) !== -1 || only.indexOf(base) !== -1;
    });
    if (!GAMES.length) {
        console.error('Aucun jeu ne correspond a : ' + only.join(', '));
        process.exit(2);
    }
}

if (!only.length) {
    console.log('Verification en cours de ' + GAMES.length + ' mini-jeux sur '
        + WIDTHS.join(' / ') + ' px de large ...\n');
}

/* Rectangle du header + de ses enfants, releve dans la page. */
function probe() {
    var header = document.querySelector('.sg-header, .tower-header');
    if (!header) return { error: 'aucun en-tete' };

    var hb = header.getBoundingClientRect();
    var title = header.querySelector('.sg-title, .tower-title');
    var cont = header.querySelector('#story-continue-btn');
    var gear = header.querySelector('.dp-settings-btn, .td-sc-settings-btn');
    var burger = header.querySelector('.sg-hamburger');
    var back = header.querySelector('#back-to-minigame-btn');

    function box(el) {
        if (!el) return null;
        var r = el.getBoundingClientRect();
        /* Un element masque (display:none) ou non rendu n'a pas sa place
           dans l'en-tete : il ne peut pas chevaucher quoi que ce soit. */
        if (r.width === 0 && r.height === 0) return null;
        var cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return null;
        return {
            left: r.left, right: r.right, top: r.top, bottom: r.bottom,
            w: Math.round(r.width), h: Math.round(r.height)
        };
    }

    return {
        headerWidth: Math.round(hb.width),
        /* Le debordement horizontal se mesure sur le document entier. */
        docScrollW: document.documentElement.scrollWidth,
        winW: window.innerWidth,
        titleText: title ? title.textContent.trim() : null,
        titleClipped: title ? (title.scrollWidth > title.clientWidth + 1) : null,
        title: box(title),
        cont: box(cont),
        contText: cont ? cont.textContent.trim() : null,
        gear: box(gear),
        burger: box(burger),
        back: box(back)
    };
}

function overlaps(a, b) {
    if (!a || !b) return false;
    var ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    var iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    /* 1px de tolerance : les arrondis sub-pixel des bounding boxes
       peuvent faire deborder d'un cheveu deux boites adjacentes. */
    return ix > 1 && iy > 1;
}


function launch() {
    return puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
}

/* Paires de boites qui ne doivent JAMAIS se recouvrir dans l'en-tete. */
var PAIRS = [
    ['titre', 'continuer'],
    ['titre', 'reglages'],
    ['continuer', 'reglages'],
    ['continuer', 'retour'],
    ['hamburger', 'titre'],
    ['retour', 'reglages']
];

function checkOne(p, game, width, failures) {
    /* 1. aucun chevauchement entre les controles de l'en-tete */
    for (var k = 0; k < PAIRS.length; k++) {
        var a = p[PAIRS[k][0]];
        var b = p[PAIRS[k][1]];
        if (overlaps(a, b)) {
            failures.push(game + ' @' + width + ' : '
                + PAIRS[k][0] + ' chevauche ' + PAIRS[k][1]);
        }
    }

    /* 2. rien ne deborde de la fenetre */
    if (p.docScrollW > p.winW + 1) {
        failures.push(game + ' @' + width + ' : debordement horizontal ('
            + p.docScrollW + ' > ' + p.winW + ')');
    }

    /* 3. la fleche « → » est bien presente, carree, et dans l'en-tete */
    if (p.cont) {
        if (p.contText !== '\u2192') {
            failures.push(game + ' @' + width + ' : contenu du bouton = "'
                + p.contText + '" au lieu de la fleche');
        }
        if (p.cont.w > 90 || p.cont.h > 90) {
            failures.push(game + ' @' + width + ' : bouton non compact ('
                + p.cont.w + 'x' + p.cont.h + ')');
        }
    }
}

(async function main() {
    var app = express();
    app.use(express.static(path.resolve(__dirname, '..')));
    var server = await new Promise(function (resolve) {
        var instance = app.listen(0, '127.0.0.1', function () { resolve(instance); });
    });
    var origin = 'http://127.0.0.1:' + server.address().port;

    var browser = await launch();
    var failures = [];
    var checked = 0;

    try {
        for (var i = 0; i < GAMES.length; i++) {
            var game = GAMES[i];
            for (var w = 0; w < WIDTHS.length; w++) {
                var width = WIDTHS[w];
                var page = await browser.newPage();
                await page.setViewport({ width: width, height: 740 });
                try {
                    await page.goto(origin + '/true-detective/' + game + QUERY, {
                        waitUntil: 'networkidle2',
                        timeout: 20000
                    });
                    /* Laisse story-chrome.js / settings-menu.js monter le ⚙
                       et poser leurs styles avant de mesurer. */
                    await new Promise(function (r) { setTimeout(r, 450); });

                    var p = await page.evaluate(probe);
                    checked++;

                    if (p.error) {
                        failures.push(game + ' @' + width + ' : ' + p.error);
                        break;
                    }

                    checkOne(p, game, width, failures);

                    if (only.length) {
                        console.log(game + ' @' + width + 'px  '
                            + 'titre=' + JSON.stringify(p.titleText)
                            + (p.titleClipped ? ' (tronque)' : '')
                            + '  continuer=' + (p.cont
                                ? p.cont.w + 'x' + p.cont.h : 'absent')
                            + '  scroll=' + p.docScrollW + '/' + p.winW);
                    }
                } catch (e) {
                    failures.push(game + ' @' + width + ' : ' + e.message);
                } finally {
                    await page.close();
                }
            }
        }
    } finally {
        await browser.close();
        server.close();
    }

    console.log('\nConfigurations mesurees : ' + checked);
    if (failures.length) {
        console.log('\nECHEC - ' + failures.length + ' probleme(s) :');
        failures.forEach(function (f) { console.log('  - ' + f); });
        process.exit(1);
    }
    console.log('\nOK - aucun chevauchement ni debordement sur '
        + WIDTHS.join(' / ') + ' px.');
})();

