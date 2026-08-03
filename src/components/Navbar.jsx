import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logoMark from '../assets/logo-mark.png';
import logoMarkWebp from '../assets/logo-mark.webp';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
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
          <NavLink
            to="/pricing"
            className="rounded-full bg-purple px-5 py-2 text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:scale-105 hover:bg-gold hover:text-ink"
          >
            Book a Call
          </NavLink>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-ink md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-6">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-3 text-lg font-bold uppercase tracking-wide border-b border-white/10 ${
                      isActive ? 'text-purple' : 'text-paper'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/pricing"
                onClick={() => setMenuOpen(false)}
                className="mt-4 rounded-full bg-purple px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-paper"
              >
                Book a Call
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
