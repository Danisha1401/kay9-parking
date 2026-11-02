/* =============================================================
   Kay9 Hydro Tech Parking — looping hero illustration
   The SVG scene holds one group (.scn) per system. Each slide below
   is a short timeline that moves that system's parts the way the
   real machine moves them (taken from our installation videos).

   tracks: { elementId: { prop: [[ms, value], ...] } }
     x, y  translate (svg units)   r  rotate (deg)
     s     scale                    o  opacity
   Between two keys the value eases in and out; before the first key
   it holds the first value, after the last key it holds the last.
   ============================================================= */
(function () {
  'use strict';

  var anim = document.getElementById('anim');
  if (!anim) return;

  var GROUND = 606;   // top of a pallet resting on the ground line (620)

  var SLIDES = [
    { scene: 'sc-four', name: 'Four Pole Stack',
      line: 'A platform lifts one car so a second can park underneath.',
      dur: 9800,
      tracks: {
        'fp-car-a': { x: [[0, -180], [2300, 600]], y: [[0, 620], [700, 620], [1100, GROUND], [2600, GROUND], [4900, 382]] },
        'fp-plat':  { y: [[2600, GROUND], [4900, 382]] },
        'fp-car-b': { x: [[5300, -180], [7500, 600]], y: [[0, 620]] }
      } },

    { scene: 'sc-horiz', name: 'Horizontal (Shuttle Type Back-To-Back)',
      line: 'The lift turns and lowers the car; a shuttle carries it to a free bay.',
      dur: 11600,
      tracks: {
        'hz-car':     { x: [[0, -120], [2000, 225], [5600, 225], [6600, 392], [8000, 747]],
                        y: [[0, 390], [8200, 390], [9600, 190]],
                        r: [[2200, 90], [3600, 0]],
                        s: [[0, 1.12], [3800, 1.12], [5000, 1]] },
        'hz-tt':      { x: [[0, 225]], y: [[0, 390]], r: [[2200, 0], [3600, -90]] },
        'hz-shuttle': { x: [[3800, 900], [5400, 392], [6700, 392], [8000, 747], [9800, 747], [11200, 900]], y: [[0, 390]] }
      } },

    { scene: 'sc-puzzle', name: 'Puzzle',
      line: 'Pallets shift sideways to open a gap, and the car above comes down.',
      dur: 9800,
      tracks: {
        'pz-u0':  { x: [[0, 335]], y: [[0, 400]] },
        'pz-u2':  { x: [[0, 875]], y: [[0, 400]] },
        'pz-g0':  { x: [[0, 335]], y: [[0, GROUND]] },
        'pz-g1':  { x: [[900, 605], [2700, 875]], y: [[0, GROUND]] },
        'pz-u1':  { x: [[0, 605]], y: [[3000, 400], [5400, GROUND]] },
        'pz-car': { y: [[5800, 0], [7600, 46]], s: [[5800, 1], [7600, 1.4]], o: [[6700, 1], [7600, 0]] }
      } },

    { scene: 'sc-cant', name: 'Single/Two Pole Cantilever',
      line: 'Posts on one side only, so the space below stays open.',
      dur: 9600,
      tracks: {
        'cv-car-a': { x: [[0, 585]], y: [[0, 560], [2000, GROUND], [2400, GROUND], [4700, 380]],
                      s: [[0, .55], [2000, 1]], o: [[0, 0], [700, 1]] },
        'cv-plat':  { y: [[2400, GROUND], [4700, 380]] },
        'cv-car-b': { x: [[0, 585]], y: [[5000, 580], [7000, 620]],
                      s: [[5000, .55], [7000, 1]], o: [[5000, 0], [5700, 1]] }
      } },

    { scene: 'sc-three', name: 'Three Level Stack',
      line: 'Three cars in one bay. To bring a level down, the spaces below clear first.',
      dur: 10600,
      tracks: {
        'tl-car-0': { x: [[1000, 600], [3000, 1420]], y: [[0, 620]] },
        'tl-p2':    { y: [[0, 196]] },
        'tl-car-2': { x: [[0, 600]], y: [[0, 196]] },
        'tl-p1':    { y: [[3300, 410], [5600, GROUND]] },
        'tl-car-1': { x: [[6000, 600], [8200, 1420]], y: [[0, 410], [3300, 410], [5600, GROUND]] }
      } },

    { scene: 'sc-tower', name: 'Tower',
      line: 'A lift in the middle carries each car up to a free slot.',
      dur: 10400,
      tracks: {
        'tw-car':  { y: [[0, -30], [1800, 0]], s: [[0, .6], [1800, 1]], o: [[0, 0], [600, 1]] },
        'tw-lift': { x: [[0, 600]], y: [[2100, 614], [4700, 348], [6600, 348], [8800, 614]] },
        'tw-pal':  { x: [[5000, 600], [6300, 460]], y: [[2100, 610], [4700, 344]] }
      } },

    { scene: 'sc-pit', name: 'Two/Three Level Pit Stack',
      line: 'Both platforms move together: one car below ground, one at ground level.',
      dur: 10400,
      tracks: {
        'pt-car-a': { x: [[0, -180], [2200, 600]], y: [[0, 620], [700, 620], [1100, GROUND], [2500, GROUND], [4300, 456], [6900, 456], [8800, GROUND]] },
        'pt-frame': { y: [[2500, GROUND], [4300, 456], [6900, 456], [8800, GROUND]] },
        'pt-car-b': { x: [[4500, -180], [6600, 600]], y: [[0, 620], [5000, 620], [5400, GROUND], [6900, GROUND], [8800, 756]] }
      } }
  ];

  SLIDES.forEach(function (sl) {
    sl.el = document.getElementById(sl.scene);
    sl.parts = Object.keys(sl.tracks).map(function (id) {
      return { el: document.getElementById(id), t: sl.tracks[id] };
    }).filter(function (p) { return p.el; });
  });

  var dots   = Array.prototype.slice.call(anim.querySelectorAll('.anim-dots button'));
  var nameEl = document.getElementById('animName');
  var lineEl = document.getElementById('animLine');
  var still  = window.matchMedia('(prefers-reduced-motion: reduce)');

  function ease(p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }

  function value(keys, t, dflt) {
    if (!keys) return dflt;
    if (t <= keys[0][0]) return keys[0][1];
    for (var i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        var a = keys[i - 1], b = keys[i];
        return a[1] + (b[1] - a[1]) * ease((t - a[0]) / (b[0] - a[0]));
      }
    }
    return keys[keys.length - 1][1];
  }

  function render(sl, t) {
    sl.parts.forEach(function (p) {
      var x = value(p.t.x, t, 0), y = value(p.t.y, t, 0);
      var r = value(p.t.r, t, 0), s = value(p.t.s, t, 1);
      p.el.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' +
        (r ? ' rotate(' + r.toFixed(2) + ')' : '') + (s !== 1 ? ' scale(' + s.toFixed(3) + ')' : ''));
      if (p.t.o) p.el.style.opacity = value(p.t.o, t, 1).toFixed(3);
    });
  }

  var slide = 0, elapsed = 0, last = 0, raf = 0, visible = true;

  function playing() { return visible && !document.hidden && !still.matches; }

  function showSlide(i) {
    slide = i;
    elapsed = 0;
    var sl = SLIDES[i];
    SLIDES.forEach(function (o) { if (o.el) o.el.classList.toggle('on', o === sl); });
    nameEl.textContent = sl.name;
    lineEl.textContent = sl.line;
    dots.forEach(function (d, n) {
      d.classList.toggle('is-on', n === i);
      d.setAttribute('aria-pressed', String(n === i));
    });
    /* the dot fills over the whole slide; restart its animation */
    anim.style.setProperty('--slide-ms', sl.dur + 'ms');
    var fill = dots[i] && dots[i].querySelector('i');
    if (fill) { fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = ''; }
    /* with motion reduced, show the finished picture */
    render(sl, still.matches ? sl.dur : 0);
  }

  function frame(now) {
    raf = 0;
    if (!playing()) return;
    elapsed += Math.min(now - last, 100);   // a long gap (tab switch) never skips a slide
    last = now;
    if (elapsed >= SLIDES[slide].dur) showSlide((slide + 1) % SLIDES.length);
    render(SLIDES[slide], elapsed);
    raf = requestAnimationFrame(frame);
  }

  function resume() {
    if (raf || !playing()) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  function go(i) {
    showSlide((i + SLIDES.length) % SLIDES.length);
    resume();
  }

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { go(i); });
  });
  var prev = anim.querySelector('.anim-prev'), next = anim.querySelector('.anim-next');
  if (prev) prev.addEventListener('click', function () { go(slide - 1); });
  if (next) next.addEventListener('click', function () { go(slide + 1); });

  /* swipe left for the next system, right for the previous one */
  var wrap = anim.querySelector('.scene-wrap'), sx = null, sy = 0;
  wrap.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' || e.target.closest('.anim-nav')) return;
    sx = e.clientX; sy = e.clientY;
  });
  wrap.addEventListener('pointerup', function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(slide + (dx < 0 ? 1 : -1));
  });
  wrap.addEventListener('pointercancel', function () { sx = null; });

  /* only run while the hero is on screen and the tab is in front */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var was = visible;
      visible = entries[0].isIntersecting;
      anim.classList.toggle('is-paused', !visible);
      if (visible && !was) { showSlide(slide); resume(); }   // restart so the dot and scene stay in step
      if (!visible) pause();
    }, { threshold: 0.15 }).observe(anim);
  }
  document.addEventListener('visibilitychange', function () {
    anim.classList.toggle('is-paused', document.hidden);
    if (document.hidden) pause(); else { showSlide(slide); resume(); }
  });

  showSlide(0);
  resume();
})();
