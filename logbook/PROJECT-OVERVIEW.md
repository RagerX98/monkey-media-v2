# Project Overview — Monkey Media V2

Snapshot as of 2026-09-23 (motion & cosmetics pass). Update this file
when structure, pages, or conventions change — see logbook/README.md.

## What it is

Marketing site for Monkey Media, a creative agency ("social, influencer,
branding, content, performance, and web"). Purple/gold-on-black identity,
playful "monkey energy" tone, heavy use of scroll-triggered motion.

Live at **https://monkeymedia.agency**.

## Stack

- **React 19** + **React Router 7** (client-side routed SPA, `BrowserRouter`)
- **Vite 8** (`npm run dev`, `npm run build`, `npm run preview`)
- **Tailwind CSS 4** (via `@tailwindcss/vite`, config lives inline in
  `src/index.css` using the `@theme` directive — there is no
  `tailwind.config.js`)
- **Fonts**: Montserrat (body, UI, card titles) + **Syne** (display
  headings only), both self-hosted via `@fontsource`
- **Framer Motion 12** — mount transitions, hover states, drag-free
  physics (springs), the mobile nav, easter-egg interactions
- **GSAP 3 + ScrollTrigger** — scroll-position-driven animation
  (`src/lib/gsap.js` registers the plugin once and exports `gsap`/
  `ScrollTrigger` for everyone else to import)
- **oxlint** for linting (`npm run lint`)
- No test suite exists.

Two animation libraries are used deliberately: Framer Motion for anything
mount-driven or physics-y, GSAP ScrollTrigger for anything that should
react to scroll position specifically. New animated components should
follow whichever precedent matches what they're doing rather than mixing
both in one component.

## Routing (`src/App.jsx`)

`Home` is loaded eagerly; every other page is lazy-loaded via
`React.lazy`. `ScrollToTop` resets scroll on route change. Routes:

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/services` | Services |
| `/portfolio` | Portfolio |
| `/pricing` | Pricing |
| `/contact` | Contact |

All routes render inside `Layout` (`src/layouts/Layout.jsx`), which wraps
`<Outlet />` with `Navbar`, `Footer`, and the global `PeekingMonkey` easter
egg.

## Pages (`src/pages/`)

- **Home.jsx** — composes `Hero`, `ServicesOverview`, `Clients`,
  `CTABanner` (all in `src/components/sections/`).
- **About.jsx** — "The monkeys behind the madness." Story copy, a 2×2
  stat grid (years/brands/retention/countries, each animated with
  `CountUp`), a 4-item "Our Values" grid, and a "Meet the Troop" section
  that — since there's no real team page yet — is filled with `OrbitField`,
  an interactive banana-catching mini-game, instead of team photos.
- **Services.jsx** — full list of all 8 services from `src/data/services.js`
  as static cards (number, title, blurb).
- **Portfolio.jsx** — client wall from `src/data/clients.js`, gated behind
  a one-time `BananaRain` entrance animation on mount.
- **Pricing.jsx** — no price list by design ("we don't do cookie-cutter
  pricing"); just a mascot, a pitch, and a CTA to `/contact`.
- **Contact.jsx** — no form; two cards linking to `mailto:` and a
  `wa.me` WhatsApp link.

## Components (`src/components/`)

**Layout/chrome:**
- `Navbar.jsx` — fixed header, active-link underline, backdrop-blur after
  12px of scroll, animated hamburger menu on mobile.
- `Footer.jsx` — sitemap columns + contact links, fades in on scroll via
  Framer `whileInView`.

**Shared UI (use these rather than re-styling a button or card):**
- `CTAButton.jsx` — every call-to-action on the site. Variants
  `primary`/`ghost`, sizes `sm`/`md`/`lg`; renders a router `<Link>` for
  `to`, an `<a>` for `href`, else a `<button>`. **Framer owns `transform`
  here and CSS is left with colour only** — do not add
  `transition-transform` or `hover:scale-*` to it or to a wrapper, or the
  press state will fight the CSS transition. That conflict is exactly why
  press feedback couldn't be added before. If something outside needs to
  animate a CTA's transform (GSAP scrub, say), animate a *wrapper* —
  `CTABanner.jsx` does this.
- `ServiceCard.jsx` — the service card for both the homepage teaser and
  the Services page. Visuals live in `.svc-card` in `index.css`; the
  spotlight follows the pointer via `--mx`/`--my`, written rAF-throttled
  and only for `pointerType === 'mouse'`.
- `CustomCursor.jsx` — mounted once in `Layout`. Dot that morphs into the
  mascot over `a, button, [role=button], label, [data-cursor-grow]`. Only
  for fine pointers with no reduced-motion preference. Carries **no
  `mix-blend-mode`**: the first version used difference-blended gold,
  which is pure black over the gold button hover state. `FOLLOW` (0.4) is
  the feel knob.

**Animation primitives** (reused across pages — prefer these over one-off
animation code):
- `Reveal.jsx` — GSAP ScrollTrigger fade-up-on-scroll wrapper. Uses
  `once: true` (plays a single time; does not fade back out when you
  scroll up past it) and `gsap.matchMedia` for reduced motion. Use for
  below-the-fold content.
- `SubtleReveal.jsx` — Framer Motion opacity+scale-in on mount (not
  scroll-triggered). Used for above-the-fold page headers that should
  animate in immediately.
- `RevealWords.jsx` — splits text into **characters**, each sliding up
  from behind a clipping mask, then pulses accent words with a travelling
  shine. Used for the homepage hero headline. Three things are
  load-bearing: `stagger` is now per character (~0.03, not the old 0.09
  per word); each word wrapper needs `whitespace-nowrap` or lines break
  mid-word; and the shine is a `filter` pulse with **no
  `animation-fill-mode`** — `both` would retain a non-`none` filter and
  pin a compositor layer per glyph. Do not reach for a
  `background-clip: text` gradient here: the clip cannot cross the
  `overflow: hidden` mask spans and the word renders invisible.
- `PageFade.jsx` — simple opacity fade wrapper most inner pages use as
  their root element.
- `CountUp.jsx` — added 2026-09-21. Animates a numeric string (`"98%"`,
  `"7+"`) from 0 up when it scrolls into view, via GSAP tweening a proxy
  object and writing `textContent` on `onUpdate`. Parses prefix/number/
  suffix with regex, preserves decimals if the source value has them,
  uses `once: true` (plays once, does not reverse/reset on scroll-back),
  and forces `tabular-nums` on the rendered element so digit width
  changes don't cause layout jitter. See CHANGELOG.md 2026-09-21 for why
  those specific choices were made (smoothness pass).

**Ambient/decorative:**
- `AmbientSmoke.jsx` — two blurred colored blobs (purple + gold) that
  drift on an infinite loop and parallax slightly toward the cursor
  (desktop, fine-pointer only, respects `prefers-reduced-motion`). Used
  on Home hero and About page. **The inner blurred blobs must keep
  `will-change-transform`, not just the outer parallax wrappers.**
  Without it the browser re-rasterises a 70–90px blur every frame of the
  drift, which measured 45fps / 22 dropped frames against 60fps / 0 with
  it. This was the single largest performance problem on the site.
- `MarqueeStrip.jsx` — infinite horizontal scrolling text ticker (CSS
  `animate-marquee` keyframe defined in `index.css`), used under the hero.
- `MonkeyMascot.jsx` — the floating mascot image with cursor/touch-driven
  3D tilt (Framer springs) and an idle bob/rotate loop. Reused on Home,
  Pricing, and the About CTA.

**Easter eggs (playful, non-essential — safe to leave alone unless asked):**
- `PeekingMonkey.jsx` — globally mounted in `Layout`; a mascot randomly
  peeks in from a screen edge every 10–24s, dodges with a joke reaction if
  clicked. Has an inline comment explaining the hit-padding math — read it
  before touching the peek-offset constants.
- `BananaRain.jsx` — falling-banana-emoji burst, reused by Portfolio
  (on page load), CTABanner (on hover/click), and OrbitField (every 5th
  catch).
- `OrbitField.jsx` — the mini-game standing in for a team section on
  About: three rotating rings of clickable bananas, a score counter, mood
  emoji that cycles per catch, hype-text pop-ins, and a `BananaRain` burst
  every 5 catches.

**Section components** (`src/components/sections/`, Home-page only):
- `Hero.jsx` — headline, subhead, CTAs, mascot with scroll-linked
  parallax lag, marquee strip.
- `ServicesOverview.jsx` — a 4-service teaser (own local array,
  `TEASER_SERVICES` — **not** the same array as `src/data/services.js`;
  keep both in sync manually if a teased service's copy changes, as
  happened 2026-09-18). Renders as cards on `sm:` and up, as an accordion
  below that.
- `Clients.jsx` — logo marquee driven by **scroll velocity**: a rAF loop
  transforms the single track element, surging and skewing as you scroll
  and easing back to a drift. Reads `window.scrollY` *inside the tick*
  rather than from a scroll listener, because iOS throttles scroll events
  during momentum — precisely when the effect should be liveliest. Pauses
  entirely via IntersectionObserver when off-screen, measures width with
  a ResizeObserver rather than per frame, and clamps velocity so a hard
  flick can't blur the strip. Cards still fade in via GSAP + `stagger`.
- `CTABanner.jsx` — bottom-of-homepage CTA; scroll-scrubbed button/glow
  scale via GSAP (`scrub`, not a one-shot play), banana rain on
  hover/click, intercepts left-clicks to delay navigation until the rain
  starts.

## Data (`src/data/`)

- `services.js` — canonical list of all 8 services, each
  `{ number, title, blurb }`. Rendered as-is on the **Services** page.
  **`ServicesOverview.jsx`'s `TEASER_SERVICES` still duplicates 4 of
  these entries with independent copy — there is no shared source of
  truth for the DATA.** As of 2026-09-23 both lists render through the
  same `ServiceCard.jsx` component, so the *card treatment* is shared
  and can't drift again — but a copy change still has to be made in both
  arrays.
- `clients.js` — 12 clients, each with a PNG + WebP logo pair and a
  category. Used by both `Portfolio.jsx` and `sections/Clients.jsx`.

## Design system (`src/index.css`)

Tailwind v4 theme tokens, defined via `@theme` (no separate config file):

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0d0d0d` | page background |
| `--color-void` | `#161616` | card background |
| `--color-paper` | `#ffffff` | primary text |
| `--color-purple` | `#8b5cf6` | primary accent |
| `--color-purple-dim` | `#6d28d9` | |
| `--color-gold` | `#ffd700` | secondary accent |
| `--color-gold-dim` | `#cca300` | |
| `--font-sans` | Montserrat | body, UI, card titles; `@fontsource/montserrat` (500/700/800/900) |
| `--font-display` | Syne | display headings only; `@fontsource/syne` (700/800) |

**Typeface rule:** Syne (via the `font-display` utility, paired with
`font-extrabold` — Syne stops at 800, there is no 900) goes on
display-scale headings only. Montserrat keeps everything else, including
card titles like `ServiceCard`'s `h3` and the Portfolio tile `h2`, where
Syne's wider letterforms read as cramped. Syne is appreciably wider than
Montserrat, so check long words against the gutter on a 390px viewport
before setting a flat heading size — two overflow bugs came from exactly
that.

Global conventions: dark background, uppercase heavy headlines,
rounded-2xl/3xl cards with `border-white/10` that highlight to purple or
gold on hover.

**`prefers-reduced-motion` is now respected everywhere, not just in
Framer.** All four GSAP components (`Reveal`, `CountUp`, `Clients`,
`CTABanner`) gate on `gsap.matchMedia` with an explicit reduce branch
that settles the final state. Framer components use `useReducedMotion`.
Any new GSAP animation must follow the same pattern — before
2026-09-23 none of them did, and since `Reveal` wraps most below-the-fold
content, that was the majority of the site ignoring the setting.

## Known intentional gaps

- No real "Team" page/content — `OrbitField` game is the deliberate
  stand-in (see commit `76a2dec`).
- No pricing figures anywhere on the site — deliberate positioning
  ("every brand's needs are different").
- No contact form — deliberate ("no forms, no gatekeeping").
