/* =====================================================================
   TRUE DETECTIVE - MONTRE CODE (page standalone)
   ===================================================================== */
(function () {
    'use strict';

    var CODE = [1, 9, 8, 1];
    var TIME = '22h09';
    var revealed = 0;
    var faceClicked = false;
    var solved = false;

    function init() {
        var faceWrap = document.getElementById('face-wrap');
        var dosWrap = document.getElementById('dos-wrap');
        var faceImage = document.getElementById('watch-face');
        var watchDos = document.getElementById('watch-dos');
        var faceLoupe = document.getElementById('face-loupe');
        var dosLoupe = document.getElementById('dos-loupe');
        var loupeInner = document.getElementById('loupe-inner');
        var loupeImg = document.getElementById('loupe-img');
        var engraveBox = document.getElementById('engrave-box');
        var engraveLoupeZone = document.getElementById('engrave-loupe-zone');
        var status = document.getElementById('montre-status');
        var flipBtn = document.getElementById('flip-btn');
        var codeRow = document.getElementById('code-row');
        var timeCell = document.getElementById('time-cell');
        var validateBtn = document.getElementById('validate-btn');
        var continueBtn = document.getElementById('continue-btn');
        var backBtn = document.getElementById('back-to-minigame-btn');
        var saveNotesBtn = document.getElementById('save-notes-btn');
        var notesArea = document.getElementById('montre-notes');
        var engraveCounter = document.getElementById('engrave-counter');
        var sincerityModal = document.getElementById('sincerity-modal');
        var sincerityQuestion = document.getElementById('sincerity-question');
        var sincerityYes = document.getElementById('sincerity-yes');
        var sincerityNo = document.getElementById('sincerity-no');

        var ZOOM = 2.5;
        var LOUPE_R = 90;
        var FACE_ZOOM = 2.2;

        /* Create code cells */
        var codeCells = [];
        CODE.forEach(function (digit, i) {
            var inp = document.createElement('input');
            inp.className = 'code-cell';
            inp.type = 'text';
            inp.inputMode = 'numeric';
            inp.pattern = '[0-9]*';
            inp.maxLength = 1;
            inp.disabled = true;
            inp.setAttribute('autocomplete', 'off');
            inp.addEventListener('input', function () {
                inp.value = inp.value.replace(/[^0-9]/g, '');
                checkCode();
            });
            codeRow.appendChild(inp);
            codeCells.push(inp);
        });

        /* Create engrave digits on watch */
        var engraveEls = [];
        CODE.forEach(function (digit, i) {
            var s = document.createElement('span');
            s.className = 'engrave-digit';
            s.textContent = digit;
            engraveBox.appendChild(s);
            engraveEls.push(s);

            var s2 = document.createElement('span');
            s2.className = 'engrave-digit';
            s2.textContent = digit;
            engraveLoupeZone.appendChild(s2);
        });

        function updateCounter() {
            engraveCounter.textContent = revealed;
        }

        function unlockCodeCells() {
            codeCells.forEach(function (c) { c.disabled = false; });
            timeCell.disabled = false;
            validateBtn.disabled = false;
            status.textContent = 'Les gravures sont déchiffrées. Saisissez le code à 4 chiffres.';
        }

        function checkCode() {
            if (revealed < CODE.length) return;
            var entered = codeCells.map(function (c) { return c.value; }).join('');
            var expected = CODE.join('');
            codeCells.forEach(function (c, i) {
                if (c.value === String(CODE[i])) c.classList.add('correct');
                else c.classList.remove('correct');
            });
            if (entered === expected) {
                status.textContent = 'Code correct. Indiquez l\'heure relevée sur la face, puis validez.';
            }
        }

        function validateAnswer() {
            if (revealed < CODE.length) return;
            var entered = codeCells.map(function (c) { return c.value; }).join('');
            var time = timeCell.value.trim();
            if (entered === CODE.join('')) {
                if (time !== '') {
                    validateBtn.classList.add('correct');
                    showSincerityQuestion(time);
                } else {
                    status.textContent = 'Indiquez aussi l\'heure relevée sur la face de la montre.';
                }
            } else {
                validateBtn.classList.add('wrong');
                setTimeout(function () { validateBtn.classList.remove('wrong'); }, 500);
            }
        }

        function showSincerityQuestion(playerTime) {
            var codeStr = CODE.join('');
            sincerityQuestion.textContent = '"' + codeStr + '", gravé au dos… Mais qu\'avez-vous remarqué SUR LA FACE de la montre ?';
            sincerityYes.textContent = 'L\'aiguille figée à ' + TIME + ' : voilà l\'heure probable du crime, et ' + codeStr + ' ouvrira peut-être un coffre';
            sincerityNo.textContent = 'Rien de plus : une montre cassée ne dit rien';

            sincerityModal.classList.remove('hidden');

            sincerityYes.onclick = function () {
                sincerityYes.classList.add('correct');
                sincerityModal.classList.add('hidden');
                status.textContent = 'Heure du crime établie : ' + TIME + ' (à confirmer). Ce détail sera décisif, et ' + codeStr + ' servira.';
                solved = true;
                saveNotes();
            };

            sincerityNo.onclick = function () {
                sincerityNo.classList.add('wrong');
                setTimeout(function () { sincerityNo.classList.remove('wrong'); }, 500);
            };
        }

        function saveNotes() {
            var notes = notesArea.value.trim();
            if (notes) {
                localStorage.setItem('td_montre_notes', notes);
            }
        }

        /* Face loupe : le verre grossit la face de la montre sous le curseur */
        function moveFaceLoupe(clientX, clientY) {
            var wrapRect = faceWrap.getBoundingClientRect();
            var imgRect = faceImage.getBoundingClientRect();
            var cx = clientX - imgRect.left, cy = clientY - imgRect.top;
            if (cx < 0 || cy < 0 || cx > imgRect.width || cy > imgRect.height) {
                faceLoupe.style.display = 'none';
                return;
            }
            faceLoupe.style.display = 'block';
            var loupeR = faceLoupe.offsetWidth / 2;
            faceLoupe.style.left = (clientX - wrapRect.left - loupeR) + 'px';
            faceLoupe.style.top = (clientY - wrapRect.top - loupeR) + 'px';
            /* Effet zoom : la face agrandie suit le curseur à l'intérieur du cercle */
            if (faceImage && faceImage.src) {
                faceLoupe.style.backgroundImage = 'url("' + faceImage.src + '")';
                // Use natural image dimensions for correct zoom
                var nw = faceImage.naturalWidth || imgRect.width;
                var nh = faceImage.naturalHeight || imgRect.height;
                faceLoupe.style.backgroundSize = (nw * FACE_ZOOM) + 'px ' + (nh * FACE_ZOOM) + 'px';
                faceLoupe.style.backgroundPosition = (loupeR - cx * FACE_ZOOM) + 'px ' + (loupeR - cy * FACE_ZOOM) + 'px';
            }
        }

        faceWrap.addEventListener('mousemove', function (e) { moveFaceLoupe(e.clientX, e.clientY); });
        faceWrap.addEventListener('mouseleave', function () { faceLoupe.style.display = 'none'; });
        faceWrap.addEventListener('touchmove', function (e) {
            e.preventDefault();
            moveFaceLoupe(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        faceWrap.addEventListener('touchstart', function (e) {
            moveFaceLoupe(e.touches[0].clientX, e.touches[0].clientY);
        });

        faceWrap.addEventListener('click', function () {
            if (faceClicked) return;
            faceClicked = true;
            status.textContent = 'L\'aiguille est figée. Notez l\'heure dans la case, puis cliquez sur "Retourner la montre" pour examiner le dos.';
        });

        /* Dos loupe */
        function moveDosLoupe(clientX, clientY) {
            var r = dosWrap.getBoundingClientRect();
            var imgRect = watchDos.getBoundingClientRect();
            var cx = clientX - imgRect.left, cy = clientY - imgRect.top;
            if (cx < 0 || cy < 0 || cx > imgRect.width || cy > imgRect.height) {
                dosLoupe.style.display = 'none';
                return;
            }
            dosLoupe.style.display = 'block';
            dosLoupe.style.left = (clientX - r.left - LOUPE_R) + 'px';
            dosLoupe.style.top = (clientY - r.top - LOUPE_R) + 'px';
            loupeInner.style.width = (imgRect.width * ZOOM) + 'px';
            loupeInner.style.height = (imgRect.height * ZOOM) + 'px';
            loupeInner.style.left = (LOUPE_R - cx * ZOOM) + 'px';
            loupeInner.style.top = (LOUPE_R - cy * ZOOM) + 'px';

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
                    var loupeDigits = engraveLoupeZone.querySelectorAll('.engrave-digit');
                    if (loupeDigits[idx]) loupeDigits[idx].classList.add('revealed');
                    var n = engraveEls.filter(function (e2) { return e2.dataset.done; }).length;
                    revealed = n;
                    updateCounter();
                    status.textContent = 'Gravure déchiffrée (' + n + '/' + CODE.length + ')…';
                    if (n >= CODE.length) {
                        unlockCodeCells();
                        status.textContent = 'Les gravures sont déchiffrées. Saisissez le code à 4 chiffres.';
                    }
                }
            });
        }

        dosWrap.addEventListener('mousemove', function (e) { moveDosLoupe(e.clientX, e.clientY); });
        dosWrap.addEventListener('mouseleave', function () { dosLoupe.style.display = 'none'; });
        dosWrap.addEventListener('touchmove', function (e) {
            e.preventDefault();
            moveDosLoupe(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        dosWrap.addEventListener('touchstart', function (e) {
            moveDosLoupe(e.touches[0].clientX, e.touches[0].clientY);
        });

        /* Flip button */
        flipBtn.addEventListener('click', function () {
            if (dosWrap.classList.contains('hidden-dos')) {
                dosWrap.classList.remove('hidden-dos');
                faceWrap.classList.add('hidden-face');
                faceLoupe.style.display = 'none';
                flipBtn.textContent = '👁️ Voir la face';
                status.textContent = 'Passez la loupe sur le dos de la montre : les gravures ne sont lisibles qu\'au grossissement…';
            } else {
                dosWrap.classList.add('hidden-dos');
                faceWrap.classList.remove('hidden-face');
                faceLoupe.style.display = 'block';
                flipBtn.textContent = '🔄 Retourner la montre';
                status.textContent = 'Approchez la loupe de la face. Une aiguille s\'y est figée…';
            }
        });

        /* Validate button */
        validateBtn.addEventListener('click', validateAnswer);

        /* Continue button */
        continueBtn.disabled = false;
        continueBtn.textContent = 'Continuer l\'enquête';
        continueBtn.addEventListener('click', function () {
            try { localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'montre_code', won: true, ts: Date.now() })); } catch (e) {}
            try {
                var returnRaw = localStorage.getItem('td_standalone_game_return');
                if (returnRaw) {
                    var rp = JSON.parse(returnRaw);
                    if (rp && rp.returnUrl) {
                        window.location.href = rp.returnUrl;
                        return;
                    }
                }
            } catch (e) {}
            var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
            window.location.href = fromStory ? '../true-detective/index.html?standalone=montre_code' : '../true-detective/index.html#minigames';
        });

        /* Back button */
        var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
        if (fromStory) {
            backBtn.style.display = 'none';
        } else {
            backBtn.addEventListener('click', function () {
                window.location.href = '../true-detective/index.html#minigames';
            });
        }

        /* Story continue button */
        var storyContinueBtn = document.getElementById('story-continue-btn');
        if (storyContinueBtn) {
            storyContinueBtn.addEventListener('click', function () {
                try { localStorage.setItem('td_standalone_game_result', JSON.stringify({ type: 'montre_code', won: true, ts: Date.now() })); } catch (e) {}
                try {
                    var returnRaw = localStorage.getItem('td_standalone_game_return');
                    if (returnRaw) {
                        var rp = JSON.parse(returnRaw);
                        if (rp && rp.returnUrl) {
                            window.location.href = rp.returnUrl;
                            return;
                        }
                    }
                } catch (e) {}
                var fromStory = new URLSearchParams(window.location.search).get('story') === '1';
            window.location.href = fromStory ? '../true-detective/index.html?standalone=montre_code' : '../true-detective/index.html#minigames';
            });
        }

        /* Save notes */
        saveNotesBtn.addEventListener('click', function () {
            saveNotes();
            saveNotesBtn.textContent = '✅ Notes sauvegardées';
            setTimeout(function () {
                saveNotesBtn.textContent = '💾 Consigner dans le carnet';
            }, 2000);
        });

        /* Load saved notes */
        var savedNotes = localStorage.getItem('td_montre_notes');
        if (savedNotes) {
            notesArea.value = savedNotes;
        }

        /* Load saved state */
        var savedRevealed = localStorage.getItem('td_montre_revealed');
        if (savedRevealed) {
            try {
                var count = parseInt(savedRevealed, 10);
                if (!isNaN(count) && count > 0) {
                    revealed = Math.min(count, CODE.length);
                    engraveEls.forEach(function (el, i) {
                        if (i < revealed) {
                            el.dataset.done = '1';
                            el.classList.add('seen');
                            var loupeDigits = engraveLoupeZone.querySelectorAll('.engrave-digit');
                            if (loupeDigits[i]) loupeDigits[i].classList.add('revealed');
                        }
                    });
                    updateCounter();
                    if (revealed >= CODE.length) {
                        unlockCodeCells();
                    }
                }
            } catch (e) {
                console.warn('Failed to load saved state:', e);
            }
        }

        /* Save revealed count on change */
        setInterval(function () {
            localStorage.setItem('td_montre_revealed', revealed.toString());
        }, 2000);

        /* Story mode: hide Retour, show Continuer */
        var urlParams = new URLSearchParams(window.location.search);
        var fromStory = urlParams.get('story') === '1';
        if (fromStory) {
            if (backBtn) backBtn.style.display = 'none';
            if (storyContinueBtn) {
                storyContinueBtn.style.display = 'inline-block';
            }
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
