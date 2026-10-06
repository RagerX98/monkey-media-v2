import { useLayoutEffect, useRef } from 'react';
import MonkeyFace from '../brand/MonkeyFace';
import CTAButton from '../CTAButton';
import { FACE_CORE } from '../brand/monkeyPaths';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { onReady } from '../../lib/ready';
import { watchPointer } from '../../lib/pointer';

// Artwork units of the mascot's viewBox (see monkeyPaths.js).
const ART = { x: 80, y: 88, w: 1106, h: 1006 };

// Stickers hang off the headline words, positioned in em so they scale with
// the type and land in the same free space at every screen size.
const STICKERS = [
  { label: 'Startups', pos: 'left-full top-[0.02em] ml-[0.12em]', look: '-rotate-8 bg-purple text-paper', depth: 18 },
  { label: 'D2C brands', pos: 'left-full top-[0.44em] ml-[0.08em] sm:ml-[0.3em]', look: 'rotate-6 bg-paper text-ink', depth: 26 },
  {
    label: 'Personal brands',
    pos: 'left-full top-[0.12em] ml-[1.45em] hidden lg:block',
    look: 'rotate-3 bg-gold text-ink',
    depth: 14,
  },
];

function Sticker({ label, pos, look, depth }) {
  return (
    <span
      data-sticker-wrap
      data-depth={depth}
      className={`pointer-events-none absolute z-10 whitespace-nowrap ${pos}`}
    >
      <span
        data-sticker
        className={`block rounded-full px-3.5 py-1.5 font-sans text-[0.62rem] font-extrabold uppercase leading-none tracking-[0.16em] shadow-[0_10px_30px_rgba(0,0,0,0.35)] md:px-5 md:py-2.5 md:text-xs ${look}`}
      >
        {label}
      </span>
    </span>
  );
}

const SERVICES_LINE = ['Social', 'Influencer', 'Branding', 'Content', 'Performance', 'Web', 'AI'];

/**
 * The homepage opener.
 *
 * "PURE MONKEY ENERGY", with the mascot standing in for the O as it does in the
 * logo. The mascot is not in the text flow: it lives in a full-screen SVG laid
 * over the hero, positioned onto an empty placeholder in the headline. That
 * lets scrolling take it somewhere text can't — the camera dives into the
 * face until the white of it fills the screen, which is exactly where the
 * next (white) section begins.
 *
 * The dive scales an SVG group by a transform *attribute*, so the vector is
 * redrawn crisp at every size rather than a bitmap being stretched.
 */
