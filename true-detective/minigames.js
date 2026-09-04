/* =====================================================================
   TRUE DETECTIVE — MINI-JEUX OPTIONNELS (bonus d'indices + timer)
   ---------------------------------------------------------------------
   Chaque mini-jeu est OPTIONNEL : le joueur peut toujours « Passer ».
   Le timer crée la pression ; un échec = perte de l'indice bonus,
   jamais de game over. Mobile-friendly (clic).
===================================================================== */
(function (global) {
    'use strict';

    var t = function (obj, lang) { return obj[lang] || obj.fr || obj.en || ''; };

    /* Calcule les messages / boutons partagés */
    function play(cfg, lang, onDone) {
        if (!cfg) { if (onDone) onDone({ won: false }); return; }
        var layer = document.getElementById('minigame-layer');
        if (!layer) { if (onDone) onDone({ won: false }); return; }

        layer.innerHTML = '';
        layer.classList.add('active');

        var content = document.createElement('div');
        content.className = 'minigame-content';
        if (cfg.wide) content.classList.add('scene-wide');
        layer.appendChild(content);

        var title = document.createElement('div');
        title.className = 'minigame-title';
        title.textContent = cfg.title ? t(cfg.title, lang) : 'Mini-jeu';
        content.appendChild(title);

        if (cfg.desc) {
            var desc = document.createElement('div');
            desc.className = 'minigame-desc';
            desc.textContent = t(cfg.desc, lang);
            content.appendChild(desc);
        }

        var timeLeft = (typeof cfg.time === 'number') ? cfg.time : 30;
        var maxTime = Math.max(timeLeft, 1);
        var timerId = null;
        var resultAnnounced = false;
        var hintShown = false;
        /* Difficulté adaptative : à 60% du temps écoulé, halo sur les bons éléments */
        function registerHint(fn) { hintFn = fn; }
        var hintFn = null;

        function finish(won) {
            if (resultAnnounced) return;
            resultAnnounced = true;
            if (timerId) clearInterval(timerId);
            if (won) cfg.bonusIndex = (cfg.bonusIndex || 1);
            /* Enregistrer la catégorie de preuve pour le faisceau */
            if (won && cfg.evidence && global.TDScenario) {
                global.TDScenario.recordEvidence(cfg.evidence);
            }
            /* Récompense : panneau d'indice majeur + faisceau de preuves */
            if (won && cfg.clue) {
                var reward = document.createElement('div');
                reward.className = 'clue-reward';
                var rHead = document.createElement('div');
                rHead.className = 'clue-reward-head';
                rHead.textContent = lang === 'fr' ? '\u{1F50E} INDICE MAJEUR' : '\u{1F50E} MAJOR CLUE';
                var rText = document.createElement('div');
                rText.className = 'clue-reward-text';
                rText.textContent = t(cfg.clue, lang);
                reward.appendChild(rHead);
                reward.appendChild(rText);
                /* Faisceau de preuves (barres par catégorie) */
                if (global.TDScenario) {
                    var beam = document.createElement('div');
                    beam.className = 'evidence-beam';
                    var categories = [
                        { key: 'alibi', label: lang === 'fr' ? 'Alibi' : 'Alibi' },
                        { key: 'mobile', label: lang === 'fr' ? 'Mobile' : 'Motive' },
                        { key: 'opportunity', label: lang === 'fr' ? 'Occasion' : 'Opportunity' },
                        { key: 'forensic', label: lang === 'fr' ? 'Forensique' : 'Forensic' },
                        { key: 'witness', label: lang === 'fr' ? 'Témoins' : 'Witnesses' },
                        { key: 'timeline', label: lang === 'fr' ? 'Chronologie' : 'Timeline' },
                    ];
                    var st = global.TDScenario.getState();
                    var score = global.TDScenario.getEvidenceScore();
                    var max = global.TDScenario.getEvidenceMax();
                    var beamTitle = document.createElement('div');
                    beamTitle.className = 'evidence-beam-title';
                    beamTitle.textContent = (lang === 'fr' ? 'FAISCEAUX DE PREUVES' : 'EVIDENCE BEAM') + ', ' + score + '/' + max;
                    beam.appendChild(beamTitle);
                    categories.forEach(function (cat) {
                        var row = document.createElement('div');
                        row.className = 'evidence-row';
                        var label = document.createElement('span');
                        label.className = 'evidence-label';
                        label.textContent = cat.label;
                        var track = document.createElement('div');
                        track.className = 'evidence-track';
                        var fill = document.createElement('div');
                        fill.className = 'evidence-fill';
                        fill.style.width = ((st.evidence[cat.key] || 0) / 3 * 100) + '%';
                        if ((st.evidence[cat.key] || 0) > 0) fill.classList.add('active');
                        track.appendChild(fill);
                        var count = document.createElement('span');
                        count.className = 'evidence-count';
                        count.textContent = (st.evidence[cat.key] || 0) + '/3';
                        row.appendChild(label);
                        row.appendChild(track);
                        row.appendChild(count);
                        beam.appendChild(row);
                    });
                    reward.appendChild(beam);
                }
                content.appendChild(reward);
            }
            var btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            btn.textContent = won
                ? (lang === 'fr' ? 'Consigner l\u2019indice' : 'Record the clue')
                : (lang === 'fr' ? 'Continuer' : 'Continue');
            btn.addEventListener('click', function () {
                layer.classList.remove('active');
                layer.innerHTML = '';
                if (onDone) onDone({ won: won });
            });
            content.appendChild(btn);
        }

        /* Timer avec barre de pression */
        function startTimer() {
            if (!timeLeft || timeLeft <= 0) return;
            var bar = document.createElement('div');
            bar.className = 'minigame-timer';
            bar.innerHTML = '<div class="timer-fill"></div><span class="timer-text"></span>';
            content.appendChild(bar);
            var fill = bar.querySelector('.timer-fill');
            var timerSpan = bar.querySelector('.timer-text');
            timerId = setInterval(function () {
                timeLeft -= 0.1;
                if (timeLeft <= 0) {
                    timeLeft = 0;
                    if (timerId) clearInterval(timerId);
                    fill.style.width = '0%';
                    timerSpan.textContent = '0s';
                    finish(false);
                    return;
                }
                fill.style.width = Math.max(0, (timeLeft / maxTime) * 100) + '%';
                timerSpan.textContent = Math.ceil(timeLeft) + 's';
                if (!hintShown && timeLeft <= maxTime * 0.4 && hintFn) {
                    hintShown = true;
                    try { hintFn(); } catch (e) { /* ignore */ }
                }
            }, 100);
        }

        /* Fabriques de jeux */
        var creators = BUILD_CREATORS(cfg, lang, finish, registerHint);

        var factory = creators[cfg.type];
        var body = document.createElement('div');
        body.className = 'minigame-body';
        content.appendChild(body);
        if (factory) {
            factory(body, registerHint);
        } else {
            finish(true);
        }

        /* Bouton « Passer » (optionnel) */
        if (cfg.type !== 'code_safe') {
            var skip = document.createElement('button');
            skip.className = 'btn btn-skip minigame-skip';
            skip.textContent = lang === 'fr' ? 'Passer' : 'Skip';
            skip.addEventListener('click', function () { finish(false); });
            content.appendChild(skip);
        }

        startTimer();
    }

    /* ------------------------------------------------------------------
       showMontreNoteBox — s'ouvre en bas de l'écran après la résolution
       de la montre. Permet au joueur de noter lui-même l'heure relevéee
       et le code à 4 chiffres. Ces notes seront stockées dans le journal.
    ------------------------------------------------------------------ */
    function showMontreNoteBox(body, lang, codeStr, timeStr, complete, registerHint) {
        var box = document.createElement('div');
        box.className = 'montre-note-box';
        var title = document.createElement('div');
        title.className = 'montre-note-title';
        title.textContent = lang === 'fr'
            ? '\u{1F50D} Vos notes d\'observation'
            : '\u{1F50D} Your observation notes';
        var sub = document.createElement('div');
        sub.className = 'montre-note-sub';
        sub.textContent = lang === 'fr'
            ? 'Notez les indices relevés sur la montre. Ils vous serviront plus tard.'
            : 'Note the clues you found on the watch. They will be useful later.';
        box.appendChild(title);
        box.appendChild(sub);

        function field(label, ph, max) {
            var row = document.createElement('div');
            row.className = 'note-row';
            var lab = document.createElement('label');
            lab.textContent = label;
            var input = document.createElement('input');
            input.type = 'text';
            input.maxLength = max;
            input.placeholder = ph;
            row.appendChild(lab);
            row.appendChild(input);
            box.appendChild(row);
            return input;
        }
        var timeInput = field(
            lang === 'fr' ? 'Heure du crime relevée (ex: 22h09)' : 'Time of death (e.g. 10:09pm)',
            lang === 'fr' ? 'HHhMM' : 'HH:MM',
            8
        );
        var codeInput = field(
            lang === 'fr' ? 'Code à 4 chiffres (dos de la montre)' : '4-digit code (watch back)',
            '0000',
            4
        );
        var save = document.createElement('button');
        save.className = 'btn btn-primary note-save';
        save.textContent = lang === 'fr' ? '\u{1F4D3} Consigner dans le journal' : '\u{1F4D3} Save to notebook';
        save.addEventListener('click', function () {
            var t = timeInput.value.trim();
            var c = codeInput.value.trim();
            var notes = { time: t, code: c };
            if (window.TDNarrativeEngine && typeof window.TDNarrativeEngine.addStep === 'function') {
                window.TDNarrativeEngine.addStep('montre_notes',
                    (lang === 'fr' ? 'Notes montre, heure : ' : 'Watch notes, time : ') + (t || ',') +
                    ' / ' + (lang === 'fr' ? 'code : ' : 'code : ') + (c || ','));
            }
            box.remove();
            if (complete) complete(true, notes);
        });
        var skip = document.createElement('button');
        skip.className = 'btn note-skip';
        skip.textContent = lang === 'fr' ? 'Passer' : 'Skip';
        skip.addEventListener('click', function () {
            box.remove();
            if (complete) complete(true, {});
        });
        var btnRow = document.createElement('div');
        btnRow.className = 'note-btn-row';
        btnRow.appendChild(save);
        btnRow.appendChild(skip);
        box.appendChild(btnRow);
        body.appendChild(box);
    }

    /* ------------------------------------------------------------------
       MONTRE_PHASE2 — cadrans + équerre draggable + question finale
       (utilisé par le mini-jeu 'montre_code')
    ------------------------------------------------------------------ */
    function MONTRE_PHASE2(ctx) {
        var body = ctx.body, lang = ctx.lang, wrap = ctx.wrap, dosWrap = ctx.dosWrap;
        var engraveEls = ctx.engraveEls, answer = ctx.answer;
        var getRevealed = ctx.getRevealed, setRevealed = ctx.setRevealed;
        var timeStr = ctx.timeStr || '22h09';
        var codeStr = answer.join('');
        var ZOOM = 2.2, LOUPE_R = 75;

        /* Cadrans — verrouillés tant que les gravures ne sont pas révélés */
        var symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var pos = answer.map(function () { return 0; });
        var dials = document.createElement('div');
        dials.className = 'dial-row';
        body.appendChild(dials);
        var dialsEls = [];
        answer.forEach(function (_, i) {
            var d = document.createElement('button');
            d.className = 'btn dial locked';
            d.textContent = '—';
            dials.appendChild(d);
            dialsEls.push(d);
            d.addEventListener('click', function () {
                if (getRevealed() < answer.length) return;
                pos[i] = (pos[i] + 1) % symbols.length;
                d.textContent = symbols[pos[i]];
                check();
            });
        });

        var status = wrap.previousSibling;
        function setStatus(txt) { if (status && status.classList && status.classList.contains('mg-status')) status.textContent = txt; }

        /* Loupe grossissante : suit le curseur, magnifie le dos de la montre */
        function moveLoupe(clientX, clientY) {
            var loupe = dosWrap.querySelector('.loupe');
            var inner = dosWrap.querySelector('.loupe-inner');
            if (!loupe || !inner) return;
            var r = dosWrap.getBoundingClientRect();
            var cx = clientX - r.left, cy = clientY - r.top;
            if (cx < 0 || cy < 0 || cx > r.width || cy > r.height) {
                loupe.style.display = 'none';
                return;
            }
            loupe.style.display = 'block';
            loupe.style.left = cx + 'px';
            loupe.style.top = cy + 'px';
            inner.style.width = (r.width * ZOOM) + 'px';
            inner.style.height = (r.height * ZOOM) + 'px';
            inner.style.left = (LOUPE_R - cx * ZOOM) + 'px';
            inner.style.top = (LOUPE_R - cy * ZOOM) + 'px';
            engraveEls.forEach(function (el) {
                if (el.dataset.done) return;
                var er = el.getBoundingClientRect();
                var dx = (er.left + er.width / 2) - clientX;
                var dy = (er.top + er.height / 2) - clientY;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 55) {
                    el.dataset.done = '1';
                    el.classList.add('seen');
                    var idx = engraveEls.indexOf(el);
                    var loupeDigits = dosWrap.querySelectorAll('.engrave-zone-loupe .engrave-digit');
                    if (loupeDigits[idx]) loupeDigits[idx].classList.add('revealed');
                    var n = engraveEls.filter(function (e2) { return e2.dataset.done; }).length;
                    setRevealed(n);
                    setStatus(lang === 'fr'
                        ? ('Gravure déchiffrée (' + n + '/' + answer.length + ')…')
                        : ('Engraving decoded (' + n + '/' + answer.length + ')…'));
                    if (n >= answer.length) unlockDials();
                }
            });
        }
        function unlockDials() {
            dialsEls.forEach(function (d) { d.classList.remove('locked'); });
            setStatus(lang === 'fr'
                ? 'Composez maintenant le numéro gravé sur les cadrans…'
                : 'Now dial the engraved number…');
        }
        wrap.addEventListener('mousemove', function (e) { moveLoupe(e.clientX, e.clientY); });
        wrap.addEventListener('mouseleave', function () {
            var loupe = dosWrap.querySelector('.loupe');
            if (loupe) loupe.style.display = 'none';
        });
        wrap.addEventListener('touchmove', function (e) {
            e.preventDefault();
            moveLoupe(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        wrap.addEventListener('touchstart', function (e) {
            moveLoupe(e.touches[0].clientX, e.touches[0].clientY);
        });

        /* Question finale : le dos a attiré l'attention — mais la face parle */
        var questionBox = null;
        function askSincerity() {
            questionBox = document.createElement('div');
            questionBox.className = 'sincerity-box';
            var q = document.createElement('p');
            q.className = 'sincerity-q';
            q.textContent = lang === 'fr'
                ? '« ' + codeStr + ' », gravé au dos… Mais qu\'avez-vous remarqué SUR LA FACE de la montre ?'
                : '"' + codeStr + '" engraved on the back… But what did you notice on the WATCH FACE?';
            questionBox.appendChild(q);
            var yes = document.createElement('button');
            yes.className = 'btn';
            yes.textContent = lang === 'fr'
                ? 'L\'aiguille figée à ' + timeStr + ' : voilà l\'heure probable du crime — et ' + codeStr + ' ouvrira peut-être un coffre'
                : 'The hand frozen at ' + timeStr + ' : that is the likely time of death, and ' + codeStr + ' may open a safe';
            var no = document.createElement('button');
            no.className = 'btn';
            no.textContent = lang === 'fr'
                ? 'Rien de plus : une montre cassée ne dit rien'
                : 'Nothing else : a broken watch tells nothing';
            yes.addEventListener('click', function () {
                yes.classList.add('correct');
                questionBox.classList.add('solved');
                setStatus(lang === 'fr'
                    ? 'Heure du crime établie : ' + timeStr + ' (à confirmer). Ce détail sera décisif, et ' + codeStr + ' servira.'
                    : 'Time of death established : ' + timeStr + ' (to be confirmed). This detail will matter, and ' + codeStr + ' will serve.');
                if (ctx.onSolved) {
                    ctx.onSolved(codeStr, timeStr);
                } else if (ctx.complete) {
                    ctx.complete(true, { code: codeStr, time: timeStr });
                }
            });
            no.addEventListener('click', function () {
                no.classList.add('wrong');
                setTimeout(function () { no.classList.remove('wrong'); }, 500);
            });
            questionBox.appendChild(yes);
            questionBox.appendChild(no);
            body.appendChild(questionBox);
        }

        function check() {
            for (var i = 0; i < answer.length; i++) {
                if (pos[i] !== answer[i]) return;
            }
            dialsEls.forEach(function (d) { d.classList.add('correct'); });
            if (!questionBox) askSincerity();
        }

        ctx.registerHint(function () {
            engraveEls.forEach(function (el) { if (!el.dataset.done) el.classList.add('hint'); });
            if (getRevealed() >= answer.length) {
                dialsEls.forEach(function (d, i) { if (pos[i] !== answer[i]) d.classList.add('hint'); });
            }
        });
    }

    /* ------------------------------------------------------------------
       BUILD_CREATORS — contient les fabriques de jeux
    ------------------------------------------------------------------ */
    function BUILD_CREATORS(cfg, lang, complete, registerHint) {

    return {
'scene_fouille': function (body) {
            var spots = (cfg.hotspots || []);
            var found = 0;
            var needed = spots.length;

            var wrap = document.createElement('div');
            wrap.className = 'fouille-scene';
            var sceneImageUrl = cfg.sceneImage || 'assets/image true detective/lieux/classic/scene de crime manoir.png';
            wrap.style.backgroundImage = 'url("' + sceneImageUrl + '")';
            body.appendChild(wrap);

            /* Loupe : grossit la scène sous le curseur */
            var loupe = document.createElement('div');
            loupe.className = 'scene-loupe';
            var ZOOM = 2, LR = 95;
            // La loupe doit avoir la même image de fond pour le zoom
            loupe.style.backgroundImage = 'url("' + sceneImageUrl + '")';
            wrap.appendChild(loupe);
            function moveLoupe(clientX, clientY) {
                var r = wrap.getBoundingClientRect();
                var cx = clientX - r.left, cy = clientY - r.top;
                if (cx < 0 || cy < 0 || cx > r.width || cy > r.height) { loupe.style.display = 'none'; return; }
                loupe.style.display = 'block';
                loupe.style.left = cx + 'px';
                loupe.style.top = cy + 'px';
                loupe.style.backgroundSize = (r.width * ZOOM) + 'px ' + (r.height * ZOOM) + 'px';
                loupe.style.backgroundPosition = (LR - cx * ZOOM) + 'px ' + (LR - cy * ZOOM) + 'px';
            }
            wrap.addEventListener('mousemove', function (e) { moveLoupe(e.clientX, e.clientY); });
            wrap.addEventListener('mouseleave', function () { loupe.style.display = 'none'; });
            wrap.addEventListener('touchmove', function (e) {
                e.preventDefault(); moveLoupe(e.touches[0].clientX, e.touches[0].clientY);
            }, { passive: false });
            wrap.addEventListener('touchstart', function (e) { moveLoupe(e.touches[0].clientX, e.touches[0].clientY); });

            /* Fenêtre d'indice de zone */
            var win = null;
            function openZoneWin(h, spot) {
                if (win) win.remove();
                win = document.createElement('div');
                win.className = 'zone-window';
                var head = document.createElement('div');
                head.className = 'zone-window-head';
                head.textContent = (lang === 'fr' ? 'Pièce à conviction ' : 'Evidence ') + h.label;
                var txt = document.createElement('div');
                txt.className = 'zone-window-text';
                txt.textContent = t(h.info, lang);
                var close = document.createElement('button');
                close.className = 'btn zone-window-close';
                close.textContent = lang === 'fr' ? 'Poursuivre l\u2019examen' : 'Keep examining';
                close.addEventListener('click', function () { win.remove(); win = null; });
                win.appendChild(head); win.appendChild(txt); win.appendChild(close);
                body.appendChild(win);
                if (!spot.dataset.done) {
                    spot.dataset.done = '1';
                    spot.classList.add('found');
                    found++;
                }
            }

            spots.forEach(function (h) {
                var spot = document.createElement('button');
                spot.className = 'fouille-zone';
                spot.style.left = h.x + '%';
                spot.style.top = h.y + '%';
                spot.textContent = h.label;
                spot.title = lang === 'fr' ? 'Examiner' : 'Examine';
                // Ouvrir la fenêtre d'indice au survol (avec la loupe)
                spot.addEventListener('mouseenter', function () {
                    openZoneWin(h, spot);
                });
                spot.addEventListener('click', function () {
                    openZoneWin(h, spot);
                    if (!spot.dataset.journaled && global.TDNarrativeEngine && typeof global.TDNarrativeEngine.addClue === 'function') {
                        var clueText = lang === 'fr' ? 'Pièce ' + h.label + ' : ' + t(h.info, lang) : 'Evidence ' + h.label + ' : ' + t(h.info, lang);
                        global.TDNarrativeEngine.addClue(clueText);
                        if (typeof global.TDNarrativeEngine.addStep === 'function') {
                            global.TDNarrativeEngine.addStep('fouille', clueText);
                        }
                        spot.dataset.journaled = '1';
                    }
                    if (found >= needed) complete(true);
                });
                wrap.appendChild(spot);
            });
        },

        'timeline': function (body) {
            var order = (cfg.order || []).map(function (s) { return t(s, lang); });
            var currentIndex = 0;
            var stepsBox = document.createElement('div');
            stepsBox.className = 'timeline-box';
            body.appendChild(stepsBox);
            var shuffled = order.slice().sort(function () { return Math.random() - 0.5; });
            shuffled.forEach(function (label) {
                var b = document.createElement('button');
                b.className = 'btn timeline-step';
                b.textContent = label;
                b.addEventListener('click', function () {
                    if (b.dataset.done) return;
                    if (label === order[currentIndex]) {
                        b.dataset.done = '1';
                        b.classList.add('correct');
                        currentIndex++;
                        if (currentIndex >= order.length) complete(true);
                    } else {
                        b.classList.add('wrong');
                        setTimeout(function () { b.classList.remove('wrong'); }, 400);
                    }
                });
                stepsBox.appendChild(b);
            });
        },

        'adn_match': function (body) {
            var samples = (cfg.samples || []).map(function (s) { return t(s, lang); });
            var profiles = (cfg.profiles || []).map(function (p) { return t(p, lang); });
            var match = cfg.match;
            var pipette = document.createElement('img');
            pipette.className = 'mg-item mg-pipette';
            pipette.src = 'mini-games/prescription/pipette-numerique.png';
            pipette.alt = lang === 'fr' ? 'Pipette numérique du laboratoire' : 'Lab digital pipette';
            body.appendChild(pipette);
            var col = document.createElement('div');
            col.className = 'match-col';
            body.appendChild(col);
            var colA = document.createElement('div');
            colA.className = 'match-side';
            var colB = document.createElement('div');
            colB.className = 'match-side';
            col.appendChild(colA); col.appendChild(colB);
            var selSample = null;
            samples.forEach(function (label, i) {
                var b = document.createElement('button');
                b.className = 'btn match-item sample';
                b.textContent = label;
                b.addEventListener('click', function () {
                    colA.querySelectorAll('.sample').forEach(function (x) { x.classList.remove('selected'); });
                    b.classList.add('selected');
                    selSample = i;
                });
                colA.appendChild(b);
            });
            profiles.forEach(function (label, i) {
                var b = document.createElement('button');
                b.className = 'btn match-item profile';
                b.textContent = label;
                b.addEventListener('click', function () {
                    if (selSample == null) return;
                    if (i === match) {
                        b.classList.add('correct');
                        b.dataset.done = '1';
                        complete(true);
                    } else {
                        b.classList.add('wrong');
                        setTimeout(function () { b.classList.remove('wrong'); }, 400);
                    }
                });
                colB.appendChild(b);
            });
        },

        'code_safe': function (body) {
            var answer = String(cfg.answer || '120');
            var input = '';
            var padBtn = document.createElement('input');
            padBtn.className = 'safe-input';
            padBtn.readOnly = true;
            body.appendChild(padBtn);
            var pad = document.createElement('div');
            pad.className = 'num-pad';
            body.appendChild(pad);
            ['1','2','3','4','5','6','7','8','9'].forEach(function (k) {
                var b = document.createElement('button');
                b.className = 'btn num-key';
                b.textContent = k;
                b.addEventListener('click', function () {
                    if (input.length >= answer.length) return;
                    input += k;
                    padBtn.value = input;
                    if (input.length === answer.length) {
                        if (input === answer) { padBtn.classList.add('correct'); complete(true); }
                        else { padBtn.classList.add('wrong'); setTimeout(function () { padBtn.classList.remove('wrong'); padBtn.value = ''; input = ''; }, 500); }
                    }
                });
                pad.appendChild(b);
            });
            var del = document.createElement('button');
            del.className = 'btn num-key del';
            del.textContent = '?';
            del.addEventListener('click', function () { input = input.slice(0, -1); padBtn.value = input; });
            pad.appendChild(del);
        },
'sabotage': function (body) {
            var parts = (cfg.parts || []).map(function (p) { return t(p, lang); });
            var badIndex = cfg.badIndex || 0;
            var grid = document.createElement('div');
            grid.className = 'parts-grid';
            body.appendChild(grid);
            parts.forEach(function (label, i) {
                var b = document.createElement('button');
                b.className = 'btn part-item';
                b.textContent = label;
                b.addEventListener('click', function () {
                    if (i === badIndex) { b.classList.add('correct'); complete(true); }
                    else { b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 400); }
                });
                grid.appendChild(b);
            });
        },

        'pression': function (body) {
            /* Dossier d'interrogatoire : photo du suspect sous pression (si fournie) */
            if (cfg.asset) {
                var photo = document.createElement('div');
                photo.className = 'mg-scene pression-scene';
                photo.style.backgroundImage = "url('" + cfg.asset + "')";
                body.appendChild(photo);
            }
            var order = (cfg.order || []).map(function (s) { return t(s, lang); });
            var currentIndex = 0;
            var box = document.createElement('div');
            box.className = 'pression-box';
            body.appendChild(box);
            order.slice().sort(function () { return Math.random() - 0.5; }).forEach(function (label) {
                var b = document.createElement('button');
                b.className = 'btn pression-item';
                b.textContent = label;
                b.addEventListener('click', function () {
                    if (b.dataset.done) return;
                    if (label === order[currentIndex]) {
                        b.dataset.done = '1';
                        b.classList.add('correct');
                        currentIndex++;
                        if (currentIndex >= order.length) complete(true);
                    } else {
                        b.classList.add('wrong');
                        setTimeout(function () { b.classList.remove('wrong'); }, 400);
                    }
                });
                box.appendChild(b);
            });
        },

        /* V3 — MINI-JEUX AVEC ASSETS */
        'labo_verrou': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene';
            wrap.style.backgroundImage = 'url(mini-games/laboratoire/labo-interieur.jpg)';
            var verrou = document.createElement('img');
            verrou.className = 'mg-item';
            verrou.src = 'mini-games/laboratoire/verrou-rechaudi.png';
            wrap.appendChild(verrou);
            body.appendChild(wrap);
            var spots = (cfg.hotspots || []);
            var found = 0;
            var hintEls = [];
            spots.forEach(function (h) {
                var spot = document.createElement('button');
                spot.className = 'fouille-spot thermo';
                spot.style.left = h.x + '%';
                spot.style.top = h.y + '%';
                spot.textContent = '?';
                wrap.appendChild(spot);
                if (h.correct) hintEls.push(spot);
                spot.addEventListener('click', function () {
                    if (spot.dataset.done) return;
                    spot.dataset.done = '1';
                    spot.textContent = h.correct ? '??' : '?';
                    spot.classList.add(h.correct ? 'found' : 'wrong');
                    if (h.correct) {
                        found++;
                        if (found >= hintEls.length) complete(true);
                    } else {
                        setTimeout(function () { spot.textContent = '?'; spot.classList.remove('wrong'); spot.dataset.done = ''; }, 500);
                    }
                });
            });
            registerHint(function () { hintEls.forEach(function (el) { el.classList.add('hint'); }); });
        },

        'montre_code': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene mg-montre';
            var face = document.createElement('img');
            face.className = 'mg-item mg-montre-face';
            face.src = 'mini-games/montre/montre-du-duc-face.png';
            face.alt = lang === 'fr' ? 'Face de la montre' : 'Watch face';
            var timeStr = cfg.timeStr || '22h09';
            face.title = lang === 'fr' ? 'La montre figée à ' + timeStr + '…' : 'The watch frozen at ' + timeStr + '…';
            var dosWrap = document.createElement('div');
            dosWrap.className = 'mg-dos-wrap hidden-dos';
            var dos = document.createElement('img');
            dos.className = 'mg-item mg-montre-dos';
            dos.src = 'mini-games/montre/montre-du-duc-dos.png';
            dosWrap.appendChild(dos);
            wrap.appendChild(face);
            wrap.appendChild(dosWrap);

            var status = document.createElement('div');
            status.className = 'mg-status';
            status.textContent = lang === 'fr'
                ? 'Approchez la loupe de la face. Une aiguille s\'y est figée…'
                : 'Bring the magnifier to the face. A needle is frozen there…';
            body.appendChild(status);
            body.appendChild(wrap);

            /* Loupe qui couvre toute la face au début — pour repérer l'aiguille figée.
               Quand on clique sur la face, on révèle le dos, où se trouve la gravure. */
            var faceLoupe = document.createElement('div');
            faceLoupe.className = 'face-loupe';
            body.appendChild(faceLoupe);

            /* Gravures cachées sur le dos de la montre (lisibles à la loupe) */
            var answer = (cfg.code || [1, 9, 8, 1]).slice();
            var engravBox = document.createElement('div');
            engravBox.className = 'engrave-zone';
            var engraveEls = [];
            var revealed = 0;
            var loupe = document.createElement('div');
            loupe.className = 'loupe';
            var loupeInner = document.createElement('div');
            loupeInner.className = 'loupe-inner';
            var loupeImg = document.createElement('img');
            loupeImg.src = dos.src;
            loupeInner.appendChild(loupeImg);
            var loupeZone = document.createElement('div');
            loupeZone.className = 'engrave-zone engrave-zone-loupe';
            answer.forEach(function (_, i) {
                var s = document.createElement('span');
                s.className = 'engrave-digit';
                s.textContent = answer[i];
                engravBox.appendChild(s);
                engraveEls.push(s);
                var s2 = document.createElement('span');
                s2.className = 'engrave-digit';
                s2.textContent = answer[i];
                loupeZone.appendChild(s2);
            });
            loupeInner.appendChild(loupeZone);
            loupe.appendChild(loupeInner);
            dosWrap.appendChild(loupe);

            /* Bouton "Retourner la montre" — permet au joueur de passer du dos — la face */
            var flipBtn = document.createElement('button');
            flipBtn.className = 'btn flip-btn';
            flipBtn.textContent = lang === 'fr' ? '\u{1F504} Retourner la montre' : '\u{1F504} Flip the watch';
            flipBtn.addEventListener('click', function () {
                if (dosWrap.classList.contains('hidden-dos')) {
                    /* On va vers le dos */
                    dosWrap.classList.remove('hidden-dos');
                    face.classList.add('hidden-face');
                    faceLoupe.style.display = 'none';
                    flipBtn.textContent = lang === 'fr' ? '\u{1F50D} Voir la face' : '\u{1F50D} See the face';
                    status.textContent = lang === 'fr'
                        ? 'Passez la loupe sur le dos de la montre : les gravures ne sont lisibles qu\'au grossissement…'
                        : 'Sweep the magnifier over the watch back : the engravings are only readable when magnified…';
                } else {
                    /* On revient à la face */
                    dosWrap.classList.add('hidden-dos');
                    face.classList.remove('hidden-face');
                    faceLoupe.style.display = 'block';
                    flipBtn.textContent = lang === 'fr' ? '\u{1F504} Retourner la montre' : '\u{1F504} Flip the watch';
                    status.textContent = lang === 'fr'
                        ? 'Approchez la loupe de la face. Une aiguille s\'y est figée…'
                        : 'Bring the magnifier to the face. A needle is frozen there…';
                }
            });
            body.appendChild(flipBtn);

            /* Loupe qui magnifie la face pour repérer l'aiguille figéee */
            function moveFaceLoupe(clientX, clientY) {
                var fr = face.getBoundingClientRect();
                var cx = clientX - fr.left, cy = clientY - fr.top;
                if (cx < 0 || cy < 0 || cx > fr.width || cy > fr.height) {
                    faceLoupe.style.display = 'none';
                    return;
                }
                faceLoupe.style.display = 'block';
                faceLoupe.style.left = cx + 'px';
                faceLoupe.style.top = cy + 'px';
            }
            face.addEventListener('mousemove', function (e) { moveFaceLoupe(e.clientX, e.clientY); });
            face.addEventListener('mouseleave', function () { faceLoupe.style.display = 'none'; });

            /* Quand le joueur clique sur la face après avoir bien observé l'aiguille figée,
               on lui pose la question et on ouvre la voie vers le dos */
            var faceClicked = false;
            face.addEventListener('click', function () {
                if (faceClicked) return;
                faceClicked = true;
                status.textContent = lang === 'fr'
                    ? 'L\'aiguille est figée. Notez mentalement l\'heure. Cliquez sur "Retourner la montre" pour examiner le dos.'
                    : 'The hand is frozen. Mentally note the time. Click "Flip the watch" to examine the back.';
            });

            MONTRE_PHASE2({
                body: body, registerHint: registerHint, lang: lang, complete: complete,
                wrap: wrap, dosWrap: dosWrap, engraveEls: engraveEls, answer: answer,
                getRevealed: function () { return revealed; }, setRevealed: function (v) { revealed = v; },
                timeStr: timeStr,
                onSolved: function (codeStr, timeStr) { showMontreNoteBox(body, lang, codeStr, timeStr, complete, registerHint); }
            });
        },

        /* Coffre-fort de l'Acte 2 — le code de la montre récompense le joueur attentif */
        'coffre_code': function (body) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene mg-coffre';
            var img = document.createElement('img');
            img.className = 'mg-item mg-coffre-img';
            img.src = 'mini-games/coffre/coffre-fort.png';
            wrap.appendChild(img);
            body.appendChild(wrap);
            var answer = (cfg.code || [1, 9, 8, 1]).join('');
            var input = '';
            var padBtn = document.createElement('input');
            padBtn.className = 'safe-input';
            padBtn.readOnly = true;
            body.appendChild(padBtn);
            var pad = document.createElement('div');
            pad.className = 'num-pad';
            body.appendChild(pad);
            ['1','2','3','4','5','6','7','8','9'].forEach(function (k) {
                var b = document.createElement('button');
                b.className = 'btn num-key';
                b.textContent = k;
                b.addEventListener('click', function () {
                    if (input.length >= answer.length) return;
                    input += k;
                    padBtn.value = input;
                    if (input.length === answer.length) {
                        if (input === answer) {
                            padBtn.classList.add('correct');
                            /* animation : la porte s'ouvre */
                            img.classList.add('coffre-open');
                            setTimeout(function () { complete(true); }, 700);
                        } else {
                            padBtn.classList.add('wrong');
                            setTimeout(function () { padBtn.classList.remove('wrong'); padBtn.value = ''; input = ''; }, 500);
                        }
                    }
                });
                pad.appendChild(b);
            });
            var del = document.createElement('button');
            del.className = 'btn num-key del';
            del.textContent = '?';
            del.addEventListener('click', function () { input = input.slice(0, -1); padBtn.value = input; });
            pad.appendChild(del);
        },

        'chronos_roue': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene';
            wrap.style.backgroundImage = 'url(mini-games/chronos/mecanisme-closeup.jpg)';
            var roue = document.createElement('img');
            roue.className = 'mg-item';
            roue.src = 'mini-games/chronos/roue-temps.png';
            wrap.appendChild(roue);
            body.appendChild(wrap);
            var gears = (cfg.order || []).map(function (s) { return t(s, lang); });
            var idx = 0;
            var box = document.createElement('div');
            box.className = 'timeline-box';
            body.appendChild(box);
            var shuffled = gears.slice().sort(function () { return Math.random() - 0.5; });
            var gearEls = [];
            shuffled.forEach(function (label) {
                var b = document.createElement('button');
                b.className = 'btn timeline-step';
                b.textContent = label;
                box.appendChild(b);
                gearEls.push(b);
                b.addEventListener('click', function () {
                    if (b.dataset.done) return;
                    if (label === gears[idx]) {
                        b.dataset.done = '1';
                        b.classList.add('correct');
                        idx++;
                        if (idx >= gears.length) complete(true);
                    } else {
                        b.classList.add('wrong');
                        setTimeout(function () { b.classList.remove('wrong'); }, 400);
                    }
                });
            });
            var pince = document.createElement('img');
            pince.className = 'mg-item mg-pince';
            pince.src = 'mini-games/chronos/pince-a-jouet.png';
            pince.title = (lang === 'fr' ? 'Une fibre de soie est accrochée à la pince…' : 'A silk fibre is caught on the tweezers…');
            body.appendChild(pince);
            registerHint(function () {
                gearEls.forEach(function (b) { if (!b.dataset.done && b.textContent === gears[idx]) b.classList.add('hint'); });
            });
        },

        'carnet_dechire': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene carnet-scene';
            wrap.style.backgroundImage = 'url(mini-games/prescription/prescription-eliane.png)';
            body.appendChild(wrap);
            var strips = [
                { fr: 'Versement de 12 000 £ à V.K.', en: 'Payment of £12,000 to V.K.', order: 0 },
                { fr: 'pour services rendus — contrat', en: 'for services rendered — contract', order: 1 },
                { fr: 'le 14 du mois, comme convenu', en: 'on the 14th of the month, as agreed', order: 2 },
                { fr: 'ne pas laisser de traces', en: 'leave no traces', order: 3 }
            ];
            var currentOrder = strips.slice().sort(function () { return Math.random() - 0.5; });
            var stripEls = [];
            var list = document.createElement('div');
            list.className = 'carnet-strips';
            body.appendChild(list);
            currentOrder.forEach(function (s) {
                var el = document.createElement('div');
                el.className = 'carnet-strip';
                el.textContent = t(s, lang);
                el.dataset.origOrder = s.order;
                list.appendChild(el);
                stripEls.push(el);
            });
            /* --- Phase 2 : empreintes digitales sur la page reconstituée --- */
            var fingerprints = [
                { x: 30, y: 55, found: false, label: { fr: 'Empreinte sur la mention V.K.', en: 'Fingerprint on the V.K. mention' } },
                { x: 45, y: 38, found: false, label: { fr: 'Empreinte près du 14 — la date du contrat', en: 'Fingerprint near the 14th — contract date' } },
                { x: 62, y: 68, found: false, label: { fr: 'Empreinte sur le montant — 12 000 £', en: 'Fingerprint on the amount — £12,000' } },
                { x: 75, y: 42, found: false, label: { fr: 'Empreinte sur la signature', en: 'Fingerprint on the signature' } }
            ];
            var fpFound = 0;
            var loupe = document.createElement('div');
            loupe.className = 'carnet-loupe';
            loupe.style.display = 'none';
            wrap.appendChild(loupe);
            var fpEls = [];
            fingerprints.forEach(function (fp, i) {
                var zone = document.createElement('div');
                zone.className = 'carnet-fp-zone';
                zone.style.left = fp.x + '%';
                zone.style.top = fp.y + '%';
                zone.dataset.idx = i;
                wrap.appendChild(zone);
                fpEls.push(zone);
                zone.addEventListener('click', function () {
                    if (fp.found) return;
                    fp.found = true;
                    fpFound++;
                    zone.classList.add('found');
                    var toast = document.createElement('div');
                    toast.className = 'carnet-clue-toast';
                    toast.textContent = (lang === 'fr' ? 'Empreinte relevée (' : 'Fingerprint found (') + fpFound + '/' + fingerprints.length + ') : ' + t(fp.label, lang);
                    body.appendChild(toast);
                    setTimeout(function () { toast.remove(); }, 2500);
                    if (fpFound >= 3) complete(true);
                });
            });
            var carnetMousemoveHandler = function (e) {
                var rect = wrap.getBoundingClientRect();
                var x = ((e.clientX - rect.left) / rect.width) * 100;
                var y = ((e.clientY - rect.top) / rect.height) * 100;
                loupe.style.display = 'block';
                loupe.style.left = x + '%';
                loupe.style.top = y + '%';
            };
            var carnetMouseleaveHandler = function () { loupe.style.display = 'none'; };
            var activateFingerprints = function () {
                list.classList.add('solved');
                wrap.classList.add('loupe-active');
                wrap.addEventListener('mousemove', carnetMousemoveHandler);
                wrap.addEventListener('mouseleave', carnetMouseleaveHandler);
                var hint = document.createElement('div');
                hint.className = 'carnet-hint';
                hint.textContent = lang === 'fr' ? '\u{1F50D} Loupe active — relevez au moins 3 empreintes sur la page.' : '\u{1F50D} Magnifier active — find at least 3 fingerprints on the page.';
                body.appendChild(hint);
            };
            var selectedIdx = -1;
            stripEls.forEach(function (el, i) {
                el.addEventListener('click', function () {
                    if (el.dataset.locked === '1') return;
                    if (selectedIdx === -1) { selectedIdx = i; el.classList.add('selected'); }
                    else {
                        var other = stripEls[selectedIdx];
                        other.classList.remove('selected');
                        var tmp = other.textContent; other.textContent = el.textContent; el.textContent = tmp;
                        var tmpO = other.dataset.origOrder; other.dataset.origOrder = el.dataset.origOrder; el.dataset.origOrder = tmpO;
                        selectedIdx = -1; checkCarnet();
                    }
                });
            });
            function checkCarnet() {
                if (stripEls.every(function (el, i) { return parseInt(el.dataset.origOrder, 10) === i; })) {
                    stripEls.forEach(function (el) { el.dataset.locked = '1'; el.classList.add('locked'); });
                    activateFingerprints();
                }
            }
            registerHint(function () { stripEls.forEach(function (el, i) { if (el.dataset.locked !== '1' && parseInt(el.dataset.origOrder, 10) !== i) el.classList.add('hint'); }); });
        },

        'cryptogramme': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene crypto-scene';
            wrap.style.backgroundImage = 'url(mini-games/puzzle/krane-coded-note.png.png)';
            body.appendChild(wrap);
            var message = { fr: 'HALE ENGAGE KRANE', en: 'HALE HIRES KRANE' };
            var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var shift = 0; while (shift === 0 || shift === 13) shift = Math.floor(Math.random() * 24) + 1;
            var encoded = '', plain = t(message, lang).toUpperCase();
            for (var i = 0; i < plain.length; i++) { var idx = alphabet.indexOf(plain[i]); encoded += idx === -1 ? plain[i] : alphabet[(idx + shift) % 26]; }
            var keyBox = document.createElement('div'); keyBox.className = 'crypto-key';
            keyBox.textContent = (lang === 'fr' ? 'Clé de lecture : +' : 'Cipher key: +') + shift;
            body.appendChild(keyBox);
            var encodedEl = document.createElement('div'); encodedEl.className = 'crypto-encoded'; encodedEl.textContent = encoded;
            body.appendChild(encodedEl);
            var input = document.createElement('input'); input.className = 'crypto-input';
            input.placeholder = lang === 'fr' ? 'Décodez le message…' : 'Decode the message…'; input.maxLength = 30;
            body.appendChild(input);
            var submit = document.createElement('button'); submit.className = 'btn';
            submit.textContent = lang === 'fr' ? 'Vérifier' : 'Check'; body.appendChild(submit);
            submit.addEventListener('click', function () {
                if (input.value.trim().toUpperCase() === plain) complete(true);
                else { input.classList.add('wrong'); setTimeout(function () { input.classList.remove('wrong'); }, 400); }
            });
            registerHint(function () { input.value = plain.substring(0, 3); });
        },

        'cablage_alarme': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene cablage-scene';
            wrap.style.backgroundImage = 'url(mini-games/puzzle/alarm-circuit-blueprint.png.png)';
            body.appendChild(wrap);
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 400 200'); svg.className = 'cablage-svg'; body.appendChild(svg);
            var nodes = [{x:60,y:100},{x:140,y:50},{x:220,y:100},{x:300,y:50},{x:340,y:100}];
            var segments = [{from:0,to:1,correct:0},{from:1,to:2,correct:2},{from:2,to:3,correct:1},{from:3,to:4,correct:0}];
            var state = segments.map(function () { return Math.floor(Math.random() * 3); });
            var segEls = [];
            segments.forEach(function (seg, i) {
                var n1 = nodes[seg.from], n2 = nodes[seg.to];
                var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', n1.x); line.setAttribute('y1', n1.y);
                line.setAttribute('x2', n2.x); line.setAttribute('y2', n2.y);
                line.setAttribute('stroke', '#c9a227'); line.setAttribute('stroke-width', '4');
                line.setAttribute('stroke-dasharray', state[i] === seg.correct ? '0' : '6 4');
                line.style.cursor = 'pointer'; line.dataset.idx = i; svg.appendChild(line); segEls.push(line);
                line.addEventListener('click', function () {
                    state[i] = (state[i] + 1) % 3;
                    line.setAttribute('stroke-dasharray', state[i] === seg.correct ? '0' : '6 4');
                    line.setAttribute('stroke', state[i] === seg.correct ? '#7fd48a' : '#c9a227');
                    checkCablage();
                });
            });
            nodes.forEach(function (n) { var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', '8'); c.setAttribute('fill', '#f0d890'); svg.appendChild(c); });
            function checkCablage() { if (segments.every(function (seg, i) { return state[i] === seg.correct; })) complete(true); }
            registerHint(function () { segEls.forEach(function (line, i) { if (state[i] !== segments[i].correct) line.setAttribute('stroke', '#d8574a'); }); });
        },

        'roue_alibis': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene roue-scene';
            wrap.style.backgroundImage = 'url(mini-games/puzzle/pocket-watch-dial.png.png)';
            body.appendChild(wrap);
            var dial = document.createElement('div'); dial.className = 'roue-dial'; body.appendChild(dial);
            var cursors = [
                { label: lang === 'fr' ? 'Montre (22h09)' : 'Watch (10:09pm)', target: 22.15, color: '#7fd48a' },
                { label: lang === 'fr' ? 'Horloge-mère' : 'Grandfather clock', target: 22.15, color: '#f0d890' },
                { label: lang === 'fr' ? 'Alibi de Hale' : "Hale's alibi", target: 20.0, color: '#d8574a' }
            ];
            var cursorEls = [];
            cursors.forEach(function (c) {
                var row = document.createElement('div'); row.className = 'roue-row';
                var lbl = document.createElement('span'); lbl.className = 'roue-label'; lbl.textContent = c.label; row.appendChild(lbl);
                var track = document.createElement('div'); track.className = 'roue-track';
                var fill = document.createElement('div'); fill.className = 'roue-fill'; fill.style.background = c.color; fill.style.width = '0%';
                track.appendChild(fill); row.appendChild(track);
                var slider = document.createElement('input'); slider.type = 'range'; slider.min = '18'; slider.max = '24'; slider.step = '0.25'; slider.value = '18'; slider.className = 'roue-slider'; row.appendChild(slider);
                var val = document.createElement('span'); val.className = 'roue-val'; val.textContent = '18:00'; row.appendChild(val);
                dial.appendChild(row);
                cursorEls.push({ el: fill, val: val, slider: slider, target: c.target });
                slider.addEventListener('input', function () {
                    var v = parseFloat(slider.value); fill.style.width = ((v - 18) / 6) * 100 + '%';
                    var h = Math.floor(v); var m = Math.round((v - h) * 60);
                    val.textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; checkRoue();
                });
            });
            function checkRoue() { if (cursorEls.every(function (c) { return Math.abs(parseFloat(c.slider.value) - c.target) < 0.3; })) complete(true); }
            registerHint(function () { cursorEls.forEach(function (c) { if (Math.abs(parseFloat(c.slider.value) - c.target) >= 0.3) { c.slider.value = c.target; c.el.style.width = ((c.target - 18) / 6) * 100 + '%'; var h = Math.floor(c.target); var m = Math.round((c.target - h) * 60); c.val.textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; } }); });
        },

        /* Puzzle image : l'image est découpée en tuiles, clic sur deux tuiles pour les échanger */
        'image_puzzle': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene jigsaw-scene';
            body.appendChild(wrap);
            var asset = cfg.asset || 'mini-games/puzzle/alarm-circuit-blueprint.png.png';
            var rows = cfg.rows || 3;
            var cols = cfg.cols || 3;
            var total = rows * cols;
            /* ordre[pos] = index de la pièce affichée à la position pos */
            var order = [];
            for (var i = 0; i < total; i++) order.push(i);
            function isSolved() {
                for (var p = 0; p < total; p++) { if (order[p] !== p) return false; }
                return true;
            }
            do {
                order.sort(function () { return Math.random() - 0.5; });
            } while (isSolved());
            var grid = document.createElement('div');
            grid.className = 'jigsaw-grid';
            grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
            wrap.appendChild(grid);
            var tileEls = [];
            var selected = -1;
            var status = document.createElement('div');
            status.className = 'jigsaw-status';
            status.textContent = lang === 'fr'
                ? 'Cliquez sur une tuile, puis sur une autre pour les échanger.'
                : 'Click a tile, then another one to swap them.';
            body.appendChild(status);
            function render() {
                for (var pos = 0; pos < total; pos++) {
                    var piece = order[pos];
                    var el = tileEls[pos];
                    el.className = 'jigsaw-tile' + (pos === selected ? ' selected' : '');
                    var bx = cols > 1 ? (piece % cols) / (cols - 1) * 100 : 0;
                    var by = rows > 1 ? Math.floor(piece / cols) / (rows - 1) * 100 : 0;
                    el.style.backgroundImage = "url('" + asset + "')";
                    el.style.backgroundSize = (cols * 100) + '% ' + (rows * 100) + '%';
                    el.style.backgroundPosition = bx + '% ' + by + '%';
                }
            }
            for (var pos = 0; pos < total; pos++) {
                (function (p) {
                    var el = document.createElement('div');
                    el.className = 'jigsaw-tile';
                    el.addEventListener('click', function () {
                        if (selected === -1) {
                            selected = p;
                        } else if (selected === p) {
                            selected = -1;
                        } else {
                            var tmp = order[selected];
                            order[selected] = order[p];
                            order[p] = tmp;
                            selected = -1;
                            if (isSolved()) {
                                render();
                                status.textContent = lang === 'fr' ? 'Le schéma est reconstitué !' : 'The blueprint is rebuilt!';
                                setTimeout(function () { complete(true); }, 600);
                                return;
                            }
                        }
                        render();
                    });
                    grid.appendChild(el);
                    tileEls.push(el);
                })(pos);
            }
            render();
            registerHint(function () {
                /* Met en évidence une pièce mal placée */
                for (var p = 0; p < total; p++) {
                    if (order[p] !== p) { tileEls[p].classList.add('hint'); break; }
                }
            });
        },

        'cable_match': function (body, registerHint) {
            var wrap = document.createElement('div');
            wrap.className = 'mg-scene';
            wrap.style.backgroundImage = 'url(mini-games/cable/cable-section.jpg)';
            body.appendChild(wrap);
            var wires = (cfg.wires || []);
            var good = (cfg.good || [0, 1, 2]);
            var grid = document.createElement('div');
            grid.className = 'wire-grid';
            body.appendChild(grid);
            var linked = 0;
            var wireEls = [];
            wires.forEach(function (w, i) {
                var b = document.createElement('button');
                b.className = 'btn wire';
                b.textContent = t(w, lang);
                grid.appendChild(b);
                wireEls.push(b);
                b.addEventListener('click', function () {
                    if (b.dataset.done) return;
                    if (good.indexOf(i) !== -1) {
                        b.dataset.done = '1';
                        b.classList.add('correct');
                        linked++;
                        if (linked >= good.length) showGraffiti();
                    } else {
                        b.classList.add('wrong');
                        setTimeout(function () { b.classList.remove('wrong'); }, 400);
                    }
                });
            });
            var graffitiImg = document.createElement('img');
            graffitiImg.className = 'mg-item';
            graffitiImg.src = 'mini-games/cable/graffiti-1.png';
            graffitiImg.style.display = 'none';
            body.appendChild(graffitiImg);
            var writings = (cfg.writings || []);
            var match = (typeof cfg.match === 'number') ? cfg.match : 0;
            var done = false;
            var sampleEls = [];
            writings.forEach(function (w, i) {
                var b = document.createElement('button');
                b.className = 'btn writing-sample';
                b.style.display = 'none';
                b.textContent = t(w, lang);
                body.appendChild(b);
                sampleEls.push(b);
                b.addEventListener('click', function () {
                    if (done) return;
                    if (i === match) { b.classList.add('correct'); done = true; complete(true); }
                    else { b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 400); }
                });
            });
            function showGraffiti() {
                graffitiImg.style.display = '';
                sampleEls.forEach(function (b) { b.style.display = ''; });
            }
            registerHint(function () {
                if (linked < good.length) {
                    wireEls.forEach(function (b, i) { if (!b.dataset.done && good.indexOf(i) !== -1) b.classList.add('hint'); });
                } else {
                    sampleEls.forEach(function (b, i) { if (i === match) b.classList.add('hint'); });
                }
            });
        },
    };
    } /* fin BUILD_CREATORS */

    global.TDMiniGames = { play: play };

}(typeof globalThis !== 'undefined' ? globalThis : this));