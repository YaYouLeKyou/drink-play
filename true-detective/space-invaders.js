(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var PHRASES = {
        fr: ["Les envahisseurs approchent.", "Tirez sur eux, inspecteur !", "La ville compte sur vous.", "Ne laissez aucun survivre.", "La verite est dans les debris."],
        en: ["The invaders approach.", "Shoot them, inspector!", "The city counts on you.", "Leave none alive.", "The truth is in the debris."]
    };

    var TAUNTS = {
        fr: ["Vos tirs manquent, inspecteur.", "La fusillade continue.", "Plus rapide que vous ne le pensez."],
        en: ["Your shots miss, inspector.", "The gunfire continues.", "Faster than you think."]
    };

    var PHRASE_TRIGGERS = [5, 10, 15];

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
        var suspectName = cfg.npcName || 'Rupert Blackwood';
        var dialogues = cfg.dialogues || {};
        var rows = cfg.rows || 4;
        var cols = cfg.cols || 8;
        var lastTrigger = 0;
        var interroPause = false;
        var interroCompleted = false;
        var dialogueTextEl = null;
        var historyEl = null;
        var interroBoxEl = null;

        var wrap = document.createElement('div');
        wrap.className = 'retro-wrap';
        wrap.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;';

        var canvas = document.createElement('canvas');
        canvas.width = Math.min(600, window.innerWidth - 40);
        canvas.height = Math.min(400, window.innerHeight - 240);
        canvas.style.cssText = 'border:2px solid #00ffff;border-radius:8px;box-shadow:0 0 20px rgba(0,255,255,0.3);';
        wrap.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        var cw = canvas.width, ch = canvas.height;

        var dialogueEl = document.createElement('div');
        dialogueEl.className = 'retro-dialogue';
        dialogueEl.style.cssText = 'margin-top:12px;text-align:center;color:#00ffff;font-size:1rem;min-height:24px;';
        wrap.appendChild(dialogueEl);

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

        function setCharacter(npcImg, npcName, npcRole) {
            var charImg = document.getElementById('chess-character-image');
            if (charImg && npcImg) { charImg.src = npcImg; charImg.alt = npcName; }
            var charNameEl = document.getElementById('chess-character-name');
            if (charNameEl) charNameEl.textContent = npcName;
            var charRoleEl = document.getElementById('chess-character-role');
            if (charRoleEl) charRoleEl.textContent = npcRole;
        }

        function createInterroSidebar() {
            var imgSrc = getNpcImage(interroId);
            setCharacter(imgSrc, suspectName, lang === 'fr' ? 'Suspect' : 'Suspect');
            dialogueTextEl = document.getElementById('chess-dialogue-text');
            historyEl = document.getElementById('chess-dialogue-history');
            interroBoxEl = document.getElementById('chess-interro-box');
        }

        function cleanupInterro() {
            if (overlay) overlay.classList.remove('retro-layout');
            var topbarEl = overlay ? overlay.querySelector('.minigame-overlay-topbar') : null;
            var bottombarEl = overlay ? overlay.querySelector('.minigame-overlay-bottombar') : null;
            if (topbarEl) topbarEl.style.display = '';
            if (bottombarEl) bottombarEl.style.display = '';
            var content = overlay ? overlay.querySelector('#minigame-screen-content') : null;
            if (content) content.innerHTML = '';
            if (dialogueTextEl) dialogueTextEl = null;
        }

        function showDialogue(text) {
            if (!dialogueEl) return;
            dialogueEl.textContent = text;
        }

        function showNewPhrase() {
            var list = dialogues.beforeSpin || PHRASES[lang] || PHRASES.en;
            if (!list || !list.length) return;
            showDialogue(list[Math.floor(Math.random() * list.length)]);
        }

        function tryStartInterrogation() {
            if (interroCompleted || interroPause) return false;
            if (typeof window !== 'undefined' && window.scr && window.scr.interro && window.scr.interro.id) {
                if (typeof window.TDNarration !== 'undefined' && window.TDNarration.interrogations) {
                    var idata = window.TDNarration.interrogations[window.scr.interro.id];
                    if (idata && idata.questions && idata.questions.length) {
                        interroPause = true;
                        dialogueEl.textContent = '';
                        var phaseLabel = document.createElement('div');
                        phaseLabel.style.cssText = 'color:#ff00ff;font-size:0.9rem;margin:4px 0;';
                        phaseLabel.textContent = lang === 'fr' ? 'Phase 1/3, Choisissez votre question :' : 'Phase 1/3, Pick your question:';
                        dialogueEl.appendChild(phaseLabel);
                        idata.questions.forEach(function (q) {
                            var btn = document.createElement('button');
                            btn.style.cssText = 'display:block;margin:4px auto;padding:6px 16px;background:#1a1a3a;border:1px solid #00ffff;color:#00ffff;border-radius:6px;cursor:pointer;';
                            btn.textContent = t(q.label, lang);
                            btn.addEventListener('click', function () {
                                if (!interroPause) return;
                                var resp = t(q.response, lang) || '';
                                if (typeof window !== 'undefined' && typeof window.scrSubstituteNames === 'function') {
                                    resp = window.scrSubstituteNames(resp, typeof window.getThemeId === 'function' ? window.getThemeId() : 'agatha-christie');
                                }
                                interroPause = false;
                                dialogueEl.innerHTML = '';
                                dialogueEl.textContent = resp;
                                if (typeof window !== 'undefined' && typeof window.showClueToast === 'function') {
                                    window.showClueToast(resp);
                                }
                            });
                            dialogueEl.appendChild(btn);
                        });
                        return true;
                    }
                }
            }
            return false;
        }

        function showGameOver(w) {
            gameOver = true;
            won = w;
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);
            ctx.fillStyle = won ? '#00ff88' : '#ff6b6b';
            ctx.font = 'bold 32px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(won ? (lang === 'fr' ? 'VICTOIRE' : 'VICTORY') : (lang === 'fr' ? 'DEFAITE' : 'DEFEAT'), cw / 2, ch / 2 - 20);
            ctx.fillStyle = '#ffff00';
            ctx.font = '20px monospace';
            ctx.fillText(aliensKilled + ' / ' + (rows * cols), cw / 2, ch / 2 + 20);
            showContinueBtn(w);
        }

        function showContinueBtn(w) {
            var btn = document.createElement('button');
            btn.className = 'btn game-continue';
            btn.textContent = lang === 'fr' ? 'Continuer' : 'Continue';
            btn.style.cssText = 'display:inline-block;margin-top:16px;padding:10px 24px;font-size:1.1rem;background:linear-gradient(135deg,#00ffff,#00b3b3);color:#0a1a2a;border:none;border-radius:8px;cursor:pointer;';
            btn.addEventListener('click', function () {
                cleanupInterro();
                if (onDone) onDone({ won: w, score: aliensKilled });
            });
            if (dialogueEl) { dialogueEl.innerHTML = ''; dialogueEl.appendChild(btn); dialogueEl.style.display = ''; }
            else { wrap.appendChild(btn); }
        }

        function update() {
            if (gameOver || interroPause) return;
            if (keys['ArrowLeft'] || keys['a']) player.x -= 5;
            if (keys['ArrowRight'] || keys['d']) player.x += 5;
            player.x = Math.max(player.w / 2, Math.min(cw - player.w / 2, player.x));
            if (keys[' '] || keys['Spacebar']) {
                if (bullets.length < 3) {
                    bullets.push({ x: player.x, y: player.y - player.h / 2, vy: -7 });
                }
                keys[' '] = false;
                keys['Spacebar'] = false;
            }
            bullets.forEach(function (b) { b.y += b.vy; });
            bullets = bullets.filter(function (b) { return b.y > -10; });

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

            if (Math.random() < 0.015) {
                var alive = aliens.filter(function (a) { return a.alive; });
                if (alive.length) {
                    var shooter = alive[Math.floor(Math.random() * alive.length)];
                    alienBullets.push({ x: shooter.x, y: shooter.y + shooter.h / 2, vy: 3 });
                }
            }
            alienBullets.forEach(function (b) { b.y += b.vy; });
            alienBullets = alienBullets.filter(function (b) { return b.y < ch + 10; });

            bullets.forEach(function (b) {
                aliens.forEach(function (a) {
                    if (!a.alive) return;
                    if (Math.abs(b.x - a.x) < a.w / 2 && Math.abs(b.y - a.y) < a.h / 2) {
                        a.alive = false;
                        b.y = -100;
                        aliensKilled++;
                        if (PHRASE_TRIGGERS.indexOf(aliensKilled) !== -1 && aliensKilled > lastTrigger) {
                            lastTrigger = aliensKilled;
                            if (tryStartInterrogation()) return;
                            showNewPhrase();
                        }
                    }
                });
            });

            alienBullets.forEach(function (b) {
                if (Math.abs(b.x - player.x) < player.w / 2 && Math.abs(b.y - player.y) < player.h / 2) {
                    showGameOver(false);
                }
            });

            aliens.forEach(function (a) {
                if (!a.alive) return;
                if (a.y + a.h / 2 >= player.y - player.h / 2) {
                    showGameOver(false);
                }
            });

            var aliveCount = aliens.filter(function (a) { return a.alive; }).length;
            if (aliveCount === 0 && !gameOver) {
                showGameOver(true);
            }
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            ctx.fillRect(player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);
            ctx.shadowBlur = 0;
            bullets.forEach(function (b) { ctx.fillStyle = '#ffff00'; ctx.fillRect(b.x - 1, b.y - 4, 2, 8); });
            alienBullets.forEach(function (b) { ctx.fillStyle = '#ff00ff'; ctx.fillRect(b.x - 1, b.y - 4, 2, 8); });
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
            if (tx < rect.width / 3) { keys['ArrowLeft'] = true; keys['ArrowRight'] = false; }
            else if (tx > rect.width * 2 / 3) { keys['ArrowRight'] = true; keys['ArrowLeft'] = false; }
            else { keys[' '] = true; keys['Spacebar'] = false; }
        }, { passive: false });
        canvas.addEventListener('touchend', function (e) {
            keys['ArrowLeft'] = false; keys['ArrowRight'] = false; keys[' '] = false; keys['Spacebar'] = false;
        });

        target.appendChild(wrap);
        createInterroSidebar();
        window._interroSidebarCleanup = cleanupInterro;
        showNewPhrase();
        loop();
    }

    global.TDSpaceInvaders = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
