'use client';

import { useState } from 'react';
import { AdminPageHeader, ConfirmAction, MockDataBanner, RequirePermission } from '@/components/admin/primitives';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { cx } from '@/lib/format';
import {
  DELIVERY_MODE_LABELS, NY_TZ, deliveryMessage, describeDay, formatBlockTime, nextOpening,
} from '@/lib/availability';
import { AVAILABILITY, OVERRIDE_REASONS, SERVICE_SCHEDULES, WEEKDAYS } from '@/lib/mock/availability';
import type { AvailabilityState, DeliveryMode, ScheduleKey, Weekday } from '@/lib/types';

/**
 * Hours & Availability.
 *
 * Every time on this screen is America/New_York. Schedules decide only when a customer may
 * SUBMIT a request. No schedule, override or capacity setting can accept one: acceptance is
 * always a manual owner decision.
 *
 * PRODUCTION: evaluate open/closed server-side so a client clock cannot open a window,
 * require confirmation before saving any change, push the change to the customer site
 * immediately, and write an audit row with the old value, the new value and any reason.
 */
export default function AdminHoursPage() {
  const [scheduleKey, setScheduleKey] = useState<ScheduleKey>('delivery-requests');
  const [state, setState] = useState<AvailabilityState>(AVAILABILITY);
  const [pending, setPending] = useState<{ label: string; apply: (reason: string) => void } | null>(null);
  const [copySource, setCopySource] = useState<Weekday>('mon');

  const schedule = SERVICE_SCHEDULES.find((s) => s.key === scheduleKey)!;

  function queue(label: string, apply: (reason: string) => void) {
    setPending({ label, apply });
  }

  return (
    <RequirePermission permission="schedule.manage">
      <AdminPageHeader
        title="Hours & Availability"
        description={`All times are ${NY_TZ}. These hours control when customers may submit a request. They never accept one.`}
      />

      <MockDataBanner>
        Schedules and overrides are held in this page only. Saving is simulated and the
        customer site is not updated.
      </MockDataBanner>

      <Notice tone="warning" className="mb-6" title="Manual approval always applies">
        Opening a window does not approve anything. Every request still waits for your
        decision, and inventory is deducted only after you accept.
      </Notice>

      {/* ------------------------------------------------------- current status */}
      <section aria-labelledby="fp-current" className="rounded-lg border border-ink-line bg-ink-card p-5">
        <h2 id="fp-current" className="text-xl">Current customer-facing status</h2>
        <p className="mt-3 rounded-sm border border-ink-line bg-ink-soft p-4 text-[14px] text-bone/90">
          &ldquo;{deliveryMessage(state)}&rdquo;
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <SelectField
            label="Delivery request mode"
            value={state.deliveryMode}
            onChange={(e) => {
              const mode = e.target.value as DeliveryMode;
              queue(`Set delivery mode to ${DELIVERY_MODE_LABELS[mode]}`, (reason) =>
                setState((s) => ({ ...s, deliveryMode: mode, internalNote: reason || s.internalNote })),
              );
            }}
          >
            {(Object.keys(DELIVERY_MODE_LABELS) as DeliveryMode[]).map((m) => (
              <option key={m} value={m}>{DELIVERY_MODE_LABELS[m]}</option>
            ))}
          </SelectField>
          <TextField
            label="Closed until (if applicable)"
            type="datetime-local"
            hint="Used when the mode is 'Closed until a set time'."
          />
          <TextField
            label="Customer-facing message (optional)"
            defaultValue={state.customerMessage}
            placeholder="Shown above the default status message"
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <TextField
            label="Maximum active deliveries"
            inputMode="numeric"
            defaultValue={String(state.maxActiveDeliveries)}
            hint="Your own ceiling when working alone. It limits nothing automatically; you still accept each request."
          />
          <SelectField label="Customer response window" defaultValue={String(state.customerResponseMinutes)}>
            {[15, 20, 30, 45].map((m) => <option key={m} value={m}>{m} minutes</option>)}
          </SelectField>
          <SelectField
            label="Temporary inventory hold"
            defaultValue={String(state.inventoryHoldMinutes)}
          >
            <option value="0">No hold</option>
            {[10, 15, 30].map((m) => <option key={m} value={m}>{m} minutes</option>)}
          </SelectField>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-chrome-dim">
          A temporary hold is optional and is released automatically when a request is
          declined, cancelled or expires. Stock is permanently deducted only on acceptance,
          and it is re-checked immediately before acceptance to prevent overselling.
        </p>
      </section>

      {/* --------------------------------------------------------- quick overrides */}
      <section aria-labelledby="fp-overrides" className="mt-8">
        <h2 id="fp-overrides" className="mb-3 text-xl">Temporary overrides</h2>
        <p className="mb-4 max-w-3xl text-[13px] leading-relaxed text-chrome">
          Overrides sit on top of the regular schedule without deleting it. Each one asks for
          confirmation and an optional internal reason, then takes effect immediately.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ['Close delivery requests now', () => setState((s) => ({ ...s, deliveryMode: 'temporarily-closed' }))],
            ['Reopen delivery requests now', () => setState((s) => ({ ...s, deliveryMode: 'open' }))],
            ['Close until a selected time', () => setState((s) => ({ ...s, deliveryMode: 'closed-until' }))],
            ['Mark delivery as limited', () => setState((s) => ({ ...s, deliveryMode: 'limited' }))],
            ['Mark delivery as fully booked', () => setState((s) => ({ ...s, deliveryMode: 'fully-booked' }))],
            ['Close pickup temporarily', () => setState((s) => ({ ...s, pickupOpen: false }))],
            ['Reopen pickup', () => setState((s) => ({ ...s, pickupOpen: true }))],
            ['Close for the day', () => setState((s) => ({ ...s, deliveryMode: 'closed-today' }))],
            ['Extend hours for one day', () => undefined],
            ['Add a break', () => undefined],
            ['Set apparel-only mode', () => setState((s) => ({ ...s, apparelOnlyMode: true, deliveryMode: 'temporarily-closed' }))],
          ].map(([label, apply]) => (
            <Button
              key={label as string}
              size="sm"
              variant="secondary"
              onClick={() => queue(label as string, () => (apply as () => void)())}
            >
              {label as string}
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-chrome-dim">Common internal reasons</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {OVERRIDE_REASONS.map((r) => (
              <li key={r} className="rounded-xs border border-ink-line px-2.5 py-1 text-[12px] text-chrome">{r}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------- schedules */}
      <section aria-labelledby="fp-schedules" className="mt-10">
        <h2 id="fp-schedules" className="mb-4 text-xl">Weekly schedules</h2>

        <div className="fp-rail mb-5 gap-2" role="group" aria-label="Choose a schedule">
          {SERVICE_SCHEDULES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setScheduleKey(s.key)}
              aria-pressed={scheduleKey === s.key}
              className={cx(
                'min-h-[44px] shrink-0 rounded-sm border px-4 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors',
                scheduleKey === s.key ? 'border-bone bg-bone text-ink' : 'border-ink-line text-chrome hover:text-bone',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="mb-4 text-[13px] text-chrome">{schedule.description}</p>

        <ul className="space-y-3">
          {WEEKDAYS.map((day) => {
            const plan = schedule.days[day.key];
            return (
              <li key={day.key} className="rounded-lg border border-ink-line bg-ink-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label className="flex min-h-[44px] items-center gap-3 text-[14px] font-semibold text-bone">
                      <input type="checkbox" defaultChecked={plan.enabled} className="h-5 w-5 accent-emerald" />
                      {day.label}
                    </label>
                  </div>
                  <p className="text-[13px] text-chrome">{describeDay(scheduleKey, day.key)}</p>
                </div>

                {plan.enabled ? (
                  <div className="mt-4 space-y-3">
                    {plan.blocks.map((block, i) => (
                      <div key={`${day.key}-block-${i}`} className="flex flex-wrap items-end gap-3">
                        <TextField label="Opens" type="time" defaultValue={block.start} className="w-36" />
                        <TextField label="Closes" type="time" defaultValue={block.end} className="w-36" />
                        <Button size="sm" variant="ghost">Remove block</Button>
                      </div>
                    ))}
                    {plan.breaks.map((brk, i) => (
                      <div key={`${day.key}-break-${i}`} className="flex flex-wrap items-end gap-3">
                        <TextField label="Break from" type="time" defaultValue={brk.start} className="w-36" />
                        <TextField label="Break until" type="time" defaultValue={brk.end} className="w-36" />
                        <Button size="sm" variant="ghost">Remove break</Button>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary">Add time block</Button>
                      <Button size="sm" variant="secondary">Add break</Button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap items-end gap-3 rounded-lg border border-ink-line bg-ink-card p-4">
          <SelectField label="Copy a day" value={copySource} onChange={(e) => setCopySource(e.target.value as Weekday)} className="w-48">
            {WEEKDAYS.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
          </SelectField>
          <Button size="sm" variant="secondary" onClick={() => queue(`Copy ${copySource} hours to every weekday`, () => undefined)}>
            Copy to every weekday
          </Button>
          <Button size="sm" variant="secondary" onClick={() => queue(`Copy ${copySource} hours to every day`, () => undefined)}>
            Copy to all days
          </Button>
          <Button size="sm" variant="secondary">Save as template</Button>
          <Button size="sm" variant="secondary">Schedule a future change</Button>
        </div>
      </section>

      {/* -------------------------------------------------------- customer preview */}
      <section aria-labelledby="fp-preview" className="mt-10">
        <h2 id="fp-preview" className="mb-4 text-xl">What customers see</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-ink-line bg-ink-card p-5">
            <p className="fp-eyebrow mb-3">Status strip</p>
            <p className="text-[14px] text-bone/90">{deliveryMessage(state)}</p>
            <p className="mt-2 text-[12px] text-chrome-dim">
              Shown on the homepage, the menu, the cart and checkout.
            </p>
          </div>
          <div className="rounded-lg border border-ink-line bg-ink-card p-5">
            <p className="fp-eyebrow mb-3">Next openings</p>
            <dl className="space-y-2 text-[13px]">
              {SERVICE_SCHEDULES.map((s) => (
                <div key={s.key} className="flex justify-between gap-4">
                  <dt className="text-chrome">{s.label}</dt>
                  <dd className="text-bone/90">{nextOpening(s.key)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-chrome-dim">
          Example. Monday delivery requests {formatBlockTime('18:00')} to {formatBlockTime('22:00')},
          pickup requests {formatBlockTime('17:00')} to {formatBlockTime('22:30')}, order review{' '}
          {formatBlockTime('17:00')} to {formatBlockTime('23:00')}.
        </p>
      </section>

      <ConfirmAction
        open={pending !== null}
        onClose={() => setPending(null)}
        onConfirm={(reason) => { pending?.apply(reason); setPending(null); }}
        title={pending?.label ?? ''}
        description="This updates the customer-facing site immediately and is written to the audit log with your account, the time, the previous value, the new value and your reason."
        confirmLabel="Save change"
        requireReason
      />
    </RequirePermission>
  );
}
