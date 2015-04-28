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

    /**
     * Compiles the player from the given source code.
     * @param {string} source Source code of the player.
     */
    static compileFromSource(source) {
        let className = /class\s+(\w+)/gi.exec(source)[1];

        source = '(() => {\n' + source + '\n return new ' + className + '(); })();'

        return eval(source);
    }
}