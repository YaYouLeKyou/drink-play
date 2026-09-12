(function () {
    'use strict';

    function isMobile() {
        return window.innerWidth <= 768;
    }

    var THEMES = [
        { id: 'agatha-christie', name: 'Classic', emoji: '🏚️', desc: 'Scénario complet', category: 'classic' },
        { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🌃', desc: 'Dystopie néon', category: 'scifi' },
        { id: 'film-noir', name: 'Film Noir', emoji: '🎩', desc: 'Noir des années 40', category: 'classic' },
    ];

    var ASSETS_BASE = 'assets/image true detective/';

    // Images CLASSIC (nouveaux assets lieux/classic + characteres/classic)
    var CLASSIC_ASSETS = {
        universe: ASSETS_BASE + 'lieux/classic/manoir.png',
        universeImg: ASSETS_BASE + 'univers/sherlock.jfif',
        crimeScene: ASSETS_BASE + 'lieux/classic/scene de crime manoir.png',
        detective: ASSETS_BASE + 'characteres/classic/detective-partenaire.png',
        femmeFatale: ASSETS_BASE + 'characteres/classic/femme-fatal.png',
        seducteur: ASSETS_BASE + 'characteres/classic/le-seducteur.png',
        suspect: ASSETS_BASE + 'characteres/classic/Le-suspect.png',
        marginal: ASSETS_BASE + 'characteres/classic/Le-marginal.png',
        protecteur: ASSETS_BASE + 'characteres/classic/Le_Protecteur.png',
        scientifique: ASSETS_BASE + 'characteres/classic/le-scientific.png',
        criminel: ASSETS_BASE + 'characteres/classic/le-criminel.png',
        residence: ASSETS_BASE + 'lieux/classic/interieur manoir.png',
        alley: ASSETS_BASE + 'lieux/classic/ruelle.png',
        publicPlace: ASSETS_BASE + 'lieux/classic/exterieur bar.png',
        barInterieur: ASSETS_BASE + 'lieux/classic/interieur bar.png',
        secretPlace: ASSETS_BASE + 'lieux/classic/appartement suspect.png',
        laboratory: ASSETS_BASE + 'lieux/classic/laboratoire.png',
        headquarters: ASSETS_BASE + 'lieux/classic/quartier general.png',
        prison: ASSETS_BASE + 'lieux/classic/prison.jfif',
        exile: ASSETS_BASE + 'lieux/classic/paradisique.png',
        music: 'sherlock.mp3',
    };

    var CYBERPUNK_ASSETS = {
        universe: ASSETS_BASE + 'lieux/cyberpunk/exterieur-manoir.png',
        universeImg: ASSETS_BASE + 'univers/cyberpunk.png',
        crimeScene: ASSETS_BASE + 'lieux/cyberpunk/scene-de-crime.png',
        detective: ASSETS_BASE + 'characteres/cyberpunk/detective-partenaire.png',
        femmeFatale: ASSETS_BASE + 'characteres/cyberpunk/femme-fatal.png',
        seducteur: ASSETS_BASE + 'characteres/cyberpunk/seducteur.png',
        suspect: ASSETS_BASE + 'characteres/cyberpunk/suspect.png',
        marginal: ASSETS_BASE + 'characteres/cyberpunk/marginal.png',
        protecteur: ASSETS_BASE + 'characteres/cyberpunk/protecteur.png',
        scientifique: ASSETS_BASE + 'characteres/cyberpunk/scientific.png',
        criminel: ASSETS_BASE + 'characteres/cyberpunk/criminel.png',
        residence: ASSETS_BASE + 'lieux/cyberpunk/interieur-manoir.png',
        alley: ASSETS_BASE + 'lieux/cyberpunk/ruelle.png',
        publicPlace: ASSETS_BASE + 'lieux/cyberpunk/exterieur bar.png',
        barInterieur: ASSETS_BASE + 'lieux/cyberpunk/interieur-bar.png',
        secretPlace: ASSETS_BASE + 'lieux/cyberpunk/appartement suspect.png',
        laboratory: ASSETS_BASE + 'lieux/cyberpunk/laboratoire.png',
        headquarters: ASSETS_BASE + 'lieux/cyberpunk/interieur-quartier-général.png',
        prison: ASSETS_BASE + 'lieux/cyberpunk/prison.png',
        exile: ASSETS_BASE + 'lieux/cyberpunk/paradisique.png',
        music: 'cyberpunk.mp3',
    };

    var FILM_NOIR_ASSETS = {
        universe: ASSETS_BASE + 'lieux/noire/exterieur manoir.png',
        universeImg: ASSETS_BASE + 'univers/noire.png',
        crimeScene: ASSETS_BASE + 'lieux/noire/scene de crime.png',
        detective: ASSETS_BASE + 'characteres/noire/detective partenaire.png',
        femmeFatale: ASSETS_BASE + 'characteres/noire/femme fatal.png',
        seducteur: ASSETS_BASE + 'characteres/noire/seducteur.png',
        suspect: ASSETS_BASE + 'characteres/noire/suspect.png',
        marginal: ASSETS_BASE + 'characteres/noire/marginal.png',
        protecteur: ASSETS_BASE + 'characteres/noire/protecteur.png',
        scientifique: ASSETS_BASE + 'characteres/noire/scientific.png',
        criminel: ASSETS_BASE + 'characteres/noire/criminel.png',
        residence: ASSETS_BASE + 'lieux/noire/exterieur manoir.png',
        alley: ASSETS_BASE + 'lieux/noire/ruelle.png',
        publicPlace: ASSETS_BASE + 'lieux/noire/exterieur bar.png',
        barInterieur: ASSETS_BASE + 'lieux/noire/interieur bar.png',
        secretPlace: ASSETS_BASE + 'lieux/noire/appartement suspect.png',
        laboratory: ASSETS_BASE + 'lieux/noire/laboratoire.png',
        headquarters: ASSETS_BASE + 'lieux/noire/interieur quartier général.png',
        prison: ASSETS_BASE + 'lieux/noire/prison.png',
        exile: ASSETS_BASE + 'lieux/noire/paradisiaque.png',
        music: 'noire.mp3',
    };

    // Un seul scénario classic : tous les thèmes pointent vers les assets classic
    var THEME_ASSETS = {
        'agatha-christie': CLASSIC_ASSETS,
        'cyberpunk': CYBERPUNK_ASSETS,
        'film-noir': FILM_NOIR_ASSETS,
    };

    var PHASE_MUSIC_TRACKS = {
        'recherche': 'recherche.mp3',
        'reflexion': 'reflexion.mp3',
        'enigme': 'enigme.mp3',
        'tension': 'stress.mp3',
        'mystere': 'Midnight Ticking.mp3',
    };

    var TEXTS = {
        en: {
            selectTheme: 'Select your investigation theme to begin',
            startGame: 'Start Investigation',
            resume: 'Resume Investigation',
            caseClosed: 'Case Closed',
            culprit: 'Culprit',
            motive: 'Motive',
            method: 'Method',
            theTruth: 'The Truth',
            newInvestigation: 'New Investigation',
            backToHub: 'Back to Hub',
            generatingInvestigation: 'Generating investigation...',
            loadingScene: 'Preparing the scene...',
            discoveredClues: 'Discovered Clues',
            investigationSteps: 'Investigation Steps',
            noClues: 'No clues discovered yet. Keep investigating!',
            noSteps: 'No investigation steps recorded yet.',
            clueCatForensic: 'Forensic',
            clueCatWitness: 'Witness',
            clueCatMotive: 'Motive',
            clueCatTimeline: 'Timeline',
            clueCatDialogue: 'Dialogue',
            clueCatOpportunity: 'Opportunity',
            clueCatScene: 'Scene',
            act: 'Act',
            scene: 'Scene',
            clues: 'Clues',
            skip: 'Skip',
            continue: 'Continue',
            nextPage: 'Next Page',
            talkToNPC: 'Ask a question',
            send: 'Send',
            questionPlaceholder: 'Ask the NPC something...',
            backToChoices: 'Back to choices',
            endConversation: 'End conversation',
            language: 'Language',
            english: 'English',
            french: 'Français',
             gameOver: 'Investigation Complete',
            resumeGame: 'Resume Investigation',
            noSavedGame: 'No saved investigation found',
            puzzlePlaceholder: 'Enter your answer...',
            submit: 'Submit',
            puzzleSolved: 'Correct! The puzzle is solved.',
            puzzleWrong: 'That doesn\'t seem right. Try again.',
            puzzleCorrect: 'Correct answer',
            you: 'You',
            narrator: 'Narrator',
            objective: 'Objective',
            dialogueHistory: 'Dialogue History',
            musicInfo: 'Music',
            sceneType: {
                investigation: 'Investigation',
                interrogation: 'Interrogation',
                puzzle: 'Puzzle',
                tension: 'Tension',
                revelation: 'Revelation',
                credits: 'Credits',
            },
        },
        fr: {
            selectTheme: 'Sélectionnez votre thème d\'enquête',
            startGame: 'Commencer l\'enquête',
            resume: 'Reprendre l\'enquête',
            caseClosed: 'Affaire Classée',
            culprit: 'Coupable',
            motive: 'Mobile',
            method: 'Méthode',
            theTruth: 'La Vérité',
            newInvestigation: 'Nouvelle Enquête',
            backToHub: 'Retour au Hub',
            generatingInvestigation: 'Génération de l\'enquête...',
            loadingScene: 'Préparation de la scène...',
            discoveredClues: 'Indices Découverts',
            investigationSteps: 'Étapes de l\'Enquête',
            noClues: 'Aucun indice découvert pour le moment.',
            noSteps: 'Aucune étape enregistrée pour le moment.',
            clueCatForensic: 'Expertise',
            clueCatWitness: 'Témoignage',
            clueCatMotive: 'Mobile',
            clueCatTimeline: 'Chronologie',
            clueCatDialogue: 'Dialogue',
            clueCatOpportunity: 'Occasion',
            clueCatScene: 'Scène',
            act: 'Acte',
            scene: 'Scène',
            clues: 'Indices',
            skip: 'Passer',
            continue: 'Continuer',
            nextPage: 'Page suivante',
            talkToNPC: 'Poser une question',
            send: 'Envoyer',
            questionPlaceholder: 'Demandez quelque chose au PNJ...',
            backToChoices: 'Retour aux choix',
            endConversation: 'Fin de la conversation',
            language: 'Langue',
            english: 'English',
            french: 'Français',
             gameOver: 'Enquête Terminée',
            resumeGame: 'Reprendre l\'enquête',
            noSavedGame: 'Aucune enquête sauvegardée',
            puzzlePlaceholder: 'Entrez votre réponse...',
            submit: 'Soumettre',
            puzzleSolved: 'Correct ! L\'énigme est résolue.',
            puzzleWrong: 'Cela ne semble pas correct. Réessayez.',
            puzzleCorrect: 'Bonne réponse',
            you: 'Vous',
            narrator: 'Narrateur',
            objective: 'Objectif',
            dialogueHistory: 'Historique des dialogues',
            musicInfo: 'Musique',
            sceneType: {
                investigation: 'Enquête',
                interrogation: 'Interrogatoire',
                puzzle: 'Énigme',
                tension: 'Tension',
                revelation: 'Révélation',
                credits: 'Crédits',
            },
        },
    };

    var $ = {
        homeScreen: document.getElementById('home-screen'),
        startBtn: document.getElementById('start-btn'),
        themeScreen: document.getElementById('theme-selector-screen'),
        gameScreen: document.getElementById('game-screen'),
        endScreen: document.getElementById('end-screen'),
        orientationToggle: document.getElementById('orientation-toggle'),
        orientationIcon: document.getElementById('orientation-icon'),
        minigameScreen: document.getElementById('minigame-screen'),
        gameModeScreen: document.getElementById('game-mode-screen'),
        gameModeBackBtn: document.getElementById('game-mode-back-btn'),
        minigameSelectScreen: document.getElementById('minigame-select-screen'),
        minigameTitle: document.getElementById('minigame-screen-title'),
        minigameContent: document.getElementById('minigame-screen-content'),
        minigameBackBtn: document.getElementById('minigame-back-btn'),
        minigameSkipBtn: document.getElementById('minigame-skip-btn'),
        minigameOverlay: document.getElementById('minigame-overlay'),
        minigameBgLayer: document.getElementById('minigame-bg-layer'),
        minigameNpcImage: document.getElementById('minigame-npc-image'),
        minigameDialogueText: document.getElementById('minigame-dialogue-text'),
        minigameSettingsToggle: document.getElementById('minigame-settings-toggle'),
        themeGrid: document.getElementById('theme-grid'),
            resumeBtn: document.getElementById('resume-btn'),
            startGameBtn: document.getElementById('start-game-btn'),
        bgLayer: document.getElementById('bg-layer'),
        npcImage: document.getElementById('npc-image'),
        characterLayer: document.getElementById('character-layer'),
        npcName: document.getElementById('npc-name'),
        dialogueText: document.getElementById('dialogue-text'),
        typeCursor: document.getElementById('type-cursor'),
        choicesContainer: document.getElementById('choices-container'),
        conversationInput: document.getElementById('conversation-input'),
        playerText: document.getElementById('player-text'),
        sendBtn: document.getElementById('send-btn'),
        currentAct: document.getElementById('current-act'),
        currentScene: document.getElementById('current-scene'),
        cluesCount: document.getElementById('clues-count'),
        clueIndicator: document.getElementById('clue-indicator'),
        notebookBtn: document.getElementById('notebook-btn'),
        voiceBtn: document.getElementById('voice-btn'),
        muteBtn: document.getElementById('mute-btn'),
        volumeBtn: document.getElementById('volume-btn'),
        typingBtn: document.getElementById('typing-btn'),
        settingsToggle: document.getElementById('mobile-settings-toggle'),
        settingsPanel: document.getElementById('settings-menu-panel'),
langEnBtn: document.getElementById('lang-en'),
    langFrBtn: document.getElementById('lang-fr'),
    langEnHomeBtn: document.getElementById('lang-en-home'),
    langFrHomeBtn: document.getElementById('lang-fr-home'),
    langEnThemeBtn: document.getElementById('lang-en-theme'),
    langFrThemeBtn: document.getElementById('lang-fr-theme'),
    restartBtn: document.getElementById('restart-btn'),
    gameBackToHubBtn: document.getElementById('game-back-to-hub-btn'),
        themeBackToHubBtn: document.getElementById('theme-back-to-hub-btn'),
        homeSettingsToggle: document.getElementById('home-mobile-settings-toggle'),
        homeSettingsPanel: document.getElementById('home-settings-panel'),
        soloGameBtn: document.getElementById('solo-game-btn'),
        minigameSelectBtn: document.getElementById('minigame-select-btn'),
        minigameSelectBackBtn: document.getElementById('minigame-select-back-btn'),
        musicInfo: document.getElementById('music-info'),
        narrationTimer: document.getElementById('narration-timer'),
        musicToggleBtn: document.getElementById('music-toggle-btn'),
        homeMusicToggleBtn: document.getElementById('home-music-toggle-btn'),
        themeMusicToggleBtn: document.getElementById('theme-music-toggle-btn'),
        themeSettingsToggle: document.getElementById('theme-settings-toggle'),
        themeSettingsPanel: document.getElementById('theme-settings-panel'),
        objectiveDisplay: document.getElementById('objective-display'),
        objectiveText: document.getElementById('objective-text'),
        dialogueHistory: document.getElementById('dialogue-history'),
        continueBtn: document.getElementById('continue-btn'),
        mobileContinueBtn: document.getElementById('mobile-continue-btn'),
        pageNav: document.getElementById('page-nav'),
        notebook: document.getElementById('notebook'),
        closeNotebookBtn: document.getElementById('close-notebook'),
        cluesList: document.getElementById('clues-list'),
        stepsList: document.getElementById('steps-list'),
        notebookTabBtns: document.querySelectorAll('.notebook-tab-btn'),
        notebookActiveTab: 'clues-all',
        loadingOverlay: document.getElementById('loading-overlay'),
        loadingText: document.getElementById('loading-text'),
        loadingDots: document.getElementById('loading-dots'),
        toast: document.getElementById('toast'),
        newInvestigationBtn: document.getElementById('new-investigation-btn'),
        hubBtn: document.getElementById('hub-btn'),
        backToHubBtn: document.getElementById('back-to-hub-btn'),
        solutionCulprit: document.getElementById('solution-culprit'),
        solutionMotive: document.getElementById('solution-motive'),
        solutionMethod: document.getElementById('solution-method'),
        solutionRevealText: document.getElementById('solution-revealed-text'),
        endScreenTitle: null,
    };

    function showScreen(screen) {
        if (!screen) return;
        screen.classList.remove('hidden');
        screen.classList.add('active');
    }

    function hideScreen(screen) {
        if (!screen) return;
        screen.classList.remove('active');
        screen.classList.add('hidden');
    }

    var ui = {
        language: 'fr',
        theme: null,
        isWaiting: false,
        isTyping: false,
        sceneCounter: 0,
        currentNPCId: null,
        currentSceneType: null,
        currentMusicPhase: null,
        puzzleData: null,
        typingSpeed: 35,
        skipPending: false,
        currentPage: 0,
        totalPages: 3,
        currentSequence: 'intro',
        phaseSequence: [],
        completedPhases: [],
        fallbackScript: null,
        fallbackCurrentAct: 0,
        fallbackCurrentScene: 0,
        usingFallback: false,
        narrationTimer: null,
        narrationSeconds: 30,
        narrationRemaining: 30,
        voiceInputEnabled: (function () {
            try {
                var raw = localStorage.getItem('trueDetective_settings');
                if (raw) { return JSON.parse(raw).voiceInputEnabled || false; }
            } catch (e) { /* ignore */ }
            return false;
        })(),
    };

    var _typeWriterTimeout = null;
    var _typeWriterCallback = null;
    var _currentDialogue = '';

    function getText(key) {
        var langTexts = TEXTS[ui.language] || TEXTS.en;
        return langTexts[key] || key;
    }

    function getThemeId() {
        if (!ui.theme) return 'agatha-christie';
        return typeof ui.theme === 'string' ? ui.theme : (ui.theme.id || 'agatha-christie');
    }

    var STORAGE_PREFIX = 'trueDetective_cache_';

    function getStorageKey(key) {
        return STORAGE_PREFIX + key;
    }

function saveSettings() {
    try {
        var settings = { voiceInputEnabled: ui.voiceInputEnabled, orientation: $.orientationToggle ? $.orientationToggle.getAttribute('aria-pressed') : 'vertical' };
        localStorage.setItem('trueDetective_settings', JSON.stringify(settings));
    } catch (e) { /* ignore */ }
}

    function toggleVoiceInputEnabled() {
        ui.voiceInputEnabled = !ui.voiceInputEnabled;
        saveSettings();
        updateVoiceButtonVisibility();
    }

    function updateVoiceButtonVisibility() {
        if (!$.voiceBtn) return;
        if (ui.voiceInputEnabled) {
            $.voiceBtn.classList.remove('voice-disabled');
            $.voiceBtn.title = 'Saisie vocale';
            $.voiceBtn.setAttribute('aria-label', 'Activer la saisie vocale');
        } else {
            $.voiceBtn.classList.add('voice-disabled');
            $.voiceBtn.title = 'Saisie vocale désactivée : activez-la dans les réglages développeur';
            $.voiceBtn.setAttribute('aria-label', 'Saisie vocale désactivée');
        }
    }

    function loadCachedScript(themeId, language) {
        try {
            var raw = localStorage.getItem(getStorageKey('script_' + themeId + '_' + language));
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.warn('[Cache] Failed to load cached script:', e.message);
        }
        return null;
    }

    function saveCachedScript(themeId, language, script) {
        try {
            localStorage.setItem(getStorageKey('script_' + themeId + '_' + language), JSON.stringify(script));
        } catch (e) {
            console.warn('[Cache] Failed to save cached script:', e.message);
        }
    }

    function loadCachedImages(themeId) {
        try {
            var raw = localStorage.getItem(getStorageKey('images_' + themeId));
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.warn('[Cache] Failed to load cached images:', e.message);
        }
        return null;
    }

    function saveCachedImages(themeId, imageData) {
        try {
            localStorage.setItem(getStorageKey('images_' + themeId), JSON.stringify(imageData));
        } catch (e) {
            console.warn('[Cache] Failed to save cached images:', e.message);
        }
    }

     function init() {
        $.endScreenTitle = $.endScreen ? $.endScreen.querySelector('h1') : null;
        updateVoiceButtonVisibility();
        renderThemeCards();
        checkSavedGame();
        setupEventListeners();
        updateVolumeButton();
        updateTypingSoundButton();
        // Initialize orientation from saved settings
        var savedSettings = { };
        try {
            var saved = localStorage.getItem('trueDetective_settings');
            if (saved) { savedSettings = JSON.parse(saved); }
        } catch (e) { /* ignore */ }
        if (savedSettings.orientation === 'horizontal' && $.orientationToggle) {
            $.gameScreen.classList.add('orientation-horizontal');
            $.orientationToggle.classList.add('active');
            $.orientationToggle.setAttribute('aria-pressed', 'true');
            if (document.getElementById('orientation-icon')) document.getElementById('orientation-icon').textContent = '→';
        } else {
            $.gameScreen.classList.add('orientation-vertical');
            if ($.orientationToggle) {
                $.orientationToggle.classList.remove('active');
                $.orientationToggle.setAttribute('aria-pressed', 'false');
            }
            if (document.getElementById('orientation-icon')) document.getElementById('orientation-icon').textContent = '↻';
        }
        updateLanguageUI();
        updateLanguageButtons();

        if (TDAudioService) {
            TDAudioService.setLanguage(ui.language);
        }

        if ($.homeScreen) {
            $.homeScreen.classList.add('active');
            hideLoading();
            if (TDAudioService && typeof window !== 'undefined' && window.DPMusicPlayer) {
                window.DPMusicPlayer.playTrack('generique.mp3');
            }
        }

        animateDots();
    }

    function animateDots() {
        var dots = ['', '.', '..', '...'];
        var i = 0;
        setInterval(function () {
            i = (i + 1) % dots.length;
            if ($.loadingDots) {
                $.loadingDots.textContent = dots[i];
            }
        }, 500);
    }

    function renderThemeCards() {
        $.themeGrid.innerHTML = '';
        var visibleThemes = THEMES.filter(function (th) {
            return th.id === 'agatha-christie' || th.id === 'cyberpunk' || th.id === 'film-noir';
        });
        visibleThemes.forEach(function (theme) {
            var card = document.createElement('div');
            card.className = 'theme-card';
            card.dataset.theme = theme.id;
            var assets = THEME_ASSETS[theme.id] || {};
            var bgImage = assets.universeImg || assets.universe || '';
            if (bgImage) {
                card.style.backgroundImage = 'url(' + bgImage + ')';
                card.style.backgroundSize = 'cover';
                card.style.backgroundPosition = 'center';
            }
            card.innerHTML =
                '<div class="theme-card-inner">' +
                '<div class="theme-emoji">' + theme.emoji + '</div>' +
                '<div class="theme-name">' + theme.name + '</div>' +
                '<div class="theme-desc">' + theme.desc + '</div>' +
                '</div>';
            card.addEventListener('click', function () {
                selectTheme(theme);
            });
            $.themeGrid.appendChild(card);
        });
    }

    function applyMusicHidden(hidden) {
        var player = document.getElementById('dp-music-player');
        if (player) player.classList.toggle('music-hidden', hidden);
        var labels = [
            document.getElementById('music-toggle-btn'),
            document.getElementById('minigame-music-toggle-btn'),
            document.getElementById('home-music-toggle-btn'),
            document.getElementById('theme-music-toggle-btn')
        ];
        labels.forEach(function (btn) {
            if (!btn) return;
            var txt = btn.querySelector('.btn-text-label');
            var ico = btn.querySelector('.btn-icon-label');
            if (txt) txt.textContent = hidden ? (ui.language === 'fr' ? 'Musique' : 'Show Music') : (ui.language === 'fr' ? 'Musique' : 'Music');
            if (ico) ico.textContent = hidden ? '🔇' : '🎵';
        });
        try { localStorage.setItem('td_music_hidden', hidden ? '1' : '0'); } catch (e) {}
    }

    function setupEventListeners() {
        if ($.startBtn) {
            $.startBtn.addEventListener('click', function () {
                if ($.homeScreen) {
                    $.homeScreen.classList.remove('active');
                    $.homeScreen.classList.add('hidden');
                }
                if ($.themeScreen) {
                    $.themeScreen.classList.remove('hidden');
                    $.themeScreen.classList.add('active');
                }
                if (window.DPMusicPlayer) {
                    window.DPMusicPlayer.playTrack('night ride.mp3');
                }
                hideLoading();
            });
        }

        if ($.langEnHomeBtn) {
            $.langEnHomeBtn.addEventListener('click', function () {
                setLanguage('en');
                updateLanguageUI();
            });
        }

        if ($.langFrHomeBtn) {
            $.langFrHomeBtn.addEventListener('click', function () {
                setLanguage('fr');
                updateLanguageUI();
            });
        }
        if ($.langEnThemeBtn) {
            $.langEnThemeBtn.addEventListener('click', function () { setLanguage('en'); });
        }
        if ($.langFrThemeBtn) {
            $.langFrThemeBtn.addEventListener('click', function () { setLanguage('fr'); });
        }

        if ($.resumeBtn) {
            $.resumeBtn.addEventListener('click', resumeGame);
        }

        if ($.startGameBtn) {
            $.startGameBtn.addEventListener('click', startGameFromConfig);
        }

        if ($.soloGameBtn) {
            $.soloGameBtn.addEventListener('click', function () {
                $.gameModeScreen.classList.remove('active');
                $.gameModeScreen.classList.add('hidden');
                startSoloGame();
            });
        }

        if ($.minigameSelectBtn) {
            $.minigameSelectBtn.addEventListener('click', function () {
                $.gameModeScreen.classList.remove('active');
                $.gameModeScreen.classList.add('hidden');
                $.minigameSelectScreen.classList.remove('hidden');
                $.minigameSelectScreen.classList.add('active');
            });
        }

        if ($.minigameSelectBackBtn) {
            $.minigameSelectBackBtn.addEventListener('click', function () {
                $.minigameSelectScreen.classList.remove('active');
                $.minigameSelectScreen.classList.add('hidden');
                $.gameModeScreen.classList.remove('hidden');
                $.gameModeScreen.classList.add('active');
            });
        }

        if ($.gameModeBackBtn) {
            $.gameModeBackBtn.addEventListener('click', function () {
                $.gameModeScreen.classList.remove('active');
                $.gameModeScreen.classList.add('hidden');
                $.homeScreen.classList.remove('hidden');
                $.homeScreen.classList.add('active');
                hidePageNav();
                checkSavedGame();
            });
        }

        // Minigame selection cards
        var minigameCards = document.querySelectorAll('.minigame-select-card');
        minigameCards.forEach(function (card) {
            card.addEventListener('click', function () {
                var minigameType = card.dataset.minigame;
                if (minigameType) {
                    launchMinigameFromSelection(minigameType);
                }
            });
        });

        if ($.mobileContinueBtn) {
            $.mobileContinueBtn.addEventListener('click', function () {
                // Le mode scénario configure le bouton desktop selon l'étape
                // courante : page suivante, mini-jeu, choix ou interrogation.
                if (typeof scr !== 'undefined' && scr && scr.active) {
                    if (ui.isTyping) {
                        skipTypeWriter();
                        return;
                    }
                    if ($.continueBtn && typeof $.continueBtn.onclick === 'function') {
                        $.continueBtn.onclick();
                    }
                    return;
                }
                handleContinue();
            });
        }

        if ($.settingsToggle && $.settingsPanel) {
            $.settingsToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                var open = $.settingsPanel.classList.toggle('open');
                $.settingsToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            $.settingsPanel.addEventListener('click', function (event) {
                event.stopPropagation();
            });
            document.addEventListener('click', closeSettingsMenu);
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') closeSettingsMenu();
            });
        }

        if ($.homeSettingsToggle && $.homeSettingsPanel) {
            $.homeSettingsToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                var open = $.homeSettingsPanel.classList.toggle('open');
                $.homeSettingsToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            $.homeSettingsPanel.addEventListener('click', function (event) {
                event.stopPropagation();
            });
            document.addEventListener('click', closeHomeSettingsMenu);
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') closeHomeSettingsMenu();
            });
        }

        // Plein écran : câblage générique pour tous les écrans (accueil, thème, mini-jeu…)
        var fullscreenBtns = document.querySelectorAll('[id$="-fullscreen-btn"]');
        Array.prototype.forEach.call(fullscreenBtns, function (btn) {
            btn.addEventListener('click', function (event) {
                event.stopPropagation();
                if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                    var el = document.documentElement;
                    if (el.requestFullscreen) { el.requestFullscreen(); }
                    else if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); }
                } else {
                    if (document.exitFullscreen) { document.exitFullscreen(); }
                    else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
                }
            });
        });

        if ($.themeSettingsToggle && $.themeSettingsPanel) {
            $.themeSettingsToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                var open = $.themeSettingsPanel.classList.toggle('open');
                $.themeSettingsToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            $.themeSettingsPanel.addEventListener('click', function (event) {
                event.stopPropagation();
            });
            document.addEventListener('click', closeThemeSettingsMenu);
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') closeThemeSettingsMenu();
            });
        }


        // Lecteur masqué par défaut dans True Detective (préférence mémorisée)
