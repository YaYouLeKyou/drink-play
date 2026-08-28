const emojis = ['🍑', '🍆', '🍺', '🍷', '😂', '👽', '❤️'];

const emojiColors = {
    '🍑': '#FFC0CB',
    '🍆': '#800080',
    '🍺': '#FFD700',
    '🍷': '#8B0000',
    '😂': '#FFFF00',
    '👽': '#00FF00',
    '❤️': '#FF0000'
};

const state = {
    players: [],
    mode: 'classic',
    round: 1,
    spinning: false,
    history: [],
    timerSeconds: 0,
    timerInterval: null,
    timerRunning: false,
    language: 'en',
    jackpotRules: {},
    tooHot: false,
    maxRounds: 10,
    neverEverActive: false,
    neverEverMode: false,
    neverEverQuestionsUsed: 0,
    neverEverActionsUsed: 0,
};

const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');
const languageSelector = document.getElementById('language');
const langDropdown = document.getElementById('langDropdown');
const langBtn = document.getElementById('langBtn');
const emojiRainContainer = document.getElementById('emoji-rain-container');
const emojiExplosionContainer = document.getElementById('emoji-explosion-container');

// Setup panel elements
const setupPanel = document.getElementById('setupPanel');
const gamePanel = document.getElementById('gamePanel');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playerNameInput = document.getElementById('playerNameInput');
const playerList = document.getElementById('playerList');
const modeBtns = document.querySelectorAll('.mode-btn');
const prevRoundBtn = document.getElementById('prevRoundBtn');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const roundDisplay = document.getElementById('roundDisplay');
const startTimerBtn = document.getElementById('startTimerBtn');
const stopTimerBtn = document.getElementById('stopTimerBtn');
const timerDisplay = document.getElementById('timerDisplay');
const startGameBtn = document.getElementById('startGameBtn');
const backHomeBtn = document.getElementById('backHomeBtn');
const backToHubBtn = document.getElementById('backToHubBtn');
const tooHotBtn = document.getElementById('tooHotBtn');

// Game info display elements
const gameModeDisplay = document.getElementById('gameModeDisplay');
const gameRoundDisplay = document.getElementById('gameRoundDisplay');
const gameTimerDisplay = document.getElementById('gameTimerDisplay');

// Rules modal elements
const rulesBtn = document.getElementById('rulesBtn');
const rulesModal = document.getElementById('rulesModal');
const closeRulesModal = document.getElementById('closeRulesModal');

function updateNeverEverUI() {
    const neverEverPanel = document.getElementById('neverEverPanel');
    if (neverEverPanel) {
        if (state.neverEverMode) {
            neverEverPanel.classList.add('active');
        } else {
            neverEverPanel.classList.remove('active');
        }
    }
}

function getNeverEverQuestion() {
    if (!neverEverGameContent || !neverEverGameContent['en']) return "No questions available. Load the Never Ever game first.";

    const questions = neverEverGameContent['en'].questions;
    if (!questions || questions.length === 0) return "No questions available.";

    let questionIndex;
    do {
        questionIndex = Math.floor(Math.random() * questions.length);
    } while (questionIndex === lastNeverEverQuestionIndex && questions.length > 1);
    lastNeverEverQuestionIndex = questionIndex;
    state.neverEverQuestionsUsed++;

    return questions[questionIndex];
}

function getNeverEverAction() {
    if (!neverEverGameContent || !neverEverGameContent['en']) return "Take action!";

    const actions = neverEverGameContent['en'].actions;
    if (!actions || actions.length === 0) return "Take action!";

    let actionIndex;
    do {
        actionIndex = Math.floor(Math.random() * actions.length);
    } while (actionIndex === lastNeverEverActionIndex && actions.length > 1);
    lastNeverEverActionIndex = actionIndex;
    state.neverEverActionsUsed++;

    return actions[actionIndex];
}

function getNeverEverSuperSpicyQuestion() {
    if (!neverEverGameContent || !neverEverGameContent['en']) return "Super Spicy question not available.";

    const superSpicyQuestions = neverEverGameContent['en'].superSpicyQuestions;
    if (!superSpicyQuestions || superSpicyQuestions.length === 0) return "Super Spicy question not available.";

    let questionIndex;
    do {
        questionIndex = Math.floor(Math.random() * superSpicyQuestions.length);
    } while (questionIndex === lastNeverEverQuestionIndex && superSpicyQuestions.length > 1);
    lastNeverEverQuestionIndex = questionIndex;
    state.neverEverQuestionsUsed++;

    return superSpicyQuestions[questionIndex];
}

