import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import MonkeyMascot from '../MonkeyMascot';
import MarqueeStrip from '../MarqueeStrip';
import RevealWords from '../RevealWords';

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Mascot lags behind normal scroll speed for a subtle depth effect (transform-only, GPU friendly).
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const bgBlobY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink pt-24"
    >
      <motion.div
        aria-hidden
        style={{ y: bgBlobY }}
        className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-purple/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-gold/[0.14] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 md:grid-cols-[1fr_1fr] md:px-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-paper/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Creative agency for brands with guts
          </motion.div>

          <RevealWords
            text="Pure Monkey Energy"
            accentWords={['Monkey']}
            accentClassName="text-purple"
            delay={0.15}
            stagger={0.09}
            className="text-6xl font-black uppercase leading-[0.95] tracking-tight text-paper sm:text-7xl lg:text-8xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 max-w-lg text-lg text-paper/60"
          >
            A creative agency for startups, D2C brands, and personal brands who'd rather stand
            out than fit in: social, influencer, branding, content, performance, and web, one
            jungle, one energy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/contact"
              className="rounded-full bg-purple px-8 py-4 text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:scale-105 hover:bg-gold hover:text-ink"
            >
              Start a Project
            </Link>
            <Link
              to="/portfolio"
              className="rounded-full border border-white/25 px-8 py-4 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:border-paper"
            >
              See Our Work
            </Link>
          </motion.div>
        </div>

        <motion.div style={{ y: mascotY }} className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'backOut' }}
          >
            <MonkeyMascot size={280} className="md:hidden" />
            <MonkeyMascot size={460} className="hidden md:block" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="relative z-10 mt-16"
      >
        <MarqueeStrip className="-rotate-1" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-widest text-paper/40 md:flex"
      >
        Scroll
        <span className="h-8 w-px bg-paper/30" />
      </motion.div>
    </section>
  );
}