// Force hide music player on init
applyMusicHidden(true);

        function toggleMusicPlayer() {
            var player = document.getElementById('dp-music-player');
            if (!player) return;
            applyMusicHidden(!player.classList.contains('music-hidden'));
        }
        if ($.musicToggleBtn) {
            $.musicToggleBtn.addEventListener('click', toggleMusicPlayer);
        }
        var minigameMusicBtn = document.getElementById('minigame-music-toggle-btn');
        if (minigameMusicBtn) {
            minigameMusicBtn.addEventListener('click', toggleMusicPlayer);
        }

        if ($.homeMusicToggleBtn) {
            $.homeMusicToggleBtn.addEventListener('click', toggleMusicPlayer);
        }
        if ($.themeMusicToggleBtn) {
            $.themeMusicToggleBtn.addEventListener('click', toggleMusicPlayer);
        }
        
        // Add orientation toggle handler
        if ($.orientationToggle) {
            $.orientationToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                var htmlElement = document.documentElement;
                var isCurrentlyHorizontal = htmlElement.classList.contains('orientation-horizontal');
                var newOrientation = isCurrentlyHorizontal ? 'vertical' : 'horizontal';
                
                // Toggle the class on the game-screen element
                if (isCurrentlyHorizontal) {
                    $.gameScreen.classList.remove('orientation-horizontal');
                    $.gameScreen.classList.add('orientation-vertical');
                } else {
                    $.gameScreen.classList.remove('orientation-vertical');
                    $.gameScreen.classList.add('orientation-horizontal');
                }
                
                // Update the button's aria-pressed attribute
                $.orientationToggle.setAttribute('aria-pressed', newOrientation === 'horizontal');
                
                // Update the button icon
                const iconEl = document.getElementById('orientation-icon');
                if (iconEl) {
                    if (newOrientation === 'horizontal') {
                        iconEl.textContent = '→';
                    } else {
                        iconEl.textContent = '↻';
                    }
                }
                
                // Update localStorage to persist orientation
                var settings = { orientation: newOrientation };
                localStorage.setItem('trueDetective_settings', JSON.stringify(settings));
            });
        }

        if ($.sendBtn) {
            $.sendBtn.addEventListener('click', function () {
                sendPlayerText();
            });
        }

        if ($.playerText) {
            $.playerText.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendPlayerText();
                }
            });
        }

        if ($.muteBtn) {
            $.muteBtn.addEventListener('click', toggleMute);
        }

        if ($.volumeBtn) {
            $.volumeBtn.addEventListener('click', function () {
                TDAudioService.cycleVolume();
                updateVolumeButton();
            });
        }

        if ($.typingBtn) {
            $.typingBtn.addEventListener('click', toggleTypingSound);
        }

        if ($.voiceBtn) {
            $.voiceBtn.addEventListener('click', toggleVoiceInput);
        }

        if ($.notebookBtn) {
            $.notebookBtn.addEventListener('click', toggleNotebook);
        }

        if ($.closeNotebookBtn) {
            $.closeNotebookBtn.addEventListener('click', toggleNotebook);
        }

        setupNotebookTabs();

        if ($.newInvestigationBtn) {
            $.newInvestigationBtn.addEventListener('click', newInvestigation);
        }

        if ($.backToHubBtn) {
            $.backToHubBtn.addEventListener('click', function () {
                if (TDNarrativeEngine) {
                    TDNarrativeEngine.resetGame();
                }
                if (TDImageService) {
                    TDImageService.clearCache();
                }
                if (TDAudioService) {
                    TDAudioService.stopSpeaking();
                }
                window.location.href = '../index.html';
            });
        }

        if ($.hubBtn) {
            $.hubBtn.addEventListener('click', function () {
                if (TDNarrativeEngine) {
                    TDNarrativeEngine.resetGame();
                }
                if (TDImageService) {
                    TDImageService.clearCache();
                }
                if (TDAudioService) {
                    TDAudioService.stopSpeaking();
                }
                window.location.href = '../index.html';
            });
        }

        if ($.restartBtn) {
            $.restartBtn.addEventListener('click', function () {
                if (TDNarrativeEngine) {
                    TDNarrativeEngine.resetGame();
                }
                if (TDImageService) {
                    TDImageService.clearCache();
                }
                if (TDAudioService) {
                    TDAudioService.stopSpeaking();
                }
                $.themeScreen.classList.remove('hidden');
                $.themeScreen.classList.add('active');
                $.gameScreen.classList.add('hidden');
                $.gameScreen.classList.remove('active');
                $.endScreen.classList.add('hidden');
                $.endScreen.classList.remove('active');
                hidePageNav();
                checkSavedGame();
            });
        }

        if ($.gameBackToHubBtn) {
            $.gameBackToHubBtn.addEventListener('click', function () {
                if (TDNarrativeEngine) {
                    TDNarrativeEngine.resetGame();
                }
                if (TDImageService) {
                    TDImageService.clearCache();
                }
                if (TDAudioService) {
                    TDAudioService.stopSpeaking();
                }
                $.themeScreen.classList.add('hidden');
                $.gameScreen.classList.add('hidden');
                $.gameScreen.classList.remove('active');
                $.endScreen.classList.add('hidden');
                $.homeScreen.classList.remove('hidden');
                $.homeScreen.classList.add('active');
                hidePageNav();
                checkSavedGame();
            });
        }

        if ($.themeBackToHubBtn) {
            $.themeBackToHubBtn.addEventListener('click', function () {
                if (TDNarrativeEngine) {
                    TDNarrativeEngine.resetGame();
                }
                if (TDImageService) {
                    TDImageService.clearCache();
                }
                if (TDAudioService) {
                    TDAudioService.stopSpeaking();
                }
                $.themeScreen.classList.add('hidden');
                $.gameScreen.classList.add('hidden');
                $.endScreen.classList.add('hidden');
                $.homeScreen.classList.remove('hidden');
                $.homeScreen.classList.add('active');
                hidePageNav();
                checkSavedGame();
            });
        }

        if ($.minigameBackBtn) {
            $.minigameBackBtn.addEventListener('click', function () {
                var overlay = document.getElementById('minigame-overlay');
                if (overlay) {
                    overlay.classList.add('hidden');
                    overlay.querySelector('#minigame-screen-content').innerHTML = '';
                }
                if (window._minigameSkipHandler) {
                    window._minigameSkipHandler({ won: false });
                    window._minigameSkipHandler = null;
                }
            });
        }

        if ($.minigameSkipBtn) {
            $.minigameSkipBtn.addEventListener('click', function () {
                // Cleanup any active game
                if (typeof window._minigameCleanup === 'function') {
                    window._minigameCleanup();
                    window._minigameCleanup = null;
                }
                if (typeof window._interroSidebarCleanup === 'function') {
                    window._interroSidebarCleanup();
                    window._interroSidebarCleanup = null;
                }
                if (window._minigameSkipHandler) {
                    window._minigameSkipHandler({ won: false });
                    window._minigameSkipHandler = null;
                }
            });
        }

        var minigameSettingsToggle = document.getElementById('minigame-settings-toggle');
        var minigameSettingsPanel = document.getElementById('minigame-settings-panel');
        if (minigameSettingsToggle && minigameSettingsPanel) {
            minigameSettingsToggle.addEventListener('click', function () {
                var isOpen = minigameSettingsPanel.classList.toggle('open');
                minigameSettingsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
            document.addEventListener('click', function (e) {
                if (!minigameSettingsPanel.contains(e.target) && e.target !== minigameSettingsToggle) {
                    minigameSettingsPanel.classList.remove('open');
                    minigameSettingsToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }

        if ($.dialogueText) {
            $.dialogueText.addEventListener('click', function () {
                if (ui.isTyping) {
                    skipTypeWriter();
                }
            });
        }

        if ($.pageNav) {
            var dots = $.pageNav.querySelectorAll('.page-dot');
            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    var pageNum = parseInt(dot.getAttribute('data-page'), 10);
                    if (pageNum <= ui.currentPage && !ui.isWaiting && !ui.isTyping) {
                        goToPage(pageNum);
                    }
                });
            });
        }

        if ($.langEnBtn) {
            $.langEnBtn.addEventListener('click', function () { setLanguage('en'); });
        }
        if ($.langFrBtn) {
            $.langFrBtn.addEventListener('click', function () { setLanguage('fr'); });
        }

        // Click global pour skipper le typewriter n'importe où sur l'écran
        document.addEventListener('click', function (e) {
            if (ui.isTyping && typeof skipTypeWriter === 'function') {
                // Ne pas skipper si on clique sur un bouton ou un élément interactif
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                skipTypeWriter();
            }
        });
    }

    function closeSettingsMenu() {
        if ($.settingsPanel) $.settingsPanel.classList.remove('open');
        if ($.settingsToggle) $.settingsToggle.setAttribute('aria-expanded', 'false');
    }

    function closeHomeSettingsMenu() {
        if ($.homeSettingsPanel) $.homeSettingsPanel.classList.remove('open');
        if ($.homeSettingsToggle) $.homeSettingsToggle.setAttribute('aria-expanded', 'false');
    }

    function closeThemeSettingsMenu() {
        if ($.themeSettingsPanel) $.themeSettingsPanel.classList.remove('open');
        if ($.themeSettingsToggle) $.themeSettingsToggle.setAttribute('aria-expanded', 'false');
    }

    function updateLanguageUI() {
        var selectText = getText('selectTheme');
        var startGameText = getText('startGame') || 'Start Investigation';
        var themeSubtitle = $.themeScreen ? $.themeScreen.querySelector('p') : null;
        if (themeSubtitle) {
            themeSubtitle.textContent = selectText;
        }
        if ($.startGameBtn && !$.startGameBtn.classList.contains('hidden')) {
            $.startGameBtn.textContent = startGameText;
        }
        // Écran d'accueil : sous-titre + bouton de démarrage traduits
        var homeSubtitle = document.querySelector('.home-subtitle');
        if (homeSubtitle) {
            homeSubtitle.textContent = ui.language === 'fr'
                ? 'Enquête détective interactive. 8 univers, PNJ dynamiques et narration immersive.'
                : 'Interactive detective investigation. 8 universes, dynamic NPCs and immersive narration.';
        }
        if ($.startBtn) {
            $.startBtn.textContent = ui.language === 'fr' ? "Commencer l'enquête" : 'Start Investigation';
        }
        // Écran de sélection des mini-jeux : traduction via attributs data-i18n-*
        document.querySelectorAll('[data-i18n-title], [data-i18n-name], [data-i18n-desc], [data-i18n-diff]').forEach(function (el) {
            var fr = el.getAttribute('data-i18n-title') || el.getAttribute('data-i18n-name') || el.getAttribute('data-i18n-desc') || el.getAttribute('data-i18n-diff');
            var en = el.textContent;
            if (!fr) return;
            var text = ui.language === 'fr' ? fr : en;
            if (text) el.textContent = text;
        });
    }

    function setLanguage(lang) {
        var changed = (ui.language !== lang);
        ui.language = lang;
        if (TDAudioService) {
            TDAudioService.setLanguage(lang);
        }
        if (TDNarrativeEngine) {
            TDNarrativeEngine.setLanguage(lang);
        }
        updateLanguageUI();
        updateLanguageButtons();
        if (typeof applyMusicHidden === 'function') {
            var player = document.getElementById('dp-music-player');
            if (player) applyMusicHidden(player.classList.contains('music-hidden'));
        }
        // Mode scénario : ré-affiche la page courante dans la nouvelle langue
        if (changed && typeof scr !== 'undefined' && scr && scr.active && typeof renderScenarioPage === 'function' && !ui.isTyping) {
            renderScenarioPage();
        }
    }

    function updateLanguageButtons() {
        if ($.langEnBtn) {
            $.langEnBtn.classList.toggle('active-lang', ui.language === 'en');
        }
        if ($.langFrBtn) {
            $.langFrBtn.classList.toggle('active-lang', ui.language === 'fr');
        }
        // Boutons de l'écran d'accueil (sinon aucun retour visuel au clic)
        if ($.langEnHomeBtn) {
            $.langEnHomeBtn.classList.toggle('active-lang', ui.language === 'en');
        }
        if ($.langFrHomeBtn) {
            $.langFrHomeBtn.classList.toggle('active-lang', ui.language === 'fr');
        }
        if ($.langEnThemeBtn) {
            $.langEnThemeBtn.classList.toggle('active-lang', ui.language === 'en');
        }
        if ($.langFrThemeBtn) {
            $.langFrThemeBtn.classList.toggle('active-lang', ui.language === 'fr');
        }
    }

    function updateObjective(text) {
        if ($.objectiveText) {
            $.objectiveText.textContent = text || '';
        }
        if ($.objectiveDisplay) {
            $.objectiveDisplay.classList.toggle('hidden', !text);
        }
    }

    function updateMusicInfo(phase, themeId, skipAudio) {
        if (!$.musicInfo || !TDAudioService) { return; }
        var phaseLabel = TDAudioService.MUSIC_PHASES && TDAudioService.MUSIC_PHASES[phase]
            ? TDAudioService.MUSIC_PHASES[phase].label
            : (phase || 'Investigation');
        var icon = '🎵';
        if (phase === 'tension' || phase === 'revelation') { icon = '⚡'; }
        if (phase === 'credits') { icon = '🎬'; }
        if (phase === 'puzzle') { icon = '🧩'; }
        if (phase === 'interrogation') { icon = '🕵️'; }
        $.musicInfo.textContent = icon + ' ' + phaseLabel;
        $.musicInfo.className = 'music-info phase-' + phase;
        ui.currentMusicPhase = phase;
        // En mode scénario, la piste est déjà jouée par scrMusicPlaying() :
        // on ne laisse PAS setMusicPhase écraser le thème par une phase générique.
        if (!skipAudio && TDAudioService.setMusicPhase && TDAudioService.MUSIC_PHASE_TRACKS && TDAudioService.MUSIC_PHASE_TRACKS[phase]) {
            TDAudioService.setMusicPhase(phase);
        }
    }

    function checkSavedGame() {
        if (TDNarrativeEngine && TDNarrativeEngine.hasSavedGame()) {
            if ($.resumeBtn) {
                $.resumeBtn.classList.remove('hidden');
            }
        } else {
            if ($.resumeBtn) {
                $.resumeBtn.classList.add('hidden');
            }
        }
    }

    function selectTheme(theme) {
        ui.theme = theme;

        var cards = $.themeGrid.querySelectorAll('.theme-card');
        cards.forEach(function (card) {
            card.classList.remove('selected');
        });

        var selectedCard = $.themeGrid.querySelector('[data-theme="' + theme.id + '"]');
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        if ($.startGameBtn) {
            $.startGameBtn.classList.add('hidden');
        }

        // Auto-advance to game mode selection
        setTimeout(function () {
            if ($.themeScreen) {
                $.themeScreen.classList.add('hidden');
                $.themeScreen.classList.remove('active');
            }
            if ($.gameModeScreen) {
                $.gameModeScreen.classList.remove('hidden');
                $.gameModeScreen.classList.add('active');
            }
        }, 300);
    }

    function startGameFromConfig() {
        if (!ui.theme) {
            showToast(getText('selectTheme') || 'Please select a theme first.', true);
            return;
        }

        ui.theme = { id: ui.theme.id, name: ui.theme.name, emoji: ui.theme.emoji, desc: ui.theme.desc, category: ui.theme.category };

        // Show game mode selection screen
        $.themeScreen.classList.add('hidden');
        $.gameModeScreen.classList.remove('hidden');
        $.gameModeScreen.classList.add('active');
    }

    function startSoloGame() {
        $.gameModeScreen.classList.remove('active');
        $.gameModeScreen.classList.add('hidden');
        $.minigameSelectScreen.classList.add('hidden');

        // MODE SCÉNARIO V2 : si les phases + scénario sont chargés, on utilise le
        // fil conducteur complet (au lieu de la génération IA libre).
        if (window.TDPhases && window.TDScenario) {
            hideLoading();
            startScenarioGame();
            return;
        }

        if (TDAudioService) {
            TDAudioService.playThemeMusic(ui.theme.id);
            TDAudioService.setCurrentTheme(ui.theme.id);
        }
        updateMusicInfo('investigation', ui.theme.id);
        updateTypingSoundButton();
        showLoading(getText('generatingInvestigation'));

        var themeId = ui.theme.id;

        var cached = loadCachedScript(themeId, ui.language);
        if (cached && cached.acts) {
            ui.fallbackScript = cached;
            ui.usingFallback = true;
            ui.fallbackCurrentAct = 0;
            ui.fallbackCurrentScene = 0;
            saveCachedScript(themeId, ui.language, cached);
            hideLoading();
            startGameWithIntro(cached, themeId);
            return;
        }

        generateFallbackScript(themeId, ui.language)
            .then(function (script) {
                ui.fallbackScript = script;
                ui.usingFallback = true;
                ui.fallbackCurrentAct = 0;
                ui.fallbackCurrentScene = 0;
                saveCachedScript(themeId, ui.language, script);
                hideLoading();
                startGameWithIntro(script, themeId);
            })
            .catch(function (fallbackErr) {
                hideLoading();
                showToast('Failed to generate investigation', true);
            });
    }

    function generateFallbackScript(themeId, language) {
        var theme = THEMES.find(function (t) { return t.id === themeId; }) || THEMES[0];
        var assets = THEME_ASSETS[themeId] || THEME_ASSETS['agatha-christie'];

        var isFR = language === 'fr';

        var npcs = [
            { id: 'detective-partner', name: 'Inspecteur Wexford', role: 'detective', archetype: 'detective', imageUrl: assets.detective },
            { id: 'femme-fatale', name: isFR ? 'Lady Vivienne' : 'Lady Vivienne', role: 'femme_fatale', archetype: 'femme_fatale', imageUrl: assets.femmeFatale },
            { id: 'seducteur', name: isFR ? 'Julian Pembrooke' : 'The Seducteur', role: 'seducteur', archetype: 'informant', imageUrl: assets.seducteur },
            { id: 'suspect', name: isFR ? 'Rupert Blackwood' : 'Rupert Blackwood', role: 'suspect_rich', archetype: 'suspect_rich', imageUrl: assets.suspect },
            { id: 'marginal', name: isFR ? 'Silas Crane' : 'Silas Crane', role: 'outsider', archetype: 'outsider', imageUrl: assets.marginal },
        ];

        var investigationScenes = [
            { type: 'investigation', location: theme.name + ' investigation', npcId: 'detective-partner', dialogue: isFR
                ? 'Nous commençons l\'enquête. Regardez autour de vous, cherchez des indices.'
                : 'We begin the investigation. Look around, search for clues.',
                objective: isFR ? 'Discutez avec le détective pour trouver des indices.' : 'Discuss with the detective to find clues.',
                choices: isFR
                    ? ['Examiner la pièce', 'Questionner le détective', 'Chercher des preuves']
                    : ['Examine the room', 'Question the detective', 'Search for evidence'],
                musicPhase: 'investigation' },
            { type: 'investigation', location: 'Crime scene analysis', npcId: 'detective-partner', dialogue: isFR
                ? 'Laissez-moi analyser les preuves avec vous. Chaque détail compte.'
                : 'Let me analyze the evidence with you. Every detail matters.',
                objective: isFR ? 'Analysez la scène de crime pour découvrir des indices.' : 'Analyze the crime scene to discover clues.',
                choices: isFR
                    ? ['Analyser les empreintes', 'Examiner les témoignages', 'Reveindiquer la scène']
                    : ['Analyze footprints', 'Examine testimonies', 'Revisit the scene'],
                musicPhase: 'investigation' },
            { type: 'investigation', location: 'Suspect identification', npcId: 'detective-partner', dialogue: isFR
                ? 'Nous avons identifié trois suspects. Choisissez celui à interroger en premier.'
                : 'We have identified three suspects. Choose who to interrogate first.',
                objective: isFR ? 'Choisissez un suspect à interroger parmi les trois.' : 'Select a suspect to interrogate from the three.',
                choices: [isFR ? 'Lady Vivienne' : 'Lady Vivienne', isFR ? 'Julian Pembrooke' : 'The Seducteur', isFR ? 'Rupert Blackwood' : 'Rupert Blackwood'],
                musicPhase: 'investigation' },
        ];

        var interrogationScenes = [
            { type: 'interrogation', location: 'Suspect residence', npcId: 'femme-fatale', dialogue: isFR
                ? 'Je ne sais pas ce que vous cherchez, détective. Mais je peux vous aider... pour un prix.'
                : 'I don\'t know what you\'re looking for, detective. But I can help you... for a price.',
                objective: isFR ? 'Interrogez Lady Vivienne pour obtenir des informations.' : 'Interrogate Lady Vivienne to obtain information.',
                choices: isFR
                    ? ['Presser la femme fatale', 'Lui proposer un échange', 'Menacer indirectement']
                    : ['Press the femme fatale', 'Offer a deal', 'Imply threats'],
                musicPhase: 'tension' },
        ];

        var revelationScenes = [
            { type: 'revelation', location: 'Final confrontation', npcId: 'detective-partner', dialogue: isFR
                ? 'C\'est fait. L\'enquête est terminée.'
                : 'It\'s done. The investigation is complete.',
                objective: isFR ? 'La vérité est enfin révélée.' : 'The truth is finally revealed.',
                choices: [],
                musicPhase: 'revelation' },
            { type: 'credits', location: 'Case closed', npcId: null, dialogue: isFR
                ? 'Affaire classée.'
                : 'Case closed.',
                objective: isFR ? 'La vérité est enfin révélée.' : 'The truth is finally revealed.',
                choices: [],
                musicPhase: 'credits' },
        ];

        var script = {
            theme: themeId,
            language: language,
            setting: theme.name + ' investigation',
            npcs: npcs,
            acts: [
                { setting: theme.name + ' investigation', musicPhase: 'investigation', scenes: investigationScenes },
                { setting: 'Suspect interrogation', musicPhase: 'tension', scenes: interrogationScenes },
                { setting: 'Final truth', musicPhase: 'revelation', scenes: revelationScenes },
            ],
            solution: { culprit: 'Lady Vivienne', motive: isFR ? 'Vengeance' : 'Revenge', method: isFR ? 'Tromperie' : 'Deception', revealed: isFR ? 'La vérité était cachée dans le conflit entre les trois suspects.' : 'The truth was hidden in the conflict between the three suspects.' },
        };

        return Promise.resolve(script);
    }

    function startGameWithIntro(script, themeId) {
        if (typeof ui.theme === 'string') {
            var themeObj = THEMES.find(function (t) { return t.id === themeId; });
            ui.theme = themeObj || { id: themeId };
        }
        ui.sceneCounter = 0;

        $.themeScreen.classList.add('hidden');
        $.endScreen.classList.add('hidden');
        $.gameScreen.classList.remove('hidden');
        $.gameScreen.classList.add('active');
        updateIndicators();

        var firstScene = null;
        if (script.acts && script.acts.length) {
            firstScene = script.acts[0].scenes[0] || null;
        } else if (script.act1 && script.act1.scenes) {
            firstScene = script.act1.scenes[0] || null;
        }

        if (!firstScene) {
            showToast('No scenes available in the investigation.', true);
            return;
        }

        var sceneType = firstScene.type || 'investigation';
        ui.currentSceneType = sceneType;

        var sceneData = {
            dialogue: firstScene.dialogue || 'The investigation begins...',
            location: firstScene.location || 'Scene location',
            npcId: firstScene.npcId || null,
            type: sceneType,
            objective: firstScene.objective || getDefaultObjective(sceneType),
            choices: firstScene.choices || getDefaultChoices(sceneType),
            clue: firstScene.clue || null,
            event: null,
            musicPhase: sceneType,
            nextActTransition: null,
            gameComplete: false,
            solution: null,
        };
        if (sceneData.clue) {
            if (TDNarrativeEngine) {
                TDNarrativeEngine.addClue(sceneData.clue, 'scene');
            }
            showClueToast(sceneData.clue);

        }

        updateObjective(sceneData.objective);

        var savedScript = null;
        if (TDNarrativeEngine) {
            var state = TDNarrativeEngine.getGameState();
            savedScript = state ? state.script : null;
        }

        var introPages = buildIntroPages(script);

        preGenerateIntroFirstPage(introPages[0], function () {
            if (TDAudioService && TDAudioService.playThemeMusic) {
                TDAudioService.playThemeMusic(themeId);
            }
            var themeObj = THEMES.find(function (t) { return t.id === themeId; }) || {};
            if ($.musicInfo) {
                $.musicInfo.textContent = '🎵 ' + (themeObj.name || 'Intro');
            }
            showNarrationSequence(introPages, function () {
                displayScene(sceneData, false);
            }, 'intro');
        });
    }

    function preGenerateIntroFirstPage(firstPage, callback) {
        if (firstPage.bgImage) {
            setBackground(firstPage.bgImage);
            callback();
            return;
        }
        var themeId = getThemeId();
        var musicPrompt = '';
        if (TDAudioService && TDAudioService.getThemeMusic) {
            musicPrompt = TDAudioService.getThemeMusic(themeId);
        }
        if (firstPage.bgImage) {
            setBackground(firstPage.bgImage);
            callback();
            return;
        }
        var bgPromise = TDImageService
            ? TDImageService.generateSceneBackground(firstPage.location || 'detective scene', themeId, musicPrompt)
            : Promise.resolve(null);

        bgPromise.then(function (bgUrl) {
            if (bgUrl) {
                setBackground(bgUrl);
            }
            callback();
        }).catch(function () {
            callback();
        });
    }

    function resumeGame() {
        if (!TDNarrativeEngine) return;

        showLoading(getText('loadingScene'));

        var state = TDNarrativeEngine.resumeGame();
        if (state && state.script) {
            ui.theme = state.theme || 'agatha-christie';
            ui.sceneCounter = state.playerChoices.length;

            var lastScene = TDNarrativeEngine.getLastSceneData();
            if (lastScene && !lastScene.gameComplete) {
                hideLoading();
                updateIndicators();
                ui.currentSceneType = lastScene.type || 'investigation';
                updateMusicInfo(lastScene.musicPhase || ui.currentSceneType, ui.theme);
                updateObjective(lastScene.objective || '');
                displayScene(lastScene, true);
                $.themeScreen.classList.add('hidden');
                $.gameScreen.classList.remove('hidden');
                $.gameScreen.classList.add('active');
                $.endScreen.classList.add('hidden');
            } else if (state.script && state.script.acts && state.script.acts[0]) {
                hideLoading();
                ui.sceneCounter = 0;
                var firstScene = state.script.acts[0].scenes[0];
                firstScene.type = firstScene.type || 'investigation';
                ui.currentSceneType = firstScene.type;
                var sceneData = {
                    dialogue: firstScene.dialogue || 'The investigation begins...',
                    location: firstScene.location || 'Scene location',
                    npcId: firstScene.npcId || null,
                    type: firstScene.type,
                    objective: firstScene.objective || getDefaultObjective(firstScene.type),
                    choices: firstScene.choices || getDefaultChoices(firstScene.type),
                    clue: firstScene.clue || null,
                    event: null,
                    musicPhase: firstScene.type,
                    nextActTransition: null,
                    gameComplete: false,
                    solution: null,
                };
                 if (sceneData.clue) {
                    TDNarrativeEngine.addClue(sceneData.clue, 'scene');
                    showClueToast(sceneData.clue);
                }
                updateMusicInfo(firstScene.type, ui.theme);
                updateObjective(sceneData.objective);
                displayScene(sceneData, false);
                $.themeScreen.classList.add('hidden');
                $.gameScreen.classList.remove('hidden');
                $.gameScreen.classList.add('active');
                $.endScreen.classList.add('hidden');
            }
        } else {
            showToast(getText('noSavedGame'), true);
        }
    }

    function startGame(script, themeId) {
        ui.theme = themeId;
        ui.sceneCounter = 0;

        $.themeScreen.classList.add('hidden');
        $.endScreen.classList.add('hidden');
        $.gameScreen.classList.remove('hidden');
        $.gameScreen.classList.add('active');
        updateIndicators();

        var firstScene = null;
        if (script.acts && script.acts.length) {
            firstScene = script.acts[0].scenes[0] || null;
        } else if (script.act1 && script.act1.scenes) {
            firstScene = script.act1.scenes[0] || null;
        }

        if (!firstScene) {
            showToast('No scenes available in the investigation.', true);
            return;
        }

        var sceneType = firstScene.type || 'investigation';
        ui.currentSceneType = sceneType;

        var sceneData = {
            dialogue: firstScene.dialogue || 'The investigation begins...',
            location: firstScene.location || 'Scene location',
            npcId: firstScene.npcId || null,
            type: sceneType,
            objective: firstScene.objective || getDefaultObjective(sceneType),
            choices: firstScene.choices || getDefaultChoices(sceneType),
            clue: firstScene.clue || null,
            event: null,
            musicPhase: sceneType,
            nextActTransition: null,
            gameComplete: false,
            solution: null,
        };

        if (sceneData.clue) {
            if (TDNarrativeEngine) {
                TDNarrativeEngine.addClue(sceneData.clue, 'scene');
            }
            showClueToast(sceneData.clue);
        }

        if (TDAudioService && TDAudioService.playThemeMusic) {
            TDAudioService.playThemeMusic(themeId);
        }
        var themeObj = THEMES.find(function (t) { return t.id === themeId; }) || {};
        if ($.musicInfo) {
            $.musicInfo.textContent = '🎵 ' + (themeObj.name || 'Intro');
        }
        updateObjective(sceneData.objective);

        var script = TDNarrativeEngine ? TDNarrativeEngine.getGameState().script : null;
        if (script) {
            var introPages = buildIntroPages(script);
            showNarrationSequence(introPages, function () {
                displayScene(sceneData, false);
            }, 'intro');
        } else {
            displayScene(sceneData, false);
        }
    }

    function getDefaultObjective(sceneType) {
        var defaults = {
            investigation: 'Search the scene for hidden clues.',
            interrogation: 'Extract information from the NPC.',
            puzzle: 'Solve the puzzle to unlock a clue.',
            tension: 'Make a quick decision under pressure.',
            revelation: 'A major plot twist is about to be revealed.',
            credits: 'The truth is finally revealed.',
        };
        return defaults[sceneType] || defaults.investigation;
    }

    function getDefaultChoices(sceneType) {
        var defaults = {
            investigation: ['Search thoroughly', 'Examine nearby objects', 'Question witnesses'],
            interrogation: ['Press about alibi', 'Ask about the crime', 'Challenge inconsistencies'],
            puzzle: ['Try solution A', 'Try solution B', 'Request a hint'],
            tension: ['Confront directly', 'Sneak away quietly', 'Call for backup'],
        };
        return defaults[sceneType] || ['Continue investigating'];
    }

    function updatePageDots() {
        if (!$.pageNav) { return; }
        var dots = $.pageNav.querySelectorAll('.page-dot');
        dots.forEach(function (dot, idx) {
            dot.classList.toggle('active', idx + 1 === ui.currentPage);
        });
    }

    function showPageNav() {
        if ($.pageNav) {
            $.pageNav.classList.remove('hidden');
        }
    }

    function hidePageNav() {
        if ($.pageNav) {
            $.pageNav.classList.add('hidden');
        }
    }

    function goToPage(pageNum) {
        if (pageNum < 1 || pageNum > ui.totalPages) { return; }
        if (pageNum > ui.currentPage && ui.isWaiting) { return; }
        ui.currentPage = pageNum;
        updatePageDots();
        renderCurrentPage();
    }

    function nextPage() {
        if (ui.currentPage < ui.totalPages) {
            goToPage(ui.currentPage + 1);
        }
    }

    function renderCurrentPage() {
        if (!ui.currentSceneData) { return; }

        var page = ui.currentPage;
        var sd = ui.currentSceneData;
        var pageData = null;

        if (sd.pages && sd.pages[page - 1]) {
            pageData = sd.pages[page - 1];
        } else if (sd.type === 'narration') {
            pageData = sd.pages ? sd.pages[page - 1] : null;
        }

        if (!pageData) {
            pageData = buildPageData(sd, page);
        }

        renderPageContent(pageData, page, sd);
    }

    function buildPageData(sceneData, pageNumber) {
        var location = sceneData.location || 'detective scene';
        var npc = null;
        if (sceneData.npcId && TDNarrativeEngine) {
            npc = TDNarrativeEngine.getNPC(sceneData.npcId);
        }

        if (pageNumber === 1) {
            return {
                pageType: 'wide_shot',
                text: sceneData.pageTexts && sceneData.pageTexts[0] ||
                    (sceneData.location ? 'The investigation leads to ' + sceneData.location + '.' : 'The scene is set.'),
                location: location,
                showNPC: false,
                npcId: null,
                isDialogue: false,
            };
        }

        if (pageNumber === 2) {
            return {
                pageType: 'character_enter',
                text: sceneData.pageTexts && sceneData.pageTexts[1] ||
                    (npc ? (npc.name || 'Someone') + ' arrives at the scene.' : 'Something is approaching.'),
                location: location,
                showNPC: true,
                npcId: sceneData.npcId || null,
                npcImageFull: true,
                isDialogue: false,
            };
        }

        return {
            pageType: 'closeup',
            text: sceneData.dialogue || '...',
            location: location,
            showNPC: true,
            npcId: sceneData.npcId || null,
            npcImageCloseup: true,
            isDialogue: true,
            choices: sceneData.choices,
            puzzle: sceneData.puzzle,
            objective: sceneData.objective,
            musicPhase: sceneData.musicPhase,
        };
    }

    function buildIntroPages(script) {
        var theme = THEMES.find(function (t) { return t.id === script.theme; }) || THEMES[0];
        var themeName = theme ? theme.name : script.theme;
        var assets = THEME_ASSETS[script.theme] || THEME_ASSETS['agatha-christie'];
        var location = script.setting || 'the investigation site';
        var introNPC = script.npcs && script.npcs.length ? script.npcs[0] : null;

        var introText = {
            en: [
                'Welcome to the ' + themeName + ' case. As the detective says, "Every mystery begins with a single clue." The stage is set in this world where truth waits in the shadows.',
                'The crime scene has been secured. Something went terribly wrong here. The detective examines the evidence, searching for the truth among the debris.',
                'I am your partner in this investigation. Calm, methodical, and always thorough. Together, we will uncover what lies beneath the surface.',
            ],
            fr: [
                'Bienvenue dans l\'enquête ' + themeName + '. Comme le dit le détective: "Chaque mystère commence par une seule piste." La scène est dressée dans cet univers où la vérité attend dans les ombres.',
                'La scène de crime est sécurisée. Quelque chose s\'est terriblement mal passé ici. Le détective examine les preuves, cherchant la vérité parmi les débris.',
                'Je suis votre partenaire dans cette enquête. Calme, méthodique et toujours approfondi. Ensemble, nous découvrirons ce qui se cache sous la surface.',
            ],
        };
        var texts = ui.language === 'fr' ? introText.fr : introText.en;

        return [
            {
                pageType: 'wide_shot',
                bgImage: assets.universe,
                text: texts[0],
                location: themeName + ' universe',
                showNPC: false,
                npcId: null,
                isDialogue: false,
            },
            {
                pageType: 'wide_shot',
                bgImage: assets.crimeScene,
                text: texts[1],
                location: 'Crime scene',
                showNPC: false,
                npcId: null,
                isDialogue: false,
            },
            {
                pageType: 'character_enter',
                bgImage: assets.crimeScene,
                text: texts[2],
                location: 'Crime scene',
                showNPC: true,
                npcId: 'detective-partner',
                npcName: 'Partner',
                npcImageUrl: assets.detective,
                npcImageFull: true,
                isDialogue: false,
            },
        ];
    }

     function buildTransitionPages(sceneData) {
        var themeId = getThemeId();
        var theme = THEMES.find(function (t) { return t.id === themeId; }) || THEMES[0];
        var themeName = theme ? theme.name : themeId;
        var assets = THEME_ASSETS[themeId] || THEME_ASSETS['agatha-christie'];
        var npc = getNPCById(sceneData.npcId) || null;
        var npcName = npc ? npc.name : '';
        var npcAsset = assets.marginal;
        if (sceneData.npcId === 'femme-fatale') { npcAsset = assets.femmeFatale; npcAsset = assets.femmeFatale; }
        if (sceneData.npcId === 'seducteur') npcAsset = assets.seducteur;
        if (sceneData.npcId === 'suspect') npcAsset = assets.suspect;
        if (npcAsset === assets.marginal && sceneData.npcId === 'detective-partner') npcAsset = assets.detective;

        var transText = {
            en: [
                'The investigation leads us through ' + themeName + '. The detective follows a new lead.',
                'In the shadows of ' + themeName + ', a figure watches. They may know something about the case.',
                'We have arrived at the suspect\'s location. The detective is ready to make contact.',
            ],
            fr: [
                'L\'enquête nous mène à travers ' + themeName + '. Le détective suit une nouvelle piste.',
                'Dans les ombres de ' + themeName + ', une figure regarde. Ils pourraient savoir quelque chose sur l\'affaire.',
                'Nous avons arrivé à l\'endroit du suspect. Le détective est prêt à prendre contact.',
            ],
        };
        var texts = ui.language === 'fr' ? transText.fr : transText.en;

        return [
            {
                pageType: 'wide_shot',
                bgImage: assets.alley,
                text: texts[0],
                location: 'Dark alley',
                showNPC: false,
                npcId: null,
                isDialogue: false,
            },
            {
                pageType: 'character_enter',
                bgImage: assets.alley,
                text: texts[1],
                location: 'Dark alley',
                showNPC: true,
                npcId: 'marginal',
                npcName: npcName || 'Silas Crane',
                npcImageFull: true,
                npcImageUrl: npcAsset,
                isDialogue: false,
            },
            {
                pageType: 'wide_shot',
                bgImage: assets.residence,
                text: texts[2],
                location: 'Suspect residence',
                showNPC: true,
                npcId: sceneData.npcId || null,
                npcName: npcName,
                npcImageFull: true,
                npcImageUrl: npcAsset,
                isDialogue: false,
            },
        ];
    }

    function renderPageContent(pageData, pageNumber, sceneData) {
        $.choicesContainer.innerHTML = '';
        $.conversationInput.classList.add('hidden');
        $.continueBtn.classList.remove('hidden');
        if ($.mobileContinueBtn) {
            $.mobileContinueBtn.classList.remove('hidden');
        }
        $.npcName.textContent = '';

        updatePageDots();

        if (pageNumber < ui.totalPages) {
            $.continueBtn.classList.remove('hidden');
            $.continueBtn.textContent = getText('nextPage') || 'Next';
        } else {
            if (!isMobile()) {
                $.continueBtn.classList.add('hidden');
            }
            $.continueBtn.textContent = getText('continue') || 'Continue';
        }

        if ($.mobileContinueBtn) {
            $.mobileContinueBtn.textContent = $.continueBtn.textContent;
        }

        $.continueBtn.disabled = pageNumber >= ui.totalPages && !isMobile();
        if (!isMobile()) {
            $.continueBtn.onclick = pageNumber < ui.totalPages ? handleContinue : null;
        } else {
            $.continueBtn.onclick = handleContinue;
        }

        var themeId = getThemeId();
        var musicPrompt = '';
        var musicPhase = pageData.musicPhase || sceneData.musicPhase || ui.currentSceneType || 'investigation';
        if (TDAudioService && TDAudioService.getMusicForPhase) {
            if (sceneData.type === 'narration') {
                musicPrompt = TDAudioService.getThemeMusic(themeId);
            } else {
                musicPrompt = TDAudioService.getMusicForPhase(themeId, musicPhase);
            }
        }

        var backgroundPromise = pageData.bgImage
            ? Promise.resolve(pageData.bgImage)
            : (TDImageService
                ? TDImageService.generateSceneBackground(pageData.location || 'detective scene', themeId, musicPrompt)
                : Promise.reject(new Error('ImageService not loaded')));

        var npcImagePromise = Promise.resolve(null);
        if (pageData.showNPC && pageData.npcId) {
            ui.currentNPCId = pageData.npcId;
            $.npcName.textContent = pageData.npcName || '';
            if (pageData.npcImageUrl) {
                npcImagePromise = Promise.resolve(pageData.npcImageUrl);
            } else if (TDNarrativeEngine) {
                var npc = TDNarrativeEngine.getNPC(pageData.npcId);
                if (npc) {
                    $.npcName.textContent = npc.name || pageData.npcName || '';

                    if (npc.imageUrl) {
                        npcImagePromise = Promise.resolve(npc.imageUrl);
                    } else if (npc.imagePrompt) {
                        npcImagePromise = TDImageService
                            ? TDImageService.generateImage(npc.imagePrompt, { width: 512, height: 512 })
                            : Promise.reject(new Error('ImageService not loaded'));
                    } else {
                         npcImagePromise = TDImageService
                            ? TDImageService.generateNpcImage(npc, themeId)
                            : Promise.reject(new Error('ImageService not loaded'));
                    }
                }
            }
        } else {
            if (!pageData.showNPC) {
                ui.currentNPCId = null;
                $.npcName.textContent = '';
                $.conversationInput.classList.add('hidden');
            }
        }

        hideLoading();

        typeWriter(pageData.text || '...', function () {
            onPageComplete(pageNumber, sceneData);
        });

        if (TDAudioService && pageData.text) {
            var profileKey = ui.language === 'fr' ? 'narrator_fr' : 'narrator';
            if (sceneData.type === 'narration') {
                profileKey = ui.language === 'fr' ? 'narrator_fr' : 'narrator';
                startNarrationTimer(function () {
                    if (ui.currentPage < ui.totalPages) {
                        nextPage();
                    } else {
                        if (ui._narrationCallback) {
                            var cb = ui._narrationCallback;
                            ui._narrationCallback = null;
                            hidePageNav();
                            cb();
                        }
                    }
                });
            } else if (pageData.npcId && TDNarrativeEngine) {
                var npcObj = TDNarrativeEngine.getNPC(pageData.npcId);
                if (npcObj) {
                    profileKey = TDAudioService.getVoiceProfileKey
                        ? TDAudioService.getVoiceProfileKey(npcObj)
                        : profileKey;
                }
            }
            TDAudioService.speak(pageData.text, profileKey);
        }

        if (pageData.isDialogue) {
            if (pageData.showNPC && pageData.npcId) {
                $.conversationInput.classList.remove('hidden');
            }
        } else {
            $.conversationInput.classList.add('hidden');
        }

        Promise.all([
            backgroundPromise.catch(function () { return null; }),
            npcImagePromise.catch(function () { return null; }),
        ]).then(function (results) {
            var bgUrl = results[0];
            var npcUrl = results[1];

            if (bgUrl) {
                setBackground(bgUrl);
            }
            if (npcUrl && pageData.showNPC) {
                loadNPCImage(npcUrl);
                if (pageData.npcImageFull) {
                    $.npcImage.classList.add('npc-full');
                } else if (pageData.npcImageCloseup) {
                    $.npcImage.classList.remove('npc-full');
                }
            } else {
                hideNPC();
            }
        });
    }

    function handleContinue() {
        stopNarrationTimer();
        if (ui.isWaiting) return;

        // IMMEDIATELY skip typing if active - button should always be clickable
        if (ui.isTyping) {
            skipTypeWriter();
        }

        if (ui.currentPage < ui.totalPages) {
            nextPage();
            return;
        }

        ui.isWaiting = true;

        if (TDAudioService) {
            TDAudioService.stopSpeaking();
        }

        if (ui.currentSceneData && ui.currentSceneData.type === 'credits') {
            hideLoading();
            if (TDNarrativeEngine) {
                var state = TDNarrativeEngine.getGameState();
                if (state.solution) {
                    showEndScreen(state.solution);
                }
            }
            return;
        }

        advanceGameState(null)
                .then(function (data) {
                    ui.isWaiting = false;

                    if (data.gameComplete) {
                        showEndScreen(data.solution);
                        return;
                    }

                    if (data.nextActTransition && data.nextActTransition !== 'null') {
                        showTransitionToast(data.nextActTransition);
                        setTimeout(function () {
                            continueAfterTransition(data);
                        }, 2000);
                    } else {
                        continueAfterTransition(data);
                    }
                })
                .catch(function (err) {
                    ui.isWaiting = false;
                    showToast('Failed to continue investigation: ' + (err.message || 'Unknown error'), true);
                });
    }

    function typeWriter(text, onComplete, speed) {
        _currentDialogue = text || '';
        _typeWriterCallback = onComplete;
        speed = speed || ui.typingSpeed;
        ui.skipPending = false;

        if (!$.dialogueText || !$.typeCursor) {
            if (onComplete) { onComplete(); }
            return;
        }

        // Effet machine à écrire avec skip au clic
        $.dialogueText.textContent = '';
        $.typeCursor.classList.remove('hidden');
        ui.isTyping = true;
        var i = 0;

        function typeChar() {
            if (ui.skipPending) {
                // Already handled by skipTypeWriter — do nothing to avoid double-callback
                return;
            }

            if (i < text.length) {
                $.dialogueText.textContent += text.charAt(i);
                i++;
                if (TDAudioService && typeof TDAudioService.playTypingSound === 'function' && TDAudioService.typingSound) {
                    TDAudioService.playTypingSound();
                }
                _typeWriterTimeout = setTimeout(typeChar, speed);
            } else {
                ui.isTyping = false;
                $.typeCursor.classList.add('hidden');
                _typeWriterCallback = null;
                if (onComplete) { onComplete(); }
            }
        }

        typeChar();
    }

    function getCurrentSceneText() {
        return _currentDialogue || ($.dialogueText ? $.dialogueText.textContent : '');
    }

    function showChoices() {
        $.choicesContainer.innerHTML = '';

        var choices = getCurrentChoices() || [];
        if (!choices || choices.length === 0) {
            choices = [getText('skip') || 'Continue'];
        }

        choices.forEach(function (choice) {
            var btn = document.createElement('button');
            btn.className = 'btn btn-choice';
            btn.textContent = choice;
            btn.addEventListener('click', function () {
                handleChoice(choice);
            });
            $.choicesContainer.appendChild(btn);
        });
    }

    var _currentChoices = [];

    function getCurrentChoices() {
        return _currentChoices;
    }

    function handleChoice(choice) {
        if (ui.isWaiting || ui.isTyping) return;
        ui.isWaiting = true;
        ui.isTyping = false;
        stopNarrationTimer();
        clearTypeWriter();

        if (TDAudioService) {
            TDAudioService.stopSpeaking();
        }

        advanceGameState(choice)
                .then(function (data) {
                    ui.isWaiting = false;

                    if (data.gameComplete) {
                        showEndScreen(data.solution);
                        return;
                    }

                    if (data.nextActTransition && data.nextActTransition !== 'null') {
                        showTransitionToast(data.nextActTransition);
                    }
                    continueAfterTransition(data);
                })
                .catch(function (err) {
                    ui.isWaiting = false;
                    showToast('Failed to continue investigation: ' + (err.message || 'Unknown error'), true);
                    setTimeout(function () { ui.isWaiting = false; }, 1000);
                });
    }

    function advanceFallbackGameState(playerChoice) {
        if (!ui.fallbackScript || !ui.fallbackScript.acts) {
            return Promise.reject(new Error('No fallback script'));
        }

        var acts = ui.fallbackScript.acts;
        var currentAct = ui.fallbackCurrentAct;
        var currentScene = ui.fallbackCurrentScene + 1;
        var nextActTransition = null;

        if (currentScene >= acts[currentAct].scenes.length) {
            currentScene = 0;
            if (currentAct + 1 < acts.length) {
                currentAct++;
                nextActTransition = acts[currentAct].setting || 'A new act begins.';
            } else {
                ui.fallbackCurrentAct = currentAct;
                ui.fallbackCurrentScene = currentScene;
                return Promise.resolve({
                    gameComplete: true,
                    solution: ui.fallbackScript.solution,
                    clue: null,
                    event: null,
                    npcId: null,
                    dialogue: '',
                    location: '',
                    type: 'credits',
                    objective: '',
                    choices: [],
                    musicPhase: 'credits',
                    nextActTransition: null,
                    gameComplete: true,
                    solution: ui.fallbackScript.solution,
                });
            }
        }

        // Update state
        ui.fallbackCurrentAct = currentAct;
        ui.fallbackCurrentScene = currentScene;

        var scene = acts[currentAct].scenes[currentScene];
        var sceneData = {
            dialogue: scene.dialogue || '',
            location: scene.location || '',
            npcId: scene.npcId || null,
            type: scene.type || 'investigation',
            objective: scene.objective || getDefaultObjective(scene.type || 'investigation'),
            choices: scene.choices || [],
            clue: scene.clue || null,
            event: null,
            puzzle: scene.puzzle || null,
            musicPhase: scene.musicPhase || scene.type || 'investigation',
            nextActTransition: nextActTransition,
            gameComplete: false,
            solution: null,
        };

        return Promise.resolve({
            dialogue: sceneData.dialogue,
            location: sceneData.location,
            npcId: sceneData.npcId,
            type: sceneData.type,
            objective: sceneData.objective,
            choices: sceneData.choices,
            clue: sceneData.clue,
            event: sceneData.event,
            puzzle: sceneData.puzzle,
            musicPhase: sceneData.musicPhase,
            nextActTransition: sceneData.nextActTransition,
            gameComplete: sceneData.gameComplete,
            solution: sceneData.solution,
        });
    }

    function addDialogueHistory(role, text, npcName) {
        if (!$.dialogueHistory) { return; }
        var entry = document.createElement('div');
        entry.className = 'history-entry ' + role;
        var nameSpan = '';
        if (npcName) {
            nameSpan = '<span class="history-name">' + escapeHtml(npcName) + ':</span> ';
        } else if (role === 'player') {
            nameSpan = '<span class="history-name">' + escapeHtml(getText('you') || 'You') + ':</span> ';
        } else if (role === 'narrator') {
            nameSpan = '<span class="history-name">' + escapeHtml(getText('narrator') || 'Narrator') + ':</span> ';
        }
        entry.innerHTML = nameSpan + '<span class="history-text">' + escapeHtml(text || '') + '</span>';
        $.dialogueHistory.appendChild(entry);
        $.dialogueHistory.scrollTop = $.dialogueHistory.scrollHeight;
    }

    function clearDialogueHistory() {
        if ($.dialogueHistory) {
            $.dialogueHistory.innerHTML = '';
        }
    }

    function displayScene(sceneData, isResume) {
        if (ui.isWaiting) return;
        ui.isWaiting = true;
        ui.isTyping = true;
        ui.skipPending = false;

        ui.currentSceneType = sceneData.type || 'investigation';

        $.choicesContainer.innerHTML = '';
        $.conversationInput.classList.add('hidden');
        if (!isMobile()) {
            $.continueBtn.classList.add('hidden');
        }
        $.continueBtn.disabled = false;
        $.continueBtn.onclick = null;
        $.npcName.textContent = '';
        hideNPC();
        clearDialogueHistory();

        var sceneDataWithPages = {
            type: sceneData.type,
            dialogue: sceneData.dialogue,
            location: sceneData.location,
            npcId: sceneData.npcId,
            choices: sceneData.choices,
            clue: sceneData.clue,
            event: sceneData.event,
            puzzle: sceneData.puzzle,
            objective: sceneData.objective,
            musicPhase: sceneData.musicPhase,
            nextActTransition: sceneData.nextActTransition,
            gameComplete: sceneData.gameComplete,
            solution: sceneData.solution,
            pages: sceneData.pages || null,
        };

        ui.currentSceneData = sceneDataWithPages;
        ui.currentPage = 1;
        ui.totalPages = 3;

        if (sceneData.clue) {
            if (TDNarrativeEngine) {
                TDNarrativeEngine.addClue(sceneData.clue, 'scene');
            }
            showClueToast(sceneData.clue);
        }

        addDialogueHistory('narrator', sceneData.dialogue || '...');

        updateMusicInfo(sceneData.musicPhase || sceneData.type, ui.theme);
        updateObjective(sceneData.objective || getDefaultObjective(sceneData.type));
        showPageNav();
        updatePageDots();

        hideLoading();
        renderCurrentPage();
    }

    function advanceGameState(choice) {
        if (ui.usingFallback) {
            return advanceFallbackGameState(choice);
        }
        if (TDNarrativeEngine) {
            return TDNarrativeEngine.advanceGameState(choice || null);
        }
        return advanceFallbackGameState(choice);
    }

    function getGameState() {
        if (TDNarrativeEngine && !ui.usingFallback) {
            return TDNarrativeEngine.getGameState();
        }
        return {
            currentAct: ui.fallbackCurrentAct + 1,
            currentSceneIndex: ui.fallbackCurrentScene,
            discoveredClues: [],
            investigationSteps: [],
            npcsEncountered: (ui.fallbackScript && ui.fallbackScript.npcs || []).map(function(n) { return n.id; }),
            script: ui.fallbackScript,
        };
    }

    function getNPCById(npcId) {
        if (TDNarrativeEngine && !ui.usingFallback) {
            return TDNarrativeEngine.getNPC(npcId);
        }
        if (ui.fallbackScript && ui.fallbackScript.npcs) {
            return ui.fallbackScript.npcs.find(function (n) { return n.id === npcId; }) || null;
        }
        return null;
    }

    function continueAfterTransition(data) {
        if (data.clue && data.clue !== 'null' && data.clue) {
            if (TDNarrativeEngine) {
                TDNarrativeEngine.addClue(data.clue, 'scene');
            }
            showClueToast(data.clue);
        }

        if (data.event && data.event !== 'null') {
            if (TDNarrativeEngine) {
                TDNarrativeEngine.addStep('event', data.event);
            }
            showEventToast(data.event);
        }

        if (data.npcId && TDNarrativeEngine) {
            if (!TDNarrativeEngine.getGameState().npcsEncountered.includes(data.npcId)) {
                TDNarrativeEngine.getGameState().npcsEncountered.push(data.npcId);
            }
        }

        _currentChoices = data.choices || [];

        var sceneType = data.type || 'investigation';
        ui.currentSceneType = sceneType;

        var sceneData = {
            dialogue: data.dialogue || '...',
            location: data.location || null,
            npcId: data.npcId || null,
            type: sceneType,
            objective: data.objective || getDefaultObjective(sceneType),
            choices: data.choices,
            clue: data.clue || null,
            event: data.event || null,
            puzzle: data.puzzle || null,
            musicPhase: data.musicPhase || sceneType,
            nextActTransition: null,
            gameComplete: false,
            solution: null,
        };

        updateMusicInfo(sceneData.musicPhase, ui.theme);
        updateObjective(sceneData.objective);
        updateNotebook();

        var transitionPages = buildTransitionPages(sceneData);
        showNarrationSequence(transitionPages, function () {
            displayScene(sceneData, false);
        }, sceneData.musicPhase);
    }

    function sendPlayerText() {
        if (ui.isWaiting || ui.isTyping) return;

        var text = ($.playerText ? $.playerText.value : '').trim();
        if (!text) return;

        ui.isWaiting = true;
        clearTypeWriter();

        if (TDAudioService) {
            TDAudioService.stopSpeaking();
        }

        if (!ui.currentNPCId || !TDNarrativeEngine) {
            ui.isWaiting = false;
            return;
        }

        if ($.playerText) {
            $.playerText.value = '';
        }

        addDialogueHistory('player', text);

        TDNarrativeEngine.talkToNPC(ui.currentNPCId, text)
            .then(function (data) {
                ui.isWaiting = false;

                if (data.revealClue && data.revealClue !== 'null') {
                    if (TDNarrativeEngine) {
                        TDNarrativeEngine.addClue(data.revealClue, 'dialogue');
                    }
                    showClueToast(data.revealClue);
                    updateNotebook();
                }

                var npcObj = TDNarrativeEngine.getNPC(ui.currentNPCId);
                if (npcObj) {
                    addDialogueHistory('npc', data.response, npcObj.name);
                }

                typeWriter(data.response || '...', function () {
                    showChoices();
                });

                var npc = TDNarrativeEngine.getNPC(ui.currentNPCId);
                if (npc && TDAudioService) {
                    var profileKey = TDAudioService.getVoiceProfileKey
                        ? TDAudioService.getVoiceProfileKey(npc)
                        : 'narrator';
                    TDAudioService.speak(data.response, profileKey);
                }
            })
            .catch(function (err) {
                ui.isWaiting = false;
                showToast('Failed to get NPC response: ' + (err.message || 'Unknown error'), true);
                typeWriter(getText('noResponseFallback') || 'The NPC seems unresponsive...', function () {});
            });
    }

    function clearTypeWriter() {
        clearTimeout(_typeWriterTimeout);
        _typeWriterTimeout = null;
        $.dialogueText.textContent = '';
        if ($.typeCursor) {
            $.typeCursor.classList.add('hidden');
        }
    }

    function startNarrationTimer(onComplete) {
        stopNarrationTimer();
        ui.narrationRemaining = ui.narrationSeconds;
        if ($.narrationTimer) {
            $.narrationTimer.classList.remove('hidden');
            $.narrationTimer.textContent = '❱ ' + ui.narrationRemaining + 's';
        }
        ui.narrationTimer = setInterval(function () {
            ui.narrationRemaining -= 1;
            if ($.narrationTimer) {
                $.narrationTimer.textContent = '❱ ' + Math.max(0, ui.narrationRemaining) + 's';
            }
            if (ui.narrationRemaining <= 0) {
                stopNarrationTimer();
                if (onComplete) onComplete();
            }
        }, 1000);
    }

    function stopNarrationTimer() {
        if (ui.narrationTimer) {
            clearInterval(ui.narrationTimer);
            ui.narrationTimer = null;
        }
        if ($.narrationTimer) {
            $.narrationTimer.classList.add('hidden');
        }
    }

    function skipTypeWriter() {
        if (!ui.isTyping) return;

        clearTimeout(_typeWriterTimeout);
        _typeWriterTimeout = null;
        ui.skipPending = true;
        ui.isTyping = false;
        if ($.dialogueText) {
            $.dialogueText.textContent = _currentDialogue || '';
        }
        if ($.typeCursor) {
            $.typeCursor.classList.add('hidden');
        }

        var callback = _typeWriterCallback;
        _typeWriterCallback = null;
        if (callback) callback();
    }

    function encodeURI(url) {
        if (!url) return url;
        return url
            .split('/')
            .map(function (segment) {
                return encodeURIComponent(segment);
            })
            .join('/');
    }

    function loadNPCImage(url) {
        if (!$.npcImage) return;
        $.npcImage.src = '';
        $.npcImage.classList.remove('visible');

        var img = new Image();
        img.onload = function () {
            $.npcImage.src = encodeURI(url);
            $.npcImage.classList.add('visible');
        };
        img.onerror = function () {
            $.npcImage.classList.add('visible');
        };
        img.src = encodeURI(url);
    }

    function showNPC(npc) {
        if (!$.npcImage || !$.npcName) return;
        $.npcName.textContent = npc.name || '';
        $.npcImage.classList.add('visible');
        $.conversationInput.classList.remove('hidden');
    }

    function hideNPC() {
        if ($.npcImage) {
            $.npcImage.classList.remove('visible');
        }
        if ($.npcName) {
            $.npcName.textContent = '';
        }
        if ($.conversationInput) {
            $.conversationInput.classList.add('hidden');
        }
    }

    function setBackground(url) {
        if (!$.bgLayer) return;
        var img = new Image();
        img.onload = function() {
            $.bgLayer.style.opacity = '0';
            $.bgLayer.style.backgroundImage = 'url("' + encodeURI(url) + '")';
            setTimeout(function() {
                $.bgLayer.style.opacity = '1';
            }, 50);
        };
        img.src = encodeURI(url);
    }

    function updateIndicators() {
        if (!TDNarrativeEngine) return;
        var state = TDNarrativeEngine.getGameState();
        if ($.currentAct) {
            $.currentAct.textContent = state.currentAct;
        }
        if ($.currentScene) {
            $.currentScene.textContent = ui.sceneCounter + 1;
        }
        if ($.cluesCount) {
            $.cluesCount.textContent = state.discoveredClues.length;
        }
        if ($.clueIndicator) {
            $.clueIndicator.style.display = state.discoveredClues.length > 0 ? 'flex' : 'none';
        }
    }

    function updateNotebook() {
        if (!TDNarrativeEngine) return;
        var state = TDNarrativeEngine.getGameState();

        function getClueText(clue) {
            if (typeof clue === 'object' && clue !== null) {
                return clue.text || '';
            }
            return clue || '';
        }

        function getClueCategory(clue) {
            if (typeof clue === 'object' && clue !== null) {
                return clue.category || 'general';
            }
            return 'general';
        }

        var categories = {
            'forensic':  { label: getText('clueCatForensic') || 'Forensic', icon: '🔬' },
            'witness':   { label: getText('clueCatWitness') || 'Witness', icon: '👁' },
            'mobile':    { label: getText('clueCatMotive') || 'Motive', icon: '💰' },
            'timeline':  { label: getText('clueCatTimeline') || 'Timeline', icon: '⏰' },
            'dialogue':  { label: getText('clueCatDialogue') || 'Dialogue', icon: '💬' },
            'opportunity': { label: getText('clueCatOpportunity') || 'Opportunity', icon: '🚪' },
            'scene':     { label: getText('clueCatScene') || 'Scene', icon: '🔍' },
        };

        var allClues = state.discoveredClues || [];
        var steps = state.investigationSteps || [];

        if ($.stepsList) {
            if (steps.length === 0) {
                $.stepsList.innerHTML = '<li class="notebook-empty">' + getText('noSteps') + '</li>';
            } else {
                $.stepsList.innerHTML = steps.map(function (step) {
                    return '<li class="step">' + escapeHtml(step.text) + '</li>';
                }).join('');
            }
        }

        if ($.cluesList) {
            var activeTab = $.notebookActiveTab || 'clues-all';

            if (allClues.length === 0) {
                $.cluesList.innerHTML = '<li class="notebook-empty">' + getText('noClues') + '</li>';
            } else {
                var filtered;
                if (activeTab === 'clues-all') {
                    filtered = allClues;
                } else if (activeTab === 'steps') {
                    filtered = steps.length === 0 ? [] : steps.map(function(s) {
                        return { text: s.text, category: 'steps', isStep: true };
                    });
                } else {
                    var cat = activeTab.replace('clues-', '');
                    filtered = allClues.filter(function(clue) {
                        return getClueCategory(clue) === cat;
                    });
                }

                if (filtered.length === 0) {
                    $.cluesList.innerHTML = '<li class="notebook-empty">' + getText('noClues') + '</li>';
                } else {
                    $.cluesList.innerHTML = filtered.map(function (item) {
                        if (item.isStep) {
                            return '<li class="step-item"><span class="step-text">' + escapeHtml(item.text) + '</span></li>';
                        }
                        var text = getClueText(item);
                        var cat = getClueCategory(item);
                        var label = categories[cat] ? categories[cat].label : 'General';
                        var icon = categories[cat] ? categories[cat].icon : '📝';
                        return '<li class="clue-item" data-category="' + escapeHtml(cat) + '">' +
                            '<span class="clue-cat-badge" title="' + escapeHtml(label) + '">' + icon + '</span>' +
                            '<span class="clue-text">' + escapeHtml(text) + '</span>' +
                            '</li>';
                    }).join('');
                }
            }
        }
    }

    function toggleNotebook() {
        if (!$.notebook) return;
        var wasOpen = $.notebook.classList.contains('open');
        $.notebook.classList.toggle('open');
        if (!wasOpen) {
            resetNotebookTabs();
        }
        updateNotebook();
    }

    function resetNotebookTabs() {
        if (!$.notebookTabBtns || !$.notebookTabBtns.length) return;
        $.notebookTabBtns.forEach(function(b) { b.classList.remove('active'); });
        var allBtn = document.querySelector('.notebook-tab-btn[data-tab="clues-all"]');
        if (allBtn) allBtn.classList.add('active');
        $.notebookActiveTab = 'clues-all';
    }

    function setupNotebookTabs() {
        if (!$.notebookTabBtns || !$.notebookTabBtns.length) return;
        $.notebookTabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var tab = this.getAttribute('data-tab');
                $.notebookTabBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                $.notebookActiveTab = tab;
                updateNotebook();
            });
        });
    }

    function toggleMute() {
        if (!TDAudioService) return;
        var muted = TDAudioService.toggleMute();
        updateMuteButton();
    }

    function updateMuteButton() {
        if (!$.muteBtn || !TDAudioService) return;
        $.muteBtn.textContent = TDAudioService.muted ? '◌' : '◒';
        $.muteBtn.title = TDAudioService.muted ? 'Activer la narration' : 'Couper la narration';
        $.muteBtn.setAttribute('aria-label', $.muteBtn.title);
    }

    function updateVolumeButton() {
        if (!$.volumeBtn || !TDAudioService) return;
        var pct = Math.round(TDAudioService.volume * 100);
        var icon = TDAudioService.volume <= 0.5 ? '◑' : '◐';
        $.volumeBtn.textContent = icon + pct + '%';
        $.volumeBtn.title = 'Volume de la narration : ' + pct + ' %. Cliquer pour modifier.';
        $.volumeBtn.setAttribute('aria-label', $.volumeBtn.title);
    }

    function toggleTypingSound() {
        if (!TDAudioService) return;
        TDAudioService.toggleTypingSound();
        updateTypingSoundButton();
    }

    function updateTypingSoundButton() {
        if (!$.typingBtn || !TDAudioService) {
            if ($.typingBtn) $.typingBtn.classList.add('hidden');
            return;
        }
        var enabled = TDAudioService.typingSound;
        $.typingBtn.textContent = enabled ? '⌨' : '⌧';
        var themeId = getThemeId();
        if (themeId === 'cyberpunk' || themeId === 'sci-fi') {
            $.typingBtn.title = enabled ? 'Son de clavier cyberpunk activé' : 'Son de clavier cyberpunk désactivé';
        } else if (themeId === 'film-noir') {
            $.typingBtn.title = enabled ? 'Bruit de machine à écrire noir activé' : 'Bruit de machine à écrire noir désactivé';
        } else {
            $.typingBtn.title = enabled ? 'Bruit de machine à écrire activé' : 'Bruit de machine à écrire désactivé';
        }
        $.typingBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        $.typingBtn.setAttribute('aria-label', $.typingBtn.title);
        $.typingBtn.classList.remove('hidden');
    }

    var _voiceActive = false;

     function toggleVoiceInput() {
        if (!ui.voiceInputEnabled) { return; }
        if (!$.voiceBtn) return;
        if (_voiceActive) {
            stopVoiceInputInternal();
        } else {
            startVoiceInput();
        }
    }

    function startVoiceInput() {
        _voiceActive = true;
        if ($.voiceBtn) {
            $.voiceBtn.textContent = '●';
            $.voiceBtn.title = 'Écoute en cours';
            $.voiceBtn.setAttribute('aria-label', $.voiceBtn.title);
            $.voiceBtn.classList.add('voice-recording');
        }

        if (!TDAudioService || !TDAudioService.startListening) {
            showToast(getText('voiceNotSupported') || 'Voice input not supported in this browser.', true);
            stopVoiceInputInternal();
            return;
        }

        TDAudioService.startListening(
            function (transcript) {
                if ($.playerText) {
                    $.playerText.value = transcript;
                }
                stopVoiceInputInternal();
                if (transcript) {
                    sendPlayerText();
                }
            },
            function (error) {
                showToast(error, true);
                stopVoiceInputInternal();
            }
        );
    }

    function stopVoiceInputInternal() {
        _voiceActive = false;
        if ($.voiceBtn) {
            $.voiceBtn.textContent = '◉';
            $.voiceBtn.title = 'Saisie vocale';
            $.voiceBtn.setAttribute('aria-label', $.voiceBtn.title);
            $.voiceBtn.classList.remove('voice-recording');
        }
        if (TDAudioService && TDAudioService.stopListening) {
            TDAudioService.stopListening();
        }
    }

    function showEndScreen(solution) {
        if (!$.endScreen) return;
        $.gameScreen.classList.add('hidden');
        $.gameScreen.classList.remove('active');
        hidePageNav();

        updateMusicInfo('credits', ui.theme);

        if ($.endScreenTitle) {
            $.endScreenTitle.textContent = getText('caseClosed');
        }

        if ($.solutionCulprit) {
            $.solutionCulprit.textContent = solution.culprit || 'Unknown';
        }
        if ($.solutionMotive) {
            $.solutionMotive.textContent = solution.motive || 'Unknown';
        }
        if ($.solutionMethod) {
            $.solutionMethod.textContent = solution.method || 'Unknown';
        }
        if ($.solutionRevealText) {
            $.solutionRevealText.textContent = solution.revealed || '';
        }

        var reveal = document.querySelector('.solution-revealed');
        if (reveal) {
            reveal.style.opacity = '1';
        }

        $.endScreen.classList.remove('hidden');
        $.endScreen.classList.add('active');

        if (TDAudioService) {
            TDAudioService.speak(solution.revealed || 'Case closed.', 'narrator');
        }

        if (TDNarrativeEngine) {
            updateNotebook();
        }
    }

    function newInvestigation() {
        if (TDNarrativeEngine) {
            TDNarrativeEngine.resetGame();
        }
        if (TDImageService) {
            TDImageService.clearCache();
        }
        if (TDAudioService) {
            TDAudioService.stopSpeaking();
        }

        $.endScreen.classList.remove('active');
        $.endScreen.classList.add('hidden');
        $.gameScreen.classList.add('hidden');
        updateNotebook();

        setTimeout(function () {
            $.homeScreen.classList.remove('hidden');
            $.homeScreen.classList.add('active');
            $.themeScreen.classList.remove('active');
            $.themeScreen.classList.add('hidden');
            checkSavedGame();
        }, 500);
    }

    function showLoading(text) {
        if (!$.loadingOverlay) return;
        $.loadingText.textContent = text || 'Please wait...';
        $.loadingOverlay.classList.remove('hidden');
    }

    function hideLoading() {
        if (!$.loadingOverlay) return;
        $.loadingOverlay.classList.add('hidden');
    }

    function getThemeMusic(themeId) {
        if (TDAudioService && TDAudioService.getThemeMusic) {
            return TDAudioService.getThemeMusic(themeId);
        }
        return 'Generating investigation...';
    }

    function showToast(text, isError) {
        if (!$.toast) return;
        $.toast.textContent = text;
        $.toast.className = 'toast show' + (isError ? ' error' : '');
        setTimeout(function () {
            $.toast.className = 'toast';
        }, 4000);
    }

    function showClueToast(clue) {
        showToast('🔍 ' + clue);
    }

    function showEventToast(event) {
        showToast(event);
    }

    function showTransitionToast(transition) {
        showToast(transition);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

/* ================================================================
       MODE SCÉNARIO V2, runner (consomme TDScenario + TDPhases)
    ================================================================ */
    var scr = {
        phaseIdx: 0,
        pageIdx: 0,
        active: false,
        awaitingChoice: false,
        interro: null,
    };

    var SCENARIO_NPC_ASSETS = {
        'detective-partner': 'detective',
        'protecteur': 'protecteur',
        'femme-fatale': 'femmeFatale',
        'seducteur': 'seducteur',
        'suspect': 'suspect',
        'marginal': 'marginal',
        'scientifique': 'scientifique',
        'criminel': 'criminel',
    };

    var SCENARIO_NPC_NAMES = {
        'detective-partner': { fr: 'Inspecteur Wexford', en: 'Inspector Wexford' },
        'protecteur': { fr: 'Le Major Hale', en: 'Major Hale' },
        'femme-fatale': { fr: 'Lady Vivienne', en: 'Lady Vivienne' },
        'seducteur': { fr: 'Julian Pembrooke', en: 'Julian Pembrooke' },
        'suspect': { fr: 'Rupert Blackwood', en: 'Rupert Blackwood' },
        'marginal': { fr: 'Silas Crane', en: 'Silas Crane' },
        'scientifique': { fr: 'Dr Whitmore', en: 'Dr Whitmore' },
        'criminel': { fr: 'Victor Krane', en: 'Victor Krane' },
    };

    var THEME_NPC_NAMES = {
        'agatha-christie': SCENARIO_NPC_NAMES,
        'cyberpunk': {
            'detective-partner': { fr: 'Inspecteur Vega', en: 'Inspector Vega' },
            'protecteur': { fr: 'Cipher-7', en: 'Cipher-7' },
            'femme-fatale': { fr: 'Lyra Noir', en: 'Lyra Noir' },
            'seducteur': { fr: 'Dex Rook', en: 'Dex Rook' },
            'suspect': { fr: 'Ledger-9', en: 'Ledger-9' },
            'marginal': { fr: 'Ghost', en: 'Ghost' },
            'scientifique': { fr: 'Dr. Synapse', en: 'Dr. Synapse' },
            'criminel': { fr: 'Razor', en: 'Razor' },
        },
        'film-noir': {
            'detective-partner': { fr: 'Détective Reeves', en: 'Detective Reeves' },
            'protecteur': { fr: 'Mike Malone', en: 'Mike Malone' },
            'femme-fatale': { fr: 'Vivian Noir', en: 'Vivian Noir' },
            'seducteur': { fr: 'Johnny Lorraine', en: 'Johnny Lorraine' },
            'suspect': { fr: 'Vincent Crowe', en: 'Vincent Crowe' },
            'marginal': { fr: 'Eddie', en: 'Eddie' },
            'scientifique': { fr: 'Dr. Coroner', en: 'Dr. Coroner' },
            'criminel': { fr: 'Louie the Blade', en: 'Louie the Blade' },
        },
    };

    var THEME_NAME_OVERRIDES = {
        'cyberpunk': {
            'Major Hale': 'Cipher-7',
            'Hale': 'Cipher-7',
            'Lady Vivienne': 'Lyra Noir',
            'Vivienne': 'Lyra Noir',
            'Julian Pembrooke': 'Dex Rook',
            'Pembrooke': 'Dex Rook',
            'Rupert Blackwood': 'Ledger-9',
            'Blackwood': 'Ledger-9',
            'Silas Crane': 'Ghost',
            'Victor Krane': 'Razor',
            'Krane': 'Razor',
            'Dr Whitmore': 'Dr. Synapse',
            'Whitmore': 'Synapse',
            'Wexford': 'Detective Vega',
        },
        'film-noir': {
            'Major Hale': 'Mike Malone',
            'Hale': 'Mike Malone',
            'Lady Vivienne': 'Vivian Noir',
            'Vivienne': 'Vivian Noir',
            'Julian Pembrooke': 'Johnny Lorraine',
            'Pembrooke': 'Johnny Lorraine',
            'Rupert Blackwood': 'Vincent Crowe',
            'Blackwood': 'Vincent Crowe',
            'Silas Crane': 'Eddie',
            'Victor Krane': 'Louie the Blade',
            'Krane': 'Louie',
            'Dr Whitmore': 'Dr. Coroner',
            'Whitmore': 'Coroner',
            'Wexford': 'Detective Reeves',
        },
    };

    function scrSubstituteNames(text, themeId) {
        if (!text) return text;
        if (themeId === 'agatha-christie') return text;
        var overrides = THEME_NAME_OVERRIDES[themeId];
        if (!overrides) return text;
        var keys = Object.keys(overrides).sort(function (a, b) { return b.length - a.length; });
        for (var i = 0; i < keys.length; i++) {
            text = text.split(keys[i]).join(overrides[keys[i]]);
        }
        return text;
    }

    var THEME_TRUTH_TITLES = {
        'agatha-christie': null,
        'cyberpunk': {
            protecteur: { fr: 'Cipher-7', en: 'Cipher-7' },
            'femme-fatale': { fr: 'Lyra Noir', en: 'Lyra Noir' },
            seducteur: { fr: 'Dex Rook', en: 'Dex Rook' },
            suspect: { fr: 'Ledger-9', en: 'Ledger-9' },
            marginal: { fr: 'Ghost', en: 'Ghost' },
            criminel: { fr: 'Razor', en: 'Razor' },
        },
        'film-noir': {
            protecteur: { fr: 'Mike Malone', en: 'Mike Malone' },
            'femme-fatale': { fr: 'Vivian Noir', en: 'Vivian Noir' },
            seducteur: { fr: 'Johnny Lorraine', en: 'Johnny Lorraine' },
            suspect: { fr: 'Vincent Crowe', en: 'Vincent Crowe' },
            marginal: { fr: 'Eddie', en: 'Eddie' },
            criminel: { fr: 'Louie the Blade', en: 'Louie the Blade' },
        },
    };

    var THEME_OUTRO_TEXT = {
        'agatha-christie': {
            win_fr: 'Sous le ciel de Londres, les becs de gaz dessinent des halos orange. L\'affaire est close.',
            win_en: 'Under the London sky, gas lamps draw orange halos. The case is closed.',
            indirect_fr: 'Sous le ciel de Londres, les becs de gaz dessinent des halos orange. La vérité a émergé, même par le bas.',
            indirect_en: 'Under the London sky, gas lamps draw orange halos. The truth emerged, even if by the back door.',
            fail_fr: 'Le mystère reste entier dans les ruelles de Londres.',
            fail_en: 'The mystery remains unsolved in the London alleys.',
            exile_fr: 'Sous le soleil des tropiques, le vrai coupable sirote un cocktail au bord de la piscine d\'un palace.',
            exile_en: 'Under the tropical sun, the real culprit sips a cocktail by the pool of a palace.',
        },
        'cyberpunk': {
            win_fr: 'Sous les néons de la mégapole, la pluie digitale caresse les façades. L\'affaire est close.',
            win_en: 'Under the neon megacity, digital rain washes the facades. The case is closed.',
            indirect_fr: 'Sous les néons de la mégapole, la pluie digitale caresse les façades. La vérité a émergé, même par le bas.',
            indirect_en: 'Under the neon megacity, digital rain washes the facades. The truth emerged, even if by the back door.',
            fail_fr: 'Le mystère reste en suspens dans les ruelles numériques de la mégapole.',
            fail_en: 'The mystery remains unsolved in the digital alleys of the megacity.',
            exile_fr: 'Dans les néons clignotants de la mégapole, le vrai coupable se fait discret parmi la foule cybernétique.',
            exile_en: 'Among the flashing neon of the megacity, the real culprit melts into the cybernetic crowd.',
        },
        'film-noir': {
            win_fr: 'Sous le ciel pluvieux de Chicago, les réverbères dessinent des halos rouges. L\'affaire est close.',
            win_en: 'Under the rainy Chicago sky, streetlamps cast red halos. The case is closed.',
            indirect_fr: 'Sous le ciel pluvieux de Chicago, les réverbères dessinent des halos rouges. La vérité a émergé, même par le bas.',
            indirect_en: 'Under the rainy Chicago sky, streetlamps cast red halos. The truth emerged, even if by the back door.',
            fail_fr: 'Le mystère reste insoluble dans les ruelles sombres de Chicago.',
            fail_en: 'The mystery remains unsolved in the dark alleys of Chicago.',
            exile_fr: 'Dans les ruelles sombres de Chicago, le vrai coupable s\'enfuit dans la nuit au gré des ombres.',
            exile_en: 'In the dark alleys of Chicago, the real culprit flees into the night through shifting shadows.',
        },
    };

    var THEME_ACT_TITLES = {
        'agatha-christie': {
            'Acte 1': {
                number: { fr: 'Acte Premier', en: 'Act One' },
                title: { fr: 'L\'Ombre du Crime', en: 'The Shadow of Crime' },
                subtitle: { fr: 'Un magnat est retrouvé mort dans son manoir. L\'enquête commence dans le brouillard de Londres.', en: 'A tycoon is found dead in his manor. The investigation begins in the London fog.' }
            },
            'Acte 2': {
                number: { fr: 'Acte Deuxième', en: 'Act Two' },
                title: { fr: 'Fils et Faux-Semblants', en: 'Threads and Deceptions' },
                subtitle: { fr: 'Les témoignages se contredisent, les alibis se fissurent. La vérité se cache derrière les masques.', en: 'Testimonies contradict each other, alibis crack. The truth hides behind the masks.' }
            },
            'Acte 3': {
                number: { fr: 'Acte Troisième', en: 'Act Three' },
                title: { fr: 'La Vérité Nue', en: 'The Naked Truth' },
                subtitle: { fr: 'Le coffre-fort livre ses secrets. Le coupable doit être démasqué avant qu\'il ne soit trop tard.', en: 'The safe yields its secrets. The culprit must be unmasked before it is too late.' }
            },
        },
        'cyberpunk': {
            'Acte 1': {
                number: { fr: 'ACTE 01', en: 'ACT 01' },
                title: { fr: 'Protocole Initial', en: 'Initial Protocol' },
                subtitle: { fr: 'Un corpo retrouvé dans le secteur 7-Lambda. L\'investigation démarre sous les néons.', en: 'A corpo found in Sector 7-Lambda. The investigation begins under the neon lights.' }
            },
            'Acte 2': {
                number: { fr: 'ACTE 02', en: 'ACT 02' },
                title: { fr: 'Faisceau de Données', en: 'Data Beam' },
                subtitle: { fr: 'Les flux témoignages se contredisent, les firewalls sautent. La vérité est encryptée.', en: 'Testimony streams contradict each other, firewalls collapse. The truth is encrypted.' }
            },
            'Acte 3': {
                number: { fr: 'ACTE 03', en: 'ACT 03' },
                title: { fr: 'Root Access', en: 'Root Access' },
                subtitle: { fr: 'Le coffre crypté s\'ouvre. Le coupable doit être flushé avant la purge système.', en: 'The encrypted vault opens. The culprit must be flushed before the system purge.' }
            },
        },
        'film-noir': {
            'Acte 1': {
                number: { fr: 'Premier Acte', en: 'First Act' },
                title: { fr: 'Une Nuit Mortelle', en: 'One Deadly Night' },
                subtitle: { fr: 'Un homme riche retrouvé raide dans son bureau. Chicago n\'oublie jamais.', en: 'A rich man found stiff in his office. Chicago never forgets.' }
            },
            'Acte 2': {
                number: { fr: 'Deuxième Acte', en: 'Second Act' },
                title: { fr: 'Dames et Démons', en: 'Dames and Devils' },
                subtitle: { fr: 'Les alibis se vendent, les témoins se trompent. Dans cette ville, tout le monde a quelque chose à cacher.', en: 'Alibis are bought, witnesses are fooled. In this town, everyone has something to hide.' }
            },
            'Acte 3': {
                number: { fr: 'Troisième Acte', en: 'Third Act' },
                title: { fr: 'Le Dernier Verre', en: 'The Last Drink' },
                subtitle: { fr: 'Le coffre fort grince. Le coupable doit tomber avant l\'aube, sinon c\'est vous qui trinquez.', en: 'The safe creaks open. The culprit must fall before dawn, or it\'s you who buys the drink.' }
            },
        },
    };

    function scrShowActPage(act, onContinue) {
        var themeId = getThemeId();
        var titles = THEME_ACT_TITLES[themeId] || THEME_ACT_TITLES['agatha-christie'];
        var data = titles[act];
        if (!data) { onContinue(); return; }

        var lang = ui.language || 'fr';
        var overlay = document.getElementById('act-page-overlay');
        if (!overlay) { onContinue(); return; }

        overlay.className = 'act-page-overlay theme-' + themeId;

        var numberEl = document.getElementById('act-page-number');
        var titleEl = document.getElementById('act-page-title');
        var subtitleEl = document.getElementById('act-page-subtitle');
        var continueBtn = document.getElementById('act-page-continue-btn');

        if (numberEl) numberEl.textContent = data.number[lang] || data.number.fr || '';
        if (titleEl) titleEl.textContent = data.title[lang] || data.title.fr || '';
        if (subtitleEl) subtitleEl.textContent = data.subtitle[lang] || data.subtitle.fr || '';
        if (continueBtn) continueBtn.textContent = getText('continue') || 'Continuer';

        overlay.classList.add('visible');

        // Musique mystère sur la page d'acte
        scrMusicPlaying('mystere');

        if (continueBtn) {
            continueBtn.onclick = function () {
                // Clear previous page content immediately so it doesn't ghost
                // through the fading overlay
                if ($.dialogueText) $.dialogueText.textContent = '';
                if ($.npcName) $.npcName.textContent = '';
                hideNPC();
                if ($.bgLayer) $.bgLayer.style.opacity = '0';
                overlay.classList.remove('visible');
                setTimeout(function () {
                    if (typeof onContinue === 'function') onContinue();
                }, 600);
            };
        }
    }

    function scrShouldShowActPage(act) {
        if (!act) return false;
        if (act === 'Intro' || act === 'Outro') return false;
        var themeId = getThemeId();
        var titles = THEME_ACT_TITLES[themeId] || THEME_ACT_TITLES['agatha-christie'];
        return titles && titles.hasOwnProperty(act);
    }

    function scrGetPreviousPhase() {
        if (!window.TDPhases || scr.phaseIdx <= 0) return null;
        return window.TDPhases[scr.phaseIdx - 1] || null;
    }

    function scrThemedTitle(culpritId, lang) {
        var themeId = getThemeId();
        var themedTitles = THEME_TRUTH_TITLES[themeId];
        if (themedTitles && themedTitles[culpritId]) {
            var entry = themedTitles[culpritId];
            return entry[lang] || entry.fr || entry.en || '';
        }
        var truth = TDScenario.getTruth();
        return truth.title ? TDScenario.t(truth.title, lang) : (truth.culprit || '');
    }

    function scrGetOutroText(key, lang) {
        var themeId = getThemeId();
        var txt = THEME_OUTRO_TEXT[themeId] || THEME_OUTRO_TEXT['agatha-christie'];
        return txt ? (txt[key + '_' + lang] || txt[key + '_fr']) : '';
    }

     function scrGetState() { return TDScenario ? TDScenario.getState() : null; }

     function scrResetState() {
         TDScenario.reset();
         window.scrThemeMusicStarted = false;
         var s = scrGetState();
         s.lang = ui.language;
         s.theme = getThemeId();
         s.watchCode = scrGenerateWatchCode();
        s.watchTime = scrGenerateWatchTime();
        s.watchCodeStr = s.watchCode.join('');
        s.watchTimeStr = s.watchTime.h + 'h' + String(s.watchTime.m).padStart(2, '0');
        scr.phaseIdx = 0;
        scr.pageIdx = 0;
        scr.active = true;
        scr.awaitingChoice = false;
    }

    /* Génère un code à 4 chiffres pour la montre (entre 1842 et 1981).
       Évite 1981 par défaut pour ne pas spoiler, tire une année plausible XIXe/début XXe. */
    function scrGenerateWatchCode() {
        var years = [1842, 1847, 1853, 1859, 1864, 1871, 1878, 1885, 1891, 1897,
                     1903, 1909, 1914, 1921, 1928, 1934, 1941, 1947, 1953, 1959,
                     1965, 1972, 1978];
        var y = years[Math.floor(Math.random() * years.length)];
        return [Math.floor(y / 1000) % 10, Math.floor(y / 100) % 10, Math.floor(y / 10) % 10, y % 10];
    }

    /* Génère une heure plausible (20h-23h) avec minutes 00-59. */
    function scrGenerateWatchTime() {
        var h = 20 + Math.floor(Math.random() * 4);
        var m = Math.floor(Math.random() * 60);
        return { h: h, m: m };
    }

    function scrDecorImage(decorKey) {
        var assets = THEME_ASSETS[getThemeId()] || THEME_ASSETS['agatha-christie'];
        var map = {
            universe: assets.universe,
            universeSherlock: assets.universeImg,
            sherlock: assets.universeImg,
            crimeScene: assets.crimeScene,
            alley: assets.alley,
            residence: assets.residence,
            bar: assets.publicPlace,
            barInterieur: assets.barInterieur,
            clandestine: assets.secretPlace,
            secretPlace: assets.secretPlace,
            labo: assets.laboratory,
            laboratoire: assets.laboratory,
            laboratory: assets.laboratory,
            qg: assets.headquarters,
            headquarters: assets.headquarters,
            prison: assets.prison,
            exile: assets.exile || assets.universe,
            paradise: assets.exile || assets.universe
        };
        return map[decorKey] || null;
    }

    function scrNpcImage(npcId) {
        var assets = THEME_ASSETS[getThemeId()] || THEME_ASSETS['agatha-christie'];
        var key = SCENARIO_NPC_ASSETS[npcId];
        return key ? (assets[key] || null) : null;
    }

    function scrNpcName(npcId) {
        var names = THEME_NPC_NAMES[getThemeId()] || SCENARIO_NPC_NAMES;
        var n = names[npcId];
        if (!n) return '';
        return n[ui.language] || n.fr;
    }

    function scrChoiceLabel(choiceId) {
        var names = THEME_NPC_NAMES[getThemeId()] || SCENARIO_NPC_NAMES;
        var n = names[choiceId];
        if (n) return n[ui.language] || n.fr || '';
        return choiceId;
    }

    function scrChoiceLabelMulti(label, lang) {
        if (typeof label === 'string') return label;
        return label[lang] || label.fr || label.en || Object.values(label)[0];
    }

    function scrInterrogationConfig(orderIdx) {
        var s = scrGetState();
        var order = s.suspectOrdre;
        var id = s.prochainSuspect || (order && order[orderIdx]) || 'suspect';
        var decorKey = (id === 'seducteur') ? 'barInterieur'
            : (id === 'suspect' ? 'secretPlace'
            : (id === 'marginal' ? 'alley'
            : (id === 'criminel' ? 'publicPlace'
            : 'residence')));
        return { npcId: id, decor: decorKey };
    }

    function scrMusicPlaying(phaseMusic) {
        var themeTrack = (TDAudioService && TDAudioService.getThemeMusic)
            ? TDAudioService.getThemeMusic(getThemeId())
            : THEME_ASSETS[getThemeId()] ? THEME_ASSETS[getThemeId()].music : 'sherlock.mp3';
        if (phaseMusic === 'theme' || phaseMusic === 'credits' || phaseMusic === 'intro') {
            if (window.DPMusicPlayer) {
                try { window.DPMusicPlayer.playTrack(phaseMusic === 'credits' ? 'night ride.mp3' : themeTrack); } catch (e) { /* ignore */ }
            }
        } else if (PHASE_MUSIC_TRACKS[phaseMusic]) {
            if (window.DPMusicPlayer) {
                try { window.DPMusicPlayer.playTrack(PHASE_MUSIC_TRACKS[phaseMusic]); } catch (e) { /* ignore */ }
            }
        }
        updateMusicInfo(phaseMusic || 'investigation', getThemeId(), true);
    }

    function scrEnsureThemeMusic() {
        if (!window.scrThemeMusicStarted) {
            window.scrThemeMusicStarted = true;
            var themeId = getThemeId();
            if (TDAudioService && typeof TDAudioService.setCurrentTheme === 'function') {
                TDAudioService.setCurrentTheme(themeId);
            }
            var themeTrack = (TDAudioService && TDAudioService.getThemeMusic)
                ? TDAudioService.getThemeMusic(themeId)
                : (THEME_ASSETS[themeId] ? THEME_ASSETS[themeId].music : 'sherlock.mp3');
            if (window.DPMusicPlayer) {
                try { window.DPMusicPlayer.playTrack(themeTrack); } catch (e) { /* ignore */ }
            }
            updateTypingSoundButton();
        }
    }
function scrCurrentPhase() { return window.TDPhases[scr.phaseIdx] || null; }

    function startScenarioGame() {
        scrResetState();
        scrEnsureThemeMusic();
        $.themeScreen.classList.add('hidden');
        $.gameScreen.classList.remove('hidden');
        $.gameScreen.classList.add('active');
        $.endScreen.classList.add('hidden');
        renderScenarioPage();
    }

    var EVIDENCE_HINTS = {
        alibi: { fr: 'Des alibis se contredisent.', en: 'Alibis contradict each other.' },
        mobile: { fr: 'Des motivaions financières émergent.', en: 'Financial motives emerge.' },
        opportunity: { fr: 'L\'accès au manoir est la clé.', en: 'Access to the manor is the key.' },
        forensic: { fr: 'Les preuves matérielles parlent.', en: 'Physical evidence speaks.' },
        witness: { fr: 'Des témoins ont vu des ombres.', en: 'Witnesses have seen shadows.' },
        timeline: { fr: 'La chronologie aligne les heures.', en: 'The timeline aligns the hours.' },
    };

    function scrEnrichDialogue(txt, page) {
        if (!txt || txt.indexOf('[ENRICH:clues]') === -1) {
            return txt;
        }
        var s = scrGetState();
        var ev = (s && s.evidence) || {};
        var lang = ui.language;
        var hints = [];
        Object.keys(EVIDENCE_HINTS).forEach(function (k) {
            if (ev[k] > 0) {
                hints.push(TDScenario.t(EVIDENCE_HINTS[k], lang));
            }
        });
        var evidenceCount = (ev.alibi || 0) + (ev.mobile || 0) + (ev.opportunity || 0) + (ev.forensic || 0) + (ev.witness || 0) + (ev.timeline || 0);
        var enrichment = '';
        if (evidenceCount > 0) {
            var hintText = hints.join(' ');
            if (lang === 'fr') {
                enrichment = '\n\n« ' + hintText + ' (Score : ' + evidenceCount + '/18) »';
            } else {
                enrichment = '\n\n"' + hintText + ' (Score: ' + evidenceCount + '/18)"';
            }
        }
        return txt.replace('[ENRICH:clues]', enrichment);
    }

    function renderScenarioPage() {
        if (!scr.active) return;
        var phase = scrCurrentPhase();
        if (!phase) { finishScenario(); return; }
        var page = phase.pages[scr.pageIdx] || null;
        if (!page) { nextScenarioPhase(); return; }

        scr.awaitingChoice = false;
        $.choicesContainer.innerHTML = '';
        $.conversationInput.classList.add('hidden');
        if (!isMobile()) {
            $.continueBtn.classList.add('hidden');
        }
        $.continueBtn.disabled = false;
        $.continueBtn.onclick = null;
        $.npcName.textContent = '';
        hideNPC();

        scrMusicPlaying(phase.music);
        if ($.currentAct) $.currentAct.textContent = phase.act || '';
        if ($.currentScene) $.currentScene.textContent = (scr.pageIdx + 1) + '/' + phase.pages.length;

        var decorKey = page.decor;
        if (decorKey === 'dynamic') decorKey = scrInterrogationConfig(scr.pageIdx).decor;
        var bg = scrDecorImage(decorKey);
        if (bg) setBackground(bg);

        var npcId = page.npc;
        if (npcId === 'dynamic') npcId = scrInterrogationConfig(scr.pageIdx).npcId;
        var txt = TDScenario.t(page.text, ui.language);
        txt = scrEnrichDialogue(txt, page);
        txt = scrSubstituteNames(txt, getThemeId());

        if (page.minigame) {
            npcId = null;
        }

        if (npcId) {
            $.npcName.textContent = scrNpcName(npcId);
            var npcImg = scrNpcImage(npcId);
            if (npcImg) loadNPCImage(npcImg);
        } else {
            $.npcName.textContent = '';
            hideNPC();
        }

        if ($.pageNav) {
            var dots = $.pageNav.querySelectorAll('.page-dot');
            // Nombre de pages variable selon la phase (ex : intro à 4 pages)
            if (dots.length !== phase.pages.length) {
                var navHtml = '';
                for (var i = 0; i < phase.pages.length; i++) {
                    navHtml += '<div class="page-dot' + (i === scr.pageIdx ? ' active' : '') + '" data-page="' + (i + 1) + '"></div>';
                }
                $.pageNav.innerHTML = navHtml;
            } else {
                for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('active', j === scr.pageIdx);
            }
        }

        hideLoading();
        typeWriter(txt, function () { if (scr.active) renderScenarioPageAfter(); });

        // Click pour skipper le typewriter dans le mode scénario
        var gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.onclick = function (e) {
                // Ne pas skipper si on clique sur un bouton ou élément interactif
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                if (ui.isTyping && typeof skipTypeWriter === 'function') {
                    skipTypeWriter();
                }
            };
            gameScreen.style.cursor = 'pointer';
        }
    }

    function renderScenarioPageAfter() {
        var phase = scrCurrentPhase();
        if (!phase) return;
        var page = phase.pages[scr.pageIdx];

        if (page.minigame && window.TDMiniGames) {
            scrShowMinigameGate(page);
            return;
        }
        if (page.interrogation && window.TDNarration && window.TDNarration.interrogations &&
            (window.TDNarration.interrogations[page.interrogation] || page.interrogation === 'dynamic')) {
            var interroId = page.interrogation;
            if (interroId === 'dynamic') {
                var s2 = scrGetState();
                interroId = s2.prochainSuspect || 'suspect';
            }
            var alreadyDone = scr.interro && scr.interro.done && scr.interro.id === interroId;
            if (!alreadyDone) {
                scrStartInterrogation(page);
            } else {
                scrShowAdvance(page);
            }
            return;
        }
        scrShowAdvance(page);
    }

    function scrLaunchMinigame(page) {
        var mgCfg = page.minigame;
        var launched = false;
        var currentOnDone = null;
        function onMinigameDone(res) {
            if (launched) return;
            launched = true;
            if (res && res.won) {
                var s = scrGetState();
                s.miniGamesWon++;
                s.score += 10;
                if (!s.clues) s.clues = [];
                var clue = scrClueFromMinigame(page.minigame);
                var clueCategory = mgCfg.evidence || (mgCfg.type === 'scene_fouille' ? 'forensic' : (mgCfg.type === 'montre_code' ? 'timeline' : (mgCfg.type === 'coffre_code' ? 'mobile' : (mgCfg.type === 'reseau_alibis' ? 'witness' : 'scene'))));
                s.clues.push(clue);
                if (window.TDNarrativeEngine && typeof window.TDNarrativeEngine.addClue === 'function') {
                    window.TDNarrativeEngine.addClue(clue, clueCategory);
                    if (typeof window.TDNarrativeEngine.addStep === 'function') {
                        window.TDNarrativeEngine.addStep(mgCfg.type, clue);
                    }
                }
                showClueToast(clue);
                updateNotebook();
                if (mgCfg.type === 'montre_code' && res.notes) {
                    s.playerNotes = res.notes;
                }
            }
            currentOnDone = null;
            var layer = document.getElementById('minigame-layer');
            if (layer) {
                layer.classList.remove('active');
                layer.innerHTML = '';
            }
            var overlay = document.getElementById('minigame-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
                overlay.querySelector('#minigame-screen-content').innerHTML = '';
            }
            showScreen($.gameScreen);
            scrNext();
        }

        try {
            var s0 = scrGetState();
            if (s0 && s0.watchCode) {
                if (mgCfg.type === 'montre_code') {
                    mgCfg.code = s0.watchCode.slice();
                    mgCfg.timeStr = s0.watchTimeStr;
                }
                if (mgCfg.type === 'coffre_code' && s0 && s0.watchCode) {
                    mgCfg.code = s0.watchCode.slice();
                    mgCfg.timeStr = s0.watchTimeStr;
                }
            }
            if ((mgCfg.type === 'scene_fouille' || mgCfg.type === 'montre_code') && !mgCfg.sceneImage) {
                mgCfg.sceneImage = scrDecorImage('crimeScene');
            }
            var mgThemeId = getThemeId();
            if (mgCfg.clue) {
                if (mgCfg.clue.fr) mgCfg.clue.fr = scrSubstituteNames(mgCfg.clue.fr, mgThemeId);
                if (mgCfg.clue.en) mgCfg.clue.en = scrSubstituteNames(mgCfg.clue.en, mgThemeId);
            }
            if (mgCfg.testimonies) {
                for (var ti = 0; ti < mgCfg.testimonies.length; ti++) {
                    var tm = mgCfg.testimonies[ti];
                    if (tm.witness) {
                        if (tm.witness.fr) tm.witness.fr = scrSubstituteNames(tm.witness.fr, mgThemeId);
                        if (tm.witness.en) tm.witness.en = scrSubstituteNames(tm.witness.en, mgThemeId);
                    }
                    if (tm.statement) {
                        if (tm.statement.fr) tm.statement.fr = scrSubstituteNames(tm.statement.fr, mgThemeId);
                        if (tm.statement.en) tm.statement.en = scrSubstituteNames(tm.statement.en, mgThemeId);
                    }
                }
            }
            $.minigameTitle.textContent = mgCfg.title ? (mgCfg.title[ui.language] || mgCfg.title.fr || mgCfg.title.en || 'Mini-jeu') : 'Mini-jeu';
            $.minigameContent.innerHTML = '';

            var overlay = document.getElementById('minigame-overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
            }
            populateMinigameOverlayChrome(scr.interro ? scr.interro.id : null, mgCfg.title ? (mgCfg.title[ui.language] || mgCfg.title.fr || mgCfg.title.en || 'Mini-jeu') : 'Mini-jeu');
            $.minigameSkipBtn.classList.remove('hidden');
            $.minigameSkipBtn.disabled = false;
            $.minigameSkipBtn.textContent = ui.language === 'fr' ? 'Passer' : 'Skip';
            $.minigameSkipBtn.onclick = null;

            var gameMap = getGlobalGameMap();
            var gameNS = gameMap[mgCfg.type];
            if (!gameNS || !window[gameNS]) {
                TDMiniGames.play(mgCfg, ui.language, onMinigameDone, $.minigameContent);
                currentOnDone = onMinigameDone;
            } else {
                try {
                    window[gameNS].play(mgCfg, ui.language, onMinigameDone, $.minigameContent);
                    currentOnDone = onMinigameDone;
                } catch (e) {
                    console.error('[True Detective] Minigame error "' + mgCfg.type + '" :', e);
                    onMinigameDone({ won: false });
                }
            }
        } catch (e) {
            console.error('[True Detective] Erreur mini-jeu "' + mgCfg.type + '" :', e);
            var overlay = document.getElementById('minigame-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
                overlay.querySelector('#minigame-screen-content').innerHTML = '';
            }
            onMinigameDone({ won: false });
        }
    }

    function scrLaunchMinigame(page) {
        var mgCfg = page.minigame;
        var launched = false;
        var currentOnDone = null;
        function onMinigameDone(res) {
            if (launched) return;
            launched = true;
            if (res && res.won) {
                var s = scrGetState();
                s.miniGamesWon++;
                s.score += 10;
                if (!s.clues) s.clues = [];
                var clue = scrClueFromMinigame(page.minigame);
                var clueCategory = mgCfg.evidence || (mgCfg.type === 'scene_fouille' ? 'forensic' : (mgCfg.type === 'montre_code' ? 'timeline' : (mgCfg.type === 'coffre_code' ? 'mobile' : (mgCfg.type === 'reseau_alibis' ? 'witness' : 'scene'))));
                s.clues.push(clue);
                if (window.TDNarrativeEngine && typeof window.TDNarrativeEngine.addClue === 'function') {
                    window.TDNarrativeEngine.addClue(clue, clueCategory);
                    if (typeof window.TDNarrativeEngine.addStep === 'function') {
                        window.TDNarrativeEngine.addStep(mgCfg.type, clue);
                    }
                }
                showClueToast(clue);
                updateNotebook();
                if (mgCfg.type === 'montre_code' && res.notes) {
                    s.playerNotes = res.notes;
                }
            }
            currentOnDone = null;
            var layer = document.getElementById('minigame-layer');
            if (layer) {
                layer.classList.remove('active');
                layer.innerHTML = '';
            }
            var overlay = document.getElementById('minigame-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
                overlay.querySelector('#minigame-screen-content').innerHTML = '';
            }
            showScreen($.gameScreen);
            scrNext();
        }

        try {
            var s0 = scrGetState();
            if (s0 && s0.watchCode) {
                if (mgCfg.type === 'montre_code') {
                    mgCfg.code = s0.watchCode.slice();
                    mgCfg.timeStr = s0.watchTimeStr;
                }
                if (mgCfg.type === 'coffre_code' && s0 && s0.watchCode) {
                    mgCfg.code = s0.watchCode.slice();
                    mgCfg.timeStr = s0.watchTimeStr;
                }
            }
            if ((mgCfg.type === 'scene_fouille' || mgCfg.type === 'montre_code') && !mgCfg.sceneImage) {
                mgCfg.sceneImage = scrDecorImage('crimeScene');
            }
            var mgThemeId = getThemeId();
            if (mgCfg.clue) {
                if (mgCfg.clue.fr) mgCfg.clue.fr = scrSubstituteNames(mgCfg.clue.fr, mgThemeId);
                if (mgCfg.clue.en) mgCfg.clue.en = scrSubstituteNames(mgCfg.clue.en, mgThemeId);
            }
            if (mgCfg.testimonies) {
                for (var ti = 0; ti < mgCfg.testimonies.length; ti++) {
                    var tm = mgCfg.testimonies[ti];
                    if (tm.witness) {
                        if (tm.witness.fr) tm.witness.fr = scrSubstituteNames(tm.witness.fr, mgThemeId);
                        if (tm.witness.en) tm.witness.en = scrSubstituteNames(tm.witness.en, mgThemeId);
                    }
                }
            }
            $.minigameTitle.textContent = mgCfg.title ? (mgCfg.title[ui.language] || mgCfg.title.fr || mgCfg.title.en || 'Mini-jeu') : 'Mini-jeu';
            $.minigameContent.innerHTML = '';

            var overlay = document.getElementById('minigame-overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
            }
            populateMinigameOverlayChrome(scr.interro ? scr.interro.id : null, mgCfg.title ? (mgCfg.title[ui.language] || mgCfg.title.fr || mgCfg.title.en || 'Mini-jeu') : 'Mini-jeu');
            $.minigameSkipBtn.classList.remove('hidden');
            $.minigameSkipBtn.disabled = false;
            $.minigameSkipBtn.textContent = ui.language === 'fr' ? 'Continuer' : 'Continue';
            $.minigameSkipBtn.onclick = null;
            window._minigameSkipHandler = onMinigameDone;

            var gameMap = getGlobalGameMap();
            var gameNS = gameMap[mgCfg.type];
            if (!gameNS || !window[gameNS]) {
                // Fallback to TDMiniGames.play for unrecognized types
                TDMiniGames.play(mgCfg, ui.language, onMinigameDone, $.minigameContent);
                currentOnDone = onMinigameDone;
            } else {
                try {
                    window[gameNS].play(mgCfg, ui.language, onMinigameDone, $.minigameContent);
                    currentOnDone = onMinigameDone;
                } catch (e) {
                    console.error('[True Detective] Minigame error "' + mgCfg.type + '" :', e);
                    onMinigameDone({ won: false });
                }
            }
        } catch (e) {
            console.error('[True Detective] Erreur mini-jeu "' + mgCfg.type + '" :', e);
            var overlay = document.getElementById('minigame-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
                overlay.querySelector('#minigame-screen-content').innerHTML = '';
            }
            onMinigameDone({ won: false });
        }
    }

    /* Affichage d'un mini-jeu : on laisse d'abord lire le texte, on exige
       un appui sur « Continuer » avant de lancer le mini-jeu. Le bouton
       n'est masqué QUE lorsque le calque du mini-jeu est réellement actif,
       afin qu'un échec silencieux ne bloque jamais l'aventure. */
    function scrShowMinigameGate(page) {
        var lang = ui.language;
        $.continueBtn.classList.remove('hidden');
        $.continueBtn.disabled = false;
        $.continueBtn.textContent = getText('continue') || 'Continuer';
        $.continueBtn.onclick = function () {
            $.continueBtn.disabled = true;
            scrLaunchMinigame(page);
        };
        $.conversationInput.classList.add('hidden');
        // Petit rappel discret tant que le texte est affiché
    }


    /* =====================================================================
       INTERROGATOIRE, 3 phases × 3 questions (box qui se renouvelle).
       Flow : intro → bouton « Interroger » → 3 questions → la question
       s'efface, la réponse remplace la question dans la box → indice
       consigné dans le journal → « Interroger » → phase suivante (les
       3 nouvelles questions remplacent la réponse). Le bouton « Continuer »
       reste toujours à l'écran (désactivé jusqu'à la fin).
       ===================================================================== */
    function itl(obj) {
        if (!obj) return '';
        return obj[ui.language] || obj.fr || obj.en || '';
    }

    function scrInterroRounds(data) {
        if (!data) { return []; }
        if (data.rounds && data.rounds.length) { return data.rounds; }
        var rounds = [];
        var addRound = function (item) {
            if (!item) { return; }
            if (Array.isArray(item)) {
                rounds.push(item.length ? item : []);
            } else {
                rounds.push([item]);
            }
        };
        addRound(data.questions);
        addRound(data.rounds2);
        addRound(data.rounds3);
        return rounds.length ? rounds : [[]];
    }

    function scrStartInterrogation(page) {
        var interroId = page.interrogation;
        if (interroId === 'dynamic') {
            var s = scrGetState();
            interroId = s.prochainSuspect || 'suspect';
        }
        scr.interro = { id: interroId, questionRound: 0, minigameRound: 0, done: false, questionsDone: false };
        // « Continuer » reste à l'écran mais reste inactif pendant l'interrogatoire
        $.continueBtn.classList.remove('hidden');
        $.continueBtn.disabled = !isMobile();
        $.continueBtn.textContent = getText('continue') || 'Continuer';
        if (!isMobile()) {
            $.continueBtn.onclick = null;
        }
        scrShowInterroAskButton();
    }

    function scrShowInterroAskButton() {
        var lang = ui.language;
        var it = scr.interro;
        if (!it) return;

        var interroData = window.TDNarration && window.TDNarration.interrogations ? window.TDNarration.interrogations[it.id] : null;
        var rounds = interroData ? scrInterroRounds(interroData) : [];
        var hasMoreQuestions = !it.questionsDone && (it.questionRound + 1 < rounds.length) && rounds[it.questionRound + 1] && rounds[it.questionRound + 1].length;

        if (hasMoreQuestions) {
            scr.awaitingChoice = true;
            $.choicesContainer.innerHTML = '';
            var askBtn = document.createElement('button');
            askBtn.className = 'btn btn-choice interrogation-ask';
            askBtn.textContent = lang === 'fr' ? '🔍 Interroger' : '🔍 Interrogate';
            askBtn.addEventListener('click', function () {
                if (!scr.awaitingChoice || ui.isTyping) return;
                scr.awaitingChoice = false;
                $.choicesContainer.innerHTML = '';
                scrShowInterroQuestions();
            });
            $.choicesContainer.appendChild(askBtn);
            $.continueBtn.classList.remove('hidden');
            $.continueBtn.disabled = !isMobile();
            $.continueBtn.textContent = getText('continue') || 'Continuer';
            if (!isMobile()) {
                $.continueBtn.onclick = null;
            }
            return;
        }

        if (!it.questionsDone) {
            it.questionsDone = true;
        }

        var phaseNow = scrCurrentPhase();
        var isConfrontation = !!(phaseNow && phaseNow.id === 'act3_3');
        var minigameCfg = null;
        if (isConfrontation && interroData) {
            // Confrontation finale : bataille navale contre chaque suspect,
            // une manche, avant de le désigner coupable ou innocent.
            var mgData = interroData.minigame || null;
            var mgLastDiff = (mgData && mgData.difficulty) ? mgData.difficulty[mgData.difficulty.length - 1] : null;
            minigameCfg = {
                type: 'bataille-navale',
                act: 3,
                title: { fr: 'Bataille navale', en: 'Battleship' },
                clue: (mgLastDiff && mgLastDiff.clue) || { fr: 'Au terme de la bataille navale, le suspect a perdu le contrôle : ses réactions trahissent sa implication dans le complot.', en: 'After the battleship duel, the suspect lost his composure: his reactions betray his involvement in the plot.' },
                failClue: (mgLastDiff && mgLastDiff.failClue) || { fr: 'Vaincu à la bataille navale, le suspect triomphe : il connaît trop bien les eaux de cette affaire.', en: 'Defeated at battleship, the suspect triumphs: he knows these waters far too well.' },
                dialogues: extractInterrogationDialogues(interroData),
                interroId: it.id
            };
        } else if (interroData && interroData.minigame && scrMinigameAllowedHere(it.id)) {
            // Mode normal uniquement : une seule manche, configuration standard.
            minigameCfg = scrGetMinigameRoundConfig(it.id, it.minigameRound || 0);
        }

        if (minigameCfg) {
            scr.awaitingChoice = true;
            $.choicesContainer.innerHTML = '';
            it.pendingMinigameCfg = minigameCfg;
            var mgLabel = minigameCfg.title
                ? (minigameCfg.title[lang] || minigameCfg.title.fr || minigameCfg.title.en || '')
                : '';
            var btnText = mgLabel
                ? (lang === 'fr' ? '🎮 ' + mgLabel : '🎮 ' + mgLabel)
                : (lang === 'fr' ? '🎮 Lancer le défi' : '🎮 Launch challenge');
            var btn = document.createElement('button');
            btn.className = 'btn btn-choice interrogation-ask';
            btn.textContent = btnText;
            btn.addEventListener('click', function () {
                if (!scr.awaitingChoice || ui.isTyping) return;
                scr.awaitingChoice = false;
                $.choicesContainer.innerHTML = '';
                scrShowMinigameRound(0, it.pendingMinigameCfg);
            });
            $.choicesContainer.appendChild(btn);
            $.continueBtn.classList.remove('hidden');
            $.continueBtn.disabled = !isMobile();
            $.continueBtn.textContent = getText('continue') || 'Continuer';
            if (!isMobile()) {
                $.continueBtn.onclick = null;
            }
            return;
        }

        scrEndInterrogation();
    }

    function scrShowInterroQuestions() {
        var it = scr.interro;
        if (!it) { return; }
        var rounds = scrInterroRounds(window.TDNarration.interrogations[it.id]);
        var qs = rounds[it.questionRound] || [];
        var lang = ui.language;
        $.dialogueText.textContent = lang === 'fr'
            ? 'Phase ' + (it.questionRound + 1) + '/3, Choisissez votre question :'
            : 'Phase ' + (it.questionRound + 1) + '/3, Pick your question :';
        $.typeCursor.classList.add('hidden');
        scr.awaitingChoice = true;
        $.choicesContainer.innerHTML = '';
        qs.forEach(function (q) {
            var btn = document.createElement('button');
            btn.className = 'btn btn-choice interrogation-question';
            btn.textContent = scrSubstituteNames(itl(q.label), getThemeId());
            btn.addEventListener('click', function () {
                if (!scr.awaitingChoice) return;
                scr.awaitingChoice = false;
                $.choicesContainer.innerHTML = '';
                scrAskInterroQuestion(q);
            });
            $.choicesContainer.appendChild(btn);
        });
        var skipToMinigameBtn = document.createElement('button');
        skipToMinigameBtn.className = 'btn btn-choice interrogation-skip';
        skipToMinigameBtn.textContent = lang === 'fr' ? '⏭ Passer au défi' : '⏭ Skip to challenge';
        skipToMinigameBtn.addEventListener('click', function () {
            if (!scr.awaitingChoice) return;
            scr.awaitingChoice = false;
            $.choicesContainer.innerHTML = '';
            it.questionsDone = true;
            scrShowInterroAskButton();
        });
        $.choicesContainer.appendChild(skipToMinigameBtn);
    }

    function scrAskInterroQuestion(q) {
    var response = TDScenario.t(q.response, ui.language) || '';
    response = scrEnrichResponse(response, q);
    response = scrSubstituteNames(response, getThemeId());
    typeWriter(response, function () {
        if (!scr.active) { return; }
        var clue = scrClueFromInterroResponse(response);
        if (clue) {
            var s = scrGetState();
            if (!s.clues) { s.clues = []; }
            var clueCategory = q.evidence || 'dialogue';
            if (s.clues.indexOf(clue) === -1) { s.clues.push(clue); }
            if (window.TDNarrativeEngine && typeof window.TDNarrativeEngine.addClue === 'function') {
                window.TDNarrativeEngine.addClue(clue, clueCategory);
                if (typeof window.TDNarrativeEngine.addStep === 'function') {
                    window.TDNarrativeEngine.addStep('interrogation', clue);
                }
            }
            if (q.evidence && typeof TDScenario.recordEvidence === 'function') {
                TDScenario.recordEvidence(q.evidence);
            }
            showClueToast(clue);
            updateNotebook();
        }
        var it = scr.interro;
        if (!it.answeredQuestions) { it.answeredQuestions = []; }
        it.answeredQuestions.push(q.id || q.label);
        var rounds = scrInterroRounds(window.TDNarration.interrogations[it.id]);
        if (it.questionRound + 1 < rounds.length && rounds[it.questionRound + 1] && rounds[it.questionRound + 1].length) {
            it.questionRound++;
            scrShowInterroAskButton();
        } else {
            it.questionsDone = true;
            scrShowInterroAskButton();
        }
    });
    }

    function scrEnrichResponse(response, q) {
        if (!TDScenario || !TDScenario.getState) { return response; }
        var s = TDScenario.getState();
        var ev = s.evidence || {};
        var lang = ui.language;
        var suspectId = scr.interro ? scr.interro.id : null;
        var enrich = '';
        var evidenceCount = (ev.alibi || 0) + (ev.mobile || 0) + (ev.opportunity || 0) + (ev.forensic || 0) + (ev.witness || 0) + (ev.timeline || 0);
        if (evidenceCount >= 3 && suspectId && q.evidence) {
            var catFilled = ev[q.evidence] > 0;
            if (catFilled) {
                if (lang === 'fr') {
                    enrich = '<br><br><small class="interro-enrich">Laissez-moi vous rappeler : vous avez déjà une preuve solide dans la catégorie ' + scrEvidenceLabel(q.evidence, lang) + '. Cette réponse vous laisse tranquille... ou trahi.</small>';
                } else {
                    enrich = '<br><br><small class="interro-enrich">Let me remind you: you already hold solid evidence in the ' + scrEvidenceLabel(q.evidence, lang) + ' category. This answer leaves him uneasy... or trapped.</small>';
                }
            }
        }
        return response + enrich;
    }

    function scrEvidenceLabel(cat, lang) {
        var labels = {
            fr: { alibi: 'Alibi', mobile: 'Mobile', opportunity: 'Occasion', forensic: 'Forensique', witness: 'Témoins', timeline: 'Chronologie' },
            en: { alibi: 'Alibi', mobile: 'Motive', opportunity: 'Opportunity', forensic: 'Forensic', witness: 'Witnesses', timeline: 'Timeline' }
        };
        var dict = labels[lang] || labels.en;
        return dict[cat] || cat;
    }

    function scrClueFromInterroResponse(text) {
        if (!text) { return null; }
        var m = text.match(/\[(?:[^\]]*(?:Indice|clue)[^\]]*)\][^\n]*/gi);
        return m && m.length ? m.join(' ') : null;
    }

    function scrEndInterrogation() {
        scr.interro.done = true;
        scr.awaitingChoice = false;
        $.continueBtn.disabled = false;
        $.continueBtn.textContent = getText('continue') || 'Continuer';
        $.continueBtn.onclick = function () {
            if (scr.interro && !scr.interro.done) { return; }
            var s = scrGetState();
            if (s.prochainSuspect) {
                s.prochainSuspect = null;
            }
            renderScenarioPage();
        };
    }
    // ===== LOCALISATION DES MINI-JEUX D'INTERROGATOIRE =====
    // Chaque suspect n'a son mini-jeu qu'à UN seul endroit de l'aventure.
    // Clé = id de l'interrogation, valeur = { phase: id de phase, pageIdx: index de page }.
    // Tout autre emplacement (Acte 1, Acte 2, Révélation...) reste en interrogation simple.
    var MINIGAME_LOCATIONS = {
        'protecteur':    { phase: 'act2_3', pageIdx: 0 },  // Acte 2, Interrogatoires P1 : tir forain
        'femme-fatale':  { phase: 'act1_1', pageIdx: 1 },  // Acte 1, Interrogatoires P2 : échecs
        'seducteur':     { phase: 'act2_3', pageIdx: 2 },  // Acte 2, Interrogatoires P3 : jackpot
        'suspect':       { phase: 'act2_3', pageIdx: 4 },  // Acte 2, Interrogatoires P5 : sudoku
        'marginal':      { phase: 'act1_2', pageIdx: 3 },  // Acte 1, Témoignages P4 : tour de cartes
        'criminel':      { phase: 'act1_3', pageIdx: 2 }   // Acte 1, Piste du bar P3 : mémoire
    };

    function scrMinigameAllowedHere(interroId) {
        var loc = MINIGAME_LOCATIONS[interroId];
        if (!loc) { return false; }
        var phase = scrCurrentPhase();
        if (!phase) { return false; }
        return phase.id === loc.phase && scr.pageIdx === loc.pageIdx;
    }

    function scrGetMinigameRoundConfig(interroId, roundIndex) {
        if (!interroId || !window.TDNarration || !window.TDNarration.interrogations) return null;
        var interro = window.TDNarration.interrogations[interroId];
        if (!interro || !interro.minigame) return null;
        var act = scrGetState() ? (scrGetState().act || 1) : 1;
        var diffIdx = Math.min(act - 1, interro.minigame.difficulty.length - 1);
        var diff = interro.minigame.difficulty[diffIdx];
        if (!diff) return null;
        var roundCfg = diff.rounds && diff.rounds[roundIndex] ? diff.rounds[roundIndex] : null;
        if (!roundCfg) return null;

        var mgType = interro.minigame.type;
        // Le jeu est propre à chaque suspect, quel que soit l'univers :
        // protecteur = tir forain, seducteur = jackpot, etc. (pas de remap par thème).
        var themeId = (typeof getThemeId === 'function' ? getThemeId() : null) || 'agatha-christie';

        var cfg = {
            type: mgType,
            act: act,
            clue: diff.clue,
            failClue: diff.failClue,
            dialogues: extractInterrogationDialogues(interro),
            interroId: interroId
        };
        if (mgType === 'chess') {
            cfg.depth = roundCfg.depth;
            cfg.title = roundCfg.title;
        } else if (mgType === 'puzzle') {
            cfg.title = roundCfg.title;
        } else if (mgType === 'sudoku') {
            cfg.title = roundCfg.title;
        } else if (mgType === 'jackpot') {
            cfg.spins = Math.min(roundCfg.spins || 9, 9);
            cfg.winThreshold = roundCfg.winThreshold;
            cfg.title = roundCfg.title;
            if (roundCfg.dialogues) cfg.dialogues = roundCfg.dialogues;
        } else if (mgType === 'domino') {
            cfg.title = roundCfg.title;
        } else if (mgType === 'pong' || mgType === 'pacman' || mgType === 'space-invaders' || mgType === 'breakout' || mgType === 'asteroids' || mgType === 'shooting' || mgType === 'shooting-gallery') {
            cfg.title = roundCfg.title;
        }
        return cfg;
    }

    function extractInterrogationDialogues(interro) {
        var lines = [];
        if (!interro) return lines;
        var collect = function (arr) {
            if (!arr) return;
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (item && item.response) {
                    var text = '';
                    if (typeof item.response === 'string') {
                        text = item.response;
                    } else if (item.response.fr || item.response.en) {
                        text = item.response.fr || item.response.en || '';
                    }
                    if (text) lines.push(text);
                }
                if (item && item.intro) {
                    var introText = '';
                    if (typeof item.intro === 'string') {
                        introText = item.intro;
                    } else if (item.intro.fr || item.intro.en) {
                        introText = item.intro.fr || item.intro.en || '';
                    }
                    if (introText) lines.push(introText);
                }
            }
        };
        collect(interro.questions);
        collect(interro.rounds2);
        collect(interro.rounds3);
        return lines;
    }

    // Map a difficulty tier (1..4) onto per-game config parameters
    function applyDifficultyToCfg(minigameType, cfg, difficulty) {
        var tier = { easy: 1, medium: 2, hard: 3, extreme: 4 }[difficulty] || 2;
        cfg.difficulty = difficulty || 'medium';
        cfg.diffTier = tier;
        cfg.act = Math.min(tier, 3);
        if (tier >= 4) cfg.extreme = true;
        if (minigameType === 'chess') {
            cfg.depth = Math.min(tier, 3); // minimax depth 1..3 (4 would be too slow)
        } else if (minigameType === 'pong') {
            cfg.winScore = 10;
            cfg.aiSpeed = 0.02 + tier * 0.03;      // 0.05..0.14
        } else if (minigameType === 'space-invaders') {
            cfg.rows = Math.min(2 + tier, 6);      // 3..6 rows of aliens
            cfg.cols = 4 + tier;                   // 5..8 columns
        }
        return cfg;
    }

    function getGlobalGameMap() {
        return {
            chess: 'TDChessGame',
            memory: 'TDMemoryGame',
            sudoku: 'TDConnect4Game',
            connect4: 'TDConnect4Game',
            chemistry: 'TDChemistryGame',
            coffre_code: 'TDMiniGames',
            cryptogramme: 'TDMiniGames',
            confrontation_ultime: 'TDMiniGames',
            jackpot: 'TDMiniGames',
            domino: 'TDDominoGame',
            puzzle: 'TDPuzzleGame',
            reseau_alibis: 'TDMiniGames',
            shooting: 'TDShootingGallery',
            pong: 'TDPongGame',
            pacman: 'TDPacmanGame',
            'space-invaders': 'TDSpaceInvaders',
            breakout: 'TDBreakoutGame',
            asteroids: 'TDAsteroids',
            'bataille-navale': 'TDBatailleNavale'
        };
    }

    function launchMinigameFromSelection(minigameType) {
        $.minigameSelectScreen.classList.remove('active');
        $.minigameSelectScreen.classList.add('hidden');

        var gameMap = getGlobalGameMap();

        var gameNS = gameMap[minigameType];
        if (!gameNS || !window[gameNS]) {
            showToast('Minigame not available: ' + minigameType, true);
            $.minigameSelectScreen.classList.remove('hidden');
            $.minigameSelectScreen.classList.add('active');
            return;
        }

        var cfg = { type: minigameType, act: 1 };
        if (minigameType === 'chess') {
            cfg.depth = 1;
            cfg.title = { fr: 'Échec', en: 'Chess' };
        } else if (minigameType === 'memory') {
            cfg.title = { fr: 'Mémoire', en: 'Memory' };
        } else if (minigameType === 'sudoku') {
            cfg.title = { fr: 'Sudoku', en: 'Sudoku' };
        } else if (minigameType === 'jackpot') {
            cfg.spins = 6;
            cfg.title = { fr: 'Jackpot', en: 'Jackpot' };
        } else if (minigameType === 'domino') {
            cfg.title = { fr: 'Tour de cartes', en: 'Card Tower' };
        } else if (minigameType === 'reseau_alibis') {
            cfg.title = { fr: 'Réseau d\'alibis', en: 'Alibi Network' };
        } else if (minigameType === 'puzzle') {
            cfg.title = { fr: 'Casse-tête', en: 'Sliding Puzzle' };
        }

        $.minigameTitle.textContent = cfg.title[ui.language] || cfg.title.en || minigameType;
        $.minigameContent.innerHTML = '';

        if (minigameType !== 'reseau_alibis') {
            showDifficultySelection(cfg, function (selectedDifficulty) {
                applyDifficultyToCfg(minigameType, cfg, selectedDifficulty);
                startSelectedMinigame(minigameType, cfg);
            });
        } else {
            startSelectedMinigame(minigameType, cfg);
        }
    }

    function startSelectedMinigame(minigameType, cfg) {
        var overlay = document.getElementById('minigame-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
        populateMinigameOverlayChrome(scr.interro ? scr.interro.id : null, cfg.title ? (cfg.title[ui.language] || cfg.title.fr || cfg.title.en || minigameType) : minigameType);
        $.minigameSkipBtn.classList.remove('hidden');
        $.minigameSkipBtn.disabled = false;
        $.minigameSkipBtn.textContent = ui.language === 'fr' ? 'Continuer' : 'Continue';

        window._minigameSkipHandler = null;
        var resultAnnounced = false;

        function onMinigameDone(result) {
            if (resultAnnounced) return;
            resultAnnounced = true;
            window._minigameSkipHandler = null;
            if (overlay) {
                overlay.classList.add('hidden');
                overlay.querySelector('#minigame-screen-content').innerHTML = '';
            }
            $.minigameSelectScreen.classList.remove('hidden');
            $.minigameSelectScreen.classList.add('active');
        }
        window._minigameSkipHandler = onMinigameDone;

        var gameMap = getGlobalGameMap();
        var gameNS = gameMap[minigameType];
        if (!gameNS || !window[gameNS]) {
            showToast('Minigame not available: ' + minigameType, true);
            $.minigameSelectScreen.classList.remove('hidden');
            $.minigameSelectScreen.classList.add('active');
            return;
        }

        try {
            window[gameNS].play(cfg, ui.language, onMinigameDone, $.minigameContent);
        } catch (e) {
            console.error('[True Detective] Minigame error "' + minigameType + '" :', e);
            onMinigameDone({ won: false });
        }
    }

    function scrShowMinigameRound(roundIndex, forcedCfg) {
        var it = scr.interro;
        if (!it) return;
        var roundCfg = forcedCfg || scrGetMinigameRoundConfig(it.id, roundIndex);
        if (!roundCfg) {
            scrShowInterroQuestions();
            return;
        }

        $.continueBtn.classList.add('hidden');
        $.choicesContainer.innerHTML = '';
        $.dialogueText.textContent = itl({
            fr: 'Défi : ' + (roundCfg.title ? roundCfg.title.fr : 'Minijeux'),
            en: 'Challenge: ' + (roundCfg.title ? roundCfg.title.en : 'Minigame')
        });
        $.typeCursor.classList.add('hidden');

        var mgTitle = roundCfg.title
            ? (roundCfg.title[ui.language] || roundCfg.title.fr || roundCfg.title.en || '')
            : '';
        $.minigameTitle.textContent = mgTitle || (ui.language === 'fr' ? 'Minijeux' : 'Minigame');
        $.minigameContent.innerHTML = '';

        // Mode normal uniquement : une seule difficulté standard pour tous les mini-jeux.
        var chosenDiff = roundCfg.difficulty || 'medium';

        if (roundCfg.type !== 'reseau_alibis') {
            applyDifficultyToCfg(roundCfg.type, roundCfg, chosenDiff);
            launchMinigame(roundIndex, roundCfg);
        } else {
            launchMinigame(roundIndex, roundCfg);
        }
    }

    function scrHandleMinigameResult(roundIndex, result) {
        if (typeof window._interroSidebarCleanup === 'function') {
            window._interroSidebarCleanup();
            window._interroSidebarCleanup = null;
        }
        var layer = document.getElementById('minigame-layer');
        if (layer) { layer.classList.remove('active'); layer.innerHTML = ''; }
        var overlay = document.getElementById('minigame-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('interro-layout');
            overlay.classList.remove('chess-layout');
            overlay.classList.remove('retro-layout');
            var container = overlay.querySelector('.minigame-overlay-container');
            if (container) container.classList.remove('chess-game-layout');
            if (overlay.querySelector('#minigame-screen-content')) {
                overlay.querySelector('#minigame-screen-content').innerHTML = '';
            }
        }
        hideScreen($.minigameScreen);
        showScreen($.gameScreen);

        var it = scr.interro;
        if (!it) return;

        var won = result && result.won;
        var clueText = won
            ? (itl(scrGetMinigameRoundConfig(it.id, roundIndex).clue) || '')
            : (itl(scrGetMinigameRoundConfig(it.id, roundIndex).failClue) || '');

        if (clueText) {
            var s = scrGetState();
            if (!s.clues) s.clues = [];
            if (s.clues.indexOf(clueText) === -1) s.clues.push(clueText);
            if (window.TDNarrativeEngine && typeof window.TDNarrativeEngine.addClue === 'function') {
                window.TDNarrativeEngine.addClue(clueText, won ? 'dialogue' : 'dialogue');
            }
            showClueToast(clueText);
            updateNotebook();
        }

        it.minigameRound = roundIndex + 1;
        if (it.minigameRound < 3 && scrGetMinigameRoundConfig(it.id, it.minigameRound)) {
            scrShowInterroAskButton();
        } else {
            scrEndInterrogation();
        }
    }

    function populateMinigameOverlayChrome(suspectId, dialogueText) {
        if ($.minigameBgLayer) {
            var decorKey = 'residence';
            if (scr && scr.interro && scr.interro.id) {
                var interroData = window.TDNarration && window.TDNarration.interrogations ? window.TDNarration.interrogations[scr.interro.id] : null;
                if (interroData && interroData.decor) decorKey = interroData.decor;
            }
            var bgUrl = scrDecorImage(decorKey);
            $.minigameBgLayer.style.backgroundImage = bgUrl ? 'url(' + bgUrl + ')' : '';
        }
        if ($.minigameNpcImage) {
            var npcUrl = scrNpcImage(suspectId || (scr && scr.interro ? scr.interro.id : null));
            $.minigameNpcImage.src = npcUrl || '';
            $.minigameNpcImage.style.display = npcUrl ? 'block' : 'none';
        }
        if ($.minigameDialogueText && dialogueText) {
            $.minigameDialogueText.textContent = dialogueText;
        }
    }

    function showDifficultySelection(roundCfg, callback) {
        var overlay = document.createElement('div');
        overlay.className = 'difficulty-overlay active';
        var lang = ui.language;
        var difficulties = [
            { id: 'easy', label: lang === 'fr' ? 'Facile' : 'Easy', desc: lang === 'fr' ? 'Pour débutants' : 'For beginners' },
            { id: 'medium', label: lang === 'fr' ? 'Moyen' : 'Medium', desc: lang === 'fr' ? 'Équilibré' : 'Balanced' },
            { id: 'hard', label: lang === 'fr' ? 'Difficile' : 'Hard', desc: lang === 'fr' ? 'Pour experts' : 'For experts' },
            { id: 'extreme', label: lang === 'fr' ? 'Extrême' : 'Extreme', desc: lang === 'fr' ? 'Sans pitié' : 'No mercy' }
        ];
        var html = '<div class="difficulty-box"><h3>' + (lang === 'fr' ? 'Choisissez la difficulté' : 'Choose difficulty') + '</h3><div class="difficulty-options">';
        difficulties.forEach(function (d) {
            html += '<button class="btn btn-difficulty" data-difficulty="' + d.id + '"><span class="difficulty-label">' + d.label + '</span><span class="difficulty-desc">' + d.desc + '</span></button>';
        });
        html += '</div></div>';
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        overlay.querySelectorAll('.btn-difficulty').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var difficulty = btn.dataset.difficulty;
                overlay.remove();
                callback(difficulty);
            });
        });
    }

    function launchMinigame(roundIndex, roundCfg) {
        $.minigameOverlay = document.getElementById('minigame-overlay');
        if ($.minigameOverlay) {
            $.minigameOverlay.classList.remove('hidden');
        }
        populateMinigameOverlayChrome(scr.interro ? scr.interro.id : null, (roundCfg.title && (roundCfg.title.fr || roundCfg.title.en)) ? (roundCfg.title[ui.language] || roundCfg.title.fr || roundCfg.title.en) : (ui.language === 'fr' ? 'Minijeux ' + (roundIndex + 1) : 'Minigame ' + (roundIndex + 1)));
        $.minigameSkipBtn.classList.remove('hidden');
        $.minigameSkipBtn.disabled = false;
        $.minigameSkipBtn.textContent = ui.language === 'fr' ? 'Continuer' : 'Continue';

        window._minigameSkipHandler = null;
        var resultAnnounced = false;

        function onMinigameDone(result) {
            if (typeof window._interroSidebarCleanup === 'function') {
                window._interroSidebarCleanup();
                window._interroSidebarCleanup = null;
            }
            if (resultAnnounced) return;
            resultAnnounced = true;
            window._minigameSkipHandler = null;
            if ($.minigameOverlay) {
                $.minigameOverlay.classList.add('hidden');
            }
            scrHandleMinigameResult(roundIndex, result);
        }
        window._minigameSkipHandler = onMinigameDone;

        var gameMap = getGlobalGameMap();
        var gameNS = gameMap[roundCfg.type];
        if (!gameNS || !window[gameNS]) {
            setTimeout(function () { scrHandleMinigameResult(roundIndex, { won: false }); }, 100);
            return;
        }

        var mgCfg = {
            type: roundCfg.type,
            depth: roundCfg.depth,
            spins: roundCfg.spins,
            winThreshold: roundCfg.winThreshold,
            title: roundCfg.title,
            clue: roundCfg.clue,
            failClue: roundCfg.failClue,
            act: roundCfg.act,
            difficulty: roundCfg.difficulty,
            dialogues: roundCfg.dialogues,
            interroId: roundCfg.interroId,
            storyMode: true
        };
        if (mgCfg.difficulty) applyDifficultyToCfg(mgCfg.type, mgCfg, mgCfg.difficulty);

        try {
            window[gameNS].play(mgCfg, ui.language, onMinigameDone, $.minigameContent);
        } catch (e) {
            console.error('[True Detective] Minigame error "' + roundCfg.type + '" :', e);
            scrHandleMinigameResult(roundIndex, { won: false });
        }
    }

    function scrClueFromMinigame(mg) {
        if (!mg) return ui.language === 'fr' ? 'Indice bonus' : 'Bonus clue';
        var lang = ui.language;
        if (mg.hotspots && mg.hotspots.length) {
            var first = mg.hotspots[0];
            var info = (first.info && (first.info[lang] || first.info.fr || first.info.en)) || first.label;
            return (lang === 'fr' ? 'Indice relevé : ' : 'Clue found : ') + first.label + ', ' + info;
        }
        var title = (mg.title && (mg.title[lang] || mg.title.fr || mg.title.en)) || (lang === 'fr' ? 'Indice bonus' : 'Bonus clue');
        return (lang === 'fr' ? 'Indice relevé : ' : 'Clue found : ') + title;
    }

    function renderEvidenceBeam(summary) {
        if (!summary) return;
        var s = scrGetState();
        var ev = s.evidence || {};
        var cats = [
            ['alibi', 'Alibi'], ['mobile', 'Mobile'], ['opportunity', 'Opportunité'],
            ['forensic', 'Scientifique'], ['witness', 'Témoins'], ['timeline', 'Chronologie']
        ];
        var html = '<div class="evidence-beam">';
        html += '<div class="evidence-beam-title">FAISCEAU DE PREUVES \u2014 ' + summary.score + '/' + summary.max + ' indices rassembl\u00e9s</div>';
        cats.forEach(function (cc) {
            var val = ev[cc[0]] || 0;
            var pct = Math.round((val / 3) * 100);
            html += '<div class="evidence-row">';
            html += '<span class="evidence-label">' + cc[1] + '</span>';
            html += '<span class="evidence-track"><span class="evidence-fill ' + (val > 0 ? 'active' : '') + '" style="width:' + pct + '%"></span></span>';
            html += '<span class="evidence-count">' + val + '/3</span>';
            html += '</div>';
        });
        html += '</div>';
        var div = document.createElement('div');
        div.innerHTML = html;
        $.choicesContainer.appendChild(div);
    }

    function scrShowAdvance(page) {
        if (page.evidenceSummary) {
            renderEvidenceBeam(page.evidenceSummary);
            $.continueBtn.classList.remove('hidden');
            $.continueBtn.textContent = getText('continue') || 'Continuer';
            $.continueBtn.onclick = function () { scrNext(); };
            return;
        }
        if (page.choiceKey) {
            var choices = page.choices || [];
            scr.awaitingChoice = true;
            $.choicesContainer.innerHTML = '';
            choices.forEach(function (choiceItem) {
                var choiceId, label;
                if (typeof choiceItem === 'string') {
                    choiceId = choiceItem;
                } else {
                    choiceId = choiceItem.id;
                    label = choiceItem.label;
                }
                var btn = document.createElement('button');
                btn.className = 'btn btn-choice';
                btn.textContent = scrSubstituteNames(label ? scrChoiceLabelMulti(label, ui.language) : scrChoiceLabel(choiceId), getThemeId());
                btn.addEventListener('click', function () {
                    if (!scr.awaitingChoice) return;
                    scr.awaitingChoice = false;
                    scrApplyChoice(choiceItem.choiceKey || page.choiceKey, choiceId);
                });
                $.choicesContainer.appendChild(btn);
            });
            if (page.choiceKey === 'accuser') {
                var s = scrGetState();
                var reinterroges = s.reinterroges || [];
                var suspects = ['protecteur', 'femme-fatale', 'seducteur', 'suspect', 'marginal', 'criminel'];
                suspects.forEach(function (suspectId) {
                    if (reinterroges.indexOf(suspectId) >= 0) return;
                    var btn = document.createElement('button');
                    btn.className = 'btn btn-choice';
                    btn.textContent = (ui.language === 'fr' ? 'Réinterroger ' : 'Re-interrogate ') + scrChoiceLabel(suspectId);
                    btn.addEventListener('click', function () {
                        if (!scr.awaitingChoice) return;
                        scr.awaitingChoice = false;
                        s.prochainSuspect = suspectId;
                        scr.interro = { id: suspectId, questionRound: 0, minigameRound: 0, done: false, questionsDone: false };
                        $.continueBtn.classList.remove('hidden');
                        $.continueBtn.disabled = !isMobile();
                        $.continueBtn.textContent = getText('continue') || 'Continuer';
                        if (!isMobile()) {
                            $.continueBtn.onclick = null;
                        }
                        scrShowInterroAskButton();
                    });
                    $.choicesContainer.appendChild(btn);
                });
            }
        } else {
            $.continueBtn.classList.remove('hidden');
            $.continueBtn.textContent = getText('continue') || 'Continuer';
            $.continueBtn.onclick = function () { scrNext(); };
        }
    }

    function scrNext() {
        var phase = scrCurrentPhase();
        if (!phase) return;
        if (scr.pageIdx < (phase.pages.length - 1)) {
            scr.pageIdx++;
            renderScenarioPage();
        } else {
            nextScenarioPhase();
        }
    }

    function nextScenarioPhase() {
        var prevPhase = scrCurrentPhase();
        var prevAct = prevPhase ? prevPhase.act : null;
        scr.phaseIdx++;
        scr.pageIdx = 0;
        if (!scrCurrentPhase()) { finishScenario(); return; }
        var nextPhase = scrCurrentPhase();
        var nextAct = nextPhase ? nextPhase.act : null;
        if (nextAct && nextAct !== prevAct && scrShouldShowActPage(nextAct)) {
            scrShowActPage(nextAct, function () {
                renderScenarioPage();
            });
        } else {
            renderScenarioPage();
        }
    }

    function finishScenario() {
        scr.active = false;
        var s = scrGetState();
        var ending = buildEnding(s);
        s.ending = ending;
        showScenarioEnding(ending);
    }
