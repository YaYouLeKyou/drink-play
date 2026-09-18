/* Retour commun aux quatre réseaux d'alibis, après le bouton Continuer. */
(function (global) {
    'use strict';

    global.TDAlibiNavigation = function (result) {
        var params = new URLSearchParams(global.location.search);
        var fromStory = params.get('story') === '1' || params.get('mode') === 'story';
        var won = !!(result && result.won);

        // Reprendre l'enquête existante, sans naviguer à l'intérieur de l'iframe.
        if (fromStory && global.parent !== global) {
            try {
                var parent = global.parent;
                if (parent._storyMinigameIframe &&
                    parent._storyMinigameIframe.contentWindow === global &&
                    typeof parent._storyMinigameCompleteHandler === 'function') {
                    parent._storyMinigameCompleteHandler({ won: won, notes: result && result.notes });
                    return;
                }
            } catch (e) {}
        }

        if (fromStory) {
            try {
                localStorage.setItem('td_standalone_game_result', JSON.stringify({
                    type: 'reseau_alibis', won: won, ts: Date.now()
                }));
                var returnRaw = localStorage.getItem('td_standalone_game_return');
                var returnPoint = returnRaw ? JSON.parse(returnRaw) : null;
                if (returnPoint && returnPoint.returnUrl) {
                    global.location.href = returnPoint.returnUrl;
                    return;
                }
            } catch (e) {}
        }
        global.location.href = fromStory
            ? '../true-detective/index.html?standalone=reseau_alibis'
            : '../true-detective/index.html#minigames';
    };
})(window);
