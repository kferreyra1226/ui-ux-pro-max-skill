import type { Metadata } from 'next';
import { BrandImage } from '@/components/ui/BrandImage';
import { ButtonLink } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Section, SectionHeading } from '@/components/site/Section';
import { BRAND, LEGAL, SUPPORT } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About',
  description: 'Foreign Packz is a New York lifestyle brand centered on adult-use cannabis culture and limited streetwear drops.',
};

export default function AboutPage() {
  return (
    <>
      <section className="fp-grain relative isolate overflow-hidden border-b border-ink-line">
        <div className="fp-grid-lines absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="fp-shell relative z-10 py-20 md:py-28">
          <p className="fp-eyebrow mb-5">About</p>
          <h1 className="max-w-4xl text-[clamp(2rem,7vw,4.5rem)] leading-[0.98]">
            Curated locally.
            <br />
            Built for the city.
          </h1>
          <p className="mt-8 max-w-2xl text-[clamp(1rem,3vw,1.25rem)] leading-relaxed text-chrome">
            Foreign Packz is a New York lifestyle brand centered on adult-use cannabis culture,
            intentional product curation, premium local identity, and limited streetwear drops.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <BrandImage seed="about-editorial-01" alt="Foreign Packz editorial photograph" ratio="wide" className="rounded-lg" />
          <div>
            <p className="fp-eyebrow mb-4">Mission</p>
            <h2 className="text-[clamp(1.75rem,5vw,2.5rem)]">A short menu, chosen carefully</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-chrome">
              <p>
                We would rather carry fewer products and know each one than fill a wall with
                names nobody can tell apart. Everything on the menu is inventory we hold
                ourselves, at our approved premises, under our own licence.
              </p>
              <p>
                The apparel side runs the same way. Small runs, produced locally, not restocked
                once a drop closes. Two halves of the same brand, kept deliberately separate
                where the law requires it.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading eyebrow="Responsible adult-use" title="What we commit to" />
        <ul className="grid gap-4 md:grid-cols-2">
          {[
            ['Adults 21 and over only', 'Cannabis pages sit behind an age step, and valid government-issued photo ID is checked before anything is released. The recipient must match the name on the order.'],
            ['No shipping of cannabis', 'Cannabis is never sent by mail or by any carrier. Apparel and non-cannabis accessories are the only shippable items.'],
            ['No claims we cannot stand behind', 'No medical claims, no health claims, no promises about effect or strength. Product information comes from the lot record and lab documentation.'],
            ['Nothing confirmed automatically', 'Every cannabis order is a request that a person reviews. Inventory is checked again before anything is accepted.'],
          ].map(([title, body]) => (
            <li key={title} className="fp-card p-6">
              <h3 className="text-[17px]">{title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-chrome">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section bone className="border-y border-bone-line">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50">Licensed business</p>
            <h2 className="mt-3 text-[clamp(1.75rem,5vw,2.5rem)] text-ink">Compliance information</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
              These details are supplied and verified by the business before launch. They are
              shown as placeholders here and must not be filled in with anything other than the
              company&rsquo;s real, current licence information.
            </p>
          </div>
          <dl className="space-y-4">
            {[
              ['Legal entity', BRAND.legalName],
              ['Licence type', BRAND.licenseType],
              ['Licence number', BRAND.licenseNumber],
              ['Approved premises', BRAND.premises],
              ['Service area', '[SERVICE AREA PLACEHOLDER - approved ZIP codes and boundaries]'],
            ].map(([label, value]) => (
              <div key={label} className="fp-card-bone p-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">{label}</dt>
                <dd className="mt-1.5 text-[15px] text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Community" title="Around the block" />
        <div className="grid gap-4 md:grid-cols-3">
          {['about-community-01', 'about-community-02', 'about-community-03'].map((seed, i) => (
            <BrandImage key={seed} seed={seed} alt={`Foreign Packz community photograph ${i + 1}`} ratio="square" className="rounded-lg" />
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Notice tone="legal" title="Responsible use">{LEGAL.responsibleUse}</Notice>
          <Notice tone="neutral" title="Prototype">{LEGAL.prototypeNotice}</Notice>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="fp-card fp-grid-lines flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-[clamp(1.5rem,5vw,2.25rem)]">Questions about an order?</h2>
            <p className="mt-3 text-[14px] text-chrome">
              {SUPPORT.email} &middot; {SUPPORT.phone} &middot; {SUPPORT.hours}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/support" size="lg">Contact support</ButtonLink>
            <ButtonLink href="/faq" size="lg" variant="secondary">Read the FAQ</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
