/* =====================================================================
   TRUE DETECTIVE - CHESS MINIGAME
   Player vs AI (minimax), Unicode pieces, difficulty = search depth
   Returns { won: boolean, clue: object } via onDone callback
===================================================================== */
(function (global) {
    'use strict';

    var TDC_NS = 'td-chess';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    function getFemmeFataleImage(themeId) {
        var assets = (typeof window !== 'undefined' && window.THEME_ASSETS && window.THEME_ASSETS[themeId]) || {};
        return assets.femmeFatale || '';
    }

    var PIECES = {
        white: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
        black: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };

    var VIVIENNE_PHRASES = {
        en: [
            "Stay sharp, detective. This opponent won't go easy on you.",
            "Every move reveals a piece of the truth.",
            "Trust your instincts. You've got this.",
            "Patience. The right move will come.",
            "Watch their patterns. They always leave a clue."
        ],
        fr: [
            "Restez vigilant, détective. Cet adversaire ne vous fera pas de cadeaux.",
            "Chaque coup révèle un morceau de la vérité.",
            "Faites confiance à votre instinct. Vous y arriverez.",
            "Patience. Le bon coup viendra.",
            "Observez leurs schémas. Ils laissent toujours un indice."
        ]
    };

    var SUSPECT_PHRASES = {
        en: [
            "You can't win. Not against me.",
            "Is that your best move? Pathetic.",
            "The game is already over. You just haven't realized it.",
            "Keep trying. It's entertaining to watch you struggle.",
            "You're out of your depth."
        ],
        fr: [
            "Vous ne pouvez pas gagner. Pas contre moi.",
            "C'est votre meilleur coup ? Pathétique.",
            "La partie est déjà terminée. Vous ne l'avez juste pas réalisé.",
            "Continuez. C'est divertissant de vous voir lutter.",
            "Vous êtes en dehors de votre élément."
        ]
    };

    var INITIAL_BOARD = [
        ['bR','bN','bB','bQ','bK','bB','bN','bR'],
        ['bP','bP','bP','bP','bP','bP','bP','bP'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['wP','wP','wP','wP','wP','wP','wP','wP'],
        ['wR','wN','wB','wQ','wK','wB','wN','wR']
    ];

    var PIECE_VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
    var POSITION_BONUS = {
        P: [
            [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],
            [5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],
            [5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]
        ],
        N: [
            [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],
            [-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
            [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]
        ],
        B: [
            [-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,10,10,10,10,0,-10],
            [-10,5,5,10,10,5,5,-10],[-10,10,10,10,10,10,10,-10],[-10,5,10,10,10,10,5,-10],
            [-10,0,10,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]
        ],
        R: [
            [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],
            [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
            [-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]
        ],
        Q: [
            [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],
            [-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
            [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]
        ],
        K: [
            [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],
            [20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]
        ]
    };

    function cloneBoard(board) {
        return board.map(function (row) { return row.slice(); });
    }

    function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

    function pieceColor(p) {
        if (!p) return null;
        return p[0] === 'w' ? 'white' : 'black';
    }

    function pieceType(p) {
        if (!p) return null;
        return p[1];
    }

    function findKing(board, color) {
        var k = color === 'white' ? 'wK' : 'bK';
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                if (board[r][c] === k) return { r: r, c: c };
            }
        }
        return null;
    }

    function getMoves(board, r, c) {
        var p = board[r][c];
        if (!p) return [];
        var color = pieceColor(p);
        var type = pieceType(p);
        var moves = [];
        var add = function (tr, tc) {
            if (!inBounds(tr, tc)) return false;
            var target = board[tr][tc];
            if (target && pieceColor(target) === color) return false;
            moves.push({ fromR: r, fromC: c, toR: tr, toC: tc });
            return !target;
        };
        var addSliding = function (dirs) {
            dirs.forEach(function (d) {
                for (var i = 1; i < 8; i++) {
                    if (!add(r + d[0] * i, c + d[1] * i)) break;
                }
            });
        };

        if (type === 'P') {
            var dir = color === 'white' ? -1 : 1;
            var startR = color === 'white' ? 6 : 1;
            if (inBounds(r + dir, c) && !board[r + dir][c]) {
                moves.push({ fromR: r, fromC: c, toR: r + dir, toC: c });
                if (r === startR && !board[r + 2 * dir][c]) {
                    moves.push({ fromR: r, fromC: c, toR: r + 2 * dir, toC: c });
                }
            }
            [[dir, -1], [dir, 1]].forEach(function (dc) {
                var tr = r + dc[0], tc = c + dc[1];
                if (inBounds(tr, tc)) {
                    var target = board[tr][tc];
                    if (target && pieceColor(target) !== color) {
                        moves.push({ fromR: r, fromC: c, toR: tr, toC: tc });
                    }
                }
            });
        } else if (type === 'N') {
            [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(function (dc) {
                add(r + dc[0], c + dc[1]);
            });
        } else if (type === 'B') {
            addSliding([[-1,-1],[-1,1],[1,-1],[1,1]]);
        } else if (type === 'R') {
            addSliding([[-1,0],[1,0],[0,-1],[0,1]]);
        } else if (type === 'Q') {
            addSliding([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
        } else if (type === 'K') {
            [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(function (dc) {
                add(r + dc[0], c + dc[1]);
            });
        }
        return moves;
    }

    function isInCheck(board, color) {
        var kingPos = findKing(board, color);
        if (!kingPos) return false;
        var opp = color === 'white' ? 'black' : 'white';
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                var p = board[r][c];
                if (p && pieceColor(p) === opp) {
                    var moves = getMoves(board, r, c);
                    for (var i = 0; i < moves.length; i++) {
                        if (moves[i].toR === kingPos.r && moves[i].toC === kingPos.c) return true;
                    }
                }
            }
        }
        return false;
    }

    function getLegalMoves(board, r, c) {
        var p = board[r][c];
        if (!p) return [];
        var color = pieceColor(p);
        var rawMoves = getMoves(board, r, c);
        return rawMoves.filter(function (m) {
            var newBoard = cloneBoard(board);
            newBoard[m.toR][m.toC] = newBoard[m.fromR][m.fromC];
            newBoard[m.fromR][m.fromC] = '';
            return !isInCheck(newBoard, color);
        });
    }

    function hasLegalMoves(board, color) {
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                if (board[r][c] && pieceColor(board[r][c]) === color) {
                    if (getLegalMoves(board, r, c).length > 0) return true;
                }
            }
        }
        return false;
    }

    function evaluateBoard(board) {
        var score = 0;
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                var p = board[r][c];
                if (!p) continue;
                var color = pieceColor(p);
                var type = pieceType(p);
                var val = PIECE_VALUES[type] || 0;
                var posTable = POSITION_BONUS[type] || [[0]];
                var posBonus = (color === 'white' ? posTable[r][c] : posTable[7 - r][c]);
                score += (color === 'white' ? 1 : -1) * (val + posBonus);
            }
        }
        return score;
    }

    function minimax(board, depth, alpha, beta, isMaximizing) {
        if (depth === 0) return evaluateBoard(board);
        var currentColor = isMaximizing ? 'white' : 'black';
        if (!hasLegalMoves(board, currentColor)) {
            if (isInCheck(board, currentColor)) return isMaximizing ? -100000 - depth : 100000 + depth;
            return 0;
        }
        var moves = [];
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                if (board[r][c] && pieceColor(board[r][c]) === currentColor) {
                    moves = moves.concat(getLegalMoves(board, r, c));
                }
            }
        }
        moves.sort(function () { return Math.random() - 0.5; });

        if (isMaximizing) {
            var maxEval = -Infinity;
            for (var i = 0; i < moves.length; i++) {
                var nb = cloneBoard(board);
                nb[moves[i].toR][moves[i].toC] = nb[moves[i].fromR][moves[i].fromC];
                nb[moves[i].fromR][moves[i].fromC] = '';
                var ev = minimax(nb, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, ev);
                alpha = Math.max(alpha, ev);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            var minEval = Infinity;
            for (var j = 0; j < moves.length; j++) {
                var nb2 = cloneBoard(board);
                nb2[moves[j].toR][moves[j].toC] = nb2[moves[j].fromR][moves[j].fromC];
                nb2[moves[j].fromR][moves[j].fromC] = '';
                var ev2 = minimax(nb2, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, ev2);
                beta = Math.min(beta, ev2);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    function getAIMove(board, depth) {
        var moves = [];
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                if (board[r][c] && pieceColor(board[r][c]) === 'black') {
                    moves = moves.concat(getLegalMoves(board, r, c));
                }
            }
        }
        if (moves.length === 0) return null;
        var bestMove = null;
        var bestScore = Infinity;
        moves.sort(function () { return Math.random() - 0.5; });
        for (var i = 0; i < moves.length; i++) {
            var nb = cloneBoard(board);
            nb[moves[i].toR][moves[i].toC] = nb[moves[i].fromR][moves[i].fromC];
            nb[moves[i].fromR][moves[i].fromC] = '';
            var score = minimax(nb, depth - 1, -Infinity, Infinity, true);
            if (score < bestScore) {
                bestScore = score;
                bestMove = moves[i];
            }
        }
        return bestMove;
    }

    function ChessGame() {
        this.board = null;
        this.turn = 'white';
        this.selected = null;
        this.gameOver = false;
        this.result = null;
        this.moveHistory = [];
        this.undoStack = [];
        this.depth = 1;
    }

    ChessGame.prototype.init = function (board, startColor, depth) {
        this.board = cloneBoard(board);
        this.turn = startColor || 'white';
        this.selected = null;
        this.gameOver = false;
        this.result = null;
        this.moveHistory = [];
        this.undoStack = [];
        this.depth = depth || 1;
    };

    ChessGame.prototype.selectSquare = function (r, c) {
        if (this.gameOver) return null;
        if (this.turn !== 'white') return null;
        var p = this.board[r][c];
        if (this.selected) {
            var legalMoves = getLegalMoves(this.board, this.selected.r, this.selected.c);
            var match = legalMoves.find(function (m) { return m.toR === r && m.toC === c; });
            if (match) {
                return this.executeMove(match);
            }
            if (p && pieceColor(p) === 'white') {
                this.selected = { r: r, c: c };
                return null;
            }
            this.selected = null;
            return null;
        }
        if (p && pieceColor(p) === 'white') {
            this.selected = { r: r, c: c };
        }
        return null;
    };

    ChessGame.prototype.executeMove = function (move) {
        var captured = this.board[move.toR][move.toC];
        this.undoStack.push({
            board: cloneBoard(this.board),
            turn: this.turn,
            moveHistory: this.moveHistory.slice()
        });
        this.board[move.toR][move.toC] = this.board[move.fromR][move.fromC];
        this.board[move.fromR][move.fromC] = '';
        this.moveHistory.push(move);
        this.selected = null;

        var oppColor = this.turn === 'white' ? 'black' : 'white';
        if (!hasLegalMoves(this.board, oppColor)) {
            this.gameOver = true;
            this.result = isInCheck(this.board, oppColor) ? this.turn : 'draw';
            return { move: move, captured: captured, gameOver: true, result: this.result };
        }
        if (isInCheck(this.board, oppColor)) {
            this.turn = oppColor;
            return { move: move, captured: captured, check: true };
        }
        this.turn = oppColor;
        return { move: move, captured: captured };
    };

    ChessGame.prototype.aiMove = function () {
        if (this.gameOver) return null;
        var move = getAIMove(this.board, this.depth);
        if (!move) {
            this.gameOver = true;
            this.result = 'white';
            return null;
        }
        var result = this.executeMove(move);
        return result;
    };

    ChessGame.prototype.undo = function () {
        if (this.undoStack.length < 2) return false;
        for (var i = 0; i < 2; i++) {
            var state = this.undoStack.pop();
            this.board = state.board;
            this.turn = state.turn;
            this.moveHistory = state.moveHistory;
        }
        this.selected = null;
        this.gameOver = false;
        this.result = null;
        return true;
    };

    function buildUI(game, cfg, lang, finish) {
        var container = game.target;
        if (!container) { finish({ won: false }); return; }
        container.innerHTML = '';

        var overlay = document.getElementById('minigame-overlay');
        if (overlay) {
            overlay.classList.add('chess-layout');
        }

        var layoutContainer = container.parentElement;
        if (layoutContainer) {
            layoutContainer.classList.add('chess-game-layout');
        }

        var sidePanel = document.getElementById('chess-side-panel');
        var dialogueText = document.getElementById('chess-dialogue-text');
        var characterImage = document.getElementById('chess-character-image');
        var characterName = document.getElementById('chess-character-name');
        var characterRole = document.getElementById('chess-character-role');
        var interroState = null;
        var interroData = null;
        var phraseInterval = null;
        var moveCount = 0;
        var interroCompleted = false;

        if (sidePanel) {
            sidePanel.style.display = 'flex';
            var assets = (typeof window !== 'undefined' && window.THEME_ASSETS && window.THEME_ASSETS[getThemeId()]) || {};
            var femImgSrc = getFemmeFataleImage(getThemeId());
            if (characterImage && femImgSrc) {
                characterImage.src = femImgSrc;
                characterImage.alt = 'Lady Vivienne';
            }
            if (characterName) {
                characterName.textContent = lang === 'fr' ? 'Lady Vivienne' : 'Lady Vivienne';
            }
            if (characterRole) {
                characterRole.textContent = lang === 'fr' ? 'Suspect' : 'Suspect';
            }
        }

        function clearInterrogation() {
            if (phraseInterval) {
                clearInterval(phraseInterval);
                phraseInterval = null;
            }
            interroState = null;
            interroData = null;
            var history = document.getElementById('chess-dialogue-history');
            if (history) history.innerHTML = '';
            var interroBox = document.getElementById('chess-interro-box');
            if (interroBox) interroBox.innerHTML = '';
        }

        function setRandomDialogue() {
            if (!dialogueText) return;
            var phraseList = cfg.dialogues && cfg.dialogues.length ? cfg.dialogues : (VIVIENNE_PHRASES[lang] || VIVIENNE_PHRASES.en);
            var text = phraseList[Math.floor(Math.random() * phraseList.length)];
            dialogueText.textContent = text;
        }

        function advanceMoveDialogue() {
            moveCount++;
            if (interroData) return;
            if (!interroCompleted && getInterrogationData()) {
                startInterrogation();
                return;
            }
            var isTaunt = moveCount % 2 === 1;
            var phraseList = isTaunt
                ? (SUSPECT_PHRASES[lang] || SUSPECT_PHRASES.en)
                : (cfg.dialogues && cfg.dialogues.length ? cfg.dialogues : (VIVIENNE_PHRASES[lang] || VIVIENNE_PHRASES.en));
            var text = phraseList[Math.floor(Math.random() * phraseList.length)];
            if (dialogueText) dialogueText.textContent = text;
            appendDialogue(text, 'Vivienne');
        }

        function getInterrogationData() {
            var interroId = null;
            if (typeof window !== 'undefined' && window.scr && window.scr.interro && window.scr.interro.id) {
                interroId = window.scr.interro.id;
            }
            if (!interroId && typeof window !== 'undefined' && window.TDNarration && window.TDNarration.interrogations) {
                var keys = Object.keys(window.TDNarration.interrogations);
                if (keys.length) interroId = keys[0];
            }
            if (!interroId) return null;
            return window.TDNarration && window.TDNarration.interrogations ? window.TDNarration.interrogations[interroId] : null;
        }

        function appendDialogue(text, speaker) {
            var history = document.getElementById('chess-dialogue-history');
            if (!history) return;
            var line = document.createElement('div');
            line.className = 'chess-interro-history';
            if (speaker) {
                line.textContent = speaker + ': ' + text;
            } else {
                line.textContent = text;
            }
            history.appendChild(line);
            history.scrollTop = history.scrollHeight;
        }

        function renderInterrogation() {
            if (!interroData || !interroState || !sidePanel) return;
            var rounds = interroData.questions ? [interroData.questions, interroData.rounds2, interroData.rounds3] : [];
            rounds = rounds.filter(function (r) { return r && r.length; });
            if (!rounds.length) return;
            if (interroState.round >= rounds.length) {
                appendDialogue(lang === 'fr' ? 'Interrogatoire terminé.' : 'Interrogation complete.', null);
                clearInterrogation();
                setRandomDialogue();
                return;
            }
            var currentRound = rounds[interroState.round] || [];
            var remaining = currentRound.filter(function (q) { return interroState.answered.indexOf(q.id || q.label) === -1; });
            if (!remaining.length) {
                if (interroState.round + 1 < rounds.length) {
                    interroState.round++;
                    interroState.answered = [];
                    renderInterrogation();
                } else {
                    appendDialogue(lang === 'fr' ? 'Interrogatoire terminé.' : 'Interrogation complete.', null);
                    clearInterrogation();
                    setRandomDialogue();
                }
                return;
            }
            var interroBox = document.getElementById('chess-interro-box');
            if (!interroBox) return;
            interroBox.innerHTML = '';
            var label = document.createElement('div');
            label.className = 'chess-interro-history';
            label.textContent = (lang === 'fr' ? 'Phase ' : 'Phase ') + (interroState.round + 1) + '/3';
            interroBox.appendChild(label);
            remaining.forEach(function (q) {
                var btn = document.createElement('button');
                btn.className = 'chess-interro-question';
                btn.textContent = t(q.label, lang);
                btn.addEventListener('click', function () {
                    if (!interroState) return;
                    interroState.answered.push(q.id || q.label);
                    var response = t(q.response, lang) || '';
                    response = (typeof scrEnrichResponse === 'function' ? scrEnrichResponse(response, q) : response);
                    response = (typeof scrSubstituteNames === 'function' ? scrSubstituteNames(response, getThemeId()) : response);
                    appendDialogue((lang === 'fr' ? 'Vous: ' : 'You: ') + t(q.label, lang), null);
                    appendDialogue('Vivienne: ' + response, null);
                    var clue = null;
                    if (typeof scrClueFromInterroResponse === 'function') {
                        clue = scrClueFromInterroResponse(response);
                    }
                    if (clue && typeof TDNarrativeEngine !== 'undefined' && TDNarrativeEngine.addClue) {
                        TDNarrativeEngine.addClue(clue, q.evidence || 'dialogue');
                        showClueToast(clue);
                    }
                    renderInterrogation();
                });
                interroBox.appendChild(btn);
            });
        }

        function startInterrogation() {
            clearInterrogation();
            interroData = getInterrogationData();
            if (!interroData) return;
            interroState = { round: 0, answered: [] };
            if (dialogueText) {
                dialogueText.textContent = lang === 'fr'
                    ? 'Phase 1/3, Choisissez votre question :'
                    : 'Phase 1/3, Pick your question:';
            }
            appendDialogue(lang === 'fr' ? 'Phase 1/3, Choisissez votre question :' : 'Phase 1/3, Pick your question:', null);
            renderInterrogation();
        }

        if (sidePanel && dialogueText) {
            setRandomDialogue();
        }

        var boardEl = document.createElement('div');
        boardEl.className = 'chess-board';
        container.appendChild(boardEl);

        renderBoard(game, boardEl, null, null, finish, cfg, lang);

        return {
            destroy: function () {
                moveCount = 0;
                clearInterrogation();
                if (phraseInterval) {
                    clearInterval(phraseInterval);
                    phraseInterval = null;
                }
                if (overlay) {
                    overlay.classList.remove('chess-layout');
                }
                if (layoutContainer) {
                    layoutContainer.classList.remove('chess-game-layout');
                }
                if (sidePanel) {
                    sidePanel.style.display = 'none';
                }
            }
        };
    }

    function renderBoard(game, boardEl, statusEl, turnLabel, finish, cfg, lang) {
        boardEl.innerHTML = '';
        var dark = '#1a1a2e';
        var light = '#2d2d44';
        var accent = '#00d4ff';
        var selectedColor = 'rgba(0,212,255,0.4)';
        var validColor = 'rgba(0,255,100,0.35)';
        var inCheckColor = 'rgba(255,50,50,0.5)';

        var kingPos = findKing(game.board, 'white');
        var whiteInCheck = kingPos && isInCheck(game.board, 'white');

        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                var sq = document.createElement('div');
                sq.className = 'chess-sq';
                sq.dataset.r = r;
                sq.dataset.c = c;
                var isLight = (r + c) % 2 === 0;
                sq.style.backgroundColor = isLight ? light : dark;

                if (game.selected && game.selected.r === r && game.selected.c === c) {
                    sq.classList.add('selected');
                    sq.style.backgroundColor = selectedColor;
                }

                var legalMoves = game.selected ? getLegalMoves(game.board, game.selected.r, game.selected.c) : [];
                var isValidTarget = legalMoves.some(function (m) { return m.toR === r && m.toC === c; });
                if (isValidTarget) {
                    sq.classList.add('valid-move');
                    sq.style.backgroundColor = validColor;
                }

                if (whiteInCheck && game.board[r][c] === 'wK') {
                    sq.style.backgroundColor = inCheckColor;
                }

                var piece = game.board[r][c];
                if (piece) {
                    var color = pieceColor(piece);
                    var type = pieceType(piece);
                    var pieceSpan = document.createElement('span');
                    pieceSpan.className = 'chess-piece ' + (color === 'white' ? 'white-piece' : 'black-piece');
                    pieceSpan.textContent = PIECES[color][type.toLowerCase()] || '';
                    sq.appendChild(pieceSpan);
                }

                sq.addEventListener('click', function () {
                    if (game.gameOver || game.turn !== 'white') return;
                    var tr = parseInt(this.dataset.r);
                    var tc = parseInt(this.dataset.c);
                    var result = game.selectSquare(tr, tc);
                    if (result) {
                        renderBoard(game, boardEl, null, null, finish, cfg, lang);
                        if (result.gameOver) {
                            setTimeout(function () {
                                finish({ won: result.result === 'white', clue: result.result === 'white' ? cfg.clue : cfg.failClue });
                            }, 800);
                            return;
                        }
                        if (result.check) {
                        }
                        setTimeout(function () {
                            var aiResult = game.aiMove();
                            renderBoard(game, boardEl, null, null, finish, cfg, lang);
                            advanceMoveDialogue();
                            if (game.gameOver) {
                                setTimeout(function () {
                                    finish({ won: game.result === 'white', clue: game.result === 'white' ? cfg.clue : cfg.failClue });
                                }, 800);
                            }
                        }, 300);
                    } else {
                        renderBoard(game, boardEl, null, null, finish, cfg, lang);
                    }
                });

                boardEl.appendChild(sq);
            }
        }

        if (game.gameOver) {
            var overlay = document.createElement('div');
            overlay.className = 'chess-overlay';
            var msg = document.createElement('div');
            msg.className = 'chess-overlay-msg';
            if (game.result === 'white') {
                msg.textContent = lang === 'fr' ? '✅ Échec et mat ! Vous gagnez !' : '✅ Checkmate! You win!';
            } else if (game.result === 'black') {
                msg.textContent = lang === 'fr' ? '❌ Échec et mat ! Vous perdez.' : '❌ Checkmate! You lose.';
            } else {
                msg.textContent = lang === 'fr' ? '🤝 Nulle.' : '🤝 Draw.';
            }
            overlay.appendChild(msg);
            boardEl.appendChild(overlay);
        }
    }

    function addCharacterPresence(container, lang, gameType, dialogues) {
        var characterEl = document.createElement('div');
        characterEl.className = gameType + '-character';
        var characterImage = document.createElement('div');
        characterImage.className = gameType + '-character-image';
        characterImage.textContent = '👩';
        characterEl.appendChild(characterImage);
        container.appendChild(characterEl);

        var talkbox = document.createElement('div');
        talkbox.className = gameType + '-talkbox';
        var phraseList = dialogues && dialogues.length ? dialogues : (VIVIENNE_PHRASES[lang] || VIVIENNE_PHRASES.en);
        talkbox.textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
        container.appendChild(talkbox);

        var phraseInterval = setInterval(function () {
            if (!characterEl.parentNode) {
                clearInterval(phraseInterval);
                return;
            }
            talkbox.textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
        }, 4000);

        return {
            destroy: function () {
                clearInterval(phraseInterval);
                if (characterEl.parentNode) characterEl.remove();
                if (talkbox.parentNode) talkbox.remove();
            }
        };
    }

    function play(cfg, lang, onDone, target) {
        if (!cfg) { if (onDone) onDone({ won: false }); return; }
        if (!target) {
            var layer = document.getElementById('minigame-layer');
            if (!layer) { if (onDone) onDone({ won: false }); return; }
            layer.innerHTML = '';
            layer.classList.add('active');
            target = layer;
        }
        var game = new ChessGame();
        game.target = target;
        game.init(INITIAL_BOARD, 'white', cfg.depth || 1);
        var characterPresence = null;

        var wrappedOnDone = function (result) {
            if (characterPresence) characterPresence.destroy();
            if (onDone) onDone(result);
        };

        buildUI(game, cfg, lang, wrappedOnDone);
    }

    global.TDChessGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
