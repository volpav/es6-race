'use strict';

/**
 * Represents a sample player.
 */
class SamplePlayer extends Player {

}

var myTestPlayer = eval(txPlayer.value);

var testPlayerProxy = new Proxy(new SamplePlayer(), {
    get *path(race) {
        return myTestPlayer.path(race); 
    }
});

var race = Game.current.createRace(new SamplePlayer(), testPlayerProxy);

race.start();

for (var view of race.loop) {
    view.track // [];

    // 0 - no stone
    // 1 - stone
    // x - player 1
    // y - player 2
}