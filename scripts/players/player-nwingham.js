'use strict';

/**
 * Represents the best player out there.
 */
class NiallPlayer extends Player {
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
        console.log(printTrack(track.now));

        // Fucking go for it, eh?
        var speed = me.speed === 3 ? 3 : me.speed + 1;

        // Go straight ahead if it's safe
        if (!willCrash(track.now, me, speed)) {
          console.info('Full steam ahead, captain!');
          return { turn: 0, acceleration: 1 }
        } else {
          console.warn('About to crash!');
        }

        // Try turning left
        if (me.x > 0 && !willCrash(track.now, {x: me.x - 1, y: me.y}, speed)) {
          console.info('Swerving left, phew!');
          return { turn: -1, acceleration: 1 };
        }

        // Try turning right
        if (me.x < track.now[0].length - 1 && !willCrash(track.now, {x: me.x - 1, y: me.y}, speed)) {
          console.info('Swerving right, phew!');
          return { turn: 1, acceleration: 1 };
        }

        // Slam on the brakes, not that it's likely to help...
        console.warn("Oh shit, I'm trapped!");
        return { turn: 0, acceleration: -1 };
    }
}

function printTrack(track) {
  let s = '\n';
  for (let row of track) {
    s += row.map(toDisplayChar).join('|') + '\n';
  }
  return s;
}

function toDisplayChar(trackChar) {
  switch (trackChar) {
    case '*': return 'X';
    case 'x': return '1';
    case 'y': return '2';
    default: return ' ';
  }
}

function willCrash(track, position, speed) {
  for (let i = 1; i <= speed; i++) {
    if (track[position.y - i] && track[position.y - i][position.x] !== ' ') {
      return true;
    }
  }
  return false;
}