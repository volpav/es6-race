'use strict';

/**
 * Represents a race.
 */
class Race extends EventEmitter {
    /**
     * Initializes a new instance of an object.
     * @param {object} player1 Player #1.
     * @param {object} player2 Player #2.
     * @param {object} options Race options.
     */
    constructor(player1 = null, player2 = null, options = {}) {
        this.player1 = player1;
        this.player2 = player2;

        this.trackRefreshRate = 200;
        this.obstacleDensity = 0.08;
        this.trackDistance = 50;

        /* By default, log to console. */
        if (!options.log) {
            options.log = function (message) {
                console.log.apply(console, [message]);
            };
        }

        this.options = options;

        this.reset();
    }

    /**
     * Gets track size.
     */
    get trackSize() {
        return {
            width: 10,
            height: 20
        }
    }

    /**
     * Gets the current data of the track.
     */
    get trackData() {
        return this._trackData;
    }

    /**
     * Gets value indicating whether race has started.
     */
    get hasStarted() {
        return this._hasStarted;
    }

    /**
     * Resets the race.
     */
    reset() {
        this._player1Crashed = false;
        this._player2Crashed = false;
        this._trackEventTrace = [];
        this._hasStarted = false;
        this._trackProgress = 0;
        this._trackData = null;

        this._track = {
            now: null,
            before: []
        };

        this._currentSpeed = {
            x: 1,
            y: 1
        };
    }

    /**
     * Starts the race.
     * @param {object} player1 Player #1 (optional).
     * @param {object} player2 Player #2 (optional).
     */
    start(player1 = null, player2 = null) {
        this.reset();

        if (player1) this.player1 = player1;
        if (player2) this.player2 = player2;

        if (this.player1 && this.player2) {
            this._hasStarted = true;

            /* Generating track data. */
            this.refreshTrackData();

            this.trigger('start');

            Stream.from(() => { return this.progress(); })
                .on('data', trackView => {
                    this.trigger('progress', trackView);
                })
                .on('error', err => {
                    this.options.log('[Race] Error: ' + err.toString());
                });
        } else {
            /* Stopping, need two players to compete. */
            this.stop();
        }
    }

    /**
     * Stops the race.
     */
    stop() {
        this._hasStarted = false;

        this.trigger('stop');
    }

