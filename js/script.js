document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // SCROLL RESTORE
  // ========================================
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var _savedScroll = sessionStorage.getItem('wedding_scroll');
  if (_savedScroll) sessionStorage.removeItem('wedding_scroll');
  window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('wedding_scroll', String(window.scrollY));
  });

  // ========================================
  // PRELOADER — only wait for cover-scene images, not everything
  // ========================================
  let coverEntryFired = false;

  function hidePreloader() {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
      triggerCoverEntry();
    }, 400);
  }

  var coverImages = document.querySelectorAll('#scene-cover img');
  var coverLoaded = 0;
  var coverTotal = coverImages.length;

  function checkCoverReady() {
    coverLoaded++;
    if (coverLoaded >= coverTotal) hidePreloader();
  }

  if (coverTotal === 0) {
    hidePreloader();
  } else {
    coverImages.forEach(function(img) {
      if (img.complete) {
        checkCoverReady();
      } else {
        img.addEventListener('load', checkCoverReady);
        img.addEventListener('error', checkCoverReady);
      }
    });
  }

  // ========================================
  // COVER ENTRY ANIMATION
  // ========================================
  function animateCoverEntry() {
    const tl = gsap.timeline({
      onComplete: addCoverExitToScroll
    });

    tl.to('.decor-corner-tl', {
      xPercent: 0, opacity: 0.5, duration: 1.6, ease: 'sine.inOut'
    })
    .to('.decor-corner-br', {
      xPercent: 0, opacity: 0.5, duration: 1.6, ease: 'sine.inOut'
    }, '-=1.4')

    .to('.monogram-frame-img', {
      opacity: 1, scale: 1, duration: 1.4, ease: 'sine.inOut'
    }, '-=0.6')

    .to('.monogram-svg', {
      opacity: 1, scale: 1, duration: 1.0, ease: 'sine.inOut',
      filter: 'drop-shadow(0 0 20px rgba(197, 165, 90, 0.6))',
    }, '-=0.4')
    .to('.monogram-svg', {
      filter: 'drop-shadow(0 0 0px rgba(197, 165, 90, 0))',
      duration: 1.4, ease: 'sine.inOut'
    })

    .to('.cover-label', {
      opacity: 1, y: 0, duration: 0.7, ease: 'sine.inOut'
    }, '-=1.0')
    .to('.open-invitation-btn', {
      opacity: 1, y: 0, duration: 0.7, ease: 'sine.inOut'
    }, '-=0.5');
  }

  function triggerCoverEntry() {
    if (coverEntryFired) return;
    coverEntryFired = true;
    animateCoverEntry();
  }

  function addCoverExitToScroll() {
    const coverTl = SceneManager.getTimeline('scene-cover');
    if (!coverTl) return;

    coverTl.to('.decor-corner-tl', {
      xPercent: -100, opacity: 0, duration: 2.5, ease: 'none'
    }, 0)
    .to('.decor-corner-br', {
      xPercent: 100, opacity: 0, duration: 2.5, ease: 'none'
    }, 0)
    .to('.monogram-wrapper', {
      scale: 0.5, opacity: 0, duration: 2.5, ease: 'none'
    }, 0);
  }

  function addCoupleAnimationsToScroll() {
    const coupleTl = SceneManager.getTimeline('scene-couple');
    if (!coupleTl) return;

    // ENTRY (0 → 1): florals from top/bottom (fast), illustration from left
    coupleTl.fromTo('.decor-floral-top',
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 0.75, duration: 0.4, ease: 'none', immediateRender: false }, 0)
    .fromTo('.decor-floral-bottom',
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 0.75, duration: 0.4, ease: 'none', immediateRender: false }, 0)
    .fromTo('.couple-illustration',
      { xPercent: function() {
          var el = document.querySelector('.couple-illustration');
          return el ? -Math.ceil((window.innerWidth / el.offsetWidth) * 100) : -400;
        }, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 1, ease: 'none', immediateRender: false }, 0)
    .fromTo('.couple-invocation',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'none', immediateRender: false }, 0.3)
    .fromTo('.couple-details',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'none', immediateRender: false }, 0.3)

    .fromTo('.couple-illustration',
      { xPercent: 0, opacity: 1 },
      {
        xPercent: function() {
          var el = document.querySelector('.couple-illustration');
          return el ? Math.ceil((window.innerWidth / el.offsetWidth) * 100) : 400;
        },
        opacity: 0, duration: 1, ease: 'none', immediateRender: false
      }, 1.5)
    .fromTo('.decor-floral-top',
      { yPercent: 0, opacity: 0.75 },
      { yPercent: -100, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 2.1)
    .fromTo('.decor-floral-bottom',
      { yPercent: 0, opacity: 0.75 },
      { yPercent: 100, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 2.1)
    .fromTo('.couple-invocation',
      { y: 0, opacity: 1 },
      { y: -30, opacity: 0, duration: 0.7, ease: 'none', immediateRender: false }, 1.5)
    .fromTo('.couple-details',
      { y: 0, opacity: 1 },
      { y: 30, opacity: 0, duration: 0.7, ease: 'none', immediateRender: false }, 1.5);
  }

  function addDateAnimationsToScroll() {
    var dateTl = SceneManager.getTimeline('scene-date');
    if (!dateTl) return;

    // ENTRY (0 → 0.9): florals slide in, content appears
    dateTl.fromTo('.decor-date-floral-left',
      { xPercent: -100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.6, ease: 'none', immediateRender: false }, 0)
    .fromTo('.decor-date-floral-right',
      { xPercent: 100, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.6, ease: 'none', immediateRender: false }, 0)
    .fromTo('.date-label',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.2)
    .fromTo('.date-couple-scratch-wrapper',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.3)
    .fromTo('.countdown-container',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.4)

    .fromTo('.countdown-container',
      { y: 0, opacity: 1 },
      { y: 20, opacity: 0, duration: 0.5, ease: 'none', immediateRender: false }, 1.5)
    .fromTo('.date-couple-scratch-wrapper',
      { scale: 1, opacity: 1 },
      { scale: 0.85, opacity: 0, duration: 0.5, ease: 'none', immediateRender: false }, 1.5)
    .fromTo('.date-label',
      { y: 0, opacity: 1 },
      { y: -20, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.6)
    .fromTo('.decor-date-floral-left',
      { xPercent: 0, opacity: 1 },
      { xPercent: -100, opacity: 0, duration: 0.6, ease: 'none', immediateRender: false }, 1.7)
    .fromTo('.decor-date-floral-right',
      { xPercent: 0, opacity: 1 },
      { xPercent: 100, opacity: 0, duration: 0.6, ease: 'none', immediateRender: false }, 1.7);
  }

  function addEventAnimationsToScroll(sceneId, bgSelector, infoSelector) {
    var tl = SceneManager.getTimeline(sceneId);
    if (!tl) return;
    var prefix = '#' + sceneId + ' ';

    tl.fromTo(bgSelector,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'none', immediateRender: false }, 0)
    .fromTo(prefix + '.event-title',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.3)
    .fromTo(prefix + '.ornament-line',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0.4)
    .fromTo(prefix + '.title-divider',
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.45)
    .fromTo(prefix + '.event-subtitle',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.5)
    .fromTo(infoSelector,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.6)

    .fromTo(infoSelector,
      { y: 0, opacity: 1 },
      { y: 30, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.5)
    .fromTo(prefix + '.event-subtitle',
      { y: 0, opacity: 1 },
      { y: -20, opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.55)
    .fromTo(prefix + '.title-divider',
      { opacity: 1, scaleX: 1 },
      { opacity: 0, scaleX: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.6)
    .fromTo(prefix + '.event-title',
      { y: 0, opacity: 1 },
      { y: -30, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.6)
    .fromTo(prefix + '.ornament-line',
      { opacity: 1 },
      { opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.65)
    .fromTo(bgSelector,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 1.05, duration: 0.6, ease: 'none', immediateRender: false }, 1.7);
  }

  function addGuestAnimationsToScroll() {
    var guestTl = SceneManager.getTimeline('scene-guest');
    if (!guestTl) return;

    // ENTRY (0 → 1.0): image slides in, text staggers
    guestTl.fromTo('.couple-dance-img',
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'none', immediateRender: false }, 0)
    .fromTo('.guest-heading',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.3)
    .fromTo('.guest-message',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.4)
    .fromTo('.guest-sign',
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.6)

    .fromTo('.guest-sign',
      { opacity: 1 },
      { opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.5)
    .fromTo('.guest-message',
      { y: 0, opacity: 1 },
      { y: 20, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.55)
    .fromTo('.guest-heading',
      { y: 0, opacity: 1 },
      { y: -20, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.6)
    .fromTo('.couple-dance-img',
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 1.05, duration: 0.6, ease: 'none', immediateRender: false }, 1.7);
  }

  function addGalleryAnimationsToScroll() {
    var galTl = SceneManager.getTimeline('scene-gallery');
    if (!galTl) return;

    // ENTRY (0 → 0.8): header staggers in, then gallery content
    galTl.fromTo('.gallery-ornament',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0)
    .fromTo('.gallery-sub-top',
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0.1)
    .fromTo('.gallery-heading',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.15)
    .fromTo('#scene-gallery .title-divider',
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0.25)
    .fromTo('.gallery-subtitle',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0.3)
    .fromTo('#gallery-wall, #gallery-empty',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.4)

    .fromTo('#gallery-wall, #gallery-empty',
      { y: 0, opacity: 1 },
      { y: 30, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.5)
    .fromTo('.gallery-subtitle',
      { opacity: 1 },
      { opacity: 0, duration: 0.2, ease: 'none', immediateRender: false }, 1.55)
    .fromTo('#scene-gallery .title-divider',
      { opacity: 1, scaleX: 1 },
      { opacity: 0, scaleX: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.6)
    .fromTo('.gallery-heading',
      { y: 0, opacity: 1 },
      { y: -20, opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.65)
    .fromTo('.gallery-sub-top',
      { y: 0, opacity: 1 },
      { y: -15, opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.7)
    .fromTo('.gallery-ornament',
      { opacity: 1 },
      { opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.75);
  }

  function addThankyouAnimationsToScroll() {
    var tyTl = SceneManager.getTimeline('scene-thankyou');
    if (!tyTl) return;

    // ENTRY (0 → 0.8): heading, message, illustration, actions stagger in
    tyTl.fromTo('.thankyou-heading',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0)
    .fromTo('.thankyou-message',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.15)
    .fromTo('.thankyou-illustration',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.3)
    .fromTo('.thankyou-actions',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0.5)
    .fromTo('.footer-credit',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0.6);
  }

  // ========================================
  // INIT LIBRARIES
  // ========================================
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  gsap.set('.decor-corner-tl', { xPercent: -100, opacity: 0, rotation: 180 });
  gsap.set('.decor-corner-br', { xPercent: 100, opacity: 0 });
  gsap.set('.monogram-frame-img', { opacity: 0, scale: 0.6 });
  gsap.set('.monogram-svg', { opacity: 0, scale: 0.8 });
  gsap.set('.cover-label', { opacity: 0, y: 8 });
  gsap.set('.open-invitation-btn', { opacity: 0, y: 8 });

  gsap.set('.decor-floral-top', { yPercent: -100, opacity: 0 });
  gsap.set('.decor-floral-bottom', { yPercent: 100, opacity: 0 });
  gsap.set('.couple-illustration', {
    xPercent: function() {
      var el = document.querySelector('.couple-illustration');
      return el ? -Math.ceil((window.innerWidth / el.offsetWidth) * 100) : -400;
    },
    opacity: 0
  });
  gsap.set('.couple-invocation', { y: -30, opacity: 0 });
  gsap.set('.couple-details', { y: 30, opacity: 0 });

  gsap.set('.decor-date-floral-left', { xPercent: -100, opacity: 0 });
  gsap.set('.decor-date-floral-right', { xPercent: 100, opacity: 0 });
  gsap.set('.date-label', { y: -20, opacity: 0 });
  gsap.set('.date-couple-scratch-wrapper', { scale: 0.9, opacity: 0 });
  gsap.set('.countdown-container', { y: 20, opacity: 0 });

  initParticles();
  initCountdown();
  initScratchCard();
  SceneManager.setPinDuration('scene-couple', 2.5);
  SceneManager.setPinDuration('scene-date', 2.5);
  SceneManager.setPinDuration('scene-engagement', 2.5);
  SceneManager.setPinDuration('scene-wedding', 2.5);
  SceneManager.setPinDuration('scene-guest', 2.5);
  SceneManager.setPinDuration('scene-gallery', 2.5);
  SceneManager.setPinDuration('scene-thankyou', 1.5);
  SceneManager.init();

  ['scene-engagement', 'scene-wedding'].forEach(function (id) {
    var prefix = '#' + id + ' ';
    var bgSel = id === 'scene-engagement' ? '.mandap-bg-img' : '.wedding-bg-img';
    var infoSel = id === 'scene-engagement' ? '.engagement-info' : '.wedding-info';
    gsap.set(bgSel, { opacity: 0, scale: 1.05 });
    gsap.set(prefix + '.event-title', { y: -30, opacity: 0 });
    gsap.set(prefix + '.event-subtitle', { y: -20, opacity: 0 });
    gsap.set(prefix + '.ornament-line', { opacity: 0 });
    gsap.set(prefix + '.title-divider', { opacity: 0, scaleX: 0 });
    gsap.set(infoSel, { y: 30, opacity: 0 });
  });

  gsap.set('.couple-dance-img', { opacity: 0, scale: 1.05 });
  gsap.set('.guest-heading', { y: -20, opacity: 0 });
  gsap.set('.guest-message', { y: 20, opacity: 0 });
  gsap.set('.guest-sign', { opacity: 0 });

  gsap.set('.gallery-ornament', { opacity: 0 });
  gsap.set('.gallery-sub-top', { y: -15, opacity: 0 });
  gsap.set('.gallery-heading', { y: -20, opacity: 0 });
  gsap.set('#scene-gallery .title-divider', { opacity: 0, scaleX: 0 });
  gsap.set('.gallery-subtitle', { opacity: 0 });
  gsap.set('#gallery-wall, #gallery-empty', { y: 30, opacity: 0 });

  gsap.set('.thankyou-heading', { y: -20, opacity: 0 });
  gsap.set('.thankyou-message', { y: 15, opacity: 0 });
  gsap.set('.thankyou-illustration', { opacity: 0, scale: 0.9 });
  gsap.set('.thankyou-actions', { y: 15, opacity: 0 });
  gsap.set('.footer-credit', { opacity: 0 });

  addCoupleAnimationsToScroll();
  addDateAnimationsToScroll();
  addEventAnimationsToScroll('scene-engagement', '.mandap-bg-img', '.engagement-info');
  addEventAnimationsToScroll('scene-wedding', '.wedding-bg-img', '.wedding-info');
  addGuestAnimationsToScroll();
  addGalleryAnimationsToScroll();
  addThankyouAnimationsToScroll();

  // Restore scroll position on refresh
  if (_savedScroll) {
    var _pos = parseInt(_savedScroll);
    if (_pos > 0) {
      document.getElementById('preloader').classList.add('hidden');
      coverEntryFired = true;
      gsap.set('.decor-corner-tl', { xPercent: 0, opacity: 0.5 });
      gsap.set('.decor-corner-br', { xPercent: 0, opacity: 0.5 });
      gsap.set('.monogram-frame-img', { opacity: 1, scale: 1 });
      gsap.set('.monogram-svg', { opacity: 1, scale: 1 });
      gsap.set('.cover-label', { opacity: 1, y: 0 });
      gsap.set('.open-invitation-btn', { opacity: 1, y: 0 });

      requestAnimationFrame(function() {
        window.scrollTo(0, _pos);
        ScrollTrigger.refresh();
      });
    }
  }


  // ========================================
  // "OPEN INVITATION" BUTTON (shortcut — auto-scrolls to couple section)
  // ========================================
  const openBtn = document.getElementById('open-invitation');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      gsap.to(window, {
        scrollTo: { y: 3970, autoKill: false },
        duration: 1.5,
        ease: 'sine.inOut'
      });
    });
  }


  // ========================================
  // BACK TO TOP
  // ========================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    ScrollTrigger.create({
      trigger: '#scenes-wrapper',
      start: () => '+=' + (window.innerHeight * 7),
      end: 'max',
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
