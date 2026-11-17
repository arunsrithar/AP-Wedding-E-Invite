(function () {
  var GALLERY_DIR = 'images/gallery/';
  var NUM_ROWS = 2;
  var ITEMS_PER_ROW = 8;

  var ROW_HEIGHT = 340;
  var ROW_HEIGHT_MOBILE = 230;

  function getRowHeight() {
    return window.innerWidth <= 768 ? ROW_HEIGHT_MOBILE : ROW_HEIGHT;
  }

  var GALLERY_FILES = [
    '1.jpg','2.jpg','3.jpg','4.jpeg','5.jpeg','6.png',
    '7.jpeg','8.jpg','9.jpeg','10.jpg','11.jpg','12.jpg','13.jpeg'
  ];

  function probePhotos() {
    return Promise.all(GALLERY_FILES.map(function (name) {
      return new Promise(function (resolve) {
        var img = new Image();
        var src = GALLERY_DIR + name;
        img.onload = function () {
          resolve({ src: src, nw: img.naturalWidth, nh: img.naturalHeight });
        };
        img.onerror = function () { resolve(null); };
        img.src = src;
      });
    })).then(function (results) {
      return results.filter(Boolean);
    });
  }

  function createItem(photo, rowH) {
    var item = document.createElement('div');
    item.className = 'gallery-item';
    var w = photo ? Math.round(rowH * (photo.nw / photo.nh)) : Math.round(rowH * 0.75);
    item.style.width = w + 'px';
    item.style.height = rowH + 'px';

    var inner = document.createElement('div');
    inner.className = 'frame-inner' + (photo ? '' : ' empty');

    if (photo) {
      var pic = document.createElement('div');
      pic.className = 'gallery-photo';
      pic.style.backgroundImage = 'url(' + photo.src + ')';
      inner.appendChild(pic);
    }

    item.appendChild(inner);
    return item;
  }

  function observeEntry(rows) {
    if (!('IntersectionObserver' in window)) {
      rows.forEach(function (r) { r.classList.add('gallery-entered'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('gallery-entered');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    rows.forEach(function (r) { observer.observe(r); });
  }

  function buildWall(photos) {
    var wall = document.getElementById('gallery-wall');
    var emptyEl = document.getElementById('gallery-empty');
    if (!wall) return;

    if (photos.length === 0 && emptyEl) emptyEl.classList.add('visible');
    if (photos.length > 0 && emptyEl) emptyEl.classList.remove('visible');

    var rowH = getRowHeight();
    var speeds = [];
    for (var s = 0; s < NUM_ROWS; s++) {
      speeds.push(60 + Math.floor(Math.random() * 30));
    }
    var tracks = [];
    var rows = [];

    function shuffle(arr) {
      var a = arr.slice();
      for (var j = a.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = a[j]; a[j] = a[k]; a[k] = tmp;
      }
      return a;
    }

    var style = document.createElement('style');
    document.head.appendChild(style);

    for (var r = 0; r < NUM_ROWS; r++) {
      var row = document.createElement('div');
      row.className = 'gallery-marquee';

      var track = document.createElement('div');
      track.className = 'marquee-track';
      var isReverse = r % 2 === 1;
      if (isReverse) track.classList.add('marquee-reverse');

      var shuffled = photos.length > 0 ? shuffle(photos) : [];
      var items = [];
      for (var i = 0; i < ITEMS_PER_ROW; i++) {
        var photo = shuffled.length > 0
          ? shuffled[i % shuffled.length]
          : null;
        items.push(createItem(photo, rowH));
      }

      items.forEach(function (el) { track.appendChild(el); });
      items.forEach(function (el) { track.appendChild(el.cloneNode(true)); });

      row.appendChild(track);
      wall.appendChild(row);
      rows.push(row);
      tracks.push(track);

      (function (track, rowIdx, reverse, speed) {
        requestAnimationFrame(function () {
          var gap = parseFloat(getComputedStyle(track).gap) || 0;
          var halfW = 0;
          var children = track.children;
          var half = children.length / 2;
          for (var c = 0; c < half; c++) {
            halfW += children[c].offsetWidth;
          }
          halfW += gap * half;

          var name = 'marquee-r' + rowIdx;
          var fromX = reverse ? -halfW : 0;
          var toX = reverse ? 0 : -halfW;
          style.sheet.insertRule(
            '@keyframes ' + name + ' { from { transform: translateX(' + fromX + 'px); } to { transform: translateX(' + toX + 'px); } }',
            style.sheet.cssRules.length
          );
          track.style.animation = name + ' ' + speed + 's linear infinite';
          track.style.animationPlayState = 'paused';
        });
      })(track, r, isReverse, speeds[r]);
    }

    if (typeof SceneManager !== 'undefined' && SceneManager.onVisibilityChange) {
      SceneManager.onVisibilityChange('scene-gallery', function (visible) {
        var state = visible ? 'running' : 'paused';
        for (var t = 0; t < tracks.length; t++) {
          tracks[t].style.animationPlayState = state;
        }
      });
    }

    wall.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      return false;
    });

    wall.addEventListener('dragstart', function (e) {
      e.preventDefault();
      return false;
    });

    observeEntry(rows);
  }

  function init() {
    probePhotos().then(buildWall);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
