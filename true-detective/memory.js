/* =====================================================================
   TRUE DETECTIVE - MEMORY GAME (Standalone)
   Match pairs of suspect cards. Simple, self-contained.
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

    var SUSPECTS = [
        { id: 'protecteur', emoji: '🕵️', label: 'Hale' },
        { id: 'femme-fatale', emoji: '👩', label: 'Vivienne' },
        { id: 'seducteur', emoji: '🎩', label: 'Pembrooke' },
        { id: 'suspect', emoji: '💼', label: 'Blackwood' },
        { id: 'marginal', emoji: '🚬', label: 'Silas' },
        { id: 'criminel', emoji: '🔪', label: 'Krane' }
    ];

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
            "Impossible... vous avez gagné.",
            "La mémoire fait défaut... aujourd'hui.",
            "Vous avez de la chance."
        ],
        en: [
            "Impossible... you won.",
            "Memory fails... today.",
            "You got lucky."
        ]
    };

    function getThemeId() {
        return 'agatha-christie';
    }

    function getCardImage(themeId, suspectId) {
        var folderKey = THEME_FOLDER_KEY[themeId] || 'classic';
        var folder = THEME_IMG_FOLDER[themeId] || THEME_IMG_FOLDER['agatha-christie'];
        var fileName = THEME_IMG_NAME[folderKey] && THEME_IMG_NAME[folderKey][suspectId];
        return fileName ? ASSETS_BASE + folder + fileName : null;
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
            var img = getCardImage('agatha-christie', suspect.id);
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

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
        if (diff < 1 || diff > 3) diff = 1;
        var act = diff;

        var $title = document.getElementById('memory-title');
        var $timer = document.getElementById('memory-timer');
        var $pairs = document.getElementById('memory-pairs');
        var $grid = document.getElementById('memory-grid');
        var $dialogue = document.getElementById('memory-dialogue');

        var gc = getGridConfig(act);
        var cards = generateDeck(act);
        var flipped = [];
        var matched = [];
        var locked = false;
        var startTime = Date.now();
        var timerInterval = null;
        var flipCount = 0;
        var gameWon = false;

        if ($title) {
            $title.textContent = lang === 'fr' ? 'Jeu de mémoire' : 'Memory Game';
        }

        function setDialogue(text) {
            if ($dialogue) $dialogue.textContent = text;
        }

        function updateStats() {
            if ($pairs) {
                var left = gc.pairs - matched.length / 2;
                $pairs.textContent = (lang === 'fr' ? 'Paires: ' : 'Pairs: ') + (matched.length / 2) + '/' + gc.pairs;
            }
        }

        timerInterval = setInterval(function () {
            if (gameWon) return;
            var elapsed = Math.floor((Date.now() - startTime) / 1000);
            var mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            var secs = (elapsed % 60).toString().padStart(2, '0');
            if ($timer) $timer.textContent = mins + ':' + secs;
        }, 1000);

        var phraseList = KRANE_PHRASES[lang] || KRANE_PHRASES.en;
        var tauntList = KRANE_TAUNTS[lang] || KRANE_TAUNTS.en;

        setDialogue(phraseList[Math.floor(Math.random() * phraseList.length)]);

        var cardGap = 8;
        var maxWidth = Math.min(600, window.innerWidth - 32);
        var maxHeight = window.innerHeight - 200;
        var cardHeight = Math.floor((maxHeight - (gc.rows - 1) * cardGap) / gc.rows);
        var cardWidth = Math.floor((maxWidth - (gc.cols - 1) * cardGap) / gc.cols);
        var cardSize = Math.min(cardWidth, cardHeight, 100);

        $grid.style.gridTemplateColumns = 'repeat(' + gc.cols + ', ' + cardSize + 'px)';
        $grid.style.gridTemplateRows = 'repeat(' + gc.rows + ', ' + cardSize + 'px)';
        $grid.style.gap = cardGap + 'px';
        $grid.innerHTML = '';

        for (var i = 0; i < cards.length; i++) {
            var cardData = cards[i];

            var card = document.createElement('div');
            card.className = 'memory-card';
            card.style.width = cardSize + 'px';
            card.style.height = cardSize + 'px';
            card.dataset.index = i;

            var front = document.createElement('div');
            front.className = 'memory-card-front';
            front.textContent = '?';

            var back = document.createElement('div');
            back.className = 'memory-card-back';

            if (cardData.img) {
                var img = document.createElement('img');
                img.src = cardData.img;
                img.alt = cardData.label;
                img.className = 'memory-card-img';
                img.style.maxWidth = '80%';
                img.style.maxHeight = '70%';
                img.onerror = function () {
                    this.style.display = 'none';
                    back.textContent = cardData.emoji;
                };
                back.appendChild(img);
            } else {
                back.textContent = cardData.emoji;
            }

            var label = document.createElement('span');
            label.className = 'memory-card-label';
            label.textContent = cardData.label;
            back.appendChild(label);

            card.appendChild(front);
            card.appendChild(back);
            $grid.appendChild(card);

            (function (idx, cardEl, data) {
                cardEl.addEventListener('click', function () {
                    if (locked || gameWon) return;
                    if (flipped.indexOf(idx) !== -1) return;
                    if (matched.indexOf(idx) !== -1) return;

                    flipped.push(idx);
                    cardEl.classList.add('flipped');
                    playSfx('card_flip');

                    if (flipped.length === 2) {
                        locked = true;
                        var idx1 = flipped[0];
                        var idx2 = flipped[1];
                        var card1 = cards[idx1];
                        var card2 = cards[idx2];

                        flipCount++;
                        var isTaunt = flipCount % 2 === 1;
                        var list = isTaunt ? tauntList : phraseList;
                        setDialogue(list[Math.floor(Math.random() * list.length)]);

                        if (card1.suspectId === card2.suspectId) {
                            matched.push(idx1, idx2);
                            var otherIdx = idx1 === idx ? idx2 : idx1;
                            var otherCard = $grid.querySelector('[data-index="' + otherIdx + '"]');
                            if (otherCard) {
                                otherCard.classList.add('flipped', 'matched');
                                var otherData = cards[otherIdx];
                                otherCard.querySelector('.memory-card-back').innerHTML = '';
                                if (otherData.img) {
                                    var otherImg = document.createElement('img');
                                    otherImg.src = otherData.img;
                                    otherImg.alt = otherData.label;
                                    otherImg.className = 'memory-card-img';
                                    otherImg.style.maxWidth = '80%';
                                    otherImg.style.maxHeight = '70%';
                                    otherImg.onerror = function () {
                                        this.style.display = 'none';
                                        otherCard.querySelector('.memory-card-back').textContent = otherData.emoji;
                                    };
                                    otherCard.querySelector('.memory-card-back').appendChild(otherImg);
                                } else {
                                    otherCard.querySelector('.memory-card-back').textContent = otherData.emoji;
                                }
                            }
                            flipped = [];
                            locked = false;
                            updateStats();

                            var allMatched = matched.length === cards.length;
                            if (allMatched) {
                                gameWon = true;
                                clearInterval(timerInterval);
                                var victoryText = VICTORY_PHRASES[lang] || VICTORY_PHRASES.en;
                                setDialogue(victoryText[Math.floor(Math.random() * victoryText.length)]);
                                setTimeout(function () {
                                    try {
                                        localStorage.setItem('td_standalone_game_result', JSON.stringify({
                                            type: 'memory',
                                            won: true,
                                            ts: Date.now()
                                        }));
                                    } catch (e) {}
                                    var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                                    window.location.href = fromStory ? '../true-detective/index.html?standalone=memory' : '../true-detective/index.html#minigames';
                                }, 800);
                            }
                        } else {
                            setTimeout(function () {
                                cardEl.classList.remove('flipped');
                                var otherCardEl = $grid.querySelector('[data-index="' + (idx1 === idx ? idx2 : idx1) + '"]');
                                if (otherCardEl) otherCardEl.classList.remove('flipped');
                                flipped = [];
                                locked = false;
                            }, 800);
                        }
                    }
                });
            })(i, card, cardData);

            updateStats();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);
