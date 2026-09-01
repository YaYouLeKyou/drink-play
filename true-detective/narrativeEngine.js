(function (global) {
    'use strict';

    var STORAGE_KEY = 'trueDetectiveState';
    var SESSION_KEY = 'trueDetectiveSession';
    var API_BASE = '/api/true-detective';

    var gameState = {
        sessionId: null,
        theme: null,
        script: null,
        language: 'en',
        currentAct: 1,
        currentSceneIndex: 0,
        playerChoices: [],
        discoveredClues: [],
        npcsEncountered: [],
        investigationSteps: [],
        currentNPC: null,
        conversationHistory: [],
        gameComplete: false,
        solution: null,
        lastSceneData: null,
    };

    var cache = new Map();

    function generateSessionId() {
        return 'td_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function loadGameState() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            var sessionRaw = localStorage.getItem(SESSION_KEY);
            if (raw) {
                var saved = JSON.parse(raw);
                gameState.sessionId = saved.sessionId || generateSessionId();
                gameState.theme = saved.theme || null;
                gameState.script = saved.script || null;
                gameState.language = saved.language || 'en';
                gameState.currentAct = saved.currentAct || 1;
                gameState.currentSceneIndex = saved.currentSceneIndex || 0;
                gameState.playerChoices = saved.playerChoices || [];
                gameState.discoveredClues = saved.discoveredClues || [];
                gameState.npcsEncountered = saved.npcsEncountered || [];
                gameState.investigationSteps = saved.investigationSteps || [];
                gameState.currentNPC = saved.currentNPC || null;
                gameState.conversationHistory = saved.conversationHistory || [];
                gameState.gameComplete = saved.gameComplete || false;
                gameState.solution = saved.solution || null;
                gameState.lastSceneData = saved.lastSceneData || null;
                return true;
            }
        } catch (e) {
            console.warn('[TrueDetective] Failed to load saved game:', e.message);
        }
        return false;
    }

    function saveGameState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                sessionId: gameState.sessionId,
                theme: gameState.theme,
                script: gameState.script,
                language: gameState.language,
                currentAct: gameState.currentAct,
                currentSceneIndex: gameState.currentSceneIndex,
                playerChoices: gameState.playerChoices,
                discoveredClues: gameState.discoveredClues,
                npcsEncountered: gameState.npcsEncountered,
                investigationSteps: gameState.investigationSteps,
                currentNPC: gameState.currentNPC,
                conversationHistory: gameState.conversationHistory,
                gameComplete: gameState.gameComplete,
                solution: gameState.solution,
                lastSceneData: gameState.lastSceneData,
            }));
        } catch (e) {
            console.warn('[TrueDetective] Failed to save game:', e.message);
        }
    }

    function clearGameState() {
        gameState = {
            sessionId: generateSessionId(),
            theme: null,
            script: null,
            language: 'en',
            currentAct: 1,
            currentSceneIndex: 0,
            playerChoices: [],
            discoveredClues: [],
            npcsEncountered: [],
            investigationSteps: [],
            currentNPC: null,
            conversationHistory: [],
            gameComplete: false,
            solution: null,
            lastSceneData: null,
        };
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.warn('[TrueDetective] Failed to clear game:', e.message);
        }
    }

    function fetchWithTimeout(url, options, timeout) {
        timeout = timeout || 15000;
        var controller = new AbortController();
        var timeoutId = setTimeout(function () {
            controller.abort();
        }, timeout);

        return fetch(url, Object.assign({ signal: controller.signal }, options))
            .then(function (response) {
                clearTimeout(timeoutId);
                return response;
            })
            .catch(function (e) {
                clearTimeout(timeoutId);
                throw e;
            });
    }

    async function createInvestigation(theme, language) {
        theme = theme || 'film-noir';
        language = language || 'en';

        clearGameState();
        gameState.sessionId = generateSessionId();
        gameState.theme = theme;
        gameState.language = language;

        saveGameState();

        var cacheKey = 'master:' + theme + ':' + language;
        if (cache.has(cacheKey)) {
            var cached = cache.get(cacheKey);
            gameState.script = cached;
            gameState.npcsEncountered = cached.npcs.map(function (n) { return n.id; });
            saveGameState();
            return cached;
        }

        try {
            var response = await fetchWithTimeout(API_BASE + '/master-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: theme, language: language }),
            }, 25000);

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            var data = await response.json();

            if (data.source === 'ai' && data.script) {
                gameState.script = data.script;
                cache.set(cacheKey, data.script);
                gameState.npcsEncountered = data.script.npcs.map(function (n) { return n.id; });
                saveGameState();
                return data.script;
            }

            throw new Error(data.message || data.error || 'AI generation failed');
        } catch (error) {
            console.error('[TrueDetective] createInvestigation failed:', error.message);
            throw error;
        }
    }

    async function advanceGameState(playerChoice) {
        if (!gameState.script) {
            throw new Error('No investigation in progress');
        }

        gameState.playerChoices.push(playerChoice);
        saveGameState();

        var statePayload = {
            currentAct: gameState.currentAct,
            currentSceneIndex: gameState.currentSceneIndex,
            playerChoices: gameState.playerChoices,
            discoveredClues: gameState.discoveredClues,
            npcsEncountered: gameState.npcsEncountered,
            investigationSteps: gameState.investigationSteps,
            script: gameState.script,
            language: gameState.language,
        };

        var cacheKey = 'advance:' + gameState.sessionId + ':' + gameState.playerChoices.length;
        if (cache.has(cacheKey)) {
            var cached = cache.get(cacheKey);
            applyAdvanceResult(cached);
            return cached;
        }

        try {
            var response = await fetchWithTimeout(API_BASE + '/advance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: statePayload, language: gameState.language }),
            }, 25000);

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            var data = await response.json();

            if (data.source === 'ai' && data.data) {
                cache.set(cacheKey, data.data);
                applyAdvanceResult(data.data);
                return data.data;
            }

            throw new Error(data.message || data.error || 'AI advance failed');
        } catch (error) {
            console.error('[TrueDetective] advanceGameState failed:', error.message);
            throw error;
        }
    }

    function applyAdvanceResult(data) {
        if (data.gameComplete) {
            gameState.gameComplete = true;
            gameState.solution = data.solution || null;
        }

        gameState.lastSceneData = data;

        if (data.clue && data.clue !== 'null' && data.clue !== gameState.discoveredClues[gameState.discoveredClues.length - 1]) {
            gameState.discoveredClues.push(data.clue);
        }

        if (data.event && data.event !== 'null') {
            gameState.investigationSteps.push({ type: 'event', text: data.event });
        }

        if (data.nextActTransition && data.nextActTransition !== 'null') {
            if (gameState.currentAct < 3) {
                gameState.currentAct++;
                gameState.currentSceneIndex = 0;
                gameState.investigationSteps.push({ type: 'transition', text: data.nextActTransition });
            }
        } else {
            gameState.currentSceneIndex++;
        }

        if (data.npcId && (!gameState.npcsEncountered.includes(data.npcId))) {
            gameState.npcsEncountered.push(data.npcId);
        }

        if (data.npcId) {
            gameState.currentNPC = data.npcId;
        }

        gameState.investigationSteps.push({ type: 'choice', text: gameState.playerChoices[gameState.playerChoices.length - 1] || '' });

        saveGameState();
    }

    async function talkToNPC(npcId, playerText) {
        if (!gameState.script) {
            throw new Error('No investigation in progress');
        }

        var npc = gameState.script.npcs.find(function (n) { return n.id === npcId; });
        if (!npc) {
            throw new Error('NPC not found: ' + npcId);
        }

        gameState.currentNPC = npcId;
        gameState.conversationHistory.push({ role: 'player', text: playerText, npcId: npcId });
        saveGameState();

        var statePayload = {
            currentAct: gameState.currentAct,
            currentSceneIndex: gameState.currentSceneIndex,
            playerChoices: gameState.playerChoices,
            discoveredClues: gameState.discoveredClues,
            npcsEncountered: gameState.npcsEncountered,
            investigationSteps: gameState.investigationSteps,
            script: gameState.script,
            language: gameState.language,
        };

        try {
            var response = await fetchWithTimeout(API_BASE + '/npc-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: statePayload, npcId: npcId, playerText: playerText }),
            }, 20000);

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            var data = await response.json();

            if (data.source === 'ai' && data.data) {
                gameState.conversationHistory.push({ role: 'npc', text: data.data.response, npcId: npcId, emotion: data.data.emotion });
                saveGameState();

                if (data.data.revealClue && data.data.revealClue !== 'null') {
                    if (!gameState.discoveredClues.includes(data.data.revealClue)) {
                        gameState.discoveredClues.push(data.data.revealClue);
                        saveGameState();
                    }
                }

                return data.data;
            }

            throw new Error(data.message || data.error || 'AI response failed');
        } catch (error) {
            console.error('[TrueDetective] talkToNPC failed:', error.message);
            throw error;
        }
    }

    function addClue(clue) {
        if (!clue || clue === 'null' || clue === '') { return false; }
        if (gameState.discoveredClues.includes(clue)) { return false; }
        gameState.discoveredClues.push(clue);
        saveGameState();
        return true;
    }

    function addStep(type, text) {
        if (!text || text === 'null') { return; }
        gameState.investigationSteps.push({ type: type, text: text });
        saveGameState();
    }

    function getNPC(npcId) {
        if (!gameState.script) { return null; }
        return gameState.script.npcs.find(function (n) { return n.id === npcId; }) || null;
    }

    function getCurrentNPC() {
        return gameState.currentNPC ? getNPC(gameState.currentNPC) : null;
    }

    function hasSavedGame() {
        loadGameState();
        return !!gameState.script;
    }

    function resumeGame() {
        if (loadGameState()) {
            return gameState;
        }
        return null;
    }

    function resetGame() {
        clearGameState();
    }

    function getActsArray(script) {
        if (!script) { return []; }
        if (Array.isArray(script.acts) && script.acts.length) {
            return script.acts;
        }
        var legacy = [];
        if (script.act1 || script.act2 || script.act3) {
            legacy = [
                { setting: script.act1 ? script.act1.setting : '', musicPhase: 'investigation', scenes: script.act1 ? script.act1.scenes : [] },
                { setting: script.act2 ? script.act2.setting : '', musicPhase: 'puzzle', scenes: script.act2 ? script.act2.scenes : [] },
                { setting: script.act3 ? script.act3.setting : '', musicPhase: 'revelation', scenes: script.act3 ? script.act3.scenes : [] },
            ];
        }
        return legacy;
    }

    function getCurrentScene() {
        if (!gameState.script) { return null; }
        var acts = getActsArray(gameState.script);
        if (!acts.length) { return null; }
        var actData = acts[Math.max(0, Math.min(gameState.currentAct - 1, acts.length - 1))];
        if (!actData || !actData.scenes || !actData.scenes.length) { return null; }
        var sceneIndex = Math.min(gameState.currentSceneIndex, actData.scenes.length - 1);
        if (sceneIndex < 0) { return null; }
        return actData.scenes[sceneIndex];
    }

    function getSceneByActAndIndex(act, sceneIndex) {
        if (!gameState.script) { return null; }
        var acts = getActsArray(gameState.script);
        if (!acts.length) { return null; }
        var actData = acts[Math.max(0, Math.min(act - 1, acts.length - 1))];
        if (!actData || !actData.scenes || !actData.scenes.length) { return null; }
        var idx = Math.min(sceneIndex, actData.scenes.length - 1);
        if (idx < 0) { return null; }
        return actData.scenes[idx];
    }

    function getGameState() {
        return gameState;
    }

    function setLanguage(lang) {
        gameState.language = lang;
        saveGameState();
    }

    function clearCache() {
        cache.clear();
    }

    global.TDNarrativeEngine = {
        createInvestigation: createInvestigation,
        advanceGameState: advanceGameState,
        talkToNPC: talkToNPC,
        getNPC: getNPC,
        getCurrentNPC: getCurrentNPC,
        hasSavedGame: hasSavedGame,
        resumeGame: resumeGame,
        resetGame: resetGame,
        getGameState: getGameState,
        setLanguage: setLanguage,
        clearCache: clearCache,
        generateSessionId: generateSessionId,
        addClue: addClue,
        addStep: addStep,
        getActsArray: getActsArray,
        getCurrentScene: getCurrentScene,
        getSceneByActAndIndex: getSceneByActAndIndex,
        getLastSceneData: function () { return gameState.lastSceneData; },
    };
})(typeof window !== 'undefined' ? window : global);
