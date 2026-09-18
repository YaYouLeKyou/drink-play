/* Audit de mise en page : mobile (390x844) + desktop (1280x800).
   Pour chaque page : boutons Continuer (doublons ?), navbar, chevauchements. */
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const puppeteer = require('puppeteer');

const ROOT = 'D:/dev projects/2020-2025/myGames/drink&play';
const OUT = path.join(ROOT, 'tools', 'layout-audit.out.json');

const PAGES = [
  'asteroids.html', 'bataille-navale.html', 'breakout.html', 'chemistry.html',
  'chess.html', 'coffre-code.html', 'connect4.html', 'jackpot.html',
  'marginal-tower.html', 'memory.html', 'montre-code.html', 'pacman.html',
  'pong.html', 'puzzle.html', 'reseau-alibis-1.html', 'reseau-alibis-2.html',
  'reseau-alibis-3.html', 'reseau-alibis-4.html', 'scene-fouille.html',
  'shooting.html', 'space-invaders.html', 'sudoku.html'
];

const probe = () => {
  const norm = r => ({ top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), h: Math.round(r.height) });
  const out = { viewport: [innerWidth, innerHeight], continues: [], navbar: null, overlaps: [], offscreen: [] };
  // Tous les boutons "Continuer" visibles ou pas
  document.querySelectorAll('button, a.btn').forEach(b => {
    const t = (b.textContent || '').trim();
    if (/continuer|continue l/i.test(t)) {
      const r = b.getBoundingClientRect();
      const cs = getComputedStyle(b);
      out.continues.push({ id: b.id || null, text: t.slice(0, 30), display: cs.display, rect: norm(r) });
    }
  });
  // Navbar / header
  const header = document.querySelector('header, .sg-header, nav');
  if (header) {
    const r = header.getBoundingClientRect();
    out.navbar = norm(r);
    // Chevauchement header / contenu principal
    const main = document.querySelector('main, .sg-main, canvas, #game-content');
    if (main) {
      const mr = main.getBoundingClientRect();
      const inter = Math.max(0, Math.min(r.bottom, mr.bottom) - Math.max(r.top, mr.top));
      const interW = Math.max(0, Math.min(r.right, mr.right) - Math.max(r.left, mr.left));
      if (inter > 2 && interW > 2) out.overlaps.push({ type: 'header-main', inter: Math.round(inter) });
    }
  }
  // Boutons Continuer hors écran
  out.continues.forEach((c, i) => {
    if (c.display === 'none') return;
    const r = c.rect;
    if (r.top < 0 || r.bottom > innerHeight + 1 || r.left < 0 || r.right > innerWidth + 1) {
      out.offscreen.push({ index: i, rect: r });
    }
  });
  return out;
};

(async () => {
  const app = express();
  app.use(express.static(path.resolve(ROOT)));
  const server = await new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await puppeteer.launch({ headless: true });
  const results = [];
  try {
    for (const page of PAGES) {
      for (const vp of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
        const p = await browser.newPage();
        const errs = [];
        p.on('pageerror', e => errs.push(e.message));
        await p.setViewport(vp);
        await p.goto(origin + '/true-detective/' + page + '?difficulty=1&lang=fr&theme=agatha-christie&story=1', { waitUntil: 'networkidle2', timeout: 25000 }).catch(e => errs.push('NAV ' + e.message));
        const data = await p.evaluate(probe).catch(e => ({ error: e.message }));
        results.push({ page, width: vp.width, ...data, pageErrors: errs });
        await p.close();
      }
    }
  } finally {
    await browser.close();
    await new Promise(r => server.close(r));
  }
  fs.writeFileSync(OUT, JSON.stringify({ results }, null, 1));
  console.log('WROTE ' + OUT);
})().catch(e => { console.error(e); process.exitCode = 1; });
