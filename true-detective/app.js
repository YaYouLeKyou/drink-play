(function () {
    'use strict';

    var THEMES = [
        { id: 'agatha-christie', name: 'Agatha Christie', emoji: '🏚️', desc: 'Classic country house mystery' },
        { id: 'sherlock-holmes', name: 'Sherlock Holmes', emoji: '🔍', desc: 'Victorian London detective' },
        { id: 'film-noir', name: 'Film Noir', emoji: '🎩', desc: 'Dark city streets, trench coat' },
        { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🌃', desc: 'Neo-Tokyo dystopia' },
        { id: 'heroic-fantasy', name: 'Heroic Fantasy', emoji: '⚔️', desc: 'Medieval castle, knights, magic' },
        { id: 'sci-fi', name: 'Sci-Fi', emoji: '👽', desc: 'Space station mystery' },
        { id: 'lovecraftian', name: 'Lovecraftian', emoji: '🐙', desc: 'Cosmic horror, ancient entities' },
        { id: 'antiquite', name: 'Antiquité', emoji: '🏛️', desc: 'Ancient Rome & Egypt' },
        { id: 'pirate', name: 'Pirate', emoji: '⚓', desc: 'Caribbean piracy' },
        { id: 'western', name: 'Far West', emoji: '🤠', desc: 'Wild West saloon' },
        { id: 'steampunk', name: 'Steampunk', emoji: '⚙️', desc: 'Steam-powered industrial' },
        { id: 'post-apoc', name: 'Post-Apocalypse', emoji: '☢️', desc: 'Wasteland ruins' },
        { id: 'kaiju', name: 'Kaiju', emoji: '🦎', desc: 'Urban monster disaster' },
        { id: 'psychological', name: 'Psychological', emoji: '🕶️', desc: '70s thriller' },
        { id: 'spy', name: 'Espionnage', emoji: '🕵️', desc: 'Cold War spy thriller' },
        { id: 'paranormal', name: 'Paranormal', emoji: '👻', desc: 'Ghost hunting mystery' },
        { id: 'cyber-horror', name: 'Cyber-Horror', emoji: '💻', desc: 'AI dystopia horror' },
    ];

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
        langEnBtn: document.getElementById('lang-en'),
        langFrBtn: document.getElementById('lang-fr'),
        restartBtn: document.getElementById('restart-btn'),
        musicInfo: document.getElementById('music-info'),
        objectiveDisplay: document.getElementById('objective-display'),
        objectiveText: document.getElementById('objective-text'),
        dialogueHistory: document.getElementById('dialogue-history'),
        continueBtn: document.getElementById('continue-btn'),
        pageNav: document.getElementById('page-nav'),
        notebook: document.getElementById('notebook'),
        closeNotebookBtn: document.getElementById('close-notebook'),
        cluesList: document.getElementById('clues-list'),
        stepsList: document.getElementById('steps-list'),
        loadingOverlay: document.getElementById('loading-overlay'),
        loadingText: document.getElementById('loading-text'),
        loadingDots: document.getElementById('loading-dots'),
        toast: document.getElementById('toast'),
        newInvestigationBtn: document.getElementById('new-investigation-btn'),
        backToHubBtn: document.getElementById('back-to-hub-btn'),
        solutionCulprit: document.getElementById('solution-culprit'),
        solutionMotive: document.getElementById('solution-motive'),
        solutionMethod: document.getElementById('solution-method'),
        solutionRevealText: document.getElementById('solution-revealed-text'),
        endScreenTitle: null,
    };

    var ui = {
        language: 'en',
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
    };

    function getText(key) {
        var langTexts = TEXTS[ui.language] || TEXTS.en;
        return langTexts[key] || key;
    }

    function init() {
        $.endScreenTitle = $.endScreen ? $.endScreen.querySelector('h1') : null;
        renderThemeCards();
        checkSavedGame();
        setupEventListeners();
        updateMuteButton();
        updateVolumeButton();
        updateLanguageUI();
        updateLanguageButtons();

        if (TDAudioService) {
            TDAudioService.setLanguage(ui.language);
        }

        if ($.homeScreen) {
            $.homeScreen.classList.add('active');
            hideLoading();
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
        THEMES.forEach(function (theme) {
            var card = document.createElement('div');
            card.className = 'theme-card';
            card.dataset.theme = theme.id;
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

        if ($.resumeBtn) {
            $.resumeBtn.addEventListener('click', resumeGame);
        }

        if ($.startGameBtn) {
            $.startGameBtn.addEventListener('click', startGameFromConfig);
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

        if ($.voiceBtn) {
            $.voiceBtn.addEventListener('click', toggleVoiceInput);
        }

        if ($.notebookBtn) {
            $.notebookBtn.addEventListener('click', toggleNotebook);
        }

        if ($.closeNotebookBtn) {
            $.closeNotebookBtn.addEventListener('click', toggleNotebook);
        }

        if ($.newInvestigationBtn) {
            $.newInvestigationBtn.addEventListener('click', newInvestigation);
        }

        if ($.backToHubBtn) {
            $.backToHubBtn.addEventListener('click', function () {
                if (TDNarrativeEngine) {
                    TDNarrativeEngine.resetGame();
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
                $.gameScreen.classList.add('hidden');
                $.endScreen.classList.add('hidden');
                hidePageNav();
                checkSavedGame();
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
    }

    function setLanguage(lang) {
        ui.language = lang;
        if (TDAudioService) {
            TDAudioService.setLanguage(lang);
        }
        if (TDNarrativeEngine) {
            TDNarrativeEngine.setLanguage(lang);
        }
        updateLanguageUI();
        updateLanguageButtons();
    }

    function updateLanguageButtons() {
        if ($.langEnBtn) {
            $.langEnBtn.classList.toggle('active-lang', ui.language === 'en');
        }
        if ($.langFrBtn) {
            $.langFrBtn.classList.toggle('active-lang', ui.language === 'fr');
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

    function updateMusicInfo(phase, themeId) {
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
        if (TDAudioService.setMusicPhase) {
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
            $.startGameBtn.classList.remove('hidden');
            $.startGameBtn.textContent = getText('startGame') || 'Start Investigation';
        }
    }

    function startGameFromConfig() {
        if (!ui.theme || !TDNarrativeEngine) {
            showToast(getText('selectTheme') || 'Please select a theme first.', true);
            return;
        }

        showLoading(getText('generatingInvestigation'));

        TDNarrativeEngine.createInvestigation(ui.theme.id, ui.language)
            .then(function (script) {
                hideLoading();
                startGameWithIntro(script, ui.theme.id);
            })
            .catch(function (err) {
                hideLoading();
                showToast(err.message || 'Failed to generate investigation', true);
            });
    }

    function startGameWithIntro(script, themeId) {
        ui.theme = themeId;
        ui.sceneCounter = 0;

        $.themeScreen.classList.add('hidden');
        $.endScreen.classList.add('hidden');
        $.gameScreen.classList.remove('hidden');
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
                TDNarrativeEngine.addClue(sceneData.clue);
            }
            showClueToast(sceneData.clue);
        }

        updateObjective(sceneData.objective);

        var savedScript = TDNarrativeEngine.getGameState().script;

        var introPages = buildIntroPages(savedScript || script);

        preGenerateIntroFirstPage(introPages[0], function () {
            if (TDAudioService && TDAudioService.playThemeMusic) {
                TDAudioService.playThemeMusic(themeId);
            }
            updateMusicInfo('investigation', themeId);
            showNarrationSequence(introPages, function () {
                displayScene(sceneData, false);
            });
        });
    }

    function preGenerateIntroFirstPage(firstPage, callback) {
        var musicPrompt = '';
        if (TDAudioService && TDAudioService.getThemeMusic) {
            musicPrompt = TDAudioService.getThemeMusic(ui.theme);
        }
        var bgPromise = TDImageService
            ? TDImageService.generateSceneBackground(firstPage.location || 'detective scene', ui.theme, musicPrompt)
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
            ui.theme = state.theme || 'film-noir';
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
                    TDNarrativeEngine.addClue(sceneData.clue);
                    showClueToast(sceneData.clue);
                }
                updateMusicInfo(firstScene.type, ui.theme);
                updateObjective(sceneData.objective);
                displayScene(sceneData, false);
                $.themeScreen.classList.add('hidden');
                $.gameScreen.classList.remove('hidden');
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
                TDNarrativeEngine.addClue(sceneData.clue);
            }
            showClueToast(sceneData.clue);
        }

        updateMusicInfo(sceneType, themeId);
        updateObjective(sceneData.objective);

        var script = TDNarrativeEngine ? TDNarrativeEngine.getGameState().script : null;
        if (script) {
            var introPages = buildIntroPages(script);
            showNarrationSequence(introPages, function () {
                displayScene(sceneData, false);
            });
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
        var themeName = '';
        if (THEMES) {
            var t = THEMES.find(function (t) { return t.id === script.theme; });
            themeName = t ? t.name : script.theme;
        }
        var location = script.setting || 'the investigation site';
        var npcs = script.npcs || [];
        var introNPC = npcs.length ? npcs[0] : null;

        return [
            {
                pageType: 'wide_shot',
                text: 'The ' + themeName + ' case begins. The detective arrives at ' + location + ', ready to uncover the truth.',
                location: location,
                showNPC: false,
                npcId: null,
                isDialogue: false,
            },
            {
                pageType: 'character_enter',
                text: introNPC
                    ? (introNPC.name || 'A figure') + ' is present at the scene, watching closely.'
                    : 'The atmosphere is tense. Something is about to unfold.',
                location: location,
                showNPC: !!introNPC,
                npcId: introNPC ? introNPC.id : null,
                npcImageFull: true,
                isDialogue: false,
            },
            {
                pageType: 'closeup',
                text: 'The investigation is now underway. Every detail matters. Let the inquiry begin.',
                location: location,
                showNPC: !!introNPC,
                npcId: introNPC ? introNPC.id : null,
                npcImageCloseup: true,
                isDialogue: true,
                choices: null,
                puzzle: null,
                objective: 'Begin investigating the scene.',
                musicPhase: 'investigation',
            },
        ];
    }

    function buildTransitionPages(sceneData) {
        var themeName = '';
        if (THEMES) {
            var t = THEMES.find(function (t) { return t.id === ui.theme; });
            themeName = t ? t.name : ui.theme;
        }
        var location = sceneData.location || 'the investigation site';
        var npc = null;
        if (sceneData.npcId && TDNarrativeEngine) {
            npc = TDNarrativeEngine.getNPC(sceneData.npcId);
        }

        return [
            {
                pageType: 'wide_shot',
                text: 'The investigation continues through the ' + themeName + ' case. A new lead has emerged.',
                location: location,
                showNPC: false,
                npcId: null,
                isDialogue: false,
            },
            {
                pageType: 'character_enter',
                text: npc
                    ? (npc.name || 'A figure') + ' reappears, holding new information.'
                    : 'The detective follows the trail to a new location.',
                location: location,
                showNPC: !!npc,
                npcId: sceneData.npcId || null,
                npcImageFull: true,
                isDialogue: false,
            },
            {
                pageType: 'closeup',
                text: 'The detective presses forward, piecing together the evidence. What secrets will be uncovered next?',
                location: location,
                showNPC: !!npc,
                npcId: sceneData.npcId || null,
                npcImageCloseup: true,
                isDialogue: true,
                choices: null,
                puzzle: null,
                objective: sceneData.objective || 'Continue the investigation.',
                musicPhase: 'investigation',
            },
        ];
    }

    function renderPageContent(pageData, pageNumber, sceneData) {
        $.choicesContainer.innerHTML = '';
        $.conversationInput.classList.add('hidden');
        $.continueBtn.classList.add('hidden');
        $.npcName.textContent = '';

        updatePageDots();

        if (pageNumber < ui.totalPages) {
            $.continueBtn.classList.remove('hidden');
            $.continueBtn.textContent = getText('nextPage') || 'Next';
        } else {
            $.continueBtn.classList.add('hidden');
        }

        var musicPrompt = '';
        var musicPhase = pageData.musicPhase || sceneData.musicPhase || ui.currentSceneType || 'investigation';
        if (TDAudioService && TDAudioService.getMusicForPhase) {
            if (sceneData.type === 'narration') {
                musicPrompt = TDAudioService.getThemeMusic(ui.theme);
            } else {
                musicPrompt = TDAudioService.getMusicForPhase(ui.theme, musicPhase);
            }
        }

        var backgroundPromise = TDImageService
            ? TDImageService.generateSceneBackground(pageData.location || 'detective scene', ui.theme, musicPrompt)
            : Promise.reject(new Error('ImageService not loaded'));

        var npcImagePromise = Promise.resolve(null);
        if (pageData.showNPC && pageData.npcId && TDNarrativeEngine) {
            var npc = TDNarrativeEngine.getNPC(pageData.npcId);
            if (npc) {
                ui.currentNPCId = pageData.npcId;
                $.npcName.textContent = npc.name || '';

                if (npc.imagePrompt) {
                    npcImagePromise = TDImageService
                        ? TDImageService.generateImage(npc.imagePrompt, { width: 512, height: 512 })
                        : Promise.reject(new Error('ImageService not loaded'));
                } else {
                    npcImagePromise = TDImageService
                        ? TDImageService.generateNpcImage(npc, ui.theme)
                        : Promise.reject(new Error('ImageService not loaded'));
                }
            }
        } else {
            if (!pageData.showNPC) {
                ui.currentNPCId = null;
                $.npcName.textContent = '';
                $.conversationInput.classList.add('hidden');
            }
        }

        showLoading(getText('loadingScene'));

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

            hideLoading();

            if (pageData.isDialogue) {
                if (pageData.showNPC && pageData.npcId) {
                    $.conversationInput.classList.remove('hidden');
                }
            } else {
                $.conversationInput.classList.add('hidden');
            }

            typeWriter(pageData.text || '...', function () {
                onPageComplete(pageNumber, sceneData);
            });

            if (TDAudioService && pageData.text) {
                var profileKey = ui.language === 'fr' ? 'narrator_fr' : 'narrator';
                if (sceneData.type === 'narration') {
                    profileKey = ui.language === 'fr' ? 'narrator_fr' : 'narrator';
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
        });
    }

    function onPageComplete(pageNumber, sceneData) {
        ui.isTyping = false;
        ui.skipPending = false;
        ui.isWaiting = false;

        var isNarration = sceneData.type === 'narration';

        if (pageNumber < ui.totalPages) {
            $.continueBtn.classList.remove('hidden');
            $.continueBtn.textContent = getText('nextPage') || 'Next';
            $.continueBtn.onclick = handleContinue;
        } else {
            if (isNarration) {
                $.continueBtn.classList.remove('hidden');
                $.continueBtn.textContent = getText('continue') || 'Continue';
                $.continueBtn.onclick = function () {
                    hidePageNav();
                    if (ui._narrationCallback) {
                        var cb = ui._narrationCallback;
                        ui._narrationCallback = null;
                        cb();
                    }
                };
            } else if (sceneData.type === 'revelation') {
                $.continueBtn.classList.remove('hidden');
                $.continueBtn.textContent = getText('continue') || 'Continue';
                $.continueBtn.onclick = handleContinue;
            } else if (sceneData.type === 'credits') {
                $.continueBtn.classList.remove('hidden');
                $.continueBtn.textContent = getText('credits') || 'Credits';
                $.continueBtn.onclick = handleContinue;
            } else if (sceneData.type === 'puzzle' && sceneData.puzzle) {
                renderPuzzle(sceneData.puzzle);
            } else if (sceneData.choices && sceneData.choices.length) {
                _currentChoices = sceneData.choices;
                showChoices();
            } else {
                $.continueBtn.classList.remove('hidden');
                $.continueBtn.textContent = getText('continue') || 'Continue';
                $.continueBtn.onclick = handleContinue;
            }
        }
    }

    function showNarrationSequence(pages, onCompleted) {
        ui.currentPage = 0;
        ui.totalPages = pages.length;
        ui.currentSceneData = { type: 'narration', pages: pages };
        ui.currentSceneType = 'narration';
        ui.isWaiting = false;
        ui.isTyping = false;
        ui.skipPending = false;
        ui.puzzleData = null;

        $.choicesContainer.innerHTML = '';
        $.conversationInput.classList.add('hidden');
        $.npcName.textContent = '';
        hideNPC();
        clearDialogueHistory();
        $.continueBtn.classList.add('hidden');
        $.continueBtn.onclick = null;

        updatePageDots();
        showPageNav();
        updateMusicInfo('investigation', ui.theme);

        goToPage(1);

        ui._narrationCallback = onCompleted;
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
        $.continueBtn.classList.add('hidden');
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
                TDNarrativeEngine.addClue(sceneData.clue);
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

    function handleContinue() {
        if (ui.isWaiting) return;

        if (ui.currentPage < ui.totalPages) {
            nextPage();
            return;
        }

        ui.isWaiting = true;
        $.continueBtn.classList.add('hidden');

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

        if (TDNarrativeEngine) {
            TDNarrativeEngine.advanceGameState(null)
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
        } else {
            ui.isWaiting = false;
        }
    }

    function renderPuzzle(puzzle) {
        if (!puzzle) return;

        $.choicesContainer.innerHTML = '';

        if (puzzle.type === 'multiple_choice') {
            var options = puzzle.options || [];
            options.forEach(function (option) {
                var btn = document.createElement('button');
                btn.className = 'btn btn-choice';
                btn.textContent = option;
                btn.addEventListener('click', function () {
                    checkPuzzleAnswer(option, puzzle);
                });
                $.choicesContainer.appendChild(btn);
            });
        } else if (puzzle.type === 'text_input') {
            var input = document.createElement('input');
            input.type = 'text';
            input.className = 'player-text-input';
            input.placeholder = getText('puzzlePlaceholder') || 'Enter your answer...';
            input.maxLength = 200;
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    checkPuzzleAnswer(input.value.trim(), puzzle);
                }
            });

            var submitBtn = document.createElement('button');
            submitBtn.className = 'btn btn-send';
            submitBtn.textContent = getText('submit') || 'Submit';
            submitBtn.addEventListener('click', function () {
                checkPuzzleAnswer(input.value.trim(), puzzle);
            });

            var formWrapper = document.createElement('div');
            formWrapper.className = 'conversation-input';
            formWrapper.appendChild(input);
            formWrapper.appendChild(submitBtn);
            $.choicesContainer.appendChild(formWrapper);
        }
    }

    function checkPuzzleAnswer(answer, puzzle) {
        var isCorrect = false;
        if (puzzle.correctAnswer) {
            isCorrect = String(answer).toLowerCase() === String(puzzle.correctAnswer).toLowerCase();
        } else if (puzzle.acceptableAnswers && Array.isArray(puzzle.acceptableAnswers)) {
            isCorrect = puzzle.acceptableAnswers.some(function (a) {
                return String(answer).toLowerCase() === String(a).toLowerCase();
            });
        }

        if (isCorrect) {
            ui.isWaiting = true;
            if (TDAudioService) {
                TDAudioService.stopSpeaking();
            }
            TDAudioService.speak(getText('puzzleSolved') || 'Correct! The puzzle is solved.', 'narrator');
            setTimeout(function () {
                if (TDNarrativeEngine) {
                    TDNarrativeEngine.advanceGameState(getText('puzzleCorrect') || 'Correct answer')
                        .then(function (data) {
                            ui.isWaiting = false;
                            if (data.gameComplete) {
                                showEndScreen(data.solution);
                                return;
                            }
                            continueAfterTransition(data);
                        })
                        .catch(function (err) {
                            ui.isWaiting = false;
                            showToast('Failed to continue investigation: ' + (err.message || 'Unknown error'), true);
                        });
                }
            }, 1500);
        } else {
            showToast(getText('puzzleWrong') || 'That doesn\'t seem right. Try again.', true);
        }
    }

    function skipTypeWriter() {
        ui.skipPending = true;
        TDAudioService.stopSpeaking();
        $.dialogueText.textContent = getCurrentSceneText();
        onCompleteTyping();
    }

    var _currentDialogue = '';

    function typeWriter(text, onComplete, speed) {
        _currentDialogue = text || '';
        speed = speed || ui.typingSpeed;
        ui.isTyping = true;
        ui.skipPending = false;

        var i = 0;
        var len = text.length;
        $.dialogueText.textContent = '';
        $.typeCursor.classList.remove('hidden');

        function type() {
            if (ui.skipPending) {
                $.dialogueText.textContent = text;
                ui.isTyping = false;
                ui.skipPending = false;
                $.typeCursor.classList.remove('hidden');
                if (onComplete) { onComplete(); }
                return;
            }
            if (i < len) {
                $.dialogueText.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                ui.isTyping = false;
                $.typeCursor.classList.remove('hidden');
                if (onComplete) { onComplete(); }
            }
        }
        type();
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
        clearTypeWriter();

        if (TDAudioService) {
            TDAudioService.stopSpeaking();
        }

        if (TDNarrativeEngine) {
            TDNarrativeEngine.advanceGameState(choice)
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
    }

    function continueAfterTransition(data) {
        if (data.clue && data.clue !== 'null' && data.clue) {
            if (TDNarrativeEngine) {
                TDNarrativeEngine.addClue(data.clue);
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
        });
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
                        TDNarrativeEngine.addClue(data.revealClue);
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
        $.dialogueText.textContent = '';
        if ($.typeCursor) {
            $.typeCursor.classList.add('hidden');
        }
    }

    function loadNPCImage(url) {
        if (!$.npcImage) return;
        $.npcImage.src = '';
        $.npcImage.classList.remove('visible');

        var img = new Image();
        img.onload = function () {
            $.npcImage.src = url;
            $.npcImage.classList.add('visible');
        };
        img.onerror = function () {
            $.npcImage.classList.add('visible');
        };
        img.src = url;
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
        img.onload = function () {
            $.bgLayer.style.backgroundImage = 'url(' + url + ')';
        };
        img.src = url;
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

        if ($.cluesList) {
            if (state.discoveredClues.length === 0) {
                $.cluesList.innerHTML = '<li class="notebook-empty">' + getText('noClues') + '</li>';
            } else {
                $.cluesList.innerHTML = state.discoveredClues.map(function (clue) {
                    return '<li class="clue">' + escapeHtml(clue) + '</li>';
                }).join('');
            }
        }

        if ($.stepsList) {
            if (state.investigationSteps.length === 0) {
                $.stepsList.innerHTML = '<li class="notebook-empty">' + getText('noSteps') + '</li>';
            } else {
                $.stepsList.innerHTML = state.investigationSteps.map(function (step) {
                    return '<li class="step">' + escapeHtml(step.text) + '</li>';
                }).join('');
            }
        }
    }

    function toggleNotebook() {
        if (!$.notebook) return;
        $.notebook.classList.toggle('open');
        updateNotebook();
    }

    function toggleMute() {
        if (!TDAudioService) return;
        var muted = TDAudioService.toggleMute();
        updateMuteButton();
    }

    function updateMuteButton() {
        if (!$.muteBtn || !TDAudioService) return;
        $.muteBtn.textContent = TDAudioService.muted ? '🔇' : '🔊';
        $.muteBtn.title = TDAudioService.muted ? 'Unmute narration' : 'Mute narration';
    }

    function updateVolumeButton() {
        if (!$.volumeBtn || !TDAudioService) return;
        var pct = Math.round(TDAudioService.volume * 100);
        var icon = TDAudioService.volume <= 0.5 ? '🔉' : '🔊';
        $.volumeBtn.textContent = icon + pct + '%';
        $.volumeBtn.title = 'Voice volume: ' + pct + '%. Click to change.';
    }

    var _voiceActive = false;

    function toggleVoiceInput() {
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
            $.voiceBtn.textContent = '🔴';
            $.voiceBtn.title = 'Listening...';
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
            $.voiceBtn.textContent = '🎤';
            $.voiceBtn.title = 'Voice Input';
            $.voiceBtn.classList.remove('voice-recording');
        }
        if (TDAudioService && TDAudioService.stopListening) {
            TDAudioService.stopListening();
        }
    }

    function showEndScreen(solution) {
        if (!$.endScreen) return;
        $.gameScreen.classList.add('hidden');
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
