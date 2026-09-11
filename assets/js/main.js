import { initNav } from './modules/nav.js';
import { initWork } from './modules/work.js';
import { initClients } from './modules/clients.js';
import { initCreative } from './modules/creative.js';
import { initProfile } from './modules/profile.js';
import { pruneEmptySections } from './modules/sections.js';

/**
 * Entry point for the home page.
 *
 * Each module is independent and fails soft: if one throws, the rest still
 * run, and the page's static content (hero, about, skills, lab, contact) is
 * in the HTML rather than generated here, so it renders with no JS at all.
 */
const boot = () => {
  const steps = [pruneEmptySections, initNav, initProfile, initWork, initClients, initCreative];

  steps.forEach((step) => {
    try {
      step();
    } catch (error) {
      console.error(`[portfolio] ${step.name} failed:`, error);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
