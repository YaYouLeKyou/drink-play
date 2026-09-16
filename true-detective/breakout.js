/* =====================================================================
    TRUE DETECTIVE - BREAKOUT (Standalone)
    Enhanced with particles, trails, and neon effects.
    ===================================================================== */
(function (global) {
    'use strict';

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
        if (diff < 1 || diff > 3) diff = 1;

        var canvas = document.getElementById('breakout-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var $info = document.getElementById('breakout-info');

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

        var paddleW = 80;
        var paddleH = 12;
        var paddleX = cw / 2;
        var ballX = cw / 2;
        var ballY = ch - 50;
        var ballVX = 3 + diff * 0.5;
        var ballVY = -4 - diff * 0.3;
        var brickRows = 3 + diff;
        var brickCols = 6;
        var brickW = (cw - 40) / brickCols;
        var brickH = 16;
        var bricks = [];
        var particles = [];
        var shakeTimer = 0;
        var shakeIntensity = 0;
        for (var r = 0; r < brickRows; r++) {
            for (var c = 0; c < brickCols; c++) {
                bricks.push({ x: 20 + c * brickW, y: 30 + r * (brickH + 4), alive: true, color: ['#00d4ff', '#ff006e', '#ffd600'][r % 3] });
            }
        }
        var score = 0;
        var gameOver = false;

        document.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            paddleX = e.clientX - rect.left;
            paddleX = Math.max(paddleW / 2, Math.min(cw - paddleW / 2, paddleX));
        });

        function spawnParticles(x, y, color, count) {
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    life: 25 + Math.random() * 15,
                    color: color,
                    size: Math.random() * 4 + 2
                });
            }
        }

        function triggerShake(intensity) {
            shakeTimer = 8;
            shakeIntensity = intensity;
        }

        function update() {
            if (gameOver) return;
            ballX += ballVX;
            ballY += ballVY;

            if (ballX <= 0 || ballX >= cw) ballVX *= -1;
            if (ballY <= 0) ballVY *= -1;

            if (ballY >= ch - 30 && ballX >= paddleX - paddleW / 2 && ballX <= paddleX + paddleW / 2) {
                ballVY = -Math.abs(ballVY);
                var dx = (ballX - paddleX) / (paddleW / 2);
                ballVX = dx * 5;
                spawnParticles(ballX, ballY - 5, '#00d4ff', 5);
            }

            if (ballY > ch) {
                gameOver = true;
                triggerShake(10);
                if ($info) $info.textContent = lang === 'fr' ? 'Perdu !' : 'Game Over!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'breakout', won: false, ts: Date.now() }));
                    } catch (e) {}
                    var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                    window.location.href = fromStory ? '../true-detective/index.html?standalone=breakout' : '../true-detective/index.html#minigames';
                }, 1500);
                return;
            }

            for (var i = 0; i < bricks.length; i++) {
                if (!bricks[i].alive) continue;
                if (ballX >= bricks[i].x && ballX <= bricks[i].x + brickW &&
                    ballY >= bricks[i].y && ballY <= bricks[i].y + brickH) {
                    bricks[i].alive = false;
                    ballVY *= -1;
                    spawnParticles(bricks[i].x + brickW / 2, bricks[i].y + brickH / 2, bricks[i].color, 10);
                    triggerShake(3);
                    score += 10;
                    break;
                }
            }

            for (var i = particles.length - 1; i >= 0; i--) {
                particles[i].x += particles[i].vx;
                particles[i].y += particles[i].vy;
                particles[i].life--;
                if (particles[i].life <= 0) particles.splice(i, 1);
            }

            if (shakeTimer > 0) shakeTimer--;

            var allDead = bricks.every(function (b) { return !b.alive; });
            if (allDead) {
                gameOver = true;
                if ($info) $info.textContent = lang === 'fr' ? 'Victoire !' : 'Victory!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'breakout', won: true, ts: Date.now() }));
                    } catch (e) {}
                    var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                    window.location.href = fromStory ? '../true-detective/index.html?standalone=breakout' : '../true-detective/index.html#minigames';
                }, 1000);
            }

            if ($info) $info.textContent = (lang === 'fr' ? 'Score' : 'Score') + ': ' + score;
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

            for (var i = 0; i < bricks.length; i++) {
                if (!bricks[i].alive) continue;
                ctx.fillStyle = bricks[i].color;
                ctx.shadowColor = bricks[i].color;
                ctx.shadowBlur = 8;
                ctx.fillRect(bricks[i].x, bricks[i].y, brickW - 2, brickH);
            }
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#00d4ff';
            ctx.shadowColor = '#00d4ff';
            ctx.shadowBlur = 12;
            ctx.fillRect(paddleX - paddleW / 2, ch - 20, paddleW, paddleH);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#ffd600';
            ctx.shadowColor = '#ffd600';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            for (var p = 0; p < particles.length; p++) {
                var particle = particles[p];
                ctx.globalAlpha = particle.life / 40;
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
