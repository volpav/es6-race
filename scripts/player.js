/**
 * Represents a player.
 */
class Player {
    /**
     * Gets the name of this player.
     * @returns {string} The name of this player.
     */
    get name() { return 'Player'; }

    /**
     * Gets the path of this player in a race.
     * @param {Race} race A current race.
     */
    get *path(race) {
        throw new Error('Not implemented.');
    } 
}