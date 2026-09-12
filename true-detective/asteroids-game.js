(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var PHRASES = {
        fr: [
            "Debris spatial detecte...",
            "Nettoyez cette secteur.",
            "Chaque asteroide elimine revele une donnee.",
            "Navigation a reviser. La trajectoire est critique.",
            "Restez concentre, inspecteur."
        ],
        en: [
            "Space debris detected...",
            "Clear this sector.",
            "Each eliminated asteroid reveals data.",
            "Navigation needs revision. Trajectory is critical.",
            "Stay focused, inspector."
        ]
    };

    var TAUNTS = {
        fr: [
            "Mauvaise trajectoire. Visez mieux.",
            "Vous manquez de precision scientifique.",
            "Chaque fuite est une erreur de calcul.",
            "Vos reflexes sont lents.",
            "La science attendra que vous soyez pret."
        ],
        en: [
            "Wrong trajectory. Aim better.",
            "You lack scientific precision.",
            "Each miss is a calculation error.",
            "Your reflexes are slow.",
            "Science awaits your readiness."
        ]
    };

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId || 'scientifique');
        }
        return lang === 'fr' ? 'Dr. Whitmore' : 'Dr. Whitmore';
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'scientifique' || !npcId) {
            return lang === 'fr' ? 'Scientifique' : 'Scientist';
        }
        return '';
    }

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId || 'scientifique');
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = typeof window.getThemeId === 'function' ? window.getThemeId() : 'agatha-christie';
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            return assets && assets.scientifique;
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

        var interroId = cfg.interroId || 'scientifique';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);
        var dialogues = cfg.dialogues || [];
        var phraseList = dialogues.beforeSpin || (PHRASES[lang] || PHRASES.en);
        var tauntList = dialogues.afterLose || (TAUNTS[lang] || TAUNTS.en);

        var wrap = document.createElement('div');
        wrap.className = 'asteroids-wrap';
        var maxWidth = Math.min(600, window.innerWidth - 32);
        var maxHeight = window.innerHeight - 200;
        wrap.style.cssText = 'width:100%;max-width:' + maxWidth + 'px;max-height:' + maxHeight + 'px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:8px;overflow:hidden;';

        var canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = Math.min(500, maxHeight - 80);
        canvas.style.cssText = 'background:#0a0a1a;display:block;margin:0 auto;border:2px solid #00ffff;border-radius:8px;box-shadow:0 0 20px rgba(0,255,255,0.3);';
        wrap.appendChild(canvas);

        target.appendChild(wrap);

        var ctx = canvas.getContext('2d');
        var cw = canvas.width, ch = canvas.height;

        var score = 0;
        var ended = false;
        var ship = { x: cw / 2, y: ch / 2, angle: -Math.PI / 2, vx: 0, vy: 0, r: 12, thrusting: false };
        var bullets = [];
        var asteroids = [];
        var keys = {};
        var lastShot = 0;
        var interroPause = false;
        var asteroidsDestroyed = 0;
        var lastInterroScore = -1;

        function createAsteroid(x, y, size) {
            var verts = [];
            var numVerts = 8 + Math.floor(Math.random() * 5);
            for (var i = 0; i < numVerts; i++) {
                var angle = (i / numVerts) * Math.PI * 2;
                var dist = size * (0.7 + Math.random() * 0.3);
                verts.push({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
            }
            var speed = (1 + Math.random() * 1.5) * (size > 30 ? 0.6 : 1);
            var dir = Math.random() * Math.PI * 2;
            return { x: x, y: y, vx: Math.cos(dir) * speed, vy: Math.sin(dir) * speed, verts: verts, size: size, rot: 0 };
        }

        for (var i = 0; i < 6; i++) {
            var ax = Math.random() * cw;
            var ay = Math.random() * ch;
            if (Math.abs(ax - ship.x) < 80 && Math.abs(ay - ship.y) < 80) ax = (ax + 200) % cw;
            asteroids.push(createAsteroid(ax, ay, 35));
        }

        var interroData = null;
        var interroState = null;
        var interroCompleted = false;
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

        function wrapObj(obj) {
            if (obj.x < 0) obj.x = cw;
            if (obj.x > cw) obj.x = 0;
            if (obj.y < 0) obj.y = ch;
            if (obj.y > ch) obj.y = 0;
        }

        function onScoreMilestone() {
            if (interroCompleted || interroPause) return;
            fetchInterroData();
            if (interroData && getRounds().length) {
                startInterrogation();
                return;
            }
            var isTaunt = asteroidsDestroyed % 2 === 1;
            var text = isTaunt
                ? (tauntList[Math.floor(Math.random() * tauntList.length)])
                : (phraseList[Math.floor(Math.random() * phraseList.length)]);
            setDialogueText(text);
        }

        function update() {
            if (ended || interroPause) return;
            if (keys['ArrowLeft'] || keys['a']) ship.angle -= 0.08;
            if (keys['ArrowRight'] || keys['d']) ship.angle += 0.08;
            if (keys['ArrowUp'] || keys['w']) {
                ship.vx += Math.cos(ship.angle) * 0.1;
                ship.vy += Math.sin(ship.angle) * 0.1;
                ship.thrusting = true;
            } else {
                ship.thrusting = false;
            }
            ship.vx *= 0.995;
            ship.vy *= 0.995;
            ship.x += ship.vx;
            ship.y += ship.vy;
            wrapObj(ship);
            var now = Date.now();
            if (keys[' '] && now - lastShot > 250) {
                bullets.push({
                    x: ship.x + Math.cos(ship.angle) * 15,
                    y: ship.y + Math.sin(ship.angle) * 15,
                    vx: Math.cos(ship.angle) * 7,
                    vy: Math.sin(ship.angle) * 7,
                    life: 60
                });
                lastShot = now;
            }
            bullets.forEach(function (b) {
                b.x += b.vx;
                b.y += b.vy;
                wrapObj(b);
                b.life--;
            });
            bullets = bullets.filter(function (b) { return b.life > 0; });
            asteroids.forEach(function (a) {
                a.x += a.vx;
                a.y += a.vy;
                a.rot += 0.02;
                wrapObj(a);
            });
            for (var i = bullets.length - 1; i >= 0; i--) {
                for (var j = asteroids.length - 1; j >= 0; j--) {
                    var a = asteroids[j];
                    var dx = bullets[i].x - a.x;
                    var dy = bullets[i].y - a.y;
                    if (Math.sqrt(dx * dx + dy * dy) < a.size) {
                        bullets.splice(i, 1);
                        if (a.size > 15) {
                            asteroids.push(createAsteroid(a.x, a.y, a.size / 2));
                            asteroids.push(createAsteroid(a.x, a.y, a.size / 2));
                        }
                        asteroids.splice(j, 1);
                        score += 10;
                        asteroidsDestroyed++;
                        if (asteroidsDestroyed % 3 === 0 && score / 10 !== lastInterroScore) {
                            lastInterroScore = score / 10;
                            onScoreMilestone();
                        }
                        break;
                    }
                }
            }
            asteroids.forEach(function (a) {
                var dx = ship.x - a.x;
                var dy = ship.y - a.y;
                if (Math.sqrt(dx * dx + dy * dy) < a.size + ship.r) {
                    ended = true;
                    onGameEnd(false);
                }
            });
            if (asteroids.length === 0) {
                ended = true;
                onGameEnd(true);
            }
        }

        function onGameEnd(resultWon) {
            cleanupInterro();
            restoreOverlay();
            if (onDone) onDone({ won: resultWon, score: score });
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
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(ship.x + Math.cos(ship.angle) * 15, ship.y + Math.sin(ship.angle) * 15);
            ctx.lineTo(ship.x + Math.cos(ship.angle + 2.5) * 12, ship.y + Math.sin(ship.angle + 2.5) * 12);
            ctx.lineTo(ship.x + Math.cos(ship.angle - 2.5) * 12, ship.y + Math.sin(ship.angle - 2.5) * 12);
            ctx.closePath();
            ctx.stroke();
            if (ship.thrusting) {
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.moveTo(ship.x + Math.cos(ship.angle + Math.PI) * 10, ship.y + Math.sin(ship.angle + Math.PI) * 10);
                ctx.lineTo(ship.x + Math.cos(ship.angle + Math.PI + 0.5) * 6, ship.y + Math.sin(ship.angle + Math.PI + 0.5) * 6);
                ctx.lineTo(ship.x + Math.cos(ship.angle + Math.PI - 0.5) * 6, ship.y + Math.sin(ship.angle + Math.PI - 0.5) * 6);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = '#ffff00';
            bullets.forEach(function (b) {
                ctx.beginPath();
                ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
            asteroids.forEach(function (a) {
                ctx.strokeStyle = '#ff00ff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                a.verts.forEach(function (v, idx) {
                    var rx = a.x + v.x * Math.cos(a.rot) - v.y * Math.sin(a.rot);
                    var ry = a.y + v.x * Math.sin(a.rot) + v.y * Math.cos(a.rot);
                    if (idx === 0) ctx.moveTo(rx, ry);
                    else ctx.lineTo(rx, ry);
                });
                ctx.closePath();
                ctx.stroke();
            });
            ctx.font = '20px monospace';
            ctx.fillStyle = '#ffff00';
            ctx.fillText('SCORE: ' + score, 20, 30);
            ctx.fillText('ASTEROIDS: ' + asteroids.length, cw - 180, 30);
            drawScanlines();
        }

        function loop() {
            update();
            draw();
            if (!ended) requestAnimationFrame(loop);
        }

        window.addEventListener('keydown', function (e) { keys[e.key] = true; });
        window.addEventListener('keyup', function (e) { keys[e.key] = false; });

        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            var tx = touch.clientX - rect.left;
            var ty = touch.clientY - rect.top;
            if (tx < rect.width / 3) {
                keys['ArrowLeft'] = true;
                keys['ArrowRight'] = false;
            } else if (tx > rect.width * 2 / 3) {
                keys['ArrowRight'] = true;
                keys['ArrowLeft'] = false;
            }
            if (ty < rect.height / 2) {
                keys['ArrowUp'] = true;
            }
            keys[' '] = true;
        }, { passive: false });
        canvas.addEventListener('touchend', function (e) {
            keys['ArrowLeft'] = false;
            keys['ArrowRight'] = false;
            keys['ArrowUp'] = false;
            keys[' '] = false;
        });
        canvas.addEventListener('touchmove', function (e) {
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
                keys['ArrowLeft'] = false;
                keys['ArrowRight'] = false;
            }
        }, { passive: false });

        target.appendChild(wrap);
        createInterroSidebar();
        window._interroSidebarCleanup = cleanupInterro;
        loop();
    }

    global.TDAsteroids = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
