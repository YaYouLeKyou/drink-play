/* =====================================================================
   TRUE DETECTIVE - PHASES & DIALOGUES (contenu narratif V3)
   Structure : 9 phases de 3 pages chacune.

   RÈGLE GÉNÉRALE - LIEUX DES PERSONNAGES (hors besoin du scénario) :
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

    /* ===== INTRO - Phase 1A : OUVERTURE ===== */
    PHASES.push({
        id: 'intro-1',
        label: { fr: 'Prologue', en: 'Prologue' },
        act: 'Intro',
        type: 'narration',
        music: 'theme',
        pages: [
            { decor: 'universeSherlock', text: { fr: "Le brouillard descend sur la ville, la nuit. Les becs de gaz dessinent des halos orange sur le pavé mouillé, les fiacres claquent sur les ponts, et dans les ruelles, les chamarrures des enseignes se devinent à peine. Une cité de cheminées et de secrets, où chaque fenêtre éclairée cache une affaire - et où l'on ne compte plus les affaires qui attendent un regard lucide. Ce soir, c'est la vôtre.", en: "Fog settles over the city, night has fallen. Gas lamps draw orange halos on the wet cobblestones, cabs clatter across the bridges, and in the alleys the painted shop signs are barely visible. A city of chimneys and secrets, where every lit window hides a case - and where the cases waiting for a clear eye are countless. Tonight, one of them is yours." } },
            { decor: 'universe', text: { fr: "La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie. On vous a confié l'enquête : la plus délicate de votre carrière.", en: "The city whispers under the rain. In a lavish flat, a real-estate magnate was found dead. You have been assigned the case : the most delicate of your career." } },
            { decor: 'crimeScene', text: { fr: "Vous poussez la porte de la scène de crime. Le sang a séché sur le parquet, le coffre est béant, et sur une table gît une montre de poche brisée. Personne ne sait encore quand le magnat est mort : aucune heure n'est établie. C'est à vous de la trouver.", en: "You push open the door of the crime scene. Blood has dried on the floor, the safe gapes open, and on a table lies a broken pocket watch. No one knows yet when the magnate died : no time of death is established. Finding it is your job." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Votre partenaire vous rejoint, l'air grave : « La victime, un magnat, n'avait qu'un seul domestique : son garde du corps, le Major Hale. C'est lui qui a découvert le corps. L'affaire commence ici. »", en: "Your partner joins you, looking grave : \"The victim, a tycoon, had one servant : his bodyguard, Major Hale. He found the body. The case begins here.\"" } }
        ]
    });

    /* ===== INTRO - Phase 1B : FOUILLE DE LA SCÈNE ===== */
    PHASES.push({
        id: 'intro-2',
        label: { fr: 'Recherche', en: 'Investigation' },
        act: 'Intro',
        type: 'dialogue',
        music: 'recherche',
        pages: [
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Le manoir est plongé dans une pénombre lugubre. Votre partenaire vous rejoint, les mains dans les poches.\n\n« Commencez par la scène de crime. Chaque détail compte. Je reste là si vous avez besoin. »", en: "The manor is plunged in a gloomy half-light. Your partner joins you, hands in pockets.\n\n\"Start with the crime scene. Every detail counts. I'll be here if you need me.\"" } },
            { decor: 'crimeScene',
            text: { fr: "Votre partenaire vous tend la loupe. « Fouillez chaque recoin. Les pièces à conviction vous diront tout. »", en: "Your partner hands you the magnifying glass. 'Search every corner. The evidence pieces will tell you everything.'" },
            minigame: { type: 'scene_fouille', wide: true, evidence: 'forensic',
            title: { fr: "Fouille de la scène", en: "Scene search" },
            desc: { fr: "Balayez la scène à la loupe. Chaque pièce à conviction numérotée ouvre une fenêtre : examinez-les toutes pour reconstituer le code de la montre.", en: "Sweep the scene with the magnifier. Each numbered evidence piece opens a window: examine them all to reconstruct the watch code." },
            clue: { fr: "Les indices du sol et du bureau révèlent des chiffres rouges : 1, 9, 8, 1. Le code de la montre est 1981. La combinaison du coffre est établie.", en: "Floor and desk clues reveal red digits: 1, 9, 8, 1. The watch code is 1981. The safe combination is established." },
            time: 60,
            sceneImage: "assets/image true detective/lieux/classic/scene de crime manoir.png",
            hotspots: [
            { label: 'A', x: 11.6, y: 66.1, info: { fr: "Le sceau en or et son cachet, posés à l'extrémité gauche du bureau. Un bout de papier glissé sous le sceau porte un chiffre rouge : 1.", en: "The gold seal and its stamp, at the far left of the desk. A scrap of paper slid under the seal bears a red digit: 1." } },
            { label: 'B', x: 24.1, y: 70.4, info: { fr: "L'encrier central. Un fragment de correspondance cache un chiffre : 9.", en: "The central inkwell. A fragment of correspondence conceals a digit: 9." } },
            { label: '1', x: 31.2, y: 56.8, info: { fr: "Des papiers administratifs éparpillés. Un chiffre rouge 8 est gratté dans la marge d'un document.", en: "Administrative papers scattered. A red digit 8 is scratched in the margin of a document." } },
            { label: '2', x: 38.6, y: 57.3, info: { fr: "Sous un verre de vin dressé, un chiffre rouge brille : 1.", en: "Under a standing wine glass, a red digit shines: 1." } },
            { label: '3', x: 47.2, y: 58.3, info: { fr: "Un livre ouvert sur le bureau. Une page tournée montre un chiffre : 4. Ce n'est pas le bon.", en: "An open book on the desk. A turned page shows a digit: 4. Not the right one." } },
            { label: '4', x: 66.4, y: 79.2, info: { fr: "Chaise renversée près du corps. Un chiffre rouge 1 est marqué sur le sol.", en: "Overturned chair near the body. A red digit 1 is marked on the floor." } },
            { label: '5', x: 70.8, y: 85.6, info: { fr: "Près de la main du mort, un fragment de papier est illisible. Le chiffre est effacé.", en: "Near the victim's hand, a paper fragment is unreadable. The digit is erased." } },
            { label: '6', x: 78.2, y: 86.3, info: { fr: "Papier froissé dans la craie du corps. Un bout de lettre mentionne : « Le code est 1981, comme l'heure. »", en: "Crumpled paper in the chalk outline. A letter fragment reads: 'The code is 1981, like the time.'" } }
            ] } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Le carnet déchiré révèle des pages manquantes. En les reconstituant, vous découvrez des versements réguliers à un certain « V.K. »", en: "The torn ledger reveals missing pages. By reassembling them, you discover regular payments to a certain \"V.K.\"." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Votre partenaire vous observe : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »", en: "Your partner watches you : \"Are you onto something? These clues are forming a motive. Let's continue.\"" } }
        ]
    });

    /* ===== ACTE 1 - Phase 1 : INTERROGATOIRES AU MANOIR ===== */
    PHASES.push({
        id: 'act1_1',
        label: { fr: 'Interrogatoires', en: 'Interrogations' },
        act: 'Acte 1',
        type: 'dialogue',
        music: 'recherche',
        pages: [
            { decor: 'residence', npc: 'protecteur', interrogation: 'protecteur', text: { fr: "Le Major Hale, garde du corps et majordome en chef, vous accueille dans le salon du manoir avec un mélange de nervosité et d'arrogance. « Je vous ai attendu. La maison est en deuil, faites vite. »\n\nVous l'observez. Hale se tient droit, mais ses yeux vous fuient. Choisissez votre angle d'attaque.", en: "Major Hale, bodyguard and chief butler, greets you in the manor lounge with a mix of nervousness and arrogance. \"I've been expecting you. The house is in mourning, make it quick.\"\n\nYou observe him. Hale stands straight, but his eyes avoid yours. Pick your angle of attack." } },
            { decor: 'residence', npc: 'femme-fatale', interrogation: 'femme-fatale', text: { fr: "Lady Vivienne, d'une voix posée dans le boudoir : « Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. »\n\nElle reste de marbre, une tasse de thé à la main. Elle attend votre première question.", en: "Lady Vivienne, in a calm voice in the boudoir: \"My husband had enemies, certainly. But the perpetrator… it's someone from the house.\"\n\nShe remains stone-faced, a teacup in hand. She waits for your first question." } },
            { decor: 'residence', npc: 'detective-partner', text: { fr: "La montre du Duc gît sur la table du salon, brisée. « Elle a dû valser dans la bagarre, soupire Wexford. Voyez ce qu'elle peut encore nous apprendre. »", en: "The Duke's watch lies on the lounge table, broken. \"It must have flown off in the struggle,\" Wexford sighs. \"See what it can still tell us.\"" } },
            { decor: 'residence', text: { fr: "La montre du Duc gît sur la table, brisée. L'aiguille figée indique l'heure. Existe-t-il un code caché dans cette montre ?", en: "The Duke's watch lies on the table, broken. The frozen hand shows the time. Is there a hidden code in this watch?" }, minigame: { type: 'montre_code', time: 45, title: { fr: "La Montre du Duc", en: "The Duke's Watch" }, desc: { fr: "Examinez la montre pour trouver l'heure du crime et un code secret.", en: "Examine the watch to find the time of death and a secret code." }, clue: { fr: "L'aiguille figée donne l'heure probable du crime. Le code à 4 chiffres au dos ouvre un coffre.", en: "The frozen hand gives the likely time of death. The 4-digit code on the back opens a safe." }, sceneImage: "assets/image true detective/lieux/classic/scene de crime manoir.png" }},
            { decor: 'residence', npc: 'detective-partner', text: { fr: "Après examen : « Bien. Maintenant, qui interroger en premier ? Blackwood, le notaire ? Ou ce témoin dans la ruelle ? Pembrooke, l'ami, est sans doute au bar. »", en: "After examination: \"Good. Now, who should we question first? Blackwood, the notary? Or the witness in the alley? Pembrooke, the friend, is probably at the bar.\"" } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire fait le point : « On a deux versions qui ne tiennent pas ensemble. Hale dit être en panne avec Pembrooke, mais Vivienne assure être seule au manoir. L'un d'eux ment. À vous de voir qui. »", en: "Your partner takes stock: \"We have two versions that don't hold together. Hale says he was broken down with Pembrooke, but Vivienne claims she was alone at the manor. One of them is lying. It's up to you to see who.\"" } },
            { decor: 'headquarters', text: { fr: "Le réseau d'alibis s'étend devant vous. Chaque carte est une déposition. Identifiez les mensonges.", en: "The alibi network spreads out before you. Each card is a testimony. Identify the lies." }, minigame: { type: 'reseau_alibis', time: 60, evidence: 'witness', title: { fr: "Le Réseau d'alibis", en: "The Alibi Network" }, desc: { fr: "Deux dépositions se contredisent déjà. Cliquez sur chaque carte : Mensonge ou Vérité. Identifiez le menteur.", en: "Two testimonies already contradict each other. Click each card : Lie or Truth. Identify the liar." }, clue: { fr: "Le réseau des deux premiers témoins révèle une contradiction : l'un ment sur sa présence sur les lieux.", en: "The network of the first two witnesses reveals a contradiction : one lies about being on scene." }, testimonies: [
                { id: 'hale', witness: { fr: "Major Hale", en: "Major Hale" }, statement: { fr: "J'étais en panne avec Pembrooke à 22h. Le verrou du manoir a été ouvert avec une clé, pas forcé. La victime n'a pas opposé de résistance.", en: "I was broken down with Pembrooke at 10pm. The manor lock was opened with a key, not forced. The victim didn't resist." }, isLie: false },
                { id: 'vivienne', witness: { fr: "Lady Vivienne", en: "Lady Vivienne" }, statement: { fr: "J'étais au théâtre avec des amies, puis seule au manoir. Mon mari et moi avions une relation basée sur l'argent, pas l'amour, je n'avais aucune raison de le tuer.", en: "I was at the theatre with friends, then alone at the manor. My husband and I had a relationship based on money, not love, I had no reason to kill him." }, isLie: true }
            ] }},
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire synthétise : « Les contradictions se confirment. Un ou plusieurs témoignages mentent. Continuez l'enquête. »", en: "Your partner summarizes: \"The contradictions are confirmed. One or more testimonies are lying. Keep investigating.\"" } }
        ]
    });

    /* ===== ACTE 1 - Phase 2 : SORTIE ET PREMIERS TÉMOIGNAGES ===== */
    PHASES.push({
        id: 'act1_2',
        label: { fr: 'Témoignages', en: 'Testimonies' },
        act: 'Acte 1',
        type: 'dialogue',
        music: 'reflexion',
        pages: [
            { decor: 'residence', npc: 'detective-partner', text: { fr: "Avant de partir, vous revoyez vos notes avec Wexford dans le vestibule du manoir. « Le clochard de la ruelle a vu quelque chose cette nuit-là. Mais passons d'abord chez Blackwood, le notaire - il gétait les affaires du Duc. Et le clochard, on l'interceptera au retour. »", en: "Before leaving, you review your notes with Wexford in the manor vestibule. \"The homeless man in the alley saw something that night. But let's stop by Blackwood's, the notary - he handled the Duke's affairs. We'll catch the homeless man on the way back.\"" } },
            { decor: 'residence', npc: 'detective-partner', text: { fr: "La chronologie s'assemble dans votre esprit : Hale prétendait être en panne avec Pembrooke à 22h, mais les indices placent le manoir sur les lieux à 22h09. L'alibi du Major est fissuré.", en: "The timeline assembles in your mind: Hale claimed to be broken down with Pembrooke at 10pm, but clues place the manor on scene at 10:09pm. Hale's alibi is cracked." } },
            { decor: 'secretPlace', npc: 'suspect', interrogation: 'suspect', text: { fr: "Chez Rupert Blackwood, dans son appartement cossu. Il vous ouvre, l'air nerveux.\n\n« Entrez, inspecteur. Je ne sais pas ce que trafique le Duc ces derniers temps, mais les tensions sur le testament se multiplient. J'ai peur que tout cela finisse mal. »\n\nDerrière son bureau de notaire, il paraît fatigué. Il vous fait signe de vous asseoir.", en: "At Rupert Blackwood's place, in his lavish apartment. He opens the door, looking uneasy.\n\n\"Come in, inspector. I don't know what the Duke has been up to lately, but the tensions around the will keep growing. I'm afraid this will end badly.\"\n\nBehind his notary desk, he looks tired. He gestures for you to sit." } },
            { decor: 'alley', npc: 'marginal', interrogation: 'marginal', text: { fr: "Sur le chemin du retour, à la sortie du manoir, dans la ruelle adjacente, Silas Crane grelotte dans un coin. Vous l'abordez doucement.\n\n« T'as une pièce, inspecteur ? »\n\nVous lui glissez une monnaie. Il se détend, prêt à parler.", en: "On the way back, at the manor exit, in the adjacent alley, Silas Crane is shivering in a corner. You approach him gently.\n\n\"Got a coin, inspector?\"\n\nYou slip him some change. He relaxes, ready to talk." } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire fait le point : « Ces quatre dépositions se répondent et se contredisent. Préparez-vous à analyser le réseau d'alibis. »", en: "Your partner takes stock: \"These four depositions answer and contradict each other. Get ready to analyze the alibi network.\"" } },
            { decor: 'headquarters', text: { fr: "Quatre dépositions à croiser. Le réseau s'épaissit, les mensonges se multiplient.", en: "Four testimonies to cross-reference. The network thickens, the lies multiply." }, minigame: { type: 'reseau_alibis', time: 90, evidence: 'witness', title: { fr: "Le Réseau d'alibis", en: "The Alibi Network" }, desc: { fr: "Quatre dépositions. Certains se contredisent déjà. Cliquez sur chaque carte : Mensonge ou Vérité. Identifiez les menteurs.", en: "Four testimonies. Some already contradict each other. Click each card : Lie or Truth. Identify the liars." }, clue: { fr: "Le réseau partiel révèle des contradictions entre les alibis des premiers suspects interrogés.", en: "The partial network reveals contradictions between the alibis of the first suspects questioned." }, testimonies: [
                { id: 'hale', witness: { fr: "Major Hale", en: "Major Hale" }, statement: { fr: "J'étais en panne avec Pembrooke à 22h. Le verrou du manoir a été ouvert avec une clé, pas forcé. La victime n'a pas opposé de résistance.", en: "I was broken down with Pembrooke at 10pm. The manor lock was opened with a key, not forced. The victim didn't resist." }, isLie: false },
                { id: 'vivienne', witness: { fr: "Lady Vivienne", en: "Lady Vivienne" }, statement: { fr: "J'étais au théâtre avec des amies, puis seule au manoir. Mon mari et moi avions une relation basée sur l'argent, pas l'amour, je n'avais aucune raison de le tuer.", en: "I was at the theatre with friends, then alone at the manor. My husband and I had a relationship based on money, not love, I had no reason to kill him." }, isLie: true },
                { id: 'blackwood', witness: { fr: "Rupert Blackwood", en: "Rupert Blackwood" }, statement: { fr: "J'ai dîné avec le Duc à 19h, il voulait retirer des fonds. Je suis parti vers 20h, Silas m'a vu passer au portail. Le testament m'importe peu, c'est l'héritier qui compte.", en: "I dined with the Duke at 7pm, he wanted to withdraw funds. I left around 8pm, Silas saw me pass the gate. The will matters little to me, it's the heir that matters." }, isLie: false },
                { id: 'silas', witness: { fr: "Silas Crane", en: "Silas Crane" }, statement: { fr: "J'ai vu un rôdeur à 22h près du pavillon, montre en or, nerveux. Et j'ai vu Blackwood passer à 20h, le notaire a toujours été réglo.", en: "I saw a prowler at 10pm near the pavilion, gold watch, nervous. And I saw Blackwood pass at 8pm, the notary has always been straight." }, isLie: false }
            ] }},
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire synthétise : « Les contradictions se confirment. Un ou plusieurs témoignages mentent. Continuez l'enquête. »", en: "Your partner summarizes: \"The contradictions are confirmed. One or more testimonies are lying. Keep investigating.\"" } }
        ]
    });

    /* ===== ACTE 2 - Phase 1 : PISTE DU BAR ===== */
    PHASES.push({
        id: 'act2_1',
        label: { fr: 'Piste du bar', en: 'Bar lead' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'enigme',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Faisons le point sur les indices. Les versements à V.K. et les empreintes du Major Hale sur la mention V.K. sont notre fil conducteur. Mais il nous manque une clé à quatre chiffres. Allons interroger Pembrooke et Krane au bar, capter leur réaction.", en: "Let's take stock. The payments to V.K. and Major Hale's fingerprints on the V.K. entry are our thread. But we lack a four-digit key. Let's head to the bar and watch Pembrooke and Krane react." } },
            { decor: 'barInterieur', npc: 'seducteur', interrogation: 'seducteur', text: { fr: "A l'intérieur du bar, la fumée stagne sous les néons. Vous vous installez au comptoir, à côté de Julian Pembrooke.\n\n- Monsieur Pembrooke. On vous a vu avec la victime la veille de sa mort. Comment l'expliquez-vous ?\n\nPembrooke fait tourner son verre sans y porter les lèvres. Il vous regarde par-dessous, un sourire en coin.", en: "Inside the bar, smoke lingers under the neon lights. You sit at the counter, next to Julian Pembrooke.\n\n- Mr. Pembrooke. You were seen with the victim the day before his death. How do you explain that ?\n\nPembrooke spins his glass without raising it to his lips. He glances at you from under his brow, a wry smile." } },
            { decor: 'publicPlace', npc: 'criminel', interrogation: 'criminel', text: { fr: "Dehors, sous la lumière crue des réverbères, Victor Krane se tient devant l'entrée du bar, le curedent entre les dents. L'air frais de la nuit lui redonne un peu de nervosité.\n\n- Monsieur Krane. Vous étiez dans le quartier cette nuit-là. Dites-moi tout.", en: "Outside, under the harsh light of the streetlamps, Victor Krane stands by the bar entrance, a toothpick between his teeth. The cool night air makes him a little nervous.\n\n- Mr. Krane. You were in the neighborhood that night. Tell me everything." } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "De retour au QG, votre partenaire aligne les six dépositions sur le tableau. « Ces témoignages se répondent, parfois mal. Préparez-vous à analyser le réseau complet. »", en: "Back at HQ, your partner lines up the six testimonies on the board. \"These testimonies answer each other, sometimes poorly. Get ready to analyze the full network.\"" } },
            { decor: 'headquarters', text: { fr: "Six témoignages, un réseau complet. Les mensonges s'enchevêtrent. Trouvez le vrai coupable.", en: "Six testimonies, a complete network. The lies intertwine. Find the true culprit." }, minigame: { type: 'reseau_alibis', time: 90, evidence: 'witness', title: { fr: "Le Réseau d'alibis", en: "The Alibi Network" }, desc: { fr: "Six dépositions. Toutes se répondent ou se contredisent. Cliquez sur chaque carte : Mensonge ou Vérité. Identifiez les menteurs.", en: "Six testimonies. They all answer or contradict each other. Click each card : Lie or Truth. Identify the liars." }, clue: { fr: "Le réseau complet révèle des contradictions entre les versions des six suspects : Hale et Pembrooke mentent sur leur alibi de panne, Vivienne cache sa liaison, et Krane est engagé depuis le manoir.", en: "The complete network reveals contradictions between the six suspects' versions: Hale and Pembrooke lie about their breakdown alibi, Vivienne hides her affair, and Krane was hired from the manor." }, testimonies: [
                { id: 'hale', witness: { fr: "Major Hale", en: "Major Hale" }, statement: { fr: "J'étais en panne avec Pembrooke à 22h. Le verrou du manoir a été ouvert avec une clé, pas forcé. La victime n'a pas opposé de résistance.", en: "I was broken down with Pembrooke at 10pm. The manor lock was opened with a key, not forced. The victim didn't resist." }, isLie: false },
                { id: 'vivienne', witness: { fr: "Lady Vivienne", en: "Lady Vivienne" }, statement: { fr: "J'étais au théâtre avec des amies, puis seule au manoir. Mon mari et moi avions une relation basée sur l'argent, pas l'amour, je n'avais aucune raison de le tuer.", en: "I was at the theatre with friends, then alone at the manor. My husband and I had a relationship based on money, not love, I had no reason to kill him." }, isLie: true },
                { id: 'pembrooke', witness: { fr: "Julian Pembrooke", en: "Julian Pembrooke" }, statement: { fr: "Ma voiture est tombée en panne, Hale m'a rejoint à 22h. J'étais SEUL à attendre, aucun rôdeur n'est passé près du manoir cette nuit-là.", en: "My car broke down, Hale joined me at 10pm. I was ALONE waiting, no prowler passed near the manor that night." }, isLie: true },
                { id: 'blackwood', witness: { fr: "Rupert Blackwood", en: "Rupert Blackwood" }, statement: { fr: "J'ai dîné avec le Duc à 19h, il voulait retirer des fonds. Je suis parti vers 20h, Silas m'a vu passer au portail. Le testament m'importe peu, c'est l'héritier qui compte.", en: "I dined with the Duke at 7pm, he wanted to withdraw funds. I left around 8pm, Silas saw me pass the gate. The will matters little to me, it's the heir that matters." }, isLie: false },
                { id: 'silas', witness: { fr: "Silas Crane", en: "Silas Crane" }, statement: { fr: "J'ai vu un rôdeur à 22h près du pavillon, montre en or, nerveux. Et j'ai vu Blackwood passer à 20h, le notaire a toujours été réglo.", en: "I saw a prowler at 10pm near the pavilion, gold watch, nervous. And I saw Blackwood pass at 8pm, the notary has always been straight." }, isLie: false },
                { id: 'krane', witness: { fr: "Victor Krane", en: "Victor Krane" }, statement: { fr: "Pour qui paye. Cette nuit-là, j'étais seul. Les clochards racontent n'importe quoi, surtout ce Silas, un vagabond au passé trouble.", en: "For whoever pays. That night, I was alone. The homeless make up anything, especially that Silas, a vagrant with a murky past." }, isLie: true }
            ] }},
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire synthétise : « Le réseau révèle des failles majeures. Deux alibis de panne se recouvrent, une liaison est cachée, et un homme de main agit pour un Intérieur. »", en: "Your partner summarizes: \"The network reveals major flaws. Two breakdown alibis overlap, an affair is hidden, and a hired hand acts for an insider.\"" } }
        ]
    });

    /* ===== ACTE 2, Phase 2 : LABORATOIRE - L'ADN DE TOUS ===== */
    PHASES.push({
        id: 'act2_2',
        label: { fr: 'Laboratoire', en: 'Laboratory' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'enigme',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "De retour au QG, votre partenaire vérifie les dossiers. « Whitmore a les résultats des tests ADN. Allons-y, c'est décisif. »", en: "Back at HQ, your partner checks the files. \"Whitmore has the DNA test results. Let's go, this is decisive.\"" } },
            { decor: 'laboratory', npc: 'scientifique', text: { fr: "Au laboratoire, la lumière est stérile et froide. Les grilles d'analyse lumineuses scintillent au-dessus des paillasses. Le docteur Whitmore relève la tête de ses lunettes, le visage grave.\n\n« Inspecteur, les analyses sont sans appel. L'ADN relevé sur l'arme du crime et sur le battant de la porte... ne désigne pas un coupable. Il les désigne tous. Des traces infimes de chaque suspect ont été retrouvées sur les lieux. »\n\nIl pose un dossier épais sur la table.\n\n« La scène a été touchée, manipulée, fréquentée par chacun d'eux. Il va falloir les confronter directement chez eux, dans leurs décors, pour voir comment ils réagissent. Cherchez la faille dans leurs alibis. »", en: "At the laboratory, the light is sterile and cold. The luminous analysis grids flicker above the benches. Dr. Whitmore looks up from his glasses, his face grave.\n\n\"Inspector, the analyses are conclusive. The DNA found on the murder weapon and on the door frame... does not point to one killer. It points to all of them. Minute traces of each suspect were found at the scene.\"\n\nHe places a thick folder on the table.\n\n\"The scene has been touched, manipulated, frequented by every one of them. You will need to confront them directly, in their own surroundings, to see how they react. Find the flaw in their alibis.\"" } },
            { decor: 'laboratory', npc: 'detective-partner', text: { fr: "Wexford range les dossiers. « L'ADN confirme que tous ont été présents, mais les versements et les empreintes du coffre tracent un sentier unique : Hale a engagé Krane. Il est temps de les confronter tous ensemble. »", en: "Wexford puts away the files. \"The DNA confirms all were present, but the payments and safe fingerprints trace a single path: Hale hired Krane. It's time to confront them all together.\"" } }
        ]
    });
    /* ===== ACTE 2, Phase 3 : INTERROGATOIRES SUR SITE ===== */
    PHASES.push({
        id: 'act2_3',
        label: { fr: 'Interrogatoires', en: 'Interrogations' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'recherche',
        pages: [
            { decor: 'residence', npc: 'protecteur', interrogation: 'protecteur', text: { fr: "Au manoir, le Major Hale vous accueille en ajustant ses gants blancs. Le feu de cheminée crépite faiblement dans le salon glacé.\n\n« Inspecteur. Que dois-je vous apprendre que vous ne sachiez déjà ? »\n\nInterrogé sur sa présence sur les lieux, il balbutie :\n\n« Je... je venais simplement m'assurer que le mobilier de sa Seigneurie était intact. Vous savez, il conservait des documents d'une importance capitale dans sa cachette personnelle derrière les boiseries... enfin, ses affaires privées, quoi. Rien qui ne vous regarde. »", en: "At the manor, Major Hale greets you adjusting his white gloves. The fireplace crackles softly in the frozen lounge.\n\n\"Inspector. What can I tell you that you don't already know?\"\n\nQuestioned about his presence, he stammers:\n\n\"I... I was simply making sure his Lordship's furniture was untouched. You know, he kept documents of the utmost importance in his personal hiding place behind the paneling... well, his private affairs, really. Nothing that concerns you.\"" } },
            { decor: 'residence', npc: 'femme-fatale', interrogation: 'femme-fatale', text: { fr: "Dans le boudoir aux rideaux de velours rouge sang, Vivienne feuillette ses ongles, un sourire narquois aux lèvres.\n\n« L'ADN de tout le monde ? Mon pauvre ami, ce manoir est un moulin. Tout le monde entre, tout le monde sort. Même mon mari passait son temps à verrouiller ses petits secrets dans ce fichu coffre mural de son bureau, persuadé que tout le monde en voulait à son magot. Quelle paranoïa. »", en: "In the boudoir with blood-red velvet curtains, Vivienne examines her nails, a smirk on her lips.\n\n\"Everyone's DNA? My poor friend, this manor is a mill. Everyone comes, everyone goes. Even my husband spent his time locking away his little secrets in that damned wall safe in his office, convinced everyone wanted his loot. Such paranoia.\"" } },
            { decor: 'barInterieur', npc: 'seducteur', interrogation: 'seducteur', text: { fr: "Au bar interlope, la fumée stagne sous les néons. Pembrooke essuie un verre, les mains moites.\n\n« L'ADN ? Écoutez, je lui devais de l'argent, d'accord ? Il menaçait de tout balancer sur mes dettes. Il gardait des reçus de mes traites dans un coffre chez lui, mais je vous jure que je n'y ai pas touché... Enfin, je veux dire, je savais qu'il y cachait des papiers importants, c'est tout ! »", en: "In the shady bar, smoke lingers under the neon lights. Pembrooke wipes a glass, his hands clammy.\n\n\"The DNA? Look, I owed him money, alright? He threatened to expose my debts. He kept receipts from my installments in a safe at his place, but I swear I didn't touch it... Well, I mean, I knew he hid important papers there, that's all!\"" } },
            { decor: 'secretPlace', npc: 'suspect', interrogation: 'suspect', text: { fr: "Dans l'étude notariale austère de Blackwood, les piles de dossiers poussiéreux s'entassent. Le notaire transpire, desserrant frénétiquement son col.\n\n« Mes registres sont en règle ! S'il y a des anomalies, c'est que... bon, d'accord, le magnat conservait ses actes de fiducie et ses contrats originaux dans son coffre privé. Si ce coffre a été vidé, je suis ruiné, mais je n'y suis pour rien, je vous dis ! »", en: "In Blackwood's austere notary office, dusty piles of files stack up. The notary sweats, frantically loosening his collar.\n\n\"My records are in order! If there are anomalies, it's because... well, alright, the magnate kept his trust deeds and original contracts in his private safe. If that safe was emptied, I'm ruined, but I had nothing to do with it, I tell you!\"" } },
            { decor: 'alley', npc: 'marginal', interrogation: 'marginal', text: { fr: "Sur le chemin du retour, a la sortie du manoir, dans la ruelle adjacente, Silas Crane grelotte dans un coin. Vous l'abordez doucement.\n\n« T'as une piece, inspecteur ? »\n\nVous lui glissez une monnaie. Il se detend, pret a parler.", en: "On the way back, at the manor exit, in the adjacent alley, Silas Crane is shivering in a corner. You approach him gently.\n\n\"Got a coin, inspector?\"\n\nYou slip him some change. He relaxes, ready to talk." } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire fait le point : « Ces six dépositions se répondent et se contredisent. Préparez-vous à analyser le réseau complet. »", en: "Your partner takes stock: \"These six depositions answer and contradict each other. Get ready to analyze the full network.\"" } },
            { decor: 'headquarters', text: { fr: "Toutes les dépositions sont sur la table. Le réseau complet révèle enfin la vérité.", en: "All testimonies are on the table. The complete network finally reveals the truth." }, minigame: { type: 'reseau_alibis', time: 90, evidence: 'witness', title: { fr: "Le Réseau d'alibis", en: "The Alibi Network" }, desc: { fr: "Six dépositions. Toutes se répondent ou se contredisent. Cliquez sur chaque carte : Mensonge ou Vérité. Identifiez les menteurs.", en: "Six testimonies. They all answer or contradict each other. Click each card : Lie or Truth. Identify the liars." }, clue: { fr: "Le réseau complet après interrogatoires sur site révèle des contradictions entre les versions des six suspects.", en: "The complete network after on-site interrogations reveals contradictions between the versions of the six suspects." }, testimonies: [
                { id: 'hale', witness: { fr: "Major Hale", en: "Major Hale" }, statement: { fr: "J'étais en panne avec Pembrooke à 22h. Le verrou du manoir a été ouvert avec une clé, pas forcé. La victime n'a pas opposé de résistance.", en: "I was broken down with Pembrooke at 10pm. The manor lock was opened with a key, not forced. The victim didn't resist." }, isLie: false },
                { id: 'vivienne', witness: { fr: "Lady Vivienne", en: "Lady Vivienne" }, statement: { fr: "J'étais au théâtre avec des amies, puis seule au manoir. Mon mari et moi avions une relation basée sur l'argent, pas l'amour, je n'avais aucune raison de le tuer.", en: "I was at the theatre with friends, then alone at the manor. My husband and I had a relationship based on money, not love, I had no reason to kill him." }, isLie: true },
                { id: 'blackwood', witness: { fr: "Rupert Blackwood", en: "Rupert Blackwood" }, statement: { fr: "J'ai dîné avec le Duc à 19h, il voulait retirer des fonds. Je suis parti vers 20h, Silas m'a vu passer au portail. Le testament m'importe peu, c'est l'héritier qui compte.", en: "I dined with the Duke at 7pm, he wanted to withdraw funds. I left around 8pm, Silas saw me pass the gate. The will matters little to me, it's the heir that matters." }, isLie: false },
                { id: 'silas', witness: { fr: "Silas Crane", en: "Silas Crane" }, statement: { fr: "J'ai vu un rôdeur à 22h près du pavillon, montre en or, nerveux. Et j'ai vu Blackwood passer à 20h, le notaire a toujours été réglo.", en: "I saw a prowler at 10pm near the pavilion, gold watch, nervous. And I saw Blackwood pass at 8pm, the notary has always been straight." }, isLie: false },
                { id: 'pembrooke', witness: { fr: "Julian Pembrooke", en: "Julian Pembrooke" }, statement: { fr: "Ma voiture est tombée en panne, Hale m'a rejoint à 22h. J'étais SEUL à attendre, aucun rôdeur n'est passé près du manoir cette nuit-là.", en: "My car broke down, Hale joined me at 10pm. I was ALONE waiting, no prowler passed near the manor that night." }, isLie: true },
                { id: 'krane', witness: { fr: "Victor Krane", en: "Victor Krane" }, statement: { fr: "Pour qui paye. Cette nuit-là, j'étais seul. Les clochards racontent n'importe quoi, surtout ce Silas, un vagabond au passé trouble.", en: "For whoever pays. That night, I was alone. The homeless make up anything, especially that Silas, a vagrant with a murky past." }, isLie: true }
            ] }},
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire synthétise : « Les contradictions se confirment. Un ou plusieurs témoignages mentent. Continuons. »", en: "Your partner summarizes: \"The contradictions are confirmed. One or more testimonies are lying. Let's continue.\"" } }
        ]
    });

    /* ===== ACTE 2, Phase 4 : DÉDUCTION DU PARTENAIRE ===== */
    PHASES.push({
        id: 'act2_4',
        label: { fr: 'Déduction', en: 'Deduction' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'reflexion',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "De retour dans la voiture banalisée, les essuie-glaces battent un rythme lancinant. Votre partenaire frappe le volant du plat de la main.\n\n« Bon sang, mais c'est bien sûr ! Tous les suspects ont mentionné, d'une manière ou d'une autre, ce fichu coffre-fort. Et regardez cette montre gousset trouvée sur la victime : l'aiguille est bloquée sur une combinaison numérique précise. Ce n'est pas l'heure de sa mort... c'est la combinaison du coffre ! Foncez à la scène de crime, c'est là-bas que tout se joue. »", en: "Back in the unmarked car, the wipers beat a steady rhythm. Your partner strikes the wheel with his palm.\n\n\"Damn it, of course! Every suspect mentioned that damned safe, one way or another. And look at that pocket watch found on the victim: the hand is stuck on a precise numerical combination. It's not the time of death... it's the combination to the safe! Get to the crime scene, that's where everything happens.\"" } }
        ]
    });

    /* ===== ACTE 3, Phase 1 : LA SCÈNE DE CRIME - LE COFFRE ===== */
    PHASES.push({
        id: 'act3_1',
        label: { fr: 'Le Coffre', en: 'The Safe' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'enigme',
        pages: [
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Le manoir est plongé dans une pénombre lugubre. Le ruban de police claque doucement au vent près du bureau de la victime. Vous vous approchez du panneau de boiserie dissimulant le coffre-fort.\n\n« Allez, inspecteur. La combinaison de la montre... et ouvrez-moi ce coffre. »", en: "The manor is plunged in a gloomy half-light. The police tape flaps softly in the wind near the victim's desk. You approach the wood panel concealing the safe.\n\n\"Go on, inspector. The watch's combination... and open me that safe.\"" } },
            { decor: 'crimeScene', minigame: { type: 'coffre_code', time: 90, evidence: 'mobile', title: { fr: "Le Coffre-Fort", en: "The Safe" }, desc: { fr: "Entrez le code à 4 chiffres de la montre pour ouvrir le coffre-fort.", en: "Enter the 4-digit code from the watch to open the safe." }, clue: { fr: "Le coffre révèle les versements à Victor Krane : Hale a engagé l'assassin. Le mobile est établi.", en: "The safe reveals payments to Victor Krane: Hale hired the assassin. The motive is established." } } },
            { decor: 'crimeScene', text: { fr: "La combinaison de la montre grince le coffre-fort. À l'intérieur, des liasses de billets, des contrats, des lettres compromettantes. Le mobile du crime se dessine : argent, dettes, silence.\n\n« Les documents révèlent les versements à V.K. et les dettes de Hale. Maintenant, retournons au QG. Il est temps de confronter les suspects. »", en: "The watch's combination grinds open the safe. Inside, bundles of banknotes, contracts, compromising letters. The motive takes shape: money, debts, silence.\n\n\"The documents reveal the payments to V.K. and Hale's debts. Now, let's head back to HQ. It's time to confront the suspects.\"" } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Le coffre s'ouvre dans un grincement métallique, activé par la combinaison de la montre. À l'intérieur, des liasses de billets, des contrats, des lettres compromettantes. Le mobile du crime se dessine : argent, dettes, silence.\n\n« Bien joué, inspecteur. Les documents révèlent les versements à V.K. et les dettes de Hale. Maintenant, retournons au QG. Il est temps de confronter les suspects. »", en: "The safe opens with a metallic creak, activated by the watch's combination. Inside, bundles of banknotes, contracts, compromising letters. The motive takes shape: money, debts, silence.\n\n\"Well done, inspector. The documents reveal the payments to V.K. and Hale's debts. Now, back to HQ. It's time to confront the suspects.\"" } }
        ]
    });

        /* ===== ACTE 3, Phase 2 : QG - INTERROGATOIRES DU PARLOIR ===== */
    PHASES.push({
        id: 'act3_2',
        label: { fr: 'Révélation', en: 'Revelation' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'tension',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "De retour au quartier général, la pression monte d'un cran. Votre partenaire étale les documents du coffre sur la table.\n\n« Voilà qui change tout, inspecteur. Ces papiers ressemblent trop à ce que chacun de nos suspects cherchait. Convoquons-les un par un au parloir, et regardons comment leurs beaux discuts tiennent face aux preuves. »", en: "Back at headquarters, the pressure rises. Your partner spreads the safe's documents on the table.\n\n\"This changes everything, inspector. These papers look too much like what each of our suspects was after. Let's summon them one by one to the interrogation room, and see how their fine stories hold up against the evidence.\"" } },
            { decor: 'headquarters', npc: 'protecteur', interrogation: 'protecteur', text: { fr: "Au parloir, Hale s'assoit, les mains croisées, le regard fixe devant lui.\n\n« Major Hale. Des versements occultes à un certain V.K. figurent dans le coffre. Votre passé militaire, vos dettes de jeu... Vous aviez bien des raisons de vouloir ces papiers disparus. »\n\n« Vous inventez, inspecteur. Je servais mon maître. Rien de plus. »", en: "In the interrogation room, Hale sits, hands crossed, gaze fixed ahead.\n\n\"Major Hale. Secret payments to a certain V.K. appear in the safe. Your military past, your gambling debts... You had every reason to want those vanished papers.\"\n\n\"You're inventing things, inspector. I served my master. Nothing more.\"" } },
            { decor: 'headquarters', npc: 'femme-fatale', interrogation: 'femme-fatale', text: { fr: "Lady Vivienne entre au parloir, le dos droit, le sourire effacé.\n\n« Lady Vivienne. Des lettres intimes de votre main dormaient dans ce coffre. Vous saviez donc mieux que quiconque ce qu'il renfermait. »\n\n« Un coffre, inspecteur ? Mon époux changeait de cachette tous les mois. Sa paranoïa l'a perdu - pas moi. »", en: "Lady Vivienne enters the interrogation room, back straight, smile gone.\n\n\"Lady Vivienne. Intimate letters in your hand were resting in that safe. You knew better than anyone what it held.\"\n\n\"A safe, inspector? My husband changed his hiding place every month. His paranoia undid him - not I.\"" } },
            { decor: 'headquarters', npc: 'seducteur', interrogation: 'seducteur', text: { fr: "Pembrooke s'assoit lourdement, le teint pâle.\n\n« Monsieur Pembrooke. Des reconnaissances de dettes signées de votre main... et leur disparition vous arrange passablement. »\n\n« Si j'avais tué pour des papiers, inspecteur, croyez-moi, on ne les retrouverait pas au fond d'un coffre. Je les aurais brûlés. »", en: "Pembrooke sits heavily, his complexion pale.\n\n\"Mr. Pembrooke. Debt notes signed by your hand... and their disappearance suits you rather well.\"\n\n\"If I had killed for papers, inspector, believe me, they wouldn't be found at the bottom of a safe. I'd have burned them.\"" } },
            { decor: 'headquarters', npc: 'suspect', interrogation: 'suspect', text: { fr: "Blackwood ne regarde pas le dossier qu'on lui tend.\n\n« Maître Blackwood. Les actes de fiducie du coffre ont disparu. Un audit de ses comptes était prévu dès le lendemain. Vous étiez le seul à le savoir. »\n\n« Je gère les affaires de moitié de la ville, inspecteur. Si chaque défalcation était un meurtre, le pendu ne suffirait plus. »", en: "Blackwood doesn't look at the file handed to him.\n\n\"Master Blackwood. The trust deeds from the safe have vanished. An audit of his accounts was due the very next day. You were the only one who knew.\"\n\n\"I manage half the city's affairs, inspector. If every embezzlement were a murder, the gallows wouldn't suffice.\"" } },
            { decor: 'headquarters', npc: 'marginal', interrogation: 'marginal', text: { fr: "Silas Crane est amené au parloir, les menottes aux poings, mais l'œil brillant.\n\n« Crane. Des fibres de toile grossière et de la boue du jardin, dans le coffre vidé. Vous êtes bien monté en gentilhomme depuis peu. »\n\n« Moi ? Je cambriole les cuisines, monsieur l'inspecteur, pas les coffres. Mais j'ai vu, cette nuit-là, une ombre repartir du bureau les mains pleines. »", en: "Silas Crane is brought to the interrogation room, cuffed at the wrists, but with a gleam in his eye.\n\n\"Crane. Coarse cloth fibers and garden mud, inside the emptied safe. You've moved up in the world lately.\"\n\n\"Me? I burgle kitchens, Mr. Inspector, not safes. But that night I saw a shadow leave the office with full hands.\"" } },
            { decor: 'headquarters', npc: 'criminel', interrogation: 'criminel', text: { fr: "Krane sourit, les bras croisés.\n\n« Krane. Des contrats de commandite et une liasse de billets en acompte ont disparu du coffre. Votre trace est dessus. »\n\n« Mon trace est partout, inspecteur. C'est le métier. Mais je ne vole jamais mes propres employeurs. Question de survie. »", en: "Krane smiles, arms crossed.\n\n\"Krane. Retainer contracts and a bundle of banknotes as advance payment have vanished from the safe. Your trace is on them.\"\n\n\"My trace is everywhere, inspector. It's the trade. But I never rob my own employers. A matter of survival.\"" } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Wexford épingle les six dépositions sur le grand tableau de liège. « Les interrogatoires, les analyses, les preuves du coffre... tout est là. Mais chacun accuse quelqu'un d'autre. À vous de démêler qui ment, qui dit vrai. Trois menteurs se dessinent. »", en: "Wexford pins the six depositions on the big cork board. \"The interrogations, the analyses, the safe's evidence... it's all there. But each one accuses someone else. Sort out who lies, who tells the truth. Three liars emerge.\"" } },
            { decor: 'headquarters', text: { fr: "Dernière analyse du réseau. Les cartes s'alignent, les mensonges se dévoilent. Qui a menti jusqu'au bout ?", en: "Final network analysis. The cards align, the lies revealed. Who lied until the very end?" }, minigame: { type: 'reseau_alibis', time: 90, evidence: 'witness', title: { fr: "Le Réseau d'alibis", en: "The Alibi Network" }, desc: { fr: "Six dépositions. Toutes se répondent ou se contredisent. Cliquez sur chaque carte : Mensonge ou Vérité. Identifiez les menteurs.", en: "Six testimonies. They all answer or contradict each other. Click each card : Lie or Truth. Identify the liars." }, clue: { fr: "Le réseau complet après interrogatoires du parloir révèle des contradictions entre les versions des six suspects.", en: "The complete network after interrogation room questioning reveals contradictions between the versions of the six suspects." }, testimonies: [
                { id: 'hale', witness: { fr: "Major Hale", en: "Major Hale" }, statement: { fr: "J'étais en panne avec Pembrooke à 22h. Le verrou du manoir a été ouvert avec une clé, pas forcé. La victime n'a pas opposé de résistance.", en: "I was broken down with Pembrooke at 10pm. The manor lock was opened with a key, not forced. The victim didn't resist." }, isLie: false },
                { id: 'vivienne', witness: { fr: "Lady Vivienne", en: "Lady Vivienne" }, statement: { fr: "J'étais au théâtre avec des amies, puis seule au manoir. Mon mari et moi avions une relation basée sur l'argent, pas l'amour, je n'avais aucune raison de le tuer.", en: "I was at the theatre with friends, then alone at the manor. My husband and I had a relationship based on money, not love, I had no reason to kill him." }, isLie: true },
                { id: 'pembrooke', witness: { fr: "Julian Pembrooke", en: "Julian Pembrooke" }, statement: { fr: "Ma voiture est tombée en panne, Hale m'a rejoint à 22h. J'étais SEUL à attendre, aucun rôdeur n'est passé près du manoir cette nuit-là.", en: "My car broke down, Hale joined me at 10pm. I was ALONE waiting, no prowler passed near the manor that night." }, isLie: true },
                { id: 'blackwood', witness: { fr: "Rupert Blackwood", en: "Rupert Blackwood" }, statement: { fr: "J'ai dîné avec le Duc à 19h, il voulait retirer des fonds. Je suis parti vers 20h, Silas m'a vu passer au portail. Le testament m'importe peu, c'est l'héritier qui compte.", en: "I dined with the Duke at 7pm, he wanted to withdraw funds. I left around 8pm, Silas saw me pass the gate. The will matters little to me, it's the heir that matters." }, isLie: false },
                { id: 'silas', witness: { fr: "Silas Crane", en: "Silas Crane" }, statement: { fr: "J'ai vu un rôdeur à 22h près du pavillon, montre en or, nerveux. Et j'ai vu Blackwood passer à 20h, le notaire a toujours été réglo.", en: "I saw a prowler at 10pm near the pavilion, gold watch, nervous. And I saw Blackwood pass at 8pm, the notary has always been straight." }, isLie: false },
                { id: 'krane', witness: { fr: "Victor Krane", en: "Victor Krane" }, statement: { fr: "Pour qui paye. Cette nuit-là, j'étais seul. Les clochards racontent n'importe quoi, surtout ce Silas, un vagabond au passé trouble.", en: "For whoever pays. That night, I was alone. The homeless make up anything, especially that Silas, a vagrant with a murky past." }, isLie: true }
            ] }},
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire synthétise : « Les contradictions se confirment. Trois menteurs se dessinent. Le commanditaire n'est jamais celui qui accomplit le geste. »", en: "Your partner summarizes: \"The contradictions are confirmed. Three liars emerge. The mastermind is never the one who commits the act.\"" } }
        ]
    });

    /* ===== ACTE 3, Phase 3 : CONFRONTATION FINALE ===== */
    PHASES.push({
        id: 'act3_3',
        label: { fr: 'Confrontation', en: 'Confrontation' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'tension',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Au quartier général, le moment est venu. Votre partenaire étale les six dossiers sur la table, à côté des documents du coffre. Vous pouvez interroger une dernière fois le suspect que vous soupçonnez le plus.\n\nRappel : chaque suspect ne peut être réentendu qu'une fois.", en: "At headquarters, the time has come. Your partner spreads the six files on the table, beside the safe's documents. You can interrogate the suspect you suspect the most one last time.\n\nReminder: each suspect can only be re-interrogated once." } },
            { decor: 'dynamic', npc: 'dynamic', interrogation: 'dynamic', text: { fr: "Interrogatoire final. Le suspect est amené devant vous. L'heure de la vérité a sonné.", en: "Final interrogation. The suspect is brought before you. The time of truth has come." } },
            { decor: 'headquarters', npc: 'detective-partner', choices: [
                { label: { fr: 'Accuser le Major Hale (garde du corps)', en: 'Accuse Major Hale (bodyguard)' }, id: 'protecteur', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Lady Vivienne (épouse)', en: 'Accuse Lady Vivienne (wife)' }, id: 'femme-fatale', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Julian Pembrooke (ami)', en: 'Accuse Julian Pembrooke (friend)' }, id: 'seducteur', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Rupert Blackwood (notaire)', en: 'Accuse Rupert Blackwood (notary)' }, id: 'suspect', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Silas Crane (le clochard)', en: 'Accuse Silas Crane (the homeless man)' }, id: 'marginal', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Victor Krane (homme de main)', en: 'Accuse Victor Krane (hired hand)' }, id: 'criminel', choiceKey: 'accuser' }
            ], choiceKey: 'finalChoice', text: { fr: "Au quartier général, le moment est venu. Votre partenaire étale les six dossiers sur la table, à côté des documents du coffre. Qui accusez-vous ?\n\n- Le Major Hale, garde du corps et majordome en chef.\n- Lady Vivienne, l'épouse.\n- Julian Pembrooke, l'ami d'enfance.\n- Rupert Blackwood, le notaire.\n- Silas Crane, le clochard de la ruelle.\n- Victor Krane, l'homme de main.", en: "At headquarters, the time has come. Your partner spreads the six files on the table, beside the safe's documents. Who do you accuse?\n\n- Major Hale, bodyguard and chief butler.\n- Lady Vivienne, the wife.\n- Julian Pembrooke, the childhood friend.\n- Rupert Blackwood, the notary.\n- Silas Crane, the homeless man from the alley.\n- Victor Krane, the hired hand." } }
        ]
    });





    /* ===== OUTRO - ÉPILOGUE ===== */
    PHASES.push({
        id: 'outro',
        label: { fr: 'Épilogue', en: 'Epilogue' },
        act: 'Outro',
        type: 'outro',
        music: 'theme',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "L'affaire est classée. Le vrai coupable croupit en prison, le mobile était l'argent, la méthode, la trahison.", en: "Case closed. The real culprit is in prison, the motive was money, the method, betrayal." } },
            { decor: 'universe', text: { fr: "La ville murmure à nouveau sous la pluie. Une autre affaire vous attend, mais celle-ci est résolue.", en: "The city whispers again under the rain. Another case awaits you, but this one is solved." } },
            { decor: 'universe', text: { fr: "FIN - True Detective.", en: "END - True Detective." } }
        ]
    });

    global.TDPhases = PHASES;

})(typeof globalThis !== 'undefined' ? globalThis : this);















