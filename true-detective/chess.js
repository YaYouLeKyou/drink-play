/* =====================================================================
   TRUE DETECTIVE - CHESS (page standalone)
   ===================================================================== */
(function () {
    'use strict';

    var TEXTS = {
        fr: {
            title: 'Échecs contre Lady Vivienne',
            turn: 'Tour : ',
            timer: '⏱️ ',
            skip: 'Passer',
            continue: 'Continuer l\'enquête',
            back: '← Retour à l\'enquête',
            checkmate: 'Échec et mat !',
            youWin: 'Vous gagnez !',
            youLose: 'Vous perdez...',
            draw: 'Nulle.',
            clue: 'Indice',
            falseLead: 'Fausse piste',
            victoryClue: 'Indice final',
        },
        en: {
            title: 'Chess against Lady Vivienne',
            turn: 'Turn: ',
            timer: '⏱️ ',
            skip: 'Skip',
            continue: 'Continue investigation',
            back: '← Back to investigation',
            checkmate: 'Checkmate!',
            youWin: 'You win!',
            youLose: 'You lose...',
            draw: 'Draw.',
            clue: 'Clue',
            falseLead: 'False lead',
            victoryClue: 'Final clue',
        }
    };

    var DIALOGUES = {
        detective: {
            fr: [
                'Votre mari avait-il des ennemis, Lady Vivienne ?',
                'Où étiez-vous la nuit du meurtre ?',
                'Connaissiez-vous Victor Krane ?',
                'Le coffre-fort... vous en avez la clé, n\'est-ce pas ?',
                'Votre mari prévoyait-il de changer le testament ?'
            ],
            en: [
                'Did your husband have enemies, Lady Vivienne?',
                'Where were you on the night of the murder?',
                'Did you know Victor Krane?',
                'The safe... you have the key, don\'t you?',
                'Was your husband planning to change the will?'
            ]
        },
        vivienne: {
            fr: [
                'Mon mari avait des ennemis, certes. Mais l\'auteur de ce crime… c\'est quelqu\'un de la maison. Quelqu\'un qui connaissait ses habitudes.',
                'J\'étais au théâtre avec des amies, puis ici, seule. Les domestiques avaient congé. Sauf un, qui rôdait près du pavillon vers 22h.',
                'Krane ? Un nom que je connais vaguement. Mon mari le mentionnait parfois. Des affaires, je crois.',
                'Le coffre ? Mon époux changeait de cachette tous les mois. Sa paranoïa l\'a perdu - pas moi.',
                'Le testament ? Oui, il parlait de le modifier. Il avait des… pressentiments. Il se sentait menacé.'
            ],
            en: [
                'My husband had enemies, certainly. But the perpetrator… it\'s someone from the house. Someone who knew his habits.',
                'I was at the theatre with friends, then alone here. The servants had the night off. Except one, who was prowling near the pavilion around 10pm.',
                'Krane? A name I know vaguely. My husband mentioned him sometimes. Business, I think.',
                'The safe? My husband changed his hiding place every month. His paranoia undid him - not I.',
                'The will? Yes, he talked about changing it. He had… premonitions. He felt threatened.'
            ]
        }
    };

    var CLUES = {
        fr: [
            { text: 'Vivienne mentionne un domestique qui rôdait près du pavillon vers 22h.', type: 'witness' },
            { text: 'Elle confirme que son mari changeait régulièrement de cachette pour le coffre.', type: 'mobile' },
            { text: 'Vivienne évoque des « pressentiments » : le Duc se sentait menacé avant sa mort.', type: 'timeline' },
            { text: 'Elle connaît vaguement Krane, mais nie toute relation directe.', type: 'witness' },
            { text: 'Le testament du Duc était sur le point d\'être modifié. Un mobile financier se dessine.', type: 'mobile' }
        ],
        en: [
            { text: 'Vivienne mentions a servant prowling near the pavilion around 10pm.', type: 'witness' },
            { text: 'She confirms her husband regularly changed the safe\'s hiding place.', type: 'mobile' },
            { text: 'Vivienne mentions "premonitions": the Duke felt threatened before his death.', type: 'timeline' },
            { text: 'She vaguely knows Krane, but denies any direct relationship.', type: 'witness' },
            { text: 'The Duke\'s will was about to be modified. A financial motive emerges.', type: 'mobile' }
        ]
    };

    var FALSE_LEADS = {
        fr: [
            { text: 'Vivienne prétend être allée au théâtre, mais Silas a vu un rôdeur près du manoir.', type: 'false' },
            { text: 'Elle affirme que son mari avait des ennemis, mais tous ses domestiques ont été interrogés.', type: 'false' }
        ],
        en: [
            { text: 'Vivienne claims to have gone to the theatre, but Silas saw a prowler near the manor.', type: 'false' },
            { text: 'She says her husband had enemies, but all her servants have been questioned.', type: 'false' }
        ]
    };

    var VICTORY_CLUE = {
        fr: 'Échec et mat ! Dans sa colère, Vivienne laisse échapper : « Hale connaissait tous mes secrets. Il savait pour le coffre, pour Krane… C\'est lui qui a tout orchestré ! »',
        en: 'Checkmate! In her anger, Vivienne lets slip: "Hale knew all my secrets. He knew about the safe, about Krane… He orchestrated everything!"'
    };

    var PIECES = {
        white: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
        black: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
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
        this.depth = 2;
    }

    ChessGame.prototype.init = function (depth) {
        this.board = cloneBoard(INITIAL_BOARD);
        this.turn = 'white';
        this.selected = null;
        this.gameOver = false;
        this.result = null;
        this.moveHistory = [];
        this.depth = depth || 2;
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

    function init() {
        var lang = 'fr';
        var texts = TEXTS[lang] || TEXTS.fr;
        var game = new ChessGame();
        game.init(2);
        var moveCount = 0;
        var cluesFound = [];
        var dialogueLines = [];
        var timerSeconds = 600;
        var timerInterval = null;

        var boardEl = document.getElementById('chess-board');
        var overlay = document.getElementById('chess-overlay');
        var resultEl = document.getElementById('chess-result');
        var clueTextEl = document.getElementById('chess-clue-text');
        var continueBtn = document.getElementById('chess-continue-btn');
        var skipBtn = document.getElementById('chess-skip-btn');
        var backBtn = document.getElementById('back-to-game-btn');
        var turnEl = document.getElementById('chess-turn');
        var timerEl = document.getElementById('chess-timer');
        var dialogueEl = document.getElementById('chess-dialogue');
        var cluesList = document.getElementById('chess-clues-list');

        var vivienneImg = document.getElementById('chess-char-img');
        if (vivienneImg) {
            vivienneImg.src = 'assets/image true detective/characteres/classic/femme-fatal.png';
        }

        function formatTime(s) {
            var m = Math.floor(s / 60);
            var sec = s % 60;
            return texts.timer + m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(function () {
                if (game.gameOver) {
                    clearInterval(timerInterval);
                    return;
                }
                timerSeconds--;
                if (timerEl) timerEl.textContent = formatTime(timerSeconds);
                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    endGame(false);
                }
            }, 1000);
        }

        function addDialogue(text, speaker) {
            if (!dialogueEl) return;
            var line = document.createElement('div');
            line.className = 'chess-dialogue-line ' + (speaker === 'Vivienne' ? 'vivienne' : 'detective');
            var speakerEl = document.createElement('div');
            speakerEl.className = 'speaker';
            speakerEl.textContent = speaker || (lang === 'fr' ? 'Vous' : 'You');
            var textEl = document.createElement('div');
            textEl.textContent = text;
            line.appendChild(speakerEl);
            line.appendChild(textEl);
            dialogueEl.appendChild(line);
            dialogueEl.scrollTop = dialogueEl.scrollHeight;
        }

        function addClue(clue) {
            if (!cluesList) return;
            cluesFound.push(clue);
            var li = document.createElement('li');
            li.className = 'chess-clue-item' + (clue.type === 'false' ? ' false-lead' : '');
            li.textContent = clue.text;
            cluesList.appendChild(li);
        }

        function getRandomDetectiveDialogue() {
            var list = DIALOGUES.detective[lang] || DIALOGUES.detective.fr;
            return list[Math.floor(Math.random() * list.length)];
        }

        function getRandomVivienneDialogue() {
            var list = DIALOGUES.vivienne[lang] || DIALOGUES.vivienne.fr;
            return list[Math.floor(Math.random() * list.length)];
        }

        function maybeGiveClue() {
            moveCount++;
            if (moveCount === 3) {
                var clue = (CLUES[lang] || CLUES.fr)[0];
                addClue(clue);
                addDialogue(clue.text, lang === 'fr' ? 'Indice' : 'Clue');
            } else if (moveCount === 6) {
                var falseLead = (FALSE_LEADS[lang] || FALSE_LEADS.fr)[0];
                addClue(falseLead);
                addDialogue(falseLead.text, lang === 'fr' ? 'Fausse piste' : 'False lead');
            } else if (moveCount === 9) {
                var clue2 = (CLUES[lang] || CLUES.fr)[1];
                addClue(clue2);
                addDialogue(clue2.text, lang === 'fr' ? 'Indice' : 'Clue');
            } else if (moveCount % 4 === 0) {
                addDialogue(getRandomVivienneDialogue(), 'Vivienne');
            }
        }

        function renderBoard() {
            boardEl.innerHTML = '';
            var dark = '#1a1a2e';
            var light = '#2d2d44';
            var accent = '#00d4ff';
            var selectedColor = 'rgba(212, 175, 55, 0.4)';
            var validColor = 'rgba(0, 255, 100, 0.35)';
            var inCheckColor = 'rgba(255, 50, 50, 0.5)';

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
                        sq.classList.add('in-check');
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

                    (function (tr, tc) {
                        sq.addEventListener('click', function () {
                            if (game.gameOver || game.turn !== 'white') return;
                            var result = game.selectSquare(tr, tc);
                            if (result) {
                                renderBoard();
                                maybeGiveClue();
                                addDialogue(getRandomDetectiveDialogue(), 'Vous');
                                if (result.gameOver) {
                                    setTimeout(function () {
                                        endGame(result.result === 'white');
                                    }, 800);
                                    return;
                                }
                                setTimeout(function () {
                                    var aiResult = game.aiMove();
                                    renderBoard();
                                    if (game.gameOver) {
                                        setTimeout(function () {
                                            endGame(game.result === 'white');
                                        }, 800);
                                    }
                                }, 300);
                            } else {
                                renderBoard();
                            }
                        });
                    })(r, c);

                    boardEl.appendChild(sq);
                }
            }

            if (turnEl) {
                turnEl.textContent = texts.turn + (game.turn === 'white' ? (lang === 'fr' ? 'Vous (Blancs)' : 'You (White)') : (lang === 'fr' ? 'Lady Vivienne (Noirs)' : 'Lady Vivienne (Black)'));
            }
        }

        function endGame(won) {
            game.gameOver = true;
            if (timerInterval) clearInterval(timerInterval);

            overlay.classList.remove('hidden');
            if (won) {
                resultEl.textContent = texts.youWin;
                resultEl.style.color = '#00c896';
                clueTextEl.textContent = VICTORY_CLUE[lang] || VICTORY_CLUE.fr;
                addClue({ text: VICTORY_CLUE[lang] || VICTORY_CLUE.fr, type: 'victory' });
            } else if (game.result === 'black') {
                resultEl.textContent = texts.youLose;
                resultEl.style.color = '#ff6464';
                clueTextEl.textContent = lang === 'fr'
                    ? 'Vous avez perdu la partie. L\'indice final reste caché...'
                    : 'You lost the game. The final clue remains hidden...';
            } else {
                resultEl.textContent = texts.draw;
                resultEl.style.color = '#d4af37';
                clueTextEl.textContent = lang === 'fr'
                    ? 'Partie nulle. Aucun indice décisif ne se dévoile.'
                    : 'Draw game. No decisive clue is revealed.';
            }
        }

        continueBtn.addEventListener('click', function () {
            if (typeof window.TDNarrativeEngine !== 'undefined' && typeof window.TDNarrativeEngine.addClue === 'function') {
                cluesFound.forEach(function (clue) {
                    if (clue.type !== 'false') {
                        window.TDNarrativeEngine.addClue(clue.text, clue.type || 'dialogue');
                    }
                });
            }
            window.location.href = '../true-detective/index.html?chess=complete';
        });

        skipBtn.addEventListener('click', function () {
            if (typeof window.TDNarrativeEngine !== 'undefined' && typeof window.TDNarrativeEngine.addClue === 'function') {
                cluesFound.forEach(function (clue) {
                    if (clue.type !== 'false') {
                        window.TDNarrativeEngine.addClue(clue.text, clue.type || 'dialogue');
                    }
                });
            }
            window.location.href = '../true-detective/index.html?chess=skipped';
        });

        backBtn.addEventListener('click', function () {
            window.location.href = '../true-detective/index.html';
        });

        addDialogue(lang === 'fr'
            ? 'Lady Vivienne vous invite à jouer. Ses yeux brillent d\'un étrange éclat.'
            : 'Lady Vivienne invites you to play. Her eyes shine with a strange gleam.', 'Vivienne');

        renderBoard();
        startTimer();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
