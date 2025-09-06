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
let nextSpicy = Math.floor(Math.random() * 3) + 3; // 3 to 5

function t(key) {
    return gameContent[currentLanguage][key];
}

function updateUIText() {
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        element.innerText = t(key);
    });
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
        } while (newSpicyQuestionIndex === lastSpicyQuestionIndex);
        lastSpicyQuestionIndex = newSpicyQuestionIndex;
        return t('superSpicyQuestions')[newSpicyQuestionIndex];
    } else {
        isSpicy = false;
        let newQuestionIndex;
        do {
            newQuestionIndex = Math.floor(Math.random() * t('questions').length);
        } while (newQuestionIndex === lastQuestionIndex);
        lastQuestionIndex = newQuestionIndex;
        return t('questions')[newQuestionIndex];
    }
}

function getNewAction() {
    if (isSpicy) {
        let newSpicyActionIndex;
        do {
            newSpicyActionIndex = Math.floor(Math.random() * t('superSpicyActions').length);
        } while (newSpicyActionIndex === lastSpicyActionIndex);
        lastSpicyActionIndex = newSpicyActionIndex;
        return t('superSpicyActions')[newSpicyActionIndex];
    } else {
        let newActionIndex;
        do {
            newActionIndex = Math.floor(Math.random() * t('actions').length);
        } while (newActionIndex === lastActionIndex);
        lastActionIndex = newActionIndex;
        return t('actions')[newActionIndex];
    }
}

function displayNewQuestion() {
    questionText.classList.add('fade');
    choicesContainer.classList.add('hidden');
    actionModal.classList.add('hidden');
    card.classList.remove('super-spicy', 'glitch');

    setTimeout(() => {
        questionText.innerText = getNewQuestion();
        if (isSpicy) {
            card.classList.add('super-spicy');
            card.classList.add('glitch');
        }
        questionText.classList.remove('fade');
        choicesContainer.classList.remove('hidden');
    }, 500); // Match the CSS transition time
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

doButton.addEventListener('click', () => {
    actionText.innerText = getNewAction();
    actionModal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', () => {
    actionModal.classList.add('hidden');
});

nextQuestionButton.addEventListener('click', displayNewQuestion);

async function initGame() {
    try {
        const response = await fetch('game-content.json');
        gameContent = await response.json();
        updateUIText();
        displayNewQuestion();
    } catch (error) {
        console.error('Error loading game content:', error);
        // Fallback or error message to user
    }
}

initGame();

