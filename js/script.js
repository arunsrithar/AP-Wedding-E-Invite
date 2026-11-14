document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // PRELOADER
  // ========================================
  function hidePreloader() {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
    }, 1200);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  // ========================================
  // INIT LIBRARIES
  // ========================================
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80
  });

  gsap.registerPlugin(ScrollTrigger);
  initParticles();
  initCountdown();
  initScratchCard();

  // ========================================
  // "OPEN INVITATION" BUTTON
  // ========================================
  const openBtn = document.getElementById('open-invitation');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const couple = document.getElementById('scene-couple');
      if (couple) {
        gsap.to(window, {
          scrollTo: { y: couple, offsetY: 0 },
          duration: 1.2,
          ease: 'power2.inOut'
        });
      }
    });
  }


  // ========================================
  // QR CODES
  // ========================================
  const engagementMapUrl = 'https://maps.app.goo.gl/dgQ7LXW3ZknZo4Yt7';
  const weddingMapUrl = 'https://maps.app.goo.gl/dgQ7LXW3ZknZo4Yt7';

  function generateQR(containerId, url) {
    const el = document.getElementById(containerId);
    if (!el || typeof QRCode === 'undefined') return;
    new QRCode(el, {
      text: url,
      width: 100,
      height: 100,
      colorDark: '#3D3226',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  generateQR('engagement-qr', engagementMapUrl);
  generateQR('wedding-qr', weddingMapUrl);

  const engMapBtn = document.getElementById('engagement-map-btn');
  if (engMapBtn) engMapBtn.href = engagementMapUrl;

  const wedMapBtn = document.getElementById('wedding-map-btn');
  if (wedMapBtn) wedMapBtn.href = weddingMapUrl;

  // ========================================
  // BACK TO TOP
  // ========================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    ScrollTrigger.create({
      trigger: '#scene-thankyou',
      start: 'top 80%',
      onEnter: () => backToTop.classList.add('visible'),
      onLeaveBack: () => backToTop.classList.remove('visible')
    });

    backToTop.addEventListener('click', () => {
      gsap.to(window, {
        scrollTo: { y: 0 },
        duration: 2,
        ease: 'power2.inOut'
      });
    });
  }

  // ========================================
  // SHARE BUTTON
  // ========================================
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const url = window.location.href;
      const text = 'You are cordially invited to our wedding celebration!';

      if (navigator.share) {
        try {
          await navigator.share({ title: document.title, text, url });
        } catch (e) {
          // user cancelled
        }
      } else {
        try {
          await navigator.clipboard.writeText(url);
          showToast('Link copied to clipboard!');
        } catch (e) {
          showToast('Could not copy link');
        }
      }
    });
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.classList.add('toast');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ========================================
  // RESIZE HANDLER
  // ========================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });

});
