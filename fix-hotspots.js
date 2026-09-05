const fs = require('fs');
const filePath = 'true-detective/phases.js';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const newLine = [
  "            { decor: 'crimeScene',",
  '            text: { fr: "Votre partenaire vous tend la loupe. \u00ab Fouillez chaque recoin. Les pi\u00e8ces \u00e0 conviction vous diront tout. \u00bb", en: "Your partner hands you the magnifying glass. \'Search every corner. The evidence pieces will tell you everything.\'" },',
  "            minigame: { type: 'scene_fouille', wide: true, evidence: 'forensic',",
  '            title: { fr: "Fouille de la sc\u00e8ne", en: "Scene search" },',
  '            desc: { fr: "Balayez la sc\u00e8ne \u00e0 la loupe. Chaque pi\u00e8ce \u00e0 conviction num\u00e9rot\u00e9e ouvre une fen\u00eatre : examinez-les toutes pour reconstituer le code de la montre.", en: "Sweep the scene with the magnifier. Each numbered evidence piece opens a window: examine them all to reconstruct the watch code." },',
  '            clue: { fr: "Les indices du sol et du bureau r\u00e9v\u00e8lent des chiffres rouges : 1, 9, 8, 1. Le code de la montre est 1981. La combinaison du coffre est \u00e9tablie.", en: "Floor and desk clues reveal red digits: 1, 9, 8, 1. The watch code is 1981. The safe combination is established." },',
  '            time: 60,',
  '            sceneImage: "assets/image true detective/lieux/classic/scene de crime manoir.png",',
  "            hotspots: [",
  "            { label: 'A', x: 14.3, y: 66.1, info: { fr: \"Le sceau en or et son cachet, pos\u00e9s \u00e0 l'extr\u00e9mit\u00e9 gauche du bureau. Un bout de papier gliss\u00e9 sous le sceau porte un chiffre rouge : 1.\", en: \"The gold seal and its stamp, at the far left of the desk. A scrap of paper slid under the seal bears a red digit: 1.\" } },",
  "            { label: 'B', x: 22.7, y: 65.6, info: { fr: \"L\u0027encrier central. Un fragment de correspondance cache un chiffre : 9.\", en: \"The central inkwell. A fragment of correspondence conceals a digit: 9.\" } },",
  "            { label: '1', x: 31.7, y: 58.25, info: { fr: \"Des papiers administratifs \u00e9parpill\u00e9s. Un chiffre rouge 8 est gratt\u00e9 dans la marge d\u0027un document.\", en: \"Administrative papers scattered. A red digit 8 is scratched in the margin of a document.\" } },",
  "            { label: '2', x: 38.45, y: 58.6, info: { fr: \"Sous un verre de vin dress\u00e9, un chiffre rouge brille : 1.\", en: \"Under a standing wine glass, a red digit shines: 1.\" } },",
  "            { label: '3', x: 47.7, y: 59.25, info: { fr: \"Un livre ouvert sur le bureau. Une page tourn\u00e9e montre un chiffre : 4. Ce n\u0027est pas le bon.\", en: \"An open book on the desk. A turned page shows a digit: 4. Not the right one.\" } },",
  "            { label: '4', x: 66.35, y: 79.0, info: { fr: \"Tache de sang pr\u00e8s du corps. Un chiffre rouge 1 est manqu\u00e9 dans le sol, tach\u00e9 de sang s\u00e9ch\u00e9.\", en: \"Blood stain near the body. A red digit 1 is spattered on the floor, stained with dried blood.\" } },",
  "            { label: '5', x: 71.15, y: 85.75, info: { fr: \"Pr\u00e8s de la main du mort, un fragment de papier est illisible. Le chiffre est effac\u00e9.\", en: \"Near the victim\u0027s hand, a paper fragment is unreadable. The digit is erased.\" } },",
  "            { label: '6', x: 79.65, y: 88.05, info: { fr: \"Papier froiss\u00e9 dans la craie du corps. Un bout de lettre mentionne : \u00ab Le code est 1981, comme l\u0027heure. \u00bb\", en: \"Crumpled paper in the chalk outline. A letter fragment reads: 'The code is 1981, like the time.'\" } }",
  "            ] } }",
].join('\n');

lines[44] = newLine;
fs.writeFileSync(filePath, lines.join('\n'));
console.log('Done. New content length:', newLine.length);

// Verify by requiring
try {
    delete require.cache[require.resolve('./phases.js')];
    delete globalThis.TDPhases;
    require('./phases.js');
    const intro2 = TDPhases.find(p => p.id === 'intro-2');
    const mg = intro2.pages.find(p => p.minigame && p.minigame.type === 'scene_fouille');
    console.log('Hotspots count:', mg.minigame.hotspots.length);
    console.log('Labels:', mg.minigame.hotspots.map(h => h.label).join(', '));
    console.log('Has clue:', !!mg.minigame.clue);
    console.log('Has evidence:', !!mg.minigame.evidence);
    console.log('Has text:', !!mg.text);
    mg.minigame.hotspots.forEach(h => console.log('  ' + h.label + ': x=' + h.x + ', y=' + h.y));
} catch(e) {
    console.error('Verify error:', e.message);
}
