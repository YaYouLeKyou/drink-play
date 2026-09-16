/* =====================================================================
   TRUE DETECTIVE - LABORATOIRE DU DR WHITMORE (Chimie & Éprouvettes)
   Transvasement de réactifs et tri de fluides colorés pour isoler
   les toxines et échantillons d'ADN.
===================================================================== */
(function (global) {
    'use strict';

    function playSfx(name, opts) {
        try { if (global.TDSfx) global.TDSfx.play(name, opts); } catch (e) {}
    }

    function ChemistryGame(container, options) {
        options = options || {};
        this.container = container;
        this.lang = options.lang || 'fr';
        this.onComplete = options.onComplete || function () {};
        this.tubeCapacity = 4;

        // Colors: 'R' (Red/Toxin), 'B' (Blue/Reagent), 'G' (Green/Bio-fluid), 'Y' (Yellow/Solvent)
        this.tubes = [
            ['R', 'B', 'R', 'G'],
            ['G', 'Y', 'B', 'Y'],
            ['B', 'G', 'Y', 'R'],
            ['Y', 'R', 'G', 'B'],
            [], // Empty tube 1
            []  // Empty tube 2
        ];
        this.selectedTubeIdx = null;
        this.isPouring = false;
        this.moves = 0;
        this.gameOver = false;

        this.render();
    }

    ChemistryGame.prototype.render = function () {
        this.container.innerHTML = '';

        var wrap = document.createElement('div');
        wrap.className = 'chem-wrapper';

        // Title and instructions
        var header = document.createElement('div');
        header.className = 'chem-header';

        var title = document.createElement('div');
        title.className = 'chem-title';
        title.textContent = this.lang === 'fr'
            ? '🧪 Laboratoire du Dr Whitmore - Analyse Toxico'
            : '🧪 Dr Whitmore\'s Lab - Tox Analysis';

        var sub = document.createElement('div');
        sub.className = 'chem-sub';
        sub.textContent = this.lang === 'fr'
            ? 'Transvasez les réactifs pour regrouper chaque fluide pur dans son éprouvette.'
            : 'Pour reagents to group each pure fluid in its tube.';

        var status = document.createElement('div');
        status.className = 'chem-status';
        status.textContent = (this.lang === 'fr' ? 'Mouvements : ' : 'Moves: ') + this.moves;
        this.statusEl = status;

        header.appendChild(title);
        header.appendChild(sub);
        header.appendChild(status);
        wrap.appendChild(header);

        // Test tubes rack
        var rack = document.createElement('div');
        rack.className = 'chem-rack';

        for (var i = 0; i < this.tubes.length; i++) {
            var tubeEl = document.createElement('div');
            tubeEl.className = 'chem-tube';
            if (this.selectedTubeIdx === i) tubeEl.classList.add('selected');
            tubeEl.dataset.idx = i;

            // Liquid segments from top to bottom
            var liquidContainer = document.createElement('div');
            liquidContainer.className = 'chem-liquid-container';

            var tubeData = this.tubes[i];
            // Display empty slots + liquid levels
            for (var level = this.tubeCapacity - 1; level >= 0; level--) {
                var seg = document.createElement('div');
                seg.className = 'chem-segment';
                if (level < tubeData.length) {
                    var colorCode = tubeData[level];
                    seg.classList.add('color-' + colorCode);
                } else {
                    seg.classList.add('empty');
                }
                liquidContainer.appendChild(seg);
            }

            var glass = document.createElement('div');
            glass.className = 'chem-glass-rim';
            tubeEl.appendChild(glass);
            tubeEl.appendChild(liquidContainer);

            var self = this;
            (function (idx) {
                tubeEl.addEventListener('click', function () {
                    self.handleTubeClick(idx);
                });
            })(i);

            rack.appendChild(tubeEl);
        }

        wrap.appendChild(rack);

        // Buttons
        var footer = document.createElement('div');
        footer.className = 'chem-footer';

        var resetBtn = document.createElement('button');
        resetBtn.className = 'btn btn-secondary';
        resetBtn.textContent = this.lang === 'fr' ? 'Réinitialiser mélanges' : 'Reset mixtures';
        var self = this;
        resetBtn.addEventListener('click', function () {
            playSfx('click');
            self.resetGame();
        });
        footer.appendChild(resetBtn);

        wrap.appendChild(footer);
        this.container.appendChild(wrap);
    };

    ChemistryGame.prototype.resetGame = function () {
        this.tubes = [
            ['R', 'B', 'R', 'G'],
            ['G', 'Y', 'B', 'Y'],
            ['B', 'G', 'Y', 'R'],
            ['Y', 'R', 'G', 'B'],
            [],
            []
        ];
        this.selectedTubeIdx = null;
        this.moves = 0;
        this.gameOver = false;
        this.render();
    };

    ChemistryGame.prototype.handleTubeClick = function (idx) {
        if (this.gameOver || this.isPouring) return;

        if (this.selectedTubeIdx === null) {
            // Select source tube if it has liquid
            if (this.tubes[idx].length > 0) {
                this.selectedTubeIdx = idx;
                this.render();
            }
        } else if (this.selectedTubeIdx === idx) {
            // Deselect
            this.selectedTubeIdx = null;
            this.render();
        } else {
            // Pour from selectedTubeIdx into idx
            var fromIdx = this.selectedTubeIdx;
            var toIdx = idx;

            if (this.canPour(fromIdx, toIdx)) {
                this.pour(fromIdx, toIdx);
            } else {
                this.selectedTubeIdx = idx; // Switch selection if non-pourable
                this.render();
            }
        }
    };

    ChemistryGame.prototype.canPour = function (fromIdx, toIdx) {
        var fromTube = this.tubes[fromIdx];
        var toTube = this.tubes[toIdx];

        if (!fromTube.length) return false;
        if (toTube.length >= this.tubeCapacity) return false;

        var topFrom = fromTube[fromTube.length - 1];
        if (!toTube.length) return true; // Can pour into empty tube

        var topTo = toTube[toTube.length - 1];
        return topFrom === topTo; // Matching liquid color
    };

    ChemistryGame.prototype.pour = function (fromIdx, toIdx) {
        this.isPouring = true;
        var fromTube = this.tubes[fromIdx];
        var toTube = this.tubes[toIdx];

        var colorToPour = fromTube[fromTube.length - 1];

        // Pour consecutive matching blocks that fit
        while (fromTube.length > 0 &&
               fromTube[fromTube.length - 1] === colorToPour &&
               toTube.length < this.tubeCapacity) {
            toTube.push(fromTube.pop());
        }

        playSfx('liquid_pour');

        this.moves++;
        this.selectedTubeIdx = null;
        this.isPouring = false;
        this.render();

        if (this.checkWin()) {
            this.handleWin();
        }
    };

    ChemistryGame.prototype.checkWin = function () {
        for (var i = 0; i < this.tubes.length; i++) {
            var tube = this.tubes[i];
            if (tube.length === 0) continue;
            if (tube.length !== this.tubeCapacity) return false;
            var firstColor = tube[0];
            for (var j = 1; j < tube.length; j++) {
                if (tube[j] !== firstColor) return false;
            }
        }
        return true;
    };

    ChemistryGame.prototype.handleWin = function () {
        this.gameOver = true;
        if (this.statusEl) {
            this.statusEl.textContent = this.lang === 'fr'
                ? '✨ ANALYSE REUSSIE ! Réactifs purifiés, spectre ADN isolé !'
                : '✨ SUCCESS! Reagents purified, DNA spectrum isolated!';
            this.statusEl.style.color = '#00ff88';
        }
        var self = this;
        setTimeout(function () {
            if (self.onComplete) self.onComplete(true);
        }, 1200);
        
        // Show continue button after winning
        setTimeout(function () {
            if (!self.continueBtn) {
                self.continueBtn = document.createElement('button');
                self.continueBtn.className = 'btn btn-continue';
                self.continueBtn.textContent = self.lang === 'fr' ? 'Continuer' : 'Continue';
                self.container.appendChild(self.continueBtn);
                self.continueBtn.style.cssText = 'position:fixed;bottom:calc(20px + env(safe-area-inset-bottom, 0px));left:50%;transform:translateX(-50%);z-index:100;padding:10px 20px;font-size:0.9rem;font-weight:700;background:rgba(0,255,136,0.15);border:2px solid #00ff88;border-radius:8px;color:#00ff88;cursor:pointer;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:0.05em;';
                self.continueBtn.addEventListener('click', function () {
                    playSfx('click');
                    self.container.innerHTML = '';
                    if (self.onComplete) self.onComplete(true);
                });
            }
        }, 1500);
    };

    ChemistryGame.play = function (cfg, lang, onDone, target) {
        if (!target) {
            target = document.getElementById('minigame-layer');
            if (target) {
                target.innerHTML = '';
                target.classList.add('active');
            }
        }
        var container = document.createElement('div');
        container.className = 'minigame-standalone-wrapper';
        target.innerHTML = '';
        target.appendChild(container);

        var game = new ChemistryGame(container, {
            lang: lang || 'fr',
            onComplete: function (won) {
                if (onDone) onDone({ won: won });
            }
        });
        return game;
    };

    global.TDChemistryGame = ChemistryGame;

})(typeof globalThis !== 'undefined' ? globalThis : this);

