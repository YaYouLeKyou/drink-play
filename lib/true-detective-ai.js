var AIClient = require('./ai-client');

function extractJSON(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Empty or non-string response from AI');
    }

    var cleaned = text.trim();

    var fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch) {
        cleaned = fenceMatch[1].trim();
    }

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        var start = cleaned.indexOf('{');
        var end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            var jsonStr = cleaned.substring(start, end + 1);
            try {
                return JSON.parse(jsonStr);
            } catch (e2) {
                throw new Error('Failed to parse JSON. Attempted substring extract. Error: ' + e2.message);
            }
        }
        throw new Error('Failed to parse JSON from AI response. First 200 chars: ' + cleaned.substring(0, 200));
    }
}

var THEME_MUSIC_PROMPTS = {
    'agatha-christie': 'Dark chamber classical, eerie piano solo, suspenseful cello, vintage rain sound effects, gothic mystery, subtle clock ticking, dramatic minor key, instrumental',
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

var REVELATION_MUSIC = 'Fast cinematic thriller, intense rhythmic percussion, rising tension, dramatic hybrid orchestral, dark synth pulses, high stakes climax, 120bpm, instrumental';

var MASTER_SCRIPT_PROMPT = 'You are the master narrator of an interactive detective game. The player chooses a universe/theme and you generate a COMPLETE investigation script.\n\nYou create a rich, coherent mystery structured across 3 acts. The investigation follows this exact scene-by-scene structure:\n\n- Act 1 (6 scenes): 3 investigation scenes + 3 interrogation scenes\n- Act 2 (6 scenes): 3 puzzle scenes + 3 investigation scenes\n- Act 3 (7 scenes): 3 tension scenes + 3 revelation scenes + 1 credits scene\n\nTotal: 19 scenes across all acts (minimum 30min gameplay).\n\nEach scene has a TYPE and a clear OBJECTIVE:\n- investigation: Player examines the environment. Objective: find a specific clue or piece of information.\n- interrogation: Player questions an NPC. Objective: extract a key piece of information or confession.\n- puzzle: Player solves a logic puzzle or riddle. Objective: solve the riddle to unlock a clue.\n- tension: Suspenseful moment requiring a quick decision. Objective: survive a dangerous encounter.\n- revelation: Major plot twist revealed. No choices, just a "Continue" button.\n- credits: The final scene showing the solution and ending.\n\nEach scene also has:\n- A MUSIC PHASE: investigation, interrogation, puzzle, tension, revelation, or credits\n- A LOCATION, DIALOGUE, CHOICES (2-3 options), and optionally a CLUE\n\nThe music evolves as the story progresses:\n- Investigation + Interrogation + Puzzle scenes use the theme-specific base music\n- Tension + Revelation scenes use the revelation/climax music (fast, intense)\n- Credits scene uses a slow, conclusive outro\n\nYou create 3-5 NPCs with distinct personalities, secrets, and alibis.\nYou plant 2-3 plot twists and 1-2 subplots.\nThe player makes choices that influence the investigation.\n\nOutput STRICT JSON. No markdown fences. No extra text. Use this exact structure:\n{\n  "title": "string",\n  "theme": "string",\n  "language": "string",\n  "music": "string (the theme-specific music prompt)",\n  "acts": [\n    {\n      "setting": "string",\n      "musicPhase": "investigation | interrogation | puzzle | tension | revelation | credits",\n      "scenes": [\n        {\n          "location": "string",\n          "npcId": "string|null",\n          "type": "investigation | interrogation | puzzle | tension | revelation | credits",\n          "objective": "string",\n          "dialogue": "string",\n          "choices": ["string","string"],\n          "clue": "string|null"\n        }\n      ]\n    }\n  ],\n  "plotTwists": ["string"],\n  "subplots": ["string"],\n  "npcs": [{ "id": "string", "name": "string", "role": "string", "personality": "string", "archetype": "detective|suspect_rich|femme_fatale|informant|scientist|bodyguard|criminal|outsider", "secrets": ["string"], "alibis": ["string"], "imagePrompt": "string", "voiceHint": "string" }],\n  "solution": { "culprit": "string", "motive": "string", "method": "string", "revealed": "string" }\n}\n\nEnsure: 3 acts with exactly the scene counts above, coherent narrative, NPCs with archetypes, plot twists, subplots, and a solution. Minimum 30min gameplay (19+ scenes).';

var ADVANCE_PROMPT = 'You are the master narrator of an interactive detective game. Continue the investigation story in a way that is coherent with the master script provided.\n\nYou receive:\n- The full master script (acts, scenes, NPCs, twists, subplots, solution, music prompts)\n- The current game state (current act, current scene index, player choices so far, clues discovered)\n- The player\'s latest choice\n\nYour job:\n- Determine which scene comes next based on the master script structure and player\'s choice\n- Follow the scene type (investigation/interrogation/puzzle/tension/revelation/credits) and objective from the script\n- Write the NPC dialogue or narration for that scene (if an NPC is present)\n- Provide 2-3 new player choice options (or none if it is a revelation/credits scene)\n- Note any clue discovered\n- Note any subtle event or environmental detail\n- Signal if the story should transition to the next act\n- If the investigation has reached the end (after Act 3, scene N), reveal the solution\n- Set the correct musicPhase for this scene\n\nOutput STRICT JSON:\n{\n  "dialogue": "string",\n  "location": "string",\n  "npcId": "string|null",\n  "type": "investigation | interrogation | puzzle | tension | revelation | credits",\n  "objective": "string",\n  "choices": ["string","string","string"],\n  "clue": "string|null",\n  "event": "string|null",\n  "nextActTransition": "string|null",\n  "musicPhase": "investigation | interrogation | puzzle | tension | revelation | credits",\n  "gameComplete": false,\n  "solution": { "culprit": "string", "motive": "string", "method": "string", "revealed": "string" }\n}\n\nIf gameComplete is true, fill the solution object. Otherwise solution should be null. For revelation and credits scenes, return an empty choices array.';

var NPC_RESPONSE_PROMPT = 'You are role-playing a character in an interactive detective game. Respond as the NPC based on their personality, secrets, and current relationship with the player.\n\nThe NPC may choose to:\n- Answer truthfully (especially if friendly or cornered)\n- Deflect, lie, or change the subject (especially if hiding something)\n- Reveal a clue reluctantly\n- Become suspicious of the player\'s line of questioning\n\nOutput STRICT JSON:\n{\n  "response": "string",\n  "emotion": "string",\n  "revealClue": "string|null"\n}\nemotion must be one of: neutral, friendly, suspicious, angry, evasive, nervous, relieved, sad.';

var MUSIC_PROMPTS = {
    investigation: 'Dark ambient cinematic, slow tension build, mysterious pad synth, subtle electronic undertones, detective mood',
    interrogation: 'Slow noir jazz, muted trumpet, tense piano chords, psychological pressure, whispered suspicions',
    puzzle: 'Ethereal mystery, cryptic tones, puzzle-solving ambiance, rising curiosity, cerebral tension',
    tension: REVELATION_MUSIC,
    revelation: REVELATION_MUSIC,
    credits: 'Slow cinematic outro, melancholic piano, gentle strings, resolution and closure, reflective mood',
};

function buildMusicPrompt(themeId, musicPhase) {
    if (musicPhase === 'tension' || musicPhase === 'revelation') {
        return REVELATION_MUSIC;
    }
    if (musicPhase === 'credits') {
        return MUSIC_PROMPTS.credits;
    }
    var base = THEME_MUSIC_PROMPTS[themeId] || THEME_MUSIC_PROMPTS['film-noir'];
    var phase = MUSIC_PROMPTS[musicPhase] || '';
    return base + (phase ? '. Phase: ' + phase : '');
}

function buildMusicPromptForImage(themeId, musicPhase) {
    var base = THEME_MUSIC_PROMPTS[themeId] || THEME_MUSIC_PROMPTS['film-noir'];
    var phaseAdj = '';
    if (musicPhase === 'tension' || musicPhase === 'revelation') {
        phaseAdj = ', intense dramatic lighting, rising tension, dark shadows';
    } else if (musicPhase === 'credits') {
        phaseAdj = ', melancholic, reflective atmosphere, warm golden hour light';
    } else if (musicPhase === 'interrogation') {
        phaseAdj = ', dim lighting, questioning atmosphere, shadow play';
    } else if (musicPhase === 'puzzle') {
        phaseAdj = ', mysterious, cerebral atmosphere, cryptic symbols';
    }
    return base + phaseAdj;
}

var SCENE_TYPE_OBJECTIVES = {
    investigation: [
        'Search the scene for hidden clues about the crime.',
        'Look for physical evidence or suspicious items.',
        'Examine the environment for inconsistencies.',
    ],
    interrogation: [
        'Get the NPC to reveal information about the crime.',
        'Press the NPC for details about their alibi.',
        'Find contradictions in the NPC\'s story.',
    ],
    puzzle: [
        'Solve this logic puzzle to unlock a new clue.',
        'Decode the cipher to reveal hidden information.',
        'Match the clues to identify the culprit.',
    ],
    tension: [
        'Make a quick decision under pressure.',
        'Escape from a dangerous situation.',
        'Avoid being discovered by the culprit.',
    ],
    revelation: [
        'A major plot twist is about to be revealed.',
    ],
    credits: [
        'The truth is finally revealed.',
    ],
};

var SCENE_TYPE_CHOICES = {
    investigation: ['Search thoroughly', 'Check nearby objects', 'Question witnesses'],
    interrogation: ['Press about alibi', 'Ask about the crime', 'Challenge inconsistencies'],
    puzzle: ['Try solution A', 'Try solution B', 'Request a hint'],
    tension: ['Confront directly', 'Sneak away quietly', 'Call for backup'],
};

class TrueDetectiveAI {
    constructor(aiClient) {
        this.aiClient = aiClient;
    }

    async generateMasterScript(context) {
        context = context || {};
        var theme = context.theme || 'film-noir';
        var language = context.language || 'en';

        var themeLabels = {
            'agatha-christie': 'Agatha Christie (classic country house mystery)',
            'sherlock-holmes': 'Sherlock Holmes (Victorian London detective)',
            'film-noir': 'Film Noir (dark city, trench coat, femme fatale)',
            'cyberpunk': 'Cyberpunk (neo-Tokyo dystopia, corporate conspiracy)',
            'heroic-fantasy': 'Heroic Fantasy (medieval castle, knights, magic)',
            'sci-fi': 'Sci-Fi (space station, alien mystery)',
            'lovecraftian': 'Lovecraftian (cosmic horror, ancient entities)',
            'antiquite': 'Antiquité (ancient Rome/Greece, political intrigue)',
            'pirate': 'Pirate (Caribbean piracy, shipboard mystery)',
            'western': 'Far West (wild west saloon, frontier justice)',
            'steampunk': 'Steampunk (steam-powered industrial revolution)',
            'post-apoc': 'Post-Apocalypse (wasteland ruins, survival mystery)',
            'kaiju': 'Kaiju (urban monster disaster, emergency investigation)',
            'psychological': 'Psychological (70s thriller, paranoia, unreliable narrator)',
            'spy': 'Espionnage (Cold War spy thriller, espionage)',
            'paranormal': 'Paranormal (ghost hunting, supernatural mystery)',
            'cyber-horror': 'Cyber-Horror (AI dystopia, digital horror)',
        };

        var themeLabel = themeLabels[theme] || theme;
        var musicPrompt = THEME_MUSIC_PROMPTS[theme] || THEME_MUSIC_PROMPTS['film-noir'];

        var userPrompt = 'Generate a complete interactive detective investigation script.\n' +
            'Theme: ' + themeLabel + '\n' +
            'Language: ' + language + '\n' +
            'Music prompt (for the game soundtrack): ' + musicPrompt + '\n' +
            'The story must have exactly 3 acts with 19 scenes total:\n' +
            '- Act 1: 3 investigation + 3 interrogation scenes\n' +
            '- Act 2: 3 puzzle + 3 investigation scenes\n' +
            '- Act 3: 3 tension + 3 revelation + 1 credits scene\n' +
            'Each scene must have a type and an objective. Use the revelation/climax music for tension and revelation scenes. Output STRICT JSON only.';

        var messages = [
            { role: 'system', content: MASTER_SCRIPT_PROMPT },
            { role: 'user', content: userPrompt },
        ];

        try {
            var result = await this.aiClient.chat(messages);
            var script = extractJSON(result.message);

            if (!script.acts && (script.act1 || script.act2 || script.act3)) {
                script.acts = [
                    { setting: script.act1 ? script.act1.setting : '', musicPhase: 'investigation', scenes: script.act1 ? script.act1.scenes : [] },
                    { setting: script.act2 ? script.act2.setting : '', musicPhase: 'puzzle', scenes: script.act2 ? script.act2.scenes : [] },
                    { setting: script.act3 ? script.act3.setting : '', musicPhase: 'revelation', scenes: script.act3 ? script.act3.scenes : [] },
                ];
                delete script.act1;
                delete script.act2;
                delete script.act3;
            }

            script.music = script.music || musicPrompt;

            return {
                source: 'ai',
                model: result.model,
                script: script,
            };
        } catch (error) {
            console.error('[TrueDetectiveAI] Master script generation failed:', error.message);
            return {
                source: 'fallback',
                script: null,
                error: error.message,
            };
        }
    }

    async advanceStory(state) {
        state = state || {};
        var currentAct = state.currentAct || 1;
        var currentSceneIndex = state.currentSceneIndex || 0;
        var playerChoices = state.playerChoices || [];
        var discoveredClues = state.discoveredClues || [];
        var script = state.script;
        var language = state.language || 'en';

        if (!script) {
            throw new Error('No master script provided in state');
        }

        var actKey = 'act' + currentAct;
        var acts = script.acts || [];
        var currentActData = acts[currentAct - 1] || script[actKey];
        var scenes = currentActData ? currentActData.scenes : [];

        var sceneIndex = Math.min(currentSceneIndex, scenes.length - 1);
        var currentScene = sceneIndex >= 0 ? scenes[sceneIndex] : null;
        var latestChoice = playerChoices[playerChoices.length - 1] || '';
        var choicesHistory = playerChoices.join(' | ');
        var cluesText = discoveredClues.join(' | ') || 'none yet';

        var currentMusicPrompt = '';
        if (currentScene && currentScene.type) {
            currentMusicPrompt = buildMusicPrompt(script.theme || 'film-noir', currentScene.type);
        }

        var userPrompt = 'Continue the interactive detective story.\n\n' +
            'MASTER SCRIPT (JSON):\n' + JSON.stringify(script, null, 2) + '\n\n' +
            'CURRENT STATE:\n' +
            '- Act: ' + currentAct + '\n' +
            '- Scene index: ' + sceneIndex + '\n' +
            '- Latest player choice: "' + latestChoice + '"\n' +
            '- All choices so far: ' + choicesHistory + '\n' +
            '- Clues discovered: ' + cluesText + '\n' +
            '- Language: ' + language + '\n' +
            '- Current music prompt: ' + currentMusicPrompt + '\n\n' +
            'Current scene data: ' + JSON.stringify(currentScene, null, 2) + '\n\n' +
            'Based on the player\'s latest choice and the master script, determine what happens next.\n' +
            'Follow the scene type and objective from the master script structure.\n' +
            'If the current scene is the last in the act, transition to the next act.\n' +
            'If this is the end of Act 3 (the last scene of the last act), set gameComplete to true and fill the solution.\n\n' +
            'Output STRICT JSON with scene type, objective, and music phase fields.';

        var messages = [
            { role: 'system', content: ADVANCE_PROMPT },
            { role: 'user', content: userPrompt },
        ];

        try {
            var result = await this.aiClient.chat(messages);
            var data = extractJSON(result.message);

            if (!data.type && currentScene && currentScene.type) {
                data.type = currentScene.type;
            }
            if (!data.objective && currentScene && currentScene.objective) {
                data.objective = currentScene.objective;
            }
            if (!data.musicPhase && data.type) {
                data.musicPhase = data.type;
            }

            return {
                source: 'ai',
                model: result.model,
                data: data,
            };
        } catch (error) {
            console.error('[TrueDetectiveAI] Advance story failed:', error.message);
            return {
                source: 'fallback',
                data: null,
                error: error.message,
            };
        }
    }

    async generateNPCResponse(state, npcId, playerText) {
        state = state || {};
        var script = state.script;
        var language = state.language || 'en';

        if (!script) {
            throw new Error('No master script provided in state');
        }

        var npcs = script.npcs || [];
        var npc = npcs.find(function (n) { return n.id === npcId; });

        if (!npc) {
            throw new Error('NPC with id "' + npcId + '" not found in script');
        }

        var userPrompt = 'You are role-playing ' + npc.name + ' in an interactive detective game.\n\n' +
            'Character details:\n' +
            '- Role: ' + npc.role + '\n' +
            '- Personality: ' + npc.personality + '\n' +
            '- Archetype: ' + (npc.archetype || 'unknown') + '\n' +
            '- Secrets: ' + JSON.stringify(npc.secrets || []) + '\n' +
            '- Alibis: ' + JSON.stringify(npc.alibis || []) + '\n\n' +
            'The player (the detective) just said: "' + playerText + '"\n\n' +
            'Respond as this character. You may answer truthfully, deflect, lie, reveal a clue reluctantly, or become suspicious.\n' +
            'Language: ' + language + '.\n\n' +
            'Output STRICT JSON with response, emotion, and revealClue fields.';

        var messages = [
            { role: 'system', content: NPC_RESPONSE_PROMPT },
            { role: 'user', content: userPrompt },
        ];

        try {
            var result = await this.aiClient.chat(messages);
            var data = extractJSON(result.message);
            return {
                source: 'ai',
                model: result.model,
                data: data,
            };
        } catch (error) {
            console.error('[TrueDetectiveAI] NPC response failed:', error.message);
            return {
                source: 'fallback',
                data: null,
                error: error.message,
            };
        }
    }
}

module.exports = {
    TrueDetectiveAI: TrueDetectiveAI,
    extractJSON: extractJSON,
    buildMusicPrompt: buildMusicPrompt,
    buildMusicPromptForImage: buildMusicPromptForImage,
    THEME_MUSIC_PROMPTS: THEME_MUSIC_PROMPTS,
    REVELATION_MUSIC: REVELATION_MUSIC,
    MUSIC_PROMPTS: MUSIC_PROMPTS,
    SCENE_TYPE_OBJECTIVES: SCENE_TYPE_OBJECTIVES,
    SCENE_TYPE_CHOICES: SCENE_TYPE_CHOICES,
};
