const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
    const page = await browser.newPage();
    // iPhone-ish viewport : c'est le cas qui etait casse.
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    const errors = [];
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
    const failed = [];
    // Ecouteur pose tot : on veut la cause reelle des echecs de requete.
    page.on('requestfailed', r => {
        if (/\.mp3$/i.test(r.url())) {
            failed.push('FAILED[' + ((r.failure() && r.failure().errorText) || '?') + '] ' + decodeURIComponent(r.url().split('/').pop()));
        }
    });
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });

    const url = 'file:///' + path.resolve('drunk-alien-main/www/index.html').replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // 1) Les elements de jeu sont-ils bien visibles ?
    const layout = await page.evaluate(() => {
        const r = el => { const b = el.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), rr: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height) }; };
        const canvas = document.getElementById('canvas');
        const pause = document.getElementById('pauseButton');
        const toggle = document.querySelector('.da-audio-toggle');
        const panel = document.getElementById('da-music-player');
        const hub = document.querySelector('.back-to-hub-btn');
        return {
            vh: window.innerHeight, vw: window.innerWidth,
            canvas: r(canvas), pause: r(pause),
            toggle: toggle ? r(toggle) : null,
            panel: panel ? r(panel) : null,
            panelOpen: panel ? panel.classList.contains('da-open') : null,
            hub: r(hub),
            devBtn: r(document.querySelector('.dev-contact-btn')),
            canvasBottomInView: canvas.getBoundingClientRect().bottom <= window.innerHeight,
            pauseInView: pause.getBoundingClientRect().bottom <= window.innerHeight
        };
    });
    console.log('LAYOUT', JSON.stringify(layout, null, 1));

    // 2) Le panneau overlaps-t-il le canvas / le bouton Pause une fois ouvert ?
    const opened = await page.evaluate(() => {
        document.querySelector('.da-audio-toggle').click();
        const p = document.getElementById('da-music-player').getBoundingClientRect();
        const c = document.getElementById('canvas').getBoundingClientRect();
        const pa = document.getElementById('pauseButton').getBoundingClientRect();
        const overlap = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
        return { open: document.getElementById('da-music-player').classList.contains('da-open'), overCanvas: overlap(p, c), overPause: overlap(p, pa) };
    });
    console.log('PANEL_OPEN', JSON.stringify(opened));

    // 3) Un tap jeu declenche-t-il bien le pilotage ? (le panneau ne doit pas le capturer)
    const play = await page.evaluate(async () => {
        const before = gameState.firstClickDone;
        const c = document.getElementById('canvas');
        const cx = c.getBoundingClientRect().left + c.getBoundingClientRect().width / 2;
        const cy = c.getBoundingClientRect().top + c.getBoundingClientRect().height / 2;
        c.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: cx, clientY: cy }));
        return { before, after: gameState.firstClickDone, playing: gameState.gamePlaying };
    });
    console.log('GAME_TAP', JSON.stringify(play));

    // 4) L'API audio est-elle exposee et la musique de boss appelable ?
    const api = await page.evaluate(() => ({
        hasApi: !!window.DA_Audio,
        keys: window.DA_Audio ? Object.keys(window.DA_Audio) : [],
        hasBoss: window.DA_Audio ? typeof window.DA_Audio.playBoss : null,
        hasResume: window.DA_Audio ? typeof window.DA_Audio.resumeLevel : null,
        sfxCount: window.DA_Audio ? Object.keys(window.DA_Audio.sfx).length : 0,
        currentSrc: (function () { return document.querySelector('.da-music-select') ? document.querySelector('.da-music-select').value : null; })()
    }));
    console.log('AUDIO_API', JSON.stringify(api));

    // 5) Chaque piste de la playlist se charge-t-elle reellement ?
    //    C'est le piege de casse : sur Linux/Vercel un ecart de casse = 404.
    const mediaReq = [];
    page.on('response', r => { if (/\.mp3$/i.test(r.url())) mediaReq.push(r.status() + ' ' + decodeURIComponent(r.url().split('/').pop())); });

    const tracks = await page.evaluate(() => Array.from(document.querySelectorAll('.da-music-select option')).map(o => o.value));
    for (const t of tracks) {
        await page.evaluate(k => window.DA_Audio.playLevel(k), t);
        await new Promise(r => setTimeout(r, 250));
    }
    await new Promise(r => setTimeout(r, 600));
    console.log('PLAYLIST', JSON.stringify(tracks));
    console.log('MP3_RESPONSES', JSON.stringify(mediaReq, null, 1));

    // 6) La musique de boss remplace bien la piste de niveau, et revient ensuite.
    const bossFlow = await page.evaluate(async () => {
        window.DA_Audio.playLevel('level1');
        await new Promise(r => setTimeout(r, 100));
        window.DA_Audio.playBoss();
        await new Promise(r => setTimeout(r, 100));
        const duringBoss = document.querySelector('.da-music-select').value;
        window.DA_Audio.resumeLevel();
        await new Promise(r => setTimeout(r, 100));
        return { duringBoss, afterResume: document.querySelector('.da-music-select').value };
    });
    console.log('BOSS_FLOW', JSON.stringify(bossFlow));

    // 7) Detail des echecs de requete rencontres.
    console.log('REQUEST_FAILURES', JSON.stringify(failed, null, 1));


    await browser.close();
})();
