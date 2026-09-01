let gameContent = {};
let currentLanguage = 'en';

const questionText = document.getElementById('question-text');
const nextQuestionButton = document.getElementById('next-question');
const choicesContainer = document.getElementById('choices');
const doButton = document.getElementById('do-button');
const actionModal = document.getElementById('action-modal');
const actionText = document.getElementById('action-text');
const closeModalButton = document.getElementById('close-modal');
const modalContent = actionModal.querySelector('.modal-content');
const card = document.querySelector('.card');
const langMenuButton = document.getElementById('lang-menu-button');
const hostMuteButton = document.getElementById('host-mute-button');
const hostVolumeButton = document.getElementById('host-volume-button');
const hostVoiceSelect = document.getElementById('host-voice-select');
const hostTimerButton = document.getElementById('host-timer-button');
const hostResetButton = document.getElementById('host-reset-button');
const langModal = document.getElementById('lang-modal');
const closeLangModalButton = document.getElementById('close-lang-modal');
const playersDisplay = document.getElementById('players-display');
const playersList = document.getElementById('players-list');
const playerNameInput = document.getElementById('player-name-input');
const addPlayerBtn = document.getElementById('add-player-btn');
const welcomeOverlay = document.getElementById('welcome-overlay');
const welcomePlayerInput = document.getElementById('welcome-player-input');
const welcomeAddBtn = document.getElementById('welcome-add-btn');
const welcomePlayersList = document.getElementById('welcome-players-list');
const startGameBtn = document.getElementById('start-game-btn');

let lastQuestionIndex = -1;
let lastActionIndex = -1;
let lastSpicyQuestionIndex = -1;
let lastSpicyActionIndex = -1;

let isSpicy = false;
let questionCounter = 0;
let nextSpicy = Math.floor(Math.random() * 3) + 3;
let lastQuestionText = '';
let lastActionText = '';

let questionHistory = [];
let actionHistory = [];
let questionUsedSet = new Set();
let actionUsedSet = new Set();
let roundCounter = 1;
let totalClicks = 0;
let doClicks = 0;
let nextClicks = 0;
let aiChance = 0.35;
let currentNarrative = null;
let currentMostLikely = null;
let temporaryCardMessage = null;
let players = [];
let playersMode = 'solo';
let mood = 'balanced';
let moodPromptActive = false;
let lastMoodOfferRound = 0;
let moodButtons = [];
let learnedAll = {};

const AI_STATE_KEY = 'neverEverAIState';

const AI_TIMEOUT = 3500;

let hostEnabled = false;
let hostMuted = false;
let hostVolume = 1.0;
let currentHostPlayer = '';
let hostCommentsHistory = [];
let isSpeaking = false;
let userInteracted = false;
let welcomeSpoken = false;
let selectedVoice = null;
let questionTimer = null;
let questionTimerEnabled = true;
let questionTimerDuration = 60;
let questionTimerRemaining = 0;
let questionPressureLevel = 0;
let gameStarted = false;

function preloadVoices() {
    if (!window.speechSynthesis) return;
    const load = () => {
        const voices = window.speechSynthesis.getVoices();
        if (!selectedVoice && voices.length > 0) {
            let savedIndex = null;
            try {
                const raw = localStorage.getItem(AI_STATE_KEY);
                if (raw) {
                    const data = JSON.parse(raw);
                    if (typeof data.hostVoiceIndex === 'number' && voices[data.hostVoiceIndex]) {
                        savedIndex = data.hostVoiceIndex;
                    }
                }
            } catch (e) {}
            
            if (savedIndex !== null) {
                selectedVoice = voices[savedIndex];
            } else {
                const femaleCandidates = voices.filter(v => /female|woman|girl|samantha|victoria|karen|moira|fiona|veena|tessa|alice|emma|charlotte|nora|jessica|sophie|amelie|amelia|celine|lea|manon|emma/i.test(v.name));
                const sorted = [...femaleCandidates].sort((a, b) => {
                    const scoreA = (a.name.includes('Samantha') || a.name.includes('Victoria') || a.name.includes('Karen') || a.name.includes('Moira') || a.name.includes('Fiona') || a.name.includes('Alice') || a.name.includes('Emma') || a.name.includes('Chantal') || a.name.includes('Celine') || a.name.includes('Amelie')) ? 0 : 1;
                    const scoreB = (b.name.includes('Samantha') || b.name.includes('Victoria') || b.name.includes('Karen') || b.name.includes('Moira') || b.name.includes('Fiona') || b.name.includes('Alice') || b.name.includes('Emma') || b.name.includes('Chantal') || b.name.includes('Celine') || b.name.includes('Amelie')) ? 0 : 1;
                    return scoreA - scoreB;
                });
                selectedVoice = sorted[0] || voices[Math.floor(voices.length / 2)] || voices[0];
            }
        }
        if (hostVoiceSelect && voices.length > 0 && hostVoiceSelect.options.length <= 1) {
            hostVoiceSelect.innerHTML = '';
            voices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                if (selectedVoice && voice.name === selectedVoice.name && voice.lang === selectedVoice.lang) {
                    option.selected = true;
                }
                hostVoiceSelect.appendChild(option);
            });
            if (hostVoiceSelect.options.length > 0 && !hostVoiceSelect.value) {
                hostVoiceSelect.selectedIndex = 0;
            }
        }
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load, { once: true });
}

