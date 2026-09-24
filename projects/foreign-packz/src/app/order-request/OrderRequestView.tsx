'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { DeliveryStatusChip, OrderStatusChip } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { OrderStatusTracker } from '@/components/commerce/OrderStatusTracker';
import { LEGAL, SUPPORT } from '@/lib/config';
import { formatDateTime, formatPrice } from '@/lib/format';
import { getOrderByReference } from '@/lib/mock/orders';

/**
 * Order request confirmation and status.
 *
 * The word "confirmed" never appears as this page's status. A freshly submitted request is
 * always "Order request received - awaiting review" until a human owner accepts it.
 * PRODUCTION: read the real request from the secure database by reference, behind an
 * authenticated or signed link so one customer cannot read another's order. A request
 * reference must never be guessable, and one customer must never be able to read another's
 * order by changing the value in the URL.
 */
export function OrderRequestView() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref') ?? '[REQUEST NUMBER]';
  const fulfillment = searchParams.get('fulfillment') ?? undefined;

  // A reference that matches a mock record renders that record; anything else renders a
  // freshly submitted request, which is what a customer sees right after checkout.
  const existing = getOrderByReference(reference);
  const isDelivery = fulfillment === 'delivery-request' || Boolean(existing?.delivery);

  const status = existing?.status ?? 'request-received';

  // Rendered after mount so the submission time matches the visitor's own clock rather
  // than the moment this page was built.
  const [submittedAt, setSubmittedAt] = useState<string | null>(existing?.submittedAt ?? null);
  useEffect(() => {
    if (!existing) setSubmittedAt(new Date().toISOString());
  }, [existing]);

  return (
    <div className="fp-shell py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="fp-eyebrow mb-4">Order request</p>
        <h1 className="text-[clamp(2rem,7vw,3.25rem)]">
          {isDelivery ? 'Delivery request received' : 'Order request received'}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <OrderStatusChip status={status} />
          {isDelivery ? (
            <DeliveryStatusChip status={existing?.delivery?.status ?? 'awaiting-owner-review'} />
          ) : null}
        </div>

        <dl className="mt-8 grid gap-4 rounded-lg border border-ink-line bg-ink-card p-6 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-chrome-dim">Request number</dt>
            <dd className="mt-1 font-display text-2xl text-bone">{reference}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-chrome-dim">Submitted</dt>
            <dd className="mt-1 text-[15px] text-bone/90">
              {submittedAt ? formatDateTime(submittedAt) : 'Just now'}
            </dd>
          </div>
        </dl>

        <Notice tone="warning" className="mt-6" title="What this status means">
          {isDelivery
            ? 'Delivery request received - awaiting owner review. No delivery time, ETA or driver is assigned, and no inventory is reserved, until the business accepts this request.'
            : 'Order request received - awaiting review. This is not a confirmed, scheduled, paid or fulfilled order.'}
        </Notice>

        <p className="mt-6 text-[15px] leading-relaxed text-chrome">
          We will review inventory, fulfillment availability, and required order details before
          confirming your request.
        </p>

        <Notice tone="legal" className="mt-6" title="Identification">{LEGAL.idReminder}</Notice>

        {/* ------------------------------------------------------------ tracker */}
        <section className="mt-12" aria-labelledby="fp-tracker">
          <h2 id="fp-tracker" className="text-2xl">Status</h2>
          <OrderStatusTracker status={status} className="mt-6" />
        </section>

        {/* ------------------------------------------------------------ summary */}
        {existing ? (
          <section className="mt-12" aria-labelledby="fp-summary">
            <h2 id="fp-summary" className="text-2xl">Order summary</h2>
            <ul className="mt-5 divide-y divide-ink-line border-y border-ink-line">
              {existing.lines.map((line) => (
                <li key={line.productId} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-bone">{line.name}</p>
                    <p className="mt-0.5 text-[13px] text-chrome-dim">
                      {line.brand} &middot; {line.packageSize} &middot; qty {line.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 tabular-nums text-bone/90">
                    {formatPrice(line.unitPriceCents * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 text-[14px]">
              <Row label="Subtotal" value={formatPrice(existing.totals.subtotalCents)} />
              <Row label="Estimated tax (placeholder)" value={formatPrice(existing.totals.estimatedTaxCents)} muted />
              <Row label="Total" value={formatPrice(existing.totals.totalCents)} bold />
            </dl>
          </section>
        ) : (
          <section className="mt-12" aria-labelledby="fp-summary">
            <h2 id="fp-summary" className="text-2xl">Order summary</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-chrome">
              A full itemised summary is emailed to you and appears here once the request is
              persisted to the business system. In this prototype the cart is cleared on
              submission and no request is stored.
            </p>
          </section>
        )}

        {/* ------------------------------------------------- notification placeholders */}
        <section className="mt-12" aria-labelledby="fp-notifications">
          <h2 id="fp-notifications" className="text-2xl">Updates you will receive</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-chrome">
            {/* PRODUCTION INTEGRATION POINT - SMS / email notifications:
                Each row below maps to a consent-tracked transactional message. None is sent
                by this prototype. Cannabis-related messaging requires a confirmed 21+
                recipient and an honoured opt-out. */}
            Each message below is a placeholder until a compliant messaging provider is
            connected. Nothing is sent from this prototype.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Request received', 'Sent immediately after you submit.'],
              ['Request confirmed', 'Sent only after the business accepts the request.'],
              ['Item unavailable or substitution needed', 'Sent if stock changes before acceptance.'],
              ['Additional information required', 'Sent if we need something before we can review.'],
              ['Fulfillment update', 'Sent when the request moves to preparation or handoff.'],
              ['Order completed', 'Sent when the order is complete.'],
            ].map(([title, body]) => (
              <li key={title} className="fp-card p-4">
                <p className="text-[14px] font-semibold text-bone">{title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-chrome-dim">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------------------- support */}
        <div className="mt-12 rounded-lg border border-ink-line bg-ink-card p-6">
          <h2 className="text-xl">Need to change something?</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-chrome">
            Contact support with your request number while the request is still awaiting
            review. Reach us at {SUPPORT.email} or {SUPPORT.phone} during {SUPPORT.hours}.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/support">Contact support</ButtonLink>
            <ButtonLink href="/shop" variant="secondary">Back to the menu</ButtonLink>
          </div>
        </div>

        <p className="mt-8 text-[12px] leading-relaxed text-chrome-dim">
          {LEGAL.prototypeNotice}{' '}
          <Link href="/faq" className="underline transition-colors hover:text-chrome">
            Read the FAQ
          </Link>
          .
        </p>
      </div>
    </div>
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
