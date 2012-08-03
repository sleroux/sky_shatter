define(['utils', 'events', 'plane', 'renderer'], function (utils, events, plane, rendererFactory) {
    var game = function (spec) {
        var obj = {},
            canvas = document.getElementById(spec.canvasId),
            renderer = rendererFactory({
                game: obj,
                canvas: canvas
            }),
            projectiles = {},
            projectilesIdCounter = 0,
            player,
            enemies = [];

        events.on('spawnPlayerBullet', function (bullet) {
            var bulletId = projectilesIdCounter++;
            bullet.projectileId = bulletId;
            projectiles[bulletId] = bullet;
        }, obj);

        events.on('destroyBullet', function (bulletId) {
            delete projectiles[bulletId];
        }, obj);

        function tick () {
            update();
            renderer.render();
            window.requestAnimationFrame(tick);
        }

        function update () {
            player.update();

            utils.forEach(projectiles, function (projectile) {
                projectile.update();
            });

            utils.forEach(enemies, function (enemy) {
                enemy.update();
            });
        }

        function setupSceneGraph () {
            player = plane({
                frame: {
                    x: 10,
                    y: 10,
                    width: 50,
                    height: 70
                }
            });
        }

        obj.start = function () {
            setupSceneGraph();
            tick();
        };

        obj.__defineGetter__('player', function () {
            return player;
        });

        obj.__defineGetter__('enemies', function () {
            return enemies;
        });

        obj.__defineGetter__('projectiles', function () {
            return projectiles;
        });

        return obj;
    };

    return game;
});