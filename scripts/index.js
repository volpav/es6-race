/**
 * Represents a main page of the application.
 */
class Page {
	/**
     * Initializes a new instance of an object.
     */
	constructor() {
		this._race = null;
		this._tournament = null;
	}

	/**
	 * Serves the page.
	 */
	serve() {
		/* FIXME: Debugging sample race. */
		this.newRace(new SamplePlayer(), new SamplePlayer());

		var testSource = CodeMirror.fromTextArea(document.getElementById('player-test-source'), {
			mode: 'javascript'
		});

		/* When user updates the source code of the test player and presses "Test player" button... */
		document.getElementById('player-test-button').addEventListener('click', () => {
			var source = testSource.getValue();

			if (source && source.length) {
				/* Restarting it with the first player copiled from the user's provided source code. */
				this.newRace(Player.compileFromSource(source), new SamplePlayer());
			}
			
		});

		document.getElementById('tournament-start-button').addEventListener('click', () => {
			this.newTournament();
		});
	}

	/**
	 * Starts new race.
	 * @param {object} player1 Player #1.
     * @param {object} player2 Player #2.
	 */
	newRace(player1 = null, player2 = null) {
		/* (race mode) Stopping current race, if running. */
		if (this._race) {
			this._race.stop();
		}

		/* (tournament mode) stopping current tournament, if running. */
		if (this._tournament) {
			this._tournament.stop();
		}

		/* Starting new race. */
		this._race = Race.startNew(player1, player2);
	}

	/**
	 * Starts new tournament.
	 */
	newTournament() {
		let players = [
			'players/sample-player',
			'players/sample-player',
			'players/sample-player'
		];

		/* (tournament mode) stopping current tournament, if running. */
		if (this._tournament) {
			this._tournament.stop();
		}

		/* (race mode) Stopping current race, if running. */
		if (this._race) {
			this._race.stop();
		}

		/* Starting new tournament. */
		this._tournament = Tournament.startNew(players);
	}
}