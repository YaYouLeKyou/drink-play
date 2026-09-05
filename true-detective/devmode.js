/* =====================================================================
   TRUE DETECTIVE, DEVELOPER MODE
   --------------------------------------------------------------------
   Bouton developer sur l'écran d'accueil qui permet de sauter
   directement à n'importe quelle phase et page du scénario.
   Outil de développement pour tester rapidement le contenu.
===================================================================== */
(function () {
    'use strict';

    var modal = null;
    var phaseList = null;
    var pageGrid = null;
    var themeList = null;
    var voiceToggle = null;
    var actList = null;

    function init() {
        modal = document.getElementById('dev-modal');
        phaseList = document.getElementById('dev-phase-list');
        pageGrid = document.getElementById('dev-page-grid');
        themeList = document.getElementById('dev-theme-list');
        voiceToggle = document.getElementById('dev-voice-toggle');
        actList = document.getElementById('dev-act-list');

        var devBtn = document.getElementById('dev-btn');
        var closeBtn = document.getElementById('dev-close-btn');

        if (devBtn) {
            devBtn.addEventListener('click', openModal);
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (voiceToggle) {
            voiceToggle.addEventListener('change', function () {
                if (window.toggleVoiceInputEnabled) {
                    window.toggleVoiceInputEnabled();
                }
            });
        }

        // Fermer en cliquant en dehors du modal
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeModal();
            });
        }

        // Touche Escape pour fermer
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    function openModal() {
        if (!modal) return;
        renderThemeList();
        renderPhaseList();
        renderPageGrid();
        renderActList();
        syncVoiceToggle();
        modal.classList.add('active');
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
    }

    function renderThemeList() {
        if (!themeList || !window.THEMES) return;
        themeList.innerHTML = '';

        var visibleThemes = window.THEMES.filter(function (th) {
            return th.id === 'agatha-christie' || th.id === 'cyberpunk' || th.id === 'film-noir';
        });

        visibleThemes.forEach(function (theme) {
            var btn = document.createElement('button');
            btn.className = 'dev-theme-btn';
            btn.textContent = theme.emoji + ' ' + theme.name;
            btn.dataset.theme = theme.id;
            btn.addEventListener('click', function () {
                if (window.selectTheme) {
                    window.selectTheme(theme);
                }
                var homeScreen = document.getElementById('home-screen');
                var themeScreen = document.getElementById('theme-selector-screen');
                if (homeScreen) homeScreen.classList.remove('active');
                if (themeScreen) {
                    themeScreen.classList.remove('hidden');
                    themeScreen.classList.add('active');
                }
                closeModal();
            });
            themeList.appendChild(btn);
        });
    }

    function renderPhaseList() {
        if (!phaseList || !window.TDPhases) return;
        phaseList.innerHTML = '';

        TDPhases.forEach(function (phase, idx) {
            var btn = document.createElement('button');
            btn.className = 'dev-phase-btn';
            btn.textContent = (idx + 1) + '. ' + (phase.label ? (phase.label.fr || phase.label.en || 'Phase ' + idx) : 'Phase ' + idx);
            btn.addEventListener('click', function () {
                jumpToPhase(idx, 0);
            });
            phaseList.appendChild(btn);
        });
    }

    function renderPageGrid() {
        if (!pageGrid || !window.TDPhases) return;
        pageGrid.innerHTML = '';

        TDPhases.forEach(function (phase, phaseIdx) {
            var phaseDiv = document.createElement('div');
            phaseDiv.className = 'dev-phase-group';

            var phaseTitle = document.createElement('div');
            phaseTitle.className = 'dev-phase-title';
            phaseTitle.textContent = phase.label ? (phase.label.fr || phase.label.en || 'Phase ' + phaseIdx) : 'Phase ' + phaseIdx;
            phaseDiv.appendChild(phaseTitle);

            var pagesDiv = document.createElement('div');
            pagesDiv.className = 'dev-pages';

            if (phase.pages) {
                phase.pages.forEach(function (page, pageIdx) {
                    var pageBtn = document.createElement('button');
                    pageBtn.className = 'dev-page-btn';
                    var pageText = '';
                    if (page.text) {
                        var text = page.text.fr || page.text.en || '';
                        pageText = text.substring(0, 40) + (text.length > 40 ? '...' : '');
                    }
                    var mgLabel = '';
                    if (page.minigame) {
                        mgLabel = ' [MG:' + page.minigame.type + ']';
                    }
                    pageBtn.textContent = 'P' + (pageIdx + 1) + (pageText ? ': ' + pageText : '') + mgLabel;
                    pageBtn.title = page.text ? (page.text.fr || page.text.en || '') : (page.minigame ? ('Minigame: ' + page.minigame.type) : '');
                    pageBtn.addEventListener('click', function () {
                        jumpToPhase(phaseIdx, pageIdx);
                    });
                    pagesDiv.appendChild(pageBtn);
                });
            }

            phaseDiv.appendChild(pagesDiv);
            pageGrid.appendChild(phaseDiv);
        });
    }

    function renderActList() {
        if (!actList || !window.TDPhases) return;
        actList.innerHTML = '';

        var acts = [];
        var seenActs = {};
        window.TDPhases.forEach(function (phase) {
            if (phase.act && !seenActs[phase.act]) {
                seenActs[phase.act] = true;
                acts.push({ act: phase.act, phaseIdx: window.TDPhases.indexOf(phase) });
            }
        });

        var lang = window.ui && window.ui.language ? window.ui.language : 'fr';

        acts.forEach(function (item) {
            var btn = document.createElement('button');
            btn.className = 'dev-act-btn';

            var numberSpan = document.createElement('span');
            numberSpan.className = 'act-number';

            var titleSpan = document.createElement('span');
            titleSpan.className = 'act-title';

            if (window.THEME_ACT_TITLES) {
                var themeId = window.getThemeId ? window.getThemeId() : 'agatha-christie';
                var titles = window.THEME_ACT_TITLES[themeId] || window.THEME_ACT_TITLES['agatha-christie'];
                if (titles && titles[item.act]) {
                    numberSpan.textContent = titles[item.act].number[lang] || titles[item.act].number.fr || '';
                    titleSpan.textContent = titles[item.act].title[lang] || titles[item.act].title.fr || '';
                } else {
                    numberSpan.textContent = item.act;
                    titleSpan.textContent = '';
                }
            } else {
                numberSpan.textContent = item.act;
                titleSpan.textContent = '';
            }

            btn.appendChild(numberSpan);
            btn.appendChild(titleSpan);
            btn.addEventListener('click', function () {
                jumpToAct(item.act);
            });
            actList.appendChild(btn);
        });
    }

    function jumpToAct(act) {
        if (!window.TDPhases) return;

        var phaseIdx = -1;
        for (var i = 0; i < window.TDPhases.length; i++) {
            if (window.TDPhases[i].act === act) {
                phaseIdx = i;
                break;
            }
        }

        if (phaseIdx === -1) {
            console.error('Act not found:', act);
            return;
        }

        if (window.scrShowActPage && window.scrShouldShowActPage && window.scrShouldShowActPage(act)) {
            var homeScreen = document.getElementById('home-screen');
            var gameScreen = document.getElementById('game-screen');
            var themeScreen = document.getElementById('theme-selector-screen');
            if (homeScreen) homeScreen.classList.remove('active');
            if (themeScreen) themeScreen.classList.remove('active');
            if (gameScreen) {
                gameScreen.classList.remove('hidden');
                gameScreen.classList.add('active');
            }
            closeModal();
            window.scrResetState();
            window.scr.phaseIdx = phaseIdx;
            window.scr.pageIdx = 0;
            window.scr.active = true;
            window.scrShowActPage(act, function () {
                if (window.renderScenarioPage) window.renderScenarioPage();
            });
        } else {
            jumpToPhase(phaseIdx, 0);
        }
    }

    function jumpToPhase(phaseIdx, pageIdx) {
        // Vérifier que le système de scénario est disponible
        if (!window.scrResetState || !window.TDPhases) {
            console.error('Système de scénario non disponible');
            return;
        }

        // Cacher l'écran d'accueil et afficher le jeu
        var homeScreen = document.getElementById('home-screen');
        var gameScreen = document.getElementById('game-screen');
        var themeScreen = document.getElementById('theme-selector-screen');

        if (homeScreen) homeScreen.classList.remove('active');
        if (themeScreen) themeScreen.classList.remove('active');
        if (gameScreen) {
            gameScreen.classList.remove('hidden');
            gameScreen.classList.add('active');
        }

        // Fermer le modal
        closeModal();

        // Réinitialiser et démarrer le scénario
        window.scrResetState();
        window.scr.phaseIdx = phaseIdx;
        window.scr.pageIdx = pageIdx;
        window.scr.active = true;

        // Rendre la page
        window.renderScenarioPage();
    }

    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exposer l'API globalement
    window.TDDevMode = {
        open: openModal,
        close: closeModal,
        jumpToPhase: jumpToPhase
    };

    function syncVoiceToggle() {
        if (!voiceToggle) return;
        var enabled = typeof window.isVoiceInputEnabled === 'function'
            ? window.isVoiceInputEnabled()
            : false;
        voiceToggle.checked = enabled;
    }
})();