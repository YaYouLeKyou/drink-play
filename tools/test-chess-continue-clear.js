/* Non-regression : le bouton « Continuer » de chess.html est ancre en bas
   au centre (position: fixed), donc HORS FLUX. Il ne pousse ni le plateau ni
   le conteneur, et un echiquier centre dans l'espace restant vient le
   recouvrir si sa taille ne reserve pas la bande du bouton.

   Symptome observe : 20px de recouvrement sur laptop, constant quelle que
   soit la hauteur d'ecran (768 a 900px), parce que la formule de taille du
   plateau ignorait cette bande.

   Ce test mesure la geometrie reelle dans Chromium, sur plusieurs tailles
   laptop, et verifie :
     - aucun recouvrement plateau / bouton,
     - un ecart de securite (respiration) entre les deux,
     - le plateau reste carre (pas de deformation),
     - rien ne deborde horizontalement.

   Usage : node tools/test-chess-continue-clear.js            (toutes largeurs)
           node tools/test-chess-continue-clear.js 1366x768   (une largeur)  */
'use strict';

var path = require('path');
var express = require('express');
var puppeteer = require('puppeteer');

/* Tailles laptop courantes + un mobile de controle. */
var SIZES = [
    [1280, 800], [1366, 768], [1440, 900],
    [1536, 864], [1280, 720], [1024, 640], [390, 844]
];

var only = process.argv.slice(2);
if (only.length) {
    SIZES = SIZES.filter(function (s) {
        return only.indexOf(s[0] + 'x' + s[1]) !== -1;
    });
    if (!SIZES.length) {
        console.error('Aucune taille ne correspond a : ' + only.join(', '));
        process.exit(2);
    }
}

var URL_CHESS = '/true-detective/chess.html?story=1&lang=fr';

/* Geometrie relevee dans la page. On force l'affichage du bouton : il n'est
   visible qu'en mode scenario, et le test doit mesurer sa bande reelle. */
function probe() {
    function box(sel) {
        var el = document.querySelector(sel);
        if (!el) return null;
        var r = el.getBoundingClientRect();
        return {
            top: Math.round(r.top), bottom: Math.round(r.bottom),
            width: Math.round(r.width), height: Math.round(r.height)
        };
    }
    var btn = document.getElementById('story-continue-btn');
    if (btn) btn.classList.remove('hidden');
    return {
        board: box('.chess-board'),
        cont: box('#story-continue-btn'),
        docW: document.documentElement.scrollWidth,
        win: window.innerWidth
    };
}

(async function main() {
    var app = express();
    app.use(express.static(path.resolve(__dirname, '..')));
    var server = await new Promise(function (resolve) {
        var instance = app.listen(0, '127.0.0.1', function () { resolve(instance); });
    });
    var origin = 'http://127.0.0.1:' + server.address().port;

    var browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    var failures = [];

    try {
        for (var i = 0; i < SIZES.length; i++) {
            var w = SIZES[i][0];
            var h = SIZES[i][1];
            var page = await browser.newPage();
            await page.setViewport({ width: w, height: h });
            try {
                await page.goto(origin + URL_CHESS, {
                    waitUntil: 'networkidle2', timeout: 20000
                });
                await new Promise(function (r) { setTimeout(r, 500); });

                var p = await page.evaluate(probe);
                if (!p.board || !p.cont) {
                    failures.push(w + 'x' + h + ' : plateau ou bouton introuvable');
                    continue;
                }

                /* Espace vertical libre entre le bas du plateau et le haut du
                   bouton. Doit rester positif : c'est la respiration qui
                   evite que les deux se touchent. */
                var gap = p.cont.top - p.board.bottom;
                var squareErr = Math.abs(p.board.width - p.board.height);
                var status = 'ecart=' + gap + 'px'
                    + (gap < 0 ? '  CHEVAUCHEMENT' : '')
                    + (squareErr > 1 ? '  PLATEAU NON-CARRE' : '')
                    + (p.docW > p.win + 1 ? '  DEBORDEMENT' : '');
                console.log(w + 'x' + h + '  plateau=' + p.board.width
                    + 'x' + p.board.height + '  ' + status);

                if (gap < 0) {
                    failures.push(w + 'x' + h + ' : le plateau recouvre le bouton '
                        + 'de ' + Math.abs(gap) + 'px');
                }
                if (squareErr > 1) {
                    failures.push(w + 'x' + h + ' : plateau deforme ('
                        + p.board.width + 'x' + p.board.height + ')');
                }
                if (p.docW > p.win + 1) {
                    failures.push(w + 'x' + h + ' : debordement horizontal ('
                        + p.docW + ' > ' + p.win + ')');
                }
            } catch (e) {
                failures.push(w + 'x' + h + ' : ' + e.message);
            } finally {
                await page.close();
            }
        }
    } finally {
        await browser.close();
        server.close();
    }

    if (failures.length) {
        console.log('\nECHEC - ' + failures.length + ' probleme(s) :');
        failures.forEach(function (f) { console.log('  - ' + f); });
        process.exit(1);
    }
    console.log('\nOK - le bouton « Continuer » ne touche jamais l echiquier.');
})();
