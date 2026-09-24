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
            { decor: 'universeSherlock', text: { fr: "La ville ne s'endort jamais. Elle halète sous la pluie, comme une bête trop vieille pour mourir. Les réverbères crachent leurs halos jaunes sur les pavés gras, les fiacres glissent sans un bruit, et dans les ruelles, les ombres sont plus longues que les visages. Une cité qui ne pardonne pas l'erreur, qui ne reconnaît que le sang et le silence. Ce soir, elle vous attend.", en: "The city never sleeps. It pants under the rain, like a beast too old to die. Streetlamps spit their yellow halos onto greasy cobblestones, cabs glide without a sound, and in the alleys, shadows are longer than faces. A city that does not forgive mistakes, that recognizes only blood and silence. Tonight, it waits for you." } },
            { decor: 'universe', text: { fr: "La ville murmure, mais elle ment. Dans un appartement cossu, au-dessus des toits, un magnat de l'immobilier a été retrouvé sans vie. Une montre de poche sur la table, les mains dans les poches, on vous a confié l'enquête : la plus délicate, la plus sale, de votre carrière. Ce ne sera pas une partie de whist.", en: "The city whispers, but it lies. In a lavish flat, above the rooftops, a real-estate magnate was found dead. A pocket watch on the table, hands in pockets, you have been assigned the case: the most delicate, the dirtiest, of your career. This won't be a game of whist." } },
            { decor: 'crimeScene', text: { fr: "Vous poussez la porte. L'air est lourd, sucré, métallique. Le sang a séché sur le parquet en longs filaments bruns. Le coffre-fort est béant, vidé de ses secrets. Sur une table, une **montre de poche brisée**, son aiguille figée dans un ultime sursaut. Personne ne sait quand le magnat est mort : aucune heure n'est établie. C'est à vous de la trouver. Elle seule peut dire qui ment.", en: "You push the door. The air is heavy, sweet, metallic. Blood has dried on the floor in long brown filaments. The safe gapes open, emptied of its secrets. On a table, a **broken pocket watch**, its hand frozen in a final jerk. No one knows when the magnat died: no time of death is established. Finding it is your job. It alone can say who lies." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Votre partenaire vous rejoint, l'air grave, le col de son imperméable relevé contre l'humidité : « La victime, Aldric Thorne, n'avait qu'un seul domestique : son garde du corps, le Major Hale. C'est lui qui a découvert le corps. »\n\nWexford s'accroupit près du bureau, examine les taches par terre.\n\n« L'affaire commence ici. Et elle ne sent pas bon. »", en: "Your partner joins you, looking grave, his coat collar turned up against the damp: \"The victim, Aldric Thorne, had one servant: his bodyguard, Major Hale. He found the body.\"\n\nWexford crouches by the desk, examines the stains on the floor.\n\n\"The case begins here. And it doesn't smell good.\"" } }
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
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Le manoir est plongé dans une pénombre épaisse, comme si la maison elle-même retenait son souffle. Les rideaux tirés ne laissent passer que des rais de lumière blafarde. Wexford allume une torche et balaie la pièce du regard, les ombres dansant derrière lui.\n\n« Chaque détail compte. Même celui qui ne dit rien. Je reste là si vous avez besoin. »", en: "The manor is plunged in thick half-light, as if the house itself were holding its breath. The drawn curtains let through only wan rays of light. Wexford switches on a torch and sweeps the room, shadows dancing behind him.\n\n\"Every detail counts. Even the one that says nothing. I'll be here if you need me.\"" } },
            { decor: 'crimeScene',
              text: { fr: "Votre partenaire vous tend la loupe avec un geste las. « Fouillez chaque recoin. Les pièces à conviction vous diront tout - à condition de savoir les lire. »", en: "Your partner hands you the magnifying glass with a weary gesture. 'Search every corner. The evidence pieces will tell you everything - provided you know how to read them.'" },
            minigame: { type: 'scene_fouille', wide: true, evidence: 'forensic',
            title: { fr: "Fouille de la scène", en: "Scene search" },
            desc: { fr: "Explorez la scène à la loupe. Chaque pièce à conviction ouvre une fenêtre détaillée : examinez-les toutes pour reconstituer les circonstances du crime.", en: "Explore the scene with the magnifier. Each piece of evidence opens a detailed window: examine them all to reconstruct how the crime unfolded." },
            clue: { fr: 'Un proche de confiance, deux verres, des dettes effacees, une ecriture elegante et un recu signe V.K. Le meurtre etait prevu - le vol, simule.', en: 'A trusted close one, two glasses, erased debts, elegant handwriting and a receipt signed "V.K.". The murder was planned - the robbery, staged.' },
            time: 60,
            sceneImage: null,
            hotspots: [
                    { label: '1', info: { fr: 'Un cachet de cire intact. Personne n a force le bureau : l assassin connaissait la maison ou y avait acces.', en: 'An intact wax seal. No one forced the desk : the killer knew the house or had access to it.' } },
                    { label: '2', info: { fr: 'La carafe renversee. DEUX verres ont ete utilises : la victime attendait quelqu un en qui elle avait confiance.', en: 'The overturned decanter. TWO glasses were used : the victim was expecting someone they trusted.' } },
                    { label: '3', info: { fr: 'Un livre de comptes tache de sang. Plusieurs pages d impayes arrachees : celles qui mentionnaient les dettes de Hale.', en: 'A blood-stained ledger. Several debt pages torn out : the ones mentioning Hale\'s debts.' } },
                    { label: 'A', info: { fr: 'Sous l encrier renverse, une lettre a moitie brulee : des menaces redigees d une ecriture elegante.', en: 'Under the overturned inkwell, a half-burned letter : threats in an elegant hand.' } },
                    { label: 'C', info: { fr: 'L autre encrier est intact et la plume seche : on a ecrit ici AVANT le meurtre, pas apres.', en: 'The other inkwell is untouched and the pen dry : writing happened here BEFORE the murder.' } },
                    { label: '4', info: { fr: 'Un fauteuil renverse pres de la fenetre : la lutte a ete breve, loin du bureau.', en: 'An overturned chair by the window : the struggle was brief, away from the desk.' } },
                    { label: '5', info: { fr: 'La mare de sang, la victime face a son effigie, aucune trace de defense : elle connaissait son agresseur.', en: 'The pool of blood, the victim facing his portrait, no trace of defense : he knew his attacker.' } },
                    { label: '6', info: { fr: 'Pres de la main : un recu froisse signe V.K. - une forte somme en especes.', en: 'Near the hand : a crumpled receipt signed "V.K." - a large sum in cash.' } }
                ] } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Le carnet déchiré révèle des pages manquantes, comme si on avait cherché à effacer une partie de l'histoire. En les reconstituant, vous découvrez des versements réguliers à un certain « V.K. » - des sommes qui ne figurent dans aucune comptabilité officielle.", en: "The torn ledger reveals missing pages, as if someone had tried to erase part of the story. By reassembling them, you discover regular payments to a certain \"V.K.\" - sums that appear in no official accounting." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Votre partenaire vous observe, les mains dans les poches : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »", en: "Your partner watches you, hands in pockets: \"Are you onto something? These clues are forming a motive. Let's continue.\"" } }
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
            { decor: 'residence', npc: 'detective-partner', text: { fr: "La montre du Duc gît sur la table du salon, brisée. « Elle a dû valser dans la bagarre, soupire Wexford en se penchant. Voyez ce qu'elle peut encore nous apprendre. »", en: "The Duke's watch lies on the lounge table, broken. \"It must have flown off in the struggle,\" Wexford sighs, leaning in. \"See what it can still tell us.\"" } },
            { decor: 'residence', text: { fr: "La montre du Duc gît sur la table, brisée. L'aiguille figée indique l'heure. Existe-t-il un code caché dans cette montre ?", en: "The Duke's watch lies on the table, broken. The frozen hand shows the time. Is there a hidden code in this watch?" }, minigame: { type: 'montre_code', time: 45, code: [1, 9, 8, 1], title: { fr: "La Montre du Duc", en: "The Duke's Watch" }, desc: { fr: "Examinez la montre pour trouver l'heure du crime et un code secret.", en: "Examine the watch to find the time of death and a secret code." }, clue: { fr: 'INDICE MINEUR : 1981 (coffre). INDICE MAJEUR : l\'aiguille figée à 22h09 - l\'heure du crime. Retenez-la.', en: 'MINOR : 1981 (safe). MAJOR : the hand frozen at 10:09pm - the time of death. Remember it.' }, sceneImage: null }},
            { decor: 'residence', npc: 'detective-partner', text: { fr: "Après examen : « Bien. La montre nous donne l'heure du crime : 22h09. Maintenant, interrogeons les suspects. Qui interroger en premier ? Blackwood, le notaire ? Ou ce témoin dans la ruelle ? Pembrooke, l'ami, est sans doute au bar. »", en: "After examination: \"Good. The watch gives us the time of death: 10:09pm. Now let's interrogate the suspects. Who should we question first? Blackwood, the notary? Or the witness in the alley? Pembrooke, the friend, is probably at the bar.\"" } },
            { decor: 'residence', npc: 'protecteur', interrogation: 'protecteur', text: { fr: "Le Major Hale vous accueille dans le salon du manoir. Son uniforme est impeccable, mais une goutte de sueur perle à sa tempe. Il se tient droit, les mains croisées derrière le dos, comme s'il s'exerçait à ne pas trembler.\n\n« Je vous ai attendu, inspecteur. La maison est en deuil, faites vite. »\n\nVous sentez un mélange d'arrogance et de contrôle. Hale se maîtrise, mais ses yeux vous fuient. Choisissez votre angle d'attaque.", en: "Major Hale greets you in the manor lounge. His uniform is impeccable, but a drop of sweat beads at his temple. He stands straight, hands clasped behind his back, as if practicing not to tremble.\n\n\"I've been expecting you, inspector. The house is in mourning, make it quick.\"\n\nYou sense a mix of arrogance and control. Hale keeps his composure, but his eyes avoid yours. Pick your angle of attack." } },
            { decor: 'residence', npc: 'femme-fatale', interrogation: 'femme-fatale', text: { fr: "Lady Vivienne vous reçoit dans le boudoir aux rideaux de velours rouge. Elle ne se lève pas. Une tasse de thé fume entre ses doigts gantés, mais elle n'y porte pas les lèvres.\n\n« Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. Quelqu'un qui connaissait ses habitudes. »\n\nElle vous défie du regard, les yeux deux charbons dans la pénombre. Lady Vivienne attend votre première question.", en: "Lady Vivienne receives you in the boudoir with blood-red velvet curtains. She does not rise. A teacup smokes between her gloved fingers, but she does not raise it to her lips.\n\n\"My husband had enemies, certainly. But the perpetrator… it's someone from the house. Someone who knew his habits.\"\n\nShe challenges you with her gaze, eyes like coals in the half-light. Lady Vivienne waits for your first question." } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire fait le point, le doigt tapotant le bord du tableau : « On a deux versions qui ne tiennent pas ensemble. Hale dit être en panne avec Pembrooke, mais Vivienne assure être seule au manoir. L'un d'eux ment. À vous de voir qui. »", en: "Your partner takes stock, finger tapping the edge of the board: \"We have two versions that don't hold together. Hale says he was broken down with Pembrooke, but Vivienne claims she was alone at the manor. One of them is lying. It's up to you to see who.\"" } },
            { decor: 'headquarters', text: { fr: "Le réseau d'alibis se présente en duels : deux dépositions, un seul menteur. Démasquez-le.", en: "The alibi network comes in duels: two testimonies, only one liar. Unmask him." }, minigame: { type: 'reseau_alibis', difficulty: 'easy', time: 60, evidence: 'witness', alibiPool: 'act1_1', title: { fr: "Le Réseau d'alibis — Duel", en: "The Alibi Network — Duel" }, desc: { fr: "À chaque manche : deux cartes, un menteur. Cliquez sur la carte du MENTEUR.", en: "Each round: two cards, one liar. Click the LIAR's card." }, clue: { fr: "Le réseau s'ouvre : la panne de Hale et le verrou ouvert à la clé sont les premières failles.", en: "The network opens up: Hale's breakdown and the key-opened lock are the first cracks." } }},
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire synthétise : « Les contradictions se confirment. Un ou plusieurs témoignages mentent. Continuez l'enquête. » ", en: "Your partner summarizes: \"The contradictions are confirmed. One or more testimonies are lying. Keep investigating.\" " } }
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
             { decor: 'residence', npc: 'detective-partner', text: { fr: "Avant de partir, vous revoyez vos notes avec Wexford dans le vestibule du manoir. L'odeur de cire et de bougie flotte encore.\n\n« Le clochard de la ruelle a vu quelque chose cette nuit-la. Mais passons d'abord chez Blackwood, le notaire - il gétait les affaires du Duc. Et le clochard, on l'interceptera au retour. »", en: "Before leaving, you review your notes with Wexford in the manor vestibule. The scent of wax and candle still hangs.\n\n\"The homeless man in the alley saw something that night. But let's stop by Blackwood's, the notary - he handled the Duke's affairs. We'll catch the homeless man on the way back.\"" } },
             { decor: 'residence', npc: 'detective-partner', text: { fr: "La chronologie s'assemble dans votre esprit comme les pièces d'un puzzle maudit : Hale prétendait être en panne avec Pembrooke à 22h, mais les indices placent le manoir sur les lieux à 22h09. L'alibi du Major est fissuré. Une fissure suffit pour faire entrer la vérité.", en: "The timeline assembles in your mind like pieces of a cursed puzzle: Hale claimed to be broken down with Pembrooke at 10pm, but clues place the manor on scene at 10:09pm. Hale's alibi is cracked. A crack is all it takes for the truth to enter." } },
             { decor: 'secretPlace', npc: 'suspect', interrogation: 'suspect', text: { fr: "Chez Rupert Blackwood, dans son appartement cossu. Il vous ouvre, l'air nerveux, les yeux fuyants. Blackwood vous défie avec une grille.\n\n« Entrez, inspecteur. Je ne sais pas ce que trafique le Duc ces derniers temps, mais les tensions sur le testament se multiplient. J'ai peur que tout cela finisse mal. »\n\nDerrière son bureau de notaire, il paraît fatigué, mais pas par le chagrin. Il vous fait signe de vous asseoir.", en: "At Rupert Blackwood's place, in his lavish apartment. He opens the door, looking uneasy, eyes darting.\n\n\"Come in, inspector. I don't know what the Duke has been up to lately, but the tensions around the will keep growing. I'm afraid this will end badly.\"\n\nBehind his notary desk, he looks tired, but not from grief. He gestures for you to sit." } },
              { decor: 'alley', npc: 'marginal', interrogation: 'marginal', text: { fr: "Sur le chemin du retour, à la sortie du manoir, dans la ruelle adjacente, Silas Crane grelotte dans un coin. Vous l'abordez doucement. Silas vous propose de construire une tour.\n\n« T'as une pièce, inspecteur ? »\n\nVous lui glissez une monnaie. Il se détend, prêt à parler.", en: "On the way back, at the manor exit, in the adjacent alley, Silas Crane is shivering in a corner. You approach him gently.\n\n\"Got a coin, inspector?\"\n\nYou slip him some change. He relaxes, ready to talk." } },
              { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire fait le point, le doigt tapotant le bord du tableau : « Ces quatre dépositions se répondent et se contredisent. Préparez-vous à analyser le réseau d'alibis. »", en: "Your partner takes stock, finger tapping the edge of the board: \"These four depositions answer and contradict each other. Get ready to analyze the alibi network.\"" } },
             { decor: 'headquarters', text: { fr: "Deux duels à trancher. Le réseau s'épaissit, les mensonges se multiplient.", en: "Two duels to settle. The network thickens, the lies multiply." }, minigame: { type: 'reseau_alibis', difficulty: 'medium', time: 90, evidence: 'witness', alibiPool: 'act1_2', title: { fr: "Le Réseau d'alibis — Duels croisés", en: "The Alibi Network — Crossed Duels" }, desc: { fr: "Deux manches, deux duels tirés au sort. Une carte ment à chaque fois — démasquez-la.", en: "Two rounds, two randomly drawn duels. One card lies each time — unmask it." }, clue: { fr: "Silas dit vrai sur le rôdeur, Blackwood a bien quitté le manoir à 20h — et l'alibi de Hale recouvre exactement 22h09.", en: "Silas tells the truth about the prowler, Blackwood did leave the manor at 8pm — and Hale's alibi covers exactly 10:09pm." } }},
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
            { decor: 'barInterieur', npc: 'seducteur', interrogation: 'seducteur', text: { fr: "A l'intérieur du bar, la fumée stagne sous les néons. Vous vous installez au comptoir, à côté de Julian Pembrooke.\n\n- Monsieur Pembrooke. On vous a vu avec le Duc la veille de sa mort. Le verrou du manoir a été ouvert avec une clé, pas forcé. Comment l'expliquez-vous ?\n\nPembrooke fait tourner son verre sans y porter les lèvres. Il vous regarde par-dessus, un sourire en coin.\n\n- Le Duc m'avait engagé pour... pour autre chose. Je devais le rendre aveugle, pas le tuer. Mais l'arme a mal tourné. Et ce n'était pas la première fois que j'attendais près du pavillon ce soir-là.", en: "Inside the bar, smoke lingers under the neon lights. You sit at the counter, next to Julian Pembrooke.\n\n- Mr. Pembrooke. You were seen with the Duke the day before his death. The manor lock was opened with a key, not forced. How do you explain that ?\n\nPembrooke spins his glass without raising it to his lips. He glances at you from under his brow, a wry smile.\n\n- The Duke had hired me for... for something else. I was supposed to blind him, not kill him. But the weapon misfired. And it wasn't the first time I was waiting near the pavilion that night." } },
            { decor: 'publicPlace', npc: 'criminel', interrogation: 'criminel', text: { fr: "Dehors, sous la lumière crue des réverbères, Victor Krane se tient devant l'entrée du bar, le curedent entre les dents. L'air frais de la nuit lui redonne un peu de nervosité. Krane vous propose de retourner des cartes.\n\n- Monsieur Krane. Le Duc vous doit de l'argent, et vous étiez dans le quartier cette nuit-là. Le verrou du manoir a été ouvert avec une clé. Dites-moi tout.\n\nKrane ricane, mais son regard fuit brièvement.\n\n- Le Duc m'a payé pour un élimination. Pas de vol, pas de viol. Juste une disparition. Mais quelqu'un a tiré avant moi.", en: "Outside, under the harsh light of the streetlamps, Victor Krane stands by the bar entrance, a toothpick between his teeth. The cool night air makes him a little nervous.\n\n- Mr. Krane. The Duke owed you money, and you were in the neighborhood that night. The manor lock was opened with a key. Tell me everything.\n\nKrane snorts, but his gaze darts away briefly.\n\n- The Duke paid me for an elimination. Not a robbery, not a assault. Just a disappearance. But someone fired before I did." } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "De retour au QG, votre partenaire aligne les six dépositions sur le tableau. « Ces témoignages se répondent, parfois mal. Préparez-vous à analyser le réseau complet. »", en: "Back at HQ, your partner lines up the six testimonies on the board. \"These testimonies answer each other, sometimes poorly. Get ready to analyze the full network.\"" } },
            { decor: 'headquarters', text: { fr: "Trois duels de dépositions. Les mensonges s'enchevêtrent. Trouvez le menteur à chaque manche.", en: "Three testimony duels. The lies intertwine. Find the liar each round." }, minigame: { type: 'reseau_alibis', difficulty: 'hard', time: 90, evidence: 'witness', alibiPool: 'act2_1', title: { fr: "Le Réseau d'alibis — Duels du bar", en: "The Alibi Network — Bar Duels" }, desc: { fr: "Trois duels tirés au sort parmi les dépositions du bar. À chaque manche, trouvez le menteur.", en: "Three randomly drawn duels from the bar testimonies. Find the liar each round." }, clue: { fr: "Les duels du bar scellent les contradictions : Pembrooke nie le rôdeur, Krane nie sa présence, mais les reçus V.K. disent le contraire.", en: "The bar duels seal the contradictions: Pembrooke denies the prowler, Krane denies his presence, but the V.K. receipts say otherwise." } }},
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire synthétise : « Le réseau révèle des failles majeures. Deux alibis de panne se recouvrent, une liaison est cachée, et Krane a été engagé par le Duc pour éliminer Pembrooke, mais l'arme a tué le maître. » ", en: "Your partner summarizes: \"The network reveals major flaws. Two breakdown alibis overlap, an affair is hidden, and Krane was hired by the Duke to eliminate Pembrooke, but the weapon killed the master.\" " } }
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
                        { decor: 'laboratory', npc: 'scientifique', text: { fr: "Au laboratoire, la lumière est stérile et froide. Les grilles d'analyse lumineuses scintillent au-dessus des paillasses. Le docteur Whitmore relève la tête de ses lunettes, le visage grave.\n\n« Inspecteur, les analyses sont sans appel. L'ADN relevé sur l'arme du crime et sur le battant de la porte... ne désigne pas un coupable. Il les désigne tous. Des traces infimes de chaque suspect ont été retrouvées sur les lieux. »\n\nIl pose un dossier épais sur la table.\n\n« La scène a été touchée, manipulée, fréquentée par chacun d'eux. Il va falloir les confronter directement chez eux, dans leurs décors, pour voir comment ils réagissent. Mais avant, ces échantillons d'ADN nécessitent une analyse plus fine dans mes éprouvettes. Prouvez-moi que vous savez isoler chaque composant. »", en: "At the laboratory, the light is sterile and cold. The luminous analysis grids flicker above the benches. Dr. Whitmore looks up from his glasses, his face grave.\n\n\"Inspector, the analyses are conclusive. The DNA found on the murder weapon and on the door frame... does not point to one killer. It points to all of them. Minute traces of each suspect were found at the scene.\"\n\nHe places a thick file on the table.\n\n\"The scene has been touched, manipulated, frequented by every one of them. You will need to confront them directly, in their own surroundings, to see how they react. But first, these DNA samples require a finer analysis in my test tubes. Prove to me you can isolate each component.\"" } },
            { decor: 'laboratory', npc: 'scientifique', minigame: { type: 'chemistry', time: 45, title: { fr: '🧪 Analyse Toxico - Laboratoire', en: '🧪 Tox Analysis - Lab' }, desc: { fr: 'Transvasez les réactifs pour regrouper chaque fluide pur dans son éprouvette.', en: 'Pour reagents to group each pure fluid in its tube.' }, clue: { fr: 'L\'analyse toxico révèle un poison rare et coûteux, acheté à crédit par un officier criblé de dettes : la trace du fournisseur remonte à l\'entourage du Major Hale.', en: 'The tox analysis reveals a rare, expensive poison bought on credit by an officer drowning in debt: the supplier\'s trail leads back to Major Hale\'s circle.' }, evidence: 'forensic' }, text: { fr: "« Prouvez-moi que vous savez isoler chaque composant. » Whitmore vous tend la fiche d'analyse. Les éprouvettes contiennent des réactifs mélangés : il faut transvaser chaque fluide pur dans son éprouvette pour libérer l'ADN toxique.", en: "\"Prove to me you can isolate each component.\" Whitmore hands you the analysis sheet. The test tubes contain mixed reagents: you must pour each pure fluid into its tube to release the toxic DNA." } },
            { decor: 'laboratory', npc: 'detective-partner', text: { fr: "Wexford range les dossiers. « L'ADN confirme que tous ont été présents. Mais tous mentionnent le coffre, et personne ne sait pourquoi leur ADN est sur l'arme. Il est temps de les confronter tous ensemble. »", en: "After analyzing the test tubes, Wexford puts away the files. \"The DNA confirms all were present, but everyone mentions the safe, and no one can explain why their DNA is on the weapon. It's time to confront them all together.\"" } }
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
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Whitmore tend le dossier ADN. « Toutes ces traces... personne n'est innocent. Mais la scène a été fréquentée par chacun pour des raisons légitimes. Vous décidez de les confronter un par un, dans leurs lieux. »", en: "Whitmore hands you the DNA file. \"All these traces... no one is innocent. But the scene was frequented by each for legitimate reasons. You decide to confront them one by one, in their own spaces.\"" } },
            { decor: 'residence', npc: 'protecteur', interrogation: 'protecteur', text: { fr: "Au manoir, le Major Hale ajuste ses gants blancs. Vous montrez l'ADN.\n\n« Monsieur le Major. Votre ADN est sur l'arme du crime. Vous étiez garde du corps ? »\n\n« Bien sûr. J'accompagnais le Duc à un examen ce soir-là. Il voulait vérifier la sécurité du manoir. J'ai manié l'arme pour vérifier qu'elle était en ordre. »\n\nIl hésite. « Et le coffre... le Duc gardait des papiers sensibles. Il m'avait dit de protéger l'accès. »", en: "At the manor, Major Hale adjusts his white gloves. You show him the DNA.\n\n\"Major Hale. Your DNA is on the murder weapon. You were the bodyguard?\"\n\n\"Of course. I was accompanying the Duke to an inspection that evening. He wanted to check the manor's security. I handled the weapon to verify it was in order.\"\n\nHe hesitates. \"And the safe... the Duke kept sensitive papers. He told me to protect access to it.\"" } },
            { decor: 'residence', npc: 'femme-fatale', interrogation: 'femme-fatale', text: { fr: "Dans le boudoir, Vivienne feuillette ses ongles.\n\n« Mon ADN ? Le Duc me devait de l'argent. J'étais venue rouvrir la fenêtre, il faisait froid dans le bureau. »\n\nElle sourit. « Ce coffre... le Duc était parano. Il m'a dit qu'il contenait des preuves contre Lady Vivienne. »", en: "In the boudoir, Vivienne examines her nails.\n\n\"My DNA? The Duke owed me money. I came to open the window, it was cold in the office.\"\n\nShe smiles. \"That safe... the Duke was paranoid. He told me it contained evidence against Lady Vivienne.\"" } },
            { decor: 'barInterieur', npc: 'seducteur', interrogation: 'seducteur', text: { fr: "Pembrooke essuie un verre, les mains moites.\n\n« Vous trouvez mon ADN sur la porte ? Le Duc me devait de la tune. J'étais venu pour un rendez-vous. »\n\nIl baisse les yeux. « Ce coffre... il m'a dit que Lady Vivienne y cachait des preuves de notre liaison. »", en: "Pembrooke wipes a glass, his hands clammy.\n\n\"You find my DNA on the door? The Duke owed me money. I came for a meeting.\"\n\nHe looks down. \"That safe... he told me Lady Vivienne hid proof of our affair in it.\"" } },
            { decor: 'alley', npc: 'marginal', interrogation: 'marginal2', text: { fr: "Silas grelotte dans un coin. Vous lui glissez une pièce.\n\n« Mon ADN ? J'ai reçu l'aumône comme prévu. Le Duc m'a offert un repas chaud, comme toujours. »\n\nIl sourit. « Le coffre... le Duc me disait qu'il y avait quelque chose de compromettant à l'intérieur. »", en: "Silas shivers in a corner. You slip him a coin.\n\n\"My DNA? I received alms as usual. The Duke offered me a warm meal, like always.\"\n\nHe smiles. \"The safe... the Duke told me there was something compromising inside.\"" } },
            { decor: 'secretPlace', npc: 'suspect', interrogation: 'suspect', text: { fr: "Blackwood transpire en ouvrant son dossier.\n\n« Mon ADN ? J'avais rendez-vous avec le Duc ce soir-là pour un acte de fiducie. »\n\nIl se tait. « Le coffre... le Duc m'a dit qu'il contenait des documents que Vivienne attendait. »\n\nSilas, dans la ruelle, a croisé Krane en sortant du bureau du Duc.", en: "Blackwood sweats as he opens his file.\n\n\"My DNA? I had an appointment with the Duke that evening for a trust deed.\"\n\nHe falls silent. \"The safe... the Duke told me it contained documents that Vivienne was waiting for.\"\n\nSilas, in the alley, met Krane leaving the Duke's office." } },
            { decor: 'publicPlace', npc: 'criminel', interrogation: 'criminel', text: { fr: "Krane ricane, le curedent entre les dents.\n\n« Mon ADN sur l'arme ? Le Duc m'avait engagé pour une élimination. »\n\nIl détourne le regard. « Ce soir-là, j'avais un rendez-vous avec le Duc dans son bureau. Mais quelqu'un était déjà entré. »\n\nKrane se rapproche. « Le coffre... le Duc me disait qu'il y avait quelque chose de compromettant à l'intérieur. »", en: "Krane snorts, a toothpick between his teeth.\n\n\"My DNA on the weapon? The Duke hired me for an elimination.\"\n\nHe looks away. \"That evening, I had an appointment with the Duke in his office. But someone was already inside.\"\n\nKrane leans closer. \"The safe... the Duke told me there was something compromising inside.\"" } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Wexford écoute, puis étale les dépositions. « Chacun a une raison pour être là... mais tous mentionnent le coffre. Et personne ne peut expliquer pourquoi leur ADN est sur l'arme. »", en: "Wexford listens, then lays out the depositions. \"Everyone has a reason to be there... but everyone mentions the safe. And no one can explain why their DNA is on the weapon.\"" } },
            { decor: 'headquarters', text: { fr: "Trois duels finaux : ADN, coffre et clés du Major. Le réseau complet révèle la vérité.", en: "Three final duels: DNA, safe and the Major's keys. The complete network reveals the truth." }, minigame: { type: 'reseau_alibis', difficulty: 'hard', time: 90, evidence: 'witness', alibiPool: 'act2_3', title: { fr: "Le Réseau d'alibis — Duels finaux", en: "The Alibi Network — Final Duels" }, desc: { fr: "Trois duels finaux. À chaque manche, une carte ment — démasquez-la.", en: "Three final duels. Each round, one card lies — unmask it." }, clue: { fr: "Le réseau final : Krane avoue l'engagement du Duc, l'ADN accable Pembrooke, et les clés du Major ouvrent tout.", en: "The final network: Krane admits the Duke's contract, the DNA damns Pembrooke, and the Major's keys open everything." } }},
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Votre partenaire conclut : « Le réseau s'est refermé. Tous mentionnent le coffre, mais personne ne sait pourquoi leur ADN est sur l'arme. La vérité se cache derrière une cachette... »", en: "Your partner concludes: \"The network has closed. Everyone mentions the safe, but no one knows why their DNA is on the weapon. The truth lies behind a hiding place...\"" } }
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
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "De retour dans la voiture banalisée, les essuie-glaces battent un rythme lancinant. Votre partenaire frappe le volant du plat de la main.\n\n« Bon sang, mais c'est bien sûr ! Tous les suspects ont mentionné, d'une manière ou d'une autre, ce fichu coffre-fort. Et cette montre que nous avons examinée au manoir : l'aiguille figée à 22h09 nous a donné l'heure du crime, mais le code 1981 gravé au dos... c'est la combinaison du coffre ! La montre nous donnait la clé depuis le début. Foncez à la scène de crime, c'est là-bas que tout se joue. »", en: "Back in the unmarked car, the wipers beat a steady rhythm. Your partner strikes the wheel with his palm.\n\n\"Damn it, of course! Every suspect mentioned that damned safe, one way or another. And that watch we examined at the manor: the hand frozen at 22h09 gave us the time of death, but the code 1981 engraved on the back... it's the combination to the safe! The watch held the key from the beginning. Get to the crime scene, that's where everything happens.\"" } }
        ]
    });

    /* ===== ACTE 3, Phase 1 : LE COFFRE VIDÉ + MUR DE RECONSTRUCTION ===== */
    PHASES.push({
        id: 'act3_1',
        label: { fr: 'Le Coffre vide', en: 'The Empty Safe' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'tension',
        pages: [
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Pénombre lugubre au manoir. Le ruban de police flotte au vent. Vous et votre partenaire vous tenez face au panneau de boiserie dissimulant le coffre-fort.\n\n« Allez, inspecteur. La combinaison de la montre... et ouvrez-moi ce coffre. »", en: "A gloomy half-light at the manor. Police tape floats in the wind. You and your partner stand before the wood panel concealing the safe.\n\n\"Go on, inspector. The watch's combination... and open me that safe.\"" } },
            { decor: 'crimeScene', minigame: { type: 'puzzle', title: { fr: 'Anomalie Murale', en: 'Wall Anomaly' }, evidence: 'forensic', clue: { fr: 'Le puzzle révèle une anomalie derrière la boiserie : un mur latéral bascule vers un compartiment caché, distinct du coffre.', en: 'The puzzle reveals a wall anomaly behind the paneling: a side wall swings open to reveal a hidden compartment, separate from the safe.' }, failClue: { fr: 'Le mur semble solide, mais quelque chose cloche. Continuez à chercher.', en: 'The wall seems solid, but something is off. Keep searching.' } }, text: { fr: "Le panneau de boiserie semble ordinaire, mais en le touchant, vous sentez une infime irregularité. « Regardez ce mur, inspecteur. » murmure Wexford. « Quelque chose cloche. »\n\nAssemblez les indices de l'anomalie muralement pour découvrir ce qui se cache derrière la boiserie.", en: "The wood panel seems ordinary, but touching it reveals a slight irregularity. \"Something's off about this wall, inspector,\" mutters Wexford.\n\nAssemble the wall anomaly clues to discover what's hidden behind the paneling." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Les pièces du puzzle s'emboîtent, formant une carte du mur derrière la boiserie. Au-delà du coffre, un second mécanisme se dessine : un mur latéral qui pourrait bien basculer.\n\n« Il y a plus que le coffre ici, inspecteur. »", en: "The puzzle pieces fit together, forming a map of the wall behind the paneling. Beyond the safe, a second mechanism emerges: a side wall that could swing open.\n\n\"There's more than just the safe here, inspector.\"" } },
            { decor: 'crimeScene', minigame: { type: 'coffre_code', title: { fr: 'Le Coffre-fort', en: 'The Safe' }, evidence: 'mobile', clue: { fr: 'Le carnet du coffre (code 1981) : le Duc avait engage Victor Krane pour une elimination. Dernier paiement la veille du meurtre.', en: 'The safe ledger (code 1981): the Duke had hired Victor Krane for an elimination. Last payment the day before the murder.' }, failClue: { fr: 'La combinaison semble incorrecte. Revoyez le code de votre montre.', en: 'The combination seems incorrect. Review your watch code.' } }, text: { fr: "Le coffre-fort est exposé derrière la boiserie. Les charnières grincent dans le silence. La combinaison du coffre, gravée dans votre mémoire... le même code que votre montre de précision : **1-9-8-1**.\n\nRéglez les chiffres et actionnez la poignée pour ouvrir le coffre.", en: "The safe is exposed behind the paneling. The hinges squeak in the silence. The chest's combination, etched in your memory... the same code as your precision watch: **1-9-8-1**.\n\nSet the digits and turn the handle to open the safe." } },
            { decor: 'crimeScene', text: { fr: "La combinaison grince doucement. Le coffre s'ouvre. À l'intérieur... **rien**. Plus aucun document. Plus aucun billet. Le coffre a été **VIDÉ**.\n\nWexford fronçant le sourcil : « C'est... impossible. Personne n'a dû pouvoir y entrer sans laisser de traces. »", en: "The combination grinds softly. The safe opens. Inside... **nothing**. No documents. No bills. The safe was **EMPTIED**.\n\nWexford frowns: \"It's... impossible. No one should have been able to enter without leaving traces.\"" } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Mais le puzzle a révélé un second mécanisme. Wexford pousse le panneau indiqué par vos indices. Le mur **bascule** avec un grincement, révélant un **compartiment caché**.\n\nÀ l'intérieur : des contrats falsifiés, des registres de versements, et une **lettre signée Wexford**, datée de la semaine précédente.", en: "But the puzzle revealed a second mechanism. Wexford pushes the panel indicated by your clues. The wall **swings** with a groan, revealing a **hidden compartment**.\n\nInside: forged contracts, payment ledgers, and a **letter signed Wexford**, dated the previous week." } },
            { decor: 'crimeScene', npc: 'detective-partner', text: { fr: "Wexford pâlit : « Ces papiers... ils datent de la semaine dernière. » Mais vous savez que la pluie de la veille a lavé les empreintes du hall. Personne n'a pu franchir le seuil sans être vu.\n\n« Le coffre a été vidé avant notre arrivée. Quelqu'un connaissait la combinaison... **et vous aussi, Wexford.** »", en: "Wexford pales: \"Those papers... they date from last week.\" But you know the rain from the night before washed the prints from the hall. No one could have crossed the threshold unseen.\n\n\"The safe was emptied before our arrival. Someone knew the combination... **and you too, Wexford.**\"" } }
        ]
    });

    /* ===== ACTE 3, Phase 2 : 6 BRANCHES - BATAILLE NAVALE CONTRE CHAQUE SUSPECT ===== */
    PHASES.push({
        id: 'act3_2',
        label: { fr: 'Branches', en: 'Branches' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'tension',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Au QG, votre partenaire étale les six dossiers sur la table, à côté des documents du coffre vide.\n\n« Chacun de nos suspects a une raison de vouloir le coffre. Mais le vrai secret, c'est celui qui l'a vidé. Convoquons-les un par un au parloir, et laissons la bataille navale trancher. »", en: "At headquarters, your partner spreads the six files on the table beside the empty safe's documents.\n\n\"Each of our suspects had reason to want the safe. But the real secret is who emptied it. Let's summon them one by one to the interrogation room, and let battleship settle it.\"" } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Qui voulez-vous interroger en premier ? Le choix déclenche une branche unique.", en: "Who do you want to interrogate first? The choice triggers a unique branch." }, choices: [
                { label: { fr: 'Interroger le Major Hale', en: 'Interrogate Major Hale' }, id: 'protecteur', choiceKey: 'choisirSuspect' },
                { label: { fr: 'Interroger Lady Vivienne', en: 'Interrogate Lady Vivienne' }, id: 'femme-fatale', choiceKey: 'choisirSuspect' },
                { label: { fr: 'Interroger Julian Pembrooke', en: 'Interrogate Julian Pembrooke' }, id: 'seducteur', choiceKey: 'choisirSuspect' },
                { label: { fr: 'Interroger Rupert Blackwood', en: 'Interrogate Rupert Blackwood' }, id: 'suspect', choiceKey: 'choisirSuspect' },
                { label: { fr: 'Interroger Silas Crane', en: 'Interrogate Silas Crane' }, id: 'marginal', choiceKey: 'choisirSuspect' },
                { label: { fr: 'Interroger Victor Krane', en: 'Interrogate Victor Krane' }, id: 'criminel', choiceKey: 'choisirSuspect' }
            ], choiceKey: 'choisirSuspect', text: { fr: "Qui voulez-vous interroger en premier ?", en: "Who do you want to interrogate first?" } },
            { decor: 'dynamic', npc: 'dynamic', text: { fr: "Interrogatoire final. Le suspect est amené devant vous. L'heure de la vérité a sonné.", en: "Final interrogation. The suspect is brought before you. The time of truth has come." } },
            { decor: 'dynamic', npc: 'dynamic', text: { fr: "Le duel de bataille navale commence. Sur le damier, vos navires et ceux du suspect s'affrontent. Chaque coup de canon révèle un fragment de vérité.", en: "The battleship duel begins. On the grid, your ships face the suspect's. Each cannon shot reveals a fragment of truth." }, minigame: { type: 'bataille-navale', evidence: 'witness', title: { fr: 'Bataille Navale', en: 'Battleship' }, desc: { fr: "Duel tactique contre le suspect. Victoire = indice révélé. Défaite = indice caché.", en: "Tactical duel against the suspect. Victory = clue revealed. Defeat = clue hidden." }, clue: { fr: "Le suspect a perdu le contrôle : ses réactions trahissent une connaissance trouble de cette affaire.", en: "The suspect lost composure: their reactions betray troubling familiarity with this case." }, failClue: { fr: "Le suspect triomphe : il connaît trop bien les eaux de cette affaire.", en: "The suspect triumphs: they know these waters far too well." } } },
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Wexford note les réactions : « Chacun a une version. Mais le vrai indice, c'est ce que personne n'a dit. »", en: "Wexford notes the reactions: \"Each has a version. But the real clue is what no one said.\"" } }
        ]
    });

    /* ===== ACTE 3, Phase 3 : CONFRONTATION FINALE + TWIST ===== */
    PHASES.push({
        id: 'act3_3',
        label: { fr: 'Twist Final', en: 'Final Twist' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'stress',
        pages: [
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "Au QG, le moment est venu. Votre partenaire étale les six dossiers sur la table, à côté des documents du coffre vide.\n\nVous avez interrogé un ou plusieurs suspects. Chaque victoire au duel de bataille navale a révélé un fragment de vérité. Mais le véritable secret, c'est ce que l'ensemble révèle.\n\nQui accusez-vous ? Le partenaire qui vous a guidé depuis le début... ou un des suspects ?", en: "At headquarters, the time has come. Your partner spreads the six files on the table beside the empty safe's documents.\n\nYou have interrogated one or more suspects. Each victory at the battleship duel revealed a fragment of truth. But the real secret is what it all reveals.\n\nWho do you accuse? The partner who guided you from the start... or one of the suspects?" }, choices: [
                { label: { fr: 'Accuser le Major Hale (garde du corps)', en: 'Accuse Major Hale (bodyguard)' }, id: 'protecteur', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Lady Vivienne (épouse)', en: 'Accuse Lady Vivienne (wife)' }, id: 'femme-fatale', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Julian Pembrooke (ami)', en: 'Accuse Julian Pembrooke (friend)' }, id: 'seducteur', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Rupert Blackwood (notaire)', en: 'Accuse Rupert Blackwood (notary)' }, id: 'suspect', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Silas Crane (le clochard)', en: 'Accuse Silas Crane (the homeless man)' }, id: 'marginal', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Victor Krane (homme de main)', en: 'Accuse Victor Krane (the hired hand)' }, id: 'criminel', choiceKey: 'accuser' },
                { label: { fr: 'Accuser Wexford (le partenaire)', en: 'Accuse Wexford (the partner)' }, id: 'detective', choiceKey: 'accuser' }
            ], choiceKey: 'accuser', text: { fr: "Qui accusez-vous ?", en: "Who do you accuse?" } }
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
            { decor: 'headquarters', npc: 'detective-partner', text: { fr: "L'affaire est classée. Le vrai coupable croupit en prison. Le coffre-fort vide a révélé le plus grand secret : celui qui orchestre depuis l'ombre.", en: "Case closed. The true culprit is in prison. The emptied safe revealed the greatest secret: the one who orchestrated from the shadows." } },
            { decor: 'universe', text: { fr: "La ville murmure à nouveau sous la pluie. Une autre affaire vous attend, mais celle-ci est résolue.", en: "The city whispers again under the rain. Another case awaits you, but this one is solved." } },
            { decor: 'universe', text: { fr: "FIN - True Detective.", en: "END - True Detective." } }
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