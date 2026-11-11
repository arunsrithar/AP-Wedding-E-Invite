document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // PRELOADER
  // ========================================
  function hidePreloaderAndPlay() {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
      playOpeningScene();
    }, 1500);
  }

  if (document.readyState === 'complete') {
    hidePreloaderAndPlay();
  } else {
    window.addEventListener('load', hidePreloaderAndPlay);
  }

  // ========================================
  // INIT LIBRARIES
  // ========================================
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
  });

  gsap.registerPlugin(ScrollTrigger);
  initParticles();
  initCountdown();

  // ========================================
  // SCENE 1: OPENING CURTAIN
  // ========================================
  function playOpeningScene() {
    const tl = gsap.timeline();

    tl.to('.letterbox-top', { y: '-100%', duration: 1.5, ease: 'power2.inOut', delay: 0.5 })
      .to('.letterbox-bottom', { y: '100%', duration: 1.5, ease: 'power2.inOut' }, '<')
      .add(() => {
        document.querySelector('.silhouette-groom').classList.add('walk-in');
        document.querySelector('.silhouette-bride').classList.add('walk-in');
      }, '-=0.5')
      .add(() => {
        document.querySelector('.opening-text').classList.add('visible');
      }, '+=1.5');
  }

  // ========================================
  // SCENE 2: TITLE — RING DRAW + NAME REVEAL
  // ========================================
  ScrollTrigger.create({
    trigger: '#scene-title',
    start: 'top 80%',
    onEnter: () => {
      // Draw ring
      document.querySelector('.ring-circle').classList.add('drawn');
      setTimeout(() => {
        document.querySelector('.ring-diamond').classList.add('visible');
        document.querySelector('.ring-diamond-top').classList.add('visible');
      }, 1800);

      // Split names into letters and reveal
      document.querySelectorAll('.couple-names .name').forEach((el) => {
        const text = el.textContent;
        el.innerHTML = '';
        text.split('').forEach((char, i) => {
          const span = document.createElement('span');
          span.classList.add('char');
          span.textContent = char === ' ' ? ' ' : char;
          el.appendChild(span);
          setTimeout(() => span.classList.add('revealed'), 2200 + i * 80);
        });
        // Add shimmer overlay
        const shimmer = document.createElement('div');
        shimmer.classList.add('shimmer-overlay');
        el.appendChild(shimmer);
      });

      // Ampersand
      setTimeout(() => {
        document.querySelector('.ampersand').classList.add('visible');
      }, 2800);

      // Invitation line
      setTimeout(() => {
        document.querySelector('.invitation-line p').classList.add('visible');
        document.querySelector('.ornament-left').classList.add('visible');
        document.querySelector('.ornament-right').classList.add('visible');
      }, 3500);
    },
    once: true
  });

  // ========================================
  // SCENE 3: OUR STORY — HORIZONTAL SCROLL
  // ========================================
  const storyTrack = document.querySelector('.story-track');
  const storyPanels = gsap.utils.toArray('.story-panel');

  if (storyTrack && storyPanels.length > 1) {
    const totalScroll = (storyPanels.length - 1) * 100;

    gsap.to(storyTrack, {
      x: () => -(storyTrack.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: '#scene-story',
        start: 'top top',
        end: () => '+=' + storyTrack.scrollWidth,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    // Thread draw animation synced to scroll
    gsap.to('.thread-line', {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#scene-story',
        start: 'top top',
        end: () => '+=' + storyTrack.scrollWidth,
        scrub: 1
      }
    });
  }

  // ========================================
  // SCENE 4: SAVE THE DATE — CALENDAR FLIP
  // ========================================
  ScrollTrigger.create({
    trigger: '#scene-date',
    start: 'top 60%',
    onEnter: () => {
      document.querySelector('.calendar-card').classList.add('flipped');
      setTimeout(launchConfetti, 1200);
    },
    once: true
  });

  function launchConfetti() {
    const container = document.querySelector('.confetti-container');
    if (!container) return;

    const colors = ['#D4AF37', '#FFD700', '#F5E6C8', '#8B1A4A', '#C2185B', '#FFFFFF'];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      piece.style.animationDelay = Math.random() * 0.5 + 's';

      const shapes = ['circle', ''];
      if (Math.random() > 0.5) {
        piece.style.borderRadius = '50%';
      } else {
        piece.style.width = '6px';
        piece.style.height = '10px';
        piece.style.borderRadius = '2px';
      }

      container.appendChild(piece);

      setTimeout(() => piece.remove(), 5000);
    }
  }

  // ========================================
  // SCENE 5: VENUE — PARALLAX + ARCH DRAW
  // ========================================
  gsap.to('.sky-layer', {
    y: -80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#scene-venue',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.building-layer', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#scene-venue',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  ScrollTrigger.create({
    trigger: '#scene-venue',
    start: 'top 50%',
    onEnter: () => {
      document.querySelector('.arch-path').classList.add('drawn');
    },
    once: true
  });

  // ========================================
  // SCENE 8: CLOSING — CHARACTER REVEAL
  // ========================================
  ScrollTrigger.create({
    trigger: '#scene-closing',
    start: 'top 70%',
    onEnter: () => {
      document.querySelector('.closing-couple-svg').classList.add('visible');
    },
    once: true
  });

  // ========================================
  // NAV DOTS — ACTIVE STATE ON SCROLL
  // ========================================
  const scenes = gsap.utils.toArray('.scene');
  const navDots = document.querySelectorAll('.nav-dot');

  scenes.forEach((scene, i) => {
    ScrollTrigger.create({
      trigger: scene,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveDot(i),
      onEnterBack: () => setActiveDot(i)
    });
  });

  function setActiveDot(index) {
    navDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Smooth scroll for nav dots
  navDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 0 },
          duration: 1.2,
          ease: 'power2.inOut'
        });
      }
    });
  });

  // ========================================
  // BACK TO TOP BUTTON
  // ========================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    ScrollTrigger.create({
      trigger: '#scene-closing',
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
          // user cancelled or share failed
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
  // AUDIO TOGGLE (placeholder — no file yet)
  // ========================================
  const audioToggle = document.getElementById('audio-toggle');
  let audioPlaying = false;

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      audioPlaying = !audioPlaying;
      audioToggle.querySelector('.audio-icon-on').style.display = audioPlaying ? 'block' : 'none';
      audioToggle.querySelector('.audio-icon-off').style.display = audioPlaying ? 'none' : 'block';
      // TODO: Add actual audio element when music file is added
    });
  }

  // ========================================
  // REFRESH SCROLL TRIGGERS ON RESIZE
  // ========================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });

});
