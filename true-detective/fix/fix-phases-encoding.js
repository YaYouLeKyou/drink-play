const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'phases.js');

// Lire le fichier en tant que latin1 pour capturer les octets
const buffer = fs.readFileSync(filePath);
let content = buffer.toString('latin1');

// Corrections complètes de l'encodage Windows-1252 → UTF-8
const corrections = {
    'Ã ': 'à',
    'Ã¢': 'â',
    'Ã§': 'ç',
    'Ã¨': 'è',
    'Ã©': 'é',
    'Ãª': 'ê',
    'Ã«': 'ë',
    'Ã®': 'î',
    'Ã¯': 'ï',
    'Ã´': 'ô',
    'Ã¶': 'ö',
    'Ã¹': 'ù',
    'Ã¼': 'ü',
    'Ã€': 'À',
    'Ã‰': 'É',
    'Ã‡': 'Ç',
    'â': "'",
    'â': "'",
    'â': '"',
    'â': '"',
    'Â£': '£',
    'Ã ': 'à',
};

let modified = false;
for (const [bad, good] of Object.entries(corrections)) {
    if (content.includes(bad)) {
        content = content.split(bad).join(good);
        modified = true;
    }
}

// Correction des espaces insécables
content = content.replace(/\u00A0/g, ' ');

if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('phases.js corrigé');
} else {
    console.log('phases.js : aucune correction nécessaire');
}

// Vérification
const check = fs.readFileSync(filePath, 'utf8');
const hasBad = check.includes('Ã') || check.includes('???');
console.log('Bad encoding remaining:', hasBad);
