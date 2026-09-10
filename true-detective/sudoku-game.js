/* =====================================================================
    TRUE DETECTIVE - SUDOKU MINIGAME
    4x4 / 6x6 / 9x9 grid based on act
    Interrogation dialogue triggered on each number input
    Chess-style layout with character panel and dialogue sidebar
    ===================================================================== */
(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var BLACKWOOD_PHRASES = {
        fr: [
            "Vous n'y arriverez jamais...",
            "Le temps passe...",
            "Presque, mais pas tout à fait...",
            "Cette grille est diabolique, n'est-ce pas ?",
            "Je vous regarde vous embrouiller...",
            "Chaque case est un piège."
        ],
        en: [
            "You'll never solve this...",
            "Time's ticking...",
            "Almost, but not quite...",
            "This grid is diabolical, isn't it?",
            "I'm watching you struggle...",
            "Every cell is a trap."
        ]
    };

    var BLACKWOOD_TAUNTS = {
        fr: [
            "Incorrect. Réfléchissez mieux.",
            "Chaque erreur me fait sourire.",
            "Vous tournez en rond.",
            "La logique vous échappe.",
            "Un notaire ne se trompe jamais... sur son audience."
        ],
        en: [
            "Wrong. Think better.",
            "Each error makes me smile.",
            "You're going in circles.",
            "Logic eludes you.",
            "A notary never errs... on his fee."
        ]
    };

    function getRandomBlackwoodPhrase(lang) {
        var phrases = BLACKWOOD_PHRASES[lang] || BLACKWOOD_PHRASES.en;
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    function getGridConfig(act) {
        if (act === 1) return { size: 4, boxRows: 2, boxCols: 2, remove: 6 };
        if (act === 2) return { size: 6, boxRows: 3, boxCols: 3, remove: 20 };
        return { size: 9, boxRows: 3, boxCols: 3, remove: 40 };
    }

    function buildSudokuPuzzle(size, boxR, boxC, removeCount) {
        var grid = Array.from({ length: size }, function () { return Array(size).fill(0); });
        fillSudoku(grid, size, boxR, boxC);
        var solution = grid.map(function (r) { return r.slice(); });
        var positions = [];
        for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) positions.push([r, c]);
        }
        positions.sort(function () { return Math.random() - 0.5; });
        var removed = 0;
        for (var i = 0; i < positions.length && removed < removeCount; i++) {
            var pr = positions[i][0], pc = positions[i][1];
            if (grid[pr][pc] === 0) continue;
            grid[pr][pc] = 0;
            removed++;
        }
        return { puzzle: grid, solution: solution };
    }

    function fillSudoku(grid, size, boxR, boxC) {
        var nums = Array.from({ length: size }, function (_, i) { return i + 1; });
        function findEmpty(g) {
            for (var r = 0; r < size; r++) {
                for (var c = 0; c < size; c++) {
                    if (g[r][c] === 0) return [r, c];
                }
            }
            return null;
        }
        function isValid(g, r, c, n) {
            for (var j = 0; j < size; j++) { if (g[r][j] === n) return false; }
            for (var i = 0; i < size; i++) { if (g[i][c] === n) return false; }
            var br = Math.floor(r / boxR) * boxR, bc = Math.floor(c / boxC) * boxC;
            for (var i2 = 0; i2 < boxR; i2++) {
                for (var j2 = 0; j2 < boxC; j2++) {
                    if (g[br + i2][bc + j2] === n) return false;
                }
            }
            return true;
        }
        function solve(g) {
            var pos = findEmpty(g);
            if (!pos) return true;
            var rr = pos[0], cc = pos[1];
            var shuffled = nums.slice().sort(function () { return Math.random() - 0.5; });
            for (var k = 0; k < shuffled.length; k++) {
                var n = shuffled[k];
                if (isValid(g, rr, cc, n)) {
                    g[rr][cc] = n;
                    if (solve(g)) return true;
                    g[rr][cc] = 0;
                }
            }
            return false;
        }
        solve(grid);
    }

    function getConflictCells(grid, size, boxR, boxC, r, c) {
        if (!grid[r][c]) return [];
        var n = grid[r][c];
        var conflicts = [];
        for (var j = 0; j < size; j++) {
            if (j !== c && grid[r][j] === n) conflicts.push([r, j]);
        }
        for (var i = 0; i < size; i++) {
            if (i !== r && grid[i][c] === n) conflicts.push([i, c]);
        }
        var br = Math.floor(r / boxR) * boxR, bc = Math.floor(c / boxC) * boxC;
        for (var i2 = 0; i2 < boxR; i2++) {
            for (var j2 = 0; j2 < boxC; j2++) {
                var rr = br + i2, cc = bc + j2;
                if ((rr !== r || cc !== c) && grid[rr][cc] === n) conflicts.push([rr, cc]);
            }
        }
        return conflicts;
    }

    function getThemeId() {
        if (typeof window !== 'undefined' && window.getThemeId) return window.getThemeId();
        return 'agatha-christie';
    }

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId);
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = getThemeId();
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            if (npcId === 'suspect') return assets && assets.suspect;
        }
        return null;
    }

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId);
        }
        if (npcId === 'suspect') {
            return lang === 'fr' ? 'Rupert Blackwood' : 'Rupert Blackwood';
        }
        return npcId;
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'suspect') {
            return lang === 'fr' ? 'Notaire' : 'Notary';
        }
        return '';
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

        var interroId = cfg.interroId || 'suspect';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);

        var act = cfg.act || 1;
        var gc = getGridConfig(act);
        if (cfg.extreme) gc.remove += Math.min(14, Math.floor(gc.size * gc.size * 0.12));
        var size = gc.size, boxR = gc.boxRows, boxC = gc.boxCols;
        var generated = buildSudokuPuzzle(size, boxR, boxC, gc.remove);
        var puzzle = generated.puzzle.map(function (r) { return r.slice(); });
        var solution = generated.solution;
        var initialCells = [];
        for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
                if (puzzle[r][c] !== 0) initialCells.push(r + ',' + c);
            }
        }

        var overlay = document.getElementById('minigame-overlay');
        if (overlay) overlay.classList.add('chess-layout');

        var layoutContainer = target.parentElement;
        if (layoutContainer) layoutContainer.classList.add('chess-game-layout');

        var sidePanel = document.getElementById('chess-side-panel');
        var dialogueText = document.getElementById('chess-dialogue-text');
        var characterImage = document.getElementById('chess-character-image');
        var characterName = document.getElementById('chess-character-name');
        var characterRole = document.getElementById('chess-character-role');
        var historyEl = document.getElementById('chess-dialogue-history');
        var interroBoxEl = document.getElementById('chess-interro-box');
        var leftPanel = document.getElementById('chess-left-panel');

        if (sidePanel) sidePanel.style.display = 'flex';
        if (leftPanel) leftPanel.style.display = 'flex';

        var imgSrc = getNpcImage(interroId);
        if (characterImage && imgSrc) {
            characterImage.src = imgSrc;
            characterImage.alt = suspectName;
        }
        if (characterName) characterName.textContent = suspectName;
        if (characterRole) characterRole.textContent = suspectRole;

        var phraseList = cfg.dialogues && cfg.dialogues.length
            ? cfg.dialogues
            : (BLACKWOOD_PHRASES[lang] || BLACKWOOD_PHRASES.en);
        var tauntList = BLACKWOOD_TAUNTS[lang] || BLACKWOOD_TAUNTS.en;
        var phraseInterval = null;
        var inputsCount = 0;
        var interroPause = false;

        var interroData = null;
        var interroState = null;
        var interroCompleted = false;

        function setRandomDialogue() {
            if (!dialogueText) return;
            if (phraseList && phraseList.length) {
                dialogueText.textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
            }
        }

        function setIntervalSafe() {
            clearIntervalSafe();
            phraseInterval = setInterval(function () {
                if (!dialogueText || !dialogueText.parentNode) {
                    clearIntervalSafe();
                    return;
                }
                if (!interroState) {
                    setRandomDialogue();
                }
            }, 4000);
        }

        function clearIntervalSafe() {
            if (phraseInterval) {
                clearInterval(phraseInterval);
                phraseInterval = null;
            }
        }

        function clearInterro() {
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
        }

        function appendDialogue(text, speaker) {
            if (!historyEl) return;
            var line = document.createElement('div');
            line.className = 'chess-interro-history';
            if (speaker) {
                line.textContent = speaker + ': ' + text;
            } else {
                line.textContent = text;
            }
            historyEl.appendChild(line);
            historyEl.scrollTop = historyEl.scrollHeight;
        }

        function setDialogueText(text) {
            if (dialogueText) dialogueText.textContent = text;
        }

        function fetchInterroData() {
            if (typeof window !== 'undefined' && window.scr && window.scr.interro && window.scr.interro.id) {
                if (window.TDNarration && window.TDNarration.interrogations) {
                    interroData = window.TDNarration.interrogations[window.scr.interro.id];
                }
            }
            return interroData;
        }

        function getRounds() {
            if (!interroData) return [];
            var rounds = [];
            if (interroData.questions) rounds.push(interroData.questions);
            if (interroData.rounds2) rounds.push(interroData.rounds2);
            if (interroData.rounds3) rounds.push(interroData.rounds3);
            return rounds.filter(function (r) { return r && r.length; });
        }

        function renderInterrogation() {
            if (!interroData || !interroState || !interroBoxEl) return;
            var rounds = getRounds();
            if (!rounds.length) return;

            if (interroState.round >= rounds.length) {
                appendDialogue(lang === 'fr' ? 'Interrogatoire terminé.' : 'Interrogation complete.', null);
                finishInterrogation();
                return;
            }

            var currentRound = rounds[interroState.round] || [];
            var remaining = currentRound.filter(function (q) {
                return interroState.answered.indexOf(q.id || q.label) === -1;
            });

            if (!remaining.length) {
                if (interroState.round + 1 < rounds.length) {
                    interroState.round++;
                    interroState.answered = [];
                    renderInterrogation();
                } else {
                    appendDialogue(lang === 'fr' ? 'Interrogatoire terminé.' : 'Interrogation complete.', null);
                    finishInterrogation();
                }
                return;
            }

            interroBoxEl.innerHTML = '';

            var phaseLabel = document.createElement('div');
            phaseLabel.className = 'chess-interro-history';
            phaseLabel.textContent = (lang === 'fr' ? 'Phase ' : 'Phase ') +
                (interroState.round + 1) + '/' + rounds.length;
            interroBoxEl.appendChild(phaseLabel);

            remaining.forEach(function (q) {
                var btn = document.createElement('button');
                btn.className = 'chess-interro-question';
                btn.textContent = t(q.label, lang);
                btn.addEventListener('click', function () {
                    if (!interroState) return;
                    interroState.answered.push(q.id || q.label);
                    var response = t(q.response, lang) || '';
                    if (typeof window !== 'undefined' && typeof window.scrEnrichResponse === 'function') {
                        response = window.scrEnrichResponse(response, q);
                    }
                    if (typeof window !== 'undefined' && typeof window.scrSubstituteNames === 'function') {
                        response = window.scrSubstituteNames(response, getThemeId());
                    }
                    appendDialogue((lang === 'fr' ? 'Vous: ' : 'You: ') + t(q.label, lang), null);
                    appendDialogue(suspectName + ': ' + response, null);

                    var clue = null;
                    if (typeof window !== 'undefined' && typeof window.scrClueFromInterroResponse === 'function') {
                        clue = window.scrClueFromInterroResponse(response);
                    }
                    if (clue && typeof window !== 'undefined' && window.TDNarrativeEngine &&
                        typeof window.TDNarrativeEngine.addClue === 'function') {
                        window.TDNarrativeEngine.addClue(clue, q.evidence || 'dialogue');
                        if (typeof window.showClueToast === 'function') {
                            window.showClueToast(clue);
                        }
                    }

                    renderInterrogation();
                });
                interroBoxEl.appendChild(btn);
            });
        }

        function startInterrogation() {
            clearInterro();
            fetchInterroData();
            if (!interroData) return;

            interroState = { round: 0, answered: [] };
            interroCompleted = false;

            var rounds = getRounds();
            if (!rounds.length) return;

            clearIntervalSafe();
            interroPause = true;

            setDialogueText(lang === 'fr' ? 'Phase 1/3, Choisissez votre question :' : 'Phase 1/3, Pick your question:');
            appendDialogue(lang === 'fr' ? 'Phase 1/3, Choisissez votre question :' : 'Phase 1/3, Pick your question:', null);
            renderInterrogation();
        }

        function finishInterrogation() {
            interroState = null;
            interroData = null;
            interroCompleted = true;
            interroPause = false;
            clearInterro();
            setRandomDialogue();
            setIntervalSafe();
        }

        function onInputAction(wasConflict) {
            if (interroCompleted || interroPause) return;
            fetchInterroData();
            if (interroData && getRounds().length) {
                startInterrogation();
                return;
            }

            inputsCount++;
            var isTaunt = wasConflict || inputsCount % 2 === 1;
            var phrases = isTaunt
                ? (tauntList[Math.floor(Math.random() * tauntList.length)])
                : (phraseList[Math.floor(Math.random() * phraseList.length)]);
            setDialogueText(phrases);
            appendDialogue(phrases, suspectName);
        }

        target.innerHTML = '';

        var wrap = document.createElement('div');
        wrap.className = 'chess-board-wrapper';
        var content = document.createElement('div');
        content.className = 'sudoku-content';
        content.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;max-width:480px;';
        wrap.appendChild(content);
        target.appendChild(wrap);

        var titleEl = document.createElement('h3');
        titleEl.className = 'chess-dialogue-text';
        titleEl.style.cssText = 'font-size:1.2rem;color:#f0d890;text-align:center;margin:0;';
        titleEl.textContent = t(cfg.title, lang) || (lang === 'fr' ? 'Sudoku' : 'Sudoku');
        content.appendChild(titleEl);

        var gridEl = document.createElement('div');
        gridEl.className = 'sudoku-grid';
        var cellSize = size === 4 ? 55 : (size === 6 ? 42 : 36);
        gridEl.style.cssText = 'display:grid;grid-template-columns:repeat(' + size + ', ' + cellSize + 'px);grid-template-rows:repeat(' + size + ', ' + cellSize + 'px);gap:2px;background:#0a0a1a;padding:4px;border-radius:8px;';
        content.appendChild(gridEl);

        var numberPad = document.createElement('div');
        numberPad.className = 'sudoku-pad';
        numberPad.style.cssText = 'display:grid;grid-template-columns:repeat(' + (size <= 6 ? 5 : 6) + ', 1fr);gap:6px;width:100%;max-width:300px;';
        content.appendChild(numberPad);

        var selectedCell = null;

        function renderSudoku() {
            gridEl.innerHTML = '';
            for (var r = 0; r < size; r++) {
                for (var c = 0; c < size; c++) {
                    var cell = document.createElement('div');
                    cell.className = 'sudoku-cell';
                    cell.style.cssText = 'width:' + cellSize + 'px;height:' + cellSize + 'px;background:#0a0a1a;border:1px solid rgba(0,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:' + (cellSize * 0.5) + 'px;color:#00ffff;cursor:pointer;';
                    cell.dataset.row = r;
                    cell.dataset.col = c;

                    var isInitial = initialCells.indexOf(r + ',' + c) !== -1;
                    var val = puzzle[r][c];
                    if (val) {
                        cell.textContent = val;
                        if (isInitial) {
                            cell.style.background = '#1a1a3a';
                            cell.style.color = '#00ffff';
                            cell.style.cursor = 'default';
                        }
                    }

                    var conflicts = getConflictCells(puzzle, size, boxR, boxC, r, c);
                    if (conflicts.length > 0 && val) {
                        cell.style.background = 'rgba(255,107,107,0.3)';
                        cell.style.borderColor = '#ff6b6b';
                    }

                    if (selectedCell && selectedCell[0] === r && selectedCell[1] === c) {
                        cell.style.borderColor = '#00ffff';
                        cell.style.boxShadow = '0 0 10px rgba(0,255,255,0.5)';
                    }

                    cell.addEventListener('click', function () {
                        if (interroPause || isInitial) return;
                        var tr = parseInt(this.dataset.row);
                        var tc = parseInt(this.dataset.col);
                        if (initialCells.indexOf(tr + ',' + tc) !== -1) return;
                        selectedCell = [tr, tc];
                        renderSudoku();
                    });

                    gridEl.appendChild(cell);
                }
            }
        }

        function inputNumber(n) {
            if (interroPause || !selectedCell) return;
            var r = selectedCell[0], c = selectedCell[1];
            if (initialCells.indexOf(r + ',' + c) !== -1) return;
            var wasConflict = getConflictCells(puzzle, size, boxR, boxC, r, c).length > 0;
            if (n === 0) {
                puzzle[r][c] = 0;
                renderSudoku();
                onInputAction(wasConflict);
            } else {
                puzzle[r][c] = n;
                var conflicts = getConflictCells(puzzle, size, boxR, boxC, r, c);
                renderSudoku();
                onInputAction(conflicts.length > 0);
                if (!interroState) {
                    checkWin();
                }
            }
        }

        for (var n = 1; n <= size; n++) {
            (function (num) {
                var padBtn = document.createElement('button');
                padBtn.className = 'sudoku-pad-btn';
                padBtn.style.cssText = 'background:#1a1a3a;border:1px solid #00ffff;border-radius:8px;padding:8px;color:#00ffff;font-size:1.1rem;cursor:pointer;';
                padBtn.textContent = num;
                padBtn.addEventListener('click', function () { inputNumber(num); });
                numberPad.appendChild(padBtn);
            })(n);
        }

        var clearBtn = document.createElement('button');
        clearBtn.className = 'sudoku-pad-btn sudoku-clear';
        clearBtn.style.cssText = 'background:#1a1a3a;border:1px solid #ff6b6b;border-radius:8px;padding:8px;color:#ff6b6b;font-size:0.9rem;cursor:pointer;';
        clearBtn.textContent = '✕';
        clearBtn.addEventListener('click', function () { inputNumber(0); });
        numberPad.appendChild(clearBtn);

        function checkWin() {
            var won = true;
            for (var r = 0; r < size; r++) {
                for (var c = 0; c < size; c++) {
                    if (puzzle[r][c] !== solution[r][c]) { won = false; break; }
                    if (getConflictCells(puzzle, size, boxR, boxC, r, c).length > 0) { won = false; break; }
                }
                if (!won) break;
            }
            if (won) {
                setTimeout(function () {
                    cleanupSidePanel();
                    if (onDone) onDone({ won: true, clue: cfg.clue });
                }, 400);
            }
        }

        function cleanupSidePanel() {
            if (typeof window._interroSidebarCleanup === 'function') {
                window._interroSidebarCleanup();
                window._interroSidebarCleanup = null;
            }
        }

        setRandomDialogue();
        setIntervalSafe();

        window._interroSidebarCleanup = function () {
            clearIntervalSafe();
            if (overlay) overlay.classList.remove('chess-layout');
            if (layoutContainer) layoutContainer.classList.remove('chess-game-layout');
            if (sidePanel) sidePanel.style.display = 'none';
            if (leftPanel) leftPanel.style.display = 'none';
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
        };

        renderSudoku();
    }

    global.TDSudokuGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
