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
            { decor: 'crimeScene', npc: 'detective-partner', minigame: { type: 'scene_fouille', wide: true, title: { fr: "Fouille de la scène", en: "Scene search" }, desc: { fr: "Balayez la scène à la loupe. Chaque pièce à conviction numérotée ouvre une fenêtre : examinez-les toutes.", en: "Sweep the scene with the magnifier." }, time: 60, sceneImage: "assets/image true detective/lieux/classic/scene de crime manoir.png", hotspots: [{ label: 'A', x: 11.6, y: 66.1, info: { fr: "Le sceau en or et son cachet posés à l'extrême gauche du bureau. Matériel de correspondance intact, prouvant que le bureau n'a pas été saccagé au hasard et que l'intrus connaissait les lieux ou possédait les accès.", en: "The gold seal and its stamp placed at the far left of the desk. Intact correspondence material, proving that the desk was not ransacked randomly and that the intruder knew the premises or had access." } },{ label: 'B', x: 24.1, y: 70.4, info: { fr: "L'encrier central et son bloc d'écriture. Situé au centre du bureau, il témoigne de la zone où la victime rédigeait ses documents avant l'altercation.", en: "The central inkwell and its writing block. Located at the center of the desk, it testifies to the area where the victim was writing his documents before the altercation." } },{ label: '1', x: 31.2, y: 56.8, info: { fr: "Les papiers administratifs et la plume ouverte sur le bureau. Papiers éparpillés sur le coin gauche du bureau, signalant qu'une recherche rapide ou une consultation de documents a eu lieu.", en: "Administrative papers and the open quill on the desk. Scattered papers on the left corner of the desk, indicating that a quick search or document consultation took place." } },{ label: '2', x: 38.6, y: 57.3, info: { fr: "Les deux verres de vin dressés et la petite coupelle. Témoigne clairement de la présence d'un invité de confiance que la victime attendait pour boire un verre.", en: "The two standing wine glasses and the small saucer. Clearly testifies to the presence of a trusted guest whom the victim was expecting to have a drink with." } },{ label: '3', x: 47.2, y: 58.3, info: { fr: "Le livre ouvert et taché de sang près de la lampe de bureau. Registre ou journal de bord maculé de taches de sang, suggérant une lutte ou un accès brutal survenu en plein travail.", en: "The open book stained with blood near the desk lamp. Register or logbook smeared with bloodstains, suggesting a struggle or brutal access that occurred during work." } },{ label: '4', x: 66.4, y: 79.2, info: { fr: "Le fauteuil de bureau renversé et couché à l'envers sur le tapis. Témoigne d'une bousculade violente et d'une lutte brève juste avant que la victime ne s'effondre près de la fenêtre.", en: "The overturned office chair lying upside down on the carpet. Testifies to a violent scuffle and brief struggle just before the victim collapsed near the window." } },{ label: '5', x: 70.8, y: 85.6, info: { fr: "La trace de sang au sol au cœur de la silhouette à la craie. L'épicentre de l'agression mortelle, marquant l'endroit exact de l'homicide.", en: "The blood trace on the floor at the heart of the chalk silhouette. The epicenter of the fatal assault, marking the exact location of the homicide." } },{ label: '6', x: 78.2, y: 86.3, info: { fr: "Le fragment de papier froissé à côté du corps sur le tapis. Un simple bout de papier chiffonné portant des chiffres ou des inscriptions énigmatiques, posant la première véritable énigme mystérieuse à élucider pour la suite de l'enquête.", en: "The crumpled piece of paper next to the body on the carpet. A simple crumpled piece of paper bearing numbers or enigmatic inscriptions, posing the first true mysterious enigma to elucidate for the rest of the investigation." } }] }, text: { fr: "Examinez la pièce avant de poser vos questions, souffle le partenaire.", en: "Examine the room before asking questions." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Le carnet déchiré révèle des pages manquantes. En les reconstituant, vous découvrez des versements réguliers à un certain « V.K. »", en: "The torn ledger reveals missing pages. By reassembling them, you discover regular payments to a certain \"V.K.\"." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Votre partenaire vous observe : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »", en: "Your partner watches you : \"Are you onto something? These clues are forming a motive. Let's continue.\"" } }
        ]
    });

    /* ===== ACTE 1 — Phase 1 : CONFRONTATION AU MANOIR ===== */
    PHASES.push({
        id: 'act1_1',
        label: { fr: 'Confrontation', en: 'Confrontation' },
        act: 'Acte 1',
        type: 'dialogue',
        music: 'recherche',
        pages: [
            { decor: 'residence', npc: 'protecteur', text: { fr: "Le Major Hale, garde du corps et majordome en chef, vous accueille dans le salon du manoir avec un mélange de nervosité et d'arrogance. « Je vous ai attendu. La maison est en deuil, faites vite. »", en: "Major Hale, bodyguard and chief butler, greets you in the manor lounge with a mix of nervousness and arrogance. \"I've been expecting you. The house is in mourning, make it quick.\"" } },
            { decor: 'residence', npc: 'femme-fatale', text: { fr: "Lady Vivienne, d'une voix posée dans le boudoir : « Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. »", en: "Lady Vivienne, in a calm voice in the boudoir : \"My husband had enemies, certainly. But the perpetrator… it's someone from the house.\"" } },
            { decor: 'crimeScene', npc: 'detective-partner', minigame: { type: 'montre_code', time: 45, title: { fr: "La Montre du Duc", en: "The Duke's Watch" }, desc: { fr: "Examinez la montre pour trouver l'heure du crime et un code secret.", en: "Examine the watch to find the time of death and a secret code." }, clue: { fr: "L'aiguille figée à 22h09 indique l'heure probable du crime. La gravure 1981 sert au coffre.", en: "The frozen hand at 10:09pm indicates the probable time of death. The engraving 1981 is for the safe." }, sceneImage: "assets/image true detective/lieux/classic/scene de crime manoir.png" }, text: { fr: "Votre partenaire vous montre la montre : « Si on pouvait lire l'heure exacte, on aurait le moment du crime. »", en: "Your partner shows you the watch : \"If we could read the exact time, we'd have the moment of the crime.\"" } }
        ]
    });

    /* ===== ACTE 1 — Phase 2 : PREMIERS TÉMOIGNAGES ===== */
    PHASES.push({
        id: 'act1_2',
        label: { fr: 'Témoignages', en: 'Testimonies' },
        act: 'Acte 1',
        type: 'dialogue',
        music: 'reflexion',
        pages: [
            { decor: 'alley', npc: 'marginal', text: { fr: "« Intéressant… » murmurez-vous. Dans la ruelle, Silas Crane prétend avoir vu un rôdeur bien habillé aux alentours de 22h.", en: "\"Interesting…\" you murmur. In the alley, Silas Crane claims to have seen a well-dressed prowler around 10pm." } },
            { decor: 'residence', text: { fr: "Le coffre-fort est vide, mais les montants sont énormes : 50 000 £ en espèces.", en: "The safe is empty, but the amounts are huge : £50,000 in cash." } },
            { decor: 'secretPlace', npc: 'suspect', text: { fr: "Rupert Blackwood, chez lui, est hors de lui : « Quelqu'un a vidé les comptes ! Le testament a été modifié la semaine dernière. »", en: "Rupert Blackwood, at his place, is frantic : \"Someone drained the accounts! The will was changed last week.\"" } }
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
            { decor: 'headquarters', npc: 'detective-partner', minigame: { type: 'carnet_dechire', time: 50, title: { fr: "Le Carnet déchiré", en: "The Torn Ledger" }, desc: { fr: "Reconstituez les pages arrachées du livre de comptes pour révéler un versement à « V.K. ».", en: "Reassemble the torn ledger pages to reveal a payment to V.K.." }, clue: { fr: "Des versements réguliers à Victor Krane et les empreintes du Major Hale sur la mention V.K.", en: "Regular payments to Victor Krane and Major Hale's fingerprints on the V.K. mention." } }, text: { fr: "Au quartier général, votre partenaire recompte les indices. « L'ADN parle d'elle-même. Mais d'abord, reconstituons ce carnet. »", en: "At headquarters, your partner tallies the clues. \"DNA speaks for itself. But first, let's reassemble this ledger.\"" } },
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
            { decor: 'laboratory', npc: 'scientifique', minigame: { type: 'adn_match', time: 40, title: { fr: "Profil ADN", en: "DNA Profile" }, desc: { fr: "Comparez les échantillons ADN pour identifier l'inconnu.", en: "Compare DNA samples to identify the unknown." }, clue: { fr: "L'ADN inconnue correspond à Victor Krane, le criminel engagé par Hale.", en: "The unknown DNA matches Victor Krane, the criminal hired by Hale." } }, text: { fr: "Au laboratoire, Whitmore vous tend une clé USB : « Les données ADN sont claires. L'échantillon B appartient au criminel. »", en: "At the laboratory, Whitmore hands you a USB drive : \"The DNA data is clear. Sample B belongs to the criminal.\"" } },
            { decor: 'laboratory', npc: 'scientifique', minigame: { type: 'cablage_alarme', time: 50, title: { fr: "Le Câblage de l'alarme", en: "The Alarm Wiring" }, desc: { fr: "Réparez le circuit de l'alarme pour prouver l'intrusion.", en: "Repair the alarm circuit to prove the intrusion." }, clue: { fr: "Le câble a été marqué au charbon AVANT le sabotage. Une main avertie a guidé l'intrus.", en: "The cable was marked with charcoal BEFORE the sabotage. A knowing hand guided the intruder." } }, text: { fr: "Whitmore pointe le schéma de l'alarme : « Regardez, ce câble a été marqué au charbon AVANT le sabotage. »", en: "Whitmore points at the alarm blueprint : \"Look, this cable was marked with charcoal BEFORE the sabotage.\"" } },
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
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "« Attendez… » Votre partenaire fronce les sourcils au quartier général. « Si la durite a été coupée, alors Hale savait où et quand aider Pembrooke. »", en: "\"Wait…\" Your partner frowns at headquarters. \"If the hose was cut, then Hale knew where and when to help Pembrooke.\"" } },
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
