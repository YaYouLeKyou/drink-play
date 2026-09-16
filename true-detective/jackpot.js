/* =====================================================================
    TRUE DETECTIVE - JACKPOT (Standalone)
    Enhanced slot machine with staggered reels, win celebration, and neon effects.
    ===================================================================== */
(function (global) {
    'use strict';

    function playSfx(name, opts) {
        try { if (window.TDSfx) window.TDSfx.play(name, opts); } catch (e) {}
    }

    var SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣', '⭐'];
    var WEIGHTS = [25, 22, 18, 14, 10, 5, 3, 3];
    var PAYOUTS = {
        '7️⃣7️⃣7️⃣': 10,
        '💎💎💎': 8,
        '⭐⭐⭐': 7,
        '🔔🔔🔔': 5,
        '🍇🍇🍇': 4,
        '🍊🍊🍊': 3,
        '🍋🍋🍋': 2,
        '🍒🍒': 1,
        '🍒🍒🍒': 2
    };

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
        var spins = 8;
        var spinsLeft = spins;
        var gameOver = false;

        var $reel1 = document.getElementById('reel1');
        var $reel2 = document.getElementById('reel2');
        var $reel3 = document.getElementById('reel3');
        var $spins = document.getElementById('jackpot-spins');
        var $btn = document.getElementById('jackpot-btn');
        var $machine = document.querySelector('.jackpot-machine');

        function updateSpins() {
            if ($spins) $spins.textContent = (lang === 'fr' ? 'Tours: ' : 'Spins: ') + spinsLeft;
        }

        function spinReel(reel, delay) {
            return new Promise(function (resolve) {
                var interval = setInterval(function () {
                    reel.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                }, 80);
                setTimeout(function () {
                    clearInterval(interval);
                    reel.textContent = weightedRandom();
                    resolve();
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

            var results = await Promise.all([
                spinReel($reel1, 600),
                spinReel($reel2, 900),
                spinReel($reel3, 1200)
            ]);

            var combo = results.join('');
            var won = false;
            var payout = 0;

            if (results[0] === results[1] && results[1] === results[2]) {
                won = true;
                payout = PAYOUTS[combo] || 5;
            } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
                won = true;
                payout = 1;
            }

            flashMachine(won);

            if (won) {
                playSfx('jackpot');
            }

            if (spinsLeft <= 0) {
                gameOver = true;
                setTimeout(function () {
                    try {
                        localStorage.setItem('td_standalone_game_result', JSON.stringify({
                            type: 'jackpot',
                            won: !!won,
                            payout: payout,
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

