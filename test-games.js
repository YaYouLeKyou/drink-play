const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    
    const page = await browser.newPage();
    const errors = [];
    
    page.on('pageerror', err => {
        errors.push(err.message);
        console.log('PAGE ERROR:', err.message);
    });
    
    try {
        await page.goto('http://localhost:4000/true-detective/', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        
        const testResults = await page.evaluate(() => {
            var results = {};
            var games = {
                'pacman': 'TDPacmanGame',
                'tetris': 'TDTetris',
                'asteroids': 'TDAsteroids',
                'breakout': 'TDBreakout',
                'missile-command': 'TDMissileCommand',
                'space-invaders': 'TDSpaceInvaders',
            };
            
            for (var type in games) {
                var ns = games[type];
                var gameObj = window[ns];
                if (!gameObj) {
                    results[type] = 'NOT FOUND: ' + ns;
                    continue;
                }
                
                try {
                    // Use the actual minigame overlay content element
                    var overlay = document.getElementById('minigame-overlay');
                    if (overlay) {
                        overlay.classList.remove('hidden');
                    }
                    
                    var target = document.getElementById('minigame-screen-content');
                    target.innerHTML = '';
                    
                    var doneCalled = false;
                    var testCfg = {
                        type: type,
                        act: 1,
                        title: { fr: 'Test', en: 'Test' },
                        clue: 'test clue',
                        failClue: 'test fail clue',
                        dialogues: [],
                        interroId: 'marginal', // pacman uses marginal
                        difficulty: 'medium'
                    };
                    
                    gameObj.play(testCfg, 'en', function(result) {
                        doneCalled = true;
                    }, target);
                    
                    // Check if content was created in target
                    var contentCreated = target.innerHTML.length > 0;
                    var targetHtml = target.innerHTML.substring(0, 500);
                    
                    // Check if chess layout was applied
                    var hasChessLayout = document.getElementById('minigame-overlay') ? 
                        document.getElementById('minigame-overlay').classList.contains('chess-layout') : false;
                    var hasGameLayout = document.getElementById('minigame-overlay-container') ? 
                        document.getElementById('minigame-overlay-container').classList.contains('chess-game-layout') : false;
                    
                    results[type] = 'PLAYED (content=' + contentCreated + ', len=' + target.innerHTML.length + 
                        ', chessLayout=' + hasChessLayout + ', gameLayout=' + hasGameLayout + ')';
                    
                    // Clean up
                    target.innerHTML = '';
                    if (overlay) overlay.classList.add('hidden');
                    if (typeof window._interroSidebarCleanup === 'function') {
                        try { window._interroSidebarCleanup(); } catch(e) {}
                        window._interroSidebarCleanup = null;
                    }
                    
                    // Small delay (can't use await in evaluate, but we can just continue)
                } catch (e) {
                    results[type] = 'ERROR: ' + e.message;
                }
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