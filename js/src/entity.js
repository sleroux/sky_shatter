define(function () {
    var entity = function (spec) {
        var obj = {},
            frame = spec.frame,
            fillStyle = spec.fillStyle;

        obj.__defineGetter__('frame', function () {
            return frame;
        });

        obj.__defineGetter__('fillStyle', function () {
            return fillStyle;
        });

        return obj;
    };

    return entity;
});