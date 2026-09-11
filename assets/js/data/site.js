/**
 * SITE DATA
 * ---------------------------------------------------------------------------
 * Contact details and profile links. Nothing here is invented — any value
 * still set to PLACEHOLDER is deliberately blank and is hidden from the page
 * until you fill it in, so the site never shows a dead link or a false claim.
 *
 * Search this file for "PLACEHOLDER" to find everything that needs you.
 *
 * Note: hero, about, lab and toolkit copy lives directly in index.html rather
 * than here. That copy is static HTML on purpose — it renders instantly, and
 * search engines see it without running any JavaScript.
 */

/** Sentinel for "I don't have this yet". The render layer skips these. */
export const PLACEHOLDER = 'REPLACE_ME';

/** True when a value is real and safe to render. */
export const isSet = (value) =>
  typeof value === 'string' && value.length > 0 && !value.includes(PLACEHOLDER);

export const site = {
  name: 'Jeremiah Anthony',
  role: 'Developer & Creative Technologist',

  /* This is the address on your account. Swap it if you would rather publish a
     dedicated contact address. */
  email: 'jeremiahanthony876@gmail.com',

  /* For calls and WhatsApp. `phone` is the full international number with no
     spaces (it builds the tel: and wa.me links); `phoneDisplay` is how it reads
     on the page. Set phone to PLACEHOLDER to hide both rows. */
  phone: '+256764440257',
  phoneDisplay: '+256 764 440 257',

  /* Shown as "Based in" in the contact section. Set to PLACEHOLDER to hide it. */
  location: 'Kampala, Uganda',

  /* Profile links. Rows containing PLACEHOLDER never render, so no broken
     links go live. To add LinkedIn later:
       { key: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/…' }, */
  socials: [
    { key: 'github',   label: 'GitHub',   url: 'https://github.com/Jeremiah-BL4' },
    { key: 'x',        label: 'X',        url: `https://x.com/${PLACEHOLDER}` },
  ],
};

/** Socials with the placeholders removed. */
export const activeSocials = () => site.socials.filter((s) => isSet(s.url));
