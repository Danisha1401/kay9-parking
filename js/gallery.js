/* =============================================================
   Kay9 Hydro Tech Parking — photo & video gallery in each system pop-up
   Each dialog holds a .gal with a stage and a strip of thumbnails.
   Nothing heavy loads until the pop-up is opened; videos only load
   when their thumbnail is picked.
   ============================================================= */
(function () {
  'use strict';

  function show(gal, i, play) {
    var thumbs = gal.querySelectorAll('.gal-th');
    if (!thumbs.length) return;
    i = (i + thumbs.length) % thumbs.length;
    var th = thumbs[i];
    var stage = gal.querySelector('.gal-stage');
    gal._i = i;

    var old = stage.querySelector('video');
    if (old) old.pause();
    stage.innerHTML = '';

    var el;
    if (th.dataset.type === 'video') {
      el = document.createElement('video');
      el.src = th.dataset.src;
      el.poster = th.dataset.poster || '';
      el.controls = true;
      el.playsInline = true;
      el.preload = 'metadata';
      if (play) { el.muted = true; el.autoplay = true; }
    } else {
      el = document.createElement('img');
      el.src = th.dataset.src;
      var im = th.querySelector('img');
      el.alt = im ? im.alt : '';
      if (th.classList.contains('is-dwg')) stage.classList.add('is-dwg');
    }
    stage.classList.toggle('is-dwg', th.classList.contains('is-dwg'));
    stage.appendChild(el);

    if (thumbs.length > 1) {
      ['prev', 'next'].forEach(function (dir) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'gal-nav gal-' + dir;
        b.setAttribute('aria-label', dir === 'prev' ? 'Previous' : 'Next');
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' +
          (dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>';
        b.addEventListener('click', function () { show(gal, gal._i + (dir === 'prev' ? -1 : 1), true); });
        stage.appendChild(b);
      });
      var n = document.createElement('span');
      n.className = 'gal-count';
      n.textContent = (i + 1) + ' / ' + thumbs.length;
      stage.appendChild(n);
    }

    for (var k = 0; k < thumbs.length; k++) {
      thumbs[k].classList.toggle('is-on', k === i);
      thumbs[k].setAttribute('aria-pressed', k === i ? 'true' : 'false');
    }
    th.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  document.querySelectorAll('.gal').forEach(function (gal) {
    var thumbs = gal.querySelectorAll('.gal-th');
    thumbs.forEach(function (th, i) {
      th.addEventListener('click', function () { show(gal, i, true); });
    });
    var dlg = gal.closest('dialog');
    if (!dlg) return;
    dlg.addEventListener('close', function () {
      var v = gal.querySelector('.gal-stage video');
      if (v) v.pause();
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.target.closest('video')) return;
      if (e.key === 'ArrowRight') { show(gal, (gal._i || 0) + 1, true); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { show(gal, (gal._i || 0) - 1, true); e.preventDefault(); }
    });
  });

  /* fill the stage the first time a pop-up opens */
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-spec]');
    if (!opener) return;
    var dlg = document.getElementById(opener.dataset.spec);
    var gal = dlg && dlg.querySelector('.gal');
    if (gal && gal._i === undefined) show(gal, 0, false);
  });
})();
