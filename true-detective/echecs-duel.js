/* ECHECS DUEL A: config textes pont */
(function () {
'use strict';
var CFG_KEY = 'td_echecs_duel_cfg';
var RES_KEY = 'td_echecs_duel_result';
var MANOR = {
'agatha-christie': 'assets/image true detective/lieux/classic/interieur manoir.png',
'cyberpunk': 'assets/image true detective/lieux/cyberpunk/interieur-manoir.png',
'film-noir': 'assets/image true detective/lieux/noire/exterieur manoir.png'
};
var PORTRAIT = {
'agatha-christie': 'assets/image true detective/characteres/classic/femme-fatal.png',
'cyberpunk': 'assets/image true detective/characteres/cyberpunk/femme-fatal.png',
'film-noir': 'assets/image true detective/characteres/noire/femme fatal.png'
};
var DIFF_DEPTH = { easy: 1, medium: 2, hard: 2, extreme: 3 };
var DIFF_BLUNDER = { easy: 0.35, medium: 0.12, hard: 0.03, extreme: 0.0 };
var lang = 'fr', difficulty = 'medium', theme = 'agatha-christie';
var cfgClueWin = null, cfgClueLose = null;
function TT() { return lang === 'en' ? TEN : TFR; }
var TFR = {
briefing: "L'interrogatoire de Lady Vivienne pietine. Elle fait glisser l'echiquier du manoir : Les mots vous ennuient ? Jouons. Chaque piece prise m'arrachera une verite.",
stakes: "ENJEU : gagnez -> indice final. Perdez -> l'histoire continue, avec une fausse piste.",
winTitle: "Echec et mat - Vivienne craque !",
winText: "Le roi noir bascule. Assez ! Vous avez gagne, inspecteur. Ecoutez bien...",
loseTitle: "Echec et mat - Vivienne triomphe",
loseText: "Echec et mat, inspecteur. Je mene la danse. L'histoire continue.",
drawTitle: "Nulle - Partie suspendue", drawText: "Une nulle... comme notre duel verbal.",
abandonTitle: "Vous renversez l'echiquier", abandonText: "Vous fuyez le jeu ? Le manoir garde ses secrets...",
finalWin: "INDICE FINAL - La panne du Seducteur etait factice, durite sectionnee de l'interieur. Les versements a V.K. passaient par le coffre du manoir. Suivez l'argent.",
finalLose: "PISTE TROUBLE - Cherchez du cote du bar... Pembrooke sait tout. Fausse piste : la verite est au manoir.",
recap: "Fin de l'interrogatoire : Vivienne exige un duel d'echecs dans le salon du manoir."
};
var TEN = {
briefing: "Vivienne interrogation stalls. She slides the chessboard: Words bore you? Let us play.",
stakes: "STAKES: win -> final clue. Lose -> story goes on, with a false lead.",
winTitle: "Checkmate - Vivienne cracks!", winText: "The black king topples. Enough! You won...",
loseTitle: "Checkmate - Vivienne triumphs", loseText: "Checkmate, inspector. I lead the dance.",
drawTitle: "Draw - suspended", drawText: "A draw... like our verbal duel.",
abandonTitle: "You knock over the board", abandonText: "Fleeing the game? The manor keeps its secrets...",
finalWin: "FINAL CLUE - Breakdown was staged, hose cut from inside. V.K. payments went through the safe.",
finalLose: "FALSE LEAD - Look toward the bar... Truth is at the manor.",
recap: "Interrogation ends: Vivienne demands a chess duel in the manor lounge."
};

var TAUNTS_FR = [
"Un pion d'abord ? Prudent... ou peureux ? Et cette montre brisee, a qui etait-elle ?",
"Joli coup. Mais le coffre... qui l'a vraiment vide ?",
"Vous avancez comme Hale vers moi : droit dans le mur. Que faisait-il cette nuit-la ?",
"Pembrooke vous a-t-il parle de sa panne ? Les echecs sont comme mes amants : ils tombent.",
"Victor Krane jouait aussi... aux echecs et aux couteaux. L'avez-vous cuisine ?",
"Les murs ont vu la durite... sectionnee. Par qui, a votre avis ?",
"Blackwood doit tant d'argent... a qui, deja ? Vous transpirez.",
"Silas a vu quelque chose a 22h, dit-on... Encore un coup et je me confie."
];
var TAUNTS_EN = [
"A pawn first? Careful... or fearful? Whose broken watch was it?",
"Nice move. But the safe... who really emptied it?",
"You advance like Hale toward me: into the wall. What was he doing?",
"Did Pembrooke tell you of his breakdown? Lovers fall like pieces.",
"Krane played too... chess and knives. Did you grill him?",
"The walls saw the hose... cut. By whom?",
"Blackwood owes so much... to whom? You are sweating.",
"Silas saw something at 10pm... One more move and I confide."
];
var TRUE_FR = [
"Un fragment de verite : la durite de Pembrooke n'a pas lache toute seule.",
"Les versements a V.K. ? Regardez qui avait la cle du coffre.",
"Hale rodait pres du pavillon cette nuit-la. Demandez-lui pourquoi."
];
var FALSE_FR = [
"Pembrooke m'a tout avoue au bar. C'est lui... (regard fuyant : fausse piste)",
"Le coffre ? Jamais touche, jamais vu. (doigts tremblants : mensonge probable)",
"Cette nuit-la, j'etais seule. Ni preuve, ni contradiction. (alibi a verifier)"
];
var TRUE_EN = ["Truth: the hose did not fail on its own.", "V.K. payments? Look who held the safe key.", "Hale lurked near the pavilion. Ask him why."];
var FALSE_EN = ["Pembrooke confessed at the bar... (false lead)", "The safe? Never touched it. (probable lie)", "That night I was alone. No proof either way."];
function getTaunts() { return lang === 'en' ? TAUNTS_EN : TAUNTS_FR; }
function getTrueD() { return lang === 'en' ? TRUE_EN : TRUE_FR; }
function getFalseD() { return lang === 'en' ? FALSE_EN : FALSE_FR; }
function loadCfg() {
try {
var q = new URLSearchParams(window.location.search);
var l = q.get('lang'); if (l === 'en' || l === 'fr') lang = l;
var dd = q.get('difficulty'); if (dd && DIFF_DEPTH[dd]) difficulty = dd;
var th = q.get('theme'); if (th && MANOR[th]) theme = th;
} catch (e) {}
try {
var raw = localStorage.getItem(CFG_KEY);
if (raw) { var c = JSON.parse(raw); if (c.lang === 'en' || c.lang === 'fr') lang = c.lang; if (c.difficulty && DIFF_DEPTH[c.difficulty]) difficulty = c.difficulty; if (c.theme && MANOR[c.theme]) theme = c.theme; if (c.clueWin) cfgClueWin = c.clueWin; if (c.clueLose) cfgClueLose = c.clueLose; }
} catch (e2) {}
}
function finalWinText() { return cfgClueWin || TT().finalWin; }
function finalLoseText() { return cfgClueLose || TT().finalLose; }
/* moteur B */
/* moteur B: coups legaux + application */
var INIT = [['bR','bN','bB','bQ','bK','bB','bN','bR'],['bP','bP','bP','bP','bP','bP','bP','bP'],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['wP','wP','wP','wP','wP','wP','wP','wP'],['wR','wN','wB','wQ','wK','wB','wN','wR']];
var VALS = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
function colOf(p) { return !p ? null : (p.charAt(0) === 'w' ? 'w' : 'b'); }
function typeOf(p) { return !p ? null : p.charAt(1); }
function inB(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneB(b) { var o = []; for (var i = 0; i < 8; i++) o.push(b[i].slice()); return o; }
function findK(bd, col) { var k = col === 'w' ? 'wK' : 'bK'; for (var r = 0; r < 8; r++) { for (var c = 0; c < 8; c++) { if (bd[r][c] === k) return { r: r, c: c }; } } return null; }
function attacked(bd, r, c, by) {
var i, j, k, rr, cc;
for (i = 0; i < 8; i++) { for (j = 0; j < 8; j++) {
var p = bd[i][j]; if (!p || colOf(p) !== by) continue;
var t = typeOf(p);
if (t === 'P') { var d = by === 'w' ? -1 : 1; if (i + d === r && (j - 1 === c || j + 1 === c)) return true; continue; }
if (t === 'N') { var dr = i > r ? i - r : r - i, dc = j > c ? j - c : c - j; if ((dr === 2 && dc === 1) || (dr === 1 && dc === 2)) return true; continue; }
if (t === 'K') { var ar = i > r ? i - r : r - i, ac = j > c ? j - c : c - j; if (ar <= 1 && ac <= 1 && (ar + ac) > 0) return true; continue; }
var D = t === 'R' ? [[-1,0],[1,0],[0,-1],[0,1]] : t === 'B' ? [[-1,-1],[-1,1],[1,-1],[1,1]] : [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
for (k = 0; k < D.length; k++) { rr = i + D[k][0]; cc = j + D[k][1]; while (inB(rr, cc)) { if (rr === r && cc === c) return true; if (bd[rr][cc]) break; rr += D[k][0]; cc += D[k][1]; } }
} }
return false;
}
function inCheck(bd, col) { var k = findK(bd, col); if (!k) return false; return attacked(bd, k.r, k.c, col === 'w' ? 'b' : 'w'); }

var TRUE_EN = ["Truth: the hose did not fail on its own.", "V.K. payments? Look who held the safe key.", "Hale lurked near the pavilion. Ask him why."];
var FALSE_EN = ["Pembrooke confessed at the bar... (false lead)", "The safe? Never touched it. (probable lie)", "That night I was alone. No proof either way."];
function slideM(bd, r, c, col, out, D) {
for (var k = 0; k < D.length; k++) {
var rr = r + D[k][0], cc = c + D[k][1];
while (inB(rr, cc)) { var q = bd[rr][cc]; if (!q) { out.push({ fr: r, fc: c, tr: rr, tc: cc }); } else { if (colOf(q) !== col) out.push({ fr: r, fc: c, tr: rr, tc: cc }); break; } rr += D[k][0]; cc += D[k][1]; }
}
}
function pseudoM(bd, r, c, st) {
var out = [], p = bd[r][c]; if (!p) return out;
var col = colOf(p), t = typeOf(p);
var d, start, last, rr, cc, q, k2;
if (t === 'P') {
d = col === 'w' ? -1 : 1; start = col === 'w' ? 6 : 1; last = col === 'w' ? 0 : 7;
if (inB(r + d, c) && !bd[r + d][c]) {
out.push({ fr: r, fc: c, tr: r + d, tc: c, promo: (r + d === last) ? 1 : 0 });
if (r === start && !bd[r + 2 * d][c]) out.push({ fr: r, fc: c, tr: r + 2 * d, tc: c, dbl: 1 });
}
for (k2 = -1; k2 <= 1; k2 += 2) {
rr = r + d; cc = c + k2; if (!inB(rr, cc)) continue;
q = bd[rr][cc];
if (q && colOf(q) !== col) out.push({ fr: r, fc: c, tr: rr, tc: cc, promo: (rr === last) ? 1 : 0 });
if (!q && st && st.ep && st.ep.r === rr && st.ep.c === cc) out.push({ fr: r, fc: c, tr: rr, tc: cc, ep: 1 });
}
return out;
}
if (t === 'N') {
var J = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
for (k2 = 0; k2 < J.length; k2++) { rr = r + J[k2][0]; cc = c + J[k2][1]; if (!inB(rr, cc)) continue; q = bd[rr][cc]; if (!q || colOf(q) !== col) out.push({ fr: r, fc: c, tr: rr, tc: cc }); }
return out;
}
if (t === 'B') { slideM(bd, r, c, col, out, [[-1,-1],[-1,1],[1,-1],[1,1]]); return out; }
if (t === 'R') { slideM(bd, r, c, col, out, [[-1,0],[1,0],[0,-1],[0,1]]); return out; }
if (t === 'Q') { slideM(bd, r, c, col, out, [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]); return out; }
var KS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
for (k2 = 0; k2 < KS.length; k2++) { rr = r + KS[k2][0]; cc = c + KS[k2][1]; if (!inB(rr, cc)) continue; q = bd[rr][cc]; if (!q || colOf(q) !== col) out.push({ fr: r, fc: c, tr: rr, tc: cc }); }
if (st && !inCheck(bd, col) && r === (col === 'w' ? 7 : 0) && c === 4) {
var home = col === 'w' ? 7 : 0, opp = col === 'w' ? 'b' : 'w';
var ck = col === 'w' ? st.wk : st.bk, cq = col === 'w' ? st.wq : st.bq;
var rookK = col === 'w' ? 'wR' : 'bR';
if (ck && !bd[home][5] && !bd[home][6] && bd[home][7] === rookK && !attacked(bd, home, 4, opp) && !attacked(bd, home, 5, opp) && !attacked(bd, home, 6, opp)) out.push({ fr: r, fc: c, tr: home, tc: 6, castle: 'k' });
if (cq && !bd[home][3] && !bd[home][2] && !bd[home][1] && bd[home][0] === rookK && !attacked(bd, home, 4, opp) && !attacked(bd, home, 3, opp) && !attacked(bd, home, 2, opp)) out.push({ fr: r, fc: c, tr: home, tc: 2, castle: 'q' });
}
return out;
}

function el(id) { return document.getElementById(id); }

function applyM(bd, m, st) {
var nb = cloneB(bd);
var nst = st ? { wk: st.wk, wq: st.wq, bk: st.bk, bq: st.bq, ep: null } : { wk: true, wq: true, bk: true, bq: true, ep: null };
var p = nb[m.fr][m.fc];
if (m.ep) { var dd = colOf(p) === 'w' ? 1 : -1; nb[m.tr + dd][m.tc] = ''; }
nb[m.tr][m.tc] = p; nb[m.fr][m.fc] = '';
if (m.promo) nb[m.tr][m.tc] = colOf(p) + 'Q';
if (m.castle) { var hh = m.fr; if (m.castle === 'k') { nb[hh][5] = nb[hh][7]; nb[hh][7] = ''; } else { nb[hh][3] = nb[hh][0]; nb[hh][0] = ''; } }
if (p === 'wK') { nst.wk = false; nst.wq = false; }
if (p === 'bK') { nst.bk = false; nst.bq = false; }
if (p === 'wR' && m.fr === 7 && m.fc === 0) nst.wq = false;
if (p === 'wR' && m.fr === 7 && m.fc === 7) nst.wk = false;
if (p === 'bR' && m.fr === 0 && m.fc === 0) nst.bq = false;
if (p === 'bR' && m.fr === 0 && m.fc === 7) nst.bk = false;
if (typeOf(p) === 'P' && (m.tr - m.fr === 2 || m.tr - m.fr === -2)) nst.ep = { r: (m.fr + m.tr) / 2, c: m.fc };
return { board: nb, st: nst };
}
function legalM(bd, r, c, st) {
var all = pseudoM(bd, r, c, st), out = [], my = colOf(bd[r][c]);
for (var i = 0; i < all.length; i++) { var z = applyM(bd, all[i], st); if (!inCheck(z.board, my)) out.push(all[i]); }
return out;
}

function allLegalM(bd, col, st) {
var out = [];
for (var r = 0; r < 8; r++) { for (var c = 0; c < 8; c++) { if (bd[r][c] && colOf(bd[r][c]) === col) { var l = legalM(bd, r, c, st); for (var i = 0; i < l.length; i++) out.push(l[i]); } } }
return out;
}
function evaluateM(bd) {
var s = 0;
var PB = [0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0];
for (var r = 0; r < 8; r++) { for (var c = 0; c < 8; c++) {
var p = bd[r][c]; if (!p) continue;
var t = typeOf(p), col = colOf(p), v = VALS[t] || 0;
if (t === 'P') v += col === 'w' ? PB[r * 8 + c] : PB[(7 - r) * 8 + c];
s += col === 'w' ? v : -v;
} }
return s;
}
function minimaxM(bd, st, depth, alpha, beta, maxing) {
var wm = allLegalM(bd, 'w', st), bm = allLegalM(bd, 'b', st);
if (!wm.length) return inCheck(bd, 'w') ? -100000 - depth : 0;
if (!bm.length) return inCheck(bd, 'b') ? 100000 + depth : 0;
if (depth === 0) return evaluateM(bd);
var want = maxing ? 'w' : 'b', moves = [], r, c, i;
for (r = 0; r < 8; r++) { for (c = 0; c < 8; c++) { if (bd[r][c] && colOf(bd[r][c]) === want) { var l = legalM(bd, r, c, st); for (i = 0; i < l.length; i++) moves.push(l[i]); } } }
for (i = moves.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = moves[i]; moves[i] = moves[j]; moves[j] = tmp; }
if (maxing) { var best = -9999999; for (i = 0; i < moves.length; i++) { var z = applyM(bd, moves[i], st); var v = minimaxM(z.board, z.st, depth - 1, alpha, beta, false); if (v > best) best = v; if (v > alpha) alpha = v; if (beta <= alpha) break; } return best; }
var best2 = 9999999; for (i = 0; i < moves.length; i++) { var z2 = applyM(bd, moves[i], st); var v2 = minimaxM(z2.board, z2.st, depth - 1, alpha, beta, true); if (v2 < best2) best2 = v2; if (v2 < beta) beta = v2; if (beta <= alpha) break; } return best2;
}
function aiBestM(bd, st, depth, blunder) {
var moves = allLegalM(bd, 'b', st); if (!moves.length) return null;
for (var i = moves.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = moves[i]; moves[i] = moves[j]; moves[j] = tmp; }
if (blunder > 0 && Math.random() < blunder) return moves[Math.floor(Math.random() * moves.length)];
var best = moves[0], bs = 9999999;
for (var k = 0; k < moves.length; k++) { var z = applyM(bd, moves[k], st); var v = minimaxM(z.board, z.st, depth > 1 ? depth - 1 : 0, -9999999, 9999999, true); if (v < bs) { bs = v; best = moves[k]; } }
return best;
}

function hintBestM(bd, st) {
var moves = allLegalM(bd, 'w', st); if (!moves.length) return null;
var best = moves[0], bs = -9999999;
for (var k = 0; k < moves.length; k++) { var z = applyM(bd, moves[k], st); var v = minimaxM(z.board, z.st, 1, -9999999, 9999999, false); if (v > bs) { bs = v; best = moves[k]; } }
return best;
}
/* partie C: etat + rendu + coups + fin + init */
var board, castling, turn, selected, gameOver, started, halfMoves, noCapPawn;
var lastMove, moveList, tension, dripTrue, dripFalse, tauntIdx, typeTimer, timeLeft, clockTimer, hintUsed;
var GLYPH = { wK: '♚', wQ: '♛', wR: '♜', wB: '♝', wN: '♞', wP: '♟', bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟' };
function sqName(m) { var F = 'abcdefgh'; return F.charAt(m.fc) + (8 - m.fr) + '-' + F.charAt(m.tc) + (8 - m.tr); }
function setSpeech(t) {
var box = el('speech-text'); if (!box) return;
if (typeTimer) clearInterval(typeTimer);
box.textContent = ''; var i = 0;
typeTimer = setInterval(function () { i += 2; box.textContent = t.slice(0, i); if (i >= t.length) clearInterval(typeTimer); }, 18);
}
function addFeed(text, cls) {
var ul = el('clue-list'); if (!ul) return;
var li = document.createElement('li'); if (cls) li.className = cls; li.textContent = text;
ul.appendChild(li); ul.scrollTop = ul.scrollHeight;
while (ul.children.length > 12) ul.removeChild(ul.firstChild);
}
function setTension(v) {
tension = Math.max(0, Math.min(100, v));
var f = el('tension-fill'), vv = el('tension-value'), ring = el('tension-ring');
function renderDuel() {
var bd = el('chess-board'); if (!bd) return;
bd.innerHTML = '';
var wk = inCheck(board, 'w') ? findK(board, 'w') : null;
var bk = inCheck(board, 'b') ? findK(board, 'b') : null;
var leg = selected ? legalM(board, selected.r, selected.c, castling) : [];
var r, c, i;
for (r = 0; r < 8; r++) { for (c = 0; c < 8; c++) {
var d = document.createElement('div');
d.className = 'sq ' + (((r + c) % 2 === 0) ? 'light' : 'dark');
d.setAttribute('data-r', r); d.setAttribute('data-c', c);
var p = board[r][c];
if (p) { var s = document.createElement('span'); s.className = p.charAt(0) === 'w' ? 'pc-w' : 'pc-b'; s.textContent = GLYPH[p] || '?'; d.appendChild(s); }
if (selected && selected.r === r && selected.c === c) d.classList.add('sel');
if (lastMove && ((lastMove.fr === r && lastMove.fc === c) || (lastMove.tr === r && lastMove.tc === c))) d.classList.add('lastmove');
if (wk && wk.r === r && wk.c === c && turn === 'w') d.classList.add('check');
if (bk && bk.r === r && bk.c === c && turn === 'b') d.classList.add('check');
for (i = 0; i < leg.length; i++) { if (leg[i].tr === r && leg[i].tc === c) d.classList.add(board[r][c] ? 'capture-hint' : 'legal'); }
(function (rr, cc) { d.addEventListener('click', function () { onSquare(rr, cc); }); })(r, c);
bd.appendChild(d);
} }
var cb = el('captured-black'); if (cb) cb.textContent = capturedIcons('b');
var cw = el('captured-white'); if (cw) cw.textContent = capturedIcons('w');
var ht = el('hud-turn');
if (ht) ht.textContent = gameOver ? (lang === 'en' ? 'Game over' : 'Partie terminee') : (turn === 'w' ? (lang === 'en' ? 'Your move - White' : 'A vous - Blancs') : (lang === 'en' ? 'Vivienne thinks...' : 'Vivienne reflechit...'));
var hm = el('hud-moves'); if (hm) hm.textContent = (lang === 'en' ? 'Moves: ' : 'Coups : ') + moveList.length;
var hist = el('history-strip'); if (hist) hist.textContent = moveList.slice(-14).join(' ');
var ml = el('moves-list'); if (ml) { ml.innerHTML = ''; for (i = 0; i < moveList.length; i++) { var li = document.createElement('li'); li.textContent = moveList[i]; ml.appendChild(li); } ml.scrollTop = ml.scrollHeight; }
}
function capturedIcons(forCol) {
var start = { P: 8, N: 2, B: 2, R: 2, Q: 1 }, cur = { P: 0, N: 0, B: 0, R: 0, Q: 0 }, r, c;
for (r = 0; r < 8; r++) { for (c = 0; c < 8; c++) { var p = board[r][c]; if (p && colOf(p) === forCol && cur[typeOf(p)] !== undefined) cur[typeOf(p)]++; } }
var out = '', G = { Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' }, keys = ['Q','R','B','N','P'];
for (var k = 0; k < keys.length; k++) { var miss = start[keys[k]] - cur[keys[k]]; for (var i = 0; i < miss; i++) out += G[keys[k]] + ' '; }
return out.replace(/ $/, '');
}

function resetDuel() {
board = cloneB(INIT); castling = { wk: true, wq: true, bk: true, bq: true, ep: null };
turn = 'w'; selected = null; gameOver = false; halfMoves = 0; noCapPawn = 0;
lastMove = null; moveList = []; tension = 0; dripTrue = 0; dripFalse = 0; tauntIdx = 0; hintUsed = false; timeLeft = 600;
setTension(0);
var ul = el('clue-list'); if (ul) ul.innerHTML = '';
var ov = el('board-overlay'); if (ov) ov.classList.add('hidden');
renderDuel();
if (clockTimer) clearInterval(clockTimer);
clockTimer = setInterval(function () {
if (!started || gameOver) return;
timeLeft--; if (timeLeft < 0) timeLeft = 0;
var mm = Math.floor(timeLeft / 60), ss = timeLeft % 60;
var t = el('hud-timer'); if (t) t.textContent = (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
if (timeLeft === 0) endDuel('draw');
}, 1000);
setSpeech(lang === 'en' ? 'Let us begin gently... what do you seek in this manor?' : 'Commencons doucement... Que cherchez-vous dans ce manoir ?');
}
function onSquare(r, c) {
if (!started || gameOver || turn !== 'w') return;
var p = board[r][c];
if (selected) {
var ms = legalM(board, selected.r, selected.c, castling), hit = null;
for (var i = 0; i < ms.length; i++) { if (ms[i].tr === r && ms[i].tc === c) { hit = ms[i]; break; } }
if (hit) { doPlayerMove(hit); return; }
if (p && colOf(p) === 'w') { selected = { r: r, c: c }; renderDuel(); return; }
selected = null; renderDuel(); return;
}
if (p && colOf(p) === 'w') { selected = { r: r, c: c }; renderDuel(); }
}
function doPlayerMove(m) {
var cap = board[m.tr][m.tc] || (m.ep ? 'bP' : null);
var z = applyM(board, m, castling); board = z.board; castling = z.st;
turn = 'b'; selected = null; lastMove = m; halfMoves++;
moveList.push(halfMoves + '. ' + sqName(m));
if (!cap && typeOf(board[m.tr][m.tc]) !== 'P') noCapPawn++; else noCapPawn = 0;
setTension(tension + (cap ? 9 : 4));
reactVivienne(true, cap);
renderDuel(); checkEndDuel();
if (!gameOver) setTimeout(aiReplyDuel, 450 + Math.random() * 500);
}
function aiReplyDuel() {
if (gameOver || turn !== 'b') return;
var mv = aiBestM(board, castling, DIFF_DEPTH[difficulty] || 2, DIFF_BLUNDER[difficulty] || 0);
if (!mv) { endDuel(inCheck(board, 'b') ? 'white' : 'draw'); return; }
var cap = board[mv.tr][mv.tc] || (mv.ep ? 'wP' : null);
var z = applyM(board, mv, castling); board = z.board; castling = z.st;
turn = 'w'; lastMove = mv;
moveList[moveList.length - 1] += ' ' + sqName(mv);
if (!cap && typeOf(board[mv.tr][mv.tc]) !== 'P') noCapPawn++; else noCapPawn = 0;
setTension(tension + (cap ? 6 : 2));
reactVivienne(false, cap);
renderDuel(); checkEndDuel();
}
function reactVivienne(byPlayer, cap) {
var T = getTaunts(), TR = getTrueD(), FA = getFalseD();
if (cap && byPlayer && dripTrue < TR.length && (moveList.length % 2 === 1 || Math.random() < 0.6)) {
var dt = TR[dripTrue++]; setSpeech(dt); addFeed((lang === 'en' ? 'TRUE: ' : 'VRAI: ') + dt, ''); setTension(tension + 6); return;
}
if (cap && !byPlayer && dripFalse < FA.length && Math.random() < 0.55) {
var df = FA[dripFalse++]; setSpeech(df); addFeed((lang === 'en' ? 'FALSE LEAD? ' : 'FAUSSE PISTE? ') + df, 'false-lead'); return;
}
var t = T[tauntIdx % T.length]; tauntIdx++; setSpeech(t);
}

if (f) f.style.width = tension + '%'; if (vv) vv.textContent = Math.round(tension) + '%';
if (ring) ring.className = 'tension-ring' + (tension >= 66 ? ' lv3' : tension >= 33 ? 'lv2' : tension > 0 ? 'lv1' : '');
}
function checkEndDuel() {
var wm = allLegalM(board, 'w', castling), bm = allLegalM(board, 'b', castling);
if (turn === 'w' && !wm.length) { endDuel(inCheck(board, 'w') ? 'black' : 'draw'); return; }
if (turn === 'b' && !bm.length) { endDuel(inCheck(board, 'b') ? 'white' : 'draw'); return; }
if (noCapPawn >= 100) { endDuel('draw'); return; }
var rest = 0, minor = 0;
for (var r = 0; r < 8; r++) { for (var c = 0; c < 8; c++) { var p = board[r][c]; if (p && typeOf(p) !== 'K') { rest++; if (typeOf(p) === 'B' || typeOf(p) === 'N') minor++; } } }
if (rest === 0 || (rest === 1 && minor === 1)) { endDuel('draw'); return; }
}
function endDuel(result) {
if (gameOver) return; gameOver = true;
if (clockTimer) clearInterval(clockTimer);
var T = TT(), title, text, clue, won;
if (result === 'white') { title = T.winTitle; text = T.winText; clue = finalWinText(); won = true; }
else if (result === 'black') { title = T.loseTitle; text = T.loseText; clue = finalLoseText(); won = false; }
else { title = T.drawTitle; text = T.drawText; clue = finalLoseText(); won = false; result = 'draw'; }
try { localStorage.setItem(RES_KEY, JSON.stringify({ won: won, result: result, clue: clue, moves: moveList.length, difficulty: difficulty, lang: lang, ts: Date.now() })); } catch (e) {}
setSpeech(won ? clue : text);
addFeed((won ? 'INDICE FINAL: ' : 'PISTE: ') + clue, won ? 'final' : 'false-lead');
var ov = el('board-overlay'); if (ov) ov.classList.remove('hidden');
var et = el('end-title'); if (et) et.textContent = title;
var ex = el('end-text'); if (ex) ex.textContent = text;
var ec = el('end-clue'); if (ec) ec.textContent = clue;
var rc = el('end-continue-btn'); if (rc) rc.textContent = lang === 'en' ? 'Continue the story' : "Continuer l'histoire";
var rr = el('end-retry-btn'); if (rr) rr.textContent = lang === 'en' ? 'Replay the duel' : 'Rejouer le duel';
renderDuel();
}
function goBack(won) {
var flag = won ? 'chess=won' : 'chess=lost';
try { var raw = localStorage.getItem(CFG_KEY); var cc = raw ? JSON.parse(raw) : {}; var l = (cc && cc.lang) || lang; window.location.href = 'index.html?' + flag + '&lang=' + l; }
catch (e) { window.location.href = 'index.html?' + flag; }
}
function applyLangUI() {
var T = TT();
var b = el('briefing-text'); if (b) b.textContent = T.briefing;
var s = el('briefing-stakes'); if (s) s.textContent = T.stakes;
var sb = el('start-duel-btn'); if (sb) sb.textContent = lang === 'en' ? 'Start the game' : 'Commencer la partie';
var rc = el('story-recap'); if (rc) rc.textContent = T.recap;
var sk = el('story-stakes'); if (sk) sk.textContent = T.stakes;
var st = el('story-title'); if (st) st.textContent = lang === 'en' ? 'Interrogation file' : "Dossier d'interrogatoire";
var mt = el('moves-title'); if (mt) mt.textContent = lang === 'en' ? 'Moves played' : 'Coups joues';
var cf = el('clue-feed-title'); if (cf) cf.textContent = lang === 'en' ? 'Clue thread' : "Fil d'indices";
var hb = el('hint-btn'); if (hb) hb.textContent = lang === 'en' ? 'Tactical hint' : 'Indice tactique';
var nb = el('new-btn'); if (nb) nb.textContent = lang === 'en' ? 'New game' : 'Nouvelle partie';
var ab = el('abandon-btn'); if (ab) ab.textContent = lang === 'en' ? 'Resign (continue story)' : "Abandonner (continuer l'histoire)";
var lf = el('lang-fr'), le = el('lang-en');
if (lf) { if (lang === 'fr') lf.className = 'lang-btn active-lang'; else lf.className = 'lang-btn'; }
if (le) { if (lang === 'en') le.className = 'lang-btn active-lang'; else le.className = 'lang-btn'; }
}


function initDuel() {
loadCfg(); applyLangUI();
var mb = el('manor-bg'); if (mb) mb.style.backgroundImage = "url('" + (MANOR[theme] || MANOR['agatha-christie']) + "')";
var vi = el('vivienne-img'); if (vi) { vi.src = PORTRAIT[theme] || PORTRAIT['agatha-christie']; vi.onerror = function () { vi.style.display = 'none'; }; }
var bi = el('briefing-img'); if (bi) { bi.src = PORTRAIT[theme] || PORTRAIT['agatha-christie']; bi.onerror = function () { bi.style.display = 'none'; }; }
var files = ['a','b','c','d','e','f','g','h'], k;
var ct = el('coords-top'); if (ct) { ct.innerHTML = ''; for (k = 0; k < 8; k++) { var sf = document.createElement('span'); sf.textContent = files[k]; ct.appendChild(sf); } }
var cb2 = el('coords-bottom'); if (cb2) { cb2.innerHTML = ''; for (k = 0; k < 8; k++) { var sf2 = document.createElement('span'); sf2.textContent = files[k]; cb2.appendChild(sf2); } }
var cl = el('coords-left'); if (cl) { cl.innerHTML = ''; for (k = 8; k >= 1; k--) { var sr = document.createElement('span'); sr.textContent = String(k); cl.appendChild(sr); } }
var cr = el('coords-right'); if (cr) { cr.innerHTML = ''; for (k = 8; k >= 1; k--) { var sr2 = document.createElement('span'); sr2.textContent = String(k); cr.appendChild(sr2); } }
var btns = document.querySelectorAll('.diff-btn');
for (var b = 0; b < btns.length; b++) {
if (btns[b].getAttribute('data-diff') === difficulty) btns[b].className = 'diff-btn active'; else btns[b].className = 'diff-btn';
(function (btn) { btn.addEventListener('click', function () { difficulty = btn.getAttribute('data-diff'); for (var j = 0; j < btns.length; j++) btns[j].className = btns[j] === btn ? 'diff-btn active' : 'diff-btn'; }); })(btns[b]);
}
var lf = el('lang-fr'); if (lf) lf.addEventListener('click', function () { lang = 'fr'; applyLangUI(); renderDuel(); });
var le = el('lang-en'); if (le) le.addEventListener('click', function () { lang = 'en'; applyLangUI(); renderDuel(); });
var st2 = el('start-duel-btn'); if (st2) st2.addEventListener('click', function () { var o = el('briefing-overlay'); if (o) o.className = 'briefing-overlay hidden'; started = true; resetDuel(); });
var bb = el('back-btn'); if (bb) bb.addEventListener('click', function () { goBack(false); });
var hamburgerBtn = el('hamburger-btn');
var menu = el('hamburger-menu');
if (hamburgerBtn && menu) {
    hamburgerBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && e.target !== hamburgerBtn) {
            menu.classList.remove('open');
        }
    });
}
var menuBack = el('menu-back');
if (menuBack) {
    menuBack.addEventListener('click', function () {
        if (menu) menu.classList.remove('open');
        goBack(false);
    });
}
var menuHome = el('menu-home');
if (menuHome) {
    menuHome.addEventListener('click', function () {
        if (menu) menu.classList.remove('open');
        window.location.href = '../true-detective/index.html';
    });
}
var menuContinue = el('menu-continue');
if (menuContinue) {
    menuContinue.addEventListener('click', function () {
        if (menu) menu.classList.remove('open');
        var won = false; try { won = !!JSON.parse(localStorage.getItem(RES_KEY) || '{}').won; } catch (e) {}
        goBack(won);
    });
}
var hb = el('hint-btn'); if (hb) hb.addEventListener('click', function () {
if (!started || gameOver || turn !== 'w' || hintUsed) return;
var h = hintBestM(board, castling); if (!h) return; hintUsed = true;
selected = { r: h.fr, c: h.fc }; renderDuel();
setSpeech(lang === 'en' ? 'Play ' + sqName(h) + '.' : 'Jouez ' + sqName(h) + '.');
setTimeout(function () { hintUsed = false; }, 15000);
});
var nb = el('new-btn'); if (nb) nb.addEventListener('click', function () { if (started) resetDuel(); });
var ab = el('abandon-btn'); if (ab) ab.addEventListener('click', function () {
try { localStorage.setItem(RES_KEY, JSON.stringify({ won: false, result: 'abandon', clue: finalLoseText(), moves: moveList.length, difficulty: difficulty, lang: lang, ts: Date.now() })); } catch (e) {}
goBack(false);
});
var ec2 = el('end-continue-btn'); if (ec2) ec2.addEventListener('click', function () {
var won = false; try { won = !!JSON.parse(localStorage.getItem(RES_KEY) || '{}').won; } catch (e) {}
goBack(won);
});
var er = el('end-retry-btn'); if (er) er.addEventListener('click', function () { var o = el('board-overlay'); if (o) o.className = 'board-overlay hidden'; resetDuel(); });
started = false;
board = cloneB(INIT); castling = { wk: true, wq: true, bk: true, bq: true, ep: null };
turn = 'w'; selected = null; gameOver = false; moveList = []; lastMove = null; tension = 0;
dripTrue = 0; dripFalse = 0; tauntIdx = 0; halfMoves = 0; noCapPawn = 0; timeLeft = 600; hintUsed = false;
renderDuel();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDuel); else initDuel();
})();
