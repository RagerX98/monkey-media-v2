// One shared pointer tracker for everything that "looks at" the visitor
// (the mascot's eyes, the hero spotlight). A single passive listener and a
// single rAF loop, with every subscriber's DOM reads done before any of their
// writes, so several watchers on one page never interleave reads and writes
// and force layout per frame.

const subs = new Set();
const state = {
  x: typeof window === 'undefined' ? 0 : window.innerWidth / 2,
  y: typeof window === 'undefined' ? 0 : window.innerHeight / 3,
  lastMove: 0,
  fine: false,
};

let raf = 0;
let listening = false;

function onMove(e) {
  state.x = e.clientX;
  state.y = e.clientY;
  state.lastMove = performance.now();
  if (e.pointerType === 'mouse') state.fine = true;
}

function loop(now) {
  raf = 0;
  if (!subs.size) return;
  // Reads first…
  const reads = [];
  for (const s of subs) reads.push(s.read ? s.read() : null);
  // …then writes.
  let i = 0;
  for (const s of subs) s.write(reads[i++], state, now);
  raf = requestAnimationFrame(loop);
}

/**
 * Subscribe to the shared loop. `read()` may measure the DOM; `write(readResult,
 * pointer, now)` should only write. Returns an unsubscribe function.
 */
export function watchPointer(sub) {
  if (!listening && typeof window !== 'undefined') {
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    listening = true;
  }
  subs.add(sub);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    subs.delete(sub);
    if (!subs.size && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

export const pointer = state;
