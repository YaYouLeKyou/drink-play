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
        page1: { fr: "La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie. On vous a confié l'enquête : la plus délicate de votre carrière.", en: "The city whispers under the rain. In a lavish flat, a real-estate magnate was found dead. You have been assigned the case: the most delicate of your career." },
        page2: { fr: "Vous poussez la porte de la scène de crime. Le sang a séché sur le parquet, le coffre est béant, et sur une table gît une montre de poche brisée. Personne ne sait encore quand le magnat est mort : aucune heure n'est établie. C'est à vous de la trouver.", en: "You push open the door of the crime scene. Blood has dried on the floor, the safe gapes open, and on a table lies a broken pocket watch. No one knows yet when the magnate died: no time of death is established. Finding it is your job." },
        page3: { fr: "Votre partenaire vous rejoint, l'air grave : « La victime, un magnat, n'avait qu'un seul domestique : son garde du corps, le Major Hale. C'est lui qui a découvert le corps. L'affaire commence ici. »", en: "Your partner joins you, looking grave: \"The victim, a tycoon, had one servant: his bodyguard, Major Hale. He found the body. The case begins here.\"" }
    };

    N.intro2 = {
        page1: { fr: "« Examinez la pièce avant de poser vos questions », souffle le partenaire.", en: "\"Examine the room before asking questions,\" your partner whispers." },
        page2: { fr: "Le carnet déchiré révèle des pages manquantes. En les reconstituant, vous découvrez des versements réguliers à un certain « V.K. ».", en: "The torn ledger reveals missing pages. By reassembling them, you discover regular payments to a certain \"V.K.\"." },
        page3: { fr: "Votre partenaire vous observe : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »", en: "Your partner watches you : \"Are you onto something? These clues are forming a motive. Let's continue.\"" }
    };

    N.act1_1 = {
        page1: { fr: "Le Major Hale, garde du corps et majordome en chef, vous accueille dans le salon du manoir avec un mélange de nervosité et d'arrogance. « Je vous ai attendu. La maison est en deuil, faites vite. »\n\nVous l'observez : « Vous sembliez proche de la victime. Quel genre d'homme était-il, ces derniers temps ? »\n\nHale hésite : « Distant. Rêveur. Il parlait souvent de changer le testament. Je n'y ai pas prêté attention — c'est l'affaire de Blackwood. »\n\n[Indice Témoin] Hale mentionne le testament et Blackwood spontanément. À retenir.", en: "Major Hale, bodyguard and chief butler, greets you in the manor lounge with a mix of nervousness and arrogance. \"I've been expecting you. The house is in mourning, make it quick.\"\n\nYou observe him: \"You seemed close to the victim. What kind of man was he, lately?\"\n\nHale hesitates: \"Distant. A dreamer. He often spoke of changing his will. I didn't pay much attention — that's Blackwood's business.\"\n\n[Witness clue] Hale mentions the will and Blackwood spontaneously. Keep it in mind." },
        page2: { fr: "Lady Vivienne, d'une voix posée dans le boudoir : « Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. »\n\nVous la testez : « Votre mari voyait d'autres femmes ? »\n\nElle sourit froidement : « Nous avions nos arrangements. Je n'étais pas dupe — il non plus. »\n\n[Indice Mobile] Vivienne parle d'arrangements. Aucune émotion visible : à creuser.", en: "Lady Vivienne, in a calm voice in the boudoir: \"My husband had enemies, certainly. But the perpetrator… it's someone from the house.\"\n\nYou test her: \"Did your husband see other women?\"\n\nShe smiles coldly: \"We had our arrangements. I wasn't fooled — neither was he.\"\n\n[Motive clue] Vivienne speaks of arrangements. No visible emotion: to dig further." },
        page3: { fr: "La montre du Duc gît sur la table du salon, brisée. « Elle a dû valser dans la bagarre, soupire Wexford. Voyez ce qu'elle peut encore nous apprendre. »\n\nAprès examen : « Bien. Maintenant, qui interroger en premier ? Blackwood, le notaire ? Ou ce témoin dans la ruelle ? Pembrooke, l'ami, est sans doute au bar. »", en: "The Duke's watch lies on the lounge table, broken. \"It must have flown off in the struggle,\" Wexford sighs. \"See what it can still tell us.\"\n\nAfter examination: \"Good. Now, who should we question first? Blackwood, the notary? Or the witness in the alley? Pembrooke, the friend, is probably at the bar.\"" }
    };

    N.act1_2 = {
        page1: { fr: "Avant de partir, vous revoyez vos notes avec Wexford dans le vestibule du manoir. « Le clochard de la ruelle a vu quelque chose cette nuit-là. Mais passons d'abord chez Blackwood, le notaire — il gérait les affaires du Duc. Et le clochard, on l'interceptera au retour. »", en: "Before leaving, you review your notes with Wexford in the manor vestibule. \"The homeless man in the alley saw something that night. But let's stop by Blackwood's, the notary — he handled the Duke's affairs. We'll catch the homeless man on the way back.\"" },
        page2: { fr: "Chez Rupert Blackwood, dans son appartement cossu. Il vous ouvre, l'air nerveux.\n\n« Entrez, inspecteur. Je ne sais pas ce que trafique le Duc ces derniers temps, mais les tensions sur le testament se multiplient. J'ai peur que tout cela finisse mal. »\n\nVous le testez : « Vous le connaissiez bien ? »\n\n« Assez pour savoir qu'il voulait déshériter sa femme. Je gère ses affaires — je refuse de tremper dans ça. »\n\n[Indice Mobile / Témoin] Blackwood mentionne la déshérence — il en sait plus qu'il ne le dit.", en: "At Rupert Blackwood's place, in his lavish apartment. He opens the door, looking uneasy.\n\n\"Come in, inspector. I don't know what the Duke has been up to lately, but the tensions around the will keep growing. I'm afraid this will end badly.\"\n\nYou test him: \"Did you know him well?\"\n\n\"Well enough to know he wanted to disinherit his wife. I handle his affairs — I refuse to get mixed up in that.\"\n\n[Motive / Witness clue] Blackwood mentions the disinheritance — he knows more than he lets on." },
        page3: { fr: "Sur le chemin du retour, à la sortie du manoir, dans la ruelle adjacente, Silas Crane grelotte dans un coin. Vous l'abordez doucement.\n\n« T'as une pièce, inspecteur ? »\n\nVous lui glissez une monnaie. Il se détend : « Un rôdeur bien habillé est passé par ici vers les 22h. Pressé, nerveux. Il regardait sans arrêt sa montre — une tocante en or, je me souviens. »\n\n[Indice Témoin / Chronologie] Un homme pressé à 22h, montre en or — à corréler avec l'heure de la montre du Duc et l'alibi de Pembrooke.", en: "On the way back, at the manor exit, in the adjacent alley, Silas Crane is shivering in a corner. You approach him gently.\n\n\"Got a coin, inspector?\"\n\nYou slip him some change. He relaxes: \"A well-dressed prowler passed by here around 10pm. Hurried, nervous. Kept checking his watch — a gold one, I remember.\"\n\n[Witness / Timeline clue] A hurried man at 10pm with a gold watch — to be cross-referenced with the Duke's watch and Pembrooke's alibi." }
    };

    N.act2_1 = {
        page1: { fr: "Au quartier général, votre partenaire recompte les indices. « Les analyses ADN parleront d'elles-mêmes. Filons au bar. »", en: "At headquarters, your partner tallies the clues. \"The DNA analyses will speak for themselves. Let's go to the bar.\"" },
        page2: { fr: "Au bar, Julian Pembrooke esquisse un sourire : « Je n'ai rien vu, rien entendu. Mais si vous cherchez un mobile, regardez du côté des dettes de Hale. »", en: "At the bar, Julian Pembrooke smiles : \"I saw nothing, heard nothing. But if you're looking for a motive, look into Hale's debts.\"" },
        page3: { fr: "Dehors, devant le bar, votre partenaire note : « Pembrooke a le blason des Crane, le marginal aussi. Lien familial ? »", en: "Outside, in front of the bar, your partner notes : \"Pembrooke has the Crane crest, so does the homeless man. Family link?\"" }
    };

    N.act2_2 = {
        page1: { fr: "Au laboratoire, Whitmore vous tend une clé USB : « Les analyses ADN sont sans appel. L'échantillon B appartient au criminel. »", en: "At the laboratory, Whitmore hands you a USB drive : \"The DNA analyses are conclusive. Sample B belongs to the criminal.\"" },
        page2: { fr: "Au laboratoire, Whitmore pointe le schéma de l'alarme : « Ce câble a été marqué au charbon AVANT le sabotage — même signature qu'un outil de garagiste. C'est la même main qui a saboté ce câble et sectionné la durite de la voiture de Pembrooke. »", en: "At the laboratory, Whitmore points at the alarm blueprint : \"This cable was marked with charcoal BEFORE the sabotage — the same signature as a garage tool. The same hand sabotaged this cable and cut Pembrooke's car hose.\"" },
        page3: { fr: "Au laboratoire, Whitmore feuillette ses notes : « Une dernière chose — le rapport toxicologique ne montre aucune trace de lutte. La victime n'a pas opposé de résistance. Elle connaissait son agresseur. »", en: "At the laboratory, Whitmore flips through his notes : \"One last thing — the toxicology report shows no sign of a struggle. The victim didn't resist. She knew her assailant.\"" }
    };

    N.act3_1 = {
        page1: { fr: "Au quartier général, le téléphone sonne. C'est Silas Crane. Il dit qu'il a vu le rôdeur… et qu'il portait un blason Pembrooke.", en: "At headquarters, the phone rings. It's Silas Crane. He says he saw the prowler… and he was wearing a Pembrooke crest." },
        page2: { fr: "Les fichiers du coffre contiennent des documents confidentiels : Lady Vivienne trompait la victime avec Hale.", en: "The safe's files contain confidential documents : Lady Vivienne was cheating on the victim with Hale." },
        page3: { fr: "Le Major Hale refuse de coopérer : « Je n'ai rien dit de tout cela ! Vous n'avez aucune preuve ! »", en: "Major Hale refuses to cooperate : \"I said none of this! You have no proof!\"" }
    };

    N.act3_2 = {
        page1: { fr: "« Attendez… » Votre partenaire fronce les sourcils au quartier général. « On a la même signature d'outil sur le câble d'alarme et sur la durite. Or, Pembrooke n'a pas accès au système d'alarme. C'est Hale qui l'a guidé. »", en: "\"Wait…\" Your partner frowns at headquarters. \"We have the same tool signature on the alarm cable and on the hose. Pembrooke doesn't have access to the alarm system. Hale guided him.\"" },
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
            desc: { fr: "[Forensique / Préméditation] Balayez la scène à la loupe. Chaque pièce à conviction numérotée ouvre une fenêtre : examinez-les toutes.", en: "[Forensic / Premeditation] Sweep the scene with the magnifier. Each numbered evidence opens a window : examine them all." },
            clue: { fr: "Un proche de confiance, deux verres, des dettes effacées, une écriture élégante et un reçu signé V.K. Le meurtre était prévu - le vol, simulé.", en: "A trusted close one, two glasses, erased debts, elegant handwriting and a receipt signed \"V.K.\". The murder was planned - the robbery, staged." }
        },
        carnet_dechire: {
            title: { fr: "Le Carnet déchiré", en: "The Torn Ledger" },
            desc: { fr: "[Mobile / Argent] Reconstituez les pages arrachées du livre de comptes pour révéler un versement à « V.K. ».", en: "[Motive / Money] Reassemble the torn ledger pages to reveal a payment to V.K.." },
            clue: { fr: "Des versements réguliers à Victor Krane et les empreintes du Major Hale, garde du corps et majordome en chef, sur la mention V.K.", en: "Regular payments to Victor Krane and the fingerprints of Major Hale, bodyguard and chief butler, on the V.K. mention." }
        },
        cryptogramme: {
            title: { fr: "Le Cryptogramme", en: "The Cryptogram" },
            desc: { fr: "[Mobile / Complicité] Décodez le message crypté pour révéler une connexion entre les suspects.", en: "[Motive / Collusion] Decode the cryptic message to reveal a connection between suspects." },
            clue: { fr: "La note de Krane révèle : HALE ENGAGE KRANE. La complicité est établie.", en: "Krane's note reveals: HALE HIRES KRANE. The collusion is proven." }
        },
        coffre_fort: {
            title: { fr: "Le Coffre-fort", en: "The Safe" },
            desc: { fr: "[Mobile / Documents] Entrez le code du coffre pour accéder aux documents confidentiels.", en: "[Motive / Documents] Enter the safe code to access confidential documents." },
            clue: { fr: "Les documents du coffre révèlent les dettes de Blackwood et la liaison de l'épouse.", en: "The safe documents reveal Blackwood's debts and the wife's affair." }
        },
        cablage_alarme: {
            title: { fr: "Le Câblage de l'alarme", en: "The Alarm Wiring" },
            desc: { fr: "[Opportunité / Accès interne] Réparez le circuit de l'alarme pour prouver l'intrusion.", en: "[Opportunity / Internal access] Repair the alarm circuit to prove the intrusion." },
            clue: { fr: "Le câble a été marqué au charbon AVANT le sabotage. Une main avertie a guidé l'intrus.", en: "The cable was marked with charcoal BEFORE the sabotage. A knowing hand guided the intruder." }
        },
        montre_code: {
            title: { fr: "La Montre du Duc", en: "The Duke's Watch" },
            desc: { fr: "[Chronologie / Heure du crime] Examinez la montre pour trouver l'heure du crime et un code secret.", en: "[Timeline / Time of death] Examine the watch to find the time of death and a secret code." },
            clue: { fr: "Personne dans l'enquête n'a encore fixé l'heure du décès. Pourtant, l'aiguille figée de la montre indique l'heure du crime, réduisant à néant l'alibi de Hale. Le code à 4 chiffres au dos ouvre le coffre.", en: "No one in the investigation has set the time of death yet. Yet the watch's frozen hand indicates the time of the crime, wiping out Hale's alibi. The 4-digit code on the back opens the safe." }
        },
        adn_match: {
            title: { fr: "Profil ADN", en: "DNA Profile" },
            desc: { fr: "[Forensique / Preuve matérielle] Comparez les échantillons ADN pour identifier l'inconnu.", en: "[Forensic / Physical evidence] Compare DNA samples to identify the unknown." },
            clue: { fr: "L'ADN inconnue correspond à Victor Krane, le criminel engagé par Hale.", en: "The unknown DNA matches Victor Krane, the criminal hired by Hale." }
        }
    };

    /* =================================================================
       6. HOTSPOTS DE LA SCÈNE DE CRIME
       (positions alignées sur "scene de crime manoir.png")
    ================================================================= */

    N.hotspots = [
        { label: 'A', x: 11.6, y: 66.1, info: { fr: "Le sceau en or et son cachet, posés à l'extrême gauche du bureau. Le matériel de correspondance est intact, ce qui prouve que le bureau n'a pas été saccagé au hasard : l'intrus connaissait les lieux — ou possédait les accès.", en: "The gold seal and its stamp, set at the far left of the desk. The correspondence tools are untouched, proving the desk was not ransacked at random : the intruder knew the premises — or had the keys." } },
        { label: 'B', x: 24.1, y: 70.4, info: { fr: "L'encrier central et son bloc d'écriture. Situé au cœur du bureau, il marque la zone où la victime rédigeait ses documents au moment de l'altercation.", en: "The central inkwell and its writing block. Set at the heart of the desk, it marks the spot where the victim was drafting his documents when the altercation began." } },
        { label: '1', x: 31.2, y: 56.8, info: { fr: "Des papiers administratifs et une plume ouverte, éparpillés sur le coin gauche du bureau. Quelqu'un a consulté ou recherché un document juste avant la mort.", en: "Administrative papers and an open quill, scattered across the left corner of the desk. Someone searched through a document just before the victim died." } },
        { label: '2', x: 38.6, y: 57.3, info: { fr: "Deux verres de vin dressés, avec une petite coupelle. La victime attendait un proche de confiance pour partager un dernier verre.", en: "Two wine glasses still standing, with a small saucer beside them. The victim was expecting a trusted guest for a last drink." } },
        { label: '3', x: 47.2, y: 58.3, info: { fr: "Un livre ouvert, maculé de sang, près de la lampe de bureau. Un journal ou registre taché suggère une lutte en plein travail, sans temps de réaction.", en: "An open book, smeared with blood, near the desk lamp. A bloodstained logbook hints at a struggle mid-work, with no time to react." } },
        { label: '4', x: 66.4, y: 79.2, info: { fr: "Le fauteuil de bureau, renversé sur le tapis. Une bousculade brève mais violente a précédé l'effondrement de la victime près de la fenêtre.", en: "The office chair, overturned on the carpet. A brief but violent scuffle preceded the victim's collapse near the window." } },
        { label: '5', x: 70.8, y: 85.6, info: { fr: "Une trace de sang au sol, au cœur de la silhouette à la craie. L'épicentre exact de l'agression mortelle — aucun geste de défense, la victime connaissait son agresseur.", en: "A blood trace on the floor, at the heart of the chalk outline. The exact epicentre of the fatal blow — no defensive wound : the victim knew the assailant." } },
        { label: '6', x: 78.2, y: 86.3, info: { fr: "Un fragment de papier froissé, à côté du corps sur le tapis. Des chiffres ou inscriptions énigmatiques — la première vraie énigme à élucider pour la suite de l'enquête.", en: "A crumpled piece of paper, beside the body on the carpet. Numbers or cryptic markings — the first real enigma to solve for the rest of the investigation." } }
    ];

    /* =================================================================
       EXPORTS GLOBAUX
    ================================================================= */

    global.TDNarration = N;
    global.TDNarrationTruths = T;

})(typeof globalThis !== 'undefined' ? globalThis : this);