document.addEventListener('click', () => {
    userInteracted = true;
    triggerWelcome();
}, { once: true });

document.addEventListener('touchstart', () => {
    userInteracted = true;
    triggerWelcome();
}, { once: true });

function t(key) {
    return gameContent[currentLanguage][key];
}

function updateUIText() {
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        element.innerText = t(key);
    });
}

// Pool combiné : contenu statique + contenu appris par l'IA (le jeu se renouvelle sans bloquer)
function getPool(category) {
    const staticPool = Array.isArray(t(category)) ? t(category) : [];
    const lp = learnedFor()[category];
    const learnedPool = Array.isArray(lp) ? lp : [];
    return [...staticPool, ...learnedPool];
}

function poolSize(type) {
    if (type === 'questions') return getPool(isSpicy ? 'superSpicyQuestions' : 'questions').length;
    if (type === 'actions') return getPool(isSpicy ? 'superSpicyActions' : 'actions').length;
    return 0;
}

function isPoolExhausted(type) {
    const used = type === 'questions' ? questionUsedSet.size : actionUsedSet.size;
    const total = poolSize(type);
    return total > 0 && used >= total;
}

// Pioche "fraîche" : jamais un doublon de session, jamais le dernier affiché.
function pickFresh(pool, usedSet, lastText) {
    if (!pool || pool.length === 0) return null;
    const candidates = pool.filter(item => item && !usedSet.has(item) && item !== lastText);
    const source = candidates.length > 0 ? candidates : pool;
    return source[Math.floor(Math.random() * source.length)];
}

function computeNextSpicy() {
    if (mood === 'spicy') return 2;
    if (mood === 'funny') return Math.floor(Math.random() * 3) + 5;
    return Math.floor(Math.random() * 3) + 3;
}

function getNewQuestion() {
    questionCounter++;
    if (questionCounter >= nextSpicy) {
        questionCounter = 0;
        nextSpicy = computeNextSpicy();
        isSpicy = true;
        let q = pickFresh(getPool('superSpicyQuestions'), questionUsedSet, lastQuestionText);
        if (q) {
            lastQuestionText = q;
            questionUsedSet.add(q);
            return q;
        }
        // Pas assez de contenu spicy -> repli sur le pool normal
        isSpicy = false;
        q = pickFresh(getPool('questions'), questionUsedSet, lastQuestionText);
        if (q) {
            lastQuestionText = q;
            questionUsedSet.add(q);
            return q;
        }
        // Pool totalement épuisé -> on repart de zéro (le jeu ne bloque jamais)
        questionUsedSet.clear();
        lastQuestionText = '';
        q = getPool('questions')[0] || 'Never have I ever...';
        lastQuestionText = q;
        questionUsedSet.add(q);
        return q;
    }

    isSpicy = false;
    let q = pickFresh(getPool('questions'), questionUsedSet, lastQuestionText);
    if (q) {
        lastQuestionText = q;
        questionUsedSet.add(q);
        return q;
    }
    questionUsedSet.clear();
    lastQuestionText = '';
    q = getPool('questions')[0] || 'Never have I ever...';
    lastQuestionText = q;
    questionUsedSet.add(q);
    return q;
}

function getNewAction() {
    const pool = isSpicy ? getPool('superSpicyActions') : getPool('actions');
    let a = pickFresh(pool, actionUsedSet, lastActionText);
    if (a) {
        lastActionText = a;
        actionUsedSet.add(a);
        return a;
    }
    actionUsedSet.clear();
    lastActionText = '';
    a = pickFresh(pool, actionUsedSet, '');
    if (a) {
        lastActionText = a;
        actionUsedSet.add(a);
        return a;
    }
    lastActionText = 'Do a silly dance!';
    actionUsedSet.add(lastActionText);
    return lastActionText;
}

function shouldUseAI() {
    return Math.random() < aiChance;
}

async function fetchAIContent(type, context = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT);

    try {
        const response = await fetch('/api/never-ever/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                language: currentLanguage,
                isSpicy,
                mood,
                history: type === 'question' ? questionHistory : type === 'action' ? actionHistory : [],
                round: roundCounter,
                lastAction: context.lastAction || '',
                players: Array.isArray(context.players) && context.players.length ? context.players : players,
                pressureLevel: context.pressureLevel || 1,
                question: context.question || '',
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.source === 'ai' && data.content) {
            return data.content;
        }
        return null;
    } catch (error) {
        clearTimeout(timeoutId);
        console.warn(`[AI] ${type} fetch failed:`, error.message);
        return null;
    }
}

