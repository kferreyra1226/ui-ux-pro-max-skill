import { AVAILABILITY, getSchedule, WEEKDAYS } from '@/lib/mock/availability';
import type { AvailabilityState, DeliveryMode, OwnerStatus, ScheduleKey, Weekday } from '@/lib/types';

/**
 * Availability helpers.
 *
 * TIME ZONE: every schedule is expressed in America/New_York. The prototype formats with
 * Intl and an explicit timeZone so a customer in another zone still sees New York hours.
 * PRODUCTION: evaluate open/closed on the server so a client clock cannot open a window.
 */

export const NY_TZ = 'America/New_York';

export const DELIVERY_MODE_LABELS: Record<DeliveryMode, string> = {
  open: 'Open for requests',
  limited: 'Limited availability',
  'fully-booked': 'Fully booked',
  'temporarily-closed': 'Temporarily closed',
  'closed-until': 'Closed until a set time',
  'closed-today': 'Closed for today',
};

export const OWNER_STATUS_LABELS: Record<OwnerStatus, string> = {
  available: 'Available',
  'reviewing-orders': 'Reviewing orders',
  'packing-orders': 'Packing orders',
  'out-for-delivery': 'Out for delivery',
  'on-break': 'On break',
  unavailable: 'Unavailable',
};

/** Customer-facing message for each delivery mode. Never promises an ETA. */
export function deliveryMessage(state: AvailabilityState = AVAILABILITY): string {
  switch (state.deliveryMode) {
    case 'open':
      return 'Delivery requests are open and reviewed manually before confirmation.';
    case 'limited':
      return 'Delivery requests are limited right now and subject to approval.';
    case 'fully-booked':
      return 'Delivery requests are currently full. Please check back later or choose pickup.';
    case 'temporarily-closed':
      return `Delivery requests are closed. They reopen at ${nextOpening('delivery-requests')}.`;
    case 'closed-until':
      return `Delivery requests are closed. They reopen at ${
        state.closedUntil ? formatNyTime(state.closedUntil) : '[TIME]'
      }.`;
    case 'closed-today':
      return 'Delivery requests are unavailable today.';
  }
}

export function deliveryRequestsOpen(state: AvailabilityState = AVAILABILITY): boolean {
  return state.deliveryMode === 'open' || state.deliveryMode === 'limited';
}

export type AvailabilityTone = 'open' | 'limited' | 'closed';

export function deliveryTone(state: AvailabilityState = AVAILABILITY): AvailabilityTone {
  if (state.deliveryMode === 'open') return 'open';
  if (state.deliveryMode === 'limited') return 'limited';
  return 'closed';
}

/** Formats an ISO timestamp as a New York wall-clock time. */
export function formatNyTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ, hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  }).format(new Date(iso));
}

export function formatNyDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(iso));
}

/** "18:00" -> "6:00 PM". */
export function formatBlockTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function describeDay(key: ScheduleKey, weekday: Weekday): string {
  const d = getSchedule(key).days[weekday];
  if (!d.enabled || d.blocks.length === 0) return 'Closed';
  return d.blocks.map((b) => `${formatBlockTime(b.start)} - ${formatBlockTime(b.end)}`).join(', ');
}

/**
 * The next time this service opens, scanning forward from the current New York weekday.
 * Falls back to a placeholder when the schedule has no enabled day at all.
 */
export function nextOpening(key: ScheduleKey, now: Date = new Date()): string {
  const schedule = getSchedule(key);
  const nyWeekdayIndex = nyWeekday(now);
  for (let offset = 0; offset < 8; offset += 1) {
    const idx = (nyWeekdayIndex + offset) % 7;
    const weekday = WEEKDAYS[idx];
    const dayPlan = schedule.days[weekday.key];
    if (!dayPlan.enabled || dayPlan.blocks.length === 0) continue;
    const opensAt = formatBlockTime(dayPlan.blocks[0].start);
    if (offset === 0) return `${opensAt} today`;
    if (offset === 1) return `${opensAt} tomorrow`;
    return `${opensAt} on ${weekday.label}`;
  }
  return '[NEXT OPENING TIME]';
}

/** 0 = Monday, matching the WEEKDAYS order. */
function nyWeekday(now: Date): number {
  const label = new Intl.DateTimeFormat('en-US', { timeZone: NY_TZ, weekday: 'short' }).format(now);
  const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  return map[label] ?? 0;
}

/** True once the owner is at or over the ceiling they set for a one-person operation. */
export function atCapacity(state: AvailabilityState = AVAILABILITY): boolean {
  return state.activeDeliveries >= state.maxActiveDeliveries;
}
