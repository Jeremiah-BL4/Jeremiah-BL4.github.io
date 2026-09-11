/** Tiny DOM helpers. Kept deliberately small — no library needed for this. */

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Escape untrusted-ish text before it goes into an HTML string. */
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Escape a value used inside an href/src attribute, rejecting script URLs. */
export const escUrl = (value = '') => {
  const url = String(value).trim();
  if (/^(javascript|data|vbscript):/i.test(url)) return '#';
  return esc(url);
};

/** Replace a container's contents with rendered markup. */
export const render = (target, markup) => {
  if (!target) return null;
  target.innerHTML = markup;
  return target;
};

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
