const fs = require('fs');
const p = 'true-detective/narration.js';
let c = fs.readFileSync(p, 'utf8');
const BS = String.fromCharCode(92);
// état actuel : \ \" \ \"  (deux quotes échappées, chaîne jamais fermée)
// état voulu : \ \" "     (une quote échappée + fermeture de la chaîne)
const FROM = BS + '"' + BS + '"';
const TO = BS + '""';
const anchors = ['landmark.' + FROM + ' },', 'figures only.' + FROM + ' },', 'trade.' + FROM + ' },'];
let fixed = 0;
for (const a of anchors) {
  const to = a.replace(FROM, TO);
  if (c.indexOf(a) >= 0) { c = c.split(a).join(to); fixed++; }
}
fs.writeFileSync(p, c, 'utf8');
console.log('fixed:', fixed);
