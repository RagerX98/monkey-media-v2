import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

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

    el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        value: target,
        duration,
        ease: 'power3.out',
        overwrite: true,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.value.toFixed(decimals)}${suffix}`;
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [value, duration]);

  return (
    <Tag ref={ref} className={`${className} tabular-nums`} {...props}>
      {value}
    </Tag>
  );
}
