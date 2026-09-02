/* =====================================================================
   TRUE DETECTIVE — PHASES & DIALOGUES (contenu narratif V2)
   ---------------------------------------------------------------------
   Structure : 9 phases de 3 pages chacune.
   types :
     - 'narration' : pas d'interaction, bouton continuer
     - 'dialogue'  : un PNJ parle (+ éventuellement mini-jeu/choix)
   Chaque page : { text:{fr,en}, decor:clé-asset|URL, npc:id|null,
                   choices?, minigame?, choiceKey?, nextChoice? }
   Le runner (app.js) consomme window.TDPhases.
===================================================================== */
(function (global) {
    'use strict';

    var PHASES = [];

    /* ------------------------------------------------------------------
       INTRO — Phase 1A : NARRATION D'OUVERTURE (musique thème)
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
                    fr: 'La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l\'immobilier a été retrouvé sans vie. On vous a confié l\'enquête : la plus délicate de votre carrière.',
                    en: 'The city whispers under the rain. In a lavish flat, a real-estate magnate was found dead. You have been assigned the case : the most delicate of your career.'
                }
            },
            { // page 2
                decor: 'crimeScene',
                text: {
                    fr: 'Vous poussez la porte de la scène de crime. Le sang a séché sur le parquet, le coffre est béant, et sur une table, une montre brisée semble marquer une heure fatale : 22h09.',
                    en: 'You push open the door of the crime scene. Blood has dried on the floor, the safe gapes open, and on a table a broken watch seems to mark a fatal hour : 20:12.'
                }
            },
            { // page 3
                decor: 'crimeScene',
                npc: 'detective-partner',
                text: {
                    fr: 'Votre partenaire vous rejoint, l\'air grave : « La victime, un magnat, n\'a qu\'un seul domestique : son garde du corps, le Major Hale. C\'est lui qui a découvert le corps. L\'affaire commence ici. »',
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
                    title: { fr: 'Fouille de la scène', en: 'Scene search' },
                    desc: { fr: 'Cliquez sur les indices visibles pour les relever.', en: 'Click the visible clues to gather them.' },
                    time: 30,
                    hotspots: [
                        { fr: 'Montre brisée', en: 'Broken watch' },
                        { fr: 'Coffre vide', en: 'Empty safe' },
                        { fr: 'Tasse brisée', en: 'Broken cup' }
                    ]
                },
                text: {
                    fr: '« Examinez la pièce avant de poser vos questions », souffle le partenaire. Vous inspectez chaque recoin : la scène raconte une histoire que seul un œil aiguisé peut lire.',
                    en: '"Examine the room before asking questions," your partner whispers. You inspect every corner : the scene tells a story only a sharp eye can read.'
                }
            },
            { // page 2 — le Major Hale
                decor: 'crimeScene',
                npc: 'protecteur',
                text: {
                    fr: 'Le Major Hale tremble : « Je suis parti à 20h dépanner Julian Pembrooke en panne. À mon retour, 21h, je l\'ai trouvé... sur le sol, une mare de sang. L\'appartement était cambriolé, le coffre vidé. » Il ajoute : « Rupert Blackwood était passé à 19h. Il lui devait beaucoup d\'argent. »',
                    en: 'Major Hale trembles : "I left at 10pm to help Julian Pembrooke whose car had broken down. When I came back, 9pm, I found him... on the floor, a pool of blood. The place had been robbed, the safe emptied." He adds : "Rupert Blackwood had come at 9pm. He owed him a lot of money."'
                }
            },
            { // page 3 — choix du prochain suspect
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
                    en: 'Night falls over the dark, damp alley. The road to Rupert Blackwood\'s residence winds between black façades. A face emerges from the shadows, leaning against the wall : Silas Crane.'
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
                        { fr: 'La pièce qu\'il garde précieusement', en: 'The coin he treasures' },
                        { fr: 'Le rôdeur de 22h09', en: 'The lurker at 10:09pm' }
                    ]
                },
                text: {
                    fr: '« La manche ? » Il tend une main sale. « J\'étais là, assis, quand un rôdeur est passé vers 22h. La victime, elle, m\'a donné une pièce. » Il ricane : « Julian Pembrooke ? Lui, il traîne au bar, pas ici. »',
                    en: '"Spare a coin?" He holds out a dirty hand. "I was here, sitting, when a lurker passed by around 10pm. The victim gave me a coin." He sneers : "Julian Pembrooke? He hangs out at the bar, not here." '
                }
            },
            {
                decor: 'residence',
                npc: null,
                text: {
                    fr: 'Vous arrivez enfin à la résidence du Suspect. La façade est cossue, les rideaux tirés. À l\'intérieur vous attend l\'un de ceux que vous avez choisi d\'interroger.',
                    en: 'You finally reach Rupert Blackwood\'s residence. The façade is wealthy, the curtains drawn. Inside awaits the one you chose to question.'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 1 — Phase 2B : RÉFLEXION (musique reflexion.mp3)
       L'ordre d'interrogation dépend du choix (choisirSuspect).
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
                    fr: '« Chacun d\'entre nous a un mobile », affirme le suivant. « Lady Vivienne hériterait, Rupert Blackwood doit de l\'argent, Julian Pembrooke la veut, elle. Accusez qui vous voulez, ils diront tous la même chose. »',
                    en: '"Each of us has a motive," the next one claims. "Lady Vivienne would inherit, Rupert Blackwood owes money, Julian Pembrooke wants her. Accuse whoever you want, they\'ll all say the same."'
                }
            },
            { // page 3
                decor: 'dynamic',
                npc: 'dynamic',
                text: {
                    fr: 'Le dernier des trois se défend : « J\'étais au domicile à 21h, pour affaires, et je suis parti avant 21h30. Silas Crane peut le confirmer. » Les accusations ont tourné, sans qu\'aucune ne convainque pleinement.',
                    en: 'The last of the three defends himself : "I was at the flat at 9pm, on business, and left before 10pm. Silas Crane can confirm." The accusations have circled without any fully convincing.'
                }
            }
        ]
    });
/* ------------------------------------------------------------------
       ACTE 2 — Phase 3A : NARRATION (musique thème), QG + labo
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act2-n1',
        label: { fr: 'Acte II — Le Labo', en: 'Act II — The Lab' },
        act: 'Acte 2',
        type: 'narration',
        music: 'theme',
        pages: [
            {
                decor: 'qg',
                npc: 'detective-partner',
                text: {
                    fr: 'Au quartier général, votre partenaire vous tend un dossier : « Le Dr Whitmore est passé sur les lieux. Il a du nouveau. Petit détail au passage : Silas Crane a un casier pour cambriolage. »',
                    en: 'At headquarters, your partner hands you a file : "Dr Whitmore inspected the scene. He has news. Small detail by the way : Silas Crane has a burglary record."'
                }
            },
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
                    ]
                },
                text: {
                    fr: 'Le Dr Whitmore ajuste ses lunettes : « Vu la violence, l\'assassin est probablement un homme. J\'ai retrouvé plusieurs ADN : celui de Lady Vivienne, de Julian Pembrooke, du Major Hale, de Rupert Blackwood... et un inconnu. » Il marque une pause. « Plusieurs traces. Trop, pour être innocent. »',
                    en: 'Dr Whitmore adjusts his glasses : "Given the violence, the killer is probably a man. I found several DNA : Lady Vivienne, Julian Pembrooke, Major Hale, Rupert Blackwood... and one unknown." He pauses. "Several traces. Too many, to be innocent."'
                }
            },
            {
                decor: 'alley',
                npc: null,
                minigame: {
                    type: 'montre_code',
                    title: { fr: 'Le Cadette trahi', en: 'The betrayed Cadette' },
                    desc: { fr: 'Alignez l\'équerre, décodez le numéro gravé au dos de la montre... 22h09 ? L\'heure est-elle sincère ?', en: 'Align the light tool, decode the engraved number on the watch back... 10:09pm? Is the time sincere?' },
                    time: 50,
                    code: [2, 2, 0, 9],
                    symbols: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                },
                text: {
                    fr: 'Vous reprenez la route vers la ruelle. Le dos de la montre grave « 2209 » : la fameuse heure fatale. Mais un détail cloche — et ce rôdeur que Silas Crane a croisé vers 22h. Une certitude : il faut reparler à Silas Crane.',
                    en: 'You head back toward the alley. The watch back is engraved "2209" : the famous fatal hour. But something is off — and that lurker Silas Crane crossed around 10pm. One thing is certain : you must speak to Silas Crane again.'
                }
            }
        ]
    });

    /* ------------------------------------------------------------------
       ACTE 2 — Phase 3B : ÉNIGME (musique enigme.mp3) + minigame ADN
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act2-e2',
        label: { fr: 'Acte II — Énigme', en: 'Act II — Puzzle' },
        act: 'Acte 2',
        type: 'dialogue',
        music: 'enigme',
        pages: [
            {
                decor: 'alley',
                npc: 'marginal',
                minigame: {
                    type: 'adn_match',
                    title: { fr: 'Analyse ADN', en: 'DNA analysis' },
                    desc: { fr: 'Reliez chaque échantillon ADN au bon profil. Un échantillon n\'a pas de correspondance.', en: 'Match each DNA sample to the right profile. One sample has no match.' },
                    time: 45,
                    samples: [
                        { fr: 'Éch. 1', en: 'S.1' }, { fr: 'Éch. 2', en: 'S.2' }, { fr: 'Éch. 3', en: 'S.3' },
                        { fr: 'Éch. 4', en: 'S.4' }, { fr: 'Éch. 5 — INCONNU', en: 'S.5 — UNKNOWN' }
                    ],
                    profiles: [
                        { fr: 'Lady Vivienne', en: 'Lady Vivienne' }, { fr: 'Julian Pembrooke', en: 'Julian Pembrooke' },
                        { fr: 'Major Hale', en: 'Major Hale' }, { fr: 'Rupert Blackwood', en: 'Rupert Blackwood' },
                        { fr: 'Aucun dossier', en: 'No record' }
                    ],
                    match: 4
                },
                text: {
                    fr: '« J\'ai pas tué, je vous jure », insiste Silas Crane. Le scientifique a transmis les échantillons. Un est sans correspondance : il faut le confirmer par vous-même.',
                    en: '"I didn\'t kill, I swear," insists Silas Crane. Dr Whitmore has sent the samples. One has no match : you must confirm it yourself.'
                }
            },
            {
                decor: 'bar',
                npc: 'criminel',
                text: {
                    fr: 'Au bar, vous repérez un homme patibulaire, au fond : Victor Krane. « Je connaissais la victime, on se voyait parfois ici. On a bu un verre à 18h, le barman peut le dire. Je rentrais chez moi. » Sa voix est trop calme.',
                    en: 'At the bar, you spot a sinister man in the back : Victor Krane. "I knew the victim, we met here sometimes. We had a drink at 6pm, the bartender can tell you. I was heading home." His voice is too calm.'
                }
            },
            {
                decor: 'alley',
                npc: 'femme-fatale',
                text: {
                    fr: 'Lady Vivienne surgit sur le chemin : « La victime recevait des menaces de mort, vous savez. » Elle hésite : « Victor Krane... il pourrait être le corbeau derrière tout ça. » Travaille-t-elle à brouiller les pistes pour s\'innocenter ?',
                    en: 'Lady Vivienne appears on the path : "The victim received death threats, you know." She hesitates : "Victor Krane... he could be the crow behind all this." Is she muddying the waters to clear herself?'
                }
            }
        ]
    });
/* ------------------------------------------------------------------
       ACTE 3 — Phase 4A : NARRATION (musique thème) — le climax
    ------------------------------------------------------------------ */
    PHASES.push({
        id: 'act3-n1',
        label: { fr: 'Acte III — Le Nœud', en: 'Act III — The Knot' },
        act: 'Acte 3',
        type: 'narration',
        music: 'theme',
        pages: [
            {
                decor: 'qg',
                npc: 'detective-partner',
                text: {
                    fr: '« Tout le monde a un alibi, tout le monde a un mobile », soupire votre partenaire. « On approche. Regardons la chronologie : 21h Rupert Blackwood, 21h30 il part, 22h la panne de Julian Pembrooke, 22h09 la montre s\'arrête, 23h le Major Hale retrouve le corps. »',
                    en: '"Everyone has an alibi, everyone has a motive," your partner sighs. "We\'re getting close. Let\'s look at the timeline : 9pm Rupert Blackwood, 9:30 he leaves, 10pm Julian Pembrooke\'s breakdown, 10:09 the watch stops, 11pm Major Hale finds the body."'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                minigame: {
                    type: 'timeline',
                    title: { fr: 'Reconstituer la soirée', en: 'Rebuild the evening' },
                    desc: { fr: 'Cliquez les événements dans l\'ordre chronologique.', en: 'Click the events in chronological order.' },
                    time: 30,
                    order: [
                        { fr: '21h — Rupert Blackwood arrive', en: '9pm — Rupert Blackwood arrives' },
                        { fr: '21h30 — Rupert part (témoin)', en: '9:30pm — Rupert leaves (witness)' },
                        { fr: '22h — Panne de Julian Pembrooke', en: '10pm — Pembrooke breaks down' },
                        { fr: '22h09 — La montre s\'arrête', en: '10:09pm — The watch stops' },
                        { fr: '23h — Le Major Hale trouve le corps', en: '11pm — Major Hale finds the body' }
                    ]
                },
                text: {
                    fr: 'Vous alignez les faits. Une faille apparaît : l\'alibi du Major Hale (22h) tombe pile à l\'heure de la mort (22h09). Le doute s\'installe.',
                    en: 'You line up the facts. A flaw appears : Major Hale\'s alibi (10pm) falls right at the hour of death (10:09). Doubt creeps in.'
                }
            },
            {
                decor: 'crimeScene',
                npc: null,
                minigame: {
                    type: 'chronos_roue',
                    title: { fr: 'La roue du temps', en: 'The wheel of time' },
                    desc: { fr: 'Remontez l\'horloge-mère du pavillon : remettez les engrenages en ordre pour lire l\'heure exacte de l\'arrêt.', en: 'Wind the pavilion master clock : reorder the gears to read the exact stopping time.' },
                    time: 45,
                    order: [
                        { fr: 'Grand rouage', en: 'Large gear' },
                        { fr: 'Rouage moyen', en: 'Medium gear' },
                        { fr: 'Petit rouage', en: 'Small gear' },
                        { fr: 'Balancier', en: 'Balance wheel' }
                    ]
                },
                text: {
                    fr: 'La tension monte. Les suspects convergent vers la scène. L\'horloge-mère du pavillon s\'est arrêtée net à 22h09 — un choc, pas un vol. Il est temps de confronter, puis de trancher.',
                    en: 'Tension rises. The suspects converge on the scene. The pavilion master clock stopped dead at 10:09pm — a fall, not a theft. Time to confront, then to decide.'
                }
            }
        ]
    });
/* ------------------------------------------------------------------
       ACTE 3 — Phase 4B : RISING TENSION (musique Rising Tension.mp3)
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
                    en: 'Surveillance. Julian Pembrooke and Lady Vivienne meet in secret in a hideout. Was Julian Pembrooke\'s breakdown a lie to let them be together? Tongues start to loosen.'
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
                    ]
                },
                text: {
                    fr: 'Le Dr Whitmore vous montre le rapport du garagiste : « La panne n\'était pas naturelle. Quelqu\'un a sectionné la durite pour coincer Julian Pembrooke... et offrir un alibi au Major Hale. »',
                    en: 'Dr Whitmore shows you the mechanic\'s report : "The breakdown was not natural. Someone cut the hose to trap Julian Pembrooke... and give Major Hale an alibi."'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                minigame: {
                    type: 'cable_match',
                    title: { fr: 'Graphite', en: 'Graphite' },
                    desc: { fr: 'Reconnectez les 3 bons fils de l\'alarme, puis identifiez à quelle écriture correspond le graffiti au charbon.', en: 'Reconnect the 3 right alarm wires, then match the charcoal graffiti to a handwriting sample.' },
                    time: 50,
                    wires: [
                        { fr: 'Fil A', en: 'Wire A' }, { fr: 'Fil B', en: 'Wire B' }, { fr: 'Fil ♦', en: 'Wire ♦' },
                        { fr: 'Fil mort', en: 'Dead wire' }, { fr: 'Fil coupé', en: 'Cut wire' }, { fr: 'Fil tordu', en: 'Twisted wire' }
                    ],
                    good: [0, 1, 2],
                    writings: [
                        { fr: 'Écriture de Rupert', en: 'Rupert\'s writing' },
                        { fr: 'Écriture du Major Hale', en: 'Major Hale\'s writing' },
                        { fr: 'Écriture de Lady Vivienne', en: 'Lady Vivienne\'s writing' }
                    ],
                    match: 0
                },
                text: {
                    fr: '« Attendez... » Votre partenaire fronce les sourcils. « Si la durite a été coupée, alors le Major Hale savait où et quand aider Julian Pembrooke. Et ce graffiti au charbon sur le câble de l\'alarme... ce n\'est pas sa main. »',
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
                    fr: 'Sous la pression, Victor Krane avoue en partie : « Je ne connaissais pas la victime par hasard... je suis payé pour la violence. » L\'ADN inconnue, le rôdeur qu\'a vu Silas Crane : tout converge.',
                    en: 'Under pressure, Victor Krane half confesses : "I didn\'t know the victim by chance... I am paid for violence." The unknown DNA, the lurker Silas Crane saw : everything converges.'
                }
            },
            {
                decor: 'crimeScene',
                npc: 'protecteur',
                text: {
                    fr: 'Le Major Hale se contredit soudain : il décrit la mare de sang avec trop de précision... alors que la porte était verrouillée à son retour. Son alibi est un faux, c\'est certain.',
                    en: 'Major Hale suddenly contradicts himself : he describes the pool of blood with too much precision... while the door was locked when he returned. His alibi is false, that is certain.'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                choiceKey: 'accuser',
                choices: ['protecteur', 'femme-fatale', 'seducteur', 'suspect', 'marginal', 'criminel'],
                text: {
                    fr: '« Le moment est venu. Qui accusez-vous ? Choisissez avec soin : une erreur, et le vrai coupable s\'échappera. »',
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