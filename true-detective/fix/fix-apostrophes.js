const fs = require('fs');
const file = 'true-detective/phases.js';
let content = fs.readFileSync(file, 'utf8');

// Fix ALL unescaped apostrophes between word characters (French l', d', qu', etc.)
// Match: word_char + apostrophe + word_char (not already escaped)
// Replace with: word_char + backslash + apostrophe + word_char
const regex = /(\w)'(\w)/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
}
content = content.replace(regex, "$1\\'$2");

fs.writeFileSync(file, content, 'utf8');
console.log(`Fixed ${count} unescaped apostrophes in ${file}`);