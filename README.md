# Jeremiah Anthony: Portfolio

A static portfolio site. No framework, no build step, no runtime dependencies.
The files in this folder are the site: put them on any host and they work.

```bash
npm run dev
```

Then open <http://localhost:8080>. That script uses Python's built-in server,
which is already on your machine; `npm run dev:node` is the Node equivalent.

Don't open `index.html` by double-clicking it. The pages use ES modules, which
browsers only load over `http://`, not `file://`.

## Publishing

Live at **https://jeremiah-bl4.github.io/**, served by GitHub Pages from the
`main` branch of `Jeremiah-BL4/Jeremiah-BL4.github.io`. Commit and push to
`main` and the site republishes within a minute or two:

```bash
git add -A
git commit -m "Describe the change"
git push
```

Client sites run from this portfolio as previews. Each is a copy of the
finished site in its own folder here; the source repos stay private.

| Site | Address | Copied from |
|---|---|---|
| Roast & Simmer | https://jeremiah-bl4.github.io/roast-and-simmer/ | `site/` in the private `Jeremiah-BL4/roast-and-simmer` |
| Sol Restaurant | https://jeremiah-bl4.github.io/sol-restaurant/ | `npm run build:portfolio` in the private `Jeremiah-BL4/sol-restaurant` |

**These are previews, not the restaurants' launched sites.** Both carry a
`noindex` tag, so they're reachable through your portfolio but not listed in
search results. Sol's preview leaves out the guest-photo feature, which needs
Sol's own Node server.

To update one after changing it, refresh its folder here, then commit and push
this repo:

```bash
# Roast & Simmer: a plain static site, so copy it across
rm -rf roast-and-simmer && cp -r "C:/Users/User/Pictures/Client Websites/Roast & Simmer/site" roast-and-simmer

# Sol Restaurant: run in the Sol project
npm run build:portfolio -- "C:/Users/User/Documents/Portfolio website/sol-restaurant"
```

Don't turn on GitHub Pages in a repo named `roast-and-simmer` or
`sol-restaurant`: a repo's own Pages site takes priority over a folder of the
same name here, and would replace the preview.

GitHub Actions can't run on this account at the moment (GitHub reports a
billing lock), which is why the sites deploy from branches rather than
workflows. Branch deploys aren't affected.

---

## The look

Warm neutrals for the page, one cool near-black for text and buttons, and no
accent colour. Emphasis comes from type, not hue.

| Role | Value |
|---|---|
| Page | `#f0e7d9` |
| Raised (cards, hero window) | `#f9f2e7` |
| Recessed (title bars, empty media) | `#e7dcc9` |
| Text and buttons | `#16171b` |

What the site deliberately **doesn't** do, and should keep not doing:

- no gradients, glass/blur, glows or drop shadows
- no coloured status dots, category colours or coloured left stripes
- no hover lifts, animated arrows or scroll-in animations
- no numbered sections ("01 / 02…"), fake terminals or bento grids
- no em dashes or "it's not X, it's Y" copy

The only saturated colours are the Mac window's traffic lights and the tech
logos, which are real brand marks.

The nav is a solid dark pill, and the hero sits inside a macOS-style window
(`.window` in `components.css`). On short laptop screens the hero tightens so
all four edges of the window stay above the fold.

The JA monogram is your original artwork recoloured into the palette: cream and
sand on dark grounds, ink and charcoal on light ones, with the facets kept as
shading. The tab icon and home-screen icon use the same recoloured artwork.

### Typography

| Role | Face | Where |
|---|---|---|
| Everything | **Instrument Sans** | headings, body, labels, buttons, nav |
| The one emphasised word | **Instrument Serif** italic | `.accent-text` |
| Code only | **IBM Plex Mono** | tech tags, file paths, mockup URL bar |

Instrument Sans and Instrument Serif were drawn as a pair. The italic serif is
used once per view: in the hero ("digital *experiences.*") and on the contact
heading ("*Let's build it.*").

---

## Adding a project

**Everything on the site is generated from one file: `assets/js/data/projects.js`.**
You never touch HTML to add work.

1. Put screenshots in `assets/img/projects/<slug>/`
2. Add an object to the `projects` array (copy the SCHEMA block at the top of
   the file; it documents every field)
3. The card, the category filter and the `project.html?p=<slug>` case-study
   page all appear on their own.

