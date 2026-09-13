/* =====================================================================
   TRUE DETECTIVE - FOUILLE DE SCÈNE (page standalone)
   ===================================================================== */
(function () {
    'use strict';

    var HOTSPOTS = [
        { label: 'A', x: 10.2, y: 62.5, info: { fr: 'Une lettre de menace adressée à mon débiteur le plus cher - arrachée en partie, mais le cachet de cire aux armes de Blackwood est reconnaissable.', en: 'A threat letter addressed to my dearest debtor - partly torn, but Blackwood\'s wax crest is recognizable.' } },
        { label: 'B', x: 24.0, y: 67.1, info: { fr: 'L\'encrier intact et la plume sèche depuis des heures : l\'ultime échange de mots eut lieu bien AVANT, à voix basse, autour d\'une table.', en: 'The inkwell untouched and the pen dry for hours : the last exchange of words happened long BEFORE, whispered, around a table.' } },
        { label: '1', x: 30.7, y: 55.4, info: { fr: 'Cachet intact, bureau non forcé : quelqu\'un de confiance a ouvert. Mais les comptes révèlent que ce proche était un débiteur acculé.', en: 'Seal intact, desk unforced : someone trusted opened. But the accounts show this close one was a cornered debtor.' } },
        { label: '2', x: 37.6, y: 56.4, info: { fr: 'La carafe renversée et un verre au bord marqué de la trace d\'une chevalière - le sceau de Rupert Blackwood. Il est venu avant.', en: 'The overturned decanter and a rim glass marked by a signet ring - Rupert Blackwood\'s crest. He came before.' } },
        { label: '3', x: 46.8, y: 56.8, info: { fr: 'Le livre de comptes : la colonne Rupert Blackwood montre une dette énorme, soulignée trois fois, puis une note : à régler avant la fin du mois.', en: 'The ledger : the "Rupert Blackwood" column shows a huge debt, underlined three times, then a note : due before month\'s end.' } },
        { label: '4', x: 65.2, y: 77.2, info: { fr: 'Le fauteuil renversé et une montre de poche au sol : la victime a reçu un visiteur de nuit, à l\'heure où l\'on ne reçoit que les créanciers.', en: 'The overturned chair and a pocket watch on the floor : the victim received a night visitor, at the hour one only receives creditors.' } },
        { label: '5', x: 69.9, y: 82.6, info: { fr: 'La mare de sang face au bureau : frappé par surprise au milieu d\'une ultime conversation d\'argent. Pas de lutte - on a frappé debout.', en: 'The pool of blood facing the desk : struck by surprise in a final money conversation. No struggle - struck standing.' } },
        { label: '6', x: 81.8, y: 84.1, info: { fr: 'Un reçu V.K. plié : une forte somme versée pour services - et au dos, l\'écriture de l\'obligataire : Rupert.', en: 'A folded V.K. receipt : a large sum paid for services - and on the back, the debtor\'s handwriting : Rupert.' } }
    ];

    var foundEvidence = [];
    var isMobile = window.innerWidth <= 768;

    function init() {
        var sceneContainer = document.getElementById('scene-container');
        var sceneImage = document.getElementById('scene-image');
        var loupe = document.getElementById('loupe');
        var hotspotsLayer = document.getElementById('hotspots-layer');
        var evidenceDock = document.getElementById('evidence-dock');
        var evidenceList = document.getElementById('evidence-list');
        var evidenceCounter = document.getElementById('evidence-counter');
        var continueBtn = document.getElementById('continue-btn');
        var backBtn = document.getElementById('back-to-game-btn');
        var clueModal = document.getElementById('clue-modal');
        var clueLabel = document.getElementById('clue-label');
        var clueText = document.getElementById('clue-text');
        var clueCloseBtn = document.getElementById('clue-close-btn');

        var ZOOM = 2.5;
        var LOUPE_R = 90;
        var sceneImageUrl = 'assets/image true detective/lieux/classic/scene de crime manoir.png';

        sceneImage.style.backgroundImage = 'url("' + sceneImageUrl + '")';
        loupe.style.backgroundImage = 'url("' + sceneImageUrl + '")';

        function updateCounter() {
            evidenceCounter.textContent = foundEvidence.length;
            if (foundEvidence.length >= HOTSPOTS.length) {
                continueBtn.disabled = false;
                continueBtn.textContent = 'Continuer l\'enquête';
            }
        }

        function showEvidenceDock(spot) {
            var h = HOTSPOTS.find(function (s) { return s.label === spot.dataset.label; });
            if (!h) return;

            var head = evidenceDock.querySelector('.evidence-dock-head') || createDockHead();
            var text = evidenceDock.querySelector('.evidence-dock-text') || createDockText();

            head.textContent = 'Pièce à conviction ' + h.label;
            text.textContent = h.info.fr || h.info.en || '';

            evidenceDock.classList.add('visible');

            var rect = sceneContainer.getBoundingClientRect();
            var spotX = (parseFloat(spot.style.left) / 100) * rect.width;
            var spotY = (parseFloat(spot.style.top) / 100) * rect.height;
            var dockWidth = 300;
            var dockHeight = 150;

            var left = spotX + 20;
            var top = spotY - dockHeight / 2;

            if (left + dockWidth > rect.width) {
                left = spotX - dockWidth - 20;
            }
            if (top < 0) top = 10;
            if (top + dockHeight > rect.height) top = rect.height - dockHeight - 10;

            evidenceDock.style.left = left + 'px';
            evidenceDock.style.top = top + 'px';
        }

        function createDockHead() {
            var head = document.createElement('div');
            head.className = 'evidence-dock-head';
            evidenceDock.appendChild(head);
            return head;
        }

        function createDockText() {
            var text = document.createElement('div');
            text.className = 'evidence-dock-text';
            evidenceDock.appendChild(text);
            return text;
        }

        function createEvidenceItem(h) {
            var item = document.createElement('div');
            item.className = 'evidence-item';
            item.innerHTML = '<div class="evidence-item-header"><span class="evidence-item-label">' + h.label + '</span></div>' +
                '<div class="evidence-item-text">' + (h.info.fr || h.info.en) + '</div>';
            evidenceList.appendChild(item);
        }

        function showClueModal(h) {
            clueLabel.textContent = h.label;
            clueText.textContent = h.info.fr || h.info.en || '';
            clueModal.classList.remove('hidden');
        }

        function hideClueModal() {
            clueModal.classList.add('hidden');
        }

        function moveLoupe(clientX, clientY) {
            var r = sceneContainer.getBoundingClientRect();
            var cx = clientX - r.left, cy = clientY - r.top;
            if (cx < 0 || cy < 0 || cx > r.width || cy > r.height) {
                loupe.style.display = 'none';
                evidenceDock.classList.remove('visible');
                return;
            }
            loupe.style.display = 'block';
            loupe.style.left = (cx - LOUPE_R) + 'px';
            loupe.style.top = (cy - LOUPE_R) + 'px';
            loupe.style.backgroundSize = (r.width * ZOOM) + 'px ' + (r.height * ZOOM) + 'px';
            loupe.style.backgroundPosition = (-cx * ZOOM + LOUPE_R) + 'px ' + (-cy * ZOOM + LOUPE_R) + 'px';
        }

        var isDragging = false;
        function startDrag(e) {
            isDragging = true;
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var clientY = e.touches ? e.touches[0].clientY : e.clientY;
            moveLoupe(clientX, clientY);
        }
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var clientY = e.touches ? e.touches[0].clientY : e.clientY;
            moveLoupe(clientX, clientY);
        }
        function endDrag() { isDragging = false; }

        sceneContainer.addEventListener('mousemove', function (e) { moveLoupe(e.clientX, e.clientY); });
        sceneContainer.addEventListener('mouseleave', function () {
            loupe.style.display = 'none';
            evidenceDock.classList.remove('visible');
        });
        sceneContainer.addEventListener('touchstart', startDrag, { passive: false });
        sceneContainer.addEventListener('touchmove', drag, { passive: false });
        sceneContainer.addEventListener('touchend', endDrag);
        sceneContainer.addEventListener('touchcancel', endDrag);

        HOTSPOTS.forEach(function (h) {
            var spot = document.createElement('button');
            spot.className = 'fouille-zone';
            spot.style.left = h.x + '%';
            spot.style.top = h.y + '%';
            spot.textContent = h.label;
            spot.dataset.label = h.label;
            spot.dataset.x = h.x;
            spot.dataset.y = h.y;

            spot.addEventListener('mouseenter', function () {
                if (spot.dataset.done) return;
                showEvidenceDock(spot);
            });
            spot.addEventListener('mouseleave', function () {
                evidenceDock.classList.remove('visible');
            });
            spot.addEventListener('click', function () {
                if (spot.dataset.done) return;
                spot.dataset.done = '1';
                spot.classList.add('fouille-zone-found');
                foundEvidence.push(h);
                createEvidenceItem(h);
                updateCounter();
                showClueModal(h);
            });

            hotspotsLayer.appendChild(spot);
        });

        clueCloseBtn.addEventListener('click', function () {
            hideClueModal();
            localStorage.setItem('td_sceneFouille_found', JSON.stringify(foundEvidence.map(function (e) { return e.label; })));
        });

        backBtn.addEventListener('click', function () {
            window.location.href = '../true-detective/index.html';
        });

        continueBtn.addEventListener('click', function () {
            if (foundEvidence.length >= HOTSPOTS.length) {
                window.location.href = '../true-detective/index.html?sceneFouille=complete';
            }
        });

        var saved = localStorage.getItem('td_sceneFouille_found');
        if (saved) {
            try {
                var foundLabels = JSON.parse(saved);
                foundLabels.forEach(function (label) {
                    var h = HOTSPOTS.find(function (s) { return s.label === label; });
                    if (h) {
                        foundEvidence.push(h);
                        createEvidenceItem(h);
                        var spot = hotspotsLayer.querySelector('[data-label="' + label + '"]');
                        if (spot) {
                            spot.dataset.done = '1';
                            spot.classList.add('fouille-zone-found');
                        }
                    }
                });
                updateCounter();
            } catch (e) {
                console.warn('Failed to load saved evidence:', e);
            }
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
