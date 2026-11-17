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
  var pinDurations = {};
  var DEFAULT_DURATION = 2.5;
  var sceneElements = [];
  var visibilityCallbacks = [];

  function init() {
    ScrollTrigger.defaults({ invalidateOnRefresh: true });

    var wrapper = document.getElementById('scenes-wrapper');
    if (!wrapper) return;

    sceneElements = SCENE_IDS.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var n = sceneElements.length;

    sceneElements.forEach(function (el, i) {
      entryAnimation(el);
      if (i > 0) gsap.set(el, { autoAlpha: 0 });
    });

    var offsets = [];
    var totalDuration = 0;
    for (var i = 0; i < n; i++) {
      offsets.push(totalDuration);
      totalDuration += (pinDurations[SCENE_IDS[i]] || DEFAULT_DURATION);
    }

    var currentIndex = 0;

    var master = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: function () {
          var totalScreens = 0;
          for (var j = 0; j < n; j++) {
            totalScreens += (pinDurations[SCENE_IDS[j]] || DEFAULT_DURATION);
          }
          return '+=' + window.innerHeight * totalScreens;
        },
        pin: true,
        scrub: 0.6,
        onUpdate: function (self) {
          var pos = self.progress * totalDuration;
          var idx = 0;
          for (var j = n - 1; j >= 0; j--) {
            if (pos >= offsets[j]) { idx = j; break; }
          }
          if (idx !== currentIndex) {
            var prev = currentIndex;
            currentIndex = idx;
            gsap.set(sceneElements[prev], { autoAlpha: 0 });
            gsap.set(sceneElements[idx], { autoAlpha: 1 });
            fireVisibilityCallbacks(SCENE_IDS[idx], true);
            fireVisibilityCallbacks(SCENE_IDS[prev], false);
          }
        },
      },
    });

    for (var i = 0; i < n; i++) {
      var dur = pinDurations[SCENE_IDS[i]] || DEFAULT_DURATION;
      var tl = gsap.timeline();
      tl.to({}, { duration: dur });
      master.add(tl, offsets[i]);
      sceneTimelines[SCENE_IDS[i]] = tl;
    }

    ScrollTrigger.refresh();
  }

  function entryAnimation(el) {
    gsap.set(el.querySelectorAll('.scene-content, .engagement-layout, .wedding-layout, .guest-group, .gallery-header, .gallery-wall, .gallery-empty-state, .thankyou-content'), {
      opacity: 1,
    });
  }

  function fireVisibilityCallbacks(sceneId, visible) {
    for (var i = 0; i < visibilityCallbacks.length; i++) {
      var cb = visibilityCallbacks[i];
      if (cb.sceneId === sceneId) cb.fn(visible);
    }
  }

  window.SceneManager = {
    init: init,
    getTimeline: function (sceneId) {
      return sceneTimelines[sceneId] || null;
    },
    getAll: function () {
      return sceneTimelines;
    },
    setPinDuration: function (sceneId, duration) {
      if (typeof duration === 'number' && duration > 0) {
        pinDurations[sceneId] = duration;
      }
    },
    onVisibilityChange: function (sceneId, fn) {
      visibilityCallbacks.push({ sceneId: sceneId, fn: fn });
    },
  };
})();
