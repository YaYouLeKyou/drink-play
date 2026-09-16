/* =====================================================================
    TRUE DETECTIVE - BATAILLE NAVALE (Standalone 1v1)
    Two boards: player places ships, then turn-based duel vs AI suspect.
    ===================================================================== */
(function (global) {
    'use strict';

    function playSfx(name, opts) {
    playMinigameMusic('bataille-navale');
        try { if (window.TDSfx) window.TDSfx.play(name, opts); } catch (e) {}
    }

    var SIZE = 10;
    var SHIPS = [5, 4, 3, 3, 2];
    var EMPTY = 0;
    var SHIP = 1;
    var HIT = 2;
    var MISS = 3;

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';

        var $playerBoard = document.getElementById('player-board');
        var $enemyBoard = document.getElementById('enemy-board');
        var $status = document.getElementById('battleship-status');
        var $turnIndicator = document.getElementById('turn-indicator');
        var $shipSelector = document.getElementById('ship-selector');
        var $rotateBtn = document.getElementById('rotate-btn');
        var $resetBtn = document.getElementById('reset-btn');

        var playerGrid = createEmptyGrid();
        var enemyGrid = createEmptyGrid();
        var playerShots = createEmptyGrid();
        var enemyShots = createEmptyGrid();

        var phase = 'placement'; // placement | battle | gameover
        var currentPlayer = 'player'; // player | enemy
        var selectedShipIndex = 0;
        var horizontal = true;
        var playerShipsPlaced = 0;
        var enemyShipsPlaced = 0;
        var playerHits = 0;
        var enemyHits = 0;
        var totalShipCells = SHIPS.reduce(function (a, b) { return a + b; }, 0);

        function createEmptyGrid() {
            var grid = [];
            for (var r = 0; r < SIZE; r++) {
                grid[r] = [];
                for (var c = 0; c < SIZE; c++) {
                    grid[r][c] = EMPTY;
                }
            }
            return grid;
        }

        function canPlace(grid, row, col, length, horiz) {
            for (var i = 0; i < length; i++) {
                var r = horiz ? row : row + i;
                var c = horiz ? col + i : col;
                if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return false;
                if (grid[r][c] !== EMPTY) return false;
            }
            return true;
        }

        function placeShip(grid, row, col, length, horiz) {
            for (var i = 0; i < length; i++) {
                var r = horiz ? row : row + i;
                var c = horiz ? col + i : col;
                grid[r][c] = SHIP;
            }
        }

        function placeShipsRandomly(grid) {
            for (var s = 0; s < SHIPS.length; s++) {
                var placed = false;
                while (!placed) {
                    var horiz = Math.random() < 0.5;
                    var row = Math.floor(Math.random() * SIZE);
                    var col = Math.floor(Math.random() * SIZE);
                    if (canPlace(grid, row, col, SHIPS[s], horiz)) {
                        placeShip(grid, row, col, SHIPS[s], horiz);
                        placed = true;
                    }
                }
            }
        }

        placeShipsRandomly(enemyGrid);

        function renderBoard(boardEl, grid, showShips) {
            if (!boardEl) return;
            boardEl.innerHTML = '';
            for (var r = 0; r < SIZE; r++) {
                for (var c = 0; c < SIZE; c++) {
                    var cell = document.createElement('div');
                    cell.className = 'battleship-cell';
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    if (grid[r][c] === HIT) cell.classList.add('hit');
                    else if (grid[r][c] === MISS) cell.classList.add('miss');
                    else if (showShips && grid[r][c] === SHIP) cell.classList.add('ship');
                    boardEl.appendChild(cell);
                }
            }
        }

        function renderPlayerBoard() {
            renderBoard($playerBoard, playerGrid, true);
        }

        function renderEnemyBoard() {
            renderBoard($enemyBoard, playerShots, false);
        }

        function updateShipSelector() {
            if (!$shipSelector) return;
            $shipSelector.innerHTML = '';
            SHIPS.forEach(function (len, idx) {
                var btn = document.createElement('button');
                btn.className = 'battleship-ship-btn';
                if (idx === selectedShipIndex) btn.classList.add('selected');
                if (idx < playerShipsPlaced) btn.classList.add('placed');
                btn.textContent = (lang === 'fr' ? 'Navire ' : 'Ship ') + (idx + 1) + ' (' + len + ')';
                btn.addEventListener('click', function () {
                    if (idx >= playerShipsPlaced) {
                        selectedShipIndex = idx;
                        updateShipSelector();
                    }
                });
                $shipSelector.appendChild(btn);
            });
        }

        function getPreviewCells(row, col, length, horiz) {
            var cells = [];
            for (var i = 0; i < length; i++) {
                var r = horiz ? row : row + i;
                var c = horiz ? col + i : col;
                if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
                    cells.push({ row: r, col: c, valid: playerGrid[r][c] === EMPTY });
                }
            }
            return cells;
        }

        function clearPreviews() {
            document.querySelectorAll('.battleship-cell.preview, .battleship-cell.blocked').forEach(function (cell) {
                cell.classList.remove('preview', 'blocked');
            });
        }

        function showPreview(row, col, length, horiz) {
            clearPreviews();
            var cells = getPreviewCells(row, col, length, horiz);
            cells.forEach(function (cell) {
                var boardCell = $playerBoard.querySelector('[data-row="' + cell.row + '"][data-col="' + cell.col + '"]');
                if (boardCell) {
                    boardCell.classList.add(cell.valid ? 'preview' : 'blocked');
                }
            });
        }

        function handlePlayerBoardClick(e) {
            if (phase !== 'placement') return;
            var cell = e.target.closest('.battleship-cell');
            if (!cell) return;
            var row = parseInt(cell.dataset.row, 10);
            var col = parseInt(cell.dataset.col, 10);
            if (isNaN(row) || isNaN(col)) return;

            var len = SHIPS[selectedShipIndex];
            if (!canPlace(playerGrid, row, col, len, horizontal)) return;

            placeShip(playerGrid, row, col, len, horizontal);
            playerShipsPlaced++;
            if (playerShipsPlaced >= SHIPS.length) {
                phase = 'battle';
                if ($shipSelector) $shipSelector.style.display = 'none';
                if ($rotateBtn) $rotateBtn.style.display = 'none';
                if ($resetBtn) $resetBtn.style.display = 'none';
                if ($status) $status.textContent = lang === 'fr' ? 'La bataille commence !' : 'The battle begins!';
                currentPlayer = 'player';
                updateTurnIndicator();
                renderPlayerBoard();
                renderEnemyBoard();
            } else {
                selectedShipIndex = playerShipsPlaced;
                updateShipSelector();
                renderPlayerBoard();
            }
        }

        function handleEnemyBoardClick(e) {
            if (phase !== 'battle' || currentPlayer !== 'player') return;
            var cell = e.target.closest('.battleship-cell');
            if (!cell) return;
            var row = parseInt(cell.dataset.row, 10);
            var col = parseInt(cell.dataset.col, 10);
            if (isNaN(row) || isNaN(col)) return;
            if (playerShots[row][col] === HIT || playerShots[row][col] === MISS) return;

            if (enemyGrid[row][col] === SHIP) {
                playerShots[row][col] = HIT;
                playerHits++;
                playSfx('explosion');
            } else {
                playerShots[row][col] = MISS;
                playSfx('water_miss');
            }

            renderEnemyBoard();

            if (playerHits >= totalShipCells) {
                phase = 'gameover';
                if ($status) $status.textContent = lang === 'fr' ? 'Victoire ! Vous avez coulé la flotte ennemie.' : 'Victory! You sank the enemy fleet.';
                if ($turnIndicator) $turnIndicator.style.display = 'none';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({
                            type: 'bataille-navale',
                            won: true,
                            ts: Date.now()
                        }));
                    } catch (e) {}
                        var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                        window.location.href = fromStory ? '../true-detective/index.html?standalone=bataille-navale' : '../true-detective/index.html#minigames';
                }, 1500);
                return;
            }

            currentPlayer = 'enemy';
            updateTurnIndicator();
            setTimeout(enemyTurn, 800);
        }

        function enemyTurn() {
            if (phase !== 'battle') return;

            var row, col;
            var attempts = 0;
            do {
                row = Math.floor(Math.random() * SIZE);
                col = Math.floor(Math.random() * SIZE);
                attempts++;
            } while ((enemyShots[row][col] === HIT || enemyShots[row][col] === MISS) && attempts < 1000);

            if (playerGrid[row][col] === SHIP) {
                enemyShots[row][col] = HIT;
                enemyHits++;
                playSfx('explosion');
            } else {
                enemyShots[row][col] = MISS;
                playSfx('water_miss');
            }

            renderPlayerBoard();

            if (enemyHits >= totalShipCells) {
                phase = 'gameover';
                if ($status) $status.textContent = lang === 'fr' ? 'Défaite... Votre flotte a été coulée.' : 'Defeat... Your fleet has been sunk.';
                if ($turnIndicator) $turnIndicator.style.display = 'none';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({
                            type: 'bataille-navale',
                            won: false,
                            ts: Date.now()
                        }));
                    } catch (e) {}
                        var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                        window.location.href = fromStory ? '../true-detective/index.html?standalone=bataille-navale' : '../true-detective/index.html#minigames';
                }, 1500);
                return;
            }

            currentPlayer = 'player';
            updateTurnIndicator();
        }

        function updateTurnIndicator() {
            if (!$turnIndicator) return;
            if (phase === 'gameover') {
                $turnIndicator.style.display = 'none';
                return;
            }
            $turnIndicator.style.display = 'block';
            if (currentPlayer === 'player') {
                $turnIndicator.textContent = lang === 'fr' ? 'À vous de jouer' : 'Your turn';
                $turnIndicator.className = 'turn-indicator player';
            } else {
                $turnIndicator.textContent = lang === 'fr' ? 'Tour de l\'ennemi...' : 'Enemy turn...';
                $turnIndicator.className = 'turn-indicator enemy';
            }
        }

        function resetGame() {
            playerGrid = createEmptyGrid();
            enemyGrid = createEmptyGrid();
            playerShots = createEmptyGrid();
            enemyShots = createEmptyGrid();
            phase = 'placement';
            currentPlayer = 'player';
            selectedShipIndex = 0;
            playerShipsPlaced = 0;
            enemyShipsPlaced = 0;
            playerHits = 0;
            enemyHits = 0;
            placeShipsRandomly(enemyGrid);
            if ($shipSelector) $shipSelector.style.display = 'flex';
            if ($rotateBtn) $rotateBtn.style.display = 'inline-flex';
            if ($resetBtn) $resetBtn.style.display = 'inline-flex';
            if ($status) $status.textContent = lang === 'fr' ? 'Placez vos navires' : 'Place your ships';
            updateTurnIndicator();
            updateShipSelector();
            renderPlayerBoard();
            renderEnemyBoard();
        }

        if ($playerBoard) {
            $playerBoard.addEventListener('click', handlePlayerBoardClick);
        }
        if ($enemyBoard) {
            $enemyBoard.addEventListener('click', handleEnemyBoardClick);
        }
        if ($rotateBtn) {
            $rotateBtn.addEventListener('click', function () {
                horizontal = !horizontal;
            });
        }
        if ($resetBtn) {
            $resetBtn.addEventListener('click', resetGame);
        }

        updateShipSelector();
        renderPlayerBoard();
        renderEnemyBoard();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);
