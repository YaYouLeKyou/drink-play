/* =====================================================================
    TRUE DETECTIVE - SPACE INVADERS (Standalone)
    Enhanced with particles, starfield, and improved visuals.
    ===================================================================== */
(function (global) {
    'use strict';

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var level = parseInt(params.get('level') || '1', 10);
        if (isNaN(level) || level < 1) level = 1;
        if (level > 3) level = 3;
        var diff = level;
        if (diff < 1 || diff > 3) diff = 1;

        var canvas = document.getElementById('si-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var $info = document.getElementById('si-info');

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

        var rows = 3 + diff;
        var cols = 4 + diff;
        var cellW = 30;
        var cellH = 20;
        var invaders = [];
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                invaders.push({ x: 50 + c * (cellW + 10), y: 40 + r * (cellH + 10), alive: true, frame: 0 });
            }
        }

        var playerX = cw / 2;
        var bullets = [];
        var particles = [];
        var stars = [];
        var score = 0;
        var lives = 3;
        var gameOver = false;
        var dir = 1;
        var moveTimer = 0;
        var shakeTimer = 0;
        var shakeIntensity = 0;

        for (var s = 0; s < 80; s++) {
            stars.push({
                x: Math.random() * 2000,
                y: Math.random() * 2000,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.1
            });
        }

        document.addEventListener('keydown', function (e) {
            if (gameOver) return;
            if (e.key === 'ArrowLeft') playerX -= 20;
            if (e.key === 'ArrowRight') playerX += 20;
            if (e.key === ' ') {
                bullets.push({ x: playerX, y: ch - 30, vx: 0, vy: -7, trail: [] });
            }
            playerX = Math.max(20, Math.min(cw - 20, playerX));
        });

        function spawnParticles(x, y, color, count) {
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    life: 30 + Math.random() * 20,
                    color: color,
                    size: Math.random() * 3 + 1
                });
            }
        }

        function triggerShake(intensity) {
            shakeTimer = 10;
            shakeIntensity = intensity;
        }

        function update() {
            if (gameOver) return;
            moveTimer++;
            if (moveTimer > Math.max(10, 30 - diff * 5)) {
                moveTimer = 0;
                var down = false;
                for (var i = 0; i < invaders.length; i++) {
                    if (!invaders[i].alive) continue;
                    invaders[i].x += dir * (6 + diff);
                    invaders[i].frame = 1 - invaders[i].frame;
                    if (invaders[i].x <= 10 || invaders[i].x >= cw - 10) down = true;
                }
                if (down) {
                    dir *= -1;
                    for (var i = 0; i < invaders.length; i++) {
                        if (invaders[i].alive) invaders[i].y += 12;
                        if (invaders[i].y >= ch - 50) {
                            gameOver = true;
                            triggerShake(8);
                            if ($info) $info.textContent = lang === 'fr' ? 'Game Over !' : 'Game Over!';
                            setTimeout(function () {
                                try {
                                    localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'space-invaders', won: false, ts: Date.now() }));
                                } catch (e) {}
                                var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                                window.location.href = fromStory ? '../true-detective/index.html?standalone=space-invaders' : '../true-detective/index.html#minigames';
                            }, 1500);
                            return;
                        }
                    }
                }
            }

            for (var b = bullets.length - 1; b >= 0; b--) {
                bullets[b].y += bullets[b].vy;
                if (bullets[b].trail) {
                    bullets[b].trail.push({ x: bullets[b].x, y: bullets[b].y, life: 8 });
                }
                if (bullets[b].y < 0) { bullets.splice(b, 1); continue; }
                for (var i = 0; i < invaders.length; i++) {
                    if (!invaders[i].alive) continue;
                    if (Math.abs(bullets[b].x - (invaders[i].x + cellW / 2)) < cellW / 2 &&
                        Math.abs(bullets[b].y - (invaders[i].y + cellH / 2)) < cellH / 2) {
                        invaders[i].alive = false;
                        spawnParticles(invaders[i].x + cellW / 2, invaders[i].y + cellH / 2, '#ff006e', 12);
                        triggerShake(4);
                        bullets.splice(b, 1);
                        score += 10;
                        break;
                    }
                }
            }

            for (var i = particles.length - 1; i >= 0; i--) {
                particles[i].x += particles[i].vx;
                particles[i].y += particles[i].vy;
                particles[i].life--;
                if (particles[i].life <= 0) particles.splice(i, 1);
            }

            for (var b = bullets.length - 1; b >= 0; b--) {
                if (!bullets[b].trail) continue;
                for (var t = bullets[b].trail.length - 1; t >= 0; t--) {
                    bullets[b].trail[t].life--;
                    if (bullets[b].trail[t].life <= 0) bullets[b].trail.splice(t, 1);
                }
            }

            if (shakeTimer > 0) shakeTimer--;

            for (var s = 0; s < stars.length; s++) {
                stars[s].y += stars[s].speed;
                if (stars[s].y > ch) {
                    stars[s].y = 0;
                    stars[s].x = Math.random() * cw;
                }
            }

            var allDead = invaders.every(function (inv) { return !inv.alive; });
            if (allDead) {
                gameOver = true;
                if ($info) $info.textContent = lang === 'fr' ? 'Victoire !' : 'Victory!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'space-invaders', won: true, ts: Date.now() }));
                    } catch (e) {}
                    var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                    window.location.href = fromStory ? '../true-detective/index.html?standalone=space-invaders' : '../true-detective/index.html#minigames';
                }, 1000);
            }

            if ($info) $info.textContent = (lang === 'fr' ? 'Score' : 'Score') + ': ' + score + ' | ' + (lang === 'fr' ? 'Vies' : 'Lives') + ': ' + lives;
        }

        function drawInvader(x, y, w, h, frame) {
            ctx.fillStyle = '#ff006e';
            var bodyW = w * 0.6;
            var bodyH = h * 0.5;
            var bodyX = x + (w - bodyW) / 2;
            var bodyY = y + h * 0.3;
            ctx.fillRect(bodyX, bodyY, bodyW, bodyH);

            ctx.fillStyle = '#ffb3d9';
            var eyeSize = w * 0.12;
            var eyeY = y + h * 0.35;
            ctx.fillRect(x + w * 0.25 - eyeSize / 2, eyeY, eyeSize, eyeSize);
            ctx.fillRect(x + w * 0.75 - eyeSize / 2, eyeY, eyeSize, eyeSize);

            var legOffset = frame === 0 ? 0 : 3;
            ctx.fillStyle = '#ff006e';
            ctx.fillRect(x + w * 0.15, y + h * 0.75, w * 0.15, h * 0.25 + legOffset);
            ctx.fillRect(x + w * 0.7, y + h * 0.75, w * 0.15, h * 0.25 - legOffset);

            ctx.fillStyle = '#00d4ff';
            ctx.fillRect(x + w * 0.35, y + h * 0.15, w * 0.3, h * 0.12);
        }

        function draw() {
            ctx.save();
            if (shakeTimer > 0) {
                var sx = (Math.random() - 0.5) * shakeIntensity;
                var sy = (Math.random() - 0.5) * shakeIntensity;
                ctx.translate(sx, sy);
            }

            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(-10, -10, cw + 20, ch + 20);

            ctx.fillStyle = '#ffffff';
            for (var s = 0; s < stars.length; s++) {
                ctx.globalAlpha = 0.4 + stars[s].size / 3;
                ctx.fillRect(stars[s].x, stars[s].y, stars[s].size, stars[s].size);
            }
            ctx.globalAlpha = 1;

            for (var i = 0; i < invaders.length; i++) {
                if (!invaders[i].alive) continue;
                drawInvader(invaders[i].x, invaders[i].y, cellW, cellH, invaders[i].frame);
            }

            ctx.fillStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 10;
            ctx.fillRect(playerX - 15, ch - 30, 30, 10);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#ffd600';
            ctx.shadowColor = '#ffd600';
            ctx.shadowBlur = 8;
            for (var b = 0; b < bullets.length; b++) {
                ctx.fillRect(bullets[b].x - 2, bullets[b].y, 4, 10);
                if (bullets[b].trail) {
                    ctx.globalAlpha = 0.4;
                    for (var t = 0; t < bullets[b].trail.length; t++) {
                        var trail = bullets[b].trail[t];
                        ctx.globalAlpha = trail.life / 8 * 0.5;
                        ctx.fillRect(trail.x - 1, trail.y, 2, 6);
                    }
                    ctx.globalAlpha = 1;
                }
            }
            ctx.shadowBlur = 0;

            for (var p = 0; p < particles.length; p++) {
                var particle = particles[p];
                ctx.globalAlpha = particle.life / 50;
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
            }
            ctx.globalAlpha = 1;

            ctx.restore();
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

})(typeof globalThis !== 'undefined' ? globalThis : this);
