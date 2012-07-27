define(['event_bus'], function (eventBus) {
    var plane = function (spec) {
        var obj = {};

        function moveLeft () {
            spec.x  -= 10;
        }

        function moveRight() {
            spec.x += 10;
        }

        function moveUp () {
            spec.y -= 10;
        }

        function moveDown () {
            spec.y += 10;
        }

        obj.shoot = function () {

        };

        obj.move = function () {
            var key,
                e;

            for (key in eventBus.keyStates) {
                if (eventBus.keyStates[key].state == 'down') {
                    e = eventBus.keyStates[key].event;

                    switch (e.keyCode) {
                        case 65:
                            moveLeft();
                            break;
                        case 68:
                            moveRight();
                            break;
                        case 87:
                            moveUp();
                            break;
                        case 83:
                            moveDown();
                            break;
                    }
                }
            }
        };

        obj.draw = function (context) {
            context.fillStyle = 'FF0000';
            context.fillRect(spec.x, spec.y, 50, 60);
        };

        return obj;
    };

    return plane;
});