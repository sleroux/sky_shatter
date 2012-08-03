define(['entity', 'events'], function (entity, events) {
    var projectile = function (spec) {
        var obj = entity({
                frame: spec.frame,
                fillStyle: 'white'
            }),
            projectileSpeed = spec.projectileSpeed;

        function moveProjectile () {
            // Update the y position based on the projectile's speed
            obj.frame.y -= projectileSpeed;

            if (obj.frame.y <= 0) {
                events.trigger('destroyBullet', [obj.projectileId]);
            }
        }

        obj.update = function () {
            moveProjectile();
        };

        return obj; 
    };

    return projectile;
});