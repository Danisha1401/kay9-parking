/* =============================================================
   Kay9 Hydro Tech Parking — header, menus, dialogs, gallery
   ============================================================= */
(function () {
  'use strict';

  var mqMobile = window.matchMedia('(max-width:900px)');
  var hdr      = document.getElementById('hdr');
  var burger   = document.getElementById('burger');
  var nav      = document.getElementById('nav');
  var dropBtn  = document.querySelector('.drop-btn');
  var drop     = document.getElementById('drop-systems');

  /* ---------- sticky header shadow ---------- */
  var onScrollHdr = function () {
    hdr.classList.toggle('is-stuck', window.scrollY > 12);
  };
  onScrollHdr();
  window.addEventListener('scroll', onScrollHdr, { passive: true });

  /* ---------- mobile menu ---------- */
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });

  /* ---------- systems dropdown ---------- */
  drop.removeAttribute('hidden');           // animated with classes, not the hidden attribute
  var dropOpen = false;
  var hoverTimer;

  function setDrop(open) {
    dropOpen = open;
    drop.classList.toggle('is-open', open);
    dropBtn.setAttribute('aria-expanded', String(open));
  }
  dropBtn.addEventListener('click', function (e) {
    e.preventDefault();
    setDrop(!dropOpen);
  });
  document.querySelector('.has-drop').addEventListener('mouseenter', function () {
    if (mqMobile.matches) return;
    clearTimeout(hoverTimer);
    setDrop(true);
  });
  document.querySelector('.has-drop').addEventListener('mouseleave', function () {
    if (mqMobile.matches) return;
    hoverTimer = setTimeout(function () { setDrop(false); }, 180);
  });
  document.addEventListener('click', function (e) {
    if (dropOpen && !e.target.closest('.has-drop')) setDrop(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (dropOpen) { setDrop(false); dropBtn.focus(); }
      if (nav.classList.contains('is-open')) { setMenu(false); burger.focus(); }
    }
  });

  /* close both menus after picking a link */
  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    setDrop(false);
    if (mqMobile.matches) setMenu(false);
  });

  /* keep state sane when resizing across the breakpoint */
  mqMobile.addEventListener('change', function () {
    setMenu(false);
    setDrop(false);
  });

  /* ---------- active section in the header ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  var watched = ['systems', 'why', 'projects', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && watched.length) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    watched.forEach(function (s) { secObs.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); revObs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- spec dialogs ---------- */
  function openDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }
  function closeDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-spec]');
    if (opener) { openDialog(document.getElementById(opener.dataset.spec)); return; }

    var closer = e.target.closest('[data-close]');
    if (closer) {
      var dlg = closer.closest('dialog');
      closeDialog(dlg);
      return;                                   // an <a data-close> still follows its href
    }
    /* click on the backdrop area of a dialog closes it */
    var openDlg = document.querySelector('dialog[open]');
    if (openDlg && e.target === openDlg) closeDialog(openDlg);
  });

  /* ---------- gallery lightbox ---------- */
  var shots  = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  var lb     = document.getElementById('lightbox');
  var lbImg  = document.getElementById('lbImg');
  var lbCap  = document.getElementById('lbCap');
  var lbIdx  = 0;

  function showShot(i) {
    lbIdx = (i + shots.length) % shots.length;
    var s = shots[lbIdx];
    lbImg.src = s.dataset.src;
    lbImg.alt = s.querySelector('img') ? s.querySelector('img').alt : '';
    lbCap.textContent = s.dataset.cap || '';
  }
  shots.forEach(function (s, i) {
    s.addEventListener('click', function () { showShot(i); openDialog(lb); });
  });
  if (lb) {
    lb.querySelector('.lb-prev').addEventListener('click', function () { showShot(lbIdx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { showShot(lbIdx + 1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.open) return;
      if (e.key === 'ArrowRight') showShot(lbIdx + 1);
      if (e.key === 'ArrowLeft')  showShot(lbIdx - 1);
    });
  }

  /* ---------- enquiry form ----------
     The form has no endpoint yet (pending client decision). Until an action URL is
     set on the <form>, submissions are stopped here and the visitor is pointed at
     the phone number instead — no silent failures.                                  */
  var form = document.getElementById('enquiry');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      if (form.dataset.demo === 'true') {
        e.preventDefault();
        note.className = 'form-note warn';
        note.textContent = 'This form is not connected to an inbox yet. Please call +91 98679 32460 or email kay9hydrotechparking@gmail.com.';
      }
    });
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
