/* Mise en page d'asteroids en mode scénario (barre de dialogue à gauche).
   story-chrome.js insère la barre (#td-sc-bar) comme premier enfant de
   .sg-main, qui est une colonne : la barre s'étalait donc sur toute la
   largeur AU-DESSUS du jeu, le repoussait vers le bas et le sortait de
   l'écran — le jeu était inutilisable au démarrage sur les univers à barre
   de dialogue (dont cyberpunk).

   Correctif : à partir de 900px, la barre devient une colonne fixe à gauche
   et le jeu se décale à droite (même approche que pacman.html).

   Ce test mesure la géométrie réelle dans Chromium et vérifie que la barre
   est à gauche du jeu, sans recouvrement, sur les trois univers et autour
   du seuil de 900px.

   Usage : node tools/test-asteroids-talkbox.js            */
'use strict';

var path = require('path');
var express = require('express');
var puppeteer = require('puppeteer');

var THEMES = ['cyberpunk', 'classic', 'noire'];

/* Largeurs autour du basculement 900px, plus deux cas de reference. */
var SIZES = [
    [390, 844],   // mobile : disposition verticale d'origine
    [768, 1024],  // tablette
    [899, 800],   // juste sous le seuil
    [900, 800],   // juste au-dessus du seuil
    [1280, 800],  // laptop
    [1440, 900]   // desktop
];

var URL_AST = '/true-detective/asteroids.html?story=1&lang=fr&theme=';

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
        for (var t = 0; t < THEMES.length; t++) {
            var theme = THEMES[t];
            for (var s = 0; s < SIZES.length; s++) {
                var w = SIZES[s][0];
                var h = SIZES[s][1];
                /* La colonne fixe n'existe qu'a partir de 900px : c'est
                   en dessous que la disposition verticale est attendue. */
                var sideBySide = w >= 900;

                var page = await browser.newPage();
                var pageErrors = [];
                page.on('pageerror', function (e) { pageErrors.push(e.message); });

                await page.setViewport({ width: w, height: h });
                try {
                    await page.goto(origin + URL_AST + theme, {
                        waitUntil: 'networkidle2', timeout: 20000
                    });
                    await new Promise(function (r) { setTimeout(r, 700); });

                    var p = await page.evaluate(function () {
                        function box(sel) {
                            var el = document.querySelector(sel);
                            if (!el) return null;
                            var r = el.getBoundingClientRect();
                            return {
                                left: Math.round(r.left), right: Math.round(r.right),
                                top: Math.round(r.top), bottom: Math.round(r.bottom)
                            };
                        }
                        return {
                            bar: box('#td-sc-bar'),
                            canvas: box('#asteroids-canvas'),
                            vh: window.innerHeight,
                            docW: document.documentElement.scrollWidth
                        };
                    });


                    if (!p.bar || !p.canvas) {
                        failures.push(theme + ' @' + w + ' : barre ou canvas introuvable');
                        continue;
                    }

                    /* Recouvrement horizontal : la barre et le jeu
                       occupent-ils la meme bande verticale ? */
                    var overlap = Math.min(p.bar.right, p.canvas.right)
                        - Math.max(p.bar.left, p.canvas.left);
                    var overlaps = overlap > 1;
                    var canvasVisible = p.canvas.top >= 0 && p.canvas.bottom <= p.vh;
                    var overflow = p.docW > w + 1;

                    /* En colonne (>=900px), la barre doit etre a GAUCHE :
                       son bord droit precede le bord gauche du jeu. */
                    var barOnLeft = sideBySide ? p.bar.right <= p.canvas.left : true;
                    /* En dessous, on conserve la disposition d'origine : la
                       barre est au-dessus et ne doit pas recouvrir le jeu. */
                    var stackedOk = sideBySide ? true
                        : (p.bar.bottom <= p.canvas.top);

                    var status = (sideBySide ? 'colonne ' : 'empile  ')
                        + 'overlapH=' + overlap
                        + (overlaps && sideBySide ? '  CHEVAUCHEMENT' : '')
                        + (canvasVisible ? '' : '  CANVAS HORS ECRAN')
                        + (barOnLeft ? '' : '  BARRE PAS A GAUCHE')
                        + (stackedOk ? '' : '  BARRE CHEVAUCHE LE JEU')
                        + (overflow ? '  DEBORDEMENT' : '');

                    console.log(theme.padEnd(10) + w + 'x' + h + '  ' + status);

                    if (sideBySide) {
                        if (overlaps) {
                            failures.push(theme + ' @' + w + ' : la barre de dialogue '
                                + 'recouvre le jeu de ' + overlap + 'px');
                        }
                        if (!barOnLeft) {
                            failures.push(theme + ' @' + w + ' : la barre de dialogue '
                                + 'n est pas a gauche du jeu');
                        }
                    } else if (!stackedOk) {
                        failures.push(theme + ' @' + w + ' : en disposition empilee, '
                            + 'la barre et le jeu se recouvrent');
                    }
                    if (!canvasVisible) {
                        failures.push(theme + ' @' + w + ' : le canvas deborde de la fenetre ('
                            + p.canvas.top + '->' + p.canvas.bottom + ' pour ' + p.vh + ')');
                    }
                    if (overflow) {
                        failures.push(theme + ' @' + w + ' : debordement horizontal ('
                            + p.docW + ' > ' + w + ')');
                    }
                    if (pageErrors.length) {
                        failures.push(theme + ' @' + w + ' : erreurs JS - '
                            + pageErrors.join(' | '));
                    }
                } catch (e) {
                    failures.push(theme + ' @' + w + ' : ' + e.message);
                } finally {
                    await page.close();
                }
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
    console.log('\nOK - la barre de dialogue est a gauche du jeu, '
        + 'qui reste entierement visible.');
})();
