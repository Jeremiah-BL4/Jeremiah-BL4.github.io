/* ============================================================
   Roast & Simmer — behaviour
   No dependencies. Everything here degrades to a working page.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------
     1. Masthead — condenses once the hero has moved
     --------------------------------------------------------- */
  var masthead = document.getElementById('masthead');
  var stuck = false;

  function onScroll() {
    var should = window.scrollY > 40;
    if (should !== stuck) {
      stuck = should;
      masthead.classList.toggle('is-stuck', stuck);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     2. Mobile menu
     --------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');

  // Flush layout so a transition has a start state to run from. A rAF callback
  // would do the same, but rAF is starved in background tabs — which would
  // leave the panel permanently invisible.
  function reflow(el) { void el.offsetWidth; }

  function openMenu() {
    menu.hidden = false;
    reflow(menu);
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    window.setTimeout(function () {
      if (!menu.classList.contains('is-open')) menu.hidden = true;
    }, 320);
    // Focus belongs on the control that owns the panel.
    burger.focus();
  }

  burger.addEventListener('click', function () {
    if (burger.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  // Any link inside the sheet closes it before the page scrolls.
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  // Returning to a wide viewport must not leave the sheet latched open.
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
    if (e.matches && burger.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  /* ---------------------------------------------------------
     3. Reveals — one shared primitive, fired once per element
     --------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduced.matches) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(reveals, function (el) { revealObserver.observe(el); });

    // Safety net: if the observer is starved (slow device, odd embedding),
    // anything already on screen still becomes visible rather than staying blank.
    window.setTimeout(function () {
      Array.prototype.forEach.call(reveals, function (el) {
        if (!el.classList.contains('is-in') &&
            el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-in');
        }
      });
    }, 1400);
  }

  /* ---------------------------------------------------------
     4. Scrollspy — marks the section you are actually reading
     --------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var on = link.getAttribute('href') === '#' + entry.target.id;
          if (on) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------
     5. Lightbox
     --------------------------------------------------------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbCount = document.getElementById('lb-count');
  var lbPrev = document.getElementById('lb-prev');
  var lbNext = document.getElementById('lb-next');
  var lbClose = document.getElementById('lb-close');
  var index = 0;
  var opener = null;

  function show(i) {
    index = (i + shots.length) % shots.length;
    var shot = shots[index];
    var inner = shot.querySelector('img');
    lbImg.src = shot.dataset.full;
    lbImg.alt = inner ? inner.alt : '';
    lbCap.textContent = shot.dataset.cap || '';
    lbCount.textContent = (index + 1) + ' / ' + shots.length;
  }

  function openLb(i) {
    opener = document.activeElement;
    show(i);
    lb.hidden = false;
    reflow(lb);
    lb.classList.add('is-open');
    reflow(lb);            // the dialog is now visible, so it can take focus
    document.body.classList.add('is-locked');
    lbClose.focus();
  }

  function closeLb() {
    lb.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(function () {
      if (!lb.classList.contains('is-open')) {
        lb.hidden = true;
        lbImg.src = '';
      }
    }, 320);
    if (opener) opener.focus();
  }

  shots.forEach(function (shot, i) {
    shot.addEventListener('click', function () { openLb(i); });
  });

  lbPrev.addEventListener('click', function () { show(index - 1); });
  lbNext.addEventListener('click', function () { show(index + 1); });
  lbClose.addEventListener('click', closeLb);

  // Click the backdrop (but not the photograph or the controls) to dismiss.
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lightbox__stage')) closeLb();
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') show(index - 1);
    else if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'Tab') {
      // Keep focus inside the dialog while it is open.
      var focusables = [lbPrev, lbNext, lbClose];
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
