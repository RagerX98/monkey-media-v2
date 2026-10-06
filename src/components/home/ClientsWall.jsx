import Marquee from '../motion/Marquee';
import SectionHead from '../SectionHead';
import { clients } from '../../data/clients';

function Tile({ client }) {
  return (
    <figure className="group mx-2.5 w-[200px] shrink-0 md:mx-3 md:w-[260px]">
      <div className="overflow-hidden rounded-2xl shadow-[0_14px_30px_-12px_rgba(13,13,13,0.45)] ring-1 ring-ink/10 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5 group-hover:-rotate-2">
        <picture>
          <source srcSet={client.logoWebp} type="image/webp" />
          <img
            src={client.logo}
            alt={client.name}
            className="aspect-[2/1] w-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </picture>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-2 px-1">
        <span className="text-sm font-extrabold uppercase tracking-wide text-ink">{client.name}</span>
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-ink/55">
          {client.category}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * The client wall on a gold field: two rows of brand tiles drifting in
 * opposite directions, both reacting to scroll speed and direction.
 */
export default function ClientsWall({ index = '04', title = "Brands we've gone\nbananas for." }) {
  const half = Math.ceil(clients.length / 2);
  const rowA = clients.slice(0, half);
  const rowB = clients.slice(half);

  return (
    <section className="relative overflow-hidden bg-gold py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionHead
          tone="gold"
          index={index}
          label="Clients"
          title={title}
          accent={{ bananas: 'text-purple' }}
          aside={
            <p className="text-ink/75">
              From global names to fast-growing D2C labels. Whether we built with them or for them,
              we know what it takes to move fast and win.
            </p>
          }
        />
      </div>

      <div className="mt-14 flex flex-col gap-8 md:mt-20">
        <Marquee speed={40} copies={3}>
          {rowA.map((c) => (
            <Tile key={c.name} client={c} />
          ))}
        </Marquee>
        <Marquee speed={40} copies={3} reverse>
          {rowB.map((c) => (
            <Tile key={c.name} client={c} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
