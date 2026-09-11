import { qs, qsa, render, esc } from '../lib/dom.js';
import { categories, visibleProjects } from '../data/projects.js';
import { cardHTML } from './cards.js';

/**
 * The main work grid and its category filters.
 *
 * Client sites are excluded here on purpose — they get the dedicated
 * case-study treatment further down the page, and showing them twice would
 * pad the grid without adding information.
 */
export function initWork() {
  const grid = qs('#work-grid');
  const bar = qs('#work-filters');
  if (!grid) return;

  const items = visibleProjects()
    .filter((p) => p.category !== 'client')
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  if (!items.length) {
    render(grid, `<p class="empty-note">No projects listed yet.</p>`);
    return;
  }

  render(grid, items.map(cardHTML).join(''));

  /* ---- Filters --------------------------------------------------------- */
  if (!bar) return;

  const present = categories.filter(
    (c) => c.id !== 'client' && items.some((p) => p.category === c.id)
  );

  /* One category isn't a filter, it's a label. */
  if (present.length < 2) return;

  const chips = [{ id: 'all', label: 'All', count: items.length }].concat(
    present.map((c) => ({
      id: c.id,
      label: c.label,
      count: items.filter((p) => p.category === c.id).length,
    }))
  );

  render(
    bar,
    chips
      .map(
        (c, i) => `<button type="button" class="filter" data-filter="${esc(c.id)}"
                     aria-pressed="${i === 0}">${esc(c.label)}<span class="filter__count">${c.count}</span></button>`
      )
      .join('')
  );

  const status = qs('#work-status');

  bar.addEventListener('click', (event) => {
    const button = event.target.closest('.filter');
    if (!button) return;

    const filter = button.dataset.filter;
    qsa('.filter', bar).forEach((b) =>
      b.setAttribute('aria-pressed', String(b === button))
    );

    let shown = 0;
    qsa('[data-cat]', grid).forEach((card) => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.hidden = !match;
      if (match) shown += 1;
    });

    if (status) {
      const name = filter === 'all' ? 'all categories' : button.textContent.replace(/\d+$/, '').trim();
      status.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'} in ${name}.`;
    }
  });

}
