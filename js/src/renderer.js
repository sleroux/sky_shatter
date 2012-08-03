define(['utils'], function (utils) {
    var renderer = function (spec) {
        var game = spec.game,
            canvas = spec.canvas,
            context = spec.canvas.getContext('2d'),
            obj = {};

        function drawEntity (entity) {
            context.fillStyle = entity.fillStyle;
            context.fillRect(entity.frame.x,
                             entity.frame.y,
                             entity.frame.width,
                             entity.frame.height);
        }

        function drawBackground () {
            context.fillStyle = 'blue';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        obj.render = function () {
            drawBackground();

            drawEntity(game.player);

            utils.forEach(game.enemies, function (enemy) {
                drawEntity(enemy);
            });

            utils.forEach(game.projectiles, function (projectile) {
                drawEntity(projectile);
            });
        };

        return obj;
    };

    return renderer;
});