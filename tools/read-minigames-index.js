const fs = require('fs');
const s = fs.readFileSync('true-detective/minigames.js', 'utf8');
const lines = s.split('\n');
// Liste des fonctions et déclarations de registre
console.log('=== FONCTIONS / DECLARATIONS ===');
lines.forEach((l, n) => {
    if (/^[ \t]*(function|const|let|var)\b/.test(l) && /play|launch|register|type|minigame|story|solo|buildGrid|drawGrid|handleFire|resetScenario|cleanupDom|cueSound|\.register/i.test(l)) {
        console.log((n + 1) + ' : ' + l.trim().substring(0, 90));
    }
});
// Emplacement minigameTypes
const i = s.indexOf('minigameTypes');
console.log('\n=== minigameTypes ctx ===');
const sl = s.slice(Math.max(0, i - 200), i + 600).split('\n');
sl.forEach((l, n) => console.log((n + 1) + ' : ' + l.trim().substring(0, 90)));
// Section finale (regs + fin)
const len = s.length;
console.log('\n=== FIN DU FICHIER ===');
s.split('\n').slice(Math.max(0, len / 950), len / 750).forEach((l, n) => console.log((n + 1) + ' : ' + l.trim().substring(0, 90)));
