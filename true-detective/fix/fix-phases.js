const fs = require('fs');

const filePath = 'phases.js';
let content = fs.readFileSync(filePath, 'utf8');

// Corriger les problèmes d'encodage des apostrophes
const corrections = [
    ["\\'mmobilier", "l'immobilier"],
    ["a 't' retrouv'", "a été retrouvé"],
    ["confi' \\'nqu'te", "confiée l'enquête"],
    ["d'licate", "délicate"],
    ["carri're", "carrière"],
    ["sc'ne", "scène"],
    ["s'ch'", "séché"],
    ["b'ant", "béant"],
    ["g't", "gît"],
    ["bris'e", "brisée"],
    ["\\'st 'tablie", "n'est établie"],
    ["\\'st ' vous", "c'est à vous"],
    ["\\'ir", "l'air"],
    ["\\' q\\'n", "qu'un"],
    ["\\'st lui", "c'est lui"],
    ["d'couvert", "découvert"],
    ["\\'ffaire", "L'affaire"],
    ["pi'ce", "pièce"],
    ["num'rotée", "numérotée"],
    ["\\'t'", "été"],
    ["s'accagé", "saccagé"],
    ["r'digeait", "rédigeait"],
    ["t'moigne", "témoigne"],
    ["invit'", "invité"],
    ["tach'", "taché"],
    ["bascull'", "bascullé"],
    ["chiffon'", "chiffonné"],
    ["epicenter", "épicentre"],
    ["accés", "accès"],
];

for (const [bad, good] of corrections) {
    content = content.split(bad).join(good);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fichier phases.js corrigé !');