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

    function init() {
        modal = document.getElementById('dev-modal');
        phaseList = document.getElementById('dev-phase-list');
        pageGrid = document.getElementById('dev-page-grid');

        var devBtn = document.getElementById('dev-btn');
        var closeBtn = document.getElementById('dev-close-btn');

        if (devBtn) {
            devBtn.addEventListener('click', openModal);
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
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
        renderPhaseList();
        renderPageGrid();
        modal.classList.add('active');
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
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
                    pageBtn.textContent = 'P' + (pageIdx + 1) + (pageText ? ': ' + pageText : '');
                    pageBtn.title = page.text ? (page.text.fr || page.text.en || '') : '';
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

})();