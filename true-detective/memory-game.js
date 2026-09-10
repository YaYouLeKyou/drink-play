/* =====================================================================
    TRUE DETECTIVE - MEMORY CARD GAME
    Match pairs of suspect portraits
    Interrogation dialogue triggered on each card flip pair
    Follows chess-style layout with centralized, non-scrollable game
    ===================================================================== */
(function (global) {
    'use strict';

    var ASSETS_BASE = 'assets/image true detective/';

    var THEME_IMG_FOLDER = {
        'agatha-christie': 'characteres/classic/',
        'cyberpunk': 'characteres/cyberpunk/',
        'film-noir': 'characteres/noire/'
    };

    var THEME_IMG_NAME = {
        'classic': {
            'protecteur': 'Le_Protecteur.png',
            'femme-fatale': 'femme-fatal.png',
            'seducteur': 'le-seducteur.png',
            'suspect': 'Le-suspect.png',
            'marginal': 'Le-marginal.png',
            'criminel': 'le-criminel.png'
        },
        'cyberpunk': {
            'protecteur': 'protecteur.png',
            'femme-fatale': 'femme-fatal.png',
            'seducteur': 'seducteur.png',
            'suspect': 'suspect.png',
            'marginal': 'marginal.png',
            'criminel': 'criminel.png'
        },
        'noire': {
            'protecteur': 'protecteur.png',
            'femme-fatale': 'femme fatal.png',
            'seducteur': 'seducteur.png',
            'suspect': 'suspect.png',
            'marginal': 'marginal.png',
            'criminel': 'criminel.png'
        }
    };

    var THEME_FOLDER_KEY = {
        'agatha-christie': 'classic',
        'cyberpunk': 'cyberpunk',
        'film-noir': 'noire'
    };

    var KRANE_PHRASES = {
        fr: [
            "Retournez les cartes... je vous regarde.",
            "Vous ne trouverez pas la paire facilement.",
            "Le hasard ne vous sourira pas longtemps."
        ],
        en: [
            "Flip the cards... I'm watching.",
            "You won't find the matching pair easily.",
            "Luck won't smile on you for long."
        ]
    };

    var KRANE_TAUNTS = {
        fr: [
            "Toujours pas ? Vous êtes lent.",
            "Une paire ratée. Lamentable.",
            "Je risque de m'ennuyer.",
            "Chaque tentative est une défaite en soi.",
            "Vous me gavez, mais pas ma patience."
        ],
        en: [
            "Still nothing? You're slow.",
            "A missed pair. Pathetic.",
            "I might get bored.",
            "Each attempt is defeat in itself.",
            "You're wasting my time, not my patience."
        ]
    };

    var VICTORY_PHRASES = {
        fr: [
            "Impossible... vous avez gagne.",
            "La mémoire fait défaut... aujourd'hui.",
            "Vous avez de la chance."
        ],
        en: [
            "Impossible... you won.",
            "Memory fails... today.",
            "You got lucky."
        ]
    };

    var FAILURE_PHRASES = {
        fr: [
            "Tant pis. Vous etes lent.",
            "La memoire n'est pas votre fort.",
            "Reessayez quand vous serez plus rapide."
        ],
        en: [
            "Too bad. You're slow.",
            "Memory isn't your strong suit.",
            "Try again when you're faster."
        ]
    };

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    function getThemeId() {
        if (typeof window !== 'undefined' && window.getThemeId) return window.getThemeId();
        if (typeof window !== 'undefined' && window.THEME_ACT_TITLES) {
            var keys = Object.keys(window.THEME_ACT_TITLES);
            if (keys.length) return keys[0];
        }
        return 'agatha-christie';
    }

    function getCardImage(themeId, suspectId) {
        var folderKey = THEME_FOLDER_KEY[themeId] || 'classic';
        var folder = THEME_IMG_FOLDER[themeId] || THEME_IMG_FOLDER['agatha-christie'];
        var fileName = THEME_IMG_NAME[folderKey] && THEME_IMG_NAME[folderKey][suspectId];
        return fileName ? ASSETS_BASE + folder + fileName : null;
    }

    function getSceneBackground(themeId) {
        if (typeof window !== 'undefined' && window.THEME_ASSETS && window.THEME_ASSETS[themeId]) {
            var assets = window.THEME_ASSETS[themeId];
            return assets.universeImg || assets.universe || assets.scene || '';
        }
        return '';
    }

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId);
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = getThemeId();
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            if (npcId === 'criminel') return assets && assets.criminel;
        }
        return getCriminalImage(getThemeId());
    }

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId);
        }
        if (npcId === 'criminel') {
            return lang === 'fr' ? 'Victor Krane' : 'Victor Krane';
        }
        return npcId;
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'criminel') {
            return lang === 'fr' ? 'Tueur à gages' : 'Hitman';
        }
        return '';
    }

    var SUSPECTS = [
        { id: 'protecteur', emoji: '🕵️', label: 'Hale' },
        { id: 'femme-fatale', emoji: '👩', label: 'Vivienne' },
        { id: 'seducteur', emoji: '🎩', label: 'Pembrooke' },
        { id: 'suspect', emoji: '💼', label: 'Blackwood' },
        { id: 'marginal', emoji: '🚬', label: 'Silas' },
        { id: 'criminel', emoji: '🔪', label: 'Krane' }
    ];

    var CARD_IMG_CACHE = {};

    function resolveCardImage(suspectId) {
        if (CARD_IMG_CACHE.hasOwnProperty(suspectId)) return CARD_IMG_CACHE[suspectId];
        var themeId = getThemeId();
        var path = getCardImage(themeId, suspectId);
        CARD_IMG_CACHE[suspectId] = path;
        return path;
    }

    function getGridConfig(act) {
        if (act === 1) return { cols: 4, rows: 4, pairs: 8 };
        if (act === 2) return { cols: 6, rows: 4, pairs: 12 };
        return { cols: 6, rows: 6, pairs: 18 };
    }

    function generateDeck(act) {
        var gc = getGridConfig(act);
        var pairs = gc.pairs;
        var deck = [];
        for (var i = 0; i < pairs; i++) {
            var suspect = SUSPECTS[i % SUSPECTS.length];
            var img = resolveCardImage(suspect.id);
            var entry = { id: suspect.id + '_' + i, suspectId: suspect.id, emoji: suspect.emoji, label: suspect.label };
            if (img) entry.img = img;
            deck.push(entry);
            var pairEntry = { id: suspect.id + '_' + i + '_pair', suspectId: suspect.id, emoji: suspect.emoji, label: suspect.label };
            if (img) pairEntry.img = img;
            deck.push(pairEntry);
        }
        for (var j = deck.length - 1; j > 0; j--) {
            var k = Math.floor(Math.random() * (j + 1));
            var tmp = deck[j]; deck[j] = deck[k]; deck[k] = tmp;
        }
        return deck;
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

        var interroId = cfg.interroId || 'criminel';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);
        var act = cfg.act || 1;
        var gc = getGridConfig(act);
        var cards = generateDeck(act);
        var flipped = [];
        var matched = [];
        var locked = false;
        var startTime = Date.now();
        var timerInterval = null;
        var interroPause = false;
        var phraseInterval = null;
        var flipCount = 0;

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

        if (sidePanel) sidePanel.style.display = 'flex';
        var leftPanel = document.getElementById('chess-left-panel');
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
            : (KRANE_PHRASES[lang] || KRANE_PHRASES.en);
        var tauntList = (cfg.dialogues && cfg.dialogues.afterLose && cfg.dialogues.afterLose.length)
            ? cfg.dialogues.afterLose
            : (KRANE_TAUNTS[lang] || KRANE_TAUNTS.en);

        var interroData = null;
        var interroState = null;
        var interroCompleted = false;

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

        function clearInterro() {
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
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

        function setRandomDialogue() {
            if (!dialogueText) return;
            var text = phraseList[Math.floor(Math.random() * phraseList.length)];
            dialogueText.textContent = text;
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

        function onFlipAction() {
            if (interroCompleted || interroPause) return;
            fetchInterroData();
            if (interroData && getRounds().length) {
                startInterrogation();
                return;
            }
            flipCount++;
            var isTaunt = flipCount % 2 === 1;
            var list = isTaunt ? tauntList : phraseList;
            var text = list[Math.floor(Math.random() * list.length)];
            setDialogueText(text);
            appendDialogue(text, suspectName);
        }

        target.innerHTML = '';

        var wrap = document.createElement('div');
        wrap.className = 'memory-game-container';
        // Responsive sizing to fit on screen
        var maxWidth = Math.min(500, window.innerWidth - 32);
        var maxHeight = window.innerHeight - 200; // Account for top/bottom bars
        wrap.style.cssText = 'width:100%;max-width:' + maxWidth + 'px;max-height:' + maxHeight + 'px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px;overflow:hidden;';
        // Add scene background
        var themeId = getThemeId();
        var bgUrl = getSceneBackground(themeId);
        if (bgUrl) {
            wrap.style.backgroundImage = 'url(' + bgUrl + ')';
            wrap.style.backgroundSize = 'cover';
            wrap.style.backgroundPosition = 'center';
            wrap.style.borderRadius = '16px';
            wrap.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
        }
        target.appendChild(wrap);

        var header = document.createElement('div');
        header.className = 'chess-board-wrapper';
        header.style.cssText = 'width:100%;background:transparent;border:1px solid rgba(0,255,255,0.15);border-radius:16px;padding:16px;box-shadow:0 20px 50px rgba(0,0,0,0.45);';
        wrap.appendChild(header);

        var titleEl = document.createElement('h3');
        titleEl.className = 'chess-dialogue-text';
        titleEl.style.cssText = 'font-size:1.2rem;color:#f0d890;text-align:center;text-shadow:0 1px 4px rgba(0,0,0,0.8);margin:0 0 12px 0;';
        titleEl.textContent = t(cfg.title, lang) || (lang === 'fr' ? 'Jeu de mémoire' : 'Memory Game');
        header.appendChild(titleEl);

        var timerEl = document.createElement('div');
        timerEl.className = 'chess-dialogue-text';
        timerEl.style.cssText = 'font-size:1.1rem;color:#00ffff;text-align:center;margin:0 0 12px 0;';
        timerEl.textContent = '00:00';
        header.appendChild(timerEl);

        var pairsLeftEl = document.createElement('div');
        pairsLeftEl.className = 'chess-dialogue-text';
        pairsLeftEl.style.cssText = 'font-size:0.9rem;color:#a0c0d0;text-align:center;margin-bottom:12px;';
        pairsLeftEl.textContent = (lang === 'fr' ? 'Paires restantes : ' : 'Pairs left: ') + gc.pairs;
        header.appendChild(pairsLeftEl);

        var gridEl = document.createElement('div');
        gridEl.className = 'memory-grid';
        // Responsive grid that fits in available space
        var cardGap = 8;
        var headerHeight = 120; // approximate header + timer + pairs
        var skipBtnHeight = 48;
        var availableHeight = maxHeight - headerHeight - skipBtnHeight - 32;
        var cardHeight = Math.floor((availableHeight - (gc.rows - 1) * cardGap) / gc.rows);
        var cardWidth = Math.floor((maxWidth - (gc.cols - 1) * cardGap) / gc.cols);
        var cardSize = Math.min(cardWidth, cardHeight, 100);
        gridEl.style.cssText = 'display:grid;grid-template-columns:repeat(' + gc.cols + ', ' + cardSize + 'px);gap:' + cardGap + 'px;justify-content:center;align-content:center;flex:1 1 auto;min-height:0;';
        wrap.appendChild(gridEl);

        timerInterval = setInterval(function () {
            var elapsed = Math.floor((Date.now() - startTime) / 1000);
            var mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            var secs = (elapsed % 60).toString().padStart(2, '0');
            timerEl.textContent = mins + ':' + secs;
        }, 1000);

        function renderCards() {
            if (interroPause) return;
            gridEl.innerHTML = '';
            for (var i = 0; i < cards.length; i++) {
                var cardData = cards[i];
                var isFlipped = flipped.indexOf(i) !== -1;
                var isMatched = matched.indexOf(i) !== -1;

                var card = document.createElement('div');
                card.className = 'memory-card';
                card.style.cssText = 'width:' + cardSize + 'px;height:' + cardSize + 'px;background:#1a1a3a;border:2px solid #00ffff;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:' + Math.max(1, Math.floor(cardSize / 3)) + 'rem;perspective:800px;';
                if (isFlipped || isMatched) {
                    card.classList.add('flipped');
                    card.style.backgroundColor = '#0a0a1a';
                    card.style.borderColor = '#ff00ff';
                }
                if (isMatched) {
                    card.classList.add('matched');
                    card.style.opacity = '0.5';
                }
                card.dataset.index = i;

                var front = document.createElement('div');
                front.className = 'memory-card-front';
                front.textContent = '?';

                var back = document.createElement('div');
                back.className = 'memory-card-back';
                back.style.cssText = 'display:flex;align-items:center;justify-content:center;';

                if (cardData.img) {
                    var cardImg = document.createElement('img');
                    cardImg.src = cardData.img;
                    cardImg.alt = cardData.label;
                    cardImg.style.maxWidth = '100%';
                    cardImg.style.maxHeight = '100%';
                    cardImg.addEventListener('error', function () {
                        back.textContent = cardData.emoji;
                    });
                    back.appendChild(cardImg);
                } else {
                    back.textContent = cardData.emoji;
                }

                var label = document.createElement('span');
                label.className = 'memory-card-label';
                label.style.cssText = 'position:absolute;bottom:4px;left:4px;right:4px;text-align:center;font-size:' + Math.max(0.5, Math.floor(cardSize / 180)) + 'rem;color:#a0c0d0;';
                label.textContent = cardData.label;
                back.appendChild(label);

                card.appendChild(front);
                card.appendChild(back);

                (function (idx) {
                    card.addEventListener('click', function () {
                        if (locked || interroPause) return;
                        if (flipped.indexOf(idx) !== -1) return;
                        if (matched.indexOf(idx) !== -1) return;

                        flipped.push(idx);
                        card.classList.add('flipped');

                        if (flipped.length === 2) {
                            locked = true;
                            var idx1 = flipped[0];
                            var idx2 = flipped[1];
                            var card1 = cards[idx1];
                            var card2 = cards[idx2];

                            onFlipAction();

                            if (card1.suspectId === card2.suspectId) {
                                matched.push(idx1, idx2);
                                flipped = [];
                                locked = false;
                                pairsLeftEl.textContent = (lang === 'fr' ? 'Paires restantes : ' : 'Pairs left: ') + (gc.pairs - matched.length / 2);

                                var allMatched = matched.length === cards.length;
                                if (allMatched && !interroState) {
                                    clearInterval(timerInterval);
                                    var victoryText = VICTORY_PHRASES[lang] || VICTORY_PHRASES.en;
                                    setDialogueText(victoryText[Math.floor(Math.random() * victoryText.length)]);
                                    setTimeout(function () {
                                        if (interroState) return;
                                        cleanupSidePanel();
                                        if (onDone) onDone({ won: true, clue: cfg.clue });
                                    }, 400);
                                }
                            } else {
                                setTimeout(function () {
                                    var el1 = gridEl.querySelector('[data-index="' + idx1 + '"]');
                                    var el2 = gridEl.querySelector('[data-index="' + idx2 + '"]');
                                    if (el1) el1.classList.remove('flipped');
                                    if (el2) el2.classList.remove('flipped');
                                    flipped = [];
                                    locked = false;
                                    renderCards();
                                }, 800);
                            }
                        }
                    });
                })(i);

                gridEl.appendChild(card);
            }
        }

        setRandomDialogue();
        setIntervalSafe();

        window._interroSidebarCleanup = function () {
            clearIntervalSafe();
            if (timerInterval) clearInterval(timerInterval);
            if (overlay) overlay.classList.remove('chess-layout');
            if (layoutContainer) layoutContainer.classList.remove('chess-game-layout');
            if (sidePanel) sidePanel.style.display = 'none';
            if (leftPanel) leftPanel.style.display = 'none';
            if (historyEl) historyEl.innerHTML = '';
            if (interroBoxEl) interroBoxEl.innerHTML = '';
        };

        function cleanupSidePanel() {
            if (typeof window._interroSidebarCleanup === 'function') {
                window._interroSidebarCleanup();
                window._interroSidebarCleanup = null;
            }
        }

        renderCards();
    }

    global.TDMemoryGame = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);