function getNeverEverSuperSpicyAction() {
    if (!neverEverGameContent || !neverEverGameContent['en']) return "Super Spicy action not available.";

    const superSpicyActions = neverEverGameContent['en'].superSpicyActions;
    if (!superSpicyActions || superSpicyActions.length === 0) return "Super Spicy action not available.";

    let actionIndex;
    do {
        actionIndex = Math.floor(Math.random() * superSpicyActions.length);
    } while (actionIndex === lastNeverEverActionIndex && superSpicyActions.length > 1);
    lastNeverEverActionIndex = actionIndex;
    state.neverEverActionsUsed++;

    return superSpicyActions[actionIndex];
}

function getNeverEverChallenge() {
    if (!neverEverGameContent || !neverEverGameContent['en']) {
        return null;
    }

    const hasSuperSpicy = Math.random() < 0.2;

    if (hasSuperSpicy) {
        return {
            challenge: getNeverEverSuperSpicyQuestion(),
            source: 'neverEverSuperSpicy'
        };
    } else {
        const isSpicy = Math.random() < 0.3;

        if (isSpicy) {
            return {
                challenge: getNeverEverSuperSpicyQuestion(),
                source: 'neverEverSpicy'
            };
        } else {
            return {
                challenge: getNeverEverQuestion(),
                source: 'neverEver'
            };
        }
    }
}

function getNeverEverResults() {
    return {
        questionsUsed: state.neverEverQuestionsUsed,
        actionsUsed: state.neverEverActionsUsed,
        neverEverActive: state.neverEverActive
    };
}

function getNeverEverResults() {
    return {
        questionsUsed: state.neverEverQuestionsUsed,
        actionsUsed: state.neverEverActionsUsed,
        neverEverActive: state.neverEverActive
    };
}

function showNeverEverResults() {
    const results = getNeverEverResults();
    console.log('Never Ever Results:', results);
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('rules.json')
        .then(response => response.json())
        .then(data => {
            state.jackpotRules = data;
            updateLanguage(languageSelector.value);
        })
        .catch(error => {
            console.error('Error loading jackpot rules:', error);
            resultDisplay.textContent = 'Error loading game. Please try again.';
        });

    setupEventListeners();
    updateUI();

    slot1.textContent = '🍺';
    slot2.textContent = '🍺';
    slot3.textContent = '🍺';
});

function setupEventListeners() {
    languageSelector.addEventListener('change', (event) => {
        state.language = event.target.value;
        updateLanguage(state.language);
        langDropdown.classList.remove('open');
    });

    langBtn.addEventListener('click', () => {
        langDropdown.classList.toggle('open');
    });

    // Back to Hub
    if (backToHubBtn) {
        backToHubBtn.addEventListener('click', goToHub);
    }

    // Rules Modal
    rulesBtn.addEventListener('click', () => {
        rulesModal.classList.add('open');
    });

    closeRulesModal.addEventListener('click', () => {
        rulesModal.classList.remove('open');
    });

    // Close modal when clicking outside
    rulesModal.addEventListener('click', (event) => {
        if (event.target === rulesModal) {
            rulesModal.classList.remove('open');
        }
    });

    addPlayerBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name && !state.players.includes(name)) {
            state.players.push(name);
            playerNameInput.value = '';
            renderPlayers();
            updateUI();
        }
    });

    playerNameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addPlayerBtn.click();
        }
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mode = btn.dataset.mode;
            updateUI();
        });
    });

    prevRoundBtn.addEventListener('click', () => {
        if (state.round > 1) {
            state.round--;
            roundDisplay.textContent = state.round;
            updateUI();
        }
    });

    nextRoundBtn.addEventListener('click', () => {
        if (state.round < state.maxRounds) {
            state.round++;
            roundDisplay.textContent = state.round;
            updateUI();
        }
    });

    startTimerBtn.addEventListener('click', startTimer);
    stopTimerBtn.addEventListener('click', stopTimer);
    startGameBtn.addEventListener('click', startGame);
    document.getElementById('backToHubSetupBtn').addEventListener('click', goToHub);
    backHomeBtn.addEventListener('click', goHome);
    spinButton.addEventListener('click', spin);
    tooHotBtn.addEventListener('click', () => {
        state.tooHot = true;
        tooHotBtn.textContent = 'Too Hot!';
        setTimeout(() => {
            state.tooHot = false;
            tooHotBtn.textContent = 'Too Hot';
        }, 2000);
    });
}

