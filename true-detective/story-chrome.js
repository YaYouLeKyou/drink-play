/* =====================================================================
   TRUE DETECTIVE — TDStoryChrome
   Chrome narratif partagé pour les mini-jeux du mode scénario :
   portrait du suspect + décor de la scène + boîte de dialogue automatique.

   Règles (voir PLAN-mix-minijeux.md §0/§2) :
   - Aucun timer narratif : tout part d'un event de jeu (start, coup IA,
     paire trouvée, objet utilisé, palier de score, victory, defeat).
   - Overlay index.html  -> réutilise #minigame-bg-layer / #minigame-npc-image
                            / #minigame-dialogue-text (aucun doublon de DOM).
   - Pages standalone    -> crée sa propre barre + décor plein écran fixe.
   - Thèmes : classic (manoir), cyberpunk (néon), noire (polar filtré).
     JS identique, seuls les assets + le CSS changent.

   API :
     TDStoryChrome.init({ suspectId, decorKey|decorBg, lines, fallback, ... })
     TDStoryChrome.trigger('pair', { value: 3 })   // event de jeu
     TDStoryChrome.trigger('victory')              // puis révélation indice
     TDStoryChrome.say('texte')                    // ligne libre
     TDStoryChrome.setSuspect(id, decorKey, lines, fallback)  // suspect dynamique
   ===================================================================== */
