import { qs, render, esc, escUrl } from '../lib/dom.js';
import { byCategory } from '../data/projects.js';
import { isSet } from '../data/site.js';
import { statusHTML, tagsHTML, screenHTML } from './cards.js';

/** Strip the protocol so the mockup's address bar reads like a real one. */
const displayUrl = (url) =>
  isSet(url) ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'not published yet';

function browserHTML(project) {
  return `
    <div class="browser">
      <div class="browser__bar">
        <div class="browser__dots" aria-hidden="true"><i></i><i></i><i></i></div>
        <span class="browser__url">${esc(displayUrl(project.liveUrl))}</span>
      </div>
      <div class="browser__screen">${screenHTML(project)}</div>
    </div>`;
}

function clientHTML(project) {
  if (project.placeholder) {
    return `
      <article class="client">
        <div class="client__visual">${browserHTML({ liveUrl: 'https://yourclient.com' })}</div>
        <div class="client__body">
          <h3 class="client__name">${esc(project.title)}</h3>
          <p class="client__desc">${esc(project.hint || '')}</p>
          <p style="font-family:var(--font-mono);font-size:var(--t-xs);color:var(--fg-dim);line-height:1.9">
            Add it in <code>assets/js/data/projects.js</code><br>
            with <code>category: 'client'</code>
          </p>
        </div>
      </article>`;
  }

  const features = (project.features || [])
    .slice(0, 5)
    .map((f) => `<li>${esc(f)}</li>`)
    .join('');

  const actions = [
    isSet(project.liveUrl)
      ? `<a class="btn btn--primary" href="${escUrl(project.liveUrl)}" target="_blank" rel="noopener noreferrer">
           Visit site <span aria-hidden="true">↗</span>
           <span class="visually-hidden">(opens in a new tab)</span></a>`
      : '',
    `<a class="btn btn--ghost" href="project.html?p=${encodeURIComponent(project.slug)}">Case study</a>`,
  ].join('');

  return `
    <article class="client">
      <div class="client__visual">${browserHTML(project)}</div>
      <div class="client__body">
        <h3 class="client__name">${esc(project.client || project.title)}</h3>
        <p class="label client__kind">${esc(project.kind || 'Website')}</p>
        <p class="client__desc">${esc(project.summary || '')}</p>
        ${features ? `<ul class="client__features">${features}</ul>` : ''}
        ${tagsHTML(project.tech, 6)}
        <div class="client__actions">
          ${statusHTML(project.status)}
        </div>
        <div class="client__actions">${actions}</div>
      </div>
    </article>`;
}

/** Renders client projects. An empty section is removed by pruneEmptySections. */
export function initClients() {
  const wrap = qs('#clients-list');
  const items = byCategory('client');
  if (!wrap || !items.length) return;
  render(wrap, items.map(clientHTML).join(''));
}
