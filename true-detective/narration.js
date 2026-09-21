/* =====================================================================
   TRUE DETECTIVE, NARRATION (FICHIER UNIQUE)
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
        page0: { fr: "La ville respire sous la pluie. Les réverbères percent la brume de leurs halos jaunes, les fiacres glissent sur les pavés mouillés, et dans les ruelles, les ombres sont plus longues que les visages. Une cité qui ne pardonne pas l'erreur. Ce soir, elle vous attend.", en: "The city breathes under the rain. Streetlamps pierce the fog with yellow halos, cabs slide on wet cobblestones, and in the alleys, shadows are longer than faces. A city that does not forgive mistakes. Tonight, it waits for you." },
        page1: { fr: "La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie. On vous a confié l'enquête : la plus délicate de votre carrière.", en: "The city whispers under the rain. In a lavish flat, a real-estate magnate was found dead. You have been assigned the case: the most delicate of your career." },
        page2: { fr: "Vous poussez la porte de la scène de crime. Le sang a séché sur le parquet, le coffre est béant, et sur une table gît une montre de poche brisée. Personne ne sait encore quand le magnat est mort : aucune heure n'est établie. C'est à vous de la trouver.", en: "You push open the door of the crime scene. Blood has dried on the floor, the safe gapes open, and on a table lies a broken pocket watch. No one knows yet when the magnat died: no time of death is established. Finding it is your job." },
        page3: { fr: "Votre partenaire vous rejoint, l'air grave : « La victime, un magnat, n'avait qu'un seul domestique : son garde du corps, le Major Hale. C'est lui qui a découvert le corps. L'affaire commence ici. »", en: "Your partner joins you, looking grave: \"The victim, a tycoon, had one servant: his bodyguard, Major Hale. He found the body. The case begins here.\"" }
    };

    N.intro2 = {
        page1: { fr: "« Examinez la pièce avant de poser vos questions », souffle le partenaire.", en: "\"Examine the room before asking questions,\" your partner whispers." },
        page2: { fr: "La montre du Duc gît sur la table du salon, brisée. « Elle a dû valser dans la bagarre, souffle Wexford. Voyez ce qu'elle peut encore nous apprendre. »", en: "The Duke's watch lies on the lounge table, broken. \"It must have flown off in the struggle,\" Wexford sighs. \"See what it can still tell us.\"" },
        page3: { fr: "Le carnet déchiré révèle des pages manquantes. En les reconstituant, vous découvrez des versements réguliers à un certain « V.K. ».\n\nVotre partenaire vous observe : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »", en: "Your partner watches you : \"Are you onto something? These clues are forming a motive. Let's continue.\"" }
    };

    N.act1_1 = {
        page1: { fr: "Le Major Hale vous accueille dans le salon du manoir. Son uniforme est impeccable, mais une goutte de sueur perle à sa tempe. Il se tient droit, les mains croisées derrière le dos.\n\n« Je vous ai attendu, inspecteur. La maison est en deuil, faites vite. »\n\nVous sentez un mélange d'arrogance et de contrôle. Hale se maîtrise, mais ses yeux vous fuient. Choisissez votre angle d'attaque.", en: "Major Hale greets you in the manor lounge. His uniform is impeccable, but a drop of sweat beads at his temple. He stands straight, hands clasped behind his back.\n\n\"I've been expecting you, inspector. The house is in mourning, make it quick.\"\n\nYou sense a mix of arrogance and control. Hale keeps his composure, but his eyes avoid yours. Pick your angle of attack." },
        page2: { fr: "Lady Vivienne vous reçoit dans le boudoir aux rideaux de velours rouge. Elle ne se lève pas. Une tasse de thé fume entre ses doigts gantés.\n\n« Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. Quelqu'un qui connaissait ses habitudes. »\n\nElle vous défie du regard. Lady Vivienne attend votre première question.", en: "Lady Vivienne receives you in the boudoir with blood-red velvet curtains. She does not rise. A teacup smokes between her gloved fingers.\n\n\"My husband had enemies, certainly. But the perpetrator… it's someone from the house. Someone who knew his habits.\"\n\nShe challenges you with her gaze. Lady Vivienne waits for your first question." },
        page3: { fr: "Deux témoignages, deux visages du manoir. Wexford range ses notes. « Hale est trop nerveux, Vivienne trop froide. L'un des deux cache quelque chose, ou tous les deux. Le notaire du Duc tenait les cordons de la bourse, et un témoin a vu une ombre dans la ruelle. Allons les découvrir. »", en: "Two testimonies, two faces of the manor. Wexford files away his notes. \"Hale is too nervous, Vivienne too cold. One of them is hiding something, or both. Notary Blackwood held the Duke's purse strings, and a witness saw a shadow in the alley. Let's go find out.\"" }
    };

    N.act1_2 = {
        page1: { fr: "Dans le vestibule du manoir, Wexford allume une cigarette. Sa main ne tremble pas, mais sa voix est plus basse.\n\n« Le clochard de la ruelle a vu quelque chose cette nuit-là. Mais passons d'abord chez Blackwood, le notaire. Il gérait les affaires du Duc. Et le témoin, on l'interceptera au retour. »", en: "In the manor vestibule, Wexford lights a cigarette. His hand doesn't shake, but his voice is lower.\n\n\"The homeless man in the alley saw something that night. But let's stop by Blackwood's, the notary. He handled the Duke's affairs. We'll catch the witness on the way back.\"" },
        page2: { fr: "Chez Rupert Blackwood, dans son appartement cossu. Il vous ouvre, l'air nerveux.\n\n« Entrez, inspecteur. Je ne sais pas ce que trafique le Duc ces derniers temps, mais les tensions sur le testament se multiplient. J'ai peur que tout cela finisse mal. »\n\nDerrière son bureau de notaire, il paraît fatigué. Il vous fait signe de vous asseoir.", en: "At Rupert Blackwood's place, in his lavish apartment. He opens the door, looking uneasy.\n\n\"Come in, inspector. I don't know what the Duke has been up to lately, but the tensions around the will keep growing. I'm afraid this will end badly.\"\n\nBehind his notary desk, he looks tired. He gestures for you to sit." },
        page3: { fr: "Sur le chemin du retour, à la sortie du manoir, dans la ruelle adjacente, Silas Crane grelotte dans un coin. Vous l'abordez doucement.\n\n« T'as une pièce, inspecteur ? »\n\nVous lui glissez une monnaie. Il se détend, prêt à parler.", en: "On the way back, at the manor exit, in the adjacent alley, Silas Crane is shivering in a corner. You approach him gently.\n\n\"Got a coin, inspector?\"\n\nYou slip him some change. He relaxes, ready to talk." }
    };

    N.act2_1 = {
        page1: { fr: "Au quartier général, votre partenaire recompte les indices. « Les versements à V.K. et les empreintes de Hale sur la mention V.K. sont notre fil conducteur. Mais il nous manque une clé à quatre chiffres. Allons interroger Pembrooke et Krane au bar, capter leur réaction. »", en: "At headquarters, your partner tallies the clues. \"The payments to V.K. and Hale's fingerprints on the V.K. entry are our thread. But we lack a four-digit key. Let's head to the bar and watch Pembrooke and Krane react.\"" },
        page2: { fr: "À l'intérieur du bar, la fumée stagne sous les néons. Vous vous installez au comptoir, à côté de Julian Pembrooke.\n\n- Monsieur Pembrooke. On vous a vu avec la victime la veille de sa mort. Comment l'expliquez-vous ?\n\nPembrooke fait tourner son verre sans y porter les lèvres. Il vous regarde par-dessus, un sourire en coin.\n\n- Je lui devais de l'argent, c'est vrai. Mais je ne l'ai pas tué. Je vous le jure.", en: "Inside the bar, smoke lingers under the neon lights. You sit at the counter, next to Julian Pembrooke.\n\n- Mr. Pembrooke. You were seen with the victim the day before his death. How do you explain that ?\n\nPembrooke spins his glass without raising it to his lips. He glances at you from under his brow, a wry smile.\n\n- I owed him money, that's true. But I didn't kill him. I swear it." },
        page3: { fr: "Dehors, sous la lumière crue des réverbères, Victor Krane se tient devant l'entrée du bar, le curedent entre les dents. L'air frais de la nuit lui redonne un peu de nervosité.\n\n- Monsieur Krane. Vous étiez dans le quartier cette nuit-là. Dites-moi tout.\n\nKrane ricane, mais son regard fuit brièvement.", en: "Outside, under the harsh light of the streetlamps, Victor Krane stands by the bar entrance, a toothpick between his teeth. The cool night air makes him a little nervous.\n\n- Mr. Krane. You were in the neighborhood that night. Tell me everything.\n\nKrane snorts, but his gaze darts away briefly." }
    };

    N.act2_2 = {
        page1: { fr: "Au laboratoire, la lumière est stérile et froide. Les grilles d'analyse lumineuses scintillent au-dessus des paillasses. Le docteur Whitmore relève la tête de ses lunettes, le visage grave.\n\n« Inspecteur, les analyses sont sans appel. L'ADN relevé sur l'arme du crime et sur le battant de la porte... ne désigne pas un coupable. Il les désigne tous. Des traces infimes de chaque suspect ont été retrouvées sur les lieux. »\n\nIl pose un dossier épais sur la table.\n\n« La scène a été touchée, manipulée, fréquentée par chacun d'eux. Il va falloir les confronter directement chez eux, dans leurs décors, pour voir comment ils réagissent. Cherchez la faille dans leurs alibis. »", en: "At the laboratory, the light is sterile and cold. The luminous analysis grids flicker above the benches. Dr. Whitmore looks up from his glasses, his face grave.\n\n\"Inspector, the analyses are conclusive. The DNA found on the murder weapon and on the door frame... does not point to one killer. It points to all of them. Minute traces of each suspect were found at the scene.\"\n\nHe places a thick folder on the table.\n\n\"The scene has been touched, manipulated, frequented by every one of them. You will need to confront them directly, in their own surroundings, to see how they react. Find the flaw in their alibis.\"" }
    };

    N.act2_3 = {
        page1: { fr: "Au manoir, le Major Hale ajuste ses gants blancs. « Je... je venais simplement m'assurer que le mobilier de sa Seigneurie était intact. Il conservait des documents d'importance dans sa cachette derrière les boiseries... ses affaires privées, quoi. »", en: "At the manor, Major Hale adjusts his white gloves. \"I... I was simply making sure his Lordship's furniture was untouched. He kept documents of importance in his hiding place behind the paneling... his private affairs, really.\"" },
        page2: { fr: "Dans le boudoir, Vivienne sourit : « Ce manoir est un moulin. Même mon mari verrouillait ses petits secrets dans ce fichu coffre mural de son bureau. Quelle paranoïa. »", en: "In the boudoir, Vivienne smiles: \"This manor is a mill. Even my husband locked his little secrets away in that damned wall safe in his office. Such paranoia.\"" },
        page3: { fr: "Au bar, Pembrooke essuie un verre, les mains moites : « Il gardait des reçus de mes traites dans un coffre chez lui, mais je vous jure que je n'y ai pas touché... je savais qu'il y cachait des papiers importants, c'est tout ! » Son œil dérape vers la machine à sous coinçée entre deux tonneaux. Son seul vice, son seul repère.", en: "At the bar, Pembrooke wipes a glass, hands clammy: \"He kept receipts from my installments in a safe at his place, but I swear I didn't touch it... I knew he hid important papers there, that's all!\" His eye drifts to the slot machine wedged between two barrels. His only vice, his only landmark.\"" },
        page4: { fr: "Chez Blackwood, le notaire transpire : « Le magnat conservait ses actes de fiducie dans son coffre privé. Si ce coffre a été vidé, je suis ruiné, mais je n'y suis pour rien ! » Sur son bureau, une grille de sudoku encore vierge, tracée à l'encre et à la règle. « Moi, je ne crois qu'aux chiffres. »", en: "At Blackwood's, the notary sweats: \"The magnate kept his trust deeds in his private safe. If that safe was emptied, I'm ruined, but I had nothing to do with it!\" On his desk, a still-blank sudoku grid, ruled in ink. \"I believe in figures only.\"" },
        page5: { fr: "Dans sa mansarde, Silas Crane ricane : « Regardez ce que les riches cachent derrière leurs tableaux. J'ai vu des gens lorgner sur ce satané coffre mural comme des corbeaux sur une charogne. »", en: "In his garret, Silas Crane snickers: \"Look at what the rich hide behind their paintings. I've seen people eyeing that damned wall safe like crows on carrion.\"" },
        page6: { fr: "Dans la ruelle, Krane crache par terre : « Demandez-vous plutôt ce qui a disparu de son coffre-fort personnel. Un contrat de cette envergure ne se laisse pas traîner au milieu d'un salon sans être enfermé sous double clef. » Il étale d'un geste un damier de cartes retournées. « Retenez où passent les noms, inspecteur. La mémoire, c'est mon métier. »", en: "In the alley, Krane spits on the ground: \"Ask yourself what disappeared from his personal safe. A contract of that magnitude doesn't get left out in a sitting room without being locked under double key.\" With one gesture he spreads a grid of face-down cards. \"Remember where the names pass, inspector. Memory is my trade.\"" },
    };

    N.act2_4 = {
        page1: { fr: "Dans la voiture banalisée, votre partenaire frappe le volant : « Tous les suspects ont mentionné ce fichu coffre ! Et cette montre gousset... l'aiguille est bloquée sur 22h09. Ce n'est pas l'heure de sa mort... c'est la combinaison du coffre ! Foncez à la scène de crime ! »", en: "In the unmarked car, your partner strikes the wheel: \"Every suspect mentioned that damned safe! And that pocket watch... the hand is stuck at 10:09 PM. It's not the time of death... it's the combination to the safe! Get to the crime scene!\"" }
    };

    N.act3_1 = {
        page1: { fr: "Pénombre lugubre au manoir. Le ruban de police flotte au vent. Vous et votre partenaire vous tenez face au panneau de boiserie dissimulant le coffre-fort.\n\n« Allez, inspecteur. La combinaison de la montre... et ouvrez-moi ce coffre. »", en: "A gloomy half-light at the manor. Police tape floats in the wind. You and your partner stand before the wood panel concealing the safe.\n\n\"Go on, inspector. The watch's combination... and open me that safe.\"" },
        page2: { fr: "Le panneau de boiserie semble ordinaire, mais en le touchant, vous sentez une infime irregularité. « Quelque chose cloche, inspecteur. » murmure Wexford. Le mur porte les marques d'une manipulation récente.\n\n[Vous décidez de l'aborder comme un puzzle : chaque planche, chaque joint, chaque vis doit révéler son secret.]", en: "The wood panel seems ordinary, but touching it reveals a slight irregularity. \"Something's off, inspector,\" mutters Wexford. The wall bears marks of recent tampering.\n\n[You decide to approach it like a puzzle: each board, each joint, each screw must reveal its secret.]" },
        page3: { fr: "Les pièces du puzzle s'emboîtent, formant une carte du mur derrière la boiserie. Au-delà du coffre, un second mécanisme se dessine : un mur latéral qui pourrait bien basculer.\n\n« Il y a plus que le coffre ici, inspecteur. »", en: "The puzzle pieces fit together, forming a map of the wall behind the paneling. Beyond the safe, a second mechanism emerges: a side wall that could swing open.\n\n\"There's more than just the safe here, inspector.\"" },
        page4: { fr: "La combinaison de la montre grince doucement. Le coffre s'ouvre. À l'intérieur... **rien**. Plus aucun document. Plus aucun billet. Le coffre a été **VIDÉ**.\n\nWexford fronçant le sourcil : « C'est... impossible. »", en: "The watch's combination grinds softly. The safe opens. Inside... **nothing**. No documents. No bills. The safe was **EMPTIED**.\n\nWexford frowns: \"It's... impossible.\"" },
        page5: { fr: "Mais le puzzle a révélé un second mécanisme. Wexford pousse le panneau indiqué par vos indices. Le mur **bascule** avec un grincement, révélant un **compartiment caché**.\n\nÀ l'intérieur : des contrats falsifiés, des registres de versements, et une **lettre signée Wexford**, datée de la semaine précédente.", en: "But the puzzle revealed a second mechanism. Wexford pushes the panel indicated by your clues. The wall **swings** with a groan, revealing a **hidden compartment**.\n\nInside: forged contracts, payment ledgers, and a **letter signed Wexford**, dated the previous week." },
        page6: { fr: "Wexford pâlit : « Ces papiers... ils datent de la semaine dernière. » La pluie de la veille a lavé les empreintes du hall.\n\n« Le coffre a été vidé avant notre arrivée. Quelqu'un connaissait la combinaison... **et toi aussi, Wexford.** »", en: "Wexford pales: \"Those papers... they date from last week.\" The rain from the night before washed the prints from the hall.\n\n\"The safe was emptied before our arrival. Someone knew the combination... **and you too, Wexford.**\"" }
    };

    N.act3_2 = {
        page1: { fr: "Au QG, votre partenaire étale les six dossiers sur la table, à côté des documents du coffre vide. « Chacun de nos suspects a une raison de vouloir le coffre. Mais le vrai secret, c'est celui qui l'a vidé. »", en: "At headquarters, your partner spreads the six files on the table beside the empty safe's documents. \"Each of our suspects had reason to want the safe. But the real secret is who emptied it.\"" },
        page2: { fr: "Qui voulez-vous interroger en premier ? Le choix déclenche une branche unique.", en: "Who do you want to interrogate first? The choice triggers a unique branch." },
        page3: { fr: "Le duel de bataille navale commence. Sur le damier, vos navires et ceux du suspect s'affrontent. Chaque coup de canon révèle un fragment de vérité.", en: "The battleship duel begins. On the grid, your ships face the suspect's. Each cannon shot reveals a fragment of truth." },
        page4: { fr: "Wexford note les réactions : « Chacun a une version. Mais le vrai indice, c'est ce que personne n'a dit. »", en: "Wexford notes the reactions: \"Each has a version. But the real clue is what no one said.\"" }
    };

    N.act3_3 = {
        page1: { fr: "Au QG, le moment est venu. Votre partenaire étale les six dossiers sur la table, à côté des documents du coffre vide. Vous avez interrogé un ou plusieurs suspects. Chaque victoire au duel révèle un fragment de vérité.\n\nQui accusez-vous ? Le partenaire qui vous a guidé depuis le début... ou un des suspects ?", en: "At headquarters, the time has come. Your partner spreads the six files on the table beside the empty safe's documents. You have interrogated one or more suspects. Each victory at the duel revealed a fragment of truth.\n\nWho do you accuse? The partner who guided you from the start... or one of the suspects?" }
    };
    N.outro = {
        page1: { fr: "L'affaire est classée. Le vrai coupable... c'était votre partenaire. Wexford a orchestré tout ça depuis le début. Le mobile : la corruption, la méthode : la manipulation.", en: "Case closed. The real culprit... was your partner. Wexford orchestrated everything from the start. The motive: corruption, the method: manipulation." },
        page2: { fr: "La ville murmure à nouveau sous la pluie. Une autre affaire vous attend, mais celle-ci est résolue.", en: "The city whispers again under the rain. Another case awaits you, but this one is solved." },
        page3: { fr: "FIN, True Detective.", en: "END, True Detective." }
    };

    /* =================================================================
       2. DESCRIPTIONS DES SUSPECTS
    ================================================================= */

    N.suspects = {
        protecteur: { fr: "Le Major Hale, Garde du corps de la victime, loyal en apparence mais rongé par l'amour obsessionnel pour Lady Vivienne.", en: "Major Hale, The victim's bodyguard, outwardly loyal but consumed by obsessive love for Lady Vivienne." },
        "femme-fatale": { fr: "Lady Vivienne, Épouse de la victime, héritière désignée, manipulatrice et calculatrice.", en: "Lady Vivienne, The victim's wife, named heiress, manipulative and calculating." },
        seducteur: { fr: "Julian Pembrooke, Ami d'enfance de la victime, sa voiture est tombée en panne au moment du crime.", en: "Julian Pembrooke, The victim's childhood friend, his car broke down at the time of the crime." },
        suspect: { fr: "Rupert Blackwood, Notaire de la victime, il gérait les affaires confidentielles du magnat.", en: "Rupert Blackwood, The victim's notary, he managed the tycoon's confidential affairs." },
        marginal: { fr: "Silas Crane, Clochard du quartier, témoin clé qui a vu un rôdeur la nuit du crime.", en: "Silas Crane, Homeless man in the neighborhood, key witness who saw a prowler on the night of the crime." },
        criminel: { fr: "Victor Krane, Homme de main du quartier, présent dans la ruelle la nuit du crime.", en: "Victor Krane, Neighborhood enforcer, present in the alley on the night of the crime." },
        scientifique: { fr: "Dr Whitmore, Expert légiste, analyste impartial mais qui cache peut-être un lien personnel avec l'affaire.", en: "Dr Whitmore, Forensic expert, impartial analyst but who may hide a personal link to the case." },
        detective: { fr: "Inspecteur Wexford, Votre partenaire de longue date, il connaît la victime mieux que quiconque.", en: "Inspector Wexford, Your long-time partner, he knows the victim better than anyone." }
    };

    N.gamePreferences = {
        protecteur: { fr: "Major Hale préfère la guerre spatiale et la précision tirée", en: "Major Hale prefers space warfare and precision shooting" },
        "femme-fatale": { fr: "Lady Vivienne préfère le labyrinthe et la stratégie", en: "Lady Vivienne prefers maze and strategy" },
        seducteur: { fr: "Julian Pembrooke préfère le breakout et le hasard", en: "Julian Pembrooke prefers breakout and chance" },
        suspect: { fr: "Rupert Blackwood préfère la bataille navale et la grille stratégique", en: "Rupert Blackwood prefers battleship and strategic grid" },
        marginal: { fr: "Silas Crane préfère le pong et le simple réflexe", en: "Silas Crane prefers pong and simple reflex" },
        criminel: { fr: "Victor Krane préfère les astéroïdes et la survie", en: "Victor Krane prefers asteroids and survival" }
    };

    /* =================================================================
       3. RÉACTIONS (échec d'accusation)
    ================================================================= */

    N.reactions = {
        protecteur: { fr: "Le Major Hale s'effondre. « Tout ça pour elle... mais elle ne m'a jamais aimé. » La vérité éclate : amour obsessionnel, Krane payé, Pembrooke écarté habilement… Un homme maîtrisé, jusqu'au bout. JUSTICE EST FAITE.", en: "Major Hale collapses. \"All of this for her... but she never loved me.\" The truth bursts out: obsessive love, Krane paid, Pembrooke skilfully kept away… A man in control, to the very end. JUSTICE IS SERVED." },
        "femme-fatale": { fr: "Lady Vivienne éclate d'un rire amer. « Moi ? La meurtrière ? Regardez plutôt du côté de votre précieux Major Hale. Ses dettes, ses versements à Krane… Et ce faux alibi de panne : c'est lui qui l'a monté. » Elle s'éloigne, laissant le vrai coupable s'échapper. ÉCHEC.", en: "Lady Vivienne bursts into bitter laughter. \"Me? The murderess? Look instead at your precious Major Hale. His debts, his payments to Krane… And that fake breakdown alibi: he staged it.\" She walks away, letting the real killer escape. FAILURE." },
        seducteur: { fr: "Julian Pembrooke pâle. « C'est une erreur… j'étais en panne, je vous l'ai dit ! » Il a raison : la panne était factice, mais il n'était que l'alibi. Le vrai coupable court encore. ÉCHEC.", en: "Julian Pembrooke turns pale. \"This is a mistake... I broke down, I told you!\" He's right: the breakdown was staged, but he was just the alibi. The real killer is still free. FAILURE." },
        suspect: { fr: "Rupert Blackwood ricane. « Accusez-moi, moi ? J'étais parti à 21h30, Silas Crane peut le confirmer. Ce n'est pas moi qui ai sectionné cette durite… ni payé Krane. » Le vrai coupable reste en liberté. ÉCHEC.", en: "Rupert Blackwood sneers. \"Accuse me? I left at 9:30pm, Silas Crane can confirm. I didn't cut that hose... nor pay Krane.\" The real killer remains free. FAILURE." },
        marginal: { fr: "Silas Crane secoue la tête. « Je ne suis qu'un clochard, pas un meurtrier. J'ai VU le rôdeur à 22h, suivez cette piste, trouvez qui il était. » Le vrai coupable vous échappe. ÉCHEC.", en: "Silas Crane shakes his head. \"I'm just a homeless man, not a killer. I SAW the prowler at 10pm, follow that lead, find out who it was.\" The real killer escapes you. FAILURE." },
        criminel: { fr: "Victor Krane sourit lentement. « Je ne suis que le bras, inspecteur. La main qui m'a guidé, c'est Hale, mon employeur. Relisez les versements dans le coffre. » Le commanditaire s'échappe. ÉCHEC.", en: "Victor Krane smiles slowly. \"I am just the arm, inspector. The hand that guided me is Hale, my employer. Reread the payments in the safe.\" The mastermind escapes. FAILURE." },
        scientifique: { fr: "Whitmore baisse les yeux. « Je n'ai fait que mon travail. L'ADN ne désigne pas un coupable, il désigne tous les suspects. C'est à vous de trouver le lien. » La vérité reste hors de portée. ÉCHEC.", en: "Whitmore lowers his eyes. \"I just did my job. The DNA doesn't point to one killer, it points to all suspects. It's up to you to find the link.\" The truth remains out of reach. FAILURE." },
        detective: { fr: "Wexford retire son chapeau. « J'ai peut-être manqué quelque chose. La vérité est ailleurs. » L'enquête piétine. ÉCHEC.", en: "Wexford takes off his hat. \"Maybe I missed something. The truth is elsewhere.\" The investigation stalls. FAILURE." }
    };

    /* =================================================================
       4. VÉRITÉS (fins réussies)
    ================================================================= */

    T.protecteur = {
        title: { fr: "Le Major Hale", en: "Major Hale" },
        mobile: { fr: "Amoureux obsessionnel de Lady Vivienne, il a fait exécuter le meurtre pour l'assurance et les bijoux, croyant la conquérir.", en: "Hopelessly in love with Lady Vivienne, he had the murder carried out for the insurance and jewels, believing it would win her." },
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

    T.scientifique = {
        title: { fr: "Dr Whitmore", en: "Dr Whitmore" },
        mobile: { fr: "Expert légal, il a couvert des traces compromettantes pour protéger sa réputation.", en: "Forensic expert, he covered compromising traces to protect his reputation." },
        methode: { fr: "Altération des preuves ADN, retard dans l'autopsie, suppression du rapport complet.", en: "Altering DNA evidence, delaying the autopsy, suppressing the full report." },
        adn: { fr: "L'ADN inconnu est celui d'un ancien client que Whitmore a fait disparaître des fichiers.", en: "The unknown DNA belongs to a former client Whitmore had removed from the files." },
        revel1: { fr: "Whitmore avoue avoir modifié le rapport pour protéger sa carrière.", en: "Whitmore confesses he altered the report to protect his career." },
        revel2: { fr: "Il a couvert le crime par peur de perdre sa licence.", en: "He covered up the crime for fear of losing his license." },
        indice: { fr: "Ses notes contiennent des références à un cas antérieur similaire.", en: "His notes contain references to a similar earlier case." },
        prison: { fr: "Il perd tout : carrière, réputation, liberté.", en: "He loses everything: career, reputation, freedom." },
        morale: { fr: "La science sans conscience n'est que ruine de l'âme.", en: "Science without conscience is but ruin of the soul." }
    };

    T.detective = {
        title: { fr: "Inspecteur Wexford", en: "Inspector Wexford" },
        mobile: { fr: "Partenaire de la victime, il a découvert le corps le premier et a eu le temps de modifier la scène.", en: "Partner of the victim, he discovered the body first and had time to alter the scene." },
        methode: { fr: "Sabotage de l'alarme, placement de fausses preuves, manipulation du partenaire.", en: "Sabotaging the alarm, planting false evidence, manipulating the partner." },
        adn: { fr: "Son ADN est partout sur la scène, mais il prétend l'avoir découverte.", en: "His DNA is all over the scene, but he claims to have discovered it." },
        revel1: { fr: "Wexford a appelé la victime la veille, menaçant de révéler ses secrets.", en: "Wexford called the victim the night before, threatening to reveal his secrets." },
        revel2: { fr: "Il a volé les documents du coffre pour couvrir sa propre piste.", en: "He stole the safe documents to cover his own trail." },
        indice: { fr: "Ses cigarettes ne correspondent pas à la marque retrouvée sur la scène.", en: "His cigarettes don't match the brand found at the scene." },
        prison: { fr: "Il regarde le sol, incapable de soutenir le regard. La justice est aveugle.", en: "He looks at the floor, unable to hold the gaze. Justice is blind." },
        morale: { fr: "La confiance trahie est la pire des blessures.", en: "Betrayed trust is the worst of wounds." }
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
        puzzle: {
            title: { fr: "Le Puzzle", en: "The Puzzle" },
            desc: { fr: "[Mobile / Complicité] Emboîtez les formes géométriques pour révéler la complicité entre les suspects.", en: "[Motive / Collusion] Fit the geometric shapes to reveal collusion between suspects." },
            clue: { fr: "Le puzzle assemblé révèle : HALE ENGAGE KRANE. La complicité est établie.", en: "The assembled puzzle reveals: HALE HIRES KRANE. The collusion is proven." }
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
        { label: 'A', x: 11.6, y: 66.1, info: { fr: "Le sceau en or et son cachet, posés à l'extrême gauche du bureau. Le matériel de correspondance est intact, ce qui prouve que le bureau n'a pas été saccagé au hasard : l'intrus connaissait les lieux, ou possédait les accès.", en: "The gold seal and its stamp, set at the far left of the desk. The correspondence tools are untouched, proving the desk was not ransacked at random : the intruder knew the premises, or had the keys." } },
        { label: 'B', x: 24.1, y: 70.4, info: { fr: "L'encrier central et son bloc d'écriture. Situé au cœur du bureau, il marque la zone où la victime rédigeait ses documents au moment de l'altercation.", en: "The central inkwell and its writing block. Set at the heart of the desk, it marks the spot where the victim was drafting his documents when the altercation began." } },
        { label: '1', x: 31.2, y: 56.8, info: { fr: "Des papiers administratifs et une plume ouverte, éparpillés sur le coin gauche du bureau. Quelqu'un a consulté ou recherché un document juste avant la mort.", en: "Administrative papers and an open quill, scattered across the left corner of the desk. Someone searched through a document just before the victim died." } },
        { label: '2', x: 38.6, y: 57.3, info: { fr: "Deux verres de vin dressés, avec une petite coupelle. La victime attendait un proche de confiance pour partager un dernier verre.", en: "Two wine glasses still standing, with a small saucer beside them. The victim was expecting a trusted guest for a last drink." } },
        { label: '3', x: 47.2, y: 58.3, info: { fr: "Un livre ouvert, maculé de sang, près de la lampe de bureau. Un journal ou registre taché suggère une lutte en plein travail, sans temps de réaction.", en: "An open book, smeared with blood, near the desk lamp. A bloodstained logbook hints at a struggle mid-work, with no time to react." } },
        { label: '4', x: 66.4, y: 79.2, info: { fr: "Le fauteuil de bureau, renversé sur le tapis. Une bousculade brève mais violente a précédé l'effondrement de la victime près de la fenêtre.", en: "The office chair, overturned on the carpet. A brief but violent scuffle preceded the victim's collapse near the window." } },
        { label: '5', x: 70.8, y: 85.6, info: { fr: "Une trace de sang au sol, au cœur de la silhouette à la craie. L'épicentre exact de l'agression mortelle, aucun geste de défense, la victime connaissait son agresseur.", en: "A blood trace on the floor, at the heart of the chalk outline. The exact epicentre of the fatal blow, no defensive wound : the victim knew the assailant." } },
        { label: '6', x: 78.2, y: 86.3, info: { fr: "Des papiers éparpillés sur le parquet, à côté du corps. Un fragment de lettre presque illisible glisse parmi les papiers, le dernier élément à examiner pour reconstituer l'histoire du crime.", en: "Scattered papers on the floorboards, beside the body. A nearly illegible letter fragment slips among them, the last element to examine to reconstruct the crime's story." } }
    ];

    /* =================================================================
       7. INTERROGATOIRES (3 questions par suspect / par rencontre)
       --------------------------------------------------------------------
       Chaque suspect a 3 questions possibles. Selon la question choisie,
       le suspect sera plus ou moins dans l'embarras et donnera plus ou
       moins d'indices. Chaque suspect accuse UN AUTRE suspect (système
       de faux suspects / red herrings), jamais le coupable directement.

       Système d'accusation croisée (red herring) :
         - femme-fatale → suspecte Blackwood (il devait de l'argent au mari)
         - suspect      → suspecte femme-fatale (l'argent de l'assurance)
         - protecteur   → suspecte séducteur (jalousie : Pembrooke est
                          l'amant de Vivienne, et Hale l'aime en secret)
         - séducteur    → suspecte protecteur (le mieux placé, vit sur
                          place, amoureux de Vivienne)
         - marginal     → suspecte criminel (l'a vu rôder, connaît son
                          pedigree)
         - criminel     → suspecte marginal (vagabond au passé trouble)
    ================================================================= */

    N.interrogations = {

        protecteur: {
            intro: { fr: "Le Major Hale se tient droit, mais ses yeux vous fuient. Choisissez votre angle d'attaque.", en: "Major Hale stands straight, but his eyes avoid yours. Pick your angle of attack." },
            questions: [
                {
                    id: 'hale_q1',
                    label: { fr: "« Vous étiez son homme de confiance. Pourquoi est-il mort si mal protégé ? »", en: "\"You were his trusted man. Why was he so poorly protected?\"" },
                    response: { fr: "Hale se raidit. « J'ai vérifié les caméras, le système d'alarme, les accès. Tout était en place. Le sabotage a été fait de l'intérieur, quelqu'un qui connaissait les codes. »\n\n[Accès] Un initié. Qui d'autre a accès aux codes du manoir ?", en: "Hale stiffens. \"I checked the cameras, the alarm system, the access points. Everything was in place. The sabotage was done from the inside, someone who knew the codes.\"\n\n[Accès] An insider. Who else has access to the manor codes?" },
                    evidence: 'opportunity'
                },
                {
                    id: 'hale_q2',
                    label: { fr: "« Votre patron avait des dettes, n'est-ce pas ? Vous le saviez ? »", en: "\"Your boss had debts, didn't he? Did you know?\"" },
                    response: { fr: "Hale blêmit. « Des dettes ? Non, je… Enfin, peut-être. Blackwood, le notaire, gérait tout ça. Il était très proche de la victime ces derniers temps. »\n\n[Mobile] Hale renvoie vers Blackwood sans qu'on le lui demande. À vérifier.", en: "Hale pales. \"Debts? No, I… Well, maybe. Blackwood, the notary, handled all of that. He was very close to the victim lately.\"\n\n[Mobile] Hale redirects toward Blackwood unprompted. To verify." },
                    evidence: 'mobile'
                },
                {
                    id: 'hale_q3',
                    label: { fr: "« Pembrooke est un ami de longue date. Vous le connaissiez bien ? »", en: "\"Pembrooke is a long-time friend. Did you know him well?\"" },
                    response: { fr: "Hale s'assombrit. « Trop bien, justement. Je l'ai vu… avec Lady Vivienne, ces dernières semaines. En secret. »\n\n[Témoin] Pembrooke et Vivienne avaient une liaison. Hale le savait.", en: "Hale darkens. \"Too well, in fact. I saw him… with Lady Vivienne, these last weeks. In secret.\"\n\n[Témoin] Pembrooke and Vivienne were having an affair. Hale knew." },
                    evidence: 'witness'
                }
            ],
            redirect: { target: 'seducteur', reason: 'jalousie' },
            rounds2: [
                {
                    id: 'hale_r2q1',
                    label: { fr: "« Où étiez-vous exactement à 22h09, Major ? »", en: "\"Where exactly were you at 10:09pm, Major?\"" },
                    response: { fr: "Hale lisse sa moustache. « En panne avec Pembrooke, sur la route. Sa voiture, sa durite, son capot ouvert. Interrogez-le : il le confirmera. »\n\n[Alibi] Un alibi adossé à un autre homme. Pratique, si cet homme est complice, ou Manipulé.", en: "Hale smooths his moustache. \"Broken down with Pembrooke, on the road. His car, his hose, his open bonnet. Question him : he will confirm it.\"\n\n[Alibi] An alibi propped on another man. Convenient, if that man is an accomplice, or manipulated." },
                    evidence: 'alibi'
                },
                {
                    id: 'hale_r2q2',
                    label: { fr: "« Quand vous avez vu Pembrooke et Lady Vivienne, que s'est-il passé ensuite ? »", en: "\"When you saw Pembrooke and Lady Vivienne together, what happened next?\"" },
                    response: { fr: "La mâchoire de Hale se crispe. « Je suis resté en place. J'ai observé. » Il baisse les yeux. « Parce que c'était Vivienne, pas une inconnue. »\n\n[Témoin] Hale ne révèle pas la suite — mais son silence parle de complicité.\n\n[Accès] Il était présent dans la serre ce soir-là. Il pouvait tout voir.", en: "Hale's jaw tightens. \"I stayed in place. I watched.\" He lowers his eyes. \"Besides, it was Vivienne, not a stranger.\"\n\n[Witness] Hale doesn't reveal what happened next — but his silence speaks of complicity.\n\n[Opportunity] He was present in the greenhouse that evening. He could see everything." },
                    evidence: 'witness'
                },
                {
                    id: 'hale_r2q3',
                    label: { fr: "« Vous connaissez un certain Victor Krane ? »", en: "\"Do you know a certain Victor Krane?\"" },
                    response: { fr: "Un silence. « Ce nom ne me dit rien. » Mais sa main cherche sa montre-gousset sans la trouver.\n\n[Témoin] Le nom de Krane le trouble. À vérifier.", en: "A silence. \"That name means nothing to me.\" But his hand reaches for a pocket watch that isn't there.\n\n[Témoin] Krane's name rattles him. To verify." },
                    evidence: 'witness'
                }
            ],
            rounds3: [
                {
                    id: 'hale_r3q1',
                    label: { fr: "« Qui pouvait manipuler l'alarme sans déclencher quoi que ce soit ? »", en: "\"Who could work the alarm without triggering anything?\"" },
                    response: { fr: "« Le système est ancien. Quelqu'un du manoir, évidemment. Mais vous cherchez un assassin chez les domestiques, inspecteur ? C'est de la paresse. »\n\n[Accès] Hale vit sur place. Il vient d'écarter une piste… dont il fait partie.", en: "\"The system is old. Someone from the manor, obviously. But you're looking for a killer among the servants, inspector? That's laziness.\"\n\n[Accès] Hale lives on site. He just dismissed a lead… that points at himself." },
                    evidence: 'opportunity'
                },
                {
                    id: 'hale_r3q2',
                    label: { fr: "« Vous avez décrit la mare de sang. Pourtant, la porte était verrouillée à votre retour. »", en: "\"You described the pool of blood. Yet the door was locked when you returned.\"" },
                    response: { fr: "Hale pâlit. « La porte était verrouillée. J'ai… vu par la fenêtre du bureau. Oui. C'est ça. »\n\n[Accès] Personne ne voit une mare de sang depuis une fenêtre du rez-de-chaussée. Il en sait trop.", en: "Hale turns pale. \"The door was locked. I… saw it through the study window. Yes. That's it.\"\n\n[Accès] No one sees a pool of blood from a ground-floor window. He knows too much." },
                    evidence: 'opportunity'
                },
                {
                    id: 'hale_r3q3',
                    label: { fr: "« 12 000 £ de dettes, Major. L'honneur ne rembourse pas. »", en: "\"£12,000 in debts, Major. Honour doesn't repay them.\"" },
                    response: { fr: "Hale se lève d'un bond. Il retourne sa chaise d'un coup d'épaule, arrache sa veste et pose sur la table un pistolet d'entraînement. « Sortez ? Non. Vous, restez. J'ai fait mes classes au stand de tir de la caserne : je ne discute qu'avec ceux qui tiennent une cible mieux que moi. Découvrez si vous en êtes capable, inspecteur. »\n\n[Mobile] Les dettes existent. Et Hale préfère parler armes que chiffres.", en: "Hale springs to his feet. He flips his chair aside with a shrug, strips off his jacket and lays a training pistol on the table. \"Leave? No. You, stay. I trained at the barracks' shooting range: I only talk to men who shoot straighter than I do. Find out if you can, inspector.\"\n\n[Mobile] The debts are real. And Hale would rather speak of guns than of figures." },
                    evidence: 'mobile'
                }
            ],
            minigameIntro: { fr: "Hale dégomme une silhouette de carton du geste, sans même regarder. « Des mots, des chiffres, des mensonges... Moi, je vis au stand de tir. Les cibles ne mentent jamais. » Il désigne d'un menton l'auvent dressé dans la cour du manoir, où pendent des cibles peintes aux effigies de Pembrooke, Blackwood, Krane et Silas.\n\n« Le Séducteur, le Notaire, l'Homme de main, le Clochard : quatre cibles qui me les cassent. » Il marque une pause, et sa voix se fait étrangement douce. « Lady Vivienne n'y est pas. Elle n'y sera jamais. »\n\n« Vous voulez la vérité ? Descendez au stand, inspecteur. Touchez plus de cibles que moi, et je parlerai. »", en: "Hale drops a cardboard silhouette with a flick, without even looking. \"Words, figures, lies... Me, I live at the shooting range. Targets never lie.\" He nods toward the canopy set up in the manor yard, where painted targets bear the faces of Pembrooke, Blackwood, Krane and Silas.\n\n\"The Seducer, the Notary, the Hired Hand, the Vagrant: four targets I'd gladly break.\" He pauses, and his voice turns strangely soft. \"Lady Vivienne isn't there. She never will be.\"\n\n\"You want the truth? Come down to the range, inspector. Outshoot me, and I will talk.\"" },
            minigame: {
                type: 'shooting',
                difficulty: [
                    { clue: { fr: "Hale finit par avouer : « J'ai payé Krane pour effacer les dettes. Le meurtre... c'était un accident. »", en: "Hale finally confesses: \"I paid Krane to erase the debts. The murder... it was an accident.\"" }, failClue: { fr: "Hale reste muet : « Je ne sais rien. Interrogez les autres. »", en: "Hale remains silent: \"I know nothing. Question the others.\"" }, rounds: [{ title: { fr: 'Tir 1', en: 'Shooting 1' } }] },
                    { clue: { fr: "Blackwood se décompose : « Mes dettes de jeu : 8 000 £. Mais je n'ai pas tué pour ça. »", en: "Blackwood breaks down: \"My gambling debts: £8,000. But I didn't kill for that.\"" }, failClue: { fr: "Blackwood se reprend : « Des rumeurs de club. Ma situation est saine, inspecteur. »", en: "Blackwood recovers: \"Club rumors. My situation is sound, inspector.\"" }, rounds: [{ title: { fr: 'Tir 2', en: 'Shooting 2' } }] },
                    { clue: { fr: "Blackwood avoue tout : « J'ai falsifié les registres. Le Duc m'a découvert. Je l'ai tué pour me couvrir. »", en: "Blackwood confesses all: \"I falsified the records. The Duke discovered it. I killed him to cover my tracks.\"" }, failClue: { fr: "Blackwood se renfrogne : « L'ADN sur les papiers ? J'ai signé à 19h30, avant le dîner. Vérifiez l'encre. »", en: "Blackwood scowls: \"DNA on the papers? I signed at 7:30pm, before dinner. Check the ink.\"" }, rounds: [{ title: { fr: 'Tir 3', en: 'Shooting 3' } }] }
                ]
            }
        },

        "femme-fatale": {
            intro: { fr: "Lady Vivienne vous reçoit dans le boudoir aux rideaux de velours rouge. Elle ne se lève pas. Une tasse de thé fume entre ses doigts gantés, mais elle n'y porte pas les lèvres.\n\n« Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. Quelqu'un qui connaissait ses habitudes. »\n\nElle vous défie du regard, les yeux deux charbons dans la pénombre. Lady Vivienne attend votre première question.", en: "Lady Vivienne receives you in the boudoir with blood-red velvet curtains. She does not rise. A teacup smokes between her gloved fingers, but she does not raise it to her lips.\n\n\"My husband had enemies, certainly. But the perpetrator… it's someone from the house. Someone who knew his habits.\"\n\nShe challenges you with her gaze, eyes like coals in the half-light. Lady Vivienne waits for your first question." },
            questions: [
                {
                    id: 'viv_q1',
                    label: { fr: "« Vous étiez au manoir, cette nuit-là. Pourquoi n'avez-vous appelé personne ? »", en: "\"You were at the manor that night. Why didn't you call anyone?\"" },
                    response: { fr: "Vivienne sourit sans chaleur. « Parce que je savais que mon mari recevait. Et quand on reçoit à cette heure, on ne veut pas être dérangé. J'ai entendu la voiture partir… et puis plus rien. »\n\n[Alibi] Elle a entendu une voiture partir mais n'a pas appelé. Étrange, pour une épouse qui prétend aimer son mari.", en: "Vivienne smiles without warmth. \"Because I knew my husband was receiving visitors. And when one receives at that hour, one does not wish to be disturbed. I heard a car leave… and then nothing.\"\n\n[Alibi] She heard a car leave but did not call. Strange, for a wife who claims to love her husband." },
                    evidence: 'alibi'
                },
                {
                    id: 'viv_q2',
                    label: { fr: "« Votre mari avait des ennemis. Lequel vous inquiétait le plus ? »", en: "\"Your husband had enemies. Which one worried you the most?\"" },
                    response: { fr: "Elle tourne sa tasse lentement. « Les ennemis de mon mari sont nombreux. Mais celui qui le connaissait le mieux… celui qui avait le plus à gagner… c'est quelqu'un que vous n'avez pas encore interrogé. »\n\n[Mobile] Elle désigne quelqu'un sans le nommer. À identifier.", en: "She turns her cup slowly. \"My husband's enemies are many. But the one who knew him best… the one who had the most to gain… it is someone you have not yet questioned.\"\n\n[Mobile] She points to someone without naming them. To identify." },
                    evidence: 'mobile'
                },
                {
                    id: 'viv_q3',
                    label: { fr: "« Le coffre-fort était ouvert. Vous saviez où se trouvait la combinaison ? »", en: "\"The safe was open. Did you know where the combination was?\"" },
                    response: { fr: "Ses doigts se crispent sur la porcelaine. « Aldric changeait de cachette tous les mois. Paranoïa, vous voyez. La montre de poche ? C'était le dernier essai. Il l'a montrée à tout le monde, ce soir-là. »\n\n[Accès] Elle sait que la montre contenait la combinaison. Mais affirme ne pas l'avoir utilisée.", en: "Her fingers tighten on the porcelain. \"Aldric changed his hiding place every month. Paranoia, you see. The pocket watch? It was the last attempt. He showed it to everyone that evening.\"\n\n[Accès] She knows the watch contained the combination. But claims not to have used it." },
                    evidence: 'opportunity'
                }
            ],
            rounds2: [
                {
                    id: 'viv_r2q1',
                    label: { fr: "« Hale et Pembrooke étaient en panne ensemble. Croyez-vous à cet alibi ? »", en: "\"Hale and Pembrooke were broken down together. Do you believe that alibi?\"" },
                    response: { fr: "Elle émet un petit rire. « Hale est trop perfectionniste pour laisser sa voiture en panne. Et Pembrooke… Julian a toujours eu de la chance avec les femmes. Pas avec les moteurs. »\n\n[Témoin] Elle doute de l'alibi de panne. Mais ne fournit pas de contre-preuve.", en: "She lets out a small laugh. \"Hale is too much of a perfectionist to let his car break down. And Pembrooke… Julian has always been lucky with women. Not with engines.\"\n\n[Témoin] She doubts the breakdown alibi. But provides no counter-evidence." },
                    evidence: 'witness'
                },
                {
                    id: 'viv_r2q2',
                    label: { fr: "« Blackwood, le notaire. Il gétait les affaires de votre mari. Vous lui faisiez confiance ? »", en: "\"Blackwood, the notary. He handled your husband's affairs. Did you trust him?\"" },
                    response: { fr: "La tasse s'arrête à mi-chemin. « Rupert était efficace. Trop efficace. Il savait où Aldric cachait ses documents… et il savait aussi que le testament était en ma faveur. »\n\n[Mobile] Blackwood connaissait le testament et la cachette des documents.", en: "The cup stops halfway. \"Rupert was efficient. Too efficient. He knew where Aldric hid his documents… and he also knew the will was in my favor.\"\n\n[Mobile] Blackwood knew the will and the document hiding place." },
                    evidence: 'mobile'
                },
                {
                    id: 'viv_r2q3',
                    label: { fr: "« Quelqu'un a utilisé la montre comme combinaison du coffre. Vous avez une idée de qui ? »", en: "\"Someone used the watch as the safe combination. Any idea who?\"" },
                    response: { fr: "Elle croise les bras. « La combinaison changeait chaque mois. Ce soir-là, c'était 22h09. L'heure à laquelle mon mari attendait quelqu'un. Mais il n'a jamais eu le temps de l'utiliser. »\n\n[Chronologie] Elle confirme l'heure de la combinaison et l'attente d'un visiteur.", en: "She crosses her arms. \"The combination changed every month. That evening, it was 10:09 PM. The time at which my husband was expecting someone. But he never had time to use it.\"\n\n[Chronologie] She confirms the combination time and the expectation of a visitor." },
                    evidence: 'timeline'
                }
            ],
            rounds3: [
                {
                    id: 'viv_r3q1',
                    label: { fr: "« On a retrouvé des empreintes de tout le monde sur la scène. Même les vôtres. »", en: "\"We found everyone's prints at the scene. Even yours.\"" },
                    response: { fr: "Elle hausse les épaules. « Je vis dans cette maison. Mes empreintes sont partout. Mais je n'ai pas tué mon mari. Si je voulais sa fortune, je n'avais qu'à attendre qu'il meure de vieillesse. »\n\n[Forensique] Les empreintes de Vivienne sont partout, mais elle avait une raison légitime d'être là.", en: "She shrugs. \"I live in this house. My prints are everywhere. But I did not kill my husband. If I wanted his fortune, I only had to wait for him to die of old age.\"\n\n[Forensique] Vivienne's prints are everywhere, but she had a legitimate reason to be there." },
                    evidence: 'forensic'
                },
                {
                    id: 'viv_r3q2',
                    label: { fr: "« Hale vous aime depuis des années. L'avez-vous utilisé ? »", en: "\"Hale has loved you for years. Did you use him?\"" },
                    response: { fr: "Un silence. Puis un sourire froid. « Hale est un soldat. Il suit les ordres. Si Aldric est mort, c'est parce que quelqu'un a donné un ordre. Pas parce que quelqu'un a souri. »\n\n[Témoin] Elle écarte la jalousie de Hale. Mais ne nie pas son influence.", en: "A silence. Then a cold smile. \"Hale is a soldier. He follows orders. If Aldric is dead, it is because someone gave an order. Not because someone smiled.\"\n\n[Témoin] She dismisses Hale's jealousy. But does not deny his influence." },
                    evidence: 'witness'
                },
                {
                    id: 'viv_r3q3',
                    label: { fr: "« Si je vous accuse du meurtre, que répondrez-vous au juge ? »", en: "\"If I accuse you of murder, what will you say to the judge?\"" },
                    response: { fr: "Elle se lève lentement. « Je dirai que l'inspecteur qui a résolu cette affaire a été manipulé par les véritables coupables. Et je dirai aussi que vous avez oublié de vérifier l'alibi de celui qui a payé Krane. »\n\n[Méthode] Elle retourne l'accusation. La partie d'échecs va trancher.", en: "She rises slowly. \"I will say that the inspector who solved this case was manipulated by the real culprits. And I will also say that you forgot to check the alibi of the one who paid Krane.\"\n\n[Méthode] She turns the accusation around. The chess game will decide." },
                    evidence: 'method'
                }
            ],
            minigameIntro: { fr: "Vivienne repousse sa tasse de thé à moitié froide et fait glisser l'échiquier de buis entre vous deux. « Assez de mots, inspecteur. Les mots, tout le monde en gaspille. Les échecs, jamais : chaque pièce trahit son joueur. »\n\nElle pose un pion de sa main gantée. « J'ai appris à jouer contre mon époux. Il croyait me commander ; je voyais ses pièges trois coups avant lui. Le damier, inspecteur, c'est la seule table où je n'ai jamais menti. »\n\n« Défiez-moi. Gagnez, et je vous dirai ce que vous voulez savoir. Perdez... et vous repartirez le bourse vide de vérité, comme un écolier. »", en: "Vivienne pushes aside her half-cold tea and slides the boxwood chessboard between you. \"Enough words, inspector. Words, everyone squanders. Chess, never: every piece betrays its player.\"\n\nShe sets a pawn down with her gloved hand. \"I learned to play against my husband. He thought he commanded me; I saw his traps three moves ahead. The board, inspector, is the one table where I have never lied.\"\n\n\"Challenge me. Win, and I will tell you what you wish to know. Lose... and you will leave with an empty purse of truth, like a schoolboy.\"" },
            minigame: {
                type: 'chess',
                difficulty: [
                    { clue: { fr: "Vivienne renverse son thé, fait glisser l'échiquier entre vous deux : « Les mots m'ennuient, inspecteur. Jouons. » Elle joue avec une précision chirurgicale, mais une erreur lui coûte la partie. Dans sa colère, elle laisse échapper un nom : Hale.", en: "Vivienne spills her tea, slides the chessboard between you: 'Words bore me, inspector. Let us play.' She plays with surgical precision, but one mistake costs her the game. In her anger, she lets slip a name: Hale." }, failClue: { fr: "Vivienne ferme l'échiquier d'un geste sec. « Vous n'êtes pas digne de mes secrets. » Elle se lève et quitte le boudoir. Vous n'obtenez rien.", en: "Vivienne closes the chessboard with a sharp gesture. 'You are not worthy of my secrets.' She rises and leaves the boudoir. You get nothing." }, rounds: [{ title: { fr: 'Échecs 1', en: 'Chess 1' } }] },
                    { clue: { fr: "Vivienne joue avec une élégance féline, mais Hale, présent dans la pièce, trépigne nerveusement. Quand elle perd, elle ordonne à Hale de sortir. Seule avec vous, elle avoue avoir tout orchestré depuis le début.", en: "Vivienne plays with feline elegance, but Hale, present in the room, paces nervously. When she loses, she orders Hale out. Alone with you, she confesses to having orchestrated everything from the start." }, failClue: { fr: "Hale intervient : « Assez, milady. » Il vous expulse du boudoir. Vous n'obtenez aucune information.", en: "Hale intervenes: 'Enough, milady.' He expels you from the boudoir. You obtain no information." }, rounds: [{ title: { fr: 'Échecs 2', en: 'Chess 2' } }] },
                    { clue: { fr: "Vivienne, furieuse de perdre, dévoile le plan : Hale a tué Aldric par jalousie, et elle a manipulé tout le monde pour hériter. Elle vous tend la preuve ultime : le billet de Krane signé Hale.", en: "Vivienne, furious at losing, unveils the plan: Hale killed Aldric out of jealousy, and she manipulated everyone to inherit. She hands you the ultimate proof: Krane's note signed by Hale." }, failClue: { fr: "Vivienne sourit : « Vous avez gagné la partie, mais pas la guerre. » Elle brûle le billet compromettant devant vous. La piste est perdue.", en: "Vivienne smiles: 'You won the game, but not the war.' She burns the compromising note in front of you. The trail is lost." }, rounds: [{ title: { fr: 'Échecs 3', en: 'Chess 3' } }] }
                ]
            }
        },

        marginal: {
            intro: { fr: "Silas Crane grelotte dans l'encadrement de la porte. Il a besoin d'une pièce. Choisissez votre question, doucement.", en: "Silas Crane shivers in the doorway. He needs a coin. Choose your question, gently." },
            questions: [
                {
                    id: 'sls_q1',
                    label: { fr: "« Le rôdeur que vous avez vu. Vous l'avez reconnu ? »", en: "\"The prowler you saw. Did you recognize him?\"" },
                    response: { fr: "Silas se gratte la barbe. « Un homme pressé, bien habillé. Mais ce n'était pas le premier soir que je le voyais rôder. Il traîne souvent dans le quartier. »\n\n[Témoin] Un habitué du quartier, mais pas un inconnu.", en: "Silas scratches his beard. \"A hurried man, well-dressed. But it wasn't the first night I saw him lurking. He often hangs around the neighborhood.\"\n\n[Témoin] A regular of the neighborhood, but not a stranger." },
                    evidence: 'witness'
                },
                {
                    id: 'sls_q2',
                    label: { fr: "« Vous voyez d'autres personnes louches dans le coin ? »", en: "\"Do you see other shady people around?\"" },
                    response: { fr: "Silas baisse la voix. « Y'a un type, le soir, qui traîne près des poubelles du bar. Pas le même homme. Plus rude, plus nerveux. Je l'ai vu plusieurs fois. »\n\n[Témoin] Un deuxième individu surveillé. À identifier.", en: "Silas lowers his voice. \"There's a guy, in the evening, hanging around the bar's trash cans. Not the same man. Rougher, more nervous. I've seen him several times.\"\n\n[Témoin] A second individual spotted. To identify." },
                    evidence: 'witness'
                },
                {
                    id: 'sls_q3',
                    label: { fr: "« Pourquoi vous cachez-vous dans cette ruelle, vous ? »", en: "\"Why do you hide in this alley, you?\"" },
                    response: { fr: "Silas hausse les épaules. « Parce que la nuit, c'est dangereux. Y'a un type, on l'appelle « Krane » dans le quartier, qui fait des sales boulots pour de l'argent. »\n\n[Témoin] Le marginal pointe vers Victor Krane, sans le nommer directement.", en: "Silas shrugs. \"Because at night, it's dangerous. There's a guy, we call him 'Krane' in the neighborhood, who does dirty work for money.\"\n\n[Témoin] The marginal points toward Victor Krane, without naming him directly." },
                    evidence: 'witness'
                }
            ],
            redirect: { target: 'criminel', reason: 'vu_roder' },
            rounds2: [
                {
                    id: 'sls_r2q1',
                    label: { fr: "« Vous parlez d'un certain Krane. Où le trouver ? »", en: "\"You mention a certain Krane. Where can we find him?\"" },
                    response: { fr: "« Vers le pont, après minuit. Mais faites attention, inspecteur. Les gens qui parlent de Krane… se taisent vite après. »\n\n[Témoin] Le marginal désigne Krane, pour quelques pièces.", en: "\"Near the bridge, after midnight. But be careful, inspector. People who talk about Krane… go quiet soon after.\"\n\n[Témoin] The marginal points to Krane, for a few coins." },
                    evidence: 'witness'
                },
                {
                    id: 'sls_r2q2',
                    label: { fr: "« On vous payait pour surveiller la ruelle, ces temps-ci ? »", en: "\"Have you been paid to watch the alley lately?\"" },
                    response: { fr: "Il détourne les yeux. « Des billets, parfois. Laissés dans ma canette. Pour « signaler ce qui bouge ». J'ai jamais su de qui. »\n\n[Mobile] Quelqu'un paie Silas pour surveiller. Du manoir ? Du bar ?", en: "He looks away. \"Banknotes, sometimes. Left in my tin can. To 'report what moves'. I never knew from whom.\"\n\n[Mobile] Someone pays Silas to watch. From the manor? The bar?" },
                    evidence: 'mobile'
                },
                {
                    id: 'sls_r2q3',
                    label: { fr: "« Blackwood prétend que vous confirmeriez son passage à 21h30. »", en: "\"Blackwood claims you would confirm he passed by at 9:30pm.\"" },
                    response: { fr: "« Le notaire ? Il est passé, oui. Mais à 21h30 précises, ça, c'est son compte rendu à lui. La pluie efface les heures, inspecteur. »\n\n[Alibi] L'alibi de Blackwood repose sur un clochard sans montre.", en: "\"The notary? He passed, yes. But 9:30pm sharp, that's his own account. The rain washes away the hours, inspector.\"\n\n[Alibi] Blackwood's alibi rests on a homeless man without a watch." },
                    evidence: 'alibi'
                }
            ],
            rounds3: [
                {
                    id: 'sls_r3q1',
                    label: { fr: "« Le rôdeur et sa montre en or. Vous l'avez revue quelque part ? »", en: "\"The prowler and his gold watch. Did you see it again anywhere?\"" },
                    response: { fr: "« Une tocante en or. Et je l'ai encore entendue, la nuit du drame : un klaxon, une portière, près du pavillon. »\n\n[Chronologie] La montre en or rôdait près du manoir à l'heure du crime.", en: "\"A gold ticker. And I heard it again, the night of the drama : a horn, a car door, near the pavilion.\"\n\n[Chronologie] The gold watch was lurking near the manor at the time of the crime." },
                    evidence: 'timeline'
                },
                {
                    id: 'sls_r3q2',
                    label: { fr: "« Si je vous mets à l'abri, vous parlerez à un juge ? »", en: "\"If I get you off the street, will you talk to a judge?\"" },
                    response: { fr: "« Devant un juge, je dis tout. Mais vous, inspecteur, vous cherchez un monsieur en uniforme. Le rôdeur, lui, obéissait à quelqu'un de la maison. »\n\n[Témoin] Le rôdeur obéissait à quelqu'un de la maison.", en: "\"Before a judge, I'll say everything. But you, inspector, are looking for a man in uniform. The prowler, though, took orders from someone in the house.\"\n\n[Témoin] The prowler took orders from someone in the house." },
                    evidence: 'witness'
                },
                {
                    id: 'sls_r3q3',
                    label: { fr: "« Pourquoi n'avoir rien dit à la police ? »", en: "\"Why didn't you tell the police?\"" },
                    response: { fr: "« Qui écoute un clochard ? » Il ricane, puis se tue. « Et puis Krane sait où je dors. »\n\n[Témoin] La peur de Krane. Le marginal est un témoin sous pression.", en: "\"Who listens to a homeless man?\" He smirks, then falls silent. \"Besides, Krane knows where I sleep.\"\n\n[Témoin] Fear of Krane. The marginal is a witness under pressure." },
                    evidence: 'witness'
                }
            ],
            minigameIntro: { fr: "Silas vous tire par la manche jusqu'à son coin de ruelle. Contre la brique, un château branlant : caisses à huître, boîtes de conserve lustrées, roues de vélo, douilles, le tout empilé avec une patience d'orfèvre. « On m'appelle le chiffonnier. Les gens jettent ; moi, j'empile. Chaque objet a sa place, monsieur l'inspecteur. Chaque chose trouvé doit rester en équilibre. »\n\nIl vous tend une roue de brouette pleine de ferraille. « Votre métier, c'est les mots. Le mien, c'est les mains. Si vous savez empiler une tour plus haute que la mienne sans tout faire tomber... alors vous avez de la réflexion. Pas juste de la langue. »\n\n« Montrez-moi. Après, je vous dirai ce que j'ai vu, cette nuit-là. »", en: "Silas tugs your sleeve toward his corner of the alley. Against the brick looms a rickety castle: oyster crates, polished tin cans, bicycle wheels, spent shells, all stacked with a jeweller's patience. \"They call me the ragpicker. People throw away; I stack. Every object has its place, mister inspector. Everything found must stay in balance.\"\n\nHe hands you a wheelbarrow full of scrap. \"Your trade is words. Mine is hands. If you can stack a tower taller than mine without toppling it... then you have real thought. Not just a tongue.\"\n\n\"Show me. Then I'll tell you what I saw, that night.\"" },
            minigame: {
                type: 'marginal-tower',
                difficulty: [
                    { clue: { fr: "Silas crache le morceau : « J'ai vu Krane dans la ruelle, cette nuit-là. Il avait une clef du manoir. »", en: "Silas spills: \"I saw Krane in the alley that night. He had a manor key.\"" }, failClue: { fr: "Silas se tait : « Krane sait où je dors. Je ne dis rien de plus. »", en: "Silas goes silent: \"Krane knows where I sleep. I'm saying nothing more.\"" }, rounds: [{ title: { fr: 'Tour de Silas (5)', en: "Silas' Tower (5)" } }] },
                    { clue: { fr: "Silas révèle : « Krane travaille pour Hale. On me paie pour surveiller la ruelle depuis le manoir. »", en: "Silas reveals: \"Krane works for Hale. I'm paid to watch the alley from the manor.\"" }, failClue: { fr: "Silas se dérobe : « Des billets dans ma canette. Je ne sais pas d'où ils viennent. »", en: "Silas dodges: \"Banknotes in my tin can. I don't know where they come from.\"" }, rounds: [{ title: { fr: 'Tour de Silas (8)', en: "Silas' Tower (8)" } }] },
                    { clue: { fr: "Silas dit tout : « J'ai vu Hale donner les clés à Krane. C'est Hale qui a tout organisé. »", en: "Silas tells all: \"I saw Hale give the keys to Krane. Hale organized everything.\"" }, failClue: { fr: "Silas regarde ailleurs : « La pluie efface les heures. Je ne peux pas confirmer l'heure pour personne. »", en: "Silas looks away: \"The rain washes away the hours. I can't confirm the time for anyone.\"" }, rounds: [{ title: { fr: 'Tour de Silas (12)', en: "Silas' Tower (12)" } }] }
                ]
            }
        },

        marginal2: {
            intro: { fr: "Silas Crane vous reconnaît à peine. Il grelotte encore plus que la première fois. Choisissez votre question avec douceur.", en: "Silas Crane barely recognizes you. He shivers even more than the first time. Choose your question gently." },
            questions: [
                {
                    id: 'sls2_q1',
                    label: { fr: "« Vous étiez près du manoir, cette nuit-là. Que s'est-il passé ? »", en: "\"You were near the manor that night. What happened?\"" },
                    response: { fr: "Silas baisse la tête. « J'ai vu des lumières. Des voix. Puis une voiture est partie en trombe. Je ne peux pas dire qui c'était. »\n\n[Témoin] Témoignage indirect. Silas a vu et entendu, mais pas identifié.", en: "Silas lowers his head. \"I saw lights. Voices. Then a car sped away. I can't say who it was.\"\n\n[Témoin] Indirect testimony. Silas saw and heard, but didn't identify." },
                    evidence: 'witness'
                },
                {
                    id: 'sls2_q2',
                    label: { fr: "« Krane vous a-t-il menacé, après notre première conversation ? »", en: "\"Did Krane threaten you, after our first conversation?\"" },
                    response: { fr: "Silas détourne les yeux. « Il a passé près de mon coin. Il a souri. Je ne l'ai pas revu depuis. Mais j'ai trouvé un billet dans ma canette ce matin. »\n\n[Mobile] Krane a intimidé Silas après qu'il ait parlé.", en: "Silas looks away. \"He passed by my corner. He smiled. I haven't seen him since. But I found a banknote in my tin can this morning.\"\n\n[Mobile] Krane intimidated Silas after he talked." },
                    evidence: 'mobile'
                },
                {
                    id: 'sls2_q3',
                    label: { fr: "« La montre en or que vous avez vue... elle appartenait à qui ? »", en: "\"That gold watch you saw... who did it belong to?\"" },
                    response: { fr: "« Je ne sais pas. Mais je l'ai revue. Au poignet du rôdeur, cette fois. Il la serrait fort, comme s'il avait peur de la perdre. »\n\n[Chronologie] La montre en or est un lien entre le rôdeur et la scène.", en: "\"I don't know. But I saw it again. On the prowler's wrist this time. He was clutching it tight, like he was afraid of losing it.\"\n\n[Chronologie] The gold watch links the prowler to the scene." },
                    evidence: 'timeline'
                }
            ]
        },

        suspect: {
            intro: { fr: "Dans l'étude notariale austère de Blackwood, les piles de dossiers poussiéreux s'entassent. Le notaire transpire, desserrant frénétiquement son col.\n\n« Mes registres sont en règle ! S'il y a des anomalies, c'est que... bon, d'accord, le magnat conservait ses actes de fiducie et ses contrats originaux dans son coffre privé. Si ce coffre a été vidé, je suis ruiné, mais je n'y suis pour rien, je vous dis ! »\n\nBlackwood vous défie avec une grille. Ses mains tremblent.", en: "In Blackwood's austere notary office, dusty piles of files stack up. The notary sweats, frantically loosening his collar.\n\n\"My records are in order! If there are anomalies, it's because... well, alright, the magnate kept his trust deeds and original contracts in his private safe. If that safe was emptied, I'm ruined, but I had nothing to do with it, I tell you!\"\n\nBlackwood challenges you with a grid. His hands tremble." },
            questions: [
                {
                    id: 'blk_q1',
                    label: { fr: "« Les actes de fiducie du coffre ont disparu. Un audit était prévu. Vous étiez le seul à le savoir. »", en: "\"The trust deeds from the safe have vanished. An audit was due. You were the only one who knew.\"" },
                    response: { fr: "Blackwood essuie son front. « Je gère les affaires de moitié de la ville. Si chaque défalcation était un meurtre, le pendu ne suffirait plus. »\n\n[Mobile] Blackwood renvoie vers l'ampleur de ses affaires.", en: "Blackwood wipes his forehead. \"I manage half the city's affairs. If every embezzlement were a murder, the gallows wouldn't suffice.\"\n\n[Mobile] Blackwood redirects to the scope of his business." },
                    evidence: 'mobile'
                },
                {
                    id: 'blk_q2',
                    label: { fr: "« Votre relation avec la victime était-elle strictement professionnelle ? »", en: "\"Was your relationship with the victim strictly professional?\"" },
                    response: { fr: "« Le Duc était mon client depuis dix ans. Nous avions... des accords. Rien de plus. » Son regard fuit.\n\n[Témoin] Blackwood cache une relation plus personnelle.", en: "\"The Duke was my client for ten years. We had... arrangements. Nothing more.\" His gaze darts away.\n\n[Témoin] Blackwood hides a more personal relationship." },
                    evidence: 'witness'
                },
                {
                    id: 'blk_q3',
                    label: { fr: "« Des versements réguliers à V.K. figurent dans vos registres. »", en: "\"Regular payments to V.K. appear in your ledgers.\"" },
                    response: { fr: "Blackwood pâlit. « Ces versements... c'était pour des services. Des honoraires. Je ne peux pas divulguer la nature des contrats. »\n\n[Forensique] Blackwood reconnaît les versements mais refuse de s'expliquer.", en: "Blackwood pales. \"Those payments... they were for services. Fees. I cannot disclose the nature of the contracts.\"\n\n[Forensique] Blackwood acknowledges the payments but refuses to explain." },
                    evidence: 'forensic'
                }
            ],
            rounds2: [
                {
                    id: 'blk_r2q1',
                    label: { fr: "« Votre encre a signé des reçus pour le bar du Séducteur. Des dettes de jeu ? »", en: "\"Your ink signed receipts for the Seducer's bar. Gambling debts?\"" },
                    response: { fr: "Blackwood fait claquer son registre. « Je ne joue pas, inspecteur. Les jeux de hasard sont pour ceux qui ne savent pas compter. Moi, je joue avec les nombres, et les nombres ne trichent jamais. »\n\n[Mobile] Pas de cartes, pas de dés : Blackwood ne jure que par les chiffres.", en: "Blackwood snaps his ledger shut. \"I don't gamble, inspector. Games of chance are for those who cannot count. I play with numbers, and numbers never cheat.\"\n\n[Mobile] No cards, no dice: Blackwood swears by figures alone." },
                    evidence: 'mobile'
                },
                {
                    id: 'blk_r2q2',
                    label: { fr: "« La victime voulait retirer des fonds. Conflit d'intérêts ? »", en: "\"The victim wanted to withdraw funds. A conflict of interest?\"" },
                    response: { fr: "« Un notaire voit passer cent conflits par semaine. Le Duc voulait de la liquidité ; je lui ai conseillé de vendre des titres. C'est tout. » Sa main, elle, refait le même pli sur sa manche. Encore et encore.\n\n[Témoin] Un homme qui replie sa manche nerveusement n'est pas un homme tranquille.", en: "\"A notary sees a hundred conflicts a week. The Duke wanted liquidity; I advised him to sell securities. That is all.\" His hand, though, folds the same crease into his sleeve. Over and over.\n\n[Witness] A man who folds his sleeve nervously is not a calm man." },
                    evidence: 'witness'
                },
                {
                    id: 'blk_r2q3',
                    label: { fr: "« Qui, dans cette maison, connaissait le code du coffre ? »", en: "\"Who in this house knew the safe's code?\"" },
                    response: { fr: "Un rictus. « Le code ? Si je le savais, je l'aurais utilisé avant vous, croyez-moi. Mes chiffres à moi, je les sors d'un carnet, pas d'un coffre. »\n\n[Accès] Il évite la question du code. Ou il dit vrai. Le sudoku tranchera.", en: "A grimace. \"The code? If I knew it, I would have used it before you did, believe me. My figures come from a ledger, not a safe.\"\n\n[Opportunity] He dodges the code question. Or he tells the truth. The sudoku will settle it." },
                    evidence: 'opportunity'
                }
            ],
            rounds3: [
                {
                    id: 'blk_r3q1',
                    label: { fr: "« Vos chiffres du carnet ne tombent pas juste, Maître Blackwood. »", en: "\"Your ledger's figures don't add up, Master Blackwood.\"" },
                    response: { fr: "Pour la première fois, Blackwood sourit — un vrai sourire, presque d'amour-propre. « Ah. Enfin quelqu'un qui compte. Vous ne savez pas ce que c'est, inspecteur : dîner après dîner, des hommes qui parlent chevaux et canards. Mon sudoku du matin, lui, ne parle jamais pour ne rien dire. »\n\n[Méthode] Un amoureux des nombres. C'est par là qu'il faudra le prendre.", en: "For the first time, Blackwood smiles — a real smile, almost proud. \"Ah. Finally someone who counts. You have no idea, inspector: dinner after dinner, men talking horses and ducks. My morning sudoku never speaks to say nothing.\"\n\n[Method] A lover of numbers. That is how he must be taken." },
                    evidence: 'method'
                },
                {
                    id: 'blk_r3q2',
                    label: { fr: "« Résolvez-moi ce raisonnement : Hale sort ruiné du coffre, et vous, vous restez créancier. Coïncidence ? »", en: "\"Solve this for me: Hale leaves the safe ruined, and you remain a creditor. Coincidence?\"" },
                    response: { fr: "Il tapote son carnet. « Logique de bière, inspecteur. Si vous saviez équilibrer une colonne, vous sauriez qu'un créancier n'a rien à gagner à la mort de son débiteur : un mort ne rembourse pas. »\n\n[Alibi] L'argument est juste. Peut-être trop juste.", en: "He taps his ledger. \"Pub logic, inspector. If you could balance a column, you would know a creditor gains nothing from his debtor's death: the dead repay nothing.\"\n\n[Alibi] The argument is sound. Perhaps too sound." },
                    evidence: 'alibi'
                },
                {
                    id: 'blk_r3q3',
                    label: { fr: "« Alors prouvez que vos chiffres sont irréprochables. Toute votre grille tient debout ? »", en: "\"Then prove your figures are flawless. Does your whole grid hold up?\"" },
                    response: { fr: "Blackwood retire ses lunettes, les essuie lentement. Une occasion trop belle. « Irréprochables ? Prouvez que VOUS l'êtes. Je remplis un sudoku chaque matin, chronométré, depuis vingt ans. Une grille, une seule règle : chaque ligne, chaque colonne, chaque carré, un chiffre unique. Comme la vérité, inspecteur : une seule version tient. »\n\nIl pose sur le bureau une grille encore vierge. « Rendez-la complète sans faute, et j'ouvre mes registres jusqu'au moindre sou. »", en: "Blackwood removes his glasses and wipes them slowly. Too good an opening. \"Flawless? Prove that YOU are. I fill one sudoku every morning, timed, for twenty years. One grid, one rule: every row, every column, every square, a single digit. Like truth, inspector: only one version holds.\"\n\nHe lays a still-blank grid on the desk. \"Complete it without a single mistake, and I open my ledgers to the last penny.\"" },
                    evidence: 'method'
                }
            ],
            minigameIntro: { fr: "Blackwood vous tend une grille de sudoku, encore vierge, tracée à l'encre et à la règle. Autour de lui, son étude : pas de cartes à jouer, pas de dés, pas de futilités. Seulement des casse-tête de journal encadrés, tous complétés, signés et datés. Vingt ans de grilles.\n\n« Mon seul vice, inspecteur, c'est la logique pure. Le sudoku, c'est l'ordre du monde en neuf fois neuf cases : aucune chance, aucune grâce, une seule solution. Celui qui triche le sait toujours. »\n\nIl repousse ses dossiers et laisse la grille au centre du bureau. « Le hasard, moi, le refuse. Ce meurtre ne tiendra que si vos chiffres tiennent. Complétez ma grille, et mes registres s'ouvriront. »", en: "Blackwood hands you a still-blank sudoku grid, ruled in ink by hand. Around him, his study: no playing cards, no dice, no fripperies. Only framed newspaper puzzles, every one completed, signed and dated. Twenty years of grids.\n\n\"My only vice, inspector, is pure logic. Sudoku is the world's order in a nine-by-nine square: no luck, no mercy, one single solution. He who cheats is always found out.\"\n\nHe pushes his files aside and leaves the grid at the centre of the desk. \"Chance, I refuse it. This murder will only hold if your figures hold. Complete my grid, and my ledgers open.\"" },
            minigame: {
                type: 'sudoku',
                difficulty: [
                    { clue: { fr: "Blackwood craque : « Les versements venaient de Hale. Il payait pour des informations. Je n'ai pas tué, mais j'ai fermé les yeux. »", en: "Blackwood cracks: \"The payments came from Hale. He paid for information. I didn't kill, but I turned a blind eye.\"" }, failClue: { fr: "Blackwood se renfrogne : « Une grille imparfaite, un raisonnement imparfait. Mes affaires sont légales. Cherchez ailleurs. »", en: "Blackwood scowls: \"A flawed grid, a flawed argument. My business is legal. Look elsewhere.\"" }, rounds: [{ title: { fr: 'Sudoku (facile)', en: 'Sudoku (easy)' } }] },
                    { clue: { fr: "Blackwood avoue : « Hale me versait pour fermer les yeux sur ses détournements. Le meurtre était pas prévu, mais il a paniqué. »", en: "Blackwood confess: \"Hale paid me to turn a blind eye to his embezzlement. The murder wasn't planned, but he panicked.\"" }, failClue: { fr: "Blackwood garde le silence : « Je ne dis rien sans mon avocat. »", en: "Blackwood stays silent: \"I'm not saying anything without my lawyer.\"" }, rounds: [{ title: { fr: 'Sudoku (moyen)', en: 'Sudoku (medium)' } }] },
                    { clue: { fr: "Blackwood dit tout : « Hale a donné le code du coffre. C'est lui le commanditaire. Je l'ai couvert par peur. »", en: "Blackwood tells all: \"Hale gave the safe code. He's the mastermind. I covered for him out of fear.\"" }, failClue: { fr: "Blackwood regarde ailleurs : « Le notariat est une affaire de confiance. La mienne est brisée. »", en: "Blackwood looks away: \"Notary work is a trust business. Mine is broken.\"" }, rounds: [{ title: { fr: 'Sudoku (difficile)', en: 'Sudoku (hard)' } }] }
                ]
            }
        },

        criminel: {
            intro: { fr: "Victor Krane se retourne lentement. Il mâche un curedent. Il n'a pas l'air pressé. Posez votre question.", en: "Victor Krane turns slowly. He chews a toothpick. He doesn't look in a hurry. Ask your question." },
            questions: [
                {
                    id: 'kra_q1',
                    label: { fr: "« Vous étiez dans le quartier, cette nuit-là. »", en: "\"You were in the neighborhood that night.\"" },
                    response: { fr: "Krane hausse un sourcil. « Possible. J'étais chez le barman, à boire un verre. J'ai rien vu d'autre. »\n\n[Alibi] Alibi vague. Aucune confirmation.", en: "Krane raises an eyebrow. \"Maybe. I was at the bartender's, having a drink. I didn't see anything else.\"\n\n[Alibi] Vague alibi. No confirmation." },
                    evidence: 'alibi'
                },
                {
                    id: 'kra_q2',
                    label: { fr: "« Vous travaillez pour quelqu'un, à l'occasion. Qui ? »", en: "\"You work for people sometimes. Who?\"" },
                    response: { fr: "Krane sourit. « Pour qui paye. Cette nuit-là, j'étais seul. Mais les clochards du coin… ils traînent, ils voient, ils racontent. »\n\n[Témoin] Krane renvoie vers le marginal, discrètement.", en: "Krane smiles. \"For whoever pays. That night, I was alone. But the homeless around here… they hang around, they see, they talk.\"\n\n[Témoin] Krane redirects toward the marginal, discreetly." },
                    evidence: 'witness'
                },
                {
                    id: 'kra_q3',
                    label: { fr: "« Vous avez déjà travaillé pour le Duc ? »", en: "\"Have you ever worked for the Duke?\"" },
                    response: { fr: "Krane hésite un quart de seconde. « Le Duc ? Jamais. Trop clean pour moi. Mais quelqu'un de son entourage, oui. Récemment. »\n\n[Accès] Quelqu'un de l'entourage a engagé Krane. À identifier.", en: "Krane hesitates for a quarter of a second. \"The Duke? Never. Too clean for me. But someone from his circle, yes. Recently.\"\n\n[Accès] Someone from the circle hired Krane. To identify." },
                    evidence: 'opportunity'
                }
            ],
            redirect: { target: 'marginal', reason: 'passé_trouble' },
            rounds2: [
                {
                    id: 'kra_r2q1',
                    label: { fr: "« Silas Crane dit que vous rôdez dans le quartier depuis des semaines. »", en: "\"Silas Crane says you've been prowling the neighborhood for weeks.\"" },
                    response: { fr: "Krane éclate d'un rire bref. « Le clochard raconte tout et n'importe quoi. Un vagabond au passé trouble : voilà votre seul témoin, inspecteur ? »\n\n[Témoin] Krane accuse le marginal, vagabond au passé trouble. Il retourne l'arme.", en: "Krane bursts into a brief laugh. \"The homeless man says anything and everything. A vagrant with a murky past : that's your only witness, inspector?\"\n\n[Témoin] Krane accuses the marginal, a vagrant with a murky past. He turns the weapon around." },
                    evidence: 'witness'
                },
                {
                    id: 'kra_r2q2',
                    label: { fr: "« Vos empreintes sont dans le manoir. »", en: "\"Your prints are in the manor.\"" },
                    response: { fr: "« J'ai déménagé des meubles là-bas, l'an dernier. Les gens oublient les déménageurs. Ils se souviennent des assassins. »\n\n[Forensique] Explication vérifiable. L'ADN parlera de tout le monde, de lui aussi.", en: "\"I moved furniture there, last year. People forget the movers. They remember the killers.\"\n\n[Forensique] A verifiable explanation. The DNA speaks of everyone, him too." },
                    evidence: 'forensic'
                },
                {
                    id: 'kra_r2q3',
                    label: { fr: "« Que faisait votre voiture près du pavillon à 22h ? »", en: "\"What was your car doing near the pavilion at 10pm?\"" },
                    response: { fr: "« Ma voiture ? Elle dort chez le garagiste. Courroie morte. Vous pouvez appeler. » Un demi-sourire. « Encore une panne, tiens. »\n\n[Alibi] Une panne, comme Pembrooke. Trop de pannes dans cette affaire.", en: "\"My car? It's sleeping at the garage. Dead belt. You can call.\"\n\n[Alibi] A breakdown, like Pembrooke. Too many breakdowns in this case." },
                    evidence: 'alibi'
                }
            ],
            rounds3: [
                {
                    id: 'kra_r3q1',
                    label: { fr: "« Le carnet de comptes mentionne « V.K. » Des versements réguliers. »", en: "\"The ledger mentions 'V.K.' Regular payments.\"" },
                    response: { fr: "Krane crache son curedent. « Des versements, des mains, des signatures. Vous savez lire, inspecteur : lisez jusqu'au bout. Qui a des empreintes sur cette page ? »\n\n[Forensique] Krane renvoie aux empreintes de Hale sur le carnet.", en: "Krane spits out his toothpick. \"Payments, hands, signatures. You can read, inspector : read to the end. Whose prints are on that page?\"\n\n[Forensique] Krane points back to Hale's prints on the ledger." },
                    evidence: 'forensic'
                },
                {
                    id: 'kra_r3q2',
                    label: { fr: "« Qui vous a engagé, la première fois ? »", en: "\"Who hired you, the first time?\"" },
                    response: { fr: "Un long silence. « Un intermédiaire. Le paiement est venu d'un compte du manoir. Le reste, c'est l'affaire de mon avocat. »\n\n[Mobile] Le commanditaire paie depuis le manoir. Hale est garde du corps et majordome en chef.", en: "A long silence. \"A middleman. The payment came from a manor account. The rest is my lawyer's business.\"\n\n[Mobile] The mastermind pays from the manor. Hale is bodyguard and chief butler." },
                    evidence: 'mobile'
                },
                {
                    id: 'kra_r3q3',
                    label: { fr: "« Vous aviez ordre de voler, pas de tuer ? »", en: "\"You were ordered to steal, not to kill?\"" },
                    response: { fr: "« Je ne réponds pas aux hypothèses. » Il se redresse. « Mais demandez-vous pourquoi le coffre était si facile à ouvrir. Le code, quelqu'un l'a donné. »\n\n[Accès] Le code du coffre a été fourni de l'intérieur.", en: "\"I don't answer hypotheticals.\" He straightens up. \"But ask yourself why the safe was so easy to open. The code, someone gave it.\"\n\n[Accès] The safe code was provided from the inside." },
                    evidence: 'opportunity'
                }
            ],
            minigameIntro: { fr: "Krane renverse une main de cartes sur la table. « Vous savez ce qui tient un homme de main en vie, inspecteur ? La mémoire. Où était la caméra. Qui a vu quoi. Combien de temps avant que le client ne devienne un problème. »\n\nIl étale les trente-deux cartes en un damier parfait, faces contre la table. « Je retourne des paires chaque soir, dans ma cellule ou sur un banc de gare. Un professionnel qui oublie est un professionnel qui pourrit. »\n\nIl vous toise. « Retenez où passent les noms, inspecteur. Retenez mieux que moi, et je vous dirai qui m'a payé. »", en: "Krane overturns a hand of cards onto the table. \"You know what keeps a hired hand alive, inspector? Memory. Where the camera was. Who saw what. How long before a client becomes a problem.\"\n\nHe spreads the thirty-two cards into a perfect grid, faces down. \"I turn pairs every night, in my cell or on a station bench. A professional who forgets is a professional who rots.\"\n\nHe eyes you. \"Remember where the names pass, inspector. Remember better than I do, and I'll tell you who paid me.\"" },
            minigame: {
                type: 'memory',
                difficulty: [
                    { clue: { fr: "Krane murmure : « Le paiement venait d'un compte du manoir. Hale avait les codes. »", en: "Krane murmurs: \"The payment came from a manor account. Hale had the codes.\"" }, failClue: { fr: "Krane ricane : « Je travaille pour qui paye. Rien de plus à dire. »", en: "Krane laughs: \"I work for whoever pays. Nothing more to say.\"" }, rounds: [{ title: { fr: 'Mémoire 4×4', en: 'Memory 4×4' } }] },
                    { clue: { fr: "Krane avoue : « Hale m'a engagé pour le vol. Le meurtre était pas au programme, mais il a paniqué. »", en: "Krane confess: \"Hale hired me for the robbery. The murder wasn't in the plan, but he panicked.\"" }, failClue: { fr: "Krane se tait : « Mon avocat vous dira ce qu'il faut. Je ne parle pas sans lui. »", en: "Krane goes silent: \"My lawyer will tell you what's needed. I'm not talking without him.\"" }, rounds: [{ title: { fr: 'Mémoire 6×4', en: 'Memory 6×4' } }] },
                    { clue: { fr: "Krane crache le morceau : « Hale a donné le code du coffre. C'est lui le commanditaire. Tout. »", en: "Krane spills: \"Hale gave the safe code. He's the mastermind. Everything.\"" }, failClue: { fr: "Krane se renfrogne : « Les versements ? Hale gérait les comptes. Cherchez les registres. »", en: "Krane scowls: \"The payments? Hale managed the accounts. Look at the ledgers.\"" }, rounds: [{ title: { fr: 'Mémoire 6×6', en: 'Memory 6×6' } }] }
                ]
            }
        },

        seducteur: {
            intro: { fr: "Au bar, Pembrooke essuie le même verre depuis que vous êtes entré. Il jauge ses mots comme des paris. Choisissez votre angle.", en: "At the bar, Pembrooke has been wiping the same glass since you walked in. He weighs his words like bets. Pick your angle." },
            questions: [
                {
                    id: 'sed_q1',
                    label: { fr: "« Votre voiture est tombée en panne à 22h pile. Curieux timing. »", en: "\"Your car broke down at 10pm sharp. Curious timing.\"" },
                    response: { fr: "Pembrooke pose son chiffon. « Curieux, oui. Le garagiste parle d'une durite sectionnée. Vous savez qui sectionne une durite, inspecteur ? Quelqu'un qui veut que vous soyez AU BAR et pas AU MANOIR. »\n\n[Alibi] La panne le plaçait loin des lieux. Quelqu'un l'a voulu là.", en: "Pembrooke sets down his rag. \"Curious, yes. The mechanic mentions a severed hose. You know who severs a hose, inspector? Someone who wants you AT THE BAR and not AT THE MANOR.\"\n\n[Alibi] The breakdown kept him away from the scene. Someone wanted him there." },
                    evidence: 'alibi'
                },
                {
                    id: 'sed_q2',
                    label: { fr: "« Vous deviez de l'argent au Duc. Combien, exactement ? »", en: "\"You owed the Duke money. How much, exactly?\"" },
                    response: { fr: "Il ricane. « Assez pour qu'il me tienne en laisse, pas assez pour que je saute par la fenêtre. Il menaçait de tout dire à ma famille. Les reçus dorment dans son coffre. Allez vérifier. »\n\n[Mobile] Une dette, un chantage. Pembrooke avait un mobile, mais pas de mains libres.", en: "He smirks. \"Enough for him to keep me on a leash, not enough to make me jump out a window. He threatened to tell my family. The receipts sleep in his safe. Go check.\"\n\n[Mobile] A debt, a blackmail. Pembrooke had a motive, but no free hands." },
                    evidence: 'mobile'
                },
                {
                    id: 'sed_q3',
                    label: { fr: "« Lady Vivienne. Parlez-moi de cette liaison. »", en: "\"Lady Vivienne. Tell me about the affair.\"" },
                    response: { fr: "Un flinch. « Qui vous l'a dit ? Hale. Toujours Hale. Oui, il nous a vus. Et je peux vous dire que ce n'était pas de l'amour, de part et d'autre. Vivienne joue avec tout le monde. Surtout avec ceux qui croient jouer. »\n\n[Témoin] La liaison est réelle. Mais qui manipulait qui ?", en: "A flinch. \"Who told you? Hale. Always Hale. Yes, he saw us. And I can tell you it wasn't love, on either side. Vivienne plays everyone. Especially those who think they're playing.\"\n\n[Witness] The affair is real. But who was playing whom?" },
                    evidence: 'witness'
                }
            ],
            redirect: { target: 'protecteur', reason: 'jalousie' },
            rounds2: [
                {
                    id: 'sed_r2q1',
                    label: { fr: "« Vous fréquentez ce bar souvent ? Le tenancier vous connaît bien. »", en: "\"You frequent this bar often? The landlord knows you well.\"" },
                    response: { fr: "« Trop, oui. » Il désigne la machine à sous coincée entre deux tonneaux. « C'est là que je paie mes dettes... en pièces de cuivre. Jackpot après jackpot raté. Le propriétaire connaît mon visage mieux que ma banque. »\n\n[Témoin] Un joueur accro. Toujours au même endroit, toutes les nuits.", en: "\"Too often, yes.\" He points at the slot machine wedged between two barrels. \"That's where I pay my debts... in copper coins. Jackpot after missed jackpot. The owner knows my face better than my bank.\"\n\n[Witness] A hooked gambler. Same spot, every night." },
                    evidence: 'witness'
                },
                {
                    id: 'sed_r2q2',
                    label: { fr: "« Major Hale vous a rejoint en panne. Que s'est-il dit, entre vous deux ? »", en: "\"Major Hale joined you in your breakdown. What was said between you two?\"" },
                    response: { fr: "« Des banalités. La pluie, les dettes, la lenteur des dépanneurs. » Une hésitation. « Il fumait. Hale ne fume que quand il attend quelque chose. Ce soir-là, il attendait. »\n\n[Alibi] L'alibi de Hale repose sur Pembrooke. Et Pembrooke a vu Hale attendre.", en: "\"Trifles. The rain, debts, the slowness of towmen.\" A hesitation. \"He smoked. Hale only smokes when he's waiting for something. That night, he was waiting.\"\n\n[Alibi] Hale's alibi rests on Pembrooke. And Pembrooke saw Hale waiting." },
                    evidence: 'alibi'
                },
                {
                    id: 'sed_r2q3',
                    label: { fr: "« On vous a vu quitter le bar à deux reprises cette nuit-là. Où alliez-vous ? »", en: "\"You were seen leaving the bar twice that night. Where were you going?\"" },
                    response: { fr: "« Aux toilettes. Puis téléphoner. » Il essuie encore son verre. « Une machine à sous, un couloir, une porte de service. Vous voulez vérifier ? Allez-y. Mais personne ne me quitte des yeux ici : je suis le fantôme du jackpot. »\n\n[Witness] Ses allées et venues restent floues. À creuser.", en: "\"The privy. Then to phone.\" He wipes the glass again. \"A slot machine, a corridor, a service door. Want to check? Go ahead. But nobody takes their eyes off me here: I'm the jackpot's ghost.\"\n\n[Witness] His comings and goings stay blurry. Dig deeper." },
                    evidence: 'witness'
                }
            ],
            rounds3: [
                {
                    id: 'sed_r3q1',
                    label: { fr: "« Votre dette s'est envolée du coffre avec les reçus. Heureux ? »", en: "\"Your debt vanished from the safe with the receipts. Happy?\"" },
                    response: { fr: "« Joyeux comme un condamné à qui l'on retire la corde pour lui mettre un fusil. Ce coffre, inspecteur, c'était ma corde. Quelqu'un l'a vidée avant moi — et maintenant je suis le seul à savoir ce qu'elle contenait. »\n\n[Mobile] Les reçus de Pembrooke ont disparu du coffre. Un témoin utile aux commanditaires.", en: "\"As happy as a condemned man whose noose is swapped for a gun. That safe, inspector, was my noose. Someone emptied it before I could — and now I'm the only one who knows what it held.\"\n\n[Mobile] Pembrooke's receipts vanished from the safe. A witness the masterminds prefer alive." },
                    evidence: 'mobile'
                },
                {
                    id: 'sed_r3q2',
                    label: { fr: "« Vivienne. Hale la couve comme une grenade dégoupillée. Vous savez pourquoi ? »", en: "\"Vivienne. Hale hovers over her like an armed grenade. Why, do you think?\"" },
                    response: { fr: "Pembrooke éclate d'un rire bref. « Hale ? Il la regarde comme on regarde une église fermée : avec dévotion et avec frustration. Il est amoureux depuis des années. Elle le sait. Elle s'en sert comme d'un parapluie. »\n\n[Témoin] Le protecteur est secrètement amoureux de la femme fatale. Tout le manoir le sent, sauf lui.", en: "Pembrooke bursts into brief laughter. \"Hale? He looks at her the way one looks at a closed church: with devotion and with frustration. He's been in love for years. She knows. She uses him as an umbrella.\"\n\n[Witness] The bodyguard is secretly in love with the femme fatale. The whole manor feels it, but him." },
                    evidence: 'witness'
                },
                {
                    id: 'sed_r3q3',
                    label: { fr: "« Assez de verres essuyés, Pembrooke. Jouons à quelque chose de plus lucratif. »", en: "\"Enough glass-wiping, Pembrooke. Let's play something more lucrative.\"" },
                    response: { fr: "Ses yeux s'allument malgré lui. « Lucratif ? » Il tape deux coups sur le bois. « Vous avez remarqué : c'est ma seule hiérarchie, le hasard. Quand je mise, je ne mens pas, inspecteur. Pas même à moi-même. »\n\nIl se lève, entraîné vers la machine à sous par une force plus vieille que sa peur. « Asseyez-vous. Vous me cuisinez, c'est bien — mais cuisinez-moi pendant que je joue. Si la chance me quitte, vous aurez mes aveux en prime. »", en: "His eyes light up despite himself. \"Lucrative?\" He taps the wood twice. \"You've noticed: chance is my only hierarchy. When I bet, I don't lie, inspector. Not even to myself.\"\n\nHe rises, pulled toward the slot machine by a force older than his fear. \"Sit down. Grill me, by all means — but grill me while I play. If luck leaves me, my confessions come with the game.\"" },
                    evidence: 'dialogue'
                }
            ],
            minigameIntro: { fr: "Pembrooke s'assoit devant la machine à sous du bar, sort une poignée de pièces de cuivre et les aligne devant lui comme un arsenal. « Vous avez vu la meute au QG ? Notaires, majors, homme de main. Ils comptent, ils tracent, ils déduisent. Moi, inspecteur, je ne sais faire qu'une chose : croire qu'un bras de fer en laiton peut changer une vie. »\n\nIl lèche une pièce avant de l'introduire. « C'est mon poison. Le jackpot. Trois rouleaux, une promesse : le sort peut vous sourire, même quand tout le monde vous tourne le dos. »\n\n« Alors faites vos questions, inspecteur. Cuisinez-moi. Chaque spin est un secret de moins : si la machine me lâche avant vos soupçons, j'avoue tout. »", en: "Pembrooke sits down before the bar's slot machine, pulls out a fistful of copper coins and lines them up like an arsenal. \"You saw the pack at HQ? Notaries, majors, hired hands. They count, they chart, they deduce. Me, inspector, I only know one thing: believing a brass arm-wrestle can change a life.\"\n\nHe licks a coin before feeding it in. \"That's my poison. The jackpot. Three reels, one promise: fate may smile on you even when everyone else turns their back.\"\n\n\"So ask your questions, inspector. Grill me. Every spin is one secret fewer: if the machine drops me before your suspicions do, I confess everything.\"" },
            minigame: {
                type: 'jackpot',
                difficulty: [
                    { clue: { fr: "La machine toussote. Pembrooke lâche : « La panne de ma voiture ? Le Major Hale m'a demandé de m'arrêter au bar à 22h. Il savait pourquoi, lui. »", en: "The machine coughs. Pembrooke lets slip: \"My car's breakdown? Major Hale asked me to stop at the bar at 10pm. He knew why, he did.\"" }, failClue: { fr: "Un jackpot. Pembrooke rit : « La chance me couvre, inspecteur. Comme toujours. »", en: "A jackpot. Pembrooke laughs: \"Luck shields me, inspector. As always.\"" }, rounds: [{ title: { fr: 'Jackpot (6 spins)', en: 'Jackpot (6 spins)' }, spins: 6, winThreshold: 1 }] },
                    { clue: { fr: "Pembrooke perd ses pièces un à un : « Hale m'a payé pour être ici. La panne était un théâtre, et moi le comparse. Il voulait le manoir vide. »", en: "Pembrooke loses his coins one by one: \"Hale paid me to be here. The breakdown was theatre, and I was the extra. He wanted the manor empty.\"" }, failClue: { fr: "La machine brille. Pembrooke salue votre maladresse : « Même le hasard ne parle pas. »", en: "The machine gleams. Pembrooke salutes your clumsiness: \"Even chance won't talk.\"" }, rounds: [{ title: { fr: 'Jackpot (7 spins)', en: 'Jackpot (7 spins)' }, spins: 7, winThreshold: 2 }] },
                    { clue: { fr: "Pembrooke est à sec. Il souffle : « Le coffre ? J'y ai vu des ordres signés Hale à Krane. Le garde du corps commanditait le cambriolage. C'est tout ce que je sais, et tout ce que je risque. »", en: "Pembrooke is broke. He exhales: \"The safe? I saw orders signed Hale to Krane. The bodyguard commissioned the burglary. That's all I know, and all I risk.\"" }, failClue: { fr: "Jackpot ! Pembrooke encaisse et salue : « La fortune aime les sceptiques. »", en: "Jackpot! Pembrooke cashes in and bows: \"Fortune loves the sceptics.\"" }, rounds: [{ title: { fr: 'Jackpot (9 spins)', en: 'Jackpot (9 spins)' }, spins: 9, winThreshold: 3 }] }
                ]
            }
        },

        'detective-partner': {
            intro: { fr: "Wexford allume sa pipe. « Je ne suis pas suspect, mais vous pouvez tout de même m'interroger. »", en: "Wexford lights his pipe. \"I'm not a suspect, but you can still question me.\"" },
            questions: [
                {
                    id: 'wex_q1',
                    label: { fr: "« Par où doit-on commencer ? »", en: "\"Where should we start?\"" },
                    response: { fr: "Wexford sourit. « Toujours par la victime. Qui la connaissait, qui avait accès à sa maison, qui avait un mobile. Les trois cercles se recoupent presque toujours. »\n\n[Méthode] Méthode d'enquête classique.", en: "Wexford smiles. \"Always start with the victim. Who knew him, who had access to his house, who had a motive. The three circles almost always overlap.\"\n\n[Méthode] Classic investigation method." },
                    evidence: 'witness'
                },
                {
                    id: 'wex_q2',
                    label: { fr: "« Vous avez travaillé sur d'autres affaires pour le Duc ? »", en: "\"Have you worked other cases for the Duke?\"" },
                    response: { fr: "Wexford secoue la tête. « Pas moi, mais mon ancien partenaire. Une affaire de chantage, il y a cinq ans. Classée sans suite. »\n\n[Témoin] Une vieille affaire pourrait ressurgir.", en: "Wexford shakes his head. \"Not me, but my former partner. A blackmail case, five years ago. Closed without follow-up.\"\n\n[Témoin] An old case might resurface." },
                    evidence: 'witness'
                },
                {
                    id: 'wex_q3',
                    label: { fr: "« Faites-vous confiance à l'équipe de Whitmore ? »", en: "\"Do you trust Whitmore's team?\"" },
                    response: { fr: "Wexford hausse les épaules. « Whitmore est un scientifique, pas un enquêteur. Il fait des analyses, pas des déductions. Mais il est honnête. »\n\n[Méthode] Whitmore = faits, pas théories.", en: "Wexford shrugs. \"Whitmore is a scientist, not an investigator. He does analyses, not deductions. But he's honest.\"\n\n[Méthode] Whitmore = facts, not theories." },
                    evidence: 'witness'
                }
            ]
        },

        scientifique: {
            intro: { fr: "Whitmore essuie ses lunettes. « Posez-moi vos questions, mais je ne fais que confirmer ou infirmer ce que vous soupçonnez. »", en: "Whitmore wipes his glasses. \"Ask your questions, but I can only confirm or deny what you suspect.\"" },
            questions: [
                {
                    id: 'wht_q1',
                    label: { fr: "« L'ADN inconnu, c'est qui ? »", en: "\"The unknown DNA, who is it?\"" },
                    response: { fr: "Whitmore hésite. « Ce n'est dans aucun fichier officiel. Mais ce n'est pas un inconnu pour la victime : ses empreintes sont sur le bureau, sur le verre, sur la poignée. »\n\n[Forensique] L'inconnu connaissait la victime.", en: "Whitmore hesitates. \"It's not in any official file. But it's not a stranger to the victim: his prints are on the desk, the glass, the door handle.\"\n\n[Forensique] The unknown knew the victim." },
                    evidence: 'forensic'
                },
                {
                    id: 'wht_q2',
                    label: { fr: "« Y a-t-il des traces de tout le monde sur la scène ? »", en: "\"Are there traces of everyone at the scene?\"" },
                    response: { fr: "Whitmore acquiesce. « Oui, et c'est normal. La victime recevait beaucoup : Hale, Blackwood, Pembrooke, Lady Vivienne. Tous ont touché quelque chose. »\n\n[Forensique] L'ADN ne disculpe personne automatiquement.", en: "Whitmore nods. \"Yes, and that's normal. The victim entertained a lot: Hale, Blackwood, Pembrooke, Lady Vivienne. All touched something.\"\n\n[Forensique] DNA doesn't automatically clear anyone." },
                    evidence: 'forensic'
                },
                {
                    id: 'wht_q3',
                    label: { fr: "« Et la montre, qu'avez-vous relevé ? »", en: "\"And the watch, what did you find?\"" },
                    response: { fr: "Whitmore sort ses notes. « L'heure est cohérente. L'aiguille s'est figée lors d'un choc violent. Le verre est brisé net, pas usé. Le mécanisme s'est arrêté net. »\n\n[Forensique] L'heure du crime est fiable.", en: "Whitmore pulls out his notes. \"The time is consistent. The hand froze during a violent impact. The glass broke clean, not worn. The mechanism stopped dead.\"\n\n[Forensique] The time of death is reliable." },
                    evidence: 'timeline'
                }
            ],
            minigame: {
                type: 'asteroids',
                difficulty: [
                    { clue: { fr: "Whitmore confirme : « L'ADN inconnu correspond à Victor Krane. Il a été en contact direct avec la victime. »", en: "Whitmore confirms: \"The unknown DNA matches Victor Krane. He had direct contact with the victim.\"" }, failClue: { fr: "Whitmore hausse les épaules. « L'ADN ne ment pas, mais il ne dit pas tout. Continuez l'enquête. »", en: "Whitmore shrugs. \"DNA doesn't lie, but it doesn't tell everything. Continue the investigation.\"" }, rounds: [{ title: { fr: 'Astéroïdes 1', en: 'Asteroids 1' } }] }
                ]
            }
        },

        detective: {
            intro: { fr: "Votre partenaire Wexford s'assombrit. « Posez-moi vos questions, inspecteur. Mais je ne répondrai qu'à ce que je sais. »", en: "Your partner Wexford darkens. \"Ask your questions, inspector. But I'll only answer what I know.\"" },
            questions: [
                {
                    id: 'wex_q1',
                    label: { fr: "« Depuis quand travaillez-vous avec la victime ? »", en: "\"How long have you worked with the victim?\"" },
                    response: { fr: "Wexford allume sa pipe. « Cinq ans. Je l'ai connu quand il était déjà paranoïaque. Il changeait de coffre tous les mois. »\n\n[Témoin] Wexford connaît les habitudes de la victime depuis longtemps.", en: "Wexford lights his pipe. \"Five years. I knew him when he was already paranoid. He changed safes every month.\"\n\n[Témoin] Wexford has known the victim's habits for a long time." },
                    evidence: 'witness'
                },
                {
                    id: 'wex_q2',
                    label: { fr: "« Avez-vous des ennemis dans la police ? »", en: "\"Do you have enemies in the police?\"" },
                    response: { fr: "Wexford sourit. « Mon ancien partenaire. Une affaire de chantage classée sans suite. Il m'en veut toujours. »\n\n[Mobile] Une vieille affaire pourrait ressurgir.", en: "Wexford smiles. \"My former partner. A blackmail case closed without follow-up. He still holds a grudge.\"\n\n[Mobile] An old case might resurface." },
                    evidence: 'mobile'
                },
                {
                    id: 'wex_q3',
                    label: { fr: "« Que pensez-vous de l'ADN qui désigne tout le monde ? »", en: "\"What do you think of the DNA that points to everyone?\"" },
                    response: { fr: "Wexford secoue la tête. « C'est un leurre. La victime recevait tout le monde. L'assassin a juste eu besoin de toucher quelque chose après le crime pour brouiller les pistes. »\n\n[Forensique] L'ADN a été intentionnellement mélangé.", en: "Wexford shakes his head. \"It's a red herring. The victim received everyone. The killer just had to touch something after the crime to muddy the trails.\"\n\n[Forensique] The DNA was intentionally mixed." },
                    evidence: 'forensic'
                }
            ],
            minigame: {
                type: 'asteroids',
                difficulty: [
                    { clue: { fr: "Wexford désigne un nom sur le tableau : « Regardez plutôt du côté de Hale. Ses dettes, ses versements... tout est là. »", en: "Wexford points to a name on the board: \"Look instead at Hale. His debts, his payments... it's all there.\"" }, failClue: { fr: "Wexford souffle : « Continuez l'enquête, inspecteur. La vérité éclatera bien assez tôt. »", en: "Wexford sighs: \"Continue the investigation, inspector. The truth will emerge soon enough.\"" }, rounds: [{ title: { fr: 'Astéroïdes 1', en: 'Asteroids 1' } }] }
                ]
            }
        }
    };

    /* =================================================================
       EXPORTS GLOBAUX
    ================================================================= */

    global.TDNarration = N;
    global.TDNarrationTruths = T;

})(typeof globalThis !== 'undefined' ? globalThis : this);
