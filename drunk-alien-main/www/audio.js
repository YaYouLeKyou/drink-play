/* ============================================================
   Drunkin' Alien — Audio System
   ------------------------------------------------------------
   1) Music player (level-based playlist with controls)
   2) Retro sound effects (Web Audio API, 8-bit style)
   ============================================================ */

(function () {
    'use strict';

    /* ---------- Music playlist (matches existing media files) ---------- */
    var MUSIC_BASE = './media/';
    var PLAYLIST = [
        { name: 'Accueil',     file: 'accueil.mp3',            track: 'home'   },
        { name: 'Level 1',     file: 'Level1.mp3',             track: 'level1' },
        { name: 'Level 2',     file: 'Level 2.mp3',            track: 'level2' },
        { name: 'Level 3',     file: 'level 3.mp3',            track: 'level3' },
        { name: 'Level 4',     file: 'level 4.mp3',            track: 'level4' },
        { name: 'Boss 1',      file: 'Boss 1.mp3',             track: 'boss1'  },
        { name: 'Generique',   file: 'generique de fin.mp3',   track: 'ending' }
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

    /* ---------- Music player UI ---------- */
    var playerRoot = document.createElement('div');
    playerRoot.id = 'da-music-player';

    var titleEl = document.createElement('span');
    titleEl.className = 'da-music-title';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'da-music-btn';
    prevBtn.title = 'Previous track';
    prevBtn.textContent = '⏮';

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

    playerRoot.appendChild(titleEl);
    playerRoot.appendChild(prevBtn);
    playerRoot.appendChild(playBtn);
    playerRoot.appendChild(nextBtn);
    playerRoot.appendChild(selectEl);
    playerRoot.appendChild(volumeEl);
    playerRoot.appendChild(muteSfxBtn);
    playerRoot.appendChild(sfxVolumeEl);

    var style = document.createElement('style');
    style.textContent = [
        '#da-music-player {',
        '    position: fixed;',
        '    bottom: 12px;',
        '    left: 12px;',
        '    right: 12px;',
        '    z-index: 9999;',
        '    display: flex;',
        '    align-items: center;',
        '    gap: 6px;',
        '    padding: 6px 10px;',
        '    background: rgba(15, 15, 25, 0.85);',
        '    border: 1px solid rgba(255, 255, 255, 0.18);',
        '    border-radius: 10px;',
        '    backdrop-filter: blur(6px);',
        '    -webkit-backdrop-filter: blur(6px);',
        '    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);',
        '    color: #fff;',
        '    font-family: "Press Start 2P", cursive;',
        '    font-size: 9px;',
        '    max-width: calc(100vw - 24px);',
        '    overflow: hidden;',
        '}',
        '#da-music-player .da-music-title {',
        '    font-size: 10px;',
        '    white-space: nowrap;',
        '    overflow: hidden;',
        '    text-overflow: ellipsis;',
        '    max-width: 100px;',
        '    flex-shrink: 0;',
        '}',
        '#da-music-player .da-music-btn {',
        '    background: transparent;',
        '    color: #fff;',
        '    border: none;',
        '    font-size: 14px;',
        '    line-height: 1;',
        '    cursor: pointer;',
        '    padding: 4px 6px;',
        '    border-radius: 50%;',
        '    transition: transform 0.15s ease, background 0.15s ease;',
        '    flex-shrink: 0;',
        '}',
        '#da-music-player .da-music-btn:hover {',
        '    background: rgba(255, 255, 255, 0.15);',
        '    transform: scale(1.12);',
        '}',
        '#da-music-player .da-music-play { font-size: 16px; }',
        '#da-music-player .da-music-volume,',
        '#da-music-player .da-sfx-volume {',
        '    width: 60px;',
        '    accent-color: #7ec8ff;',
        '    cursor: pointer;',
        '    flex-shrink: 0;',
        '}',
        '#da-music-player .da-music-select {',
        '    background: rgba(255, 255, 255, 0.1);',
        '    color: #fff;',
        '    border: 1px solid rgba(255, 255, 255, 0.2);',
        '    border-radius: 4px;',
        '    padding: 2px 4px;',
        '    font-family: "Press Start 2P", cursive;',
        '    font-size: 8px;',
        '    cursor: pointer;',
        '    flex-shrink: 1;',
        '    min-width: 0;',
        '}',
        '@media (max-width: 480px) {',
        '    #da-music-player { font-size: 8px; padding: 4px 6px; gap: 4px; }',
        '    #da-music-player .da-music-title { max-width: 60px; font-size: 8px; }',
        '    #da-music-player .da-music-volume, #da-music-player .da-sfx-volume { width: 40px; }',
        '    #da-music-player .da-music-btn { font-size: 12px; padding: 3px 4px; }',
        '    #da-music-player .da-music-play { font-size: 13px; }',
        '}'
    ].join('\n');
    document.head.appendChild(style);

    function updateTitle() {
        var track = findTrackByKey(currentTrackKey);
        titleEl.textContent = '🎵 ' + (track ? track.name : '');
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
            data[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.random());
        }

        var source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        var filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;
        filter.Q.value = 0.8;

        var gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        source.start(now);

        var crackOsc = ctx.createOscillator();
        crackOsc.type = 'sawtooth';
        crackOsc.frequency.setValueAtTime(180, now);
        var crackGain = ctx.createGain();
        crackGain.gain.setValueAtTime(0.08, now);
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
        playNoise(0.7, 0.4, 400);
        playSweep(300, 20, 0.6, 'sawtooth', 0.3);
        playSweep(150, 40, 0.5, 'square', 0.25);
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
        playSequence([
            { freq: 880, dur: 0.06 },
            { freq: 1320, dur: 0.1 }
        ], 60, 'triangle', 0.12);
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
        playSweep(300, 900, 0.2, 'triangle', 0.12);
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
            speedBoost: sfxSpeedBoost
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
    updateTitle();
    updatePlayButton();
    // Start with home music
    playTrack('home');
})();
