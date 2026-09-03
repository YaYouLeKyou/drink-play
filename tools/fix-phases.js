// Fix corrupted apostrophes in phases.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'true-detective', 'phases.js');
let content = fs.readFileSync(filePath, 'utf8');

// The problem: backslash-apostrophe sequences are malformed
// We need \' (backslash + apostrophe) inside JS strings
// The file has \\' (double backslash + apostrophe) which breaks JS

// Step 1: Replace any \\' with \'
content = content.replace(/\\\\'/g, "\\'");

// Step 2: Ensure French words with apostrophes are properly escaped
// Patterns like l', d', qu', n', s', c', j', m', etc.
// These should be \' inside the JS strings
content = content.replace(/(['"])([^'"]*?)([ldncqsjmp])\\?'$/gm, "$1$2$3\\'$4");

// Actually, let's be more precise. The issue is that in the raw file,
// sequences like \\'larme should be \'larme
// Let's just fix the remaining \\' patterns
content = content.replace(/\\\\'/g, "\\'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed apostrophes in phases.js');
