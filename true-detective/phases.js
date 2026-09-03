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
            { decor: 'residence', npc: 'detective-partner', minigame: { type: 'timeline', time: 40, order: [
                { fr: "19h00 — La victime dîne avec Blackwood : conversation d'argent", en: "7:00pm — The victim dines with Blackwood : a money talk" },
                { fr: "20h30 — Pembrooke passe pour un dernier verre, puis s'éclipse", en: "8:30pm — Pembrooke drops by for a last drink, then slips away" },
                { fr: "22h00 — Hale quitte prétendument le manoir pour dépanner Pembrooke", en: "10:00pm — Hale supposedly leaves the manor to help Pembrooke" },
                { fr: "22h09 — L'aiguille de la montre du Duc se fige", en: "10:09pm — The Duke's watch hand freezes" }
            ], title: { fr: "La Chronologie", en: "The Timeline" }, desc: { fr: "Reconstituez la chronologie de la soirée, du dîner à la minute fatale.", en: "Rebuild the evening's timeline, from dinner to the fatal minute." }, clue: { fr: "La chronologie révèle le trou : Hale prétendait dépanner Pembrooke à 22h, mais le rôdeur et le verrou le placent sur les lieux à 22h09.", en: "The timeline reveals the gap : Hale claimed to be helping Pembrooke at 10pm, but the prowler and the lock place him on scene at 10:09pm." } }, text: { fr: "Avant de partir, vous revoyez vos notes avec Wexford dans le vestibule du manoir. « Le clochard de la ruelle a vu quelque chose cette nuit-là. Mais passons d'abord chez Blackwood, le notaire — il gérait les affaires du Duc. Et le clochard, on l'interceptera au retour. »", en: "Before leaving, you review your notes with Wexford in the manor vestibule. \"The homeless man in the alley saw something that night. But let's stop by Blackwood's, the notary — he handled the Duke's affairs. We'll catch the homeless man on the way back.\"" } },
            { decor: 'secretPlace', npc: 'suspect', text: { fr: "Chez Rupert Blackwood, dans son appartement cossu. Il vous ouvre, l'air nerveux.\n\n« Entrez, inspecteur. Je ne sais pas ce que trafique le Duc ces derniers temps, mais les tensions sur le testament se multiplient. J'ai peur que tout cela finisse mal. »\n\nVous le testez : « Vous le connaissiez bien ? »\n\n« Assez pour savoir qu'il voulait déshériter sa femme. Je gère ses affaires — je refuse de tremper dans ça. »\n\n[Indice Mobile / Témoin] Blackwood mentionne la déshérence — il en sait plus qu'il ne le dit.", en: "At Rupert Blackwood's place, in his lavish apartment. He opens the door, looking uneasy.\n\n\"Come in, inspector. I don't know what the Duke has been up to lately, but the tensions around the will keep growing. I'm afraid this will end badly.\"\n\nYou test him: \"Did you know him well?\"\n\n\"Well enough to know he wanted to disinherit his wife. I handle his affairs — I refuse to get mixed up in that.\"\n\n[Motive / Witness clue] Blackwood mentions the disinheritance — he knows more than he lets on." } },
            { decor: 'alley', npc: 'marginal', text: { fr: "Sur le chemin du retour, à la sortie du manoir, dans la ruelle adjacente, Silas Crane grelotte dans un coin. Vous l'abordez doucement.\n\n« T'as une pièce, inspecteur ? »\n\nVous lui glissez une monnaie. Il se détend : « Un rôdeur bien habillé est passé par ici vers les 22h. Pressé, nerveux. Il regardait sans arrêt sa montre — une tocante en or, je me souviens. »\n\n[Indice Témoin / Chronologie] Un homme pressé à 22h, montre en or — à corréler avec l'heure de la montre du Duc et l'alibi de Pembrooke.", en: "On the way back, at the manor exit, in the adjacent alley, Silas Crane is shivering in a corner. You approach him gently.\n\n\"Got a coin, inspector?\"\n\nYou slip him some change. He relaxes: \"A well-dressed prowler passed by here around 10pm. Hurried, nervous. Kept checking his watch — a gold one, I remember.\"\n\n[Witness / Timeline clue] A hurried man at 10pm with a gold watch — to be cross-referenced with the Duke's watch and Pembrooke's alibi." } }
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
            { decor: 'barInterieur', npc: 'seducteur', text: { fr: "À l'intérieur du bar, la fumée stagne sous les néons. Vous vous installez au comptoir, à côté de Julian Pembrooke.\n— Monsieur Pembrooke. On vous a vu avec la victime la veille de sa mort. Comment l'expliquez-vous ?\nPembrooke fait tourner son verre sans y porter les lèvres.\n— On m'a vu, c'est vrai. Un dernier verre, un dernier adieu entre amis. Rien de plus.\n— Votre alibi de la panne est mince, monsieur.\n— Mince, peut-être. Mais si vous cherchez un mobile, inspecteur, ne vous tournez pas vers moi. Regardez du côté des dettes du Major Hale.\n— Des dettes ? Hale est un homme d'honneur.\n— L'honneur ne rembourse pas 12 000 £, inspecteur. Et demandez donc au barman qui servait Hale, ce soir-là, après ma panne...", en: "Inside the bar, smoke lingers under the neon lights. You sit at the counter, next to Julian Pembrooke.\n— Mr. Pembrooke. You were seen with the victim the day before his death. How do you explain that ?\nPembrooke spins his glass without raising it to his lips.\n— I was seen, true. One last drink, one last farewell between friends. Nothing more.\n— Your breakdown alibi is thin, sir.\n— Thin, perhaps. But if you're looking for a motive, inspector, don't look at me. Look into Major Hale's debts.\n— Debts ? Hale is a man of honour.\n— Honour doesn't repay £12,000, inspector. And ask the bartender who served Hale that night, after my breakdown..." } },
            { decor: 'headquarters', npc: 'detective-partner', minigame: { type: 'coffre_code', time: 40, evidence: 'mobile', title: { fr: "Le Coffre-fort", en: "The Safe" }, desc: { fr: "Entrez le code du coffre pour accéder aux documents confidentiels.", en: "Enter the safe code to access confidential documents." }, clue: { fr: "Les documents du coffre révèlent les dettes de Blackwood et la liaison de l'épouse.", en: "The safe documents reveal Blackwood's debts and the wife's affair." } }, text: { fr: "De retour au QG, le coffre saisi attend son code. La gravure au dos de la montre est notre meilleure piste.", en: "Back at headquarters, the seized safe awaits its code. The engraving on the back of the watch is our best lead." } }
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
            { decor: 'laboratory', npc: 'scientifique', minigame: { type: 'adn_match', time: 40, evidence: 'forensic', samples: [
                { fr: "Échantillon A — la victime", en: "Sample A — the victim" },
                { fr: "Échantillon B — l'inconnu de la scène", en: "Sample B — the scene's unknown" },
                { fr: "Échantillon C — le Major Hale", en: "Sample C — Major Hale" }
            ], profiles: [
                { fr: "Profil du Major Hale", en: "Major Hale's profile" },
                { fr: "Profil de Victor Krane", en: "Victor Krane's profile" },
                { fr: "Profil de Julian Pembrooke", en: "Julian Pembrooke's profile" }
            ], match: 1, title: { fr: "Profil ADN", en: "DNA Profile" }, desc: { fr: "Comparez les échantillons ADN pour identifier l'inconnu.", en: "Compare DNA samples to identify the unknown." }, clue: { fr: "L'ADN inconnue correspond à Victor Krane, le criminel engagé par Hale.", en: "The unknown DNA matches Victor Krane, the criminal hired by Hale." } }, text: { fr: "Au laboratoire, Whitmore vous tend une clé USB : « Les analyses ADN sont sans appel. L'échantillon B appartient au criminel. »", en: "At the laboratory, Whitmore hands you a USB drive : \"The DNA analyses are conclusive. Sample B belongs to the criminal.\"" } },
            { decor: 'laboratory', npc: 'scientifique', minigame: { type: 'image_puzzle', time: 60, asset: 'mini-games/puzzle/alarm-circuit-blueprint.png.png', rows: 3, cols: 3, title: { fr: "Le Schéma déchiré", en: "The Torn Blueprint" }, desc: { fr: "Le schéma de l'alarme a été découpé en morceaux. Cliquez sur deux tuiles pour les échanger et reconstituer le circuit.", en: "The alarm blueprint has been cut to pieces. Click two tiles to swap them and rebuild the circuit." }, clue: { fr: "Le câble a été marqué au charbon AVANT le sabotage. Une main avertie a guidé l'intrus.", en: "The cable was marked with charcoal BEFORE the sabotage. A knowing hand guided the intruder." } }, text: { fr: "Whitmore vous tend le schéma de l'alarme, découpé en morceaux : « Quelqu'un a voulu le détruire. Reconstituez-le, et vous verrez ce que le câble raconte. »", en: "Whitmore hands you the alarm blueprint, cut to pieces : \"Someone tried to destroy it. Reassemble it, and you will see what the cable tells.\"" } },
            { decor: 'laboratory', npc: 'scientifique', minigame: { type: 'labo_verrou', time: 45, evidence: 'opportunity', hotspots: [
                { x: 32, y: 42, correct: true }, { x: 56, y: 36, correct: false }, { x: 68, y: 55, correct: true },
                { x: 46, y: 62, correct: false }, { x: 26, y: 68, correct: false }
            ], title: { fr: "Le Verrou thermal", en: "The Thermal Lock" }, desc: { fr: "Le verrou du manoir passe sous caméra thermique. Sondez les zones : lesquelles portent une chaleur résiduelle ?", en: "The manor lock goes under the thermal camera. Probe the spots : which bear residual heat ?" }, clue: { fr: "Le verrou s'est ouvert avec une clé, pas forcé : accès au trousseau du garde du corps Hale. Chaleur datée 22h.", en: "The lock opened with a key, not forced : access to bodyguard Hale's keys. Heat dated 10pm." } }, text: { fr: "Dernière analyse au laboratoire : le rapport toxicologique ne montre aucune trace de lutte, et le verrou du manoir passe sous caméra thermique. « Ce verrou a tourné à 22h — avec une clé. Personne n'a forcé cette porte. »", en: "Last analysis at the laboratory : the toxicology report shows no sign of struggle, and the manor lock goes under the thermal camera. \"This lock turned at 10pm — with a key. No one forced that door.\"" } }
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
            { decor: 'residence', npc: 'femme-fatale', minigame: { type: 'pression', time: 45, evidence: 'witness', asset: 'mini-games/interrogatoire/veronique-interro.jpg', order: [
                { fr: "Les menaces de mort reçues par la victime", en: "The death threats received by the victim" },
                { fr: "L'écriture élégante de la lettre à moitié brûlée", en: "The elegant hand of the half-burned letter" },
                { fr: "Le codicille qui vous raye du testament", en: "The codicil cutting you from the will" },
                { fr: "Votre liaison avec le Major Hale", en: "Your affair with Major Hale" }
            ], title: { fr: "Interrogatoire sous pression", en: "Interrogation under Pressure" }, desc: { fr: "Confrontez Lady Vivienne, dans le bon ordre, avec chaque élément du dossier.", en: "Confront Lady Vivienne, in the right order, with each piece of the file." }, clue: { fr: "Sous pression, Lady Vivienne craque : les menaces sont de sa main, mais elle jure qu'elle n'était pas au manoir cette nuit-là. Sa liaison avec Hale, elle, est confirmée.", en: "Under pressure, Lady Vivienne cracks : the threats are in her hand, but she swears she wasn't at the manor that night. Her affair with Hale is confirmed." } }, text: { fr: "Les fichiers du coffre contiennent des documents confidentiels : Lady Vivienne trompait la victime avec Hale. Vous la convoquez pour un interrogatoire musclé.", en: "The safe's files contain confidential documents : Lady Vivienne was cheating on the victim with Hale. You summon her for a hard interrogation." } },
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
            { decor: 'headquarters', npc: 'detective-partner', minigame: { type: 'cable_match', time: 50, evidence: 'opportunity', wires: [
                { fr: "Le fil de masse, intact", en: "The ground wire, intact" },
                { fr: "Le fil marqué au charbon", en: "The charcoal-marked wire" },
                { fr: "Le fil sectionné nettement", en: "The cleanly severed wire" }
            ], good: [1, 2], writings: [
                { fr: "Écriture lourde, militaire — main de Hale", en: "Heavy, military hand — Hale's writing" },
                { fr: "Écriture élégante, fluide — main de Pembrooke", en: "Elegant, flowing hand — Pembrooke's writing" }
            ], match: 1, title: { fr: "Le Fil du sabotage", en: "The Sabotage Wire" }, desc: { fr: "Identifiez les fils compromis sur la section de câble, puis désignez la main derrière le graffiti.", en: "Identify the compromised wires on the cable section, then name the hand behind the graffiti." }, clue: { fr: "Le graffiti sur le câble n'est pas de la main de Hale : c'est une écriture élégante — celle de Pembrooke. Le séducteur a saboté l'alarme, guidé par le Major.", en: "The graffiti on the cable is not Hale's hand : it's an elegant writing — Pembrooke's. The seducer sabotaged the alarm, guided by the Major." } }, text: { fr: "« Attendez… » Votre partenaire fronce les sourcils au quartier général. « On a la même signature d'outil sur le câble d'alarme et sur la durite. Or, Pembrooke n'a pas accès au système d'alarme. Examinons ce câble de près. »", en: "\"Wait…\" Your partner frowns at headquarters. \"We have the same tool signature on the alarm cable and on the hose. Pembrooke doesn't have access to the alarm system. Let's examine that cable closely.\"" } },
            { decor: 'secretPlace', npc: 'marginal', text: { fr: "Chez le marginal, Silas Crane, sous pression, avoue : « Blackwood m'a payé pour mentir. Le rôdeur, c'était Pembrooke. »", en: "At the homeless man's place, Silas Crane, under pressure, confesses : \"Blackwood paid me to lie. The prowler was Pembrooke.\"" } },
            { decor: 'residence', npc: 'detective-partner', minigame: { type: 'chronos_roue', time: 50, evidence: 'timeline', order: [
                { fr: "Remonter le balancier", en: "Wind up the pendulum" },
                { fr: "Engager le train de roues", en: "Engage the gear train" },
                { fr: "Régler l'aiguille des minutes sur 09", en: "Set the minute hand to 09" },
                { fr: "Abaisser le marteau sur l'heure du choc", en: "Lower the hammer on the strike hour" }
            ], title: { fr: "L'Horloge-mère", en: "The Grandfather Clock" }, desc: { fr: "Remontez l'horloge-mère du pavillon, arrêtée depuis le meurtre, dans l'ordre du mécanisme.", en: "Wind up the pavilion's grandfather clock, stopped since the murder, following the mechanism's order." }, clue: { fr: "L'horloge-mère, remontée, confirme 22h09 : c'est bien à cette minute que le choc a eu lieu.", en: "The grandfather clock, wound up, confirms 10:09pm : that is the very minute of the blow." } }, text: { fr: "Au manoir, l'horloge-mère du grand escalier, arrêtée depuis le drame, est remontée sous vos yeux. Chaque rouage reprend sa course — et le mécanisme rejoue la minute fatale.", en: "At the manor, the grandfather clock of the great staircase, stopped since the tragedy, is wound up before your eyes. Every gear resumes its course — and the mechanism replays the fatal minute." } }
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
            { decor: 'residence', npc: 'protecteur', minigame: { type: 'roue_alibis', time: 45, evidence: 'alibi', title: { fr: "La Roue des alibis", en: "The Alibi Wheel" }, desc: { fr: "Alignez les trois horloges : montre du Duc, horloge-mère, et l'alibi de Hale. Si les aiguilles concordent, l'alibi s'effondre.", en: "Align the three clocks : the Duke's watch, the grandfather clock, and Hale's alibi. If the hands agree, the alibi collapses." }, clue: { fr: "Les trois horloges s'accordent sur 22h09 : l'alibi de panne de Hale est pulvérisé. Le dossier est verrouillé.", en: "The three clocks agree on 10:09pm : Hale's breakdown alibi is shattered. The case is sealed." } }, text: { fr: "Au manoir, le Major Hale se contredit soudain : il décrit la mare de sang avec trop de précision. « Vérifions chaque horloge, souffle votre partenaire. Faites concorder le temps. »", en: "At the manor, Major Hale suddenly contradicts himself : he describes the pool of blood with too much precision. \"Check every clock,\" your partner whispers. \"Make the timelines agree.\"" } },
            { decor: 'headquarters', npc: 'detective-partner', choices: [
                { label: { fr: 'Accuser le Major Hale (garde du corps)', en: 'Accuse Major Hale (bodyguard)' }, id: 'protecteur', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Lady Vivienne (épouse)', en: 'Accuse Lady Vivienne (wife)' }, id: 'femme-fatale', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Julian Pembrooke (ami)', en: 'Accuse Julian Pembrooke (friend)' }, id: 'seducteur', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Rupert Blackwood (notaire)', en: 'Accuse Rupert Blackwood (notary)' }, id: 'suspect', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Silas Crane (le clochard)', en: 'Accuse Silas Crane (the homeless man)' }, id: 'marginal', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Victor Krane (homme de main)', en: 'Accuse Victor Krane (hired hand)' }, id: 'criminel', choiceKey: 'accuser' }
            ], text: { fr: "Au quartier général, le moment est venu. Votre partenaire étale les six dossiers sur la table. Qui accusez-vous ?\n\n— Le Major Hale, garde du corps et majordome en chef.\n— Lady Vivienne, l'épouse.\n— Julian Pembrooke, l'ami d'enfance.\n— Rupert Blackwood, le notaire.\n— Silas Crane, le clochard de la ruelle.\n— Victor Krane, l'homme de main.", en: "At headquarters, the time has come. Your partner spreads the six files on the table. Who do you accuse?\n\n— Major Hale, bodyguard and chief butler.\n— Lady Vivienne, the wife.\n— Julian Pembrooke, the childhood friend.\n— Rupert Blackwood, the notary.\n— Silas Crane, the homeless man from the alley.\n— Victor Krane, the hired hand." } }
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
