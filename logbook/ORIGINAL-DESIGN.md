# The Original Design (v1) — preserved

The site was fully redesigned on 2026-10-06 (see CHANGELOG.md). The design
it replaced is kept intact so it can be viewed, borrowed from or restored at
any time. This page records where it lives and what it looked like.

## Where it is saved

| Backup | Location | Points at |
|---|---|---|
| Git tag | `v1-original-design` (on GitHub) | commit `d966c7c` |
| Git branch | `archive/original-design` (on GitHub) | commit `d966c7c` |
| Source zip | `Temp/backups/monkey-media-original-design-d966c7c.zip` (local, outside the repo) | same source |
| Vercel | the last production deployment before the redesign merge, in the project's Deployments list | built from `d966c7c` |

The redesign's own source at the moment it went live is also zipped next to
it (`monkey-media-redesign-7a74176.zip`).

## How to use it

- **Look at it locally:**
  ```
  git worktree add ../mm-original v1-original-design
  cd ../mm-original && npm install && npm run dev
  ```
  (A worktree leaves your current checkout alone. Remove it afterwards with
  `git worktree remove ../mm-original`.)
- **Borrow one piece** (a component, a section): `git show
  v1-original-design:src/components/sections/Hero.jsx` prints the old file;
  copy what you need.
- **Put the old site back live, fast:** Vercel dashboard → Deployments →
  the last production deployment before the redesign → *Instant Rollback*
  (or *Promote to Production*). Takes seconds and changes no code; the next
  push to `master` will deploy the redesign again.
- **Put the old site back live, permanently:** revert the redesign merge on
  `master` (`git revert -m 1 <merge commit>`) and push.

## What the original looked like

Same brand system as today — ink `#0d0d0d` background, purple `#8b5cf6` and
gold `#ffd700` accents, white text, Syne for headlines, Montserrat for
everything else, the logo and the mascot. What changed is layout, motion and
copy. The v1 style in short: **dark, centred, card-based, with soft glowing
ambience and the mascot as a floating PNG.**

### Global
- **Navbar**: fixed bar, logo mark left, uppercase links with a purple
  underline that grows on hover (active link purple), purple "Book a Call"
  pill → `/pricing`. Blurred ink background after 12px of scroll. Mobile: a
  dark purple-to-ink gradient takeover that opens as a circle from the burger,
  numbered Syne links.
- **Footer**: full logo + "A next level creative agency…" line, three
  columns (Services, Agency, Get In Touch) with gold headings, copyright row
  with "Fun, funky, active like a monkey."
- **Cursor**: small white dot with a purple halo that morphed into the mascot
  PNG over anything clickable.
- **Peeking monkey** easter egg (still present in v2).
- **Cards everywhere**: `rounded-2xl`, `border-white/10`, `bg-void`
  (#161616), border turning purple or gold on hover.
- **Buttons** (`CTAButton`): purple pill, turning gold with ink text on
  hover, scale 1.05 on hover / 0.95 on press.
- **Motion**: GSAP fade-up on scroll (`Reveal`), Framer scale-in for page
  headers (`SubtleReveal`), page fade (`PageFade`), count-up stats.

### Home
1. **Hero** — "PURE MONKEY ENERGY" (Energy in gold) revealed character by
   character with a light sweep (`RevealWords`); pill eyebrow "Creative agency
   for brands with guts"; subhead; Start a Project / See Our Work. Right side:
   the large mascot PNG with mouse tilt, idle bob and scroll parallax. Behind:
   drifting blurred purple and gold blobs (`AmbientSmoke`) and a faint 64px
   grid. A tilted text marquee ran under the hero, with a "Scroll" cue.
2. **"A taste of the jungle."** — four teaser services as cards with a
   cursor-following purple spotlight and gradient rim (`ServiceCard`); an
   accordion on phones; "See All Services".
3. **Clients** — "From global names to fast-growing D2C labels…" with a logo
   marquee you could drag and fling, which sped up and skewed with scroll.
4. **"Ready to go bananas?"** — mascot, scroll-scrubbed gold glow behind a
   "Book a Discovery Call" button that rained bananas on hover.

### Other pages
- **Services** — "What We Do" and all eight services in a two-column card
  grid, Start a Project button.
- **Our Work** — "Built with monkey energy." with category sections of work
  cards, coming-soon tiles and the client wall; bananas rained on arrival.
- **About** — "The monkeys behind the madness.", story text, 2×2 stat cards,
  four value cards, "Meet the troop" banana game, mascot sign-off.
- **Pricing** — centred mascot, "Let's Talk Numbers", one paragraph, Book a
  Discovery Call.
- **Contact** — "Say Hey", two cards (email, WhatsApp).

### Files that made it (all in the tag)
`src/components/sections/{Hero,ServicesOverview,Clients,CTABanner}.jsx`,
`src/components/{AmbientSmoke,MarqueeStrip,MonkeyMascot,PageFade,RevealWords,ServiceCard,SubtleReveal,CustomCursor,CTAButton,Navbar,Footer}.jsx`,
the v1 `src/pages/*`, and the v1 `src/index.css` (`.svc-card`,
`.reveal-mask`, `.reveal-shine`, `.cursor-*` styles).