function scrApplyChoice(choiceKey, choiceId) {
        var s = scrGetState();
        if (choiceKey === 'choisirSuspect') {
            s.prochainSuspect = choiceId;
            var all = ['femme-fatale', 'seducteur', 'suspect'];
            var others = all.filter(function (x) { return x !== choiceId; });
            s.suspectOrdre = [choiceId].concat(others);
            scrNext();
        } else if (choiceKey === 'reinterroger') {
            if (!s.reinterroges) s.reinterroges = [];
            if (s.reinterroges.indexOf(choiceId) >= 0) {
                scrNext();
                return;
            }
            s.reinterroges.push(choiceId);
            scr.interro = { id: choiceId, questionRound: 0, minigameRound: 0, done: false, questionsDone: false };
            $.continueBtn.classList.remove('hidden');
            $.continueBtn.disabled = !isMobile();
            $.continueBtn.textContent = getText('continue') || 'Continuer';
            if (!isMobile()) {
                $.continueBtn.onclick = null;
            }
            scrShowInterroAskButton();
        } else if (choiceKey === 'accuser') {
            s.accused = choiceId;
            scr.phaseIdx++;
            scr.pageIdx = 0;
            buildOutroPages(s);
            var outro = scrCurrentPhase();
            if (outro) {
                outro.music = 'theme';
                outro.pages = outro.pages || [];
            }
            renderScenarioPage();
        } else {
            scrNext();
        }
    }

    function buildOutroPages(s) {
        var truth = TDScenario.getTruth();
        var themeId = getThemeId();
        var lang = ui.language;
        var evalResult = TDScenario.evaluateAccusation(s.accused);
        var good = evalResult.correct;
        var titleTxt = scrThemedTitle(truth.culprit, lang);
        var innocentTitle = scrSubstituteNames(scrChoiceLabel(s.accused), themeId);
        var morale = scrSubstituteNames(truth.morale ? TDScenario.t(truth.morale, lang) : '', themeId);
        var score = evalResult.score;
        var maxScore = evalResult.max;
        var reaction = scrSubstituteNames(evalResult.reaction, themeId);

        var beamHtml = '<div class="evidence-beam"><div class="evidence-beam-title">📋 FAISCEAU DE PREUVES (' + score + '/' + maxScore + ')</div>';
        var cats = state().evidence;
        var labels = { alibi: 'Alibi', mobile: 'Mobile', opportunity: 'Opportunité', forensic: 'Forensique', witness: 'Témoin', timeline: 'Chronologie' };
        var catKeys = ['alibi', 'mobile', 'opportunity', 'forensic', 'witness', 'timeline'];
        for (var i = 0; i < catKeys.length; i++) {
            var k = catKeys[i];
            var v = cats[k] || 0;
            var pct = Math.min(100, (v / 3) * 100);
            beamHtml += '<div class="evidence-row"><span class="evidence-label">' + labels[k] + '</span><div class="evidence-track"><div class="evidence-fill' + (v > 0 ? ' active' : '') + '" style="width:' + pct + '%"></div></div><span class="evidence-count">' + v + '/3</span></div>';
        }
        beamHtml += '</div>';

        var winTxt = scrGetOutroText('win', lang);
        var indirectTxt = scrGetOutroText('indirect', lang);
        var failTxt = scrGetOutroText('fail', lang);
        var exileTxt = scrGetOutroText('exile', lang);
        var methodeTxt = scrSubstituteNames(TDScenario.t(truth.methode, lang), themeId);
        var prisonTxt = scrSubstituteNames(TDScenario.t(truth.prison, lang), themeId);

        var pages = [];
        if (good) {
            /* Fin 1 — Accusation juste : 3 pages (prison → QG extérieur → photo univers) */
            pages.push({
                decor: 'prison', npc: null,
                text: {
                    fr: '<div class="accuse-screen"><div class="accuse-result success">✅ ACCUSATION JUSTE</div><div class="accuse-reaction">' + reaction + '</div>' + beamHtml + '<div class="accuse-summary">' + titleTxt + ' est coupable. ' + methodeTxt + '</div></div><div class="ending-text">Derrière les barreaux, le coupable s\'effondre. ' + prisonTxt + '</div>',
                    en: '<div class="accuse-screen"><div class="accuse-result success">✅ RIGHT ACCUSATION</div><div class="accuse-reaction">' + reaction + '</div>' + beamHtml + '<div class="accuse-summary">' + titleTxt + ' is guilty. ' + methodeTxt + '</div></div><div class="ending-text">Behind the bars, the culprit breaks down. ' + prisonTxt + '</div>'
                }
            });
            pages.push({
                decor: 'qg', npc: 'detective-partner',
                text: {
                    fr: '<div class="ending-text">' + scrSubstituteNames('Devant le quartier général, votre partenaire Wexford vous félicite. « Affaire classée, inspecteur. Votre méthode a porté ses fruits. »', themeId) + '</div>',
                    en: '<div class="ending-text">' + scrSubstituteNames('Outside headquarters, your partner Wexford congratulates you. "Case closed, inspector. Your method bore fruit."', themeId) + '</div>'
                }
            });
            pages.push({
                decor: 'sherlock', npc: null,
                text: {
                    fr: '<div class="ending-text">' + winTxt + ' ' + morale + '</div>',
                    en: '<div class="ending-text">' + winTxt + ' ' + morale + '</div>'
                }
            });
        } else if (evalResult.indirectConviction) {
            /* Fin 2b — Accusation erronée MAIS faisceau d'indices suffisant :
               le vrai coupable est piégé par les preuves et arrete */
            pages.push({
                decor: 'exile', npc: null,
                text: {
                    fr: '<div class="accuse-screen"><div class="accuse-result partial">⚠ ACCUSATION ERRONÉE, MAIS LES PREUVES PARLENT</div><div class="accuse-reaction">' + reaction + '</div>' + beamHtml + '<div class="accuse-summary">Vous accusez ' + innocentTitle + ', un innocent. Mais le faisceau d\'indices est si épais que ' + titleTxt + ' ne peut plus se cacher.</div></div><div class="ending-text">' + exileTxt + ' Mais la pression des preuves le force à abandonner sa course. Il lâche un aveu avant de s\'envoler.</div>',
                    en: '<div class="accuse-screen"><div class="accuse-result partial">⚠ WRONG ACCUSATION, BUT THE EVIDENCE SPEAKS</div><div class="accuse-reaction">' + reaction + '</div>' + beamHtml + '<div class="accuse-summary">You accuse ' + innocentTitle + ', an innocent. But the evidence beam is so thick that ' + titleTxt + ' can no longer hide.</div></div><div class="ending-text">' + exileTxt + ' But the weight of the evidence forces him to abandon his flight. He breaks down before takeoff.</div>'
                }
            });
            pages.push({
                decor: 'prison', npc: null,
                text: {
                    fr: '<div class="ending-text">' + titleTxt + ' est finalement arrêté grâce aux preuves que vous avez collectées. La vérité a triplé en fin de compte.</div>',
                    en: '<div class="ending-text">' + titleTxt + ' is finally arrested thanks to the evidence you collected. The truth prevails in the end.</div>'
                }
            });
            pages.push({
                decor: 'sherlock', npc: null,
                text: {
                    fr: '<div class="ending-text">' + indirectTxt + ' ' + morale + '</div>',
                    en: '<div class="ending-text">' + indirectTxt + ' ' + morale + '</div>'
                }
            });
        } else {
            /* Fin 2 — Accusation erronée : 3 pages (île paradisiaque → prison innocent → photo univers) */
            pages.push({
                decor: 'exile', npc: null,
                text: {
                    fr: '<div class="accuse-screen"><div class="accuse-result failure">❌ ACCUSATION ERRONÉE</div><div class="accuse-reaction">' + reaction + '</div>' + beamHtml + '<div class="accuse-summary">Vous accusez ' + innocentTitle + ', un innocent. Le vrai coupable, ' + titleTxt + ', s\'est échappé.</div></div><div class="ending-text">' + exileTxt + ' Il rit de vous, loin, très loin de votre juridiction.</div>',
                    en: '<div class="accuse-screen"><div class="accuse-result failure">❌ WRONG ACCUSATION</div><div class="accuse-reaction">' + reaction + '</div>' + beamHtml + '<div class="accuse-summary">You accuse ' + innocentTitle + ', an innocent. The real culprit, ' + titleTxt + ', has escaped.</div></div><div class="ending-text">' + exileTxt + ' He laughs at you, far, very far from your jurisdiction.</div>'
                }
            });
            pages.push({
                decor: 'prison', npc: null,
                text: {
                    fr: '<div class="ending-text">Derrière les barreaux, ' + innocentTitle + ' s\'effondre, innocente. La vérité finira bien par émerger, mais trop tard pour cette affaire.</div>',
                    en: '<div class="ending-text">Behind the bars, ' + innocentTitle + ' collapses, innocent. The truth will eventually emerge, but too late for this case.</div>'
                }
            });
            pages.push({
                decor: 'sherlock', npc: null,
                text: {
                    fr: '<div class="ending-text">' + failTxt + ' ' + morale + '</div>',
                    en: '<div class="ending-text">' + failTxt + ' ' + morale + '</div>'
                }
            });
        }
        var outro = scrCurrentPhase();
        if (outro) outro.pages = pages;
    }

    function state() { return TDScenario.getState(); }

    function buildEnding(s) {
        var truth = TDScenario.getTruth();
        var evalResult = TDScenario.evaluateAccusation(s.accused);
        var correct = (s.accused === s.culprit);
        var lang = s.lang || ui.language;
        var themeId = getThemeId();
        var revealed = correct;
        if (!correct && evalResult.indirectConviction) {
            revealed = true;
        }
        var themedTitle = scrThemedTitle(truth.culprit, lang);
        return {
            good: correct,
            culprit: themedTitle,
            mobile: scrSubstituteNames(TDScenario.t(truth.mobile, lang), themeId) || '',
            methode: scrSubstituteNames(TDScenario.t(truth.methode, lang), themeId) || '',
            revealed: revealed
                ? scrSubstituteNames(TDScenario.t(truth.prison, lang), themeId)
                : (ui.language === 'fr'
                    ? 'Le vrai coupable, ' + themedTitle + ', s\'est échappé.'
                    : 'The real culprit, ' + themedTitle + ', has escaped.'),
            morale: scrSubstituteNames(TDScenario.t(truth.morale, lang), themeId) || '',
            indirectConviction: !correct && evalResult.indirectConviction ? true : false,
            cluesCount: evalResult.cluesCount,
            evidenceScore: evalResult.score,
            evidenceMax: evalResult.max,
        };
    }

    function showScenarioEnding(ending) {
        scr.active = false;
        if (window.DPMusicPlayer) {
            // Garder la musique du thème pour la fin (sherlock/cyberpunk/noire selon l'univers)
            var themeTrack = (TDAudioService && TDAudioService.getThemeMusic)
                ? TDAudioService.getThemeMusic(getThemeId())
                : (THEME_ASSETS[getThemeId()] ? THEME_ASSETS[getThemeId()].music : 'sherlock.mp3');
            try { window.DPMusicPlayer.playTrack(themeTrack); } catch (e) {}
        }
        $.gameScreen.classList.remove('active');
        $.gameScreen.classList.add('hidden');
        if ($.endScreen) {
            if ($.endScreenTitle) $.endScreenTitle.textContent = ending.indirectConviction ? 'Vérité révélée' : (ending.good ? 'Affaire classée' : 'Affaire non résolue');
            if ($.solutionCulprit) $.solutionCulprit.textContent = ending.culprit;
            if ($.solutionMotive) $.solutionMotive.textContent = ending.mobile;
            if ($.solutionMethod) $.solutionMethod.textContent = ending.methode;
            if ($.solutionRevealText) $.solutionRevealText.textContent = ending.revealed + ' (Score détective : ' + (scrGetState().score || 0) + ')';
            var morale = document.getElementById('solution-morale');
            if (morale) morale.textContent = ending.morale;
            var cluesEl = document.getElementById('solution-clues');
            if (cluesEl) {
                var score = ending.evidenceScore || 0;
                var max = ending.evidenceMax || 18;
                cluesEl.textContent = score + '/' + max;
            }
            $.endScreen.classList.remove('hidden');
            $.endScreen.classList.add('active');
        }
    }
        // ===== EXPOSITION MODE DÉVELOPPEUR =====
    // Expose les fonctions nécessaires pour le mode développeur
    window.scrResetState = scrResetState;
    window.renderScenarioPage = renderScenarioPage;
    window.scrCurrentPhase = scrCurrentPhase;
    window.scrShowActPage = scrShowActPage;
    window.scrShouldShowActPage = scrShouldShowActPage;
    window.THEME_ACT_TITLES = THEME_ACT_TITLES;
    window.THEME_ASSETS = THEME_ASSETS;
    window.scr = scr;
    window.getThemeId = getThemeId;
    window.scrNpcImage = scrNpcImage;
    window.scrDecorImage = scrDecorImage;
    window.scrNpcName = scrNpcName;
    window.scrNpcDecorImage = function (npcId) {
        var id = String(npcId || 'suspect').toLowerCase();
        var decorKey = (id === 'seducteur') ? 'barInterieur'
            : (id === 'suspect') ? 'secretPlace'
            : (id === 'marginal') ? 'alley'
            : (id === 'criminel') ? 'publicPlace'
            : (id === 'scientifique') ? 'laboratory'
            : (id === 'detective-partner' || id === 'detective') ? 'headquarters'
            : 'residence';
        return scrDecorImage(decorKey);
    };
    window.skipTypeWriter = skipTypeWriter;
    window.startScenarioGame = startScenarioGame;
    window.THEMES = THEMES;
    window.selectTheme = selectTheme;
    window.toggleVoiceInputEnabled = toggleVoiceInputEnabled;
    window.isVoiceInputEnabled = function () { return ui.voiceInputEnabled; };
    window.updateVoiceButtonVisibility = updateVoiceButtonVisibility;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
