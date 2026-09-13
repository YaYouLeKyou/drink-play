/* =====================================================================
   TRUE DETECTIVE - BATAILLE NAVALE (Standalone)
   Simple Battleship game. Find 5 hidden ships.
   ===================================================================== */
(function (global) {
    'use strict';

    var SIZE = 10;
    var SHIPS = [5, 4, 3, 3, 2];
    var EMPTY = 0;
    var SHIP = 1;
    var HIT = 2;
    var MISS = 3;

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';

        var $board = document.getElementById('battleship-board');
        var $status = document.getElementById('battleship-status');

        var grid = [];
        for (var r = 0; r < SIZE; r++) {
            grid[r] = [];
            for (var c = 0; c < SIZE; c++) {
                grid[r][c] = EMPTY;
            }
        }

        function placeShips() {
            for (var s = 0; s < SHIPS.length; s++) {
                var placed = false;
                while (!placed) {
                    var horizontal = Math.random() < 0.5;
                    var row = Math.floor(Math.random() * SIZE);
                    var col = Math.floor(Math.random() * SIZE);
                    if (horizontal && col + SHIPS[s] <= SIZE) {
                        var ok = true;
                        for (var i = 0; i < SHIPS[s]; i++) {
                            if (grid[row][col + i] !== EMPTY) { ok = false; break; }
                        }
                        if (ok) {
                            for (var i = 0; i < SHIPS[s]; i++) grid[row][col + i] = SHIP;
                            placed = true;
                        }
                    } else if (!horizontal && row + SHIPS[s] <= SIZE) {
                        var ok = true;
                        for (var i = 0; i < SHIPS[s]; i++) {
                            if (grid[row + i][col] !== EMPTY) { ok = false; break; }
                        }
                        if (ok) {
                            for (var i = 0; i < SHIPS[s]; i++) grid[row + i][col] = SHIP;
                            placed = true;
                        }
                    }
                }
            }
        }

        placeShips();

        var hits = 0;
        var totalShipCells = SHIPS.reduce(function (a, b) { return a + b; }, 0);
        var gameOver = false;

        function render() {
            if (!$board) return;
            $board.innerHTML = '';
            for (var r = 0; r < SIZE; r++) {
                for (var c = 0; c < SIZE; c++) {
                    var cell = document.createElement('div');
                    cell.className = 'battleship-cell';
                    if (grid[r][c] === HIT) cell.classList.add('hit');
                    if (grid[r][c] === MISS) cell.classList.add('miss');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.addEventListener('click', function () {
                        var row = parseInt(this.dataset.row, 10);
                        var col = parseInt(this.dataset.col, 10);
                        fire(row, col);
                    });
                    $board.appendChild(cell);
                }
            }
        }

        function fire(row, col) {
            if (gameOver) return;
            if (grid[row][col] === HIT || grid[row][col] === MISS) return;

            if (grid[row][col] === SHIP) {
                grid[row][col] = HIT;
                hits++;
                if ($status) $status.textContent = (lang === 'fr' ? 'Touché ! ' : 'Hit! ') + hits + '/' + totalShipCells;
                render();
                if (hits >= totalShipCells) {
                    gameOver = true;
                    if ($status) $status.textContent = lang === 'fr' ? 'Victoire ! Tous les navires coulés.' : 'Victory! All ships sunk.';
                    setTimeout(function () {
                        try {
                            localStorage.setItem('td_standalone_game_result', JSON.stringify({
                                type: 'bataille-navale',
                                won: true,
                                ts: Date.now()
                            }));
                        } catch (e) {}
                        window.location.href = '../true-detective/index.html?standalone=bataille-navale';
                    }, 1000);
                }
            } else {
                grid[row][col] = MISS;
                if ($status) $status.textContent = lang === 'fr' ? 'Manqué...' : 'Miss...';
                render();
            }
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);
