import { initNav } from './modules/nav.js';
import { initProfile } from './modules/profile.js';
import { pruneEmptySections } from './modules/sections.js';

/** Entry point for plain text pages (privacy): nav, contact details, links. */
pruneEmptySections();
initNav();
initProfile();
