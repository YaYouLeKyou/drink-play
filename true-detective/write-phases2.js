const fs = require('fs');
const p2 = `
    PHASES.push({
        id: 'intro-2',
        label: { fr: 'Recherche', en: 'Investigation' },
        act: 'Intro',
        type: 'dialogue',
        music: 'recherche',
        pages: [
            {
                decor: 'crimeScene',
                npc: 'detective-partner',
                minigame: {
                    type: 'scene_fouille',
                    wide: true,
                    title: { fr: 'Fouille de la scène', en: 'Scene search' },
                    desc: { fr: "Balayez la scène à la loupe. Chaque pièce à conviction numérotée ouvre une fenêtre : examinez-les toutes.", en: "Sweep the scene with the magnifier." },
                    time: 60,
                    sceneImage: 'assets/image true detective/lieux/classic/scene de crime manoir.png',
                    hotspots: [
                        { label: 'A', x: 8, y: 35, info: { fr: "Le cachet de cire et son sceau posés à l'extrême gauche du bureau. Matériel de correspondance intact, prouvant que le bureau n'a pas été saccagé au hasard et que l'intrus connaissait les lieux ou possédait les accès.", en: "The wax seal and stamp placed at the far left of the desk." } },
                        { label: 'B', x: 18, y: 30, info: { fr: "Le bloc d'écriture et son encrier principal. Situé juste à côté du sous-main, il témoigne de la zone où la victime rédigeait ses documents avant l'altercation.", en: "The writing block and its main inkwell." } },
                        { label: '1', x: 12, y: 22, info: { fr: "Les documents administratifs et le dossier ouvert sous le badge. Papiers éparpillés sur le coin gauche du bureau, signalant qu'une recherche rapide ou une consultation de documents a eu lieu.", en: "Administrative documents and the open file under the badge." } },
                        { label: '2', x: 45, y: 28, info: { fr: "Les deux verres dressés et la petite coupelle. Témoigne clairement de la présence d'un invité de confiance que la victime attendait pour boire un verre.", en: "The two set glasses and the small saucer." } },
                        { label: '3', x: 62, y: 35, info: { fr: "Le livre ouvert et taché de sang près de la lampe de bureau. Registre ou journal de bord maculé de taches de sang, suggérant une lutte ou un accès brutal survenu en plein travail.", en: "The open book stained with blood near the desk lamp." } },
                        { label: '4', x: 75, y: 65, info: { fr: "Le fauteuil de bureau basculé et couché à l'envers sur le tapis. Témoigne d'une bousculade violente et d'une lutte brève juste avant que la victime ne s'effondre près de la fenêtre.", en: "The office chair overturned and lying face down on the carpet." } },
                        { label: '5', x: 50, y: 78, info: { fr: "La mare de sang au sol au cœur de la silhouette à la craie. L'épicentre de l'agression mortelle, marquant l'endroit exact de l'homicide.", en: "The pool of blood on the floor at the heart of the chalk silhouette." } },
                        { label: '6', x: 35, y: 85, info: { fr: "Le fragment de papier froissé à côté du corps. Un simple bout de papier chiffonné portant des chiffres ou des inscriptions énigmatiques, posant la première véritable énigme mystérieuse à élucider pour la suite de l'enquête.", en: "The crumpled piece of paper next to the body." } }
                    ],
                    evidence: 'forensic',
                    clue: { fr: "Un proche de confiance, deux verres, des dettes effacées, une écriture élégante et un reçu signé V.K. Le meurtre était prévu - le vol, simulé.", en: "A trusted close one, two glasses, erased debts." }
                },
                text: {
                    fr: "Examinez la pièce avant de poser vos questions, souffle le partenaire. Vous inspectez chaque recoin : la scène raconte une histoire que seul un œil aiguisé peut lire.",
                    en: "Examine the room before asking questions, your partner whispers."
                }
            },
            {
                decor: 'crimeScene',
                npc: 'detective-partner',
                text: {
                    fr: "Le carnet déchiré révèle des pages manquantes. En les reconstituant, vous découvrez des versements réguliers à un certain V.K.",
                    en: "The torn ledger reveals missing pages."
                }
            },
            {
                decor: 'crimeScene',
                npc: 'detective-partner',
                text: {
                    fr: "Votre partenaire vous observe : Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons.",
                    en: "Your partner watches you."
                }
            }
        ]
    });

    global.TDPhases = PHASES;
}(typeof globalThis !== 'undefined' ? globalThis : this));
`;
const existing = fs.readFileSync('phases.js', 'utf8');
fs.writeFileSync('phases.js', existing + p2, 'utf8');
console.log('Partie 2 écrite');