/* Test navigateur du bouton « Recommencer le jeu » du menu des parametres.
   Le bouton etait un no-op : onRestart cherchait `#restart-btn` — absent du
   HTML — puis `window.restartStory`, qui n'a jamais ete defini. Le panneau se
   fermait, rien ne se passait.

   Ce test ouvre le hub, ouvre le panneau des parametres (⚙), clique
   « Recommencer le jeu », et verifie que l'etat est bien reinitialise :
   sauvegarde effacee, et l'ecran de jeu referme au profit du selecteur de
   theme (c'est ce que fait le vrai gestionnaire de relance).

   Usage : node tools/test-restart-button.js            */
'use strict';

var path = require('path');
var express = require('express');
var puppeteer = require('puppeteer');

var HUB = '/true-detective/index.html?standalone=1';

/* Cles reellement lues/ecrites par l'application :
   - trueDetectiveState / trueDetectiveSession : narrativeEngine.js
     (STORAGE_KEY / SESSION_KEY, effacees par resetGame)
   - td_standalone_game_* : points de reprise des mini-jeux (app.js)
   Les preferences audio (trueDetectiveAudio) sont exclues : elles doivent
   survivre a une relance de partie. */
var SAVE_KEYS = [
    'trueDetectiveState', 'trueDetectiveSession',
    'td_standalone_game_result', 'td_standalone_game_return',
    'td_standalone_game_config', 'td_echecs_duel_return',
    'td_marginal_tower_return'
];

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
    var page = await browser.newPage();
    var pageErrors = [];
    page.on('pageerror', function (e) { pageErrors.push(e.message); });

    try {
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(origin + HUB, { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(function (r) { setTimeout(r, 800); });

        /* 1. L'API de relance doit exister : c'est elle que le menu appelle. */
        var hasApi = await page.evaluate(function () {
            return !!(window.TDStory && typeof window.TDStory.restart === 'function');
        });
        console.log('API window.TDStory.restart presente : ' + (hasApi ? 'oui' : 'NON'));
        if (!hasApi) {
            failures.push('window.TDStory.restart absent : le menu ne peut rien appeler');
        }

        /* 2. Semer une sauvegarde, pour verifier qu'elle est effacee. */
        await page.evaluate(function (keys) {
            keys.forEach(function (k) {
                localStorage.setItem(k, JSON.stringify({ fake: true, ts: Date.now() }));
            });
        }, SAVE_KEYS);

        /* 3. Ouvrir le menu des parametres (le ⚙ monte par settings-menu.js)
           et cliquer « Recommencer le jeu ». */
        var clicked = await page.evaluate(async function () {
            var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
            var gear = document.querySelector('.dp-settings-btn');
            if (!gear) return { erreur: 'bouton des parametres (⚙) introuvable' };
            gear.click();
            await sleep(300);
            var btn = Array.prototype.slice.call(
                document.querySelectorAll('.dp-setting-btn'))
                .filter(function (b) { return /recommencer/i.test(b.textContent || ''); })[0];
            if (!btn) {
                return {
                    erreur: 'bouton « Recommencer le jeu » introuvable dans le panneau',
                    boutons: Array.prototype.slice.call(
                        document.querySelectorAll('.dp-setting-btn'))
                        .map(function (b) { return (b.textContent || '').trim(); })
                };
            }
            btn.click();
            await sleep(400);
            return { ok: true };
        });

        if (clicked.erreur) {
            failures.push(clicked.erreur
                + (clicked.boutons ? ' (trouve : ' + clicked.boutons.join(' | ') + ')' : ''));
        } else {
            console.log('Bouton « Recommencer le jeu » clique : oui');
        }

        /* 4. Verifier l'effet : sauvegarde effacee, ecran de jeu referme. */
        var after = await page.evaluate(function (keys) {
            var remaining = keys.filter(function (k) { return localStorage.getItem(k); });
            function active() {
                return Array.prototype.slice.call(document.querySelectorAll('.screen.active'))
                    .map(function (s) { return s.id; });
            }
            return { remaining: remaining, active: active() };
        }, SAVE_KEYS);

        console.log('Cles de sauvegarde restantes : '
            + (after.remaining.length ? after.remaining.join(', ') : 'aucune'));
        console.log('Ecrans actifs : ' + (after.active.join(', ') || 'aucun'));

        if (after.remaining.length) {
            failures.push('la sauvegarde n a pas ete effacee : '
                + after.remaining.join(', '));
        }
        if (after.active.indexOf('game-screen') >= 0) {
            failures.push('l ecran de jeu est toujours actif apres relance');
        }
        if (!after.active.length) {
            failures.push('aucun ecran actif apres relance : l interface est cassee');
        }

        if (pageErrors.length) {
            failures.push('erreurs JS : ' + pageErrors.join(' | '));
        }
    } catch (e) {
        failures.push(e.message);
    } finally {
        await browser.close();
        server.close();
    }

    if (failures.length) {
        console.log('\nECHEC - ' + failures.length + ' probleme(s) :');
        failures.forEach(function (f) { console.log('  - ' + f); });
        process.exit(1);
    }
    console.log('\nOK - « Recommencer le jeu » reinitialise bien la partie.');
})();
