'use strict';

/**
 * Represents a sample player.
 */
class SamplePlayer extends Player {
    /**
     * Initializes a new instance of an object.
     */
    constructor() { }
    
    /**
     * Returns player's move.
     * @param {object} track A track sight for the given player.
     * @param {object} me A structure with "x" and "y" fields representing current player coordinates.
     */
    move (track, me) {
        let decision = {
            turn: 0,
            speed: 1
        };

        if (me.y >= 2 && track.now[me.y - 2][me.x] !== ' ') {
            decision.turn = me.x > 0 ? -1 : 1;
        }

        return decision;
    }
}
