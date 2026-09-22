'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { CheckboxField, SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { useCart } from '@/context/CartContext';
import { cartKind, generateReference, isCannabis, shippingAllowed } from '@/lib/cart';
import { atCapacity, deliveryMessage, deliveryRequestsOpen, nextOpening } from '@/lib/availability';
import { LEGAL } from '@/lib/config';
import { cx, formatPrice } from '@/lib/format';
import { AVAILABILITY, DELIVERY_ZONES } from '@/lib/mock/availability';

/**
 * Multi-step order request flow.
 *
 * NOTHING HERE CONFIRMS AN ORDER.
 * - No payment is processed, authorised or stored. Step 4 is a visual placeholder only.
 * - No cannabis inventory is deducted or reserved on submit. Deduction happens only after
 *   a human owner accepts the request in the admin dashboard.
 * - No ETA, delivery time or driver is promised before that acceptance.
 *
 * PRODUCTION INTEGRATION POINTS on this screen:
 * - Age & identity verification: a vendor check must run server-side before submission.
 * - Live inventory: re-validate every line against the POS at submit and again at acceptance.
 * - Tax: replace the placeholder rate with the connected tax engine.
 * - Payment provider: a cannabis-compliant processor, wired server-side, never in the client.
 * - Transactional order handling: persist the request in a secure database with an audit row.
 */

type FulfillmentChoice = 'delivery-request' | 'pickup-request' | 'shipping';

const STEPS = ['Your details', 'Fulfillment', 'Order review', 'Payment', 'Submit'] as const;

const DELIVERY_WINDOWS = [
  'Today, 6:00 PM - 8:00 PM',
  'Today, 8:00 PM - 10:00 PM',
  'Tomorrow, 6:00 PM - 8:00 PM',
  'Tomorrow, 8:00 PM - 10:00 PM',
];

interface FormState {
  firstName: string; lastName: string; email: string; phone: string; dob: string;
  ageConfirmed: boolean; idAcknowledged: boolean;
  fulfillment: FulfillmentChoice;
  addressLine1: string; addressLine2: string; city: string; zip: string;
  preferredWindow: string; notes: string;
}

const EMPTY: FormState = {
  firstName: '', lastName: '', email: '', phone: '', dob: '',
  ageConfirmed: false, idAcknowledged: false,
  fulfillment: 'delivery-request',
  addressLine1: '', addressLine2: '', city: '', zip: '',
  preferredWindow: DELIVERY_WINDOWS[0], notes: '',
};

