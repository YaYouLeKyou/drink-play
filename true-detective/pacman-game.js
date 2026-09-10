(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var PHRASES = {
        fr: [
            "Les ombres cachent plus que des fant\u00f4mes...",
            "J\u2019ai vu quelqu\u2019un dans le labo.",
            "Le labyrinthe est une metaphore.",
            "Chaque coin cache un secret.",
            "Qui tire vraiment les ficelles ?"
        ],
        en: [
            "The shadows hide more than ghosts...",
            "I saw someone in the lab.",
            "The maze is a metaphor.",
            "Every corner holds a secret.",
            "Who\u2019s really pulling the strings?"
        ]
    };

    var TAUNTS = {
        fr: [
            "Vous butez dans les murs, inspecteur.",
            "Le labyrinthe vous a perdu.",
            "Les fant\u00f4mes rient de votre lenteur."
        ],
        en: [
            "You crash into walls, inspector.",
            "The maze lost you.",
            "Ghosts laugh at your slowness."
        ]
    };

    var PHRASE_TRIGGERS = [20, 40, 60, 80];

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId || 'femme-fatale');
        }
        return lang === 'fr' ? 'Lyra Noir' : 'Lyra Noir';
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
            return assets && assets['femme-fatale'];
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

        var interroId = cfg.interroId || 'femme-fatale';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);
        var dialogues = cfg.dialogues || [];
        var dialogueLines = dialogues.beforeSpin || (PHRASES[lang] || PHRASES.en);
        var tauntLines = dialogues.afterLose || (TAUNTS[lang] || TAUNTS.en);

        var wrap = document.createElement('div');
        wrap.className = 'pacman-wrap';
        var maxWidth = Math.min(420, window.innerWidth - 32);
        var maxHeight = window.innerHeight - 200;
        wrap.style.cssText = 'width:100%;max-width:' + maxWidth + 'px;max-height:' + maxHeight + 'px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:8px;overflow:hidden;';

        var tileSize = Math.max(16, Math.min(20, Math.floor(maxWidth / 20)));
        var canvas = document.createElement('canvas');
        canvas.width = 20 * tileSize;
        canvas.height = 22 * tileSize;
        canvas.style.cssText = 'background:#0a0a1a;display:block;margin:0 auto;border:2px solid #00ffff;border-radius:8px;box-shadow:0 0 20px rgba(0,255,255,0.3);';
        wrap.appendChild(canvas);

        target.appendChild(wrap);

        var ctx = canvas.getContext('2d');
        var cw = canvas.width, ch = canvas.height;
        var tileSizeGame = tileSize;
        var cols = 20;
        var rows = 22;
        var score = 0;
        var ended = false;

        var walls = [];
        var dots = [];
        var ghosts = [];
        var pacman = { x: 10, y: 15, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };
        var lastPhraseScore = 0;

        var map = [
            "####################",
            "#..................#",
            "#.###.####.####.###.#",
            "#.###.####.####.###.#",
            "#..................#",
            "#.###.##.######.##.###",
            "#......##....##......#",
            "#####.###.####.###.####",
            "#....#................#",
            "#.###.#.########.#.###.#",
            "#......#........#......#",
            "#######.##.##.#########",
            "#......#........#......#",
            "#.###.#.########.#.###.#",
            "#..................#",
            "#####.##.######.##.####",
            "#......##....##......#",
            "#.###.####.####.###.#",
            "#..................#",
            "###.##.########.##.###",
            "#..................#",
            "####################"
        ];

        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                if (map[y][x] === '#') walls.push({ x: x, y: y });
                if (map[y][x] === '.') dots.push({ x: x, y: y, eaten: false });
            }
        }

        for (var i = 0; i < 4; i++) {
            ghosts.push({ x: 9 + i, y: 10, color: ['#ff00ff', '#00ffff', '#ffff00', '#ff6600'][i], dir: { x: 1, y: 0 } });
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

        function canMove(x, y) {
            if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
            return map[y][x] !== '#';
        }

        function moveGhost(g) {
            var dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
            var valid = dirs.filter(function (d) { return canMove(g.x + d.x, g.y + d.y); });
            if (valid.length > 0) {
                g.dir = valid[Math.floor(Math.random() * valid.length)];
                g.x += g.dir.x;
                g.y += g.dir.y;
            }
        }

        function update() {
            if (ended || interroPause) return;
            if (canMove(pacman.x + pacman.nextDir.x, pacman.y + pacman.nextDir.y)) {
                pacman.dir = pacman.nextDir;
            }
            if (canMove(pacman.x + pacman.dir.x, pacman.y + pacman.dir.y)) {
                pacman.x += pacman.dir.x;
                pacman.y += pacman.dir.y;
            }
            ghosts.forEach(moveGhost);
            dots.forEach(function (d) {
                if (!d.eaten && d.x === pacman.x && d.y === pacman.y) {
                    d.eaten = true;
                    score += 10;
                }
            });
            var remaining = dots.filter(function (d) { return !d.eaten; }).length;
            if (remaining === 0) {
                ended = true;
                setTimeout(function () {
                    cleanupInterro();
                    restoreOverlay();
                    if (onDone) onDone({ won: true, score: score });
                }, 500);
            }
            ghosts.forEach(function (g) {
                if (g.x === pacman.x && g.y === pacman.y) {
                    ended = true;
                    setTimeout(function () {
                        cleanupInterro();
                        restoreOverlay();
                        if (onDone) onDone({ won: false, score: score });
                    }, 500);
                }
            });
            if (PHRASE_TRIGGERS.indexOf(score) !== -1 && score > lastPhraseScore) {
                lastPhraseScore = score;
                if (!interroCompleted) tryStartInterrogation();
            }
        }

        function drawScanlines() {
            ctx.fillStyle = 'rgba(0,0,0,0.08)';
            for (var i = 0; i < ch; i += 3) {
                ctx.fillRect(0, i, cw, 1);
            }
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);
            ctx.fillStyle = '#1a1a3a';
            walls.forEach(function (w) {
                ctx.fillRect(w.x * tileSizeGame, w.y * tileSizeGame, tileSizeGame, tileSizeGame);
                ctx.strokeStyle = '#00ffff';
                ctx.strokeRect(w.x * tileSizeGame, w.y * tileSizeGame, tileSizeGame, tileSizeGame);
            });
            ctx.fillStyle = '#ffff00';
            dots.forEach(function (d) {
                if (!d.eaten) ctx.fillRect(d.x * tileSizeGame + 8, d.y * tileSizeGame + 8, 4, 4);
            });
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(pacman.x * tileSizeGame + tileSizeGame / 2, pacman.y * tileSizeGame + tileSizeGame / 2, tileSizeGame / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
            ghosts.forEach(function (g) {
                ctx.fillStyle = g.color;
                ctx.beginPath();
                ctx.arc(g.x * tileSizeGame + tileSizeGame / 2, g.y * tileSizeGame + tileSizeGame / 2, tileSizeGame / 2 - 2, 0, Math.PI * 2);
                ctx.fill();
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

        window.addEventListener('keydown', function (e) {
            if (ended || interroPause) return;
            if (e.key === 'ArrowUp' || e.key === 'w') pacman.nextDir = { x: 0, y: -1 };
            if (e.key === 'ArrowDown' || e.key === 's') pacman.nextDir = { x: 0, y: 1 };
            if (e.key === 'ArrowLeft' || e.key === 'a') pacman.nextDir = { x: -1, y: 0 };
            if (e.key === 'ArrowRight' || e.key === 'd') pacman.nextDir = { x: 1, y: 0 };
        });

        var touchStartX = 0;
        var touchStartY = 0;
        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            var touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: false });
        canvas.addEventListener('touchend', function (e) {
            e.preventDefault();
            if (!e.changedTouches.length) return;
            var dx = e.changedTouches[0].clientX - touchStartX;
            var dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) > Math.abs(dy)) {
                pacman.nextDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
            } else {
                pacman.nextDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
            }
        }, { passive: false });

        target.appendChild(wrap);
        createInterroSidebar();
        window._interroSidebarCleanup = cleanupInterro;
        loop();
    }

    global.TDPacmanGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
