let actions_en = [];
let actions_fr = [];
let actions_es = [];

let currentLanguage = 'en';
var LANGUAGES = ['en', 'fr', 'es'];
var LANG_LABELS = { en: 'EN', fr: 'FR', es: 'ES' };

const suggestionText = document.getElementById('suggestion-text');
const generateBtn = document.getElementById('generate-btn');
const langChangeBtn = document.getElementById('lang-change-btn');
const langDropdown = document.getElementById('lang-dropdown');
const langOptionButtons = document.querySelectorAll('.lang-option');

var echoActive = false;
const timerDisplay = document.getElementById('timer-display');
if (timerDisplay) {
    timerDisplay.textContent = '\u23CF ' + '60s';
    timerDisplay.title = 'Click to skip to next dare';
    timerDisplay.addEventListener('click', function() {
        if (echoActive) {
            speakSorcerer('Next dare!', currentLanguage);
            setTimeout(function() {
                updateSuggestion();
            }, 800);
        }
    });
}
var ctx = null;
var echoBuffer = null;
var sorcererVoice = null;
var gameTimer = null;
var relaunchTimer = null;

var SORCERER_TEXT = {
    en: ['By the ancient spirits of the dungeon!', 'The shadows obey...', 'Echoes of the abyss...', 'You have been bewitched by the sorcerer! Do the dare or drink your potion!'],
    fr: ['Par les esprits anciens du donjon, druide gaulois!', 'Les ombres obeisissent a la force des celtes...', 'Echos de l abime celtique...', "Tu as ete enchante par le druide gaulois! Fais le defi ou bois ta potion de sorcier!"],
    es: ['Por los espiritus antiguos de la mazmorra!', 'Las sombras obedecen...', 'Ecos del abismo...', 'Has sido hechizado por el mago! Haz el reto o bebe tu pocion!']
};

var SORCERER_TAUNTS = {
    en: ['Still pondering that dare, mortal?', 'The shadows grow impatient!', 'Do you fear the dark?', 'Time ticks, little one.', 'Your courage is... interesting.'],
    fr: ['Tu hésites encore, mortel?', 'Les ombres deviennent impatenientes!', 'As-tu peur des ténèbres?', 'Le temps presse, petit.', 'Ton courage est... intéressant.'],
    es: ['¿Aun lo consideras, mortal?', '¡Las sombras se impacientan!', '¿Le temes a la oscuridad?', 'El tiempo apremia, pequeño.', 'Tu valentía es... interesante.']
};

async function fetchActions() {
    try {
        const response = await fetch('actions.json');
        const data = await response.json();
        actions_en = data.en;
        actions_fr = data.fr;
        actions_es = data.es;
        initSorcererVoice();
        updateGenerateButtonText();
        updateLangButton();
    } catch (error) {
        console.error('Error fetching actions:', error);
        suggestionText.textContent = 'Error loading actions. Please try again later.';
    }
    enableEchoMode();
}

function updateSuggestion() {
    let currentActions;
    if (currentLanguage === 'en') {
        currentActions = actions_en;
    } else if (currentLanguage === 'fr') {
        currentActions = actions_fr;
    } else if (currentLanguage === 'es') {
        currentActions = actions_es;
    }
    const randomIndex = Math.floor(Math.random() * currentActions.length);
    const dare = currentActions[randomIndex];
    suggestionText.textContent = dare;
    if (echoActive) {
        speakSorcerer(dare, currentLanguage);
        startTimers();
    }
}

function updateGenerateButtonText() {
    if (currentLanguage === 'en') {
        generateBtn.textContent = 'Generate';
    } else if (currentLanguage === 'fr') {
        generateBtn.textContent = 'Generer';
    } else if (currentLanguage === 'es') {
        generateBtn.textContent = 'Generar';
    }
}

generateBtn.addEventListener('click', updateSuggestion);

langOptionButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentLanguage = button.dataset.lang;
        cycleVoiceSmooth();
    });
});

function cycleVoiceSmooth() {
    setTimeout(function() {
        initSorcererVoice();
        updateGenerateButtonText();
        updateLangButton();
        if (echoActive) {
            speakSorcerer(SORCERER_TEXT[currentLanguage][3] || SORCERER_TEXT.en[3], currentLanguage);
            setTimeout(function() {
                updateSuggestion();
                startTimers();
            }, 1500);
        } else {
            updateSuggestion();
        }
    }, 200);
}

window.addEventListener('click', (event) => {
    if (!event.target.closest('.lang-dropdown-wrapper')) {
        if (langDropdown.classList.contains('show')) {
            langDropdown.classList.remove('show');
        }
    }
});

const suggestionBox = document.getElementById('suggestion-box');
if (suggestionBox) {
    suggestionBox.addEventListener('click', function() {
        if (echoActive) {
            speakSorcerer('Next dare!', currentLanguage);
            setTimeout(function() {
                updateSuggestion();
            }, 800);
        }
    });
}

fetchActions();

function updateLangButton() {
    if (!langChangeBtn) return;
    langChangeBtn.textContent = 'Language';
    if (langOptionButtons) {
        langOptionButtons.forEach(function(btn) {
            btn.style.opacity = btn.dataset.lang === currentLanguage ? '1' : '0.5';
        });
    }
}

