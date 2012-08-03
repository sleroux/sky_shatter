require(['jquery', 'game', 'prototypical', '../lib/rAF'], function ($, game) {
    $(function () {
        window.ss = game({
            canvasId: 'game-canvas'
        });

        window.ss.start();
    });
});