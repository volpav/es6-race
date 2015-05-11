'use strict';

/**
 * Represents a sample player.
 */
class OZsivanov extends Player {
    /**
     * Gets the name of this player.
     * @returns {string} The name of this player.
     */
    get name() { return this._name; }

    /**
     * Initializes a new instance of an object.
     */
    constructor() {
        this._name = "'94 Jalopy";
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
            acceleration: 0
        };

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

        if (me.y >= 3 && track.now[me.y - 3][me.x] !== ' ') {
          decision.turn = me.x > 0 ? -1 : 1;
          if(decision.acceleration > 0) decision.acceleration--;
        }else if (me.y >= 2 && track.now[me.y - 2][me.x] !== ' ') {
          decision.turn = me.x > 0 ? -1 : 1;
        }else if (me.y >= 1 && track.now[me.y - 1][me.x] !== ' ') {
          decision.turn = me.x > 0 ? -1 : 1;
        }else{
          decision.acceleration++;
        }

        if (me.y >= 3 && track.now[me.y - 3][me.x] !== ' ' && me.y >= 3 && track.now[me.y - 3][me.x - 1] !== ' ') {
          decision.turn = me.x > 0 ? 1 : -1;
          if(decision.acceleration > 0) decision.acceleration--;
        }
        if (me.y >= 2 && track.now[me.y - 2][me.x] !== ' ' && me.y >= 2 && track.now[me.y - 2][me.x - 1] !== ' ') {
          decision.turn = me.x > 0 ? 1 : -1;
        }
        if (me.y >= 1 && track.now[me.y - 1][me.x] !== ' ' && me.y >= 1 && track.now[me.y - 1][me.x - 1] !== ' ') {
          decision.turn = me.x > 0 ? 1 : -1;
        }

        return decision;
    }
}
