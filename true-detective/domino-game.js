/* =====================================================================
   TRUE DETECTIVE - CARD HOUSE STACKING MINIGAME (Matter.js)
   Player clicks to place cards on a platform. Stack must remain stable.
   Difficulty increases each act (1: easy, 2: medium, 3: hard).
   Silas Crane (marginal) observes from bottom-right with talkbox phrases.
   Interrogation dialogue triggered on each card placement.
   ===================================================================== */
(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var MARGINAL_PHRASES = {
        fr: [
            "Attention, ça penche...",
            "Plus doucement...",
            "La tour vacille...",
            "Les cartes sont fragiles...",
        ],
        en: [
            "Careful, it's tilting...",
            "More gently...",
            "The tower is swaying...",
            "Cards are fragile...",
        ]
    };

    var MARGINAL_TAUNTS = {
        fr: [
            "Toujours pas ? Une vraie galère.",
            "Laissez-moi deviner... vous perdrez.",
            "Chaque carte mal placée dit quelque chose.",
            "La patience, c'est bien. La précipitation, c'est mal.",
            "Vous butez contre le mur."
        ],
        en: [
            "Still nothing? Quite a struggle.",
            "Let me guess... you'll fail.",
            "Each misplaced card says something.",
            "Patience is good. Precipitation is bad.",
            "You're running into a wall."
        ]
    };

    function getRandomMarginalPhrase(lang) {
        var phrases = MARGINAL_PHRASES[lang] || MARGINAL_PHRASES.en;
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    function getPieceCount(act) {
        if (act === 1) return 5;
        if (act === 2) return 8;
        return 12;
    }

    function getPlatformWidth(act) {
        if (act === 1) return 220;
        if (act === 2) return 170;
        return 130;
    }

    function getPlatformFriction(act) {
        if (act === 1) return 0.9;
        if (act === 2) return 0.75;
        return 0.55;
    }

    function getMaxFallen(act) {
        if (act === 1) return 1;
        if (act === 2) return 2;
        return 3;
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
        if (npcId === 'marginal') {
            return lang === 'fr' ? 'Silas Crane' : 'Silas Crane';
        }
        return npcId;
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'marginal') {
            return lang === 'fr' ? 'Sans-abri' : 'Homeless';
        }
        return '';
    }

    function getThemeId() {
        if (typeof window !== 'undefined' && window.getThemeId) return window.getThemeId();
        return 'agatha-christie';
    }

    function cleanupSidePanel() {
        if (typeof window !== 'undefined' && window._interroSidebarCleanup) {
            window._interroSidebarCleanup();
        }
    }

    function play(cfg, lang, onDone, target) {
        if (!cfg) { if (onDone) onDone({ won: false }); return; }
        if (!target) {
            var layer = document.getElementById('minigame-layer');
            if (!layer) { if (onDone) onDone({ won: false }); return; }
            layer.innerHTML = '';
            layer.classList.add('active');
            target = layer;
        }

        var act = cfg.act || 1;
        var totalPieces = getPieceCount(act);
        var piecesPlaced = 0;
        var gameOver = false;
        var engine, world;
        var canvas, ctx;
        var bodies = [];
        var platformBody;
        var platformWidth = getPlatformWidth(act);
        var platformHeight = 18;
        var cardWidth = 48;
        var cardHeight = 66;
        var groundY;
        var containerWidth, containerHeight;
        var cleanupFns = [];
        var checkInterval = null;
        var animFrameId = null;
        var maxFallen = getMaxFallen(act);
        var fallenCount = 0;
        var stableCheckCounter = 0;
        var stableRequiredFrames = 90;
        var interroPause = false;

        var suspectName = getNpcName('marginal', lang);
        var suspectRole = getNpcRole('marginal', lang);

        var overlay = document.getElementById('minigame-overlay');
        if (overlay) overlay.classList.add('chess-layout');

        var layoutContainer = target.parentElement;
        if (layoutContainer) layoutContainer.classList.add('chess-game-layout');

        var sidePanel = document.getElementById('chess-side-panel');
        var dialogueText = document.getElementById('chess-dialogue-text');
        var characterImage = document.getElementById('chess-character-image');
        var characterName = document.getElementById('chess-character-name');
        var characterRole = document.getElementById('chess-character-role');
        var historyEl = document.getElementById('chess-dialogue-history');
        var interroBoxEl = document.getElementById('chess-interro-box');
        var leftPanel = document.getElementById('chess-left-panel');

        if (sidePanel) sidePanel.style.display = 'flex';
        if (leftPanel) leftPanel.style.display = 'flex';

        var imgSrc = getNpcImage('marginal');
        if (characterImage && imgSrc) {
            characterImage.src = imgSrc;
            characterImage.alt = suspectName;
        }
        if (characterName) characterName.textContent = suspectName;
        if (characterRole) characterRole.textContent = suspectRole;

        var phraseList = cfg.dialogues && cfg.dialogues.length
            ? cfg.dialogues
            : (MARGINAL_PHRASES[lang] || MARGINAL_PHRASES.en);
        var tauntList = MARGINAL_TAUNTS[lang] || MARGINAL_TAUNTS.en;
        var phraseInterval = null;
        var placementCount = 0;

        target.innerHTML = '';
        var wrap = document.createElement('div');
        wrap.className = 'domino-wrap';
        wrap.style.background = 'linear-gradient(135deg, rgba(15, 20, 30, 0.95) 0%, rgba(20, 30, 20, 0.95) 100%)';
        wrap.style.backgroundSize = 'cover';
        wrap.style.backgroundPosition = 'center';
        wrap.style.minHeight = '600px';
        wrap.style.position = 'relative';
        target.appendChild(wrap);

        var titleEl = document.createElement('h3');
        titleEl.className = 'domino-title';
        titleEl.textContent = t(cfg.title, lang) || (lang === 'fr' ? 'Maison de cartes' : 'Card Tower');
        wrap.appendChild(titleEl);

        var infoEl = document.createElement('div');
        infoEl.className = 'domino-info';
        infoEl.textContent = (lang === 'fr' ? 'Cartes : 0/' + totalPieces : 'Cards: 0/' + totalPieces);
        wrap.appendChild(infoEl);

        var canvasContainer = document.createElement('div');
        canvasContainer.className = 'domino-canvas-container';
        canvasContainer.style.width = '100%';
        canvasContainer.style.height = '500px';
        wrap.appendChild(canvasContainer);

        canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 500;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.touchAction = 'none';
        canvasContainer.appendChild(canvas);
        ctx = canvas.getContext('2d');

        containerWidth = canvas.width;
        containerHeight = canvas.height;
        groundY = containerHeight - 40;

        var hintEl = document.createElement('div');
        hintEl.className = 'domino-hint';
        hintEl.textContent = lang === 'fr'
            ? 'Cliquez pour poser une carte.'
            : 'Click to place a card.';
        wrap.appendChild(hintEl);

        function setRandomDialogue() {
            if (!dialogueText) return;
            if (phraseList && phraseList.length) {
                dialogueText.textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
            }
        }

        function setIntervalSafe() {
            clearIntervalSafe();
            phraseInterval = setInterval(function () {
                if (!dialogueText || !dialogueText.parentNode) {
                    clearIntervalSafe();
                    return;
                }
                if (!interroState) {
                    setRandomDialogue();
                }
            }, 4000);
        }

        function clearIntervalSafe() {
            if (phraseInterval) {
                clearInterval(phraseInterval);
                phraseInterval = null;
            }
        }

        function clearInterro() {
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
        }

        function appendDialogue(text, speaker) {
            if (!historyEl) return;
            var line = document.createElement('div');
            line.className = 'chess-interro-history';
            if (speaker) {
                line.textContent = speaker + ': ' + text;
            } else {
                line.textContent = text;
            }
            historyEl.appendChild(line);
            historyEl.scrollTop = historyEl.scrollHeight;
        }

        var interroData = null;
        var interroState = null;
        var interroCompleted = false;

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
                appendDialogue(lang === 'fr' ? 'Interrogatoire terminé.' : 'Interrogation complete.', null);
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
                    appendDialogue(lang === 'fr' ? 'Interrogatoire terminé.' : 'Interrogation complete.', null);
                    finishInterrogation();
                }
                return;
            }

            interroBoxEl.innerHTML = '';

            var phaseLabel = document.createElement('div');
            phaseLabel.className = 'chess-interro-history';
            phaseLabel.textContent = (lang === 'fr' ? 'Phase ' : 'Phase ') +
                (interroState.round + 1) + '/' + rounds.length;
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
                    appendDialogue((lang === 'fr' ? 'Vous: ' : 'You: ') + t(q.label, lang), null);
                    appendDialogue(suspectName + ': ' + response, null);

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

            clearIntervalSafe();
            interroPause = true;

            setDialogueText(lang === 'fr' ? 'Phase 1/3, Choisissez votre question :' : 'Phase 1/3, Pick your question:');
            appendDialogue(lang === 'fr' ? 'Phase 1/3, Choisissez votre question :' : 'Phase 1/3, Pick your question:', null);
            renderInterrogation();
        }

        function finishInterrogation() {
            interroState = null;
            interroData = null;
            interroCompleted = true;
            interroPause = false;
            clearInterro();
            setRandomDialogue();
            setIntervalSafe();
        }

        function setDialogueText(text) {
            if (dialogueText) dialogueText.textContent = text;
        }

        function onCardPlacement() {
            if (interroCompleted || interroPause) return;
            fetchInterroData();
            if (interroData && getRounds().length) {
                startInterrogation();
                return;
            }

            placementCount++;
            var isTaunt = placementCount % 2 === 1;
            var text = isTaunt
                ? (tauntList[Math.floor(Math.random() * tauntList.length)])
                : (phraseList[Math.floor(Math.random() * phraseList.length)]);
            setDialogueText(text);
        }

        function cleanup() {
            if (checkInterval) { clearInterval(checkInterval); checkInterval = null; }
            if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
            if (engine && world) {
                try {
                    window.Matter.World.clear(world);
                    window.Matter.Engine.clear(engine);
                } catch (e) {}
                engine = null;
                world = null;
            }
            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
            clearIntervalSafe();
            cleanupSidePanel();
            bodies = [];
            platformBody = null;
        }

        function init() {
            var Matter = window.Matter;
            engine = Matter.Engine.create({
                gravity: { x: 0, y: 1.4 }
            });
            world = engine.world;

            var friction = getPlatformFriction(act);
            var restitution = 0.08;

            platformBody = Matter.Bodies.rectangle(
                containerWidth / 2,
                groundY,
                platformWidth,
                platformHeight,
                {
                    isStatic: true,
                    friction: friction,
                    restitution: restitution,
                    label: 'platform'
                }
            );
            Matter.World.add(world, platformBody);

            var wallOpts = { isStatic: true, friction: 0.3, restitution: 0.1, label: 'wall' };
            var wallLeft = Matter.Bodies.rectangle(-30, containerHeight / 2, 60, containerHeight * 3, wallOpts);
            var wallRight = Matter.Bodies.rectangle(containerWidth + 30, containerHeight / 2, 60, containerHeight * 3, wallOpts);
            Matter.World.add(world, [wallLeft, wallRight]);

            canvas.addEventListener('click', onCanvasClick);
            canvas.addEventListener('touchstart', function (e) {
                if (e.touches.length === 1) {
                    var touch = e.touches[0];
                    var rect = canvas.getBoundingClientRect();
                    var scaleX = canvas.width / rect.width;
                    var scaleY = canvas.height / rect.height;
                    var x = (touch.clientX - rect.left) * scaleX;
                    var y = (touch.clientY - rect.top) * scaleY;
                    if (gameOver || interroPause) return;
                    handleClick(x, y);
                    e.preventDefault();
                }
            }, { passive: false });

            checkInterval = setInterval(function () {
                if (gameOver) return;
                checkStability();
            }, 400);

            gameLoop();
        }

        function getCardColor(index) {
            var hues = [0, 25, 50, 100, 170, 210, 260, 290, 330];
            var hue = hues[index % hues.length];
            return 'hsl(' + hue + ', 55%, 42%)';
        }

        function getCardStrokeColor(index) {
            var hues = [0, 25, 50, 100, 170, 210, 260, 290, 330];
            var hue = hues[index % hues.length];
            return 'hsl(' + hue + ', 65%, 58%)';
        }

        function spawnCard(x) {
            if (gameOver || interroPause || piecesPlaced >= totalPieces) return;
            var Matter = window.Matter;

            var halfW = cardWidth / 2;
            var margin = 6;
            var leftBound = platformBody.position.x - platformWidth / 2 + halfW + margin;
            var rightBound = platformBody.position.x + platformWidth / 2 - halfW - margin;
            var clampedX = Math.max(leftBound, Math.min(rightBound, x));

            var spawnY = 25;
            var spawnAngle = (Math.random() - 0.5) * 0.15;

            var body = Matter.Bodies.rectangle(clampedX, spawnY, cardWidth, cardHeight, {
                friction: 0.85,
                frictionStatic: 1.0,
                restitution: 0.04,
                density: 0.004,
                angle: spawnAngle,
                label: 'card'
            });

            Matter.World.add(world, body);
            bodies.push(body);
            piecesPlaced++;
            infoEl.textContent = (lang === 'fr' ? 'Cartes : ' : 'Cards: ') + piecesPlaced + '/' + totalPieces;
            stableCheckCounter = 0;

            onCardPlacement();

            if (piecesPlaced >= totalPieces) {
                hintEl.textContent = lang === 'fr' ? 'Attendez la fin...' : 'Waiting for the end...';
            }
        }

        function onCanvasClick(e) {
            if (gameOver || interroPause) return;
            var rect = canvas.getBoundingClientRect();
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
            var x = (e.clientX - rect.left) * scaleX;
            var y = (e.clientY - rect.top) * scaleY;
            handleClick(x, y);
        }

        function handleClick(x, y) {
            if (gameOver || interroPause) return;
            var platTop = platformBody.position.y - platformHeight / 2;
            if (y > platTop - cardHeight) {
                spawnCard(x);
            }
        }

        function isBodyOnPlatform(body) {
            var pos = body.position;
            var platLeft = platformBody.position.x - platformWidth / 2 - 10;
            var platRight = platformBody.position.x + platformWidth / 2 + 10;
            var platTop = platformBody.position.y - platformHeight / 2;
            return pos.x > platLeft && pos.x < platRight && pos.y < platTop + cardHeight;
        }

        function checkStability() {
            if (gameOver || interroPause || !world) return;
            var Matter = window.Matter;

            var currentFallen = 0;
            for (var i = 0; i < bodies.length; i++) {
                var b = bodies[i];
                if (!b || !isBodyOnPlatform(b)) {
                    currentFallen++;
                }
            }

            if (currentFallen > fallenCount) {
                fallenCount = currentFallen;
            }

            if (fallenCount > maxFallen) {
                gameOver = true;
                hintEl.textContent = lang === 'fr' ? 'La tour s\'est effondrée...' : 'The tower collapsed...';
                setTimeout(function () {
                    cleanup();
                    if (onDone) onDone({ won: false, clue: cfg.failClue });
                }, 1500);
                return;
            }

            if (piecesPlaced >= totalPieces) {
                stableCheckCounter++;
                var allStable = true;
                for (var j = 0; j < bodies.length; j++) {
                    var b2 = bodies[j];
                    if (!b2 || !isBodyOnPlatform(b2)) continue;
                    if (b2.speed > 1.2 || Math.abs(b2.angularSpeed) > 0.12) {
                        allStable = false;
                        break;
                    }
                }
                if (allStable && stableCheckCounter >= stableRequiredFrames) {
                    gameOver = true;
                    hintEl.textContent = lang === 'fr' ? '✅ Tour terminée !' : '✅ Tower complete!';
                    setTimeout(function () {
                        cleanup();
                        if (onDone) onDone({ won: true, clue: cfg.clue });
                    }, 800);
                }
            }
        }

        function drawCard(body) {
            if (!ctx) return;
            var pos = body.position;
            var angle = body.angle;
            var idx = bodies.indexOf(body);
            if (idx < 0) return;

            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(angle);

            var hw = cardWidth / 2;
            var hh = cardHeight / 2;

            ctx.fillStyle = getCardColor(idx);
            ctx.strokeStyle = getCardStrokeColor(idx);
            ctx.lineWidth = 2;
            drawRoundedRect(ctx, -hw, -hh, cardWidth, cardHeight, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = 'rgba(255,255,255,0.18)';
            ctx.font = '9px Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('CARD', 0, -6);
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.fillText(idx + 1, 0, 8);

            ctx.restore();
        }

        function drawDialogue() {
            if (!dialogueText || !dialogueText.textContent) return;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, canvas.height - 70, canvas.width - 20, 24);
            ctx.fillStyle = '#e6f7ff';
            ctx.font = '12px Montserrat, sans-serif';
            ctx.textAlign = 'left';
            var text = dialogueText.textContent;
            var maxWidth = canvas.width - 30;
            if (ctx.measureText(text).width > maxWidth) {
                text = text.substring(0, Math.floor(maxWidth / 6)) + '...';
            }
            ctx.fillText(text, 20, canvas.height - 55);
        }

        function gameLoop() {
            if (!engine || !world) return;
            var Matter = window.Matter;
            Matter.Engine.update(engine, 1000 / 60);

            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGrad.addColorStop(0, '#080c14');
            bgGrad.addColorStop(1, '#0d1219');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(0, 212, 255, 0.06)';
            ctx.lineWidth = 1;
            var gridSize = 36;
            for (var gx = 0; gx < canvas.width; gx += gridSize) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, canvas.height);
                ctx.stroke();
            }
            for (var gy = 0; gy < canvas.height; gy += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, gy);
                ctx.lineTo(canvas.width, gy);
                ctx.stroke();
            }

            var px = platformBody.position.x - platformWidth / 2;
            var py = platformBody.position.y - platformHeight / 2;
            ctx.fillStyle = '#141828';
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
            ctx.lineWidth = 2;
            ctx.fillRect(px, py, platformWidth, platformHeight);
            ctx.strokeRect(px, py, platformWidth, platformHeight);

            ctx.fillStyle = 'rgba(0, 212, 255, 0.12)';
            ctx.fillRect(px, py, platformWidth, 2);

            if (!interroPause) {
                for (var i = 0; i < bodies.length; i++) {
                    drawCard(bodies[i]);
                }

                if (!gameOver && piecesPlaced < totalPieces) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
                    ctx.font = '12px Montserrat, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(lang === 'fr' ? 'Cliquez pour placer une carte' : 'Click to place a card', canvas.width / 2, 22);
                }
            }

            drawDialogue();

            animFrameId = requestAnimationFrame(gameLoop);
        }

        setRandomDialogue();
        setIntervalSafe();

        window._interroSidebarCleanup = function () {
            clearIntervalSafe();
            if (checkInterval) clearInterval(checkInterval);
            if (animFrameId) cancelAnimationFrame(animFrameId);
            if (overlay) overlay.classList.remove('chess-layout');
            if (layoutContainer) layoutContainer.classList.remove('chess-game-layout');
            if (sidePanel) sidePanel.style.display = 'none';
            if (leftPanel) leftPanel.style.display = 'none';
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
        };

        init();
    }

    global.TDDominoGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
