import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopFilters } from '@/components/commerce/ShopFilters';
import { AgeRequired } from '@/components/commerce/AgeRequired';
import { Notice } from '@/components/ui/Notice';
import { deliveryMessage } from '@/lib/availability';
import { BRAND, LEGAL } from '@/lib/config';
import { AVAILABILITY } from '@/lib/mock/availability';
import { BRANDS, FORMATS, PUBLIC_PRODUCTS } from '@/lib/mock/products';

export const metadata: Metadata = {
  title: 'Shop 21+ Menu',
  description: 'The current Foreign Packz adult-use menu. Live stock status on every item.',
};

/**
 * Cannabis menu.
 *
 * The 21+ gate is enforced by AgeRequired below, which renders nothing until the visitor
 * has confirmed. PRODUCTION: also gate this route in middleware so cannabis markup is
 * never sent to an unconfirmed client, and read stock from the live inventory system.
 *
 * The category and sort deep links (?category=flower, ?sort=newest) are read inside
 * ShopFilters with useSearchParams, so this page stays a static document with no server
 * render per request.
 */
export default function ShopPage() {
  return (
    <div className="fp-shell py-10 md:py-16">
      <header className="mb-8 max-w-3xl">
        <p className="fp-eyebrow mb-3">{LEGAL.licensedBadge}</p>
        <h1 className="text-[clamp(2.25rem,8vw,4rem)]">The Menu</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-chrome">
          Everything here is the business&rsquo;s own licensed inventory, held at its approved
          New York premises. Stock is live and is re-checked again before any request is
          accepted.
        </p>
      </header>

      {/* Compact on a phone so products are reachable without a long scroll.
          The full fulfillment wording sits below the grid and in the footer. */}
      <div className="mb-8 flex flex-col gap-2 rounded-sm border border-emerald/40 bg-emerald/10 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7FD8B6]">
          Never shipped
        </p>
        <p className="text-[13px] leading-snug text-bone/85">
          Cannabis is pickup or approved delivery only. {deliveryMessage(AVAILABILITY)}
        </p>
      </div>

      <AgeRequired
        title={`This menu is for adults ${BRAND.minimumAge}+`}
        body="Confirm your age to view cannabis products. Accessories and apparel are available without age confirmation."
      >
        <Suspense fallback={<div className="fp-card grid min-h-[280px] place-items-center p-10 text-[13px] uppercase tracking-[0.16em] text-chrome-dim">Loading menu&hellip;</div>}>
          <ShopFilters products={PUBLIC_PRODUCTS} brands={[...BRANDS]} formats={[...FORMATS]} />
        </Suspense>
      </AgeRequired>

      <div className="mt-12 grid gap-3 md:grid-cols-2">
        <Notice tone="legal" title="Fulfillment">{LEGAL.noShipping}</Notice>
        <Notice tone="neutral" title="Prototype">{LEGAL.prototypeNotice}</Notice>
      </div>
    </div>
  );
}
