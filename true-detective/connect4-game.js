/* =====================================================================
   TRUE DETECTIVE - PUISSANCE 4 DÉTECTIVE (Connect 4)
   Connect 4 mini-game for suspect challenges and mini-games gallery.
===================================================================== */
(function (global) {
    'use strict';

    function playSfx(name, opts) {
        try {
            var fx = window.TDSfx || (window.parent && window.parent.TDSfx);
            if (fx) fx.play(name, opts);
        } catch (e) {}
    }
    function playMinigameMusic(type) {
        try {
            var svc = window.TDAudioService || (window.parent && window.parent.TDAudioService);
            if (svc && svc.playMinigameMusic) svc.playMinigameMusic(type);
        } catch (e) {}
    }

    function t(obj, lang) {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj[lang] || obj.fr || obj.en || '';
    }

    function Connect4Game(container, options) {
        options = options || {};
        playMinigameMusic('connect4');
        this.container = container;
        this.lang = options.lang || 'fr';
        this.onComplete = options.onComplete || function () {};
        this.difficulty = options.difficulty || 'medium'; // easy, medium, hard
        this.rows = 6;
        this.cols = 7;
        this.board = [];
        this.currentPlayer = 1; // 1 = Player (Gold/Cyan), 2 = Opponent/AI (Dark/Magenta)
        this.gameOver = false;
        this.isAiTurn = false;
        this.cfg = options.cfg || null;
        this.aiMoveCount = 0;

        this.initBoard();
        this.render();
    }

    Connect4Game.prototype.initBoard = function () {
        this.board = [];
        for (var r = 0; r < this.rows; r++) {
            var row = [];
            for (var c = 0; c < this.cols; c++) {
                row.push(0);
            }
            this.board.push(row);
        }
        this.gameOver = false;
        this.currentPlayer = 1;
        this.isAiTurn = false;
    };

    Connect4Game.prototype.render = function () {
        this.container.innerHTML = '';

        var wrap = document.createElement('div');
        wrap.className = 'connect4-wrapper';

        // Header info
        var header = document.createElement('div');
        header.className = 'connect4-header';

        var statusEl = document.createElement('div');
        statusEl.className = 'connect4-status';
        statusEl.textContent = this.lang === 'fr'
            ? 'Alignez 4 jetons d\'enquête avant votre rival !'
            : 'Connect 4 investigation tokens before your rival!';
        header.appendChild(statusEl);

        this.statusEl = statusEl;
        wrap.appendChild(header);

        // Grid container
        var grid = document.createElement('div');
        grid.className = 'connect4-grid';

        // Drop arrows row
        var arrowsRow = document.createElement('div');
        arrowsRow.className = 'connect4-arrows-row';
        for (var c = 0; c < this.cols; c++) {
            (function (colIdx, self) {
                var arrow = document.createElement('button');
                arrow.className = 'connect4-arrow-btn';
                arrow.innerHTML = '▼';
                arrow.title = self.lang === 'fr' ? 'Déposer jeton' : 'Drop token';
                arrow.addEventListener('click', function () {
                    self.playerMove(colIdx);
                });
                arrowsRow.appendChild(arrow);
            })(c, this);
        }
        grid.appendChild(arrowsRow);

        // Board representation
        var boardEl = document.createElement('div');
        boardEl.className = 'connect4-board';

        for (var r = 0; r < this.rows; r++) {
            var rowEl = document.createElement('div');
            rowEl.className = 'connect4-row';
            for (var c = 0; c < this.cols; c++) {
                var cell = document.createElement('div');
                cell.className = 'connect4-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;

                var slot = document.createElement('div');
                slot.className = 'connect4-slot';
                if (this.board[r][c] === 1) slot.classList.add('player1');
                else if (this.board[r][c] === 2) slot.classList.add('player2');

                cell.appendChild(slot);
                (function (colIdx, self) {
                    cell.addEventListener('click', function () {
                        self.playerMove(colIdx);
                    });
                })(c, this);

                rowEl.appendChild(cell);
            }
            boardEl.appendChild(rowEl);
        }

        grid.appendChild(boardEl);
        wrap.appendChild(grid);

        // Controls footer
        var footer = document.createElement('div');
        footer.className = 'connect4-footer';

        var resetBtn = document.createElement('button');
        resetBtn.className = 'btn btn-secondary';
        resetBtn.textContent = this.lang === 'fr' ? 'Réinitialiser' : 'Reset';
        var self = this;
        resetBtn.addEventListener('click', function () {
            self.initBoard();
            self.render();
        });
        footer.appendChild(resetBtn);

        wrap.appendChild(footer);
        this.container.appendChild(wrap);
    };

    Connect4Game.prototype.playerMove = function (col) {
        if (this.gameOver || this.isAiTurn || this.currentPlayer !== 1) return;
        if (!this.makeMove(col, 1)) return;

        playSfx('token_drop');

        this.updateBoardUI();

        var winInfo = this.checkWin(1);
        if (winInfo) {
            this.handleWin(1, winInfo);
            return;
        }

        if (this.isBoardFull()) {
            this.handleDraw();
            return;
        }

        this.currentPlayer = 2;
        this.isAiTurn = true;
        if (this.statusEl) {
            this.statusEl.textContent = this.lang === 'fr'
                ? 'Réflexion du suspect...'
                : 'Suspect is thinking...';
        }

        var self = this;
        setTimeout(function () {
            self.aiMove();
        }, 600);
    };

    Connect4Game.prototype.aiMove = function () {
        if (this.gameOver) return;

        var col = this.getBestColForAi();
        this.makeMove(col, 2);

        playSfx('token_drop');

        this.updateBoardUI();

        /* PLAN §3 : un event à CHAQUE tour où joue le computer */
        this.aiMoveCount = (this.aiMoveCount || 0) + 1;
        if (window.TDStoryChrome) window.TDStoryChrome.trigger('aiMove', { value: this.aiMoveCount });

        var winInfo = this.checkWin(2);
        if (winInfo) {
            this.handleWin(2, winInfo);
            return;
        }

        if (this.isBoardFull()) {
            this.handleDraw();
            return;
        }

        this.currentPlayer = 1;
        this.isAiTurn = false;
        if (this.statusEl) {
            this.statusEl.textContent = this.lang === 'fr'
                ? 'À votre tour, inspecteur !'
                : 'Your turn, inspector!';
        }
    };

    Connect4Game.prototype.makeMove = function (col, player) {
        for (var r = this.rows - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) {
                this.board[r][col] = player;
                return true;
            }
        }
        return false; // Column is full
    };

    Connect4Game.prototype.getBestColForAi = function () {
        var validCols = [];
        for (var c = 0; c < this.cols; c++) {
            if (this.board[0][c] === 0) validCols.push(c);
        }
        if (!validCols.length) return 0;

        // 1. Check if AI can win in 1 move
        for (var i = 0; i < validCols.length; i++) {
            var c = validCols[i];
            var r = this.getLowestEmptyRow(c);
            this.board[r][c] = 2;
            if (this.checkWin(2)) {
                this.board[r][c] = 0;
                return c;
            }
            this.board[r][c] = 0;
        }

        // 2. Block player's winning move
        for (var i = 0; i < validCols.length; i++) {
            var c = validCols[i];
            var r = this.getLowestEmptyRow(c);
            this.board[r][c] = 1;
            if (this.checkWin(1)) {
                this.board[r][c] = 0;
                return c;
            }
            this.board[r][c] = 0;
        }

        // 3. Prefer center column or random valid column
        var centerCol = Math.floor(this.cols / 2);
        if (validCols.indexOf(centerCol) !== -1 && Math.random() < 0.6) {
            return centerCol;
        }

        return validCols[Math.floor(Math.random() * validCols.length)];
    };

    Connect4Game.prototype.getLowestEmptyRow = function (col) {
        for (var r = this.rows - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) return r;
        }
        return -1;
    };

    Connect4Game.prototype.updateBoardUI = function () {
        var slots = this.container.querySelectorAll('.connect4-slot');
        var idx = 0;
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols; c++) {
                var slot = slots[idx++];
                if (!slot) continue;
                slot.className = 'connect4-slot';
                if (this.board[r][c] === 1) slot.classList.add('player1');
                else if (this.board[r][c] === 2) slot.classList.add('player2');
            }
        }
    };

    Connect4Game.prototype.checkWin = function (player) {
        var b = this.board;
        // Horizontal
        for (var r = 0; r < this.rows; r++) {
            for (var c = 0; c < this.cols - 3; c++) {
                if (b[r][c] === player && b[r][c+1] === player && b[r][c+2] === player && b[r][c+3] === player) {
                    return [{r:r,c:c}, {r:r,c:c+1}, {r:r,c:c+2}, {r:r,c:c+3}];
                }
            }
        }
        // Vertical
        for (var r = 0; r < this.rows - 3; r++) {
            for (var c = 0; c < this.cols; c++) {
                if (b[r][c] === player && b[r+1][c] === player && b[r+2][c] === player && b[r+3][c] === player) {
                    return [{r:r,c:c}, {r:r+1,c:c}, {r:r+2,c:c}, {r:r+3,c:c}];
                }
            }
        }
        // Diagonal /
        for (var r = 3; r < this.rows; r++) {
            for (var c = 0; c < this.cols - 3; c++) {
                if (b[r][c] === player && b[r-1][c+1] === player && b[r-2][c+2] === player && b[r-3][c+3] === player) {
                    return [{r:r,c:c}, {r:r-1,c:c+1}, {r:r-2,c:c+2}, {r:r-3,c:c+3}];
                }
            }
        }
        // Diagonal \
        for (var r = 0; r < this.rows - 3; r++) {
            for (var c = 0; c < this.cols - 3; c++) {
                if (b[r][c] === player && b[r+1][c+1] === player && b[r+2][c+2] === player && b[r+3][c+3] === player) {
                    return [{r:r,c:c}, {r:r+1,c:c+1}, {r:r+2,c:c+2}, {r:r+3,c:c+3}];
                }
            }
        }
        return null;
    };

    Connect4Game.prototype.isBoardFull = function () {
        for (var c = 0; c < this.cols; c++) {
            if (this.board[0][c] === 0) return false;
        }
        return true;
    };

    Connect4Game.prototype.handleWin = function (player, winCoords) {
        this.gameOver = true;
        this.highlightWinSlots(winCoords);

        if (player === 1) {
            if (this.statusEl) {
                this.statusEl.textContent = this.lang === 'fr'
                    ? '🎉 Victoire ! Vous avez déjoué la stratégie du suspect !'
                    : '🎉 Victory! You outsmarted the suspect!';
                this.statusEl.style.color = '#00ff88';
            }
            var self = this;
            setTimeout(function () {
                if (self.onComplete) self.onComplete(true);
            }, 1200);
        } else {
            if (this.statusEl) {
                this.statusEl.textContent = this.lang === 'fr'
                    ? '❌ Le suspect a aligné ses pièces. Essai manqué.'
                    : '❌ The suspect connected 4 pieces. Failed.';
                this.statusEl.style.color = '#ff4d4d';
            }
            var self = this;
            setTimeout(function () {
                if (self.onComplete) self.onComplete(false);
            }, 1400);
        }
    };

    Connect4Game.prototype.highlightWinSlots = function (winCoords) {
        if (!winCoords) return;
        var cells = this.container.querySelectorAll('.connect4-cell');
        winCoords.forEach(function (pt) {
            var idx = pt.r * 7 + pt.c;
            if (cells[idx]) {
                var slot = cells[idx].querySelector('.connect4-slot');
                if (slot) slot.classList.add('win-highlight');
            }
        });
    };

    Connect4Game.prototype.handleDraw = function () {
        this.gameOver = true;
        if (this.statusEl) {
            this.statusEl.textContent = this.lang === 'fr'
                ? '⚖️ Égalité parfaite !'
                : '⚖️ Perfect draw!';
        }
        var self = this;
        setTimeout(function () {
            if (self.onComplete) self.onComplete(false);
        }, 1200);
    };

    Connect4Game.play = function (cfg, lang, onDone, target) {
        if (window.TDStoryChrome && cfg) window.TDStoryChrome.initFromCfg(cfg);
        if (!target) {
            target = document.getElementById('minigame-layer');
            if (target) {
                target.innerHTML = '';
                target.classList.add('active');
            }
        }
        var container = document.createElement('div');
        container.className = 'minigame-standalone-wrapper';
        target.innerHTML = '';
        target.appendChild(container);

        var game = new Connect4Game(container, {
            lang: lang || 'fr',
            difficulty: cfg ? cfg.difficulty : 'medium',
            cfg: cfg || null,
            onComplete: function (won) {
                if (onDone) onDone({ won: won });
            }
        });
        return game;
    };

    global.TDConnect4Game = Connect4Game;

})(typeof globalThis !== 'undefined' ? globalThis : this);

