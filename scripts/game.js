'use strict';

/**
 * Represents a game.
 */
class Game {
    var _current;

    /**
     * Creates new race.
     */
    createRace(player1, player2) {
        var race = new Race();

        race.player1 = player1;
        race.player2 = player2;

        return race;
    }

    /**
     * Returns the current instance of the game.
     */
    static get *current() {
        if (!_current) {
            _current = new Game();
        }

        return _current;
    }
}