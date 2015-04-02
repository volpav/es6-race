'use strict';

/**
 * Represents a race.
 */
class Race {
    /**
     * Initializes a new instance of an object.
     */
    constructor() {
        this.player1 = null;
        this.player2 = null;

        this._isRunning = false;
        this._isNextStateAvailable = false;

        this._track = [];
        this._winner = null;
    }

    /**
     * Starts the race.
     */
    start() {
        var next = () => {
            if (this._isRunning) {
                /* Evaluating players against the track. */
                this.refresh();

                this._isNextStateAvailable = true;

                /* Allowing "loop" to read the next state. */
                setTimeout(() => {
                    this._isNextStateAvailable = false;

                    /* Continuing the race. */
                    setTimeout(next, 750);
                }, 10);
            }
        };

        this._isRunning = true;
        this._winner = null;

        next();
    }

    /**
     * Stops the race.
     */
    stop() {
        this._isRunning = false;
    }

    /**
     * Refreshes the track as well as the winner (if any).
     */
    refresh() {

    }

    get *view(player) {

    }

    get *loop() {
        var interval = setInterval(() => {
            if (this._isNextStateAvailable) {
                clearInterval(interval);

                yield {
                    track: this._track,
                    winner: this._winner
                };
            }
        }, 5);
    }
}