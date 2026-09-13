/* =====================================================================
   TRUE DETECTIVE - PONG (Standalone)
   Simple Pong game vs AI.
   ===================================================================== */
(function (global) {
    'use strict';

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
        if (diff < 1 || diff > 3) diff = 1;

        var canvas = document.getElementById('pong-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var $info = document.getElementById('pong-info');

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

        var paddleW = 12;
        var paddleH = 80;
        var playerY = ch / 2 - paddleH / 2;
        var aiY = ch / 2 - paddleH / 2;
        var ballX = cw / 2;
        var ballY = ch / 2;
        var ballVX = 4 + diff * 0.5;
        var ballVY = 3 + diff * 0.3;
        var playerScore = 0;
        var aiScore = 0;
        var gameOver = false;
        var winScore = 5;

        var mouseY = ch / 2;
        canvas.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouseY = e.clientY - rect.top;
        });
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            mouseY = e.touches[0].clientY - rect.top;
        }, { passive: false });

        function resetBall() {
            ballX = cw / 2;
            ballY = ch / 2;
            ballVX = (Math.random() < 0.5 ? -1 : 1) * (4 + diff * 0.5);
            ballVY = (Math.random() < 0.5 ? -1 : 1) * (3 + diff * 0.3);
        }

        function update() {
            if (gameOver) return;
            playerY = mouseY - paddleH / 2;
            playerY = Math.max(0, Math.min(ch - paddleH, playerY));

            var aiSpeed = 0.08 + diff * 0.02;
            aiY += (ballY - (aiY + paddleH / 2)) * aiSpeed;
            aiY = Math.max(0, Math.min(ch - paddleH, aiY));

            ballX += ballVX;
            ballY += ballVY;

            if (ballY <= 0 || ballY >= ch) ballVY *= -1;

            if (ballX <= paddleW && ballY >= playerY && ballY <= playerY + paddleH) {
                ballVX = Math.abs(ballVX) * 1.05;
                var dy = (ballY - (playerY + paddleH / 2)) / (paddleH / 2);
                ballVY = dy * 5;
            }
            if (ballX >= cw - paddleW && ballY >= aiY && ballY <= aiY + paddleH) {
                ballVX = -Math.abs(ballVX) * 1.05;
                var dy = (ballY - (aiY + paddleH / 2)) / (paddleH / 2);
                ballVY = dy * 5;
            }

            if (ballX < 0) {
                aiScore++;
                resetBall();
            }
            if (ballX > cw) {
                playerScore++;
                resetBall();
            }

            if (playerScore >= winScore || aiScore >= winScore) {
                gameOver = true;
                var won = playerScore >= winScore;
                if ($info) $info.textContent = won
                    ? (lang === 'fr' ? 'Vous gagnez !' : 'You win!')
                    : (lang === 'fr' ? 'IA gagne !' : 'AI wins!');
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({
                            type: 'pong',
                            won: won,
                            ts: Date.now()
                        }));
                    } catch (e) {}
                    window.location.href = '../true-detective/index.html?standalone=pong';
                }, 1500);
                return;
            }

            if ($info) {
                $info.textContent = (lang === 'fr' ? 'Joueur' : 'Player') + ': ' + playerScore + ' | ' + (lang === 'fr' ? 'IA' : 'AI') + ': ' + aiScore;
            }
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);

            ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(cw / 2, 0);
            ctx.lineTo(cw / 2, ch);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#00d4ff';
            ctx.fillRect(paddleW / 2, playerY, paddleW, paddleH);
            ctx.fillRect(cw - paddleW / 2, aiY, paddleW, paddleH);

            ctx.fillStyle = '#ffd600';
            ctx.shadowColor = '#ffd600';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            for (var y = 0; y < ch; y += 4) {
                ctx.fillRect(0, y, cw, 1);
            }
        }

        function loop() {
            update();
            draw();
            requestAnimationFrame(loop);
        }

        resetBall();
        loop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);
