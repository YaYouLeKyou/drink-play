const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');

// Lire le fichier existant en binaire pour détecter l'encodage
const buffer = fs.readFileSync(htmlPath);

// Convertir en UTF-8 si nécessaire
let content;
if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    // UTF-8 BOM
    content = buffer.toString('utf8', 3);
} else {
    // Supposer UTF-8 sans BOM
    content = buffer.toString('utf8');
}

// Remplacer les séquences d'encodage Windows-1252 mal interprétées
const fixes = {
    'Enqu�te': 'Enqu\u00eate',
    'd�tective': 'd\u00e9tective',
    'Fran�ais': 'Fran\u00e7ais',
    'sc�ne': 'sc\u00e8ne',
    'd�chir�': 'd\u00e9chir\u00e9',
    'r�v�le': 'r\u00e9v\u00e8le',
    'r�guliers': 'r\u00e9guliers',
    '�tablie': '\u00e9tablie',
    '�tudi�': '\u00e9tudi\u00e9',
    '�chantillons': '\u00e9chantillons',
    '�criture': '\u00e9criture',
    '�l�gante': '\u00e9l\u00e9gante',
    '�poques': '\u00e9poques',
    '�v�nements': '\u00e9v\u00e9nements',
};

Object.keys(fixes).forEach(key => {
    content = content.split(key).join(fixes[key]);
});

// Écrire en UTF-8 avec BOM pour une meilleure compatibilité
const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
const data = Buffer.from(content, 'utf8');
fs.writeFileSync(htmlPath, Buffer.concat([bom, data]));
console.log('HTML corrig\u00e9 avec succ\u00e8s !');