/* boot.js: short, skippable Pip OS startup splash. */
(function () {
  'use strict';

  var screen = document.getElementById('bootScreen');
  if (!screen) return;

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    screen.hidden = true;
    return;
  }

  try {
    if (sessionStorage.getItem('pip:bootSeen') === '1') {
      screen.hidden = true;
      return;
    }
    sessionStorage.setItem('pip:bootSeen', '1');
  } catch (e) {
    // Continue without session persistence if storage is unavailable.
  }

  var finished = false;
  var timer;

  function finish() {
    if (finished) return;
    finished = true;
    window.clearTimeout(timer);
    screen.classList.add('is-leaving');
    screen.removeEventListener('click', finish);
    document.removeEventListener('keydown', onKeyDown);

    window.setTimeout(function () {
      screen.hidden = true;
    }, 220);
  }

  function onKeyDown(event) {
    if (event.key === 'Tab' || event.key === 'Shift' ||
        event.key === 'Control' || event.key === 'Alt' ||
        event.key === 'Meta') return;
    finish();
  }

  screen.addEventListener('click', finish);
  document.addEventListener('keydown', onKeyDown);

  var audio = window.PIP && window.PIP.audio;
  if (audio && audio.isOn()) {
    audio.note(783.99, { dur: 0.35, gain: 0.08 });
    audio.note(1046.5, { dur: 0.45, gain: 0.07, when: 0.12 });
  }

  timer = window.setTimeout(finish, 2000);
})();