function showTemporaryCardMessage(message) {
    temporaryCardMessage = message;
    const originalText = questionText.innerText;
    questionText.setAttribute('data-original-text', originalText);
    questionText.innerText = message;
    questionText.classList.add('fade');
    setTimeout(() => questionText.classList.remove('fade'), 50);
}

function clearTemporaryCardMessage() {
    if (temporaryCardMessage) {
        const originalText = questionText.getAttribute('data-original-text');
        if (originalText) {
            questionText.innerText = originalText;
            questionText.removeAttribute('data-original-text');
        }
        temporaryCardMessage = null;
    }
}

// Base apprenante : chargée depuis generated-content.json (le jeu ne bloque jamais)
function loadLearned() {
    return fetch('/never-ever/generated-content.json', { cache: 'no-store' })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data && typeof data === 'object') learnedAll = data;
        })
        .catch(() => {
            // Pas encore de contenu appris -> on joue avec le pool statique
        });
}

function learnedFor() {
    const langData = learnedAll[currentLanguage];
    return langData && typeof langData === 'object' ? langData : {};
}

// ---- Proposition "spicy / funny / garder" - réutilise la modale existante (aucun HTML/CSS changé)
function shouldOfferMood() {
    return roundCounter >= 3
        && (roundCounter - lastMoodOfferRound) >= 4
        && Math.random() < 0.35;
}

function openMoodModal() {
    moodPromptActive = true;

    const labels = currentLanguage === 'fr'
        ? {
            title: '🔥 Le groupe chauffe… Que fait l\'IA ?',
            spicy: '🔥 Encore plus spicy',
            funny: '😂 Plus funny / loufoque',
            keep: '✋ Garder le rythme actuel',
        }
        : {
            title: '🔥 The group is heating up… What should the AI do?',
            spicy: '🔥 More spicy',
            funny: '😂 More funny / silly',
            keep: '✋ Keep it as is',
        };

    actionText.innerText = labels.title;
    closeModalButton.style.display = 'none';

    [
        { label: labels.spicy, value: 'spicy' },
        { label: labels.funny, value: 'funny' },
        { label: labels.keep, value: 'keep' },
    ].forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'styled-button';
        btn.innerText = option.label;
        btn.addEventListener('click', () => chooseMood(option.value));
        modalContent.appendChild(btn);
        moodButtons.push(btn);
    });

    actionModal.classList.remove('hidden');
}

function chooseMood(choice) {
    if (choice === 'keep') {
        // Garde le mood actuel tel quel
    } else {
        mood = choice;
    }
    lastMoodOfferRound = roundCounter;
    saveAISettings();
    closeMoodModal();
    displayNewQuestion();
}

function closeMoodModal() {
    moodPromptActive = false;
    moodButtons.forEach(btn => btn.remove());
    moodButtons = [];
    closeModalButton.style.display = '';
    actionModal.classList.add('hidden');
}

function loadAISettings() {
    try {
        const raw = localStorage.getItem(AI_STATE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (Array.isArray(data.questionHistory)) questionHistory = data.questionHistory.slice(-40);
        if (Array.isArray(data.actionHistory)) actionHistory = data.actionHistory.slice(-40);
        // NOTE: les prénoms ne sont volontairement PAS restaurés :
        // la liste des joueurs se réinitialise à chaque rechargement de page.
        if (typeof data.hostMuted === 'boolean') hostMuted = data.hostMuted;
        if (typeof data.hostEnabled === 'boolean') hostEnabled = data.hostEnabled;
        if (typeof data.hostVolume === 'number') hostVolume = data.hostVolume;
        if (typeof data.hostVoiceIndex === 'number' && hostVoiceSelect) {
            hostVoiceSelect.value = data.hostVoiceIndex;
            const voices = window.speechSynthesis.getVoices();
            if (voices[data.hostVoiceIndex]) selectedVoice = voices[data.hostVoiceIndex];
        }
        if (typeof data.questionTimerEnabled === 'boolean') questionTimerEnabled = data.questionTimerEnabled;
        if (typeof data.questionTimerDuration === 'number' && data.questionTimerDuration > 0) {
            questionTimerDuration = Math.min(data.questionTimerDuration, 120);
        }
        updatePlayersDisplay();
    } catch (error) {
        console.warn('[AI] Failed to load saved state:', error.message);
    }
}

function saveAISettings() {
    try {
        localStorage.setItem(AI_STATE_KEY, JSON.stringify({
            questionHistory: questionHistory.slice(-40),
            actionHistory: actionHistory.slice(-40),
            // NOTE: les prénoms ne sont pas sauvegardés (reset à chaque partie)
            hostMuted,
            hostEnabled,
            hostVolume,
            hostVoiceIndex: hostVoiceSelect ? parseInt(hostVoiceSelect.value, 10) : null,
            questionTimerEnabled,
            questionTimerDuration,
        }));
    } catch (error) {
        console.warn('[AI] Failed to save state:', error.message);
    }
}

function promptForPlayers() {
    if (players.length > 0) return;
    userInteracted = true;
    const message = currentLanguage === 'fr'
        ? '🦎 Prénoms des guerriers (séparés par des virgules) — qui va tenir le choc ce soir ?'
        : '🦎 Warriors\' first names (comma-separated) — who\'s gonna survive tonight?';
    const input = window.prompt(message, '');
    if (input && input.trim()) {
        players = input.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);
        playersMode = 'multi';
        hostEnabled = true;
        saveAISettings();
        updatePlayersDisplay();
        const confirmText = currentLanguage === 'fr'
            ? `Boom ! ${players.join(', ')} dans la place ! Ça va chauffer !`
            : `Boom! ${players.join(', ')} in the house! Things are about to get spicy!`;
        speak(confirmText, { welcome: true });
    } else {
        playersMode = 'solo';
        hostEnabled = true;
        saveAISettings();
        updatePlayersDisplay();
        const soloText = currentLanguage === 'fr'
            ? 'Solo ? T\'es sûr ? Bon, prépare-toi, ça va aller vite !'
            : 'Solo? You sure? Alright, strap in, this is gonna be fast and wild!';
        speak(soloText, { welcome: true });
    }
}

