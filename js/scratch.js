function initScratchCard() {
  var canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var isScratching = false;
  var revealed = false;
  var checkCounter = 0;
  var initialized = false;

  function setupCanvas() {
    var parent = canvas.parentElement;
    var w = parent.offsetWidth;
    var h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    initialized = true;

    ctx.globalCompositeOperation = 'source-over';
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#C5A55A');
    gradient.addColorStop(0.3, '#E8D5A3');
    gradient.addColorStop(0.5, '#D4B96E');
    gradient.addColorStop(0.7, '#E8D5A3');
    gradient.addColorStop(1, '#C5A55A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (var i = 0; i < 50; i++) {
      var x = Math.random() * canvas.width;
      var y = Math.random() * canvas.height;
      var r = Math.random() * 2.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(197, 165, 90, 0.2)';
    for (var i = 0; i < 30; i++) {
      var x = Math.random() * canvas.width;
      var y = Math.random() * canvas.height;
      var r = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  function scratch(pos) {
    ctx.globalCompositeOperation = 'destination-out';
    var gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 28);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.8, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  var SAMPLE_GRID = 20;
  function getScratchPercent() {
    var w = canvas.width;
    var h = canvas.height;
    if (w === 0 || h === 0) return 0;
    var stepX = Math.max(1, Math.floor(w / SAMPLE_GRID));
    var stepY = Math.max(1, Math.floor(h / SAMPLE_GRID));
    var transparent = 0;
    var total = 0;
    for (var y = 0; y < h; y += stepY) {
      for (var x = 0; x < w; x += stepX) {
        var pixel = ctx.getImageData(x, y, 1, 1).data;
        if (pixel[3] < 128) transparent++;
        total++;
      }
    }
    return total > 0 ? transparent / total : 0;
  }

  function createSparkles() {
    var container = canvas.parentElement;
    var count = 20;

    for (var i = 0; i < count; i++) {
      var sparkle = document.createElement('div');
      sparkle.className = 'scratch-sparkle';
      sparkle.style.left = (Math.random() * 100) + '%';
      sparkle.style.top = (Math.random() * 100) + '%';
      sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
      sparkle.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
      container.appendChild(sparkle);
      sparkle.addEventListener('animationend', function () { this.remove(); });
    }
  }

  function revealCard() {
    if (revealed) return;
    revealed = true;
    createSparkles();
    canvas.classList.add('revealed');
    var hint = canvas.parentElement.querySelector('.scratch-hint');
    if (hint) hint.classList.add('hidden');
  }

  function checkReveal() {
    if (revealed) return;
    checkCounter++;
    if (checkCounter % 3 !== 0) return;
    if (getScratchPercent() > 0.40) revealCard();
  }

  function onStart(e) {
    e.preventDefault();
    isScratching = true;
    scratch(getPos(e));
    checkCounter = 0;
    var hint = canvas.parentElement.querySelector('.scratch-hint');
    if (hint) hint.classList.add('hidden');
  }

  function onMove(e) {
    if (!isScratching || revealed) return;
    e.preventDefault();
    scratch(getPos(e));
    checkReveal();
  }

  function onEnd() {
    if (!isScratching) return;
    isScratching = false;
    if (!revealed && getScratchPercent() > 0.40) revealCard();
  }

  canvas.addEventListener('mousedown', onStart);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onEnd);
  canvas.addEventListener('mouseleave', onEnd);

  canvas.addEventListener('touchstart', onStart, { passive: false });
  canvas.addEventListener('touchmove', onMove, { passive: false });
  canvas.addEventListener('touchend', onEnd);

  setupCanvas();

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !revealed && !initialized) {
        setupCanvas();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(canvas.parentElement);

  var resizeObserver = new ResizeObserver(function () {
    if (!revealed) setupCanvas();
  });
  resizeObserver.observe(canvas.parentElement);

  window.addEventListener('resize', function () {
    if (!revealed) setupCanvas();
  });
}
