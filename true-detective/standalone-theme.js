(function () {
    'use strict';
    try {
        var params = new URLSearchParams(window.location.search);
        var themeId = params.get('theme') || 'agatha-christie';
        if (!window.getThemeId) {
            window.getThemeId = function () {
                return themeId;
            };
        }
        if (!window.THEME_ASSETS) {
            window.THEME_ASSETS = {};
        }
    } catch (e) {}
}());