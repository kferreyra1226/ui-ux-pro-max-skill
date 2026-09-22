'use client';

import { useState } from 'react';
import { AdminPageHeader, ConfirmAction, MockDataBanner, RequirePermission } from '@/components/admin/primitives';
import { DeliveryStatusChip, TagBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Notice } from '@/components/ui/Notice';
import { formatDateTime, formatPrice } from '@/lib/format';
import { AVAILABILITY } from '@/lib/mock/availability';
import { ORDER_REQUESTS } from '@/lib/mock/orders';
import type { AttentionFlag, DeclineReason, DeliveryRequestStatus, OrderRequest } from '@/lib/types';

/**
 * Delivery request inbox - the manual approval workflow.
 *
 * Rules this screen exists to enforce:
 * - A request is never auto-accepted. No timer, capacity rule or slot allocator can accept.
 * - Accepting requires the owner to confirm a delivery window and re-check inventory,
 *   address eligibility and current availability first.
 * - Inventory is reserved or deducted only on acceptance. A decline, cancellation or expiry
 *   reserves nothing and releases any temporary hold.
 * - Declining requires a reason from a fixed list.
 * - Offering an alternative time moves the request to "Awaiting customer response" with an
 *   owner-configured deadline; missing the deadline expires the request and releases holds.
 * - Every action writes an audit row.
 */

const DECLINE_REASONS: { value: DeclineReason; label: string }[] = [
  { value: 'outside-service-area', label: 'Outside service area' },
  { value: 'delivery-unavailable', label: 'Delivery unavailable' },
  { value: 'requested-time-unavailable', label: 'Requested time unavailable' },
  { value: 'item-out-of-stock', label: 'Item out of stock' },
  { value: 'minimum-order-not-met', label: 'Minimum order not met' },
  { value: 'unable-to-fulfill', label: 'Unable to fulfill' },
  { value: 'other', label: 'Other' },
];

const FLAG_LABELS: Record<AttentionFlag, string> = {
  'out-of-zone': 'Out-of-zone address',
  'low-stock': 'Low stock on a line',
  'duplicate-order': 'Possible duplicate',
  'invalid-time': 'Requested time outside hours',
  'repeated-cancellations': 'Repeated cancellations',
  'minimum-not-met': 'Minimum order not met',
  'pending-too-long': 'Pending too long',
};

const WINDOWS = [
  'Today, 6:00 PM - 8:00 PM',
  'Today, 8:00 PM - 10:00 PM',
  'Tomorrow, 6:00 PM - 8:00 PM',
  'Tomorrow, 8:00 PM - 10:00 PM',
];

type ActionKind = 'accept' | 'decline' | 'offer' | 'pickup' | 'cancel' | 'flag' | null;

