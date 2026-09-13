/* =====================================================================
   TRUE DETECTIVE - LA TOUR DE SILAS
   Matter.js physics tower-building game
   Stack blocks to reach the target height. Different materials, different behaviors.
   ===================================================================== */
(function (global) {
    'use strict';

    if (!window.Matter) {
        console.error('[Marginal Tower] Matter.js is required.');
        return;
    }

    var Matter = window.Matter;
    var Engine = Matter.Engine;
    var World = Matter.World;
    var Bodies = Matter.Bodies;
    var Body = Matter.Body;
    var Events = Matter.Events;
    var Composite = Matter.Composite;

    // ===== BLOCK TYPES =====
    var BLOCK_TYPES = {
        wood: {
            icon: '🪵',
            name: { fr: 'Bois', en: 'Wood' },
            desc: { fr: 'Léger et maniable', en: 'Light and handy' },
            w: 52,
            h: 28,
            density: 0.004,
            friction: 0.75,
            frictionStatic: 0.9,
            restitution: 0.08,
            label: 'wood',
            color: '#c8956c',
            stroke: '#e8b898',
            glow: 'rgba(200, 149, 108, 0.5)',
            count: 8
        },
        stone: {
            icon: '🪨',
            name: { fr: 'Pierre', en: 'Stone' },
            desc: { fr: 'Lourd et stable', en: 'Heavy and stable' },
            w: 48,
            h: 32,
            density: 0.013,
            friction: 0.92,
            frictionStatic: 1.0,
            restitution: 0.02,
            label: 'stone',
            color: '#7a8590',
            stroke: '#9aa5b2',
            glow: 'rgba(122, 133, 144, 0.5)',
            count: 5
        },
        glass: {
            icon: '🧊',
            name: { fr: 'Verre', en: 'Glass' },
            desc: { fr: 'Fragile mais précis', en: 'Fragile but precise' },
            w: 44,
            h: 24,
            density: 0.0025,
            friction: 0.35,
            frictionStatic: 0.5,
            restitution: 0.25,
            label: 'glass',
            color: 'rgba(180, 220, 255, 0.7)',
            stroke: 'rgba(220, 240, 255, 0.9)',
            glow: 'rgba(180, 220, 255, 0.7)',
            count: 4,
            breakThreshold: 6
        },
        metal: {
            icon: '🔩',
            name: { fr: 'Métal', en: 'Metal' },
            desc: { fr: 'Très lourd, solide', en: 'Very heavy, solid' },
            w: 42,
            h: 22,
            density: 0.018,
            friction: 0.7,
            frictionStatic: 0.85,
            restitution: 0.04,
            label: 'metal',
            color: '#5a6a7a',
            stroke: '#8a9aaa',
            glow: 'rgba(90, 106, 122, 0.6)',
            count: 3
        },
        cardboard: {
            icon: '📦',
            name: { fr: 'Carton', en: 'Cardboard' },
            desc: { fr: 'Léger mais fragile', en: 'Light but fragile' },
            w: 54,
            h: 30,
            density: 0.0015,
            friction: 0.55,
            frictionStatic: 0.7,
            restitution: 0.15,
            label: 'cardboard',
            color: '#b8956e',
            stroke: '#d4b896',
            glow: 'rgba(184, 149, 110, 0.4)',
            count: 5,
            crumbleThreshold: 8
        },
        brick: {
            icon: '🧱',
            name: { fr: 'Brique', en: 'Brick' },
            desc: { fr: 'Équilibré, polyvalent', en: 'Balanced, versatile' },
            w: 46,
            h: 26,
            density: 0.007,
            friction: 0.8,
            frictionStatic: 0.9,
            restitution: 0.05,
            label: 'brick',
            color: '#a8543c',
            stroke: '#c87058',
            glow: 'rgba(168, 84, 60, 0.5)',
            count: 5
        }
    };

    // ===== DIALOGUES =====
    var DIALOGUES = {
        fr: [
            "Allez, doucement... comme un assemblage de souvenirs.",
            "La tour la plus haute cache la vérité la plus profonde.",
            "Chaque bloc compte. Même le plus petit.",
            "Le vent se lève. Tiens bon.",
            "Bien joué. Mais attention à ne pas trop haut.",
            "La physique ne ment jamais. Toi non plus.",
            "Empile avec soin. Le moindre choc peut tout faire tomber.",
            "Silas regarde. Il ne dira rien, mais il juge.",
            "Une tour, ça se mérite. Couche par couche.",
            "Le métal est lourd, mais il est honnête.",
            "Le verre est beau, mais il est dangereux.",
            "La pierre est froide, mais elle est vraie."
        ],
        en: [
            "Go on, gently... like assembling memories.",
            "The tallest tower hides the deepest truth.",
            "Every block counts. Even the smallest.",
            "The wind is rising. Hold steady.",
            "Well done. But beware of going too high.",
            "Physics never lies. Neither do you.",
            "Stack with care. The slightest shock can topple everything.",
            "Silas is watching. He won't say anything, but he's judging.",
            "A tower must be earned. Layer by layer.",
            "Metal is heavy, but it's honest.",
            "Glass is beautiful, but it's dangerous.",
            "Stone is cold, but it's true."
        ]
    };

    // ===== GAME STATE =====
    var canvas, ctx, cw, ch;
    var engine, world;
    var blocks = [];
    var particles = [];
    var platformBody;
    var groundY;
    var selectedBlock = 'wood';
    var blockCounts = {};
    var totalPlaced = 0;
    var gameOver = false;
    var won = false;
    var difficulty = 1;
    var lang = 'fr';
    var targetHeight = 0;
    var currentHeight = 0;
    var windForce = 0;
    var windTimer = null;
    var victoryTimer = null;
    var stableCheckTimer = null;
    var cameraY = 0;
    var targetCameraY = 0;
    var ghostPos = null;
    var animFrameId = null;
    var shakeAmount = 0;
    var shakeDuration = 0;
    var startTime = 0;
    var heightHistory = [];
    var placedBlockTypes = {};

    // ===== DOM REFS =====
    var $heightDisplay, $targetDisplay, $piecesDisplay;
    var $victoryOverlay, $defeatOverlay;
    var $windIndicator;
    var $paletteBtns;

    // ===== INIT =====
    function init() {
        canvas = document.getElementById('tower-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        $heightDisplay = document.getElementById('height-display');
        $targetDisplay = document.getElementById('target-display');
        $piecesDisplay = document.getElementById('pieces-display');
        $victoryOverlay = document.getElementById('victory-overlay');
        $defeatOverlay = document.getElementById('defeat-overlay');
        $windIndicator = document.getElementById('wind-indicator');
        $paletteBtns = document.querySelectorAll('.palette-btn');

        // Parse URL params for difficulty
        var params = new URLSearchParams(window.location.search);
        var diffParam = parseInt(params.get('difficulty'), 10);
        if (diffParam >= 1 && diffParam <= 3) difficulty = diffParam;
        var langParam = params.get('lang');
        if (langParam === 'en' || langParam === 'fr') lang = langParam;

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        setupPalette();
        setupControls();
        startGame();

        window.addEventListener('beforeunload', cleanup);
    }

    function resizeCanvas() {
        var container = document.getElementById('game-container');
        if (!container || !canvas) return;
        var rect = container.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        if (w <= 0 || h <= 0) return;

        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cw = w;
        ch = h;
        groundY = h - 60;

        if (engine) {
            updateBounds();
        }
    }

    function updateBounds() {
        if (!world) return;
        var wallOpts = { isStatic: true, friction: 0.3, restitution: 0.1, label: 'wall' };
        var bodies = Composite.allBodies(world);
        var walls = bodies.filter(function(b) { return b.label === 'wall'; });
        if (walls.length >= 2) {
            Body.setPosition(walls[0], { x: -30, y: ch / 2 });
            Body.setPosition(walls[1], { x: cw + 30, y: ch / 2 });
        }
        if (platformBody) {
            Body.setPosition(platformBody, { x: cw / 2, y: groundY });
        }
    }

    function setupPalette() {
        if (!$paletteBtns) return;
        $paletteBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var blockType = btn.dataset.block;
                if (blockType && blockCounts[blockType] > 0) {
                    selectBlock(blockType);
                }
            });
        });
    }

    function selectBlock(type) {
        if (!BLOCK_TYPES[type]) return;
        if (blockCounts[type] <= 0) return;
        selectedBlock = type;
        $paletteBtns.forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.block === type);
            if (btn.dataset.block === type && blockCounts[type] <= 0) {
                btn.classList.remove('active');
            }
        });
    }

    function setupControls() {
        if (!canvas) return;

        canvas.addEventListener('mousemove', function(e) {
            if (gameOver) return;
            var pos = getCanvasPos(e);
            ghostPos = { x: pos.x, y: Math.min(pos.y, groundY - 20) };
        });

        canvas.addEventListener('mouseleave', function() {
            ghostPos = null;
        });

        canvas.addEventListener('click', function(e) {
            if (gameOver) return;
            var pos = getCanvasPos(e);
            handlePlace(pos.x, pos.y);
        });

        canvas.addEventListener('touchstart', function(e) {
            if (gameOver) return;
            e.preventDefault();
            var pos = getCanvasPos(e);
            ghostPos = { x: pos.x, y: Math.min(pos.y, groundY - 20) };
            handlePlace(pos.x, pos.y);
        }, { passive: false });

        var backBtn = document.getElementById('back-to-game-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                cleanup();
                window.location.href = '../true-detective/index.html';
            });
        }

        var victoryBtn = document.getElementById('victory-continue-btn');
        if (victoryBtn) {
            victoryBtn.addEventListener('click', function() {
                cleanup();
                window.location.href = '../true-detective/index.html?marginalTower=complete';
            });
        }

        var defeatRetryBtn = document.getElementById('defeat-retry-btn');
        if (defeatRetryBtn) {
            defeatRetryBtn.addEventListener('click', function() {
                resetGame();
            });
        }

        var defeatContinueBtn = document.getElementById('defeat-continue-btn');
        if (defeatContinueBtn) {
            defeatContinueBtn.addEventListener('click', function() {
                cleanup();
                window.location.href = '../true-detective/index.html?marginalTower=complete';
            });
        }
    }

    function getCanvasPos(e) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = cw / rect.width;
        var scaleY = ch / rect.height;
        if (e.touches && e.touches.length) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    // ===== GAME FLOW =====
    function startGame() {
        var diffSettings = {
            1: { target: 280, pieces: { wood: 8, stone: 4, glass: 3, metal: 2, cardboard: 4, brick: 4 }, wind: false },
            2: { target: 380, pieces: { wood: 6, stone: 5, glass: 3, metal: 3, cardboard: 3, brick: 4 }, wind: true },
            3: { target: 500, pieces: { wood: 5, stone: 5, glass: 3, metal: 3, cardboard: 2, brick: 4 }, wind: true }
        };
        var settings = diffSettings[difficulty] || diffSettings[1];

        targetHeight = settings.target;
        blockCounts = JSON.parse(JSON.stringify(settings.pieces));
        windForce = settings.wind ? 0.0003 + difficulty * 0.0002 : 0;

        totalPlaced = 0;
        gameOver = false;
        won = false;
        blocks = [];
        particles = [];
        placedBlockTypes = {};
        heightHistory = [];
        cameraY = 0;
        targetCameraY = 0;
        shakeAmount = 0;
        shakeDuration = 0;
        ghostPos = null;
        startTime = Date.now();

        // Init engine
        engine = Engine.create({
            gravity: { x: 0, y: 1.6 }
        });
        world = engine.world;

        // Walls
        var wallOpts = { isStatic: true, friction: 0.3, restitution: 0.1, label: 'wall' };
        World.add(world, [
            Bodies.rectangle(-30, ch / 2, 60, ch * 3, wallOpts),
            Bodies.rectangle(cw + 30, ch / 2, 60, ch * 3, wallOpts)
        ]);

        // Platform
        platformBody = Bodies.rectangle(cw / 2, groundY, Math.min(cw * 0.7, 500), 16, {
            isStatic: true,
            friction: 0.9,
            restitution: 0.02,
            label: 'platform',
            chamfer: { radius: 4 }
        });
        World.add(world, platformBody);

        // Target zone marker (visual only)
        updateHUD();
        updatePaletteUI();
        hideOverlays();

        // Wind events
        if (windForce > 0) {
            startWind();
        }

        // Start loop
        if (animFrameId) cancelAnimationFrame(animFrameId);
        loop();

        // Stability check
        if (stableCheckTimer) clearInterval(stableCheckTimer);
        stableCheckTimer = setInterval(checkGameState, 600);
    }

    function resetGame() {
        cleanup();
        startGame();
    }

    function handlePlace(x, y) {
        if (gameOver) return;
        if (!blockCounts[selectedBlock] || blockCounts[selectedBlock] <= 0) return;

        var bt = BLOCK_TYPES[selectedBlock];
        if (!bt) return;

        var placeY = Math.min(y, groundY - bt.h);
        placeY = Math.max(placeY, 40);

        var body = Bodies.rectangle(x, placeY, bt.w, bt.h, {
            density: bt.density,
            friction: bt.friction,
            frictionStatic: bt.frictionStatic,
            restitution: bt.restitution,
            label: bt.label,
            chamfer: { radius: 3 },
            blockType: selectedBlock
        });

        // Add slight random angle for natural feel
        Body.setAngle(body, (Math.random() - 0.5) * 0.06);

        World.add(world, body);
        blocks.push(body);
        blockCounts[selectedBlock]--;
        totalPlaced++;
        placedBlockTypes[selectedBlock] = (placedBlockTypes[selectedBlock] || 0) + 1;

        // Update counts
        updatePaletteUI();
        updateHUD();

        // Spawn placement particles
        spawnParticles(x, placeY + bt.h / 2, 6, bt.color);

        // If no more of this type, switch to next available
        if (blockCounts[selectedBlock] <= 0) {
            selectNextAvailable();
        }

        // Screen shake on heavy blocks
        if (bt.density > 0.01) {
            shakeAmount = Math.min(bt.density * 800, 6);
            shakeDuration = 200;
        }
    }

    function selectNextAvailable() {
        var types = Object.keys(blockCounts);
        for (var i = 0; i < types.length; i++) {
            if (blockCounts[types[i]] > 0) {
                selectBlock(types[i]);
                return;
            }
        }
        selectedBlock = null;
        $paletteBtns.forEach(function(btn) { btn.classList.remove('active'); });
    }

    // ===== PHYSICS =====
    function startWind() {
        if (windTimer) clearInterval(windTimer);
        windTimer = setInterval(function() {
            if (gameOver || !world) return;
            var intensity = windForce * (1 + Math.random() * 0.5);
            var bodies = Composite.allBodies(world);
            for (var i = 0; i < bodies.length; i++) {
                var b = bodies[i];
                if (b.isStatic || b.label === 'wall' || b.label === 'platform') continue;
                var heightFactor = Math.max(0, (groundY - b.position.y) / groundY);
                Body.applyForce(b, b.position, { x: intensity * (1 + heightFactor * 1.5), y: 0 });
            }
        }, 2000 + Math.random() * 2000);
    }

    var loseChecked = false;

    function checkGameState() {
        if (gameOver || !blocks.length) return;

        var onPlatform = 0;
        var maxY = Infinity;
        var minSpeed = Infinity;

        for (var i = 0; i < blocks.length; i++) {
            var b = blocks[i];
            if (!b || !b.position) continue;
            if (b.position.y < ch + 50 && b.position.y > -50 &&
                b.position.x > -50 && b.position.x < cw + 50) {
                onPlatform++;
                if (b.position.y < maxY) maxY = b.position.y;
            }
            var speed = b.speed || 0;
            if (speed < minSpeed) minSpeed = speed;
        }

        currentHeight = Math.max(0, groundY - maxY);
        heightHistory.push(currentHeight);
        if (heightHistory.length > 30) heightHistory.shift();

        targetCameraY = Math.max(0, currentHeight - ch * 0.4);
        cameraY += (targetCameraY - cameraY) * 0.04;

        updateHUD();

        // Win: reach target height and stay stable
        if (currentHeight >= targetHeight && onPlatform > 0) {
            var recentStable = true;
            for (var j = Math.max(0, heightHistory.length - 12); j < heightHistory.length; j++) {
                if (heightHistory[j] < targetHeight * 0.85) {
                    recentStable = false;
                    break;
                }
            }
            if (recentStable && minSpeed < 1.5) {
                if (!victoryTimer) {
                    victoryTimer = setTimeout(function() {
                        victoryTimer = null;
                        endGame(true);
                    }, 1800);
                }
                return;
            }
        }

        if (victoryTimer) {
            clearTimeout(victoryTimer);
            victoryTimer = null;
        }

        // Lose: more than 75% of blocks fallen and all pieces placed, tower too short
        if (!loseChecked && totalPlaced > 0) {
            var allPlaced = true;
            for (var type in blockCounts) {
                if (blockCounts.hasOwnProperty(type) && blockCounts[type] > 0) {
                    allPlaced = false;
                    break;
                }
            }
            if (allPlaced && onPlatform < blocks.length * 0.25 && currentHeight < targetHeight * 0.6) {
                loseChecked = true;
                setTimeout(function() {
                    if (!gameOver) endGame(false);
                }, 1200);
            }
        }
    }

    function endGame(w) {
        if (gameOver) return;
        gameOver = true;
        won = w;
        if (windTimer) { clearInterval(windTimer); windTimer = null; }
        if (stableCheckTimer) { clearInterval(stableCheckTimer); stableCheckTimer = null; }
        if (victoryTimer) { clearTimeout(victoryTimer); victoryTimer = null; }

        setTimeout(function() {
            if (won) {
                if ($victoryOverlay) $victoryOverlay.classList.remove('hidden');
            } else {
                if ($defeatOverlay) $defeatOverlay.classList.remove('hidden');
            }
        }, 600);
    }

    function hideOverlays() {
        if ($victoryOverlay) $victoryOverlay.classList.add('hidden');
        if ($defeatOverlay) $defeatOverlay.classList.add('hidden');
    }

    function cleanup() {
        gameOver = true;
        won = false;
        if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
        if (windTimer) { clearInterval(windTimer); windTimer = null; }
        if (stableCheckTimer) { clearInterval(stableCheckTimer); stableCheckTimer = null; }
        if (victoryTimer) { clearTimeout(victoryTimer); victoryTimer = null; }
        if (engine && world) {
            try {
                World.clear(world);
                Engine.clear(engine);
            } catch (e) {}
            engine = null;
            world = null;
        }
        blocks = [];
        particles = [];
        selectedBlock = 'wood';
        blockCounts = {};
        totalPlaced = 0;
        ghostPos = null;
        cameraY = 0;
        targetCameraY = 0;
        shakeAmount = 0;
        shakeDuration = 0;
        heightHistory = [];
        placedBlockTypes = {};
        if ($paletteBtns) {
            $paletteBtns.forEach(function(btn) { btn.classList.remove('active'); });
        }
    }

    // ===== RENDERING =====
    function loop() {
        if (!engine || !world) return;
        Engine.update(engine, 1000 / 60);

        // Update particles
        updateParticles();

        // Screen shake
        var shakeX = 0, shakeY = 0;
        if (shakeDuration > 0) {
            shakeX = (Math.random() - 0.5) * shakeAmount;
            shakeY = (Math.random() - 0.5) * shakeAmount;
            shakeDuration -= 16;
            if (shakeDuration <= 0) { shakeAmount = 0; shakeDuration = 0; }
        }

        // Clear
        ctx.save();
        ctx.translate(shakeX, shakeY);

        // Background
        drawBackground();

        // Camera transform
        ctx.save();
        ctx.translate(0, -cameraY);

        // Target zone
        drawTargetZone();

        // Platform
        drawPlatform();

        // Blocks
        for (var i = 0; i < blocks.length; i++) {
            drawBlock(blocks[i]);
        }

        // Particles
        drawParticles();

        ctx.restore();

        // Ghost preview
        drawGhost();

        // Wind indicator
        updateWindIndicator();

        ctx.restore();

        // Check for broken glass / crumbled cardboard
        checkBlockIntegrity();

        animFrameId = requestAnimationFrame(loop);
    }

    function drawBackground() {
        var grad = ctx.createLinearGradient(0, 0, 0, ch);
        grad.addColorStop(0, '#080c14');
        grad.addColorStop(0.5, '#0a1018');
        grad.addColorStop(1, '#060a10');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);

        // Grid lines
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
        ctx.lineWidth = 1;
        var gridSize = 40;
        for (var x = 0; x < cw; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
        }
        for (var y = 0; y < ch; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
        }

        // Height ruler
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.font = '9px Montserrat, sans-serif';
        ctx.textAlign = 'left';
        for (var h = 0; h < targetHeight + 100; h += 50) {
            var sy = groundY - h - cameraY;
            if (sy < -20 || sy > ch + 20) continue;
            ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(cw, sy); ctx.stroke();
            ctx.fillText(h + 'm', 6, sy - 3);
        }
    }

    function drawTargetZone() {
        if (targetHeight <= 0) return;
        var y = groundY - targetHeight;

        // Glowing band
        ctx.strokeStyle = 'rgba(255, 214, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = 'rgba(255, 214, 0, 0.85)';
        ctx.font = 'bold 11px Montserrat, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('OBJECTIF', cw - 12, y - 8);

        // Glow effect
        var glowGrad = ctx.createLinearGradient(0, y - 20, 0, y + 20);
        glowGrad.addColorStop(0, 'rgba(255, 214, 0, 0)');
        glowGrad.addColorStop(0.5, 'rgba(255, 214, 0, 0.04)');
        glowGrad.addColorStop(1, 'rgba(255, 214, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, y - 20, cw, 40);
    }

    function drawPlatform() {
        if (!platformBody) return;
        var px = platformBody.position.x;
        var py = platformBody.position.y;
        var pw = platformBody.bounds.max.x - platformBody.bounds.min.x;
        var ph = 16;

        ctx.save();
        ctx.translate(px, py);

        // Platform body
        ctx.fillStyle = '#141c28';
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
        ctx.lineWidth = 2;
        roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 4);
        ctx.fill();
        ctx.stroke();

        // Top highlight
        ctx.fillStyle = 'rgba(0, 212, 255, 0.08)';
        ctx.fillRect(-pw / 2 + 2, -ph / 2 + 1, pw - 4, 3);

        ctx.restore();
    }

    function drawBlock(body) {
        if (!body || !body.position) return;
        var bt = BLOCK_TYPES[body.blockType] || BLOCK_TYPES.wood;
        var w = bt.w;
        var h = bt.h;
        var x = body.position.x;
        var y = body.position.y;
        var angle = body.angle || 0;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Glow
        ctx.shadowColor = bt.glow;
        ctx.shadowBlur = 8;

        // Body
        ctx.fillStyle = bt.color;
        ctx.strokeStyle = bt.stroke;
        ctx.lineWidth = 1.5;
        roundRect(ctx, -w / 2, -h / 2, w, h, 3);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(-w / 2 + 2, -h / 2 + 2, w - 4, 3);

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '8px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bt.icon, 0, 0);

        ctx.restore();
    }

    function drawGhost() {
        if (!ghostPos || gameOver || !selectedBlock) return;
        if (!blockCounts[selectedBlock] || blockCounts[selectedBlock] <= 0) return;
        var bt = BLOCK_TYPES[selectedBlock];
        if (!bt) return;

        var x = ghostPos.x;
        var y = Math.min(ghostPos.y, groundY - bt.h);
        y = Math.max(y, 40);

        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.translate(x, y);
        ctx.fillStyle = bt.color;
        ctx.strokeStyle = bt.stroke;
        ctx.lineWidth = 1.5;
        roundRect(ctx, -bt.w / 2, -bt.h / 2, bt.w, bt.h, 3);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function drawParticles() {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function spawnParticles(x, y, count, color) {
        for (var i = 0; i < count; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 3 - 1,
                size: Math.random() * 2.5 + 1,
                life: 1,
                decay: 0.02 + Math.random() * 0.03,
                color: color || '#00d4ff'
            });
        }
        if (particles.length > 120) {
            particles = particles.slice(particles.length - 120);
        }
    }

    function updateParticles() {
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.life -= p.decay;
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    function updateWindIndicator() {
        if (!$windIndicator) return;
        if (windForce > 0 && !gameOver) {
            $windIndicator.classList.remove('hidden');
        } else {
            $windIndicator.classList.add('hidden');
        }
    }

    function checkBlockIntegrity() {
        for (var i = blocks.length - 1; i >= 0; i--) {
            var b = blocks[i];
            if (!b || !b.position) continue;
            var bt = BLOCK_TYPES[b.blockType];
            if (!bt) continue;

            // Glass breaks on high impact
            if (bt.breakThreshold && (b.speed > bt.breakThreshold || Math.abs(b.angularSpeed) > 0.3)) {
                spawnParticles(b.position.x, b.position.y, 15, bt.stroke);
                World.remove(world, b);
                blocks.splice(i, 1);
                shakeAmount = Math.max(shakeAmount, 4);
                shakeDuration = Math.max(shakeDuration, 250);
                continue;
            }

            // Cardboard crumbles on sustained shaking
            if (bt.crumbleThreshold && b.speed > bt.crumbleThreshold) {
                spawnParticles(b.position.x, b.position.y, 8, bt.color);
                World.remove(world, b);
                blocks.splice(i, 1);
                continue;
            }
        }
    }

    // ===== HUD =====
    function updateHUD() {
        var heightM = Math.max(0, Math.round(currentHeight / 10));
        var targetM = Math.max(0, Math.round(targetHeight / 10));

        if ($heightDisplay) {
            $heightDisplay.querySelector('.tower-hud-value').textContent = heightM + 'm';
            if (currentHeight >= targetHeight) {
                $heightDisplay.classList.add('highlight');
            } else {
                $heightDisplay.classList.remove('highlight');
            }
        }
        if ($targetDisplay) {
            $targetDisplay.querySelector('.tower-hud-value').textContent = targetM + 'm';
        }
        if ($piecesDisplay) {
            var remaining = 0;
            for (var type in blockCounts) {
                if (blockCounts.hasOwnProperty(type)) remaining += blockCounts[type];
            }
            $piecesDisplay.querySelector('.tower-hud-value').textContent = remaining + '/' + totalPlaced + remaining;
        }
    }

    function updatePaletteUI() {
        if (!$paletteBtns) return;
        $paletteBtns.forEach(function(btn) {
            var type = btn.dataset.block;
            var countEl = btn.querySelector('.palette-count');
            if (countEl && blockCounts.hasOwnProperty(type)) {
                countEl.textContent = 'x' + blockCounts[type];
            }
            if (type === selectedBlock && blockCounts[type] > 0) {
                btn.classList.add('active');
            } else if (blockCounts[type] <= 0) {
                btn.classList.remove('active');
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }
        });
    }

    // ===== UTILS =====
    function roundRect(ctx, x, y, w, h, r) {
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

    // ===== START =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);
