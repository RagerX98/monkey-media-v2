// Thumbnail for a piece of work on the Our Work page.
//
// The demo sites are drawn here as small browser windows showing each brand's
// own hero: its colours, type feel and signature shapes. They are plain CSS and
// SVG, so they stay razor sharp at any size or pixel density, add no image
// weight and cost nothing to decode. Every measurement is in `cqw` (1% of the
// frame's own width), so a scene scales perfectly from a phone to a wide card.
//
// For real screenshots, AI visuals or reel poster frames pass
// `thumb: { image, alt }` in src/data/work.js and the scene is skipped.

const CLIP_TEXT = {
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

function Frame({ url, light = false, children }) {
  const dot = light ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.28)';
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-ink [container-type:inline-size]"
    >
      <div
        className="absolute inset-x-0 top-0 z-10 flex items-center"
        style={{
          height: '6cqw',
          gap: '1.2cqw',
          padding: '0 2.2cqw',
          background: light ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.5)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <i
            key={i}
            className="block rounded-full"
            style={{ width: '1.3cqw', height: '1.3cqw', background: dot }}
          />
        ))}
        <span
          className="truncate"
          style={{
            marginLeft: '2cqw',
            fontSize: '1.9cqw',
            padding: '0.4cqw 2.4cqw',
            borderRadius: 999,
            background: light ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.1)',
            color: light ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.55)',
          }}
        >
          {url}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0" style={{ top: '6cqw' }}>
        {children}
      </div>
    </div>
  );
}

const abs = (style) => ({ position: 'absolute', ...style });

