(function (global) {
    'use strict';

    var ctx = null;
    var muted = false;
    var volume = 1.0;

    function ensureCtx() {
        if (!ctx) {
            try {
                ctx = new (global.AudioContext || global.webkitAudioContext)();
            } catch (e) {
                return null;
            }
        }
        if (ctx.state === 'suspended') {
            try { ctx.resume(); } catch (e) {}
        }
        return ctx;
    }

    function masterGain(c) {
        var g = c.createGain();
        g.gain.value = muted ? 0 : Math.max(0, Math.min(1, volume));
        g.connect(c.destination);
        return g;
    }

    function playTone(freq, duration, type, vol, opts) {
        var c = ensureCtx();
        if (!c) return;
        var g = masterGain(c);
        var o = c.createOscillator();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, c.currentTime);
        var env = g.gain;
        env.setValueAtTime(0.001, c.currentTime);
        env.linearRampToValueAtTime(Math.max(0.001, vol || 0.3), c.currentTime + 0.01);
        env.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
        o.connect(g);
        o.start(c.currentTime);
        o.stop(c.currentTime + duration);
    }

    function playNoise(duration, vol, opts) {
        var c = ensureCtx();
        if (!c) return;
        var g = masterGain(c);
        var len = Math.floor(c.sampleRate * duration);
        var buf = c.createBuffer(1, len, c.sampleRate);
        var data = buf.getChannelData(0);
        var decay = opts && opts.decay ? opts.decay : Math.pow(0.001, 1 / len);
        for (var i = 0; i < len; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(decay, i);
        }
        var src = c.createBufferSource();
        src.buffer = buf;
        var env = g.gain;
        env.setValueAtTime(0.001, c.currentTime);
        env.linearRampToValueAtTime(Math.max(0.001, vol || 0.3), c.currentTime + 0.005);
        env.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
        if (opts && opts.filterFreq) {
            var f = c.createBiquadFilter();
            f.type = 'lowpass';
            f.frequency.value = opts.filterFreq;
            src.connect(f);
            f.connect(g);
        } else {
            src.connect(g);
        }
        src.start(c.currentTime);
        src.stop(c.currentTime + duration);
    }

    function playSweep(freqStart, freqEnd, duration, vol, type) {
        var c = ensureCtx();
        if (!c) return;
        var g = masterGain(c);
        var o = c.createOscillator();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freqStart, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), c.currentTime + duration);
        var env = g.gain;
        env.setValueAtTime(0.001, c.currentTime);
        env.linearRampToValueAtTime(Math.max(0.001, vol || 0.3), c.currentTime + 0.01);
        env.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
        o.connect(g);
        o.start(c.currentTime);
        o.stop(c.currentTime + duration);
    }

    function playChord(freqs, duration, vol, type) {
        var c = ensureCtx();
        if (!c) return;
        freqs.forEach(function (f) {
            playTone(f, duration, type, vol);
        });
    }

    var SOUNDS = {
        card_flip: function () {
            var c = ensureCtx();
            if (!c) return;
            playSweep(800, 300, 0.08, 0.25, 'triangle');
            playNoise(0.06, 0.15, { filterFreq: 4000 });
        },
        token_drop: function () {
            var c = ensureCtx();
            if (!c) return;
            playTone(180, 0.15, 'triangle', 0.4);
            playNoise(0.08, 0.2, { filterFreq: 800 });
        },
        spin: function () {
            var c = ensureCtx();
            if (!c) return;
            var now = c.currentTime;
            for (var i = 0; i < 8; i++) {
                playTone(200 + i * 40 + Math.random() * 30, 0.04, 'square', 0.08);
            }
            playNoise(0.12, 0.1, { filterFreq: 3000 });
        },
        jackpot: function () {
            var c = ensureCtx();
            if (!c) return;
            var freqs = [523, 659, 784, 1047];
            freqs.forEach(function (f, i) {
                playTone(f, 0.2, 'square', 0.25, { delay: i * 0.08 });
            });
            playNoise(0.3, 0.2, { filterFreq: 6000 });
        },
        material_fall: function (opts) {
            var mat = (opts && opts.material) || 'wood';
            var pitches = { wood: 140, metal: 90, glass: 200, cardboard: 120, brick: 70 };
            var freq = pitches[mat] || pitches.wood;
            playTone(freq, 0.12, 'triangle', 0.35);
            playNoise(0.06, 0.15, { filterFreq: 600 });
        },
        water_miss: function () {
            var c = ensureCtx();
            if (!c) return;
            playNoise(0.3, 0.25, { filterFreq: 2000, decay: Math.pow(0.001, 1 / (c.sampleRate * 0.3)) });
            playSweep(1200, 400, 0.2, 0.15, 'sine');
        },
        explosion: function () {
            playNoise(0.25, 0.5, { filterFreq: 500 });
            playTone(60, 0.3, 'triangle', 0.5);
        },
        gunshot: function () {
            playNoise(0.08, 0.7, { filterFreq: 8000 });
            playTone(80, 0.15, 'triangle', 0.5);
        },
        target_hit: function () {
            playNoise(0.06, 0.4, { filterFreq: 3000 });
            playTone(300, 0.08, 'square', 0.3);
        },
        scream_male: function () {
            playSweep(400, 120, 0.3, 0.35, 'sawtooth');
            playNoise(0.2, 0.2, { filterFreq: 1500 });
        },
        scream_female: function () {
            playSweep(700, 250, 0.35, 0.3, 'sawtooth');
            playNoise(0.25, 0.15, { filterFreq: 2000 });
        },
        chess_move: function () {
            playTone(1200, 0.03, 'sine', 0.2);
            playTone(800, 0.02, 'triangle', 0.1);
        },
        tile_click: function () {
            playTone(1800, 0.02, 'sine', 0.15);
            playNoise(0.02, 0.08, { filterFreq: 5000 });
        },
        liquid_pour: function () {
            var c = ensureCtx();
            if (!c) return;
            playNoise(0.15, 0.2, { filterFreq: 3000, decay: Math.pow(0.001, 1 / (c.sampleRate * 0.15)) });
            playSweep(600, 200, 0.12, 0.15, 'sine');
        },
        click: function () {
            playTone(1500, 0.02, 'sine', 0.2);
        },
        success: function () {
            playChord([523, 659, 784], 0.2, 0.25, 'square');
        },
        fail: function () {
            playSweep(200, 80, 0.2, 0.3, 'sawtooth');
        },
        paddle: function () {
            playTone(440, 0.05, 'square', 0.3);
            playNoise(0.03, 0.1, { filterFreq: 3000 });
        },
        score: function () {
            playTone(880, 0.1, 'sine', 0.3);
            playTone(1320, 0.12, 'sine', 0.2);
        }
    };

    function play(name, opts) {
        try {
            if (muted) return;
            var fn = SOUNDS[name];
            if (typeof fn === 'function') {
                fn(opts);
            }
        } catch (e) {
            console.warn('[TDSfx] play error:', e.message);
        }
    }

    function setMuted(val) {
        muted = !!val;
    }

    function isMuted() {
        return muted;
    }

    function setVolume(val) {
        volume = Math.max(0, Math.min(1, val));
    }

    global.TDSfx = {
        play: play,
        setMuted: setMuted,
        isMuted: isMuted,
        setVolume: setVolume
    };
})(typeof globalThis !== 'undefined' ? globalThis : this);
