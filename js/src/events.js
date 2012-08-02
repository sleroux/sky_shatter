define(['utils'],function (utils) {
    var registeredEvents = {};

    return {
        on: function (eventName, listener, scope) {
            if (!registeredEvents.hasOwnProperty(eventName)) {
                registeredEvents[eventName] = [];
            }

            registeredEvents[eventName].push({
                func: listener,
                scope: scope
            });
        },

        trigger: function (eventName, argsList) {
            var index,
                listener,
                args = argsList || [];

            if (registeredEvents.hasOwnProperty(eventName)) {
                utils.forEach(registeredEvents[eventName], function (listener) {
                    listener.func.apply(listener.scope, args);
                });
            }
        }
    };
});