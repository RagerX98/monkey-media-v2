// Site-wide facts, kept in one place so the footer, contact page, menu and
// calls to action can never disagree.

export const CONTACT = {
  email: 'hello@monkeymedia.agency',
  whatsapp: 'https://wa.me/918796767274',
  // TODO: replace with the agency's real Instagram profile URL before going
  // live. Until then the icon opens Instagram's home page.
  instagram: 'https://www.instagram.com/',
};

export const TAGLINE = 'Fun, funky, active like a monkey.';

/** Top navigation. About is deliberately footer-only. */
export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Our Work' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

/** Headline numbers (from the previous About page). */
export const STATS = [
  { value: '7+', label: 'Years in the jungle' },
  { value: '10+', label: 'Brands launched' },
  { value: '98%', label: 'Client retention' },
  { value: '4', label: 'Countries reached' },
];

/** How an engagement runs. Used on Home, Services and Pricing. */
export const PROCESS = [
  {
    number: '01',
    title: 'Sniff around',
    blurb:
      'We dig into your brand, your audience and your numbers before a single idea hits the table.',
  },
  {
    number: '02',
    title: 'Plot the swing',
    blurb:
      'A plan built around your goals, not a template: channels, content, budget and what success looks like.',
  },
  {
    number: '03',
    title: 'Go bananas',
    blurb:
      'We make it, ship it and run it. Content, campaigns, creators and sites, made fast and made to perform.',
  },
  {
    number: '04',
    title: 'Double down',
    blurb:
      'We measure what moved, cut what did not, and pour fuel on what works. Every month, on the record.',
  },
];

export const VALUES = [
  {
    number: '01',
    title: 'Client first, always',
    blurb: 'Your goals drive the strategy. We measure ourselves by your growth, not our portfolio.',
  },
  {
    number: '02',
    title: 'No-BS creativity',
    blurb: "Bold ideas, zero fluff. If it doesn't move the needle, it doesn't make the deck.",
  },
  {
    number: '03',
    title: 'Speed over perfection',
    blurb: 'We ship, learn and iterate in public instead of polishing in private for months.',
  },
  {
    number: '04',
    title: 'Data-backed chaos',
    blurb: "The wild ideas are backed by real numbers. Fun and rigour aren't mutually exclusive.",
  },
];
