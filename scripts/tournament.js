'use strict';

/**
 * Represents a tournament agenda.
 */
class TournamentAgenda {
	/**
     * Initializes a new instance of an object.
     */
	constructor() {
		this._players = [];
	}

	/** 
	 * Clears the agenda.
	 */
	clear() {
		this._players = [];
	}

	/**
	 * Adds new player to this tournament agenda.
	 * @param {object|string} player Player to add.
	 */
	addPlayer(player) {
		this._players.push(player);
	}

	/**
	 * Prepares the tournament agenda.
	 */
	prepare() {
		return new Promise((resolve, reject) => {
			let queue = [],
				loadedPlayers = [],
				nextQueueItem = null;

			/* Adding players to be loaded into the queue. */
			this._players.forEach(player => {
				queue.push(() => {
					return new Promise((playerResolve, playerReject) => {
						if (player && typeof (player.move) === 'function') {
							/* The player is passed as an instace rather than a reference - resolving immediately. */
							playerResolve(player);
						} else {
							/* Loading the player and resolving. */
							System.import(player).then(playerResolve, playerReject);
						}
					});
				});
			});

			/**
			 * Processes the next task of loading a player.
			 */
			nextQueueItem = () => {
				let task = queue.splice(0, 1)[0];

				if (task) {
					task().then(player => {
						if (player) {
							/* Player has been loaded successfully. */
							loadedPlayers.push(player);	
						}

						/* Processing next item in a queue. */
						nextQueueItem();
					}, nextQueueItem);
				} else {
					/* Player count must be even. */
					if (loadedPlayers > 0 && loadedPlayers % 2 !== 0) {
						loadedPlayers.push(new SamplePlayer());
					}

					/* No more tasks - agenda is prepared. */
					resolve({
						players: loadedPlayers
					});
				}
			};

			/* Processing the first queue item. */
			nextQueueItem();
		});
	}
}

/**
 * Represents a tournament.
 */
class Tournament extends EventEmitter {

	/**
     * Initializes a new instance of an object.
     * @param {object} options Options.
     */
	constructor(options = {}) {
		this._agenda = new TournamentAgenda();

		this._players = [];
		this._currentRound = [];
		this._nextRound = [];

		/* By default, log to console. */
        if (!options.log) {
            options.log = function (message) {
                console.log.apply(console, [message]);
            };
        }

        this._options = options;
	}

	/**
     * Gets race options.
     */
    get options() {
        return this._options;
    }

	/**
	 * Gets the agenda for this tournament.
	 */
	get agenda() {
		return this._agenda;
	}

	/**
	 * Gets the current round.
	 */
	get currentRound() {
		return this._currentRound;
	}

	/** 
	 * Cancels the tournament.
	 */
	cancel() {
		this._players = [];
		this._currentRound = [];
		this._nextRound = [];
	}

	/**
	 * Starts the tournament.
	 */
	start() {
		/* Fist of all, cancelling the currently running tournament. */
		this.cancel();

		/* Triggering the initial event - starting the tournament. */
		this.trigger('start');

		/* Preparing the agenda (loading all the players). */
		this.agenda.prepare().then(result => {
			/* Remembering our contenders. */
			this._players = result.players;

			/* Notifying the listening parties that the tournament is ready to be started! */
			this.trigger('ready');
		}, err => {
			/* An error occured while preparing the agenda. */
			this.trigger('error', { error: err });
		});

		return this;
	}

	/**
	 * Starts the next round.
	 */
	nextRound() {
		let currentRoundQueue = [],
			currentRoundNextQueueItem = null;

		/* Notifying about the next round. */
		this.trigger('nextRound');

		/* Reseting the players for the next round. */
		this._nextRound = [];

		/* Making pairs. */
		for (let i = 0; i < this._currentRound.length / 2; i++) {
			currentRoundQueue.push({
				player1: this._currentRound[i],
				player2: this._currentRound[this._currentRound.length - i - 1]
			});
		}

		/* Processes the race between the next available pair. */
		currentRoundNextQueueItem = () => {
			let result = null,
				pair = currentRoundQueue.splice(0, 1)[0];

			if (pair) {
				/* Running next pair. */
				result = this.nextPair(pair.player1, pair.player2);
			} else {
				this._currentRound = [];

				/* Creating new round. */
				this._nextRound.forEach(winner => {
					this._currentRound.push(winner);
				});

				/* End of tournament. */
				if (this._nextRound.length === 1) {
					this.trigger('end', {
						winner: this._nextRound[0]
					});
				}

				/* End of round. */
				result = new Promise((pairResolve) => {
					pairResolve('end');
				});
			}

			return result;
		};

		/* Returning an object which allows controlling the round (running races). */
		return {
			/**
			 * Runs the next race.
			 */
			nextPair: () => {
				return currentRoundNextQueueItem();		
			}
		};
	}

	/**
	 * Runs the next race.
	 * @param {object} player1 Player #1.
	 * @param {object} player2 Player #2.
	 */
	nextPair(player1, player2) {
		return new Promise((resolve, reject) => {
			let race = Race.startNew(player1, player2);

			race.on('progress', trackView => {
				let winners = trackView.events
                	.filter(evt => evt.type === 'winner')
                	.map(evt => evt.data);

                /* We have a winner. */
            	if (winners.length) {
            		this._nextRound.push(winners[0]);
            	}
			});

			/* Returning from the race. */
			race.on('stop', resolve);

			/* Notifying about the next pair. */
			this.trigger('nextPair', {
				player1: player1,
				player2: player2
			});

			race.start();
		});
	}

	/**
	 * Starts a new tournament.
	 * @param {Array} players Players.
	 */
	static startNew(players) {
		let tournament = new Tournament(),
			isEndOfTournament = false;

		/**
		 * Runs next round while there's on available (while there's no winner).
		 */
		let nextRoundWhileNotEnd = () => {
			let round = tournament.nextRound(),

				/**
				 * Runs a competition between two players while the current round is not over.
				 */
				nextPairWhileNotEnd = () => {
					round.nextPair().then(result => {
						if (result === 'end') {
							if (!isEndOfTournament) {
								/* Starting next round. */
								nextRoundWhileNotEnd();
							}
						} else {
							nextPairWhileNotEnd();
						}
					});
				};

				nextPairWhileNotEnd();
		};

		/* Adding players to the tournament agenda. */
		players.forEach(player => {
			tournament.agenda.addPlayer(player);
		});


		tournament.on('start', () => {
			tournament.options.log('[Tournament] Start.');
		});

		tournament.on('ready', () => {
			/* Starting fist round. */
			nextRoundWhileNotEnd();
		});

		tournament.on('nextRound', () => {
			tournament.options.log('[Tournament] Next round.');
		});

		tournament.on('nextPair', e => {
			tournament.options.log('[Tournament] Next race (' + e.player1.name + ' and ' + e.player2.name + ').');
		});

		tournament.on('end', () => {
			tournament.options.log('[Tournament] End.');

			isEndOfTournament = true;
		});

		/* Starting the tournament. */
		tournament.start();

		return tournament;
	}
}