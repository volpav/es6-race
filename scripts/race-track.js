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

    matrix.forEach((trackRow, i) => {
      trackRow.forEach((trackCol, j) => {
        let currTrackCol = document.querySelectorAll('.track-row-' + (i + 1) + ' > .track-col-' + (j + 1))[0];

        self._resetTrackCol(currTrackCol);

        self._updateTrackCol(currTrackCol, trackCol);
      });
    });

    self._toggleClass(document.querySelectorAll('#race-track')[0], 'move');
  }

  _resetTrackCol(col) {
    ['obstacle', 'car-blue', 'car-red']
    .forEach((className) => {
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
        className = 'obstacle';
        break;
      case 'x':
        className = 'car-blue';
        break;
      case 'y':
        className = 'car-red';
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

  _toggleClass(el, className) {
    if (el.classList) {
      el.classList.toggle(className);
    } else {
      var classes = el.className.split(' ');
      var existingIndex = classes.indexOf(className);

      if (existingIndex >= 0)
        classes.splice(existingIndex, 1);
      else
        classes.push(className);

      el.className = classes.join(' ');
    }
  }
}