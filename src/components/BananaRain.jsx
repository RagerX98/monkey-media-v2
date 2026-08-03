import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function BananaRain({ count = 26 }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.3 + Math.random() * 0.9,
        size: 20 + Math.random() * 22,
        rotate: (Math.random() - 0.5) * 540,
        drift: (Math.random() - 0.5) * 60,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {drops.map((d) => (
        <motion.span
          key={d.id}
          initial={{ top: '-10%', opacity: 0, rotate: 0, x: 0 }}
          animate={{ top: '110%', opacity: [0, 1, 1, 0], rotate: d.rotate, x: d.drift }}
          transition={{ duration: d.duration, delay: d.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            fontSize: d.size,
            lineHeight: 1,
          }}
        >
          🍌
        </motion.span>
      ))}
    </div>
  );
}
