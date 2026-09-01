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
        title: { fr: 'Le Protecteur', en: 'The Protector' },
        mobile: { fr: 'Amoureux obsessionnel de la Femme Fatale, il a fait exécuter le meurtre pour l\'assurance et les bijoux, croyant la conquérir.', en: 'Hopelessly in love with the Femme Fatale, he had the murder carried out for the insurance and jewels, believing it would win her.' },
        methode: { fr: 'Sabotage de la voiture du Séducteur, recrutement du Criminel, cambriolage simulé.', en: 'Sabotaging the Seductor\'s car, hiring the Criminal, staging the burglary.' },
        adn: { fr: 'L\'ADN inconnue est celle du Criminel : son bras armé.', en: 'The unknown DNA belongs to the Criminal: his enforcer.' },
        revel1: { fr: 'La panne du Séducteur était factice : la durite avait été sectionnée. Le Protecteur s\'était bâti un faux alibi.', en: 'The Seductor\'s breakdown was staged: the hose had been cut. The Protector had built a false alibi.' },
        revel2: { fr: 'Le Criminel avoue : « Le garde du corps m\'a payé pour le meurtre et le vol. »', en: 'The Criminal confesses: "The bodyguard paid me for the murder and the robbery."' },
        indice: { fr: 'La porte était verrouillée à son retour, pourtant il décrit la mare de sang avec une précision troublante.', en: 'The door was locked when he returned, yet he describes the pool of blood with troubling precision.' },
        prison: { fr: 'Tout ça pour elle... mais elle ne l\'a jamais aimé. Il s\'effondre dans la cellule.', en: 'All of this for her... but she never loved him. He collapses in the cell.' },
        morale: { fr: 'De l\'amour à la folie criminelle, il n\'y a qu\'une obsession.', en: 'From love to criminal madness, there is only an obsession.' },
    };

    TRUTH['femme-fatale'] = {
        coupable: 'femme-fatale',
        title: { fr: 'La Femme Fatale', en: 'The Femme Fatale' },
        mobile: { fr: 'Héritière désignée, elle voulait la fortune de la victime et sa liberté.', en: 'The named heiress, she wanted the victim\'s fortune and her freedom.' },
        methode: { fr: 'Manipulation du Protecteur, rédaction des lettres de menace, mise en scène du vol.', en: 'Manipulating the Protector, writing the threat letters, staging the robbery.' },
        adn: { fr: 'Son ADN figure en trop d\'endroits d\'une scène qu\'elle disait ne pas connaître.', en: 'Her DNA appears in too many places of a scene she claimed not to know.' },
        revel1: { fr: 'Le Séducteur, sous pression, révèle qu\'elle complotait contre la victime depuis des mois.', en: 'The Seductor, under pressure, reveals she had been scheming against the victim for months.' },
        revel2: { fr: 'Elle craque : « Je voulais sa fortune... le Protecteur n\'était que mon outil. »', en: 'She cracks: "I wanted his fortune... the Protector was merely my tool."' },
        indice: { fr: 'Elle en savait trop sur les menaces que personne ne lui avait montrées.', en: 'She knew too much about threats no one had shown her.' },
        prison: { fr: 'Son sourire s\'efface. En larmes, elle avoue pour tenter d\'adoucir sa peine.', en: 'Her smile fades. In tears, she confesses to soften her sentence.' },
        morale: { fr: 'Derrière un visage angélique se cache parfois une lame de fer.', en: 'Behind an angelic face sometimes hides a blade of iron.' },
    };

    TRUTH['seducteur'] = {
        coupable: 'seducteur',
        title: { fr: 'Le Séducteur', en: 'The Seductor' },
        mobile: { fr: 'Endetté et jaloux, il voulait à la fois la fortune et la Femme Fatale. La mort de la victime arrangeait tout.', en: 'In debt and jealous, he wanted both the fortune and the Femme Fatale. The victim\'s death fixed everything.' },
        methode: { fr: 'Panne simulée, paiement du Criminel, alibi appuyé par le Protecteur.', en: 'Staged breakdown, paying the Criminal, alibi backed by the Protector.' },
        adn: { fr: 'Son ADN, mais aussi une fibre d\'étoffe rare près de la montre brisée.', en: 'His DNA, plus a thread of rare fabric near the broken watch.' },
        revel1: { fr: 'Le Protecteur, en le croyant défendre, se trahit : « Il n\'était pas en panne, je l\'ai vu partir. »', en: 'The Protector, thinking he helps, slips: "He wasn\'t stuck; I saw him leave."' },
        revel2: { fr: 'Face aux preuves, il avoue avoir payé le Criminel pour l\'acte.', en: 'Faced with the evidence, he admits paying the Criminal for the deed.' },
        indice: { fr: 'Sa « panne » coïncidait exactement avec l\'heure du meurtre ; la durite coupée le prouve.', en: 'His "breakdown" matched the hour of the murder exactly; the cut hose proves it.' },
        prison: { fr: 'Son charme ne sauve pas un assassin. Il baisse la tête dans le couloir de la prison.', en: 'Charm does not save a killer. He lowers his head in the prison corridor.' },
        morale: { fr: 'Le charme le plus brillant cache parfois la lame la plus froide.', en: 'The brightest charm sometimes hides the coldest blade.' },
    };

    TRUTH['suspect'] = {
        coupable: 'suspect',
        title: { fr: 'Le Suspect', en: 'The Suspect' },
        mobile: { fr: 'Il devait une fortune à la victime. Seule la mort du créancier pouvait effacer la dette.', en: 'He owed the victim a fortune. Only the creditor\'s death could erase the debt.' },
        methode: { fr: 'Recrutement du Criminel, paiement d\'un faux témoin, mensonge sur son heure de départ.', en: 'Hiring the Criminal, paying a false witness, lying about his leaving time.' },
        adn: { fr: 'Son ADN, retrouvé bien plus profondément dans l\'appartement qu\'il ne l\'admettait.', en: 'His DNA, found deeper into the flat than he admitted.' },
        revel1: { fr: 'Le Marginal se rétracte : le Suspect l\'a payé pour mentir sur l\'heure de sortie.', en: 'The Marginal recants: the Suspect paid him to lie about the leaving time.' },
        revel2: { fr: 'Il craque : « La dette... je ne pouvais plus payer. J\'ai dû faire venir quelqu\'un. »', en: 'He cracks: "The debt... I could not pay anymore. I had someone come."' },
        indice: { fr: 'Il prétend être parti à 19h30, mais son ADN est sur le cadre de la porte du couloir de la mort.', en: 'He claims he left at 7:30pm, yet his DNA is on the doorframe of the death corridor.' },
        prison: { fr: 'Un homme ruiné, pris au piège de ses dettes. Il avoue, épuisé.', en: 'A ruined man, trapped by his debts. He confesses, exhausted.' },
        morale: { fr: 'L\'argent ronge l\'âme de ceux qui lui sacrifient tout.', en: 'Money eats the soul of those who sacrifice everything for it.' },
    };

    TRUTH['marginal'] = {
        coupable: 'marginal',
        title: { fr: 'Le Marginal', en: 'The Marginal' },
        mobile: { fr: 'Ancien cambrioleur, il connaissait la maison. La victime qui lui donnait des pièces méritait « sa fin ».', en: 'An ex-burglar who knew the house. The victim who gave him coins "deserved his end".' },
        methode: { fr: 'Profitant de son passé pour entrer, il a agressé la victime et vidé le coffre.', en: 'Using his past to get in, he assaulted the victim and emptied the safe.' },
        adn: { fr: 'Son ADN est partout, alors qu\'il jurait n\'avoir touché qu\'une pièce.', en: 'His DNA is everywhere, though he swore he only touched a coin.' },
        revel1: { fr: 'La pièce qu\'il conserve précieusement provient de la scène, pas de la main de la victime.', en: 'The coin he treasures comes from the scene, not from the victim\'s hand.' },
        revel2: { fr: 'Il avoue le meurtre, mais le vol l\'intéressait plus que la haine.', en: 'He confesses the murder, but the theft interested him more than hatred.' },
        indice: { fr: 'Il savait où étaient le coffre et la montre : des détails qu\'un voleur camoufle derrière son casier.', en: 'He knew where the safe and the watch were: details a thief hides behind his record.' },
        prison: { fr: 'Le Marginal ne pleure pas. Il retourne en cellule, étrangement calme.', en: 'The Marginal does not cry. He returns to his cell, strangely calm.' },
        morale: { fr: 'Parfois, la fatalité pousse un homme vers un crime qu\'il n\'avait pas prémédité.', en: 'Sometimes fate pushes a man toward a crime he had not premeditated.' },
    };

    TRUTH['criminel'] = {
        coupable: 'criminel',
        title: { fr: 'Le Criminel', en: 'The Criminal' },
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
    var state = { lang: 'fr', theme: 'agatha-christie', culprit: 'protecteur', prochainSuspect: null, suspectOrdre: [], phaseIdx: 0, pageIdx: 0, clues: [], miniGamesWon: 0, accused: null, score: 0, ending: null };
    var SUSPECTS = ['protecteur', 'femme-fatale', 'seducteur', 'suspect', 'marginal', 'criminel'];

    function randomCulprit() {
        var pool = ['protecteur', 'protecteur', 'femme-fatale', 'seducteur', 'suspect', 'marginal', 'criminel'];
        return pool[Math.floor(Math.random() * pool.length)];
    }
    function reset() {
        state.culprit = randomCulprit();
        state.prochainSuspect = null; state.suspectOrdre = [];
        state.phaseIdx = 0; state.pageIdx = 0; state.clues = [];
        state.miniGamesWon = 0; state.accused = null; state.score = 0; state.ending = null;
    }
    function truth() { return TRUTH[state.culprit] || TRUTH.protecteur; }
    function t(obj, lang) {
        if (obj == null) return '';
        if (typeof obj === 'string') return obj;
        var l = lang || state.lang || 'fr';
        return obj[l] || obj.fr || obj.en || '';
    }

    global.TDScenario = {
        reset: reset, getState: function () { return state; }, getTruth: truth,
        randomCulprit: randomCulprit, SUSPECTS: SUSPECTS, TRUTH: TRUTH, t: t,
    };

}(typeof globalThis !== 'undefined' ? globalThis : this));