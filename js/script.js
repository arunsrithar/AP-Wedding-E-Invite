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
  // PRELOADER
  // ========================================
  let coverEntryFired = false;

  function hidePreloader() {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
      triggerCoverEntry();
    }, 1200);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
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
      xPercent: -100, opacity: 0, duration: 1, ease: 'none'
    }, 0)
    .to('.decor-corner-br', {
      xPercent: 100, opacity: 0, duration: 1, ease: 'none'
    }, 0)
    .to('.monogram-wrapper', {
      scale: 0.5, opacity: 0, duration: 1, ease: 'none'
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

    // EXIT (1.5 → 2.5): illustration exits right, florals reverse out, text fades
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

    // EXIT (1.5 → 2.3): reverse out
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

  function addEngagementAnimationsToScroll() {
    var engTl = SceneManager.getTimeline('scene-engagement');
    if (!engTl) return;

    // ENTRY (0 → 1.0): mandap fades in, then title/content stagger
    engTl.fromTo('.mandap-bg-img',
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'none', immediateRender: false }, 0)
    .fromTo('#scene-engagement .event-title',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.3)
    .fromTo('#scene-engagement .ornament-line',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0.4)
    .fromTo('#scene-engagement .title-divider',
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.45)
    .fromTo('#scene-engagement .event-subtitle',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.5)
    .fromTo('.engagement-info',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.6)

    // EXIT (1.5 → 2.3): reverse out
    .fromTo('.engagement-info',
      { y: 0, opacity: 1 },
      { y: 30, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.5)
    .fromTo('#scene-engagement .event-subtitle',
      { y: 0, opacity: 1 },
      { y: -20, opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.55)
    .fromTo('#scene-engagement .title-divider',
      { opacity: 1, scaleX: 1 },
      { opacity: 0, scaleX: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.6)
    .fromTo('#scene-engagement .event-title',
      { y: 0, opacity: 1 },
      { y: -30, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.6)
    .fromTo('#scene-engagement .ornament-line',
      { opacity: 1 },
      { opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.65)
    .fromTo('.mandap-bg-img',
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 1.05, duration: 0.6, ease: 'none', immediateRender: false }, 1.7);
  }

  function addWeddingAnimationsToScroll() {
    var wedTl = SceneManager.getTimeline('scene-wedding');
    if (!wedTl) return;

    // ENTRY (0 → 1.0): arch fades in, then title/content stagger
    wedTl.fromTo('.wedding-bg-img',
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'none', immediateRender: false }, 0)
    .fromTo('#scene-wedding .event-title',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.3)
    .fromTo('#scene-wedding .ornament-line',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, 0.4)
    .fromTo('#scene-wedding .title-divider',
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.45)
    .fromTo('#scene-wedding .event-subtitle',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'none', immediateRender: false }, 0.5)
    .fromTo('.wedding-info',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, 0.6)

    // EXIT (1.5 → 2.3): reverse out
    .fromTo('.wedding-info',
      { y: 0, opacity: 1 },
      { y: 30, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.5)
    .fromTo('#scene-wedding .event-subtitle',
      { y: 0, opacity: 1 },
      { y: -20, opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.55)
    .fromTo('#scene-wedding .title-divider',
      { opacity: 1, scaleX: 1 },
      { opacity: 0, scaleX: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.6)
    .fromTo('#scene-wedding .event-title',
      { y: 0, opacity: 1 },
      { y: -30, opacity: 0, duration: 0.4, ease: 'none', immediateRender: false }, 1.6)
    .fromTo('#scene-wedding .ornament-line',
      { opacity: 1 },
      { opacity: 0, duration: 0.3, ease: 'none', immediateRender: false }, 1.65)
    .fromTo('.wedding-bg-img',
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

    // EXIT (1.5 → 2.3): reverse out
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

    // EXIT (1.5 → 2.1): reverse out
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

  gsap.set('.mandap-bg-img', { opacity: 0, scale: 1.05 });
  gsap.set('#scene-engagement .event-title', { y: -30, opacity: 0 });
  gsap.set('#scene-engagement .event-subtitle', { y: -20, opacity: 0 });
  gsap.set('#scene-engagement .ornament-line', { opacity: 0 });
  gsap.set('#scene-engagement .title-divider', { opacity: 0, scaleX: 0 });
  gsap.set('.engagement-info', { y: 30, opacity: 0 });

  gsap.set('.wedding-bg-img', { opacity: 0, scale: 1.05 });
  gsap.set('#scene-wedding .event-title', { y: -30, opacity: 0 });
  gsap.set('#scene-wedding .event-subtitle', { y: -20, opacity: 0 });
  gsap.set('#scene-wedding .ornament-line', { opacity: 0 });
  gsap.set('#scene-wedding .title-divider', { opacity: 0, scaleX: 0 });
  gsap.set('.wedding-info', { y: 30, opacity: 0 });

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
  addEngagementAnimationsToScroll();
  addWeddingAnimationsToScroll();
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

  // Overlay covers the scroll gap between cover and couple sections
  var coupleOverlay = document.createElement('div');
  coupleOverlay.style.cssText = 'position:fixed;inset:0;z-index:10;background:#FFFDF7;display:none;pointer-events:none;';
  document.body.appendChild(coupleOverlay);

  ScrollTrigger.create({
    trigger: '#scene-couple',
    start: 'top bottom',
    end: 'top top',
    onEnter: function() { coupleOverlay.style.display = ''; },
    onLeaveBack: function() { coupleOverlay.style.display = 'none'; },
    onLeave: function() { coupleOverlay.style.display = 'none'; },
    onEnterBack: function() { coupleOverlay.style.display = ''; },
  });

  // Overlay covers the scroll gap between couple and date sections
  var dateOverlay = document.createElement('div');
  dateOverlay.style.cssText = 'position:fixed;inset:0;z-index:10;background:#FFFDF7;display:none;pointer-events:none;';
  document.body.appendChild(dateOverlay);

  ScrollTrigger.create({
    trigger: '#scene-date',
    start: 'top bottom',
    end: 'top top',
    onEnter: function() { dateOverlay.style.display = ''; },
    onLeaveBack: function() { dateOverlay.style.display = 'none'; },
    onLeave: function() { dateOverlay.style.display = 'none'; },
    onEnterBack: function() { dateOverlay.style.display = ''; },
  });

  // Overlay covers the scroll gap between date and engagement sections
  var engOverlay = document.createElement('div');
  engOverlay.style.cssText = 'position:fixed;inset:0;z-index:10;background:#FFFDF7;display:none;pointer-events:none;';
  document.body.appendChild(engOverlay);

  ScrollTrigger.create({
    trigger: '#scene-engagement',
    start: 'top bottom',
    end: 'top top',
    onEnter: function() { engOverlay.style.display = ''; },
    onLeaveBack: function() { engOverlay.style.display = 'none'; },
    onLeave: function() { engOverlay.style.display = 'none'; },
    onEnterBack: function() { engOverlay.style.display = ''; },
  });

  // Overlay covers the scroll gap between engagement and wedding sections
  var wedOverlay = document.createElement('div');
  wedOverlay.style.cssText = 'position:fixed;inset:0;z-index:10;background:#FFFDF7;display:none;pointer-events:none;';
  document.body.appendChild(wedOverlay);

  ScrollTrigger.create({
    trigger: '#scene-wedding',
    start: 'top bottom',
    end: 'top top',
    onEnter: function() { wedOverlay.style.display = ''; },
    onLeaveBack: function() { wedOverlay.style.display = 'none'; },
    onLeave: function() { wedOverlay.style.display = 'none'; },
    onEnterBack: function() { wedOverlay.style.display = ''; },
  });

  // Overlay covers the scroll gap between wedding and guest sections
  var guestOverlay = document.createElement('div');
  guestOverlay.style.cssText = 'position:fixed;inset:0;z-index:10;background:#FFFDF7;display:none;pointer-events:none;';
  document.body.appendChild(guestOverlay);

  ScrollTrigger.create({
    trigger: '#scene-guest',
    start: 'top bottom',
    end: 'top top',
    onEnter: function() { guestOverlay.style.display = ''; },
    onLeaveBack: function() { guestOverlay.style.display = 'none'; },
    onLeave: function() { guestOverlay.style.display = 'none'; },
    onEnterBack: function() { guestOverlay.style.display = ''; },
  });

  // Overlay covers the scroll gap between guest and gallery sections
  var galOverlay = document.createElement('div');
  galOverlay.style.cssText = 'position:fixed;inset:0;z-index:10;background:#FFFDF7;display:none;pointer-events:none;';
  document.body.appendChild(galOverlay);

  ScrollTrigger.create({
    trigger: '#scene-gallery',
    start: 'top bottom',
    end: 'top top',
    onEnter: function() { galOverlay.style.display = ''; },
    onLeaveBack: function() { galOverlay.style.display = 'none'; },
    onLeave: function() { galOverlay.style.display = 'none'; },
    onEnterBack: function() { galOverlay.style.display = ''; },
  });

  // Overlay covers the scroll gap between gallery and thankyou sections
  var tyOverlay = document.createElement('div');
  tyOverlay.style.cssText = 'position:fixed;inset:0;z-index:10;background:#FFFDF7;display:none;pointer-events:none;';
  document.body.appendChild(tyOverlay);

  ScrollTrigger.create({
    trigger: '#scene-thankyou',
    start: 'top bottom',
    end: 'top top',
    onEnter: function() { tyOverlay.style.display = ''; },
    onLeaveBack: function() { tyOverlay.style.display = 'none'; },
    onLeave: function() { tyOverlay.style.display = 'none'; },
    onEnterBack: function() { tyOverlay.style.display = ''; },
  });

  // ========================================
  // "OPEN INVITATION" BUTTON (shortcut — auto-scrolls to couple section)
  // ========================================
  const openBtn = document.getElementById('open-invitation');
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const coupleTrigger = ScrollTrigger.getAll().find(
        st => st.trigger && st.trigger.id === 'scene-couple'
      );
      if (coupleTrigger) {
        gsap.to(window, {
          scrollTo: { y: coupleTrigger.start, autoKill: false },
          duration: 1.5,
          ease: 'sine.inOut'
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
