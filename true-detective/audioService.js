(function (global) {
    'use strict';

    var STORAGE_KEY = 'trueDetectiveAudio';
    var volume = 1.0;
    var muted = false;
    var selectedVoice = null;
    var voicesReady = false;
    var recognition = null;
    var isListening = false;
    var isSpeaking = false;
    var typingSoundEnabled = true;
    var currentTheme = null;
    var typingCtx = null;
    var typingPool = [];

    var THEME_MUSIC = {
        'agatha-christie': 'sherlock.mp3',
        'cyberpunk': 'cyberpunk.mp3',
        'film-noir': 'noire.mp3',
    };

    /*
    ============================================================
    VOICE PROFILES, 8 Archetypes × 2 Languages
    ============================================================

    ENGLISH PERSONALITIES:
    ───────────────────────
    1. Detective (The Ally)       – Analytical, methodical, calm
       Voice: Neutral, clear, poised. Slow rate, impeccable diction.
    2. Wealthy Suspect (The Rich) – Arrogant, condescending, impatient
       Voice: Deep, theatrical, emphatic. Slow, contemptuous tone.
    3. Femme Fatale (The Seducteur) – Charismatic, mysterious, calculating
       Voice: Smooth, velvet, captivating (Monroe style). Slow, breathy, warm.
    4. Informant (The Witness)    – Anxious, paranoid, opportunistic
       Voice: Fast, staccato, low. Frequent whispers, hesitations.
    5. Scientist (The Expert)     – Eccentric, passionate, detached
       Voice: Staccato, fast, slightly nasal. Sudden rhythm shifts.
    6. Bodyguard (The Force)      – Stoic, loyal, menacing
       Voice: Very deep, monotone, droning. Throat clearings, short sentences.
    7. Criminal (The Shadow)       – Calculating, cold, manipulative
       Voice: Dark, calm, cutting. Threatening but polite, master of silence.
    8. Outsider (The Unhinged)    – Unstable, incoherent, obsessed
       Voice: Shifting, high, raspy. Sudden switches whisper↔outbursts.

    FRENCH PERSONALITIES:
    ───────────────────────
    1. Détective (L'Allié)         – Analytique, méthodique, posé
       Voice: Neutre, claire, posée. Débit calme, diction impeccable.
    2. Héritier Suspect (Le Riche) – Arrogant, condescendant, impatient
       Voice: Grave, théâtrale, appuyée. Lente, ton méprisant.
    3. Femme Fatale (La Séductrice) – Charismatique, mystérieuse, calculatrice
       Voice: Suave, feutrée, envoûtante (style Bardot). Lente, souffle marqué.
    4. Informateur (Le Témoin)    – Anxieux, paranoïaque, opportuniste
       Voice: Rapide, saccadée, basse. Chuchotements, hésitations.
    5. Scientifique (L'Expert)    – Excentrique, passionné, détaché
       Voice: Saccadée, rapide, légèrement nasillarde. Variations brutales.
    6. Protecteur (La Force)      – Stoïque, loyal, menaçant
       Voice: Très grave, monotone, monocorde. Raclements, phrases courtes.
    7. Criminel (L'Ombre)         – Calculateur, froid, manipulateur
       Voice: Sombre, posé, tranchant. Méprisant mais poli, maître du silence.
    8. Marginal (L'Intrus)        – Instable, incohérent, obsédé
       Voice: Cambiante, aiguë, rocailleuse. Whispers↔éclats brusques.

    NARRATOR:
    ─────────
    EN: Morgan Freeman-style (deep, resonant, calm)
    FR: Hercule Poirot-style (measured, precise, slight Belgian/French accent feel)

    ============================================================
    */
    var VOICE_PROFILES = {
        // ── ENGLISH VOICES ──
        'detective': {
            name: 'Detective',
            lang: 'en-US',
            pitch: 0.90,
            rate: 0.92,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'david|daniel|mark|james|en-US'
        },
        'suspect_rich': {
            name: 'Wealthy Suspect',
            lang: 'en-US',
            pitch: 0.78,
            rate: 0.82,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'mark|james|en-US'
        },
        'femme_fatale': {
            name: 'Femme Fatale',
            lang: 'en-US',
            pitch: 0.60,
            rate: 0.78,
            volumeBoost: 1.1,
            gender: 'female',
            hint: 'victoria|samantha|karen|en-US'
        },
        'informant': {
            name: 'Nervous Informant',
            lang: 'en-US',
            pitch: 1.25,
            rate: 1.18,
            volumeBoost: 0.9,
            gender: 'female',
            hint: 'samantha|karen|en-US'
        },
        'scientist': {
            name: 'Scientist',
            lang: 'en-GB',
            pitch: 1.05,
            rate: 1.08,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'daniel|oliver|en-GB'
        },
        'bodyguard': {
            name: 'Bodyguard',
            lang: 'en-US',
            pitch: 0.65,
            rate: 0.82,
            volumeBoost: 1.2,
            gender: 'male',
            hint: 'david|alex|en-US'
        },
        'criminal': {
            name: 'Criminal Mind',
            lang: 'en-US',
            pitch: 0.72,
            rate: 0.85,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'james|daniel|en-US'
        },
        'outsider': {
            name: 'Unhinged Outsider',
            lang: 'en-US',
            pitch: 1.18,
            rate: 1.05,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'alex|david|en-US'
        },
        'narrator': {
            name: 'Narrator',
            lang: 'en-US',
            pitch: 0.60,
            rate: 0.82,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'david|alex|en-US'
        },

        // ── FRENCH VOICES ──
        'detective_fr': {
            name: 'Détective (FR)',
            lang: 'fr-FR',
            pitch: 0.92,
            rate: 0.90,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'francois|pascal|cyprien|poirot|fr-FR'
        },
        'suspect_rich_fr': {
            name: 'Héritier Suspect (FR)',
            lang: 'fr-FR',
            pitch: 0.78,
            rate: 0.80,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'francois|pascal|fr-FR'
        },
        'femme_fatale_fr': {
            name: 'Femme Fatale (FR)',
            lang: 'fr-FR',
            pitch: 0.62,
            rate: 0.76,
            volumeBoost: 1.1,
            gender: 'female',
            hint: 'audrey|victoria|sabrine|françoise|fr-FR'
        },
        'informant_fr': {
            name: 'Informateur (FR)',
            lang: 'fr-FR',
            pitch: 1.22,
            rate: 1.15,
            volumeBoost: 0.9,
            gender: 'female',
            hint: 'audrey|victoria|sabrine|fr-FR'
        },
        'scientist_fr': {
            name: 'Scientifique (FR)',
            lang: 'fr-FR',
            pitch: 1.02,
            rate: 1.05,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'francois|pascal|cyprien|fr-FR'
        },
        'bodyguard_fr': {
            name: 'Protecteur (FR)',
            lang: 'fr-FR',
            pitch: 0.68,
            rate: 0.82,
            volumeBoost: 1.2,
            gender: 'male',
            hint: 'pascal|francois|fr-FR'
        },
        'criminal_fr': {
            name: 'Criminel (FR)',
            lang: 'fr-FR',
            pitch: 0.72,
            rate: 0.82,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'cyprien|pascal|fr-FR'
        },
        'outsider_fr': {
            name: 'Marginal (FR)',
            lang: 'fr-FR',
            pitch: 1.15,
            rate: 1.08,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'cyprien|pascal|fr-FR'
        },
        // Hercule Poirot style: measured, precise, slightly formal, calm authority
        'narrator_fr': {
            name: 'Narrateur, Hercule Poirot (FR)',
            lang: 'fr-FR',
            pitch: 0.78,
            rate: 0.88,
            volumeBoost: 1.0,
            gender: 'male',
            hint: 'francois|pascal|poirot|fr-FR'
        },
    };

    var currentLanguage = 'en';

    var MUSIC_PHASES = {
        investigation: { label: 'Investigation', intensity: 'low', tempo: 70 },
        interrogation: { label: 'Interrogation', intensity: 'medium', tempo: 80 },
        puzzle: { label: 'Puzzle', intensity: 'medium-low', tempo: 75 },
        tension: { label: 'Tension', intensity: 'high', tempo: 120 },
        revelation: { label: 'Revelation', intensity: 'high', tempo: 120 },
        credits: { label: 'Credits', intensity: 'low', tempo: 60 },
        intro: { label: 'Intro', intensity: 'low', tempo: 60 },
        mystere: { label: 'Mystère', intensity: 'low', tempo: 70 },
    };

    var MUSIC_PHASE_PROMPTS = {
        investigation: 'Dark ambient cinematic, slow tension build, mysterious pad synth, subtle electronic undertones, detective mood',
        interrogation: 'Slow noir jazz, muted trumpet, tense piano chords, psychological pressure, whispered suspicions',
        puzzle: 'Ethereal mystery, cryptic tones, puzzle-solving ambiance, rising curiosity, cerebral tension',
        tension: 'Fast cinematic thriller, intense rhythmic percussion, rising tension, dramatic hybrid orchestral, dark synth pulses, high stakes climax, 120bpm, instrumental',
        revelation: 'Fast cinematic thriller, intense rhythmic percussion, rising tension, dramatic hybrid orchestral, dark synth pulses, high stakes climax, 120bpm, instrumental',
        credits: 'Slow cinematic outro, melancholic piano, gentle strings, resolution and closure, reflective mood',
        intro: 'Cinematic intro music, majestic orchestra, forward momentum, establishing the mystery theme, soft drums, building anticipation',
    };

    var MUSIC_PHASE_TRACKS = {
        investigation: 'recherche.mp3',
        interrogation: 'Midnight Ticking.mp3',
        puzzle: 'enigme.mp3',
        tension: 'stress.mp3',
        revelation: 'Rising Tension.mp3',
        credits: 'generique.mp3',
        intro: 'generique.mp3',
    };

    var THEME_MUSIC_TRACKS = {
        'agatha-christie': 'sherlock.mp3',
        'cyberpunk': 'cyberpunk.mp3',
        'film-noir': 'noire.mp3',
    };

    var currentMusicPhase = null;

    function setLanguage(lang) {
        currentLanguage = lang || 'en';
        loadVoices();
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                volume: volume,
                muted: muted,
                typingSound: typingSoundEnabled
            }));
        } catch (e) {
            console.warn('[AudioService] Failed to save settings:', e.message);
        }
    }

    function loadSettings() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            var data = JSON.parse(raw);
            if (typeof data.volume === 'number') { volume = data.volume; }
            if (typeof data.muted === 'boolean') { muted = data.muted; }
            if (typeof data.typingSound === 'boolean') { typingSoundEnabled = data.typingSound; }
        } catch (e) {
            console.warn('[AudioService] Failed to load settings:', e.message);
        }
        console.info('[AudioService] Typewriter sound:', typingSoundEnabled ? 'activé' : 'DÉSACTIVÉ (bouton ⌨️ de la barre du haut)', '| muted:', muted);
    }

    function loadVoices() {
        if (!global.speechSynthesis) { return; }
        var voices = global.speechSynthesis.getVoices();
        if (voices.length > 0) {
            voicesReady = true;
            if (!selectedVoice) {
                selectedVoice = voices.find(function (v) { return /david|alex|samantha|victoria|karen|daniel|oliver/i.test(v.name); }) || voices[0];
            }
        }
    }

    function ensureVoices(callback) {
        loadVoices();
        if (voicesReady || (global.speechSynthesis && global.speechSynthesis.getVoices().length > 0)) {
            callback();
        } else if (global.speechSynthesis) {
            global.speechSynthesis.onvoiceschanged = function () {
                loadVoices();
                callback();
            };
            setTimeout(callback, 500);
        } else {
            callback();
        }
    }

    var speakSession = 0;

    function chunkText(text, maxLen) {
        var parts = text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [text];
        var chunks = [];
        var current = '';
        parts.forEach(function (p) {
            p = p.trim();
            if (!p) { return; }
            if ((current ? current + ' ' + p : p).length <= maxLen) {
                current = current ? current + ' ' + p : p;
            } else {
                if (current) { chunks.push(current); }
                if (p.length <= maxLen) {
                    current = p;
                } else {
                    for (var i = 0; i < p.length; i += maxLen) {
                        chunks.push(p.substring(i, i + maxLen));
                    }
                    current = '';
                }
            }
        });
        if (current) { chunks.push(current); }
        return chunks.length ? chunks : [text];
    }

    function speak(text, profileId) {
        if (!text || !global.speechSynthesis) {
            return false;
        }

        var cleanText = String(text).replace(/\s+/g, ' ').trim();
        if (!cleanText) { return false; }

        var profile = VOICE_PROFILES[profileId] || VOICE_PROFILES['narrator'];

        // Cancel any current speech and invalidate previous sessions
        global.speechSynthesis.cancel();
        var session = ++speakSession;
        isSpeaking = true;

        return new Promise(function (resolve) {
            ensureVoices(function () {
                if (session !== speakSession) { resolve(); return; }
                if (muted) { isSpeaking = false; resolve(); return; }

                // Chrome/Edge bug: calling cancel() and speak() in the same tick
                // silently drops the utterance. Delay slightly after cancel.
                setTimeout(function () {
                    if (session !== speakSession) { resolve(); return; }

                    // Chrome cuts utterances longer than ~15s: split into chunks
                    var chunks = chunkText(cleanText, 220);
                    var index = 0;

                    function finish() {
                        if (session === speakSession) { isSpeaking = false; }
                        resolve();
                    }

                    function speakNext() {
                        if (session !== speakSession) { return; }
                        if (index >= chunks.length) { finish(); return; }
                        var part = chunks[index++];
                        var utterance = new global.SpeechSynthesisUtterance(part);
                        utterance.lang = profile.lang;
                        utterance.voice = getMatchedVoice(profileId) || selectedVoice || null;
                        utterance.rate = profile.rate;
                        utterance.pitch = profile.pitch;
                        utterance.volume = Math.max(0, Math.min(1, volume * (profile.volumeBoost || 1.0)));

                        utterance.onend = function () { speakNext(); };
                        utterance.onerror = function () { speakNext(); };

                        global.speechSynthesis.speak(utterance);
                    }

                    // Watchdog: if the engine never fires onend/onerror (Chrome bug),
                    // release the lock so future speech still works.
                    setTimeout(function () {
                        if (session === speakSession && isSpeaking &&
                            !global.speechSynthesis.speaking && !global.speechSynthesis.pending) {
                            isSpeaking = false;
                        }
                    }, 3000);

                    speakNext();
                }, 60);
            });
        });
    }

    function stopSpeaking() {
        speakSession++;
        if (global.speechSynthesis) {
            global.speechSynthesis.cancel();
        }
        isSpeaking = false;
    }

    function getMatchedVoice(profileId) {
        var profile = VOICE_PROFILES[profileId] || VOICE_PROFILES['narrator'];
        var voices = global.speechSynthesis ? global.speechSynthesis.getVoices() : [];
        if (!voices.length) { return null; }

        var hintRegex = new RegExp(profile.hint, 'i');
        var sameLang = voices.filter(function (v) {
            return v.lang.startsWith(profile.lang.split('-')[0]);
        });
        var pool = sameLang.length ? sameLang : voices;
        var genderRegex = profile.gender === 'female'
            ? /female|woman|girl|samantha|victoria|karen|moira|fiona|tessa|alice|emma|sophie|audrey/i
            : /male|man|david|alex|daniel|mark|james|paul|george|francois|pascal|cyprien/i;
        var genderPool = pool.filter(function (v) { return genderRegex.test(v.name); });
        var preferredPool = genderPool.length ? genderPool : pool;
        return preferredPool.find(function (v) { return hintRegex.test(v.name); }) || preferredPool[0] || null;
    }

    function startListening(onResult, onError) {
        var SpeechRecognition = global.SpeechRecognition || global.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            if (onError) {
                onError('SpeechRecognition not supported in this browser. Please type your response.');
            }
            return false;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'fr' ? 'fr-FR' : 'en-US';

        recognition.onresult = function (event) {
            var transcript = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].hasEnded || event.results[i].length > 0) {
                    transcript += event.results[i][event.results[i].length - 1].transcript;
                }
            }
            isListening = false;
            if (onResult) { onResult(transcript.trim()); }
        };

        recognition.onerror = function (event) {
            isListening = false;
            if (onError) { onError('Speech recognition error: ' + event.error); }
        };

        recognition.onend = function () {
            isListening = false;
        };

        try {
            recognition.start();
            isListening = true;
            return true;
        } catch (e) {
            isListening = false;
            if (onError) { onError('Failed to start speech recognition: ' + e.message); }
            return false;
        }
    }

    function stopListening() {
        if (recognition && isListening) {
            try {
                recognition.stop();
            } catch (e) {
                console.warn('[AudioService] Error stopping recognition:', e.message);
            }
        }
        isListening = false;
    }

    function getThemeMusic(themeId) {
        return THEME_MUSIC[themeId] || THEME_MUSIC['agatha-christie'];
    }

    function setMusicPhase(phase) {
        var valid = MUSIC_PHASES[phase] || MUSIC_PHASES.investigation;
        currentMusicPhase = phase;
        if (typeof window !== 'undefined' && window.DPMusicPlayer) {
            var track = MUSIC_PHASE_TRACKS[phase] || MUSIC_PHASE_TRACKS.investigation;
            window.DPMusicPlayer.playTrack(track);
        }
        return currentMusicPhase;
    }

    function playThemeMusic(themeId) {
        currentTheme = themeId;
        var track = THEME_MUSIC[themeId] || MUSIC_PHASE_TRACKS.investigation;
        if (typeof window !== 'undefined' && window.DPMusicPlayer) {
            window.DPMusicPlayer.playTrack(track);
        }
        return track;
    }

    function setCurrentTheme(themeId) {
        currentTheme = themeId;
    }

    function isCyberpunkTheme() {
        var id = (currentTheme || '').toLowerCase();
        return id === 'cyberpunk';
    }

    function getTypingSoundProfile() {
        var id = (currentTheme || '').toLowerCase();
        if (isCyberpunkTheme()) return 'cyberpunk';
        if (id === 'film-noir' || id === 'noir') return 'film-noir';
        return 'classic';
    }

    /* ---- Fallback typewriter : clic WAV généré à la volée (data URI),
       joué via <audio> si le Web Audio API reste bloqué par le navigateur */
    var typingFallbackMode = false;
    var typingSilentCalls = 0;
    var typingFallbackUri = null;

    function buildClickWavUri() {
        var sampleRate = 8000;
        var n = Math.floor(sampleRate * 0.04); /* 40 ms */
        var bytes = new Uint8Array(44 + n * 2);
        function wstr(o, s) { for (var i = 0; i < s.length; i++) bytes[o + i] = s.charCodeAt(i); }
        function w32(o, v) { bytes[o] = v & 255; bytes[o + 1] = (v >> 8) & 255; bytes[o + 2] = (v >> 16) & 255; bytes[o + 3] = (v >>> 24) & 255; }
        function w16(o, v) { bytes[o] = v & 255; bytes[o + 1] = (v >> 8) & 255; }
        wstr(0, 'RIFF'); w32(4, 36 + n * 2); wstr(8, 'WAVE');
        wstr(12, 'fmt '); w32(16, 16); w16(20, 1); w16(22, 1);
        w32(24, sampleRate); w32(28, sampleRate * 2); w16(32, 2); w16(34, 16);
        wstr(36, 'data'); w32(40, n * 2);
        for (var i = 0; i < n; i++) {
            var t = i / n;
            var env = Math.pow(1 - t, 3);
            var noise = Math.random() * 2 - 1;
            var tone = Math.sin(2 * Math.PI * 170 * (i / sampleRate)) * 0.6;
            var v = Math.max(-1, Math.min(1, (noise * 0.35 + tone * 0.35) * env * 0.55));
            w16(44 + i * 2, Math.round(v * 32767));
        }
        var bin = '';
        for (var b = 0; b < bytes.length; b++) bin += String.fromCharCode(bytes[b]);
        return 'data:audio/wav;base64,' + btoa(bin);
    }

    function playTypingFallback() {
        try {
            if (!typingFallbackUri) typingFallbackUri = buildClickWavUri();
            var a = new Audio(typingFallbackUri);
            a.volume = Math.max(0.02, Math.min(1, volume * 0.2));
            a.play().catch(function () { /* gestes requis — ignoré */ });
        } catch (e) { /* ignore */ }
    }

    function ensureTypingCtx() {        if (!typingCtx) {
            try {
                typingCtx = new (global.AudioContext || global.webkitAudioContext)();
            } catch (e) {
                console.warn('[AudioService] Web Audio API not supported for typewriter sound');
                return null;
            }
        }
        if (typingCtx.state === 'suspended') {
            try { typingCtx.resume(); } catch (e) { /* ignore */ }
        }
        return typingCtx;
    }

    // Lazily create + unlock the AudioContext on the first user gesture so that
    // short typewriter sounds play reliably (browsers block autoplay on a
    // context that was never created/resumed by a user interaction).
    // NOTE: le contexte n'est plus créé au chargement de la page (il restait
    // alors « suspended » à jamais dans certains navigateurs) : il est créé
    // DANS le handler du premier geste utilisateur.
    function initTypingSound() {
        var unlock = function () {
            var ctx = ensureTypingCtx();
            if (ctx && ctx.state === 'running') {
                // Play a silent buffer to force-unlock the audio context
                try {
                    var buf = ctx.createBuffer(1, 1, 22050);
                    var src = ctx.createBufferSource();
                    src.buffer = buf;
                    src.connect(ctx.destination);
                    src.start(0);
                } catch (e) { /* ignore */ }
                document.removeEventListener('click', unlock);
                document.removeEventListener('keydown', unlock);
                document.removeEventListener('touchstart', unlock);
            }
        };
        document.addEventListener('click', unlock);
        document.addEventListener('keydown', unlock);
        document.addEventListener('touchstart', unlock);
    }
    initTypingSound();

    function playTypingSound() {
        if (!typingSoundEnabled || muted) return;

        /* Fallback HTMLAudio : si le Web Audio reste bloqué (autoplay policy,
           navigateur capricieux), on joue un clic WAV généré via <audio>,
           autorisé dès que l'utilisateur a interagi avec la page. */
        if (typingFallbackMode) {
            playTypingFallback();
            return;
        }

        var ctx = ensureTypingCtx();
        if (!ctx || ctx.state !== 'running') {
            typingSilentCalls++;
            if (typingSilentCalls >= 10) {
                typingFallbackMode = true;
                console.info('[AudioService] Typewriter: Web Audio bloqué, bascule sur le fallback HTMLAudio');
                playTypingFallback();
            }
            return;
        }
        typingSilentCalls = 0;

        var profile = getTypingSoundProfile();
        var cyber = profile === 'cyberpunk';
        var now = ctx.currentTime;
        var masterVol = volume * 0.24;

        if (cyber) {
            // Soft futuristic key tone: rounded rather than a sharp alert.
            var osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(420 + Math.random() * 80, now);
            osc.frequency.exponentialRampToValueAtTime(180 + Math.random() * 50, now + 0.1);

            var gain = ctx.createGain();
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(masterVol * 0.5, now + 0.018);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

            // Minimal noise for texture - subtle, not harsh
            var noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
            var d = noiseBuf.getChannelData(0);
            for (var i = 0; i < d.length; i++) {
                d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3) * 0.08;
            }
            var noiseSrc = ctx.createBufferSource();
            noiseSrc.buffer = noiseBuf;
            var noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.001, now);
            noiseGain.gain.linearRampToValueAtTime(masterVol * 0.06, now + 0.018);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);
            noiseSrc.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.13);
            noiseSrc.start(now);
            noiseSrc.stop(now + 0.04);
        } else {
            // Mechanical profiles: classic is crisp, film noir is lower and softer.
            // + a low tonal "thock" (striking key / carriage) for realism
            var bufLen = Math.floor(ctx.sampleRate * 0.025);
            var buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
            var data = buf.getChannelData(0);
            for (var j = 0; j < bufLen; j++) {
                data[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / bufLen, 3) * (0.16 + Math.random() * 0.08);
            }
            var src = ctx.createBufferSource();
            src.buffer = buf;

            var filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            var noir = profile === 'film-noir';
            filter.frequency.setValueAtTime(noir ? 950 + Math.random() * 250 : 1600 + Math.random() * 400, now);

            var g = ctx.createGain();
            g.gain.setValueAtTime(masterVol * (noir ? 0.52 : 0.68), now);
            g.gain.exponentialRampToValueAtTime(0.0001, now + (noir ? 0.05 : 0.04));

            src.connect(filter);
            filter.connect(g);
            g.connect(ctx.destination);

            src.start(now);
            src.stop(now + 0.025);

            /* Composante tonale grave ("thock") : varie légèrement à chaque
               frappe pour un rendu mécanique naturel */
            var thock = ctx.createOscillator();
            thock.type = 'triangle';
            var thockFreq = noir ? 95 + Math.random() * 40 : 140 + Math.random() * 70;
            thock.frequency.setValueAtTime(thockFreq, now);
            thock.frequency.exponentialRampToValueAtTime(thockFreq * 0.55, now + (noir ? 0.07 : 0.05));

            var thockGain = ctx.createGain();
            thockGain.gain.setValueAtTime(0.001, now);
            thockGain.gain.linearRampToValueAtTime(masterVol * (noir ? 0.22 : 0.3), now + 0.012);
            thockGain.gain.exponentialRampToValueAtTime(0.0001, now + (noir ? 0.11 : 0.08));

            thock.connect(thockGain);
            thockGain.connect(ctx.destination);

            thock.start(now);
            thock.stop(now + 0.07);
        }
    }

    function toggleTypingSound() {
        typingSoundEnabled = !typingSoundEnabled;
        saveSettings();
        return typingSoundEnabled;
    }

    function stopTypingSound() {
        // No persistent sound to stop (all events are short), but keep API
    }

    function getMusicForPhase(themeId, musicPhase) {
        var base = THEME_MUSIC[themeId] || THEME_MUSIC['agatha-christie'];
        var phasePrompt = MUSIC_PHASE_PROMPTS[musicPhase] || MUSIC_PHASE_PROMPTS.investigation;
        return phasePrompt + (base ? ' Base theme: ' + base.substring(0, 80) : '');
    }

    function getCurrentMusicPhase() {
        return currentMusicPhase;
    }

    function getVoiceProfileKey(npc, character) {
        var langSuffix = currentLanguage === 'fr' ? '_fr' : '';

        // Map NPC archetype to profile key
        var archetype = (npc && npc.archetype) ? npc.archetype.toLowerCase() : '';

        // Fall back to role
        var role = (npc && npc.role) ? npc.role.toLowerCase() : '';

        // Map from archetype/role → profile key
        if (archetype === 'detective' || role === 'detective' || role === 'partner' || role === 'investigator' || role === 'detective-partner') {
            return 'detective' + langSuffix;
        }
        if (archetype === 'suspect_rich' || role === 'suspect_rich' || role === 'suspect' || role === 'riche' || role === 'héritier' || role === 'rich' || role === 'noble' || role === 'heritier') {
            return 'suspect_rich' + langSuffix;
        }
        if (archetype === 'femme_fatale' || role === 'femme_fatale' || role === 'seducteur' || role === 'seductive' || role === 'manipulatrice' || role === 'manipulator' || role === 'femme-fatale') {
            return 'femme_fatale' + langSuffix;
        }
        if (archetype === 'informant' || role === 'informant' || role === 'witness' || role === 'témoin' || role === 'furtif' || role === 'informateur' || role === 'scientist' || role === 'légiste' || role === 'expert' || role === 'legist') {
            return 'informant' + langSuffix;
        }
        if (archetype === 'scientist' || role === 'scientist' || role === 'légiste' || role === 'expert' || role === 'legist') {
            return 'scientist' + langSuffix;
        }
        if (archetype === 'bodyguard' || role === 'bodyguard' || role === 'protecteur' || role === 'force' || role === 'enforcer' || role === 'videur') {
            return 'bodyguard' + langSuffix;
        }
        if (archetype === 'criminal' || role === 'criminal' || role === 'ombre' || role === 'mastermind' || role === 'shadow') {
            return 'criminal' + langSuffix;
        }
        if (archetype === 'outsider' || role === 'outsider' || role === 'marginal' || role === 'intrus' || role === 'unhinged') {
            return 'outsider' + langSuffix;
        }

        // Fuzzy fallback: AI-generated NPCs may have free-text roles
        // (e.g. "héritier fortuné", "the victim's bodyguard"), match keywords.
        var combined = ((archetype || '') + ' ' + (role || '')).toLowerCase();
        if (/detect|partenaire|partner|investigat|allie|allié/.test(combined)) { return 'detective' + langSuffix; }
        if (/riche|rich|noble|heritier|héritier|suspect|arrogant|fortune/.test(combined)) { return 'suspect_rich' + langSuffix; }
        if (/fatale|seduct|séduct|charme|manipulatric|venimeuse/.test(combined)) { return 'femme_fatale' + langSuffix; }
        if (/inform|temoin|témoin|witness|nerveux|anxieux|paranoi/.test(combined)) { return 'informant' + langSuffix; }
        if (/scient|expert|legiste|légiste|docteur|doctor|professeur|professor|chercheur/.test(combined)) { return 'scientist' + langSuffix; }
        if (/bodyguard|garde|protect|force|videur|security|sécurité/.test(combined)) { return 'bodyguard' + langSuffix; }
        if (/criminel|criminal|ombre|shadow|mastermind|assassin|meurtrier|coupable/.test(combined)) { return 'criminal' + langSuffix; }
        if (/marginal|outsider|intrus|unhinged|instable|fou|clochard|vagabond/.test(combined)) { return 'outsider' + langSuffix; }

        return 'narrator' + langSuffix;
    }

    function getVoiceProfile(npc, character) {
        var key = getVoiceProfileKey(npc, character);
        return VOICE_PROFILES[key];
    }

    function setVolume(newVolume) {
        volume = Math.max(0, Math.min(1, newVolume));
        saveSettings();
    }

    function toggleMute() {
        muted = !muted;
        saveSettings();
        return muted;
    }

    function cycleVolume() {
        var levels = [0.25, 0.5, 0.75, 1.0];
        var currentIndex = levels.indexOf(volume);
        var nextIndex = (currentIndex === -1 ? 3 : (currentIndex + 1) % 4);
        volume = levels[nextIndex];
        saveSettings();
        return volume;
    }

    function typewriter(text, element, callback, speed) {
        speed = speed || 30;
        var i = 0;
        var len = text.length;
        element.textContent = '';

        function type() {
            if (i < len) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) { callback(); }
            }
        }
        type();
    }

    if (global.speechSynthesis) {
        global.speechSynthesis.onvoiceschanged = loadVoices;
        setTimeout(loadVoices, 500);
    }

    loadSettings();
    loadVoices();

    global.TDAudioService = {
        speak: speak,
        stopSpeaking: stopSpeaking,
        startListening: startListening,
        stopListening: stopListening,
        getMatchedVoice: getMatchedVoice,
        getVoiceProfile: getVoiceProfile,
        getVoiceProfileKey: getVoiceProfileKey,
        setLanguage: setLanguage,
        getThemeMusic: getThemeMusic,
        setMusicPhase: setMusicPhase,
        getMusicForPhase: getMusicForPhase,
        getCurrentMusicPhase: getCurrentMusicPhase,
         playThemeMusic: playThemeMusic,
        setCurrentTheme: setCurrentTheme,
        playTypingSound: playTypingSound,
        toggleTypingSound: toggleTypingSound,
        stopTypingSound: stopTypingSound,
        setVolume: setVolume,
        toggleMute: toggleMute,
        cycleVolume: cycleVolume,
        typewriter: typewriter,
        VOICE_PROFILES: VOICE_PROFILES,
        THEME_MUSIC: THEME_MUSIC,
        MUSIC_PHASES: MUSIC_PHASES,
        MUSIC_PHASE_TRACKS: MUSIC_PHASE_TRACKS,
        MUSIC_PHASE_PROMPTS: MUSIC_PHASE_PROMPTS,
        get isSpeaking() { return isSpeaking; },
        get isListening() { return isListening; },
        get volume() { return volume; },
        get muted() { return muted; },
        get typingSound() { return typingSoundEnabled; },
    };
})(typeof window !== 'undefined' ? window : global);