(function (global) {
    'use strict';

    var ASSETS_BASE = 'assets/image true detective/';

    /* ---------- Portraits : famille de thème → fichier (relatif à true-detective/) ---------- */
    var NPC_FILES = {
        classic: {
            'detective-partner': 'characteres/classic/detective-partenaire.png',
            'femme-fatale': 'characteres/classic/femme-fatal.png',
            'seducteur': 'characteres/classic/le-seducteur.png',
            'suspect': 'characteres/classic/Le-suspect.png',
            'marginal': 'characteres/classic/Le-marginal.png',
            'protecteur': 'characteres/classic/Le_Protecteur.png',
            'scientifique': 'characteres/classic/le-scientific.png',
            'criminel': 'characteres/classic/le-criminel.png'
        },
        cyberpunk: {
            'detective-partner': 'characteres/cyberpunk/detective-partenaire.png',
            'femme-fatale': 'characteres/cyberpunk/femme-fatal.png',
            'seducteur': 'characteres/cyberpunk/seducteur.png',
            'suspect': 'characteres/cyberpunk/suspect.png',
            'marginal': 'characteres/cyberpunk/marginal.png',
            'protecteur': 'characteres/cyberpunk/protecteur.png',
            'scientifique': 'characteres/cyberpunk/scientific.png',
            'criminel': 'characteres/cyberpunk/criminel.png'
        },
        noire: {
            'detective-partner': 'characteres/noire/detective partenaire.png',
            'femme-fatale': 'characteres/noire/femme fatal.png',
            'seducteur': 'characteres/noire/seducteur.png',
            'suspect': 'characteres/noire/suspect.png',
            'marginal': 'characteres/noire/marginal.png',
            'protecteur': 'characteres/noire/protecteur.png',
            'scientifique': 'characteres/noire/scientific.png',
            'criminel': 'characteres/noire/criminel.png'
        }
    };

    /* ---------- Décors : clés logiques identiques à app.js (scrDecorImage) ---------- */
    var DECOR_FILES = {
        classic: {
            universe: 'lieux/classic/manoir.png',
            crimeScene: 'lieux/classic/scene de crime manoir.png',
            residence: 'lieux/classic/interieur manoir.png',
            alley: 'lieux/classic/ruelle.png',
            publicPlace: 'lieux/classic/exterieur bar.png',
            barInterieur: 'lieux/classic/interieur bar.png',
            secretPlace: 'lieux/classic/appartement suspect.png',
            laboratory: 'lieux/classic/laboratoire.png',
            headquarters: 'lieux/classic/quartier general.png',
            prison: 'lieux/classic/prison.jfif',
            exile: 'lieux/classic/paradisique.png'
        },
        cyberpunk: {
            universe: 'lieux/cyberpunk/exterieur-manoir.png',
            crimeScene: 'lieux/cyberpunk/scene-de-crime.png',
            residence: 'lieux/cyberpunk/interieur-manoir.png',
            alley: 'lieux/cyberpunk/ruelle.png',
            publicPlace: 'lieux/cyberpunk/exterieur bar.png',
            barInterieur: 'lieux/cyberpunk/interieur-bar.png',
            secretPlace: 'lieux/cyberpunk/appartement suspect.png',
            laboratory: 'lieux/cyberpunk/laboratoire.png',
            headquarters: 'lieux/cyberpunk/interieur-quartier-général.png',
            prison: 'lieux/cyberpunk/prison.png',
            exile: 'lieux/cyberpunk/paradisique.png'
        },
        noire: {
            universe: 'lieux/noire/exterieur manoir.png',
            crimeScene: 'lieux/noire/scene de crime.png',
            residence: 'lieux/noire/exterieur manoir.png',
            alley: 'lieux/noire/ruelle.png',
            publicPlace: 'lieux/noire/exterieur bar.png',
            barInterieur: 'lieux/noire/interieur bar.png',
            secretPlace: 'lieux/noire/appartement suspect.png',
            laboratory: 'lieux/noire/laboratoire.png',
            headquarters: 'lieux/noire/interieur quartier général.png',
            prison: 'lieux/noire/prison.png',
            exile: 'lieux/noire/paradisiaque.png'
        }
    };

    /* ---------- Noms : miroir de THEME_NPC_NAMES (app.js) pour les pages standalone ---------- */
    var NPC_NAMES = {
        classic: {
            'detective-partner': { fr: 'Inspecteur Wexford', en: 'Inspector Wexford' },
            'protecteur': { fr: 'Le Major Hale', en: 'Major Hale' },
            'femme-fatale': { fr: 'Lady Vivienne', en: 'Lady Vivienne' },
            'seducteur': { fr: 'Julian Pembrooke', en: 'Julian Pembrooke' },
            'suspect': { fr: 'Rupert Blackwood', en: 'Rupert Blackwood' },
            'marginal': { fr: 'Silas Crane', en: 'Silas Crane' },
            'scientifique': { fr: 'Dr Whitmore', en: 'Dr Whitmore' },
            'criminel': { fr: 'Victor Krane', en: 'Victor Krane' }
        },
        cyberpunk: {
            'detective-partner': { fr: 'Inspecteur Vega', en: 'Inspector Vega' },
            'protecteur': { fr: 'Cipher-7', en: 'Cipher-7' },
            'femme-fatale': { fr: 'Lyra Noir', en: 'Lyra Noir' },
            'seducteur': { fr: 'Dex Rook', en: 'Dex Rook' },
            'suspect': { fr: 'Ledger-9', en: 'Ledger-9' },
            'marginal': { fr: 'Ghost', en: 'Ghost' },
            'scientifique': { fr: 'Dr. Synapse', en: 'Dr. Synapse' },
            'criminel': { fr: 'Razor', en: 'Razor' }
        },
        noire: {
            'detective-partner': { fr: 'Détective Reeves', en: 'Detective Reeves' },
            'protecteur': { fr: 'Mike Malone', en: 'Mike Malone' },
            'femme-fatale': { fr: 'Vivian Noir', en: 'Vivian Noir' },
            'seducteur': { fr: 'Johnny Lorraine', en: 'Johnny Lorraine' },
            'suspect': { fr: 'Vincent Crowe', en: 'Vincent Crowe' },
            'marginal': { fr: 'Eddie', en: 'Eddie' },
            'scientifique': { fr: 'Dr. Coroner', en: 'Dr. Coroner' },
            'criminel': { fr: 'Louie the Blade', en: 'Louie the Blade' }
        }
    };

    var NPC_ROLES = {
        classic: {
            'detective-partner': { fr: 'Inspecteur', en: 'Inspector' },
            'protecteur': { fr: 'Militaire', en: 'Military man' },
            'femme-fatale': { fr: 'Veuve du domaine', en: 'Widow of the estate' },
            'seducteur': { fr: 'Notaire', en: 'Notary' },
            'suspect': { fr: 'Héritier', en: 'Heir' },
            'marginal': { fr: 'Chiffonnier', en: 'Ragpicker' },
            'scientifique': { fr: 'Médecin légiste', en: 'Coroner' },
            'criminel': { fr: 'Homme de main', en: 'Hired hand' }
        },
        cyberpunk: {
            'detective-partner': { fr: 'Inspecteur augmenté', en: 'Augmented inspector' },
            'protecteur': { fr: 'Sentinelle', en: 'Sentry' },
            'femme-fatale': { fr: 'Netrunner', en: 'Netrunner' },
            'seducteur': { fr: 'Fixer', en: 'Fixer' },
            'suspect': { fr: 'Archive vivante', en: 'Living archive' },
            'marginal': { fr: 'Fantôme', en: 'Ghost' },
            'scientifique': { fr: 'Bio-chimiste', en: 'Bio-chemist' },
            'criminel': { fr: 'Mercenaire', en: 'Mercenary' }
        },
        noire: {
            'detective-partner': { fr: 'Flic', en: 'Cop' },
            'protecteur': { fr: 'Vétéran', en: 'Veteran' },
            'femme-fatale': { fr: 'Femme fatale', en: 'Femme fatale' },
            'seducteur': { fr: 'Arnaqueur', en: 'Con man' },
            'suspect': { fr: 'Suspect', en: 'Suspect' },
            'marginal': { fr: 'Clochard', en: 'Bum' },
            'scientifique': { fr: 'Médecin légiste', en: 'Coroner' },
            'criminel': { fr: 'Tueur à gages', en: 'Hitman' }
        }
    };

    /* ---------- Thème → famille d'assets / classe CSS ---------- */
    var THEME_FAMILY = {
        'agatha-christie': 'classic',
        'classic': 'classic',
        'cyberpunk': 'cyberpunk',
        'film-noir': 'noire',
        'noire': 'noire'
    };
    var FAMILY_THEME_CLASS = {
        classic: 'theme-classic',
        cyberpunk: 'theme-cyberpunk',
        noire: 'theme-noire'
    };

    /* ---------- Aliases de décors : noms "thématiques" du plan → décor réel ---------- */
    var DECOR_ALIASES = {
        'laboratory-classic': 'laboratory',
        'laboratory-noire': 'laboratory',
        'laboratory-cyberpunk': 'laboratory',
        'alley-cyberpunk': 'alley',
        'bar-cyberpunk': 'barInterieur',
        'casino-cyberpunk': 'barInterieur',
        'casino': 'barInterieur',
        'dock-cyberpunk': 'alley',
        'dock': 'alley',
        'headquarters-cyberpunk': 'headquarters',
        'stand-tir-néon': 'publicPlace',
        'stand-tir-cyberpunk': 'publicPlace',
        'stand-tir': 'publicPlace',
        'boudoir': 'residence',
        'bureau': 'residence',
        'bureau-notaire': 'residence',
        'parloir': 'headquarters',
        'bureau-cyberpunk': 'residence'
    };

    /* ---------- Suspect / décor par défaut quand la page ne reçoit pas ?interroId= ---------- */
    var GAME_DEFAULT_SUSPECT = {
        'chemistry': 'scientifique',
        'shooting': 'protecteur',
        'chess': 'femme-fatale',
        'connect4': 'suspect',
        'memory': 'criminel',
        'jackpot': 'seducteur',
        'marginal-tower': 'marginal',
        'pong': 'femme-fatale',
        'pacman': 'marginal',
        'breakout': 'seducteur',
        'space-invaders': 'protecteur',
        'asteroids': 'criminel',
        'missile-command': 'protecteur',
        'scene_fouille': 'detective-partner'
    };

    var GAME_DEFAULT_DECOR = {
        'chemistry': 'laboratory',
        'shooting': 'publicPlace',
        'chess': 'residence',
        'connect4': 'residence',
        'memory': 'residence',
        'jackpot': 'barInterieur',
        'marginal-tower': 'alley',
        'pong': 'alley',
        'pacman': 'alley',
        'breakout': 'barInterieur',
        'space-invaders': 'headquarters',
        'asteroids': 'alley',
        'missile-command': 'publicPlace',
        'bataille-navale': 'headquarters',
        'scene_fouille': 'crimeScene'
    };

    /* Répliques par défaut : les pages standalone chargent parfois le chrome
       avant que la configuration d'interrogatoire ne soit disponible.
       Elles restent événementielles et ne dépendent d'aucun timer. */
    var GAME_DEFAULT_LINES = {
        pong: {
            start: { fr: 'Lady Vivienne : « Une raquette, une balle, et vous. Aucun refuge ici, inspecteur : c\'est vous ou moi. »', en: 'Lady Vivienne: "One paddle, one ball, and you. No hiding place here, inspector: it is you or me."' },
            score: { fr: 'Lady Vivienne : « Chaque point vous rapproche de la vérité… et de ma patience. »', en: 'Lady Vivienne: "Every point brings you closer to the truth... and to the end of my patience."' },
            victory: { fr: 'Lady Vivienne : « Vous avez gagné le duel, inspecteur. Mais pas encore la vérité. »', en: 'Lady Vivienne: "You won the duel, inspector. Not yet the truth."' }
        },
        'marginal-tower': {
            start: { fr: 'Silas Crane : « Une pièce, un étage. Montez, et vous écoutez. »', en: 'Silas Crane: "One coin, one floor. Climb, and you listen."' },
            object: { fr: 'Silas Crane : « Encore un objet. La tour se souvient de tout. »', en: 'Silas Crane: "One more object. The tower remembers everything."' },
            victory: { fr: 'Silas Crane : « Vous avez tenu la tour. La ruelle vous pertenece enfin. »', en: 'Silas Crane: "You held the tower. The alley is finally yours."' }
        },
        pacman: {
            start: { fr: 'Silas Crane : « Ce labyrinthe, c\'est la ruelle après minuit. Avancez, et vous tournerez en rond comme tout le monde. »', en: 'Silas Crane: "This maze is the alley after midnight. Move, and you will go in circles like everyone else."' },
            score: { fr: 'Silas Crane : « Les fantômes se moquent de vous. Tenez encore un peu... je veille. »', en: 'Silas Crane: "The ghosts laugh at you. Hold on a little longer... I am watching."' },
            victory: { fr: 'Silas Crane : « Vous avez nettoyé le labyrinthe. La ruelle vous devait bien ça. »', en: 'Silas Crane: "You cleared the maze. The alley owed you that much."' },
            defeat: { fr: 'Silas Crane : « Perdu dans les couloirs ? Revenez : la ruelle n\'a pas disparu. »', en: 'Silas Crane: "Lost in the corridors? Come back: the alley has not disappeared."' }
        },
        shooting: {
            start: { fr: 'Major Hale : « Les cibles ne mentent jamais. Touchez-en vingt sans vous tromper, inspecteur. »', en: 'Major Hale: "Targets never lie. Hit twenty without a mistake, inspector."' },
            score: { fr: 'Major Hale : « Encore quelques touches. Ne laissez pas Vivienne vous attirer. »', en: 'Major Hale: "A few more hits. Do not let Vivienne distract you."' },
            victory: { fr: 'Major Hale : « Vingt touches au stand… Vous êtes plus rapide que moi. »', en: 'Major Hale: "Twenty hits at the range... You are faster than I am."' },
            defeat: { fr: 'Major Hale : « Trop de bruit. Recommencez et montrez-moi votre précision. »', en: 'Major Hale: "Too much noise. Try again and show me your precision."' }
        },
        connect4: {
            start: { fr: 'Rupert Blackwood : « Alignez quatre pièces si vous voulez ouvrir mes registres. »', en: 'Rupert Blackwood: "Align four pieces if you want my ledgers opened."' },
            aiMove: { fr: 'Rupert Blackwood : « Vous croyez avoir trouvé une ligne ? J’en ai trouvé une autre. »', en: 'Rupert Blackwood: "You think you found a line? I found another."' },
            victory: { fr: 'Rupert Blackwood : « Bien joué. Les versements de Hale apparaissent enfin dans mes registres. »', en: 'Rupert Blackwood: "Well played. Hale’s payments finally appear in my ledgers."' }
        },
        chess: {
            start: { fr: 'Lady Vivienne : « Vous croyez me battre aux échecs ? Commencez par vous maîtriser. »', en: 'Lady Vivienne: "You think you can beat me at chess? Master yourself first."' },
            aiMove: { fr: 'Lady Vivienne : « Un coup. Pas une hésitation. Vous voyez la différence ? »', en: 'Lady Vivienne: "One move. No hesitation. Do you see the difference?"' },
            victory: { fr: 'Lady Vivienne : « Votre stratégie est meilleure… mais vous ne connaissez pas encore ma version des faits. »', en: 'Lady Vivienne: "Your strategy is better... but you still do not know my version of events."' }
        },
        memory: {
            start: { fr: 'Victor Krane : « Retenez chaque visage, inspecteur. Un homme de main qui oublie est un homme de main qui pourrit. »', en: 'Victor Krane: "Remember every face, inspector. A hired hand who forgets is a hired hand who rots."' },
            pair: { fr: 'Victor Krane : « Une paire de plus… Vous notez les visages, ou les dettes ? »', en: 'Victor Krane: "One more pair... Are you noting the faces, or the debts?"' },
            victory: { fr: 'Victor Krane : « Vous avez tout retrouvé. La dernière carte, c\'était l\'alibi, non ? »', en: 'Victor Krane: "You found them all. That last card was the alibi, wasn\'t it?"' },
            defeat: { fr: 'Victor Krane : « La mémoire vous a lâché. Revenez quand vous saurez compter vos vies. »', en: 'Victor Krane: "Your memory failed you. Come back when you can count your lives."' }
        },
        jackpot: {
            start: { fr: 'Julian Pembrooke : « Faites tourner la machine. La chance a parfois des noms. »', en: 'Julian Pembrooke: "Spin the machine. Fortune sometimes has a name."' },
            spin: { fr: 'Julian Pembrooke : « Encore un tour. Je sais où sont cachés les paiements. »', en: 'Julian Pembrooke: "One more spin. I know where the payments are hidden."' },
            victory: { fr: 'Julian Pembrooke : « Vous avez gagné… et avec moi, les paiements de Hale. »', en: 'Julian Pembrooke: "You won... and with me, Hale’s payments."' }
        },
        physics: {
            start: { fr: 'Gardez vos réflexes. La vérité ne se laisse pas attraper facilement. »', en: 'Keep your reflexes. Truth is not easily caught.' }
        },
        chemistry: {
            start: { fr: 'Dr Whitmore : « Chaque réactif a sa couleur. Ne les confondez pas. »', en: 'Dr Whitmore: "Every reagent has its colour. Do not confuse them."' },
            victory: { fr: 'Dr Whitmore : « Spectre isolé. C’est bien ce poison. »', en: 'Dr Whitmore: "Spectrum isolated. It is indeed that poison."' }
        },
        asteroids: {
            start: { fr: 'Victor Krane : « Vous traquez des débris… ou des preuves ? »', en: 'Victor Krane: "Are you hunting debris... or evidence?"' },
            kills: { fr: 'Victor Krane : « Chaque débris détruit réduit le silence. »', en: 'Victor Krane: "Every destroyed debris breaks the silence."' },
            victory: { fr: 'Victor Krane : « Vous avez nettoyé l’orbite. Je reste la seule variable. »', en: 'Victor Krane: "You cleaned the orbit. I remain the only variable."' }
        },
        'bataille-navale': {
            start: { fr: 'Capitaine Blackwood : « Tracez votre route… je connais déjà la mienne. »', en: 'Captain Blackwood: "Plot your course... I already know mine."' },
            hit: { fr: 'Blackwood : « Un toucher. Votre obstination commence à laisser des traces. »', en: 'Blackwood: "A hit. Your persistence is beginning to leave marks."' },
            enemyTurn: { fr: 'Blackwood : « À votre tour… si les vagues vous laissent le temps. »', en: 'Blackwood: "Your turn... if the waves leave you enough time."' },
            victory: { fr: 'Blackwood : « Vous avez coulé ma flotte, mais la vérité reste sous l’eau. »', en: 'Blackwood: "You sank my fleet, but the truth remains under the water."' },
            defeat: { fr: 'Blackwood : « Les eaux vous ont conservé… pour une prochaine tentative. »', en: "Blackwood: \"The waters kept you... for another attempt.\"" }
        }
    };

    /* Répliques par défaut des jeux qui n'en avaient aucune (breakout,
       missile-command, space-invaders) : sans elles la talkbox restait vide.
       Le nom du locuteur est résolu à l'init via le suspect courant, donc ces
       répliques restent cohérentes dans les trois thèmes. */
    var GAME_DEFAULT_SPEECH = {
        breakout: {
            start: { fr: 'Détruisez ce que je vous montre, inspecteur. Le reste est du secret.', en: 'Break what I show you, inspector. The rest is classified.' },
            score: { fr: 'Encore des briques. Vous croyez vraiment que je tremble ?', en: 'More bricks. You really think I am shaking?' },
            victory: { fr: 'Vous avez tout fait sauter. Il ne reste qu’une chose à faire : parler.', en: 'You blew it all up. One thing left to do: talk.' },
            defeat: { fr: 'Ratée. Revenez avec de la précision, pas de la chance.', en: 'Miss. Come back with precision, not luck.' }
        },
        'missile-command': {
            start: { fr: 'Vos missiles ne mentent jamais. Les miens, si. Interceptez-les.', en: 'Your missiles never lie. Mine do. Intercept them.' },
            score: { fr: 'Chaque interception me rapproche de la sortie. Vous le savez.', en: 'Every interception brings me closer to the exit. You know that.' },
            victory: { fr: 'Vous avez tenu la ligne. Dommage que je connaisse la prochaine attaque.', en: 'You held the line. Shame I know the next attack.' },
            defeat: { fr: 'La ligne a cédé. Vous préférez que je parle, ou que je tire ?', en: 'The line broke. Would you rather I talk, or fire?' }
        },
        'space-invaders': {
            start: { fr: 'Ils arrivent par vagues. Moi, je reste. Choisissez votre ordre d’attaque.', en: 'They come in waves. I stay. Choose your attack order.' },
            score: { fr: 'Vous en abattez plus que mes scripts ne le prévoient.', en: 'You are downing more than my scripts predicted.' },
            victory: { fr: 'Espace dégagé. Il ne reste que nous deux et le registre.', en: 'Clear space. Only the two of us and the ledger remain.' },
            defeat: { fr: 'Vos vies sont parties. Les miennes sont dans les données.', en: 'Your lives are gone. Mine are in the data.' }
        }
    };

    /* Préfixe les répliques par le nom du suspect courant. */
    function withSpeaker(text, lang) {
        if (!text) return text;
        var name = npcName(state.suspectId, lang);
        if (!name) return text;
        return lang === 'en' ? (name + ': "' + text + '"') : (name + ' : « ' + text + ' »');
    }

    /* Retrait du nom d'auteur codé en dur dans une réplique par défaut
       (« Lady Vivienne : "..." » -> "..."), avant réattribution au suspect
       courant. Les guillemets de citation sont retirés eux aussi : withSpeaker()
       les repose avec le bon nom. */
    function stripSpeaker(text) {
        if (!text) return text;
        var m = String(text).match(/^\s*[^:«"]{1,40}:\s*[«"]?\s*([\s\S]*?)\s*[»"]?\s*$/);
        if (!m) return text;
        return m[1].replace(/[«»"]/g, '').trim();
    }

    /* Variantes thémées : mêmes répliques, nom du suspect résolu au moment de
       l'init (évite qu'un jeu cyberpunk annonce « Lady Vivienne »). */
    var GAME_DEFAULT_LINES_THEMED = {
        pong: true, pacman: true, asteroids: true, connect4: true, chess: true,
        memory: true, jackpot: true, chemistry: true, 'marginal-tower': true,
        shooting: true, 'bataille-navale': true,
        breakout: true, 'missile-command': true, 'space-invaders': true
    };


    /* ===================== ÉTAT ===================== */
    var state = {
        active: false,
        mode: null,            // 'overlay' | 'standalone'
        dom: {},
        themeId: 'agatha-christie',
        family: 'classic',
        lang: 'fr',
        gameType: '',
        suspectId: null,
        decorKey: null,
        suspectExplicit: false,
        decorExplicit: false,
        lines: [],
        fallback: [],
        fallbackIdx: 0,
        fired: {},
        current: '',
        hooks: {}
    };

    /* ===================== HELPERS ===================== */
    function getParams() {
        try {
            return new URLSearchParams(window.location.search);
        } catch (e) {
            return new URLSearchParams('');
        }
    }

    function readJsonStorage(key) {
        try {
            var raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    /* Normalise une valeur multilingue {fr, en} ou un texte simple. */
    function tx(value, lang) {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return String(value);
        var l = lang || state.lang;
        return value[l] || value.fr || value.en || '';
    }

    function isPathLike(key) {
        return typeof key === 'string' && (/[\/\\]/.test(key) || /\.(png|jpe?g|jfif|webp|gif|svg)$/i.test(key));
    }

    function familyOf(themeId) {
        return THEME_FAMILY[themeId] || 'classic';
    }

    function assetUrl(rel) {
        if (!rel) return '';
        if (/^(https?:)?\/\//.test(rel) || rel.charAt(0) === '/') return rel;
        return ASSETS_BASE + rel;
    }

    /* ===================== RÉSOLUTION THÈME / LANGUE / SUSPECT ===================== */
    function resolveThemeId(opts, params, cfg) {
        var themeId = opts.themeId || opts.theme || params.get('theme') || (cfg && cfg.theme) || null;
        if (!themeId && typeof global.getThemeId === 'function') {
            try { themeId = global.getThemeId(); } catch (e) { /* ignore */ }
        }
        return themeId || 'agatha-christie';
    }

    function resolveLang(opts, params, cfg) {
        var lang = opts.lang || params.get('lang') || (cfg && cfg.lang) || null;
        if (lang !== 'fr' && lang !== 'en') {
            try {
                var saved = localStorage.getItem('td_lang') || localStorage.getItem('dp_lang');
                if (saved === 'fr' || saved === 'en') lang = saved;
            } catch (e) { /* ignore */ }
        }
        return (lang === 'en') ? 'en' : 'fr';
    }

    /* Type de jeu : ?game= d'abord, puis nom de la page (les redirects
       standalone n'en passent pas : memory.html, marginal-tower.html...). */
    function resolveGameType(opts, params) {
        if (opts.gameType) return opts.gameType;
        var fromUrl = params.get('game');
        if (fromUrl) return fromUrl;
        var path = (global.location && global.location.pathname) || '';
        var file = path.split('/').pop() || '';
        if (file === 'standalone-game.html') return '';
        if (/\.html?$/i.test(file)) return file.replace(/\.html?$/i, '');
        return '';
    }

    function isStoryContext(opts, params, cfg) {
        if (opts.story === true || opts.storyMode === true) return true;
        if (params.get('story') === '1' || params.get('mode') === 'story') return true;
        if (cfg && (cfg.story === true || cfg.storyMode === true)) return true;
        return false;
    }

    function resolveSuspectId(opts, params, cfg, story) {
        if (opts.suspectId) { state.suspectExplicit = true; return opts.suspectId; }
        var fromUrl = params.get('interroId') || params.get('npc');
        if (fromUrl && fromUrl !== 'page' && fromUrl !== 'dynamic') { state.suspectExplicit = true; return fromUrl; }
        if (cfg && cfg.interroId && cfg.interroId !== 'page' && cfg.interroId !== 'dynamic') {
            state.suspectExplicit = true;
            return cfg.interroId;
        }
        state.suspectExplicit = false;
        if (story) return GAME_DEFAULT_SUSPECT[state.gameType] || null;
        return null;
    }

    function resolveDecorKey(opts, params, cfg) {
        var key = opts.decorKey || opts.decorBg || params.get('decor') || (cfg && cfg.decor) || null;
        if (key === 'dynamic') key = null;
        if (key) {
            state.decorExplicit = true;
            return key;
        }
        state.decorExplicit = false;
        return GAME_DEFAULT_DECOR[state.gameType] || 'residence';
    }

    /* Un décor peut être : une clé logique ('alley'), un alias ('stand-tir-néon'),
       ou un chemin/une URL complet. On renvoie toujours une URL exploitable. */
    function resolveDecor(key, themeId) {
        var map = DECOR_FILES[familyOf(themeId || state.themeId)] || DECOR_FILES.classic;
        if (!key) return assetUrl(map.universe);
        if (isPathLike(key)) return key;
        var norm = String(key).toLowerCase().replace(/[_\s]+/g, '-').replace(/-+$/, '');
        var candidates = [norm];
        var stripped = norm.replace(/-(classic|noire|neon|néon|holo|cyberpunk|arcade)$/, '');
        if (stripped !== norm) candidates.push(stripped);
        var i, j, k;
        for (i = 0; i < candidates.length; i++) {
            var alias = DECOR_ALIASES[candidates[i]];
            if (alias && candidates.indexOf(alias) === -1) candidates.push(alias);
        }
        var keys = Object.keys(map);
        for (j = 0; j < candidates.length; j++) {
            if (map[candidates[j]]) return assetUrl(map[candidates[j]]);
            for (k = 0; k < keys.length; k++) {
                if (keys[k].toLowerCase() === candidates[j]) return assetUrl(map[keys[k]]);
            }
        }
        return assetUrl(map.universe);
    }

    function resolvePortrait(suspectId, themeId) {
        if (!suspectId) return '';
        var map = NPC_FILES[familyOf(themeId || state.themeId)] || NPC_FILES.classic;
        var file = map[suspectId] || NPC_FILES.classic[suspectId];
        return file ? assetUrl(file) : '';
    }

    /* Nom : on suit scrNpcName() d'app.js SEULEMENT si le thème actif de l'app
       appartient à la même famille de thèmes que celle du chrome. Sinon on
       utiliserait l'appareil du thème cyberpunk pour un portrait noire. */
    function appFamilyMatches() {
        if (typeof global.getThemeId !== 'function') return true;
        try {
            var appTheme = global.getThemeId();
            if (!appTheme) return true;
            return familyOf(appTheme) === state.family;
        } catch (e) {
            return true;
        }
    }

    function npcName(suspectId, lang) {
        if (!suspectId) return '';
        if (typeof global.scrNpcName === 'function' && appFamilyMatches()) {
            try {
                var themed = global.scrNpcName(suspectId);
                if (themed) return themed;
            } catch (e) { /* ignore */ }
        }
        var byFamily = NPC_NAMES[familyOf(state.themeId)] || NPC_NAMES.classic;
        var entry = byFamily[suspectId] || NPC_NAMES.classic[suspectId];
        return entry ? tx(entry, lang || state.lang) : suspectId;
    }

    function npcRole(suspectId, lang) {
        if (!suspectId) return '';
        var byFamily = NPC_ROLES[familyOf(state.themeId)] || NPC_ROLES.classic;
        var entry = byFamily[suspectId] || NPC_ROLES.classic[suspectId];
        return entry ? tx(entry, lang || state.lang) : '';
    }

    /* ===================== LIGNES / EVENTS ===================== */
    function normalizeLines(raw) {
        var out = [];
        if (!raw) return out;
        if (!Array.isArray(raw) && typeof raw === 'object') {
            // { start: [...], victory: 'texte', pair: [{ at: 1, text: {...} }] }
            Object.keys(raw).forEach(function (key) {
                var val = raw[key];
                if (Array.isArray(val)) {
                    val.forEach(function (item) {
                        if (typeof item === 'string') out.push({ on: key, at: null, text: item });
                        else if (item) out.push({ on: item.on || key, at: (item.at === undefined ? null : item.at), text: item.text });
                    });
                } else if (val) {
                    out.push({ on: key, at: null, text: val });
                }
            });
            return out;
        }
        raw.forEach(function (item) {
            if (!item) return;
            if (typeof item === 'string') out.push({ on: 'start', at: null, text: item });
            else out.push({ on: item.on || 'start', at: (item.at === undefined ? null : item.at), text: item.text });
        });
        return out;
    }

    function normalizeStrings(raw) {
        var out = [];
        if (!raw) return out;
        if (Array.isArray(raw)) {
            raw.forEach(function (item) {
                if (typeof item === 'string' && item) out.push(item);
                else if (item && item.text) out.push(tx(item.text));
            });
            return out;
        }
        if (typeof raw === 'string') {
            out.push(raw);
            return out;
        }
        if (raw.beforeSpin) out = out.concat(normalizeStrings(raw.beforeSpin));
        if (raw.afterLose) out = out.concat(normalizeStrings(raw.afterLose));
        if (raw.afterWin) out = out.concat(normalizeStrings(raw.afterWin));
        return out;
    }

    function lineKey(line, idx) {
        return line.on + '|' + (line.at === null || line.at === undefined ? '*' : line.at) + '|' + idx;
    }

    /* Sélectionne la ligne à jouer pour un event.
       - value numérique (palier de score, compteur) : on joue le plus grand `at`
         non encore joué tel que at <= value.
       - sinon : première ligne non jouée de l'event. */
    function pickLine(event, value) {
        var best = null;
        var bestAt = -Infinity;
        var hasNumber = (typeof value === 'number' && isFinite(value));
        state.lines.forEach(function (line, idx) {
            if (line.on !== event) return;
            var key = lineKey(line, idx);
            if (state.fired[key]) return;
            var at = (line.at === null || line.at === undefined) ? null : Number(line.at);
            if (hasNumber && at !== null && at > value) return;
            var score = (at === null) ? -Infinity : at;
            if (best === null || score > bestAt) { best = { line: line, key: key }; bestAt = score; }
        });
        if (!best) return null;
        state.fired[best.key] = true;
        return best.line;
    }

    function pickFallback() {
        if (!state.fallback.length) return '';
        var text = state.fallback[state.fallbackIdx % state.fallback.length];
        state.fallbackIdx++;
        return text || '';
    }

    /* ===================== DOM ===================== */
    function detectMode(opts) {
        if (opts.mode === 'overlay' || opts.mode === 'standalone') return opts.mode;
        var overlay = document.getElementById('minigame-overlay');
        if (overlay && !overlay.classList.contains('hidden')) return 'overlay';
        if (opts.forceOverlay === true) return 'overlay';
        return 'standalone';
    }

    function findMount(opts) {
        if (opts.mountId) {
            var custom = document.getElementById(opts.mountId);
            if (custom) return custom;
        }
        var selectors = ['#game-container', '.sg-main', '#standalone-game-app', '#marginal-tower-app', 'main'];
        for (var i = 0; i < selectors.length; i++) {
            var found = document.querySelector(selectors[i]);
            if (found) return found;
        }
        return document.body;
    }

    /* Overlay index.html : on réutilise le DOM existant (aucun doublon). */
    function ensureOverlayDom() {
        var dom = {};
        dom.overlay = document.getElementById('minigame-overlay');
        dom.bg = document.getElementById('minigame-bg-layer');
        dom.portrait = document.getElementById('minigame-npc-image');
        dom.dialogue = document.getElementById('minigame-dialogue-text');
        dom.name = document.getElementById('minigame-npc-name');
        if (!dom.name) {
            var holder = document.querySelector('.minigame-topbar-dialogue');
            if (holder) {
                dom.name = document.createElement('div');
                dom.name.id = 'minigame-npc-name';
                dom.name.className = 'minigame-npc-name';
                dom.name.innerHTML = '<span class="minigame-npc-name-text"></span><span class="minigame-npc-role-text"></span>';
                var box = holder.querySelector('.minigame-dialogue-box');
                if (box) holder.insertBefore(dom.name, box);
                else holder.appendChild(dom.name);
            }
        }
        if (dom.name) {
            dom.nameText = dom.name.querySelector('.minigame-npc-name-text') || dom.name;
            dom.roleText = dom.name.querySelector('.minigame-npc-role-text') || null;
        }
        return dom;
    }

    /* Bouton Paramètres dans la navbar des pages mini-jeux (mode standalone).
       settings-menu.js monte déjà son propre ⚙ dans la navbar via
       DPSettings.init() : on le RÉUTILISE plutôt que d'en créer un second
       (deux boutons pour la même action). Le fallback ci-dessous ne sert que
       si la page ne charge pas settings-menu.js. */
    function findNavbarSettingsBtn() {
        return document.querySelector('.sg-header .dp-settings-btn, ' +
            '.sg-header-actions .dp-settings-btn, .tower-header .dp-settings-btn');
    }

    function ensureHeaderSettingsBtn() {
        try {
            var existing = findNavbarSettingsBtn();
            if (existing) return existing;
            var header = document.querySelector('.sg-header') ||
                document.querySelector('.tower-header');
            if (!header) return null;
            var created = document.createElement('button');
            created.id = 'td-sc-settings-btn';
            created.className = 'td-sc-settings-btn';
            created.type = 'button';
            created.setAttribute('aria-label', 'Paramètres');
            created.setAttribute('title', 'Paramètres');
            created.textContent = '⚙';
            header.appendChild(created);
            return created;
        } catch (e) {
            return null;
        }
    }

    /* Pages standalone : décor plein écran fixe (z-index négatif = zéro impact layout)
       + barre de dialogue insérée en tête du conteneur de jeu (jamais superposée). */
    function ensureStandaloneDom(opts) {
        var dom = {};
        dom.bg = document.getElementById('td-sc-bg');
        if (!dom.bg) {
            dom.bg = document.createElement('div');
            dom.bg.id = 'td-sc-bg';
            dom.bg.className = 'td-sc-bg';
            dom.bg.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(dom.bg, document.body.firstChild);
        }
        dom.veil = document.getElementById('td-sc-veil');
        if (!dom.veil) {
            dom.veil = document.createElement('div');
            dom.veil.id = 'td-sc-veil';
            dom.veil.className = 'td-sc-veil';
            dom.veil.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(dom.veil, dom.bg.nextSibling);
        }
        dom.bar = document.getElementById('td-sc-bar');
        if (!dom.bar) {
            dom.bar = document.createElement('div');
            dom.bar.id = 'td-sc-bar';
            dom.bar.className = 'td-sc-bar';
            dom.bar.innerHTML =
                '<div class="td-sc-bar-inner">' +
                    '<div class="td-sc-portrait-frame"><img id="td-sc-portrait" class="td-sc-portrait" src="" alt=""></div>' +
                    '<div class="td-sc-dialogue-zone">' +
                        '<div class="td-sc-identity">' +
                            '<span id="td-sc-name" class="td-sc-name"></span>' +
                            '<span id="td-sc-role" class="td-sc-role"></span>' +
                        '</div>' +
                        '<div class="td-sc-dialogue-box"><span id="td-sc-dialogue" class="td-sc-dialogue-text"></span></div>' +
                    '</div>' +
                '</div>';
            var mount = findMount(opts);
            if (mount.firstChild) mount.insertBefore(dom.bar, mount.firstChild);
            else mount.appendChild(dom.bar);
        }
        dom.portrait = document.getElementById('td-sc-portrait');
        dom.nameText = document.getElementById('td-sc-name');
        dom.roleText = document.getElementById('td-sc-role');
        dom.dialogue = document.getElementById('td-sc-dialogue');
        if (state.mode === 'standalone') {
            ensureHeaderSettingsBtn();
        }
        return dom;
    }

    function applyThemeClasses() {
        var themeClass = FAMILY_THEME_CLASS[state.family] || FAMILY_THEME_CLASS.classic;
        var root = document.documentElement;
        /* En overlay (index.html) on ne touche PAS au <html> : la classe de thème
           reste confinée à l'overlay pour ne rien changer au reste de l'app. */
        root.classList.remove('theme-classic', 'theme-cyberpunk', 'theme-noire');
        if (state.mode === 'standalone') {
            root.classList.add('td-story-chrome', themeClass);
            root.setAttribute('data-td-theme', state.family);
        } else {
            root.classList.remove('td-story-chrome');
        }
        var nodes = [state.dom.overlay, state.dom.bar];
        nodes.forEach(function (node) {
            if (!node) return;
            node.classList.remove('theme-classic', 'theme-cyberpunk', 'theme-noire');
            node.classList.add(themeClass);
            node.setAttribute('data-td-theme', state.family);
        });
    }

    /* Pose décor + portrait + nom. Aucun texte de dialogue ici : voir say(). */
    function paint() {
        applyThemeClasses();
        var decorUrl = resolveDecor(state.decorKey, state.themeId);
        var portraitUrl = resolvePortrait(state.suspectId, state.themeId);
        var name = npcName(state.suspectId);
        var role = npcRole(state.suspectId);
        var d = state.dom;

        if (state.mode === 'overlay') {
            /* app.js a déjà posé décor + portrait du suspect : on ne les écrase
               que si le jeu les fournit explicitement (sinon on ne fait que
               remplir le vide). En standalone, pas de héritage : on impose. */
            var bgHasImage = !!(d.bg && d.bg.style.backgroundImage && d.bg.style.backgroundImage !== 'none');
            if (d.bg && decorUrl && (state.decorExplicit || !bgHasImage)) {
                d.bg.style.backgroundImage = 'url("' + decorUrl + '")';
            }
        } else {
            var root = document.documentElement;
            root.style.setProperty('--td-sc-decor', decorUrl ? 'url("' + decorUrl + '")' : 'none');
            if (d.bar) d.bar.style.setProperty('--td-sc-bar-decor', decorUrl ? 'url("' + decorUrl + '")' : 'none');
        }
        var portraitHasSrc = !!(d.portrait && d.portrait.getAttribute && d.portrait.getAttribute('src'));
        var overlayBypass = (state.mode === 'overlay') && portraitHasSrc && !state.suspectExplicit;
        if (d.portrait && !overlayBypass) {
            if (portraitUrl) {
                d.portrait.src = portraitUrl;
                d.portrait.alt = name || '';
                d.portrait.style.display = 'block';
            } else {
                d.portrait.style.display = 'none';
            }
        }
        if (d.nameText) d.nameText.textContent = name || '';
        if (d.roleText) d.roleText.textContent = role || '';
    }

    /* ===================== DIALOGUE ===================== */
    /* Écrit une réplique. Aucun timer : le texte reste affiché jusqu'au prochain event. */
    function say(text) {
        text = tx(text, state.lang);
        if (!text) return '';
        state.current = text;
        var d = state.dom;
        if (d.dialogue) {
            d.dialogue.textContent = text;
            var box = d.dialogue.parentNode;
            if (box && box.classList) {
                box.classList.remove('td-sc-line-in');
                void box.offsetWidth; // redémarre l'animation CSS (pas de timer JS)
                box.classList.add('td-sc-line-in');
            }
        }
        if (global.InterrogationSystem && typeof global.InterrogationSystem.appendDialogue === 'function') {
            try { global.InterrogationSystem.appendDialogue(npcName(state.suspectId), text); } catch (e) { /* ignore */ }
        }
        if (typeof state.hooks.onSay === 'function') {
            try { state.hooks.onSay(text); } catch (e) { /* ignore */ }
        }
        return text;
    }

    function fireHook(name, arg) {
        var fn = state.hooks[name];
        if (typeof fn === 'function') {
            try { fn(arg); } catch (e) { /* ignore */ }
        }
    }

    /* Point d'entrée unique côté jeux : TDStoryChrome.trigger('pair', { value: 3 }).
       Renvoie le texte joué (ou null si le chrome est inactif). */
    function trigger(event, data) {
        if (!state.active || !event) return null;
        data = data || {};
        var line = pickLine(event, data.value);
        var text = line ? tx(line.text, state.lang) : '';
        if (!text && data.text) text = tx(data.text, state.lang);
        if (!text) text = pickFallback();
        if (text) say(text);
        if (event === 'victory') fireHook('onVictory', data);
        else if (event === 'defeat') fireHook('onDefeat', data);
        else fireHook('onEvent', { event: event, data: data, text: text });
        return text || null;
    }

    /* ===================== API ===================== */
    /* Initialise le chrome. Actif seulement en contexte scénario (ou forcé).
       opts = { suspectId, decorKey|decorBg, lines, fallback, intro, story|storyMode,
                themeId, lang, gameType, mode, mountId, onVictory, onDefeat, onSay } */
    function init(opts) {
        opts = opts || {};
        var params = getParams();
        var cfg = opts.config || readJsonStorage('td_standalone_game_config') ||
            readJsonStorage('td_standalone_game_return') || {};

        state.themeId = resolveThemeId(opts, params, cfg);
        state.family = familyOf(state.themeId);
        state.lang = resolveLang(opts, params, cfg);
        state.gameType = resolveGameType(opts, params) || (cfg && cfg.type) || '';
        state.decorKey = resolveDecorKey(opts, params, cfg);

        var story = isStoryContext(opts, params, cfg);
        state.suspectId = resolveSuspectId(opts, params, cfg, story);
        state.lines = normalizeLines(opts.lines || opts.storyLines || cfg.lines || cfg.storyLines);
        var defaults = normalizeLines(GAME_DEFAULT_LINES[state.gameType])
            .concat(normalizeLines(GAME_DEFAULT_SPEECH[state.gameType]));
        if (defaults.length) {
            var configuredEvents = {};
            state.lines.forEach(function (line) { configuredEvents[line.on] = true; });
            defaults.forEach(function (line) {
                if (configuredEvents[line.on]) return;
                /* Les répliques écrites pour le thème classic sont réattribuées
                   au suspect courant : sans cela un jeu cyberpunk annonce encore
                   « Lady Vivienne » alors que le portrait affiché est Lyra Noir. */
                if (GAME_DEFAULT_LINES_THEMED[state.gameType] && line.text) {
                    line = {
                        on: line.on,
                        at: line.at,
                        text: {
                            fr: withSpeaker(stripSpeaker(tx(line.text, 'fr')), 'fr'),
                            en: withSpeaker(stripSpeaker(tx(line.text, 'en')), 'en')
                        }
                    };
                }
                state.lines.push(line);
            });
        }
        state.fallback = normalizeStrings(opts.fallback || opts.dialogues || cfg.dialogues);
        if (!state.fallback.length && state.lines.length) {
            state.fallback = state.lines.map(function (line) { return line.text; });
        }
        state.hooks = {
            onSay: opts.onSay,
            onVictory: opts.onVictory,
            onDefeat: opts.onDefeat,
            onEvent: opts.onEvent
        };
        state.fired = {};
        state.fallbackIdx = 0;

        var explicit = (opts.force === true) || !!opts.suspectId || !!opts.lines;
        if (!explicit && !story) { state.active = false; return false; }
        if (!state.suspectId && !state.lines.length && opts.allowNoSuspect !== true) {
            state.active = false;
            return false;
        }

        /* Story mode "for real" = explicit opt or URL flag (?story=1 / ?mode=story).
           We deliberately ignore cfg.story here: that one can come from a
           leftover localStorage config, which would wrongly re-enable the
           talkbox on the plain "mini jeux" page. */
        opts.__story = (opts.story === true) || (opts.storyMode === true) ||
            (params.get('story') === '1') || (params.get('mode') === 'story');

        state.active = true;
        state.mode = detectMode(opts);
        state.dom = (state.mode === 'overlay') ? ensureOverlayDom() : ensureStandaloneDom(opts);
        document.documentElement.classList.add('td-sc-' + state.mode);
        paint();
        if (state.mode === 'standalone') {
            /* Listener paresseux : la décision se prend AU CLIC, pas ici.
               settings-menu.js peut monter son ⚙ (et poser son toggle) après
               story-chrome : tester au clic garantit qu'un seul des deux agit,
               sinon le panneau s'ouvre puis se referme dans la même frame. */
            var settingsBtn = document.getElementById('td-sc-settings-btn');
            if (settingsBtn && !settingsBtn._tdScBound) {
                settingsBtn._tdScBound = true;
                settingsBtn.addEventListener('click', function () {
                    if (settingsBtn.classList.contains('dp-settings-btn')) return;
                    if (window.DPSettings && typeof window.DPSettings.open === 'function') {
                        window.DPSettings.open();
                    }
                });
            }
        }

        var startLine = pickLine('start', undefined);
        var startText = startLine ? tx(startLine.text, state.lang) : '';
        if (!startText) startText = tx(opts.intro, state.lang);
        /* Si la boîte est encore vide (page standalone sans texte préexistant),
           on ouvre avec la première réplique de secours. En overlay, app.js a déjà
           posé le titre du mini-jeu : on ne l'écrase pas. */
        if (!startText && opts.intro !== false) {
            var dlg = state.dom ? state.dom.dialogue : null;
            if (!dlg || !dlg.textContent) startText = pickFallback();
        }
        if (startText) say(startText);
        return true;
    }

    /* Suspect dynamique (ex: bataille navale finale = interroId en cours). */
    function setSuspect(suspectId, decorKey, lines, fallback) {
        if (suspectId) { state.suspectId = suspectId; state.suspectExplicit = true; }
        if (decorKey) { state.decorKey = decorKey; state.decorExplicit = true; }
        if (lines) { state.lines = normalizeLines(lines); state.fired = {}; }
        if (fallback) state.fallback = normalizeStrings(fallback);
        if (!state.active) return false;
        paint();
        return true;
    }

    function setLang(lang) {
        state.lang = (lang === 'en') ? 'en' : 'fr';
        if (state.active) paint();
        return state.lang;
    }

    function setVisible(visible) {
        var on = visible !== false;
        var d = state.dom || {};
        [d.bar, d.bg, d.veil].forEach(function (node) {
            if (node && node.classList) node.classList.toggle('hidden', !on);
        });
        document.documentElement.classList.toggle('td-sc-hidden', !on);
    }

    function hide() { setVisible(false); }

    function show() { setVisible(true); }

    function reset() {
        state.active = false;
        state.fired = {};
        state.fallbackIdx = 0;
        state.current = '';
        var d = state.dom || {};
        if (d.dialogue) d.dialogue.textContent = '';
        document.documentElement.classList.remove('td-sc-overlay', 'td-sc-standalone', 'td-story-chrome', 'td-sc-hidden');
        document.documentElement.style.removeProperty('--td-sc-decor');
    }

    function getState() {
        return {
            active: state.active,
            mode: state.mode,
            themeId: state.themeId,
            family: state.family,
            lang: state.lang,
            gameType: state.gameType,
            suspectId: state.suspectId,
            decorKey: state.decorKey,
            lines: state.lines.length,
            current: state.current
        };
    }

    /* ===================== AUTO-INIT ===================== */
    /* Uniquement sur une page de mini-jeu (jamais sur index.html qui héberge
       l'overlay) et uniquement en contexte scénario. */
    function canAutoInit() {
        if (document.getElementById('minigame-overlay')) return false;
        return !!(document.getElementById('standalone-game-app') ||
            document.getElementById('game-container') ||
            document.querySelector('.sg-header') ||
            document.querySelector('.sg-main'));
    }

    function autoInit() {
        try {
            if (!canAutoInit()) return false;
            var params = getParams();
            var cfg = readJsonStorage('td_standalone_game_config') ||
                readJsonStorage('td_standalone_game_return') || {};
            if (!isStoryContext({}, params, cfg)) return false;
            return init({});
        } catch (e) {
            return false;
        }
    }

    /* ===================== APPEL CONFORT (côté jeux) =====================
       Contrat des events (voir PLAN-mix-minijeux.md §3) :
         start        : début de partie
         aiMove       : coup de l'IA (chess, value = nb de coups IA)
         pair         : paire trouvée (memory, value = nb de paires)
         line         : jeton/coup aligné (connect4)
         enemyTurn    : tour de l'IA (bataille-navale)
         object       : objet utilisé (marginal-tower, value = nb d'objets)
         score        : palier de score (shooting, value = score, at 2/4/6...)
         victory/defeat : fin de partie
       Les events non listés dans `lines` tombent dans `fallback` (répertoire
       de répliques du suspect, cfg.dialogues). */
    function initFromCfg(cfg, extra) {
        cfg = cfg || {};
        extra = extra || {};
        var configuredLines = cfg.lines || cfg.storyLines;
        /* Les jeux anciens ne fournissent pas toujours les événements de fin.
           On crée donc une ligne de victoire/défaite à partir de leur indice,
           afin que le suspect révèle toujours la bonne récompense. */
        var resultLines = normalizeLines(configuredLines);
        var winClue = cfg.clue || cfg.clueWin;
        var loseClue = cfg.failClue || cfg.clueLose;
        if (winClue && !resultLines.some(function (line) { return line.on === 'victory'; })) {
            resultLines.push({ on: 'victory', at: null, text: winClue });
        }
        if (loseClue && !resultLines.some(function (line) { return line.on === 'defeat'; })) {
            resultLines.push({ on: 'defeat', at: null, text: loseClue });
        }
        var opts = {
            suspectId: cfg.type === 'memory' ? (cfg.culprit || cfg.interroId) : cfg.interroId,
            decorKey: cfg.decorKey,
            lines: resultLines,
            fallback: cfg.dialogues,
            story: cfg.storyMode === true || cfg.story === true,
            gameType: cfg.type,
            lang: cfg.lang,
            intro: cfg.minigameIntro
        };
        Object.keys(extra).forEach(function (key) { opts[key] = extra[key]; });

        if (state.active) {
            /* Déjà actif : ne jamais réinitialiser les paliers (sinon les
               répliques rejoueraient à chaque appel du jeu). */
            if (opts.suspectId && opts.suspectId !== state.suspectId) {
                return setSuspect(opts.suspectId, opts.decorKey || null, opts.lines || null, opts.fallback || null);
            }
            if (opts.fallback && !state.fallback.length) state.fallback = normalizeStrings(opts.fallback);
            if (opts.lines && !state.lines.length) state.lines = normalizeLines(opts.lines);
            return true;
        }
        return init(opts);
    }

    /* Rend la main au mode scénario quand le mini-jeu tourne dans l'iframe
       posée par app.js (launchMinigame). app.js enregistre le callback dans
       window.parent._storyMinigameCompleteHandler ; on supprime l'iframe puis
       on rend la main. Hors iframe : false, le jeu garde sa logique habituelle. */
    function reportResult(won) {
        try {
            var parentWin = (global.parent && global.parent !== global) ? global.parent : null;
            if (!parentWin || typeof parentWin._storyMinigameCompleteHandler !== 'function') return false;
            if (parentWin._storyMinigameIframe) {
                parentWin._storyMinigameIframe.remove();
                parentWin._storyMinigameIframe = null;
            }
            var handler = parentWin._storyMinigameCompleteHandler;
            parentWin._storyMinigameCompleteHandler = null;
            handler({ won: !!won });
            return true;
        } catch (e) {
            return false;
        }
    }

    global.TDStoryChrome = {
        VERSION: '1.0',
        init: init,
        initFromCfg: initFromCfg,
        reportResult: reportResult,
        trigger: trigger,
        say: say,
        setSuspect: setSuspect,
        setLang: setLang,
        hide: hide,
        show: show,
        reset: reset,
        isActive: function () { return state.active; },
        getMode: function () { return state.mode; },
        getState: getState,
        familyOf: familyOf,
        decorUrl: function (key, themeId) { return resolveDecor(key, themeId); },
        portraitUrl: function (id, themeId) { return resolvePortrait(id, themeId); },
        npcName: npcName,
        npcRole: npcRole,
        normalizeLines: normalizeLines
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

})(typeof globalThis !== 'undefined' ? globalThis : this);