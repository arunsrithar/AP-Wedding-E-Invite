/*  Scroll-driven scene manager
    Each .scene is pinned as a full-viewport slide.
    Scroll input drives per-section GSAP timelines (scrub).
    Exports addSceneAnimation() so other code can plug in per-section work. */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  const SCENES = [
    { id: 'scene-cover',      pinDuration: 0.5 },
    { id: 'scene-couple',     pinDuration: 1   },
    { id: 'scene-date',       pinDuration: 1   },
    { id: 'scene-engagement', pinDuration: 1   },
    { id: 'scene-wedding',    pinDuration: 1   },
    { id: 'scene-guest',      pinDuration: 1   },
    { id: 'scene-gallery',    pinDuration: 0.5 },
    { id: 'scene-thankyou',   pinDuration: 0.5 },
  ];

  const sceneTimelines = {};

  function init() {
    ScrollTrigger.defaults({ invalidateOnRefresh: true });

    SCENES.forEach(({ id, pinDuration }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => '+=' + window.innerHeight * pinDuration,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          pinSpacing: true,
        },
      });

      entryAnimation(tl, el);

      sceneTimelines[id] = tl;
    });

    ScrollTrigger.refresh();
  }

  function entryAnimation(tl, el) {
    gsap.set(el.querySelectorAll('.scene-content, .engagement-layout, .wedding-layout, .guest-group, .gallery-header, .gallery-wall, .gallery-empty-state, .thankyou-content'), {
      opacity: 1,
    });
  }

  window.SceneManager = {
    init: init,
    getTimeline: function (sceneId) {
      return sceneTimelines[sceneId] || null;
    },
    getAll: function () {
      return sceneTimelines;
    },
    setPinDuration: function (sceneId, multiplier) {
      const entry = SCENES.find(s => s.id === sceneId);
      if (entry) entry.pinDuration = multiplier;
    },
  };
})();
