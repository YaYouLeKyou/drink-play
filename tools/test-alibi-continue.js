const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('express');
const puppeteer = require('puppeteer');

const watchdog = setTimeout(() => {
    console.error('Alibi tests exceeded 45 seconds');
    process.exit(1);
}, 45000);

async function newTestPage(browser) {
    const page = await browser.newPage();
    page.setDefaultTimeout(8000);
    page.setDefaultNavigationTimeout(8000);
    await page.setRequestInterception(true);
    page.on('request', request => {
        const url = new URL(request.url());
        if (url.hostname !== '127.0.0.1') return request.abort();
        // The destination is asserted; loading the full hub is outside this test.
        if (url.pathname === '/true-detective/index.html') {
            return request.respond({ contentType: 'text/html', body: '<!doctype html><title>Hub</title>' });
        }
        return request.continue();
    });
    return page;
}

(async () => {
    const app = express();
    app.get('/repro', (req, res) => res.send(`<!doctype html>
        <iframe src="/child?story=1" style="width:100%;height:700px"></iframe>
        <script>
        window.results = [];
        window._storyMinigameIframe = document.querySelector('iframe');
        window._storyMinigameCompleteHandler = function(result) { results.push(result); };
        </script>`));
    app.get('/child', (req, res) => res.send(`<!doctype html>
        <div id="game"></div>
        <script src="/true-detective/minigames.js"></script>
        <script src="/true-detective/alibi-navigation.js"></script>
        <script>
        window.start = function(time) {
            TDMiniGames.play({ type: 'reseau_alibis', time: time,
                testimonies: [
                    { id: 'hale', witness: {fr: 'Hale'}, statement: {fr: 'Vérité'}, isLie: false },
                    { id: 'vivienne', witness: {fr: 'Vivienne'}, statement: {fr: 'Mensonge'}, isLie: true }
                ]
            }, 'fr', TDAlibiNavigation, document.getElementById('game'));
        };
        </script>`));
    app.use(express.static(path.resolve(__dirname, '..')));
    const server = await new Promise(resolve => {
        const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
    });
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const origin = 'http://127.0.0.1:' + server.address().port;
        for (const outcome of ['win', 'mistakes', 'timeout']) {
            const page = await newTestPage(browser);
            const errors = [];
            page.on('pageerror', e => errors.push(e.message));
            await page.goto(origin + '/repro');
            const frame = await (await page.$('iframe')).contentFrame();
            await frame.waitForFunction(() => typeof start === 'function');
            await frame.evaluate(outcome => start(outcome === 'timeout' ? 0.2 : 0), outcome);
            if (outcome !== 'timeout') {
                assert.equal(await frame.$$eval('.reseau-alibis-continue', els => els.length), 0);
                await frame.evaluate(outcome => {
                    const card = document.querySelector('[data-witness-id="' +
                        (outcome === 'win' ? 'vivienne' : 'hale') + '"]');
                    for (let i = 0; i < (outcome === 'win' ? 1 : 3); i++) card.click();
                }, outcome);
            }
            await frame.waitForSelector('.reseau-alibis-continue', { visible: true });
            assert.equal(await frame.$$eval('.reseau-alibis-continue', els => els.length), 1);
            assert.equal(await frame.$eval('.reseau-alibis-continue', el => el.textContent), 'Continuer');
            assert.equal(await frame.$$eval('.reseau-alibis-card', els => els.every(el => el.disabled)), true);
            const url = frame.url();
            await frame.evaluate(() => {
                const button = document.querySelector('.reseau-alibis-continue');
                button.click();
                button.click();
            });
            assert.deepEqual(await page.evaluate(() => results.map(r => r.won)), [outcome === 'win']);
            assert.equal(frame.url(), url);
            assert.equal(await frame.$('.minigame-content'), null);
            assert.deepEqual(errors, []);
            console.log('PASS isolated:', outcome, '- one callback, no navigation');
            await page.close();
        }
        for (const width of [390, 1280]) {
            for (let level = 1; level <= 4; level++) {
                const page = await newTestPage(browser);
                const errors = [];
                page.on('pageerror', e => errors.push(e.message));
                await page.setViewport({ width, height: 844 });
                await page.evaluateOnNewDocument(() => {
                    Object.defineProperty(window, 'TDMiniGames', {
                        configurable: true,
                        set(api) {
                            const play = api.play;
                            api.play = function (cfg, lang, done, target) {
                                window.testConfig = cfg;
                                cfg.time = 0;
                                return play(cfg, lang, done, target);
                            };
                            Object.defineProperty(window, 'TDMiniGames', { value: api });
                        }
                    });
                });
                await page.goto(origin + '/true-detective/reseau-alibis-' + level + '.html');
                await page.waitForSelector('.reseau-alibis-card');
                await page.evaluate(async () => {
                    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
                    for (let guard = 0; guard < 25; guard++) {
                        if (document.querySelector('.reseau-alibis-continue')) break;
                        const cards = Array.from(document.querySelectorAll('.reseau-alibis-card'));
                        if (cards.length !== 2 || !testConfig || !testConfig._alibiDraw) {
                            await sleep(120);
                            continue;
                        }
                        const ids = cards.map(el => el.dataset.witnessId).sort();
                        const draw = (testConfig._alibiDraw || []).find(d => {
                            const dIds = d.map(c => c.id).slice().sort();
                            return dIds.length === 2 && dIds[0] === ids[0] && dIds[1] === ids[1];
                        });
                        const liar = draw && draw.find(c => c.isLie);
                        if (liar) {
                            const target = cards.find(el => el.dataset.witnessId === liar.id);
                            if (target) target.click();
                        }
                        await sleep(1100);
                    }
                });
                await page.waitForSelector('.reseau-alibis-continue', { visible: true });
                const visible = await page.evaluate(() => {
                    const buttons = document.querySelectorAll('.reseau-alibis-continue');
                    const button = buttons[0], r = button.getBoundingClientRect();
                    return buttons.length === 1 && r.top >= 0 && r.bottom <= innerHeight &&
                        r.left >= 0 && r.right <= innerWidth &&
                        button.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
                });
                assert.equal(visible, true, 'Button must be visible and unobstructed');
                await page.click('.reseau-alibis-continue');
                await page.waitForFunction(() => location.hash === '#minigames');
                assert.deepEqual(errors, []);
                console.log('PASS page:', level, 'viewport:', width);
                await page.close();
            }
        }
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => clearTimeout(watchdog));