/* ------------------------------------------------------------------ Nova */
function Nova() {
  return (
    <Frame url="nova.ai">
      <div
        className="absolute inset-0 text-center text-white"
        style={{
          background:
            'radial-gradient(70% 90% at 12% -10%,rgba(124,58,237,.55),transparent 65%),radial-gradient(55% 80% at 95% 10%,rgba(37,99,235,.45),transparent 65%),#07060f',
        }}
      >
        <b style={abs({ left: '4cqw', top: '2.2cqw', fontSize: '3cqw' })}>✦ Nova</b>
        <span
          style={abs({
            right: '4cqw',
            top: '2cqw',
            fontSize: '1.9cqw',
            padding: '0.7cqw 2cqw',
            borderRadius: 999,
            background: 'linear-gradient(120deg,#8b5cf6,#22d3ee)',
          })}
        >
          Start free
        </span>
        <div className="absolute inset-x-0" style={{ top: '9.5cqw' }}>
          <span
            style={{
              fontSize: '1.6cqw',
              letterSpacing: '.12em',
              padding: '0.5cqw 2cqw',
              border: '1px solid rgba(255,255,255,.16)',
              borderRadius: 999,
              color: '#9a96b8',
            }}
          >
            ● NOVA 2.0 IS LIVE
          </span>
          <div
            className="font-extrabold"
            style={{ fontSize: '7cqw', lineHeight: 1.02, marginTop: '2cqw', letterSpacing: '-.03em' }}
          >
            AI workflows that
            <br />
            <span
              style={{
                ...CLIP_TEXT,
                backgroundImage: 'linear-gradient(120deg,#8b5cf6,#3b82f6 55%,#22d3ee)',
              }}
            >
              run themselves
            </span>
          </div>
        </div>
        <div
          style={abs({
            left: '22%',
            right: '22%',
            bottom: '-7cqw',
            height: '21cqw',
            borderRadius: '2.2cqw',
            border: '1px solid rgba(255,255,255,.14)',
            background: 'linear-gradient(180deg,rgba(25,21,50,.96),rgba(12,10,26,.98))',
          })}
        >
          <svg
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            style={abs({ left: '5%', top: '18%', width: '90%', height: '52%' })}
          >
            <defs>
              <linearGradient id="thumb-nova" x1="0" x2="1">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <path
              d="M0 48 C25 44 40 30 70 34 S115 12 140 20 S185 8 200 4"
              fill="none"
              stroke="url(#thumb-nova)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Fynn */
function Fynn() {
  return (
    <Frame url="fynn.money">
      <div
        className="absolute inset-0 text-white"
        style={{
          background:
            'radial-gradient(60% 70% at 85% 8%,rgba(92,255,177,.3),transparent 65%),linear-gradient(160deg,#06382c,#04231c)',
        }}
      >
        <b style={abs({ left: '4cqw', top: '2.2cqw', fontSize: '3.2cqw', letterSpacing: '-.04em' })}>
          Fynn
        </b>
        <div style={abs({ left: '4cqw', top: '11cqw', width: '52%' })}>
          <span style={{ fontSize: '1.5cqw', color: '#5cffb1', letterSpacing: '.12em', fontWeight: 700 }}>
            FREE TO OPEN
          </span>
          <div
            style={{
              fontSize: '6.4cqw',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-.045em',
              marginTop: '1.4cqw',
            }}
          >
            Money that moves like <span style={{ color: '#c8ff5c' }}>you do.</span>
          </div>
          <span
            style={{
              display: 'inline-block',
              marginTop: '3cqw',
              fontSize: '1.9cqw',
              fontWeight: 700,
              padding: '1cqw 2.8cqw',
              borderRadius: 999,
              color: '#02130f',
              background: 'linear-gradient(120deg,#5cffb1,#c8ff5c)',
            }}
          >
            Open account →
          </span>
        </div>
        <div
          style={abs({
            right: '6cqw',
            top: '4cqw',
            width: '23cqw',
            height: '50cqw',
            borderRadius: '3.6cqw',
            padding: '1cqw',
            background: 'linear-gradient(160deg,#1c4a3c,#0a2a21)',
            border: '1px solid rgba(190,255,225,.22)',
          })}
        >
          <div
            style={{
              height: '100%',
              borderRadius: '2.8cqw',
              padding: '3cqw 2cqw',
              background: 'linear-gradient(180deg,#0c3b2e,#06231b)',
            }}
          >
            <div style={{ fontSize: '1.3cqw', color: '#8fb5a7' }}>Total balance</div>
            <div style={{ fontSize: '3.6cqw', fontWeight: 800, letterSpacing: '-.05em' }}>$12,480</div>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '10cqw' }}>
              <path
                d="M0 32 C12 30 20 18 34 22 S58 8 70 14 S90 4 100 2"
                fill="none"
                stroke="#5cffb1"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: '4.4cqw',
                  borderRadius: '1.2cqw',
                  marginTop: '1.4cqw',
                  background: 'rgba(255,255,255,.07)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ VOLT */
function Volt() {
  return (
    <Frame url="volt.club">
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background:
            'radial-gradient(60% 80% at 85% 25%,rgba(212,255,0,.16),transparent 62%),#0a0a0a',
        }}
      >
        <b
          className="font-display"
          style={abs({ left: '4cqw', top: '2.4cqw', fontSize: '3.2cqw', color: '#d4ff00' })}
        >
          ⚡ VOLT
        </b>
        <div
          className="font-display font-extrabold uppercase"
          style={abs({ left: '4cqw', top: '8cqw', fontSize: '11cqw', lineHeight: 0.9, letterSpacing: '-.02em', whiteSpace: 'nowrap' })}
        >
          <span style={{ color: '#f5f5f0' }}>Forge</span>
          <br />
          <span style={{ color: '#f5f5f0' }}>your</span>
          <br />
          <span style={{ color: '#d4ff00' }}>limit.</span>
        </div>
        <div
          className="font-display font-extrabold uppercase"
          style={abs({
            left: '-5%',
            right: '-5%',
            bottom: '5cqw',
            padding: '1.1cqw 0',
            fontSize: '3.4cqw',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            color: '#0a0a0a',
            background: '#d4ff00',
            transform: 'rotate(-3deg)',
          })}
        >
          Train hard ⚡ No excuses ⚡ Earn every rep ⚡ Train hard ⚡ No excuses
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------- Ember &amp; Oak */
function Ember() {
  return (
    <Frame url="emberandoak.cafe" light>
      <div className="absolute inset-0" style={{ background: '#f3ece0', color: '#2a1810' }}>
        <i
          className="font-serif"
          style={abs({ left: '4cqw', top: '2.2cqw', fontSize: '3.2cqw', fontWeight: 600 })}
        >
          Ember &amp; Oak
        </i>
        <div style={abs({ left: '4cqw', top: '11.5cqw', width: '56%' })}>
          <span style={{ fontSize: '1.5cqw', letterSpacing: '.14em', fontWeight: 700, color: '#c4552d' }}>
            — SPECIALTY ROASTERS
          </span>
          <div
            className="font-serif"
            style={{ fontSize: '6.8cqw', lineHeight: 1.02, letterSpacing: '-.025em', marginTop: '1.6cqw' }}
          >
            Slow mornings, <i style={{ color: '#c4552d' }}>honest</i> coffee.
          </div>
          <span
            style={{
              display: 'inline-block',
              marginTop: '2.6cqw',
              fontSize: '1.8cqw',
              fontWeight: 600,
              padding: '1cqw 2.8cqw',
              borderRadius: 999,
              color: '#f3ece0',
              background: '#2a1810',
            }}
          >
            See the menu →
          </span>
        </div>
        <div
          style={abs({
            right: '7cqw',
            top: '3.5cqw',
            width: '23cqw',
            height: '33cqw',
            borderRadius: '999px 999px 2cqw 2cqw',
            background: 'linear-gradient(165deg,#d8b48e,#7a4a30 58%,#2a1810)',
            overflow: 'hidden',
          })}
        >
          <div
            style={abs({
              left: '50%',
              top: '30%',
              width: '12cqw',
              height: '12cqw',
              marginLeft: '-6cqw',
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(255,255,255,.55),transparent 68%)',
            })}
          />
        </div>
        <div
          className="font-serif"
          style={abs({
            right: '24cqw',
            top: '26cqw',
            width: '9.5cqw',
            height: '9.5cqw',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: '3.2cqw',
            fontStyle: 'italic',
            color: '#f3ece0',
            background: '#c4552d',
            boxShadow: '0 1cqw 3cqw rgba(196,85,45,.5)',
          })}
        >
          EO
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------------------------------------------------- Loudly */
function Loudly() {
  const pill = (bg, text) => ({
    display: 'inline-block',
    padding: '0 1.4cqw',
    margin: '0 -0.2cqw',
    borderRadius: '1.6cqw',
    color: '#f1efe9',
    background: bg,
    ...text,
  });
  return (
    <Frame url="loudly.agency" light>
      <div className="absolute inset-0 overflow-hidden" style={{ background: '#f1efe9', color: '#0d0d0d' }}>
        <div
          style={abs({
            right: '-5cqw',
            top: '2cqw',
            width: '27cqw',
            height: '27cqw',
            borderRadius: '50%',
            background: '#ff8fd8',
          })}
        />
        <div
          style={abs({
            right: '24cqw',
            top: '1.5cqw',
            width: '12cqw',
            height: '12cqw',
            borderRadius: '50%',
            background: '#ffe14d',
          })}
        />
        <b
          className="font-display"
          style={abs({ left: '4cqw', top: '2cqw', fontSize: '3.4cqw', letterSpacing: '-.06em' })}
        >
          loudly.
        </b>
        <div
          className="font-display font-extrabold"
          style={abs({ left: '4cqw', top: '11cqw', fontSize: '8.4cqw', lineHeight: 1, letterSpacing: '-.045em' })}
        >
          We make brands
          <br />
          <span style={pill('#ff3d00')}>impossible</span> to
          <br />
          <span style={pill('#3d4bff')}>scroll</span> past.
        </div>
      </div>
    </Frame>
  );
}

/* --------------------------------------------------------------- Halcyon */
function Halcyon() {
  return (
    <Frame url="halcyon.estate">
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#273045 0%,#2d2b2e 40%,#0c0b09 80%)' }}
      >
        <span
          style={abs({
            left: '4cqw',
            top: '2.4cqw',
            fontSize: '2.2cqw',
            letterSpacing: '.4em',
            color: 'rgba(241,236,226,.85)',
          })}
        >
          HALCYON
        </span>
        <svg
          viewBox="0 0 100 50"
          preserveAspectRatio="xMaxYMax meet"
          style={abs({ right: 0, bottom: 0, width: '78%', height: '78%' })}
        >
          <rect x="0" y="40" width="100" height="10" fill="#0c0b09" />
          <rect x="22" y="22" width="62" height="19" fill="#12100d" />
          <rect x="34" y="14" width="34" height="9" fill="#1a1713" />
          <rect x="22" y="22" width="62" height="1" fill="#c8a45c" opacity=".7" />
          {[26, 36, 46, 56, 66, 76].map((x) => (
            <rect key={x} x={x} y="27" width="6" height="10" fill="#e8b45a" opacity=".92" />
          ))}
          {[40, 50, 60].map((x) => (
            <rect key={x} x={x} y="16" width="5" height="5" fill="#e8b45a" opacity=".8" />
          ))}
        </svg>
        <div
          className="font-serif"
          style={abs({ left: '5cqw', top: '12cqw', fontSize: '7cqw', lineHeight: 1.02, color: '#f1ece2', fontWeight: 300 })}
        >
          Homes that hold
          <br />
          <i style={{ color: '#c8a45c' }}>a view.</i>
        </div>
        <div style={abs({ left: '5cqw', top: '34cqw', width: '14cqw', height: 1, background: '#c8a45c' })} />
      </div>
    </Frame>
  );
}

/* ---------------------------------------------------------------- Street */
function Street() {
  return (
    <Frame url="monkeystreet.shop">
      <div className="absolute inset-0 overflow-hidden" style={{ background: '#0a0a0a', color: '#f5f5f0' }}>
        <div
          style={abs({
            inset: '0 0 auto 0',
            height: '3.6cqw',
            display: 'grid',
            placeItems: 'center',
            fontSize: '1.4cqw',
            fontWeight: 800,
            letterSpacing: '.18em',
            color: '#0a0a0a',
            background: '#d4ff00',
          })}
        >
          FREE SHIPPING ON ORDERS OVER $100
        </div>
        <b
          className="font-display uppercase"
          style={abs({ left: '4cqw', top: '5.6cqw', fontSize: '3cqw', letterSpacing: '.02em' })}
        >
          Monkey Street
        </b>
        <div
          className="font-display font-extrabold uppercase"
          style={abs({ left: '4cqw', top: '13cqw', fontSize: '7cqw', lineHeight: 0.92, whiteSpace: 'nowrap' })}
        >
          Built for
          <br />
          <span style={{ color: '#d4ff00' }}>the street.</span>
        </div>
        <div
          style={abs({
            right: '4cqw',
            top: '9cqw',
            width: '15cqw',
            height: '21cqw',
            background: 'linear-gradient(160deg,#2a2a2a,#161616)',
          })}
        >
          <span
            style={abs({
              left: '1cqw',
              top: '1cqw',
              fontSize: '1.2cqw',
              fontWeight: 800,
              padding: '0.4cqw 1cqw',
              color: '#0a0a0a',
              background: '#d4ff00',
            })}
          >
            SALE
          </span>
          <span style={abs({ left: '1.4cqw', bottom: '1.4cqw', fontSize: '1.6cqw', fontWeight: 700 })}>$96</span>
        </div>
        <div
          className="font-display font-extrabold uppercase"
          style={abs({
            left: '-5%',
            right: '-5%',
            bottom: '3cqw',
            padding: '1cqw 0',
            fontSize: '3cqw',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            color: '#0a0a0a',
            background: '#d4ff00',
            transform: 'rotate(-2deg)',
          })}
        >
          Limited drops ⚡ Limited drops ⚡ Limited drops ⚡ Limited drops ⚡ Limited
        </div>
      </div>
    </Frame>
  );
}

/* ----------------------------------------------------------------- Bloom */
function Bloom() {
  return (
    <Frame url="bloomandco.shop" light>
      <div className="absolute inset-0" style={{ background: '#f7f1ea', color: '#2b211c' }}>
        <i
          className="font-serif"
          style={abs({ left: '4cqw', top: '2.2cqw', fontSize: '3.2cqw', fontWeight: 600 })}
        >
          Bloom &amp; Co
        </i>
        <div style={abs({ left: '4cqw', top: '11.5cqw', width: '56%' })}>
          <span style={{ fontSize: '1.5cqw', letterSpacing: '.14em', fontWeight: 700, color: '#b9573b' }}>
            CLEAN, CLINICAL SKINCARE
          </span>
          <div
            className="font-serif"
            style={{ fontSize: '6.4cqw', lineHeight: 1.04, letterSpacing: '-.02em', marginTop: '1.6cqw', fontWeight: 300 }}
          >
            Skin that glows <i style={{ color: '#b9573b' }}>from within.</i>
          </div>
          <span
            style={{
              display: 'inline-block',
              marginTop: '2.6cqw',
              fontSize: '1.8cqw',
              fontWeight: 600,
              padding: '1cqw 2.8cqw',
              borderRadius: 999,
              color: '#fffaf5',
              background: '#b9573b',
            }}
          >
            Shop bestsellers
          </span>
        </div>
        <div
          style={abs({
            right: '7cqw',
            top: '3.5cqw',
            width: '23cqw',
            height: '33cqw',
            borderRadius: '999px 999px 2cqw 2cqw',
            background: 'linear-gradient(170deg,#f3d5be,#e0a384)',
            overflow: 'hidden',
          })}
        >
          <div
            style={abs({
              left: '50%',
              bottom: '3cqw',
              width: '8cqw',
              height: '17cqw',
              marginLeft: '-4cqw',
              borderRadius: '1.6cqw',
              background: 'linear-gradient(90deg,#fffaf5,#efe3d6)',
              boxShadow: '0 1.4cqw 3cqw rgba(120,60,30,.28)',
            })}
          >
            <div
              style={abs({
                left: '22%',
                right: '22%',
                top: '-3.4cqw',
                height: '4.2cqw',
                borderRadius: '.8cqw .8cqw 0 0',
                background: '#b9573b',
              })}
            />
          </div>
        </div>
      </div>
    </Frame>
  );
}

const SCENES = {
  nova: Nova,
  fynn: Fynn,
  volt: Volt,
  ember: Ember,
  loudly: Loudly,
  halcyon: Halcyon,
  street: Street,
  bloom: Bloom,
};

export default function SiteThumb({ item }) {
  const { thumb, title } = item;

  if (thumb?.image) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-void">
        <img
          src={thumb.image}
          alt={thumb.alt ?? title}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const Scene = SCENES[thumb?.scene];
  return Scene ? <Scene /> : <div className="aspect-[16/10] w-full rounded-xl bg-void" />;
}
