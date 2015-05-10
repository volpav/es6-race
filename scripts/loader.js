'use strict';

/**
 * Represents a script loader.
 */
class ScriptLoader {
	/**
     * Initializes a new instance of an object.
     */
	constructor() { }

	/**
	 * Loads the given script.
	 * @param {string} url Script URL.
	 */
	static load(url) {
		return new Promise((resolve, reject) => {
			let xhr = null;
				
			/* Module can be specified without ".js" extension. */
			if (url.toLowerCase().indexOf('.js') < 0) {
				url += '.js';
			}

			/* Making sure we are loading from "/scripts" folder. */
			if (url.toLowerCase().indexOf('scripts/') !== 0) {
				url = 'scripts' + (url.indexOf('/') === 0 ? '' : '/') + url;
			} 

			/* We will load scripts via AJAX. */
			xhr = new XMLHttpRequest();

			xhr.addEventListener('load', function () {
				/* Compiling script contents into the player instance. */
				resolve(Player.compileFromSource(this.responseText));
			});

			xhr.addEventListener('error', reject);

			xhr.open('GET', url, true);
			xhr.overrideMimeType('text/plain');

			xhr.send();
		});
	}
}

/* Resembling a signature of the (future) native "System.import" */
if (typeof (window['System']) === 'undefined') {
	window['System'] = {
		import: ScriptLoader.load
	};
}