let gameContent = {};
let currentLanguage = 'en';

const questionText = document.getElementById('question-text');
const nextQuestionButton = document.getElementById('next-question');
const choicesContainer = document.getElementById('choices');
const doButton = document.getElementById('do-button');
const actionModal = document.getElementById('action-modal');
const actionText = document.getElementById('action-text');
const closeModalButton = document.getElementById('close-modal');
const card = document.querySelector('.card');
const langMenuButton = document.getElementById('lang-menu-button');
const langModal = document.getElementById('lang-modal');
const closeLangModalButton = document.getElementById('close-lang-modal');

let lastQuestionIndex = -1;
let lastActionIndex = -1;
let lastSpicyQuestionIndex = -1;
let lastSpicyActionIndex = -1;

let isSpicy = false;
let questionCounter = 0;
let nextSpicy = Math.floor(Math.random() * 3) + 3;

let questionHistory = [];
let actionHistory = [];
let questionUsedSet = new Set();
let actionUsedSet = new Set();
let roundCounter = 1;
let totalClicks = 0;
let doClicks = 0;
let nextClicks = 0;
let aiChance = 0.25;
let currentNarrative = null;
let currentMostLikely = null;
let temporaryCardMessage = null;

const AI_TIMEOUT = 5000;

function t(key) {
    return gameContent[currentLanguage][key];
}

function updateUIText() {
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        element.innerText = t(key);
    });
}

function isPoolExhausted(type) {
    if (type === 'questions') {
        const pool = isSpicy ? t('superSpicyQuestions') : t('questions');
        return questionUsedSet.size >= pool.length;
    }
    if (type === 'actions') {
        const pool = isSpicy ? t('superSpicyActions') : t('actions');
        return actionUsedSet.size >= pool.length;
    }
    return false;
}

function getNewQuestion() {
    questionCounter++;
    if (questionCounter >= nextSpicy) {
        questionCounter = 0;
        nextSpicy = Math.floor(Math.random() * 3) + 3;
        isSpicy = true;
        let newSpicyQuestionIndex;
        do {
            newSpicyQuestionIndex = Math.floor(Math.random() * t('superSpicyQuestions').length);
        } while (newSpicyQuestionIndex === lastSpicyQuestionIndex && t('superSpicyQuestions').length > 1);
        lastSpicyQuestionIndex = newSpicyQuestionIndex;
        return t('superSpicyQuestions')[newSpicyQuestionIndex];
    } else {
        isSpicy = false;
        let newQuestionIndex;
        do {
            newQuestionIndex = Math.floor(Math.random() * t('questions').length);
        } while (newQuestionIndex === lastQuestionIndex && t('questions').length > 1);
        lastQuestionIndex = newQuestionIndex;
        return t('questions')[newQuestionIndex];
    }
}

function getNewAction() {
    if (isSpicy) {
        let newSpicyActionIndex;
        do {
            newSpicyActionIndex = Math.floor(Math.random() * t('superSpicyActions').length);
        } while (newSpicyActionIndex === lastSpicyActionIndex && t('superSpicyActions').length > 1);
        lastSpicyActionIndex = newSpicyActionIndex;
        return t('superSpicyActions')[newSpicyActionIndex];
    } else {
        let newActionIndex;
        do {
            newActionIndex = Math.floor(Math.random() * t('actions').length);
        } while (newActionIndex === lastActionIndex && t('actions').length > 1);
        lastActionIndex = newActionIndex;
        return t('actions')[newActionIndex];
    }
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
                history: type === 'question' ? questionHistory : type === 'action' ? actionHistory : [],
                round: roundCounter,
                lastAction: context.lastAction || '',
                players: context.players || [],
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

async function displayNewQuestion() {
    clearTemporaryCardMessage();
    currentNarrative = null;
    currentMostLikely = null;

    questionText.classList.add('fade');
    choicesContainer.classList.add('hidden');
    actionModal.classList.add('hidden');
    card.classList.remove('super-spicy', 'glitch');

    setTimeout(async () => {
        let content = null;
        const useAI = shouldUseAI() || isPoolExhausted('questions');

        if (useAI) {
            content = await fetchAIContent('question');
        }

        if (!content) {
            content = getNewQuestion();
            questionHistory.push(content);
            questionUsedSet.add(lastQuestionIndex !== -1 ? lastQuestionIndex : content);
        } else {
            questionHistory.push(content);
        }

        let displayText = content;

        if (shouldUseAI() && !isPoolExhausted('questions')) {
            const narrative = await fetchAIContent('narrative');
            if (narrative) {
                currentNarrative = narrative;
                displayText = `${narrative}\n\n${content}`;
            }
        }

        if (shouldUseAI()) {
            const mostLikely = await fetchAIContent('most_likely');
            if (mostLikely) {
                currentMostLikely = mostLikely;
                displayText = `${displayText}\n\n${mostLikely}`;
            }
        }

        questionText.innerText = displayText;
        if (isSpicy) {
            card.classList.add('super-spicy');
            card.classList.add('glitch');
        }
        questionText.classList.remove('fade');
        choicesContainer.classList.remove('hidden');
    }, 500);
}

function setLanguage(lang) {
    currentLanguage = lang;
    if (lang === 'ar') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }
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

document.querySelectorAll('.lang-select').forEach(button => {
    button.addEventListener('click', () => {
        setLanguage(button.getAttribute('data-lang'));
    });
});

doButton.addEventListener('click', async () => {
    doClicks++;
    totalClicks++;
    updateAdaptiveSpice();

    let action = null;
    const useAI = shouldUseAI() || isPoolExhausted('actions');

    if (useAI) {
        action = await fetchAIContent('action');
    }

    if (!action) {
        action = getNewAction();
        actionHistory.push(action);
        actionUsedSet.add(lastActionIndex !== -1 ? lastActionIndex : action);
    } else {
        actionHistory.push(action);
    }

    let displayAction = action;

    if (shouldUseAI()) {
        const comment = await fetchAIContent('sarcastic_comment');
        if (comment) {
            displayAction = `${action}\n\n— ${comment}`;
        }
    }

    actionText.innerText = displayAction;
    actionModal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', async () => {
    actionModal.classList.add('hidden');
    nextClicks++;
    totalClicks++;
    updateAdaptiveSpice();

    if (shouldUseAI() && actionHistory.length > 0) {
        const lastAction = actionHistory[actionHistory.length - 1];
        const consequence = await fetchAIContent('consequence', { lastAction });
        if (consequence) {
            showTemporaryCardMessage(consequence);
        }
    }
});

nextQuestionButton.addEventListener('click', () => {
    nextClicks++;
    totalClicks++;
    roundCounter++;
    updateAdaptiveSpice();
    displayNewQuestion();
});

async function initGame() {
    try {
        const response = await fetch('game-content.json');
        gameContent = await response.json();
        updateUIText();
        displayNewQuestion();
    } catch (error) {
        console.error('Error loading game content:', error);
    }
}

initGame();