function updatePlayersDisplay() {
    if (!playersList) return;
    const removeLabel = currentLanguage === 'fr' ? 'Retirer' : 'Remove';
    
    if (players.length === 0) {
        playersList.innerHTML = currentLanguage === 'fr'
            ? '<span>Mode Solo</span>'
            : '<span>Solo Mode</span>';
    } else {
        playersList.innerHTML = players
            .map((name, index) => `<span class="player-tag" data-index="${index}" title="${removeLabel}">${name} ✕</span>`)
            .join('');
        
        playersList.querySelectorAll('.player-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const index = parseInt(tag.getAttribute('data-index'), 10);
                if (!isNaN(index)) {
                    removePlayer(index);
                }
            });
        });
    }
    
    updateWelcomePlayersList();
}

function updateWelcomePlayersList() {
    if (!welcomePlayersList) return;
    if (players.length === 0) {
        welcomePlayersList.innerHTML = '';
    } else {
        welcomePlayersList.innerHTML = players
            .map((name, index) => `<span class="welcome-player-tag" data-index="${index}">${name} ✕</span>`)
            .join('');
        
        welcomePlayersList.querySelectorAll('.welcome-player-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const index = parseInt(tag.getAttribute('data-index'), 10);
                if (!isNaN(index)) {
                    removeWelcomePlayer(index);
                }
            });
        });
    }
    
    if (startGameBtn) {
        startGameBtn.disabled = players.length === 0;
    }
}

function addWelcomePlayer() {
    if (!welcomePlayerInput) return;
    const name = welcomePlayerInput.value.trim();
    if (!name) return;
    if (players.includes(name)) {
        welcomePlayerInput.value = '';
        return;
    }
    if (players.length >= 8) {
        welcomePlayerInput.value = '';
        return;
    }
    players.push(name);
    playersMode = 'multi';
    hostEnabled = true;
    saveAISettings();
    updatePlayersDisplay();
    welcomePlayerInput.value = '';
    welcomePlayerInput.focus();
}

function removeWelcomePlayer(index) {
    if (index < 0 || index >= players.length) return;
    players.splice(index, 1);
    if (players.length === 0) {
        playersMode = 'solo';
    }
    saveAISettings();
    updatePlayersDisplay();
}

function addPlayer(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (players.includes(trimmed)) return;
    if (players.length >= 8) {
        alert(currentLanguage === 'fr' ? 'Maximum 8 joueurs !' : 'Maximum 8 players!');
        return;
    }
    players.push(trimmed);
    playersMode = 'multi';
    hostEnabled = true;
    saveAISettings();
    updatePlayersDisplay();
}

function removePlayer(index) {
    if (index < 0 || index >= players.length) return;
    const removed = players[index];
    players.splice(index, 1);
    if (players.length === 0) {
        playersMode = 'solo';
    }
    saveAISettings();
    updatePlayersDisplay();
}

function startQuestionTimer() {
    clearQuestionTimer();
    if (!questionTimerEnabled) return;
    questionTimerRemaining = questionTimerDuration;
    questionPressureLevel = 0;
    updateTimerDisplay();
    questionTimer = setInterval(() => {
        questionTimerRemaining--;
        updateTimerDisplay();
        
        if (questionTimerRemaining === 40 && questionPressureLevel < 1) {
            questionPressureLevel = 1;
            triggerEscalatingPressure(1);
        } else if (questionTimerRemaining === 20 && questionPressureLevel < 2) {
            questionPressureLevel = 2;
            triggerEscalatingPressure(2);
        } else if (questionTimerRemaining <= 0) {
            clearQuestionTimer();
            questionPressureLevel = 3;
            triggerEscalatingPressure(3);
        }
    }, 1000);
}