export default function Hero() {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const slotRef = useRef(null);
  const svgRef = useRef(null);
  const faceRef = useRef(null);
  const glowRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const slot = slotRef.current;
    const svg = svgRef.current;
    const face = faceRef.current;
    const reduced = prefersReducedMotion();
    const q = gsap.utils.selector(stage);

    // Geometry, recomputed on resize.
    const geo = { s0: 1, sx: 0, sy: 0, vw: 1, vh: 1, sEnd: 10 };
    const state = { dive: 0, pop: reduced ? 1 : 0, done: false };

    // The slot's resting position, from offset* rather than a bounding rect:
    // offsets ignore transforms, and at measure time the headline line holding
    // the slot is still pushed down for its entrance (or sliding aside as the
    // dive progresses).
    const slotOffset = () => {
      let x = 0;
      let y = 0;
      let el = slot;
      while (el && el !== stage) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return { x, y, w: slot.offsetWidth };
    };

    const measure = () => {
      geo.vw = stage.clientWidth;
      geo.vh = stage.clientHeight;
      svg.setAttribute('viewBox', `0 0 ${geo.vw} ${geo.vh}`);
      const r = slotOffset();
      geo.s0 = r.w / ART.w;
      // Where FACE_CORE sits on screen when the face is resting in its slot.
      geo.sx = r.x + (FACE_CORE.x - ART.x) * geo.s0;
      geo.sy = r.y + (FACE_CORE.y - ART.y) * geo.s0;
      // Big enough that the white of the face covers the whole stage.
      geo.sEnd = Math.max(geo.vw / 2 / 70, geo.vh / 2 / 82) * 1.15;
      render();
    };

    const render = () => {
      const p = state.dive;
      const k = Math.pow(p, 1.35);
      // Exponential zoom reads as constant speed; linear would crawl then lurch.
      const s = geo.s0 * Math.pow(geo.sEnd / geo.s0, k) * state.pop;
      const m = gsap.parseEase('power2.inOut')(Math.min(1, p * 1.4));
      const cx = geo.sx + (geo.vw / 2 - geo.sx) * m;
      const cy = geo.sy + (geo.vh / 2 - geo.sy) * m;
      // Once the face fills the screen, hand over to a plain white backdrop so
      // no edge of the artwork (or a sub-pixel seam) can show at the hand-off
      // to the white section below.
      const done = p > 0.97;
      if (done !== state.done) {
        state.done = done;
        wrap.style.backgroundColor = done ? '#ffffff' : '';
        stage.style.backgroundColor = done ? '#ffffff' : '';
        svg.style.visibility = done ? 'hidden' : '';
      }
      // Rotation only during the intro pop.
      const rot = (1 - state.pop) * -30;
      face.setAttribute(
        'transform',
        `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${rot.toFixed(2)}) scale(${s.toFixed(5)}) translate(${-FACE_CORE.x} ${-FACE_CORE.y})`
      );
    };

    const ctx = gsap.context(() => {
      measure();
      // Re-measure when the stage resizes *or* the headline reflows (late font
      // load, a breakpoint changing the type size) — either moves the slot.
      const ro = new ResizeObserver(measure);
      ro.observe(stage);
      ro.observe(slot.closest('h1'));
      document.fonts?.ready.then(measure);

      if (reduced) return () => ro.disconnect();

      // Hidden until the page is ready.
      gsap.set(q('[data-line] > span'), { yPercent: 110 });
      gsap.set(q('[data-fade]'), { opacity: 0, y: 24 });
      gsap.set(q('[data-sticker]'), { scale: 0, opacity: 0 });

      const intro = () => ctx.add(() => {
        const tl = gsap.timeline();
        tl.to(q('[data-line] > span'), { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.09 })
          .to(state, { pop: 1, duration: 1.1, ease: 'back.out(1.8)', onUpdate: render }, 0.25)
          .to(q('[data-fade]'), { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0.5)
          .to(q('[data-sticker]'), { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2.4)', stagger: 0.1 }, 0.8);
      });
      const cancelReady = onReady(intro);

      // The dive.
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          state.dive = self.progress;
          render();
        },
      });

      // Everything else steps aside as the face grows.
      const out = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top top', end: '40% top', scrub: true },
      });
      out
        .to(q('[data-row="a"]'), { xPercent: -18, opacity: 0, ease: 'none' }, 0)
        .to(q('[data-row="c"]'), { xPercent: 18, opacity: 0, ease: 'none' }, 0)
        .to(q('[data-row="b"] [data-letters]'), { opacity: 0, ease: 'none' }, 0)
        .to(q('[data-ui]'), { opacity: 0, y: -30, ease: 'none' }, 0)
        .to(q('[data-sticker-wrap]'), { opacity: 0, scale: 0.6, ease: 'none' }, 0)
        .to(q('[data-grid]'), { opacity: 0, ease: 'none' }, 0);

      // Spotlight + sticker parallax follow the pointer (desktop).
      const stickers = q('[data-sticker-wrap]');
      const glow = glowRef.current;
      const g = { x: 0, y: 0 };
      const unwatch = watchPointer({
        read: () => stage.getBoundingClientRect(),
        write(rect, p) {
          if (!p.fine) return;
          const nx = (p.x - rect.left) / rect.width - 0.5;
          const ny = (p.y - rect.top) / rect.height - 0.5;
          g.x += (p.x - rect.left - g.x) * 0.08;
          g.y += (p.y - rect.top - g.y) * 0.08;
          glow.style.transform = `translate3d(${g.x - 350}px, ${g.y - 350}px, 0)`;
          stickers.forEach((el) => {
            const d = Number(el.dataset.depth);
            el.style.translate = `${(-nx * d).toFixed(1)}px ${(-ny * d).toFixed(1)}px`;
          });
        },
      });

      return () => {
        ro.disconnect();
        cancelReady();
        unwatch();
        st.kill();
      };
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="relative h-[220svh] bg-ink" aria-label="Pure monkey energy">
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Backdrop: faint grid and a purple spotlight that trails the mouse. */}
        <div
          data-grid
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
        />
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.34),rgba(139,92,246,0)_65%)] will-change-transform"
          style={{ transform: 'translate3d(30vw, 10vh, 0)' }}
        />

        <div className="relative z-[5] mx-auto flex h-full max-w-[1600px] flex-col justify-between px-4 pb-6 pt-28 md:px-10 md:pb-8 md:pt-28">
          <div data-ui className="flex items-start justify-between gap-6">
            <p data-fade className="eyebrow max-w-[16rem] text-paper/60">
              Creative agency for brands with guts
            </p>
            <span data-fade className="block shrink-0 lg:hidden">
              <ScrollBadge small />
            </span>
            <ul data-fade className="hidden flex-wrap justify-end gap-x-3 gap-y-1 text-right lg:flex">
              {SERVICES_LINE.map((s, i) => (
                <li key={s} className="eyebrow text-paper/60">
                  {s}
                  {i < SERVICES_LINE.length - 1 && <span className="ml-3 text-gold">/</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Bold (700) on phones, ExtraBold (800, much wider) from md up.
              Measured: "ENERGY." is 4.83em at 700 and 7.07em at 800, so these
              sizes keep it inside the gutters from 320px up. */}
          <h1 className="display text-[min(18.2vw,15svh)] font-bold text-paper md:text-[min(11.6vw,21svh)] md:font-extrabold">
            <span className="sr-only">Pure Monkey Energy</span>
            <span aria-hidden="true" className="block">
              <span data-row="a" className="flex items-end justify-between gap-6">
                <span className="relative">
                  <span data-line className="mask">
                    <span>Pure</span>
                  </span>
                  <Sticker {...STICKERS[0]} />
                  <Sticker {...STICKERS[1]} />
                  <Sticker {...STICKERS[2]} />
                </span>
              </span>
              <span data-row="b" className="flex justify-end">
                <span data-line className="mask">
                  <span className="flex items-end">
                    <span data-letters>M</span>
                    {/* The mascot is drawn over this slot by the SVG below. */}
                    <span
                      ref={slotRef}
                      className="mx-[0.03em] mb-[0.035em] inline-block h-[0.765em] w-[0.84em]"
                    />
                    <span data-letters>nkey</span>
                  </span>
                </span>
              </span>
              <span data-row="c" className="flex">
                <span data-line className="mask">
                  <span className="text-gold">Energy.</span>
                </span>
              </span>
            </span>
          </h1>

          <div data-ui className="flex flex-col gap-5 lg:hidden">
            <p data-fade className="max-w-md text-[0.95rem] leading-relaxed text-paper/65">
              We help startups, D2C labels and personal brands get noticed, get talked about and get
              results.
            </p>
            <div data-fade className="flex flex-wrap gap-3">
              <CTAButton to="/contact" variant="gold">
                Start a project
              </CTAButton>
              <CTAButton to="/work" variant="ghost" arrow={false}>
                Our work
              </CTAButton>
            </div>
          </div>
          <div data-ui className="hidden items-end justify-between gap-10 lg:flex">
            <div className="flex items-center gap-3">
              <span data-fade>
                <CTAButton to="/contact" variant="gold" size="lg">
                  Start a project
                </CTAButton>
              </span>
              <span data-fade>
                <CTAButton to="/work" variant="ghost" size="lg" arrow={false}>
                  See our work
                </CTAButton>
              </span>
            </div>
            <div className="flex items-center gap-8">
              <p data-fade className="max-w-[24rem] text-right text-base leading-relaxed text-paper/65">
                We help startups, D2C labels and personal brands get noticed, get talked about and
                get results.
              </p>
              <span data-fade className="block shrink-0">
                <ScrollBadge />
              </span>
            </div>
          </div>
        </div>

        {/* The mascot, drawn over the headline slot and zoomed by scroll. */}
        <svg
          ref={svgRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[6] h-full w-full"
          preserveAspectRatio="none"
        >
          <g ref={faceRef}>
            <MonkeyFace group />
          </g>
        </svg>
      </div>
    </section>
  );
}

function ScrollBadge({ small = false }) {
  const id = small ? 'badge-circle-sm' : 'badge-circle';
  return (
    <span
      className={`relative grid place-items-center ${
        small ? 'h-[5.5rem] w-[5.5rem]' : 'h-24 w-24 xl:h-28 xl:w-28'
      }`}
    >
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id={id} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" />
        </defs>
        <text className="fill-paper font-sans text-[8.6px] font-extrabold uppercase tracking-[0.32em]">
          <textPath href={`#${id}`}>Scroll to dive in ✦ Scroll to dive in ✦</textPath>
        </text>
      </svg>
      <span className={`grid place-items-center rounded-full bg-gold text-ink ${small ? 'h-8 w-8' : 'h-11 w-11'}`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </span>
  );
}
