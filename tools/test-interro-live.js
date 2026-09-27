/* Verification REELLE dans Chromium de la regle d'exclusion mutuelle.
   contrairement au test statique (test-interrogation-buttons.js), celui-ci
   mesure la geometrie effective : il reproduit un etat d'interrogatoire
   credible, puis declenche le mecanisme qui re-affiche « Continuer »
   (updateContinueBtnVisibility, appele par une quarantaine d'endroits) et
   verifie que le bouton ne réapparait pas malgre tout.

   C'est precisement ce mecanisme qui faisait revenir le chevauchement apres
   le masquage pose par scrShowInterroAskButton.

   Usage : node tools/test-interro-live.js [largeur ...]   (defaut : 390 1280) */
'use strict';

var path = require('path');
var express = require('express');
var puppeteer = require('puppeteer');

var WIDTHS = process.argv.slice(2).map(Number).filter(function (n) { return n > 0; });
if (!WIDTHS.length) WIDTHS = [390, 1280];

var HUB = '/true-detective/index.html?standalone=1';

function probe() {
    function box(sel) {
        var el = document.querySelector(sel);
        if (!el) return null;
        var cs = getComputedStyle(el);
        var r = el.getBoundingClientRect();
        var shown = cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0;
        return {
            shown: shown,
            top: Math.round(r.top), bottom: Math.round(r.bottom),
            left: Math.round(r.left), right: Math.round(r.right)
        };
    }
    return {
        ask: box('#game-screen .interrogation-ask'),
        cont: box('#continue-btn'),
        mobileCont: box('#mobile-continue-btn')
    };
}

/* Reproduit l'etat « le jeu propose Interroger », puis appelle le
   mecanisme de reaffichage global. Si la regle est bonne, « Continuer »
   reste masque meme apres. */
async function scenario(page) {
    return page.evaluate(async function () {
        var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
        var out = { etapes: [] };

        function read(label) {
            function box(sel) {
                var el = document.querySelector(sel);
                if (!el) return { shown: false };
                var cs = getComputedStyle(el);
                var r = el.getBoundingClientRect();
                return {
                    shown: cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0,
                    top: Math.round(r.top), bottom: Math.round(r.bottom)
                };
            }
            out.etapes.push({
                label: label,
                ask: box('#game-screen .interrogation-ask').shown,
                cont: box('#continue-btn').shown,
                mobile: box('#mobile-continue-btn').shown
            });
        }

        /* 1. Reproduire l'etat : bouton « Interroger » present, et
           « Continuer » Visible (comme le ferait l'ancien code). */
        var choices = document.getElementById('choices-container');
        var cont = document.getElementById('continue-btn');
        if (!choices || !cont) {
            out.erreur = 'elements du jeu introuvables';
            return out;
        }
        cont.classList.remove('hidden');
        var ask = document.createElement('button');
        ask.className = 'btn btn-choice interrogation-ask';
        ask.textContent = 'Interroger';
        choices.appendChild(ask);
        read('avant-r reaffichage (etat fautif)');

        /* 2. Declencher le reaffichage global. Il est appele par le changement
           d'ecran, l'ouverture du carnet, etc. C'est lui qui faisait
           revenir « Continuer » malgre le masquage de l'interrogatoire.
           On passe par un evenement reel de l'application : le redimensionnement
           declenche les reevaluations de visibilite. */
        window.dispatchEvent(new Event('resize'));
        await sleep(150);
        read('apres-r reaffichage');

        /* 3. Verifier la tenue dans le temps, puis le controle inverse :
           sans bouton « Interroger », « Continuer » doit redevenir visible.
           La regle ne doit pas etre irreversible, sinon la partie
           deviendrait injouable en fin d'interrogatoire. */
        await sleep(300);
        read('final');

        var ask = document.querySelector('#game-screen .interrogation-ask');
        if (ask && ask.parentNode) ask.parentNode.removeChild(ask);
        window.dispatchEvent(new Event('resize'));
        await sleep(150);
        read('sans-Interroger (controle)');

        return out;
    });
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
        for (var i = 0; i < WIDTHS.length; i++) {
            var width = WIDTHS[i];
            var page = await browser.newPage();
            await page.setViewport({ width: width, height: 800 });
            try {
                await page.goto(origin + HUB, {
                    waitUntil: 'networkidle2', timeout: 20000
                });
                await new Promise(function (r) { setTimeout(r, 600); });

                /* Rejoindre l'ecran de jeu : Commencer -> mode Solo -> theme.
                   Sans cela #game-screen n'est pas actif et la regle ne peut
                   pas s'appliquer. */
                await page.evaluate(function () {
                    var s = document.getElementById('start-btn');
                    if (s) s.click();
                });
                await new Promise(function (r) { setTimeout(r, 600); });
                await page.evaluate(function () {
                    var s = document.getElementById('solo-game-btn');
                    if (s) s.click();
                });
                await new Promise(function (r) { setTimeout(r, 1000); });
                await page.evaluate(function () {
                    var t = document.querySelector('.theme-card, [data-theme-id]');
                    if (t) t.click();
                });
                await new Promise(function (r) { setTimeout(r, 700); });

                var res = await scenario(page);
                if (res.erreur) {
                    failures.push(width + 'px : ' + res.erreur);
                    continue;
                }

                console.log('--- ' + width + 'px ---');
                res.etapes.forEach(function (s) {
                    /* Un conflit n'a de sens que si « Interroger » est
                       present. Sans lui, « Continuer » visible est le
                       comportement attendu (fin d'interrogatoire). */
                    var conflit = s.ask && (s.cont || s.mobile);
                    var note = conflit ? '  <-- CONFLIT'
                        : (s.ask ? '' : '  (attendu)');
                    console.log('  ' + s.label.padEnd(34)
                        + ' Interroger=' + (s.ask ? 'oui' : 'non')
                        + '  Continuer=' + (s.cont ? 'oui' : 'non')
                        + (s.mobile ? '  Mobile=oui' : '') + note);
                    if (conflit) {
                        failures.push(width + 'px / ' + s.label
                            + ' : « Interroger » et « Continuer » affiches ensemble');
                    }
                });
                console.log('');

                /* Sans etat « Interroger », le test ne prouve rien. */
                if (!res.etapes.some(function (s) { return s.ask; })) {
                    failures.push(width + 'px : aucun etat avec « Interroger » visible');
                }

                /* Controle inverse : la regle ne doit pas etre irreversible.
                   Une fois « Interroger » retire, « Continuer » doit pouvoir
                   revenir — sinon la partie deviendrait injouable en fin
                   d'interrogatoire. */
                var back = res.etapes.filter(function (s) {
                    return s.label.indexOf('sans-Interroger') === 0;
                })[0];
                if (back && back.ask === false && back.cont === false
                    && back.mobile === false) {
                    failures.push(width + 'px : « Continuer » ne revient jamais apres '
                        + 'la fin de l interrogatoire (regle irreversible)');
                }
            } catch (e) {
                failures.push(width + 'px : ' + e.message);
            } finally {
                await page.close();
            }
        }
    } finally {
        await browser.close();
        server.close();
    }

    if (failures.length) {
        console.log('ECHEC - ' + failures.length + ' probleme(s) :');
        failures.forEach(function (f) { console.log('  - ' + f); });
        process.exit(1);
    }
    console.log('OK - « Continuer » reste absent tant que « Interroger » est present.');
})();