```js
{
  slug: 'acme-bakery',
  title: 'Acme Bakery',
  category: 'client',            // web | client | creative | security | code | lab
  kind: 'Business website',
  summary: 'One or two sentences for the card.',
  year: '2026',
  status: 'live',                // live | in-progress | learning | concept | archived
  role: 'Design & build',
  client: 'Acme Bakery',
  tech: ['HTML', 'CSS', 'JavaScript'],
  features: ['Online menu', 'Contact form', 'Mobile-first layout'],
  liveUrl: 'https://acmebakery.com',
  cover: { src: 'assets/img/projects/acme-bakery/cover.jpg', alt: 'Acme Bakery homepage' },
  body: { brief: '…', built: '…', result: '…' },
}
```

Anything with `category: 'client'` goes into the **Websites I've built for
businesses** section, with a browser mockup, instead of the main grid.

### Blender renders

Add images to `assets/img/creative/`, then list them in the `gallery` array in
the same file. They show in an even grid with the caption underneath, and
open full screen when clicked.

### Empty sections hide themselves

While there are no client projects, the Client Sites section and its nav and
footer links are removed. Same for Creative while `gallery` is empty. Add work
and they come back on their own.

---

## What the site does with missing data

| Missing | Behaviour |
|---|---|
| Social URL still containing `REPLACE_ME` | That link isn't shown |
| `liveUrl` / `sourceUrl` | That button isn't shown (never links to `#`) |
| `cover` | The card is text-only; nothing pretends to be a screenshot |
| No client projects / empty gallery | That section and its links are removed |

`SHOW_PLACEHOLDERS` in `projects.js` shows dashed "add work here" slots with
file paths, for your own use while filling the site in. Keep it `false` on
the published site.

---

## What needs you

1. **Real work.** Screenshots of client sites and projects, and Blender
   renders. This is the one thing the site can't fake and shouldn't.
2. **`assets/js/data/site.js`**
   - `socials`: GitHub is set; LinkedIn is left out. X is a placeholder
     and stays hidden until you add a real handle (or delete the row).
   - `location`: set to Kampala, Uganda.
   - `email`: currently the address on your account.
3. **`index.html`**
   - The **Toolkit** levels (`Core` / `Working` / `Learning`) are my
     conservative guesses. Adjust them to what's true.
4. **`privacy.html`**: accurate for the site as it is. Update it if you add
   analytics, a contact form, or anything else that collects data.
5. **`sitemap.xml`**: add a line for each new project page you publish.

There's no terms-of-service page. A portfolio with no accounts, payments or
user content doesn't need one. If you start selling services through the site,
get proper terms written for your country rather than a generated template.

---

## Structure

```
index.html            Home. All prose is static HTML (fast paint, SEO-visible).
project.html          Case-study template. Renders ?p=<slug> from project data.
privacy.html          Privacy notice.
404.html              Not-found page.
favicon.svg           Tab icon: the recoloured JA artwork on ink (embedded image).
favicon.png           64x64 fallback for browsers without SVG tab icons.
apple-touch-icon.png  180x180 home-screen icon.
robots.txt
tools/
  og-template.html    Screenshot this at 1200x630 for the social preview.
  source/             Unoptimised originals. Nothing on the site links here.
assets/
  css/
    tokens.css        Colour, type, space, motion. Change the site from here.
    base.css          Reset, typography, focus, a11y utilities.
    components.css    Buttons, cards, tags, window + browser mockups, gallery, lightbox.
    sections.css      Nav, hero, and each section's layout.
  js/
    data/
      site.js         Contact + profile links.
      projects.js     The only file you edit to add work.
    lib/dom.js        Small DOM + escaping helpers.
    modules/          nav, work grid, clients, creative, lightbox, cards,
                      sections (hides empty sections), profile
    main.js           Home-page entry point.
    project.js        Case-study page entry point.
    page.js           Entry point for plain pages (privacy).
  img/
    og-cover.png      1200x630 social preview card.
    logo-light.webp   JA monogram in cream/sand, for dark grounds (nav pill).
    logo-dark.webp    JA monogram in ink/charcoal, for light grounds (footer).
    tech/             Technology icons used in the Toolkit.
    projects/         Project screenshots (one folder per slug).
    creative/         Blender renders.
```

### Notes

- Four CSS layers, in cascade order: tokens, base, components, sections.
  Change a value in `tokens.css` and it propagates everywhere.
- The nav and footer markup is repeated across the HTML pages. That's the cost
  of having no build step; if you ever add one, that's the first thing to
  turn into a shared template.
- Fonts come from Google Fonts. Self-hosting them as `woff2` would make pages
  a little faster and mean Google no longer sees visitors' IP addresses (if
  you do, update `privacy.html`).
- Images are WebP sized to how they're displayed. Originals are in
  `tools/source/`, with the ffmpeg commands to regenerate them.
