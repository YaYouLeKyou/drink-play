/* =====================================================================
   TRUE DETECTIVE - BREAKOUT (Standalone)
   Simple Breakout clone.
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
            }

            if (ballY > ch) {
                gameOver = true;
                if ($info) $info.textContent = lang === 'fr' ? 'Perdu !' : 'Game Over!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'breakout', won: false, ts: Date.now() }));
                    } catch (e) {}
                    window.location.href = '../true-detective/index.html?standalone=breakout';
                }, 1500);
                return;
            }

            for (var i = 0; i < bricks.length; i++) {
                if (!bricks[i].alive) continue;
                if (ballX >= bricks[i].x && ballX <= bricks[i].x + brickW &&
                    ballY >= bricks[i].y && ballY <= bricks[i].y + brickH) {
                    bricks[i].alive = false;
                    ballVY *= -1;
                    score += 10;
                    break;
                }
            }

            var allDead = bricks.every(function (b) { return !b.alive; });
            if (allDead) {
                gameOver = true;
                if ($info) $info.textContent = lang === 'fr' ? 'Victoire !' : 'Victory!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'breakout', won: true, ts: Date.now() }));
                    } catch (e) {}
                    window.location.href = '../true-detective/index.html?standalone=breakout';
                }, 1000);
            }

            if ($info) $info.textContent = (lang === 'fr' ? 'Score' : 'Score') + ': ' + score;
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);

            ctx.fillStyle = '#00d4ff';
            ctx.fillRect(paddleX - paddleW / 2, ch - 20, paddleW, paddleH);

            ctx.fillStyle = '#ffd600';
            ctx.beginPath();
            ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
            ctx.fill();

            for (var i = 0; i < bricks.length; i++) {
                if (!bricks[i].alive) continue;
                ctx.fillStyle = bricks[i].color;
                ctx.fillRect(bricks[i].x, bricks[i].y, brickW - 2, brickH);
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

})(typeof globalThis !== 'undefined' ? globalThis : this);
