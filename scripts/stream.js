'use strict';

/**
 * Represents event emitter.
 */
class EventEmitter {

    /**
     * Initializes a new instance of an object.
     */
    constructor() {
        this._listeners = {};
    }

    /**
     * Registers a listener for a given event.
     * @param {string} eventName Event name.
     * @param {Function} listener Event listener.
     */
    on(eventName, listener) {
        if (!this._listeners) {
            this._listeners = {};
        }

        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }

        this._listeners[eventName].push(listener);

        return this;
    }

    /**
     * Unregisters a listener from a given event.
     * @param {string} eventName Event name.
     * @param {Function=} listener Event listener. Ommit to unregister all event listeners.
     */
    off(eventName, listener) {
        if (this._listeners) {
            if (!listener) {
                this._listeners[eventName] = [];
            } else if (this._listeners[eventName]) {
                this._listeners[eventName] = this._listeners[eventName]
                    .filter(existing => existing !== listener);
            }
        }
    }

    /**
     * Triggers the given event.
     * @param {string} eventName Event name.
     * @param {object} eventArgs Event arguments.
     */
    trigger(eventName, eventArgs) {
        let listeners = this._listeners ? this._listeners[eventName] : [];

        if (listeners) {
            listeners.forEach(listener => {
                listener(eventArgs || {});
            });
        }

        return this;
    }
}

/**
 * Represents a generator-based asynchronous stream.
 */
class Stream extends EventEmitter {
    /**
     * Initializes a new instance of an object.
     */
    constructor() { }

    /**
     * Creates and returns a new stream based on a given generator function.
     * @param {Function} generatorFunction A generator function.
     */
    static from(generatorFunction) {
        let stream = new Stream(),
            generator = generatorFunction(),

            /**
             * Processes the next generator result.
             */
            next = () => {
                let result = null,
                    /**
                     * Processes the next generator value.
                     * @param {object} value Generator value.
                     */
                    onValue = (value, done) => {
                        /* Generator value can be a generator itself. */
                        if (typeof (value) === 'function') {
                            generator = value();
                        } else {
                            if (typeof (value) !== 'undefined' && value !== null) {
                                /* Notifying that we have data. */
                                stream.trigger('data', value);
                            }
                            
                            /* Checking whether we're done with this generator. */
                            if (done) {
                                stream.trigger('end');
                            }
                        }

                        /* (in order not to go into recursion) Processing next value. */
                        setTimeout(() => {
                            next();
                        }, 0);
                    },

                    /**
                     * Handles generator error.
                     * @param {object} error Error object.
                     */
                    onError = error => {
                        stream.trigger('error', error);
                        stream.trigger('end');
                    };

                try {
                    result = generator.next();

                    /* If the value returned is a promise, awaiting for the result before processing. */
                    if (result.value && typeof (result.value.then) === 'function') {
                        result.value.then(onValue, onError);
                    } else {
                        onValue(result.value, result.done);
                    }
                } catch (error) {
                    onError(error);
                }
            };

        /* Letting the caller to acquire the referene before processing the generator. */
        setTimeout(next, 5);

        return stream;
    }
}