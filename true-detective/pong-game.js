(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var PHRASES = {
        fr: [
            "Les pong sont cruels, inspecteur.",
            "Vous n'\u2019etes pas si mauvais.",
            "La balle ne ment pas.",
            "Essayez de me battre, detecteur.",
            "La lumiere du neon vous observe."
        ],
        en: [
            "Pong can be cruel, inspector.",
            "You\u2019re not so bad.",
            "The ball doesn\u2019t lie.",
            "Try to beat me, detective.",
            "Neon lights watch you."
        ]
    };

    var TAUNTS = {
        fr: [
            "Ha! Un point pour moi.",
            "Vous echouez devant moi.",
            "La ville vous doit plus que \u00e7a."
        ],
        en: [
            "Ha! A point for me.",
            "You fail before me.",
            "The city owes you more than that."
        ]
    };

    var PHRASE_TRIGGERS = [1, 3, 5];

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId || 'femme-fatale');
        }
        return lang === 'fr' ? 'Lady Vivienne' : 'Lady Vivienne';
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'femme-fatale' || !npcId) {
            return lang === 'fr' ? 'Femme Fatale' : 'Femme Fatale';
        }
        return '';
    }

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId || 'femme-fatale');
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = typeof window.getThemeId === 'function' ? window.getThemeId() : 'agatha-christie';
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            return assets && assets.femmeFatale;
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

        var interroId = cfg.interroId || 'femme-fatale';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);
        var dialogues = cfg.dialogues || [];
        var dialogueLines = dialogues.beforeSpin || (PHRASES[lang] || PHRASES.en);
        var tauntLines = dialogues.afterLose || (TAUNTS[lang] || TAUNTS.en);
        var winScore = cfg.winScore || 10;
        var aiSpeed = cfg.aiSpeed || 0.08;
        var phraseTimeout = null;
        var lastPhraseTime = 0;

        var wrap = document.createElement('div');
        wrap.className = 'retro-wrap';
        wrap.innerHTML = '<div class="retro-scanlines"></div>';

        var canvas = document.createElement('canvas');
        canvas.width = Math.min(600, window.innerWidth - 40);
        canvas.height = Math.min(400, window.innerHeight - 200);
        wrap.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        var cw = canvas.width, ch = canvas.height;

        var playerScore = 0, aiScore = 0;
        var ball = { x: cw / 2, y: ch / 2, vx: 4, vy: 2, r: 6 };
        var paddleH = 70, paddleW = 10;
        var playerY = ch / 2 - paddleH / 2;
        var aiY = ch / 2 - paddleH / 2;
        var keys = {};
        var gameOver = false;

        var dialogueEl = document.createElement('div');
        dialogueEl.className = 'retro-dialogue';
        wrap.appendChild(dialogueEl);
        showNewPhrase();

        window.addEventListener('keydown', function (e) { keys[e.key] = true; });
        window.addEventListener('keyup', function (e) { keys[e.key] = false; });

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

        function showPhrase(text) {
            dialogueEl.textContent = text;
            dialogueEl.style.opacity = '1';
            if (phraseTimeout) clearTimeout(phraseTimeout);
            phraseTimeout = setTimeout(function () {
                dialogueEl.style.opacity = '0.4';
            }, 3000);
        }

        function showNewPhrase() {
            var lines = dialogueLines.concat(tauntLines);
            showPhrase(lines[Math.floor(Math.random() * lines.length)]);
        }

        function showTaunt() {
            showPhrase(tauntLines[Math.floor(Math.random() * tauntLines.length)]);
        }

        function resetBall(dir) {
            ball.x = cw / 2;
            ball.y = ch / 2;
            ball.vx = (dir || 1) * (3 + Math.random() * 2);
            ball.vy = (Math.random() - 0.5) * 4;
        }

        function update() {
            if (gameOver || interroPause) return;
            if (keys['ArrowUp'] || keys['w']) playerY -= 5;
            if (keys['ArrowDown'] || keys['s']) playerY += 5;
            playerY = Math.max(0, Math.min(ch - paddleH, playerY));
            aiY += (ball.y - (aiY + paddleH / 2)) * aiSpeed;
            aiY = Math.max(0, Math.min(ch - paddleH, aiY));
            ball.x += ball.vx;
            ball.y += ball.vy;
            if (ball.y < ball.r || ball.y > ch - ball.r) ball.vy *= -1;
            if (ball.x < paddleW + ball.r && ball.y > playerY && ball.y < playerY + paddleH) {
                ball.vx = Math.abs(ball.vx);
                var dy = (ball.y - (playerY + paddleH / 2)) / (paddleH / 2);
                ball.vy = dy * 4;
            }
            if (ball.x > cw - paddleW - ball.r && ball.y > aiY && ball.y < aiY + paddleH) {
                ball.vx = -Math.abs(ball.vx);
                var dy = (ball.y - (aiY + paddleH / 2)) / (paddleH / 2);
                ball.vy = dy * 4;
            }
            if (ball.x < 0) {
                aiScore++;
                if (aiScore < winScore && !interroCompleted) {
                    showTaunt();
                    tryStartInterrogation();
                }
                checkEnd();
                resetBall(1);
            }
            if (ball.x > cw) {
                playerScore++;
                if (PHRASE_TRIGGERS.indexOf(playerScore) !== -1 && !interroCompleted) {
                    showNewPhrase();
                    tryStartInterrogation();
                }
                checkEnd();
                resetBall(-1);
            }
        }

        function checkEnd() {
            if (playerScore >= winScore || aiScore >= winScore) {
                gameOver = true;
                var won = playerScore >= winScore;
                if (phraseTimeout) clearTimeout(phraseTimeout);
                drawGameOver(won, playerScore, winScore);
                showContinueBtn(won, playerScore);
            }
        }

        function drawGameOver(won, score, targetScore) {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);
            ctx.fillStyle = won ? '#00ff88' : '#ff6b6b';
            ctx.font = 'bold 32px monospace';
            ctx.textAlign = 'center';
            var msg = won
                ? (lang === 'fr' ? 'VICTOIRE' : 'VICTORY')
                : (lang === 'fr' ? 'DEFAITE' : 'DEFEAT');
            ctx.fillText(msg, cw / 2, ch / 2 - 20);
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 20px monospace';
            ctx.fillText(score + ' / ' + targetScore, cw / 2, ch / 2 + 20);
        }

        function showContinueBtn(won, score) {
            var continueBtn = document.createElement('button');
            continueBtn.className = 'btn pong-continue';
            continueBtn.textContent = lang === 'fr' ? 'Continuer' : 'Continue';
            continueBtn.style.cssText = 'display:inline-block;margin-top:16px;padding:10px 24px;font-size:1.1rem;background:linear-gradient(135deg,#00ffff,#00b3b3);color:#0a0a1a;border:none;border-radius:8px;cursor:pointer;';
            continueBtn.addEventListener('click', function () {
                cleanupInterro();
                restoreOverlay();
                continueBtn.remove();
                if (onDone) onDone({ won: won, score: score });
            });
            if (dialogueEl) {
                dialogueEl.innerHTML = '';
                dialogueEl.appendChild(continueBtn);
                dialogueEl.style.display = '';
            } else {
                wrap.appendChild(continueBtn);
            }
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

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();
            ctx.moveTo(cw / 2, 0);
            ctx.lineTo(cw / 2, ch);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.fillRect(20, playerY, paddleW, paddleH);
            ctx.fillStyle = '#ff00ff';
            ctx.shadowColor = '#ff00ff';
            ctx.fillRect(cw - 20 - paddleW, aiY, paddleW, paddleH);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffff00';
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.font = 'bold 24px monospace';
            ctx.fillStyle = '#00ffff';
            ctx.textAlign = 'center';
            ctx.fillText(playerScore + ' : ' + aiScore, cw / 2, 40);
        }

        function loop() {
            update();
            draw();
            if (!gameOver) requestAnimationFrame(loop);
        }

        target.appendChild(wrap);
        createInterroSidebar();
        window._interroSidebarCleanup = cleanupInterro;

        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            playerY = (touch.clientY - rect.top) - paddleH / 2;
            playerY = Math.max(0, Math.min(ch - paddleH, playerY));
        }, { passive: false });
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            playerY = (touch.clientY - rect.top) - paddleH / 2;
            playerY = Math.max(0, Math.min(ch - paddleH, playerY));
        }, { passive: false });
        canvas.addEventListener('mousedown', function (e) {
            var rect = canvas.getBoundingClientRect();
            playerY = (e.clientY - rect.top) - paddleH / 2;
            playerY = Math.max(0, Math.min(ch - paddleH, playerY));
        });
        canvas.addEventListener('mousemove', function (e) {
            if (e.buttons === 1) {
                var rect = canvas.getBoundingClientRect();
                playerY = (e.clientY - rect.top) - paddleH / 2;
                playerY = Math.max(0, Math.min(ch - paddleH, playerY));
            }
        });

        loop();
    }

    global.TDPongGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
