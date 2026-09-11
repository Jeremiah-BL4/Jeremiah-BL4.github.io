import { qs, render, esc, escUrl } from './lib/dom.js';
import { findProject, realProjects, categoryOf, STATUS } from './data/projects.js';
import { isSet, site } from './data/site.js';
import { initNav } from './modules/nav.js';
import { initProfile } from './modules/profile.js';
import { pruneEmptySections } from './modules/sections.js';
import { createLightbox } from './modules/lightbox.js';
import { statusHTML, coverHTML, screenHTML } from './modules/cards.js';

/**
 * Case-study page. One template, driven entirely by the project data: adding
 * a project to projects.js gives it a detail page with no extra work.
 */

const notFound = () => `
  <div class="notfound">
    <p class="notfound__code">404</p>
    <h1>That project isn’t here</h1>
    <p class="measure" style="color:var(--fg-mid);margin-inline:auto">
      The link may be out of date, or the project may not be published yet.
    </p>
    <p><a class="btn btn--primary" href="index.html#work">See all work</a></p>
  </div>`;

const factRow = (key, value) =>
  value ? `<div><dt>${esc(key)}</dt><dd>${value}</dd></div>` : '';

function asideHTML(project) {
  const cat = categoryOf(project.category);
  const tech = (project.tech || []).map((t) => `<span class="tag">${esc(t)}</span>`).join(' ');

  return `
    <div>
      <h2 class="label" style="margin-bottom:var(--s-3)">Project details</h2>
      <dl class="facts">
        ${factRow('Category', esc(cat.label))}
        ${factRow('Type', esc(project.kind || ''))}
        ${factRow('Client', esc(project.client || ''))}
        ${factRow('Role', esc(project.role || ''))}
        ${factRow('Year', esc(project.year || ''))}
        ${factRow('Status', project.status && STATUS[project.status] ? statusHTML(project.status) : '')}
        ${factRow('Built with', tech ? `<div class="tags">${tech}</div>` : '')}
      </dl>
    </div>`;
}

function bodyHTML(project) {
  const b = project.body || {};
  const features = (project.features || []).map((f) => `<li>${esc(f)}</li>`).join('');

  return `
    <div class="prose">
      ${b.brief ? `<h2>The brief</h2><p>${esc(b.brief)}</p>` : ''}
      ${b.built ? `<h2>What I built</h2><p>${esc(b.built)}</p>` : ''}
      ${features ? `<h2>Features</h2><ul>${features}</ul>` : ''}
      ${b.result ? `<h2>Outcome</h2><p>${esc(b.result)}</p>` : ''}
    </div>`;
}

function shotsHTML(project) {
  if (!project.shots?.length) return '';
  return `
    <div class="case__shots">
      <h2 class="label">Screens</h2>
      ${project.shots
        .map(
          (s, i) => `
        <figure style="margin:0${s.phone ? ';max-width:320px' : ''}">
          <button type="button" class="gallery__open" data-shot="${i}"
                  style="aspect-ratio:auto" aria-label="View screen ${i + 1} full screen">
            <img src="${escUrl(s.src)}" alt="${esc(s.alt || '')}" loading="lazy" decoding="async">
          </button>
          ${s.caption ? `<figcaption class="label" style="margin-top:var(--s-2)">${esc(s.caption)}</figcaption>` : ''}
        </figure>`
        )
        .join('')}
    </div>`;
}

function nextHTML(project) {
  const all = realProjects();
  const i = all.findIndex((p) => p.slug === project.slug);
  const next = all.length > 1 ? all[(i + 1) % all.length] : null;

  /* The "all work" link is always there, so a case study is never a dead
     end, even when it's the only one. */
  return `
    <nav class="case__next" aria-label="Project navigation">
      <a class="link" href="index.html#work"><span aria-hidden="true">←</span> All work</a>
      ${
        next
          ? `<a class="link" href="project.html?p=${encodeURIComponent(next.slug)}">
               Next: ${esc(next.title)} <span aria-hidden="true">→</span></a>`
          : `<a class="link" href="index.html#contact">Get in touch <span aria-hidden="true">→</span></a>`
      }
    </nav>`;
}

/* Websites get a browser frame; anything else shows its cover as-is. With no
   screenshot at all, nothing is drawn rather than an empty placeholder. */
function heroVisual(project) {
  const cover = coverHTML(project);
  if (project.category === 'client' || isSet(project.liveUrl)) {
    if (!cover && !isSet(project.liveUrl)) return '';
    const url = isSet(project.liveUrl)
      ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
      : '';
    return `
      <div class="browser case__visual">
        <div class="browser__bar">
          <div class="browser__dots" aria-hidden="true"><i></i><i></i><i></i></div>
          <span class="browser__url">${esc(url)}</span>
        </div>
        <div class="browser__screen">${screenHTML(project)}</div>
      </div>`;
  }
  if (!cover) return '';
  return `<div class="case__visual" style="aspect-ratio:16/9;overflow:hidden;border-radius:var(--r-md)">${cover}</div>`;
}

function renderProject(project) {
  const cat = categoryOf(project.category);

  const actions = [
    isSet(project.liveUrl)
      ? `<a class="btn btn--primary" href="${escUrl(project.liveUrl)}" target="_blank" rel="noopener noreferrer">
           Visit live site <span aria-hidden="true">↗</span></a>`
      : '',
    isSet(project.sourceUrl)
      ? `<a class="btn btn--ghost" href="${escUrl(project.sourceUrl)}" target="_blank" rel="noopener noreferrer">
           View source <span aria-hidden="true">↗</span></a>`
      : '',
  ].join('');

  return `
    <div class="shell case">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span aria-hidden="true">/</span>
        <a href="index.html#work">Work</a><span aria-hidden="true">/</span>
        <span>${esc(cat.label)}</span>
      </nav>

      <header class="case__head">
        <div class="tags">
          <span class="badge">${esc(cat.label)}</span>
          ${statusHTML(project.status)}
        </div>
        <h1 class="case__title">${esc(project.title)}</h1>
        <p class="case__lead">${esc(project.summary || '')}</p>
        ${actions ? `<div class="case__actions">${actions}</div>` : ''}
      </header>

      ${heroVisual(project)}

      <div class="case__layout">
        <div>${bodyHTML(project)}${shotsHTML(project)}</div>
        <aside class="case__aside">${asideHTML(project)}</aside>
      </div>

      ${nextHTML(project)}
    </div>`;
}

/* --------------------------------------------------------------------------- */

const main = qs('#case-root');
const slug = new URLSearchParams(location.search).get('p');
const project = slug ? findProject(slug) : null;

if (project) {
  document.title = `${project.title} · ${site.name}`;
  qs('meta[name="description"]')?.setAttribute(
    'content',
    project.summary || `${project.title} by ${site.name}.`
  );
  qs('meta[property="og:title"]')?.setAttribute('content', `${project.title} · ${site.name}`);
  render(main, renderProject(project));

  if (project.shots?.length) {
    const lightbox = createLightbox();
    main.querySelectorAll('[data-shot]').forEach((button) => {
      button.addEventListener('click', () =>
        lightbox.open(project.shots, Number(button.dataset.shot))
      );
    });
  }
} else {
  document.title = `Project not found · ${site.name}`;
  render(main, notFound());
}

initNav();
initProfile();
pruneEmptySections();
