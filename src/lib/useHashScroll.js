import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { onReady } from './ready';
import { getLenis } from './smooth';

/** Scroll to `#id` from the URL once the page is visible (e.g. /services#web). */
export default function useHashScroll(offset = -110) {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return undefined;
    return onReady(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
      else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
    });
  }, [hash, offset]);
}
