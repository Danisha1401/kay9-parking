/* =============================================================
   Kay9 Hydro Tech Parking — scroll-driven build sequence
   The track is 7 viewports tall. The stage is pinned to the top of
   it, and every seventh of the scrolled distance is one "step":
   step 0 = empty plot, steps 1-6 = the six systems.
   ============================================================= */
(function () {
  'use strict';

  var STEPS = 7;

  var track = document.getElementById('track');
  var stage = document.getElementById('stage');
  if (!track || !stage) return;

  var panels  = Array.prototype.slice.call(stage.querySelectorAll('.panel'));
  var anchors = Array.prototype.slice.call(track.querySelectorAll('.step-anchor'));
  var rail    = Array.prototype.slice.call(document.querySelectorAll('.rail li'));
  var parts   = Array.prototype.slice.call(stage.querySelectorAll('.scene [data-from]'));
  var bar     = document.getElementById('hdrProgress');

  var cur = -1;
  var range = 0;

  /* A refresh would otherwise drop the visitor back into the middle of the pinned
     sequence, which reads as a broken page. Reloads start at the top unless the
     URL actually names a section. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---- place the anchor targets at the centre of each step band ---- */
  function layout() {
    var stageH = stage.getBoundingClientRect().height || window.innerHeight;
    range = Math.max(1, track.offsetHeight - stageH);
    anchors.forEach(function (a, i) {
      a.style.top = Math.round(range * ((i + 0.5) / STEPS)) + 'px';
    });
  }

  /* ---- which step are we on ---- */
  function stepNow() {
    var top = track.getBoundingClientRect().top;
    var p = (-top) / range;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    return Math.min(STEPS - 1, Math.floor(p * STEPS));
  }

  function apply(step) {
    if (step === cur) return;
    cur = step;
    stage.setAttribute('data-step', String(step));

    panels.forEach(function (p) {
      p.classList.toggle('on', Number(p.dataset.panel) === step);
    });

    parts.forEach(function (el) {
      var from = Number(el.dataset.from);
      var to   = el.dataset.to ? Number(el.dataset.to) : Infinity;
      el.classList.toggle('on', step >= from && step <= to);
    });

    rail.forEach(function (li, i) {
      li.classList.toggle('is-on', i === step);
      var a = li.querySelector('a');
      if (a) a.setAttribute('aria-current', i === step ? 'step' : 'false');
    });
  }

  /* ---- page-wide progress bar in the header ---- */
  function progress() {
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      apply(stepNow());
      progress();
      ticking = false;
    });
  }

  /* ---- if the page was opened on a system link, land on that step ---- */
  function honourHash() {
    if (!location.hash) return;
    var el = document.getElementById(location.hash.slice(1));
    if (el && el.classList.contains('step-anchor')) {
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
    }
  }

  /* Tapping a system in the menu leaves e.g. #tower on the URL, and phone browsers
     keep that URL for the tab. Every later visit would then reopen mid-sequence.
     The link still works on arrival; the fragment is dropped once it has been used. */
  function stripHash() {
    if (location.hash && history.replaceState) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }
  window.addEventListener('hashchange', function () { setTimeout(stripHash, 900); });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      layout();
      cur = -1;            // force a re-apply at the new size
      onScroll();
    }, 150);
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  /* Belt and braces on the reload position: Safari can restore its own scroll
     offset after this script has already run, so retry on load and once more on
     the next frame. A URL that names a section is still honoured. */
  function toTop() { if (!location.hash) window.scrollTo(0, 0); }

  layout();
  if (location.hash) { honourHash(); setTimeout(stripHash, 300); }
  else toTop();
  apply(stepNow());
  progress();

  /* images finishing late can change the document height */
  window.addEventListener('load', function () {
    layout();
    toTop();
    window.requestAnimationFrame(toTop);
    onScroll();
  });

  /* returning via the back/forward cache */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { toTop(); onScroll(); }
  });
})();
