// "Is the page visible yet?" Entrance animations on a page wait for this, so
// they play after the preloader (first visit) or the route-transition curtain
// has cleared, instead of running unseen underneath it.
//
// Callbacks are always run on a fresh animation frame. markReady() is called
// from inside GSAP timeline callbacks, and GSAP files any animation created
// during such a callback under the *caller's* gsap.context — so without the
// hop, the hero intro belonged to the preloader and was reverted the moment
// the preloader unmounted.

let ready = false;
let queue = [];

export function onReady(cb) {
  if (ready) {
    const id = requestAnimationFrame(cb);
    return () => cancelAnimationFrame(id);
  }
  queue.push(cb);
  return () => {
    queue = queue.filter((f) => f !== cb);
  };
}

export function markReady() {
  if (ready) return;
  ready = true;
  const q = queue;
  queue = [];
  requestAnimationFrame(() => q.forEach((cb) => cb()));
}

export function markBusy() {
  ready = false;
}

export const isReady = () => ready;
