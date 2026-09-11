import { qs, esc, escUrl } from '../lib/dom.js';

/**
 * Full-screen image viewer. Built rather than imported because the whole
 * feature is ~80 lines and a library would cost more than it saves.
 *
 * Handles: focus return, Escape, arrow-key paging, background scroll lock.
 */
export function createLightbox() {
  let items = [];
  let index = 0;
  let lastFocused = null;

  const node = document.createElement('div');
  node.className = 'lightbox';
  node.setAttribute('role', 'dialog');
  node.setAttribute('aria-modal', 'true');
  node.setAttribute('aria-label', 'Image viewer');
  node.hidden = true;
  node.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Close viewer">✕</button>
    <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">‹</button>
    <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next image">›</button>
    <img alt="">
    <p class="lightbox__cap"></p>`;
  document.body.appendChild(node);

  const img = qs('img', node);
  const cap = qs('.lightbox__cap', node);
  const closeBtn = qs('.lightbox__close', node);
  const prevBtn = qs('.lightbox__nav--prev', node);
  const nextBtn = qs('.lightbox__nav--next', node);

  const show = (i) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    img.src = escUrl(item.src);
    img.alt = item.alt || item.title || '';
    /* Gallery renders have title + meta; case-study screenshots have caption. */
    const text = item.title
      ? `<strong>${esc(item.title)}</strong>${item.meta ? ` · ${esc(item.meta)}` : ''}`
      : esc(item.caption || '');
    const count = items.length > 1
      ? `<span class="label" style="margin-left:.6rem">${index + 1} / ${items.length}</span>`
      : '';
    cap.innerHTML = text + count;
    const solo = items.length < 2;
    prevBtn.hidden = solo;
    nextBtn.hidden = solo;
  };

  const close = () => {
    node.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    lastFocused?.focus();
  };

  function onKey(event) {
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') show(index + 1);
    if (event.key === 'ArrowLeft') show(index - 1);
    /* Keep focus inside the dialog while it is open. */
    if (event.key === 'Tab') {
      const focusable = [closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  const open = (list, startIndex = 0) => {
    if (!list.length) return;
    items = list;
    lastFocused = document.activeElement;
    node.hidden = false;
    document.body.style.overflow = 'hidden';
    show(startIndex);
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  };

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  node.addEventListener('click', (event) => {
    if (event.target === node) close();
  });

  return { open, close };
}