function clearQuestionTimer() {
    if (questionTimer) {
        clearInterval(questionTimer);
        questionTimer = null;
    }
    questionTimerRemaining = 0;
    questionPressureLevel = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    if (!hostTimerButton) return;
    if (!questionTimerEnabled) {
        hostTimerButton.innerText = '⏱️';
        hostTimerButton.classList.remove('timer-active');
        return;
    }
    if (questionTimerRemaining > 0) {
        hostTimerButton.innerText = `⏱️ ${questionTimerRemaining}s`;
        hostTimerButton.classList.add('timer-active');
    } else {
        hostTimerButton.innerText = '⏱️';
        hostTimerButton.classList.remove('timer-active');
    }
}

function toggleQuestionTimer() {
    questionTimerEnabled = !questionTimerEnabled;
    if (!questionTimerEnabled) {
        clearQuestionTimer();
    }
    updateTimerDisplay();
    saveAISettings();
    const msg = currentLanguage === 'fr'
        ? questionTimerEnabled ? 'Timer activé !' : 'Timer désactivé.'
        : questionTimerEnabled ? 'Timer activated!' : 'Timer disabled.';
    speak(msg);
}

function getEscalatingPressureLine(level) {
    const lines = currentLanguage === 'fr'
        ? {
            1: [
                'Allez, pas de stress, profitez !',
                'Prenez votre temps, respirez...',
                'Pas de panique, la vérité finit toujours par sortir.',
            ],
            2: [
                'Hmm... je vois des regards qui se détournent.',
                'Certains commencent à suer, c\'est normal !',
                'Le temps passe, les masques tombent...',
            ],
            3: [
                'ALERTE : hésitation maximale détectée !',
                'C\'est quoi cette hésitation ? On dirait que quelqu\'un a quelque chose à cacher !',
                'Les secondes s\'égrènent, la vérité approche à grands pas !',
            ],
        }
        : {
            1: [
                'Take your time, no pressure... yet.',
                'Relax, this is just a game... for now.',
                'Breathe, you got this. Maybe.',
            ],
            2: [
                'I see some eyes darting away... interesting.',
                'Some people are starting to sweat. Normal, right?',
                'Time\'s ticking and masks are slipping...',
            ],
            3: [
                'ALERT: Maximum hesitation detected!',
                'What\'s with all the hesitation? Someone\'s hiding something!',
                'The truth is coming out whether you like it or not!',
            ],
        };
    
    const levelLines = lines[level] || lines[3];
    return levelLines[Math.floor(Math.random() * levelLines.length)];
}

async function triggerEscalatingPressure(level) {
    if (!hostEnabled) return;
    
    const waitForSpeechToEnd = () => {
        return new Promise(resolve => {
            if (!isSpeaking) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (!isSpeaking) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 200);
            }
        });
    };
    
    await waitForSpeechToEnd();
    
    const pressureComment = await getHostComment('pressure', { level });
    if (pressureComment) {
        speak(pressureComment, { pressure: true });
    }
}

async function onQuestionTimeout() {
    if (!hostEnabled) return;
    const pressureComment = await getHostComment('pressure', { level: 3 });
    if (pressureComment) {
        speak(pressureComment, { pressure: true });
    }
}

function updateAdaptiveSpice() {
    if (totalClicks < 3) return;

    const ratio = doClicks / totalClicks;
    if (ratio > 0.6) {
        aiChance = 0.4;
        nextSpicy = Math.floor(Math.random() * 2) + 2;
    } else if (ratio > 0.4) {
        aiChance = 0.3;
        nextSpicy = Math.floor(Math.random() * 3) + 2;
    } else {
        aiChance = 0.15;
        nextSpicy = Math.floor(Math.random() * 3) + 4;
    }
}

function resetGame() {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    welcomeSpoken = false;
    userInteracted = true;
    hostEnabled = true;
    hostMuted = false;
    hostVolume = 1.0;
    selectedVoice = null;
    questionTimerEnabled = false;
    clearQuestionTimer();
    gameStarted = false;
    
    players = [];
    playersMode = 'solo';
    questionHistory = [];
    actionHistory = [];
    questionUsedSet = new Set();
    actionUsedSet = new Set();
    hostCommentsHistory = [];
    roundCounter = 1;
    totalClicks = 0;
    doClicks = 0;
    nextClicks = 0;
    aiChance = 0.35;
    questionCounter = 0;
    nextSpicy = Math.floor(Math.random() * 3) + 3;
    isSpicy = false;
    lastQuestionText = '';
    lastActionText = '';
    currentNarrative = null;
    currentMostLikely = null;
    temporaryCardMessage = null;
    mood = 'balanced';
    moodPromptActive = false;
    lastMoodOfferRound = 0;
    moodButtons = [];
    
    try {
        localStorage.removeItem(AI_STATE_KEY);
    } catch (e) {
        console.warn('[AI] Failed to clear saved state:', e.message);
    }
    
    updatePlayersDisplay();
    updateWelcomePlayersList();
    updateHostMuteButton();
    updateHostVolumeButton();
    updateTimerDisplay();
    if (hostVoiceSelect) hostVoiceSelect.selectedIndex = 0;
    
    if (welcomeOverlay) {
        welcomeOverlay.classList.remove('hidden');
    }
    
    if (playersDisplay) {
        playersDisplay.classList.add('hidden');
    }
    
    const container = document.querySelector('.container');
    if (container) container.classList.remove('active');
    
    setTimeout(() => {
        if (startGameBtn) startGameBtn.disabled = true;
    }, 100);
}

