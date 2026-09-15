const fs = require('fs');
const dir = 'true-detective';
// Mojibake detection: sequences typical of UTF-8 read as Latin-1:
// "Ã" followed by a Latin-1 accent char, "â" + U+0080-BF (smart quotes/dashes/emoji),
// "Â" + anything, "ð" + high char, lone U+FFFD.
const RE = /(\u00C3[\u00A0-\u00BF\u0088\u0090\u0098\u009C\u00A4\u00A7\u00A9\u00AB\u00B4\u00BB]|\u00C2.|\u00E2[\u0080-\u00BF\u00A0-\u00BE]|\u00F0[\u0090-\u009F]|\uFFFD)/g;
fs.readdirSync(dir).filter(f => /\.(js|html|css|md|txt)$/i.test(f)).forEach(f => {
    const s = fs.readFileSync(dir + '/' + f, 'utf8');
    const m = s.match(RE);
    if (m && m.length) {
        console.log('== ' + f + ' : ' + m.length + ' mojibake hits');
        const lines = s.split('\n');
        let shown = 0;
        lines.forEach((l, n) => {
            if (RE.test(l) && shown < 8) { RE.lastIndex = 0; console.log('  L' + (n + 1) + ': ' + JSON.stringify(l.trim().slice(0, 100))); shown++; }
            RE.lastIndex = 0;
        });
    }
});
