import { qs, qsa } from '../lib/dom.js';

/**
 * Navigation: sticky background on scroll, accessible mobile drawer, and a
 * scroll-spy that marks the section currently in view.
 */
export function initNav() {
  const nav = qs('.nav');
  const toggle = qs('.nav__toggle');
  const menu = qs('.nav__menu');
  if (!nav) return;

  /* ---- Background once the page has moved ------------------------------ */
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile drawer --------------------------------------------------- */
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () =>
      setOpen(toggle.getAttribute('aria-expanded') !== 'true')
    );

    /* Any link closes it — the drawer covers the content it links to. */
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Reset state if the viewport grows past the drawer breakpoint. */
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* ---- Scroll spy ------------------------------------------------------ */
  const links = qsa('.nav__list a[href^="#"]');
  const sections = links
    .map((a) => ({ link: a, section: qs(a.getAttribute('href')) }))
    .filter((entry) => entry.section);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const match = sections.find((s) => s.section === entry.target);
        links.forEach((l) => l.removeAttribute('aria-current'));
        match?.link.setAttribute('aria-current', 'true');
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach(({ section }) => observer.observe(section));
}
