// The canonical service list. Home (the service rows), the Services page and
// the footer all read from here, so copy only ever changes in one place.
//
// `deliverables` are the headline things a client gets; keep them short, they
// render as chips.

export const services = [
  {
    number: '01',
    slug: 'social',
    title: 'Social Media Management',
    short: 'Social',
    blurb:
      'Feeds that people actually stop for. Strategy, content calendars and community energy, handled end to end.',
    deliverables: ['Channel strategy', 'Content calendars', 'Community management', 'Monthly reporting'],
  },
  {
    number: '02',
    slug: 'influencer',
    title: 'Influencer Marketing',
    short: 'Influencer',
    blurb:
      'The right voices, not just the biggest ones. Sourcing, deals and campaigns that feel native, not paid.',
    deliverables: ['Creator sourcing', 'Negotiation & contracts', 'Campaign management', 'Performance tracking'],
  },
  {
    number: '03',
    slug: 'branding',
    title: 'Branding',
    short: 'Branding',
    blurb:
      'Identity systems with teeth: name, logo, voice and vibe, built to survive contact with the real world.',
    deliverables: ['Naming', 'Logo & identity', 'Tone of voice', 'Brand guidelines'],
  },
  {
    number: '04',
    slug: 'content',
    title: 'Content Creation',
    short: 'Content',
    blurb: 'Photo, video and design that stops the scroll. Made for the feed, not just the boardroom.',
    deliverables: ['Reels & short video', 'Photography', 'Design & motion', 'UGC-style content'],
  },
  {
    number: '05',
    slug: 'performance',
    title: 'Performance Marketing',
    short: 'Performance',
    blurb:
      'Paid media that earns its keep. Full-funnel campaigns tracked to revenue, not vanity metrics.',
    deliverables: ['Meta & Google ads', 'Funnel strategy', 'Creative testing', 'Revenue reporting'],
  },
  {
    number: '06',
    slug: 'web',
    title: 'Website Design',
    short: 'Web',
    blurb: 'Fast, bold sites that convert, built with the same energy we bring to everything else.',
    deliverables: ['Landing pages', 'Brand websites', 'Shopify stores', 'Motion & interaction'],
  },
  {
    number: '07',
    slug: 'events',
    title: 'Events & Activations',
    short: 'Events',
    blurb:
      'Experiences people actually show up for. Strategy, logistics and brand energy that turn an event into a moment.',
    deliverables: ['Concept & planning', 'Logistics', 'On-ground activation', 'Event content'],
  },
  {
    number: '08',
    slug: 'ai',
    title: 'AI Photography & Visuals',
    short: 'AI Visuals',
    blurb:
      'Everything a traditional shoot gives you, without booking one: product shots, model shoots, social visuals and video. Faster and cheaper.',
    deliverables: ['Product photography', 'AI model shoots', 'Campaign visuals', 'AI video'],
  },
];
