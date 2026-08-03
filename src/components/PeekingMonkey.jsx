import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import mascotIcon from '../assets/mascot-icon-solid.png';
import mascotIconWebp from '../assets/mascot-icon-solid.webp';

const EDGES = ['top', 'right', 'bottom', 'left'];
const MASCOT_SIZE = 52;
const HIT_PADDING = 8;
const PEEK_VISIBLE = 22;
// The clickable wrapper adds HIT_PADDING around the mascot, so the peek offset
// has to account for that padding to land the intended visible sliver on-screen.
const PEEK_OFFSET = MASCOT_SIZE - PEEK_VISIBLE + HIT_PADDING;

const REACTIONS = [
  'OH SH*T!',
  'OH F**K!',
  'YIKES!',
  'TOO SLOW!',
  'NOT TODAY!',
  'NICE TRY!',
  "CAN'T CATCH ME!",
];

const PEEK_CONFIG = {
  top: { base: 'top-0 -translate-x-1/2', axis: 'left', from: { y: -56 }, to: { y: -PEEK_OFFSET } },
  bottom: { base: 'bottom-0 -translate-x-1/2', axis: 'left', from: { y: 56 }, to: { y: PEEK_OFFSET } },
  left: { base: 'left-0 -translate-y-1/2', axis: 'top', from: { x: -56 }, to: { x: -PEEK_OFFSET } },
  right: { base: 'right-0 -translate-y-1/2', axis: 'top', from: { x: 56 }, to: { x: PEEK_OFFSET } },
};

export default function PeekingMonkey() {
  const [peekEdge, setPeekEdge] = useState(null);
  const [peekOffset, setPeekOffset] = useState(50);
  const [caught, setCaught] = useState(false);
  const [reaction, setReaction] = useState('');
  const [dodgePos, setDodgePos] = useState({ x: 50, y: 50 });

  const hideTimerRef = useRef();
  const scheduleRef = useRef(() => {});

  useEffect(() => {
    let cancelled = false;
    let showTimer;

    function scheduleNextPeek() {
      const delay = 10000 + Math.random() * 14000;
      showTimer = setTimeout(() => {
        if (cancelled) return;
        setPeekEdge(EDGES[Math.floor(Math.random() * EDGES.length)]);
        setPeekOffset(12 + Math.random() * 76);
        hideTimerRef.current = setTimeout(() => {
          if (cancelled) return;
          setPeekEdge(null);
          scheduleNextPeek();
        }, 1800);
      }, delay);
    }

    scheduleRef.current = scheduleNextPeek;
    scheduleNextPeek();

    return () => {
      cancelled = true;
      clearTimeout(showTimer);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  function handleCatchAttempt() {
    clearTimeout(hideTimerRef.current);
    setReaction(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
    setDodgePos({ x: 25 + Math.random() * 50, y: 20 + Math.random() * 55 });
    setCaught(true);

    setTimeout(() => {
      setCaught(false);
      setPeekEdge(null);
      scheduleRef.current();
    }, 1000);
  }

  const peek = peekEdge ? PEEK_CONFIG[peekEdge] : null;
  // Top-edge peeks poke out from directly under the fixed navbar, so they need to
  // paint above it (z-40) to stay clickable. Other edges stay below it to avoid
  // ever intercepting a tap meant for nav links or the mobile menu button.
  const layerZ = peekEdge === 'top' ? 'z-[45]' : 'z-30';

  return (
    <div className={`pointer-events-none fixed inset-0 ${layerZ}`}>
      <AnimatePresence>
        {peek && !caught && (
          <div
            key={`${peekEdge}-${peekOffset}`}
            style={{ [peek.axis]: `${peekOffset}%` }}
            className={`absolute ${peek.base}`}
          >
            <motion.div
              className="pointer-events-auto cursor-pointer p-2"
              initial={{ opacity: 0, ...peek.from }}
              animate={{ opacity: 0.6, ...peek.to }}
              exit={{ opacity: 0, ...peek.from }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              onClick={handleCatchAttempt}
            >
              <picture>
                <source srcSet={mascotIconWebp} type="image/webp" />
                <img
                  src={mascotIcon}
                  alt=""
                  className="h-[52px] w-[52px] drop-shadow-[0_0_10px_rgba(255,215,0,0.45)]"
                />
              </picture>
            </motion.div>
          </div>
        )}

        {caught && (
          <motion.div
            key="caught"
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${dodgePos.x}vw`, top: `${dodgePos.y}vh` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.28, ease: 'backOut' }}
          >
            <span className="whitespace-nowrap rounded-full bg-paper px-3 py-1 text-xs font-black uppercase tracking-wide text-ink shadow-lg ring-2 ring-purple/50">
              {reaction}
            </span>
            <picture>
              <source srcSet={mascotIconWebp} type="image/webp" />
              <img
                src={mascotIcon}
                alt=""
                className="h-[52px] w-[52px] drop-shadow-[0_0_14px_rgba(139,92,246,0.6)]"
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
