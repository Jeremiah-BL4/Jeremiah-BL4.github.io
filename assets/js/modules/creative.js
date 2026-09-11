import { qs, qsa, render, esc, escUrl } from '../lib/dom.js';
import { gallery, breakdowns } from '../data/projects.js';
import { createLightbox } from './lightbox.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * The creative section: an even grid of renders with captions underneath,
 * then any breakdowns (previews leading to a final render). Images open in a
 * full-screen viewer. An empty gallery is removed by pruneEmptySections.
 */
export function initCreative() {
  initGallery();
  initBreakdowns();
}

function initGallery() {
  const grid = qs('#creative-grid');
  if (!grid || !gallery.length) return;

  render(
    grid,
    gallery
      .map(
        (item, i) => `
        <figure class="gallery__item">
          <button type="button" class="gallery__open" data-index="${i}"
                  aria-label="View ${esc(item.title || 'render')} full screen">
            <img src="${escUrl(item.src)}" alt="${esc(item.alt || item.title || '')}"
                 loading="lazy" decoding="async">
          </button>
          ${item.title || item.meta
            ? `<figcaption class="gallery__cap">
                 ${item.title ? `<strong>${esc(item.title)}</strong>` : ''}
                 ${item.meta ? `<span>${esc(item.meta)}</span>` : ''}
               </figcaption>`
            : ''}
        </figure>`
      )
      .join('')
  );

  const lightbox = createLightbox();
  qsa('.gallery__open', grid).forEach((button) => {
    button.addEventListener('click', () =>
      lightbox.open(gallery, Number(button.dataset.index))
    );
  });
}

const stepHTML = (step, i) => `
  <figure class="breakdown__step${step.wide ? ' breakdown__step--wide' : ''}">
    <button type="button" class="breakdown__open" data-index="${i}"
            aria-label="View ${esc(step.label)} full screen">
      <img src="${escUrl(step.src)}" alt="${esc(step.alt || step.label)}"
           loading="lazy" decoding="async">
    </button>
    <figcaption class="breakdown__cap">
      <strong>${esc(step.label)}</strong>
      ${step.note ? `<span>${esc(step.note)}</span>` : ''}
    </figcaption>
  </figure>`;

const breakdownHTML = (b) => `
  <article class="breakdown" aria-labelledby="breakdown-${esc(b.id)}">
    <header class="breakdown__head">
      <h3 id="breakdown-${esc(b.id)}">${esc(b.title)}</h3>
      ${b.meta ? `<p>${esc(b.meta)}</p>` : ''}
    </header>
    <div class="breakdown__grid">
      <figure class="breakdown__final">
        <video src="${escUrl(b.final.video)}" poster="${escUrl(b.final.poster)}"
               muted loop playsinline controls preload="none"
               aria-label="${esc(b.final.alt || b.final.label)}"></video>
        <figcaption class="breakdown__cap">
          <strong>${esc(b.final.label || 'Final render')}</strong>
          ${b.final.note ? `<span>${esc(b.final.note)}</span>` : ''}
        </figcaption>
      </figure>
      <div class="breakdown__steps">${b.steps.map(stepHTML).join('')}</div>
    </div>
  </article>`;

function initBreakdowns() {
  const host = qs('#creative-breakdowns');
  if (!host || !breakdowns.length) return;

  render(host, breakdowns.map(breakdownHTML).join(''));

  const lightbox = createLightbox();
  breakdowns.forEach((b, n) => {
    const article = qsa('.breakdown', host)[n];
    const items = b.steps.map((s) => ({ src: s.src, alt: s.alt, title: s.label, meta: s.note }));
    qsa('.breakdown__open', article).forEach((button) => {
      button.addEventListener('click', () => lightbox.open(items, Number(button.dataset.index)));
    });
  });

  /* The final render plays, muted and looping, while it's on screen, and
     doesn't start by itself for visitors who ask for reduced motion. It
     keeps its controls, so it can always be paused or played by hand. */
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const watch = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) target.play().catch(() => {});
        else target.pause();
      });
    },
    { threshold: 0.4 }
  );
  qsa('.breakdown__final video', host).forEach((video) => watch.observe(video));
}
