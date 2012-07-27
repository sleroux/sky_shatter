define(['event_bus', 'plane'], function (eventBus, plane) {
    var game = function (spec) {
        var obj = {},
            canvas = document.getElementById(spec.canvasId),
            context = canvas.getContext('2d'),
            player = plane({
                x: 10,
                y: 10
            });

        document.addEventListener('keydown', function (e) {
            eventBus.keyStates[e.keyCode] = {
                state: 'down',
                event: e
            };
        });

        document.addEventListener('keyup', function (e) {
            eventBus.keyStates[e.keyCode] = { 
                state: 'up',
                event: e
            };
        });

        function tick () {
            update();
            render();
            window.requestAnimationFrame(tick);
        }

        function update () {
            player.move();
        }

        function render () {
            context.fillStyle = '00FFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);

            player.draw(context);
        }

        obj.start = function () {
            tick();
        };

        return obj;
    };

    return game;
});