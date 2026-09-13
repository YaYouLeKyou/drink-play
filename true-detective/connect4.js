/* =====================================================================
   TRUE DETECTIVE - CONNECT 4 (Standalone)
   Simple Connect 4 game vs AI.
   ===================================================================== */
(function (global) {
    'use strict';

    var ROWS = 6;
    var COLS = 7;
    var EMPTY = 0;
    var PLAYER = 1;
    var AI = 2;

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
        if (diff < 1 || diff > 3) diff = 1;

        var $board = document.getElementById('connect4-board');
        var $status = document.getElementById('connect4-status');
        var $reset = document.getElementById('connect4-reset');

        var board = [];
        for (var r = 0; r < ROWS; r++) {
            board[r] = [];
            for (var c = 0; c < COLS; c++) {
                board[r][c] = EMPTY;
            }
        }

        var currentPlayer = PLAYER;
        var gameOver = false;
        var moves = 0;

        function checkWin(b, player) {
            for (var r = 0; r < ROWS; r++) {
                for (var c = 0; c < COLS; c++) {
                    if (b[r][c] !== player) continue;
                    if (c + 3 < COLS && b[r][c + 1] === player && b[r][c + 2] === player && b[r][c + 3] === player) return true;
                    if (r + 3 < ROWS && b[r + 1][c] === player && b[r + 2][c] === player && b[r + 3][c] === player) return true;
                    if (r + 3 < ROWS && c + 3 < COLS && b[r + 1][c + 1] === player && b[r + 2][c + 2] === player && b[r + 3][c + 3] === player) return true;
                    if (r + 3 < ROWS && c - 3 >= 0 && b[r + 1][c - 1] === player && b[r + 2][c - 2] === player && b[r + 3][c - 3] === player) return true;
                }
            }
            return false;
        }

        function isFull(b) {
            for (var c = 0; c < COLS; c++) {
                if (b[0][c] === EMPTY) return false;
            }
            return true;
        }

        function cloneBoard(b) {
            return b.map(function (row) { return row.slice(); });
        }

        function getValidCols(b) {
            var cols = [];
            for (var c = 0; c < COLS; c++) {
                if (b[0][c] === EMPTY) cols.push(c);
            }
            return cols;
        }

        function dropPiece(b, col, player) {
            for (var r = ROWS - 1; r >= 0; r--) {
                if (b[r][col] === EMPTY) {
                    b[r][col] = player;
                    return r;
                }
            }
            return -1;
        }

        function minimax(b, depth, alpha, beta, maximizing) {
            if (checkWin(b, AI)) return { score: 1000 + depth };
            if (checkWin(b, PLAYER)) return { score: -1000 - depth };
            if (isFull(b) || depth === 0) return { score: 0 };

            var validCols = getValidCols(b);
            if (maximizing) {
                var maxScore = -Infinity;
                var bestCol = validCols[Math.floor(Math.random() * validCols.length)];
                for (var i = 0; i < validCols.length; i++) {
                    var boardCopy = cloneBoard(b);
                    dropPiece(boardCopy, validCols[i], AI);
                    var result = minimax(boardCopy, depth - 1, alpha, beta, false);
                    if (result.score > maxScore) {
                        maxScore = result.score;
                        bestCol = validCols[i];
                    }
                    alpha = Math.max(alpha, maxScore);
                    if (beta <= alpha) break;
                }
                return { score: maxScore, col: bestCol };
            } else {
                var minScore = Infinity;
                var worstCol = validCols[Math.floor(Math.random() * validCols.length)];
                for (var j = 0; j < validCols.length; j++) {
                    var boardCopy2 = cloneBoard(b);
                    dropPiece(boardCopy2, validCols[j], PLAYER);
                    var result2 = minimax(boardCopy2, depth - 1, alpha, beta, true);
                    if (result2.score < minScore) {
                        minScore = result2.score;
                        worstCol = validCols[j];
                    }
                    beta = Math.min(beta, minScore);
                    if (beta <= alpha) break;
                }
                return { score: minScore, col: worstCol };
            }
        }

        function aiMove() {
            var depth = diff === 1 ? 2 : diff === 2 ? 3 : 4;
            var result = minimax(board, depth, -Infinity, Infinity, true);
            if (result && result.col !== undefined && board[0][result.col] === EMPTY) {
                dropPiece(board, result.col, AI);
                return true;
            }
            var validCols = getValidCols(board);
            if (validCols.length > 0) {
                var col = validCols[Math.floor(Math.random() * validCols.length)];
                dropPiece(board, col, AI);
                return true;
            }
            return false;
        }

        function render() {
            if (!$board) return;
            $board.innerHTML = '';
            for (var r = 0; r < ROWS; r++) {
                for (var c = 0; c < COLS; c++) {
                    var cell = document.createElement('div');
                    cell.className = 'connect4-cell';
                    if (board[r][c] === PLAYER) cell.classList.add('red');
                    if (board[r][c] === AI) cell.classList.add('yellow');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.addEventListener('click', function () {
                        var col = parseInt(this.dataset.col, 10);
                        playerMove(col);
                    });
                    $board.appendChild(cell);
                }
            }
        }

        function playerMove(col) {
            if (gameOver || currentPlayer !== PLAYER) return;
            if (board[0][col] !== EMPTY) return;

            dropPiece(board, col, PLAYER);
            moves++;
            render();

            if (checkWin(board, PLAYER)) {
                gameOver = true;
                if ($status) $status.textContent = lang === 'fr' ? 'Vous gagnez !' : 'You win!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({
                            type: 'connect4',
                            won: true,
                            ts: Date.now()
                        }));
                    } catch (e) {}
                    window.location.href = '../true-detective/index.html?standalone=connect4';
                }, 1000);
                return;
            }

            if (isFull(board)) {
                gameOver = true;
                if ($status) $status.textContent = lang === 'fr' ? 'Match nul !' : 'Draw!';
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({
                            type: 'connect4',
                            won: false,
                            ts: Date.now()
                        }));
                    } catch (e) {}
                    window.location.href = '../true-detective/index.html?standalone=connect4';
                }, 1000);
                return;
            }

            currentPlayer = AI;
            if ($status) $status.textContent = lang === 'fr' ? 'Tour: IA...' : 'Turn: AI...';

            setTimeout(function () {
                if (gameOver) return;
                aiMove();
                moves++;
                render();

                if (checkWin(board, AI)) {
                    gameOver = true;
                    if ($status) $status.textContent = lang === 'fr' ? 'IA gagne !' : 'AI wins!';
                    setTimeout(function () {
                        try {
                            localStorage.setItem('td_standalone_game_result', JSON.stringify({
                                type: 'connect4',
                                won: false,
                                ts: Date.now()
                            }));
                        } catch (e) {}
                        window.location.href = '../true-detective/index.html?standalone=connect4';
                    }, 1000);
                    return;
                }

                if (isFull(board)) {
                    gameOver = true;
                    if ($status) $status.textContent = lang === 'fr' ? 'Match nul !' : 'Draw!';
                    setTimeout(function () {
                        try {
                            localStorage.setItem('td_standalone_game_result', JSON.stringify({
                                type: 'connect4',
                                won: false,
                                ts: Date.now()
                            }));
                        } catch (e) {}
                        window.location.href = '../true-detective/index.html?standalone=connect4';
                    }, 1000);
                    return;
                }

                currentPlayer = PLAYER;
                if ($status) $status.textContent = lang === 'fr' ? 'Tour: Rouge' : 'Turn: Red';
            }, 500);
        }

        if ($reset) {
            $reset.addEventListener('click', function () {
                board = [];
                for (var r = 0; r < ROWS; r++) {
                    board[r] = [];
                    for (var c = 0; c < COLS; c++) {
                        board[r][c] = EMPTY;
                    }
                }
                currentPlayer = PLAYER;
                gameOver = false;
                moves = 0;
                if ($status) $status.textContent = lang === 'fr' ? 'Tour: Rouge' : 'Turn: Red';
                render();
            });
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);
