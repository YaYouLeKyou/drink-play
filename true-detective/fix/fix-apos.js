const fs = require('fs');
const f = 'd:\\dev projects\\2020-2025\\myGames\\drink&play\\true-detective\\phases.js';
let c = fs.readFileSync(f, 'utf8');
// Remplacer les apostrophes non échappées dans les chaînes fr/en
c = c.replace(/(?<!\\)'/g, "\\'");
fs.writeFileSync(f, c);
console.log('Fixed apostrophes');
