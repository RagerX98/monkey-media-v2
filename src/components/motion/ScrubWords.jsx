import { Fragment, isValidElement, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

/**
 * A paragraph that "writes itself in" as you scroll: each word goes from faint
 * to full strength, tied to the scroll position. `parts` mixes strings and
 * React elements (inline pills, stickers); elements count as one word.
 */
export default function ScrubWords({
  parts,
  as: Tag = 'p',
  className = '',
  dim = 0.14,
  start = 'top 80%',
  end = 'bottom 55%',
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-w]'),
        { opacity: dim },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start, end, scrub: 0.4 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [dim, start, end]);

  return (
    <Tag ref={ref} className={className}>
      {parts.map((part, i) => {
        if (isValidElement(part)) {
          return (
            <Fragment key={i}>
              <span data-w className="inline-block align-middle">
                {part}
              </span>{' '}
            </Fragment>
          );
        }
        return String(part)
          .split(/\s+/)
          .filter(Boolean)
          .map((w, j) => (
            <Fragment key={`${i}-${j}`}>
              <span data-w>{w}</span>{' '}
            </Fragment>
          ));
      })}
    </Tag>
  );
}
