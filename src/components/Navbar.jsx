import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import CTAButton from './CTAButton';
import MonkeyFace from './brand/MonkeyFace';
import { lockScroll } from '../lib/smooth';
import { CONTACT, NAV_LINKS } from '../data/site';
import logoMark from '../assets/logo-mark.png';
import logoMarkWebp from '../assets/logo-mark.webp';

// The takeover opens as a circle from the menu button, top-right.
const CLOSED = 'circle(0% at calc(100% - 44px) 40px)';
const OPEN = 'circle(160% at calc(100% - 44px) 40px)';

function RollText({ children }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  // Hide while scrolling down, return on any scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 160);
        lastY.current = y;
      }
      setScrolled(y > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 transition-transform duration-500 ease-[var(--ease-out-expo)] ${
          open ? 'z-[70]' : 'z-50'
        } ${hidden && !open ? '-translate-y-[120%]' : 'translate-y-0'}`}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-4 pt-4 md:px-8 md:pt-5">
          <NavLink
            to="/"
            aria-label="Monkey Media, home"
            className={`rounded-full px-3 py-2 transition-colors duration-300 ${
              scrolled && !open ? 'bg-ink/75 backdrop-blur-md' : ''
            }`}
          >
            <picture>
              <source srcSet={logoMarkWebp} type="image/webp" />
              <img src={logoMark} alt="Monkey Media" className="h-9 w-auto md:h-10" />
            </picture>
          </NavLink>

          <div className="hidden items-center gap-3 lg:flex">
            <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-ink/70 p-1.5 backdrop-blur-md">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2 rounded-full px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                        isActive ? 'bg-paper text-ink' : 'text-paper/80 hover:text-paper'
                      }`
                    }
                  >
                    <RollText>{link.label}</RollText>
                  </NavLink>
                </li>
              ))}
            </ul>
            <CTAButton to="/contact" variant="gold" size="sm">
              Book a call
            </CTAButton>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`relative grid h-14 w-14 place-items-center rounded-full transition-colors duration-300 lg:hidden ${
              open ? 'bg-ink text-paper' : 'bg-gold text-ink'
            }`}
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 h-[2.5px] w-full rounded-full bg-current transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 h-[2.5px] rounded-full bg-current transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  open ? 'top-1/2 w-full -translate-y-1/2 -rotate-45' : 'bottom-0 w-2/3'
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Portalled to <body>: the header animates `transform`, which would
          otherwise become the containing block for this fixed overlay. */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              id="site-menu"
              initial={reduceMotion ? { opacity: 0 } : { clipPath: CLOSED }}
              animate={reduceMotion ? { opacity: 1 } : { clipPath: OPEN }}
              exit={reduceMotion ? { opacity: 0 } : { clipPath: CLOSED }}
              transition={{ duration: reduceMotion ? 0.15 : 0.75, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[65] flex flex-col overflow-hidden bg-purple lg:hidden"
            >
              <nav aria-label="Main" className="flex flex-1 flex-col justify-center px-6 pt-24">
                <ul>
                  {NAV_LINKS.map((link, i) => (
                    <li key={link.to} className="overflow-hidden">
                      <motion.div
                        initial={{ y: '110%' }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <NavLink
                          to={link.to}
                          end={link.to === '/'}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            // Bold, not ExtraBold: at 800, "SERVICES" and
                            // "OUR WORK" run past a 375px screen.
                            `flex items-baseline gap-4 whitespace-nowrap py-1 font-display text-[clamp(2rem,11vw,4.2rem)] font-bold uppercase leading-[1.05] tracking-tight ${
                              isActive ? 'text-gold' : 'text-paper'
                            }`
                          }
                        >
                          <span className="font-sans text-xs font-bold tracking-widest text-ink/60">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {link.label}
                        </NavLink>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative flex items-end justify-between gap-4 px-6 pb-8"
              >
                <div className="flex flex-col gap-2 text-sm font-semibold text-paper">
                  <a href={`mailto:${CONTACT.email}`} className="link-line w-fit">
                    {CONTACT.email}
                  </a>
                  <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="link-line w-fit">
                    WhatsApp us
                  </a>
                  <a href="/about" className="link-line w-fit" onClick={() => setOpen(false)}>
                    About the troop
                  </a>
                </div>
                <MonkeyFace className="w-20 shrink-0 -rotate-12" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
