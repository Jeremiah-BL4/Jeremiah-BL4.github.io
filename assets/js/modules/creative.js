import { qs, qsa, render, esc, escUrl } from '../lib/dom.js';
import { gallery } from '../data/projects.js';
import { createLightbox } from './lightbox.js';

/**
 * The creative gallery: an even grid of renders with captions underneath,
 * each opening in a full-screen viewer. An empty gallery is removed by
 * pruneEmptySections.
 */
export function initCreative() {
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
