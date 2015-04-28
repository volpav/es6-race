/**
 * Represents a main page of the application.
 */
class Page extends EventEmitter {
	/**
     * Initializes a new instance of an object.
     */
	constructor() {
		this._race = null;
	}

	/**
	 * Serves the page.
	 */
	serve() {
		/* FIXME: Debugging the sample race. */
		this.newRace(new SamplePlayer(), new SamplePlayer());

		/* When user updates the source code of the test player and presses "Test player" button... */
		document.getElementById('player-test-button').addEventListener('click', () => {
			var source = document.getElementById('player-test-source').value;

			if (source && source.length) {
				/* Restarting it with the first player copiled from the user's provided source code. */
				this.newRace(Player.compileFromSource(source), new SamplePlayer());
			}
			
		});
	}

	/**
	 * Starts new race.
	 * @param {object} player1 Player #1.
     * @param {object} player2 Player #2.
	 */
	newRace(player1 = null, player2 = null) {
		if (this._race) {
			this._race.stop();
		}

		/* Starting new race. */
		this._race = Race.startNew(player1, player2);

		/* Making race object available to the outside. */
		this.trigger('newRace', { race: this._race });
	}
}