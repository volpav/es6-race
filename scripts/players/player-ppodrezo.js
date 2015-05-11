'use strict';

/**
 * Represents a sample player.
 */
class PetroPlayer extends Player {
    /**
     * Gets the name of this player.
     * @returns {string} The name of this player.
     */
    get name() { return this._name; }

    /**
     * Initializes a new instance of an object.
     */
    constructor() {
        this._name = 'Petro';
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
          ----------------------------------------------------------------------------- */

        let distanceToNextBlock = 0;
        for(let i=me.y;i>0;i--) {
          if(me.y >= 1 && track.now[me.y-i][me.x] !== ' ') {
            break;
          }
          distanceToNextBlock++;
        }

        let speedToTake = 0;
        if(distanceToNextBlock < 5)
        {
          speedToTake = -1;
        }
        else if(distanceToNextBlock < 6)
        {
          speedToTake = 0;
        }
        else if(distanceToNextBlock < 7)
        {
          speedToTake = 1;
        }
        else if(distanceToNextBlock < 8)
        {
          speedToTake = 2;
        }
        else
        {
          speedToTake = 3;
        }

        // check either side, left
        let distanceToNextBlockL = 0;
        if(me.x > 0)
        {
          for(let i=me.y;i>0;i--) {
            if(me.y >= 1 && track.now[me.y-i][me.x-1] !== ' ') {
              break;
            }
            distanceToNextBlockL++;
          }
        }

        // check either side, left
        let distanceToNextBlockR = 0;
        if(me.x < track.now[me.y].length -1)
        {
          for(let i=me.y;i>0;i--) {
            if(me.y >= 1 && track.now[me.y-i][me.x+1] !== ' ') {
              break;
            }
            distanceToNextBlockR++;
          }
        }


        if(distanceToNextBlockR === distanceToNextBlockL && distanceToNextBlock === distanceToNextBlockR && me.x < track.now[me.y].length -1 && track.now[me.y][me.x+1] === ' ' && me.x > 0 && track.now[me.y][me.x-1] === ' ')
        {
          decision.turn = Math.round(Math.random() * 2) - 1;
        }
        else if(distanceToNextBlockR >= distanceToNextBlock && distanceToNextBlockR >= distanceToNextBlockL && me.x < track.now[me.y].length -1 && track.now[me.y][me.x+1] === ' ')
        {
          decision.turn = 1;
        }
        else if(distanceToNextBlockL >= distanceToNextBlock && distanceToNextBlockL >= distanceToNextBlockR && me.x > 0 && track.now[me.y][me.x-1] === ' ')
        {
          decision.turn = -1;
        }
        else {
          decision.turn = 0;
        }


        decision.acceleration = speedToTake;


        //alert([distanceToNextBlockL,distanceToNextBlock,distanceToNextBlockR,decision.acceleration,decision.turn]);

        return decision;
    }
}
