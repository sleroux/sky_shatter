define(['entity'], function (entity) {
    var projectile = function (spec) {
        var obj = entity({
                frame: spec.frame,
                fillStyle: 'white'
            }),
            projectileSpeed = spec.projectileSpeed;

        function moveProjectile () {
            // Update the y position based on the projectile's speed
            obj.frame.y -= projectileSpeed;
        }

        obj.update = function () {
            moveProjectile();
        };

        return obj; 
    };

    return projectile;
});