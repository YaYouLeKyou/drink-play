const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'minigames.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Remove the title leak that reveals the time of death on the watch face image
const oldTitle = "face.title = lang === 'fr' ? 'La montre figée à ' + timeStr + '…' : 'The watch frozen at ' + timeStr + '…';";
const newTitle = "face.title = lang === 'fr' ? 'Montre de poche du Duc, brisée dans la bagarre.' : 'The Duke\\'s pocket watch, broken in the struggle.';";

if (content.includes(oldTitle)) {
    content = content.replace(oldTitle, newTitle);
    console.log('Fixed watch face title leak');
} else {
    console.log('WARNING: old title pattern not found');
}

// Fix 2: Remove the default '22h09' fallback in minigames.js line 890
const oldFallback = "var timeStr = cfg.timeStr || '22h09';";
const newFallback = "var timeStr = cfg.timeStr || '??h??';";

if (content.includes(oldFallback)) {
    content = content.replace(oldFallback, newFallback);
    console.log('Fixed timeStr fallback');
} else {
    console.log('WARNING: timeStr fallback pattern not found');
}

// Fix 3: Remove the default '22h09' fallback in minigames.js line 267
const oldFallback2 = "var timeStr = ctx.timeStr || '22h09';";
const newFallback2 = "var timeStr = ctx.timeStr || '??h??';";

if (content.includes(oldFallback2)) {
    content = content.replace(oldFallback2, newFallback2);
    console.log('Fixed ctx.timeStr fallback');
} else {
    console.log('WARNING: ctx.timeStr fallback pattern not found');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done');
