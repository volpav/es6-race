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

  update(matrix) {
    var self = this;

    matrix.forEach(function(trackRow, i) {
      trackRow.forEach(function(trackCol, j) {
        let currTrackCol = document.querySelectorAll('.track-row-' + (i + 1) + ' > .track-col-' + (j + 1))[0];

        self._resetTrackCol(currTrackCol);

        self._updateTrackCol(currTrackCol, trackCol);
      });
    });
  }

  _resetTrackCol(col) {
    ['icon-shield', 'icon-cool', 'icon-evil']
    .forEach(function(className) {
      if (col.classList)
        col.classList.remove(className);
      else
        col.className = col.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    });
  }

  _updateTrackCol(col, val) {
    let className = '';

    switch (val) {
      case '*':
        className = 'icon-shield';
        break;
      case 'x':
        className = 'icon-cool';
        break;
      case 'y':
        className = 'icon-evil';
        break;
    }

    if (className.trim() === '') {
      return;
    }

    if (col.classList)
      col.classList.add(className);
    else
      col.className += ' ' + className;
  }
}