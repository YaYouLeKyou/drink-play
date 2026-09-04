const fs = require('fs');
const path = require('path');
const basePath = __dirname;

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log('Missing: ' + path.basename(filePath));
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    const map = {
        'Ã©': 'é', 'Ã¨': 'è', 'Ã ': 'à', 'Ã¢': 'â', 'Ã´': 'ô',
        'Ã»': 'û', 'Ã¹': 'ù', 'Ã§': 'ç', 'Ã«': 'ë', 'Ã¯': 'ï',
        'Ã¼': 'ü', 'Â«': '«', 'Â»': '»', 'Â°': '°', 'Ã': 'à',
        'â€™': "'", 'â€œ': '"', 'â€': '"', 'â€"': ',', 'â€¢': '•',
        'â€¦': '...', 'â†"': '→'
    };
    
    Object.entries(map).forEach(([bad, good]) => {
        content = content.split(bad).join(good);
    });
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed: ' + path.basename(filePath));
    } else {
        console.log('OK: ' + path.basename(filePath));
    }
}

['narration.js','narration-phases.js','narration-scenario.js','narration-reactions.js','narration-truths.js','narration-minigames.js','narration-hotspots.js','phases.js','scenario.js'].forEach(f => fixFile(path.join(basePath, f)));
console.log('=== DONE ===');