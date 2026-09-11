/* =====================================================================
   TRUE DETECTIVE - MATTER.JS CREATIVE GAMES (for Marginal/Silas)
   4 distinct physics mini-games, each different:
   1. card-tower   - stack cards on a platform (precision)
   2. balance-beam - place weights on a seesaw (balance)
   3. tower-drop   - drop cards through moving obstacles (timing)
   4. zigzag-stack - stack cards on a sliding platform (reflex)
   ===================================================================== */
(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    
    var GAME_VARIANTS = {
        'card-tower': {
            name: { fr: 'Tour de cartes', en: 'Card Tower' },
            desc: { fr: 'Empilez des cartes avec précision', en: 'Stack cards with precision' },
            gravity: { x: 0, y: 1.4 },
            pieces: { 1: 5, 2: 8, 3: 12 },
            platformW: { 1: 220, 2: 170, 3: 130 },
            friction: { 1: 0.9, 2: 0.75, 3: 0.55 },
            cardW: 48, cardH: 66
        },
        'balance-beam': {
            name: { fr: 'Faux-équilibre', en: 'Balance Beam' },
            desc: { fr: 'Placez des poids sur la balance', en: 'Place weights on the balance' },
            gravity: { x: 0, y: 1.0 },
            pieces: { 1: 6, 2: 10, 3: 15 },
            platformW: { 1: 300, 2: 250, 3: 200 },
            friction: { 1: 0.95, 2: 0.85, 3: 0.7 },
            cardW: 60, cardH: 30
        },
        'tower-drop': {
            name: { fr: 'Chute libre', en: 'Free Fall' },
            desc: { fr: 'Guidez des cartes à travers les obstacles', en: 'Guide cards through obstacles' },
            gravity: { x: 0, y: 1.2 },
            pieces: { 1: 8, 2: 12, 3: 18 },
            platformW: { 1: 200, 2: 160, 3: 120 },
            friction: { 1: 0.85, 2: 0.7, 3: 0.5 },
            cardW: 50, cardH: 33
        },
        'zigzag-stack': {
            name: { fr: 'Empilement en zigzag', en: 'Zigzag Stack' },
            desc: { fr: 'Empilez sur une plateforme qui glisse', en: 'Stack on a sliding platform' },
            gravity: { x: 0, y: 1.3 },
            pieces: { 1: 6, 2: 9, 3: 14 },
            platformW: { 1: 240, 2: 190, 3: 150 },
            friction: { 1: 0.9, 2: 0.75, 3: 0.6 },
            cardW: 55, cardH: 36
        }
    };

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId);
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = 'agatha-christie';
            if (typeof window.getThemeId === 'function') { themeId = window.getThemeId(); }
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            if (npcId === 'marginal') return assets && assets.marginal;
        }
        return null;
    }

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId);
        }
        return lang === 'fr' ? 'Silas Crane' : 'Silas Crane';
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'marginal' || !npcId) {
            return lang === 'fr' ? 'Sans-abri' : 'Homeless';
        }
        return '';
    }

    function drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function play(cfg, lang, onDone, target) {
        if (!cfg) { if (onDone) onDone({ won: false }); return; }
        if (!window.Matter) { if (onDone) onDone({ won: false }); return; }

        var Matter = window.Matter;
        var variant = cfg.variant || 'card-tower';
        var vCfg = GAME_VARIANTS[variant] || GAME_VARIANTS['card-tower'];
        var act = cfg.act || 1;
        var diff = Math.min(Math.max(act, 1), 3);
        var totalPieces = vCfg.pieces[diff] || 8;
        var platformW = vCfg.platformW[diff] || 200;
        var friction = vCfg.friction[diff] || 0.8;
        var cardW = vCfg.cardW;
        var cardH = vCfg.cardH;
        var gravity = vCfg.gravity;

        var piecesPlaced = 0;
        var gameOver = false;
        var won = false;
        var engine, world;
        var canvas, ctx;
        var cw, ch;
        var bodies = [];
        var obstacles = [];
        var platformBody;
        var platformDrawW = platformW;
        var groundY;
        var animFrameId = null;
        var intervalId = null;
        var dialogueTimer = null;
        var stableTimer = null;

        var overlay = document.getElementById('minigame-overlay');
        var layoutContainer = target ? target.parentElement : null;
        var sidePanel = document.getElementById('chess-side-panel');
        var dialogueText = document.getElementById('chess-dialogue-text');
        var characterImage = document.getElementById('chess-character-image');
        var characterName = document.getElementById('chess-character-name');
        var characterRole = document.getElementById('chess-character-role');
        var historyEl = document.getElementById('chess-dialogue-history');
        var interroBoxEl = document.getElementById('chess-interro-box');

        if (!target) {
            var layer = document.getElementById('minigame-layer');
            if (!layer) { if (onDone) onDone({ won: false }); return; }
            layer.innerHTML = '';
            layer.classList.add('active');
            target = layer;
        }

        if (overlay) overlay.classList.add('chess-layout');
        if (layoutContainer) layoutContainer.classList.add('chess-game-layout');
        if (sidePanel) sidePanel.style.display = 'flex';

        var suspectName = getNpcName('marginal', lang);
        var suspectRole = getNpcRole('marginal', lang);
        if (characterName) characterName.textContent = suspectName;
        if (characterRole) characterRole.textContent = suspectRole;
        var imgSrc = getNpcImage('marginal');
        if (characterImage && imgSrc) { characterImage.src = imgSrc; characterImage.alt = suspectName; }

        var phraseList = (cfg.dialogues && cfg.dialogues.length) ? cfg.dialogues : [];
        var phraseIdx = 0;

        target.innerHTML = '';
        var wrap = document.createElement('div');
        wrap.className = 'domino-wrap';
        wrap.style.cssText = 'position:relative;width:100%;max-width:700px;margin:0 auto;background:linear-gradient(135deg,rgba(15,20,30,0.95),rgba(20,30,20,0.95));border-radius:12px;padding:12px;box-sizing:border-box;';

        var titleEl = document.createElement('div');
        titleEl.className = 'domino-title';
        titleEl.textContent = t(cfg.title, lang) || t(vCfg.name, lang) || 'Mini-jeu';
        titleEl.style.cssText = 'color:#e6f7ff;font-family:Montserrat,sans-serif;font-size:1.1em;text-align:center;margin-bottom:8px;';
        wrap.appendChild(titleEl);

        var infoEl = document.createElement('div');
        infoEl.className = 'domino-info';
        infoEl.style.cssText = 'color:#aaddff;font-family:Montserrat,sans-serif;font-size:0.85em;text-align:center;margin-bottom:6px;';
        infoEl.textContent = (lang === 'fr' ? 'Pièces : 0/' + totalPieces : 'Pieces: 0/' + totalPieces);
        wrap.appendChild(infoEl);

        var canvasContainer = document.createElement('div');
        canvasContainer.className = 'domino-canvas-container';
        canvasContainer.style.cssText = 'position:relative;width:100%;height:420px;background:#080c14;border:2px solid #00d4ff;border-radius:8px;overflow:hidden;';
        wrap.appendChild(canvasContainer);

        canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 420;
        canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;cursor:crosshair;';
        canvasContainer.appendChild(canvas);
        ctx = canvas.getContext('2d');
        cw = canvas.width;
        ch = canvas.height;
        groundY = ch - 50;

        target.appendChild(wrap);

        function setDialogue(text) {
            if (dialogueText) dialogueText.textContent = text;
        }
        function nextPhrase() {
            if (!phraseList.length) return;
            setDialogue(phraseList[phraseIdx % phraseList.length]);
            phraseIdx++;
        }
        function startDialogueCycle() {
            clearDialogueCycle();
            if (phraseList.length) {
                nextPhrase();
                dialogueTimer = setInterval(nextPhrase, 5000);
            }
        }
        function clearDialogueCycle() {
            if (dialogueTimer) { clearInterval(dialogueTimer); dialogueTimer = null; }
        }

        function cleanup() {
            gameOver = true;
            clearDialogueCycle();
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
            if (stableTimer) { clearTimeout(stableTimer); stableTimer = null; }
            if (engine && world) {
                try { Matter.World.clear(world); Matter.Engine.clear(engine); } catch (e) {}
                engine = null; world = null;
            }
            if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
            if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
            if (overlay) overlay.classList.remove('chess-layout');
            if (layoutContainer) layoutContainer.classList.remove('chess-game-layout');
            if (sidePanel) sidePanel.style.display = 'none';
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
            bodies = [];
            obstacles = [];
            platformBody = null;
        }

        engine = Matter.Engine.create({ gravity: { x: gravity.x, y: gravity.y } });
        world = engine.world;

        var wallOpts = { isStatic: true, friction: 0.3, restitution: 0.1, label: 'wall' };
        Matter.World.add(world, [
            Matter.Bodies.rectangle(-30, ch / 2, 60, ch * 3, wallOpts),
            Matter.Bodies.rectangle(cw + 30, ch / 2, 60, ch * 3, wallOpts)
        ]);

        if (variant === 'balance-beam') {
            platformDrawW = platformW * 1.2;
            var beam = Matter.Bodies.rectangle(cw / 2, groundY - 40, platformDrawW, 14, {
                friction: friction, restitution: 0.05, label: 'beam'
            });
            var pivot = Matter.Bodies.rectangle(cw / 2, groundY - 40, 10, 10, { isStatic: true, label: 'pivot' });
            var constraint = Matter.Constraint.create({
                bodyA: beam, pointA: { x: 0, y: 0 },
                pointB: { x: cw / 2, y: groundY - 40 },
                stiffness: 1, length: 0
            });
            Matter.World.add(world, [beam, pivot, constraint]);
            platformBody = beam;
            groundY = groundY - 40;
        } else if (variant === 'zigzag-stack') {
            platformBody = Matter.Bodies.rectangle(cw / 2, groundY, platformW, 18, {
                isStatic: false, friction: friction, restitution: 0.05, label: 'platform', density: 0.1
            });
            Matter.World.add(world, platformBody);
        } else {
            platformBody = Matter.Bodies.rectangle(cw / 2, groundY, platformW, 18, {
                isStatic: true, friction: friction, restitution: 0.05, label: 'platform'
            });
            Matter.World.add(world, platformBody);

            if (variant === 'tower-drop') {
                var obsCount = 2 + diff;
                for (var i = 0; i < obsCount; i++) {
                    var obs = Matter.Bodies.rectangle(
                        cw / 2 + (i - (obsCount - 1) / 2) * cw * 0.22,
                        groundY - 70 - i * 45,
                        85 + i * 18,
                        10,
                        { isStatic: true, friction: 0.5, restitution: 0.1, label: 'obstacle', angle: (Math.random() - 0.5) * 0.6 }
                    );
                    obstacles.push(obs);
                    Matter.World.add(world, obs);
                }
            }
        }

        function getCanvasPos(e) {
            var rect = canvas.getBoundingClientRect();
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
            if (e.touches && e.touches.length) {
                return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
            }
            return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
        }

        function spawnPiece(x, y) {
            if (gameOver || piecesPlaced >= totalPieces) return;
            var body;
            if (variant === 'balance-beam') {
                body = Matter.Bodies.circle(x, y, cardW / 3, {
                    friction: 0.9, frictionStatic: 1.0, restitution: 0.02, density: 0.006, label: 'piece'
                });
            } else {
                body = Matter.Bodies.rectangle(x, y, cardW, cardH, {
                    friction: 0.85, frictionStatic: 1.0, restitution: 0.04, density: 0.004,
                    angle: (Math.random() - 0.5) * 0.2, label: 'piece'
                });
            }
            Matter.World.add(world, body);
            bodies.push(body);
            piecesPlaced++;
            infoEl.textContent = (lang === 'fr' ? 'Pièces : ' : 'Pieces: ') + piecesPlaced + '/' + totalPieces;
            nextPhrase();
            if (piecesPlaced >= totalPieces) {
                startStabilityCheck();
            }
        }

        canvas.addEventListener('click', function (e) {
            if (gameOver) return;
            var pos = getCanvasPos(e);
            handleInput(pos.x, pos.y);
        });
        canvas.addEventListener('touchstart', function (e) {
            if (gameOver) return;
            e.preventDefault();
            var pos = getCanvasPos(e);
            handleInput(pos.x, pos.y);
        }, { passive: false });

        function handleInput(x, y) {
            if (variant === 'card-tower') {
                spawnPiece(x, 30);
            } else if (variant === 'balance-beam') {
                spawnPiece(x, platformBody.position.y - 80);
            } else if (variant === 'tower-drop') {
                spawnPiece(x, 30);
            } else if (variant === 'zigzag-stack') {
                spawnPiece(x, 30);
            }
        }

        function updateVariant() {
            var t = Date.now() * 0.001;
            if (variant === 'tower-drop') {
                for (var i = 0; i < obstacles.length; i++) {
                    var obs = obstacles[i];
                    Matter.Body.setPosition(obs, {
                        x: cw / 2 + Math.sin(t * (1 + i * 0.6)) * cw * 0.28,
                        y: groundY - 70 - i * 45
                    });
                    Matter.Body.setAngle(obs, Math.sin(t * (1.3 + i * 0.4)) * 0.5);
                }
            } else if (variant === 'zigzag-stack') {
                var speed = 0.8 + diff * 0.4;
                var newX = cw / 2 + Math.sin(t * speed) * (cw / 2 - platformW / 2 - 20);
                Matter.Body.setPosition(platformBody, { x: newX, y: groundY });
                Matter.Body.setVelocity(platformBody, { x: Math.cos(t * speed) * speed * 50, y: 0 });
            }
        }

        function startStabilityCheck() {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(function () {
                if (gameOver) return;
                checkWinLoss();
            }, 500);
        }

        function checkWinLoss() {
            if (gameOver || piecesPlaced < totalPieces) return;

            var outOfBounds = 0;
            for (var i = 0; i < bodies.length; i++) {
                var b = bodies[i];
                if (!b) continue;
                if (b.position.y > ch + 40 || b.position.x < -40 || b.position.x > cw + 40) {
                    outOfBounds++;
                }
            }

            var maxOut = diff === 1 ? 1 : diff === 2 ? 2 : 3;
            if (outOfBounds > maxOut) {
                endGame(false);
                return;
            }

            var allStable = true;
            for (var j = 0; j < bodies.length; j++) {
                var b2 = bodies[j];
                if (!b2) continue;
                if (b2.speed > 1.2 || Math.abs(b2.angularSpeed) > 0.12) {
                    allStable = false;
                    break;
                }
            }
            if (allStable && outOfBounds === 0 && !stableTimer) {
                stableTimer = setTimeout(function () {
                    stableTimer = null;
                    endGame(true);
                }, 1000);
            }
        }

        function endGame(w) {
            if (gameOver) return;
            gameOver = true;
            won = w;
            setTimeout(function () {
                cleanup();
                if (onDone) onDone({ won: won, clue: won ? cfg.clue : cfg.failClue });
            }, 500);
        }

        function loop() {
            if (!engine || !world) return;
            Matter.Engine.update(engine, 1000 / 60);
            updateVariant();

            ctx.clearRect(0, 0, cw, ch);

            var bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
            bgGrad.addColorStop(0, '#080c14');
            bgGrad.addColorStop(1, '#0d1219');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, cw, ch);

            ctx.strokeStyle = 'rgba(0,212,255,0.06)';
            ctx.lineWidth = 1;
            for (var gx = 0; gx < cw; gx += 36) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke();
            }
            for (var gy = 0; gy < ch; gy += 36) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(0, ch); ctx.stroke();
            }

            drawBody(platformBody, platformDrawW, 14, '#141828', 'rgba(0,212,255,0.35)');

            for (var oi = 0; oi < obstacles.length; oi++) {
                drawBody(obstacles[oi], 85 + oi * 18, 10, '#331111', 'rgba(255,60,60,0.4)');
            }

            for (var i = 0; i < bodies.length; i++) {
                var b = bodies[i];
                if (!b) continue;
                if (variant === 'balance-beam') {
                    drawCircleBody(b, '#ffaa00', 'rgba(255,170,0,0.6)');
                } else {
                    drawRectBody(b, cardW, cardH, getCardColor(i), getCardStrokeColor(i));
                }
            }

            if (!gameOver && piecesPlaced < totalPieces) {
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                ctx.font = '12px Montserrat,sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(lang === 'fr' ? 'Cliquez pour placer une pièce' : 'Click to place a piece', cw / 2, 22);
            }

            animFrameId = requestAnimationFrame(loop);
        }

        function drawBody(body, w, h, fill, stroke) {
            if (!body || !body.position) return;
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle || 0);
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            drawRoundedRect(ctx, -w/2, -h/2, w, h, 4);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        function drawCircleBody(body, fill, stroke) {
            if (!body) return;
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, body.circleRadius || 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        function drawRectBody(body, w, h, fill, stroke) {
            if (!body) return;
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle || 0);
            ctx.fillStyle = fill;
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 2;
            drawRoundedRect(ctx, -w/2, -h/2, w, h, 4);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.18)';
            ctx.font = '9px Montserrat,sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('PIECE', 0, 0);
            ctx.restore();
        }

        function getCardColor(index) {
            var hues = [0, 25, 50, 100, 170, 210, 260, 290, 330];
            return 'hsl(' + hues[index % hues.length] + ', 55%, 42%)';
        }
        function getCardStrokeColor(index) {
            var hues = [0, 25, 50, 100, 170, 210, 260, 290, 330];
            return 'hsl(' + hues[index % hues.length] + ', 65%, 58%)';
        }

        startDialogueCycle();
        loop();

        window._minigameCleanup = cleanup;
    }

    global.TDDominoGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