function speak(text, options = {}) {
    if (hostMuted || !text || !window.speechSynthesis || !userInteracted) return;
    const cleanText = String(text).replace(/\s+/g, ' ').trim();
    if (!cleanText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const voiceIndex = hostVoiceSelect ? parseInt(hostVoiceSelect.value, 10) : 0;
    if (!isNaN(voiceIndex) && voices[voiceIndex]) {
        utterance.voice = voices[voiceIndex];
    } else if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    const isWelcome = options.welcome || false;
    const isQuestion = options.question || false;
    const isAction = options.action || false;
    const isQuestionText = options.questionText || false;
    utterance.rate = isWelcome ? 1.1 : isQuestionText ? 0.95 : isQuestion ? 1.0 : isAction ? 1.05 : 1.0;
    utterance.pitch = isWelcome ? 1.3 : isQuestionText ? 1.1 : isQuestion ? 1.2 : isAction ? 1.15 : 1.1;
    utterance.volume = hostVolume;
    isSpeaking = true;
    utterance.onend = () => { isSpeaking = false; };
    utterance.onerror = () => { isSpeaking = false; };
    window.speechSynthesis.speak(utterance);
}

function pickFreshHostComment() {
    const pool = getPool('hostComments');
    return pickFresh(pool, new Set(hostCommentsHistory), '');
}

function whenDoneSpeaking(callback) {
    return new Promise(resolve => {
        if (!isSpeaking) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (!isSpeaking) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 150);
        }
    }).then(callback);
}

async function triggerWelcome() {
    if (welcomeSpoken || !hostEnabled) return;
    welcomeSpoken = true;
    const names = players.length > 0 ? players.join(', ') : '';
    let welcomeText;
    if (players.length > 0) {
        welcomeText = currentLanguage === 'fr'
            ? `C'est parti ! Bienvenue à ${names} ! Moi c'est April, et ce soir on joue à Never Ever. Balancez vos secrets, ou buvez !`
            : `Here we go! Welcome ${names}! I'm April, and tonight we're playing Never Ever. Spill the secrets, or drink!`;
    } else {
        welcomeText = currentLanguage === 'fr'
            ? 'Yo ! C\'est April, bienvenue dans Never Ever ! Allez, balancez vos prénoms, ça va déchirer ce soir !'
            : 'Hey everyone! Welcome to Never Ever. We\'re here to drop the act and spill the juicy secrets. So, who\'s playing the saint and who\'s a lowkey demon here?';
    }
    speak(welcomeText);
    hostCommentsHistory.push(welcomeText);
}

async function getHostComment(contextType, extra = {}) {
    if (!hostEnabled) return null;

    let comment = null;
    const useAI = shouldUseAI();
    const type = contextType === 'pressure' ? 'host_pressure' : 'host_comment';

    if (useAI) {
        comment = await fetchAIContent(type, {
            lastAction: extra.lastAction || '',
            players: playersMode === 'multi' && players.length > 0 ? players : [],
            pressureLevel: extra.level || 1,
            question: extra.question || '',
        });
    }

    if (!comment) {
        if (type === 'host_pressure') {
            comment = getEscalatingPressureLine(extra.level || 1);
        } else {
            comment = pickFreshHostComment();
        }
    }

    if (comment) {
        hostCommentsHistory.push(comment);
        if (hostCommentsHistory.length > 40) hostCommentsHistory.shift();
    }

    return comment;
}

function getPressureLine() {
    const lines = currentLanguage === 'fr'
        ? [
            'Allez, on se décide ! Le temps passe !',
            'Hésitation détectée ! Assumez !',
            'On dirait que quelqu\'un a quelque chose à cacher...',
            'Les secondes s\'égrènent, la vérité approche !',
            'Allez, un geste ! On ne fait pas de jaloux !',
        ]
        : [
            'Come on, make a move! Time\'s ticking!',
            'Hesitation detected! Own up to it!',
            'Looks like someone has something to hide...',
            'The truth is coming out whether you like it or not!',
            'Don\'t leave us hanging, take the leap!',
        ];
    return lines[Math.floor(Math.random() * lines.length)];
}

