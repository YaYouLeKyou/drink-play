/* ============================================================
   Drink & Play — Shared Music Player
   ------------------------------------------------------------
   Plays every track from the /musics folder one after another
   (looping). The starting track is configured per page through
   the "data-start" attribute on the <script> tag, e.g.:

       <script src="music-player.js" data-start="Together.mp3" defer></script>

     Tracks (in playback order):
    - Together.mp3          (hub / home screen)
    - Neon Paradise.mp3     (Never Ever)
    - 512 BB.mp3            (Jackpot)
    - Arcade Fanfare.mp3
    - night ride.mp3
    - Same feeling.mp3

    Additional tracks can be added per page via the "data-tracks" attribute
    (comma-separated list of paths relative to the page). Each path may
    include forward slashes, in which case it is resolved relative to the
    script element's src instead of the default /musics folder:

        <script src="music-player.js"
                data-start="generique.mp3"
                data-tracks="true-detective/music true detective/phases/generique.mp3,true-detective/music true detective/phases/recherche.mp3"
                defer></script>

    The "data-loop-track" attribute, when present, causes the player to
    loop the current track instead of advancing to the next (useful for
    games that want a single track to repeat).

    playTrack() matching: an exact name match wins first, then a filename
    (last path segment) match, so playTrack('generique.mp3') finds any
    track whose path ends with generique.mp3.
    ============================================================ */

