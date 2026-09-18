/* =====================================================================
   TRUE DETECTIVE - Audio helper pour les pages mini-jeux standalone
   - playSfx : bruitages via TDSfx (procédural, fonctionne partout)
   - playMinigameMusic : via TDAudioService du parent si iframe,
     sinon lecture locale en boucle du mp3 du mini-jeu
   - Démarre la musique au premier geste utilisateur (autoplay policy)
   Usage : <script src="sfx.js"></script>
           <script src="minigame-audio.js" data-minigame="memory"></script>
   ===================================================================== */
(function () {
    'use strict';

    var TRACKS = {
        'scene_fouille': 'enigme classic.mp3',
        'montre_code': 'enigme classic 2.mp3',
        'puzzle': 'enigme classic.mp3',
        'coffre_code': 'enigme classic 2.mp3',
        'reseau_alibis': 'enigme classic.mp3',
        'chemistry': 'enigme-cyberpunk-2.mp3',
        'chess': 'enigme classic 2.mp3',
        'memory': 'enigme classic.mp3',
        'shooting': 'mini-jeux-cyberpunk.mp3',
        'jackpot': 'Neon Paradise.mp3',
        'connect4': 'enigme classic.mp3',
        'sudoku': 'enigme classic.mp3',
        'bataille-navale': 'bataille-navale.mp3',
        'pong': 'pong.mp3',
        'pacman': 'pacman.mp3',
        'space-invaders': 'space invader.mp3',
        'breakout': 'casse-brique.mp3',
        'asteroids': 'asteroid.mp3',
        'marginal-tower': 'tower.mp3'
    };

    var currentType = null;
    var localAudio = null;
    var localType = null;
    var pending = false;
    var stopped = false;

    function getService() {
        try {
            return window.TDAudioService || (window.parent !== window && window.parent.TDAudioService);
        } catch (e) { return null; }
    }

    window.playSfx = function (name, opts) {
        try {
            var fx = window.TDSfx || (window.parent && window.parent.TDSfx);
            if (fx) fx.play(name, opts);
        } catch (e) {}
    };

    function startMusic() {
        if (stopped || !currentType || !TRACKS[currentType]) return;
        var svc = getService();
        // A service without a ready player must not swallow the local fallback.
        if (svc && svc.playMinigameMusic && svc.playMinigameMusic(currentType) === true) {
            if (localAudio) localAudio.pause();
            return;
        }
        if (localType !== currentType) {
            if (localAudio) localAudio.pause();
            localAudio = document.getElementById('game-music') || new Audio();
            localAudio.src = new URL('music true detective/mini-jeux/' + TRACKS[currentType], document.baseURI).href;
            localAudio.loop = true;
            localAudio.preload = 'auto';
            localAudio.controls = false;
            localAudio.hidden = true;
            localAudio.volume = 0.4;
            localType = currentType;
            pending = false;
        }
        if (pending || !localAudio.paused) return;
        pending = true;
        try {
            var promise = localAudio.play();
            if (promise && promise.then) {
                promise.then(function () { pending = false; }, function () {
                    // Keep gesture listeners armed after every rejected attempt.
                    pending = false;
                });
            } else {
                pending = false;
            }
        } catch (e) { pending = false; }
    }

    window.playMinigameMusic = function (type) {
        if (!TRACKS[type]) return false;
        currentType = type;
        stopped = false;
        startMusic();
        return true;
    };
    window.stopMinigameMusic = function () {
        stopped = true;
        if (localAudio) localAudio.pause();
    };

    // Capture also sees gestures intercepted by canvas/game handlers.
    ['pointerdown', 'click', 'keydown', 'touchend'].forEach(function (event) {
        document.addEventListener(event, startMusic, true);
    });
    window.addEventListener('pagehide', window.stopMinigameMusic);
    window.addEventListener('pageshow', function () {
        stopped = false;
        startMusic();
    });

    var script = document.currentScript;
    var params = new URLSearchParams(window.location.search);
    currentType = (script && script.getAttribute('data-minigame')) || params.get('game') || params.get('type');
    if (!currentType && /\/standalone-game\.html$/.test(window.location.pathname)) currentType = 'scene_fouille';
    startMusic();
})();
