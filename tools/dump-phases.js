const vm = require('vm'), fs = require('fs');
const src = fs.readFileSync('true-detective/phases.js', 'utf8');
const sandbox = { window: {} };
sandbox.self = sandbox.window;
sandbox.globalThis = sandbox.window;
vm.createContext(sandbox);
// phases.js probably ends with })(window) or global
const m = vm.runInNewContext('(function(){const w={};const g=w;const fn=new Function("global","window",arguments.callee?0:0);return 0})()', {});
// Simpler: run with global param pointing to window
vm.runInNewContext(src, { window: sandbox.window, globalThis: sandbox.window, global: sandbox.window });
const P = sandbox.window.TDPhases;
if (!P) { console.log('keys:', Object.keys(sandbox.window)); process.exit(1); }
P.forEach(p => {
    console.log('### ' + p.id + ' [' + p.act + '] ' + (p.label && p.label.fr) + ' pages=' + p.pages.length);
    p.pages.forEach((pg, i) => {
        const npc = pg.npc || '-';
        const it = pg.interrogation || '-';
        const mg = pg.minigame ? 'MG=' + pg.minigame.type : '';
        const ch = pg.choices ? 'choices(' + pg.choices.length + ':' + (pg.choices[0].choiceKey || '') + ')' : '';
        console.log('  p' + (i + 1) + ' npc=' + npc + ' interro=' + it + ' ' + mg + ' ' + ch);
    });
});
