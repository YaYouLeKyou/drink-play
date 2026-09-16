import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

standalone_pages = ['pong.html', 'pacman.html', 'space-invaders.html', 'breakout.html', 'asteroids.html', 'chess.html', 'memory.html', 'shooting.html', 'jackpot.html', 'connect4.html', 'bataille-navale.html', 'montre-code.html', 'scene-fouille.html', 'puzzle.html', 'coffre-code.html', 'chemistry.html', 'marginal-tower.html']

for page in standalone_pages:
    path = os.path.join('true-detective', page)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'standalone-theme.js' in content:
        continue
    
    if 'settings-menu.js' in content:
        content = content.replace(
            '<script src="../settings-menu.js"></script>',
            '<script src="../settings-menu.js"></script>\n    <script src="standalone-theme.js"></script>'
        )
    else:
        content = content.replace(
            '<script>',
            '<script src="standalone-theme.js"></script>\n    <script>',
            1
        )
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('Updated: ' + page)
