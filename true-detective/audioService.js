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
        'agatha-christie': 'Ancient Roman cinematic ambient, mysterious lyre melody, deep war drums, dark desert wind, suspenseful tribal strings, instrumental',
        'sherlock-holmes': 'Dark Victorian orchestral, tense violin solo, foggy London atmosphere, melancholic harpsichord, cinematic suspense, slow crescendo, instrumental',
        'film-noir': 'Dark jazz noir, muted trumpet solo, slow brushed drums, moody upright bass, smoky room vibe, melancholic sax, rainy street ambience, instrumental',
        'cyberpunk': 'Cyberpunk synthwave, dark synth, industrial beat, neon noir, heavy distorted bass, futuristic suspense, tempo 90bpm, blade runner style, instrumental',
        'heroic-fantasy': 'Dark fantasy orchestral, ambient harp, deep choir chants, mysterious flute, dungeon tension, cinematic epic suspense, low horns, instrumental',
        'sci-fi': 'Sci-fi dark ambient, cosmic synth drone, pulse bass, eerie space atmosphere, alien mystery, subtle electronic bleeps, cinematic suspense, instrumental',
        'lovecraftian': 'Dark ambient horror, eerie dissonance, haunting soundscapes, low brass drone, psychological thriller, disturbing textures, slow building dread, instrumental',
        'antiquite': 'Ancient Roman cinematic ambient, mysterious lyre melody, deep war drums, dark desert wind, suspenseful tribal strings, instrumental',
        'pirate': 'Dark pirate ambient, eerie accordion solo, creaking ship wood, stormy ocean ambience, suspenseful cello, instrumental',
        'western': 'Dark western ambient, lonely electric guitar, whistle in the wind, slow acoustic blues, tense cinematic suspense, instrumental',
        'steampunk': 'Dark steampunk ambient, ticking clockwork, heavy steam hiss, low brass drone, suspenseful Victorian industrial, instrumental',
        'post-apoc': 'Dark post-apocalyptic ambient, industrial drone, metallic scraping sounds, low synth pulse, desolate tension, instrumental',
        'kaiju': 'Dark cinematic monster suspense, heavy orchestral brass, sirens in distance, low sub bass rumble, high stakes tension, instrumental',
        'psychological': '70s psychological thriller ambient, eerie analog synth, slow electric bass, tense tape delay, subtle vinyl crackle, instrumental',
        'spy': 'Dark Cold War spy thriller, suspenseful synth bass, minimalist piano, teletype sounds, subtle tension, instrumental',
        'paranormal': '90s horror synth, eerie EMF static, haunting pad synth, slow creepy music box, dark suspense, instrumental',
        'cyber-horror': 'Dark cyber horror, glitch ambient, distorted synth drone, creepy digital static, deep dark electronic tension, instrumental',
    };

    var VOICE_PROFILES = {
        'detective': { name: 'Detective', lang: 'en-US', pitch: 0.9, rate: 0.95, gender: 'male', hint: 'david|alex|daniel|mark|james|en-US|male' },
        'sherlock': { name: 'Sherlock', lang: 'en-GB', pitch: 0.85, rate: 0.9, gender: 'male', hint: 'daniel|oliver|en-GB|male' },
        'suspect_rich': { name: 'Wealthy Suspect', lang: 'en-US', pitch: 0.8, rate: 0.9, gender: 'male', hint: 'mark|james|en-US|male' },
        'femme_fatale': { name: 'Femme Fatale', lang: 'en-US', pitch: 0.65, rate: 0.8, gender: 'female', hint: 'karen|samantha|victoria|en-US|female' },
        'informant': { name: 'Nervous Informant', lang: 'en-US', pitch: 1.3, rate: 1.15, gender: 'female', hint: 'karen|samantha|victoria|en-US|female' },
        'scientist': { name: 'Scientist', lang: 'en-GB', pitch: 1.0, rate: 1.0, gender: 'male', hint: 'daniel|oliver|en-GB|male' },
        'bodyguard': { name: 'Bodyguard', lang: 'en-US', pitch: 0.7, rate: 0.85, gender: 'male', hint: 'david|alex|en-US|male' },
        'criminal': { name: 'Criminal Mind', lang: 'en-US', pitch: 0.6, rate: 0.85, gender: 'male', hint: 'james|mark|en-US|male' },
        'outsider': { name: 'Unhinged Outsider', lang: 'en-US', pitch: 1.2, rate: 1.1, gender: 'male', hint: 'alex|david|en-US|male' },
        'narrator': { name: 'Morgan Freeman-style', lang: 'en-US', pitch: 0.62, rate: 0.82, gender: 'male', hint: 'david|alex|en-US|male' },
        'narrator_fr': { name: 'Narrateur (FR)', lang: 'fr-FR', pitch: 0.65, rate: 0.8, gender: 'male', hint: 'françois|pascal|cyprien|en-FR|male' },
        'femme_fatale_fr': { name: 'Femme Fatale (FR)', lang: 'fr-FR', pitch: 0.68, rate: 0.82, gender: 'female', hint: 'samantha|victoria|françoise|en-FR|female|audrey' },
        'suspect_rich_fr': { name: 'Suspect Aisé (FR)', lang: 'fr-FR', pitch: 0.78, rate: 0.85, gender: 'male', hint: 'françois|pascal|en-FR|male' },
        'informant_fr': { name: 'Informateur Nerv.e (FR)', lang: 'fr-FR', pitch: 1.25, rate: 1.1, gender: 'female', hint: 'audrey|victoria|samantha|françoise|en-FR|female' },
        'scientist_fr': { name: 'Scientifique (FR)', lang: 'fr-FR', pitch: 0.95, rate: 0.95, gender: 'male', hint: 'françois|pascal|cyprien|en-FR|male' },
        'bodyguard_fr': { name: 'Protecteur (FR)', lang: 'fr-FR', pitch: 0.72, rate: 0.85, gender: 'male', hint: 'pascal|françois|en-FR|male' },
        'criminal_fr': { name: 'Criminel (FR)', lang: 'fr-FR', pitch: 0.62, rate: 0.85, gender: 'male', hint: 'cyprien|pascal|en-FR|male' },
        'outsider_fr': { name: 'Marginal (FR)', lang: 'fr-FR', pitch: 1.15, rate: 1.05, gender: 'male', hint: 'cyprien|pascal|en-FR|male' },
        'detective_fr': { name: 'Détective (FR)', lang: 'fr-FR', pitch: 0.88, rate: 0.92, gender: 'male', hint: 'françois|pascal|en-FR|male' },
    };

    var NARRATOR_VOICES_EN = ['david', 'alex', 'zarvox', 'fred'];
    var NARRATOR_VOICES_FR = ['françois', 'pascal', 'cyprien'];
    var currentLanguage = 'en';

    var MUSIC_PHASES = {
        investigation: { label: 'Investigation', intensity: 'low', tempo: 70 },
        interrogation: { label: 'Interrogation', intensity: 'medium', tempo: 80 },
        puzzle: { label: 'Puzzle', intensity: 'medium-low', tempo: 75 },
        tension: { label: 'Tension', intensity: 'high', tempo: 120 },
        revelation: { label: 'Revelation', intensity: 'high', tempo: 120 },
        credits: { label: 'Credits', intensity: 'low', tempo: 60 },
    };

    var MUSIC_PHASE_PROMPTS = {
        investigation: 'Dark ambient cinematic, slow tension build, mysterious pad synth, subtle electronic undertones, detective mood',
        interrogation: 'Slow noir jazz, muted trumpet, tense piano chords, psychological pressure, whispered suspicions',
        puzzle: 'Ethereal mystery, cryptic tones, puzzle-solving ambiance, rising curiosity, cerebral tension',
        tension: 'Fast cinematic thriller, intense rhythmic percussion, rising tension, dramatic hybrid orchestral, dark synth pulses, high stakes climax, 120bpm, instrumental',
        revelation: 'Fast cinematic thriller, intense rhythmic percussion, rising tension, dramatic hybrid orchestral, dark synth pulses, high stakes climax, 120bpm, instrumental',
        credits: 'Slow cinematic outro, melancholic piano, gentle strings, resolution and closure, reflective mood',
    };

    var MUSIC_PHASE_TRACKS = {
        investigation: 'recherche.mp3',
        interrogation: 'mystere flipant.mp3',
        puzzle: 'enigme.mp3',
        tension: 'stress.mp3',
        revelation: 'Act III Revelations.mp3',
        credits: 'generique.mp3',
    };

    var THEME_MUSIC_TRACKS = {
        'agatha-christie': 'noire.mp3',
        'sherlock-holmes': 'sherlock.mp3',
        'film-noir': 'noire.mp3',
        'cyberpunk': 'cyberpunk.mp3',
        'heroic-fantasy': 'heroic fantasy.mp3',
        'sci-fi': 'SF.mp3',
        'lovecraftian': 'cyberpunk.mp3',
        'antiquite': 'noire.mp3',
        'pirate': 'noire.mp3',
        'western': 'noire.mp3',
        'steampunk': 'cyberpunk.mp3',
        'post-apoc': 'cyberpunk.mp3',
        'kaiju': 'cyberpunk.mp3',
        'psychological': 'noire.mp3',
        'spy': 'cyberpunk.mp3',
        'paranormal': 'cyberpunk.mp3',
        'cyber-horror': 'cyberpunk.mp3',
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

    function speak(text, profileId) {
        if (!text || !global.speechSynthesis || isSpeaking) {
            return false;
        }

        var cleanText = String(text).replace(/\s+/g, ' ').trim();
        if (!cleanText) { return false; }

        var profile = VOICE_PROFILES[profileId] || VOICE_PROFILES['narrator'];

        return new Promise(function (resolve) {
            ensureVoices(function () {
                if (muted) { resolve(); return; }

                global.speechSynthesis.cancel();
                isSpeaking = true;

                var utterance = new global.SpeechSynthesisUtterance(cleanText);
                utterance.lang = profile.lang;
                utterance.voice = getMatchedVoice(profileId) || selectedVoice || null;
                utterance.rate = profile.rate;
                utterance.pitch = profile.pitch;
                utterance.volume = volume;

                utterance.onend = function () {
                    isSpeaking = false;
                    saveSettings();
                    resolve();
                };
                utterance.onerror = function () {
                    isSpeaking = false;
                    resolve();
                };

                global.speechSynthesis.speak(utterance);
            });
        });
    }

    function stopSpeaking() {
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
        return THEME_MUSIC[themeId] || THEME_MUSIC['film-noir'];
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
        var track = THEME_MUSIC_TRACKS[themeId] || MUSIC_PHASE_TRACKS.investigation;
        if (typeof window !== 'undefined' && window.DPMusicPlayer) {
            window.DPMusicPlayer.playTrack(track);
        }
        return track;
    }

    function getMusicForPhase(themeId, musicPhase) {
        var base = THEME_MUSIC[themeId] || THEME_MUSIC['film-noir'];
        var phasePrompt = MUSIC_PHASE_PROMPTS[musicPhase] || MUSIC_PHASE_PROMPTS.investigation;
        return phasePrompt + (base ? ' Base theme: ' + base.substring(0, 80) : '');
    }

    function getCurrentMusicPhase() {
        return currentMusicPhase;
    }

    function getVoiceProfileKey(npc, character) {
        var langSuffix = currentLanguage === 'fr' ? '_fr' : '';
        if (npc && npc.voiceHint) {
            var hint = npc.voiceHint.toLowerCase();
            var matchedKey = Object.keys(VOICE_PROFILES).find(function (key) {
                if (key.indexOf('_fr') !== -1 && langSuffix !== '_fr') { return false; }
                return hint.indexOf(key.replace('_fr', '')) !== -1;
            });
            if (matchedKey) { return matchedKey; }
        }
        var baseKey = 'narrator';
        if (npc && npc.role) {
            var role = npc.role.toLowerCase();
            if (role.indexOf('detective') !== -1 || role.indexOf('partner') !== -1 || role.indexOf('investigator') !== -1) {
                baseKey = 'detective';
            } else if (role.indexOf('scientist') !== -1 || role.indexOf('legist') !== -1 || role.indexOf('expert') !== -1) {
                baseKey = 'scientist';
            } else if (role.indexOf('guard') !== -1 || role.indexOf('bodyguard') !== -1 || role.indexOf('enforcer') !== -1) {
                baseKey = 'bodyguard';
            } else if (role.indexOf('criminal') !== -1 || role.indexOf('mastermind') !== -1) {
                baseKey = 'criminal';
            } else if (role.indexOf('informant') !== -1 || role.indexOf('witness') !== -1 || role.indexOf('témoin') !== -1) {
                baseKey = 'informant';
            } else if (role.indexOf('outsider') !== -1 || role.indexOf('marginal') !== -1) {
                baseKey = 'outsider';
            } else if (role.indexOf('femme') !== -1 || role.indexOf('seduct') !== -1 || role.indexOf('rich') !== -1 || role.indexOf('noble') !== -1) {
                baseKey = 'femme_fatale';
            }
        }
        return baseKey + langSuffix;
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
