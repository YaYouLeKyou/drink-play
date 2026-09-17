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
        'chess': 'chess.mp3',
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
    var started = false;

    function getSfx() {
        try {
            return window.TDSfx || (window.parent && window.parent.TDSfx) || null;
        } catch (e) { return null; }
    }

    window.playSfx = function (name, opts) {
        try {
            var fx = getSfx();
            if (fx) fx.play(name, opts);
        } catch (e) {}
    };

    function startLocalMusic(type) {
        var track = TRACKS[type];
        if (!track) return;
        try {
            localAudio = new Audio('music true detective/mini-jeux/' + track);
            localAudio.loop = true;
            localAudio.volume = 0.4;
            var p = localAudio.play();
            if (p && typeof p.catch === 'function') p.catch(function () {});
        } catch (e) {}
    }

    window.playMinigameMusic = function (type) {
        if (!type || !TRACKS[type]) return;
        currentType = type;
        started = false; // réautoriser le démarrage au prochain geste
        // 1) Service du parent si iframe
        try {
            var svc = window.TDAudioService || (window.parent && window.parent.TDAudioService);
            if (svc && svc.playMinigameMusic) { svc.playMinigameMusic(type); return; }
        } catch (e) {}
        // 2) Fallback local (page ouverte hors iframe)
        if (localAudio) { try { localAudio.pause(); } catch (e) {} localAudio = null; }
        startLocalMusic(type);
        started = true;
    };

    // Autoplay : la musique ne peut démarrer qu'après un geste utilisateur.
    function onFirstGesture() {
        if (started || !currentType) return;
        started = true;
        try {
            var svc = window.TDAudioService || (window.parent && window.parent.TDAudioService);
            if (svc && svc.playMinigameMusic) { svc.playMinigameMusic(currentType); return; }
        } catch (e) {}
        if (!localAudio) startLocalMusic(currentType);
    }
    document.addEventListener('click', onFirstGesture);
    document.addEventListener('keydown', onFirstGesture);
    document.addEventListener('touchstart', onFirstGesture, { passive: true });

    // Type de mini-jeu lu depuis l'attribut data-minigame du script,
    // sinon depuis l'URL (?game= ou ?type=)
    try {
        var script = document.currentScript;
        var urlType = null;
        try {
            var qs = new URLSearchParams(window.location.search);
            urlType = qs.get('game') || qs.get('type');
        } catch (e) {}
        currentType = (script && script.getAttribute('data-minigame')) || urlType || null;
        if (currentType && TRACKS[currentType]) {
            // Si le parent est déjà là (iframe), lancer direct ; sinon attendre le geste
            try {
                var svc0 = window.TDAudioService || (window.parent && window.parent.TDAudioService);
                if (svc0 && svc0.playMinigameMusic) { svc0.playMinigameMusic(currentType); started = true; }
            } catch (e) {}
        }
    } catch (e) {}
})();
