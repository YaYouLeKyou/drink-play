const fs = require('fs');
const p = 'd:/dev projects/2020-2025/myGames/drink&play/true-detective/';
eval(fs.readFileSync(p + 'narration.js', 'utf8'));
eval(fs.readFileSync(p + 'phases.js', 'utf8'));
const N = globalThis.TDNarration, PH = globalThis.TDPhases;
let errs = [];
const ids = ['protecteur', 'femme-fatale', 'suspect', 'seducteur', 'marginal', 'criminel'];
ids.forEach(id => {
    const d = N.interrogations[id];
    if (!d) { errs.push('missing ' + id); return; }
    if (!d.rounds2 || d.rounds2.length !== 3) errs.push(id + ' rounds2!=3');
    if (!d.rounds3 || d.rounds3.length !== 3) errs.push(id + ' rounds3!=3');
    if (!d.questions || d.questions.length !== 3) errs.push(id + ' questions!=3');
    [d.questions, d.rounds2, d.rounds3].forEach((r, i) => r.forEach(q => {
        if (!q.label || !q.label.fr || !q.label.en) errs.push(id + ' r' + (i + 1) + ' label');
        if (!q.response || !q.response.fr || !q.response.en) errs.push(id + ' r' + (i + 1) + ' response');
        if (!/\[(Indice|Clue)/.test(q.response.fr)) errs.push(id + ' r' + (i + 1) + ' no clue fr');
        if (!['alibi', 'mobile', 'opportunity', 'forensic', 'witness', 'timeline'].includes(q.evidence)) errs.push(id + ' r' + (i + 1) + ' bad evidence ' + q.evidence);
    }));
});
let interroPages = 0;
PH.forEach(ph => ph.pages.forEach(pg => {
    if (pg.interrogation) {
        interroPages++;
        if (!N.interrogations[pg.interrogation]) errs.push('phase page bad id ' + pg.interrogation);
        if (/\[Indice/.test(pg.text.fr)) errs.push('page still has clue: ' + pg.interrogation);
    }
}));
console.log('interrogation pages:', interroPages);
console.log(errs.length ? ('ERRORS:\n' + errs.join('\n')) : 'ALL OK');