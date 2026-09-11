/**
 * PROJECT DATA
 * ---------------------------------------------------------------------------
 * This is the only file you edit to add work to the site. Every grid, filter,
 * gallery and case-study page is generated from the array at the bottom.
 *
 * TO ADD A PROJECT
 *   1. Drop screenshots in  assets/img/projects/<slug>/
 *   2. Copy the SCHEMA block below, fill it in, add it to `projects`.
 *   3. The card, the filter count and the project.html page for it all
 *      appear automatically.
 *
 * WHAT THE RENDERER DOES WITH MISSING DATA
 *   • No `liveUrl` / `sourceUrl`: that link is left out, never linked to #.
 *   • No `cover`: the card is text-only. Nothing pretends to be a screenshot.
 *   • No client projects, or an empty `gallery`: the Client Sites / Creative
 *     sections and their nav links are removed until there's something to show.
 *   • `SHOW_PLACEHOLDERS = true` shows dashed "add work here" slots with the
 *     file path, for your own use while filling the site in. Keep it false on
 *     the published site.
 */

/* Dev aid only: true shows dashed "add work here" slots. Keep false live. */
export const SHOW_PLACEHOLDERS = false;

/* ---------------------------------------------------------------------------
 * CATEGORIES: `id` is what a project's `category` must match.
 * ------------------------------------------------------------------------- */
export const categories = [
  { id: 'web',      label: 'Web Development' },
  { id: 'client',   label: 'Client Sites' },
  { id: 'creative', label: 'Creative / 3D' },
  { id: 'security', label: 'Security' },
  { id: 'code',     label: 'Programming' },
  { id: 'lab',      label: 'Experiments' },
];

/* Status label shown on cards. Use one of these exact keys. */
export const STATUS = {
  live: 'Live',
  preview: 'Client preview',
  'in-progress': 'In progress',
  learning: 'Learning project',
  concept: 'Concept',
  archived: 'Archived',
};

/* ---------------------------------------------------------------------------
 * SCHEMA: copy this, don't delete it.
 *
 * {
 *   slug:      'kebab-case-unique-id',      // becomes project.html?p=<slug>
 *   title:     'Project name',
 *   category:  'web',                        // one of categories[].id
 *   kind:      'Marketing site',             // free-text sub-label
 *   summary:   'One or two sentences for the card.',
 *   year:      '2025',
 *   status:    'live',                       // key of STATUS
 *   role:      'Design & build',
 *   client:    'Business name',              // client category only
 *   tech:      ['HTML', 'CSS', 'JavaScript'],
 *   features:  ['What you actually built', 'One line each'],
 *   liveUrl:   'https://example.com',        // omit if none
 *   sourceUrl: 'https://github.com/...',     // omit if none
 *   cover:     { src: 'assets/img/projects/slug/cover.jpg', alt: 'Describe it' },
 *   shots:     [{ src: '...', alt: '...', caption: '...', phone: false }],
 *              // phone: true shows a portrait phone screenshot at phone width
 *   featured:  true,                         // pins it to the top of the grid
 *   body: {
 *     brief:   'What the project needed to do.',
 *     built:   'What you made and how.',
 *     result:  'What came of it. Real outcomes only, no invented numbers.',
 *   },
 * }
 * ------------------------------------------------------------------------- */

