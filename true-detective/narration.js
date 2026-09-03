/* =====================================================================
   TRUE DETECTIVE — NARRATION (FICHIER UNIQUE)
   --------------------------------------------------------------------
   Fichier unifié suivant la chronologie complète du jeu.
   Sections :
     1. Chronologie des phases  (intro-1 → outro)
     2. Descriptions des suspects
     3. Réactions (échec d'accusation)
     4. Vérités (fins réussies)
     5. Mini-jeux (titres / descriptions / indices)
     6. Hotspots de la scène de crime
===================================================================== */
(function (global) {
    'use strict';
    var N = global.TDNarration || {};
    var T = global.TDNarrationTruths || {};

    /* =================================================================
       1. CHRONOLOGIE DES PHASES
       (intro-1, intro-2, act1_1, act1_2, act2_1, act2_2,
        act3_1, act3_2, act3_3, outro)
       Chaque phase : page1, page2, page3 (FR / EN)
    ================================================================= */

    N.intro1 = {
        page1: { fr: "La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie. On vous a confié l'enquête : la plus délicate de votre carrière.", en: "The city whispers under the rain. In a lavish flat, a real-estate magnate was found dead. You have been assigned the case : the most delicate of your career." },
        page2: { fr: "Vous poussez la porte de la scène de crime. Le sang a séché sur le parquet, le coffre est béant, et sur une table gît une montre de poche brisée. Personne ne sait encore quand le magnat est mort : aucune heure n'est établie. C'est à vous de la trouver.", en: "You push open the door of the crime scene. Blood has dried on the floor, the safe gapes open, and on a table lies a broken pocket watch. No one knows yet when the magnate died : no time of death is established. Finding it is your job." },
        page3: { fr: "Votre partenaire vous rejoint, l'air grave : « La victime, un magnat, n'avait qu'un seul domestique : son garde du corps, le Major Hale. C'est lui qui a découvert le corps. L'affaire commence ici. »", en: "Your partner joins you, looking grave : \"The victim, a tycoon, had one servant : his bodyguard, Major Hale. He found the body. The case begins here.\"" }
    };

    N.intro2 = {
        page1: { fr: "« Examinez la pièce avant de poser vos questions », souffle le partenaire.", en: "\"Examine the room before asking questions,\" your partner whispers." },
        page2: { fr: "Le carnet déchiré révèle des pages manquantes. En les reconstituant, vous découvrez des versements réguliers à un certain « V.K. ».", en: "The torn ledger reveals missing pages. By reassembling them, you discover regular payments to a certain \"V.K.\"." },
        page3: { fr: "Votre partenaire vous observe : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »", en: "Your partner watches you : \"Are you onto something? These clues are forming a motive. Let's continue.\"" }
    };

    N.act1_1 = {
        page1: { fr: "Au manoir, le Major Hale vous accueille dans le salon avec un mélange de nervosité et d'arrogance. « Je vous ai attendu. La maison est en deuil, faites vite. »", en: "At the manor, Major Hale greets you in the lounge with a mix of nervousness and arrogance. \"I've been expecting you. The house is in mourning, make it quick.\"" },
        page2: { fr: "Lady Vivienne, d'une voix posée dans le boudoir : « Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. »", en: "Lady Vivienne, in a calm voice in the boudoir : \"My husband had enemies, certainly. But the perpetrator… it's someone from the house.\"" },
        page3: { fr: "Votre partenaire murmure : « Pour l'instant, restons au manoir. Pembrooke et Blackwood seront entendus plus tard. »", en: "Your partner whispers : \"For now, stay in the manor. Pembrooke and Blackwood will be heard later.\"" }
    };

    N.act1_2 = {
        page1: { fr: "« Intéressant… » murmurez-vous. Dans la ruelle, Silas Crane prétend avoir vu un rôdeur bien habillé aux alentours de 22h.", en: "\"Interesting…\" you murmur. In the alley, Silas Crane claims to have seen a well-dressed prowler around 10pm." },
        page2: { fr: "Le coffre-fort est vide, mais les montants sont énormes : 50 000 £ en espèces.", en: "The safe is empty, but the amounts are huge : £50,000 in cash." },
        page3: { fr: "Chez le notaire, Rupert Blackwood est hors de lui : « Quelqu'un a vidé les comptes ! Le testament a été modifié la semaine dernière. »", en: "At the notary's place, Rupert Blackwood is frantic : \"Someone drained the accounts! The will was changed last week.\"" }
    };

    N.act2_1 = {
        page1: { fr: "Au quartier général, votre partenaire recompte les indices. « L'ADN parle d'elle-même. Filons au bar. »", en: "At headquarters, your partner tallies the clues. \"DNA speaks for itself. Let's go to the bar.\"" },
        page2: { fr: "Au bar, Julian Pembrooke esquisse un sourire : « Je n'ai rien vu, rien entendu. Mais si vous cherchez un mobile, regardez du côté des dettes de Hale. »", en: "At the bar, Julian Pembrooke smiles : \"I saw nothing, heard nothing. But if you're looking for a motive, look into Hale's debts.\"" },
        page3: { fr: "Dehors, devant le bar, votre partenaire note : « Pembrooke a le blason des Crane, le marginal aussi. Lien familial ? »", en: "Outside, in front of the bar, your partner notes : \"Pembrooke has the Crane crest, so does the homeless man. Family link?\"" }
    };

    N.act2_2 = {
        page1: { fr: "Au laboratoire, Whitmore vous tend une clé USB : « Les données ADN sont claires. L'échantillon B appartient au criminel. »", en: "At the laboratory, Whitmore hands you a USB drive : \"The DNA data is clear. Sample B belongs to the criminal.\"" },
        page2: { fr: "De retour au quartier général, le schéma de l'alarme révèle que le câble a été marqué au charbon AVANT le sabotage.", en: "Back at headquarters, the alarm blueprint reveals the cable was marked with charcoal BEFORE the sabotage." },
        page3: { fr: "Au manoir, la montre du Duc est intacte. Le Major Hale détourne le regard quand vous la montrez.", en: "At the manor, the Duke's watch is intact. Major Hale looks away when you show it." }
    };

    N.act3_1 = {
        page1: { fr: "Au quartier général, le téléphone sonne. C'est Silas Crane. Il dit qu'il a vu le rôdeur… et qu'il portait un blason Pembrooke.", en: "At headquarters, the phone rings. It's Silas Crane. He says he saw the prowler… and he was wearing a Pembrooke crest." },
        page2: { fr: "Les fichiers du coffre contiennent des documents confidentiels : Lady Vivienne trompait la victime avec Hale.", en: "The safe's files contain confidential documents : Lady Vivienne was cheating on the victim with Hale." },
        page3: { fr: "Le Major Hale refuse de coopérer : « Je n'ai rien dit de tout cela ! Vous n'avez aucune preuve ! »", en: "Major Hale refuses to cooperate : \"I said none of this! You have no proof!\"" }
    };

    N.act3_2 = {
        page1: { fr: "« Attendez… » Votre partenaire fronce les sourcils au quartier général. « Si la durite a été coupée, alors Hale savait où et quand aider Pembrooke. »", en: "\"Wait…\" Your partner frowns at headquarters. \"If the hose was cut, then Hale knew where and when to help Pembrooke.\"" },
        page2: { fr: "Chez le marginal, Silas Crane, sous pression, avoue : « Blackwood m'a payé pour mentir. Le rôdeur, c'était Pembrooke. »", en: "At the homeless man's place, Silas Crane, under pressure, confesses : \"Blackwood paid me to lie. The prowler was Pembrooke.\"" },
        page3: { fr: "Dans la ruelle, le téléphone de Hale sonne. C'est Krane : « Tu m'as payé pour le meurtre. C'est fini. »", en: "In the alley, Hale's phone rings. It's Krane : \"You paid me for the murder. It's over.\"" }
    };

    N.act3_3 = {
        page1: { fr: "Dans la ruelle, sous la pression, Victor Krane avoue en partie : « Je ne connaissais pas la victime par hasard. C'est Hale qui m'a contacté. »", en: "In the alley, under pressure, Victor Krane half confesses : \"I didn't know the victim by chance. Hale contacted me.\"" },
        page2: { fr: "Au manoir, le Major Hale se contredit soudain : il décrit la mare de sang avec trop de précision.", en: "At the manor, Major Hale suddenly contradicts himself : he describes the pool of blood with too much precision." },
        page3: { fr: "Au quartier général, le moment est venu. Votre partenaire vous tend le dossier. Qui accusez-vous ?", en: "At headquarters, the time has come. Your partner hands you the file. Who do you accuse?" }
    };

    N.outro = {
        page1: { fr: "L'affaire est classée. Le vrai coupable croupit en prison, le mobile était l'argent, la méthode, la trahison.", en: "Case closed. The real culprit is in prison, the motive was money, the method, betrayal." },
        page2: { fr: "La ville murmure à nouveau sous la pluie. Une autre affaire vous attend, mais celle-ci est résolue.", en: "The city whispers again under the rain. Another case awaits you, but this one is solved." },
        page3: { fr: "FIN — True Detective.", en: "END — True Detective." }
    };

    /* =================================================================
       2. DESCRIPTIONS DES SUSPECTS
    ================================================================= */

    N.suspects = {
        protecteur: { fr: "Le Major Hale — Garde du corps de la victime, loyal en apparence mais rongé par l'amour obsessionnel pour Lady Vivienne.", en: "Major Hale — The victim's bodyguard, outwardly loyal but consumed by obsessive love for Lady Vivienne." },
        "femme-fatale": { fr: "Lady Vivienne — Épouse de la victime, héritière désignée, manipulatrice et calculatrice.", en: "Lady Vivienne — The victim's wife, named heiress, manipulative and calculating." },
        seducteur: { fr: "Julian Pembrooke — Ami d'enfance de la victime, sa voiture est tombée en panne au moment du crime.", en: "Julian Pembrooke — The victim's childhood friend, his car broke down at the time of the crime." },
        suspect: { fr: "Rupert Blackwood — Notaire de la victime, il gérait les affaires confidentielles du magnat.", en: "Rupert Blackwood — The victim's notary, he managed the tycoon's confidential affairs." },
        marginal: { fr: "Silas Crane — Clochard du quartier, témoin clé qui a vu un rôdeur la nuit du crime.", en: "Silas Crane — Homeless man in the neighborhood, key witness who saw a prowler on the night of the crime." },
        criminel: { fr: "Victor Krane — Criminel de bas étage, bras armé engagé pour commettre le meurtre.", en: "Victor Krane — Low-level criminal, hired enforcer to commit the murder." }
    };

    /* =================================================================
       3. RÉACTIONS (échec d'accusation)
    ================================================================= */

    N.reactions = {
        protecteur: { fr: "Le Major Hale s'effondre. « Tout ça pour elle... mais elle ne m'a jamais aimé. » La vérité éclate : amour obsessionnel, Krane payé, Pembrooke alibi, crime maîtrisé. JUSTICE EST FAITE.", en: "Major Hale collapses. \"All of this for her... but she never loved me.\" The truth bursts out: obsessive love, Krane paid, Pembrooke alibi, crime mastered. JUSTICE IS SERVED." },
        "femme-fatale": { fr: "Lady Vivienne esquisse un sourire glacial. « Vous croyez vraiment que je me serais salie les mains ? Vous manquez de preuves, inspecteur. » Le véritable commanditaire vous échappe. ÉCHEC.", en: "Lady Vivienne offers a glacial smile. \"You really think I would dirty my hands? You lack proof, inspector.\" The true mastermind escapes you. FAILURE." },
        seducteur: { fr: "Julian Pembrooke pâle. « C'est une erreur… j'étais en panne, je vous l'ai dit ! » Il a raison : la panne était factice, mais il n'était que l'alibi. Le vrai coupable court encore. ÉCHEC.", en: "Julian Pembrooke turns pale. \"This is a mistake... I broke down, I told you!\" He's right: the breakdown was staged, but he was just the alibi. The real killer is still free. FAILURE." },
        suspect: { fr: "Rupert Blackwood ricane. « Accusez-moi, moi ? J'étais parti à 21h30, Silas Crane peut le confirmer. Ce n'est pas moi qui ai sectionné cette durite… ni payé Krane. » Le vrai coupable reste en liberté. ÉCHEC.", en: "Rupert Blackwood sneers. \"Accuse me? I left at 9:30pm, Silas Crane can confirm. I didn't cut that hose... nor pay Krane.\" The real killer remains free. FAILURE." },
        marginal: { fr: "Silas Crane secoue la tête. « Je ne suis qu'un clochard, pas un meurtrier. J'ai VU le rôdeur à 22h — suivez cette piste, trouvez qui il était. » Le vrai coupable vous échappe. ÉCHEC.", en: "Silas Crane shakes his head. \"I'm just a homeless man, not a killer. I SAW the prowler at 10pm — follow that lead, find out who it was.\" The real killer escapes you. FAILURE." },
        criminel: { fr: "Victor Krane sourit lentement. « Je ne suis que le bras, inspecteur. La main qui m'a guidé, c'est Hale — mon employeur. Relisez les versements dans le coffre. » Le commanditaire s'échappe. ÉCHEC.", en: "Victor Krane smiles slowly. \"I am just the arm, inspector. The hand that guided me is Hale — my employer. Reread the payments in the safe.\" The mastermind escapes. FAILURE." }
    };

    /* =================================================================
       4. VÉRITÉS (fins réussies)
    ================================================================= */

    T.protecteur = {
        title: { fr: "Le Major Hale", en: "Major Hale" },
        mobile: { fr: "Amoureux obsessionnel de Lady Vivienne, il a fait exécuter le meurtre pour l'assurance et les bijoux.", en: "Hopelessly in love with Lady Vivienne, he had the murder carried out for the insurance and jewels." },
        methode: { fr: "Sabotage de la voiture du Séducteur, recrutement du Criminel, cambriolage simulé.", en: "Sabotaging Julian Pembrooke's car, hiring Victor Krane, staging the burglary." },
        adn: { fr: "L'ADN inconnue est celle du Criminel : son bras armé.", en: "The unknown DNA belongs to Victor Krane: his enforcer." },
        revel1: { fr: "La panne du Séducteur était factice : la durite avait été sectionnée.", en: "Julian Pembrooke's breakdown was staged: the hose had been cut." },
        revel2: { fr: "Victor Krane avoue : Le garde du corps m'a payé pour le meurtre et le vol.", en: "Victor Krane confesses: The bodyguard paid me for the murder and the robbery." },
        indice: { fr: "La porte était verrouillée à son retour, pourtant il décrit la mare de sang avec une précision troublante.", en: "The door was locked when he returned, yet he describes the pool of blood with troubling precision." },
        prison: { fr: "Tout ça pour elle... mais elle ne l'a jamais aimé. Il s'effondre dans la cellule.", en: "All of this for her... but she never loved him. He collapses in the cell." },
        morale: { fr: "De l'amour à la folie criminelle, il n'y a qu'une obsession.", en: "From love to criminal madness, there is only an obsession." }
    };

    T["femme-fatale"] = {
        title: { fr: "Lady Vivienne", en: "Lady Vivienne" },
        mobile: { fr: "Héritière désignée, elle voulait la fortune de la victime et sa liberté.", en: "The named heiress, she wanted the victim's fortune and her freedom." },
        methode: { fr: "Manipulation du Protecteur, rédaction des lettres de menace, mise en scène du vol.", en: "Manipulating Major Hale, writing the threat letters, staging the robbery." },
        adn: { fr: "Son ADN figure en trop d'endroits d'une scène qu'elle disait ne pas connaître.", en: "Her DNA appears in too many places of a scene she claimed not to know." },
        revel1: { fr: "Julian Pembrooke, sous pression, révèle qu'elle complotait contre la victime depuis des mois.", en: "Julian Pembrooke, under pressure, reveals she had been scheming against the victim for months." },
        revel2: { fr: "Elle craque : Je voulais sa fortune... le Major Hale n'était que mon outil.", en: "She cracks: I wanted his fortune... Major Hale was merely my tool." },
        indice: { fr: "Elle en savait trop sur les menaces que personne ne lui avait montrées.", en: "She knew too much about threats no one had shown her." },
        prison: { fr: "Son sourire s'efface. En larmes, elle avoue pour tenter d'adoucir sa peine.", en: "Her smile fades. In tears, she confesses to soften her sentence." },
        morale: { fr: "Derrière un visage angélique se cache parfois une lame de fer.", en: "Behind an angelic face sometimes hides a blade of iron." }
    };

    /* =================================================================
       5. MINI-JEUX (titres / descriptions / indices)
    ================================================================= */

    N.minigames = {
        scene_fouille: {
            title: { fr: "Fouille de la scène", en: "Scene search" },
            desc: { fr: "Balayez la scène à la loupe. Chaque pièce à conviction numérotée ouvre une fenêtre : examinez-les toutes.", en: "Sweep the scene with the magnifier. Each numbered evidence opens a window : examine them all." },
            clue: { fr: "Un proche de confiance, deux verres, des dettes effacées, une écriture élégante et un reçu signé V.K. Le meurtre était prévu - le vol, simulé.", en: "A trusted close one, two glasses, erased debts, elegant handwriting and a receipt signed \"V.K.\". The murder was planned - the robbery, staged." }
        },
        carnet_dechire: {
            title: { fr: "Le Carnet déchiré", en: "The Torn Ledger" },
            desc: { fr: "Reconstituez les pages arrachées du livre de comptes pour révéler un versement à « V.K. ».", en: "Reassemble the torn ledger pages to reveal a payment to V.K.." },
            clue: { fr: "Des versements réguliers à Victor Krane et les empreintes du Major Hale, le garde du corps et majordome en chef, sur la mention V.K.", en: "Regular payments to Victor Krane and the fingerprints of Major Hale, the bodyguard and chief butler, on the V.K. mention." }
        },
        cryptogramme: {
            title: { fr: "Le Cryptogramme", en: "The Cryptogram" },
            desc: { fr: "Décodez le message crypté pour révéler une connexion entre les suspects.", en: "Decode the cryptic message to reveal a connection between suspects." },
            clue: { fr: "La note de Krane révèle : HALE ENGAGE KRANE. La complicité est établie.", en: "Krane's note reveals: HALE HIRES KRANE. The collusion is proven." }
        },
        coffre_fort: {
            title: { fr: "Le Coffre-fort", en: "The Safe" },
            desc: { fr: "Entrez le code du coffre pour accéder aux documents confidentiels.", en: "Enter the safe code to access confidential documents." },
            clue: { fr: "Les documents du coffre révèlent les dettes de Blackwood et la liaison de l'épouse.", en: "The safe documents reveal Blackwood's debts and the wife's affair." }
        },
        cablage_alarme: {
            title: { fr: "Le Câblage de l'alarme", en: "The Alarm Wiring" },
            desc: { fr: "Réparez le circuit de l'alarme pour prouver l'intrusion.", en: "Repair the alarm circuit to prove the intrusion." },
            clue: { fr: "Le câble a été marqué au charbon AVANT le sabotage. Une main avertie a guidé l'intrus.", en: "The cable was marked with charcoal BEFORE the sabotage. A knowing hand guided the intruder." }
        },
        montre_code: {
            title: { fr: "La Montre du Duc", en: "The Duke's Watch" },
            desc: { fr: "Examinez la montre pour trouver l'heure du crime et un code secret.", en: "Examine the watch to find the time of death and a secret code." },
            clue: { fr: "L'aiguille figée à 22h09 indique l'heure probable du crime. La gravure 1981 sert au coffre.", en: "The frozen hand at 10:09pm indicates the probable time of death. The engraving 1981 is for the safe." }
        },
        adn_match: {
            title: { fr: "Profil ADN", en: "DNA Profile" },
            desc: { fr: "Comparez les échantillons ADN pour identifier l'inconnu.", en: "Compare DNA samples to identify the unknown." },
            clue: { fr: "L'ADN inconnue correspond à Victor Krane, le criminel engagé par Hale.", en: "The unknown DNA matches Victor Krane, the criminal hired by Hale." }
        }
    };

    /* =================================================================
       6. HOTSPOTS DE LA SCÈNE DE CRIME
       (positions alignées sur "scene de crime manoir.png")
    ================================================================= */

    N.hotspots = [
        { label: 'A', x: 11.6, y: 66.1, info: { fr: "Le sceau en or et son cachet posés à l'extrême gauche du bureau. Matériel de correspondance intact, prouvant que le bureau n'a pas été saccagé au hasard et que l'intrus connaissait les lieux ou possédait les accès.", en: "The gold seal and its stamp placed at the far left of the desk. Intact correspondence material, proving that the desk was not ransacked randomly and that the intruder knew the premises or had access." } },
        { label: 'B', x: 24.1, y: 70.4, info: { fr: "L'encrier central et son bloc d'écriture. Situé au centre du bureau, il témoigne de la zone où la victime rédigeait ses documents avant l'altercation.", en: "The central inkwell and its writing block. Located at the center of the desk, it testifies to the area where the victim was writing his documents before the altercation." } },
        { label: '1', x: 31.2, y: 56.8, info: { fr: "Les papiers administratifs et la plume ouverte sur le bureau. Papiers éparpillés sur le coin gauche du bureau, signalant qu'une recherche rapide ou une consultation de documents a eu lieu.", en: "Administrative papers and the open quill on the desk. Scattered papers on the left corner of the desk, indicating that a quick search or document consultation took place." } },
        { label: '2', x: 38.6, y: 57.3, info: { fr: "Les deux verres de vin dressés et la petite coupelle. Témoigne clairement de la présence d'un invité de confiance que la victime attendait pour boire un verre.", en: "The two standing wine glasses and the small saucer. Clearly testifies to the presence of a trusted guest whom the victim was expecting to have a drink with." } },
        { label: '3', x: 47.2, y: 58.3, info: { fr: "Le livre ouvert et taché de sang près de la lampe de bureau. Registre ou journal de bord maculé de taches de sang, suggérant une lutte ou un accès brutal survenu en plein travail.", en: "The open book stained with blood near the desk lamp. Register or logbook smeared with bloodstains, suggesting a struggle or brutal access that occurred during work." } },
        { label: '4', x: 66.4, y: 79.2, info: { fr: "Le fauteuil de bureau renversé et couché à l'envers sur le tapis. Témoigne d'une bousculade violente et d'une lutte brève juste avant que la victime ne s'effondre près de la fenêtre.", en: "The overturned office chair lying upside down on the carpet. Testifies to a violent scuffle and brief struggle just before the victim collapsed near the window." } },
        { label: '5', x: 70.8, y: 85.6, info: { fr: "La trace de sang au sol au cœur de la silhouette à la craie. L'épicentre de l'agression mortelle, marquant l'endroit exact de l'homicide.", en: "The blood trace on the floor at the heart of the chalk silhouette. The epicenter of the fatal assault, marking the exact location of the homicide." } },
        { label: '6', x: 78.2, y: 86.3, info: { fr: "Le fragment de papier froissé à côté du corps sur le tapis. Un simple bout de papier chiffonné portant des chiffres ou des inscriptions énigmatiques, posant la première véritable énigme mystérieuse à élucider pour la suite de l'enquête.", en: "The crumpled piece of paper next to the body on the carpet. A simple crumpled piece of paper bearing numbers or enigmatic inscriptions, posing the first true mysterious enigma to elucidate for the rest of the investigation." } }
    ];

    /* =================================================================
       EXPORTS GLOBAUX
    ================================================================= */

    global.TDNarration = N;
    global.TDNarrationTruths = T;

})(typeof globalThis !== 'undefined' ? globalThis : this);
