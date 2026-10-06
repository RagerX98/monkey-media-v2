import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MonkeyFace from './brand/MonkeyFace';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';
import { markBusy, markReady } from '../lib/ready';
import { lockScroll, resetScroll } from '../lib/smooth';

const LABELS = {
  '/': 'Home',
  '/services': 'Services',
  '/work': 'Our Work',
  '/about': 'About',
  '/pricing': 'Pricing',
  '/contact': 'Contact',
};

/**
 * Route changes play behind a gold curtain: it sweeps up over the old page,
 * the route swaps underneath, and it sweeps away off the top.
 *
 * Rather than replacing every <Link>, this listens for clicks in the capture
 * phase and, for internal links, calls preventDefault before React Router's
 * own handler runs — <Link> skips navigation when the event is already
 * defaultPrevented. External links, new-tab clicks, modified clicks, hash
 * links and the static demo sites under /previews/ are left alone.
 */
export default function PageTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);
  const labelRef = useRef(null);
  const busy = useRef(false);
  const current = useRef(location.pathname);
  current.current = location.pathname;

  useEffect(() => {
    const panel = panelRef.current;

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith('/previews')) return;
      if (url.pathname === current.current) {
        // Same page: let hash links scroll; a plain re-click goes to the top.
        if (!url.hash) {
          e.preventDefault();
          resetScroll();
        }
        return;
      }

      e.preventDefault();
      if (busy.current) return;
      const to = url.pathname + url.search + url.hash;

      if (prefersReducedMotion()) {
        navigate(to);
        return;
      }

      busy.current = true;
      labelRef.current.textContent = LABELS[url.pathname] ?? '';
      markBusy();
      lockScroll(true);

      gsap
        .timeline()
        .set(panel, { visibility: 'visible', yPercent: 100 })
        .set(panel.querySelector('[data-curtain-shape]'), { borderRadius: '50% 50% 0 0 / 22vh 22vh 0 0' })
        .to(panel, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' })
        .to(
          panel.querySelector('[data-curtain-shape]'),
          { borderRadius: '0% 0% 0 0 / 0vh 0vh 0 0', duration: 0.7, ease: 'expo.inOut' },
          '<'
        )
        .from(panel.querySelectorAll('[data-curtain-item]'), { y: 40, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'expo.out' }, '-=0.3')
        .call(() => {
          navigate(to);
          resetScroll();
        })
        // Give the new route a moment to mount (lazy pages are prefetched).
        .to({}, { duration: 0.35 })
        .call(() => {
          ScrollTrigger.refresh();
          lockScroll(false);
          markReady();
        })
        .to(panel.querySelectorAll('[data-curtain-item]'), { y: -30, opacity: 0, duration: 0.3, ease: 'power2.in' })
        .to(panel, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '-=0.1')
        .to(
          panel.querySelector('[data-curtain-shape]'),
          { borderRadius: '0 0 50% 50% / 0 0 22vh 22vh', duration: 0.8, ease: 'expo.inOut' },
          '<'
        )
        .set(panel, { visibility: 'hidden' })
        .set(panel.querySelectorAll('[data-curtain-item]'), { clearProps: 'all' })
        .call(() => {
          busy.current = false;
        });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  // Back/forward and any navigation that skipped the curtain. Skipped on the
  // very first render, where the preloader decides when the page is ready.
  // (Compared by path rather than a "first run" flag, which StrictMode's
  // double-invoked effects would defeat in development.)
  const lastPath = useRef(location.pathname);
  useEffect(() => {
    if (lastPath.current === location.pathname) return undefined;
    lastPath.current = location.pathname;
    if (busy.current) return undefined;
    resetScroll();
    markReady();
    const id = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(id);
  }, [location.pathname]);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[105]"
      style={{ visibility: 'hidden' }}
    >
      {/* Taller than the screen so the curved leading edge never shows a gap. */}
      <div data-curtain-shape className="absolute inset-x-0 -top-[15vh] -bottom-[15vh] bg-gold" />
      <div className="relative grid h-full place-items-center">
        <div className="flex flex-col items-center gap-5">
          <div data-curtain-item>
            <MonkeyFace className="w-24 md:w-28" head="#0d0d0d" eye="#0d0d0d" blink={false} />
          </div>
          <p
            data-curtain-item
            ref={labelRef}
            className="font-display text-4xl font-extrabold uppercase tracking-tight text-ink md:text-6xl"
          />
        </div>
      </div>
    </div>
  );
}
