/* =====================================================================
    TRUE DETECTIVE - JACKPOT (Standalone)
    Enhanced slot machine with staggered reels, win celebration, and neon effects.
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

    /* Rouleaux thématiques : coeur = liaison, coeur brisé = inimitié,
       dollar = histoire d'argent. Le jackpot tombe à 40 % par tour. */
    var SYMBOLS = ['❤️', '💔', '💲'];
    var JACKPOT_CHANCE = 0.40;

    /* Indices ancrés dans l'enquête du Duc (scenario.js / phases.js). */
    var CLUES = {
        fr: {
            heart: [
                "Liaison secrète : Lady Vivienne et Julian Pembrooke se retrouvaient à l'abri des regards, au grand dam du Major Hale.",
                "Le Major Hale courtisait Lady Vivienne depuis des mois — elle ne lui a jamais rien promis.",
                "Le peigne de Lady Vivienne porte une gravure « J.P. » : un cadeau de Pembrooke, visiblement offert en cachette."
            ],
            broken: [
                "Inimitié ouverte : le Major Hale voue une haine farouche à Julian Pembrooke, son rival auprès de Vivienne.",
                "Silas Crane n'a jamais pardonné au Duc de l'avoir humilié publiquement lors d'une partie de cartes.",
                "Victor Krane jure que le Major Hale lui a passé commande — lui, l'assassin à gage, contre Pembrooke."
            ],
            money: [
                "Rupert Blackwood, le notaire, devait une fortune au Duc : seule la mort du créancier pouvait effacer la dette.",
                "Des versements réguliers du compte de Hale alimentaient une tirelire au nom de Victor Krane.",
                "Le coffre du Duc a été fouillé : les reçus de prêt signés par Blackwood ont disparu."
            ]
        },
        en: {
            heart: [
                "Secret affair: Lady Vivienne and Julian Pembrooke met away from prying eyes, much to Major Hale's despair.",
                "Major Hale has been courting Lady Vivienne for months — she never promised him anything.",
                "Lady Vivienne's comb bears the engraving \"J.P.\": a gift from Pembrooke, clearly given in secret."
            ],
            broken: [
                "Open enmity: Major Hale harbours fierce hatred for Julian Pembrooke, his rival for Vivienne.",
                "Silas Crane never forgave the Duke for publicly humiliating him during a card game.",
                "Victor Krane swears Major Hale placed the order — he, the hired killer, against Pembrooke."
            ],
            money: [
                "Rupert Blackwood, the notary, owed the Duke a fortune: only the creditor's death could erase the debt.",
                "Regular payments from Hale's account fed a stash under Victor Krane's name.",
                "The Duke's safe was searched: loan receipts signed by Blackwood have vanished."
            ]
        }
    };
    var TYPE_BY_SYMBOL = { '❤️': 'heart', '💔': 'broken', '💲': 'money' };

    var PHRASES = {
        fr: [
            "La chance est un mensonge... mais essayez quand même.",
            "Pembrooke sourit : « Faites tourner les rouleaux. »",
            "Les rouleaux tournent... le destin aussi.",
            "Un petit tour, et puis s'en va ? Pas si sûr."
        ],
        en: [
            "Luck is a lie... but try anyway.",
            "Pembrooke smiles: \"Spin the reels.\"",
            "The reels spin... and so does fate.",
            "Just a little spin, and then gone? Not so sure."
        ]
    };

    /* Le jackpot est décidé d'avance (40 %) : en cas de gain, les trois
       rouleaux s'alignent sur le même symbole thématique. Sinon, au moins
       un symbole diffère, sans jamais former un trio gagnant. */
    function rollReels() {
        if (Math.random() < JACKPOT_CHANCE) {
            var sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            return [sym, sym, sym];
        }
        var pick = function () { return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]; };
        var a = pick(), b = pick(), c = pick();
        while (a === b && b === c) { c = pick(); }
        return [a, b, c];
    }

    function init() {
        playMinigameMusic('jackpot');
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var spins = 8;
        var spinsLeft = spins;
        var gameOver = false;

        var $reel1 = document.getElementById('reel1');
        var $reel2 = document.getElementById('reel2');
        var $reel3 = document.getElementById('reel3');
        var $spins = document.getElementById('jackpot-spins');
        var $btn = document.getElementById('jackpot-btn');
        var $machine = document.querySelector('.jackpot-machine');
        var $clue = document.getElementById('jackpot-clue');
        var collectedClues = [];
        var clueCursor = { heart: 0, broken: 0, money: 0 };

        function showClue(type) {
            var pool = CLUES[lang === 'en' ? 'en' : 'fr'][type];
            if (!pool || !pool.length) return null;
            var idx = clueCursor[type] % pool.length;
            clueCursor[type]++;
            return pool[idx];
        }

        function updateSpins() {
            if ($spins) $spins.textContent = (lang === 'fr' ? 'Tours: ' : 'Spins: ') + spinsLeft;
        }

        function spinReel(reel, delay, finalSymbol) {
            return new Promise(function (resolve) {
                var interval = setInterval(function () {
                    reel.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                }, 80);
                setTimeout(function () {
                    clearInterval(interval);
                    reel.textContent = finalSymbol;
                    resolve(finalSymbol);
                }, delay);
            });
        }

        function flashMachine(win) {
            if (!$machine) return;
            var color = win ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 0, 110, 0.2)';
            $machine.style.boxShadow = '0 0 60px ' + color;
            setTimeout(function () {
                $machine.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.2)';
            }, 500);
        }

        async function spin() {
            if (gameOver || spinsLeft <= 0) return;
            spinsLeft--;
            updateSpins();
            $btn.disabled = true;

            playSfx('spin');

            var outcome = rollReels();
            var results = await Promise.all([
                spinReel($reel1, 600, outcome[0]),
                spinReel($reel2, 900, outcome[1]),
                spinReel($reel3, 1200, outcome[2])
            ]);

            var won = results[0] === results[1] && results[1] === results[2];
            var clueText = null;

            flashMachine(won);

            if (won) {
                playSfx('jackpot');
                clueText = showClue(TYPE_BY_SYMBOL[results[0]] || 'money');
                if (clueText) {
                    collectedClues.push(clueText);
                    try { localStorage.setItem('td_jackpot_clues', JSON.stringify(collectedClues)); } catch (e) {}
                    if ($clue) {
                        $clue.textContent = '🔎 ' + clueText;
                        $clue.classList.remove('hidden');
                    }
                }
            }

            if (spinsLeft <= 0) {
                gameOver = true;
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({
                            type: 'jackpot',
                            won: collectedClues.length > 0,
                            clues: collectedClues,
                            clue: collectedClues.join(' '),
                            ts: Date.now()
                        }));
                    } catch (e) {}
                    var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                    window.location.href = fromStory ? '../true-detective/index.html?standalone=jackpot' : '../true-detective/index.html#minigames';
                }, 1500);
            } else {
                $btn.disabled = false;
            }
        }

        if ($btn) {
            $btn.addEventListener('click', spin);
        }
        updateSpins();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);

