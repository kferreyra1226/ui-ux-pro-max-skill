import Link from 'next/link';
import { BrandImage } from '@/components/ui/BrandImage';
import { ButtonLink } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { ProductCard } from '@/components/commerce/ProductCard';
import { Newsletter } from '@/components/site/Newsletter';
import { Section, SectionHeading } from '@/components/site/Section';
import { deliveryMessage } from '@/lib/availability';
import { BRAND, LEGAL } from '@/lib/config';
import { CATEGORIES } from '@/lib/mock/catalog';
import { FAQ_ITEMS } from '@/lib/mock/content';
import { PUBLIC_PRODUCTS } from '@/lib/mock/products';
import { AVAILABILITY } from '@/lib/mock/availability';

const POPULAR = PUBLIC_PRODUCTS.filter((p) => p.featured);
const NEW_IN = PUBLIC_PRODUCTS.filter((p) => p.isNew);

const WHY = [
  { title: 'Licensed inventory', body: 'Everything on the menu is the business’s own inventory, held at its approved New York premises.' },
  { title: 'Curated selection', body: 'A short list, chosen deliberately. We would rather carry fewer products and know each one.' },
  { title: 'Live availability', body: 'Stock status on every card and product page, re-checked again before a request is accepted.' },
  { title: 'Adult-only service', body: 'Cannabis pages sit behind a 21+ step, and ID is checked before anything is released.' },
  { title: 'Local identity', body: 'Built in New York, for the city. Apparel drops and product curation come from the same room.' },
];

