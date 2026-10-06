import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

/**
 * Pulls its child toward the mouse while hovered and springs back on leave.
 * Mouse only — on touch there is no hover, and a drifting button under a thumb
 * is just a moving target.
 */
export default function Magnetic({ children, strength = 0.35, className = '', as: Tag = 'span' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: true });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <Tag ref={ref} className={`inline-block ${className}`}>
      {children}
    </Tag>
  );
}
