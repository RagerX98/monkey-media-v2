# Project Overview — Monkey Media V2

Snapshot as of 2026-10-06 (full redesign, live). Update this file when
structure, pages, or conventions change — see logbook/README.md.

> **The original (v1) design is preserved**, not lost: tag
> `v1-original-design` / branch `archive/original-design` (commit `d966c7c`).
> See **ORIGINAL-DESIGN.md** for what it looked like and how to view, borrow
> from or roll back to it. Do not delete those refs.

## What it is

Marketing site for Monkey Media, a creative agency (social, influencer,
branding, content, performance, web, events, AI visuals). Purple/gold on
black, playful "monkey energy" tone. The signature of the design is the
mascot itself: a vector version that watches the visitor, blinks, and that
the homepage camera dives into.

Live at **https://monkeymedia.agency**.

## Stack

- **React 19** + **React Router 7** (client-side routed SPA, `BrowserRouter`)
- **Vite 8** (`npm run dev`, `npm run build`, `npm run preview`)
- **Tailwind CSS 4** (via `@tailwindcss/vite`; config lives in
  `src/index.css` under `@theme` — there is no `tailwind.config.js`)
- **Fonts**: Montserrat (body, UI) + **Syne** (display only), self-hosted via
  `@fontsource`
- **GSAP 3 + ScrollTrigger** — everything scroll-driven, plus timelines
  (preloader, page transition, hero intro). `src/lib/gsap.js` registers the
  plugin once and also exports `prefersReducedMotion()`.
- **Lenis** — smooth wheel/trackpad scrolling on desktop, driven from GSAP's
  ticker (`src/lib/smooth.js`). Touch keeps native scrolling.
- **Framer Motion 12** — layout/presence animation (mobile menu, Our Work
  filtering, accordion rows), springs (card tilt, button press).
- **oxlint** (`npm run lint`). No test suite.

## Routing (`src/App.jsx`)

`Home` is eager; the rest are `React.lazy`, each wrapped in its own
`Suspense` so the nav and footer never blank out. `Layout` prefetches every
lazy page once the first page is visible, so the transition curtain never
lifts onto an empty fallback.

| Path | Page |
|---|---|
| `/` | Home |
| `/services` | Services (supports `#social`, `#web`, … anchors) |
| `/work` | Our Work |
| `/about` | About (footer link only) |
| `/pricing` | Pricing |
| `/contact` | Contact |
| `/portfolio` | redirects to `/work` |
| anything else | redirects to `/` |

**Navigation** (`NAV_LINKS` in `src/data/site.js`): Home, Services, Our Work,
Pricing, Contact, plus a Book a Call button. **About is deliberately
footer-only** (it is also linked from the mobile menu's footer area).

## Site chrome (`src/layouts/Layout.jsx`)

Renders, in order: `Preloader`, `PageTransition`, `Cursor`, `PeekingMonkey`,
`Navbar`, the page, `Footer`, and a static film-grain overlay (md and up).
Starts Lenis on mount.

- **`Preloader.jsx`** — first visit per browser session only
  (`sessionStorage` key `mm-intro-seen`), skipped under reduced motion. The
  mascot pops in, a counter runs to 100 with cycling words, it blinks, a gold
  gleam opens across the middle and two curved "eyelids" part to reveal the
  site. Calls `markReady()` (see below) as the lids open.
- **`PageTransition.jsx`** — gold curtain between routes. Listens for clicks
  in the *capture* phase and `preventDefault`s internal links before React
  Router's `<Link>` handler runs (Link skips navigation when the event is
  already defaultPrevented), so no link component needs changing. Skips
  external links, new-tab/modified clicks, same-page hash links and anything
  under `/previews/`. Back/forward navigations skip the curtain.
- **`Navbar.jsx`** — floating pill on desktop that hides while scrolling down
  and returns on scroll up; gold round menu button on mobile opening a purple
  full-screen menu (portalled to `<body>` because the header animates
  `transform`, which would otherwise contain the fixed overlay).
- **`Cursor.jsx`** — fine pointers only. The visitor keeps their **normal
  system cursor** everywhere; it turns into a small vector **banana** only over
  things you act on (buttons, cards, CTA links — `ACTION_SELECTOR`). It stays
  normal over plain inline text links (`.link-line`), form fields and any
  region marked `data-cursor-native` (the whole footer). The native cursor is
  hidden only while the banana shows (`html.banana-on`). Over elements with
  `data-cursor="…"` a small gold pill with that label trails the banana
  ("View" on work cards). The banana's hotspot is its stem tip.
