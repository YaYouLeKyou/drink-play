/* =====================================================================
   TRUE DETECTIVE - SPACE INVADERS (Standalone)
   Simple Space Invaders clone.
   ===================================================================== */
(function (global) {
    'use strict';

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
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
                invaders.push({ x: 50 + c * (cellW + 10), y: 40 + r * (cellH + 10), alive: true });
            }
        }

        var playerX = cw / 2;
        var bullets = [];
        var score = 0;
        var lives = 3;
        var gameOver = false;
        var dir = 1;
        var moveTimer = 0;

        document.addEventListener('keydown', function (e) {
            if (gameOver) return;
            if (e.key === 'ArrowLeft') playerX -= 20;
            if (e.key === 'ArrowRight') playerX += 20;
            if (e.key === ' ') {
                bullets.push({ x: playerX, y: ch - 30, vx: 0, vy: -6 });
            }
            playerX = Math.max(20, Math.min(cw - 20, playerX));
        });

        function update() {
            if (gameOver) return;
            moveTimer++;
            if (moveTimer > 30 - diff * 5) {
                moveTimer = 0;
                var down = false;
                for (var i = 0; i < invaders.length; i++) {
                    if (!invaders[i].alive) continue;
                    invaders[i].x += dir * 8;
                    if (invaders[i].x <= 10 || invaders[i].x >= cw - 10) down = true;
                }
                if (down) {
                    dir *= -1;
                    for (var i = 0; i < invaders.length; i++) {
                        if (invaders[i].alive) invaders[i].y += 15;
                        if (invaders[i].y >= ch - 50) {
                            gameOver = true;
                            if ($info) $info.textContent = lang === 'fr' ? 'Game Over !' : 'Game Over!';
                            setTimeout(function () {
                                try {
                                    localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'space-invaders', won: false, ts: Date.now() }));
                                } catch (e) {}
                                window.location.href = '../true-detective/index.html?standalone=space-invaders';
                            }, 1500);
                            return;
                        }
                    }
                }
            }

            for (var b = bullets.length - 1; b >= 0; b--) {
                bullets[b].y += bullets[b].vy;
                if (bullets[b].y < 0) { bullets.splice(b, 1); continue; }
                for (var i = 0; i < invaders.length; i++) {
                    if (!invaders[i].alive) continue;
                    if (Math.abs(bullets[b].x - (invaders[i].x + cellW / 2)) < cellW / 2 &&
                        Math.abs(bullets[b].y - (invaders[i].y + cellH / 2)) < cellH / 2) {
                        invaders[i].alive = false;
                        bullets.splice(b, 1);
                        score += 10;
                        break;
                    }
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
                    window.location.href = '../true-detective/index.html?standalone=space-invaders';
                }, 1000);
            }

            if ($info) $info.textContent = (lang === 'fr' ? 'Score' : 'Score') + ': ' + score + ' | ' + (lang === 'fr' ? 'Vies' : 'Lives') + ': ' + lives;
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);

            ctx.fillStyle = '#ff006e';
            for (var i = 0; i < invaders.length; i++) {
                if (!invaders[i].alive) continue;
                ctx.fillRect(invaders[i].x, invaders[i].y, cellW, cellH);
            }

            ctx.fillStyle = '#00d4ff';
            ctx.fillRect(playerX - 15, ch - 30, 30, 10);

            ctx.fillStyle = '#ffd600';
            for (var b = 0; b < bullets.length; b++) {
                ctx.fillRect(bullets[b].x - 2, bullets[b].y, 4, 8);
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
