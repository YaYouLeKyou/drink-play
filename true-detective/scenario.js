/* =====================================================================
   TRUE DETECTIVE — SCÉNARIO V2 (data-driven + coupable randomisé)
   ---------------------------------------------------------------------
   9 phases x 3 pages : Intro -> Recherche -> Acte1 -> Réflexion ->
   Acte2 -> Énigme -> Acte3 -> Rising Tension -> Révélation -> Outro.
   Coupable tiré aléatoirement ; mobile/méthode/fins s'adaptent.
===================================================================== */
(function (global) {
    'use strict';

    var TRUTH = {};

    TRUTH['protecteur'] = {
        coupable: 'protecteur',
        title: { fr: 'Le Major Hale', en: 'Major Hale' },
        mobile: { fr: 'Amoureux obsessionnel de Lady Vivienne, il a fait exécuter le meurtre pour l\'assurance et les bijoux, croyant la conquérir.', en: 'Hopelessly in love with Lady Vivienne, he had the murder carried out for the insurance and jewels, believing it would win her.' },
        methode: { fr: 'Sabotage de la voiture du Séducteur, recrutement du Criminel, cambriolage simulé.', en: 'Sabotaging Julian Pembrooke\'s car, hiring Victor Krane, staging the burglary.' },
        adn: { fr: 'L\'ADN inconnue est celle du Criminel : son bras armé.', en: 'The unknown DNA belongs to Victor Krane: his enforcer.' },
        revel1: { fr: 'La panne du Séducteur était factice : la durite avait été sectionnée. Le Major Hale s\'était bâti un faux alibi.', en: 'Julian Pembrooke\'s breakdown was staged: the hose had been cut. Major Hale had built a false alibi.' },
        revel2: { fr: 'Victor Krane avoue : « Le garde du corps m\'a payé pour le meurtre et le vol. »', en: 'Victor Krane confesses: "The bodyguard paid me for the murder and the robbery."' },
        indice: { fr: 'La porte était verrouillée à son retour, pourtant il décrit la mare de sang avec une précision troublante.', en: 'The door was locked when he returned, yet he describes the pool of blood with troubling precision.' },
        prison: { fr: 'Tout ça pour elle... mais elle ne l\'a jamais aimé. Il s\'effondre dans la cellule.', en: 'All of this for her... but she never loved him. He collapses in the cell.' },
        morale: { fr: 'De l\'amour à la folie criminelle, il n\'y a qu\'une obsession.', en: 'From love to criminal madness, there is only an obsession.' },
    };

    TRUTH['femme-fatale'] = {
        coupable: 'femme-fatale',
        title: { fr: 'Lady Vivienne', en: 'Lady Vivienne' },
        mobile: { fr: 'Héritière désignée, elle voulait la fortune de la victime et sa liberté.', en: 'The named heiress, she wanted the victim\'s fortune and her freedom.' },
        methode: { fr: 'Manipulation du Protecteur, rédaction des lettres de menace, mise en scène du vol.', en: 'Manipulating Major Hale, writing the threat letters, staging the robbery.' },
        adn: { fr: 'Son ADN figure en trop d\'endroits d\'une scène qu\'elle disait ne pas connaître.', en: 'Her DNA appears in too many places of a scene she claimed not to know.' },
        revel1: { fr: 'Julian Pembrooke, sous pression, révèle qu\'elle complotait contre la victime depuis des mois.', en: 'Julian Pembrooke, under pressure, reveals she had been scheming against the victim for months.' },
        revel2: { fr: 'Elle craque : « Je voulais sa fortune... le Major Hale n\'était que mon outil. »', en: 'She cracks: "I wanted his fortune... Major Hale was merely my tool."' },
        indice: { fr: 'Elle en savait trop sur les menaces que personne ne lui avait montrées.', en: 'She knew too much about threats no one had shown her.' },
        prison: { fr: 'Son sourire s\'efface. En larmes, elle avoue pour tenter d\'adoucir sa peine.', en: 'Her smile fades. In tears, she confesses to soften her sentence.' },
        morale: { fr: 'Derrière un visage angélique se cache parfois une lame de fer.', en: 'Behind an angelic face sometimes hides a blade of iron.' },
    };

    TRUTH['seducteur'] = {
        coupable: 'seducteur',
        title: { fr: 'Julian Pembrooke', en: 'Julian Pembrooke' },
        mobile: { fr: 'Endetté et jaloux, il voulait à la fois la fortune et Lady Vivienne. La mort de la victime arrangeait tout.', en: 'In debt and jealous, he wanted both the fortune and Lady Vivienne. The victim\'s death fixed everything.' },
        methode: { fr: 'Panne simulée, paiement du Criminel, alibi appuyé par le Major Hale.', en: 'Staged breakdown, paying Victor Krane, alibi backed by Major Hale.' },
        adn: { fr: 'Son ADN, mais aussi une fibre d\'étoffe rare près de la montre brisée.', en: 'His DNA, plus a thread of rare fabric near the broken watch.' },
        revel1: { fr: 'Le Major Hale, en le croyant défendre, se trahit : « Il n\'était pas en panne, je l\'ai vu partir. »', en: 'Major Hale, thinking he helps, slips: "He wasn\'t stuck; I saw him leave."' },
        revel2: { fr: 'Face aux preuves, il avoue avoir payé Victor Krane pour l\'acte.', en: 'Faced with the evidence, he admits paying Victor Krane for the deed.' },
        indice: { fr: 'Sa « panne » coïncidait exactement avec l\'heure du meurtre ; la durite coupée le prouve.', en: 'His "breakdown" matched the hour of the murder exactly; the cut hose proves it.' },
        prison: { fr: 'Son charme ne sauve pas un assassin. Il baisse la tête dans le couloir de la prison.', en: 'Charm does not save a killer. He lowers his head in the prison corridor.' },
        morale: { fr: 'Le charme le plus brillant cache parfois la lame la plus froide.', en: 'The brightest charm sometimes hides the coldest blade.' },
    };

    TRUTH['suspect'] = {
        coupable: 'suspect',
        title: { fr: 'Rupert Blackwood', en: 'Rupert Blackwood' },
        mobile: { fr: 'Il devait une fortune à la victime. Seule la mort du créancier pouvait effacer la dette.', en: 'He owed the victim a fortune. Only the creditor\'s death could erase the debt.' },
        methode: { fr: 'Recrutement du Criminel, paiement d\'un faux témoin, mensonge sur son heure de départ.', en: 'Hiring Victor Krane, paying a false witness, lying about his leaving time.' },
        adn: { fr: 'Son ADN, retrouvé bien plus profondément dans l\'appartement qu\'il ne l\'admettait.', en: 'His DNA, found deeper into the flat than he admitted.' },
        revel1: { fr: 'Silas Crane se rétracte : Rupert Blackwood l\'a payé pour mentir sur l\'heure de sortie.', en: 'Silas Crane recants: Rupert Blackwood paid him to lie about the leaving time.' },
        revel2: { fr: 'Il craque : « La dette... je ne pouvais plus payer. J\'ai dû faire venir quelqu\'un. »', en: 'He cracks: "The debt... I could not pay anymore. I had someone come."' },
        indice: { fr: 'Il prétend être parti à 19h30, mais son ADN est sur le cadre de la porte du couloir de la mort.', en: 'He claims he left at 7:30pm, yet his DNA is on the doorframe of the death corridor.' },
        prison: { fr: 'Un homme ruiné, pris au piège de ses dettes. Il avoue, épuisé.', en: 'A ruined man, trapped by his debts. He confesses, exhausted.' },
        morale: { fr: 'L\'argent ronge l\'âme de ceux qui lui sacrifient tout.', en: 'Money eats the soul of those who sacrifice everything for it.' },
    };

    TRUTH['marginal'] = {
        coupable: 'marginal',
        title: { fr: 'Silas Crane', en: 'Silas Crane' },
        mobile: { fr: 'Ancien cambrioleur, il connaissait la maison. La victime qui lui donnait des pièces méritait « sa fin ».', en: 'An ex-burglar who knew the house. The victim who gave him coins "deserved his end".' },
        methode: { fr: 'Profitant de son passé pour entrer, il a agressé la victime et vidé le coffre.', en: 'Using his past to get in, he assaulted the victim and emptied the safe.' },
        adn: { fr: 'Son ADN est partout, alors qu\'il jurait n\'avoir touché qu\'une pièce.', en: 'His DNA is everywhere, though he swore he only touched a coin.' },
        revel1: { fr: 'La pièce qu\'il conserve précieusement provient de la scène, pas de la main de la victime.', en: 'The coin he treasures comes from the scene, not from the victim\'s hand.' },
        revel2: { fr: 'Il avoue le meurtre, mais le vol l\'intéressait plus que la haine.', en: 'He confesses the murder, but the theft interested him more than hatred.' },
        indice: { fr: 'Il savait où étaient le coffre et la montre : des détails qu\'un voleur camoufle derrière son casier.', en: 'He knew where the safe and the watch were: details a thief hides behind his record.' },
        prison: { fr: 'Silas Crane ne pleure pas. Il retourne en cellule, étrangement calme.', en: 'Silas Crane does not cry. He returns to his cell, strangely calm.' },
        morale: { fr: 'Parfois, la fatalité pousse un homme vers un crime qu\'il n\'avait pas prémédité.', en: 'Sometimes fate pushes a man toward a crime he had not premeditated.' },
    };

    TRUTH['criminel'] = {
        coupable: 'criminel',
        title: { fr: 'Victor Krane', en: 'Victor Krane' },
        mobile: { fr: 'Tueur à gages, il a exécuté un contrat. Le « pourquoi » ne l\'intéresse pas.', en: 'A hitman, he carried out a contract. The "why" does not interest him.' },
        methode: { fr: 'Exécution contractuelle, violence physique, cambriolage simulé.', en: 'Contract execution, physical violence, staged burglary.' },
        adn: { fr: 'L\'ADN inconnue est la sienne ; trop de traces pour un professionnel.', en: 'The unknown DNA is his; too many traces for a professional.' },
        revel1: { fr: 'On découvre qu\'il connaissait la victime du bar depuis des années : ce n\'était pas un hasard.', en: 'We learn he knew the victim from the bar for years: it was no coincidence.' },
        revel2: { fr: 'Il avoue le contrat, discret, sans nommer le commanditaire.', en: 'He confesses the contract, tight-lipped, without naming the client.' },
        indice: { fr: 'Son ADN inconnue était le seul à ne correspondre à personne... jusqu\'à ce qu\'on le relie au rôdeur.', en: 'His unknown DNA matched no one... until we linked him to the lurking figure.' },
        prison: { fr: 'Il ne dit rien de plus. Un métier est un métier, même pour un tueur.', en: 'He says nothing more. A job is a job, even for a killer.' },
        morale: { fr: 'Parfois seule la lame paie, tandis que la main qui la guide reste dans l\'ombre.', en: 'Sometimes only the blade pays, while the hand that guides it stays in the dark.' },
    };

    /* ------------------------------------------------------------------
       2. ÉTAT DE PARTIE + API DE BASE
    ------------------------------------------------------------------ */
    var state = { lang: 'fr', theme: 'agatha-christie', culprit: 'protecteur', prochainSuspect: null, suspectOrdre: [], phaseIdx: 0, pageIdx: 0, clues: [], miniGamesWon: 0, accused: null, score: 0, ending: null, evidence: { alibi: 0, mobile: 0, opportunity: 0, forensic: 0, witness: 0, timeline: 0 } };
    var SUSPECTS = ['protecteur', 'femme-fatale', 'seducteur', 'suspect', 'marginal', 'criminel'];

    /* Le coupable est FIXE (Major Hale) — plus de random */
    function randomCulprit() { return 'protecteur'; }
    function reset() {
        state.culprit = 'protecteur';
        state.prochainSuspect = null; state.suspectOrdre = [];
        state.phaseIdx = 0; state.pageIdx = 0; state.clues = [];
        state.miniGamesWon = 0; state.accused = null; state.score = 0; state.ending = null;
        state.evidence = { alibi: 0, mobile: 0, opportunity: 0, forensic: 0, witness: 0, timeline: 0 };
    }
    function truth() { return TRUTH[state.culprit] || TRUTH.protecteur; }
    function t(obj, lang) {
        if (obj == null) return '';
        if (typeof obj === 'string') return obj;
        var l = lang || state.lang || 'fr';
        return obj[l] || obj.fr || obj.en || '';
    }

    /* --- Réactions d'accusation (mauvais suspect) --- */
    var REACTIONS = {};
    REACTIONS['femme-fatale'] = {
        fr: 'Lady Vivienne éclate d\'un rire amer. « Moi ? La meurtrière ? Regardez plutôt du côté de votre précieux Major Hale. Ses dettes, ses versements à Krane… Et ce faux alibi de panne : c\'est lui qui l\'a monté. » Elle s\'éloigne, laissant le vrai coupable s\'échapper. ÉCHEC.',
        en: 'Lady Vivienne bursts into bitter laughter. "Me? The murderess? Look instead at your precious Major Hale. His debts, his payments to Krane… And that fake breakdown alibi: he staged it." She walks away, letting the real killer escape. FAILURE.'
    };
    REACTIONS['seducteur'] = {
        fr: 'Julian Pembrooke blêmit. « C\'est une erreur… J\'étais en panne, je vous l\'ai dit ! » Il a raison : la panne était un faux, mais lui n\'était que l\'alibi. Le vrai coupable, celui qui a monté la panne, court encore. ÉCHEC.',
        en: 'Julian Pembrooke turns pale. "This is a mistake… I broke down, I told you!" He\'s right: the breakdown was staged, but he was just the alibi. The real killer, the one who staged it, is still free. FAILURE.'
    };
    REACTIONS['suspect'] = {
        fr: 'Rupert Blackwood ricane. « Accusez-moi, moi ? J\'étais parti à 21h30,Silas Crane peut le confirmer. Ce n\'est pas moi qui ai sectionné cette durite… ni payé Krane. » Il serre le poing et sort. Le vrai coupable reste en liberté. ÉCHEC.',
        en: 'Rupert Blackwood sneers. "Accuse me? I left at 9:30pm, Silas Crane can confirm. I didn\'t cut that hose… nor pay Krane." He clenches his fist and leaves. The real killer remains free. FAILURE.'
    };
    REACTIONS['marginal'] = {
        fr: 'Silas Crane secoue la tête. « Je ne suis qu\'un clochard, pas un meurtrier. J\'ai VU le rôdeur à 22h — suivez cette piste, trouvez qui il était. » Il disparaît dans la nuit. Sans suivre l\'indice du rôdeur, le vrai coupable vous échappe. ÉCHEC.',
        en: 'Silas Crane shakes his head. "I\'m just a homeless man, not a killer. I SAW the prowler at 10pm — follow that lead, find out who it was." He vanishes into the night. Without following the prowler clue, the real killer escapes you. FAILURE.'
    };
    REACTIONS['criminel'] = {
        fr: 'Victor Krane sourit lentement. « Je ne suis que le bras, inspecteur. La main qui m\'a guidé, c\'est Hale — mon employeur. Relisez les versements dans le coffre. » Il ne dira rien de plus. Le commanditaire s\'échappe. ÉCHEC.',
        en: 'Victor Krane smiles slowly. "I am just the arm, inspector. The hand that guided me is Hale — my employer. Reread the payments in the safe." He says nothing more. The mastermind escapes. FAILURE.'
    };
    REACTIONS['protecteur'] = {
        fr: 'Le Major Hale s\'effondre. « Tout ça pour elle… mais elle ne m\'a jamais aimé. » La vérité éclate : amour obsessionnel, Krane payé, Pembrooke alibi, crime maîtré. JUSTICE EST FAITE.',
        en: 'Major Hale collapses. "All of this for her… but she never loved me." The truth bursts out: obsessive love, Krane paid, Pembrooke alibi, crime mastered. JUSTICE IS SERVED.'
    };

    /* --- Système de preuves (faisceau d'indices) --- */
    function recordEvidence(category) {
        if (state.evidence.hasOwnProperty(category)) {
            state.evidence[category] = Math.min(3, state.evidence[category] + 1);
        }
    }
    function getEvidenceScore() {
        var e = state.evidence;
        return e.alibi + e.mobile + e.opportunity + e.forensic + e.witness + e.timeline;
    }
    function getEvidenceMax() { return 18; }

    /* --- Évaluation de l'accusation --- */
    function evaluateAccusation(suspectId) {
        state.accused = suspectId;
        var correct = (suspectId === state.culprit);
        var score = getEvidenceScore();
        var reaction = REACTIONS[suspectId] || REACTIONS['protecteur'];
        return {
            correct: correct,
            score: score,
            max: getEvidenceMax(),
            reaction: t(reaction, state.lang),
            truth: truth(),
        };
    }

    global.TDScenario = {
        reset: reset, getState: function () { return state; }, getTruth: truth,
        randomCulprit: randomCulprit, SUSPECTS: SUSPECTS, TRUTH: TRUTH, t: t,
        recordEvidence: recordEvidence, getEvidenceScore: getEvidenceScore,
        getEvidenceMax: getEvidenceMax, evaluateAccusation: evaluateAccusation,
        REACTIONS: REACTIONS,
    };

}(typeof globalThis !== 'undefined' ? globalThis : this));