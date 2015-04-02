class Game {
    var _current;

    createRace(player1, player2) {
        var race = new Race();

        race.player1 = player1;
        race.player2 = player2;

        return race;
    }

    static get *current() {
        if (!_current) {
            _current = new Game();
        }

        return _current;
    }
}