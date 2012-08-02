define(function () {
    return {
        map: function (obj, func, scope) {
            var i,
                returnVal = null,
                result = [];

            if (obj instanceof Array) {
                return obj.map(func, scope);
            } else {
                for (i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        returnVal = func.apply(scope, [obj[i], i]);
                        result.push(returnVal);
                    }
                }
            }

            return result;
        },

        forEach: function (obj, func, scope) {
            if (obj instanceof Array) {
                obj.forEach(func, scope);
            } else {
                this.map(obj, func, scope);
            }
        }
    };
});