export const projects = [
  /* ----- Real work ------------------------------------------------------ */
  {
    slug: 'portfolio-site',
    title: 'This Portfolio',
    category: 'web',
    kind: 'Personal site',
    summary:
      'My own portfolio, designed and built from scratch. The project list, filters and case-study pages are all generated from a single data file.',
    year: '2026',
    status: 'in-progress',
    role: 'Design & build',
    tech: ['HTML', 'CSS', 'JavaScript'],
    features: [
      'New projects are added in one data file, with no page templates to edit',
      'A small design system for colour, type and spacing',
      'A case-study page generated for every project',
      'Navigation, filters and the image viewer all work from the keyboard',
      'Motion is reduced for visitors whose system asks for it',
    ],
    sourceUrl: 'https://github.com/Jeremiah-BL4/Jeremiah-BL4.github.io',
    cover: null,
    shots: [],
    featured: false,
    body: {
      brief:
        'I wanted a portfolio that is quick to keep up to date, so adding a new project takes minutes rather than an afternoon of copying markup.',
      built:
        'A static site with no framework or build step. Every project lives in one data file, and the work grid, filters, client section and case-study pages are all generated from it. Colour, type and spacing come from a small set of shared values, so the pages stay consistent.',
      result:
        'The site is plain HTML, CSS and JavaScript with nothing to install. Adding the next project means adding one entry to one file.',
    },
  },

  /* ----- Client sites ---------------------------------------------------
   * Facts here come from each project's own README and data files. */
  {
    slug: 'roast-and-simmer',
    title: 'Roast & Simmer',
    client: 'Roast & Simmer',
    category: 'client',
    kind: 'Restaurant website',
    summary:
      'A single-page site for an open-air grill and bar in Buwate, Uganda, built to send people to its WhatsApp, Instagram and TikTok.',
    year: '2026',
    status: 'preview',
    role: 'Design & build',
    tech: ['HTML', 'CSS', 'JavaScript', 'Python'],
    features: [
      'Reservations, hours and menu questions go straight to WhatsApp',
      'Cocktail list transcribed from the bar’s printed board, prices included',
      'Colour palette sampled from the restaurant’s own photographs',
      'Gallery with a full-screen viewer; every image served in three or four sizes',
      'A single-file offline version that opens from a WhatsApp attachment',
    ],
    liveUrl: 'https://jeremiah-bl4.github.io/roast-and-simmer/',
    sourceUrl: 'https://github.com/Jeremiah-BL4/roast-and-simmer',
    cover: {
      src: 'assets/img/projects/roast-and-simmer/desktop.webp',
      alt: 'Roast & Simmer homepage: the garden at night under string lights, with the restaurant name and a Reserve a table button',
    },
    shots: [
      {
        src: 'assets/img/projects/roast-and-simmer/menu.webp',
        alt: 'The kitchen section on a light background, with photographs of meat on the grill',
        caption: 'The kitchen, the one daylight section on the page, where the food photography reads best.',
      },
      {
        src: 'assets/img/projects/roast-and-simmer/bar.webp',
        alt: 'The cocktail list with prices, beside a photograph of the printed board it was taken from',
        caption: 'The cocktail list, transcribed from the board at the bar.',
      },
      {
        src: 'assets/img/projects/roast-and-simmer/gallery.webp',
        alt: 'Gallery of the garden at night and dishes from the grill',
        caption: 'The gallery. Each photograph opens full screen.',
      },
      {
        src: 'assets/img/projects/roast-and-simmer/mobile.webp',
        alt: 'The Roast & Simmer homepage on a phone',
        caption: 'On a phone, the hero switches to a taller photograph.',
        phone: true,
      },
    ],
    featured: true,
    body: {
      brief:
        'Roast & Simmer is an open-air grill and bar in Buwate. The owner wanted a website that grows their Instagram and TikTok following and brings in more customers.',
      built:
        'A single-page site with no build step. The page moves through a day: it opens after dark, steps into daylight for the kitchen, and ends in the garden at night. Every call to action goes to WhatsApp, Instagram or TikTok. The copy uses only what the photographs show and the owner confirmed, so there are no invented dishes, prices, hours or reviews.',
      result:
        'Live as a client preview, kept out of search results until the restaurant approves launch.',
    },
  },
  {
    slug: 'sol-restaurant',
    title: 'Sol Restaurant',
    client: 'Sol Restaurant',
    category: 'client',
    kind: 'Restaurant website',
    summary:
      'A five-page site for an open-air kitchen and bar in Kololo, Kampala, with the full menu and a way for guests to send in their own photographs.',
    year: '2026',
    status: 'in-progress',
    role: 'Design & build',
    tech: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express'],
    features: [
      'Five pages: home, menu, gallery, Seen at Sol and visit',
      'Full menu transcribed from the printed placemat, with prices',
      'Guests can send in photographs, which appear only after the restaurant approves them',
      'Gallery built from the restaurant’s own photographs, filterable by category',
      'Every fact on the site comes from their Google listing, menu or Instagram',
    ],
    cover: {
      src: 'assets/img/projects/sol-restaurant/desktop.webp',
      alt: 'Sol Restaurant homepage: the covered terrace and garden, with the headline Steak, smoke and a garden to sit in',
    },
    shots: [
      {
        src: 'assets/img/projects/sol-restaurant/menu.webp',
        alt: 'The menu page, with tabs for the kitchen and bar and a list of starters with prices',
        caption: 'The menu, transcribed from the printed placemat.',
      },
      {
        src: 'assets/img/projects/sol-restaurant/gallery.webp',
        alt: 'The gallery page with category filters above a grid of photographs',
        caption: 'The gallery, filterable by the grill, the kitchen, the bar and the space.',
      },
      {
        src: 'assets/img/projects/sol-restaurant/visit.webp',
        alt: 'The visit page with the address, hours, phone number and a map panel',
        caption: 'The visit page.',
      },
      {
        src: 'assets/img/projects/sol-restaurant/mobile.webp',
        alt: 'The Sol homepage on a phone',
        caption: 'On a phone.',
        phone: true,
      },
    ],
    body: {
      brief:
        'Sol is an open-air kitchen and bar on Upper Kololo Terrace in Kampala. The site covers the menu, the gallery and visiting details, and lets guests contribute photographs.',
      built:
        'A React and TypeScript site built with Vite, plus a small Node service for guest photo submissions. Submitted photographs wait in a queue and only appear once the restaurant approves them. The menu is transcribed from the printed placemat, and every gallery photograph is categorised by hand with written alt text.',
      result:
        'In progress and not public yet. The photo service needs a host that can run a server, not just static files.',
    },
  },

  /* ----- Slots -----------------------------------------------------------
   * These render as dashed "add work here" panels, never as fake projects.
   * Replace one with a real object above, or set SHOW_PLACEHOLDERS = false.
   * --------------------------------------------------------------------- */
  {
    slug: 'slot-client',
    category: 'client',
    placeholder: true,
    title: 'Your first client site',
    hint: 'Add the business site you built: its name, live URL and a screenshot.',
  },
  {
    slug: 'slot-creative',
    category: 'creative',
    placeholder: true,
    title: 'A Blender render',
    hint: 'Drop renders into assets/img/creative/ and add them to the gallery list below.',
  },
  {
    slug: 'slot-security',
    category: 'security',
    placeholder: true,
    title: 'A lab writeup',
    hint: 'A CTF box, a home network lab or a scanning script.',
  },
  {
    slug: 'slot-code',
    category: 'code',
    placeholder: true,
    title: 'A Python or JS tool',
    hint: 'An automation script or utility, with the source link.',
  },
];

/* ---------------------------------------------------------------------------
 * CREATIVE GALLERY: Blender renders and other visual work.
 * Separate from `projects` because artwork wants a gallery, not a card.
 * Every image gets the same size in an even grid; the caption sits under it.
 * ------------------------------------------------------------------------- */
export const gallery = [
  // {
  //   src: 'assets/img/creative/render-01.jpg',
  //   alt: 'Describe the render for screen readers',
  //   title: 'Scene name',
  //   meta: 'Blender · Cycles · 2026',
  // },
];

/* ---------------------------------------------------------------------------
 * Derived helpers.
 * ------------------------------------------------------------------------- */

export const visibleProjects = () =>
  projects.filter((p) => !p.placeholder || SHOW_PLACEHOLDERS);

export const byCategory = (id) => visibleProjects().filter((p) => p.category === id);

export const realProjects = () => projects.filter((p) => !p.placeholder);

export const findProject = (slug) => projects.find((p) => p.slug === slug && !p.placeholder);

export const categoryOf = (id) =>
  categories.find((c) => c.id === id) ?? { id, label: id };
