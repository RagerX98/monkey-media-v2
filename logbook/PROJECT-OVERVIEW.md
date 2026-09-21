# Project Overview — Monkey Media V2

Snapshot as of 2026-09-21 (commit `270f026`). Update this file when
structure, pages, or conventions change — see logbook/README.md.

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

**Animation primitives** (reused across pages — prefer these over one-off
animation code):
- `Reveal.jsx` — GSAP ScrollTrigger fade-up-on-scroll wrapper (`toggleActions:
  'play none none reverse'`, i.e. replays if you scroll away and back).
  Use for below-the-fold content.
- `SubtleReveal.jsx` — Framer Motion opacity+scale-in on mount (not
  scroll-triggered). Used for above-the-fold page headers that should
  animate in immediately.
- `RevealWords.jsx` — splits text into words and staggers them in; used
  for the homepage hero headline.
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
  on Home hero and About page.
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
- `Clients.jsx` — infinite logo marquee (duplicated array for seamless
  loop), fades cards in via GSAP ScrollTrigger + `stagger`.
- `CTABanner.jsx` — bottom-of-homepage CTA; scroll-scrubbed button/glow
  scale via GSAP (`scrub`, not a one-shot play), banana rain on
  hover/click, intercepts left-clicks to delay navigation until the rain
  starts.

## Data (`src/data/`)

- `services.js` — canonical list of all 8 services, each
  `{ number, title, blurb }`. Rendered as-is on the **Services** page.
  **`ServicesOverview.jsx`'s `TEASER_SERVICES` duplicates 4 of these
  entries with independent copy — there is no shared source of truth
  between them.**
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
| `--font-sans` | Montserrat | loaded via `@fontsource/montserrat` (500/700/800/900) |

Global conventions: dark background, uppercase black-weight headlines,
rounded-2xl/3xl cards with `border-white/10` that highlight to purple or
gold on hover, `prefers-reduced-motion` respected in every Framer
component that loops.

## Known intentional gaps

- No real "Team" page/content — `OrbitField` game is the deliberate
  stand-in (see commit `76a2dec`).
- No pricing figures anywhere on the site — deliberate positioning
  ("every brand's needs are different").
- No contact form — deliberate ("no forms, no gatekeeping").
