const puppeteer = require('puppeteer');
const path = require('path');

/* Verifie qu'un ecran large n'est pas degrade par les correctifs mobile :
   aucun chevauchement, canvas et bouton Pause entiers dans la fenetre. */
(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto('file:///' + path.resolve('drunk-alien-main/www/index.html').replace(/\\/g, '/'), { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    const out = await page.evaluate(() => {
        const r = e => { const x = e.getBoundingClientRect(); return { t: Math.round(x.top), l: Math.round(x.left), w: Math.round(x.width), h: Math.round(x.height) }; };
        const ov = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
        const canvas = document.getElementById('canvas');
        const pause = document.getElementById('pauseButton');
        const toggle = document.querySelector('.da-audio-toggle');
        const dev = document.querySelector('.dev-contact-btn');
        const hub = document.querySelector('.back-to-hub-btn');
        return {
            vw: window.innerWidth,
            canvas: r(canvas), toggle: r(toggle), dev: r(dev), hub: r(hub),
            toggleOverDev: ov(toggle.getBoundingClientRect(), dev.getBoundingClientRect()),
            toggleOverHub: ov(toggle.getBoundingClientRect(), hub.getBoundingClientRect()),
            canvasInView: canvas.getBoundingClientRect().bottom <= window.innerHeight,
            pauseInView: pause.getBoundingClientRect().bottom <= window.innerHeight,
            panelOpenByDefault: document.getElementById('da-music-player').classList.contains('da-open')
        };
    });
    console.log('DESKTOP', JSON.stringify(out, null, 1));
    console.log('ERRORS', JSON.stringify(errs));
    await browser.close();
})();
