import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import CTAButton from './CTAButton';
import logoMark from '../assets/logo-mark.png';
import logoMarkWebp from '../assets/logo-mark.webp';

// The takeover wipes open from the burger, which sits top-right.
const CLOSED = 'circle(0% at 88% 4%)';
const OPEN = 'circle(150% at 88% 4%)';

// Links land after the wipe has cleared enough of the screen to reveal them.
const LIST = {
  hidden: {},
  visible: { transition: { delayChildren: 0.18, staggerChildren: 0.06 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the takeover whenever the route changes, so tapping a link doesn't
  // leave the overlay sitting over the new page.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-ink/90 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.08)]' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <NavLink to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <picture>
            <source srcSet={logoMarkWebp} type="image/webp" />
            <motion.img
              src={logoMark}
              alt="Monkey Media"
              className="h-11 w-auto md:h-12"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </picture>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative font-semibold uppercase tracking-wide text-sm py-1 transition-colors ${
                  isActive ? 'text-purple' : 'text-paper/80 hover:text-paper'
                } group`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] bg-purple transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
          <CTAButton to="/pricing" size="sm">
            Book a Call
          </CTAButton>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 bg-paper"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="h-0.5 w-6 bg-paper"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="h-0.5 w-6 bg-paper"
          />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: CLOSED }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: OPEN }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: CLOSED }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }
            className="fixed inset-0 z-[65] bg-[linear-gradient(160deg,#150f22,#0d0d0d_60%)] md:hidden"
          >
            <motion.nav
              variants={LIST}
              initial="hidden"
              animate="visible"
              className="flex h-full flex-col justify-center gap-1 px-7"
            >
              {LINKS.map((link, i) => (
                <motion.div key={link.to} variants={ITEM}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      // Fluid rather than a flat text-4xl: in Syne at 36px,
                      // "PORTFOLIO" ran 46px past the gutter on a 390px phone,
                      // and Services/Contact cleared it by under 7px.
                      `flex items-baseline gap-3 py-2 text-[clamp(1.6rem,7.5vw,2.25rem)] font-display font-extrabold uppercase tracking-tight ${
                        isActive ? 'text-gold' : 'text-paper'
                      }`
                    }
                  >
                    <span className="font-sans text-xs font-bold tracking-widest text-purple">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div variants={ITEM} className="mt-8">
                <CTAButton to="/pricing" onClick={() => setMenuOpen(false)} size="lg">
                  Book a Call
                </CTAButton>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
