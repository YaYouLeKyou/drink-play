/* =====================================================================
   TRUE DETECTIVE - PACMAN (Standalone)
   Simple Pacman-style maze game.
   ===================================================================== */
(function (global) {
    'use strict';

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
        if (diff < 1 || diff > 3) diff = 1;

        var canvas = document.getElementById('pacman-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var $info = document.getElementById('pacman-info');

        var cw, ch, cellSize;
        function resize() {
            var rect = canvas.getBoundingClientRect();
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            cw = rect.width;
            ch = rect.height;
            canvas.width = cw * dpr;
            canvas.height = ch * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cellSize = Math.floor(Math.min(cw, ch) / 15);
        }
        resize();
        window.addEventListener('resize', resize);

        var COLS = 15;
        var ROWS = 11;
        var map = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
            [1,0,1,0,1,0,1,1,0,1,0,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,0,1,0,1,1,0,1,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,1,1,0,1,1,1,1,1,1,1,0,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,1,0,1,1,1,1,0,1],
            [1,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        var dots = [];
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                if (map[r][c] === 0) dots.push({ r: r, c: c, eaten: false });
            }
        }

        var px = 1 * cellSize + cellSize / 2;
        var py = 1 * cellSize + cellSize / 2;
        var pvx = 0, pvy = 0;
        var score = 0;
        var lives = 3;
        var gameOver = false;
        var ghosts = [
            { x: 7 * cellSize, y: 5 * cellSize, vx: 1, vy: 0, color: '#ff006e' },
            { x: 8 * cellSize, y: 5 * cellSize, vx: -1, vy: 0, color: '#00d4ff' }
        ];
        var mouthAngle = 0;
        var mouthDir = 1;

        document.addEventListener('keydown', function (e) {
            if (gameOver) return;
            if (e.key === 'ArrowUp' || e.key === 'w') { pvx = 0; pvy = -1; }
            if (e.key === 'ArrowDown' || e.key === 's') { pvx = 0; pvy = 1; }
            if (e.key === 'ArrowLeft' || e.key === 'a') { pvx = -1; pvy = 0; }
            if (e.key === 'ArrowRight' || e.key === 'd') { pvx = 1; pvy = 0; }
        });

        function canMove(x, y) {
            var col = Math.floor(x / cellSize);
            var row = Math.floor(y / cellSize);
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
            return map[row][col] === 0 || map[row][col] === 3;
        }

        function update() {
            if (gameOver) return;
            mouthAngle += 0.1 * mouthDir;
            if (mouthAngle > 0.3 || mouthAngle < 0) mouthDir *= -1;

            var nextX = px + pvx * (cellSize / 8);
            var nextY = py + pvy * (cellSize / 8);
            if (canMove(nextX, nextY)) {
                px = nextX;
                py = nextY;
            }

            for (var i = 0; i < dots.length; i++) {
                var d = dots[i];
                if (!d.eaten) {
                    var dx = px - (d.c * cellSize + cellSize / 2);
                    var dy = py - (d.r * cellSize + cellSize / 2);
                    if (Math.sqrt(dx * dx + dy * dy) < cellSize / 2) {
                        d.eaten = true;
                        score += 10;
                    }
                }
            }

            for (var g = 0; g < ghosts.length; g++) {
                var ghost = ghosts[g];
                if (Math.random() < 0.02) {
                    var dirs = [[1,0],[-1,0],[0,1],[0,-1]];
                    var dir = dirs[Math.floor(Math.random() * dirs.length)];
                    ghost.vx = dir[0];
                    ghost.vy = dir[1];
                }
                var gx = ghost.x + ghost.vx * (cellSize / 10);
                var gy = ghost.y + ghost.vy * (cellSize / 10);
                if (canMove(gx, gy)) {
                    ghost.x = gx;
                    ghost.y = gy;
                } else {
                    ghost.vx *= -1;
                    ghost.vy *= -1;
                }

                var gdx = px - ghost.x;
                var gdy = py - ghost.y;
                if (Math.sqrt(gdx * gdx + gdy * gdy) < cellSize / 2) {
                    lives--;
                    px = 1 * cellSize + cellSize / 2;
                    py = 1 * cellSize + cellSize / 2;
                    pvx = 0; pvy = 0;
                    if (lives <= 0) {
                        gameOver = true;
                        if ($info) $info.textContent = lang === 'fr' ? 'Game Over !' : 'Game Over!';
                        setTimeout(function () {
                            try {
                                localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'pacman', won: false, ts: Date.now() }));
                            } catch (e) {}
                            window.location.href = '../true-detective/index.html?standalone=pacman';
                        }, 1500);
                        return;
                    }
                }
            }

            var allEaten = dots.every(function (d) { return d.eaten; });
            if (allEaten) {
                gameOver = true;
                if ($info) $info.textContent = lang === 'fr' ? 'Victoire !' : 'Victory!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'pacman', won: true, ts: Date.now() }));
                    } catch (e) {}
                    window.location.href = '../true-detective/index.html?standalone=pacman';
                }, 1000);
                return;
            }

            if ($info) $info.textContent = (lang === 'fr' ? 'Score' : 'Score') + ': ' + score + ' | ' + (lang === 'fr' ? 'Vies' : 'Lives') + ': ' + lives;
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);

            for (var r = 0; r < ROWS; r++) {
                for (var c = 0; c < COLS; c++) {
                    if (map[r][c] === 1) {
                        ctx.fillStyle = '#1a2030';
                        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                    }
                }
            }

            for (var i = 0; i < dots.length; i++) {
                var d = dots[i];
                if (!d.eaten) {
                    ctx.fillStyle = '#ffd600';
                    ctx.beginPath();
                    ctx.arc(d.c * cellSize + cellSize / 2, d.r * cellSize + cellSize / 2, cellSize / 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.fillStyle = '#ffd600';
            ctx.beginPath();
            ctx.arc(px, py, cellSize / 2 - 2, mouthAngle, Math.PI * 2 - mouthAngle);
            ctx.lineTo(px, py);
            ctx.fill();

            for (var g = 0; g < ghosts.length; g++) {
                var ghost = ghosts[g];
                ctx.fillStyle = ghost.color;
                ctx.beginPath();
                ctx.arc(ghost.x, ghost.y, cellSize / 2 - 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(ghost.x - 4, ghost.y - 3, 3, 0, Math.PI * 2);
                ctx.arc(ghost.x + 4, ghost.y - 3, 3, 0, Math.PI * 2);
                ctx.fill();
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
