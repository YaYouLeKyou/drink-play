/* =====================================================================
   TRUE DETECTIVE - STANDALONE GAME WRAPPER
   Generic wrapper for all standalone minigames and enigmes.
   ===================================================================== */
(function (global) {
    'use strict';

    var gameType = '';
    var lang = 'fr';
    var difficulty = 1;
    var themeId = 'agatha-christie';
    var fromStory = false;
    var storyReturn = null;
    var gameResult = null;
    var currentGame = null;

    var $title, $hud, $container, $content;
    var $victoryOverlay, $defeatOverlay;
    var $victoryText, $defeatText;

    var GAME_SCRIPTS = {
        'scene_fouille': 'minigames.js',
        'montre_code': 'minigames.js',
        'reseau_alibis': 'minigames.js',
        'cryptogramme': 'minigames.js',
        'coffre_code': 'minigames.js',
        'chess': 'chess-game.js',
        'memory': 'memory-game.js',
        'shooting': 'shooting-gallery.js',
        'jackpot': 'minigames.js',
        'connect4': 'connect4-game.js',
        'bataille-navale': 'bataille-navale.js',
        'pong': 'pong-game.js',
        'pacman': 'pacman-game.js',
        'space-invaders': 'space-invaders.js',
        'breakout': 'breakout-game.js',
        'asteroids': 'asteroids-game.js',
        'marginal-tower': null
    };

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    function init() {
        $title = document.getElementById('sg-title');
        $hud = document.getElementById('sg-hud');
        $container = document.getElementById('game-container');
        $content = document.getElementById('game-content');
        $victoryOverlay = document.getElementById('victory-overlay');
        $defeatOverlay = document.getElementById('defeat-overlay');
        $victoryText = document.getElementById('victory-text');
        $defeatText = document.getElementById('defeat-text');

        parseParams();
        loadGame();
        setupControls();
    }

    function parseParams() {
        var params = new URLSearchParams(window.location.search);
        gameType = params.get('game') || '';
        lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
        if (diff >= 1 && diff <= 3) difficulty = diff;
        themeId = params.get('theme') || 'agatha-christie';
        fromStory = params.get('story') === '1';
        try {
            var raw = sessionStorage.getItem('td_story_return');
            if (raw) storyReturn = JSON.parse(raw);
        } catch (e) {}

        if (!gameType) {
            gameType = 'scene_fouille';
        }
    }

    function loadGame() {
        if (!gameType) return;

        var titles = {
            'scene_fouille': { fr: 'Fouille de la scène', en: 'Scene Search' },
            'montre_code': { fr: 'La Montre du Duc', en: "The Duke's Watch" },
            'reseau_alibis': { fr: 'Le Réseau d\'alibis', en: 'The Alibi Network' },
            'cryptogramme': { fr: 'Le Cryptogramme', en: 'The Cryptogram' },
            'coffre_code': { fr: 'Le Coffre-fort', en: 'The Safe' },
            'chess': { fr: 'Échecs', en: 'Chess' },
            'marginal-tower': { fr: 'La Tour de Silas', en: "Silas' Tower" },
            'memory': { fr: 'Mémoire', en: 'Memory' },
            'shooting': { fr: 'Stand de tir', en: 'Shooting Gallery' },
            'jackpot': { fr: 'Jackpot', en: 'Jackpot' },
            'connect4': { fr: 'Puissance 4', en: 'Connect 4' },
            'bataille-navale': { fr: 'Bataille Navale', en: 'Battleship' },
            'pong': { fr: 'Pong', en: 'Pong' },
            'pacman': { fr: 'Pac-Man', en: 'Pac-Man' },
            'space-invaders': { fr: 'Space Invaders', en: 'Space Invaders' },
            'breakout': { fr: 'Breakout', en: 'Breakout' },
            'asteroids': { fr: 'Astéroïdes', en: 'Asteroids' }
        };

        var title = titles[gameType] || { fr: 'Mini-jeu', en: 'Mini-game' };
        if ($title) {
            $title.textContent = title[lang] || title.en || 'Mini-jeu';
        }

        if (gameType === 'marginal-tower') {
            window.location.href = 'marginal-tower.html?difficulty=' + difficulty + '&lang=' + lang;
            return;
        }

        var scriptSrc = GAME_SCRIPTS[gameType];
        if (!scriptSrc) {
            showPlaceholder();
            return;
        }

        loadScript('../true-detective/' + scriptSrc).then(function () {
            onGameScriptLoaded();
        }).catch(function () {
            showPlaceholder();
        });
    }

    function onGameScriptLoaded() {
        if (gameType === 'scene_fouille') {
            loadSceneFouille();
            return;
        }
        if (gameType === 'reseau_alibis') {
            loadReseauAlibis();
            return;
        }
        if (gameType === 'cryptogramme') {
            loadCryptogramme();
            return;
        }
        if (gameType === 'coffre_code') {
            loadCoffreCode();
            return;
        }
        if (gameType === 'connect4' && global.Connect4Game) {
            loadConnect4();
            return;
        }
        if (global.TDMiniGames && global.TDMiniGames.play) {
            loadTDMiniGame();
            return;
        }
        showPlaceholder();
    }

    function loadSceneFouille() {
        if (!global.TDMiniGames || !global.TDMiniGames.builders || !global.TDMiniGames.builders['scene_fouille']) {
            showPlaceholder();
            return;
        }
        var cfg = {
            type: 'scene_fouille',
            wide: true,
            evidence: 'forensic',
            title: { fr: 'Fouille de la scène', en: 'Scene Search' },
            desc: { fr: 'Explorez la scène à la loupe.', en: 'Explore the scene with the magnifier.' },
            clue: { fr: 'Une dette colossale, une chevalière, une menace cachetee et un reçu V.K.', en: 'A colossal debt, a signet ring, a sealed threat and a V.K. receipt.' },
            time: 60,
            sceneImage: null,
            hotspots: [
                { label: 'A', x: 10.2, y: 62.5, info: { fr: 'Lettre de menace aux armes de Blackwood.', en: 'Threat letter with Blackwood crest.' } },
                { label: 'B', x: 24.0, y: 67.1, info: { fr: 'Encrier intact et plume sèche.', en: 'Intact inkwell and dry pen.' } },
                { label: '1', x: 30.7, y: 55.4, info: { fr: 'Cachet intact, bureau non forcé.', en: 'Intact seal, unforced desk.' } },
                { label: '2', x: 37.6, y: 56.4, info: { fr: 'Carafe renversée et verre marqué.', en: 'Overturned decanter and marked glass.' } },
                { label: '3', x: 46.8, y: 56.8, info: { fr: 'Livre de comptes : dette énorme.', en: 'Ledger: huge debt.' } },
                { label: '4', x: 65.2, y: 77.2, info: { fr: 'Fauteuil renversé et montre au sol.', en: 'Overturned chair and watch on floor.' } },
                { label: '5', x: 69.9, y: 82.6, info: { fr: 'Mare de sang face au bureau.', en: 'Pool of blood facing the desk.' } },
                { label: '6', x: 81.8, y: 84.1, info: { fr: 'Reçu V.K. plié.', en: 'Folded V.K. receipt.' } }
            ]
        };
        try {
            var builder = global.TDMiniGames.builders['scene_fouille'];
            var wrap = builder(cfg);
            $content.appendChild(wrap);
        } catch (e) {
            showPlaceholder();
        }
    }

    function loadReseauAlibis() {
        if (!global.TDMiniGames || !global.TDMiniGames.builders || !global.TDMiniGames.builders['reseau_alibis']) {
            showPlaceholder();
            return;
        }
        var cfg = {
            type: 'reseau_alibis',
            time: 90,
            evidence: 'witness',
            title: { fr: 'Le Réseau d\'alibis', en: 'The Alibi Network' },
            desc: { fr: 'Identifiez les menteurs.', en: 'Identify the liars.' },
            clue: { fr: 'Le réseau révèle des contradictions.', en: 'The network reveals contradictions.' },
            testimonies: [
                { id: 'hale', witness: { fr: 'Major Hale', en: 'Major Hale' }, statement: { fr: "J'étais en panne avec Pembrooke à 22h.", en: 'I was broken down with Pembrooke at 10pm.' }, isLie: false },
                { id: 'vivienne', witness: { fr: 'Lady Vivienne', en: 'Lady Vivienne' }, statement: { fr: "J'étais seule au manoir.", en: 'I was alone at the manor.' }, isLie: true },
                { id: 'blackwood', witness: { fr: 'Rupert Blackwood', en: 'Rupert Blackwood' }, statement: { fr: "Je suis parti vers 20h, Silas m'a vu.", en: 'I left around 8pm, Silas saw me.' }, isLie: false },
                { id: 'silas', witness: { fr: 'Silas Crane', en: 'Silas Crane' }, statement: { fr: "J'ai vu Blackwood passer à 20h.", en: 'I saw Blackwood pass at 8pm.' }, isLie: false }
            ]
        };
        try {
            var builder = global.TDMiniGames.builders['reseau_alibis'];
            var wrap = builder(cfg);
            $content.appendChild(wrap);
        } catch (e) {
            showPlaceholder();
        }
    }

    function loadCryptogramme() {
        if (!global.TDMiniGames || !global.TDMiniGames.builders || !global.TDMiniGames.builders['cryptogramme']) {
            showPlaceholder();
            return;
        }
        var cfg = {
            type: 'cryptogramme',
            time: 90,
            evidence: 'mobile',
            title: { fr: 'Le Cryptogramme', en: 'The Cryptogram' },
            desc: { fr: 'Décodez la note.', en: 'Decode the note.' },
            clue: { fr: 'HALE ENGAGE KRANE', en: 'HALE HIRES KRANE' }
        };
        try {
            var builder = global.TDMiniGames.builders['cryptogramme'];
            var wrap = builder(cfg);
            $content.appendChild(wrap);
        } catch (e) {
            showPlaceholder();
        }
    }

    function loadCoffreCode() {
        if (!global.TDMiniGames || !global.TDMiniGames.builders || !global.TDMiniGames.builders['coffre_code']) {
            showPlaceholder();
            return;
        }
        var cfg = {
            type: 'coffre_code',
            time: 60,
            evidence: 'forensic',
            title: { fr: 'Le Coffre-fort', en: 'The Safe' },
            desc: { fr: 'Trouvez le code.', en: 'Find the code.' },
            clue: { fr: 'Le code est 1981.', en: 'The code is 1981.' }
        };
        try {
            var builder = global.TDMiniGames.builders['coffre_code'];
            var wrap = builder(cfg);
            $content.appendChild(wrap);
        } catch (e) {
            showPlaceholder();
        }
    }

    function loadTDMiniGame() {
        var cfg = {
            type: gameType,
            lang: lang,
            difficulty: difficulty
        };
        if (gameType === 'jackpot') {
            cfg.spins = 6;
        }
        try {
            global.TDMiniGames.play(cfg, lang, function (res) {
                onGameComplete(res);
            }, $content);
        } catch (e) {
            showPlaceholder();
        }
    }

    function loadConnect4() {
        try {
            currentGame = new global.Connect4Game($content, {
                lang: lang,
                difficulty: difficulty === 1 ? 'easy' : difficulty === 2 ? 'medium' : 'hard',
                onComplete: function (res) {
                    onGameComplete(res);
                }
            });
        } catch (e) {
            showPlaceholder();
        }
    }

    function showPlaceholder() {
        $content.innerHTML = '<div style="text-align:center;padding:40px;color:#8aa3b8;"><p>Mini-jeu en cours de développement...</p></div>';
    }

    function onGameComplete(res) {
        gameResult = res || {};
        var won = !!gameResult.won;
        if (won) {
            if ($victoryText) $victoryText.textContent = gameResult.clue || 'Énigme résolue !';
            if ($victoryOverlay) $victoryOverlay.classList.remove('hidden');
        } else {
            if ($defeatText) $defeatText.textContent = gameResult.clue || 'Échec...';
            if ($defeatOverlay) $defeatOverlay.classList.remove('hidden');
        }
    }

    function returnToStory(won) {
        try {
            localStorage.setItem('td_standalone_game_result', JSON.stringify({
                type: gameType,
                won: !!won,
                ts: Date.now()
            }));
        } catch (e) {}

        if (fromStory && storyReturn && storyReturn.returnUrl) {
            window.location.href = storyReturn.returnUrl;
        } else {
            window.location.href = '../true-detective/index.html?standalone=' + gameType;
        }
    }

    function setupControls() {
        var backBtn = document.getElementById('back-to-game-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function () {
                cleanup();
                if (fromStory && storyReturn && storyReturn.returnUrl) {
                    window.location.href = storyReturn.returnUrl;
                } else {
                    window.location.href = '../true-detective/index.html';
                }
            });
        }

        var victoryBtn = document.getElementById('victory-continue-btn');
        if (victoryBtn) {
            victoryBtn.addEventListener('click', function () {
                returnToStory(true);
            });
        }

        var defeatRetryBtn = document.getElementById('defeat-retry-btn');
        if (defeatRetryBtn) {
            defeatRetryBtn.addEventListener('click', function () {
                cleanup();
                loadGame();
            });
        }

        var defeatContinueBtn = document.getElementById('defeat-continue-btn');
        if (defeatContinueBtn) {
            defeatContinueBtn.addEventListener('click', function () {
                returnToStory(false);
            });
        }
    }

    function hideOverlays() {
        if ($victoryOverlay) $victoryOverlay.classList.add('hidden');
        if ($defeatOverlay) $defeatOverlay.classList.add('hidden');
    }

    function cleanup() {
        hideOverlays();
        $content.innerHTML = '';
        currentGame = null;
        gameResult = null;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);