export default function AdminDeliveriesPage() {
  const requests = ORDER_REQUESTS.filter((o) => o.delivery);
  const [statuses, setStatuses] = useState<Record<string, DeliveryRequestStatus>>(
    Object.fromEntries(requests.map((r) => [r.id, r.delivery!.status])),
  );
  const [active, setActive] = useState<OrderRequest | null>(null);
  const [action, setAction] = useState<ActionKind>(null);
  const [window, setWindow] = useState(WINDOWS[0]);
  const [declineReason, setDeclineReason] = useState<DeclineReason | ''>('');
  const [offeredWindows, setOfferedWindows] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  function open(request: OrderRequest, kind: ActionKind) {
    setActive(request);
    setAction(kind);
    setWindow(WINDOWS[0]);
    setDeclineReason('');
    setOfferedWindows([]);
    setNote('');
    setError('');
  }

  function close() {
    setActive(null);
    setAction(null);
  }

  function commit(next: DeliveryRequestStatus) {
    if (!active) return;
    setStatuses((s) => ({ ...s, [active.id]: next }));
    close();
  }

  return (
    <RequirePermission permission="delivery.manage">
      <AdminPageHeader
        title="Delivery Requests"
        description="Your review inbox. Read the flags, re-check stock and the address, then decide. Nothing here moves on its own."
      />

      <MockDataBanner>
        Mock requests. Acceptance, decline and alternative-time offers change only this
        screen&rsquo;s local state and send no notification.
      </MockDataBanner>

      <Notice tone="warning" className="mb-6" title="Before you accept">
        Accepting reserves inventory and tells the customer a window. Re-check stock, the
        address and your own availability first. Never accept a request you cannot fulfil.
      </Notice>

      <div className="space-y-4">
        {requests.map((request) => {
          const delivery = request.delivery!;
          const status = statuses[request.id];
          const decided = ['confirmed', 'declined', 'cancelled', 'delivered', 'expired'].includes(status);

          return (
            <article key={request.id} className="rounded-lg border border-ink-line bg-ink-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl text-bone">{request.reference}</h2>
                    <DeliveryStatusChip status={status} />
                  </div>
                  <p className="mt-1 text-[12px] text-chrome-dim">
                    Submitted {formatDateTime(request.submittedAt)}
                  </p>
                </div>
                <p className="font-display text-2xl tabular-nums text-bone">
                  {formatPrice(request.totals.totalCents + delivery.feeCents)}
                </p>
              </div>

              {request.attentionFlags.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {request.attentionFlags.map((flag) => (
                    <li key={flag}>
                      <TagBadge tone={flag === 'out-of-zone' || flag === 'repeated-cancellations' ? 'acid' : 'chrome'}>
                        {FLAG_LABELS[flag]}
                      </TagBadge>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                <dl className="space-y-2 text-[13px]">
                  <Field label="Customer" value={`${request.customer.firstName} ${request.customer.lastName}`} />
                  <Field label="Phone" value={request.customer.phone} />
                  <Field label="Email" value={request.customer.email} />
                  <Field label="21+ / ID acknowledged" value={request.customer.ageAcknowledged && request.customer.idAcknowledged ? 'Yes' : 'No'} />
                </dl>

                <dl className="space-y-2 text-[13px]">
                  <Field label="Address" value={`${delivery.addressLine1}, ${delivery.city}, ${delivery.state} ${delivery.zip}`} />
                  <Field label="Service area" value={delivery.inZone ? 'Inside approved area' : 'OUTSIDE approved area'} tone={delivery.inZone ? undefined : 'danger'} />
                  <Field label="Preferred window" value={delivery.preferredWindow} />
                  <Field
                    label="Fee / minimum"
                    value={`${formatPrice(delivery.feeCents)} fee - minimum ${delivery.meetsMinimum ? 'met' : 'NOT met'}`}
                    tone={delivery.meetsMinimum ? undefined : 'danger'}
                  />
                </dl>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-chrome-dim">Items</p>
                  <ul className="mt-2 space-y-1.5 text-[13px]">
                    {request.lines.map((line) => (
                      <li key={line.productId} className="flex justify-between gap-3">
                        <span className="text-bone/90">{line.name} &times; {line.quantity}</span>
                        <span className="tabular-nums text-chrome">{formatPrice(line.unitPriceCents * line.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  {request.customerNotes ? (
                    <p className="mt-3 rounded-sm border border-ink-line bg-ink-soft p-3 text-[12px] leading-relaxed text-chrome">
                      <span className="font-semibold text-bone/80">Customer note: </span>
                      {request.customerNotes}
                    </p>
                  ) : null}
                </div>
              </div>

              {delivery.offeredWindows.length > 0 && status === 'alternative-time-offered' ? (
                <Notice tone="warning" className="mt-4" title="Alternative times offered">
                  Offered: {delivery.offeredWindows.join(' / ')}. The customer has{' '}
                  {AVAILABILITY.customerResponseMinutes} minutes to respond
                  {delivery.customerResponseDueAt ? ` (until ${formatDateTime(delivery.customerResponseDueAt)})` : ''}.
                  If they do not respond the request expires and any temporary hold is released.
                  Once they choose, it comes back to you for final acceptance.
                </Notice>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" disabled={decided} onClick={() => open(request, 'accept')}>Accept request</Button>
                <Button size="sm" variant="secondary" disabled={decided} onClick={() => open(request, 'offer')}>Offer a different time</Button>
                <Button size="sm" variant="secondary" disabled={decided} onClick={() => open(request, 'pickup')}>Switch to pickup</Button>
                <Button size="sm" variant="secondary" onClick={() => open(request, 'flag')}>Flag for review</Button>
                <Button size="sm" variant="secondary">Contact customer</Button>
                <Button size="sm" variant="danger" disabled={decided} onClick={() => open(request, 'decline')}>Decline</Button>
                <Button size="sm" variant="danger" disabled={decided} onClick={() => open(request, 'cancel')}>Cancel</Button>
              </div>
            </article>
          );
        })}
      </div>

      {/* --------------------------------------------------------- accept dialog */}
      <Modal
        open={action === 'accept'}
        onClose={close}
        title={`Accept ${active?.reference ?? ''}`}
        description="Confirm the delivery window. Accepting reserves inventory and notifies the customer."
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button onClick={() => commit('confirmed')}>Accept and confirm window</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Notice tone="warning" title="Re-check before accepting">
            Confirm current stock for every line, that the address is inside the approved
            service area, and that you can actually cover this window. Stock is re-checked
            against the live inventory system at the moment of acceptance to prevent
            overselling.
          </Notice>
          <SelectField label="Delivery window" required value={window} onChange={(e) => setWindow(e.target.value)}>
            {WINDOWS.map((w) => <option key={w} value={w}>{w}</option>)}
          </SelectField>
          <div className="rounded-sm border border-ink-line bg-ink-soft p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-chrome-dim">Customer notification</p>
            <p className="mt-2 text-[13px] leading-relaxed text-bone/85">
              &ldquo;Your delivery request has been accepted for {window}. Please have a valid
              government-issued ID ready. The recipient must match the name on the order.&rdquo;
            </p>
            <p className="mt-2 text-[11px] text-chrome-dim">
              Placeholder message. Nothing is sent until a messaging provider is connected.
            </p>
          </div>
        </div>
      </Modal>

      {/* -------------------------------------------------------- decline dialog */}
      <Modal
        open={action === 'decline'}
        onClose={close}
        title={`Decline ${active?.reference ?? ''}`}
        description="A reason is required. No inventory is reserved or deducted for a declined request."
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!declineReason) {
                  setError('Choose a reason before declining.');
                  return;
                }
                commit('declined');
              }}
            >
              Decline request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <SelectField
            label="Reason"
            required
            value={declineReason}
            onChange={(e) => { setDeclineReason(e.target.value as DeclineReason); setError(''); }}
            error={error}
          >
            <option value="">Select a reason</option>
            {DECLINE_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </SelectField>
          <TextAreaField label="Internal note (optional)" rows={3} value={note} onChange={(e) => setNote(e.target.value)} hint="Recorded in the audit log. Never shown to the customer." />
          <div className="rounded-sm border border-ink-line bg-ink-soft p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-chrome-dim">Customer notification</p>
            <p className="mt-2 text-[13px] leading-relaxed text-bone/85">
              &ldquo;We&rsquo;re unable to accept this delivery request at this time. You may choose
              pickup or try again later.&rdquo;
            </p>
          </div>
        </div>
      </Modal>

      {/* ------------------------------------------------- alternative time dialog */}
      <Modal
        open={action === 'offer'}
        onClose={close}
        title={`Offer a different time for ${active?.reference ?? ''}`}
        description="Pick one or more windows you can actually cover. The request moves to Awaiting customer response."
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button
              onClick={() => {
                if (offeredWindows.length === 0) {
                  setError('Select at least one window to offer.');
                  return;
                }
                commit('alternative-time-offered');
              }}
            >
              Send offer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <fieldset>
            <legend className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-chrome">
              Windows to offer
            </legend>
            <div className="space-y-2">
              {WINDOWS.map((w) => (
                <label key={w} className="flex items-center gap-3 rounded-sm border border-ink-line p-3 text-[14px] text-bone/90">
                  <input
                    type="checkbox"
                    checked={offeredWindows.includes(w)}
                    onChange={(e) => {
                      setError('');
                      setOfferedWindows((prev) => (e.target.checked ? [...prev, w] : prev.filter((x) => x !== w)));
                    }}
                    className="h-5 w-5 accent-emerald"
                  />
                  {w}
                </label>
              ))}
            </div>
            {error ? <p role="alert" className="mt-2 text-[13px] font-medium text-danger">{error}</p> : null}
          </fieldset>
          <SelectField label="Customer response window" defaultValue={String(AVAILABILITY.customerResponseMinutes)}>
            {[15, 20, 30, 45].map((m) => <option key={m} value={m}>{m} minutes</option>)}
          </SelectField>
          <Notice tone="neutral" title="What happens next">
            The customer is told: &ldquo;Your requested time is unavailable. We can offer:
            {' '}{offeredWindows.join(' / ') || '[TIME OPTIONS]'}. Please select an option to
            continue.&rdquo; If they do not respond in time the request is marked Expired and
            any temporary inventory hold is released. When they choose, the request returns to
            you for final acceptance. It is never accepted automatically.
          </Notice>
        </div>
      </Modal>

      {/* ---------------------------------------------- pickup / cancel / flag */}
      <ConfirmAction
        open={action === 'pickup'}
        onClose={close}
        onConfirm={() => commit('awaiting-owner-review')}
        title={`Switch ${active?.reference ?? ''} to pickup`}
        description="The customer is asked to collect from the approved licensed premises instead. The request still needs your acceptance."
        confirmLabel="Switch to pickup"
        requireReason
      />
      <ConfirmAction
        open={action === 'cancel'}
        onClose={close}
        onConfirm={() => commit('cancelled')}
        title={`Cancel ${active?.reference ?? ''}`}
        description="Cancelling releases any temporary inventory hold and notifies the customer. This is recorded in the audit log."
        confirmLabel="Cancel request"
        requireReason
      />
      <ConfirmAction
        open={action === 'flag'}
        onClose={close}
        onConfirm={close}
        title={`Flag ${active?.reference ?? ''} for review`}
        description="Adds an internal flag so this request is looked at again before any decision. The customer is not notified."
        confirmLabel="Flag request"
        requireReason
      />
    </RequirePermission>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: 'danger' }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.12em] text-chrome-dim">{label}</dt>
      <dd className={tone === 'danger' ? 'text-danger' : 'text-bone/90'}>{value}</dd>
    </div>
  );
}
