(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var PHRASES = {
        fr: [
            "Tout s\u2019effondre eventuellement...",
            "Abattez les murs.",
            "La verite est fragile.",
            "Une brique a la fois.",
            "Nous nous approchons."
        ],
        en: [
            "Everything crumbles eventually...",
            "Break down the walls.",
            "The truth is fragile.",
            "One brick at a time.",
            "We\u2019re getting closer."
        ]
    };

    var TAUNTS = {
        fr: [
            "Vos briques tombent, inspecteur.",
            "Plus forte que vous ne le pensez.",
            "Le mur de la verite se fissure."
        ],
        en: [
            "Your bricks fall, inspector.",
            "Stronger than you think.",
            "The wall of truth cracks."
        ]
    };

    var PHRASE_TRIGGERS = [5, 10, 15, 20];

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId || 'seducteur');
        }
        return lang === 'fr' ? 'Julian Pembrooke' : 'Julian Pembrooke';
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'seducteur' || !npcId) {
            return lang === 'fr' ? 'Seducteur' : 'Charmer';
        }
        return '';
    }

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId || 'seducteur');
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = typeof window.getThemeId === 'function' ? window.getThemeId() : 'agatha-christie';
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            return assets && assets.seducteur;
        }
        return null;
    }

    function play(cfg, lang, onDone, target) {
        if (!cfg) { if (onDone) onDone({ won: false }); return; }

        var overlay = document.getElementById('minigame-overlay');
        var overlayContent = overlay ? overlay.querySelector('#minigame-screen-content') : null;
        if (overlay) overlay.classList.add('retro-layout');
        if (overlay) {
            var topbar = overlay.querySelector('.minigame-overlay-topbar');
            var bottombar = overlay.querySelector('.minigame-overlay-bottombar');
        }

        if (overlayContent) {
            overlayContent.innerHTML = '';
            target = overlayContent;
        } else if (!target) {
            var layer = document.getElementById('minigame-layer');
            if (!layer) { if (onDone) onDone({ won: false }); return; }
            layer.innerHTML = '';
            layer.classList.add('active');
            target = layer;
        }

        var interroId = cfg.interroId || 'seducteur';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);
        var dialogues = cfg.dialogues || [];
        var dialogueLines = dialogues.beforeSpin || (PHRASES[lang] || PHRASES.en);
        var tauntLines = dialogues.afterLose || (TAUNTS[lang] || TAUNTS.en);

        var wrap = document.createElement('div');
        wrap.className = 'retro-wrap';

        var canvas = document.createElement('canvas');
        canvas.width = Math.min(500, window.innerWidth - 40);
        canvas.height = Math.min(400, window.innerHeight - 200);
        wrap.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        var cw = canvas.width, ch = canvas.height;

        var score = 0;
        var ended = false;
        var bricksBroken = 0;
        var paddle = { x: cw / 2 - 40, y: ch - 30, w: 80, h: 12, speed: 6 };
        var ball = { x: cw / 2, y: ch - 45, vx: 4, vy: -4, r: 7 };
        var bricks = [];
        var keys = {};
        var colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff6600', '#00ff66'];
        var phraseTimeout = null;

        for (var row = 0; row < 5; row++) {
            for (var col = 0; col < 8; col++) {
                bricks.push({ x: 35 + col * ((cw - 70) / 8), y: 40 + row * 22, w: (cw - 70) / 8 - 4, h: 18, alive: true, color: colors[row] });
            }
        }

        var interroData = null;
        var interroState = null;
        var interroCompleted = false;
        var interroPause = false;
        var historyEl = null;
        var interroBoxEl = null;
        var dialogueTextEl = null;

        function createInterroSidebar() {
            var overlay = document.getElementById('minigame-overlay');
            if (overlay) overlay.classList.add('retro-layout');
            var sidePanel = document.getElementById('chess-side-panel');
            if (sidePanel) sidePanel.style.display = 'none';
            var leftPanel = document.getElementById('chess-left-panel');
            if (leftPanel) leftPanel.style.display = 'none';
            var imgSrc = getNpcImage(interroId);
            var charImg = document.getElementById('chess-character-image');
            if (charImg && imgSrc) {
                charImg.src = imgSrc;
                charImg.alt = suspectName;
            }
            var charNameEl = document.getElementById('chess-character-name');
            if (charNameEl) charNameEl.textContent = suspectName;
            var charRoleEl = document.getElementById('chess-character-role');
            if (charRoleEl) charRoleEl.textContent = suspectRole;
            dialogueTextEl = document.getElementById('chess-dialogue-text');
            historyEl = document.getElementById('chess-dialogue-history');
            interroBoxEl = document.getElementById('chess-interro-box');
        }

        function cleanupInterro() {
            var overlay = document.getElementById('minigame-overlay');
            if (overlay) overlay.classList.remove('retro-layout');
            var sidePanel = document.getElementById('chess-side-panel');
            if (sidePanel) sidePanel.style.display = 'none';
            var leftPanel = document.getElementById('chess-left-panel');
            if (leftPanel) leftPanel.style.display = 'none';
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
            dialogueTextEl = null;
        }

        function restoreOverlay() {
            if (overlay) {
                overlay.classList.remove('retro-layout');
                var topbar = overlay.querySelector('.minigame-overlay-topbar');
                var bottombar = overlay.querySelector('.minigame-overlay-bottombar');
                if (topbar) topbar.style.display = '';
                if (bottombar) bottombar.style.display = '';
                var content = overlay.querySelector('#minigame-screen-content');
                if (content) content.innerHTML = '';
            }
        }

        function clearInterro() {
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
        }

        function appendDialogue(text) {
            if (!historyEl) return;
            var line = document.createElement('div');
            line.className = 'chess-interro-history';
            line.textContent = text;
            historyEl.appendChild(line);
            historyEl.scrollTop = historyEl.scrollHeight;
        }

        function setDialogueText(text) {
            if (dialogueTextEl) dialogueTextEl.textContent = text;
        }

        function fetchInterroData() {
            if (typeof window !== 'undefined' && window.scr && window.scr.interro && window.scr.interro.id) {
                if (window.TDNarration && window.TDNarration.interrogations) {
                    interroData = window.TDNarration.interrogations[window.scr.interro.id];
                }
            }
            return interroData;
        }

        function getRounds() {
            if (!interroData) return [];
            var rounds = [];
            if (interroData.questions) rounds.push(interroData.questions);
            if (interroData.rounds2) rounds.push(interroData.rounds2);
            if (interroData.rounds3) rounds.push(interroData.rounds3);
            return rounds.filter(function (r) { return r && r.length; });
        }

        function renderInterrogation() {
            if (!interroData || !interroState || !interroBoxEl) return;
            var rounds = getRounds();
            if (!rounds.length) return;
            if (interroState.round >= rounds.length) {
                appendDialogue(lang === 'fr' ? 'Interrogatoire termine.' : 'Interrogation complete.');
                finishInterrogation();
                return;
            }
            var currentRound = rounds[interroState.round] || [];
            var remaining = currentRound.filter(function (q) {
                return interroState.answered.indexOf(q.id || q.label) === -1;
            });
            if (!remaining.length) {
                if (interroState.round + 1 < rounds.length) {
                    interroState.round++;
                    interroState.answered = [];
                    renderInterrogation();
                } else {
                    appendDialogue(lang === 'fr' ? 'Interrogatoire termine.' : 'Interrogation complete.');
                    finishInterrogation();
                }
                return;
            }
            interroBoxEl.innerHTML = '';
            var phaseLabel = document.createElement('div');
            phaseLabel.className = 'chess-interro-history';
            phaseLabel.textContent = (lang === 'fr' ? 'Phase ' : 'Phase ') + (interroState.round + 1) + '/' + rounds.length;
            interroBoxEl.appendChild(phaseLabel);
            remaining.forEach(function (q) {
                var btn = document.createElement('button');
                btn.className = 'chess-interro-question';
                btn.textContent = t(q.label, lang);
                btn.addEventListener('click', function () {
                    if (!interroState) return;
                    interroState.answered.push(q.id || q.label);
                    var response = t(q.response, lang) || '';
                    if (typeof window !== 'undefined' && typeof window.scrEnrichResponse === 'function') {
                        response = window.scrEnrichResponse(response, q);
                    }
                    if (typeof window !== 'undefined' && typeof window.scrSubstituteNames === 'function') {
                        var themeId = typeof window.getThemeId === 'function' ? window.getThemeId() : 'agatha-christie';
                        response = window.scrSubstituteNames(response, themeId);
                    }
                    appendDialogue((lang === 'fr' ? 'Vous: ' : 'You: ') + t(q.label, lang));
                    appendDialogue(suspectName + ': ' + response);
                    var clue = null;
                    if (typeof window !== 'undefined' && typeof window.scrClueFromInterroResponse === 'function') {
                        clue = window.scrClueFromInterroResponse(response);
                    }
                    if (clue && typeof window !== 'undefined' && window.TDNarrativeEngine &&
                        typeof window.TDNarrativeEngine.addClue === 'function') {
                        window.TDNarrativeEngine.addClue(clue, q.evidence || 'dialogue');
                        if (typeof window.showClueToast === 'function') {
                            window.showClueToast(clue);
                        }
                    }
                    renderInterrogation();
                });
                interroBoxEl.appendChild(btn);
            });
        }

        function startInterrogation() {
            clearInterro();
            fetchInterroData();
            if (!interroData) return;
            interroState = { round: 0, answered: [] };
            interroCompleted = false;
            var rounds = getRounds();
            if (!rounds.length) return;
            interroPause = true;
            setDialogueText(lang === 'fr' ? 'Phase 1/3, Choisissez votre question :' : 'Phase 1/3, Pick your question:');
            appendDialogue(lang === 'fr' ? 'Phase 1/3, Choisissez votre question :' : 'Phase 1/3, Pick your question:');
            renderInterrogation();
        }

        function finishInterrogation() {
            interroState = null;
            interroData = null;
            interroCompleted = true;
            interroPause = false;
            clearInterro();
        }

        function tryStartInterrogation() {
            if (interroCompleted || interroPause) return;
            fetchInterroData();
            if (interroData && getRounds().length) {
                startInterrogation();
                return true;
            }
            return false;
        }

        function drawScanlines() {
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            for (var i = 0; i < ch; i += 3) {
                ctx.fillRect(0, i, cw, 1);
            }
        }

        function resetBall() {
            ball.x = paddle.x + paddle.w / 2;
            ball.y = paddle.y - ball.r - 1;
            ball.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
            ball.vy = -4;
        }

        function update() {
            if (ended || interroPause) return;
            if (keys['ArrowLeft'] || keys['a']) paddle.x -= paddle.speed;
            if (keys['ArrowRight'] || keys['d']) paddle.x += paddle.speed;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.w > cw) paddle.x = cw - paddle.w;
            ball.x += ball.vx;
            ball.y += ball.vy;
            if (ball.x - ball.r < 0 || ball.x + ball.r > cw) ball.vx *= -1;
            if (ball.y - ball.r < 0) ball.vy *= -1;
            if (ball.y + ball.r > paddle.y && ball.y - ball.r < paddle.y + paddle.h &&
                ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
                ball.vy *= -1;
                ball.y = paddle.y - ball.r;
            }
            var brokenBefore = 0;
            bricks.forEach(function (b) { if (!b.alive) brokenBefore++; });
            bricks.forEach(function (b) {
                if (!b.alive) return;
                if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w &&
                    ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
                    b.alive = false;
                    ball.vy *= -1;
                    score += 10;
                    bricksBroken++;
                    if (PHRASE_TRIGGERS.indexOf(bricksBroken) !== -1 && !interroCompleted) {
                        tryStartInterrogation();
                    }
                }
            });
            var remaining = bricks.filter(function (b) { return b.alive; }).length;
            if (remaining === 0) {
                ended = true;
                if (phraseTimeout) clearTimeout(phraseTimeout);
                setTimeout(function () {
                    cleanupInterro();
                    restoreOverlay();
                    if (onDone) onDone({ won: true, score: score });
                }, 600);
            }
            if (ball.y > ch) {
                ended = true;
                if (phraseTimeout) clearTimeout(phraseTimeout);
                setTimeout(function () {
                    cleanupInterro();
                    restoreOverlay();
                    if (onDone) onDone({ won: false, score: score });
                }, 600);
            }
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);
            ctx.fillStyle = '#ff00ff';
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 10;
            ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
            ctx.fill();
            bricks.forEach(function (b) {
                if (!b.alive) return;
                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = 6;
                ctx.fillRect(b.x, b.y, b.w, b.h);
                ctx.shadowBlur = 0;
            });
            ctx.font = '20px monospace';
            ctx.fillStyle = '#ffff00';
            ctx.fillText('SCORE: ' + score, 20, 30);
            drawScanlines();
        }

        function loop() {
            update();
            draw();
            if (!ended) requestAnimationFrame(loop);
        }

        document.addEventListener('keydown', function (e) { keys[e.key] = true; });
        document.addEventListener('keyup', function (e) { keys[e.key] = false; });

        target.appendChild(wrap);
        createInterroSidebar();
        window._interroSidebarCleanup = cleanupInterro;

        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            paddle.x = (touch.clientX - rect.left) - paddle.w / 2;
            paddle.x = Math.max(0, Math.min(cw - paddle.w, paddle.x));
        }, { passive: false });
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            paddle.x = (touch.clientX - rect.left) - paddle.w / 2;
            paddle.x = Math.max(0, Math.min(cw - paddle.w, paddle.x));
        }, { passive: false });
        canvas.addEventListener('mousedown', function (e) {
            var rect = canvas.getBoundingClientRect();
            paddle.x = (e.clientX - rect.left) - paddle.w / 2;
            paddle.x = Math.max(0, Math.min(cw - paddle.w, paddle.x));
        });
        canvas.addEventListener('mousemove', function (e) {
            if (e.buttons === 1) {
                var rect = canvas.getBoundingClientRect();
                paddle.x = (e.clientX - rect.left) - paddle.w / 2;
                paddle.x = Math.max(0, Math.min(cw - paddle.w, paddle.x));
            }
        });

        resetBall();
        loop();
    }

    global.TDBreakoutGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
