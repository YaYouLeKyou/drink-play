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

    var THEME_MUSIC = {
        'agatha-christie': 'sherlock.mp3',
        'sherlock-holmes': 'sherlock.mp3',
        'cyberpunk': 'cyberpunk.mp3',
        'heroic-fantasy': 'heroic fantasy.mp3',
        'sci-fi': 'SF.mp3',
        'lovecraftian': 'peur.mp3',
        'antiquite': 'gaginator.mp3',
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
        interrogation: 'mystere flipant.mp3',
        puzzle: 'enigme.mp3',
        tension: 'stress.mp3',
        revelation: 'Act III Revelations.mp3',
        credits: 'generique.mp3',
        intro: 'generique.mp3',
    };

    var THEME_MUSIC_TRACKS = {
        'agatha-christie': 'sherlock.mp3',
        'sherlock-holmes': 'sherlock.mp3',
        'cyberpunk': 'cyberpunk.mp3',
        'heroic-fantasy': 'heroic fantasy.mp3',
        'sci-fi': 'SF.mp3',
        'lovecraftian': 'peur.mp3',
        'antiquite': 'gaginator.mp3',
        'film-noir': 'noire.mp3',
    };

    var currentMusicPhase = null;

    function setLanguage(lang) {
        currentLanguage = lang || 'en';
        loadVoices();
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: volume, muted: muted }));
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
        } catch (e) {
            console.warn('[AudioService] Failed to load settings:', e.message);
        }
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
        return pool.find(function (v) { return hintRegex.test(v.name); }) || pool[0] || null;
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
        var track = THEME_MUSIC[themeId] || MUSIC_PHASE_TRACKS.investigation;
        if (typeof window !== 'undefined' && window.DPMusicPlayer) {
            window.DPMusicPlayer.playTrack(track);
        }
        return track;
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
        setVolume: setVolume,
        toggleMute: toggleMute,
        cycleVolume: cycleVolume,
        typewriter: typewriter,
        VOICE_PROFILES: VOICE_PROFILES,
        THEME_MUSIC: THEME_MUSIC,
        MUSIC_PHASES: MUSIC_PHASES,
        MUSIC_PHASE_PROMPTS: MUSIC_PHASE_PROMPTS,
        get isSpeaking() { return isSpeaking; },
        get isListening() { return isListening; },
        get volume() { return volume; },
        get muted() { return muted; },
    };
})(typeof window !== 'undefined' ? window : global);
