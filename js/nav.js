/* =============================================================
   Kay9 Hydro Tech Parking — header, menus, dialogs, enquiry form
   ============================================================= */
(function () {
  'use strict';

  var mqMobile = window.matchMedia('(max-width:900px)');
  var hdr      = document.getElementById('hdr');
  var burger   = document.getElementById('burger');
  var nav      = document.getElementById('nav');
  var dropBtn  = document.querySelector('.drop-btn');
  var drop     = document.getElementById('drop-systems');

  /* ---------- sticky header shadow + page progress bar ---------- */
  var bar = document.getElementById('hdrProgress');
  var onScrollHdr = function () {
    hdr.classList.toggle('is-stuck', window.scrollY > 12);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  };
  onScrollHdr();
  window.addEventListener('scroll', onScrollHdr, { passive: true });

  /* ---------- light / dark theme ----------
     The head script applies a saved choice before first paint; this keeps the toggle,
     its label and the browser's theme-color in sync, and follows the device setting
     for visitors who have not picked one.                                            */
  var root     = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');
  var mqDark   = window.matchMedia('(prefers-color-scheme: dark)');
  var metas    = document.querySelectorAll('meta[name="theme-color"]');

  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : mqDark.matches;
  }
  function syncTheme() {
    var dark = isDark();
    root.classList.toggle('is-dark', dark);
    if (themeBtn) themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute('content', dark ? '#111110' : '#faf9f5');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.classList.add('theme-anim');                 // cross-fade colours for this one change
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('kay9-theme', next); } catch (e) {}
      syncTheme();
      setTimeout(function () { root.classList.remove('theme-anim'); }, 450);
    });
  }
  mqDark.addEventListener('change', syncTheme);
  syncTheme();

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

  /* ---------- services dropdown ---------- */
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
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"], .drop-btn'));
  var watched = ['why', 'services', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && watched.length) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          var id = l.classList.contains('drop-btn') ? 'services' : l.getAttribute('href').slice(1);
          l.classList.toggle('is-active', id === en.target.id);
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

  /* safety net: anything already on screen when the page finishes loading is shown
     whether or not the observer has fired, so no one ever meets a blank hero */
  window.addEventListener('load', function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });
  });

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

  /* ---------- enquiry form ----------
     Posts to FormSubmit (see the note above <form id="enquiry">). FormSubmit accepts
     several file inputs but only one file per input, so on submit every chosen file
     is moved into its own hidden input (attachment-1, attachment-2, …).            */
  var form = document.getElementById('enquiry');
  var note = document.getElementById('formNote');
  if (form) {
    var MAX_BYTES = 10 * 1024 * 1024;       // FormSubmit's limit for all files together
    var TYPES = ['dwg', 'dxf', 'pdf', 'jpg', 'jpeg', 'png', 'zip'];
    var zone  = document.getElementById('dropZone');
    var input = document.getElementById('f-files');
    var list  = document.getElementById('fileList');
    var files = [];
    var canMove = typeof DataTransfer === 'function';

    var fmtSize = function (b) {
      return b < 1024 * 1024 ? Math.max(1, Math.round(b / 1024)) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
    };
    var total = function () { return files.reduce(function (t, f) { return t + f.size; }, 0); };
    var setNote = function (cls, msg) { note.className = 'form-note' + (cls ? ' ' + cls : ''); note.textContent = msg; };

    var render = function () {
      list.innerHTML = '';
      files.forEach(function (f, i) {
        var li = document.createElement('li');
        var nm = document.createElement('span');
        nm.className = 'file-name';
        nm.textContent = f.name;
        var sz = document.createElement('span');
        sz.className = 'file-size';
        sz.textContent = fmtSize(f.size);
        var x = document.createElement('button');
        x.type = 'button';
        x.className = 'file-x';
        x.setAttribute('aria-label', 'Remove ' + f.name);
        x.innerHTML = '&times;';
        x.addEventListener('click', function () { files.splice(i, 1); render(); });
        li.appendChild(nm); li.appendChild(sz); li.appendChild(x);
        list.appendChild(li);
      });
      zone.classList.toggle('has-files', files.length > 0);
    };

    var add = function (picked) {
      var skipped = [];
      Array.prototype.forEach.call(picked, function (f) {
        var ext = (f.name.split('.').pop() || '').toLowerCase();
        if (TYPES.indexOf(ext) < 0) { skipped.push(f.name + ' (file type not accepted)'); return; }
        if (total() + f.size > MAX_BYTES) { skipped.push(f.name + ' (over the 10 MB total)'); return; }
        var dup = files.some(function (g) { return g.name === f.name && g.size === f.size; });
        if (!dup) files.push(f);
      });
      render();
      if (skipped.length) setNote('warn', 'Not added: ' + skipped.join(', ') + '.');
      else if (note.classList.contains('warn')) setNote('', '');
    };

    if (canMove) {
      /* the visible input only collects files; they are listed and sent from `files` */
      input.addEventListener('change', function () { add(input.files); input.value = ''; });
      ['dragenter', 'dragover'].forEach(function (t) {
        zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.add('is-over'); });
      });
      ['dragleave', 'dragend', 'drop'].forEach(function (t) {
        zone.addEventListener(t, function () { zone.classList.remove('is-over'); });
      });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files) add(e.dataTransfer.files);
      });
    }
    /* without DataTransfer (very old browsers) the plain file input submits as it is */

    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      if (location.protocol === 'file:') {
        e.preventDefault();
        setNote('warn', 'The form only sends once the site is online. Please call +91 98679 32460 or email kay9hydrotechparking@gmail.com.');
        return;
      }
      /* return to this page afterwards, with a flag so we can say thank you */
      form.querySelector('[name="_next"]').value =
        location.origin + location.pathname + '?sent=1#contact';

      if (canMove) {
        form.querySelectorAll('.file-carrier').forEach(function (el) { el.remove(); });
        input.removeAttribute('name');
        files.forEach(function (f, i) {
          var dt = new DataTransfer();
          dt.items.add(f);
          var carrier = document.createElement('input');
          carrier.type = 'file';
          carrier.name = 'attachment-' + (i + 1);
          carrier.className = 'file-carrier';
          carrier.hidden = true;
          carrier.files = dt.files;
          form.appendChild(carrier);
        });
      }
      form.querySelector('[type="submit"]').disabled = true;
      setNote('', files.length ? 'Sending your enquiry and files…' : 'Sending your enquiry…');
    });

    /* coming back from a page restored out of the cache: let the form be used again */
    window.addEventListener('pageshow', function () {
      form.querySelector('[type="submit"]').disabled = false;
    });

    if (/[?&]sent=1/.test(location.search)) {
      setNote('ok', 'Thank you — your enquiry has been sent. We will be in touch soon.');
      if (history.replaceState) history.replaceState(null, '', location.pathname + '#contact');
    }
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
