import { CONTACT } from '../data/site';

// One consistent line-icon set (24-unit grid, 1.8 stroke, round caps) so the
// three read as a family rather than three borrowed logos.
export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3.6 20.4l1.25-4.05A8.6 8.6 0 1 1 8.1 19.3L3.6 20.4Z" />
      <path
        d="M9.15 8.2c.25-.4.7-.5 1.1-.35l.55.2c.3.12.48.45.4.77l-.27 1.02c-.07.28.02.58.22.78l1.98 1.98c.2.2.5.29.78.22l1.02-.27c.32-.08.65.1.77.4l.2.55c.15.4.05.85-.35 1.1-1.05.62-2.35.6-3.4-.05a10.3 10.3 0 0 1-3.05-3.05c-.65-1.05-.67-2.35-.05-3.4Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7.5l8 5.5 8-5.5" />
    </svg>
  );
}

const SOCIALS = [
  { id: 'instagram', label: 'Instagram', href: CONTACT.instagram, Icon: InstagramIcon, external: true },
  { id: 'whatsapp', label: 'WhatsApp', href: CONTACT.whatsapp, Icon: WhatsAppIcon, external: true },
  { id: 'email', label: 'Email', href: `mailto:${CONTACT.email}`, Icon: MailIcon, external: false },
];

// Colour treatments for the surface the row sits on. Resting state is quiet
// (thin ring, softened icon); hover fills the circle so it clearly reads as
// a button.
const TONES = {
  dark: 'text-paper/80 ring-white/20 hover:bg-gold hover:text-ink hover:ring-gold',
  light: 'text-ink/75 ring-ink/20 hover:bg-ink hover:text-gold hover:ring-ink',
  purple: 'text-paper/90 ring-white/30 hover:bg-gold hover:text-ink hover:ring-gold',
};

/**
 * Instagram, WhatsApp and Email as a row of round icon buttons. Each has an
 * accessible name and, on desktop, the banana cursor shows its label.
 * 44px circles keep them comfortable tap targets on phones.
 */
export default function SocialLinks({ tone = 'dark', className = '', size = 'md' }) {
  const box = size === 'sm' ? 'h-11 w-11' : 'h-12 w-12';
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {SOCIALS.map(({ id, label, href, Icon, external }) => (
        <li key={id}>
          <a
            href={href}
            aria-label={label}
            data-cursor={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`grid ${box} place-items-center rounded-full ring-1 ring-inset transition-[background-color,color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 ${
              TONES[tone] ?? TONES.dark
            }`}
          >
            <Icon className="h-[21px] w-[21px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
