/* =====================================================================
   TRUE DETECTIVE — PHASES & DIALOGUES (contenu narratif V3)
   ---------------------------------------------------------------------
   Structure : 9 phases de 3 pages chacune.
   types :
     - 'narration' : pas \'nteraction, bouton continuer
     - 'dialogue'  : un PNJ parle (+ éventuellement mini-jeu/choix)
   Chaque page : { text:{fr,en}, decor:clé-asset|URL, npc:id|null,
                   choices?, minigame?, choiceKey?, nextChoice? }
   Le runner (app.js) consomme window.TDPhases.
===================================================================== */
(function (global) {
    'use strict';

    var PHASES = [];

    /* ------------------------------------------------------------------
       INTRO — Phase 1A : NARRATION \'UVERTURE (musique thème)
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'intro-1',
        label: { fr: 'Prologue', en: 'Prologue' },
        act: 'Intro',
        type: 'narration',
        music: 'theme',
        pages: [
            { // page 1
                decor: 'universe',
                text: {
                    fr: 'La ville murmure sous la pluie. Dans un appartement cossu, un magnat de \'mmobilier a été retrouvé sans vie. On vous a confié \'nquête : la plus délicate de votre carrière.',
                    en: 'The city whispers under the rain. In a lavish flat, a real-estate magnate was found dead. You have been assigned the case : the most delicate of your career.'
                }
            },
            { // page 2
                decor: 'crimeScene',
                text: {
                    fr: 'Vous poussez la porte de la scène de crime. Le sang a séché sur le parquet, le coffre est béant, et sur une table gît une montre de poche brisée. Personne ne sait encore quand le magnat est mort : aucune heure \'st établie. \'st à vous de la trouver.',
                    en: 'You push open the door of the crime scene. Blood has dried on the floor, the safe gapes open, and on a table lies a broken pocket watch. No one knows yet when the magnate died : no time of death is established. Finding it is your job.'
                }
            },
            { // page 3
                decor: 'crimeScene',
                npc: 'detective-partner',
                text: {
                    fr: 'Votre partenaire vous rejoint, \'ir grave : « La victime, un magnat, \' q\'n seul domestique : son garde du corps, le Major Hale. \'st lui qui a découvert le corps. \'ffaire commence ici. »',
                    en: 'Your partner joins you, looking grave : "The victim, a tycoon, had one servant : his bodyguard, Major Hale. He found the body. The case begins here."'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       INTRO — Phase 1B : RECHERCHE (musique recherche.mp3)
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'intro-2',
        label: { fr: 'Recherche', en: 'Investigation' },
        act: 'Intro',
        type: 'dialogue',
        music: 'recherche',
        pages: [
            { // page 1 — interrogation partenaire + minigame scène
                decor: 'crimeScene',
                npc: 'detective-partner',
                minigame: {
                    type: 'scene_fouille',
                    wide: true,
                    title: { fr: 'Fouille de la scène', en: 'Scene search' },
                    desc: { fr: 'Balayez la scène à la loupe. Chaque pièce à conviction numérotée ouvre une fenêtre : examinez-les toutes.', en: 'Sweep the scene with the magnifier. Each numbered evidence opens a window : examine them all.' },
                    time: 60,
                    sceneImage: 'assets/image true detective/lieux/classic/scene de crime manoir.png',
                    hotspots: [
                        { label: '1', x: 27.5, y: 59, info: { fr: 'Un cachet de cire intact. Personne \' forcé le bureau : \'ssassin connaissait la maison… ou y avait accès.', en: 'An intact wax seal. No one forced the desk : the killer knew the house… or had access to it.' } },
                        { label: '2', x: 38.5, y: 57.5, info: { fr: 'La carafe renversée. DEUX verres ont été utilisés : la victime attendait quelqu\'un en qui elle avait confiance.', en: 'The overturned decanter. TWO glasses were used : the victim was expecting someone they trusted.' } },
                        { label: '3', x: 48, y: 58.5, info: { fr: 'Un livre de comptes taché de sang. Plusieurs pages ont été arrachées : celles qui mentionnaient les dettes.', en: 'A blood-stained ledger. Several pages were torn out : the ones mentioning debts.' } },
                        { label: 'A', x: 26, y: 70, info: { fr: 'Sous l\'encrier renversé, une lettre à moitié brûlée : des menaces rédigées \'ne écriture élégante et soignée.', en: 'Under the overturned inkwell, a half-burned letter : threats written in an elegant, careful hand.' } },
                        { label: 'C', x: 32, y: 69.5, info: { fr: 'L\'autre encrier est intact et la plume sèche depuis des heures : on a écrit ici AVANT le meurtre, pas après.', en: 'The other inkwell is untouched and the pen dry for hours : writing happened here BEFORE the murder, not after.' } },
                        { label: '4', x: 66.5, y: 78.5, info: { fr: 'Un fauteuil renversé près du tapis : la lutte a été brève, loin du bureau, près de la fenêtre.', en: 'An overturned chair by the rug : the struggle was brief, away from the desk, near the window.' } },
                        { label: '5', x: 70, y: 84.5, info: { fr: 'La mare de sang. La victime est tombée face à sa propre effigie : pas une scratch de défense. Elle connaissait son agresseur.', en: 'The pool of blood. The victim fell facing his own portrait : not a single scratch of defense. He knew his attacker.' } },
                        { label: '6', x: 82.5, y: 85, info: { fr: 'Près de la main du corps : un reçu froissé signé « V.K. » — une forte somme versée en espèces, sans explication.', en: 'Near the bod\' hand : a crumpled receipt signed "V.K." — a large sum paid in cash, unexplained.' } }
                    ],
                    evidence: 'forensic',
                    clue: { fr: 'Synthèse de la scène : un proche de confiance, deux verres, des pages de dettes arrachées, une écriture élégante dans les menaces… et un reçu signé « V.K. ». Le meurtre était prévu — le vol, simulé.', en: 'Scene summary : a trusted close one, two glasses, torn debt pages, elegant handwriting in the threats… and a receipt signed "V.K.". The murder was planned — the robbery, staged.' }
                },
                text: {
                    fr: '« Examinez la pièce avant de poser vos questions », souffle le partenaire. Vous inspectez chaque recoin : la scène raconte une histoire que seul un œil aiguisé peut lire.',
                    en: '"Examine the room before asking questions," your partner whispers. You inspect every corner : the scene tells a story only a sharp eye can read.'
                }
            },
            { // page 2 — Carnet déchiré (mini-puzzle)
                decor: 'crimeScene',
                npc: 'detective-partner',
                minigame: {
                    type: 'carnet_dechire',
                    title: { fr: 'Le Carnet déchiré', en: 'The Torn Ledger' },
                    desc: { fr: 'Reconstituez les pages arrachées du livre de comptes pour révéler un versement à « V.K. ».', en: 'Reassemble the torn ledger pages to reveal a payment to V.K..' },
                    time: 40,
                    asset: 'mini-games/prescription/prescription-eliane.png',
                    strips: [
                        { fr: '...versement de 5 000 £ à', en: '...payment of £5,000 to', order: 0 },
                        { fr: '...V.K. pour services', en: '... V.K. for services', order: 1 },
                        { fr: '...rendez-vous le 14 au soir', en: '...meeting on the 14th evening', order: 2 },
                        { fr: '...ne pas laisser de traces', en: '...leave no traces', order: 3 }
                    ],
                    evidence: 'mobile',
                    clue: { fr: 'Le carnet reconstitué + les empreintes digitales révèlent des versements réguliers à V.K. (Victor Krane) — le mobile financier est établi. Les empreintes confirment que la page a été manipulée par le coupable.', en: 'The rebuilt ledger + fingerprints reveal regular payments to V.K. (Victor Krane) — the financial motive is proven. The fingerprints confirm the page was handled by the killer.' }
                },
                text: {
                    fr: 'Regardez — les pages arrachées du livre de comptes. quelqu\'un a voulu effacer les dettes.',
                    en: 'Look — the torn pages from the ledger. Someone wanted to erase the debts.'
                }
            },
            { // page 3 — le Major Hale
                decor: 'crimeScene',
                npc: 'protecteur',
                text: {
                    fr: 'Le Major Hale tremble : « Je suis parti à 20h dépanner Julian Pembrooke en panne. À mon retour, 21h, je je l\'ai trouvé... sur le sol, une mare de sang. l\'appartement était cambriolé, le coffre vidé. » Il ajoute : « Rupert Blackwood était passé à 19h. Il lui devait beaucoup d\'argent. »',
                    en: 'Major Hale trembles : "I left at 8pm to help Julian Pembrooke whose car had broken down. When I came back, 9pm, I found him... on the floor, a pool of blood. The place had been robbed, the safe emptied." He adds : "Rupert Blackwood had come at 7pm. He owed him a lot of money."'
                }
            },
            { // page 4 — choix du prochain suspect
                decor: 'crimeScene',
                npc: 'detective-partner',
                choiceKey: 'choisirSuspect',
                choices: ['femme-fatale', 'seducteur', 'suspect'],
                text: {
                    fr: '« Trois pistes maintenant », annonce votre partenaire : « Lady Vivienne, Julian Pembrooke et Rupert Blackwood. Qui interrogez-vous en premier ? »',
                    en: '"Three leads now," your partner announces : "Lady Vivienne, Julian Pembrooke and Rupert Blackwood. Who do you question first?"'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 1 — Phase 2A : NARRATION (musique thème)
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act1-n1',
        label: { fr: 'Acte I — Piste', en: 'Act I — Lead' },
        act: 'Acte 1',
        type: 'narration',
        music: 'theme',
        pages: [
            {
                decor: 'alley',
                text: {
                    fr: 'Le soir tombe sur la ruelle sombre et humide. La route vers la résidence du Suspect serpente entre les façades noires. Un visage surgit de l\'ombre, adossé au mur : Silas Crane.',
                    en: 'Night falls over the dark, damp alley. The road to Rupert Blackwoo\' residence winds between black façades. A face emerges from the shadows, leaning against the wall : Silas Crane.'
                }
            },
            {
                decor: 'alley',
                npc: 'marginal',
                minigame: {
                    type: 'pression',
                    title: { fr: 'Interrogatoire sous pression', en: 'Interrogation under pressure' },
                    desc: { fr: 'Remettez les questions dans l\'ordre qui fera parler Silas Crane.', en: 'Order the questions to make Silas Crane talk.' },
                    time: 40,
                    order: [
                        { fr: 'Le proposer de partager un café', en: 'Offer to share a coffee' },
                        { fr: 'La pièce q\'l garde précieusement', en: 'The coin he treasures' },
                        { fr: 'Le rôdeur de 22h09', en: 'The lurker at 10:09pm' }
                    ],
                    evidence: 'witness',
                    clue: { fr: 'Silas Crane a vu un rôdeur vers 22h — pas un marginal, quelqu\'un de « bien habillé, pressé ». Le rôdeur ressemble à Julian Pembrooke, et l\'alibi de sa « panne » tombe pile à cette heure.', en: 'Silas Crane saw a lurker around 10pm — not a drifter, someone "well dressed, in a hurry". The lurker looks like Julian Pembrooke, and his "breakdown" alibi falls exactly at that hour.' }
                },
                text: {
                    fr: '« La manche ? » Il tend une main sale. « \'tais là, assis, quand un rôdeur est passé vers 22h. La victime, elle, \' donné une pièce. » Il ricane : « Julian Pembrooke ? Lui, il traîne au bar, pas ici. »',
                    en: '"Spare a coin?" He holds out a dirty hand. "I was here, sitting, when a lurker passed by around 10pm. The victim gave me a coin." He sneers : "Julian Pembrooke? He hangs out at the bar, not here."'
                }
            },
            {
                decor: 'residence',
                npc: null,
                text: {
                    fr: 'Vous arrivez enfin à la résidence du Suspect. La façade est cossue, les rideaux tirés. À \'ntérieur vous attend \'n de ceux que vous avez choisi \'nterroger.',
                    en: 'You finally reach Rupert Blackwoo\' residence. The façade is wealthy, the curtains drawn. Inside awaits the one you chose to question.'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 1 — Phase 2B : RÉFLEXION (musique reflexion.mp3)
       l\'ordre \'nterrogation dépend du choix (choisirSuspect).
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act1-r2',
        label: { fr: 'Acte I — Réflexion', en: 'Act I — Reflection' },
        act: 'Acte 1',
        type: 'dialogue',
        music: 'reflexion',
        dynamic: 'interrogations',
        pages: [
            { // page 1
                decor: 'dynamic',
                npc: 'dynamic',
                text: {
                    fr: 'Vous êtes face au premier suspect. Il observe vos moindres gestes, pesant chacune de vos questions.',
                    en: 'You face the first suspect. He watches your every move, weighing each of your questions.'
                }
            },
            { // page 2
                decor: 'dynamic',
                npc: 'dynamic',
                text: {
                    fr: '« Chacun \'ntre nous a un mobile », affirme le suivant. « Lady Vivienne hériterait, Rupert Blackwood doit de d\'argent, Julian Pembrooke la veut, elle. Accusez qui vous voulez, ils diront tous la même chose. »',
                    en: '"Each of us has a motive," the next one claims. "Lady Vivienne would inherit, Rupert Blackwood owes money, Julian Pembrooke wants her. Accuse whoever you want, the\'l all say the same."'
                }
            },
            { // page 3
                decor: 'dynamic',
                npc: 'dynamic',
                text: {
                    fr: 'Le troisième ferme les yeux. « Je \'i rien fait. Mais regardez les faits, pas les mots. »',
                }
            },
            { // page 4 — Cryptogramme de la planque (Bar de Krane)
                decor: 'alley',
                npc: 'criminel',
                minigame: {
                    type: 'cryptogramme',
                    title: { fr: 'Le Cryptogramme de la Planque', en: 'The Hideout Cryptogram' },
                    desc: { fr: 'Décodez la note chiffrée de Victor Krane par substitution.', en: 'Decode Victor Krane cipher note by substitution.' },
                    time: 45,
                    asset: 'mini-games/puzzle/krane-coded-note.png.jfif',
                    cipher: 'XLIW MRJSV QEXL',
                    key: { A:'V', B:'W', C:'X', D:'Y', E:'Z', F:'A', G:'B', H:'C', I:'D', J:'E', K:'F', L:'G', M:'H', N:'I', O:'J', P:'K', Q:'L', R:'M', S:'N', T:'O', U:'P', V:'Q', W:'R', X:'S', Y:'T', Z:'U' },
                    solution: 'THIS JOINT PAID',
                    evidence: 'mobile',
                    clue: { fr: 'Le message décodé confirme que le contrat a été payé par un proche de \'ntérieur : Hale \' engagé.', en: 'The decoded message confirms the contract was paid by an inside person: Hale hired me.' }
                },
                text: {
                    fr: 'Dans la planque de Krane, vous trouvez une note codée. Les lettres sont décalées... trouvez la clé.',
                    en: 'In Krane hideout, you find a coded note. The letters are shifted... find the key.'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 2 — Phase 3A : ENQUÊTE (musique enquete.mp3)
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act2-e1',
        label: { fr: 'Acte II — Enquête', en: 'Act II — Investigation' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'enquete',
        pages: [
            {
                decor: 'labo',
                npc: 'scientifique',
                minigame: {
                    type: 'labo_verrou',
                    title: { fr: 'Le verrou réchauffé', en: 'The warmed lock' },
                    desc: { fr: 'Passez le verrou au thermique : repérez les zones réchauffées par une ouverture récente.', en: 'Run thermal analysis on the lock : find the zones warmed by a recent opening.' },
                    time: 45,
                    hotspots: [
                        { x: 30, y: 40, correct: false },
                        { x: 55, y: 55, correct: true },
                        { x: 75, y: 35, correct: true },
                        { x: 45, y: 75, correct: true }
                    ],
                    evidence: 'timeline',
                    clue: { fr: 'Le verrou a été ouvert avec une clé, pas forcé : \'ssassin a eu accès au trousseau du Major Hale. Et la chaleur date de 22h — Hale prétendait être dehors à cette heure.', en: 'The lock was opened with a key, not forced : the killer had access to Major Hal\' key ring. And the heat dates from 10pm — Hale claimed to be outside at that hour.' }
                },
                text: {
                    fr: 'Le Dr Whitmore ajuste ses lunettes : « Vu la violence, \'ssassin est probablement un homme. \'i retrouvé plusieurs ADN : celui de Lady Vivienne, de Julian Pembrooke, du Major Hale, de Rupert Blackwood... et un inconnu. » Il marque une pause. « Plusieurs traces. Trop, pour être innocent. »',
                    en: 'Dr Whitmore adjusts his glasses : "Given the violence, the killer is probably a man. I found several DNA : Lady Vivienne, Julian Pembrooke, Major Hale, Rupert Blackwood... and one unknown." He pauses. "Several traces. Too many, to be innocent."'
                }
            },
            {
                decor: 'labo',
                npc: 'scientifique',
                minigame: {
                    type: 'adn_analyse',
                    title: { fr: 'ADN inconnu', en: 'Unknown DNA' },
                    desc: { fr: 'Identifiez \'chantillon inconnu parmi les profils ADN.', en: 'Identify the unknown sample among the DNA profiles.' },
                    time: 35,
                    samples: [
                        { fr: 'Lady Vivienne', en: 'Lady Vivienne', match: false },
                        { fr: 'Julian Pembrooke', en: 'Julian Pembrooke', match: false },
                        { fr: 'Major Hale', en: 'Major Hale', match: false },
                        { fr: 'Inconnu (Krane)', en: 'Unknown (Krane)', match: true }
                    ],
                    evidence: 'forensic',
                    clue: { fr: '\'DN inconnu est celui de Victor Krane, un tueur à gages. Le meurtre \'st pas un crime passionnel : \'st un contrat.', en: 'The unknown DNA belongs to Victor Krane, a hitman. The murder is not a crime of passion : i\' a contract.' }
                },
                text: {
                    fr: '« \'chantillon inconnu correspond à un homme enregistré dans les fichiers : Victor Krane, un criminel connu. quelqu\'un \' engagé. »',
                    en: '"The unknown sample matches a man in the files : Victor Krane, a known criminal. Someone hired him."'
                }
            },
            {
                decor: 'alley',
                npc: null,
                minigame: {
                    type: 'montre_code',
                    title: { fr: 'Le Cadette trahi', en: 'The betrayed Cadette' },
                    desc: { fr: 'Passez la loupe sur le dos de la montre : déchiffrez le numéro gravé… puis observez la FACE. Chaque détail compte.', en: 'Sweep the magnifier over the watch back : decode the engraved number… then study the FACE. Every detail counts.' },
                    time: 50,
                    code: [1, 9, 8, 1],
                    symbols: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                    evidence: 'timeline',
                    clue: { fr: 'INDICE MINEUR : « 1981 » gravé au dos — le millésime \'n coffre-fort, quelque part. INDICE MAJEUR : sur la face, \'iguille est figée à 22h09. Si la montre est sincère, voilà \'eure du crime. Retenez-la : elle décidera du twist final.', en: 'MINOR CLUE : "1981" engraved on the back — the make-year of some safe. MAJOR CLUE : on the face, the hand is frozen at 10:09pm. If the watch is sincere, that is the time of death. Remember it : it will decide the final twist.' }
                },
                text: {
                    fr: 'Vous reprenez la route vers la ruelle. « 1981 » au dos, une année — rien de plus. Mais vous \'vez pas manqué \'iguille figée à 22h09 sur la face : si la montre est sincère, voilà \'eure du crime, que personne \' encore établie. Et ce rôdeur que Silas Crane a croisé vers 22h... Il faut le reparler.',
                    en: 'You head back toward the alley. "1981" on the back, a year — nothing more. But you did not miss the hand frozen at 10:09pm on the face : if the watch is sincere, that is the time of death, which no one has established yet. And that lurker Silas Crane crossed around 10pm... You must speak to him again.'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 2 — Phase 3B : COFFRE-FORT (musique enquete.mp3)
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act2-coffre',
        label: { fr: 'Acte II — Le Coffre', en: 'Act II — The Safe' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'enquete',
        pages: [
            {
                decor: 'qg',
                npc: 'detective-partner',
                text: {
                    fr: 'Votre partenaire pose un carnet sur la table : « Le coffre-fort de la victime a été retrouvé vide. Mais le code... on \' trouvé. 1981. Le millésime de la montre. »',
                    en: 'Your partner puts a notebook on the table : "The victi\' safe was found empty. But the code... we found it. 1981. The watc\' make-year."'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                minigame: {
                    type: 'coffre_code',
                    title: { fr: 'Le Coffre-fort', en: 'The Safe' },
                    desc: { fr: 'Entrez le code à 4 chiffres. Indice : les coffres de famille datent souvent de leur fabrication.', en: 'Enter the 4-digit code. Hint : family safes are often dated by their make-year.' },
                    time: 30,
                    code: [1, 9, 8, 1],
                    evidence: 'mobile',
                    clue: { fr: 'Le coffre \'uvre : à \'ntérieur, un carnet de versements. Le Major Hale payait Victor Krane — des mensualités régulières. Hale finançait le tueur.', en: 'The safe opens : inside, a payment ledger. Major Hale was paying Victor Krane — regular monthly installments. Hale was funding the killer.' }
                },
                text: {
                    fr: 'Le coffre-fort est là, dans le bureau. Composez le code.',
                    en: 'The safe is there, in the office. Enter the code.'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                text: {
                    fr: 'Le carnet révèle tout : Hale payait Krane. Le mobile est financier — mais pour quoi faire ?',
                    en: 'The ledger reveals everything : Hale was paying Krane. The motive is financial — but for what?'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 3 — Phase 4A : CHRONOLOGIE (musique chronologie.mp3)
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act3-chrono',
        label: { fr: 'Acte III — Chronologie', en: 'Act III — Timeline' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'chronologie',
        pages: [
            {
                decor: 'qg',
                npc: 'detective-partner',
                minigame: {
                    type: 'chronologie',
                    title: { fr: 'Reconstituez la chronologie', en: 'Reconstruct the timeline' },
                    desc: { fr: 'Placez les événements dans l\'ordre chronologique.', en: 'Place the events in chronological order.' },
                    time: 45,
                    events: [
                        { fr: '19h — Rupert Blackwood arrive', en: '7pm — Rupert Blackwood arrives' },
                        { fr: '20h — Hale part « aider » Pembrooke', en: '8pm — Hale leaves to "help" Pembrooke' },
                        { fr: '21h30 — Silas voit le rôdeur', en: '9:30pm — Silas sees the prowler' },
                        { fr: '22h09 — Heure du crime (montre)', en: '10:09pm — Time of death (watch)' },
                        { fr: '22h30 — Hale « revient »', en: '10:30pm — Hale "returns"' }
                    ],
                    evidence: 'timeline',
                    clue: { fr: 'La chronologie révèle le trou : Hale prétendait être en panne à 22h09, mais le verrou et le rôdeur placent quelqu\'un sur les lieux à ce moment. l\'alibi de Hale \'ffondre.', en: 'The timeline reveals the gap : Hale claimed to be broken down at 10:09pm, but the lock and the prowler place someone on scene at that moment. Hal\' alibi collapses.' }
                },
                text: {
                    fr: 'Votre partenaire étale les notes : « Remettons les événements dans l\'ordre. À quelle heure exactement la victime est-elle morte ? »',
                    en: 'Your partner spreads the notes : "Le\' put the events in order. At what exact time did the victim die?"'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                minigame: {
                    type: 'roue_alibis',
                    title: { fr: 'La Roue Synchrone des Alibis', en: 'The Synchronous Wheel of Alibis' },
                    desc: { fr: 'Alignez le cadran de la montre (22h09), l\'alibi de la panne de Pembrooke et l\'horloge-mère pour pulvériser l\'alibi de Hale.', en: 'Align the watch dial (10:09pm), Pembrooke\'s breakdown alibi and the mother clock to shatter Hale\'s alibi.' },
                    time: 45,
                    asset: 'mini-games/puzzle/pocket-watch-dial.png.jfif',
                    target: '22:09',
                    evidence: 'timeline',
                    clue: { fr: 'Les trois horloges s\'accordent sur 22h09 : Hale prétendait être en panne avec Pembrooke à cet instant, mais l\'horloge-mère situe le choc au même moment. Son alibi est pulvérisé. Le dossier d\'accusation est verrouillé.', en: 'The three clocks agree on 10:09pm : Hale claimed to be broken down with Pembrooke at that instant, but the mother clock places the impact at the same time. His alibi is shattered. The case is sealed.' }
                },
                text: {
                    fr: 'Sur le bureau, la montre figée, le récit de la panne et la grande horloge-mère. « Synchronisons-les… la vérité éclatera. »',
                    en: 'On the desk, the frozen watch, the breakdown story and the great mother clock. "Let\'s synchronize them... the truth will burst out."'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                text: {
                    fr: '« 22h09... \'eure que personne \' établie. Et l\'alibi de Hale recouvre exactement ce moment. »',
                    en: '"10:09pm... the time no one established. And Hal\' alibi covers exactly that moment."'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                text: {
                    fr: '« Il faut maintenant confronter les suspects. Le sabotage de la panne, \'orloge-mère, tout doit \'mboîter. »',
                    en: '"Now we must confront the suspects. The sabotage of the breakdown, the mother clock, everything must fit together."'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 3 — Phase 4B : TENSION (musique rising.mp3)
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act3-t2',
        label: { fr: 'Acte III — Tension', en: 'Act III — Tension' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'rising',
        pages: [
            {
                decor: 'clandestine',
                npc: 'detective-partner',
                text: {
                    fr: 'Surveillance. Julian Pembrooke et Lady Vivienne se retrouvent en secret dans une cachette. La panne de Pembrooke était-elle un mensonge pour les laisser ensemble ? Les langues se délient.',
                    en: 'Surveillance. Julian Pembrooke and Lady Vivienne meet in secret in a hideout. Was Julian Pembrook\' breakdown a lie to let them be together? Tongues start to loosen.'
                }
            },
            {
                decor: 'laboratoire',
                npc: 'scientifique',
                minigame: {
                    type: 'sabotage',
                    title: { fr: 'La panne sabotée', en: 'The sabotaged breakdown' },
                    desc: { fr: 'Trouvez la pièce falsifiée sur le véhicule.', en: 'Find the part that was tampered with.' },
                    time: 25,
                    badIndex: 1,
                    parts: [
                        { fr: 'Batterie', en: 'Battery' },
                        { fr: 'Durite (sectionnée)', en: 'Hose (cut)' },
                        { fr: 'Radiateur', en: 'Radiator' },
                        { fr: 'Filtre à air', en: 'Air filter' }
                    ],
                    evidence: 'alibi',
                    clue: { fr: 'La durite a été sectionnée intentionnellement : la « panne » de Pembrooke était un faux, monté avec le Major Hale. Le but : donner un alibi au vrai coupable.', en: 'The hose was cut on purpose : Pembrook\' "breakdown" was staged with Major Hale. The goal : to give the real killer an alibi.' }
                },
                text: {
                    fr: 'Le Dr Whitmore vous montre le rapport du garagiste : « La panne \'tait pas naturelle. quelqu\'un a sectionné la durite pour coincer Julian Pembrooke... et offrir un alibi au Major Hale. »',
                    en: 'Dr Whitmore shows you the mechani\' report : "The breakdown was not natural. Someone cut the hose to trap Julian Pembrooke... and give Major Hale an alibi."'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                minigame: {
                    type: 'cablage_alarme',
                    title: { fr: 'Le Câblage de \'larme', en: 'The Alarm Wiring' },
                    desc: { fr: 'Rétablissez la boucle \'ntégrité du circuit pour prouver que \'larme a été neutralisée de \'ntérieur.', en: 'Restore the circuit integrity loop to prove the alarm was neutralized from inside.' },
                    time: 40,
                    asset: 'mini-games/puzzle/alarm-circuit-blueprint.png.jfif',
                    evidence: 'opportunity',
                    clue: { fr: 'Le câblage prouve que \'larme a été désactivée par quelqu\'un qui connaissait le système — le garde du corps, Hale. Pas de effraction : \'ntrusion venait de \'ntérieur.', en: 'The wiring proves the alarm was disabled by someone who knew the system — the bodyguard, Hale. No break-in: the intrusion came from inside.' }
                },
                text: {
                    fr: 'Le panneau de sécurité du manoir. Les fils sont coupés, \'larme muette. quelqu\'un savait exactement où intervenir.',
                    en: 'The manor security panel. Wires cut, alarm silent. Someone knew exactly where to intervene.'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                minigame: {
                    type: 'cable_match',
                    title: { fr: 'Graphite', en: 'Graphite' },
                    desc: { fr: 'Reconnectez les 3 bons fils de \'larme, puis identifiez à quelle écriture correspond le graffiti au charbon.', en: 'Reconnect the 3 right alarm wires, then match the charcoal graffiti to a handwriting sample.' },
                    time: 50,
                    wires: [
                        { fr: 'Fil A', en: 'Wire A' }, { fr: 'Fil B', en: 'Wire B' }, { fr: 'Fil ♦', en: 'Wire ♦' },
                        { fr: 'Fil mort', en: 'Dead wire' }, { fr: 'Fil coupé', en: 'Cut wire' }, { fr: 'Fil tordu', en: 'Twisted wire' }
                    ],
                    good: [0, 1, 2],
                    writings: [
                        { fr: 'Écriture de Rupert', en: 'Ruper\' writing' },
                        { fr: 'Écriture du Major Hale', en: 'Major Hal\' writing' },
                        { fr: 'Écriture de Lady Vivienne', en: 'Lady Vivienn\' writing' }
                    ],
                    match: 0,
                    evidence: 'opportunity',
                    clue: { fr: 'Le graffiti au charbon \'st pas de la main de Hale : une main avertie a marqué le câble pour couper \'larme au bon moment. La complicité est établie — Hale et Pembrooke se couvraient.', en: 'The charcoal graffiti is not by Hal\' hand : a knowing hand marked the cable to cut the alarm at the right moment. The collusion is proven — Hale and Pembrooke were covering for each other.' }
                },
                text: {
                    fr: '« Attendez... » Votre partenaire fronce les sourcils. « Si la durite a été coupée, alors le Major Hale savait où et quand aider Julian Pembrooke. Et ce graffiti au charbon sur le câble de \'larme... ce \'st pas sa main. »',
                    en: '"Wait..." Your partner frowns. "If the hose was cut, then Major Hale knew where and when to help Julian Pembrooke. And that charcoal graffiti on the alarm cable... it is not his hand."'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 3 — Phase 4C : RÉVÉLATION (musique Act III Revelations.mp3)
       Rebondissement 2 + CHOIX DU COUPABLE
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act3-rev',
        label: { fr: 'Acte III — Révélation', en: 'Act III — Revelation' },
        act: 'Acte 3',
        type: 'dialogue',
        music: 'revelation',
        pages: [
            {
                decor: 'crimeScene',
                npc: 'criminel',
                text: {
                    fr: 'Sous la pression, Victor Krane avoue en partie : « Je ne connaissais pas la victime par hasard... je suis payé pour la violence. » \'DN inconnue, le rôdeur q\' vu Silas Crane : tout converge.',
                    en: 'Under pressure, Victor Krane half confesses : "I did\' know the victim by chance... I am paid for violence." The unknown DNA, the lurker Silas Crane saw : everything converges.'
                }
            },
            {
                decor: 'crimeScene',
                npc: 'protecteur',
                text: {
                    fr: 'Le Major Hale se contredit soudain : il décrit la mare de sang avec trop de précision... alors que la porte était verrouillée à son retour. Son alibi est un faux, \'st certain.',
                    en: 'Major Hale suddenly contradicts himself : he describes the pool of blood with too much precision... while the door was locked when he returned. His alibi is false, that is certain.'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                choiceKey: 'accuser',
                choices: ['protecteur', 'femme-fatale', 'seducteur', 'suspect', 'marginal', 'criminel'],
                text: {
                    fr: '« Le moment est venu. Qui accusez-vous ? Choisissez avec soin : une erreur, et le vrai coupable \'chappera. »',
                    en: '"The time has come. Who do you accuse? Choose carefully : a mistake, and the real killer will escape."'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       OUTRO — narration (musique thème) puis générique (night ride)
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'outro',
        label: { fr: 'Épilogue', en: 'Epilogue' },
        act: 'Outro',
        type: 'outro',
        music: 'theme',
        pages: []
    });
    global.TDPhases = PHASES;

}(typeof globalThis !== 'undefined' ? globalThis : this));