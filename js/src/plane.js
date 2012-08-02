define(['entity', 'events', 'projectile'], function (entity, events, projectile) {
    var plane = function (spec) {
        var obj = entity({
                frame: spec.frame,
                fillStyle: 'red'
            }),
            movingLeft = false,
            movingRight = false,
            movingUp = false,
            movingDown = false,
            firing = false,
            firingRates = {
                FAST: 100,
                SLOW: 400,
                NORMAL: 200
            },
            firingRate,
            firingIntervalId = null;

        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 65:
                    movingLeft = true;
                    break;
                case 68:
                    movingRight = true;    
                    break;
                case 87:
                    movingUp = true;
                    break;
                case 83:
                    movingDown = true;
                    break;
                case 32:
                    firing = true;
                    break;
            }
        });

        document.addEventListener('keyup', function (e) {
            switch (e.keyCode) {
                case 65:
                    movingLeft = false;
                    break;
                case 68:
                    movingRight = false;    
                    break;
                case 87:
                    movingUp = false;
                    break;
                case 83:
                    movingDown = false;
                    break;
                case 32: 
                    firing = false;
                    break;
            }
        });

        function moveLeft () {
            obj.frame.x  -= 10;
        }

        function moveRight() {
            obj.frame.x += 10;
        }

        function moveUp () {
            obj.frame.y -= 10;
        }

        function moveDown () {
            obj.frame.y += 10;
        }

        function fire () {
            // Spawn a new projectile bullet infront of the player
            var bullet = projectile({
                frame: {
                    x: obj.frame.x + (obj.frame.width / 2),
                    y: obj.frame.y,
                    width: 10,
                    height: 10
                },
                projectileSpeed: 5
            });

            events.trigger('spawnPlayerBullet', [bullet]);
        }

        obj.move = function () {
            if (movingLeft) { moveLeft(); }
            if (movingRight) { moveRight(); }
            if (movingUp) { moveUp(); }
            if (movingDown) { moveDown(); } 
        };

        obj.update = function() {
            obj.move();

            if (firing && firingIntervalId === null) {
                fire();
                firingIntervalId = setInterval(fire, firingRate || firingRates.NORMAL);
            } else if (!firing && firingIntervalId !== null) {
                clearInterval(firingIntervalId);
                firingIntervalId = null;
            }
        };

        return obj;
    };

    return plane;
});