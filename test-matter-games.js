const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', err => { errors.push(err.message); console.log('PAGE ERROR:', err.message); });
    page.on('console', msg => { if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text()); });

    try {
        await page.goto('http://localhost:4000/true-detective/', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2500));

        const testResults = await page.evaluate(async () => {
            var results = {};
            var games = {
                'domino': 'TDDominoGame'
            };

            for (var type in games) {
                var ns = games[type];
                var gameObj = window[ns];
                if (!gameObj) { results[type] = 'NOT FOUND: ' + ns; continue; }

                var overlay = document.getElementById('minigame-overlay');
                var target = document.getElementById('minigame-screen-content');

                var variants = ['card-tower', 'balance-beam', 'tower-drop', 'zigzag-stack'];
                for (var vi = 0; vi < variants.length; vi++) {
                    var variant = variants[vi];
                    try {
                        if (overlay) { overlay.classList.remove('hidden'); overlay.classList.add('chess-layout'); }
                        if (target) { target.innerHTML = ''; }

                        var doneCalled = false;
                        var testCfg = {
                            type: 'domino',
                            variant: variant,
                            act: 1,
                            title: { fr: 'Test ' + variant, en: 'Test ' + variant },
                            clue: 'test clue',
                            failClue: 'test fail clue',
                            dialogues: [],
                            interroId: 'marginal',
                            difficulty: 'medium'
                        };

                        gameObj.play(testCfg, 'fr', function (res) { doneCalled = true; }, target);

                        // Wait a bit for init
                        var hasCanvas = target && target.querySelector('canvas') !== null;
                        var hasWrap = target && target.querySelector('.domino-wrap') !== null;
                        var hasButton = false;
                        if (target) {
                            var buttons = target.querySelectorAll('button');
                            hasButton = buttons.length > 0;
                        }
                        var errorVar = null;
                        try {
                            if (window.Matter) {
                                var engine = window.Matter.Engine.create();
                                window.Matter.Engine.clear(engine);
                            }
                        } catch (e) { errorVar = e.message; }

                        results[type + '.' + variant] = 'played: canvas=' + hasCanvas + ', wrap=' + hasWrap + ', buttons=' + hasButton + ', error=' + (errorVar || 'none') + ', done=' + doneCalled;

                        // Simulate a click
                        if (hasCanvas) {
                            var canvas = target.querySelector('canvas');
                            var rect = canvas.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0) {
                                var evt = new MouseEvent('click', { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, bubbles: true });
                                canvas.dispatchEvent(evt);
                            }
                        }

                        // Cleanup skip button click if available
                        var skipBtn = document.getElementById('minigame-skip-btn');
                        if (skipBtn) { skipBtn.click(); }

                        await new Promise(r => setTimeout(r, 300));
                    } catch (e) {
                        results[type + '.' + variant] = 'ERROR: ' + e.message;
                    }
                }

                if (overlay) { overlay.classList.remove('chess-layout'); overlay.classList.add('hidden'); }
                if (target) target.innerHTML = '';
            }

            return results;
        });

        console.log('Test results:', JSON.stringify(testResults, null, 2));
    } catch (e) {
        console.log('Test error:', e.message);
    }

    console.log('Total page errors:', errors.length);
    if (errors.length) errors.forEach(e => console.log('  ', e));
    await browser.close();
})();
