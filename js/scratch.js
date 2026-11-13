function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isScratching = false;
  let revealed = false;
  let checkCounter = 0;
  let initialized = false;

  function setupCanvas() {
    const parent = canvas.parentElement;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    initialized = true;

    ctx.globalCompositeOperation = 'source-over';
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#C5A55A');
    gradient.addColorStop(0.3, '#E8D5A3');
    gradient.addColorStop(0.5, '#D4B96E');
    gradient.addColorStop(0.7, '#E8D5A3');
    gradient.addColorStop(1, '#C5A55A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 2.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(197, 165, 90, 0.2)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  function scratch(pos) {
    ctx.globalCompositeOperation = 'destination-out';
    const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 28);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.8, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  function getScratchPercent() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    const total = canvas.width * canvas.height;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) transparent++;
    }
    return transparent / total;
  }

  function createSparkles() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const count = 20;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'scratch-sparkle';
      sparkle.style.left = (Math.random() * 100) + '%';
      sparkle.style.top = (Math.random() * 100) + '%';
      sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
      sparkle.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
      container.appendChild(sparkle);
      sparkle.addEventListener('animationend', () => sparkle.remove());
    }
  }

  function revealCard() {
    if (revealed) return;
    revealed = true;
    createSparkles();
    canvas.classList.add('revealed');
    const hint = canvas.parentElement.querySelector('.scratch-hint');
    if (hint) hint.classList.add('hidden');
  }

  function checkReveal() {
    if (revealed) return;
    checkCounter++;
    if (checkCounter % 3 !== 0) return;

    const percent = getScratchPercent();
    if (percent > 0.40) {
      revealCard();
    }
  }

  function onStart(e) {
    e.preventDefault();
    isScratching = true;
    const pos = getPos(e);
    scratch(pos);
    checkCounter = 0;

    const hint = canvas.parentElement.querySelector('.scratch-hint');
    if (hint) hint.classList.add('hidden');
  }

  function onMove(e) {
    if (!isScratching || revealed) return;
    e.preventDefault();
    const pos = getPos(e);
    scratch(pos);
    checkReveal();
  }

  function onEnd() {
    if (!isScratching) return;
    isScratching = false;
    if (!revealed) {
      const percent = getScratchPercent();
      if (percent > 0.40) {
        revealCard();
      }
    }
  }

  canvas.addEventListener('mousedown', onStart);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onEnd);
  canvas.addEventListener('mouseleave', onEnd);

  canvas.addEventListener('touchstart', onStart, { passive: false });
  canvas.addEventListener('touchmove', onMove, { passive: false });
  canvas.addEventListener('touchend', onEnd);

  setupCanvas();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !revealed && !initialized) {
        setupCanvas();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(canvas.parentElement);

  const resizeObserver = new ResizeObserver(() => {
    if (!revealed) setupCanvas();
  });
  resizeObserver.observe(canvas.parentElement);

  window.addEventListener('resize', () => {
    if (!revealed) setupCanvas();
  });
}
