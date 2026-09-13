/* =====================================================================
    TRUE DETECTIVE - ASTEROIDS (Standalone)
    Enhanced with particles, thrust flame, and improved visuals.
    ===================================================================== */
(function (global) {
    'use strict';

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
        if (diff < 1 || diff > 3) diff = 1;

        var canvas = document.getElementById('asteroids-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var $info = document.getElementById('asteroids-info');

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

        var ship = { x: cw / 2, y: ch / 2, vx: 0, vy: 0, angle: -Math.PI / 2 };
        var bullets = [];
        var asteroids = [];
        var particles = [];
        var stars = [];
        var score = 0;
        var lives = 3;
        var gameOver = false;
        var keys = {};
        var invulnerable = 0;

        for (var i = 0; i < 4 + diff * 2; i++) {
            asteroids.push({
                x: Math.random() * cw,
                y: Math.random() * ch,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 15 + Math.random() * 15
            });
        }

        for (var s = 0; s < 60; s++) {
            stars.push({
                x: Math.random() * 2000,
                y: Math.random() * 2000,
                size: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.3 + 0.1
            });
        }

        document.addEventListener('keydown', function (e) { keys[e.key] = true; });
        document.addEventListener('keyup', function (e) { keys[e.key] = false; });

        function spawnParticles(x, y, color, count) {
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    life: 30 + Math.random() * 20,
                    color: color,
                    size: Math.random() * 3 + 1
                });
            }
        }

        function update() {
            if (gameOver) return;
            if (keys['ArrowLeft'] || keys['a']) ship.angle -= 0.08;
            if (keys['ArrowRight'] || keys['d']) ship.angle += 0.08;
            if (keys['ArrowUp'] || keys['w']) {
                ship.vx += Math.cos(ship.angle) * 0.1;
                ship.vy += Math.sin(ship.angle) * 0.1;
                if (Math.random() < 0.3) {
                    spawnParticles(
                        ship.x - Math.cos(ship.angle) * 10,
                        ship.y - Math.sin(ship.angle) * 10,
                        '#ff8800',
                        1
                    );
                }
            }
            if (keys[' ']) {
                bullets.push({ x: ship.x + Math.cos(ship.angle) * 15, y: ship.y + Math.sin(ship.angle) * 15, vx: Math.cos(ship.angle) * 6, vy: Math.sin(ship.angle) * 6, life: 60 });
            }

            ship.x += ship.vx;
            ship.y += ship.vy;
            ship.vx *= 0.99;
            ship.vy *= 0.99;

            if (ship.x < 0) ship.x = cw;
            if (ship.x > cw) ship.x = 0;
            if (ship.y < 0) ship.y = ch;
            if (ship.y > ch) ship.y = 0;

            if (invulnerable > 0) invulnerable--;

            for (var b = bullets.length - 1; b >= 0; b--) {
                bullets[b].x += bullets[b].vx;
                bullets[b].y += bullets[b].vy;
                bullets[b].life--;
                if (bullets[b].life <= 0) bullets.splice(b, 1);
            }

            for (var i = asteroids.length - 1; i >= 0; i--) {
                var a = asteroids[i];
                a.x += a.vx;
                a.y += a.vy;
                if (a.x < 0) a.x = cw;
                if (a.x > cw) a.x = 0;
                if (a.y < 0) a.y = ch;
                if (a.y > ch) a.y = 0;

                for (var b = bullets.length - 1; b >= 0; b--) {
                    if (Math.abs(bullets[b].x - a.x) < a.size && Math.abs(bullets[b].y - a.y) < a.size) {
                        spawnParticles(a.x, a.y, '#ff006e', 15);
                        asteroids.splice(i, 1);
                        bullets.splice(b, 1);
                        score += 10;
                        break;
                    }
                }

                if (Math.abs(ship.x - a.x) < a.size + 5 && Math.abs(ship.y - a.y) < a.size + 5 && invulnerable <= 0) {
                    spawnParticles(ship.x, ship.y, '#ff006e', 20);
                    lives--;
                    ship.x = cw / 2;
                    ship.y = ch / 2;
                    ship.vx = 0;
                    ship.vy = 0;
                    invulnerable = 90;
                    if (lives <= 0) {
                        gameOver = true;
                        if ($info) $info.textContent = lang === 'fr' ? 'Game Over !' : 'Game Over!';
                        setTimeout(function () {
                            try {
                                localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'asteroids', won: false, ts: Date.now() }));
                            } catch (e) {}
                            window.location.href = '../true-detective/index.html?standalone=asteroids';
                        }, 1500);
                        return;
                    }
                }
            }

            for (var i = particles.length - 1; i >= 0; i--) {
                particles[i].x += particles[i].vx;
                particles[i].y += particles[i].vy;
                particles[i].life--;
                if (particles[i].life <= 0) particles.splice(i, 1);
            }

            for (var s = 0; s < stars.length; s++) {
                stars[s].y += stars[s].speed;
                if (stars[s].y > ch) {
                    stars[s].y = 0;
                    stars[s].x = Math.random() * cw;
                }
            }

            if (asteroids.length === 0) {
                gameOver = true;
                if ($info) $info.textContent = lang === 'fr' ? 'Victoire !' : 'Victory!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'asteroids', won: true, ts: Date.now() }));
                    } catch (e) {}
                    window.location.href = '../true-detective/index.html?standalone=asteroids';
                }, 1000);
            }

            if ($info) $info.textContent = (lang === 'fr' ? 'Score' : 'Score') + ': ' + score + ' | ' + (lang === 'fr' ? 'Vies' : 'Lives') + ': ' + lives;
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);

            ctx.fillStyle = '#ffffff';
            for (var s = 0; s < stars.length; s++) {
                ctx.globalAlpha = 0.3 + stars[s].size / 3;
                ctx.fillRect(stars[s].x, stars[s].y, stars[s].size, stars[s].size);
            }
            ctx.globalAlpha = 1;

            if (invulnerable <= 0 || Math.floor(Date.now() / 100) % 2 === 0) {
                ctx.save();
                ctx.translate(ship.x, ship.y);
                ctx.rotate(ship.angle);
                ctx.fillStyle = '#00d4ff';
                ctx.shadowColor = '#00d4ff';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(12, 0);
                ctx.lineTo(-8, -7);
                ctx.lineTo(-5, 0);
                ctx.lineTo(-8, 7);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.restore();
            }

            ctx.fillStyle = '#ffd600';
            ctx.shadowColor = '#ffd600';
            ctx.shadowBlur = 6;
            for (var b = 0; b < bullets.length; b++) {
                ctx.fillRect(bullets[b].x - 2, bullets[b].y - 2, 4, 4);
            }
            ctx.shadowBlur = 0;

            ctx.strokeStyle = '#ff006e';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#ff006e';
            ctx.shadowBlur = 6;
            for (var i = 0; i < asteroids.length; i++) {
                var a = asteroids[i];
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.shadowBlur = 0;

            for (var p = 0; p < particles.length; p++) {
                var particle = particles[p];
                ctx.globalAlpha = particle.life / 50;
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
            }
            ctx.globalAlpha = 1;
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