function renderPlayers() {
    playerList.innerHTML = '';
    state.players.forEach((player, index) => {
        const li = document.createElement('li');
        li.className = 'player-item';
        li.innerHTML = `${player} <button class="remove-player-btn" data-index="${index}">&times;</button>`;
        playerList.appendChild(li);
    });

    document.querySelectorAll('.remove-player-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            state.players.splice(index, 1);
            renderPlayers();
            updateUI();
        });
    });
}

function updateLanguage(lang) {
    state.language = lang;
    const titles = {
        en: 'Jackpot Drinking Game',
        fr: 'Jeu à Boire Jackpot',
        es: 'Juego de Beber Jackpot',
        it: 'Gioco a Bere Jackpot'
    };
    const labels = {
        en: 'EN',
        fr: 'FR',
        es: 'ES',
        it: 'IT'
    };
    document.querySelector('h1').textContent = titles[lang] || titles.en;
    if (langLabel) langLabel.textContent = labels[lang] || lang.toUpperCase();
    spinButton.textContent = {
        en: 'Spin',
        fr: 'Lancer',
        es: 'Girar',
        it: 'Gira'
    }[lang] || 'Spin';

    slot1.textContent = '🍺';
    slot2.textContent = '🍺';
    slot3.textContent = '🍺';
}

