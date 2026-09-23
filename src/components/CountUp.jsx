import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Counts a numeric string ("98%", "7+") up from zero when it scrolls into view.
 *
 * Under reduced motion the final value is written straight to the element:
 * a number ticking upward is exactly the kind of movement the setting asks us
 * to drop, and the figure itself is the content.
 */
export default function CountUp({
  value,
  as: Tag = 'span',
  className = '',
  duration = 1.6,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const match = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);

    if (!match) {
      el.textContent = value;
      return;
    }

    const [, prefix, numberStr, suffix] = match;
    const target = parseFloat(numberStr);
    const decimals = (numberStr.split('.')[1] || '').length;
    const counter = { value: 0 };

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

      gsap.to(counter, {
        value: target,
        duration,
        ease: 'power3.out',
        overwrite: true,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.value.toFixed(decimals)}${suffix}`;
        },
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      el.textContent = value;
    });

    return () => mm.revert();
  }, [value, duration]);

  return (
    <Tag ref={ref} className={`${className} tabular-nums`} {...props}>
      {value}
    </Tag>
  );
}
