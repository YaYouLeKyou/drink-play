/* ============================================================
   Drunkin' Alien — Audio System
   ------------------------------------------------------------
   1) Music player (level-based playlist with controls)
   2) Retro sound effects (Web Audio API, 8-bit style)
   ============================================================ */

(function () {
    'use strict';

    /* ---------- Music playlist (noms de fichiers exacts sur disque) ----------
       Les noms DOIVENT respecter la casse : le deploiement (Linux/Vercel)
       est sensible a la casse, un ecart se traduit par un 404 silencieux. */
    var MUSIC_BASE = './media/';
    var PLAYLIST = [
        { name: 'Accueil',     file: 'accueil.mp3',            track: 'home'    },
        { name: 'Level 1',     file: 'Level1.mp3',             track: 'level1'  },
        { name: 'Level 2',     file: 'Level 2.mp3',            track: 'level2'  },
        { name: 'Level 3',     file: 'Level 3.mp3',            track: 'level3'  },
        { name: 'Level 4',     file: 'level 4.mp3',            track: 'level4'  },
        { name: 'Boss 1',      file: 'Boss 1.mp3',             track: 'boss1'   },
        { name: 'Generique',   file: 'generique de fin.mp3',   track: 'ending'  }
    ];

    var DEFAULT_VOLUME = 0.4;

    /* ---------- Audio context (lazy init for SFX) ---------- */
    var audioCtx = null;
    function getCtx() {
        if (audioCtx) return audioCtx;
        try {
            var Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) audioCtx = new Ctx();
        } catch (e) { /* no audio */ }
        return audioCtx;
    }

    var masterSfxGain = null;
    var userSfxMuted = false;
    var masterSfxVolume = 0.5;
    function getSfxGain() {
        if (masterSfxGain) return masterSfxGain;
        var ctx = getCtx();
        if (!ctx) return null;
        masterSfxGain = ctx.createGain();
        masterSfxGain.gain.value = userSfxMuted ? 0 : masterSfxVolume;
        masterSfxGain.connect(ctx.destination);
        return masterSfxGain;
    }

    /* ============================================================
       1) Music player with level switching
       ============================================================ */

    var musicAudio = new Audio();
    musicAudio.preload = 'auto';
    musicAudio.volume = DEFAULT_VOLUME;
    musicAudio.loop = true;

    var currentTrackKey = null;
    var userMuted = false;
    var levelTrackBeforeBoss = null;

    function trackUrl(file) {
        return MUSIC_BASE + encodeURIComponent(file);
    }

    function findTrackByKey(key) {
        for (var i = 0; i < PLAYLIST.length; i++) {
            if (PLAYLIST[i].track === key) return PLAYLIST[i];
        }
        return null;
    }

    function playTrack(key) {
        if (currentTrackKey === key) {
            if (musicAudio.paused && !userMuted) {
                musicAudio.play().catch(function () {});
            }
            return;
        }
        var track = findTrackByKey(key);
        if (!track) return;
        currentTrackKey = key;
        musicAudio.src = trackUrl(track.file);
        musicAudio.currentTime = 0;
        if (!userMuted) {
            musicAudio.play().catch(function () {
                pendingMusicAutoplay = true;
                updatePlayButton();
            });
        }
        updateTitle();
        updatePlayButton();
    }

    function playBossMusic() {
        if (currentTrackKey === 'boss1') return;
        levelTrackBeforeBoss = currentTrackKey;
        playTrack('boss1');
    }

    function resumeLevelMusic() {
        if (levelTrackBeforeBoss) {
            playTrack(levelTrackBeforeBoss);
            levelTrackBeforeBoss = null;
        }
    }

    function stopMusic() {
        musicAudio.pause();
        musicAudio.currentTime = 0;
    }

    var pendingMusicAutoplay = false;
    function unlockMusic() {
        if (!pendingMusicAutoplay) return;
        pendingMusicAutoplay = false;
        if (!userMuted && currentTrackKey) {
            musicAudio.play().catch(function () {});
        }
    }

    /* ---------- Music player UI (compact, non intrusive) ----------
       Le lecteur est volontairement replie par defaut et ancre en haut a
       gauche : il ne doit jamais recouvrir le canvas ni capter les taps
       de jeu (les evenements sont stoppes sur le panneau). */

    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'da-audio-toggle';
    toggleBtn.title = 'Musique & sons';
    toggleBtn.setAttribute('aria-label', 'Musique & sons');
    toggleBtn.textContent = '\u{1F3B5}';

    var playerRoot = document.createElement('div');
    playerRoot.id = 'da-music-player';

    var titleEl = document.createElement('span');
    titleEl.className = 'da-music-title';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'da-music-btn';
    prevBtn.title = 'Previous track';
    prevBtn.textContent = '\u23EE';

    var playBtn = document.createElement('button');
    playBtn.className = 'da-music-btn da-music-play';
    playBtn.title = 'Play / Pause';
    playBtn.textContent = '▶';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'da-music-btn';
    nextBtn.title = 'Next track';
    nextBtn.textContent = '⏭';

    var volumeEl = document.createElement('input');
    volumeEl.type = 'range';
    volumeEl.className = 'da-music-volume';
    volumeEl.min = '0';
    volumeEl.max = '100';
    volumeEl.value = String(Math.round(DEFAULT_VOLUME * 100));
    volumeEl.title = 'Music volume';

    var muteSfxBtn = document.createElement('button');
    muteSfxBtn.className = 'da-music-btn';
    muteSfxBtn.title = 'Mute SFX';
    muteSfxBtn.textContent = '🔊';
    muteSfxBtn.addEventListener('click', function () {
        userSfxMuted = !userSfxMuted;
        var gain = getSfxGain();
        if (gain) gain.gain.value = userSfxMuted ? 0 : masterSfxVolume;
        muteSfxBtn.textContent = userSfxMuted ? '🔇' : '🔊';
    });

    var sfxVolumeEl = document.createElement('input');
    sfxVolumeEl.type = 'range';
    sfxVolumeEl.className = 'da-music-volume';
    sfxVolumeEl.min = '0';
    sfxVolumeEl.max = '100';
    sfxVolumeEl.value = String(Math.round(masterSfxVolume * 100));
    sfxVolumeEl.title = 'SFX volume';
    sfxVolumeEl.addEventListener('input', function () {
        masterSfxVolume = Number(sfxVolumeEl.value) / 100;
        var gain = getSfxGain();
        if (gain && !userSfxMuted) gain.gain.value = masterSfxVolume;
    });

    var selectEl = document.createElement('select');
    selectEl.className = 'da-music-select';
    for (var i = 0; i < PLAYLIST.length; i++) {
        var opt = document.createElement('option');
        opt.value = PLAYLIST[i].track;
        opt.textContent = PLAYLIST[i].name;
        selectEl.appendChild(opt);
    }

    // Ligne 1 : titre + lecture ; ligne 2 : navigation + selection ;
    // ligne 3 : volumes. Sur mobile le panneau reste empile verticalement.
    var rowMain = document.createElement('div');
    rowMain.className = 'da-row';
    rowMain.appendChild(titleEl);
    rowMain.appendChild(playBtn);

    var rowNav = document.createElement('div');
    rowNav.className = 'da-row';
    rowNav.appendChild(prevBtn);
    rowNav.appendChild(nextBtn);
    rowNav.appendChild(selectEl);

    var rowVol = document.createElement('div');
    rowVol.className = 'da-row';
    rowVol.appendChild(volumeEl);
    rowVol.appendChild(muteSfxBtn);
    rowVol.appendChild(sfxVolumeEl);

    playerRoot.appendChild(rowMain);
    playerRoot.appendChild(rowNav);
    playerRoot.appendChild(rowVol);

    /* Le panneau ne doit pas declencher le pilotage du jeu : les ecouteurs
       globaux de script.js ecoutent mousedown/touchstart sur document. */
    ['mousedown', 'mouseup', 'touchstart', 'touchend', 'click', 'pointerdown'].forEach(function (evt) {
        playerRoot.addEventListener(evt, function (e) { e.stopPropagation(); });
        toggleBtn.addEventListener(evt, function (e) { e.stopPropagation(); });
    });

    function setPanelOpen(open) {
        playerRoot.classList.toggle('da-open', open);
        toggleBtn.classList.toggle('da-active', open);
        toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggleBtn.addEventListener('click', function () {
        setPanelOpen(!playerRoot.classList.contains('da-open'));
    });
    // Referme si on clique ailleurs, sans laisser passer l'evenement de jeu.
    document.addEventListener('pointerdown', function (e) {
        if (!playerRoot.classList.contains('da-open')) return;
        if (playerRoot.contains(e.target) || toggleBtn.contains(e.target)) return;
        setPanelOpen(false);
    });

    var style = document.createElement('style');
    style.textContent = [
        '/* Bouton dans le flux du header : il ne peut donc ni recouvrir le',
        '   canvas, ni chevaucher le bouton « Contacter le dev » (fixed, en',
        '   haut a droite), ni passer au-dessus du bouton Hub. */',
        '.da-audio-toggle {',
        '    position: static;',
        '    display: inline-flex;',
        '    align-items: center;',
        '    justify-content: center;',
        '    width: 32px;',
        '    height: 32px;',
        '    margin-left: 6px;',
        '    padding: 0;',
        '    background: rgba(15, 15, 25, 0.8);',
        '    color: #fff;',
        '    border: 1px solid rgba(255, 255, 255, 0.2);',
        '    border-radius: 8px;',
        '    font-size: 14px;',
        '    line-height: 1;',
        '    vertical-align: middle;',
        '    cursor: pointer;',
        '    touch-action: manipulation;',
        '    -webkit-tap-highlight-color: transparent;',
        '}',
        '.da-audio-toggle.da-active {',
        '    background: rgba(126, 200, 255, 0.25);',
        '    border-color: rgba(126, 200, 255, 0.6);',
        '}',
        '#da-music-player {',
        '    position: fixed;',
        '    top: 8px;',
        '    left: 8px;',
        '    z-index: 10001;',
        '    display: none;',
        '    flex-direction: column;',
        '    gap: 5px;',
        '    width: 190px;',
        '    max-width: calc(100vw - 16px);',
        '    padding: 7px 9px;',
        '    background: rgba(15, 15, 25, 0.9);',
        '    border: 1px solid rgba(255, 255, 255, 0.18);',
        '    border-radius: 10px;',
        '    color: #fff;',
        '    font-family: "Press Start 2P", cursive;',
        '    font-size: 8px;',
        '    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);',
        '    touch-action: manipulation;',
        '}',
        '#da-music-player.da-open { display: flex; }',
        '#da-music-player .da-row {',
        '    display: flex;',
        '    align-items: center;',
        '    gap: 5px;',
        '}',
        '#da-music-player .da-music-title {',
        '    font-size: 9px;',
        '    white-space: nowrap;',
        '    overflow: hidden;',
        '    text-overflow: ellipsis;',
        '    flex: 1 1 auto;',
        '    min-width: 0;',
        '}',
        '#da-music-player .da-music-btn {',
        '    background: transparent;',
        '    color: #fff;',
        '    border: none;',
        '    font-size: 13px;',
        '    line-height: 1;',
        '    cursor: pointer;',
        '    padding: 3px 4px;',
        '    flex-shrink: 0;',
        '}',
        '#da-music-player .da-music-play { font-size: 15px; }',
        '#da-music-player .da-music-volume {',
        '    width: 58px;',
        '    accent-color: #7ec8ff;',
        '    cursor: pointer;',
        '    flex: 1 1 auto;',
        '    min-width: 0;',
        '}',
        '#da-music-player .da-music-select {',
        '    background: rgba(255, 255, 255, 0.1);',
        '    color: #fff;',
        '    border: 1px solid rgba(255, 255, 255, 0.2);',
        '    border-radius: 4px;',
        '    padding: 2px 3px;',
        '    font-family: "Press Start 2P", cursive;',
        '    font-size: 7px;',
        '    cursor: pointer;',
        '    flex: 1 1 auto;',
        '    min-width: 0;',
        '}',
        '@media (max-width: 700px) {',
        '    .da-audio-toggle { width: 28px; height: 28px; font-size: 12px; }',
        '    #da-music-player { top: 6px; left: 6px; width: 168px; }',
        '    #da-music-player .da-music-volume { width: 46px; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    function updateTitle() {
        var track = findTrackByKey(currentTrackKey);
        titleEl.textContent = '\u{1F3B5} ' + (track ? track.name : '');
        if (track) selectEl.value = track.track;
    }

    function updatePlayButton() {
        var playing = !musicAudio.paused && !musicAudio.ended && musicAudio.src;
        playBtn.textContent = playing ? '⏸' : '▶';
    }

    function navigateTrack(dir) {
        var idx = -1;
        for (var i = 0; i < PLAYLIST.length; i++) {
            if (PLAYLIST[i].track === currentTrackKey) { idx = i; break; }
        }
        if (idx === -1) idx = 0;
        var newIdx = (idx + dir + PLAYLIST.length) % PLAYLIST.length;
        var newKey = PLAYLIST[newIdx].track;
        currentTrackKey = newKey;
        musicAudio.src = trackUrl(PLAYLIST[newIdx].file);
        musicAudio.currentTime = 0;
        if (!userMuted) {
            musicAudio.play().catch(function () {});
        }
        selectEl.value = newKey;
        updateTitle();
        updatePlayButton();
    }

    prevBtn.addEventListener('click', function () { navigateTrack(-1); });
    nextBtn.addEventListener('click', function () { navigateTrack(1); });
    playBtn.addEventListener('click', function () {
        if (musicAudio.paused) {
            userMuted = false;
            musicAudio.play().catch(function () {});
        } else {
            userMuted = true;
            musicAudio.pause();
        }
        updatePlayButton();
    });
    volumeEl.addEventListener('input', function () {
        musicAudio.volume = Number(volumeEl.value) / 100;
    });
    selectEl.addEventListener('change', function () {
        playTrack(selectEl.value);
    });

    musicAudio.addEventListener('play', updatePlayButton);
    musicAudio.addEventListener('pause', updatePlayButton);
    musicAudio.addEventListener('ended', updatePlayButton);

    // Unlock autoplay on first user interaction
    function unlockHandler() {
        if (pendingMusicAutoplay && currentTrackKey && !userMuted) {
            pendingMusicAutoplay = false;
            musicAudio.play().catch(function () {});
        }
        document.removeEventListener('pointerdown', unlockHandler);
        document.removeEventListener('keydown', unlockHandler);
        document.removeEventListener('touchstart', unlockHandler);
        document.removeEventListener('click', unlockHandler);
    }
    document.addEventListener('pointerdown', unlockHandler);
    document.addEventListener('keydown', unlockHandler);
    document.addEventListener('touchstart', unlockHandler);
    document.addEventListener('click', unlockHandler);

    /* ============================================================
       2) Retro Sound Effects (Web Audio API)
       ============================================================ */

    function playTone(freq, duration, type, volume) {
        var ctx = getCtx();
        if (!ctx) return;
        var dest = getSfxGain();
        if (!dest) return;
        if (ctx.state === 'suspended') ctx.resume();

        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gain);
        gain.connect(dest);
        gain.gain.setValueAtTime(volume || 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    function playSequence(notes, gap, type, volume) {
        var t = 0;
        for (var i = 0; i < notes.length; i++) {
            (function (n, delay) {
                setTimeout(function () { playTone(n.freq, n.dur || 0.1, type || n.type, n.vol || volume); }, delay);
            })(notes[i], t);
            t += gap;
        }
    }

    function playSweep(startFreq, endFreq, duration, type, volume) {
        var ctx = getCtx();
        if (!ctx) return;
        var dest = getSfxGain();
        if (!dest) return;
        if (ctx.state === 'suspended') ctx.resume();

        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(dest);
        gain.gain.setValueAtTime(volume || 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    function playNoise(duration, volume, filterFreq) {
        var ctx = getCtx();
        if (!ctx) return;
        var dest = getSfxGain();
        if (!dest) return;
        if (ctx.state === 'suspended') ctx.resume();

        var bufferSize = Math.floor(ctx.sampleRate * duration);
        var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        var source = ctx.createBufferSource();
        source.buffer = buffer;
        var gain = ctx.createGain();
        gain.gain.setValueAtTime(volume || 0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        if (filterFreq) {
            var filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = filterFreq;
            source.connect(filter);
            filter.connect(gain);
        } else {
            source.connect(gain);
        }
        gain.connect(dest);
        source.start(ctx.currentTime);
    }

    /* ---------- Specific SFX ---------- */

    var fireSoundNodes = null;
    function sfxOnFireStart() {
        stopFireSound();
        var ctx = getCtx();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        var dest = getSfxGain();
        if (!dest) return;

        var now = ctx.currentTime;
        var duration = 4;
        var bufferSize = Math.floor(ctx.sampleRate * duration);
        var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (0.3 + 0.15 * Math.random());
        }

        var source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        var filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        var gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, now);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        source.start(now);

        var crackOsc = ctx.createOscillator();
        crackOsc.type = 'triangle';
        crackOsc.frequency.setValueAtTime(120, now);
        var crackGain = ctx.createGain();
        crackGain.gain.setValueAtTime(0.03, now);
        crackOsc.connect(crackGain);
        crackGain.connect(dest);
        crackOsc.start(now);

        fireSoundNodes = { source: source, gain: gain, crackOsc: crackOsc, crackGain: crackGain };
    }

    function stopFireSound() {
        if (!fireSoundNodes) return;
        try {
            fireSoundNodes.source.stop();
            fireSoundNodes.crackOsc.stop();
            fireSoundNodes.gain.disconnect();
            fireSoundNodes.crackGain.disconnect();
        } catch (e) {}
        fireSoundNodes = null;
    }

    function sfxOnFire() {
        sfxOnFireStart();
        playSweep(300, 1200, 0.5, 'sawtooth', 0.25);
        playSequence([
            { freq: 600, dur: 0.12 },
            { freq: 800, dur: 0.12 },
            { freq: 1000, dur: 0.25 }
        ], 120, 'square', 0.18);
    }

    function sfxSpeedBoost() {
        playNoise(0.5, 0.35, 1200);
        playSweep(400, 1800, 0.5, 'sawtooth', 0.3);
        playSequence([
            { freq: 700, dur: 0.12 },
            { freq: 1000, dur: 0.15 },
            { freq: 1400, dur: 0.2 }
        ], 110, 'square', 0.2);
    }

    function sfxBomb() {
        playNoise(0.9, 0.8, 300);
        playSweep(400, 20, 1.2, 'sawtooth', 0.5);
        playSweep(200, 60, 0.8, 'square', 0.35);
        setTimeout(function () {
            playNoise(0.4, 0.3, 150);
            playSweep(120, 300, 0.5, 'sine', 0.2);
        }, 500);
    }

    function sfxVomit() {
        playSweep(400, 120, 0.4, 'sawtooth', 0.2);
        playNoise(0.3, 0.3, 200);
        playSequence([
            { freq: 220, dur: 0.2 },
            { freq: 196, dur: 0.3 }
        ], 100, 'square', 0.15);
    }

    function sfxExplosion() {
        playNoise(0.6, 0.35, 700);
        playSweep(200, 50, 0.4, 'sawtooth', 0.2);
    }

    function sfxBossDeath() {
        playNoise(0.8, 0.45, 500);
        playSweep(180, 25, 0.7, 'sawtooth', 0.35);
        setTimeout(function () { playNoise(0.5, 0.3, 300); }, 80);
        setTimeout(function () { playNoise(0.4, 0.25, 200); }, 160);
        playSequence([
            { freq: 523, dur: 0.2 },
            { freq: 392, dur: 0.2 },
            { freq: 262, dur: 0.6 }
        ], 160, 'square', 0.2);
    }

    function sfxJump() {
        playSweep(400, 800, 0.12, 'square', 0.15);
    }

    function sfxShoot() {
        playTone(1200, 0.05, 'square', 0.1);
        playTone(600, 0.05, 'square', 0.08);
    }

    function sfxBeer() {
        playSequence([
            { freq: 523, dur: 0.08 },
            { freq: 659, dur: 0.08 },
            { freq: 784, dur: 0.15 }
        ], 70, 'square', 0.15);
    }

    function sfxItem() {
        playSweep(440, 1760, 0.25, 'triangle', 0.18);
        playSequence([
            { freq: 523, dur: 0.06 },
            { freq: 659, dur: 0.06 },
            { freq: 784, dur: 0.08 },
            { freq: 1046, dur: 0.1 }
        ], 50, 'triangle', 0.15);
    }

    function sfxBossEntry() {
        playSweep(100, 600, 0.8, 'sawtooth', 0.15);
        playSequence([
            { freq: 200, dur: 0.2 },
            { freq: 250, dur: 0.2 },
            { freq: 300, dur: 0.3 }
        ], 200, 'square', 0.1);
    }

    function sfxHit() {
        playTone(150, 0.08, 'sawtooth', 0.15);
    }

    function sfxGameOver() {
        playSequence([
            { freq: 440, dur: 0.2 },
            { freq: 392, dur: 0.2 },
            { freq: 349, dur: 0.2 },
            { freq: 294, dur: 0.4 }
        ], 180, 'square', 0.15);
    }

    function sfxShield() {
        playSweep(200, 1200, 0.3, 'sine', 0.18);
        playSequence([
            { freq: 330, dur: 0.08 },
            { freq: 440, dur: 0.08 },
            { freq: 660, dur: 0.08 },
            { freq: 880, dur: 0.08 },
            { freq: 1320, dur: 0.2 }
        ], 45, 'sine', 0.15);
    }

    /* ============================================================
       Public API
       ============================================================ */

    var DA_Audio = {
        // Music
        playLevel: playTrack,
        playHome: function () { playTrack('home'); },
        playEnding: function () { playTrack('ending'); },
        playBoss: playBossMusic,
        resumeLevel: resumeLevelMusic,
        stopMusic: stopMusic,
        mute: function () {
            userMuted = true;
            musicAudio.pause();
            updatePlayButton();
        },
        unmute: function () {
            userMuted = false;
            musicAudio.play().catch(function () {});
            updatePlayButton();
        },
        isMuted: function () { return userMuted; },
        // SFX
        sfx: {
            jump: sfxJump,
            shoot: sfxShoot,
            beer: sfxBeer,
            item: sfxItem,
            explosion: sfxExplosion,
            bossDeath: sfxBossDeath,
            bossEntry: sfxBossEntry,
            hit: sfxHit,
            gameOver: sfxGameOver,
            shield: sfxShield,
            bomb: sfxBomb,
            onFire: sfxOnFire,
            onFireStart: sfxOnFireStart,
            onFireStop: stopFireSound,
            speedBoost: sfxSpeedBoost,
            vomit: sfxVomit
        },
        muteSfx: function () {
            userSfxMuted = true;
            var gain = getSfxGain();
            if (gain) gain.gain.value = 0;
        },
        unmuteSfx: function () {
            userSfxMuted = false;
            var gain = getSfxGain();
            if (gain) gain.gain.value = masterSfxVolume;
        },
        isSfxMuted: function () { return userSfxMuted; }
    };

    window.DA_Audio = DA_Audio;

    /* ---------- Boot ---------- */
    document.body.appendChild(playerRoot);

    /* Le declencheur est place dans le header (a cote du bouton Hub) plutot
       qu'en position fixe : il ne peut alors pas masquer le canvas ni le
       bouton Pause, et suit la mise en page sur mobile. */
    var headerEl = document.querySelector('header');
    var gameHeaderEl = headerEl ? headerEl.querySelector('.game-header') : null;
    if (gameHeaderEl) {
        gameHeaderEl.insertBefore(toggleBtn, gameHeaderEl.children[1] || null);
    } else if (headerEl) {
        headerEl.insertBefore(toggleBtn, headerEl.firstChild);
    } else {
        document.body.appendChild(toggleBtn);
    }

    setPanelOpen(false);
    updateTitle();
    updatePlayButton();
    // Start with home music
    playTrack('home');
})();