- **`Footer.jsx`** — big email link, page/service/contact columns, magnetic
  back-to-top, and the giant two-line `Wordmark` (mascot as the O).
- **`PeekingMonkey.jsx`** — the existing easter egg, unchanged.

### "Ready" gating (`src/lib/ready.js`)

Entrance animations wait for `onReady(cb)`, which fires once the preloader
or transition curtain has cleared, so nothing plays unseen underneath them.
`markBusy()` / `markReady()` are called by `PageTransition` and
`Preloader`. **Callbacks run on a fresh animation frame on purpose:**
`markReady()` is called from inside GSAP timeline callbacks, and GSAP files
any animation created during such a callback under the *caller's*
`gsap.context` — the hero intro was being reverted the moment the preloader
unmounted. Components that start animations from `onReady` should also wrap
them in their own `ctx.add(...)`.

## Pages

- **Home** (`src/pages/Home.jsx` → `src/components/home/*`):
  - `Hero` — "PURE / M●NKEY / ENERGY." The mascot is *not* in the text: it is
    drawn in a full-stage SVG positioned over an empty slot in the headline
    (measured with `offset*`, which ignores transforms — at measure time the
    line is still pushed down for its entrance). Scrolling the 220svh wrapper
    zooms the SVG group by a `transform` *attribute* about `FACE_CORE`, a point
    inside the white heart, until white fills the stage; past 97% the stage
    simply turns white so no seam shows against the next section. Stickers
    hang off the word "PURE" in em units; a purple spotlight and sticker
    parallax follow the mouse via the shared pointer loop.
  - `Manifesto` — white section the dive lands in; a scroll-scrubbed
    paragraph (with an inline mascot and client-logo pills) and the stats.
  - `Ribbons` — two crossing service marquees over the white/ink seam.
  - `ServicesList` — the 8 services as big rows; hover fills purple, click
    expands blurb + deliverables + a link to `/services#slug`.
  - `WorkRail` — purple section. On ≥1024px it pins and the cards travel
    sideways (thumbnails drift against the travel via `containerAnimation`);
    below that it is a vertical list of the first four.
  - `ClientsWall` — gold section, two opposite marquees of client tiles.
  - `Process` — "how we swing": a vine that fills as you scroll with the
    mascot riding its tip; steps light up as it reaches them.
  - `BigCTA` (shared, `src/components/BigCTA.jsx`) — closing call to action
    with a magnetic round button that rains bananas, and the mascot peeking
    up from the bottom edge. `tone`: `paper` | `gold` | `purple`.
- **Services** — `PageHero`, then the 8 services as sticky stacking cards
  (brand-colour skins; each card shrinks and darkens via an overlay as the
  next covers it — opacity, never a scrubbed `filter`), ribbons, `Process`
  (light), gold `BigCTA`. `useHashScroll` handles `/services#slug`.
- **Our Work** — `PageHero` with filter tabs (animated gold pill), an
  editorial 7/5 grid of tilt cards using `SiteThumb`, "Dropping soon" tiles
  for empty categories, `ClientsWall`, purple `BigCTA`. Data in
  `src/data/work.js` (see below).
- **About** — story (scrubbed paragraph), purple stats band, values as
  coloured cards that start scattered and straighten as you scroll, "Meet the
  troop" with the existing `OrbitField` banana game, `BigCTA`.
- **Pricing** — no prices by design; how a quote works (3 steps), the
  factors that move a quote (two marquees), gold `BigCTA`.
- **Contact** — "Say hey." with a large watching mascot, an email card that
  also copies the address, a WhatsApp card. No form by design.

## Shared components

