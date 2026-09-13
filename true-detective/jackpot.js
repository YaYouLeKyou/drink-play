/* =====================================================================
   TRUE DETECTIVE - JACKPOT (Standalone)
   Simple slot machine. Match 2 or 3 symbols to win.
   ===================================================================== */
(function (global) {
    'use strict';

    var SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
    var WEIGHTS = [30, 25, 20, 15, 7, 2, 1];

    var PHRASES = {
        fr: [
            "La chance est un mensonge... mais essayez quand même.",
            "Pembrooke sourit : « Faites tourner les rouleaux. »"
        ],
        en: [
            "Luck is a lie... but try anyway.",
            "Pembrooke smiles: \"Spin the reels.\""
        ]
    };

    function weightedRandom() {
        var total = WEIGHTS.reduce(function (a, b) { return a + b; }, 0);
        var r = Math.random() * total;
        for (var i = 0; i < SYMBOLS.length; i++) {
            r -= WEIGHTS[i];
            if (r <= 0) return SYMBOLS[i];
        }
        return SYMBOLS[0];
    }

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var spins = 6;
        var spinsLeft = spins;
        var gameOver = false;

        var $reel1 = document.getElementById('reel1');
        var $reel2 = document.getElementById('reel2');
        var $reel3 = document.getElementById('reel3');
        var $spins = document.getElementById('jackpot-spins');
        var $btn = document.getElementById('jackpot-btn');

        function updateSpins() {
            if ($spins) $spins.textContent = (lang === 'fr' ? 'Tours: ' : 'Spins: ') + spinsLeft;
        }

        function spin() {
            if (gameOver || spinsLeft <= 0) return;
            spinsLeft--;
            updateSpins();
            $btn.disabled = true;

            var reels = [$reel1, $reel2, $reel3];
            reels.forEach(function (r) { if (r) r.classList.add('spinning'); });

            setTimeout(function () {
                var results = [weightedRandom(), weightedRandom(), weightedRandom()];
                if ($reel1) $reel1.textContent = results[0];
                if ($reel2) $reel2.textContent = results[1];
                if ($reel3) $reel3.textContent = results[2];
                reels.forEach(function (r) { if (r) r.classList.remove('spinning'); });

                var won = results[0] === results[1] || results[1] === results[2] || results[0] === results[2];
                if (won && results[0] === results[1] && results[1] === results[2]) {
                    won = true;
                } else if (won) {
                    won = true;
                } else {
                    won = false;
                }

                if (spinsLeft <= 0) {
                    gameOver = true;
                    setTimeout(function () {
                        try {
                            localStorage.setItem('td_standalone_game_result', JSON.stringify({
                                type: 'jackpot',
                                won: !!won,
                                ts: Date.now()
                            }));
                        } catch (e) {}
                        window.location.href = '../true-detective/index.html?standalone=jackpot';
                    }, 1000);
                } else {
                    $btn.disabled = false;
                }
            }, 1000);
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
