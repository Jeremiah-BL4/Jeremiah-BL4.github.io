import { esc, escUrl } from '../lib/dom.js';
import { categoryOf, STATUS } from '../data/projects.js';
import { isSet } from '../data/site.js';

/** The project's cover image, or '' when there isn't one. */
export function coverHTML(project) {
  if (!project.cover?.src) return '';
  return `<img src="${escUrl(project.cover.src)}"
               alt="${esc(project.cover.alt || project.title)}"
               loading="lazy" decoding="async" width="800" height="500">`;
}

/** Inside a device frame there must be *something*: a plain empty screen. */
export function screenHTML(project) {
  return coverHTML(project) || '<div class="media-empty" aria-hidden="true"></div>';
}

/** Status label. Returns an empty string for an unknown status. */
export function statusHTML(status) {
  if (!status || !STATUS[status]) return '';
  return `<span class="badge">${esc(STATUS[status])}</span>`;
}

/** External links, each rendered only when a real URL exists. */
export function linksHTML(project) {
  const links = [];
  if (isSet(project.liveUrl)) {
    links.push(`<a href="${escUrl(project.liveUrl)}" target="_blank" rel="noopener noreferrer">
      Live<span aria-hidden="true"> ↗</span><span class="visually-hidden"> site for ${esc(project.title)}, opens in a new tab</span></a>`);
  }
  if (isSet(project.sourceUrl)) {
    links.push(`<a href="${escUrl(project.sourceUrl)}" target="_blank" rel="noopener noreferrer">
      Source<span aria-hidden="true"> ↗</span><span class="visually-hidden"> code for ${esc(project.title)}, opens in a new tab</span></a>`);
  }
  return links.join('');
}

export function tagsHTML(tech = [], limit = 4) {
  if (!tech.length) return '';
  const shown = tech.slice(0, limit).map((t) => `<li class="tag">${esc(t)}</li>`).join('');
  const rest = tech.length > limit ? `<li class="tag">+${tech.length - limit}</li>` : '';
  return `<ul class="tags">${shown}${rest}</ul>`;
}

/** A slot the owner fills in (only shown with SHOW_PLACEHOLDERS on). */
export function slotHTML(project) {
  return `
    <div class="slot" data-cat="${esc(project.category)}">
      <strong>${esc(project.title)}</strong>
      <span style="font-size:.8rem; max-width: 28ch">${esc(project.hint || '')}</span>
      <code>assets/js/data/projects.js</code>
    </div>`;
}

export function cardHTML(project) {
  if (project.placeholder) return slotHTML(project);

  const cat = categoryOf(project.category);
  const links = linksHTML(project);
  const cover = coverHTML(project);

  return `
    <article class="card" data-cat="${esc(project.category)}">
      ${cover ? `<div class="card__media">${cover}</div>` : ''}
      <div class="card__body">
        <div class="card__meta">
          <span class="label card__cat">${esc(project.kind || cat.label)}</span>
          ${statusHTML(project.status)}
        </div>
        <h3 class="card__title">
          <a href="project.html?p=${encodeURIComponent(project.slug)}">${esc(project.title)}</a>
        </h3>
        <p class="card__desc">${esc(project.summary || '')}</p>
        ${tagsHTML(project.tech)}
        <div class="card__foot">
          <span class="label">${esc(project.year || '')}</span>
          ${links ? `<div class="card__links">${links}</div>` : ''}
        </div>
      </div>
    </article>`;
}
