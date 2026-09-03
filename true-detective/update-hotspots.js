const fs = require('fs');

const filePath = 'phases.js';
let content = fs.readFileSync(filePath, 'utf8');

// Nouveaux hotspots avec positions et descriptions correctes
const newHotspots = `                    hotspots: [
                    { label: 'A', x: 8, y: 35, info: { fr: "Le cachet de cire et son sceau posés à l'extrême gauche du bureau. Matériel de correspondance intact, prouvant que le bureau n'a pas été saccagé au hasard et que l'intrus connaissait les lieux ou possédait les accès.", en: "The wax seal and stamp placed at the far left of the desk. Intact correspondence material, proving that the desk was not ransacked randomly and that the intruder knew the premises or had access to them." } },
                    { label: 'B', x: 18, y: 30, info: { fr: "Le bloc d'écriture et son encrier principal. Situé juste à côté du sous-main, il témoigne de la zone où la victime rédigeait ses documents avant l'altercation.", en: "The writing block and its main inkwell. Located just next to the blotting pad, it bears witness to the area where the victim was writing documents before the altercation." } },
                    { label: '1', x: 12, y: 22, info: { fr: "Les documents administratifs et le dossier ouvert sous le badge. Papiers éparpillés sur le coin gauche du bureau, signalant qu'une recherche rapide ou une consultation de documents a eu lieu.", en: "Administrative documents and the open file under the badge. Papers scattered on the left corner of the desk, indicating that a quick search or document consultation took place." } },
                    { label: '2', x: 45, y: 28, info: { fr: "Les deux verres dressés et la petite coupelle. Témoigne clairement de la présence d'un invité de confiance que la victime attendait pour boire un verre.", en: "The two set glasses and the small saucer. Clearly testifies to the presence of a trusted guest whom the victim was waiting to have a drink with." } },
                    { label: '3', x: 62, y: 35, info: { fr: "Le livre ouvert et taché de sang près de la lampe de bureau. Registre ou journal de bord maculé de taches de sang, suggérant une lutte ou un accès brutal survenu en plein travail.", en: "The open book stained with blood near the desk lamp. Register or logbook splattered with blood stains, suggesting a struggle or brutal access that occurred while working." } },
                    { label: '4', x: 75, y: 65, info: { fr: "Le fauteuil de bureau basculé et couché à l'envers sur le tapis. Témoigne d'une bousculade violente et d'une lutte brève juste avant que la victime ne s'effondre près de la fenêtre.", en: "The office chair overturned and lying face down on the carpet. Testifies to a violent scuffle and a brief struggle just before the victim collapsed near the window." } },
                    { label: '5', x: 50, y: 78, info: { fr: "La mare de sang au sol au cœur de la silhouette à la craie. L'épicentre de l'agression mortelle, marquant l'endroit exact de l'homicide.", en: "The pool of blood on the floor at the heart of the chalk silhouette. The epicenter of the fatal assault, marking the exact location of the homicide." } },
                    { label: '6', x: 35, y: 85, info: { fr: "Le fragment de papier froissé à côté du corps. Un simple bout de papier chiffonné portant des chiffres ou des inscriptions énigmatiques, posant la première véritable énigme mystérieuse à élucider pour la suite de l'enquête.", en: "The crumpled piece of paper next to the body. A simple crumpled piece of paper bearing figures or enigmatic inscriptions, posing the first truly mysterious enigma to solve for the rest of the investigation." } }
                ],`;

// Remplacer les anciens hotspots par les nouveaux
const hotspotsRegex = /hotspots: \[[\s\S]*?\],/;
content = content.replace(hotspotsRegex, newHotspots);

// Corriger les problèmes d'encodage courants
content = content.replace(/�/g, "'");
content = content.replace(/l'/g, "l'");
content = content.replace(/n'/g, "n'");
content = content.replace(/s'/g, "s'");
content = content.replace(/d'/g, "d'");
content = content.replace(/j'/g, "j'");
content = content.replace(/qu'/g, "qu'");

// Corriger les accents
content = content.replace(/�/g, "à");
content = content.replace(/�/g, "é");
content = content.replace(/�/g, "è");
content = content.replace(/�/g, "ê");
content = content.replace(/�/g, "ù");
content = content.replace(/�/g, "û");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Hotspots mis à jour et encodage corrigé !');