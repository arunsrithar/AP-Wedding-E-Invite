function initCountdown() {
  var weddingDate = new Date('2026-12-13T07:00:00+05:30');

  var daysEl = document.getElementById('countdown-days');
  var hoursEl = document.getElementById('countdown-hours');
  var minutesEl = document.getElementById('countdown-minutes');
  var secondsEl = document.getElementById('countdown-seconds');

  if (!daysEl) return;

  var intervalId = null;

  function update() {
    var now = new Date();
    var diff = weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(3, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  intervalId = setInterval(update, 1000);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    } else {
      update();
      if (!intervalId && weddingDate - new Date() > 0) {
        intervalId = setInterval(update, 1000);
      }
    }
  });
}
