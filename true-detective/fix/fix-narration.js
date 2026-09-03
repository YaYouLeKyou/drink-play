// Script pour corriger l'encodage des fichiers de narration
const fs = require('fs');
const path = require('path');

const dir = __dirname;

// Mapping des caractères encodés vers les caractères corrects
const APOSTROPHE = '\u2019';
const DQUOTE_OPEN = '\u201C';
const DQUOTE_CLOSE = '\u201D';
const EM_DASH = '\u2014';
const ELLIPSIS = '\u2026';
const EN_DASH = '\u2013';

const fixes = {
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ã ': 'à',
    'Ã¢': 'â',
    'Ã´': 'ô',
    'Ã»': 'û',
    'Ã§': 'ç',
    'Ãª': 'ê',
    'Ã«': 'ë',
    'Ã¯': 'ï',
    'Ã¼': 'ü',
    'Å"': 'œ',
    'â€™': APOSTROPHE,
    'â€œ': DQUOTE_OPEN,
    'â€': DQUOTE_CLOSE,
    'â€"': EM_DASH,
    'â€¦': ELLIPSIS,
    'â€"': EN_DASH,
    'Ã‰': 'É',
    'Ãˆ': 'È',
    'Ã€': 'À',
    'Ã‚': 'Â',
    'Ã"': 'Ô',
    'Ã›': 'Û',
    'Ã‡': 'Ç',
    'ÃŠ': 'Ê',
    'Ã‹': 'Ë',
    'ÃŽ': 'Î',
    'Ã"': 'Ï',
    "â€™": APOSTROPHE,
    "â€": DQUOTE_CLOSE,
};

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixed = content;
    
    for (const [bad, good] of Object.entries(fixes)) {
        fixed = fixed.split(bad).join(good);
    }
    
    // Also fix common encoding issues with apostrophes
    fixed = fixed.split('â€™').join(APOSTROPHE);
    fixed = fixed.split('â€œ').join(DQUOTE_OPEN);
    fixed = fixed.split('â€').join(DQUOTE_CLOSE);
    fixed = fixed.split('â€"').join(EM_DASH);
    fixed = fixed.split('â€¦').join(ELLIPSIS);
    fixed = fixed.split('â€"').join(EN_DASH);
    
    if (fixed !== content) {
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log('Fixed: ' + path.basename(filePath));
    } else {
        console.log('OK: ' + path.basename(filePath));
    }
}

// Fix all narration files
const files = [
    'narration.js',
    'narration-phases.js',
    'narration-scenario.js',
    'narration-reactions.js',
    'narration-truths.js',
    'narration-minigames.js',
    'narration-hotspots.js'
];

files.forEach(f => {
    const filePath = path.join(dir, f);
    if (fs.existsSync(filePath)) {
        fixFile(filePath);
    } else {
        console.log('Missing: ' + f);
    }
});

console.log('Done!');
