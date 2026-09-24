import { cx } from '@/lib/format';
import { STOCK_LABELS } from '@/lib/inventory';
import type { AvailabilityStatus, DeliveryRequestStatus, OrderRequestStatus, PublicStockStatus } from '@/lib/types';

const STOCK_TONES: Record<PublicStockStatus, string> = {
  'in-stock': 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
  'low-stock': 'border-warn/50 bg-warn/15 text-warn',
  'sold-out': 'border-chrome/30 bg-ink-soft text-chrome-dim',
};

const CHIP =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-xs border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]';

export function StockBadge({ status, className }: { status: PublicStockStatus; className?: string }) {
  return (
    <span className={cx(CHIP, STOCK_TONES[status], className)}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {STOCK_LABELS[status]}
    </span>
  );
}

export function TagBadge({
  children, tone = 'chrome', className,
}: { children: React.ReactNode; tone?: 'chrome' | 'acid' | 'emerald' | 'bone'; className?: string }) {
  const tones = {
    chrome: 'border-chrome/35 text-chrome',
    acid: 'border-acid/60 bg-acid/10 text-acid',
    emerald: 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
    bone: 'border-bone/40 bg-bone/10 text-bone',
  } as const;
  return <span className={cx(CHIP, tones[tone], className)}>{children}</span>;
}

export const ORDER_STATUS_LABELS: Record<OrderRequestStatus, string> = {
  'request-received': 'Request received - awaiting review',
  'under-review': 'Under review',
  confirmed: 'Confirmed',
  'being-prepared': 'Being prepared',
  'ready-for-approved-fulfillment': 'Ready for approved fulfillment',
  completed: 'Completed',
  declined: 'Declined',
  cancelled: 'Cancelled',
};

const ORDER_STATUS_TONES: Record<OrderRequestStatus, string> = {
  'request-received': 'border-chrome/40 bg-ink-soft text-chrome',
  'under-review': 'border-warn/50 bg-warn/15 text-warn',
  confirmed: 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
  'being-prepared': 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
  'ready-for-approved-fulfillment': 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
  completed: 'border-bone/40 bg-bone/10 text-bone',
  declined: 'border-danger/50 bg-danger/10 text-danger',
  cancelled: 'border-danger/50 bg-danger/10 text-danger',
};

export function OrderStatusChip({ status, className }: { status: OrderRequestStatus; className?: string }) {
  return <span className={cx(CHIP, ORDER_STATUS_TONES[status], className)}>{ORDER_STATUS_LABELS[status]}</span>;
}

export const DELIVERY_STATUS_LABELS: Record<DeliveryRequestStatus, string> = {
  'awaiting-owner-review': 'Awaiting owner review',
  'alternative-time-offered': 'Alternative time offered',
  'awaiting-customer-response': 'Awaiting customer response',
  confirmed: 'Confirmed',
  'being-packed': 'Being packed',
  'out-for-delivery': 'Out for delivery',
  delivered: 'Delivered',
  declined: 'Declined',
  cancelled: 'Cancelled',
  expired: 'Expired',
};

const DELIVERY_STATUS_TONES: Record<DeliveryRequestStatus, string> = {
  'awaiting-owner-review': 'border-warn/50 bg-warn/15 text-warn',
  'alternative-time-offered': 'border-warn/50 bg-warn/15 text-warn',
  'awaiting-customer-response': 'border-warn/50 bg-warn/15 text-warn',
  confirmed: 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
  'being-packed': 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
  'out-for-delivery': 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
  delivered: 'border-bone/40 bg-bone/10 text-bone',
  declined: 'border-danger/50 bg-danger/10 text-danger',
  cancelled: 'border-danger/50 bg-danger/10 text-danger',
  expired: 'border-chrome/30 bg-ink-soft text-chrome-dim',
};

export function DeliveryStatusChip({ status, className }: { status: DeliveryRequestStatus; className?: string }) {
  return <span className={cx(CHIP, DELIVERY_STATUS_TONES[status], className)}>{DELIVERY_STATUS_LABELS[status]}</span>;
}

const ADMIN_STATUS_TONES: Record<AvailabilityStatus, string> = {
  'in-stock': 'border-emerald/50 bg-emerald/15 text-[#7FD8B6]',
  'low-stock': 'border-warn/50 bg-warn/15 text-warn',
  'sold-out': 'border-danger/50 bg-danger/10 text-danger',
  hidden: 'border-chrome/30 bg-ink-soft text-chrome-dim',
  draft: 'border-chrome/30 bg-ink-soft text-chrome-dim',
};

export function AvailabilityChip({ status, label }: { status: AvailabilityStatus; label: string }) {
  return <span className={cx(CHIP, ADMIN_STATUS_TONES[status])}>{label}</span>;
}
