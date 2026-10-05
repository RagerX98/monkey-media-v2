// Everything shown on the Our Work page lives here. To add a piece of work,
// add one object to `work` below — the page groups by `category`, so a new
// category that already exists in WORK_CATEGORIES appears automatically.
//
// Thumbnails: either `thumb: { scene: '<id>' }` (a built-in brand preview drawn
// in CSS, see components/work/SiteThumb.jsx) or `thumb: { image: <imported
// asset>, alt: '...' }` for a real screenshot / AI visual / reel poster frame.
//
// `href` + `external: true` opens in a new tab with a plain <a>. The demo sites
// are static files in public/previews/, so they must NOT be linked with React
// Router's <Link> (that would route inside the SPA and show its 404).

export const WORK_CATEGORIES = [
  {
    id: 'websites',
    label: 'Website Concepts',
    blurb: 'Concept sites for fictional brands, each with its own look and its own way of moving.',
  },
  {
    id: 'shopify',
    label: 'Shopify Themes',
    blurb: 'Store themes built to sell: quick add, cart drawer and storytelling sections.',
  },
  {
    id: 'ai-visuals',
    label: 'AI Visuals',
    blurb: 'Product shots, campaign imagery and brand worlds, generated and art-directed.',
  },
  {
    id: 'reels',
    label: 'Reels',
    blurb: 'Short-form video made to stop the scroll.',
  },
];

export const work = [
  {
    id: 'nova',
    category: 'websites',
    kind: 'AI / SaaS',
    title: 'Nova',
    description:
      'A dark, glowing product site for an AI workflow platform, built to feel like the future has already shipped.',
    tags: ['Terminal boot loader', 'Decrypting headlines', '3D card flips'],
    href: '/previews/nova-ai-saas/',
    external: true,
    thumb: { scene: 'nova' },
  },
  {
    id: 'fynn',
    category: 'websites',
    kind: 'Fintech',
    title: 'Fynn',
    description:
      'A friendly money app that earns trust fast: phone mockup, bento features and a live savings calculator.',
    tags: ['Iris-wipe loader', 'Springy reveals', 'Interactive calculator'],
    href: '/previews/fynn-fintech/',
    external: true,
    thumb: { scene: 'fynn' },
  },
  {
    id: 'volt',
    category: 'websites',
    kind: 'Fitness & Gym',
    title: 'VOLT',
    description:
      'Loud, heavy and unapologetic. Giant type, photo-led programs and a class schedule you can actually use.',
    tags: ['Counter loader', 'Slam-in headlines', 'Live class schedule'],
    href: '/previews/volt-fitness/',
    external: true,
    thumb: { scene: 'volt' },
  },
  {
    id: 'ember-oak',
    category: 'websites',
    kind: 'Café & Restaurant',
    title: 'Ember & Oak',
    description:
      'Warm, editorial and unhurried, with a menu where the dishes follow your cursor.',
    tags: ['Cup-fill loader', 'Ink-settling text', 'Photo-follow menu'],
    href: '/previews/ember-oak-cafe/',
    external: true,
    thumb: { scene: 'ember' },
  },
  {
    id: 'loudly',
    category: 'websites',
    kind: 'Marketing Agency',
    title: 'Loudly',
    description:
      'Bold, playful and impossible to scroll past, with stacking case studies and a service accordion.',
    tags: ['Flashing-word loader', 'Jelly letters', 'Sticker pop-ins'],
    href: '/previews/loudly-agency/',
    external: true,
    thumb: { scene: 'loudly' },
  },
  {
    id: 'halcyon',
    category: 'websites',
    kind: 'Luxury Real Estate',
    title: 'Halcyon',
    description:
      'Quiet confidence for high-end property: full-bleed imagery, filterable listings and slow, deliberate motion.',
    tags: ['Curtain reveals', 'Expanding hero image', 'Filterable listings'],
    href: '/previews/halcyon-real-estate/',
    external: true,
    thumb: { scene: 'halcyon' },
  },
  {
    id: 'monkey-street',
    category: 'shopify',
    kind: 'Shopify Theme · Streetwear',
    title: 'Monkey Street',
    description:
      'A dark, high-contrast theme for fashion drops, with a live countdown and size-by-size quick add.',
    tags: ['Drop countdown', 'Quick-add sizes', 'Cart drawer'],
    href: '/previews/shopify-street-theme/',
    external: true,
    thumb: { scene: 'street' },
  },
  {
    id: 'monkey-bloom',
    category: 'shopify',
    kind: 'Shopify Theme · Beauty',
    title: 'Monkey Bloom',
    description:
      'A soft, editorial theme for skincare, with an ingredients story, before/after slider and reviews.',
    tags: ['Before / after slider', 'Ingredients story', 'Reviews & FAQ'],
    href: '/previews/shopify-bloom-theme/',
    external: true,
    thumb: { scene: 'bloom' },
  },
];
