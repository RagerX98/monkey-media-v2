# Changelog

Newest first. Each entry ties to a commit hash where one exists. See
logbook/README.md for how to add to this.

## 2026-09-23 (later) — `436b5c5`, `0e5c4e2`

**Three post-deploy fixes, two of them reported from the live site**

### Services page scrolled sideways (`436b5c5`)

`ServiceCard` enters from `x: ±70`, so any card still waiting on its
scroll trigger sat 70px outside the container: scrollWidth 719 against a
673 viewport, with scrollX reaching 46. `body { overflow-x: hidden }`
hid it visually, which is why it survived the first verification pass —
but the page really did scroll, which on iOS reads as a horizontal
rubber-band on every drag. Fixed with `overflow-x-clip` on the grid
(not `overflow-hidden`, which would clip the vertical hover lift too).

**Check `maxScrollX`, not just `scrollWidth`, and never trust
`overflow-x: hidden` on body to mean "no overflow".**

### Mobile menu collapsed into the header (`0e5c4e2`)

Reported as "glitches on half the page" — it rendered as a 76px strip
instead of full screen, but *only once scrolled*, which is what made it
look intermittent.

**The header gains `backdrop-filter: blur(12px)` past 12px of scroll,
and a backdrop-filter establishes a containing block for
`position: fixed` descendants.** The panel therefore positioned against
the header box rather than the viewport. Fixed by portalling the panel
to `<body>`.

That fix then exposed a second bug: the burger's `z-index` only competed
inside the header's old stacking context, so the portalled panel (z-65)
covered the header (z-40) and tapping the X hit the menu instead —
trapping the user in it. The header now rises above the panel while
open and drops its scrolled background.

### Logo wall too fast, plus drag-to-scrub (`0e5c4e2`)

Base drift 1.6 → 0.75px/frame (~106 → ~45px/s); scroll surge gain 0.5 →
0.35. Velocity reactivity itself unchanged. Added pointer-event
drag-to-scrub so the strip can be pushed with a thumb (or dragged with a
mouse) while still drifting; releasing hands the flick to a signed
momentum channel that decays back into the drift. `touch-action: pan-y`
keeps vertical page scrolling, so grabbing the strip never traps a thumb.

**Trap worth knowing: `releasePointerCapture` throws `NotFoundError`
when the pointer has already gone.** Calling it before assigning the
throw aborted the handler and silently swallowed every flick. Set state
first; treat both capture calls as non-fatal.

## 2026-09-23 — `fa73def`

**Motion & cosmetics pass**

**Nine changes from a site-wide motion audit, plus one performance
root-cause that turned out to matter more than any of them.**

Shipped in one pass: shared service card, shared CTA button with press
states, custom cursor, full-screen mobile menu, character-mask headline
with a gold sweep, reduced-motion coverage for GSAP, capped grid
stagger, a display typeface, and a scroll-velocity logo wall.

### The performance finding (read this one)

The site was running at **45fps with 22 dropped frames per 89** on the
homepage *before any of this work* — measured with zero cursor code on
the page, so it was never the cursor.

Cause: in `AmbientSmoke.jsx` the outer parallax wrappers carried
`will-change-transform`, but the **inner blurred blobs** — the ones
actually animating `x`/`y` on an infinite loop — did not. A 70–90px blur
on a ~300px element was being re-rasterised every frame. Adding
`will-change-transform` to the inner blobs took the homepage to **60fps,
0 dropped frames**. This affected the hero, the About page, and every
scroll animation on the site; it only became visible once a custom
cursor gave the eye something to compare against the real pointer.

**Lesson for future sessions: a blurred element that animates needs its
own layer promotion, on the element carrying the blur — not its parent.**

### New components

- `CTAButton.jsx` — the one button on the site, replacing nine copies of
  the same Tailwind string. Framer owns `transform` outright and CSS is
  left with colour only. That split is why press states were possible at
  all: the old `transition-transform hover:scale-105` fought any Framer
  transform layered on top. Touch devices now get feedback, since
  `whileTap` fires on pointerdown where `hover:` never did.
- `ServiceCard.jsx` — shared by the homepage teaser and the Services
  page, which previously rendered a plain bordered div while its own
  teaser had the full treatment. Adds a cursor-tracked spotlight and
  gradient rim (opacity-only pseudo-elements, so hovering costs no
  layout).
- `CustomCursor.jsx` — dot that morphs into the mascot over anything
  interactive. Fine-pointer + no-reduced-motion only; `cursor: none` is
  applied only once the component is live, so a JS failure can't leave a
  visitor with no cursor.

### Bugs found and fixed while verifying

Five of these were caught only by re-checking, and are worth knowing:

1. **`animation-fill-mode: both` pinned a compositor layer per glyph.**
   The shine's final keyframe retained a non-`none` `filter` forever:
   48.6fps / 18 dropped, against 57.8 once released. Removing the
   fill-mode fixed it. The animation looked perfect either way — this
   was only ever visible in a profile.
2. **The gold sweep was structurally broken, not mistuned.**
   `background-clip: text` cannot reach through the per-character
   `.reveal-mask` spans (`overflow: hidden` inline-blocks break the
   clip), while `-webkit-text-fill-color: transparent` still inherits to
   the glyphs — so "ENERGY" rendered *completely invisible*. Replaced
   with a per-glyph brightness pulse, which at rest is exactly
   `brightness(1)`, making the failure mode impossible rather than
   merely avoided.
3. **Per-character inline-blocks break words mid-word.** Without
   `white-space: nowrap` on each word wrapper, the hero read
   "MONK / EY". Syne compounded it: at the old flat `text-6xl`,
   "MONKEY" measured 449px against 342px available on a 390px phone.
   Fixed with nowrap plus a fluid clamp below `sm`.
4. `Hero.jsx` still passed `stagger={0.09}`, a per-*word* value now
   applied per-*character*, stretching the headline over 1.44s.
5. "PORTFOLIO" in the new mobile menu ran 46px past the gutter in Syne.

### Verified

60fps idle and under hard scrolling, desktop and mobile; logo wall
steady at 59.9fps through a flick with skew clamped under 7°; all five
pages free of horizontal overflow; lint and build clean.

Not verified at runtime: `prefers-reduced-motion`, which can't be
emulated in the preview pane — the reduce branches are confirmed
structurally (all four GSAP components register both queries) rather
than observed.

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
