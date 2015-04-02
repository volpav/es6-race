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

        this._ticker = null;
        this._track = [];
    }

    /**
     * Starts the race.
     */
    start() {
        clearInterval(this._ticker);

        this._ticker = setInterval(function () {

        }, 750);
    }

    get *loop() {
        yield {
            track: this._track
        };
    }
}