export function CheckoutFlow() {
  const router = useRouter();
  const { lines, totals, clear } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const kind = cartKind(lines);
  const canShip = shippingAllowed(lines);
  const hasCannabis = kind === 'cannabis-only' || kind === 'mixed';
  const deliveryOpen = deliveryRequestsOpen(AVAILABILITY);
  const servedZips = useMemo(
    () => new Set(DELIVERY_ZONES.filter((z) => z.active).flatMap((z) => z.zips)),
    [],
  );
  const zipInZone = form.zip.length === 5 ? servedZips.has(form.zip) : null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateDetails(): boolean {
    const next: typeof errors = {};
    if (!form.firstName.trim()) next.firstName = 'Enter your first name.';
    if (!form.lastName.trim()) next.lastName = 'Enter your last name.';
    if (!form.email.trim()) next.email = 'Enter an email address.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Enter a mobile number we can reach you on.';
    if (hasCannabis) {
      if (!form.dob.trim()) next.dob = 'Enter your date of birth.';
      if (!form.ageConfirmed) next.ageConfirmed = 'You must confirm you are 21 or older.';
      if (!form.idAcknowledged) next.idAcknowledged = 'You must acknowledge the ID requirement.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateFulfillment(): boolean {
    const next: typeof errors = {};
    if (form.fulfillment === 'delivery-request') {
      if (!form.addressLine1.trim()) next.addressLine1 = 'Enter a street address.';
      if (!form.city.trim()) next.city = 'Enter a city.';
      if (!/^\d{5}$/.test(form.zip)) next.zip = 'Enter a 5-digit ZIP code.';
      else if (!servedZips.has(form.zip)) next.zip = 'This ZIP code is outside the approved service area. Choose pickup instead.';
      if (!form.preferredWindow) next.preferredWindow = 'Choose a preferred window.';
    }
    if (form.fulfillment === 'shipping' && !canShip) {
      next.fulfillment = 'Cannabis products cannot be shipped. Choose pickup or a delivery request.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function next() {
    if (step === 0 && !validateDetails()) return;
    if (step === 1 && !validateFulfillment()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    // PRODUCTION: this posts to a server action that re-validates age, re-checks live
    // inventory, persists the request and writes an audit row. It never confirms anything.
    const reference = generateReference();
    clear();
    router.push(`/order-request?ref=${encodeURIComponent(reference)}&fulfillment=${form.fulfillment}`);
  }

  if (lines.length === 0 && step < STEPS.length) {
    return (
      <div className="fp-shell py-16 text-center md:py-24">
        <h1 className="text-[clamp(2rem,7vw,3rem)]">Nothing to request</h1>
        <p className="mt-4 text-[15px] text-chrome">Your cart is empty.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/shop">Shop 21+ Menu</ButtonLink>
          <ButtonLink href="/apparel" variant="secondary">Explore Apparel</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-shell py-10 md:py-16">
      <h1 className="text-[clamp(2rem,7vw,3.5rem)]">
        {canShip ? 'Checkout' : 'Order Request'}
      </h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-chrome">
        {canShip
          ? 'Apparel and accessories only. This cart contains no cannabis, so standard shipping applies.'
          : 'Cannabis orders are submitted as requests. Nothing is confirmed, scheduled or charged until the business reviews and accepts your request.'}
      </p>

      {/* Step indicator */}
      <ol className="fp-rail mt-8 gap-2" aria-label="Checkout progress">
        {STEPS.map((label, i) => (
          <li key={label} className="shrink-0">
            <span
              aria-current={i === step ? 'step' : undefined}
              className={cx(
                'flex min-h-[40px] items-center gap-2 rounded-sm border px-3 text-[12px] font-semibold uppercase tracking-[0.1em]',
                i === step && 'border-bone bg-bone text-ink',
                i < step && 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
                i > step && 'border-ink-line text-chrome-dim',
              )}
            >
              <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        <form onSubmit={submit} noValidate>
          {/* ------------------------------------------------- 1. customer details */}
          {step === 0 ? (
            <section aria-labelledby="fp-step-1" className="space-y-6">
              <h2 id="fp-step-1" className="text-2xl">Your details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="First name" required autoComplete="given-name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} error={errors.firstName} />
                <TextField label="Last name" required autoComplete="family-name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} error={errors.lastName} />
              </div>
              <TextField label="Email" type="email" required autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
              <TextField label="Mobile number" type="tel" required autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone} hint="Used only to reach you about this request." />

              {hasCannabis ? (
                <>
                  <TextField
                    label="Date of birth"
                    type="date"
                    required
                    value={form.dob}
                    onChange={(e) => update('dob', e.target.value)}
                    error={errors.dob}
                    hint="Placeholder field. In production this is checked by a compliant age and identity verification service, not by this form."
                  />
                  <div className="space-y-4 rounded-sm border border-ink-line bg-ink-soft p-5">
                    <CheckboxField
                      label={`I confirm I am 21 years of age or older.`}
                      checked={form.ageConfirmed}
                      onChange={(e) => update('ageConfirmed', e.target.checked)}
                      error={errors.ageConfirmed}
                    />
                    <CheckboxField
                      label={LEGAL.checkoutAcknowledgement}
                      checked={form.idAcknowledged}
                      onChange={(e) => update('idAcknowledged', e.target.checked)}
                      error={errors.idAcknowledged}
                    />
                  </div>
                  <Notice tone="neutral" title="Age verification">
                    Checking these boxes is a declaration, not verification. A compliant age and
                    identity verification service must confirm your details before any cannabis
                    product is released, and valid government-issued photo ID is checked in person.
                  </Notice>
                </>
              ) : null}
            </section>
          ) : null}

          {/* ---------------------------------------------------- 2. fulfillment */}
          {step === 1 ? (
            <section aria-labelledby="fp-step-2" className="space-y-6">
              <h2 id="fp-step-2" className="text-2xl">Fulfillment</h2>

              <Notice tone="legal" title="How cannabis fulfillment works">
                {LEGAL.deliveryPreSubmitNotice} {LEGAL.noShipping}
              </Notice>

              <fieldset className="space-y-3">
                <legend className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-chrome">
                  Choose a fulfillment request
                </legend>

                {hasCannabis ? (
                  <>
                    <FulfillmentOption
                      id="ff-delivery"
                      checked={form.fulfillment === 'delivery-request'}
                      onChange={() => update('fulfillment', 'delivery-request')}
                      disabled={!deliveryOpen}
                      title="Request delivery"
                      body={
                        deliveryOpen
                          ? deliveryMessage(AVAILABILITY)
                          : `${deliveryMessage(AVAILABILITY)} Next opening: ${nextOpening('delivery-requests')}.`
                      }
                    />
                    <FulfillmentOption
                      id="ff-pickup"
                      checked={form.fulfillment === 'pickup-request'}
                      onChange={() => update('fulfillment', 'pickup-request')}
                      disabled={!AVAILABILITY.pickupOpen}
                      title="Request pickup"
                      body={
                        AVAILABILITY.pickupOpen
                          ? 'Collect from the approved licensed premises after your request is accepted.'
                          : `Pickup requests are closed. Next opening: ${nextOpening('pickup-requests')}.`
                      }
                    />
                  </>
                ) : (
                  <FulfillmentOption
                    id="ff-shipping"
                    checked={form.fulfillment === 'shipping'}
                    onChange={() => update('fulfillment', 'shipping')}
                    title="Ship my order"
                    body="Apparel and accessories only. Cannabis products are never shipped."
                  />
                )}
              </fieldset>
              {errors.fulfillment ? (
                <p role="alert" className="text-[13px] font-medium text-danger">{errors.fulfillment}</p>
              ) : null}

              {atCapacity(AVAILABILITY) && form.fulfillment === 'delivery-request' ? (
                <Notice tone="warning" title="Limited right now">
                  The business is handling its maximum number of active deliveries. Requests are
                  still accepted but may take longer to review, or you may be offered a
                  different window.
                </Notice>
              ) : null}

              {form.fulfillment === 'delivery-request' ? (
                <div className="space-y-5">
                  <TextField label="Street address" required autoComplete="address-line1" value={form.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} error={errors.addressLine1} />
                  <TextField label="Apartment, floor (optional)" autoComplete="address-line2" value={form.addressLine2} onChange={(e) => update('addressLine2', e.target.value)} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="City" required autoComplete="address-level2" value={form.city} onChange={(e) => update('city', e.target.value)} error={errors.city} />
                    <TextField
                      label="ZIP code"
                      required
                      inputMode="numeric"
                      maxLength={5}
                      autoComplete="postal-code"
                      value={form.zip}
                      onChange={(e) => update('zip', e.target.value.replace(/\D/g, ''))}
                      error={errors.zip}
                      hint={
                        zipInZone === true ? 'Inside the approved service area.'
                        : zipInZone === false ? undefined
                        : 'Delivery requests are only accepted inside the approved service area.'
                      }
                    />
                  </div>
                  <SelectField
                    label="Preferred delivery window"
                    value={form.preferredWindow}
                    onChange={(e) => update('preferredWindow', e.target.value)}
                    error={errors.preferredWindow}
                    hint="A preference only. The business confirms or offers an alternative window after review."
                  >
                    {DELIVERY_WINDOWS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </SelectField>
                </div>
              ) : null}

              {form.fulfillment === 'shipping' ? (
                <div className="space-y-5">
                  <TextField label="Shipping address" required autoComplete="address-line1" value={form.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} error={errors.addressLine1} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="City" required autoComplete="address-level2" value={form.city} onChange={(e) => update('city', e.target.value)} error={errors.city} />
                    <TextField label="ZIP code" required inputMode="numeric" maxLength={5} autoComplete="postal-code" value={form.zip} onChange={(e) => update('zip', e.target.value.replace(/\D/g, ''))} error={errors.zip} />
                  </div>
                </div>
              ) : null}

              <TextAreaField
                label="Notes for the business (optional)"
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                hint="Access instructions, questions about an item, anything we should know before reviewing."
              />
            </section>
          ) : null}

          {/* --------------------------------------------------- 3. order review */}
          {step === 2 ? (
            <section aria-labelledby="fp-step-3" className="space-y-6">
              <h2 id="fp-step-3" className="text-2xl">Order review</h2>
              <ul className="divide-y divide-ink-line border-y border-ink-line">
                {lines.map((line) => (
                  <li key={line.productId} className="flex items-start justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-bone">{line.name}</p>
                      <p className="mt-0.5 text-[13px] text-chrome-dim">
                        {line.brand} &middot; {line.packageSize} &middot; {isCannabis(line) ? 'Cannabis (21+)' : 'Apparel / accessory'}
                      </p>
                      <p className="mt-1 text-[13px] text-chrome">
                        Quantity {line.quantity} &times; {formatPrice(line.unitPriceCents)}
                      </p>
                    </div>
                    <span className="shrink-0 font-display text-lg tabular-nums text-bone">
                      {formatPrice(line.unitPriceCents * line.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 text-[14px]">
                <SummaryRow label="Subtotal" value={formatPrice(totals.subtotalCents)} />
                <SummaryRow label="Estimated tax (placeholder)" value={formatPrice(totals.estimatedTaxCents)} muted />
                <div className="fp-chrome-rule my-2" aria-hidden="true" />
                <SummaryRow label="Total" value={formatPrice(totals.totalCents)} bold />
              </dl>

              <Notice tone="legal" title="Legal notice">{LEGAL.orderReviewNotice}</Notice>
              <Notice tone="neutral" title="Tax">
                The amount shown is a placeholder. Final tax is calculated by a connected,
                compliant tax system, not by this page.
              </Notice>
            </section>
          ) : null}

          {/* ------------------------------------------------------- 4. payment */}
          {step === 3 ? (
            <section aria-labelledby="fp-step-4" className="space-y-6">
              <h2 id="fp-step-4" className="text-2xl">Payment</h2>

              <Notice tone="warning" title="Integration pending">
                {LEGAL.paymentPlaceholder}
              </Notice>

              {/* VISUAL PLACEHOLDER ONLY.
                  No card fields are real, nothing is submitted anywhere, and no payment is
                  captured, authorised or stored. A cannabis-compliant payment provider must
                  be connected server-side after legal and compliance review. Card data must
                  never touch this application. */}
              <div className="fp-card space-y-4 p-6" aria-describedby="fp-payment-note">
                <p className="fp-eyebrow">Payment method configuration</p>
                <div className="space-y-3">
                  {['Payment method', 'Card or account details', 'Billing address'].map((label) => (
                    <div key={label} className="rounded-sm border border-dashed border-ink-line bg-ink-soft px-4 py-5">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-chrome-dim">{label}</p>
                      <p className="mt-1 text-[13px] text-chrome-dim">
                        [PLACEHOLDER &mdash; configured by the connected payment provider]
                      </p>
                    </div>
                  ))}
                </div>
                <p id="fp-payment-note" className="text-[12px] leading-relaxed text-chrome-dim">
                  This section is a layout placeholder. It collects nothing, sends nothing and
                  charges nothing. Payment methods, accepted instruments and any deposit or
                  pre-authorisation policy are configured only after legal and compliance review.
                </p>
              </div>
            </section>
          ) : null}

          {/* -------------------------------------------------------- 5. submit */}
          {step === 4 ? (
            <section aria-labelledby="fp-step-5" className="space-y-6">
              <h2 id="fp-step-5" className="text-2xl">Submit your request</h2>

              <div className="fp-card space-y-3 p-6">
                <SummaryLine label="Name" value={`${form.firstName} ${form.lastName}`} />
                <SummaryLine label="Email" value={form.email} />
                <SummaryLine label="Mobile" value={form.phone} />
                <SummaryLine
                  label="Fulfillment"
                  value={
                    form.fulfillment === 'delivery-request'
                      ? `Delivery request - preferred ${form.preferredWindow}`
                      : form.fulfillment === 'pickup-request'
                        ? 'Pickup request at the approved premises'
                        : 'Shipping (apparel and accessories only)'
                  }
                />
                {form.fulfillment !== 'pickup-request' && form.addressLine1 ? (
                  <SummaryLine
                    label="Address"
                    value={`${form.addressLine1}${form.addressLine2 ? `, ${form.addressLine2}` : ''}, ${form.city} ${form.zip}`}
                  />
                ) : null}
                <SummaryLine label="Items" value={`${lines.length} ${lines.length === 1 ? 'line' : 'lines'}`} />
                <SummaryLine label="Total" value={formatPrice(totals.totalCents)} />
              </div>

              <Notice tone="warning" title="Before you submit">
                {LEGAL.preSubmitNotice}
              </Notice>
              {form.fulfillment === 'delivery-request' ? (
                <Notice tone="warning" title="Delivery requests">
                  {LEGAL.deliveryPreSubmitNotice} No delivery time, ETA or driver is assigned
                  until the business accepts your request.
                </Notice>
              ) : null}
              {hasCannabis ? (
                <Notice tone="legal" title="ID requirement">{LEGAL.idReminder}</Notice>
              ) : null}

              <Button type="submit" size="lg" fullWidth>Submit Order Request</Button>
            </section>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
            {step < STEPS.length - 1 ? (
              <Button type="button" size="lg" onClick={next} className="sm:min-w-[200px]">
                Continue
              </Button>
            ) : null}
            {step > 0 ? (
              <Button type="button" size="lg" variant="secondary" onClick={back} className="sm:min-w-[160px]">
                Back
              </Button>
            ) : null}
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="fp-card p-6">
            <h2 className="text-lg">Order summary</h2>
            <ul className="mt-4 space-y-3 text-[13px]">
              {lines.map((line) => (
                <li key={line.productId} className="flex justify-between gap-3">
                  <span className="min-w-0 text-chrome">
                    <span className="block truncate text-bone/90">{line.name}</span>
                    {isCannabis(line) ? '21+ cannabis' : 'Apparel / accessory'} &middot; qty {line.quantity}
                  </span>
                  <span className="shrink-0 tabular-nums text-bone/90">
                    {formatPrice(line.unitPriceCents * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="fp-chrome-rule my-4" aria-hidden="true" />
            <dl className="space-y-2 text-[14px]">
              <SummaryRow label="Subtotal" value={formatPrice(totals.subtotalCents)} />
              <SummaryRow label="Tax (placeholder)" value={formatPrice(totals.estimatedTaxCents)} muted />
              <SummaryRow label="Total" value={formatPrice(totals.totalCents)} bold />
            </dl>
          </div>

          <Notice tone="neutral" className="mt-4" title="Prototype">
            {LEGAL.prototypeNotice}
          </Notice>
        </aside>
      </div>
    </div>
  );
}

function FulfillmentOption({
  id, checked, onChange, title, body, disabled,
}: {
  id: string; checked: boolean; onChange: () => void; title: string; body: string; disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={cx(
        'flex cursor-pointer gap-3 rounded-sm border p-4 transition-colors',
        disabled && 'cursor-not-allowed opacity-60',
        checked && !disabled ? 'border-bone bg-bone/5' : 'border-ink-line hover:border-chrome/50',
      )}
    >
      <input
        id={id}
        type="radio"
        name="fulfillment"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 h-5 w-5 shrink-0 accent-emerald"
      />
      <span>
        <span className="block text-[15px] font-semibold text-bone">{title}</span>
        <span className="mt-1 block text-[13px] leading-relaxed text-chrome">{body}</span>
      </span>
    </label>
  );
}

function SummaryRow({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={muted ? 'text-chrome-dim' : 'text-chrome'}>{label}</dt>
      <dd className={bold ? 'font-display text-xl text-bone' : 'tabular-nums text-bone/90'}>{value}</dd>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-ink-line pb-3 last:border-0 last:pb-0">
      <span className="text-[12px] uppercase tracking-[0.14em] text-chrome-dim">{label}</span>
      <span className="text-[14px] text-bone/90">{value}</span>
    </div>
  );
}
