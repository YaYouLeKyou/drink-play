/* ============================================================
   Drink & Play — Unified Settings Menu (JS)
   ============================================================ */
(function () {
    'use strict';

    let panel = null, backdrop = null, btn = null;
    let cfg = {};

    /* En dessous de cette largeur libre, on ne tente plus de mettre le bouton
       Continue à côté du ⚙ mais en dessous (écrans étroits / paysage). */
    var MIN_CONTINUE_WIDTH = 120;

    /* Résolution du conteneur d'accueil du bouton. Les pages de mini-jeux
       n'ont pas toutes la même classe de barre de titre : on liste les
       variantes connues plutôt que d'exiger btnMount sur chaque page. */
    function resolveMount() {
        var selectors = ['.sg-header-actions', '.sg-header', '.tower-header'];
        for (var i = 0; i < selectors.length; i++) {
            var found = document.querySelector(selectors[i]);
            if (found) return found;
        }
        return null;
    }

    /* Le bouton « Continuer » du mode scénario est en `position: fixed`
       en haut à droite sur plusieurs mini-jeux (puzzle, chemistry, shooting,
       breakout…), exactement là où le ⚙ est monté dans la barre de titre.
       Résultat : les deux se chevauchent et le ⚙ devient incliquable.

       On ne peut pas faire dependre chaque page de ce réglage, donc on déplace
       le bouton Continue à côté du ⚙ dès qu'on constate un chevauchement, puis
       on rejoue le calcul au redimensionnement. On ne touche que le bouton
       Continue : sa logique et son gestionnaire de clic restent inchangés. */
    function continueButtons() {
        return Array.prototype.slice.call(document.querySelectorAll(
            '#story-continue-btn, .reseau-alibis-continue, .btn-continue'
        )).filter(function (el) {
            if (el === btn) return false;
            // Ignore les boutons d'accueil (ceux de l'index) : ils ne sont pas
            // dans un mini-jeu et n'ont pas de barre de titre à partager.
            if (!document.querySelector('.sg-header, .sg-header-actions, .tower-header')) return false;
            var r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
        });
    }

    function overlapsRect(a, b) {
        return !(a.right <= b.left || a.left >= b.right ||
                 a.bottom <= b.top || a.top >= b.bottom);
    }

    /* Garde-fou : l'observateur se re declenche sur les styles qu'on pose
       lui-meme. Sans ce drapeau, on mesurerait/reecrirait en boucle. */
    var adjusting = false;

    function keepContinueButtonClear() {
        if (adjusting) return;
        if (!btn || !btn.parentNode) return;
        var settingsRect = btn.getBoundingClientRect();
        if (!settingsRect.width) return;

        adjusting = true;
        try {
            continueButtons().forEach(function (cont) {
                if (!overlapsRect(cont.getBoundingClientRect(), settingsRect)) return;
                // Place le bouton Continue à gauche du ⚙, sur la même ligne.
                var cr = cont.getBoundingClientRect();
                var gap = 10;
                // On ne peut pas déborder à gauche de la fenêtre : si le bouton est
                // plus large que la place disponible (boutons pleine largeur), on le
                // resserre sur cette place au lieu de le pousser hors écran.
                var available = settingsRect.left - gap;
                if (available < MIN_CONTINUE_WIDTH) {
                    // Pas assez de place à côté du ⚙ (écran très étroit) : on le
                    // passe sous le ⚙ plutôt que de le superposer.
                    cont.style.setProperty('left', '8px', 'important');
                    cont.style.setProperty('right', '8px', 'important');
                    cont.style.setProperty('width', 'auto', 'important');
                    cont.style.setProperty('max-width', 'none', 'important');
                    cont.style.setProperty('top',
                        Math.round(settingsRect.bottom + gap) + 'px', 'important');
                    cont.style.setProperty('bottom', 'auto', 'important');
                    cont.style.setProperty('transform', 'none', 'important');
                    return;
                }
                if (cr.width > available) {
                    cont.style.setProperty('max-width', Math.round(available) + 'px', 'important');
                } else {
                    cont.style.setProperty('max-width', 'none', 'important');
                }
                cont.style.setProperty('right', 'auto', 'important');
                cont.style.setProperty('left', Math.max(8, Math.round(available - Math.min(cr.width, available))) + 'px', 'important');
                cont.style.setProperty('top',
                    Math.round(settingsRect.top + (settingsRect.height - cr.height) / 2) + 'px', 'important');
                cont.style.setProperty('bottom', 'auto', 'important');
                cont.style.setProperty('transform', 'none', 'important');
            });
        } finally {
            adjusting = false;
        }
    }

    function createElements() {
        if (panel) panel.remove();
        if (backdrop) backdrop.remove();
        if (btn) btn.remove();

        backdrop = document.createElement('div');
        backdrop.className = 'dp-settings-backdrop';
        backdrop.addEventListener('click', closePanel);

        /* Si story-chrome.js a déjà monté son propre bouton dans la navbar
           (minijeux en mode scénario), on le réutilise au lieu d'en créer un
           second : un seul ⚙ dans la barre de titre. */
        var preexisting = document.getElementById('td-sc-settings-btn');
        if (preexisting && preexisting.parentNode) {
            btn = preexisting;
            btn.classList.add('dp-settings-btn');
        } else {
            btn = document.createElement('button');
            btn.className = 'dp-settings-btn';
        }
        btn.setAttribute('aria-label', 'Paramètres');
        btn.setAttribute('title', 'Paramètres');
        if (!btn.textContent) btn.textContent = '⚙';
        btn.addEventListener('click', togglePanel);

        panel = document.createElement('div');
        panel.className = 'dp-settings-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Panneau des paramètres');

        /* Option btnMount : montage du bouton dans un conteneur existant
           (navbar) au lieu du positionnement fixe par défaut dans <body>.
           Accepte un sélecteur CSS ou un élément.

           Auto-détection : sans btnMount explicite, on monte le bouton dans la
           navbar de mini-jeu. Cela évite d'avoir à dupliquer l'option dans
           chaque page, et surtout évite que la roue flottante en haut à droite
           (.dp-settings-btn fixed) ne recouvre le bouton « Continuer » du mode
           scénario, lui aussi positionné en fixed au même endroit. */
        var mount = null;
        if (cfg.btnMount) {
            mount = (typeof cfg.btnMount === 'string')
                ? document.querySelector(cfg.btnMount)
                : cfg.btnMount;
        } else {
            mount = resolveMount();
        }

        document.body.appendChild(backdrop);
        if (mount) {
            btn.classList.add('dp-settings-btn-inline');
            mount.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
        document.body.appendChild(panel);

        /* Le bouton Continue n'apparait souvent qu'a la fin de la partie :
           on rejoue donc le calcul au demarrage, a chaque resize, et a chaque
           mutation de style/classe (c'est ce qui couvre son apparition). */
        keepContinueButtonClear();
        window.addEventListener('resize', keepContinueButtonClear);
        window.addEventListener('orientationchange', keepContinueButtonClear);
        if (typeof MutationObserver === 'function') {
            var observer = new MutationObserver(function () {
                keepContinueButtonClear();
            });
            observer.observe(document.body, {
                childList: true, subtree: true, attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
    }

    function el(tag, cls, html) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html) e.innerHTML = html;
        return e;
    }

    function addLangSection() {
        if (!cfg.languages || cfg.languages.length === 0) return;
        const sec = el('div', 'dp-settings-section');
        sec.appendChild(el('div', 'dp-settings-section-title', '🌍 Langue'));
        const row = el('div', 'dp-setting-row');
        row.innerHTML = '<span class="dp-setting-icon">🌐</span><span class="dp-setting-label">Langue / Language</span>';
        const sel = el('select', 'dp-select');
        sel.id = 'dp-lang-select';
        cfg.languages.forEach(function (l) {
            const opt = document.createElement('option');
            opt.value = l.value;
            opt.textContent = l.label;
            if (l.value === cfg.currentLang) opt.selected = true;
            sel.appendChild(opt);
        });
        sel.addEventListener('change', function () {
            if (cfg.onLangChange) cfg.onLangChange(sel.value);
        });
        row.appendChild(sel);
        sec.appendChild(row);
        panel.appendChild(sec);
    }

    function addAudioSection() {
        const sec = el('div', 'dp-settings-section');
        sec.appendChild(el('div', 'dp-settings-section-title', '🔊 Audio'));

        if (cfg.showMusicToggle) {
            const row = el('div', 'dp-setting-row');
            row.innerHTML = '<span class="dp-setting-icon">🎵</span><span class="dp-setting-label">Musique de fond</span>';
            const t = el('label', 'dp-toggle');
            t.innerHTML = '<input type="checkbox" id="dp-music-toggle" checked><span class="dp-toggle-slider"></span>';
            row.appendChild(t);
            sec.appendChild(row);
            t.querySelector('input').addEventListener('change', function () {
                if (cfg.onMusicToggle) cfg.onMusicToggle(this.checked);
            });
        }

        if (cfg.showMusicVolume) {
            const row = el('div', 'dp-setting-row');
            row.innerHTML = '<span class="dp-setting-icon">🔉</span><span class="dp-setting-label">Volume musique</span>';
            const s = document.createElement('input');
            s.type = 'range'; s.className = 'dp-slider'; s.min = '0'; s.max = '100';
            s.value = cfg.musicVolume || 50;
            s.addEventListener('input', function () {
                if (cfg.onMusicVolume) cfg.onMusicVolume(Number(this.value));
            });
            row.appendChild(s);
            sec.appendChild(row);
        }

        if (cfg.showNarrationVolume) {
            const row = el('div', 'dp-setting-row');
            row.innerHTML = '<span class="dp-setting-icon">🗣️</span><span class="dp-setting-label">Volume narration</span>';
            const s = document.createElement('input');
            s.type = 'range'; s.className = 'dp-slider'; s.min = '0'; s.max = '100';
            s.value = cfg.narrationVolume || 80;
            s.addEventListener('input', function () {
                if (cfg.onNarrationVolume) cfg.onNarrationVolume(Number(this.value));
            });
            row.appendChild(s);
            sec.appendChild(row);
        }

        if (cfg.showMuteToggle) {
            const row = el('div', 'dp-setting-row');
            row.innerHTML = '<span class="dp-setting-icon">🔇</span><span class="dp-setting-label">Couper tout le son</span>';
            const t = el('label', 'dp-toggle');
            t.innerHTML = '<input type="checkbox" id="dp-mute-toggle"><span class="dp-toggle-slider"></span>';
            row.appendChild(t);
            sec.appendChild(row);
            t.querySelector('input').addEventListener('change', function () {
                if (cfg.onMuteToggle) cfg.onMuteToggle(this.checked);
            });
        }

        panel.appendChild(sec);
    }


    function addGameSection() {
        if (!cfg.showGameSection) return;
        const sec = el('div', 'dp-settings-section');
        sec.appendChild(el('div', 'dp-settings-section-title', '🎮 Jeu'));

        if (cfg.showBackToHub !== false) {
            const b = el('button', 'dp-setting-btn');
            b.innerHTML = '<span class="dp-setting-btn-icon">🏠</span> Retour au Hub';
            b.addEventListener('click', function () {
                closePanel();
                if (cfg.onBackToHub) cfg.onBackToHub();
                else window.location.href = '../index.html';
            });
            sec.appendChild(b);
        }

        if (cfg.showRestart) {
            const b = el('button', 'dp-setting-btn danger');
            b.innerHTML = '<span class="dp-setting-btn-icon">🔄</span> Recommencer le jeu';
            b.addEventListener('click', function () {
                closePanel();
                if (cfg.onRestart) cfg.onRestart();
            });
            sec.appendChild(b);
        }

        if (cfg.showRules) {
            const b = el('button', 'dp-setting-btn');
            b.innerHTML = '<span class="dp-setting-btn-icon">📜</span> Règles du jeu';
            b.addEventListener('click', function () {
                closePanel();
                if (cfg.onRules) cfg.onRules();
            });
            sec.appendChild(b);
        }

        if (cfg.customButtons) {
            cfg.customButtons.forEach(function (cb) {
                const b = el('button', 'dp-setting-btn' + (cb.style ? ' ' + cb.style : ''));
                b.innerHTML = '<span class="dp-setting-btn-icon">' + (cb.icon || '🔹') + '</span> ' + cb.label;
                b.addEventListener('click', function () {
                    if (cb.onClick) cb.onClick(closePanel);
                });
                sec.appendChild(b);
            });
        }

        panel.appendChild(sec);
    }

    function addDevSection() {
        const sec = el('div', 'dp-settings-section');
        sec.appendChild(el('div', 'dp-settings-section-title', '🛠️ Développeur'));

        const devBtn = el('button', 'dp-setting-btn dev');
        devBtn.innerHTML = '<span class="dp-setting-btn-icon">⚙️</span> Mode Développeur';
        devBtn.addEventListener('click', function () {
            closePanel();
            if (cfg.onDevMode) cfg.onDevMode();
        });
        sec.appendChild(devBtn);

        const contactBtn = el('a', 'dp-setting-btn contact');
        contactBtn.href = 'https://portefolio-2026.vercel.app/';
        contactBtn.target = '_blank';
        contactBtn.rel = 'noopener';
        contactBtn.innerHTML = '<span class="dp-setting-btn-icon">⌨️</span> Contacter le développeur';
        sec.appendChild(contactBtn);

        panel.appendChild(sec);
    }

    function buildPanel() {
        if (!panel) return;
        panel.innerHTML = '';

        const header = el('div', 'dp-settings-header');
        header.innerHTML = '<span class="dp-settings-title">⚙️ Paramètres</span>';
        const closeBtn = el('button', 'dp-settings-close', '✕');
        closeBtn.setAttribute('aria-label', 'Fermer');
        closeBtn.addEventListener('click', closePanel);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        addLangSection();
        addAudioSection();
        addGameSection();
        addDevSection();

        const footer = el('div', 'dp-settings-footer');
        footer.innerHTML = '<div class="dp-settings-version">Drink & Play v1.0 — Party Games 🎉</div>';
        panel.appendChild(footer);
    }

    function togglePanel() {
        if (panel.classList.contains('open')) closePanel();
        else openPanel();
    }

    function openPanel() {
        buildPanel();
        backdrop.classList.add('open');
        panel.classList.add('open');
        btn.classList.add('open');
        btn.innerHTML = '✕';
    }

    function closePanel() {
        backdrop.classList.remove('open');
        panel.classList.remove('open');
        btn.classList.remove('open');
        btn.innerHTML = '⚙️';
    }

    window.DPSettings = {
        init: function (userCfg) {
            cfg = Object.assign({
                languages: [
                    { value: 'en', label: '🇬🇧 English' },
                    { value: 'fr', label: '🇫🇷 Français' },
                    { value: 'es', label: '🇪🇸 Español' },
                    { value: 'it', label: '🇮🇹 Italiano' }
                ],
                currentLang: 'fr',
                showMusicToggle: true,
                showMusicVolume: true,
                musicVolume: 50,
                showNarrationVolume: false,
                narrationVolume: 80,
                showMuteToggle: false,
                showGameSection: true,
                showBackToHub: true,
                showRestart: false,
                showRules: false,
                customButtons: [],
                btnMount: null,
                onLangChange: null,
                onMusicToggle: null,
                onMusicVolume: null,
                onNarrationVolume: null,
                onMuteToggle: null,
                onBackToHub: null,
                onRestart: null,
                onRules: null,
                onDevMode: null
            }, userCfg || {});
            createElements();
        },
        open: openPanel,
        close: closePanel,
        toggle: togglePanel,
        isOpen: function () { return panel && panel.classList.contains('open'); }
    };
})();
