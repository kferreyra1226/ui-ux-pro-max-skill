import { cx } from '@/lib/format';
import type { OrderRequestStatus } from '@/lib/types';

const STAGES: { key: OrderRequestStatus; label: string; body: string }[] = [
  { key: 'request-received', label: 'Request Received', body: 'We have your request. Nothing is confirmed yet.' },
  { key: 'under-review', label: 'Under Review', body: 'Checking inventory, fulfillment availability and order details.' },
  { key: 'confirmed', label: 'Confirmed', body: 'The business has accepted your request.' },
  { key: 'being-prepared', label: 'Being Prepared', body: 'Your order is being put together.' },
  { key: 'ready-for-approved-fulfillment', label: 'Ready for Approved Fulfillment', body: 'Ready to be released once age and identity verification is complete.' },
  { key: 'completed', label: 'Completed', body: 'The order has been completed.' },
];

/** Linear status tracker. Terminal states (declined, cancelled) render their own message. */
export function OrderStatusTracker({
  status, className,
}: { status: OrderRequestStatus; className?: string }) {
  if (status === 'declined' || status === 'cancelled') {
    return (
      <div className={cx('rounded-lg border border-danger/40 bg-danger/10 p-5', className)}>
        <p className="text-[15px] font-semibold text-danger">
          {status === 'declined' ? 'This request was not accepted.' : 'This request was cancelled.'}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-chrome">
          No inventory was reserved and no payment was taken. Contact support if you would like
          to place a new request.
        </p>
      </div>
    );
  }

  const currentIndex = Math.max(0, STAGES.findIndex((s) => s.key === status));

  return (
    <ol className={cx('relative space-y-0', className)}>
      {STAGES.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li key={stage.key} className="relative flex gap-4 pb-7 last:pb-0">
            {i < STAGES.length - 1 ? (
              <span
                aria-hidden="true"
                className={cx(
                  'absolute left-[11px] top-6 h-full w-px',
                  done ? 'bg-emerald' : 'bg-ink-line',
                )}
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cx(
                'relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2',
                done && 'border-emerald bg-emerald',
                active && 'border-acid bg-ink',
                !done && !active && 'border-ink-line bg-ink',
              )}
            >
              {done ? <CheckIcon /> : active ? <span className="h-2 w-2 rounded-full bg-acid" /> : null}
            </span>
            <div className="pt-0.5">
              <p className={cx('text-[15px] font-semibold', active ? 'text-bone' : done ? 'text-bone/70' : 'text-chrome-dim')}>
                {stage.label}
                {active ? <span className="sr-only"> (current status)</span> : null}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-chrome-dim">{stage.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.2l2.4 2.4 4.6-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
