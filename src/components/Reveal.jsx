import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  y = 40,
  delay = 0,
  duration = 0.8,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [y, delay, duration]);

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
