/* =====================================================================
   TRUE DETECTIVE - SHOOTING GALLERY MINIGAME (Protecteur / Film Noir)
   Manor exterior shooting gallery: suspects walk across, miss femme-fatale.
   ===================================================================== */
(function (global) {
    'use strict';

    var TDShootingGallery = { play: play };

    var PHRASES = {
        fr: [
            "Les ombres du manoir cachent plus que des secrets...",
            "Ne tirez pas sur la mauvaise cible, inspecteur.",
            "Chaque coup de feu résonne dans la nuit.",
            "Le major Hale observe. Soyez précis.",
            "La vérité est là, juste devant vous."
        ],
        en: [
            "The manor shadows hide more than secrets...",
            "Don't shoot the wrong target, inspector.",
            "Every gunshot echoes through the night.",
            "Major Hale is watching. Be precise.",
            "The truth is right in front of you."
        ]
    };

    var TAUNTS = {
        fr: [
            "Vous avez touché la cible interdite !",
            "Attention, inspecteur. Le sang des innocents...",
            "Votre doigt glitche au pire moment.",
            "Trop de précipitation. Hale se moque de vous.",
            "Vous avez manqué l'essentiel."
        ],
        en: [
            "You hit the forbidden target!",
            "Careful, inspector. Innocent blood...",
            "Your finger slips at the worst moment.",
            "Too much haste. Hale is mocking you.",
            "You missed the point."
        ]
    };

    var PHRASE_TRIGGERS = [2, 4, 6];

    /* ==== 4 NIVEAUX DE DIFFICULTÉ ====================================
       easy   : cibles lentes & larges, femme-fatale très lente
       medium : vitesse équilibrée
       hard   : cibles rapides & étroites, femme-fatale rapide
       extreme: cibles très rapides & minuscules, femme-fatale furtive
       ================================================================= */
    var DIFFICULTIES = {
        easy:   { speedMult: 0.7,  forbiddenSpeedMult: 0.6,  targetW: 60, targetH: 70, minTargets: 6, scoreBonus: 0 },
        medium: { speedMult: 1.0,  forbiddenSpeedMult: 1.0,  targetW: 48, targetH: 56, minTargets: 8, scoreBonus: 1 },
        hard:   { speedMult: 1.45, forbiddenSpeedMult: 1.6,  targetW: 38, targetH: 44, minTargets: 10, scoreBonus: 2 },
        extreme:{ speedMult: 2.0,  forbiddenSpeedMult: 2.4,  targetW: 30, targetH: 36, minTargets: 12, scoreBonus: 4 }
    };

    function getDifficultyConfig(difficulty) {
        return DIFFICULTIES[difficulty] || DIFFICULTIES.medium;
    }

    function getNpcName(npcId, lang) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcName === 'function') {
            return window.scrNpcName(npcId || 'protecteur');
        }
        return lang === 'fr' ? 'Major Hale' : 'Major Hale';
    }

    function getNpcRole(npcId, lang) {
        if (npcId === 'protecteur' || !npcId) {
            return lang === 'fr' ? 'Garde du corps' : 'Bodyguard';
        }
        return '';
    }

    function getNpcImage(npcId) {
        if (typeof window !== 'undefined' && window.scr && typeof window.scrNpcImage === 'function') {
            return window.scrNpcImage(npcId || 'protecteur');
        }
        if (typeof window !== 'undefined' && window.THEME_ASSETS) {
            var themeId = typeof window.getThemeId === 'function' ? window.getThemeId() : 'agatha-christie';
            var assets = window.THEME_ASSETS[themeId] || window.THEME_ASSETS['agatha-christie'];
            return assets && assets.protecteur;
        }
        return null;
    }

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    function getThemeId() {
        if (typeof window !== 'undefined' && window.getThemeId) return window.getThemeId();
        return 'agatha-christie';
    }

    function getSceneBackground(themeId) {
        if (typeof window !== 'undefined' && window.THEME_ASSETS && window.THEME_ASSETS[themeId]) {
            var assets = window.THEME_ASSETS[themeId];
            return assets.exteriorManorImg || assets.exteriorManor || assets.universeImg || assets.universe || '';
        }
        return '';
    }

    function play(cfg, lang, onDone, target) {
        if (!cfg) { if (onDone) onDone({ won: false }); return; }

        var overlay = document.getElementById('minigame-overlay');
        var overlayContent = overlay ? overlay.querySelector('#minigame-screen-content') : null;
        if (overlay) overlay.classList.add('retro-layout');
        if (overlay) {
            var topbar = overlay.querySelector('.minigame-overlay-topbar');
            var bottombar = overlay.querySelector('.minigame-overlay-bottombar');
            var title = overlay.querySelector('.minigame-screen-title');
            if (topbar) topbar.style.display = 'none';
            if (bottombar) bottombar.style.display = 'none';
            if (title) title.classList.add('hidden');
        }

        if (overlayContent) {
            overlayContent.innerHTML = '';
            target = overlayContent;
        } else {
            var layer = document.getElementById('minigame-layer');
            if (!layer) { if (onDone) onDone({ won: false }); return; }
            layer.innerHTML = '';
            layer.classList.add('active');
            target = layer;
        }

        var interroId = cfg.interroId || 'protecteur';
        var suspectName = getNpcName(interroId, lang);
        var suspectRole = getNpcRole(interroId, lang);
        var dialogues = cfg.dialogues || [];
        var dialogueLines = dialogues.beforeSpin || (PHRASES[lang] || PHRASES.en);
        var tauntLines = dialogues.afterLose || (TAUNTS[lang] || TAUNTS.en);
        var diffCfg = getDifficultyConfig(cfg.difficulty);
        var targetCount = Math.max(cfg.targetCount || 0, diffCfg.minTargets) || diffCfg.minTargets;
        var forbiddenTarget = 'femme-fatale';

        var wrap = document.createElement('div');
        wrap.className = 'retro-wrap';
        var maxWidth = Math.min(600, window.innerWidth - 32);
        var maxHeight = Math.min(420, window.innerHeight - 220);
        wrap.style.cssText = 'width:100%;max-width:' + maxWidth + 'px;max-height:' + maxHeight + 'px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:8px;overflow:hidden;';

        var themeId = getThemeId();
        var bgUrl = getSceneBackground(themeId);
        if (bgUrl) {
            wrap.style.backgroundImage = 'url(' + bgUrl + ')';
            wrap.style.backgroundSize = 'cover';
            wrap.style.backgroundPosition = 'center';
            wrap.style.borderRadius = '16px';
            wrap.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
        }

        var canvas = document.createElement('canvas');
        canvas.width = Math.min(640, window.innerWidth - 24);
        canvas.height = Math.min(400, window.innerHeight - 220);
        canvas.style.cssText = 'display:block;width:100%;height:auto;max-width:100%;border:2px solid #00ffff;border-radius:8px;box-shadow:0 0 20px rgba(0,255,255,0.3);cursor:crosshair;background:#0a0a1a;';
        wrap.appendChild(canvas);

        target.appendChild(wrap);

        var ctx = canvas.getContext('2d');
        var cw = canvas.width, ch = canvas.height;
        var score = 0;
        var won = false;
        var ended = false;
        var targets = [];
        var forbidden = null;
        var phraseTimeout = null;
        var dialogueEl = null;
        var lastPhraseScore = 0;

        var suspectList = ['protecteur', 'seducteur', 'suspect', 'marginal', 'criminel', 'scientifique', 'detective'];
        var suspectNames = {
            protecteur: 'Hale',
            seducteur: 'Pembrooke',
            suspect: 'Blackwood',
            marginal: 'Silas',
            criminel: 'Krane',
            scientifique: 'Whitmore',
            detective: 'Wexford',
            'femme-fatale': 'Vivienne'
        };
        var suspectColors = {
            protecteur: '#00ffff',
            seducteur: '#ffff00',
            suspect: '#ff00ff',
            marginal: '#00ff00',
            criminel: '#ff6600',
            scientifique: '#ffffff',
            detective: '#ff0000',
            'femme-fatale': '#ff00ff'
        };

        function createTarget(type) {
            var name = suspectNames[type] || type;
            var color = suspectColors[type] || '#ffffff';
            var isForbidden = type === forbiddenTarget;
            var speedMult = isForbidden ? diffCfg.forbiddenSpeedMult : diffCfg.speedMult;
            return {
                type: type,
                name: name,
                x: isForbidden ? cw + 60 : -60,
                y: 50 + Math.random() * (ch - 100),
                w: diffCfg.targetW,
                h: diffCfg.targetH,
                vx: isForbidden
                    ? -(1 + Math.random() * 0.6) * speedMult
                    : (1 + Math.random() * 1.1) * speedMult,
                vy: (Math.random() - 0.5) * 0.5 * speedMult,
                color: color,
                alive: true
            };
        }

        function initTargets() {
            targets = [];
            forbidden = createTarget(forbiddenTarget);
            forbidden.x = cw + 40;
            for (var i = 0; i < targetCount; i++) {
                var type = suspectList[i % suspectList.length];
                var t = createTarget(type);
                t.x = -80 - Math.random() * 240;
                t.vx = (0.9 + Math.random() * 1.1) * diffCfg.speedMult;
                targets.push(t);
            }
        }

        dialogueEl = document.createElement('div');
        dialogueEl.className = 'retro-dialogue';
        dialogueEl.style.cssText = 'text-align:center;padding:6px 10px;color:#ffff00;font-family:monospace;max-width:90%;text-shadow:0 0 8px #ff00ff;font-size:0.9em;';
        wrap.appendChild(dialogueEl);
        showDialogue(dialogueLines[0]);

        function showDialogue(text) {
            if (!text) { dialogueEl.style.display = 'none'; return; }
            dialogueEl.textContent = text;
            dialogueEl.style.display = '';
        }

        function showPhrase(text) {
            dialogueEl.textContent = text;
            dialogueEl.style.opacity = '1';
            if (phraseTimeout) clearTimeout(phraseTimeout);
            phraseTimeout = setTimeout(function () {
                dialogueEl.style.opacity = '0.5';
            }, 3000);
        }

        function showNewPhrase() {
            var lines = dialogueLines.concat(tauntLines);
            showPhrase(lines[Math.floor(Math.random() * lines.length)]);
        }

        function showTaunt() {
            showPhrase(tauntLines[Math.floor(Math.random() * tauntLines.length)]);
        }

        function cleanup() {
            ended = true;
            if (phraseTimeout) clearTimeout(phraseTimeout);
            if (overlay) {
                overlay.classList.remove('retro-layout');
                var topbar = overlay.querySelector('.minigame-overlay-topbar');
                var bottombar = overlay.querySelector('.minigame-overlay-bottombar');
                var title = overlay.querySelector('.minigame-screen-title');
                if (topbar) topbar.style.display = '';
                if (bottombar) bottombar.style.display = '';
                if (title) title.classList.remove('hidden');
                var content = overlay.querySelector('#minigame-screen-content');
                if (content) content.innerHTML = '';
            }
            if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
        }

        initTargets();

        canvas.addEventListener('click', function (e) {
            if (ended) return;
            var rect = canvas.getBoundingClientRect();
            var scaleX = canvas.width / rect.width;
            var scaleY = canvas.height / rect.height;
            var mx = (e.clientX - rect.left) * scaleX;
            var my = (e.clientY - rect.top) * scaleY;

            var all = targets.concat([forbidden]);
            var hit = null;
            for (var i = all.length - 1; i >= 0; i--) {
                var t = all[i];
                if (!t.alive) continue;
                if (Math.abs(mx - (t.x + t.w / 2)) < t.w / 2 && Math.abs(my - (t.y + t.h / 2)) < t.h / 2) {
                    hit = t;
                    break;
                }
            }

            if (!hit) {
                score = Math.max(0, score - 1);
                showTaunt();
                return;
            }

            if (hit.type === forbiddenTarget) {
                ended = true;
                won = false;
                showDialogue(t(tauntLines[0], lang));
                setTimeout(function () {
                    cleanup();
                    if (onDone) onDone({ won: false, score: score });
                }, 800);
                return;
            }

            hit.alive = false;
            score++;
            showNewPhrase();

            if (PHRASE_TRIGGERS.indexOf(score) !== -1 && score > lastPhraseScore) {
                lastPhraseScore = score;
                showNewPhrase();
            }

            var remaining = targets.filter(function (t) { return t.alive; }).length;
            if (remaining === 0 && (!forbidden || !forbidden.alive)) {
                ended = true;
                won = true;
                score += diffCfg.scoreBonus;
                showDialogue(t(dialogueLines[dialogueLines.length - 1], lang));
                setTimeout(function () {
                    cleanup();
                    if (onDone) onDone({ won: true, score: score });
                }, 600);
            }
        });

        function update() {
            if (ended) return;
            targets.forEach(function (t) {
                if (!t.alive) return;
                t.x += t.vx;
                t.y += t.vy;
                if (t.y < 20 || t.y > ch - t.h - 20) t.vy *= -1;
                if (t.x < -90) { t.x = cw + 40; t.y = 50 + Math.random() * (ch - 100); }
                if (t.x > cw + 90) { t.x = -90; t.y = 50 + Math.random() * (ch - 100); }
            });
            if (forbidden && forbidden.alive) {
                forbidden.x += forbidden.vx;
                forbidden.y += forbidden.vy;
                if (forbidden.y < 20 || forbidden.y > ch - forbidden.h - 20) forbidden.vy *= -1;
                if (forbidden.x < -90) forbidden.x = cw + 40;
                if (forbidden.x > cw + 90) forbidden.x = -90;
            }
        }

        function draw() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);

            ctx.strokeStyle = '#222244';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, ch / 2);
            ctx.lineTo(cw, ch / 2);
            ctx.stroke();

            ctx.font = 'bold 15px monospace';
            ctx.fillStyle = '#00ffff';
            ctx.textAlign = 'left';
            ctx.fillText('SCORE: ' + score, 10, 20);
            ctx.fillStyle = '#ff00ff';
            ctx.textAlign = 'right';
            ctx.fillText('TARGETS: ' + targets.filter(function (t) { return t.alive; }).length, cw - 10, 20);
            ctx.fillStyle = '#ff4444';
            ctx.textAlign = 'center';
            ctx.fillText('DO NOT SHOOT: VIVIENNE', cw / 2, 20);
            var diffLabels = { easy: 'EASY', medium: 'MEDIUM', hard: 'HARD', extreme: 'EXTREME' };
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('DIFF: ' + (diffLabels[cfg.difficulty] || 'MEDIUM'), 10, 36);

            targets.forEach(function (t) {
                if (!t.alive) return;
                ctx.fillStyle = t.color;
                ctx.shadowColor = t.color;
                ctx.shadowBlur = 6;
                ctx.fillRect(t.x, t.y, t.w, t.h);
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ffffff';
                ctx.font = '9px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(t.name, t.x + t.w / 2, t.y - 4);
            });

            if (forbidden && forbidden.alive) {
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.strokeRect(forbidden.x - 2, forbidden.y - 2, forbidden.w + 4, forbidden.h + 4);
                ctx.fillStyle = '#ff66aa';
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 12;
                ctx.fillRect(forbidden.x, forbidden.y, forbidden.w, forbidden.h);
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(forbidden.name, forbidden.x + forbidden.w / 2, forbidden.y - 4);
            }
        }

        function loop() {
            update();
            draw();
            if (!ended) requestAnimationFrame(loop);
        }

        loop();
    }

    global.TDShootingGallery = { play: play };

})(typeof globalThis !== 'undefined' ? globalThis : this);