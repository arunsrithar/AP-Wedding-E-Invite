/*  Scroll-driven scene manager
    All scenes are stacked inside #scenes-wrapper (pinned).
    A single master timeline crossfades between scenes on scroll.
    Each scene gets a sub-timeline that external code can add animations to. */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  var SCENE_IDS = [
    'scene-cover',
    'scene-couple',
    'scene-date',
    'scene-engagement',
    'scene-wedding',
    'scene-guest',
    'scene-gallery',
    'scene-thankyou',
  ];

  var sceneTimelines = {};

  function init() {
    ScrollTrigger.defaults({ invalidateOnRefresh: true });

    var wrapper = document.getElementById('scenes-wrapper');
    if (!wrapper) return;

    var scenes = SCENE_IDS.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var n = scenes.length;

    scenes.forEach(function (el, i) {
      entryAnimation(el);
      if (i > 0) gsap.set(el, { autoAlpha: 0 });
    });

    var currentIndex = 0;

    var master = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: function () { return '+=' + window.innerHeight * n; },
        pin: true,
        scrub: 0.6,
        onUpdate: function (self) {
          var idx = Math.min(Math.floor(self.progress * n), n - 1);
          if (idx !== currentIndex) {
            gsap.set(scenes[currentIndex], { autoAlpha: 0 });
            gsap.set(scenes[idx], { autoAlpha: 1 });
            currentIndex = idx;
          }
        },
      },
    });

    scenes.forEach(function (el, i) {
      var tl = gsap.timeline();
      tl.to({}, { duration: 2.5 });
      master.add(tl, i * 2.5);
      sceneTimelines[SCENE_IDS[i]] = tl;
    });

    ScrollTrigger.refresh();
  }

  function entryAnimation(el) {
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
    setPinDuration: function () {},
  };
})();
