/* =============================================================
   Kay9 Hydro Tech Parking — "Services we offer" scroller
   The track is a native horizontal scroller with scroll-snap, so
   swiping and trackpads work on their own. This script adds:
   arrows, dots, auto-scroll, and links such as #tower (header menu,
   footer) that bring the page here and turn to that card.
   ============================================================= */
(function () {
  'use strict';

  var AUTO_MS = 5000;        // time on each card
  var HOLD_MS = 12000;       // pause after a visitor picks a card

  var svc   = document.getElementById('svc');
  var track = document.getElementById('svcTrack');
  if (!svc || !track) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll('.svc-card'));
  var dots  = Array.prototype.slice.call(document.querySelectorAll('.svc-dots button'));
  var prev  = svc.querySelector('.svc-prev');
  var next  = svc.querySelector('.svc-next');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');

  var active = 0;            // the card the dots show as current
  var target = null;         // the card we last asked to scroll to
  var timer = null, holdTimer = null;
  var hovering = false, onScreen = false, held = false;

  function maxScroll() { return track.scrollWidth - track.clientWidth; }
  function atEnd()     { return track.scrollLeft >= maxScroll() - 4; }
  function cardLeft(i) { return cards[i].offsetLeft - cards[0].offsetLeft; }

  /* first card whose left edge is at (or just past) the scroll position */
  function firstVisible() {
    var x = track.scrollLeft, best = 0, bestD = Infinity;
    cards.forEach(function (c, i) {
      var d = Math.abs(cardLeft(i) - x);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }
  function fullyVisible(i) {
    var l = cardLeft(i) - track.scrollLeft;
    return l >= -4 && l + cards[i].offsetWidth <= track.clientWidth + 4;
  }

  function setActive(i) {
    active = i;
    dots.forEach(function (d, n) {
      d.classList.toggle('is-on', n === i);
      d.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
  }

  function goTo(i, instant) {
    target = i;
    setActive(i);
    track.scrollTo({ left: Math.min(cardLeft(i), maxScroll()), behavior: instant ? 'instant' : 'smooth' });
  }

  function step(dir) {
    var first = firstVisible();
    if (dir > 0) goTo(atEnd() ? 0 : Math.min(first + 1, cards.length - 1));
    else goTo(track.scrollLeft <= 4 ? cards.length - 1 : Math.max(first - 1, 0));
  }

  /* after any scroll (swipe, arrow, auto), work out which dot to light */
  var settle;
  track.addEventListener('scroll', function () {
    clearTimeout(settle);
    settle = setTimeout(function () {
      if (target !== null && fullyVisible(target)) setActive(target);
      else { target = null; setActive(firstVisible()); }
    }, 120);
  }, { passive: true });

  /* ---- auto-scroll ---- */
  function canPlay() { return onScreen && !hovering && !held && !document.hidden && !still.matches; }
  function schedule() {
    clearTimeout(timer);
    if (canPlay()) timer = setTimeout(function () { step(1); schedule(); }, AUTO_MS);
  }
  /* a deliberate choice by the visitor keeps that card up for a while */
  function hold() {
    held = true;
    clearTimeout(timer);
    clearTimeout(holdTimer);
    holdTimer = setTimeout(function () { held = false; schedule(); }, HOLD_MS);
  }

  prev.addEventListener('click', function () { step(-1); hold(); });
  next.addEventListener('click', function () { step(1);  hold(); });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); hold(); });
  });

  svc.addEventListener('mouseenter', function () { hovering = true;  clearTimeout(timer); });
  svc.addEventListener('mouseleave', function () { hovering = false; schedule(); });
  svc.addEventListener('focusin',    function () { hovering = true;  clearTimeout(timer); });
  svc.addEventListener('focusout',   function (e) {
    if (!svc.contains(e.relatedTarget)) { hovering = false; schedule(); }
  });
  track.addEventListener('touchstart', hold, { passive: true });
  track.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) hold(); }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.35 }).observe(svc);
  } else {
    onScreen = true;
  }
  document.addEventListener('visibilitychange', schedule);

  /* ---- links to a single card (#two-level, #tower, …) ---- */
  function indexOfHash(hash) {
    for (var i = 0; i < cards.length; i++) if ('#' + cards[i].id === hash) return i;
    return -1;
  }
  /* Browsers run one smooth scroll at a time, so a smooth page scroll would cancel a
     smooth sideways scroll. When the section is off screen the card is turned to
     instantly (nobody sees it) and only the page glides. */
  function openCard(i, instant) {
    var sec = document.getElementById('services');
    var r = svc.getBoundingClientRect();
    var inView = r.top >= 0 && r.bottom <= window.innerHeight;
    if (inView) { goTo(i, instant); hold(); return; }
    goTo(i, true);
    sec.scrollIntoView({ behavior: instant ? 'instant' : 'smooth', block: 'start' });
    hold();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var i = indexOfHash(a.getAttribute('href'));
    if (i < 0) return;
    e.preventDefault();
    openCard(i);
  });
  /* arriving on the page with such a link */
  if (location.hash) {
    var i0 = indexOfHash(location.hash);
    if (i0 >= 0) window.addEventListener('load', function () { openCard(i0, true); });
  }

  /* the card widths change across breakpoints — keep the current card in place */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { goTo(active, true); }, 150);
  });

  setActive(0);
})();
