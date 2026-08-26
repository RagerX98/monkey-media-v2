import { useRef, useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import BananaRain from './BananaRain';

const RINGS = [
  { pct: 100, duration: 20, direction: 1, startAngle: 0 },
  { pct: 68, duration: 15, direction: -1, startAngle: 130 },
  { pct: 40, duration: 10, direction: 1, startAngle: 250 },
];

const PARTICLES = [
  { top: '10%', left: '12%', size: 5, delay: 0, color: 'bg-gold/60' },
  { top: '85%', left: '10%', size: 4, delay: 0.6, color: 'bg-purple/60' },
  { top: '14%', left: '90%', size: 4, delay: 1.1, color: 'bg-purple/50' },
  { top: '88%', left: '88%', size: 6, delay: 0.3, color: 'bg-gold/50' },
];

const HYPE = ['OOH OOH!', 'NICE GRAB!', 'AH AH AH!', 'MONKE APPROVES', 'PEAK BANANA', 'GOT ONE!'];
const MOODS = ['🐒', '🙉', '🙈', '🐵'];

function OrbitBanana({ onCatch }) {
  const [bitten, setBitten] = useState(false);

  function handleClick() {
    if (bitten) return;
    setBitten(true);
    onCatch();
    setTimeout(() => setBitten(false), 650);
  }

  return (
    <button
      type="button"
      aria-label="Catch the banana"
      onClick={handleClick}
      className="absolute left-1/2 top-0 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full text-xl outline-none sm:text-2xl"
      style={{ cursor: bitten ? 'default' : 'pointer' }}
    >
      <motion.span
        animate={
          bitten
            ? { scale: [1, 1.6, 0], rotate: [0, 20, 200], opacity: [1, 1, 0] }
            : { scale: 1, rotate: 0, opacity: 1, y: [0, -4, 0] }
        }
        transition={
          bitten
            ? { duration: 0.55, ease: 'easeIn' }
            : { y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } }
        }
        className="drop-shadow-[0_0_10px_rgba(255,215,0,0.45)]"
      >
        🍌
      </motion.span>
    </button>
  );
}

export default function OrbitField({ className = '' }) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const [score, setScore] = useState(0);
  const [mood, setMood] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const [burstKey, setBurstKey] = useState(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 14 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 14 });

  function handleMouseMove(e) {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const handleCatch = useCallback(() => {
    setScore((s) => {
      const next = s + 1;
      if (next % 5 === 0) setBurstKey(next);
      return next;
    });
    setMood((m) => (m + 1) % MOODS.length);
    setPopKey((k) => k + 1);
  }, []);

  const hypeText = HYPE[popKey % HYPE.length];

  return (
    <div
      ref={wrapRef}
      onMouseMove={reduceMotion ? undefined : handleMouseMove}
      onMouseLeave={reduceMotion ? undefined : handleMouseLeave}
      style={{ perspective: 900 }}
      className={`relative flex select-none items-center justify-center overflow-hidden py-8 ${className}`}
    >
      <motion.div
        style={{ rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : rotateY }}
        className="relative flex w-full items-center justify-center"
      >
        <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[360px] md:max-w-[440px]">
          <motion.div
            animate={reduceMotion ? undefined : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.12, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-1/2 h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/25 blur-[50px] md:blur-[70px]"
          />
          <motion.div
            animate={reduceMotion ? undefined : { opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute left-1/2 top-1/2 h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[40px] md:blur-[60px]"
          />

          {RINGS.map((ring) => {
            const offset = (100 - ring.pct) / 2;
            return (
              <motion.div
                key={ring.pct}
                style={{ top: `${offset}%`, left: `${offset}%`, width: `${ring.pct}%`, height: `${ring.pct}%` }}
                className="absolute rounded-full border border-dashed border-white/10"
                animate={reduceMotion ? undefined : { rotate: [ring.startAngle, ring.startAngle + 360 * ring.direction] }}
                transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
              >
                <OrbitBanana onCatch={handleCatch} />
              </motion.div>
            );
          })}

          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <AnimatePresence>
              <motion.span
                key={popKey}
                initial={{ opacity: 0, y: 6, scale: 0.8 }}
                animate={{ opacity: [0, 1, 1, 0], y: -34, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="pointer-events-none absolute -top-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-gold sm:text-xs"
              >
                {score > 0 ? hypeText : ''}
              </motion.span>
            </AnimatePresence>

            <motion.span
              key={mood}
              initial={{ scale: 0.6 }}
              animate={{ scale: [0.6, 1.3, 1] }}
              transition={{ duration: 0.4 }}
              className="text-4xl drop-shadow-[0_0_20px_rgba(139,92,246,0.55)] sm:text-5xl md:text-6xl"
            >
              {MOODS[mood]}
            </motion.span>

            <span className="mt-3 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-paper/50 sm:text-xs">
              {score === 0 ? 'Tap a banana' : `🍌 x${score} fed`}
            </span>
          </div>

          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              animate={reduceMotion ? undefined : { y: [0, -14, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
              style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
              className={`pointer-events-none absolute rounded-full ${p.color}`}
            />
          ))}
        </div>
      </motion.div>

      {burstKey !== null && (
        <div key={burstKey} className="pointer-events-none absolute inset-0">
          <BananaRain count={16} />
        </div>
      )}
    </div>
  );
}
