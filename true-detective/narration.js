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
        page0: { fr: "Le brouillard descend sur la ville, la nuit. Les becs de gaz dessinent des halos orange sur le pavé mouillé, les fiacres claquent sur les ponts, et dans les ruelles, les chamarrures des enseignes se devinent à peine. Une cité de cheminées et de secrets, où chaque fenêtre éclairée cache une affaire, et où l'on ne compte plus les affaires qui attendent un regard lucide. Ce soir, c'est la vôtre.", en: "Fog settles over the city, night has fallen. Gas lamps draw orange halos on the wet cobblestones, cabs clatter across the bridges, and in the alleys the painted shop signs are barely visible. A city of chimneys and secrets, where every lit window hides a case, and where the cases waiting for a clear eye are countless. Tonight, one of them is yours." },
        page1: { fr: "La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie. On vous a confié l'enquête : la plus délicate de votre carrière.", en: "The city whispers under the rain. In a lavish flat, a real-estate magnate was found dead. You have been assigned the case: the most delicate of your career." },
        page2: { fr: "Vous poussez la porte de la scène de crime. Le sang a séché sur le parquet, le coffre est béant, et sur une table gît une montre de poche brisée. Personne ne sait encore quand le magnat est mort : aucune heure n'est établie. C'est à vous de la trouver.", en: "You push open the door of the crime scene. Blood has dried on the floor, the safe gapes open, and on a table lies a broken pocket watch. No one knows yet when the magnate died: no time of death is established. Finding it is your job." },
        page3: { fr: "Votre partenaire vous rejoint, l'air grave : « La victime, un magnat, n'avait qu'un seul domestique : son garde du corps, le Major Hale. C'est lui qui a découvert le corps. L'affaire commence ici. »", en: "Your partner joins you, looking grave: \"The victim, a tycoon, had one servant: his bodyguard, Major Hale. He found the body. The case begins here.\"" }
    };

    N.intro2 = {
        page1: { fr: "« Examinez la pièce avant de poser vos questions », souffle le partenaire.", en: "\"Examine the room before asking questions,\" your partner whispers." },
        page2: { fr: "La montre du Duc gît sur la table du salon, brisée. « Elle a dû valser dans la bagarre, souffle Wexford. Voyez ce qu'elle peut encore nous apprendre. »", en: "The Duke's watch lies on the lounge table, broken. \"It must have flown off in the struggle,\" Wexford sighs. \"See what it can still tell us.\"" },
        page3: { fr: "Le carnet déchiré révèle des pages manquantes. En les reconstituant, vous découvrez des versements réguliers à un certain « V.K. ».\n\nVotre partenaire vous observe : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »", en: "Your partner watches you : \"Are you onto something? These clues are forming a motive. Let's continue.\"" }
    };

    N.act1_1 = {
        page1: { fr: "Le Major Hale, garde du corps et majordome en chef, vous accueille dans le salon du manoir avec un mélange de nervosité et d'arrogance. « Je vous ai attendu. La maison est en deuil, faites vite. »\n\nVous l'observez. Hale se tient droit, mais ses yeux vous fuient. Choisissez votre angle d'attaque.", en: "Major Hale, bodyguard and chief butler, greets you in the manor lounge with a mix of nervousness and arrogance. \"I've been expecting you. The house is in mourning, make it quick.\"\n\nYou observe him. Hale stands straight, but his eyes avoid yours. Pick your angle of attack." },
        page2: { fr: "Lady Vivienne, d'une voix posée dans le boudoir : « Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. »\n\nElle reste de marbre, une tasse de thé à la main. Elle attend votre première question.", en: "Lady Vivienne, in a calm voice in the boudoir: \"My husband had enemies, certainly. But the perpetrator… it's someone from the house.\"\n\nShe remains stone-faced, a teacup in hand. She waits for your first question." },
        page3: { fr: "Deux témoignages, deux visages du manoir. Wexford range ses notes. « Hale est trop nerveux, Vivienne trop froide. L'un des deux cache quelque chose, ou tous les deux. Le notaire du Duc tenait les cordons de la bourse, et un témoin a vu une ombre dans la ruelle. Allons les découvrir. »", en: "Two testimonies, two faces of the manor. Wexford files away his notes. \"Hale is too nervous, Vivienne too cold. One of them is hiding something, or both. Notary Blackwood held the Duke's purse strings, and the homeless man saw a shadow in the alley. Let's go find out.\"" },
    };

    N.act1_2 = {
        page1: { fr: "Avant de partir, vous revoyez vos notes avec Wexford dans le vestibule du manoir. « Un témoin dans la ruelle a vu quelque chose cette nuit-là. Mais passons d'abord chez le notaire du Duc, il gérait les affaires du Duc. Et le témoin, on l'interceptera au retour. »", en: "Before leaving, you review your notes with Wexford in the manor vestibule. \"The homeless man in the alley saw something that night. But let's stop by Blackwood's, the notary, he handled the Duke's affairs. We'll catch the homeless man on the way back.\"" },
        page2: { fr: "Chez Rupert Blackwood, dans son appartement cossu. Il vous ouvre, l'air nerveux.\n\n« Entrez, inspecteur. Je ne sais pas ce que trafique le Duc ces derniers temps, mais les tensions sur le testament se multiplient. J'ai peur que tout cela finisse mal. »\n\nDerrière son bureau de notaire, il paraît fatigué. Il vous fait signe de vous asseoir.", en: "At Rupert Blackwood's place, in his lavish apartment. He opens the door, looking uneasy.\n\n\"Come in, inspector. I don't know what the Duke has been up to lately, but the tensions around the will keep growing. I'm afraid this will end badly.\"\n\nBehind his notary desk, he looks tired. He gestures for you to sit." },
        page3: { fr: "Sur le chemin du retour, à la sortie du manoir, dans la ruelle adjacente, Silas Crane grelotte dans un coin. Vous l'abordez doucement.\n\n« T'as une pièce, inspecteur ? »\n\nVous lui glissez une monnaie. Il se détend, prêt à parler.", en: "On the way back, at the manor exit, in the adjacent alley, Silas Crane is shivering in a corner. You approach him gently.\n\n\"Got a coin, inspector?\"\n\nYou slip him some change. He relaxes, ready to talk." }
    };

    N.act2_1 = {
        page1: { fr: "Au quartier général, votre partenaire recompte les indices. « Les analyses ADN parleront d'elles-mêmes. Filons au bar. »", en: "At headquarters, your partner tallies the clues. \"The DNA analyses will speak for themselves. Let's go to the bar.\"" },
        page2: { fr: "À l'intérieur du bar, la fumée stagne sous les néons. Vous vous installez au comptoir, à côté de Julian Pembrooke.\n\n« Monsieur Pembrooke. On vous a vu avec la victime la veille de sa mort. Comment l'expliquez-vous ?\n\nPembrooke fait tourner son verre sans y porter les lèvres. Il vous regarde par-dessous, un sourire en coin.", en: "Inside the bar, smoke lingers under the neon lights. You sit at the counter, next to Julian Pembrooke.\n\n“Mr. Pembrooke. You were seen with the victim the day before his death. How do you explain that ?\n\nPembrooke spins his glass without raising it to his lips. He glances at you from under his brow, a wry smile.”" },
        page3: { fr: "Dehors, devant le bar, votre partenaire note : « Pembrooke est nerveux. Il a quelque chose à cacher, mais quoi ? On n'a pas encore toutes les pièces du puzzle. »", en: "Outside, in front of the bar, your partner notes: \"Pembrooke is nervous. He's hiding something, but what? We don't have all the pieces yet.\"" }
    };

    N.act2_2 = {
        page1: { fr: "Au laboratoire, la lumière est stérile et froide. Les grilles d'analyse lumineuses scintillent au-dessus des paillasses. Le docteur Whitmore relève la tête de ses lunettes, le visage grave.\n\n« Inspecteur, les analyses sont sans appel. L'ADN relevé sur l'arme du crime et sur le battant de la porte... ne désigne pas un coupable. Il les désigne tous. Des traces infimes de chaque suspect ont été retrouvées sur les lieux. »\n\nIl pose un dossier épais sur la table.\n\n« La scène a été touchée, manipulée, fréquentée par chacun d'eux. Il va falloir les confronter directement chez eux, dans leurs décors, pour voir comment ils réagissent. Cherchez la faille dans leurs alibis. »", en: "At the laboratory, the light is sterile and cold. The luminous analysis grids flicker above the benches. Dr. Whitmore looks up from his glasses, his face grave.\n\n\"Inspector, the analyses are conclusive. The DNA found on the murder weapon and on the door frame... does not point to one killer. It points to all of them. Minute traces of each suspect were found at the scene.\"\n\nHe places a thick folder on the table.\n\n\"The scene has been touched, manipulated, frequented by every one of them. You will need to confront them directly, in their own surroundings, to see how they react. Find the flaw in their alibis.\"" }
    };

    N.act2_3 = {
        page1: { fr: "Au manoir, le Major Hale ajuste ses gants blancs. « Je... je venais simplement m'assurer que le mobilier de sa Seigneurie était intact. Il conservait des documents d'importance dans sa cachette derrière les boiseries... ses affaires privées, quoi. »", en: "At the manor, Major Hale adjusts his white gloves. \"I... I was simply making sure his Lordship's furniture was untouched. He kept documents of importance in his hiding place behind the paneling... his private affairs, really.\"" },
        page2: { fr: "Dans le boudoir, Vivienne sourit : « Ce manoir est un moulin. Même mon mari verrouillait ses petits secrets dans ce fichu coffre mural de son bureau. Quelle paranoïa. »", en: "In the boudoir, Vivienne smiles: \"This manor is a mill. Even my husband locked his little secrets away in that damned wall safe in his office. Such paranoia.\"" },
        page3: { fr: "Au bar, Pembrooke essuie un verre, les mains moites : « Il gardait des reçus de mes traites dans un coffre chez lui, mais je vous jure que je n'y ai pas touché... je savais qu'il y cachait des papiers importants, c'est tout ! »", en: "At the bar, Pembrooke wipes a glass, hands clammy: \"He kept receipts from my installments in a safe at his place, but I swear I didn't touch it... I knew he hid important papers there, that's all!\"" },
        page4: { fr: "Chez Blackwood, le notaire transpire : « Le magnat conservait ses actes de fiducie dans son coffre privé. Si ce coffre a été vidé, je suis ruiné, mais je n'y suis pour rien ! »", en: "At Blackwood's, the notary sweats: \"The magnate kept his trust deeds in his private safe. If that safe was emptied, I'm ruined, but I had nothing to do with it!\"" },
        page5: { fr: "Dans sa mansarde, Silas Crane ricane : « Regardez ce que les riches cachent derrière leurs tableaux. J'ai vu des gens lorgner sur ce satané coffre mural comme des corbeaux sur une charogne. »", en: "In his garret, Silas Crane snickers: \"Look at what the rich hide behind their paintings. I've seen people eyeing that damned wall safe like crows on carrion.\"" },
        page6: { fr: "Dans la ruelle, Krane crache par terre : « Demandez-vous plutôt ce qui a disparu de son coffre-fort personnel. Un contrat de cette envergure ne se laisse pas traîner au milieu d'un salon sans être enfermé sous double clef. »", en: "In the alley, Krane spits on the ground: \"Ask yourself what disappeared from his personal safe. A contract of that magnitude doesn't get left out in a sitting room without being locked under double key.\"" }
    };

    N.act2_4 = {
        page1: { fr: "Dans la voiture banalisée, votre partenaire frappe le volant : « Tous les suspects ont mentionné ce fichu coffre ! Et cette montre gousset... l'aiguille est bloquée sur une combinaison numérique. Ce n'est pas l'heure de sa mort... c'est la combinaison du coffre ! Foncez à la scène de crime ! »", en: "In the unmarked car, your partner strikes the wheel: \"Every suspect mentioned that damned safe! And that pocket watch... the hand is stuck on a numerical combination. It's not the time of death... it's the combination to the safe! Get to the crime scene!\"" }
    };

    N.act3_1 = {
        page1: { fr: "Pénombre lugubre au manoir. Vous vous approchez du panneau de boiserie dissimulant le coffre-fort. « Allez, inspecteur. La combinaison de la montre... et ouvrez-moi ce coffre. »", en: "A gloomy half-light at the manor. You approach the wood panel concealing the safe. \"Go on, inspector. The watch's combination... and open me that safe.\"" }
    };

    N.act3_2 = {
        page1: { fr: "De retour au quartier général, la pression monte d'un cran. Votre partenaire étale les documents du coffre sur la table. « Voilà qui change tout, inspecteur. Convoquons-les un par un au parloir. »", en: "Back at headquarters, the pressure rises. Your partner spreads the safe's documents on the table. \"This changes everything, inspector. Let's summon them one by one.\"" },
        page2: { fr: "Au parloir, Hale, regard fixe : « Des versements occultes à un certain V.K., Major Hale. Vous aviez bien des raisons de vouloir ces papiers disparus. », « Vous inventez, inspecteur. Je servais mon maître. Rien de plus. »", en: "In the interrogation room, Hale, gaze fixed: \"Secret payments to a certain V.K., Major Hale. You had every reason to want those vanished papers.\", \"You're inventing things, inspector. I served my master. Nothing more.\"" },
        page3: { fr: "Lady Vivienne, le sourire effacé : « Des lettres intimes de votre main dormaient dans ce coffre. », « Mon époux changeait de cachette tous les mois. Sa paranoïa l'a perdu, pas moi. »", en: "Lady Vivienne, smile gone: \"Intimate letters in your hand were resting in that safe.\", \"My husband changed his hiding place every month. His paranoia undid him, not I.\"" },
        page4: { fr: "Pembrooke, le teint pâle : « Des reconnaissances de dettes signées de votre main... et leur disparition vous arrange. », « Si j'avais tué pour des papiers, on ne les retrouverait pas au fond d'un coffre. Je les aurais brûlés. »", en: "Pembrooke, pale: \"Debt notes signed by your hand... and their disappearance suits you.\", \"If I had killed for papers, they wouldn't be found at the bottom of a safe. I'd have burned them.\"" },
        page5: { fr: "Blackwood ne regarde pas le dossier : « Les actes de fiducie ont disparu, et un audit était prévu dès le lendemain. », « Si chaque défalcation était un meurtre, inspecteur, le pendu ne suffirait plus. »", en: "Blackwood doesn't look at the file: \"The trust deeds have vanished, and an audit was due the very next day.\", \"If every embezzlement were a murder, inspector, the gallows wouldn't suffice.\"" },
        page6: { fr: "Silas Crane, menotté mais l'œil brillant : « Des fibres de toile et de la boue du jardin dans le coffre vidé. », « Je cambriole les cuisines, monsieur l'inspecteur, pas les coffres. Mais j'ai vu une ombre repartir du bureau les mains pleines. »", en: "Silas Crane, cuffed but bright-eyed: \"Cloth fibers and garden mud inside the emptied safe.\", \"I burgle kitchens, Mr. Inspector, not safes. But I saw a shadow leave the office with full hands.\"" },
        page7: { fr: "Krane, bras croisés : « Des contrats de commandite et une liasse en acompte ont disparu. Votre trace est dessus. », « Mon trace est partout, inspecteur. C'est le métier. Mais je ne vole jamais mes propres employeurs. »", en: "Krane, arms crossed: \"Retainer contracts and an advance bundle have vanished. Your trace is on them.\", \"My trace is everywhere, inspector. It's the trade. But I never rob my own employers.\"" },
        page8: { fr: "Wexford épingle les six dépositions sur le grand tableau de liège. « Les interrogatoires, les analyses, les preuves du coffre... tout est là. Mais chacun accuse quelqu'un d'autre. À vous de démêler qui ment, qui dit vrai. Trois menteurs se dessinent. »", en: "Wexford pins the six depositions on the big cork board. \"The interrogations, the analyses, the safe's evidence... it's all there. But each one accuses someone else. Sort out who lies, who tells the truth. Three liars emerge.\"" }
    };

    N.act3_3 = {
        page1: { fr: "Au quartier général, le moment est venu. Votre partenaire étale les six dossiers sur la table, à côté des documents du coffre. Qui accusez-vous ?", en: "At headquarters, the time has come. Your partner spreads the six files on the table, beside the safe's documents. Who do you accuse?" }
    };



    N.outro = {
        page1: { fr: "L'affaire est classée. Le vrai coupable croupit en prison, le mobile était l'argent, la méthode, la trahison.", en: "Case closed. The real culprit is in prison, the motive was money, the method, betrayal." },
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
        criminel: { fr: "Victor Krane, Homme de main du quartier, présent dans la ruelle la nuit du crime.", en: "Victor Krane, Neighborhood enforcer, present in the alley on the night of the crime." }
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
        criminel: { fr: "Victor Krane sourit lentement. « Je ne suis que le bras, inspecteur. La main qui m'a guidé, c'est Hale, mon employeur. Relisez les versements dans le coffre. » Le commanditaire s'échappe. ÉCHEC.", en: "Victor Krane smiles slowly. \"I am just the arm, inspector. The hand that guided me is Hale, my employer. Reread the payments in the safe.\" The mastermind escapes. FAILURE." }
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
        { label: 'A', x: 11.6, y: 66.1, info: { fr: "Le sceau en or et son cachet, posés à l'extrême gauche du bureau. Le matériel de correspondance est intact, ce qui prouve que le bureau n'a pas été saccagé au hasard : l'intrus connaissait les lieux, ou possédait les accès.", en: "The gold seal and its stamp, set at the far left of the desk. The correspondence tools are untouched, proving the desk was not ransacked at random : the intruder knew the premises, or had the keys." } },
        { label: 'B', x: 24.1, y: 70.4, info: { fr: "L'encrier central et son bloc d'écriture. Situé au cœur du bureau, il marque la zone où la victime rédigeait ses documents au moment de l'altercation.", en: "The central inkwell and its writing block. Set at the heart of the desk, it marks the spot where the victim was drafting his documents when the altercation began." } },
        { label: '1', x: 31.2, y: 56.8, info: { fr: "Des papiers administratifs et une plume ouverte, éparpillés sur le coin gauche du bureau. Quelqu'un a consulté ou recherché un document juste avant la mort.", en: "Administrative papers and an open quill, scattered across the left corner of the desk. Someone searched through a document just before the victim died." } },
        { label: '2', x: 38.6, y: 57.3, info: { fr: "Deux verres de vin dressés, avec une petite coupelle. La victime attendait un proche de confiance pour partager un dernier verre.", en: "Two wine glasses still standing, with a small saucer beside them. The victim was expecting a trusted guest for a last drink." } },
        { label: '3', x: 47.2, y: 58.3, info: { fr: "Un livre ouvert, maculé de sang, près de la lampe de bureau. Un journal ou registre taché suggère une lutte en plein travail, sans temps de réaction.", en: "An open book, smeared with blood, near the desk lamp. A bloodstained logbook hints at a struggle mid-work, with no time to react." } },
        { label: '4', x: 66.4, y: 79.2, info: { fr: "Le fauteuil de bureau, renversé sur le tapis. Une bousculade brève mais violente a précédé l'effondrement de la victime près de la fenêtre.", en: "The office chair, overturned on the carpet. A brief but violent scuffle preceded the victim's collapse near the window." } },
        { label: '5', x: 70.8, y: 85.6, info: { fr: "Une trace de sang au sol, au cœur de la silhouette à la craie. L'épicentre exact de l'agression mortelle, aucun geste de défense, la victime connaissait son agresseur.", en: "A blood trace on the floor, at the heart of the chalk outline. The exact epicentre of the fatal blow, no defensive wound : the victim knew the assailant." } },
        { label: '6', x: 78.2, y: 86.3, info: { fr: "Un fragment de papier froissé, à côté du corps sur le tapis. Des chiffres ou inscriptions énigmatiques, la première vraie énigme à élucider pour la suite de l'enquête.", en: "A crumpled piece of paper, beside the body on the carpet. Numbers or cryptic markings, the first real enigma to solve for the rest of the investigation." } }
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
                    response: { fr: "Hale se raidit. « J'ai vérifié les caméras, le système d'alarme, les accès. Tout était en place. Le sabotage a été fait de l'intérieur, quelqu'un qui connaissait les codes. »\n\n[Indice Accès] Un initié. Qui d'autre a accès aux codes du manoir ?", en: "Hale stiffens. \"I checked the cameras, the alarm system, the access points. Everything was in place. The sabotage was done from the inside, someone who knew the codes.\"\n\n[Access clue] An insider. Who else has access to the manor codes?" },
                    evidence: 'opportunity'
                },
                {
                    id: 'hale_q2',
                    label: { fr: "« Votre patron avait des dettes, n'est-ce pas ? Vous le saviez ? »", en: "\"Your boss had debts, didn't he? Did you know?\"" },
                    response: { fr: "Hale blêmit. « Des dettes ? Non, je… Enfin, peut-être. Blackwood, le notaire, gérait tout ça. Il était très proche de la victime ces derniers temps. »\n\n[Indice Mobile] Hale renvoie vers Blackwood sans qu'on le lui demande. À vérifier.", en: "Hale pales. \"Debts? No, I… Well, maybe. Blackwood, the notary, handled all of that. He was very close to the victim lately.\"\n\n[Motive clue] Hale redirects toward Blackwood unprompted. To verify." },
                    evidence: 'mobile'
                },
                {
                    id: 'hale_q3',
                    label: { fr: "« Pembrooke est un ami de longue date. Vous le connaissiez bien ? »", en: "\"Pembrooke is a long-time friend. Did you know him well?\"" },
                    response: { fr: "Hale s'assombrit. « Trop bien, justement. Je l'ai vu… avec Lady Vivienne, ces dernières semaines. En secret. »\n\n[Indice Témoin] Pembrooke et Vivienne avaient une liaison. Hale le savait.", en: "Hale darkens. \"Too well, in fact. I saw him… with Lady Vivienne, these last weeks. In secret.\"\n\n[Witness clue] Pembrooke and Vivienne were having an affair. Hale knew." },
                    evidence: 'witness'
                }
            ],
            redirect: { target: 'seducteur', reason: 'jalousie' },
            rounds2: [
                {
                    id: 'hale_r2q1',
                    label: { fr: "« Où étiez-vous exactement à 22h09, Major ? »", en: "\"Where exactly were you at 10:09pm, Major?\"" },
                    response: { fr: "Hale lisse sa moustache. « En panne avec Pembrooke, sur la route. Sa voiture, sa durite, son capot ouvert. Interrogez-le : il le confirmera. »\n\n[Indice Alibi] Un alibi adossé à un autre homme. Pratique, si cet homme est complice, ou Manipulé.", en: "Hale smooths his moustache. \"Broken down with Pembrooke, on the road. His car, his hose, his open bonnet. Question him : he will confirm it.\"\n\n[Alibi clue] An alibi propped on another man. Convenient, if that man is an accomplice, or manipulated." },
                    evidence: 'alibi'
                },
                {
                    id: 'hale_r2q2',
                    label: { fr: "« Pembrooke et Lady Vivienne. Une liaison, n'est-ce pas ? »", en: "\"Pembrooke and Lady Vivienne. An affair, isn't it?\"" },
                    response: { fr: "La mâchoire de Hale se crispe. « Je l'ai vu. Par la fenêtre de la serre. Julian Pembrooke n'est pas digne de… » Il se reprend. « Ce n'est pas mon affaire. »\n\n[Indice Témoin] Une jalousie mal déguisée. Hale accuse Pembrooke du bout des lèvres.", en: "Hale's jaw tightens. \"I saw them. Through the greenhouse window. Julian Pembrooke isn't worthy of…\" He catches himself. \"Not my business.\"\n\n[Witness clue] Poorly hidden jealousy. Hale accuses Pembrooke through gritted teeth." },
                    evidence: 'witness'
                },
                {
                    id: 'hale_r2q3',
                    label: { fr: "« Vous connaissez un certain Victor Krane ? »", en: "\"Do you know a certain Victor Krane?\"" },
                    response: { fr: "Un silence. « Ce nom ne me dit rien. » Mais sa main cherche sa montre-gousset sans la trouver.\n\n[Indice Témoin] Le nom de Krane le trouble. À vérifier.", en: "A silence. \"That name means nothing to me.\" But his hand reaches for a pocket watch that isn't there.\n\n[Witness clue] Krane's name rattles him. To verify." },
                    evidence: 'witness'
                }
            ],
            rounds3: [
                {
                    id: 'hale_r3q1',
                    label: { fr: "« Qui pouvait manipuler l'alarme sans déclencher quoi que ce soit ? »", en: "\"Who could work the alarm without triggering anything?\"" },
                    response: { fr: "« Le système est ancien. Quelqu'un du manoir, évidemment. Mais vous cherchez un assassin chez les domestiques, inspecteur ? C'est de la paresse. »\n\n[Indice Accès] Hale vit sur place. Il vient d'écarter une piste… dont il fait partie.", en: "\"The system is old. Someone from the manor, obviously. But you're looking for a killer among the servants, inspector? That's laziness.\"\n\n[Access clue] Hale lives on site. He just dismissed a lead… that points at himself." },
                    evidence: 'opportunity'
                },
                {
                    id: 'hale_r3q2',
                    label: { fr: "« Vous avez décrit la mare de sang. Pourtant, la porte était verrouillée à votre retour. »", en: "\"You described the pool of blood. Yet the door was locked when you returned.\"" },
                    response: { fr: "Hale pâlit. « La porte était verrouillée. J'ai… vu par la fenêtre du bureau. Oui. C'est ça. »\n\n[Indice Accès] Personne ne voit une mare de sang depuis une fenêtre du rez-de-chaussée. Il en sait trop.", en: "Hale turns pale. \"The door was locked. I… saw it through the study window. Yes. That's it.\"\n\n[Access clue] No one sees a pool of blood from a ground-floor window. He knows too much." },
                    evidence: 'opportunity'
                },
                {
                    id: 'hale_r3q3',
                    label: { fr: "« 12 000 £ de dettes, Major. L'honneur ne rembourse pas. »", en: "\"£12,000 in debts, Major. Honour doesn't repay them.\"" },
                    response: { fr: "Hale se lève d'un bond. « Sortez. Cette entrevue est terminée. » Dans son dos, sa main tremble.\n\n[Indice Mobile] Les dettes existent. Et Hale fuit la question.", en: "Hale springs to his feet. \"Leave. This interview is over.\" Behind his back, his hand trembles.\n\n[Motive clue] The debts are real. And Hale is running from the question." },
                    evidence: 'mobile'
                }
            ]
        },

        'femme-fatale': {
            intro: { fr: "Lady Vivienne reste de marbre, une tasse de thé à la main. Elle attend votre première question.", en: "Lady Vivienne remains stone-faced, a teacup in hand. She waits for your first question." },
            questions: [
                {
                    id: 'viv_q1',
                    label: { fr: "« Votre mari vous entretenait richement. Héritiez-vous seulement ? »", en: "\"Your husband kept you in luxury. Were you only inheriting?\"" },
                    response: { fr: "Vivienne sourit. « Rupert Blackwood, le notaire, gérait les comptes. Il a fait modifier le testament la semaine dernière. À mon détriment, paraît-il. »\n\n[Indice Mobile] Blackwood a modifié le testament. Pourquoi ? À creuser.", en: "Vivienne smiles. \"Rupert Blackwood, the notary, managed the accounts. He had the will changed last week. To my detriment, apparently.\"\n\n[Motive clue] Blackwood changed the will. Why? To dig further." },
                    evidence: 'mobile'
                },
                {
                    id: 'viv_q2',
                    label: { fr: "« Pembrooke était souvent ici. Quel rôle jouait-il ? »", en: "\"Pembrooke was often here. What role did he play?\"" },
                    response: { fr: "Vivienne reste impassible. « Un ami fidèle de mon mari. Je ne suis pas dupe de ses sourires. »\n\n[Indice Témoin] Vivienne élude sans accuser. Elle connaît quelque chose.", en: "Vivienne stays unmoved. \"A loyal friend of my husband. I'm not fooled by his smiles.\"\n\n[Witness clue] Vivienne dodges without accusing. She knows something." },
                    evidence: 'witness'
                },
                {
                    id: 'viv_q3',
                    label: { fr: "« Votre mari devait-il de l'argent à quelqu'un ? »", en: "\"Did your husband owe money to anyone?\"" },
                    response: { fr: "Vivienne pose sa tasse. « Blackwood, le notaire, lui a prêté une grosse somme. Je l'ai lu dans un registre. Mais Blackwood ne l'aurait jamais tué : il dépendait aussi de lui. »\n\n[Indice Mobile] Blackwood avait un intérêt financier direct dans la victime.", en: "Vivienne sets her cup down. \"Blackwood, the notary, lent him a large sum. I read it in a ledger. But Blackwood would never have killed him: he also depended on him.\"\n\n[Motive clue] Blackwood had a direct financial interest in the victim." },
                    evidence: 'mobile'
                }
            ],
            redirect: { target: 'suspect', reason: 'argent_dû' },
            rounds2: [
                {
                    id: 'viv_r2q1',
                    label: { fr: "« On dit que vous fréquentez le notaire plus souvent que de raison. »", en: "\"They say you visit the notary more often than necessary.\"" },
                    response: { fr: "Vivienne hausse un sourcil. « Pour le testament. Blackwood me tenait au courant, il devait beaucoup d'argent à mon mari, et son poste dépendait de moi. »\n\n[Indice Mobile] Vivienne rejette tout sur Blackwood : argent dû au mari, position fragile.", en: "Vivienne raises an eyebrow. \"About the will. Blackwood kept me informed, he owed my husband a lot of money, and his position depended on me.\"\n\n[Motive clue] Vivienne pins it all on Blackwood : money owed to her husband, a fragile position." },
                    evidence: 'mobile'
                },
                {
                    id: 'viv_r2q2',
                    label: { fr: "« Votre assurance-vie : qui en bénéficie ? »", en: "\"Your life insurance : who benefits?\"" },
                    response: { fr: "Elle sourit froidement. « L'assurance ? Vous posez des questions de commis voyageur, inspecteur. Mon mari valait bien plus vivant. »\n\n[Indice Mobile] Elle esquive la question de l'argent. Trop vite.", en: "She smiles coldly. \"Insurance? You ask an accountant's questions, inspector. My husband was worth far more alive.\"\n\n[Motive clue] She dodges the money question. Too quickly." },
                    evidence: 'mobile'
                },
                {
                    id: 'viv_r2q3',
                    label: { fr: "« Les lettres de menace. Votre écriture ? »", en: "\"The threat letters. Your handwriting?\"" },
                    response: { fr: "Sa main frémit au-dessus de la tasse. « Élégante, n'est-ce pas ? Beaucoup de femmes de ce monde écrivent bien. » Elle ne nie plus.\n\n[Indice Forensique] Vivienne ne dément plus son écriture sur les menaces.", en: "Her hand trembles above the cup. \"Elegant, isn't it? Many women of this world write well.\" She no longer denies it.\n\n[Forensic clue] Vivienne no longer denies her handwriting on the threats." },
                    evidence: 'forensic'
                }
            ],
            rounds3: [
                {
                    id: 'viv_r3q1',
                    label: { fr: "« La lettre à moitié brûlée. Pourquoi la brûler si elle était innocente ? »", en: "\"The half-burned letter. Why burn it if it was innocent?\"" },
                    response: { fr: "« On brûle ce qui fait souffrir, inspecteur. Pas ce qui condamne. » Elle croise les jambes, parfaitement calme.\n\n[Indice Témoin] Une réponse de complaisance. Elle esquive la question sans y répondre.", en: "\"One burns what hurts, inspector. Not what convicts.\" She crosses her legs, perfectly calm.\n\n[Witness clue] A polished answer. She sidesteps the question without answering it." },
                    evidence: 'witness'
                },
                {
                    id: 'viv_r3q2',
                    label: { fr: "« Où étiez-vous cette nuit-là, exactement ? »", en: "\"Where were you that night, exactly?\"" },
                    response: { fr: "« Au théâtre, avec des amies. Puis ici, seule. Personne ne peut le confirmer, les domestiques avaient congé. Sauf un. »\n\n[Indice Alibi] Un alibi invérifiable. Et elle connaît les allées et venues de Hale.", en: "\"At the theatre, with friends. Then here, alone. No one can confirm it, the servants had the evening off. Except one.\"\n\n[Alibi clue] An unverifiable alibi. And she knows Hale's comings and goings." },
                    evidence: 'alibi'
                },
                {
                    id: 'viv_r3q3',
                    label: { fr: "« Et votre liaison avec le Major Hale ? »", en: "\"And your affair with Major Hale?\"" },
                    response: { fr: "Pour la première fois, la tasse tremble vraiment. « Que Hale m'épie ne fait pas de nous des amants. C'est un homme… dévoué. Trop dévoué, peut-être. »\n\n[Indice Témoin] Vivienne confirme que Hale l'observe de près. Elle sait qu'il est dangereux.", en: "For the first time, the cup truly trembles. \"Hale watching me doesn't make us lovers. He is a… devoted man. Perhaps too devoted.\"\n\n[Witness clue] Vivienne confirms Hale watches her closely. She knows he is dangerous." },
                    evidence: 'witness'
                }
            ]
        },

        seducteur: {
            intro: { fr: "Julian Pembrooke, accoudé au comptoir, vous regarde par-dessous. Il a son verre à la main. Choisissez votre question.", en: "Julian Pembrooke, leaning on the counter, glances at you from under his brow. He holds his drink. Choose your question." },
            questions: [
                {
                    id: 'pem_q1',
                    label: { fr: "« Votre voiture est tombée en panne ce soir-là. Vraiment ? »", en: "\"Your car broke down that night. Really?\"" },
                    response: { fr: "Pembrooke hausse les épaules. « La durite a cédé, c'est mécanique. Hale est venu me dépanner, mais quand on est arrivés au manoir, il était trop tard. »\n\n[Indice Alibi] Pembrooke confirme l'aide de Hale. Mais pourquoi Hale avait-il les outils et le temps ?", en: "Pembrooke shrugs. \"The hose broke, it's mechanical. Hale came to help, but when we got to the manor, it was too late.\"\n\n[Alibi clue] Pembrooke confirms Hale's help. But why did Hale have the tools and the time?" },
                    evidence: 'alibi'
                },
                {
                    id: 'pem_q2',
                    label: { fr: "« Vous connaissiez Lady Vivienne, n'est-ce pas ? »", en: "\"You knew Lady Vivienne, didn't you?\"" },
                    response: { fr: "Pembrooke hésite une fraction de seconde. « C'est une femme séduisante. Mais je ne suis pas du genre à… Elle ne m'intéresse pas. »\n\n[Indice Témoin] Démenti trop rapide. Hale et Vivienne ont peut-être une autre version.", en: "Pembrooke hesitates for a split second. \"She's a seductive woman. But I'm not the kind to… She doesn't interest me.\"\n\n[Witness clue] Denial too quick. Hale and Vivienne may have another version." },
                    evidence: 'witness'
                },
                {
                    id: 'pem_q3',
                    label: { fr: "« Qui avait les clés du manoir cette nuit-là ? »", en: "\"Who had the keys to the manor that night?\"" },
                    response: { fr: "Pembrooke réfléchit. « Hale, bien sûr. Blackwood, le notaire, pour les affaires. Moi, j'en avais une copie, le Duc me l'avait donnée. »\n\n[Indice Accès] Trois personnes avaient les clés. L'une d'elles est peut-être de trop.", en: "Pembrooke thinks. \"Hale, of course. Blackwood, the notary, for business. I had a copy, the Duke gave it to me.\"\n\n[Access clue] Three people had keys. One of them might be one too many." },
                    evidence: 'opportunity'
                }
            ],
            redirect: { target: 'protecteur', reason: 'meilleur_placé' },
            rounds2: [
                {
                    id: 'pem_r2q1',
                    label: { fr: "« Votre durite n'a pas cédé : elle a été sectionnée. »", en: "\"Your hose didn't fail : it was cut.\"" },
                    response: { fr: "Pembrooke pose son verre. « Sectionnée ? Alors quelqu'un voulait me tenir loin du manoir, ou me fabriquer un alibi de paille. Je ne me sabote pas moi-même, inspecteur. »\n\n[Indice Alibi] Si la panne est fausse, l'alibi de Pembrooke est fabriqué. Par qui ?", en: "Pembrooke sets his glass down. \"Cut? Then someone wanted to keep me away from the manor, or build me a straw alibi. I don't sabotage myself, inspector.\"\n\n[Alibi clue] If the breakdown is fake, Pembrooke's alibi is manufactured. By whom?" },
                    evidence: 'alibi'
                },
                {
                    id: 'pem_r2q2',
                    label: { fr: "« Vous aviez une copie des clés. Pourquoi pas vous ? »", en: "\"You had a copy of the keys. Why not you?\"" },
                    response: { fr: "« Le Duc m'aimait, c'est vrai. Mais Hale vit là, inspecteur. Lui connaît chaque verrou, chaque chien d'arrêt, chaque fissure. Moi, je loge en ville. »\n\n[Indice Accès] Pembrooke accuse Hale : le mieux placé, celui qui vit sur place.", en: "\"The Duke loved me, true. But Hale lives there, inspector. He knows every lock, every guard dog, every crack. I lodge in town.\"\n\n[Access clue] Pembrooke accuses Hale : the best placed, the one who lives on site." },
                    evidence: 'opportunity'
                },
                {
                    id: 'pem_r2q3',
                    label: { fr: "« La liaison avec Lady Vivienne. Confirmez. »", en: "\"The affair with Lady Vivienne. Confirm it.\"" },
                    response: { fr: "Il sourit tristement. « Si j'étais son amant, serais-je au bar ce soir-là, sous les yeux de dix témoins ? Hale, lui, passerait par la porte de service. Personne ne l'aurait vu. »\n\n[Indice Témoin] Pembrooke retourne l'accusation vers Hale. Jalousie contre jalousie.", en: "He smiles sadly. \"If I were her lover, would I be at the bar that night, in front of ten witnesses? Hale, though, would come through the service door. No one would have seen him.\"\n\n[Witness clue] Pembrooke turns the accusation toward Hale. Jealousy against jealousy." },
                    evidence: 'witness'
                }
            ],
            rounds3: [
                {
                    id: 'pem_r3q1',
                    label: { fr: "« L'écriture sur le câble d'alarme est élégante. La vôtre ? »", en: "\"The writing on the alarm cable is elegant. Yours?\"" },
                    response: { fr: "La main de Pembrooke s'arrête au-dessus du comptoir. « Élégante ? Beaucoup le sont. Demandez donc à Lady Vivienne. »\n\n[Indice Forensique] Il ne nie pas. Vivienne aussi écrit avec élégance.", en: "Pembrooke's hand stops above the counter. \"Elegant? Many hands are. Ask Lady Vivienne.\"\n\n[Forensic clue] He doesn't deny it. Vivienne also writes elegantly." },
                    evidence: 'forensic'
                },
                {
                    id: 'pem_r3q2',
                    label: { fr: "« Qui vous a suggéré d'être au bar ce soir-là ? »", en: "\"Who suggested you be at the bar that night?\"" },
                    response: { fr: "Un long silence. « Personne ne me « suggère » rien. On m'a proposé une soirée entre amis. La proposition venait… du manoir. »\n\n[Indice Témoin] Quelqu'un du manoir a poussé Pembrooke à s'éloigner.", en: "A long silence. \"No one 'suggests' anything to me. I was offered a night among friends. The offer came… from the manor.\"\n\n[Witness clue] Someone from the manor pushed Pembrooke to stay away." },
                    evidence: 'witness'
                },
                {
                    id: 'pem_r3q3',
                    label: { fr: "« Les dettes du Major Hale : 12 000 £. Vous le saviez ? »", en: "\"Major Hale's debts : £12,000. Did you know?\"" },
                    response: { fr: "« Tout le bar le sait, inspecteur. Demandez au barman qui servait Hale, cette nuit-là, après ma « panne ». Il buvait. Beaucoup. »\n\n[Indice Mobile] Le barman confirme : Hale buvait ce soir-là, près du manoir.", en: "\"The whole bar knows, inspector. Ask the bartender who served Hale that night, after my 'breakdown'. He was drinking. A lot.\"\n\n[Motive clue] The bartender confirms : Hale was drinking that night, near the manor." },
                    evidence: 'mobile'
                }
            ]
        },

        suspect: {
            intro: { fr: "Rupert Blackwood, derrière son bureau de notaire, paraît fatigué. Il vous fait signe de vous asseoir. Posez votre question.", en: "Rupert Blackwood, behind his notary desk, looks tired. He gestures for you to sit. Ask your question." },
            questions: [
                {
                    id: 'blw_q1',
                    label: { fr: "« Le testament a été modifié la semaine dernière. Par qui ? »", en: "\"The will was changed last week. By whom?\"" },
                    response: { fr: "Blackwood soupire. « Par la victime, sur ma recommandation. Il voulait déshériter son épouse. Je n'étais pas d'accord, mais c'était mon client. »\n\n[Indice Mobile] Blackwood confirme la déshérence. Un mobile pour Vivienne.", en: "Blackwood sighs. \"By the victim, on my recommendation. He wanted to disinherit his wife. I didn't agree, but he was my client.\"\n\n[Motive clue] Blackwood confirms the disinheritance. A motive for Vivienne." },
                    evidence: 'mobile'
                },
                {
                    id: 'blw_q2',
                    label: { fr: "« Combien d'argent circulait entre vous et la victime ? »", en: "\"How much money was flowing between you and the victim?\"" },
                    response: { fr: "Blackwood hésite. « Quelques milliers de livres, à titre de prêts personnels. Rien d'illégal. C'est Lady Vivienne qui héritait, mais le Duc a tout changé. »\n\n[Indice Témoin] L'argent était une source de tension.", en: "Blackwood hesitates. \"A few thousand pounds, as personal loans. Nothing illegal. Lady Vivienne was the heir, but the Duke changed everything.\"\n\n[Witness clue] Money was a source of tension." },
                    evidence: 'mobile'
                },
                {
                    id: 'blw_q3',
                    label: { fr: "« Qui d'autre s'intéressait à la fortune de la victime ? »", en: "\"Who else was interested in the victim's fortune?\"" },
                    response: { fr: "Blackwood baisse la voix. « Lady Vivienne. Elle ne supportait pas d'être mise à l'écart. Elle venait me voir plusieurs fois par semaine, ces derniers temps. »\n\n[Indice Témoin] Vivienne était très présente chez le notaire.", en: "Blackwood lowers his voice. \"Lady Vivienne. She couldn't stand being pushed aside. She came to see me several times a week, lately.\"\n\n[Witness clue] Vivienne was very present at the notary's." },
                    evidence: 'witness'
                }
            ],
            redirect: { target: 'femme-fatale', reason: 'assurance' },
            rounds2: [
                {
                    id: 'blw_r2q1',
                    label: { fr: "« 19h00 : vous dînez avec la victime. De quoi avez-vous parlé ? »", en: "\"7:00pm : you dine with the victim. What did you talk about?\"" },
                    response: { fr: "Blackwood s'essuie les lèvres. « D'argent, forcément. Il voulait retirer des fonds. Je lui ai déconseillé. Il était… pressé, ces derniers temps. »\n\n[Indice Chronologie] Dernier à l'avoir vu vivant avant la soirée. À creuser.", en: "Blackwood wipes his lips. \"Money, inevitably. He wanted to withdraw funds. I advised against it. He was… in a hurry, lately.\"\n\n[Timeline clue] The last to see him alive before the evening. To dig into." },
                    evidence: 'timeline'
                },
                {
                    id: 'blw_r2q2',
                    label: { fr: "« Vous avez quitté le manoir à 21h30. Qui peut le confirmer ? »", en: "\"You left the manor at 9:30pm. Who can confirm it?\"" },
                    response: { fr: "« Le portail était gardé. Et Silas Crane, le clochard, m'a vu passer. Interrogez-le, il ne ment jamais. »\n\n[Indice Alibi] Blackwood s'appuie sur le marginal. Un alibi fragile.", en: "\"The gate was watched. And Silas Crane, the homeless man, saw me pass. Question him, he never lies.\"\n\n[Alibi clue] Blackwood leans on the marginal. A fragile alibi." },
                    evidence: 'alibi'
                },
                {
                    id: 'blw_r2q3',
                    label: { fr: "« Si le testament est invalidé, Lady Vivienne hérite de l'assurance. Vous le saviez ? »", en: "\"If the will is voided, Lady Vivienne inherits the insurance. Did you know?\"" },
                    response: { fr: "Il ouvre les mains. « Chacun attend quelque chose d'un héritage, inspecteur. Mais c'est elle qui perdait au nouveau testament. Moi, je ne perdais qu'un client. »\n\n[Indice Mobile] Blackwood renvoie à l'argent de l'assurance et à Vivienne. Sans qu'on le lui demande.", en: "He spreads his hands. \"Everyone expects something from an inheritance, inspector. But she is the one losing under the new will. I was only losing a client.\"\n\n[Motive clue] Blackwood points back to the insurance money and Vivienne. Unprompted." },
                    evidence: 'mobile'
                }
            ],
            rounds3: [
                {
                    id: 'blw_r3q1',
                    label: { fr: "« Qui a commandé le codicille déshéritant Lady Vivienne ? »", en: "\"Who ordered the codicil disinheriting Lady Vivienne?\"" },
                    response: { fr: "« Le Duc lui-même. Une nuit d'ivresse, un caprice. Je devais le rédiger… je l'ai reporté. Reporté, entendez-vous ? »\n\n[Indice Témoin] Le codicille n'a jamais été signé. Blackwood temporisait.", en: "\"The Duke himself. A drunken night, a whim. I was to draft it… I kept postponing. Postponing, you hear me?\"\n\n[Witness clue] The codicil was never signed. Blackwood was stalling." },
                    evidence: 'witness'
                },
                {
                    id: 'blw_r3q2',
                    label: { fr: "« Vos dettes de jeu : 8 000 £, il y a un mois. »", en: "\"Your gambling debts : £8,000, a month ago.\"" },
                    response: { fr: "Blackwood blêmit. « Des rumeurs de club. Ma situation est saine. » Sa main referme le registre trop vite.\n\n[Indice Mobile] Les dettes de Blackwood sont réelles. Mobile, ou appât ?", en: "Blackwood pales. \"Club rumors. My situation is sound.\" His hand closes the ledger too quickly.\n\n[Motive clue] Blackwood's debts are real. Motive, or bait?" },
                    evidence: 'mobile'
                },
                {
                    id: 'blw_r3q3',
                    label: { fr: "« Vos empreintes sont sur les papiers du bureau. Vous prétendiez être parti. »", en: "\"Your prints are on the study papers. You claimed you had left.\"" },
                    response: { fr: "« J'ai signé des documents à 19h30, inspecteur. Avant le dîner. Vérifiez l'encre. »\n\n[Indice Forensique] Explication plausible. Et l'ADN, lui, parlera de tout le monde.", en: "\"I signed documents at 7:30pm, inspector. Before dinner. Check the ink.\"\n\n[Forensic clue] A plausible explanation. And the DNA, for its part, speaks of everyone." },
                    evidence: 'forensic'
                }
            ]
        },

        marginal: {
            intro: { fr: "Silas Crane grelotte dans l'encadrement de la porte. Il a besoin d'une pièce. Choisissez votre question, doucement.", en: "Silas Crane shivers in the doorway. He needs a coin. Choose your question, gently." },
            questions: [
                {
                    id: 'sls_q1',
                    label: { fr: "« Le rôdeur que vous avez vu. Vous l'avez reconnu ? »", en: "\"The prowler you saw. Did you recognize him?\"" },
                    response: { fr: "Silas se gratte la barbe. « Un homme pressé, bien habillé. Mais ce n'était pas le premier soir que je le voyais rôder. Il traîne souvent dans le quartier. »\n\n[Indice Témoin] Un habitué du quartier, mais pas un inconnu.", en: "Silas scratches his beard. \"A hurried man, well-dressed. But it wasn't the first night I saw him lurking. He often hangs around the neighborhood.\"\n\n[Witness clue] A regular of the neighborhood, but not a stranger." },
                    evidence: 'witness'
                },
                {
                    id: 'sls_q2',
                    label: { fr: "« Vous voyez d'autres personnes louches dans le coin ? »", en: "\"Do you see other shady people around?\"" },
                    response: { fr: "Silas baisse la voix. « Y'a un type, le soir, qui traîne près des poubelles du bar. Pas le même homme. Plus rude, plus nerveux. Je l'ai vu plusieurs fois. »\n\n[Indice Témoin] Un deuxième individu surveillé. À identifier.", en: "Silas lowers his voice. \"There's a guy, in the evening, hanging around the bar's trash cans. Not the same man. Rougher, more nervous. I've seen him several times.\"\n\n[Witness clue] A second individual spotted. To identify." },
                    evidence: 'witness'
                },
                {
                    id: 'sls_q3',
                    label: { fr: "« Pourquoi vous cachez-vous dans cette ruelle, vous ? »", en: "\"Why do you hide in this alley, you?\"" },
                    response: { fr: "Silas hausse les épaules. « Parce que la nuit, c'est dangereux. Y'a un type, on l'appelle « Krane » dans le quartier, qui fait des sales boulots pour de l'argent. »\n\n[Indice Témoin] Le marginal pointe vers Victor Krane, sans le nommer directement.", en: "Silas shrugs. \"Because at night, it's dangerous. There's a guy, we call him 'Krane' in the neighborhood, who does dirty work for money.\"\n\n[Witness clue] The marginal points toward Victor Krane, without naming him directly." },
                    evidence: 'witness'
                }
            ],
            redirect: { target: 'criminel', reason: 'vu_roder' },
            rounds2: [
                {
                    id: 'sls_r2q1',
                    label: { fr: "« Vous parlez d'un certain Krane. Où le trouver ? »", en: "\"You mention a certain Krane. Where can we find him?\"" },
                    response: { fr: "« Vers le pont, après minuit. Mais faites attention, inspecteur. Les gens qui parlent de Krane… se taisent vite après. »\n\n[Indice Témoin] Le marginal désigne Krane, pour quelques pièces.", en: "\"Near the bridge, after midnight. But be careful, inspector. People who talk about Krane… go quiet soon after.\"\n\n[Witness clue] The marginal points to Krane, for a few coins." },
                    evidence: 'witness'
                },
                {
                    id: 'sls_r2q2',
                    label: { fr: "« On vous payait pour surveiller la ruelle, ces temps-ci ? »", en: "\"Have you been paid to watch the alley lately?\"" },
                    response: { fr: "Il détourne les yeux. « Des billets, parfois. Laissés dans ma canette. Pour « signaler ce qui bouge ». J'ai jamais su de qui. »\n\n[Indice Mobile] Quelqu'un paie Silas pour surveiller. Du manoir ? Du bar ?", en: "He looks away. \"Banknotes, sometimes. Left in my tin can. To 'report what moves'. I never knew from whom.\"\n\n[Motive clue] Someone pays Silas to watch. From the manor? The bar?" },
                    evidence: 'mobile'
                },
                {
                    id: 'sls_r2q3',
                    label: { fr: "« Blackwood prétend que vous confirmeriez son passage à 21h30. »", en: "\"Blackwood claims you would confirm he passed by at 9:30pm.\"" },
                    response: { fr: "« Le notaire ? Il est passé, oui. Mais à 21h30 précises, ça, c'est son compte rendu à lui. La pluie efface les heures, inspecteur. »\n\n[Indice Alibi] L'alibi de Blackwood repose sur un clochard sans montre.", en: "\"The notary? He passed, yes. But 9:30pm sharp, that's his own account. The rain washes away the hours, inspector.\"\n\n[Alibi clue] Blackwood's alibi rests on a homeless man without a watch." },
                    evidence: 'alibi'
                }
            ],
            rounds3: [
                {
                    id: 'sls_r3q1',
                    label: { fr: "« Le rôdeur et sa montre en or. Vous l'avez revue quelque part ? »", en: "\"The prowler and his gold watch. Did you see it again anywhere?\"" },
                    response: { fr: "« Une tocante en or. Et je l'ai encore entendue, la nuit du drame : un klaxon, une portière, près du pavillon. »\n\n[Indice Chronologie] La montre en or rôdait près du manoir à l'heure du crime.", en: "\"A gold ticker. And I heard it again, the night of the drama : a horn, a car door, near the pavilion.\"\n\n[Timeline clue] The gold watch was lurking near the manor at the time of the crime." },
                    evidence: 'timeline'
                },
                {
                    id: 'sls_r3q2',
                    label: { fr: "« Si je vous mets à l'abri, vous parlerez à un juge ? »", en: "\"If I get you off the street, will you talk to a judge?\"" },
                    response: { fr: "« Devant un juge, je dis tout. Mais vous, inspecteur, vous cherchez un monsieur en uniforme. Le rôdeur, lui, obéissait à quelqu'un de la maison. »\n\n[Indice Témoin] Le rôdeur obéissait à quelqu'un de la maison.", en: "\"Before a judge, I'll say everything. But you, inspector, are looking for a man in uniform. The prowler, though, took orders from someone in the house.\"\n\n[Witness clue] The prowler took orders from someone in the house." },
                    evidence: 'witness'
                },
                {
                    id: 'sls_r3q3',
                    label: { fr: "« Pourquoi n'avoir rien dit à la police ? »", en: "\"Why didn't you tell the police?\"" },
                    response: { fr: "« Qui écoute un clochard ? » Il ricane, puis se tue. « Et puis Krane sait où je dors. »\n\n[Indice Témoin] La peur de Krane. Le marginal est un témoin sous pression.", en: "\"Who listens to a homeless man?\" He smirks, then falls silent. \"Besides, Krane knows where I sleep.\"\n\n[Witness clue] Fear of Krane. The marginal is a witness under pressure." },
                    evidence: 'witness'
                }
            ]
        },

        criminel: {
            intro: { fr: "Victor Krane se retourne lentement. Il mâche un curedent. Il n'a pas l'air pressé. Posez votre question.", en: "Victor Krane turns slowly. He chews a toothpick. He doesn't look in a hurry. Ask your question." },
            questions: [
                {
                    id: 'kra_q1',
                    label: { fr: "« Vous étiez dans le quartier, cette nuit-là. »", en: "\"You were in the neighborhood that night.\"" },
                    response: { fr: "Krane hausse un sourcil. « Possible. J'étais chez le barman, à boire un verre. J'ai rien vu d'autre. »\n\n[Indice Alibi] Alibi vague. Aucune confirmation.", en: "Krane raises an eyebrow. \"Maybe. I was at the bartender's, having a drink. I didn't see anything else.\"\n\n[Alibi clue] Vague alibi. No confirmation." },
                    evidence: 'alibi'
                },
                {
                    id: 'kra_q2',
                    label: { fr: "« Vous travaillez pour quelqu'un, à l'occasion. Qui ? »", en: "\"You work for people sometimes. Who?\"" },
                    response: { fr: "Krane sourit. « Pour qui paye. Cette nuit-là, j'étais seul. Mais les clochards du coin… ils traînent, ils voient, ils racontent. »\n\n[Indice Témoin] Krane renvoie vers le marginal, discrètement.", en: "Krane smiles. \"For whoever pays. That night, I was alone. But the homeless around here… they hang around, they see, they talk.\"\n\n[Witness clue] Krane redirects toward the marginal, discreetly." },
                    evidence: 'witness'
                },
                {
                    id: 'kra_q3',
                    label: { fr: "« Vous avez déjà travaillé pour le Duc ? »", en: "\"Have you ever worked for the Duke?\"" },
                    response: { fr: "Krane hésite un quart de seconde. « Le Duc ? Jamais. Trop clean pour moi. Mais quelqu'un de son entourage, oui. Récemment. »\n\n[Indice Accès] Quelqu'un de l'entourage a engagé Krane. À identifier.", en: "Krane hesitates for a quarter of a second. \"The Duke? Never. Too clean for me. But someone from his circle, yes. Recently.\"\n\n[Access clue] Someone from the circle hired Krane. To identify." },
                    evidence: 'opportunity'
                }
            ],
            redirect: { target: 'marginal', reason: 'passé_trouble' },
            rounds2: [
                {
                    id: 'kra_r2q1',
                    label: { fr: "« Silas Crane dit que vous rôdez dans le quartier depuis des semaines. »", en: "\"Silas Crane says you've been prowling the neighborhood for weeks.\"" },
                    response: { fr: "Krane éclate d'un rire bref. « Le clochard raconte tout et n'importe quoi. Un vagabond au passé trouble : voilà votre seul témoin, inspecteur ? »\n\n[Indice Témoin] Krane accuse le marginal, vagabond au passé trouble. Il retourne l'arme.", en: "Krane bursts into a brief laugh. \"The homeless man says anything and everything. A vagrant with a murky past : that's your only witness, inspector?\"\n\n[Witness clue] Krane accuses the marginal, a vagrant with a murky past. He turns the weapon around." },
                    evidence: 'witness'
                },
                {
                    id: 'kra_r2q2',
                    label: { fr: "« Vos empreintes sont dans le manoir. »", en: "\"Your prints are in the manor.\"" },
                    response: { fr: "« J'ai déménagé des meubles là-bas, l'an dernier. Les gens oublient les déménageurs. Ils se souviennent des assassins. »\n\n[Indice Forensique] Explication vérifiable. L'ADN parlera de tout le monde, de lui aussi.", en: "\"I moved furniture there, last year. People forget the movers. They remember the killers.\"\n\n[Forensic clue] A verifiable explanation. The DNA speaks of everyone, him too." },
                    evidence: 'forensic'
                },
                {
                    id: 'kra_r2q3',
                    label: { fr: "« Que faisait votre voiture près du pavillon à 22h ? »", en: "\"What was your car doing near the pavilion at 10pm?\"" },
                    response: { fr: "« Ma voiture ? Elle dort chez le garagiste. Courroie morte. Vous pouvez appeler. » Un demi-sourire. « Encore une panne, tiens. »\n\n[Indice Alibi] Une panne, comme Pembrooke. Trop de pannes dans cette affaire.", en: "\"My car? It's sleeping at the garage. Dead belt. You can call.\"\n\n[Alibi clue] A breakdown, like Pembrooke. Too many breakdowns in this case." },
                    evidence: 'alibi'
                }
            ],
            rounds3: [
                {
                    id: 'kra_r3q1',
                    label: { fr: "« Le carnet de comptes mentionne « V.K. » Des versements réguliers. »", en: "\"The ledger mentions 'V.K.' Regular payments.\"" },
                    response: { fr: "Krane crache son curedent. « Des versements, des mains, des signatures. Vous savez lire, inspecteur : lisez jusqu'au bout. Qui a des empreintes sur cette page ? »\n\n[Indice Forensique] Krane renvoie aux empreintes de Hale sur le carnet.", en: "Krane spits out his toothpick. \"Payments, hands, signatures. You can read, inspector : read to the end. Whose prints are on that page?\"\n\n[Forensic clue] Krane points back to Hale's prints on the ledger." },
                    evidence: 'forensic'
                },
                {
                    id: 'kra_r3q2',
                    label: { fr: "« Qui vous a engagé, la première fois ? »", en: "\"Who hired you, the first time?\"" },
                    response: { fr: "Un long silence. « Un intermédiaire. Le paiement est venu d'un compte du manoir. Le reste, c'est l'affaire de mon avocat. »\n\n[Indice Mobile] Le commanditaire paie depuis le manoir. Hale est garde du corps et majordome en chef.", en: "A long silence. \"A middleman. The payment came from a manor account. The rest is my lawyer's business.\"\n\n[Motive clue] The mastermind pays from the manor. Hale is bodyguard and chief butler." },
                    evidence: 'mobile'
                },
                {
                    id: 'kra_r3q3',
                    label: { fr: "« Vous aviez ordre de voler, pas de tuer ? »", en: "\"You were ordered to steal, not to kill?\"" },
                    response: { fr: "« Je ne réponds pas aux hypothèses. » Il se redresse. « Mais demandez-vous pourquoi le coffre était si facile à ouvrir. Le code, quelqu'un l'a donné. »\n\n[Indice Accès] Le code du coffre a été fourni de l'intérieur.", en: "\"I don't answer hypotheticals.\" He straightens up. \"But ask yourself why the safe was so easy to open. The code, someone gave it.\"\n\n[Access clue] The safe code was provided from the inside." },
                    evidence: 'opportunity'
                }
            ]
        },

        'detective-partner': {
            intro: { fr: "Wexford allume sa pipe. « Je ne suis pas suspect, mais vous pouvez tout de même m'interroger. »", en: "Wexford lights his pipe. \"I'm not a suspect, but you can still question me.\"" },
            questions: [
                {
                    id: 'wex_q1',
                    label: { fr: "« Par où doit-on commencer ? »", en: "\"Where should we start?\"" },
                    response: { fr: "Wexford sourit. « Toujours par la victime. Qui la connaissait, qui avait accès à sa maison, qui avait un mobile. Les trois cercles se recoupent presque toujours. »\n\n[Indice Méthode] Méthode d'enquête classique.", en: "Wexford smiles. \"Always start with the victim. Who knew him, who had access to his house, who had a motive. The three circles almost always overlap.\"\n\n[Method clue] Classic investigation method." },
                    evidence: 'witness'
                },
                {
                    id: 'wex_q2',
                    label: { fr: "« Vous avez travaillé sur d'autres affaires pour le Duc ? »", en: "\"Have you worked other cases for the Duke?\"" },
                    response: { fr: "Wexford secoue la tête. « Pas moi, mais mon ancien partenaire. Une affaire de chantage, il y a cinq ans. Classée sans suite. »\n\n[Indice Témoin] Une vieille affaire pourrait ressurgir.", en: "Wexford shakes his head. \"Not me, but my former partner. A blackmail case, five years ago. Closed without follow-up.\"\n\n[Witness clue] An old case might resurface." },
                    evidence: 'witness'
                },
                {
                    id: 'wex_q3',
                    label: { fr: "« Faites-vous confiance à l'équipe de Whitmore ? »", en: "\"Do you trust Whitmore's team?\"" },
                    response: { fr: "Wexford hausse les épaules. « Whitmore est un scientifique, pas un enquêteur. Il fait des analyses, pas des déductions. Mais il est honnête. »\n\n[Indice Méthode] Whitmore = faits, pas théories.", en: "Wexford shrugs. \"Whitmore is a scientist, not an investigator. He does analyses, not deductions. But he's honest.\"\n\n[Method clue] Whitmore = facts, not theories." },
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
                    response: { fr: "Whitmore hésite. « Ce n'est dans aucun fichier officiel. Mais ce n'est pas un inconnu pour la victime : ses empreintes sont sur le bureau, sur le verre, sur la poignée. »\n\n[Indice Forensique] L'inconnu connaissait la victime.", en: "Whitmore hesitates. \"It's not in any official file. But it's not a stranger to the victim: his prints are on the desk, the glass, the door handle.\"\n\n[Forensic clue] The unknown knew the victim." },
                    evidence: 'forensic'
                },
                {
                    id: 'wht_q2',
                    label: { fr: "« Y a-t-il des traces de tout le monde sur la scène ? »", en: "\"Are there traces of everyone at the scene?\"" },
                    response: { fr: "Whitmore acquiesce. « Oui, et c'est normal. La victime recevait beaucoup : Hale, Blackwood, Pembrooke, Lady Vivienne. Tous ont touché quelque chose. »\n\n[Indice Forensique] L'ADN ne disculpe personne automatiquement.", en: "Whitmore nods. \"Yes, and that's normal. The victim entertained a lot: Hale, Blackwood, Pembrooke, Lady Vivienne. All touched something.\"\n\n[Forensic clue] DNA doesn't automatically clear anyone." },
                    evidence: 'forensic'
                },
                {
                    id: 'wht_q3',
                    label: { fr: "« Et la montre, qu'avez-vous relevé ? »", en: "\"And the watch, what did you find?\"" },
                    response: { fr: "Whitmore sort ses notes. « L'heure est cohérente. L'aiguille s'est figée lors d'un choc violent. Le verre est brisé net, pas usé. Le mécanisme s'est arrêté net. »\n\n[Indice Forensique] L'heure du crime est fiable.", en: "Whitmore pulls out his notes. \"The time is consistent. The hand froze during a violent impact. The glass broke clean, not worn. The mechanism stopped dead.\"\n\n[Forensic clue] The time of death is reliable." },
                    evidence: 'timeline'
                }
            ]
        }
    };

    /* =================================================================
       EXPORTS GLOBAUX
    ================================================================= */

    global.TDNarration = N;
    global.TDNarrationTruths = T;

})(typeof globalThis !== 'undefined' ? globalThis : this);
