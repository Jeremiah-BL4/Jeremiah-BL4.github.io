import { qs, qsa, render, esc, escUrl } from '../lib/dom.js';
import { site, activeSocials, isSet } from '../data/site.js';

const hasPhone = isSet(site.phone);
const whatsappUrl = hasPhone ? `https://wa.me/${site.phone.replace(/\D/g, '')}` : '';

const row = (key, value, href, external) => `
  <a href="${escUrl(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
    <span class="k">${esc(key)}</span>
    <span class="v">${esc(value)}</span>
    <span class="arrow" aria-hidden="true">→</span>
    ${external ? '<span class="visually-hidden">(opens in a new tab)</span>' : ''}
  </a>`;

/**
 * Writes contact details and social links from site.js into the page.
 * Anything still set to PLACEHOLDER is skipped, so the published site can
 * never show a dead profile link.
 */
export function initProfile() {
  const contact = qs('#contact-links');
  if (contact) {
    const rows = [row('Email', site.email, `mailto:${site.email}`, false)];

    if (hasPhone) {
      rows.push(row('Call', site.phoneDisplay || site.phone, `tel:${site.phone}`, false));
      rows.push(row('WhatsApp', site.phoneDisplay || site.phone, whatsappUrl, true));
    }

    activeSocials().forEach((s) => {
      rows.push(row(s.label, s.url.replace(/^https?:\/\//, ''), s.url, true));
    });

    if (isSet(site.location)) {
      rows.push(`
        <div class="contact__row">
          <span class="k">Based in</span><span class="v">${esc(site.location)}</span><span></span>
        </div>`);
    }

    render(contact, rows.join(''));
  }

  /* Footer social column. Falls back to email rather than leaving a hole in
     the grid when no profiles are configured yet. */
  const footerSocials = qs('#footer-socials');
  if (footerSocials) {
    const items = activeSocials().map(
      (s) =>
        `<li><a href="${escUrl(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}<span aria-hidden="true"> ↗</span></a></li>`
    );

    if (hasPhone) {
      items.push(`<li><a href="${escUrl(whatsappUrl)}" target="_blank" rel="noopener noreferrer">WhatsApp<span aria-hidden="true"> ↗</span></a></li>`);
    }
    items.push(`<li><a href="mailto:${esc(site.email)}">Email</a></li>`);
    render(footerSocials, items.join(''));
  }

  qsa('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  qsa('[data-email]').forEach((el) => {
    el.setAttribute('href', `mailto:${site.email}`);
  });
}
