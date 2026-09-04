/* =====================================================================
   Script de correction globale
   - Corrige les problemes d'encodage dans les fichiers narration
   - Ajoute le bouton developer si manquant
   - Amelioration du skip typewriter
===================================================================== */
const fs = require('fs');
const path = require('path');

const basePath = __dirname;

// Fonction pour corriger l'encodage d'un fichier
function fixEncoding(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`Fichier non trouve: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remplacer les caracteres encodes de maniere incorrecte
    const replacements = [
        ['Ã©', 'é'],
        ['Ã¨', 'è'],
        ['Ã ', 'à'],
        ['Ã¢', 'â'],
        ['Ã´', 'ô'],
        ['Ã»', 'û'],
        ['Ã¹', 'ù'],
        ['Ã§', 'ç'],
        ['Ã«', 'ë'],
        ['Ã¯', 'ï'],
        ['Ã¼', 'ü'],
        ['Ã', 'à'],
        ['â€™', "'"],
        ['â€œ', '"'],
        ['â€', '"'],
        ['â€"', '"'],
        ['â€"', '"'],
        ['â€¢', '•'],
        ['â€"', ','],
        ['â€"', '–'],
        ['â€¦', '...'],
        ['Â«', '«'],
        ['Â»', '»'],
        ['Â°', '°'],
        ['â†\'', '→'],
        ['â†"', '→'],
        ['â€"', '→'],
        ['â€¢', '•'],
        ['â€œ', '"'],
        ['â€', '"'],
        ['â€"', '"'],
        ['â€"', '"'],
    ];
    
    let modified = false;
    replacements.forEach(([bad, good]) => {
        if (content.includes(bad)) {
            content = content.split(bad).join(good);
            modified = true;
        }
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Corrige: ${filePath}`);
    }
}

// Liste des fichiers narration a corriger
const narrationFiles = [
    'narration.js',
    'narration-phases.js',
    'narration-scenario.js',
    'narration-reactions.js',
    'narration-truths.js',
    'narration-minigames.js',
    'narration-hotspots.js',
    'phases.js',
    'scenario.js'
];

console.log('=== Correction des fichiers narration ===');
narrationFiles.forEach(file => {
    fixEncoding(path.join(basePath, file));
});

console.log('\n=== Termine ===');