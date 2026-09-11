import { qsa } from '../lib/dom.js';
import { byCategory, gallery } from '../data/projects.js';

/**
 * Sections filled from data are removed when there's nothing to put in them,
 * together with every nav and footer link that points at them, so the site
 * never advertises an empty section. They come back on their own as soon as
 * projects.js has something for them.
 */
export function pruneEmptySections() {
  const empty = [];
  if (!byCategory('client').length) empty.push('clients');
  if (!gallery.length) empty.push('creative');

  empty.forEach((id) => {
    document.getElementById(id)?.remove();
    qsa(`a[href="#${id}"], a[href="index.html#${id}"]`).forEach((a) =>
      (a.closest('li') ?? a).remove()
    );
  });
}
