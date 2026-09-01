/* =====================================================================
   TRUE DETECTIVE — MINI-JEUX OPTIONNELS (bonus d'indices + timer)
   ---------------------------------------------------------------------
   Chaque mini-jeu est OPTIONNEL : le joueur peut toujours « Passer ».
   Le timer crée la pression ; un échec = perte de l'indice bonus,
   jamais de game over. Mobile-friendly (clic).
===================================================================== */
(function (global) {
    'use strict';

    var t = function (obj, lang) { return obj[lang] || obj.fr || obj.en || ''; };

    /* Calcule les messages / boutons partagés */
    function play(cfg, lang, onDone) {
        if (!cfg) { if (onDone) onDone({ won: false }); return; }
        var layer = document.getElementById('minigame-layer');
        if (!layer) { if (onDone) onDone({ won: false }); return; }

        layer.innerHTML = '';
        layer.classList.add('active');

        var content = document.createElement('div');
        content.className = 'minigame-content';
        layer.appendChild(content);

        var title = document.createElement('div');
        title.className = 'minigame-title';
        title.textContent = cfg.title ? t(cfg.title, lang) : 'Mini-jeu';
        content.appendChild(title);

        if (cfg.desc) {
            var desc = document.createElement('div');
            desc.className = 'minigame-desc';
            desc.textContent = t(cfg.desc, lang);
            content.appendChild(desc);
        }

        var timeLeft = (typeof cfg.time === 'number') ? cfg.time : 30;
        var maxTime = Math.max(timeLeft, 1);
        var timerId = null;
        var resultAnnounced = false;

        function finish(won) {
            if (resultAnnounced) return;
            resultAnnounced = true;
            if (timerId) clearInterval(timerId);
            if (won) cfg.bonusIndex = (cfg.bonusIndex || 1);
            var btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            btn.textContent = won
                ? (lang === 'fr' ? 'Indice obtenu !' : 'Clue obtained !')
                : (lang === 'fr' ? 'Continuer' : 'Continue');
            btn.addEventListener('click', function () {
                layer.classList.remove('active');
                layer.innerHTML = '';
                if (onDone) onDone({ won: won });
            });
            content.appendChild(btn);
        }

        /* Timer avec barre de pression */
        function startTimer() {
            if (!timeLeft || timeLeft <= 0) return;
            var bar = document.createElement('div');
            bar.className = 'minigame-timer';
            bar.innerHTML = '<div class="timer-fill"></div><span class="timer-text"></span>';
            content.appendChild(bar);
            var fill = bar.querySelector('.timer-fill');
            var timerSpan = bar.querySelector('.timer-text');
            timerId = setInterval(function () {
                timeLeft -= 0.1;
                if (timeLeft <= 0) {
                    timeLeft = 0;
                    if (timerId) clearInterval(timerId);
                    fill.style.width = '0%';
                    timerSpan.textContent = '0s';
                    finish(false);
                    return;
                }
                fill.style.width = Math.max(0, (timeLeft / maxTime) * 100) + '%';
                timerSpan.textContent = Math.ceil(timeLeft) + 's';
            }, 100);
        }

        /* Fabriques de jeux */
        var creators = BUILD_CREATORS(cfg, lang, finish);

        var factory = creators[cfg.type];
        var body = document.createElement('div');
        body.className = 'minigame-body';
        content.appendChild(body);
        if (factory) {
            factory(body);
        } else {
            finish(true);
        }

        /* Bouton « Passer » (optionnel) */
        if (cfg.type !== 'code_safe') {
            var skip = document.createElement('button');
            skip.className = 'btn btn-skip minigame-skip';
            skip.textContent = lang === 'fr' ? 'Passer' : 'Skip';
            skip.addEventListener('click', function () { finish(false); });
            content.appendChild(skip);
        }

        startTimer();
    }

    /* ------------------------------------------------------------------
       BUILD_CREATORS — contient les fabriques de jeux
    ------------------------------------------------------------------ */
    function BUILD_CREATORS(cfg, lang, complete) {

    return {
'scene_fouille': function (body) {
            var spots = (cfg.hotspots || []).map(function (h) { return t(h, lang); });
            var found = 0;
            var needed = spots.length;
            var box = document.createElement('div');
            box.className = 'fouille-box';
            body.appendChild(box);
            spots.forEach(function (label, i) {
                var spot = document.createElement('button');
                spot.className = 'fouille-spot';
                spot.style.left = (12 + i * 26) + '%';
                spot.style.top = (18 + (i % 3) * 24) + '%';
                spot.textContent = '?';
                spot.addEventListener('click', function () {
                    if (spot.dataset.done) return;
                    spot.dataset.done = '1';
                    spot.textContent = '✓';
                    spot.classList.add('found');
                    found++;
                    if (found >= needed) complete(true);
                });
                box.appendChild(spot);
            });
        },

        'timeline': function (body) {
            var order = (cfg.order || []).map(function (s) { return t(s, lang); });
            var currentIndex = 0;
            var stepsBox = document.createElement('div');
            stepsBox.className = 'timeline-box';
            body.appendChild(stepsBox);
            var shuffled = order.slice().sort(function () { return Math.random() - 0.5; });
            shuffled.forEach(function (label) {
                var b = document.createElement('button');
                b.className = 'btn timeline-step';
                b.textContent = label;
                b.addEventListener('click', function () {
                    if (b.dataset.done) return;
                    if (label === order[currentIndex]) {
                        b.dataset.done = '1';
                        b.classList.add('correct');
                        currentIndex++;
                        if (currentIndex >= order.length) complete(true);
                    } else {
                        b.classList.add('wrong');
                        setTimeout(function () { b.classList.remove('wrong'); }, 400);
                    }
                });
                stepsBox.appendChild(b);
            });
        },

        'adn_match': function (body) {
            var samples = (cfg.samples || []).map(function (s) { return t(s, lang); });
            var profiles = (cfg.profiles || []).map(function (p) { return t(p, lang); });
            var match = cfg.match;
            var col = document.createElement('div');
            col.className = 'match-col';
            body.appendChild(col);
            var colA = document.createElement('div');
            colA.className = 'match-side';
            var colB = document.createElement('div');
            colB.className = 'match-side';
            col.appendChild(colA); col.appendChild(colB);
            var selSample = null;
            samples.forEach(function (label, i) {
                var b = document.createElement('button');
                b.className = 'btn match-item sample';
                b.textContent = label;
                b.addEventListener('click', function () {
                    colA.querySelectorAll('.sample').forEach(function (x) { x.classList.remove('selected'); });
                    b.classList.add('selected');
                    selSample = i;
                });
                colA.appendChild(b);
            });
            profiles.forEach(function (label, i) {
                var b = document.createElement('button');
                b.className = 'btn match-item profile';
                b.textContent = label;
                b.addEventListener('click', function () {
                    if (selSample == null) return;
                    if (i === match) {
                        b.classList.add('correct');
                        b.dataset.done = '1';
                        complete(true);
                    } else {
                        b.classList.add('wrong');
                        setTimeout(function () { b.classList.remove('wrong'); }, 400);
                    }
                });
                colB.appendChild(b);
            });
        },

        'code_safe': function (body) {
            var answer = String(cfg.answer || '120');
            var input = '';
            var padBtn = document.createElement('input');
            padBtn.className = 'safe-input';
            padBtn.readOnly = true;
            body.appendChild(padBtn);
            var pad = document.createElement('div');
            pad.className = 'num-pad';
            body.appendChild(pad);
            ['1','2','3','4','5','6','7','8','9'].forEach(function (k) {
                var b = document.createElement('button');
                b.className = 'btn num-key';
                b.textContent = k;
                b.addEventListener('click', function () {
                    if (input.length >= answer.length) return;
                    input += k;
                    padBtn.value = input;
                    if (input.length === answer.length) {
                        if (input === answer) { padBtn.classList.add('correct'); complete(true); }
                        else { padBtn.classList.add('wrong'); setTimeout(function () { padBtn.classList.remove('wrong'); padBtn.value = ''; input = ''; }, 500); }
                    }
                });
                pad.appendChild(b);
            });
            var del = document.createElement('button');
            del.className = 'btn num-key del';
            del.textContent = '⌫';
            del.addEventListener('click', function () { input = input.slice(0, -1); padBtn.value = input; });
            pad.appendChild(del);
        },
'sabotage': function (body) {
            var parts = (cfg.parts || []).map(function (p) { return t(p, lang); });
            var badIndex = cfg.badIndex || 0;
            var grid = document.createElement('div');
            grid.className = 'parts-grid';
            body.appendChild(grid);
            parts.forEach(function (label, i) {
                var b = document.createElement('button');
                b.className = 'btn part-item';
                b.textContent = label;
                b.addEventListener('click', function () {
                    if (i === badIndex) { b.classList.add('correct'); complete(true); }
                    else { b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 400); }
                });
                grid.appendChild(b);
            });
        },

        'pression': function (body) {
            var order = (cfg.order || []).map(function (s) { return t(s, lang); });
            var currentIndex = 0;
            var box = document.createElement('div');
            box.className = 'pression-box';
            body.appendChild(box);
            order.slice().sort(function () { return Math.random() - 0.5; }).forEach(function (label) {
                var b = document.createElement('button');
                b.className = 'btn pression-item';
                b.textContent = label;
                b.addEventListener('click', function () {
                    if (b.dataset.done) return;
                    if (label === order[currentIndex]) {
                        b.dataset.done = '1';
                        b.classList.add('correct');
                        currentIndex++;
                        if (currentIndex >= order.length) complete(true);
                    } else {
                        b.classList.add('wrong');
                        setTimeout(function () { b.classList.remove('wrong'); }, 400);
                    }
                });
                box.appendChild(b);
            });
        },
    };
    } /* fin BUILD_CREATORS */

    global.TDMiniGames = { play: play };

}(typeof globalThis !== 'undefined' ? globalThis : this));