const HOW = [
  { step: '01', title: 'Browse the 21+ menu', body: 'Confirm your age, then see what is actually in stock right now.' },
  { step: '02', title: 'Build your order request', body: 'Add what you want and submit it as a request. Nothing is confirmed yet.' },
  { step: '03', title: 'Receive confirmation after order review', body: 'We check inventory and details, then confirm or tell you what changed.' },
  { step: '04', title: 'Complete age and identity verification', body: 'Valid government-issued photo ID is required before anything is handed over.' },
];

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------------ hero */}
      <section className="fp-grain relative isolate overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          {/* Editorial background placeholder. PRODUCTION: swap for an owner-supplied
              campaign photograph or a muted looping video with a poster frame. */}
          <BrandImage seed="hero-campaign" alt="" ratio="hero" className="h-full w-full [&>*]:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25 md:bg-gradient-to-r md:from-ink md:via-ink/70 md:to-ink/10" />
        </div>

        <div className="fp-shell relative z-10 flex min-h-[86vh] flex-col justify-end pb-16 pt-24 md:min-h-[78vh] md:pb-24">
          <p className="fp-eyebrow mb-5">{LEGAL.licensedBadge}</p>
          <h1 className="text-[clamp(2.75rem,13.5vw,8rem)] leading-[0.94]">
            FOREIGN
            <br />
            PACKZ
          </h1>
          <p className="mt-6 max-w-xl text-[clamp(1rem,3.6vw,1.375rem)] leading-snug text-bone/90">
            Premium adult-use cannabis. Limited streetwear drops.
          </p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-chrome">
            Curated cannabis products, premium accessories, and New York-inspired apparel for
            adults {BRAND.minimumAge}+.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/shop" size="lg" className="sm:min-w-[220px]">
              Shop 21+ Menu
            </ButtonLink>
            <ButtonLink href="/apparel" size="lg" variant="secondary" className="sm:min-w-[220px]">
              Explore Apparel
            </ButtonLink>
          </div>

          <p className="mt-8 max-w-xl text-[12px] leading-relaxed text-chrome-dim">
            {deliveryMessage(AVAILABILITY)} {LEGAL.noShipping}
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- shop by category */}
      <Section>
        <SectionHeading
          eyebrow="Shop by category"
          title="Pick your lane"
          description="Cannabis categories require age confirmation. Accessories and apparel do not."
          action={{ href: '/shop', label: 'View full menu' }}
        />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={cat.slug === 'apparel' ? '/apparel' : `/shop?category=${cat.slug}`}
                className="group fp-card block overflow-hidden transition-transform duration-300 ease-fp hover:-translate-y-1 hover:shadow-lift"
              >
                <BrandImage
                  seed={cat.seed}
                  alt=""
                  ratio="square"
                  caption={cat.ageRestricted ? '21+' : undefined}
                  className="transition-transform duration-500 ease-fp group-hover:scale-[1.04]"
                />
                <div className="p-4">
                  <h3 className="text-[15px]">{cat.label}</h3>
                  <p className="mt-1 text-[12px] leading-snug text-chrome-dim">{cat.blurb}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------------ popular rail */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Popular right now"
          title="Moving fast"
          description="Live stock status. What sells out is gone until the next lot is received and logged."
          action={{ href: '/shop', label: 'Shop all' }}
        />
        <div className="fp-rail -mx-[var(--fp-gutter)] px-[var(--fp-gutter)]" role="region" aria-label="Popular products">
          {POPULAR.map((p) => (
            <div key={p.id} className="w-[72vw] shrink-0 sm:w-[300px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------------------- new in */}
      <Section className="pt-0">
        <SectionHeading eyebrow="New in" title="Just landed" action={{ href: '/shop?sort=newest', label: 'See newest' }} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {NEW_IN.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------- apparel editorial */}
      <section className="relative isolate overflow-hidden border-y border-ink-line">
        <div className="grid md:grid-cols-2">
          <BrandImage seed="apparel-drop-editorial" alt="Foreign Packz apparel campaign" ratio="wide" className="h-full min-h-[320px] md:min-h-[520px]" />
          <div className="fp-grid-lines flex flex-col justify-center gap-6 bg-ink-soft px-[var(--fp-gutter)] py-14 md:px-14 md:py-20">
            <p className="fp-eyebrow">Limited drop</p>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)]">
              Foreign Packz
              <br />
              Apparel
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-chrome">
              Heavyweight cotton, embroidered monograms, and a grid motif pulled from the city
              itself. Produced in small runs and not restocked once a drop closes.
            </p>
            <p className="text-[12px] uppercase tracking-[0.14em] text-chrome-dim">
              Apparel shipping only &mdash; cannabis products are never shipped.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/apparel" size="lg" variant="bone">Shop the drop</ButtonLink>
              <ButtonLink href="/apparel#lookbook" size="lg" variant="secondary">View lookbook</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- why foreign packz */}
      <Section>
        <SectionHeading eyebrow="Why Foreign Packz" title="How we operate" />
        <ul className="grid gap-4 md:grid-cols-3">
          {WHY.map((item, index) => (
            <li key={item.title} className="fp-card flex flex-col gap-3 p-6">
              <span className="font-display text-3xl text-emerald-soft" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-[17px]">{item.title}</h3>
              <p className="text-[14px] leading-relaxed text-chrome">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------------ how it works */}
      <Section bone className="border-y border-bone-line">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50">How it works</p>
          <h2 className="mt-3 text-[clamp(1.75rem,5.5vw,2.75rem)] text-ink">
            Request, review, then release
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
            Cannabis orders are requests. Nothing is confirmed automatically.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-4">
          {HOW.map((item) => (
            <li key={item.step} className="fp-card-bone flex flex-col gap-3 p-6">
              <span className="font-display text-3xl text-emerald" aria-hidden="true">{item.step}</span>
              <h3 className="text-[16px] text-ink">{item.title}</h3>
              <p className="text-[14px] leading-relaxed text-ink/70">{item.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-ink/60">
          {LEGAL.orderReviewNotice}
        </p>
      </Section>

      {/* -------------------------------------------------------------- faq preview */}
      <Section>
        <SectionHeading
          eyebrow="Questions"
          title="Before you order"
          action={{ href: '/faq', label: 'All questions' }}
        />
        <div className="divide-y divide-ink-line border-y border-ink-line">
          {FAQ_ITEMS.slice(0, 4).map((item) => (
            <details key={item.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-bone">
                {item.question}
                <span aria-hidden="true" className="shrink-0 text-chrome transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-chrome">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- newsletter */}
      <Section className="pt-0">
        <div className="fp-card fp-grid-lines p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <p className="fp-eyebrow mb-3">Stay on the list</p>
              <h2 className="text-[clamp(1.5rem,5vw,2.25rem)]">Drops, restocks, and menu updates</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-chrome">
                Two lists, kept separate. Cannabis-related messages go only to adults {BRAND.minimumAge}+
                who opt in explicitly.
              </p>
            </div>
            <Newsletter variant="cannabis" />
          </div>
        </div>
        <Notice tone="neutral" className="mt-6">
          {LEGAL.prototypeNotice}
        </Notice>
      </Section>
    </>
  );
}
