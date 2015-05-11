'use strict';

/**
 * Represents a sample player.
 */
class SamplePlayer extends Player {
    /**
     * Gets the name of this player.
     * @returns {string} The name of this player.
     */
    get name() { return this._name; }

    /**
     * Initializes a new instance of an object.
     */
    constructor() {
        this._name = 'player-' + (Math.floor(Math.random() * 100));
    }
    
    /**
     * Returns player's move.
     * @param {object} track A track sight for the given player.
     * @param {object} me A structure with "x", "y" and "speed" fields representing current player coordinates and speed.
     */
    move (track, me) {
        let decision = {
            /* 
             * Indicates where the player would like to turn. "-1" means turn left,
             * "1" means turn right, "0" means keep straight.
             */
            turn: 0,

            /*
             * Describes change of speed. "-1" means slow down, "1" means speed-up,
             * "0" means keep the current speed. Minimum speed is 1, maxium - 3.
             */
            acceleration: 1
        };

		let newSpeed = Math.max(me.speed + 1, 3);
        /* ----------------------------- Argument: me ------------------------------
         *
         * - x          X-coordinate of the player.
         * - y          y-coordinate of the player (notice that we're going up).
         * - speed      Current speed of the player (from 1 to 3). 
         *
         ------------------------------------------------------------------------ */

         /* ----------------------------- Argument: track ------------------------------
          *
          * - now - a two-dimentional array representing the current state of the track.
          *     - Empty cell (' ') represents a free spot.
          *     - Asterisk (*) represents an obstacle.
          *     - "x" represents first player.
          *     - "y" represents second player.
          * - before - a two-dimentional array representing previous state of the track (previous move).
          *     - (same markers).
          * - size - represents track size.
          *     - width - gets track width.
          *     - height - gets track height (a visible frame).
          *
          -----------------------------------------------------------------------------

        /* Avoiding obstacles by always turning left (and only right when we can't turn left anymore). */
		
		
		let needToMove = false;
		for (let i = 0; i <= newSpeed+2; i++) {
			if ((me.y - i > 0) && track.now[me.y - i] !== ' ') {
				needToMove = true;
			}
		}
        if (me.y >= 2 && needToMove) { // Need to turn, but which way?  Find direction that will have longest clear path after
			let lengthClearLeft = 0;
			let lengthClearRight = 0;
			
			if (me.x > 0) {
				let i = 0;
				while ((me.y - i > 0) && track.now[me.y - i][me.x -1] === ' ')  {
					i++;
					lengthClearLeft++;
				}
			}
			if (me.x < 9) {
				let i = 0;
				while ( (me.y - i > 0) && track.now[me.y - i][me.x + 1] === ' ') {
					i++;
					lengthClearRight++;
				}
			}
			
			if (lengthClearLeft >= lengthClearRight) {
				decision.turn = -1;
			} else {
				decision.turn = 1;
			}
        } else {
			decision.turn = 0;
		}

        return decision;
    }
}