(function () {
    'use strict';

    // Folder where this script lives -> /musics subfolder.
    // Works from the hub (index.html) and from sub-folders
    // (jackpot/, never-ever/) because it resolves from script.src.
    var scriptEl = document.currentScript;
    if (!scriptEl) {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.indexOf('music-player.js') !== -1) {
                scriptEl = scripts[i];
                break;
            }
        }
    }

    var BASE_URL = new URL('musics/', scriptEl.src).href;

    var PLAYLIST = [
        'Together.mp3',
        'Neon Paradise.mp3',
        '512 BB.mp3',
        'Arcade Fanfare.mp3',
        'night ride.mp3',
        'Same feeling.mp3'
    ];

    var customTracksAttr = scriptEl.getAttribute('data-tracks');
    if (customTracksAttr) {
        var extra = customTracksAttr.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t.length > 0; });
        PLAYLIST = PLAYLIST.concat(extra);
    }

    var DEFAULT_VOLUME = 0.5;
    var startIndex = 0;
    var requestedStart = scriptEl.getAttribute('data-start');
    if (requestedStart) {
        var wantedStart = requestedStart.toLowerCase();
        for (var j = 0; j < PLAYLIST.length; j++) {
            if (matchesTrackName(PLAYLIST[j], wantedStart)) {
                startIndex = j;
                break;
            }
        }
    }

    var currentIndex = startIndex;
    var userPaused = false;       // false => autoplay behaviour (resume / advance)
    var pendingAutoplay = false;  // autoplay was blocked, waiting for user interaction
    var loopCurrentTrack = !!scriptEl.getAttribute('data-loop-track');

    /* ---------- Audio element ---------- */

    var audio = new Audio();
    audio.preload = 'auto';
    audio.volume = DEFAULT_VOLUME;

    function trackUrl(name) {
        if (name.indexOf('/') !== -1) {
            return new URL(name, scriptEl.src).href;
        }
        return BASE_URL + encodeURIComponent(name);
    }

    function trackLabel(name) {
        var lastSlash = name.lastIndexOf('/');
        var base = lastSlash !== -1 ? name.substring(lastSlash + 1) : name;
        return base.replace(/\.mp3$/i, '');
    }

    function matchesTrackName(trackName, wanted) {
        if (trackName.toLowerCase() === wanted) return true;
        var lastSlash = trackName.lastIndexOf('/');
        var fileName = lastSlash !== -1 ? trackName.substring(lastSlash + 1) : trackName;
        return fileName.toLowerCase() === wanted;
    }

    function loadTrack(index) {
        currentIndex = (index + PLAYLIST.length) % PLAYLIST.length;
        audio.src = trackUrl(PLAYLIST[currentIndex]);
        updateTitle();
    }

    function play() {
        var p = audio.play();
        if (p && typeof p.catch === 'function') {
            p.catch(function () {
                // Autoplay blocked: wait for the first user interaction.
                pendingAutoplay = true;
                updatePlayButton();
            });
        }
        updatePlayButton();
    }

    function pause() {
        audio.pause();
        userPaused = true;
        updatePlayButton();
    }

    function next() {
        loadTrack(currentIndex + 1);
        if (!userPaused) {
            play();
        }
    }

    function prev() {
        loadTrack(currentIndex - 1);
        if (!userPaused) {
            play();
        }
    }
    /* ---------- 'ended' event: play the next track ---------- */

    audio.addEventListener('ended', function () {
        if (userPaused) {
            return;
        }
        if (loopCurrentTrack) {
            audio.currentTime = 0;
            play();
            return;
        }
        loadTrack(currentIndex + 1);
        play();
    });

    /* ---------- UI ---------- */

    var playerRoot = document.createElement('div');
    playerRoot.id = 'dp-music-player';

    var titleEl = document.createElement('span');
    titleEl.className = 'dp-music-title';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'dp-music-btn';
    prevBtn.title = 'Previous track';
    prevBtn.textContent = '⏮';

    var playBtn = document.createElement('button');
    playBtn.className = 'dp-music-btn dp-music-play';
    playBtn.title = 'Play / Pause';
    playBtn.textContent = '▶';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'dp-music-btn';
    nextBtn.title = 'Next track';
    nextBtn.textContent = '⏭';

    var volumeEl = document.createElement('input');
    volumeEl.type = 'range';
    volumeEl.className = 'dp-music-volume';
    volumeEl.min = '0';
    volumeEl.max = '100';
    volumeEl.value = String(Math.round(DEFAULT_VOLUME * 100));
    volumeEl.title = 'Volume';

    playerRoot.appendChild(titleEl);
    playerRoot.appendChild(prevBtn);
    playerRoot.appendChild(playBtn);
    playerRoot.appendChild(nextBtn);
    playerRoot.appendChild(volumeEl);

    var style = document.createElement('style');
    style.textContent = [
        '#dp-music-player {',
        '    position: fixed;',
        '    bottom: 16px;',
        '    right: 16px;',
        '    z-index: 9999;',
        '    display: flex;',
        '    align-items: center;',
        '    gap: 6px;',
        '    padding: 8px 12px;',
        '    background: rgba(15, 15, 25, 0.82);',
        '    border: 1px solid rgba(255, 255, 255, 0.18);',
        '    border-radius: 999px;',
        '    backdrop-filter: blur(8px);',
        '    -webkit-backdrop-filter: blur(8px);',
        '    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);',
        '    color: #fff;',
        '    font-family: inherit;',
        '    max-width: min(92vw, 420px);',
        '}',
        '#dp-music-player .dp-music-title {',
        '    font-size: 13px;',
        '    white-space: nowrap;',
        '    overflow: hidden;',
        '    text-overflow: ellipsis;',
        '    max-width: 150px;',
        '    opacity: 0.95;',
        '}',
        '#dp-music-player .dp-music-btn {',
        '    background: transparent;',
        '    color: #fff;',
        '    border: none;',
        '    font-size: 15px;',
        '    line-height: 1;',
        '    cursor: pointer;',
        '    padding: 4px 6px;',
        '    border-radius: 50%;',
        '    transition: transform 0.15s ease, background 0.15s ease;',
        '}',
        '#dp-music-player .dp-music-btn:hover {',
        '    background: rgba(255, 255, 255, 0.15);',
        '    transform: scale(1.12);',
        '}',
        '#dp-music-player .dp-music-play {',
        '    font-size: 17px;',
        '}',
        '#dp-music-player .dp-music-volume {',
        '    width: 70px;',
        '    accent-color: #7ec8ff;',
        '    cursor: pointer;',
        '}',
        '@media (max-width: 480px) {',
        '    #dp-music-player .dp-music-title { max-width: 90px; }',
        '    #dp-music-player .dp-music-volume { width: 52px; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    function updateTitle() {
        titleEl.textContent = '🎵 ' + trackLabel(PLAYLIST[currentIndex]);
    }

    function updatePlayButton() {
        var playing = !audio.paused && !audio.ended && audio.src;
        playBtn.textContent = playing ? '⏸' : '▶';
    }

    /* ---------- Events ---------- */

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    playBtn.addEventListener('click', function () {
        if (audio.paused) {
            try {
                sessionStorage.setItem('dpMusicUnlocked', '1');
            } catch (e) { /* storage unavailable, ignore */ }
            userPaused = false;
            pendingAutoplay = false;
            play();
        } else {
            pause();
        }
    });
    volumeEl.addEventListener('input', function () {
        audio.volume = Number(volumeEl.value) / 100;
    });

    audio.addEventListener('play', updatePlayButton);
    audio.addEventListener('pause', updatePlayButton);

    // If autoplay was blocked by the browser, start on first interaction
    // anywhere on the page (except the player's own buttons, which manage
    // playback themselves). Once unlocked, remember it for the session.
    function unlockAutoplay(e) {
        if (!pendingAutoplay) {
            return;
        }
        if (e && e.target && playerRoot.contains(e.target)) {
            return; // player button click: its own handler starts playback
        }
        try {
            sessionStorage.setItem('dpMusicUnlocked', '1');
        } catch (err) { /* storage unavailable, ignore */ }
        pendingAutoplay = false;
        userPaused = false;
        play();
        document.removeEventListener('pointerdown', unlockAutoplay);
        document.removeEventListener('keydown', unlockAutoplay);
        document.removeEventListener('touchstart', unlockAutoplay);
        document.removeEventListener('click', unlockAutoplay);
    }
    document.addEventListener('pointerdown', unlockAutoplay);
    document.addEventListener('keydown', unlockAutoplay);
    document.addEventListener('touchstart', unlockAutoplay);
    document.addEventListener('click', unlockAutoplay);

    /* ---------- Boot ---------- */

    loadTrack(startIndex);
    document.body.appendChild(playerRoot);
    updateTitle();
    userPaused = false;
    play(); // try autoplay immediately on page load; falls back to first user interaction

    /* ---------- Public API (used by game scripts) ---------- */

    window.DPMusicPlayer = {
        // Jump straight to a track by file name, e.g. playTrack('night ride.mp3')
        // Also matches by filename suffix, so playTrack('generique.mp3') finds
        // true-detective/music true detective/phases/generique.mp3
        playTrack: function (name) {
            var wanted = String(name).toLowerCase();
            for (var k = 0; k < PLAYLIST.length; k++) {
                if (PLAYLIST[k].toLowerCase() === wanted || matchesTrackName(PLAYLIST[k], wanted)) {
                    userPaused = false;
                    pendingAutoplay = false;
                    loadTrack(k);
                    play();
                    return true;
                }
            }
            return false;
        },
        next: function () { next(); },
        prev: function () { prev(); },
        togglePlay: function () {
            if (audio.paused) {
                userPaused = false;
                play();
            } else {
                pause();
            }
        }
    };
})();