    /**
     * Generates race progress.
     */
    *progress() {
        let self = this,
            generateRaceProgress = function* () {
                let result = self.evaluateTrackState();

                if (result && self._hasStarted) {
                    result.events.forEach(evt => {
                        self._trackEventTrace.push(evt);
                    });

                    yield result;

                    if (result.events.filter(evt => evt.type === 'winner').length === 0 &&
                        self._trackEventTrace.filter(evt => evt.type === 'crash').length < 2) {

                        yield new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve(generateRaceProgress);
                            }, self.trackRefreshRate);
                        });
                    } else {
                        self.stop();
                    }
                }
            };

        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                if (this._hasStarted) {
                    clearInterval(interval);

                    resolve(generateRaceProgress);
                }
            }, 10);
        });
    }

    /**
     * Refreshes the track view.
     */
    evaluateTrackState() {
        let playerCrashSpot,
            events = [],

            /**
             * Registers new event.
             * @param {string} type Event type.
             * @param {object} data Event data.
             */
            registerEvent = (type, data) => {
                events.push({
                    type: type,
                    data: data
                })
            };

        /**
         * Finds the X and Y coordinates of the given player.
         * @param {string} identifier Player identifier on a track (for example, "x" or "y").
         * @returns {{x, y}} An object with "x" and "y" coordinates identifying the player.
         */
        let findPlayerCoordinates = identifier => {
                let result = {
                        x: -1,
                        y: -1
                    },
                    i = 0,
                    j = 0;

                this._track.now.forEach(row => {
                    /* Didn't we find the "y" coordinate yet? */
                    if (result.y < 0) {
                        row.forEach(cell => {
                            /* Didn't we find the "x" coordinate yet? */
                            if (result.x < 0 && cell === identifier) {
                                result.x = j;
                            }

                            j++;
                        });

                        /* "x" coordinate is found meaning that the "y" is found as well. */
                        if (result.x >= 0) {
                            result.y = i;
                        }
                    }

                    /* New row. */
                    j = 0;

                    i++;
                });

                return result;
            },

            /**
             * Returns value indicating whether the given player has completed the race.
             * @param {string} identifier Player identifier on a track (for example, "x" or "y").
             */
            hasCompletedRace = identifier => {
                let coordinates = findPlayerCoordinates(identifier);

                return coordinates && coordinates.y === 0;
            },

            /**
             * Refreshes the given player on the track.
             * @param {object} player Player to refresh.
             * @param {string} identifier Player identifier on a track (for example, "x" or "y").
             * @returns {boolean} Value indicating whether the player has crashed after the current move.
             */
            refreshAndCheckIfCrashed = (player, identifier) => {
                let move,
                    crashSpot,
                    coordinates,
                    originalCoordinates;

                /* Finding the player on a track. */
                coordinates = findPlayerCoordinates(identifier);

                /* Asking the player to move. */
                move = player.move({
                    now: this._track.now,
                    before: this._track.before,
                    size: this.trackSize
                }, {
                    x: coordinates.x,
                    y: coordinates.y,
                    speed: this._currentSpeed[identifier]
                });

                /* Is the player still on track? */
                if (coordinates.x >= 0) {
                    /* Keeping player's original coordinates so we know what to replace with empty space. */
                    originalCoordinates = { x: coordinates.x, y: coordinates.y };

                    /* Making a move. */
                    if (move.turn < 0) {
                        coordinates.x -= 1;
                    } else if (move.turn > 0) {
                        coordinates.x += 1;
                    }

                    /* Changing current speed. */
                    this._currentSpeed[identifier] += (move.acceleration > 0 ? 1 : (move.acceleration < 0 ? -1 : 0));

                    if (this._currentSpeed[identifier] > 3) {
                        this._currentSpeed[identifier] = 3;
                    } else if (this._currentSpeed[identifier] < 1) {
                        this._currentSpeed[identifier] = 1;
                    }

                    /* Applying speed. */
                    coordinates.y -= (this._currentSpeed[identifier] || 1);

                    /* If the player goes too fast, he can go beyond the finishing line but we want him to stay there. */
                    if (coordinates.y < 0) {
                        coordinates.y = 0;
                    }

                    for (let i = coordinates.y; i <= originalCoordinates.y; i++) {
                        /* Checking whether the player has crashed. */
                        if (this._track.now[i][coordinates.x] !== identifier &&
                            this._track.now[i][coordinates.x] !== ' ') {

                            crashSpot = { x: coordinates.x, y: i };
                            break;
                        }
                    }

                    /* Advancing the player and replacing its old spot with an empty space. */
                    this._track.now[originalCoordinates.y][originalCoordinates.x] = ' ';

                    if (!crashSpot) {
                        this._track.now[coordinates.y][coordinates.x] = identifier;
                    }
                }

                return crashSpot;
            };

        if (!this._player1Crashed) {
            playerCrashSpot = refreshAndCheckIfCrashed(this.player1, 'x');

            /* Checking whether player 1 has crashed. */
            if (playerCrashSpot) {
                this._player1Crashed = true;

                registerEvent('crash', {
                    player: this.player1,
                    coordinates: playerCrashSpot
                });
            }
        }

        if (!this._player2Crashed) {
            playerCrashSpot = refreshAndCheckIfCrashed(this.player2, 'y');

            /* Checking whether player 2 has crashed. */
            if (playerCrashSpot) {
                this._player2Crashed = true;

                registerEvent('crash', {
                    player: this.player2,
                    coordinates: playerCrashSpot
                });
            } 
        }

        if (hasCompletedRace('x')) {
            /* Player 1 came first. */
            registerEvent('winner', this.player1);
        } else if (hasCompletedRace('y')) {
            /* Player 2 came first. */
            registerEvent('winner', this.player2);
        } else if (this._trackProgress < this.trackDistance) {
            this._trackProgress++;

            /* Refreshing the track (advancing the view). */
            this.refreshTrackData();
        }

        return {
            trackData: this._track.now,
            events: events
        };
    }

    /**
     * Refreshes the track data by either generating it initially or advancing the track view.
     */
    refreshTrackData() {
        /**
         * Renders next track line (horizontal).
         * @param {boolean} obstacles Value indicating whether to randomly generate obstacles on this line.
         */
        let nextLine = (obstacles) => {
            /* Determining whether the previous line contained obstacles. */
            let previousContainsObstacles = obstacles === false || (this._track.now &&
                this._track.now[0].filter(point => {
                    /* "*" stands for an obstacle. */
                    return point === '*';
                }).length > 0);

            /* Generating the line and optionally, obstacles. */
            return Array.from(Array(this.trackSize.width).keys()).map(() => {
                return !previousContainsObstacles ? (Math.random() > (1 - this.obstacleDensity) ? '*' : ' ') : ' ';
            })
        };

        /* Is this an initial track surface generation? */
        if (!this._track.now) {
            let emptyLinesLeft = 5,     /* The first N lines contain no obstacles. */
                playerEdgeOffset = 3;   /* Player offset from the left/right side of the track. */

            this._track.now = [];

            /* Pushing the starting line. */
            this._track.now.push(nextLine(false));

            /* Placing two players on the starting line. */
            this._track.now[0][playerEdgeOffset] = 'x';
            this._track.now[0][this.trackSize.width - playerEdgeOffset - 1] = 'y';

            /* Generating the rest of the track. */
            Array.from(Array(this.trackSize.height).keys()).slice(1).forEach(() => {
                /* The first 5 lines are empty ones (letting the players accelerate). */
                this._track.now.unshift(nextLine(!((emptyLinesLeft--) > 0)));
            });
        } else {
            this._track.before = [];

            /* Remembering the previous state of the track (useful for the players). */
            this._track.now.forEach(row => {
                this._track.before.unshift(row.slice());
            });

            /* We will start moving the track view once players pass the first N lines. */
            if (this._trackProgress > 4) {
                /* Removing the bottom line (we're going up) and generating a new top one instead. */
                this._track.now.splice(this._track.now.length - 1);
                this._track.now.unshift(nextLine());
            }
        }
    }

    updateUI(evt) {
        let message = '';

        switch (evt.type) {
            case 'crash':
                message = evt.data.player._name + ' crashed at ' + evt.data.coordinates.x + ':' + evt.data.coordinates.y + '.';
                break;
            case 'winner':
                message = evt.data._name + ' has WON the race!';
                break;
            default:
                message = evt.data;
                break;
        }

        document.querySelectorAll('#race-dashboard > .notification')[0].innerHTML = message;
    }

    /**
     * Starts new race.
     * @param {Player} player1 First player.
     * @param {Player} player2 Second player.
     * @param {object} options Race options.
     */
    static startNew(player1, player2, options = {}) {
        /* Defining a track. */
        let track = new RaceTrack();

        /* Creating new race. */
        let race = new Race(player1, player2, options);

        /* Acquiring race progress and refreshing the track view. */
        race.on('progress', trackView => {
            trackView.events.forEach(evt => {
                race.options.log('[Race] Event: \"' + evt.type + '\" (' + JSON.stringify(evt.data) + ')');
                race.updateUI(evt);
            });
            
            track.update(trackView.trackData);
        });

        race.on('start', () => { 
            race.options.log('[Race] Race started.'); 
        });
        race.on('stop', () => { 
            race.options.log('[Race] Race stopped.');
        });

        /* Starting the race. */
        race.start();

        return race;
    }
}