async function displayNewQuestion() {
    if (!gameStarted) return;
    clearTemporaryCardMessage();
    currentNarrative = null;
    currentMostLikely = null;

    questionText.classList.add('fade');
    choicesContainer.classList.add('hidden');
    actionModal.classList.add('hidden');
    card.classList.remove('super-spicy', 'glitch');

    setTimeout(async () => {
        const useAI = shouldUseAI() || isPoolExhausted('questions');
        const wantsNarrative = shouldUseAI() && !isPoolExhausted('questions');
        const wantsMostLikely = shouldUseAI();

        // Tous les appels IA partent en parallèle : la question s'affiche et
        // se fait entendre dès qu'elle est prête (latence max = 1 appel au
        // lieu de 3 enchaînés).
        const questionPromise = useAI ? fetchAIContent('question') : null;
        const narrativePromise = wantsNarrative ? fetchAIContent('narrative') : null;
        const mostLikelyPromise = wantsMostLikely ? fetchAIContent('most_likely') : null;

        let content = questionPromise ? await questionPromise : null;

        if (!content) {
            content = getNewQuestion();
            questionHistory.push(content);
        } else {
            questionHistory.push(content);
            questionUsedSet.add(content);
        }
        saveAISettings();

        let narrative = null;
        let mostLikely = null;
        const renderCard = () => {
            const parts = [];
            if (narrative) parts.push(narrative);
            parts.push(content);
            if (mostLikely) parts.push(mostLikely);
            questionText.innerText = parts.join('\n\n');
        };

        renderCard();
        if (isSpicy) {
            card.classList.add('super-spicy');
            card.classList.add('glitch');
        }
        questionText.classList.remove('fade');
        choicesContainer.classList.remove('hidden');

        if (hostEnabled && content) {
            const spokenText = String(content).replace(/\s+/g, ' ').trim();
            if (spokenText) {
                speak(spokenText, { questionText: true });
            }
        }

        startQuestionTimer();

        // Narrative / most_likely arrivent après : simple mise à jour visuelle
        // de la carte, sans couper la voix en cours.
        if (narrativePromise) {
            narrativePromise.then(value => {
                if (value) {
                    narrative = value;
                    currentNarrative = narrative;
                    renderCard();
                }
            });
        }
        if (mostLikelyPromise) {
            mostLikelyPromise.then(value => {
                if (value) {
                    mostLikely = value;
                    currentMostLikely = mostLikely;
                    renderCard();
                }
            });
        }

        if (hostEnabled) {
            const hostComment = await getHostComment('question_start', { question: content });
            if (hostComment) {
                speak(hostComment, { question: true });
            }
        }
    }, 300);
}

function setLanguage(lang) {
    currentLanguage = lang;
    if (lang === 'ar') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }
    updateHostMuteButton();
    updateHostVolumeButton();
    updateUIText();
    displayNewQuestion();
    langModal.classList.add('hidden');
}

langMenuButton.addEventListener('click', () => {
    langModal.classList.remove('hidden');
});

closeLangModalButton.addEventListener('click', () => {
    langModal.classList.add('hidden');
});

hostMuteButton.addEventListener('click', () => {
    hostMuted = !hostMuted;
    updateHostMuteButton();
    saveAISettings();
});

if (hostVolumeButton) {
    hostVolumeButton.addEventListener('click', () => {
        const levels = [0.25, 0.5, 0.75, 1.0];
        const currentIndex = levels.indexOf(hostVolume);
        const nextIndex = currentIndex === -1 ? 3 : (currentIndex + 1) % 4;
        hostVolume = levels[nextIndex];
        saveAISettings();
        updateHostVolumeButton();
    });
}

hostTimerButton.addEventListener('click', () => {
    toggleQuestionTimer();
});

hostResetButton.addEventListener('click', () => {
    resetGame();
});

if (hostVoiceSelect) {
    hostVoiceSelect.addEventListener('change', () => {
        const voices = window.speechSynthesis.getVoices();
        const index = parseInt(hostVoiceSelect.value, 10);
        if (!isNaN(index) && voices[index]) {
            selectedVoice = voices[index];
        }
        saveAISettings();
    });
}

if (addPlayerBtn) {
    addPlayerBtn.addEventListener('click', () => {
        const name = playerNameInput ? playerNameInput.value.trim() : '';
        if (name) {
            addPlayer(name);
            if (playerNameInput) playerNameInput.value = '';
        }
    });
}

if (playerNameInput) {
    playerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const name = playerNameInput.value.trim();
            if (name) {
                addPlayer(name);
                playerNameInput.value = '';
            }
        }
    });
}

function updateHostMuteButton() {
    hostMuteButton.innerText = hostMuted ? '🔇' : '🔊';
}

function updateHostVolumeButton() {
    if (!hostVolumeButton) return;
    const pct = Math.round(hostVolume * 100);
    const icon = hostVolume <= 0.5 ? '🔉' : '🔊';
    hostVolumeButton.innerText = icon + pct + '%';
    hostVolumeButton.title = 'Host voice volume: ' + pct + '%. Click to change.';
}

document.querySelectorAll('.lang-select').forEach(button => {
    button.addEventListener('click', () => {
        setLanguage(button.getAttribute('data-lang'));
    });
});

