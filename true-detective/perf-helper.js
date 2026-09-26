/* ============================================================
   TDPerf — qualite adaptative pour les mini-jeux canvas
   ------------------------------------------------------------
   Ces jeux utilisent beaucoup d'effets "neon" (shadowBlur) et
   redessinent des calques statiques a chaque image. Sur un mobile
   modeste, shadowBlur est extremement coutard (flou logiciel
   recalcule par primitive) et le redessin inutile sature le CPU.

   Plutot que de deviner l'appareil, on MESURE : la boucle de jeu
   signale le temps ecoule, et si l'appareil ne suit pas au-dela de
   ~22 ms par image (donc sous ~45 fps), les effets couteux sont
   desactives une bonne fois pour toutes (pas de clignotement, on
   ne revient pas en mode couteux).

   Usage :
     <script src="perf-helper.js"></script>
     var LOW = !!(window.TDPerf && window.TDPerf.LOW);
   ============================================================ */
(function (global) {
    'use strict';

    var TARGET_MS = 22;    // au-dela : on considere que l'appareil peine
    var WARMUP = 45;       // images ignorees (compilation, polices, images)
    var NEEDED = 60;       // images lentes consecutives avant de degrader

    var avg = 16.7;        // moyenne glissante du temps par image
    var frames = 0;
    var slow = 0;
    var tripped = false;

    var api = {
        LOW: false,

        /* A appeler une fois par image, avec le delta temps en ms. */
        tick: function (dt) {
            if (tripped) return;
            if (typeof dt !== 'number' || !isFinite(dt) || dt <= 0 || dt > 500) return;

            frames++;
            if (frames < WARMUP) { avg = dt; return; }

            avg = avg * 0.9 + dt * 0.1;
            if (avg > TARGET_MS) {
                slow++;
                if (slow >= NEEDED) {
                    tripped = true;
                    api.LOW = true;
                }
            } else {
                slow = 0;
            }
        },

        /* Valeur moyenne observee (diagnostic). */
        average: function () { return avg; }
    };

    global.TDPerf = api;
})(typeof window !== 'undefined' ? window : this);
