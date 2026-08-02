const ITEMS = [
  'SOCIAL MEDIA',
  'INFLUENCER MARKETING',
  'BRANDING',
  'CONTENT CREATION',
  'PERFORMANCE MARKETING',
  'WEBSITE DESIGN',
];

export default function MarqueeStrip({ className = '', tone = 'purple' }) {
  const bg = tone === 'purple' ? 'bg-purple text-ink' : 'bg-gold text-ink';
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className={`overflow-hidden ${bg} ${className}`}>
      <div className="flex w-max animate-marquee">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap px-4 py-3 text-sm font-black uppercase tracking-wide md:text-base"
          >
            {item}
            <span className="ml-4 text-xl leading-none">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
