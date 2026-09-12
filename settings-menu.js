/* ============================================================
   Drink & Play — Unified Settings Menu (JS)
   ============================================================ */
(function () {
    'use strict';

    let panel = null, backdrop = null, btn = null;
    let cfg = {};

    function createElements() {
        if (panel) panel.remove();
        if (backdrop) backdrop.remove();
        if (btn) btn.remove();

        backdrop = document.createElement('div');
        backdrop.className = 'dp-settings-backdrop';
        backdrop.addEventListener('click', closePanel);

        btn = document.createElement('button');
        btn.className = 'dp-settings-btn';
        btn.setAttribute('aria-label', 'Paramètres');
        btn.setAttribute('title', 'Paramètres');
        btn.innerHTML = '⚙️';
        btn.addEventListener('click', togglePanel);

        panel = document.createElement('div');
        panel.className = 'dp-settings-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Panneau des paramètres');

        document.body.appendChild(backdrop);
        document.body.appendChild(btn);
        document.body.appendChild(panel);
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
        contactBtn.href = 'https://portfolio2026-ss9v.vercel.app/';
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
