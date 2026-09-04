const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');
const files = ['phases.js', 'narration.js', 'scenario.js', 'minigames.js', 'index.html', 'app.js'];

/* 1. Inventaire de tous les caracteres tirets U+2010..U+2015 */
const names = { 0x2010: 'HYPHEN', 0x2011: 'NB-HYPHEN', 0x2012: 'FIGURE', 0x2013: 'EN', 0x2014: 'EM', 0x2015: 'BAR' };
files.forEach(function (f) {
    const c = fs.readFileSync(path.join(base, f), 'utf8');
    const counts = {};
    for (const ch of c) {
        const cp = ch.codePointAt(0);
        if (names[cp]) counts[names[cp]] = (counts[names[cp]] || 0) + 1;
    }
    console.log(f, JSON.stringify(counts));
});
