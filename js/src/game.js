define(['utils', 'events', 'plane', 'renderer'], function (utils, events, plane, rendererFactory) {
    var game = function (spec) {
        var obj = {},
            canvas = document.getElementById(spec.canvasId),
            entityMap = {},
            renderer = rendererFactory({
                game: obj,
                canvas: canvas
            });

        events.on('spawnPlayerBullet', function (bullet) {
            if (!entityMap.hasOwnProperty('playerBullets')) {
                entityMap.playerBullets = [];
            }
            
            entityMap.playerBullets.push(bullet);
        }, obj);

        function tick () {
            update();
            renderer.render();
            window.requestAnimationFrame(tick);
        }

        function update () {
            // Update entities
            var entity,
                key;

            // Draw entities
            utils.forEach(entityMap, function (entity) {
                entity.update();
            });
        }

        function setupEntities () {
            entityMap.player = plane({
                frame: {
                    x: 10,
                    y: 10,
                    width: 50,
                    height: 70
                }
            });
        }

        obj.start = function () {
            setupEntities();
            tick();
        };

        obj.__defineGetter__('entityMap', function () {
            return entityMap;
        });

        return obj;
    };

    return game;
});