'use strict';

/**
 * Represents a player.
 */
class Player {
    /**
     * Initializes a new instance of an object.
     */
    constructor() { }
    
    /**
     * Gets the name of this player.
     * @returns {string} The name of this player.
     */
    get name() { return 'Player'; }

    /**
     * Returns player's move.
     * @param {object} track A track sight for the given player.
     */
    move (track) { throw new Error('Not implemented.'); }
}