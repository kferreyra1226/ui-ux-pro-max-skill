'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { BrandImage } from '@/components/ui/BrandImage';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { useCart } from '@/context/CartContext';
import { cartKind, isCannabis } from '@/lib/cart';
import { LEGAL } from '@/lib/config';
import { formatPrice } from '@/lib/format';
import type { CartLine } from '@/lib/types';

/** Slide-out cart. Cannabis and shippable lines are always shown as separate groups. */
export function CartDrawer() {
  const { lines, drawerOpen, closeDrawer, setQuantity, removeItem, totals } = useCart();
  const kind = cartKind(lines);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDrawer();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  const cannabisLines = lines.filter(isCannabis);
  const retailLines = lines.filter((l) => !isCannabis(l));

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeDrawer}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm animate-fade"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 flex h-[100dvh] w-full max-w-md flex-col border-l border-ink-line bg-ink animate-slide-in"
      >
        <div className="flex items-center justify-between border-b border-ink-line px-5 py-4">
          <h2 className="text-lg">Your Cart</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="grid h-11 w-11 place-items-center rounded-sm text-chrome transition-colors hover:bg-bone/5 hover:text-bone"
          >
            <span aria-hidden="true" className="text-lg">&times;</span>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-chrome">Your cart is empty.</p>
            <ButtonLink href="/shop" onClick={closeDrawer} variant="secondary">
              Shop 21+ Menu
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {cannabisLines.length > 0 ? (
                <CartGroup
                  title="Cannabis - 21+"
                  note="Pickup or approved delivery only. Never shipped."
                  lines={cannabisLines}
                  onQuantity={setQuantity}
                  onRemove={removeItem}
                />
              ) : null}

              {retailLines.length > 0 ? (
                <CartGroup
                  title="Apparel & accessories"
                  note="Eligible for shipping."
                  lines={retailLines}
                  onQuantity={setQuantity}
                  onRemove={removeItem}
                  className={cannabisLines.length > 0 ? 'mt-8' : undefined}
                />
              ) : null}

              {kind === 'cannabis-only' || kind === 'mixed' ? (
                <Notice tone="legal" title="Cannabis fulfillment" className="mt-6">
                  {LEGAL.cartCannabisNotice}
                </Notice>
              ) : null}
              {kind === 'mixed' ? (
                <Notice tone="warning" title="Separate fulfillment" className="mt-3">
                  {LEGAL.mixedCartNotice}
                </Notice>
              ) : null}
            </div>

            <div className="border-t border-ink-line px-5 py-5">
              <dl className="space-y-2 text-[14px]">
                <Row label="Subtotal" value={formatPrice(totals.subtotalCents)} />
                <Row label="Estimated tax (placeholder)" value={formatPrice(totals.estimatedTaxCents)} muted />
                <div className="fp-chrome-rule my-3" aria-hidden="true" />
                <Row label="Total" value={formatPrice(totals.totalCents)} bold />
              </dl>
              <p className="mt-2 text-[11px] leading-relaxed text-chrome-dim">
                Tax is a placeholder value. Final amounts are calculated by a connected tax
                system after business review.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <ButtonLink
                  href="/checkout"
                  onClick={closeDrawer}
                  fullWidth
                  size="lg"
                >
                  {kind === 'retail-only' ? 'Continue to Checkout' : 'Continue to Order Request'}
                </ButtonLink>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="py-2 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-chrome transition-colors hover:text-bone"
                >
                  View full cart
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function CartGroup({
  title, note, lines, onQuantity, onRemove, className,
}: {
  title: string;
  note: string;
  lines: CartLine[];
  onQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}) {
  return (
    <section className={className} aria-label={title}>
      <div className="mb-3">
        <p className="fp-eyebrow">{title}</p>
        <p className="mt-1 text-[12px] text-chrome-dim">{note}</p>
      </div>
      <ul className="space-y-4">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-3">
            <BrandImage
              seed={line.placeholderSeed}
              alt=""
              ratio="square"
              className="h-20 w-20 shrink-0 rounded-sm"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-bone">{line.name}</p>
                  <p className="text-[12px] text-chrome-dim">
                    {line.brand} &middot; {line.packageSize}
                  </p>
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
              <div className="flex items-center justify-between gap-2">
                <QuantityStepper
                  value={line.quantity}
                  max={Math.max(1, line.stockAtAdd)}
                  onChange={(q) => onQuantity(line.productId, q)}
                  label={`quantity for ${line.name}`}
                />
                <span className="text-[14px] font-semibold tabular-nums text-bone">
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
      <dd className={bold ? 'font-display text-xl text-bone' : 'tabular-nums text-bone/90'}>{value}</dd>
    </div>
  );
}
