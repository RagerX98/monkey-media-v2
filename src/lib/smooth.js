import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

// Smooth scrolling for wheel and trackpad. Touch keeps the platform's own
// momentum scrolling (Lenis leaves touch alone by default), which feels better
// on a phone than any emulation and costs nothing.
//
// Lenis is driven from GSAP's ticker so ScrollTrigger and Lenis agree on the
// scroll position on every frame — two separate rAF loops drift by a frame and
// scrubbed animations visibly jitter.

let lenis = null;

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -90 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() {
  return lenis;
}

/** Jump to the top instantly (used under the page-transition curtain). */
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
