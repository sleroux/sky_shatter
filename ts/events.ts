/// <reference path='utils.ts' />

var registeredEvents = [];

module events {
    export function on(eventName, listener, scope) {
        if (!registeredEvents.hasOwnProperty(eventName)) {
            registeredEvents[eventName] = [];
        }

        registeredEvents[eventName].push({
            func: listener,
            scope: scope
        });
    }

    export function trigger(eventName, argsList) {
        var index,
            listener,
            args = argsList || [];

        if (registeredEvents.hasOwnProperty(eventName)) {
            utils.forEach(registeredEvents[eventName], function (listener) {
                listener.func.apply(listener.scope, args);
            }, this);
        }
    }
}

