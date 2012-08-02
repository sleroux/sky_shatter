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

        function drawEntities () {  
            utils.forEach(game.entityMap, function (entity) {
                if (entity instanceof Array) {
                    drawEntities(entity);
                } else {
                    drawEntity(entity);
                }
            });
        }

        function drawBackground () {
            context.fillStyle = 'blue';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        obj.render = function () {
            drawBackground();
            drawEntities();
        };

        return obj;
    };

    return renderer;
});