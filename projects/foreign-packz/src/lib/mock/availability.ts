import type {
  AvailabilityState, DaySchedule, DeliveryZone, DropEvent, ScheduleKey,
  ServiceSchedule, Weekday,
} from '@/lib/types';

export const WEEKDAYS: { key: Weekday; label: string; short: string }[] = [
  { key: 'mon', label: 'Monday', short: 'Mon' },
  { key: 'tue', label: 'Tuesday', short: 'Tue' },
  { key: 'wed', label: 'Wednesday', short: 'Wed' },
  { key: 'thu', label: 'Thursday', short: 'Thu' },
  { key: 'fri', label: 'Friday', short: 'Fri' },
  { key: 'sat', label: 'Saturday', short: 'Sat' },
  { key: 'sun', label: 'Sunday', short: 'Sun' },
];

function day(enabled: boolean, blocks: [string, string][], breaks: [string, string][] = []): DaySchedule {
  return {
    enabled,
    blocks: blocks.map(([start, end]) => ({ start, end })),
    breaks: breaks.map(([start, end]) => ({ start, end, label: 'Break' })),
  };
}

function week(
  weekday: DaySchedule, sat: DaySchedule, sun: DaySchedule,
): Record<Weekday, DaySchedule> {
  return { mon: weekday, tue: weekday, wed: weekday, thu: weekday, fri: weekday, sat, sun };
}

/**
 * OWNER-CONTROLLED SCHEDULES. All times are America/New_York.
 * These windows only decide when a customer may *submit* a request. They never accept one:
 * every request still waits for a manual owner decision.
 */
export const SERVICE_SCHEDULES: ServiceSchedule[] = [
  {
    key: 'delivery-requests',
    label: 'Delivery request hours',
    description: 'When customers may submit a delivery request. Acceptance is always manual.',
    days: week(
      day(true, [['18:00', '22:00']]),
      day(true, [['16:00', '23:00']], [['19:00', '19:30']]),
      day(false, []),
    ),
  },
  {
    key: 'pickup-requests',
    label: 'Pickup request hours',
    description: 'When customers may submit a pickup request at the approved premises.',
    days: week(day(true, [['17:00', '22:30']]), day(true, [['15:00', '23:00']]), day(true, [['15:00', '20:00']])),
  },
  {
    key: 'order-review',
    label: 'Order review hours',
    description: 'When the owner is actively reviewing the request inbox.',
    days: week(day(true, [['17:00', '23:00']]), day(true, [['14:00', '23:30']]), day(true, [['14:00', '21:00']])),
  },
  {
    key: 'apparel-fulfillment',
    label: 'Apparel fulfillment / shipping hours',
    description: 'When apparel orders are packed and handed to a carrier. Apparel only.',
    days: week(day(true, [['10:00', '16:00']]), day(false, []), day(false, [])),
  },
  {
    key: 'customer-support',
    label: 'Customer support hours',
    description: 'When the support inbox and phone line are staffed.',
    days: week(day(true, [['11:00', '19:00']], [['14:00', '14:30']]), day(true, [['12:00', '18:00']]), day(false, [])),
  },
];

export function getSchedule(key: ScheduleKey): ServiceSchedule {
  const found = SERVICE_SCHEDULES.find((s) => s.key === key);
  if (!found) throw new Error(`Unknown schedule: ${key}`);
  return found;
}

/**
 * CURRENT AVAILABILITY. In production this is a single owner-editable row that the
 * customer site reads on every request so a change takes effect immediately.
 */
export const AVAILABILITY: AvailabilityState = {
  deliveryMode: 'limited',
  closedUntil: null,
  pickupOpen: true,
  apparelOnlyMode: false,
  ownerStatus: 'reviewing-orders',
  maxActiveDeliveries: 4,
  activeDeliveries: 3,
  customerResponseMinutes: 20,
  inventoryHoldMinutes: 15,
  customerMessage: '',
  internalNote: 'Running solo tonight. Keeping the queue short.',
  updatedAt: '2026-09-22T10:05:00-04:00',
  updatedBy: '[OWNER NAME]',
};

/** Reasons offered as one-tap chips when the owner changes availability. */
export const OVERRIDE_REASONS = [
  'Out for delivery', 'Restocking', 'Personal appointment', 'Weather', 'Inventory count', 'Holiday',
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone_bk_n', name: '[SERVICE AREA 1 - North]', zips: ['11221', '11237', '11206'], feeCents: 800, minimumOrderCents: 6000, active: true },
  { id: 'zone_bk_c', name: '[SERVICE AREA 2 - Central]', zips: ['11216', '11238', '11217'], feeCents: 800, minimumOrderCents: 6000, active: true },
  { id: 'zone_qn_w', name: '[SERVICE AREA 3 - West]', zips: ['11385', '11101'], feeCents: 1200, minimumOrderCents: 8000, active: true },
  { id: 'zone_hold', name: '[SERVICE AREA 4 - Pending approval]', zips: ['11211'], feeCents: 1200, minimumOrderCents: 8000, active: false },
];

export const DROP_CALENDAR: DropEvent[] = [
  { id: 'drop_04', name: 'Drop 04 - Grid Series', window: '[DROP DATE]', status: 'coming-soon', note: 'Caps and outerwear. Sign up for the drop list to be notified.' },
  { id: 'drop_03', name: 'Drop 03 - Night Shift', window: '[DROP DATE]', status: 'announced', note: 'Hoodie and tote restock.' },
  { id: 'drop_02', name: 'Drop 02 - Bone Monogram', window: '[PAST DROP DATE]', status: 'sold-out', note: 'Sold out. Limited carryover sizes only.' },
];
