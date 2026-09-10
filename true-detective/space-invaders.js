(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var PHRASES = {
        fr: [
            "Les envahisseurs approchent.",
            "Tirez sur eux, inspecteur !",
            "La ville compte sur vous.",
            "Ne laissez aucun survivre.",
            "La verite est dans les debris."
        ],
        en: [
            "The invaders approach.",
            "Shoot them, inspector!",
            "The city counts on you.",
            "Leave none alive.",
            "The truth is in the debris."
        ]
    };

    var TAUNTS = {
        fr: [
            "Vos tirs manquent, inspecteur.",
            "La fusillade continue.",
            "Plus rapide que vous ne le pensez."
        ],
        en: [
            "Your shots miss, inspector.",
            "The gunfire continues.",
            "Faster than you think."
        ]
    };

    var PHRASE_TRIGGERS = [5, 10, 15];

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId || 'suspect');
        }
        return lang === 'fr' ? 'Rupert Blackwood' : 'Rupert Blackwood';
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'suspect' || !npcId) {
            return lang === 'fr' ? 'Suspect' : 'Suspect';
        }
        return '';
    }

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId || 'suspect');
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = typeof window.getThemeId === 'function' ? window.getThemeId() : 'agatha-christie';
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            return assets && assets.suspect;
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
            if (topbar) topbar.style.display = 'none';
            if (bottombar) bottombar.style.display = 'none';
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

        var interroId = cfg.interroId || 'suspect';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);
        var dialogues = cfg.dialogues || [];
        var rows = cfg.rows || 4;
        var cols = cfg.cols || 8;
        var phraseTimeout = null;
        var lastTrigger = 0;

        var wrap = document.createElement('div');
        wrap.className = 'retro-wrap';
        wrap.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;';

        var canvas = document.createElement('canvas');
        canvas.width = Math.min(600, window.innerWidth - 40);
        canvas.height = Math.min(400, window.innerHeight - 200);
        canvas.style.cssText = 'border:2px solid #00ffff;border-radius:8px;box-shadow:0 0 20px rgba(0,255,255,0.3);';
        wrap.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        var cw = canvas.width, ch = canvas.height;

        var dialogueLines = dialogues.beforeSpin || (PHRASES[lang] || PHRASES.en);
        var tauntLines = dialogues.afterLose || (TAUNTS[lang] || TAUNTS.en);

        var player = { x: cw / 2, y: ch - 40, w: 40, h: 20 };
        var bullets = [];
        var aliens = [];
        var alienBullets = [];
        var alienDir = 1;
        var alienSpeed = 1;
        var gameOver = false;
        var won = false;
        var keys = {};
        var aliensKilled = 0;

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                aliens.push({ x: 60 + c * 50, y: 40 + r * 40, w: 30, h: 20, alive: true });
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

        function showNewPhrase() {
            if (!dialogueLines || !dialogueLines.length) return;
            setDialogueText(dialogueLines[Math.floor(Math.random() * dialogueLines.length)]);
        }

        function update() {
            if (gameOver || interroPause) return;
            if (keys['ArrowLeft'] || keys['a']) player.x -= 4;
            if (keys['ArrowRight'] || keys['d']) player.x += 4;
            player.x = Math.max(player.w / 2, Math.min(cw - player.w / 2, player.x));
            if (keys[' '] || keys['Spacebar']) {
                if (bullets.length < 3) {
                    bullets.push({ x: player.x, y: player.y - player.h / 2, vy: -6 });
                }
            }
            bullets.forEach(function (b) { b.y += b.vy; });
            bullets = bullets.filter(function (b) { return b.y > 0; });
            var moveDown = false;
            aliens.forEach(function (a) {
                if (!a.alive) return;
                a.x += alienDir * alienSpeed;
                if (a.x <= 10 || a.x >= cw - 10) moveDown = true;
            });
            if (moveDown) {
                alienDir *= -1;
                aliens.forEach(function (a) { if (a.alive) a.y += 20; });
            }
            if (Math.random() < 0.02) {
                var aliveAliens = aliens.filter(function (a) { return a.alive; });
                if (aliveAliens.length) {
                    var shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
                    alienBullets.push({ x: shooter.x, y: shooter.y + shooter.h / 2, vy: 3 });
                }
            }
            alienBullets.forEach(function (b) { b.y += b.vy; });
            alienBullets = alienBullets.filter(function (b) { return b.y < ch; });
            bullets.forEach(function (b) {
                aliens.forEach(function (a) {
                    if (!a.alive) return;
                    if (Math.abs(b.x - a.x) < a.w / 2 && Math.abs(b.y - a.y) < a.h / 2) {
                        a.alive = false;
                        b.y = -10;
                        aliensKilled++;
                        if (PHRASE_TRIGGERS.indexOf(aliensKilled) !== -1 && aliensKilled > lastTrigger) {
                            lastTrigger = aliensKilled;
                            showNewPhrase();
                            if (!interroCompleted) tryStartInterrogation();
                        }
                    }
                });
            });
            var aliveCount = aliens.filter(function (a) { return a.alive; }).length;
            if (aliveCount === 0) {
                gameOver = true;
                won = true;
                if (phraseTimeout) clearTimeout(phraseTimeout);
                setTimeout(function () {
                    cleanupInterro();
                    restoreOverlay();
                    if (onDone) onDone({ won: true, score: aliensKilled });
                }, 500);
            }
            alienBullets.forEach(function (b) {
                if (Math.abs(b.x - player.x) < player.w / 2 && Math.abs(b.y - player.y) < player.h / 2) {
                    gameOver = true;
                    won = false;
                    if (phraseTimeout) clearTimeout(phraseTimeout);
                    setTimeout(function () {
                        cleanupInterro();
                        restoreOverlay();
                        if (onDone) onDone({ won: false, score: aliensKilled });
                    }, 500);
                }
            });
            aliens.forEach(function (a) {
                if (!a.alive) return;
                if (a.y + a.h / 2 >= player.y - player.h / 2) {
                    gameOver = true;
                    won = false;
                    if (phraseTimeout) clearTimeout(phraseTimeout);
                    setTimeout(function () {
                        cleanupInterro();
                        restoreOverlay();
                        if (onDone) onDone({ won: false, score: aliensKilled });
                    }, 500);
                }
            });
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.fillRect(player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);
            ctx.shadowBlur = 0;
            bullets.forEach(function (b) {
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(b.x - 1, b.y - 4, 2, 8);
            });
            alienBullets.forEach(function (b) {
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(b.x - 1, b.y - 4, 2, 8);
            });
            aliens.forEach(function (a) {
                if (!a.alive) return;
                ctx.fillStyle = '#ff00ff';
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 8;
                ctx.fillRect(a.x - a.w / 2, a.y - a.h / 2, a.w, a.h);
                ctx.shadowBlur = 0;
            });
            ctx.font = '20px monospace';
            ctx.fillStyle = '#ffff00';
            ctx.textAlign = 'center';
            ctx.fillText('SCORE: ' + aliensKilled, cw / 2, 30);
        }

        function loop() {
            update();
            draw();
            if (!gameOver) requestAnimationFrame(loop);
        }

        window.addEventListener('keydown', function (e) { keys[e.key] = true; });
        window.addEventListener('keyup', function (e) { keys[e.key] = false; });

        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            var tx = touch.clientX - rect.left;
            if (tx < rect.width / 3) {
                keys['ArrowLeft'] = true;
                keys['ArrowRight'] = false;
            } else if (tx > rect.width * 2 / 3) {
                keys['ArrowRight'] = true;
                keys['ArrowLeft'] = false;
            } else {
                keys[' '] = true;
            }
        }, { passive: false });
        canvas.addEventListener('touchend', function (e) {
            keys['ArrowLeft'] = false;
            keys['ArrowRight'] = false;
            keys[' '] = false;
        });

        target.appendChild(wrap);
        createInterroSidebar();
        window._interroSidebarCleanup = cleanupInterro;
        loop();
    }

    global.TDSpaceInvaders = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
