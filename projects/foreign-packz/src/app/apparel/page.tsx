import type { Metadata } from 'next';
import { BrandImage } from '@/components/ui/BrandImage';
import { ButtonLink } from '@/components/ui/Button';
import { TagBadge } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { ProductCard } from '@/components/commerce/ProductCard';
import { Newsletter } from '@/components/site/Newsletter';
import { Section, SectionHeading } from '@/components/site/Section';
import { PUBLIC_PRODUCTS } from '@/lib/mock/products';
import { DROP_CALENDAR } from '@/lib/mock/availability';

export const metadata: Metadata = {
  title: 'Apparel',
  description: 'Foreign Packz limited streetwear drops. Apparel shipping only.',
};

const APPAREL = PUBLIC_PRODUCTS.filter((p) => p.productClass === 'apparel');

const APPAREL_CATEGORIES = [
  { label: 'Graphic tees', match: 'Graphic tee' },
  { label: 'Hoodies', match: 'Hoodie' },
  { label: 'Hats', match: 'Cap' },
  { label: 'Bags & accessories', match: 'Bag' },
];

const LOOKBOOK = [
  'campaign-street-01', 'campaign-street-02', 'campaign-lookbook-03',
  'campaign-lookbook-04', 'campaign-lookbook-05', 'campaign-lookbook-06',
];

/**
 * Apparel storefront.
 * No age gate: apparel carries no cannabis content. This is also the only part of the
 * business where shipping is offered, and that is stated on every surface.
 */
export default function ApparelPage() {
  return (
    <>
      {/* ------------------------------------------------------- editorial banner */}
      <section className="fp-grain relative isolate overflow-hidden border-b border-ink-line">
        <div className="absolute inset-0" aria-hidden="true">
          <BrandImage seed="apparel-banner" alt="" ratio="hero" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        </div>
        <div className="fp-shell relative z-10 flex min-h-[60vh] flex-col justify-end pb-14 pt-24">
          <p className="fp-eyebrow mb-4">Drop 03 &mdash; available now</p>
          <h1 className="text-[clamp(2.25rem,10vw,5.5rem)] leading-[0.94]">
            Foreign Packz
            <br />
            Limited Drop
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-chrome">
            Small runs, produced locally. Once a drop closes it is not restocked.
          </p>
          <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.16em] text-acid">
            Apparel shipping only &mdash; cannabis products are never shipped.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- categories */}
      <Section>
        <SectionHeading eyebrow="Categories" title="The range" />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {APPAREL_CATEGORIES.map((cat) => (
            <li key={cat.label} className="fp-card overflow-hidden">
              <BrandImage seed={`apparel-${cat.match}`} alt="" ratio="square" />
              <div className="p-4">
                <h3 className="text-[15px]">{cat.label}</h3>
                <p className="mt-1 text-[12px] text-chrome-dim">
                  {APPAREL.filter((p) => p.format === cat.match).length} in this drop
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ----------------------------------------------------------------- products */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Shop the drop" title="In the drop now" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {APPAREL.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <Notice tone="legal" className="mt-8" title="Shipping and fulfillment">
          Apparel and non-cannabis accessories are the only items eligible for shipping.
          Cannabis products are never shipped by mail or by any carrier. Apparel orders ship
          within [APPAREL FULFILLMENT WINDOW]. Return terms are at [APPAREL RETURN POLICY PLACEHOLDER].
        </Notice>
      </Section>

      {/* ------------------------------------------------------------ drop calendar */}
      <Section bone className="border-y border-bone-line">
        <div className="mb-10 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50">Drop calendar</p>
          <h2 className="mt-3 text-[clamp(1.75rem,5.5vw,2.75rem)] text-ink">What is coming</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
            Release windows are confirmed by the business before each drop. Dates shown as
            placeholders are not yet set.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {DROP_CALENDAR.map((drop) => (
            <li key={drop.id} className="fp-card-bone flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50">
                  {drop.window}
                </span>
                <span
                  className={`rounded-xs border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                    drop.status === 'sold-out'
                      ? 'border-ink/20 text-ink/40'
                      : 'border-emerald/50 bg-emerald/10 text-emerald'
                  }`}
                >
                  {drop.status === 'coming-soon' ? 'Coming soon' : drop.status === 'sold-out' ? 'Sold out' : 'Announced'}
                </span>
              </div>
              <h3 className="text-[18px] text-ink">{drop.name}</h3>
              <p className="text-[14px] leading-relaxed text-ink/70">{drop.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------------------- lookbook */}
      <Section id="lookbook">
        <SectionHeading
          eyebrow="Campaign"
          title="Lookbook"
          description="Campaign photography placeholders. Final imagery is supplied by the business and must be rights-cleared before publication."
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {LOOKBOOK.map((seed, i) => (
            <BrandImage
              key={seed}
              seed={seed}
              alt={`Foreign Packz campaign image ${i + 1}`}
              ratio={i % 3 === 0 ? 'portrait' : 'square'}
              className="rounded-lg"
            />
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- drop list */}
      <Section className="pt-0">
        <div className="fp-card fp-grid-lines p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <TagBadge tone="acid" className="mb-4">Drop list</TagBadge>
              <h2 className="text-[clamp(1.5rem,5vw,2.25rem)]">Know when the next drop opens</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-chrome">
                Apparel announcements only. This list never receives cannabis-related messages.
              </p>
              <ButtonLink href="/faq" variant="ghost" size="sm" className="mt-4 px-0">
                Apparel FAQ
              </ButtonLink>
            </div>
            <Newsletter variant="apparel" />
          </div>
        </div>
      </Section>
    </>
  );
}
