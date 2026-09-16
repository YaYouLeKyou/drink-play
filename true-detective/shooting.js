/* =====================================================================
   TRUE DETECTIVE - SHOOTING GALLERY (Standalone)
   Simple canvas-based shooting gallery.
   ===================================================================== */
(function (global) {
    'use strict';

    var PHRASES = {
        fr: [
            "Les ombres du manoir cachent plus que des secrets...",
            "Ne tirez pas sur la mauvaise cible, inspecteur.",
            "Chaque coup de feu résonne dans la nuit."
        ],
        en: [
            "The manor shadows hide more than secrets...",
            "Don't shoot the wrong target, inspector.",
            "Every gunshot echoes through the night."
        ]
    };

    var TAUNTS = {
        fr: [
            "Vous avez touché la cible interdite !",
            "Attention, inspecteur. Le sang des innocents...",
            "Trop de précipitation."
        ],
        en: [
            "You hit the forbidden target!",
            "Careful, inspector. Innocent blood...",
            "Too much haste."
        ]
    };

    var VICTORY_PHRASES = {
        fr: ["Bien joué, inspecteur. La vérité émerge."],
        en: ["Well done, inspector. The truth emerges."]
    };

    var FAILURE_PHRASES = {
        fr: ["Trop de manqués. Hale se moque de vous."],
        en: ["Too many misses. Hale is mocking you."]
    };

    function init() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') || 'fr';
        var diff = parseInt(params.get('difficulty'), 10);
        if (diff < 1 || diff > 3) diff = 1;

        var $score = document.getElementById('shooting-score');
        var $targets = document.getElementById('shooting-targets');
        var $misses = document.getElementById('shooting-misses');
        var $dialogue = document.getElementById('shooting-dialogue');
        var canvas = document.getElementById('shooting-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');

        var cw, ch;
        function resize() {
            var rect = canvas.getBoundingClientRect();
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            cw = rect.width;
            ch = rect.height;
            canvas.width = cw * dpr;
            canvas.height = ch * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        var targets = [];
        var particles = [];
        var score = 0;
        var totalTargets = 8 + diff * 2;
        var targetsHit = 0;
        var misses = 0;
        var maxMisses = 5;
        var gameOver = false;
        var spawnTimer = null;
        var phraseList = PHRASES[lang] || PHRASES.en;
        var tauntList = TAUNTS[lang] || TAUNTS.en;

        function setDialogue(text) {
            if ($dialogue) $dialogue.textContent = text;
        }
        function updateStats() {
            if ($score) $score.textContent = (lang === 'fr' ? 'Score: ' : 'Score: ') + score;
            if ($targets) $targets.textContent = (lang === 'fr' ? 'Cibles: ' : 'Targets: ') + targetsHit + '/' + totalTargets;
            if ($misses) $misses.textContent = (lang === 'fr' ? 'Manqués: ' : 'Misses: ') + misses + '/' + maxMisses;
        }

        function spawnTarget() {
            if (gameOver) return;
            var isBad = Math.random() < 0.25;
            var size = 30 + Math.random() * 20;
            var speed = 0.5 + diff * 0.3 + Math.random() * 0.5;
            var y = ch - 80 - Math.random() * (ch - 160);
            var direction = Math.random() < 0.5 ? 1 : -1;
            targets.push({
                x: direction > 0 ? -size : cw + size,
                y: y,
                size: size,
                speed: speed * direction,
                isBad: isBad,
                opacity: 1
            });
        }

        function spawnParticles(x, y, color) {
            for (var i = 0; i < 8; i++) {
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 1,
                    color: color
                });
            }
        }

        function updateParticles() {
            for (var i = particles.length - 1; i >= 0; i--) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.03;
                if (p.life <= 0) particles.splice(i, 1);
            }
        }

        function drawParticles() {
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                ctx.save();
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function drawTargets() {
            for (var i = 0; i < targets.length; i++) {
                var t = targets[i];
                ctx.save();
                ctx.globalAlpha = t.opacity;
                ctx.fillStyle = t.isBad ? '#ff006e' : '#00d4ff';
                ctx.strokeStyle = t.isBad ? '#ff4081' : '#00ffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.size / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#fff';
                ctx.font = '12px Montserrat, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(t.isBad ? '✕' : '●', t.x, t.y);
                ctx.restore();
            }
        }

        function updateTargets() {
            for (var i = targets.length - 1; i >= 0; i--) {
                var t = targets[i];
                t.x += t.speed;
                if ((t.speed > 0 && t.x > cw + t.size) || (t.speed < 0 && t.x < -t.size)) {
                    targets.splice(i, 1);
                    if (!t.isBad) {
                        misses++;
                        updateStats();
                        if (misses >= maxMisses) {
                            endGame(false);
                        }
                    }
                }
            }
        }

        function drawBackground() {
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, cw, ch);
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
            ctx.lineWidth = 1;
            for (var x = 0; x < cw; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
            }
            for (var y = 0; y < ch; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
            }
        }

        function gameLoop() {
            if (gameOver) return;
            ctx.clearRect(0, 0, cw, ch);
            drawBackground();
            updateTargets();
            drawTargets();
            updateParticles();
            drawParticles();
            requestAnimationFrame(gameLoop);
        }

        function endGame(won) {
            if (gameOver) return;
            gameOver = true;
            clearInterval(spawnTimer);
            var text = won
                ? (VICTORY_PHRASES[lang] || VICTORY_PHRASES.en)[0]
                : (FAILURE_PHRASES[lang] || FAILURE_PHRASES.en)[0];
            setDialogue(text);
            setTimeout(function () {
                try {
                    localStorage.setItem('td_standalone_game_result', JSON.stringify({
                        type: 'shooting',
                        won: !!won,
                        ts: Date.now()
                    }));
                } catch (e) {}
                var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
                window.location.href = fromStory ? '../true-detective/index.html?standalone=shooting' : '../true-detective/index.html#minigames';
            }, 1500);
        }

        canvas.addEventListener('click', function (e) {
            if (gameOver) return;
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            for (var i = targets.length - 1; i >= 0; i--) {
                var t = targets[i];
                var dx = x - t.x;
                var dy = y - t.y;
                if (Math.sqrt(dx * dx + dy * dy) < t.size / 2) {
                    if (t.isBad) {
                        misses++;
                        spawnParticles(t.x, t.y, '#ff006e');
                        setDialogue(tauntList[Math.floor(Math.random() * tauntList.length)]);
                    } else {
                        score += 10;
                        targetsHit++;
                        spawnParticles(t.x, t.y, '#00d4ff');
                    }
                    targets.splice(i, 1);
                    updateStats();
                    if (targetsHit >= totalTargets) {
                        endGame(true);
                    }
                    return;
                }
            }
            misses++;
            updateStats();
            if (misses >= maxMisses) {
                endGame(false);
            }
        });

        setDialogue(phraseList[Math.floor(Math.random() * phraseList.length)]);
        spawnTimer = setInterval(spawnTarget, 1500);
        updateStats();
        gameLoop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);