doButton.addEventListener('click', async () => {
    doClicks++;
    totalClicks++;
    updateAdaptiveSpice();
    clearQuestionTimer();

    let action = null;
    const useAI = shouldUseAI() || isPoolExhausted('actions');

    const flavorRoll = Math.random();
    const isTruth = flavorRoll < 0.18;
    const isGroup = flavorRoll >= 0.18 && flavorRoll < 0.28;

    // Vérités & défis de groupe peuvent venir de la BD apprenante SANS appel IA
    if (isTruth) {
        action = pickFresh(getPool('truths'), actionUsedSet, lastActionText);
        if (!action && useAI) action = await fetchAIContent('truth');
    } else if (isGroup) {
        action = pickFresh(getPool('groupChallenges'), actionUsedSet, lastActionText);
        if (!action && useAI) action = await fetchAIContent('group_challenge');
    } else if (useAI) {
        action = await fetchAIContent('action');
    }

    if (!action) {
        action = getNewAction();
        actionHistory.push(action);
    } else {
        actionHistory.push(action);
        actionUsedSet.add(action);
    }
    saveAISettings();

    const flavorPrefix = isTruth ? '🎤' : isGroup ? '👥' : '';
    let displayAction = flavorPrefix ? `${flavorPrefix} ${action}` : action;

    // Affichage immédiat de l'action (aucune attente IA avant la modale) ...
    actionText.innerText = displayAction;
    actionModal.classList.remove('hidden');

    // ... la voix lit l'action tout de suite ...
    if (hostEnabled && displayAction) {
        const spokenAction = String(displayAction).replace(/\s+/g, ' ').trim();
        if (spokenAction) {
            speak(spokenAction, { action: true });
        }
    }

    // ... et le commentaire sarcastique complète la carte quand il arrive
    // (sans retarder l'affichage ni la voix).
    if (shouldUseAI()) {
        fetchAIContent('sarcastic_comment', { lastAction: action, question: lastQuestionText }).then(comment => {
            if (comment) {
                displayAction = `${displayAction}\n\n— ${comment}`;
                actionText.innerText = displayAction;
            }
        });
    }

    if (hostEnabled) {
        getHostComment('action_result', { lastAction: action }).then(comment => {
            if (comment) speak(comment, { question: true });
        });
    }
});

closeModalButton.addEventListener('click', async () => {
    if (moodPromptActive) return;
    actionModal.classList.add('hidden');
    nextClicks++;
    totalClicks++;
    updateAdaptiveSpice();
    clearQuestionTimer();

    if (actionHistory.length === 0) return;

    const jobs = [];
    if (shouldUseAI()) {
        const lastAction = actionHistory[actionHistory.length - 1];
        jobs.push(fetchAIContent('consequence', { lastAction }));
    }
    if (Math.random() < 0.12) {
        jobs.push(fetchAIContent('party_summary'));
    }

    if (jobs.length > 0) {
        const results = await Promise.all(jobs);
        const parts = results.filter(Boolean);
        if (parts.length > 0) {
            showTemporaryCardMessage(parts.join('\n\n'));
        }
    }
});

nextQuestionButton.addEventListener('click', () => {
    nextClicks++;
    totalClicks++;
    roundCounter++;
    updateAdaptiveSpice();
    if (shouldOfferMood()) {
        openMoodModal();
        return;
    }
    displayNewQuestion();
    if (hostEnabled) {
        getHostComment('next_round').then(comment => {
            if (comment) speak(comment, { question: true });
        });
    }
});

async function initGame() {
    try {
        const response = await fetch('game-content.json');
        gameContent = await response.json();
        updateUIText();
        await loadLearned();
        loadAISettings();
        preloadVoices();
        players = [];
        playersMode = 'solo';
        updatePlayersDisplay();
        updateWelcomePlayersList();
        hostEnabled = true;
        updateHostMuteButton();
        updateHostVolumeButton();
        updateTimerDisplay();
        
        if (welcomeOverlay) {
            welcomeOverlay.classList.remove('hidden');
            if (playersDisplay) playersDisplay.classList.add('hidden');
            updateWelcomePlayersList();
            if (startGameBtn) {
                startGameBtn.disabled = players.length === 0;
                startGameBtn.addEventListener('click', startGame);
            }
            if (welcomeAddBtn) {
                welcomeAddBtn.addEventListener('click', addWelcomePlayer);
            }
            if (welcomePlayerInput) {
                welcomePlayerInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') addWelcomePlayer();
                });
            }
        }
    } catch (error) {
        console.error('Error loading game content:', error);
    }
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    userInteracted = true;
    // Switch the music player to the Never Ever track
    if (window.DPMusicPlayer && typeof window.DPMusicPlayer.playTrack === 'function') {
        window.DPMusicPlayer.playTrack('night ride.mp3');
    }
    if (welcomeOverlay) {
        welcomeOverlay.classList.add('hidden');
    }
    if (playersDisplay) {
        playersDisplay.classList.remove('hidden');
    }
    const container = document.querySelector('.container');
    if (container) container.classList.add('active');
    // À chaque début de partie : la voix présente le jeu (avec les prénoms)
    // avant que la première question n'apparaisse.
    welcomeSpoken = false;
    triggerWelcome();
    whenDoneSpeaking(() => {
        displayNewQuestion();
    });
}

initGame();
