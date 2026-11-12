function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isScratching = false;
  let scratchedPixels = 0;
  let totalPixels = 0;
  let revealed = false;

  function setupCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    totalPixels = canvas.width * canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#C5A55A');
    gradient.addColorStop(0.5, '#E8D5A3');
    gradient.addColorStop(1, '#C5A55A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(197, 165, 90, 0.3)';
    for (let i = 0; i < 40; i++) {
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
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkReveal() {
    if (revealed) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }

    const percent = transparent / totalPixels;
    if (percent > 0.45) {
      revealed = true;
      canvas.classList.add('revealed');
      const hint = canvas.parentElement.querySelector('.scratch-hint');
      if (hint) hint.classList.add('hidden');
    }
  }

  function onStart(e) {
    e.preventDefault();
    isScratching = true;
    const pos = getPos(e);
    scratch(pos);

    const hint = canvas.parentElement.querySelector('.scratch-hint');
    if (hint) hint.classList.add('hidden');
  }

  function onMove(e) {
    if (!isScratching || revealed) return;
    e.preventDefault();
    const pos = getPos(e);
    scratch(pos);
  }

  function onEnd() {
    isScratching = false;
    checkReveal();
  }

  canvas.addEventListener('mousedown', onStart);
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseup', onEnd);
  canvas.addEventListener('mouseleave', onEnd);

  canvas.addEventListener('touchstart', onStart, { passive: false });
  canvas.addEventListener('touchmove', onMove, { passive: false });
  canvas.addEventListener('touchend', onEnd);

  setupCanvas();

  window.addEventListener('resize', () => {
    if (!revealed) setupCanvas();
  });
}
