const assert = require('node:assert/strict');
const fs = require('node:fs');
const express = require('express');
const puppeteer = require('puppeteer');
const path = require('node:path');

(async () => {
    const root = path.resolve(__dirname, '..');
    const app = express();
    app.get('/audio-test', (req, res) => res.send(`<!doctype html>
        <base href="/true-detective/">
        <button id="gesture" onclick="event.stopPropagation()">Play game</button>
        <script src="/true-detective/minigame-audio.js" data-minigame="memory"></script>`));
    app.get('/player-test', (req, res) => res.send(`<!doctype html>
        <button id="gesture" onclick="event.stopPropagation()">Play game</button>
        <script src="/music-player.js" data-hidden data-start="Together.mp3"></script>`));
    app.use(express.static(root));
    const server = await new Promise(resolve => {
        const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
        const origin = 'http://127.0.0.1:' + server.address().port;
        async function newPage(blocked) {
            const page = await browser.newPage();
            page.on('pageerror', error => console.error('PAGE ERROR', page.url(), error.message));
            page.setDefaultTimeout(8000);
            await page.setRequestInterception(true);
            page.on('request', r => new URL(r.url()).hostname === '127.0.0.1' ? r.continue() : r.abort());
            await page.evaluateOnNewDocument(blocked => {
                window.audioCalls = [];
                window.audioElements = new Set();
                window.blockAudio = blocked;
                const play = HTMLMediaElement.prototype.play;
                HTMLMediaElement.prototype.play = function () {
                    audioElements.add(this);
                    const entry = { src: this.src, result: 'pending' };
                    audioCalls.push(entry);
                    if (blockAudio) {
                        entry.result = 'NotAllowedError';
                        return Promise.reject(new DOMException('Test autoplay restriction', 'NotAllowedError'));
                    }
                    const p = play.call(this);
                    if (p) p.then(() => entry.result = 'playing', e => entry.result = e.name);
                    return p;
                };
            }, blocked);
            return page;
        }
        const pages = fs.readdirSync(path.join(root, 'true-detective')).filter(f => f.endsWith('.html') && f !== 'index.html');
        for (const file of pages) {
            const page = await newPage(false);
            const suffix = file === 'standalone-game.html' ? '?game=memory' : '';
            await page.goto(origin + '/true-detective/' + file + suffix, { waitUntil: 'domcontentloaded' });
            await page.waitForFunction(() => audioCalls.some(c => c.result === 'playing' && c.src.includes('/mini-jeux/')));
            assert.equal(await page.evaluate(() => {
                const player = document.getElementById('dp-music-player');
                return !player || getComputedStyle(player).display === 'none';
            }), true);
            assert.equal(await page.evaluate(() => [...audioElements].filter(a => !a.paused && a.src.includes('/mini-jeux/')).length), 1);
            console.log('PASS autoplay + hidden:', file);
            await page.close();
        }
        app.get('/iframe-test', (req, res) => res.send(`<!doctype html><body>
            <script src="/music-player.js" data-hidden
                data-start="enigme classic.mp3"
                data-tracks="true-detective/music true detective/mini-jeux/enigme classic.mp3"></script>
            <script src="/true-detective/audioService.js"></script>
            <iframe src="/true-detective/memory.html?story=1"></iframe>`));
        const parentPage = await newPage(false);
        await parentPage.goto(origin + '/iframe-test');
        await parentPage.waitForFunction(() => audioCalls.some(c => c.result === 'playing'));
        const child = await (await parentPage.$('iframe')).contentFrame();
        await child.waitForFunction(() => typeof playMinigameMusic === 'function');
        assert.equal(await child.evaluate(() => audioElements.size), 0);
        assert.equal(await parentPage.$eval('#dp-music-player', el => getComputedStyle(el).display), 'none');
        console.log('PASS iframe: parent music only, hidden player');
        await parentPage.close();

        for (const route of ['/audio-test', '/player-test']) {
            const page = await newPage(true);
            await page.goto(origin + route);
            await page.waitForFunction(() => audioCalls.some(c => c.result === 'NotAllowedError'));
            await page.click('#gesture');
            // A rejected gesture must not disable later retries.
            await page.evaluate(() => { blockAudio = false; });
            await page.click('#gesture');
            await page.waitForFunction(() => audioCalls.some(c => c.result === 'playing'));
            assert.equal(await page.evaluate(() => audioElements.size), 1);
            assert.equal(await page.evaluate(() => {
                const player = document.getElementById('dp-music-player');
                return !player || getComputedStyle(player).display === 'none';
            }), true);
            console.log('PASS blocked autoplay + capture retry:', route);
            await page.close();
        }
    } finally {
        if (browser) await browser.close();
        server.closeAllConnections();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(e => { console.error(e); process.exitCode = 1; });