function cycleLanguage() {
    var idx = LANGUAGES.indexOf(currentLanguage);
    currentLanguage = LANGUAGES[(idx + 1) % LANGUAGES.length];
    langDropdown.classList.remove('show');
    cycleVoiceSmooth();
}

if (langChangeBtn) {
    langChangeBtn.addEventListener('click', cycleLanguage);
}

updateLangButton();

function initSorcererVoice() {
    if (!window.speechSynthesis) return;
    var voices = speechSynthesis.getVoices();
    if (!voices.length) { setTimeout(initSorcererVoice, 300); return; }
    var pool = voices.filter(function(v) { return v.lang && v.lang.startsWith(currentLanguage); });
    if (!pool.length) pool = voices;
    sorcererVoice = pool.find(function(v) { return /male|david|alex|daniel|oliver|francois|pascal|cyprien|carlos|antonio|riccardo|thierry|sebastien|guillaume/i.test(v.name); }) || pool[0];
}

function speakSorcerer(text, lang) {
    if (!window.speechSynthesis || !text) return;
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = lang || currentLanguage;
    if (sorcererVoice) u.voice = sorcererVoice;
    u.pitch = 0.6;
    u.rate = 0.85;
    speechSynthesis.speak(u);
}

function initEcho() {
    if (ctx) return;
    try {
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        ctx = new AudioCtx();
        var sr = ctx.sampleRate;
        var len = sr * 0.4;
        var buf = ctx.createBuffer(1, len, sr);
        var data = buf.getChannelData(0);
        for (var i = 0; i < len; i++) {
            var t = i / sr;
            data[i] = Math.sin(2 * Math.PI * 120 * t) * Math.exp(-t * 8) * 0.15;
        }
        echoBuffer = buf;
    } catch (e) { ctx = null; }
}

function playEcho() {
    if (!echoActive || !ctx || !echoBuffer) return;
    try {
        var src = ctx.createBufferSource();
        src.buffer = echoBuffer;
        src.connect(ctx.destination);
        src.start(0);
    } catch (e) {}
}

function startTimers() {
    if (gameTimer) clearInterval(gameTimer);
    if (relaunchTimer) clearInterval(relaunchTimer);
    var timeLeft = 60;
    if (timerDisplay) {
        timerDisplay.textContent = '\u23CF ' + String(timeLeft) + 's';
        timerDisplay.classList.remove('hidden');
    }
    gameTimer = setInterval(function() {
        timeLeft--;
        if (timerDisplay) {
            timerDisplay.textContent = '\u23CF ' + String(timeLeft) + 's';
            timerDisplay.classList.remove('hidden');
        }
        if (timeLeft <= 0) {
            timeLeft = 60;
            if (timerDisplay) timerDisplay.textContent = '\u23CF ' + String(timeLeft) + 's';
            speakRandomSorcerer();
        }
    }, 1000);

    var tauntLeft = 20;
    relaunchTimer = setInterval(function() {
        tauntLeft--;
        if (tauntLeft <= 0) {
            tauntLeft = 20;
            speakTaunt();
        }
    }, 1000);
}

function speakTaunt() {
    var pool = SORCERER_TAUNTS[currentLanguage] || SORCERER_TAUNTS.en;
    speakSorcerer(pool[Math.floor(Math.random() * pool.length)], currentLanguage);
}

function stopAllTimers() {
    if (gameTimer) clearInterval(gameTimer);
    if (relaunchTimer) clearInterval(relaunchTimer);
    gameTimer = null;
    relaunchTimer = null;
    if (timerDisplay) timerDisplay.classList.add('hidden');
}

function speakRandomSorcerer() {
    var pool = SORCERER_TEXT[currentLanguage] || SORCERER_TEXT.en;
    speakSorcerer(pool[Math.floor(Math.random() * pool.length)], currentLanguage);
}

var echoToggleBtn = document.getElementById('echoDonjonBtn');

function toggleEcho() {
    echoActive = !echoActive;
    if (echoActive) {
        initEcho();
        initSorcererVoice();
        updateSuggestion();
        startTimers();
        if (echoToggleBtn) echoToggleBtn.classList.add('active');
    } else {
        stopAllTimers();
        if (window.speechSynthesis) speechSynthesis.cancel();
        if (echoToggleBtn) echoToggleBtn.classList.remove('active');
    }
}

function enableEchoMode() {
    echoActive = true;
    initEcho();
    initSorcererVoice();
    if (echoToggleBtn) echoToggleBtn.classList.add('active');
    setTimeout(function() {
        speakSorcerer(SORCERER_TEXT[currentLanguage][3] || SORCERER_TEXT.en[3], currentLanguage);
        setTimeout(function() {
            updateSuggestion();
            startTimers();
        }, 1500);
    }, 500);
}

if (echoToggleBtn) echoToggleBtn.addEventListener('click', toggleEcho);

document.querySelectorAll('button').forEach(function (btn) {
    if (btn.id === 'echoDonjonBtn' || btn.id === 'echo-sound-btn' || btn.id === 'timer-display' || btn.id === 'generate-btn' || btn.id === 'language-toggle-btn' || btn.id === 'backToHubBtn' || btn.id === 'lang-change-btn') return;
    btn.addEventListener('click', function() {
        playEcho();
        if (echoActive) {
            setTimeout(function() {
                speakRandomSorcerer();
            }, 500);
        }
    });
});