function updateUI() {
    gameModeDisplay.textContent = `Mode: ${state.mode.charAt(0).toUpperCase() + state.mode.slice(1)}`;
    gameRoundDisplay.textContent = `Round: ${state.round}`;
    gameTimerDisplay.textContent = formatTime(state.timerSeconds);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function startTimer() {
    if (state.timerRunning) return;
    state.timerRunning = true;
    state.timerInterval = setInterval(() => {
        state.timerSeconds++;
        timerDisplay.textContent = formatTime(state.timerSeconds);
        gameTimerDisplay.textContent = formatTime(state.timerSeconds);
    }, 1000);
}

function stopTimer() {
    state.timerRunning = false;
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
}

function goHome() {
    stopTimer();
    state.round = 1;
    roundDisplay.textContent = state.round;
    state.timerSeconds = 0;
    timerDisplay.textContent = '00:00';
    updateUI();
    gamePanel.classList.add('hidden');
    setupPanel.classList.remove('hidden');
}

function goToHub() {
    stopTimer();
    window.location.href = '../index.html';
}

function startGame() {
    setupPanel.classList.add('hidden');
    gamePanel.classList.remove('hidden');
    state.round = 1;
    roundDisplay.textContent = state.round;
    updateUI();
    startTimer();
}

function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

async function spin() {
    if (state.spinning) return;
    state.spinning = true;
    state.tooHot = false;
    spinButton.textContent = state.language === 'fr' ? 'Tourne...' : 'Spinning...';
    resultDisplay.textContent = '';
    resultDisplay.style.backgroundColor = '#f9f9f9';
    resultDisplay.style.color = '#555';

    slot1.classList.add('spinning');
    slot2.classList.add('spinning');
    slot3.classList.add('spinning');

    let spins = 0;
    const maxSpins = 20;
    const intervalTime = 100;

    let finalEmoji1, finalEmoji2, finalEmoji3;

    if (Math.random() < 0.7) {
        const forcedEmoji = getRandomEmoji();
        finalEmoji1 = forcedEmoji;
        finalEmoji2 = forcedEmoji;
        finalEmoji3 = forcedEmoji;
    } else {
        finalEmoji1 = getRandomEmoji();
        finalEmoji2 = getRandomEmoji();
        finalEmoji3 = getRandomEmoji();
    }

    const spinInterval = setInterval(() => {
        slot1.textContent = getRandomEmoji();
        slot2.textContent = getRandomEmoji();
        slot3.textContent = getRandomEmoji();
        spins++;

        if (spins > maxSpins) {
            clearInterval(spinInterval);
            state.spinning = false;
            spinButton.textContent = state.language === 'fr' ? 'Lancer' : 'Spin';
            slot1.classList.remove('spinning');
            slot2.classList.remove('spinning');
            slot3.classList.remove('spinning');

            slot1.textContent = finalEmoji1;
            slot2.textContent = finalEmoji2;
            slot3.textContent = finalEmoji3;

            checkResult(finalEmoji1, finalEmoji2, finalEmoji3);
        }
    }, intervalTime);
}

async function checkResult(emoji1, emoji2, emoji3) {
    if (emoji1 === emoji2 && emoji2 === emoji3) {
        const jackpotKey = emoji1 + emoji2 + emoji3;
        let challenge = null;
        let source = 'local';

        if (!state.tooHot) {
            try {
                const response = await fetch('/api/jackpot/challenge', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mode: state.mode,
                        round: state.round,
                        players: state.players,
                        history: state.history,
                        language: state.language,
                        emojiCombo: jackpotKey,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.source === 'ai' && data.challenge) {
                        challenge = data.challenge;
                        source = 'ai';
                    }
                }
            } catch (error) {
                console.error('AI challenge fetch failed:', error);
            }
        }

        if (!challenge) {
            const rule = state.jackpotRules[jackpotKey]?.[state.language];
            if (rule && rule.questions && rule.questions.length > 0) {
                const randomIndex = Math.floor(Math.random() * rule.questions.length);
                challenge = rule.questions[randomIndex];
                source = 'local';
            } else {
                challenge = state.language === 'fr' ? `Jackpot ! ${jackpotKey} - Bois !` : `Jackpot! ${jackpotKey} - Drink!`;
                source = 'local';
            }
        }

        state.history.push(challenge);
        if (state.history.length > 50) state.history.shift();

        const winningEmoji = emoji1;
        const emojiColor = emojiColors[winningEmoji] || '#f9f9f9';
        resultDisplay.style.backgroundColor = emojiColor;
        resultDisplay.style.color = 'white';

        const sourceLabel = source === 'ai' ? '[AI] ' : '';
        resultDisplay.innerHTML = `${jackpotKey}<br>${sourceLabel}${challenge}`;

        startEmojiRain(winningEmoji, 50);
        triggerEmojiExplosion(winningEmoji);

        state.round++;
        if (state.round > state.maxRounds) {
            state.round = 1;
        }
        roundDisplay.textContent = state.round;
        updateUI();
    } else {
        resultDisplay.style.backgroundColor = '#f9f9f9';
        resultDisplay.style.color = '#555';
        const messages = {
            fr: 'Pas de jackpot. Relance !',
            es: 'No hay jackpot. ¡Gira de nuevo!',
            it: 'Nessun jackpot. Gira di nuovo!',
            en: 'No jackpot. Spin again!'
        };
        resultDisplay.textContent = messages[state.language] || messages.en;
    }
}

function startEmojiRain(emoji, count) {
    if (!emojiRainContainer) return;
    emojiRainContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('falling-emoji');
        emojiElement.textContent = emoji;
        if (window.innerWidth <= 768) {
            const minLeft = 5;
            const maxLeft = 85;
            emojiElement.style.left = `${Math.random() * (maxLeft - minLeft) + minLeft}vw`;
        } else {
            const minLeft = 28;
            const maxLeft = 68;
            emojiElement.style.left = `${Math.random() * (maxLeft - minLeft) + minLeft}vw`;
        }
        emojiElement.style.animationDuration = `${Math.random() * 2 + 3}s`;
        emojiElement.style.animationDelay = `${Math.random() * 0.5}s`;
        emojiRainContainer.appendChild(emojiElement);
        emojiElement.addEventListener('animationend', () => emojiElement.remove());
    }
}

function triggerEmojiExplosion(emoji) {
    if (!emojiExplosionContainer) return;
    emojiExplosionContainer.innerHTML = '';
    const explosionEmoji = document.createElement('div');
    explosionEmoji.classList.add('emoji-explosion');
    explosionEmoji.textContent = emoji;
    explosionEmoji.style.left = '50%';
    explosionEmoji.style.top = '50%';
    emojiExplosionContainer.appendChild(explosionEmoji);
    explosionEmoji.addEventListener('animationend', () => explosionEmoji.remove());
}
