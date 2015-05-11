'use strict';

/**
 * Represents a sample player.
 */
class SuperFlamingPuma extends Player {



    /**
     * Gets the name of this player.
     * @returns {string} The name of this player.
     */
    get name() { return this._name; }

    /**
     * Initializes a new instance of an object.
     */
    constructor() {
      this._name = "The Super Flaming Puma";
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
        if (me.y >= 2 && this.obstacleAhead(track, me) ) {
            decision.turn = this.leftOrRight( track, me);
        }

        if(me.speed != 3) {
          decision.acceleration = 1;        
        }

        return decision;
    }

    obstacleAhead(track, me) {
      console.log("Speed " + me.speed);
      for(let i = 1; i <= me.speed; i++ ) {
        //console.log("Y: " + (me.y - i) +", X: " + me.x + ", track: " + track.now[me.y - i][me.x] );
        if( track.now[me.y - i] != undefined && track.now[me.y - i][me.x] !== ' ') {
          return true;
        } 
      }

      return false;
    }

    leftOrRight(track, me) {
      for(let i = 1; i <= me.speed; i++ ) {
        if( track.now[me.y - i] != undefined && track.now[me.y - i][me.x] !== ' ') {
          if( track.now[me.y - i][me.x-1] == ' ') {
          
            if( track.now[me.y][me.x-1] == ' ') {
              return -1;
            }else{
              return 1;
            }

          } else {
            return 1;
          }
        } 
      }

      return false;
    }
}
