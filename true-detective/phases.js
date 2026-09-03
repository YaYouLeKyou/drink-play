/* =====================================================================
   TRUE DETECTIVE — PHASES & DIALOGUES (contenu narratif V3)
   Structure : 9 phases de 3 pages chacune.

   RÈGLE GÉNÉRALE — LIEUX DES PERSONNAGES (hors besoin du scénario) :
   - Scientifique (Whitmore)        → laboratoire
   - Femme fatale (Lady Vivienne)   → intérieur manoir de la victime
   - Protecteur (Major Hale)        → intérieur manoir de la victime
   - Détective partenaire           → quartier général (QG)
                                      Exception : intro + acte 1,
                                      il est dans le manoir de la victime.
   - Séducteur (Julian Pembrooke)   → intérieur bar
   - Marginal (Silas Crane)         → appartement pauvre (ruelle en narration si scénario l'exige)
   - Suspect (Rupert Blackwood)     → appartement du suspect
   - Criminel (Victor Krane)        → extérieur bar ou ruelle
===================================================================== */
(function (global) {
    'use strict';
    var PHASES = [];

    /* ===== INTRO — Phase 1A : OUVERTURE ===== */
    PHASES.push({
        id: 'intro-1',
        label: { fr: 'Prologue', en: 'Prologue' },
        act: 'Intro',
        type: 'narration',
        music: 'theme',
        pages: [
            { decor: 'universe', text: { fr: "La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie. On vous a confié l'enquête : la plus délicate de votre carrière.", en: "The city whispers under the rain. In a lavish flat, a real-estate magnate was found dead. You have been assigned the case : the most delicate of your career." } },
            { decor: 'crimeScene', text: { fr: "Vous poussez la porte de la scène de crime. Le sang a séché sur le parquet, le coffre est béant, et sur une table gît une montre de poche brisée. Personne ne sait encore quand le magnat est mort : aucune heure n'est établie. C'est à vous de la trouver.", en: "You push open the door of the crime scene. Blood has dried on the floor, the safe gapes open, and on a table lies a broken pocket watch. No one knows yet when the magnate died : no time of death is established. Finding it is your job." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Votre partenaire vous rejoint, l'air grave : « La victime, un magnat, n'avait qu'un seul domestique : son garde du corps, le Major Hale. C'est lui qui a découvert le corps. L'affaire commence ici. »", en: "Your partner joins you, looking grave : \"The victim, a tycoon, had one servant : his bodyguard, Major Hale. He found the body. The case begins here.\"" } }
        ]
    });

    /* ===== INTRO — Phase 1B : FOUILLE DE LA SCÈNE ===== */
    PHASES.push({
        id: 'intro-2',
        label: { fr: 'Recherche', en: 'Investigation' },
        act: 'Intro',
        type: 'dialogue',
        music: 'recherche',
        pages: [
            { decor: 'crimeScene', npc: 'detective-partner', minigame: { type: 'scene_fouille', wide: true, title: { fr: "Fouille de la scène", en: "Scene search" }, desc: { fr: "Balayez la scène à la loupe. Chaque pièce à conviction numérotée ouvre une fenêtre : examinez-les toutes.", en: "Sweep the scene with the magnifier." }, time: 60, sceneImage: "assets/image true detective/lieux/classic/scene de crime manoir.png", hotspots: [{ label: 'A', x: 11.6, y: 66.1, info: { fr: "Le sceau en or et son cachet, posés à l'extrême gauche du bureau. Le matériel de correspondance est intact, ce qui prouve que le bureau n'a pas été saccagé au hasard : l'intrus connaissait les lieux — ou possédait les accès.", en: "The gold seal and its stamp, set at the far left of the desk. The correspondence tools are untouched, proving the desk was not ransacked at random : the intruder knew the premises — or had the keys." } },{ label: 'B', x: 24.1, y: 70.4, info: { fr: "L'encrier central et son bloc d'écriture. Situé au cœur du bureau, il marque la zone où la victime rédigeait ses documents au moment de l'altercation.", en: "The central inkwell and its writing block. Set at the heart of the desk, it marks the spot where the victim was drafting his documents when the altercation began." } },{ label: '1', x: 31.2, y: 56.8, info: { fr: "Des papiers administratifs et une plume ouverte, éparpillés sur le coin gauche du bureau. Quelqu'un a consulté ou recherché un document juste avant la mort.", en: "Administrative papers and an open quill, scattered across the left corner of the desk. Someone searched through a document just before the victim died." } },{ label: '2', x: 38.6, y: 57.3, info: { fr: "Deux verres de vin dressés, avec une petite coupelle. La victime attendait un proche de confiance pour partager un dernier verre.", en: "Two wine glasses still standing, with a small saucer beside them. The victim was expecting a trusted guest for a last drink." } },{ label: '3', x: 47.2, y: 58.3, info: { fr: "Un livre ouvert, maculé de sang, près de la lampe de bureau. Un journal ou registre taché suggère une lutte en plein travail, sans temps de réaction.", en: "An open book, smeared with blood, near the desk lamp. A bloodstained logbook hints at a struggle mid-work, with no time to react." } },{ label: '4', x: 66.4, y: 79.2, info: { fr: "Le fauteuil de bureau, renversé sur le tapis. Une bousculade brève mais violente a précédé l'effondrement de la victime près de la fenêtre.", en: "The office chair, overturned on the carpet. A brief but violent scuffle preceded the victim's collapse near the window." } },{ label: '5', x: 70.8, y: 85.6, info: { fr: "Une trace de sang au sol, au cœur de la silhouette à la craie. L'épicentre exact de l'agression mortelle — aucun geste de défense, la victime connaissait son agresseur.", en: "A blood trace on the floor, at the heart of the chalk outline. The exact epicentre of the fatal blow — no defensive wound : the victim knew the assailant." } },{ label: '6', x: 78.2, y: 86.3, info: { fr: "Un fragment de papier froissé, à côté du corps sur le tapis. Des chiffres ou inscriptions énigmatiques — la première vraie énigme à élucider pour la suite de l'enquête.", en: "A crumpled piece of paper, beside the body on the carpet. Numbers or cryptic markings — the first real enigma to solve for the rest of the investigation." } }] }, text: { fr: "Examinez la pièce avant de poser vos questions, souffle le partenaire.", en: "Examine the room before asking questions." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Le carnet déchiré révèle des pages manquantes. En les reconstituant, vous découvrez des versements réguliers à un certain « V.K. »", en: "The torn ledger reveals missing pages. By reassembling them, you discover regular payments to a certain \"V.K.\"." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Votre partenaire vous observe : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »", en: "Your partner watches you : \"Are you onto something? These clues are forming a motive. Let's continue.\"" } }
        ]
    });

    /* ===== ACTE 1 — Phase 1 : INTERROGATOIRES AU MANOIR ===== */
    PHASES.push({
        id: 'act1_1',
        label: { fr: 'Interrogatoires', en: 'Interrogations' },
        act: 'Acte 1',
        type: 'dialogue',
        music: 'recherche',
        pages: [
            { decor: 'residence', npc: 'protecteur', text: { fr: "Le Major Hale, garde du corps et majordome en chef, vous accueille dans le salon du manoir avec un mélange de nervosité et d'arrogance. « Je vous ai attendu. La maison est en deuil, faites vite. »\n\nVous l'observez : « Vous sembliez proche de la victime. Quel genre d'homme était-il, ces derniers temps ? »\n\nHale hésite : « Distant. Rêveur. Il parlait souvent de changer le testament. Je n'y ai pas prêté attention — c'est l'affaire de Blackwood. »\n\n[Indice Témoin] Hale mentionne le testament et Blackwood spontanément. À retenir.", en: "Major Hale, bodyguard and chief butler, greets you in the manor lounge with a mix of nervousness and arrogance. \"I've been expecting you. The house is in mourning, make it quick.\"\n\nYou observe him: \"You seemed close to the victim. What kind of man was he, lately?\"\n\nHale hesitates: \"Distant. A dreamer. He often spoke of changing his will. I didn't pay much attention — that's Blackwood's business.\"\n\n[Witness clue] Hale mentions the will and Blackwood spontaneously. Keep it in mind." } },
            { decor: 'residence', npc: 'femme-fatale', text: { fr: "Lady Vivienne, d'une voix posée dans le boudoir : « Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. »\n\nVous la testez : « Votre mari voyait d'autres femmes ? »\n\nElle sourit froidement : « Nous avions nos arrangements. Je n'étais pas dupe — il non plus. »\n\n[Indice Mobile] Vivienne parle d'arrangements. Aucune émotion visible : à creuser.", en: "Lady Vivienne, in a calm voice in the boudoir: \"My husband had enemies, certainly. But the perpetrator… it's someone from the house.\"\n\nYou test her: \"Did your husband see other women?\"\n\nShe smiles coldly: \"We had our arrangements. I wasn't fooled — neither was he.\"\n\n[Motive clue] Vivienne speaks of arrangements. No visible emotion: to dig further." } },
            { decor: 'residence', npc: 'detective-partner', minigame: { type: 'montre_code', time: 45, title: { fr: "La Montre du Duc", en: "The Duke's Watch" }, desc: { fr: "Examinez la montre pour trouver l'heure du crime et un code secret.", en: "Examine the watch to find the time of death and a secret code." }, clue: { fr: "L'aiguille figée donne l'heure probable du crime. Le code à 4 chiffres au dos ouvre un coffre.", en: "The frozen hand gives the likely time of death. The 4-digit code on the back opens a safe." }, sceneImage: "assets/image true detective/lieux/classic/scene de crime manoir.png" }, text: { fr: "La montre du Duc gît sur la table du salon, brisée. « Elle a dû valser dans la bagarre, soupire Wexford. Voyez ce qu'elle peut encore nous apprendre. »\n\nAprès examen : « Bien. Maintenant, qui interroger en premier ? Blackwood, le notaire ? Ou ce témoin dans la ruelle ? Pembrooke, l'ami, est sans doute au bar. »", en: "The Duke's watch lies on the lounge table, broken. \"It must have flown off in the struggle,\" Wexford sighs. \"See what it can still tell us.\"\n\nAfter examination: \"Good. Now, who should we question first? Blackwood, the notary? Or the witness in the alley? Pembrooke, the friend, is probably at the bar.\"" } }
        ]
    });

    /* ===== ACTE 1 — Phase 2 : SORTIE ET PREMIERS TÉMOIGNAGES ===== */
    PHASES.push({
        id: 'act1_2',
        label: { fr: 'Témoignages', en: 'Testimonies' },
        act: 'Acte 1',
        type: 'dialogue',
        music: 'reflexion',
        pages: [
            { decor: 'residence', npc: 'detective-partner', text: { fr: "Avant de partir, vous revoyez vos notes avec Wexford dans le vestibule du manoir. « Le clochard de la ruelle a vu quelque chose cette nuit-là. Commençons par lui — un témoin oculaire vaut tous les alibis. »\n\nVous acquiescez : « Et Blackwood, le notaire ? »\n\n« On ira chez lui juste après. Mais un témoin, ça se rafraîchit vite. »", en: "Before leaving, you review your notes with Wexford in the manor vestibule. \"The homeless man in the alley saw something that night. Let's start with him — an eyewitness beats every alibi.\"\n\nYou nod: \"And Blackwood, the notary?\"\n\n\"We'll go to his place right after. But witnesses get cold fast.\"" } },
            { decor: 'alley', npc: 'marginal', text: { fr: "À la sortie du manoir, dans la ruelle adjacente, Silas Crane grelotte dans un coin. Vous l'abordez doucement.\n\n« T'as une pièce, inspecteur ? »\n\nVous lui glissez une monnaie. Il se détend : « Un rôdeur bien habillé est passé par ici vers les 22h. Pressé, nerveux. Il regardait sans arrêt sa montre — une tocante en or, je me souviens. »\n\n[Indice Témoin / Chronologie] Un homme pressé à 22h, montre en or — à corréler avec l'heure de la montre du Duc et l'alibi de Pembrooke.", en: "At the manor exit, in the adjacent alley, Silas Crane is shivering in a corner. You approach him gently.\n\n\"Got a coin, inspector?\"\n\nYou slip him some change. He relaxes: \"A well-dressed prowler passed by here around 10pm. Hurried, nervous. Kept checking his watch — a gold one, I remember.\"\n\n[Witness / Timeline clue] A hurried man at 10pm with a gold watch — to be cross-referenced with the Duke's watch and Pembrooke's alibi." } },
            { decor: 'secretPlace', npc: 'suspect', text: { fr: "Chez Rupert Blackwood, dans son appartement cossu. Il vous ouvre, l'air nerveux.\n\n« Entrez, inspecteur. Je ne sais pas ce que trafique le Duc ces derniers temps, mais les tensions sur le testament se multiplient. J'ai peur que tout cela finisse mal. »\n\nVous le testez : « Vous le connaissiez bien ? »\n\n« Assez pour savoir qu'il voulait déshériter sa femme. Je gère ses affaires — je refuse de tremper dans ça. »\n\n[Indice Mobile / Témoin] Blackwood mentionne la déshérence — il en sait plus qu'il ne le dit.", en: "At Rupert Blackwood's place, in his lavish apartment. He opens the door, looking uneasy.\n\n\"Come in, inspector. I don't know what the Duke has been up to lately, but the tensions around the will keep growing. I'm afraid this will end badly.\"\n\nYou test him: \"Did you know him well?\"\n\n\"Well enough to know he wanted to disinherit his wife. I handle his affairs — I refuse to get mixed up in that.\"\n\n[Motive / Witness clue] Blackwood mentions the disinheritance — he knows more than he lets on." } }
        ]
    });

    /* ===== ACTE 2 — Phase 1 : PISTE DU BAR ===== */
    PHASES.push({
        id: 'act2_1',
        label: { fr: 'Piste du bar', en: 'Bar lead' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'enigme',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', minigame: { type: 'carnet_dechire', time: 50, title: { fr: "Le Carnet déchiré", en: "The Torn Ledger" }, desc: { fr: "Reconstituez les pages arrachées du livre de comptes pour révéler un versement à « V.K. ».", en: "Reassemble the torn ledger pages to reveal a payment to V.K.." }, clue: { fr: "Des versements réguliers à Victor Krane et les empreintes du Major Hale, garde du corps et majordome en chef, sur la mention V.K.", en: "Regular payments to Victor Krane and the fingerprints of Major Hale, bodyguard and chief butler, on the V.K. mention." } }, text: { fr: "Au quartier général, votre partenaire recompte les indices. « Les analyses ADN parleront d'elles-mêmes. Mais d'abord, reconstituons ce carnet. »", en: "At headquarters, your partner tallies the clues. \"The DNA analyses will speak for themselves. But first, let's reassemble this ledger.\"" } },
            { decor: 'bar', npc: 'seducteur', text: { fr: "Julian Pembrooke, au comptoir, esquisse un sourire : « Je n'ai rien vu, rien entendu. Mais si vous cherchez un mobile, regardez du côté des dettes de Hale. »", en: "Julian Pembrooke, at the counter, smiles : \"I saw nothing, heard nothing. But if you're looking for a motive, look into Hale's debts.\"" } },
            { decor: 'headquarters', npc: 'detective-partner', minigame: { type: 'coffre_fort', time: 40, title: { fr: "Le Coffre-fort", en: "The Safe" }, desc: { fr: "Entrez le code du coffre pour accéder aux documents confidentiels.", en: "Enter the safe code to access confidential documents." }, clue: { fr: "Les documents du coffre révèlent les dettes de Blackwood et la liaison de l'épouse.", en: "The safe documents reveal Blackwood's debts and the wife's affair." } }, text: { fr: "De retour au QG, le coffre saisi attend son code. La gravure 1981 est notre meilleure piste.", en: "Back at headquarters, the seized safe awaits its code. The 1981 engraving is our best lead." } }
        ]
    });

    /* ===== ACTE 2 — Phase 2 : ENQUÊTE AU LABORATOIRE ===== */
    PHASES.push({
        id: 'act2_2',
        label: { fr: 'Laboratoire', en: 'Laboratory' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'enigme',
        pages: [
            { decor: 'laboratory', npc: 'scientifique', minigame: { type: 'adn_match', time: 40, title: { fr: "Profil ADN", en: "DNA Profile" }, desc: { fr: "Comparez les échantillons ADN pour identifier l'inconnu.", en: "Compare DNA samples to identify the unknown." }, clue: { fr: "L'ADN inconnue correspond à Victor Krane, le criminel engagé par Hale.", en: "The unknown DNA matches Victor Krane, the criminal hired by Hale." } }, text: { fr: "Au laboratoire, Whitmore vous tend une clé USB : « Les analyses ADN sont sans appel. L'échantillon B appartient au criminel. »", en: "At the laboratory, Whitmore hands you a USB drive : \"The DNA analyses are conclusive. Sample B belongs to the criminal.\"" } },
            { decor: 'laboratory', npc: 'scientifique', minigame: { type: 'cablage_alarme', time: 50, title: { fr: "Le Câblage de l'alarme", en: "The Alarm Wiring" }, desc: { fr: "Réparez le circuit de l'alarme pour prouver l'intrusion.", en: "Repair the alarm circuit to prove the intrusion." }, clue: { fr: "Le câble a été marqué au charbon AVANT le sabotage. Une main avertie a guidé l'intrus.", en: "The cable was marked with charcoal BEFORE the sabotage. A knowing hand guided the intruder." } }, text: { fr: "Whitmore pointe le schéma de l'alarme : « Regardez, ce câble a été marqué au charbon AVANT le sabotage — même signature qu'un outil de garagiste. C'est la même main qui a saboté ce câble et sectionné la durite de Pembrooke. »", en: "Whitmore points at the alarm blueprint : \"Look, this cable was marked with charcoal BEFORE the sabotage — the same signature as a garage tool. The same hand sabotaged this cable and cut Pembrooke's hose.\"" } },
            { decor: 'residence', npc: 'protecteur', text: { fr: "Au manoir, la montre du Duc est intacte. Le Major Hale détourne le regard quand vous la montrez.", en: "At the manor, the Duke's watch is intact. Major Hale looks away when you show it." } }
        ]
    });

    /* ===== ACTE 3 — Phase 1 : TENSION ET TÉMOIN CLÉ ===== */
    PHASES.push({
        id: 'act3_1',
        label: { fr: 'Tension', en: 'Tension' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'tension',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', minigame: { type: 'cryptogramme', time: 50, title: { fr: "Le Cryptogramme", en: "The Cryptogram" }, desc: { fr: "Décodez le message crypté pour révéler une connexion entre les suspects.", en: "Decode the cryptic message to reveal a connection between suspects." }, clue: { fr: "La note de Krane révèle : HALE ENGAGE KRANE. La complicité est établie.", en: "Krane's note reveals: HALE HIRES KRANE. The collusion is proven." } }, text: { fr: "Au quartier général, votre partenaire recompte les indices. « L'ADN parle d'elle-même. Mais d'abord, reconstituons ce carnet. »", en: "At headquarters, your partner tallies the clues. \"DNA speaks for itself. But first, let's reassemble this ledger.\"" } },
            { decor: 'residence', npc: 'femme-fatale', text: { fr: "Les fichiers du coffre contiennent des documents confidentiels : Lady Vivienne trompait la victime avec Hale.", en: "The safe's files contain confidential documents : Lady Vivienne was cheating on the victim with Hale." } },
            { decor: 'residence', npc: 'protecteur', text: { fr: "Le Major Hale refuse de coopérer : « Je n'ai rien dit de tout cela ! Vous n'avez aucune preuve ! »", en: "Major Hale refuses to cooperate : \"I said none of this! You have no proof!\"" } }
        ]
    });

    /* ===== ACTE 3 — Phase 2 : RÉVÉLATION ===== */
    PHASES.push({
        id: 'act3_2',
        label: { fr: 'Révélation', en: 'Revelation' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'tension',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "« Attendez… » Votre partenaire fronce les sourcils au quartier général. « On a la même signature d'outil sur le câble d'alarme et sur la durite. Or, Pembrooke n'a pas accès au système d'alarme. C'est Hale qui l'a guidé. »", en: "\"Wait…\" Your partner frowns at headquarters. \"We have the same tool signature on the alarm cable and on the hose. Pembrooke doesn't have access to the alarm system. Hale guided him.\"" } },
            { decor: 'secretPlace', npc: 'marginal', text: { fr: "Chez le marginal, Silas Crane, sous pression, avoue : « Blackwood m'a payé pour mentir. Le rôdeur, c'était Pembrooke. »", en: "At the homeless man's place, Silas Crane, under pressure, confesses : \"Blackwood paid me to lie. The prowler was Pembrooke.\"" } },
            { decor: 'alley', npc: 'criminel', text: { fr: "Dans la ruelle, le téléphone de Hale sonne. C'est Krane : « Tu m'as payé pour le meurtre. C'est fini. »", en: "In the alley, Hale's phone rings. It's Krane : \"You paid me for the murder. It's over.\"" } }
        ]
    });

    /* ===== ACTE 3 — Phase 3 : RÉVÉLATION FINALE ===== */
    PHASES.push({
        id: 'act3_3',
        label: { fr: 'Révélation finale', en: 'Final Revelation' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'stress',
        pages: [
            { decor: 'alley', npc: 'criminel', text: { fr: "Dans la ruelle, sous la pression, Victor Krane avoue en partie : « Je ne connaissais pas la victime par hasard. C'est Hale qui m'a contacté. »", en: "In the alley, under pressure, Victor Krane half confesses : \"I didn't know the victim by chance. Hale contacted me.\"" } },
            { decor: 'residence', npc: 'protecteur', text: { fr: "Au manoir, le Major Hale se contredit soudain : il décrit la mare de sang avec trop de précision.", en: "At the manor, Major Hale suddenly contradicts himself : he describes the pool of blood with too much precision." } },
            { decor: 'headquarters', npc: 'detective-partner', choices: [
                { label: { fr: 'Accuser le Major Hale', en: 'Accuse Major Hale' }, id: 'protecteur', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Lady Vivienne', en: 'Accuse Lady Vivienne' }, id: 'femme-fatale', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Julian Pembrooke', en: 'Accuse Julian Pembrooke' }, id: 'seducteur', choiceKey: 'accuser' }
            ], text: { fr: "Au quartier général, le moment est venu. Votre partenaire vous tend le dossier. Qui accusez-vous ?", en: "At headquarters, the time has come. Your partner hands you the file. Who do you accuse?" } }
        ]
    });

    /* ===== OUTRO — ÉPILOGUE ===== */
    PHASES.push({
        id: 'outro',
        label: { fr: 'Épilogue', en: 'Epilogue' },
        act: 'Outro',
        type: 'outro',
        music: 'theme',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "L'affaire est classée. Le vrai coupable croupit en prison, le mobile était l'argent, la méthode, la trahison.", en: "Case closed. The real culprit is in prison, the motive was money, the method, betrayal." } },
            { decor: 'universe', text: { fr: "La ville murmure à nouveau sous la pluie. Une autre affaire vous attend, mais celle-ci est résolue.", en: "The city whispers again under the rain. Another case awaits you, but this one is solved." } },
            { decor: 'universe', text: { fr: "FIN — True Detective.", en: "END — True Detective." } }
        ]
    });

    global.TDPhases = PHASES;

})(typeof globalThis !== 'undefined' ? globalThis : this);
