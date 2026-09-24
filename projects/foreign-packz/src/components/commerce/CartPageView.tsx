'use client';

import { BrandImage } from '@/components/ui/BrandImage';
import { ButtonLink, Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { useCart } from '@/context/CartContext';
import { cartKind, isCannabis, shippingAllowed } from '@/lib/cart';
import { deliveryMessage } from '@/lib/availability';
import { LEGAL } from '@/lib/config';
import { formatPrice } from '@/lib/format';
import { AVAILABILITY } from '@/lib/mock/availability';
import type { CartLine } from '@/lib/types';

/** Full cart page. Mirrors the drawer but with room for the fulfilment explanation. */
export function CartPageView() {
  const { lines, setQuantity, removeItem, totals, clear } = useCart();
  const kind = cartKind(lines);
  const canShip = shippingAllowed(lines);
  const cannabisLines = lines.filter(isCannabis);
  const retailLines = lines.filter((l) => !isCannabis(l));

  return (
    <div className="fp-shell py-10 md:py-16">
      <h1 className="text-[clamp(2rem,7vw,3.5rem)]">Your Cart</h1>

      {lines.length === 0 ? (
        <div className="fp-card mt-8 p-10 text-center md:p-16">
          <p className="text-[15px] text-chrome">Your cart is empty.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/shop">Shop 21+ Menu</ButtonLink>
            <ButtonLink href="/apparel" variant="secondary">Explore Apparel</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div>
            {cannabisLines.length > 0 ? (
              <CartSection
                title="Cannabis"
                subtitle="21+ only. Pickup or approved delivery. Never shipped."
                lines={cannabisLines}
                onQuantity={setQuantity}
                onRemove={removeItem}
              />
            ) : null}

            {retailLines.length > 0 ? (
              <CartSection
                title="Apparel & accessories"
                subtitle="Eligible for shipping."
                lines={retailLines}
                onQuantity={setQuantity}
                onRemove={removeItem}
                className={cannabisLines.length > 0 ? 'mt-10' : undefined}
              />
            ) : null}

            <div className="mt-6">
              <Button variant="ghost" size="sm" onClick={clear} className="px-0">
                Empty cart
              </Button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="fp-card p-6">
              <h2 className="text-xl">Summary</h2>
              <dl className="mt-5 space-y-3 text-[14px]">
                {cannabisLines.length > 0 ? (
                  <Row label="Cannabis subtotal" value={formatPrice(totals.cannabisSubtotalCents)} />
                ) : null}
                {retailLines.length > 0 ? (
                  <Row label="Apparel & accessories subtotal" value={formatPrice(totals.retailSubtotalCents)} />
                ) : null}
                <Row label="Subtotal" value={formatPrice(totals.subtotalCents)} />
                <Row label="Estimated tax (placeholder)" value={formatPrice(totals.estimatedTaxCents)} muted />
                <div className="fp-chrome-rule my-2" aria-hidden="true" />
                <Row label="Total" value={formatPrice(totals.totalCents)} bold />
              </dl>
              <p className="mt-3 text-[12px] leading-relaxed text-chrome-dim">
                Tax shown is a placeholder. A connected tax system calculates the final amount,
                including any applicable New York cannabis excise tax.
              </p>

              <ButtonLink href="/checkout" size="lg" fullWidth className="mt-6">
                {canShip ? 'Continue to Checkout' : 'Continue to Order Request'}
              </ButtonLink>

              <p className="mt-3 text-center text-[12px] text-chrome-dim">
                {canShip
                  ? 'Apparel-only orders continue to a standard checkout.'
                  : 'Cannabis orders continue as a request that the business reviews.'}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {kind === 'cannabis-only' || kind === 'mixed' ? (
                <Notice tone="legal" title="Cannabis fulfillment">{LEGAL.cartCannabisNotice}</Notice>
              ) : null}
              {kind === 'mixed' ? (
                <Notice tone="warning" title="Two fulfillment methods">{LEGAL.mixedCartNotice}</Notice>
              ) : null}
              {kind === 'retail-only' ? (
                <Notice tone="neutral" title="Shipping">
                  This cart contains no cannabis, so standard apparel shipping applies.
                </Notice>
              ) : null}
              <Notice tone="neutral" title="Delivery status">{deliveryMessage(AVAILABILITY)}</Notice>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function CartSection({
  title, subtitle, lines, onQuantity, onRemove, className,
}: {
  title: string;
  subtitle: string;
  lines: CartLine[];
  onQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}) {
  return (
    <section className={className} aria-label={title}>
      <div className="mb-4 border-b border-ink-line pb-3">
        <h2 className="text-xl">{title}</h2>
        <p className="mt-1 text-[13px] text-chrome-dim">{subtitle}</p>
      </div>
      <ul className="divide-y divide-ink-line">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-4 py-5">
            <BrandImage seed={line.placeholderSeed} alt="" ratio="square" className="h-24 w-24 shrink-0 rounded-sm sm:h-28 sm:w-28" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-bone">{line.name}</p>
                  <p className="mt-0.5 text-[13px] text-chrome-dim">{line.brand} &middot; {line.packageSize}</p>
                  <p className="mt-1 text-[13px] text-chrome">{formatPrice(line.unitPriceCents)} each</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(line.productId)}
                  className="shrink-0 text-[12px] uppercase tracking-[0.1em] text-chrome-dim transition-colors hover:text-danger"
                  aria-label={`Remove ${line.name} from cart`}
                >
                  Remove
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <QuantityStepper
                  value={line.quantity}
                  max={Math.max(1, line.stockAtAdd)}
                  onChange={(q) => onQuantity(line.productId, q)}
                  label={`quantity for ${line.name}`}
                />
                <span className="font-display text-lg tabular-nums text-bone">
                  {formatPrice(line.unitPriceCents * line.quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={muted ? 'text-chrome-dim' : 'text-chrome'}>{label}</dt>
      <dd className={bold ? 'font-display text-2xl text-bone' : 'tabular-nums text-bone/90'}>{value}</dd>
    </div>
  );
}
