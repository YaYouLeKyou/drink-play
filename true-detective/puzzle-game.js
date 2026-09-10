/* =====================================================================
    TRUE DETECTIVE - SLIDING PUZZLE MINIGAME
    3x3 / 4x4 / 5x5 grid based on act
    Image generated with canvas API
    Interrogation dialogue triggered on each tile move
    Chess-style layout with character panel and dialogue sidebar
    ===================================================================== */
(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    var HALE_PHRASES = {
        fr: [
            "Vous cherchez quoi, inspecteur ?",
            "Chaque pièce a sa place... comme chaque mot.",
            "Ne perdez pas de vue l'objectif.",
            "La patience, c'est la clé.",
            "Cette énigme cache une vérité."
        ],
        en: [
            "What are you looking for, inspector?",
            "Every piece has its place... just like every word.",
            "Don't lose sight of the objective.",
            "Patience is the key.",
            "This puzzle hides a truth."
        ]
    };

    var HALE_TAUNTS = {
        fr: [
            "C'est tout ce que vous avez ?",
            "Vous tournez en rond, inspecteur.",
            "Chaque coup vous éloigne de la vérité.",
            "Vous n'êtes pas aussi malin que vous le pensez.",
            "Lent, très lent."
        ],
        en: [
            "Is that all you've got?",
            "You're going in circles, inspector.",
            "Each move takes you further from the truth.",
            "You're not as clever as you think.",
            "Slow, very slow."
        ]
    };

    function generateGridImage(cols, rows) {
        var canvas = document.createElement('canvas');
        var tileW = 100, tileH = 100;
        canvas.width = cols * tileW;
        canvas.height = rows * tileH;
        var ctx = canvas.getContext('2d');

        var hueStart = Math.floor(Math.random() * 360);
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var hue = (hueStart + (r * cols + c) * (360 / (rows * cols))) % 360;
                ctx.fillStyle = 'hsl(' + hue + ', 60%, 40%)';
                ctx.fillRect(c * tileW, r * tileH, tileW - 2, tileH - 2);
                ctx.fillStyle = 'white';
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var num = r * cols + c + 1;
                ctx.fillText(num, c * tileW + tileW / 2, r * tileH + tileH / 2);
            }
        }

        var total = cols * rows;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, rows * tileH - 50, cols * tileW, 50);
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(t({ fr: 'PUZZLE', en: 'PUZZLE' }, 'en'), cols * tileW / 2, rows * tileH - 22);

        return canvas.toDataURL();
    }

    function createPuzzleGrid(cols, rows) {
        var total = cols * rows;
        var tiles = [];
        for (var i = 0; i < total; i++) {
            tiles.push({ num: i + 1, row: Math.floor(i / cols), col: i % cols });
        }
        var emptyIdx = total - 1;
        var solvable = false;
        var grid, emptyR, emptyC;
        while (!solvable) {
            grid = shuffleArray(tiles.slice());
            emptyR = rows - 1;
            emptyC = cols - 1;
            solvable = isSolvable(grid, cols, rows, emptyR, emptyC);
        }
        return { tiles: grid, cols: cols, rows: rows, emptyR: emptyR, emptyC: emptyC };
    }

    function shuffleArray(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    function isSolvable(tiles, cols, rows, emptyR, emptyC) {
        var flat = tiles.map(function (t) { return t.num; });
        var inversions = 0;
        for (var i = 0; i < flat.length; i++) {
            for (var j = i + 1; j < flat.length; j++) {
                if (flat[i] && flat[j] && flat[i] > flat[j]) inversions++;
            }
        }
        if (cols % 2 === 1) return inversions % 2 === 0;
        var emptyFromBottom = rows - emptyR;
        if (emptyFromBottom % 2 === 0) return inversions % 2 === 1;
        return inversions % 2 === 0;
    }

    function getGridConfig(act) {
        if (act === 1) return { cols: 3, rows: 3 };
        if (act === 2) return { cols: 4, rows: 4 };
        return { cols: 5, rows: 5 };
    }

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId);
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = 'agatha-christie';
            if (typeof window.getThemeId === 'function') {
                themeId = window.getThemeId();
            }
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            if (npcId === 'protecteur') return assets && assets.protecteur;
        }
        return null;
    }

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId);
        }
        if (npcId === 'protecteur') {
            return lang === 'fr' ? 'Le Major Hale' : 'Major Hale';
        }
        return npcId;
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'protecteur') {
            return lang === 'fr' ? 'Gardien' : 'Guard';
        }
        return '';
    }

    function getThemeId() {
        if (typeof window !== 'undefined' && window.getThemeId) return window.getThemeId();
        return 'agatha-christie';
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

        var interroId = cfg.interroId || 'protecteur';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);

        var act = (cfg.act || 1);
        var gridCfg = getGridConfig(act);
        var cols = gridCfg.cols, rows = gridCfg.rows;
        var puzzle = createPuzzleGrid(cols, rows);
        var moves = 0;
        var startTime = Date.now();
        var gameOver = false;

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

        var phraseList = cfg.dialogues && cfg.dialogues.length ? cfg.dialogues : (HALE_PHRASES[lang] || HALE_PHRASES.en);
        var tauntList = HALE_TAUNTS[lang] || HALE_TAUNTS.en;
        var phraseInterval = null;
        var interroPause = false;

        var interroData = null;
        var interroState = null;
        var interroCompleted = false;

        function setRandomDialogue() {
            if (!dialogueText) return;
            var text = phraseList[Math.floor(Math.random() * phraseList.length)];
            dialogueText.textContent = text;
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
            phraseInterval = setInterval(function () {
                if (!dialogueText || !dialogueText.parentNode) {
                    clearInterval(phraseInterval);
                    phraseInterval = null;
                    return;
                }
                setRandomDialogue();
            }, 4000);
        }

        function onTileMove() {
            if (interroCompleted || interroPause) return;
            fetchInterroData();
            if (interroData && getRounds().length) {
                startInterrogation();
                return;
            }

            moves++;
            var isTaunt = moves % 2 === 1;
            var text = isTaunt
                ? (tauntList[Math.floor(Math.random() * tauntList.length)])
                : (phraseList[Math.floor(Math.random() * phraseList.length)]);
            setDialogueText(text);
            appendDialogue(text, suspectName);
        }

        target.innerHTML = '';

        var wrap = document.createElement('div');
        wrap.className = 'puzzle-wrap';
        wrap.style.cssText = 'width:100%;display:flex;flex-direction:column;align-items:center;gap:16px;';
        target.appendChild(wrap);

        var titleEl = document.createElement('h3');
        titleEl.className = 'chess-dialogue-text';
        titleEl.style.cssText = 'font-size:1.2rem;color:#f0d890;text-align:center;margin:0;';
        titleEl.textContent = t(cfg.title, lang) || (lang === 'fr' ? 'Puzzle Glissant' : 'Sliding Puzzle');
        wrap.appendChild(titleEl);

        var info = document.createElement('div');
        info.className = 'chess-dialogue-text';
        info.style.cssText = 'font-size:0.95rem;color:#a0c0d0;text-align:center;';
        wrap.appendChild(info);

        var gridEl = document.createElement('div');
        gridEl.className = 'puzzle-grid';
        gridEl.style.cssText = 'display:grid;grid-template-columns:repeat(' + cols + ', 1fr);gap:4px;width:100%;max-width:420px;';
        wrap.appendChild(gridEl);

        function renderPuzzle() {
            gridEl.innerHTML = '';
            var cellW = Math.min(90, (Math.min(window.innerWidth - 40, 500)) / cols);
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < cols; c++) {
                    var tile = puzzle.tiles[r * cols + c];
                    if (!tile) continue;
                    var tileEl = document.createElement('div');
                    tileEl.className = 'puzzle-tile';
                    tileEl.style.cssText = 'width:' + cellW + 'px;height:' + cellW + 'px;background:#1a1a3a;border:2px solid #00ffff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#00ffff;cursor:pointer;';
                    tileEl.textContent = tile.num;
                    tileEl.dataset.row = r;
                    tileEl.dataset.col = c;

                    tileEl.addEventListener('click', function () {
                        if (gameOver || interroPause) return;
                        var tr = parseInt(this.dataset.row);
                        var tc = parseInt(this.dataset.col);
                        if ((Math.abs(tr - puzzle.emptyR) + Math.abs(tc - puzzle.emptyC)) !== 1) return;
                        var idx = tr * cols + tc;
                        var eIdx = puzzle.emptyR * cols + puzzle.emptyC;
                        var tmp = puzzle.tiles[idx];
                        puzzle.tiles[idx] = puzzle.tiles[eIdx];
                        puzzle.tiles[eIdx] = tmp;
                        puzzle.emptyR = tr;
                        puzzle.emptyC = tc;
                        moves++;
                        info.textContent = (lang === 'fr' ? 'Mouvements : ' : 'Moves: ') + moves;
                        renderPuzzle();
                        onTileMove();
                        if (!interroState) {
                            checkWin();
                        }
                    });

                    gridEl.appendChild(tileEl);
                }
            }
        }

        function checkWin() {
            var won = true;
            for (var i = 0; i < puzzle.tiles.length; i++) {
                if (!puzzle.tiles[i]) continue;
                if (puzzle.tiles[i].num !== i + 1) { won = false; break; }
            }
            if (won) {
                gameOver = true;
                var elapsed = Math.floor((Date.now() - startTime) / 1000);
                info.innerHTML = '<span style="color:#00ff88">' +
                    (lang === 'fr' ? '✅ Résolu en ' + moves + ' coups et ' + elapsed + 's !' : '✅ Solved in ' + moves + ' moves and ' + elapsed + 's!') +
                    '</span>';
                clearIntervalSafe();
                setTimeout(function () {
                    if (interroState) return;
                    cleanupSidePanel();
                    if (onDone) onDone({ won: true, clue: cfg.clue });
                }, 600);
            }
        }

        function cleanupSidePanel() {
            if (typeof window._interroSidebarCleanup === 'function') {
                window._interroSidebarCleanup();
                window._interroSidebarCleanup = null;
            }
        }

        info.textContent = (lang === 'fr' ? 'Mouvements : 0' : 'Moves: 0');
        setRandomDialogue();

        phraseInterval = setInterval(function () {
            if (!dialogueText || !dialogueText.parentNode) {
                clearInterval(phraseInterval);
                phraseInterval = null;
                return;
            }
            if (!interroState) {
                setRandomDialogue();
            }
        }, 4000);

        window._interroSidebarCleanup = function () {
            clearIntervalSafe();
            if (overlay) overlay.classList.remove('chess-layout');
            if (layoutContainer) layoutContainer.classList.remove('chess-game-layout');
            if (sidePanel) sidePanel.style.display = 'none';
            if (leftPanel) leftPanel.style.display = 'none';
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
        };

        renderPuzzle();
    }

    global.TDPuzzleGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
