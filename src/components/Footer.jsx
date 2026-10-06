import { Link } from 'react-router-dom';
import Wordmark from './brand/Wordmark';
import Magnetic from './motion/Magnetic';
import SocialLinks from './SocialLinks';
import { services } from '../data/services';
import { CONTACT, NAV_LINKS, TAGLINE } from '../data/site';
import { resetScroll, getLenis } from '../lib/smooth';

const PAGES = [...NAV_LINKS.slice(0, 3), { to: '/about', label: 'About' }, ...NAV_LINKS.slice(3)];

function backToTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else resetScroll();
}

export default function Footer() {
  return (
    // data-cursor-native: a dense list of plain links, where a banana on every
    // one reads as noise. The footer keeps the visitor's normal cursor.
    <footer data-cursor-native className="relative overflow-hidden bg-ink pt-24 text-paper md:pt-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="border-b border-white/10 pb-14">
          <p className="eyebrow text-gold">Say hey</p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="link-line mt-5 inline-block font-display text-[clamp(1.3rem,6.2vw,4.6rem)] font-bold leading-tight tracking-tight md:text-[min(5vw,4.6rem)]"
          >
            hello@
            <wbr />
            monkeymedia.agency
          </a>
        </div>

        <div className="grid gap-12 border-b border-white/10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <p className="max-w-sm text-sm leading-relaxed text-paper/55">
            A creative agency for brands that refuse to sit still. Social, influencer, branding,
            content, performance, web and AI, with pure monkey energy.
          </p>

          <div>
            <p className="eyebrow mb-5 text-paper/40">Pages</p>
            <ul className="space-y-2.5 text-sm font-semibold">
              {PAGES.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} className="link-line text-paper/80 hover:text-paper">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5 text-paper/40">Services</p>
            <ul className="space-y-2.5 text-sm font-semibold">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services#${s.slug}`}
                    className="link-line text-paper/80 hover:text-paper"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="eyebrow mb-5 text-paper/40">Find us</p>
              <SocialLinks tone="dark" />
            </div>
            <Magnetic>
              <button
                type="button"
                onClick={backToTop}
                className="group flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full border border-white/20 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] transition-colors hover:border-gold hover:bg-gold hover:text-ink"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-1" fill="none" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Top
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 pt-12 md:px-8">
        <Wordmark className="text-paper" />
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-5 pb-8 pt-8 text-xs font-semibold text-paper/40 md:flex-row md:items-center md:justify-between md:px-10">
        <p>&copy; {new Date().getFullYear()} Monkey Media. All rights reserved.</p>
        <p>{TAGLINE}</p>
      </div>
    </footer>
  );
}
