'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmAction } from '@/components/admin/primitives';
import { cx } from '@/lib/format';
import {
  DELIVERY_MODE_LABELS, OWNER_STATUS_LABELS, atCapacity, deliveryMessage,
} from '@/lib/availability';
import { AVAILABILITY } from '@/lib/mock/availability';
import type { AvailabilityState, DeliveryMode, OwnerStatus } from '@/lib/types';

/**
 * One-person operation controls.
 *
 * Availability only decides when a customer may SUBMIT a request. No setting here, and no
 * capacity or time-slot rule anywhere in this system, can accept a request on the owner's
 * behalf. Acceptance is always a manual decision.
 *
 * PRODUCTION: this state lives in one owner-editable record read by the customer site on
 * every request, so a change takes effect immediately. Every change is confirmed before
 * saving and written to the audit log with the old value, the new value and any reason.
 */
export function OwnerStatusPanel() {
  const [state, setState] = useState<AvailabilityState>(AVAILABILITY);
  const [pending, setPending] = useState<{ mode?: DeliveryMode; pickupOpen?: boolean; label: string } | null>(null);

  function apply(reason: string) {
    if (!pending) return;
    setState((s) => ({
      ...s,
      deliveryMode: pending.mode ?? s.deliveryMode,
      pickupOpen: pending.pickupOpen ?? s.pickupOpen,
      internalNote: reason || s.internalNote,
      updatedAt: new Date().toISOString(),
    }));
    setPending(null);
  }

  return (
    <section aria-labelledby="fp-owner-status" className="rounded-lg border border-ink-line bg-ink-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="fp-owner-status" className="text-xl">Right now</h2>
          <p className="mt-1 text-[13px] text-chrome">
            What customers currently see: &ldquo;{deliveryMessage(state)}&rdquo;
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill label={`Delivery: ${DELIVERY_MODE_LABELS[state.deliveryMode]}`} tone={state.deliveryMode === 'open' ? 'good' : state.deliveryMode === 'limited' ? 'warn' : 'off'} />
          <Pill label={`Pickup: ${state.pickupOpen ? 'Open' : 'Closed'}`} tone={state.pickupOpen ? 'good' : 'off'} />
          <Pill label={`Owner: ${OWNER_STATUS_LABELS[state.ownerStatus]}`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-chrome-dim">Your status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(OWNER_STATUS_LABELS) as OwnerStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, ownerStatus: s }))}
                aria-pressed={state.ownerStatus === s}
                className={cx(
                  'min-h-[40px] rounded-sm border px-3 text-[12px] font-semibold transition-colors',
                  state.ownerStatus === s ? 'border-bone bg-bone text-ink' : 'border-ink-line text-chrome hover:text-bone',
                )}
              >
                {OWNER_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[13px] text-chrome">
          <p>
            Active deliveries{' '}
            <span className={cx('font-semibold tabular-nums', atCapacity(state) ? 'text-warn' : 'text-bone')}>
              {state.activeDeliveries} / {state.maxActiveDeliveries}
            </span>
          </p>
          <p className="mt-1 text-[12px] text-chrome-dim">Ceiling you set for working alone.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => setPending({ mode: 'temporarily-closed', label: 'Close delivery requests now' })}>
          Close delivery requests
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setPending({ mode: 'open', label: 'Reopen delivery requests now' })}>
          Reopen delivery requests
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setPending({ mode: 'limited', label: 'Mark delivery as limited' })}>
          Mark as limited
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setPending({ mode: 'fully-booked', label: 'Mark delivery as fully booked' })}>
          Mark as fully booked
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setPending({ pickupOpen: !state.pickupOpen, label: state.pickupOpen ? 'Close pickup temporarily' : 'Reopen pickup' })}>
          {state.pickupOpen ? 'Close pickup' : 'Reopen pickup'}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setPending({ mode: 'closed-today', label: 'Close delivery for today' })}>
          Close for today
        </Button>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-chrome-dim">
        Changing availability never approves an order. Every request still waits for your
        decision, and inventory is only deducted after you accept.
      </p>

      <ConfirmAction
        open={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={apply}
        title={pending?.label ?? ''}
        description="This updates the customer-facing site immediately and is written to the audit log with the previous value, the new value and your reason."
        confirmLabel="Save change"
        requireReason
      />
    </section>
  );
}

function Pill({ label, tone }: { label: string; tone: 'good' | 'warn' | 'off' | 'neutral' }) {
  const tones = {
    good: 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
    warn: 'border-warn/50 bg-warn/15 text-warn',
    off: 'border-chrome/30 bg-ink-soft text-chrome-dim',
    neutral: 'border-ink-line text-chrome',
  } as const;
  return (
    <span className={cx('rounded-xs border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]', tones[tone])}>
      {label}
    </span>
  );
}
