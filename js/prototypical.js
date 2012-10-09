// Mah prototypical prototypes

Object.prototype.keys = function () {
    var keys = [],
        key;

    for (key in this) {
        if (this.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    return keys;
};

Object.prototype.defineReadOnlyField = function (field) {
    Object.defineProperty(this, field, { 
        "value": field, 
        "writable": false
    });
};