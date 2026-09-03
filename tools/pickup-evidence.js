// Ajoute le champ 'evidence' à chaque indice dans phases.js
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'true-detective', 'phases.js');
let c = fs.readFileSync(file, 'utf8');

const patches = [
    ['scene_fouille', 'forensic'],
    ['pression', 'witness'],
    ['labo_verrou', 'alibi'],
    ['adn_match', 'forensic'],
    ['montre_code', 'timeline'],
    ['coffre_code', 'mobile'],
    ['chronos_roue', 'timeline'],
    ['sabotage', 'alibi'],
    ['cable_match', 'opportunity'],
];

let count = 0;
patches.forEach(([mg, cat]) => {
    // Match: type: '<mg>' ... clue:   -> insère evidence avant clue (si pas déjà présent)
    const blockRe = new RegExp('(type: \'' + mg + '\'[\\s\\S]*?)(clue:)', 'm');
    const block = c.match(blockRe);
    if (!block) {
        console.log('BLOCK NOT FOUND:', mg);
        return;
    }
    // Vérifie si evidence est déjà dans ce bloc
    if (block[1].indexOf('evidence:') !== -1) {
        console.log('ALREADY HAS EVIDENCE:', mg);
        return;
    }
    const before = c.length;
    c = c.replace(blockRe, '$1                    evidence: \'' + cat + '\',\r\n                    $2');
    if (c.length !== before) {
        count++;
        console.log('OK:', mg, '->', cat);
    } else {
        console.log('MISSED:', mg);
    }
});

fs.writeFileSync(file, c, 'utf8');
console.log('\nTotal:', count, '/', patches.length);
