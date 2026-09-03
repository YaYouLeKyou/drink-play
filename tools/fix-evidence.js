const fs = require('fs');
const f = 'd:\\dev projects\\2020-2025\\myGames\\drink&play\\true-detective\\phases.js';
let content = fs.readFileSync(f, 'utf8');
let lines = content.split(/\r?\n/);
const cleaned = [];
let removed = 0;
for (const line of lines) {
    if (/^\s*evidence: '\w+',?\s*$/.test(line)) { removed++; continue; }
    cleaned.push(line);
}
console.log('removed ' + removed + ' evidence lines');
const insertions = [
    { line: 82, cat: 'forensic' },
    { line: 140, cat: 'witness' },
    { line: 228, cat: 'timeline' },
    { line: 245, cat: 'timeline' },
    { line: 283, cat: 'forensic' },
    { line: 299, cat: 'mobile' },
    { line: 357, cat: 'timeline' },
    { line: 378, cat: 'timeline' },
    { line: 420, cat: 'alibi' },
    { line: 446, cat: 'opportunity' }
];
for (const ins of insertions) {
    const idx = ins.line - 1;
    const indent = cleaned[idx].replace(/^(\s*).*$/, '$1');
    cleaned.splice(idx, 0, indent + "evidence: '" + ins.cat + "',");
}
fs.writeFileSync(f, cleaned.join('\r\n'));
console.log('inserted 10 evidence lines, written with CRLF');