- `brand/monkeyPaths.js` — the mascot as vector paths, traced from
  `assets/mascot-icon.png`'s own pixels. `BANANA` (#ffbf00) is the logo's
  gold; the UI accent `gold` (#ffd700) is unchanged.
- `brand/MonkeyFace.jsx` — the living mascot. Props: `track`, `blink`,
  colours (`head`, `face`, `eye`), `label` (otherwise decorative), and
  `group` (render a bare `<g>` inside a larger SVG). Each eye is three
  nested layers because each owns one transform: look (JS), blink (CSS
  `[data-blink]`), tilt (SVG attribute).
- `brand/Wordmark.jsx` — "M●NKEY / MEDIA" for the footer.
- `motion/Split.jsx` — word/char slide-up reveal (`trigger="load"` waits for
  ready, `"scroll"` uses ScrollTrigger). `\n` breaks lines; `accent` colours
  words.
- `motion/ScrubWords.jsx` — paragraph whose words brighten with scroll;
  accepts inline React elements.
- `motion/Marquee.jsx` — drifting strip that surges with scroll speed and
  follows scroll direction; runs only while on screen.
- `motion/Magnetic.jsx` — mouse-only magnetic pull.
- `SectionHead.jsx` — numbered eyebrow + split title + aside, with `tone`.
- `PageHero.jsx` — inner-page opener (`size="lg"` for long titles).
- `CTAButton.jsx` — every button: label roll, rising fill, arrow chip.
  Variants `primary`, `gold`, `dark`, `light`, `ghost`, `ghost-dark`; sizes
  `sm`/`md`/`lg`. Framer owns `transform` (press); CSS handles colour only.
- `Reveal.jsx`, `CountUp.jsx` — unchanged scroll fade-up and number counter.
- `work/SiteThumb.jsx` — CSS/SVG brand-preview thumbnails (unchanged).

## Data (`src/data/`)

- `site.js` — `CONTACT`, `TAGLINE`, `NAV_LINKS`, `STATS`, `PROCESS`, `VALUES`.
- `services.js` — the canonical 8 services: `number`, `slug` (anchor id),
  `title`, `short` (ribbons, chips), `blurb`, `deliverables`. Used by Home,
  Services, the ribbons and the footer — one place to edit.
- `work.js` — Our Work items and categories. **To add work, add one object.**
  Use `thumb: { image, alt }` for a real screenshot / AI visual / reel poster,
  or `thumb: { scene }` for a built-in preview. A category with no items shows
  a "Dropping soon" tile automatically.
- `clients.js` — 12 client logo tiles (PNG + WebP).

## Design system (`src/index.css`)

| Token | Value | Use |
|---|---|---|
| `ink` | `#0d0d0d` | page background |
| `void` | `#161616` | dark cards |
| `paper` | `#ffffff` | text / light sections |
| `purple` | `#8b5cf6` | primary accent, purple sections |
| `gold` | `#ffd700` | secondary accent, gold sections |
| `banana` | `#ffbf00` | the mascot's own gold (logo artwork) |
| `cream` | `#f6f4ef` | reserved off-white |

Helpers: `.display` (Syne 800, uppercase, tight), `.eyebrow`, `.mask` (reveal
clip), `.link-line` (underline draw), `.text-outline`, `.grain`,
`.spin-slow`, `.no-scrollbar`, cursor and blink styles.

**Rules learned the hard way:**

- **Custom classes go in `@layer components`.** Tailwind 4 puts utilities in
  a cascade layer, and unlayered CSS beats layered CSS regardless of
  specificity — `.display` outside a layer silently overrode every
  `leading-*` / `font-*` utility next to it.
- **Syne 800 is ~45% wider than 700** ("ENERGY." 7.07em vs 4.83em). Big
  display lines use `font-bold` on phones and `md:font-extrabold`. Check new
  headlines at 320px; a quick way is to look for any `.mask` whose
  `scrollWidth > clientWidth`.
- **`.mask` keeps side padding** (with matching negative margin): the tight
  tracking pushes the last glyph's ink past its box.
- **`html, body { overflow-x: clip }`, never `hidden`** — hidden creates a
  scroll container and breaks every `position: sticky` on the site.
- No scrubbed CSS `filter` on large elements; animate an overlay's opacity.

**Reduced motion** is respected throughout: no preloader, no Lenis, no
curtain, no pointer tracking; reveals render in their final state.

## Known intentional gaps

- No team profiles yet — the `OrbitField` banana game stands in.
- No prices on the site — deliberate.
- No contact form — deliberate.

## Static demo sites (`public/previews/`)

Eight standalone HTML pages (six sample sites + two Shopify theme previews)
served as-is at `/previews/<name>/`, outside the React app. The Our Work page
and the homepage work rail present them; `/previews/` itself redirects to
`/work`. Link to them with plain `<a href>` (React Router `<Link>` would
route inside the SPA), and keep them out of the page-transition curtain
(PageTransition already ignores `/previews`).
