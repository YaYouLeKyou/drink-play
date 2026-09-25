/* =====================================================================
    TRUE DETECTIVE - MISSILE COMMAND (Standalone)
    Enhanced with cities, missiles, and explosion effects.
    ===================================================================== */
(function (global) {
    'use strict';

    /* Audio bridge for mini-game */
    function playSfx(name, opts) {
        try { if (window.TDSfx) window.TDSfx.play(name, opts); } catch (e) {}
    }
    function playMinigameMusic(type) {
        try { if (window.TDAudioService && window.TDAudioService.playMinigameMusic) window.TDAudioService.playMinigameMusic(type); } catch (e) {}
    }


    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var level = parseInt(params.get('level') || '1', 10);
        if (isNaN(level) || level < 1) level = 1;
        if (level > 3) level = 3;
        var diff = level;
        if (diff < 1 || diff > 3) diff = 1;

        var canvas = document.getElementById('mc-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var $info = document.getElementById('mc-info');

        var cw, ch;
        function resize() {
            var rect = canvas.getBoundingClientRect();
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            cw = rect.width;
            ch = rect.height;
            canvas.width = cw * dpr;
            canvas.height = ch * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        // Game variables
        var cities = [];
        var incomingMissiles = [];
        var defenderMissiles = [];
        var explosions = [];
        var score = 0;
        var gameOver = false;
        var wave = 1;
        var waveTimer = 0;
        var missilesPerWave = 5 + (diff * 2);
        var missilesLaunched = 0;
        var baseY = ch - 50;
        var cityWidth = 30;
        var cityHeight = 20;
        var citySpacing = 40;

        // Create cities
        var startX = (cw - (citySpacing * 5 + cityWidth)) / 2;
        for (var i = 0; i < 6; i++) {
            cities.push({
                x: startX + i * citySpacing,
                y: baseY,
                width: cityWidth,
                height: cityHeight,
                destroyed: false
            });
        }

        // Create crosshair (mouse controlled)
        var crosshair = { x: cw / 2, y: ch / 2 };

        // Setup event listeners
        canvas.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            crosshair.x = (e.clientX - rect.left) * (canvas.width / rect.width);
            crosshair.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        });

        canvas.addEventListener('click', function (e) {
            if (gameOver) return;
            var rect = canvas.getBoundingClientRect();
            var targetX = (e.clientX - rect.left) * (canvas.width / rect.width);
            var targetY = (e.clientY - rect.top) * (canvas.height / rect.height);
            
            // Launch missile from base
            defenderMissiles.push({
                x: cw / 2,
                y: baseY,
                targetX: targetX,
                targetY: targetY,
                speed: 5 + (diff * 0.5),
                arrived: false
            });
        });

        // Touch controls for mobile
        var touchX = cw / 2, touchY = ch / 2;
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (e.touches.length > 0) {
                var touch = e.touches[0];
                var rect = canvas.getBoundingClientRect();
                touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
                touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);
            }
        }, { passive: false });

        canvas.addEventListener('touchend', function (e) {
            if (gameOver) return;
            if (e.changedTouches.length > 0) {
                var touch = e.changedTouches[0];
                var rect = canvas.getBoundingClientRect();
                var targetX = (touch.clientX - rect.left) * (canvas.width / rect.width);
                var targetY = (touch.clientY - rect.top) * (canvas.height / rect.height);
                
                defenderMissiles.push({
                    x: cw / 2,
                    y: baseY,
                    targetX: targetX,
                    targetY: targetY,
                    speed: 5 + (diff * 0.5),
                    arrived: false
                });
            }
        });

        function createExplosion(x, y) {
            explosions.push({
                x: x,
                y: y,
                radius: 0,
                maxRadius: 30 + (diff * 5),
                life: 20
            });
        }

        function update() {
            if (gameOver) return;

            // Update wave timer
            waveTimer++;
            if (waveTimer > 180 && missilesLaunched < missilesPerWave) { // Launch new missile every ~3 seconds
                waveTimer = 0;
                if (missilesLaunched < missilesPerWave) {
                    missilesLaunched++;
                    incomingMissiles.push({
                        x: Math.random() * cw,
                        y: -20,
                        targetX: Math.random() * cw,
                        targetY: baseY + Math.random() * 100,
                        speed: 2 + (diff * 0.5),
                        exploded: false
                    });
                }
            }

            // Start new wave when all missiles processed
            if (missilesLaunched >= missilesPerWave && incomingMissiles.length === 0 && defenderMissiles.length === 0 && explosions.length === 0) {
                wave++;
                missilesLaunched = 0;
                waveTimer = 0;
                // Repair one destroyed city every 3 waves
                if (wave % 3 === 0) {
                    for (var i = 0; i < cities.length; i++) {
                        if (cities[i].destroyed) {
                            cities[i].destroyed = false;
                            break;
                        }
                    }
                }
                // Game over if all cities destroyed
                if (cities.every(function(c) { return c.destroyed; })) {
                    gameOver = true;
                    triggerGameOver(false);
                }
            }

            // Update incoming missiles
            for (var i = incomingMissiles.length - 1; i >= 0; i--) {
                var m = incomingMissiles[i];
                var dx = m.targetX - m.x;
                var dy = m.targetY - m.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < m.speed) {
                    m.x = m.targetX;
                    m.y = m.targetY;
                } else {
                    m.x += (dx / dist) * m.speed;
                    m.y += (dy / dist) * m.speed;
                }

                // Check if missile reached target area
                if (m.y > baseY - 50 && !m.exploded) {
                    m.exploded = true;
                    createExplosion(m.x, m.y);
                    
                    // Check if hit a city
                    for (var j = 0; j < cities.length; j++) {
                        var city = cities[j];
                        if (!city.destroyed &&
                            m.x > city.x && 
                            m.x < city.x + city.width &&
                            m.y > city.y && 
                            m.y < city.y + city.height) {
                            city.destroyed = true;
                            playSfx('explosion');
                            break;
                        }
                    }
                }
            }

            // Update defender missiles
            for (var i = defenderMissiles.length - 1; i >= 0; i--) {
                var m = defenderMissiles[i];
                var dx = m.targetX - m.x;
                var dy = m.targetY - m.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < m.speed) {
                    m.x = m.targetX;
                    m.y = m.targetY;
                    m.arrived = true;
                } else {
                    m.x += (dx / dist) * m.speed;
                    m.y += (dy / dist) * m.speed;
                }

                // Check collision with incoming missiles
                if (m.arrived) {
                    for (var j = incomingMissiles.length - 1; j >= 0; j--) {
                        var im = incomingMissiles[j];
                        var dx = im.x - m.x;
                        var dy = im.y - m.y;
                        var dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < 20) { // Collision radius
                            incomingMissiles.splice(j, 1);
                            defenderMissiles.splice(i, 1);
                            createExplosion(m.x, m.y);
                            score += 100;
                            playSfx('explosion');
                            break;
                        }
                    }
                }

                // Remove if off target too long
                if (m.arrived && waveTimer > 60) {
                    defenderMissiles.splice(i, 1);
                }
            }

            // Update explosions
            for (var i = explosions.length - 1; i >= 0; i--) {
                var e = explosions[i];
                e.radius += 2;
                e.life--;
                if (e.life <= 0) {
                    explosions.splice(i, 1);
                }
            }
        }

        function triggerGameOver(won) {
            gameOver = true;
            if (window.TDStoryChrome) {
                window.TDStoryChrome.trigger(won ? 'victory' : 'defeat', { value: score });
            }
            setTimeout(function () {
                try {
                    localStorage.setItem('td_standalone_game_result', JSON.stringify({ 
                        type: 'missile-command', 
                        won: won, 
                        ts: Date.now() 
                    }));
                } catch (e) {}
                var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                window.location.href = fromStory ? 
                    '../true-detective/index.html?standalone=missile-command' : 
                    '../true-detective/index.html#minigames';
            }, 1500);
        }

        function draw() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, cw, ch);

            // Draw stars
            for (var i = 0; i < 50; i++) {
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = Math.random() * 0.5 + 0.5;
                ctx.fillRect(Math.random() * cw, Math.random() * ch, 1, 1);
                ctx.globalAlpha = 1;
            }

            // Draw cities
            for (var i = 0; i < cities.length; i++) {
                var city = cities[i];
                if (city.destroyed) {
                    ctx.fillStyle = '#555555';
                    ctx.fillRect(city.x, city.y, city.width, city.height);
                    ctx.fillStyle = '#880000';
                    ctx.fillRect(city.x + 5, city.y + 5, city.width - 10, city.height - 10);
                } else {
                    ctx.fillStyle = '#008800';
                    ctx.fillRect(city.x, city.y, city.width, city.height);
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(city.x + 2, city.y + 2, city.width - 4, city.height - 4);
                }
            }

            // Draw incoming missiles
            ctx.fillStyle = '#ff0000';
            for (var i = 0; i < incomingMissiles.length; i++) {
                var m = incomingMissiles[i];
                ctx.beginPath();
                ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw trail
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x - (m.targetX - m.x) * 0.2, m.y - (m.targetY - m.y) * 0.2);
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw defender missiles
            ctx.fillStyle = '#0000ff';
            for (var i = 0; i < defenderMissiles.length; i++) {
                var m = defenderMissiles[i];
                ctx.beginPath();
                ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw line to target
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.targetX, m.targetY);
                ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw explosions
            for (var i = 0; i < explosions.length; i++) {
                var e = explosions[i];
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 165, 0, ' + (e.life / 20) + ')';
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.radius * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 69, 0, ' + (e.life / 20) + ')';
                ctx.fill();
            }

            // Draw crosshair
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(crosshair.x - 10, crosshair.y);
            ctx.lineTo(crosshair.x + 10, crosshair.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(crosshair.x, crosshair.y - 10);
            ctx.lineTo(crosshair.x, crosshair.y + 10);
            ctx.stroke();

            // Draw base
            ctx.fillStyle = '#888888';
            ctx.fillRect(cw / 2 - 15, baseY - 10, 30, 10);
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(cw / 2, baseY - 10, 8, 0, Math.PI * 2);
            ctx.fill();

            // Draw HUD
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(10, 10, 200, 60);
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.fillText('Score: ' + score, 20, 30);
            ctx.fillText('Vague: ' + wave, 20, 50);

            // Game over screen
            if (gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                ctx.fillRect(0, 0, cw, ch);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                
                if (cities.every(function(c) { return c.destroyed; })) {
                    ctx.fillText('GAME OVER', cw / 2, ch / 2 - 20);
                    ctx.fillText('Toutes les villes détruites', cw / 2, ch / 2 + 20);
                } else {
                    ctx.fillText('VICTOIRE', cw / 2, ch / 2 - 20);
                    ctx.fillText('Vague ' + wave + ' atteinte', cw / 2, ch / 2 + 20);
                }
                
                ctx.font = '16px Arial';
                ctx.fillText('Appuyez sur l\'écran pour continuer', cw / 2, ch / 2 + 60);
            }
        }

        function loop() {
            update();
            draw();
            requestAnimationFrame(loop);
        }

        loop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose globally for standalone detection
    global.TDMissileCommand = { play: function(cfg, lang, onDone, target) {
        // This is a simplified exposure - the actual game runs in standalone mode
        // For interrogation mode, we'd need to adapt this
        if (typeof window !== 'undefined' && window.TDMissileGame) {
            window.TDMissileGame.play(cfg, lang, onDone, target);
        } else {
            onDone({ won: false });
        }
    }};
})(typeof globalThis !== 'undefined' ? globalThis : this);