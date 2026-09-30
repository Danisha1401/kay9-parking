/* =============================================================
   Kay9 Hydro Tech Parking — looping hero illustration
   The SVG scene has one set of parts per system. Each part carries
   data-from / data-to step numbers; this script moves the scene from
   step to step on a timer and adds .on to the parts that belong to
   the current step:
     0 empty plot · 1 two level · 2 three level · 3 pit stack
     4 puzzle · 5 tower · 6 bikes
   A "slide" is one system: a run of steps plus a caption.
   ============================================================= */
(function () {
  'use strict';

  var anim = document.getElementById('anim');
  if (!anim) return;

  /* steps: [step, how long to hold it in ms] */
  var SLIDES = [
    { name: 'Two & Three Level Stack', line: 'Two cars where one used to fit.',
      steps: [[0, 1100], [1, 2400], [2, 3200]] },
    { name: 'Four Post Pit Stack',     line: 'Go down as well as up.',
      steps: [[3, 5000]] },
    { name: 'Puzzle System',           line: 'Every pallet moves. Nothing else has to.',
      steps: [[4, 5600]] },
    { name: 'Tower Parking',           line: 'A car park with the footprint of a room.',
      steps: [[5, 6400]] },
    { name: 'Bike Stack Parking',      line: 'Two-wheelers, stacked and counted.',
      steps: [[6, 5000]] }
  ];

  var parts  = Array.prototype.slice.call(anim.querySelectorAll('.scene [data-from]'));
  var dots   = Array.prototype.slice.call(anim.querySelectorAll('.anim-dots button'));
  var nameEl = document.getElementById('animName');
  var lineEl = document.getElementById('animLine');
  var still  = window.matchMedia('(prefers-reduced-motion: reduce)');

  var slide = 0, sub = 0, timer = null;
  var visible = true;

  function showStep(step) {
    anim.setAttribute('data-step', String(step));
    parts.forEach(function (el) {
      var from = Number(el.dataset.from);
      var to   = el.dataset.to ? Number(el.dataset.to) : Infinity;
      el.classList.toggle('on', step >= from && step <= to);
    });
  }

  function slideLength(i) {
    return SLIDES[i].steps.reduce(function (t, s) { return t + s[1]; }, 0);
  }

  function showSlide(i) {
    slide = i;
    sub = 0;
    nameEl.textContent = SLIDES[i].name;
    lineEl.textContent = SLIDES[i].line;
    dots.forEach(function (d, n) {
      d.classList.toggle('is-on', n === i);
      d.setAttribute('aria-pressed', String(n === i));
    });
    /* the dot fills over the whole slide; restart its animation */
    anim.style.setProperty('--slide-ms', slideLength(i) + 'ms');
    var fill = dots[i] && dots[i].querySelector('i');
    if (fill) { fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = ''; }
  }

  function tick() {
    clearTimeout(timer);
    var s = SLIDES[slide].steps[sub];
    showStep(s[0]);
    if (!playing()) return;
    timer = setTimeout(function () {
      sub++;
      if (sub >= SLIDES[slide].steps.length) showSlide((slide + 1) % SLIDES.length);
      tick();
    }, s[1]);
  }

  function playing() { return visible && !document.hidden && !still.matches; }

  function go(i) {
    showSlide(i);
    /* with motion reduced, jump straight to the finished picture */
    if (still.matches) sub = SLIDES[i].steps.length - 1;
    tick();
  }

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { go(i); });
  });

  /* only run while the hero is on screen and the tab is in front */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var was = visible;
      visible = entries[0].isIntersecting;
      anim.classList.toggle('is-paused', !visible);
      if (visible && !was) go(slide);      // restart the slide so the dot and scene stay in step
      if (!visible) clearTimeout(timer);
    }, { threshold: 0.15 }).observe(anim);
  }
  document.addEventListener('visibilitychange', function () {
    anim.classList.toggle('is-paused', document.hidden);
    if (document.hidden) clearTimeout(timer); else go(slide);
  });

  go(0);
})();
