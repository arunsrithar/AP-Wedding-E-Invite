(function () {
  var GALLERY_DIR = 'images/gallery/';
  var IMAGE_EXT = '.jpg';
  var NUM_ROWS = 2;
  var ITEMS_PER_ROW = 6;

  var sizes = [
    { w: 300, h: 380 },
    { w: 360, h: 280 },
    { w: 280, h: 280 },
    { w: 380, h: 300 },
    { w: 260, h: 340 },
    { w: 340, h: 360 },
  ];

  var sizesMobile = [
    { w: 190, h: 240 },
    { w: 230, h: 180 },
    { w: 180, h: 180 },
    { w: 240, h: 190 },
    { w: 170, h: 220 },
    { w: 220, h: 230 },
  ];

  function getSizes() {
    return window.innerWidth <= 768 ? sizesMobile : sizes;
  }

  function probePhotos() {
    return new Promise(function (resolve) {
      var found = [];
      var i = 1;

      function tryNext() {
        var img = new Image();
        var src = GALLERY_DIR + i + IMAGE_EXT;
        img.onload = function () {
          found.push(src);
          i++;
          tryNext();
        };
        img.onerror = function () {
          resolve(found);
        };
        img.src = src;
      }

      tryNext();
    });
  }

  function createItem(photoSrc, size) {
    var item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.width = size.w + 'px';
    item.style.height = size.h + 'px';

    var inner = document.createElement('div');
    inner.className = 'frame-inner' + (photoSrc ? '' : ' empty');

    if (photoSrc) {
      var photo = document.createElement('div');
      photo.className = 'gallery-photo';
      photo.style.backgroundImage = 'url(' + photoSrc + ')';
      inner.appendChild(photo);
    }

    item.appendChild(inner);
    return item;
  }

  function buildWall(photos) {
    var wall = document.getElementById('gallery-wall');
    var emptyEl = document.getElementById('gallery-empty');
    if (!wall) return;

    if (photos.length === 0 && emptyEl) emptyEl.classList.add('visible');
    if (photos.length > 0 && emptyEl) emptyEl.classList.remove('visible');

    var frameSizes = getSizes();
    var speeds = [40, 34];

    for (var r = 0; r < NUM_ROWS; r++) {
      var row = document.createElement('div');
      row.className = 'gallery-marquee';

      var track = document.createElement('div');
      track.className = 'marquee-track';
      if (r % 2 === 1) track.classList.add('marquee-reverse');
      track.style.animationDuration = speeds[r] + 's';

      var items = [];
      for (var i = 0; i < ITEMS_PER_ROW; i++) {
        var photoSrc = photos.length > 0
          ? photos[(r * ITEMS_PER_ROW + i) % photos.length]
          : null;
        items.push(createItem(photoSrc, frameSizes[i % frameSizes.length]));
      }

      items.forEach(function (el) { track.appendChild(el); });
      items.forEach(function (el) { track.appendChild(el.cloneNode(true)); });

      row.appendChild(track);
      wall.appendChild(row);
    }

    wall.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      return false;
    });

    wall.addEventListener('dragstart', function (e) {
      e.preventDefault();
      return false;
    });
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
