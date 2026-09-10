(function (global) {
    'use strict';

    function t(obj, lang) {
        if (!obj) return '';
        return obj[lang] || obj.fr || obj.en || '';
    }

    function getThemeId() {
        if (typeof window !== 'undefined' && window.getThemeId) return window.getThemeId();
        return 'agatha-christie';
    }

    function InterrogationSystem(cfg, lang, options) {
        this.cfg = cfg || {};
        this.lang = lang || 'en';
        this.options = options || {};

        this.interroData = null;
        this.interroState = null;
        this.interroCompleted = false;
        this.dialogueHistoryEl = this.options.dialogueHistoryEl || null;
        this.interroBoxEl = this.options.interroBoxEl || null;
        this.dialogueTextEl = this.options.dialogueTextEl || null;
        this.suspectName = this.options.suspectName || '';
        this.puzzleCharClass = this.options.puzzleCharClass || 'minigame-character';
        this.characterImageFn = this.options.characterImageFn || null;

        this.onPause = this.options.onPause || function () {};
        this.onResume = this.options.onResume || function () {};
        this.onInterroComplete = this.options.onInterroComplete || null;
        this.onActionTrigger = this.options.onActionTrigger || null;

        this.interroId = null;
        if (typeof window !== 'undefined' && window.scr && window.scr.interro && window.scr.interro.id) {
            this.interroId = window.scr.interro.id;
        }

        this.fetchInterrogationData();
    }

    InterrogationSystem.prototype.fetchInterrogationData = function () {
        if (!this.interroId) {
            if (typeof window !== 'undefined' && window.TDNarration && window.TDNarration.interrogations) {
                var keys = Object.keys(window.TDNarration.interrogations);
                if (keys.length) this.interroId = keys[0];
            }
        }
        if (!this.interroId) return;

        if (typeof window !== 'undefined' && window.TDNarration && window.TDNarration.interrogations) {
            this.interroData = window.TDNarration.interrogations[this.interroId];
        }
    };

    InterrogationSystem.prototype.getRounds = function () {
        if (!this.interroData) return [];
        var rounds = [];
        if (this.interroData.questions) rounds.push(this.interroData.questions);
        if (this.interroData.rounds2) rounds.push(this.interroData.rounds2);
        if (this.interroData.rounds3) rounds.push(this.interroData.rounds3);
        return rounds.filter(function (r) { return r && r.length; });
    };

    InterrogationSystem.prototype.appendDialogue = function (text, speaker) {
        var history = this.dialogueHistoryEl;
        if (!history) return;

        var line = document.createElement('div');
        line.className = 'chess-interro-history';
        if (speaker) {
            line.textContent = speaker + ': ' + text;
        } else {
            line.textContent = text;
        }
        history.appendChild(line);
        history.scrollTop = history.scrollHeight;
    };

    InterrogationSystem.prototype.clearDialogue = function () {
        if (this.dialogueHistoryEl) this.dialogueHistoryEl.innerHTML = '';
        if (this.interroBoxEl) this.interroBoxEl.innerHTML = '';
    };

    InterrogationSystem.prototype.setDialogueText = function (text) {
        if (this.dialogueTextEl) {
            this.dialogueTextEl.textContent = text;
        }
    };

    InterrogationSystem.prototype.renderInterrogation = function () {
        if (!this.interroData || !this.interroState || !this.interroBoxEl) return;

        var rounds = this.getRounds();
        if (!rounds.length) return;

        if (this.interroState.round >= rounds.length) {
            this.appendDialogue(
                this.lang === 'fr' ? 'Interrogatoire terminé.' : 'Interrogation complete.',
                null
            );
            this.clearInterrogation();
            if (typeof this.onInterroComplete === 'function') {
                this.onInterroComplete();
            } else {
                this.setRandomDialogue();
            }
            return;
        }

        var currentRound = rounds[this.interroState.round] || [];
        var remaining = currentRound.filter(function (q) {
            return this.interroState.answered.indexOf(q.id || q.label) === -1;
        }, this);

        if (!remaining.length) {
            if (this.interroState.round + 1 < rounds.length) {
                this.interroState.round++;
                this.interroState.answered = [];
                this.renderInterrogation();
            } else {
                this.appendDialogue(
                    this.lang === 'fr' ? 'Interrogatoire terminé.' : 'Interrogation complete.',
                    null
                );
                this.clearInterrogation();
                if (typeof this.onInterroComplete === 'function') {
                    this.onInterroComplete();
                } else {
                    this.setRandomDialogue();
                }
            }
            return;
        }

        this.interroBoxEl.innerHTML = '';

        var label = document.createElement('div');
        label.className = 'chess-interro-history';
        label.textContent = (this.lang === 'fr' ? 'Phase ' : 'Phase ') +
            (this.interroState.round + 1) + '/' + rounds.length;
        this.interroBoxEl.appendChild(label);

        var self = this;
        remaining.forEach(function (q) {
            var btn = document.createElement('button');
            btn.className = 'chess-interro-question';
            btn.textContent = t(q.label, self.lang);
            btn.addEventListener('click', function () {
                if (!self.interroState) return;
                self.interroState.answered.push(q.id || q.label);

                var response = t(q.response, self.lang) || '';

                var playerLabel = (self.lang === 'fr' ? 'Vous: ' : 'You: ') + t(q.label, self.lang);
                self.appendDialogue(playerLabel, null);

                var suspectSpeaker = self.suspectName || 'Suspect';
                self.appendDialogue(suspectSpeaker + ': ' + response, null);

                var clue = null;
                if (typeof window !== 'undefined' && typeof window.scrClueFromInterroResponse === 'function') {
                    clue = window.scrClueFromInterroResponse(response);
                }
                if (clue && typeof window !== 'undefined' && window.TDNarrativeEngine &&
                    typeof window.TDNarrativeEngine.addClue === 'function') {
                    window.TDNarrativeEngine.addClue(clue, q.evidence || 'dialogue');
                    if (typeof window !== 'undefined' && window.showClueToast) {
                        window.showClueToast(clue);
                    }
                }

                self.renderInterrogation();
            });
            self.interroBoxEl.appendChild(btn);
        });
    };

    InterrogationSystem.prototype.startInterrogation = function () {
        this.clearDialogue();
        if (!this.interroData) {
            this.fetchInterrogationData();
        }
        if (!this.interroData) return;

        this.interroState = { round: 0, answered: [] };
        this.interroCompleted = false;

        var rounds = this.getRounds();
        if (!rounds.length) return;

        if (this.onPause) this.onPause();

        this.setDialogueText(
            this.lang === 'fr'
                ? 'Phase 1/3, Choisissez votre question :'
                : 'Phase 1/3, Pick your question:'
        );
        this.appendDialogue(
            this.lang === 'fr'
                ? 'Phase 1/3, Choisissez votre question :'
                : 'Phase 1/3, Pick your question:',
            null
        );
        this.renderInterrogation();
    };

    InterrogationSystem.prototype.clearInterrogation = function () {
        this.interroState = null;
        this.interroData = null;
        this.interroCompleted = true;
        this.clearDialogue();

        if (this.onResume) this.onResume();
    };

    InterrogationSystem.prototype.setRandomDialogue = function () {
        if (!this.dialogueTextEl) return;
        var phraseList = this.cfg.dialogues && this.cfg.dialogues.length
            ? this.cfg.dialogues
            : this.getDefaultPhrases();
        if (phraseList && phraseList.length) {
            var text = phraseList[Math.floor(Math.random() * phraseList.length)];
            this.dialogueTextEl.textContent = text;
        }
    };

    InterrogationSystem.prototype.getDefaultPhrases = function () {
        return null;
    };

    InterrogationSystem.prototype.onAction = function () {
        if (this.interroCompleted) {
            return;
        }

        if (!this.interroData) {
            this.fetchInterrogationData();
        }

        if (this.interroData && this.getRounds().length) {
            this.startInterrogation();
        }

        if (typeof this.onActionTrigger === 'function') {
            this.onActionTrigger(this.interroCompleted);
        }
    };

    InterrogationSystem.prototype.onGameComplete = function (won) {
        if (!this.interroCompleted && this.interroData && this.getRounds().length) {
            this.startInterrogation();
        }
    };

    InterrogationSystem.prototype.isInterrogating = function () {
        return this.interroState !== null;
    };

    InterrogationSystem.prototype.destroy = function () {
        this.interroState = null;
        this.interroData = null;
        this.clearDialogue();
    };

    InterrogationSystem.prototype.createCharacterPresence = function (container, gameType, suspectId) {
        var self = this;
        var characterEl = document.createElement('div');
        characterEl.className = gameType + '-character';

        var characterImage = document.createElement('div');
        characterImage.className = gameType + '-character-image';

        if (this.characterImageFn) {
            var imgSrc = this.characterImageFn(suspectId);
            if (imgSrc) {
                var img = document.createElement('img');
                img.src = imgSrc;
                img.alt = this.suspectName || '';
                img.addEventListener('error', function () {
                    characterImage.textContent = '👤';
                });
                characterImage.appendChild(img);
            } else {
                characterImage.textContent = '👤';
            }
        } else {
            characterImage.textContent = '👤';
        }

        characterEl.appendChild(characterImage);
        container.appendChild(characterEl);

        var talkbox = document.createElement('div');
        talkbox.className = gameType + '-talkbox';
        var phraseList = this.cfg.dialogues && this.cfg.dialogues.length
            ? this.cfg.dialogues
            : (this.getDefaultPhrases() || []);
        if (phraseList.length) {
            talkbox.textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
        }
        container.appendChild(talkbox);

        var phraseInterval = setInterval(function () {
            if (!characterEl.parentNode) {
                clearInterval(phraseInterval);
                return;
            }
            if (phraseList.length) {
                talkbox.textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
            }
        }, 4000);

        return {
            destroy: function () {
                clearInterval(phraseInterval);
                if (characterEl.parentNode) characterEl.remove();
                if (talkbox.parentNode) talkbox.remove();
            }
        };
    };

    global.TDInterrogationSystem = InterrogationSystem;

})(typeof globalThis !== 'undefined' ? globalThis : this);
