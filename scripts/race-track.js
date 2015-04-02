'use strict';

class RaceTrack {
  constructor() {
    var raceTrackEl = '';

    for (let i = 0; i < 20; i++) {
      let trackRow = '<div class="track-row track-row-' + (i + 1) + '">';

      for (let j = 0; j < 10; j++) {
        trackRow += '<span class="track-col track-col-' + (j + 1) + '"></span>';
      }

      trackRow += '</div>';

      raceTrackEl += trackRow;
    }

    document.querySelectorAll('#race-track')[0].innerHTML = raceTrackEl;
  }
}