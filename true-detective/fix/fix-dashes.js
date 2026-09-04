const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');
const files = ['narration.js', 'scenario.js', 'minigames.js'];

const EM = String.fromCharCode(0x2014);

files.forEach(function (f) {
    const p = path.join(base, f);
    let c = fs.readFileSync(p, 'utf8');
    const before = (c.match(new RegExp(EM, 'g')) || []).length;
    /* Tiret cadratin en incise : « mot — mot » devient « mot, mot » */
    c = c.split(' ' + EM + ' ').join(', ');
    /* Liste : retour à la ligne suivi d'un tiret => supprime le tiret */
    c = c.split('\n' + EM + ' ').join('\n');
    c = c.split('\\n' + EM + ' ').join('\\n');
    /* Tiret isolé restant */
    c = c.split(' ' + EM).join(',');
    c = c.split(EM + ' ').join('');
    c = c.split(EM).join(',');
    fs.writeFileSync(p, c, 'utf8');
    const after = (c.match(new RegExp(EM, 'g')) || []).length;
    console.log(f + ': ' + before + ' -> ' + after);
});

/* index.html : placeholders ',' laisses par un ancien script => '...' */
const ih = path.join(base, 'index.html');
let h = fs.readFileSync(ih, 'utf8');
const ihBefore = (h.match(/id="solution-[a-z-]+">,</g) || []).length;
h = h.replace(/(id="solution-[a-z-]+">),/g, '$1...');
fs.writeFileSync(ih, h, 'utf8');
console.log('index.html placeholders corriges: ' + ihBefore);
