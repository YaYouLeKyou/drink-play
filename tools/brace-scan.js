// Usage: node tools/brace-scan.js <path> [--final]
const fs = require('fs');
const s = fs.readFileSync(process.argv[2] || 'true-detective/app.js', 'utf8');
const lines = s.split('\n');
let depth = 0, inStr = null, esc = false, inBlock = false;
const ones = [];
for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    for (let j = 0; j < L.length; j++) {
        const c = L[j], n = L[j + 1];
        if (esc) { esc = false; continue; }
        if (c === '\\') { esc = true; continue; }
        if (inStr) { if (c === inStr) inStr = null; continue; }
        if (inBlock) { if (c === '*' && n === '/') { inBlock = false; j++; } continue; }
        if (c === '/' && n === '/') { break; }
        if (c === '/' && n === '*') { inBlock = true; j++; continue; }
        if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
        if (c === '{') depth++;
        if (c === '}') depth--;
    }
    if (depth === 1) ones.push(i + 1);
}
console.log(process.argv[2] || 'app.js', '=> total lines:', lines.length, '| final depth:', depth, '| last depth-1 line:', ones[ones.length - 1]);
