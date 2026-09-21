# Changelog

Newest first. Each entry ties to a commit hash where one exists. See
logbook/README.md for how to add to this.

## 2026-09-21 — `270f026`

**Add smooth count-up animation to About page stat cards**

The 4 stat cards on `/about` (7+ Years, 10+ Brands, 98% Retention, 4
Countries) now count up from 0 when scrolled into view, via a new
`src/components/CountUp.jsx`. Went through two passes:

1. First pass: basic GSAP-tweened counter, `toggleActions: 'play none
   none reverse'` (replays every time you scroll away and back).
2. User asked to make it "extremely smooth for mobile and desktop."
   Fixed three things: added `tabular-nums` so digit width changes don't
   jitter the layout, switched to `once: true` so it plays a single time
   and doesn't reset/reverse on scroll-back, and switched easing to
   `power3.out` for a gentler landing. Verified at both 1440px and 390px
   viewport widths, mid-animation and settled.

Deployed to production via `vercel --prod --yes` (see DEPLOYMENT.md
gotcha #3 — a plain `vercel --prod` got blocked by the Claude Code
auto-mode classifier even after explicit user confirmation).

## 2026-09-18 — `5383b4e`

**Tighten AI Photography & Visuals service card copy**

Old: *"A faster, cheaper alternative to traditional shoots. Product
photography, full model shoots for your website and marketplaces,
realistic social visuals, and AI video, generated entirely with AI, so
you get everything a shoot would give you without booking one."*

New: *"Everything a traditional shoot gives you: product photography,
model shoots, social visuals, video, without booking one. Faster.
Cheaper. AI-generated."*

Had to be changed in **two places** — this service appears both in
`src/data/services.js` (card `08`, full Services page) and duplicated
independently in `src/components/sections/ServicesOverview.jsx`
(`TEASER_SERVICES`, card `04`, homepage teaser). These two lists are not
shared — see PROJECT-OVERVIEW.md's note on `services.js` vs.
`TEASER_SERVICES`.

Also the session where we discovered DEPLOYMENT.md gotcha #1 (GitHub →
Vercel auto-deploy gap): the live site was found to be ~3 commits/17
minutes behind what was already pushed. Root-caused, then fixed by
running `vercel --prod` manually.

## 2026-08-31 — `a8a3289`, `021dabf`, `c126fdc`

**About page copy and stats refresh**

- `c126fdc` — updated About section subtitle and first story paragraph.
- `021dabf` — updated headline stats to 7+ years / 10+ brands / 4
  countries.
- `a8a3289` — replaced one stat card with "98% Client Retention Rate"
  and updated the second story paragraph.

## 2026-08-27 — `76a2dec`

**Turn About page team filler into a mobile-friendly banana-catch game**

Added `OrbitField.jsx` (the rotating-rings banana mini-game) as the
"Meet the Troop" section content, replacing whatever placeholder was
there after the team section removal below.

## 2026-08-13 — `d78e26b`

**Remove team section from About page**

No real team content existed yet; section was pulled rather than shipped
with filler.

## 2026-08-12 — `8868f9e`

**Use shared interactive AmbientSmoke on homepage hero**

Homepage hero switched to the same `AmbientSmoke` component the About
page uses, rather than a separate implementation.

## 2026-08-11 — `1220858`, `8572900`

- `1220858` — added the About Us page with its interactive ambient smoke
  background (initial version).
- `8572900` — bumped `nanoid` to patch a high-severity security advisory.

## 2026-08-03 — initial build day

Everything below happened on the site's first day, in order:

- `10e7763` — initial build of Monkey Media V2: purple/gold identity,
  premium scroll animations.
- `f29d495` — fixed brands marquee logos never appearing on scroll.
- `d4513a9` — reworked brands logo reveal to use GSAP ScrollTrigger
  instead of Framer `whileInView` (reliability fix).
- `ccb3b10` — made footer logo background transparent.
- `f1de256` — updated homepage content: hero, services, and brands
  section.
- `c5ca679` — updated hero eyebrow text to "Creative agency for brands
  with guts."
- `4157aec` — updated hero headline colors: removed purple from
  "MONKEY," added gold to "ENERGY."
- `01a4287` — boosted gold smoke opacity, added slow floating drift to
  hero background blobs.
- `59c3f0a` — increased hero blob float amplitude with per-axis timing
  for a more organic drift.
- `a526a73` — added easter eggs: `PeekingMonkey` and `BananaRain`.
- `706ebe3` — colored the WhatsApp label green on the Contact page.
- `9e3d5c5` — tied the CTA button color to the raining state so touch
  taps get visual feedback (no hover state on touch devices otherwise).
- `88b281c` — general animation and loading performance pass across the
  site.
