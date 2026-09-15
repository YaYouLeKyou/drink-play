const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync('true-detective/narration.js', 'utf8');
const sb = { window: {}, console: console };
vm.createContext(sb);
vm.runInContext(src + '\n;__out = window.TDNarration;', sb, { timeout: 10000 });
const N = sb.window.TDNarration || sb.TDNarration;
if (!N || !N.interrogations) { console.log('keys:', Object.keys(N || sb.window)); process.exit(1); }
Object.keys(N.interrogations).forEach(k => {
    const it = N.interrogations[k];
    const rounds = it.rounds || (it.questions && it.questions) || [];
    console.log('### ' + k + ' rounds=' + (it.rounds ? it.rounds.length : '?'));
    if (it.rounds) it.rounds.forEach((r, i) => {
        const mg = r.minigame ? ' -> MG=' + JSON.stringify(r.minigame).slice(0, 140) : '';
        const qs = r.questions ? r.questions.map(q => q.id || (q.label && (q.label.fr || q.label)) || '?').join('|') : (r.length ? 'raw' : '?');
        console.log('  r' + i + ' q=' + String(qs).slice(0, 120) + mg);
    });
    else console.log('  RAW:', JSON.stringify(it).slice(0, 300));
});
