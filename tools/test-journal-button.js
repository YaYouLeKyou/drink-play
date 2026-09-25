const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('express');
const puppeteer = require('puppeteer');

const watchdog = setTimeout(() => {
    console.error('Journal button tests exceeded 30 seconds');
    process.exit(1);
}, 30000);

(async () => {
    const app = express();
    app.use(express.static(path.resolve(__dirname, '..')));
    const server = await new Promise(resolve => {
        const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
    });
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        page.setDefaultTimeout(8000);
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.setRequestInterception(true);
        page.on('request', request => {
            const url = new URL(request.url());
            if (url.hostname !== '127.0.0.1') return request.abort();
            return request.continue();
        });
        const origin = 'http://127.0.0.1:' + server.address().port;
        await page.goto(origin + '/true-detective/index.html', { waitUntil: 'domcontentloaded' });

        // 1. Le bouton carnet existe dans la top-bar (hors settings)
        await page.waitForSelector('#notebook-btn');
        const btnText = await page.$eval('#notebook-btn', el => el.textContent.trim());
        assert.equal(btnText, '📓', 'Notebook button must display the notebook icon');

        // 2. Le listener est bien branché (init() -> setupEventListeners) : clic => ouverture du panneau
        await page.evaluate(() => document.getElementById('notebook-btn').click());
        await page.waitForFunction(() => document.getElementById('notebook').classList.contains('open'));
        console.log('PASS: clicking #notebook-btn opens the notebook panel');

        // 3. Fermeture via le bouton du panneau
        await page.evaluate(() => document.getElementById('close-notebook').click());
        await page.waitForFunction(() => !document.getElementById('notebook').classList.contains('open'));
        console.log('PASS: #close-notebook closes the panel');

        // 4. Le compteur d'indices se met à jour via le flux réel (addClue + showClueToast)
        await page.evaluate(() => {
            if (window.TDNarrativeEngine) {
                window.TDNarrativeEngine.addClue('Indice de test', 'witness');
            }
            if (window.showClueToast) {
                window.showClueToast('Indice de test');
            } else if (window.updateIndicators) {
                window.updateIndicators();
            }
        });
        const count = await page.$eval('#clues-count', el => el.textContent);
        assert.equal(count, '1', 'Clue counter must show 1 after addClue + updateIndicators');
        const indicatorVisible = await page.$eval('#clue-indicator', el => el.style.display !== 'none');
        assert.equal(indicatorVisible, true, 'Clue indicator must become visible with >= 1 clue');
        console.log('PASS: clue counter updates and indicator becomes visible');

        // 5. Le bouton signale le nouvel indice (classe has-new via showClueToast non accessible -> verif CSS existante)
        const hasStyle = await page.evaluate(() => {
            for (const sheet of document.styleSheets) {
                try {
                    for (const rule of sheet.cssRules) {
                        if (rule.cssText && rule.cssText.indexOf('notebook-open-btn') !== -1) return true;
                    }
                } catch (e) { /* cross-origin sheets */ }
            }
            return false;
        });
        assert.equal(hasStyle, true, 'CSS must contain .notebook-open-btn rules');
        console.log('PASS: .notebook-open-btn styles are loaded');

        assert.deepEqual(errors, [], 'No page errors expected: ' + errors.join(' | '));
        console.log('PASS all journal button checks');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => clearTimeout(watchdog));
