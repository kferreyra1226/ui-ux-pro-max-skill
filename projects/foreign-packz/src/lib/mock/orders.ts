import type { OrderRequest } from '@/lib/types';

/**
 * MOCK ORDER REQUESTS.
 *
 * PRODUCTION INTEGRATION POINT - Transactional order handling:
 * Nothing in this prototype is a confirmed order. Every record starts as a *request* and
 * only a human owner action moves it forward. No status here is reachable automatically:
 * there is no timer, no capacity rule and no slot allocator that can accept a request.
 */
export const ORDER_REQUESTS: OrderRequest[] = [
  {
    id: 'ord_0184',
    reference: 'FP-2609-0184',
    submittedAt: '2026-09-22T10:12:00-04:00',
    customer: {
      firstName: 'D.', lastName: 'Santos', email: 'd.santos@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
      dateOfBirthProvided: true, ageAcknowledged: true, idAcknowledged: true,
    },
    lines: [
      { productId: 'prd_flower_select', name: 'Foreign Packz Select Flower', brand: 'Foreign Packz', productClass: 'cannabis', packageSize: '3.5g', quantity: 1, unitPriceCents: 5500, placeholderSeed: 'flower-select-a' },
      { productId: 'prd_preroll_pack', name: 'Premium Pre-Roll Pack', brand: 'Foreign Packz', productClass: 'cannabis', packageSize: '5 x 0.5g', quantity: 1, unitPriceCents: 4500, placeholderSeed: 'preroll-a' },
    ],
    totals: { cannabisSubtotalCents: 10000, retailSubtotalCents: 0, subtotalCents: 10000, estimatedTaxCents: 1300, totalCents: 11300 },
    status: 'request-received',
    delivery: {
      status: 'awaiting-owner-review',
      addressLine1: '[CUSTOMER ADDRESS LINE 1]', city: 'Brooklyn', state: 'NY', zip: '11221',
      preferredWindow: 'Tonight, 7:00 PM - 9:00 PM', confirmedWindow: null, offeredWindows: [],
      customerResponseDueAt: null, feeCents: 800, meetsMinimum: true, inZone: true, declineReason: null,
    },
    containsCannabis: true, containsShippable: false,
    customerNotes: 'Buzzer is broken, please call on arrival.',
    attentionFlags: ['low-stock'],
    statusHistory: [{ status: 'Request received', at: '2026-09-22T10:12:00-04:00', by: 'Customer' }],
  },
  {
    id: 'ord_0183',
    reference: 'FP-2609-0183',
    submittedAt: '2026-09-22T09:41:00-04:00',
    customer: {
      firstName: 'M.', lastName: 'Chen', email: 'm.chen@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
      dateOfBirthProvided: true, ageAcknowledged: true, idAcknowledged: true,
    },
    lines: [
      { productId: 'prd_vape_live_resin', name: 'Live Resin Vape', brand: 'Halsted Extracts', productClass: 'cannabis', packageSize: '1g', quantity: 2, unitPriceCents: 6000, placeholderSeed: 'vape-a' },
    ],
    totals: { cannabisSubtotalCents: 12000, retailSubtotalCents: 0, subtotalCents: 12000, estimatedTaxCents: 1560, totalCents: 13560 },
    status: 'under-review',
    delivery: {
      status: 'alternative-time-offered',
      addressLine1: '[CUSTOMER ADDRESS LINE 1]', city: 'Queens', state: 'NY', zip: '11385',
      preferredWindow: 'Today, 5:00 PM - 6:00 PM', confirmedWindow: null,
      offeredWindows: ['Today, 7:30 PM - 9:00 PM', 'Tomorrow, 6:00 PM - 8:00 PM'],
      customerResponseDueAt: '2026-09-22T10:25:00-04:00',
      feeCents: 800, meetsMinimum: true, inZone: true, declineReason: null,
    },
    containsCannabis: true, containsShippable: false,
    customerNotes: '',
    attentionFlags: ['repeated-cancellations', 'invalid-time'],
    statusHistory: [
      { status: 'Request received', at: '2026-09-22T09:41:00-04:00', by: 'Customer' },
      { status: 'Under review', at: '2026-09-22T09:48:00-04:00', by: '[OWNER NAME]' },
      { status: 'Alternative time offered', at: '2026-09-22T09:55:00-04:00', by: '[OWNER NAME]', note: 'Requested window falls outside delivery request hours.' },
    ],
  },
  {
    id: 'ord_0182',
    reference: 'FP-2609-0182',
    submittedAt: '2026-09-21T20:04:00-04:00',
    customer: {
      firstName: 'A.', lastName: 'Rivera', email: 'a.rivera@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
      dateOfBirthProvided: true, ageAcknowledged: true, idAcknowledged: true,
    },
    lines: [
      { productId: 'prd_concentrate_badder', name: 'Small Batch Badder', brand: 'Halsted Extracts', productClass: 'cannabis', packageSize: '1g', quantity: 1, unitPriceCents: 5000, placeholderSeed: 'concentrate-a' },
      { productId: 'prd_acc_grinder', name: 'Machined Aluminum Grinder', brand: 'Foreign Packz', productClass: 'accessory', packageSize: '2.5in', quantity: 1, unitPriceCents: 4000, placeholderSeed: 'acc-grinder-a' },
    ],
    totals: { cannabisSubtotalCents: 5000, retailSubtotalCents: 4000, subtotalCents: 9000, estimatedTaxCents: 1170, totalCents: 10170 },
    status: 'confirmed',
    delivery: {
      status: 'confirmed',
      addressLine1: '[CUSTOMER ADDRESS LINE 1]', city: 'Brooklyn', state: 'NY', zip: '11216',
      preferredWindow: 'Yesterday, 8:00 PM - 10:00 PM', confirmedWindow: 'Yesterday, 8:30 PM - 10:00 PM',
      offeredWindows: [], customerResponseDueAt: null,
      feeCents: 800, meetsMinimum: true, inZone: true, declineReason: null,
    },
    containsCannabis: true, containsShippable: false,
    customerNotes: '',
    attentionFlags: [],
    statusHistory: [
      { status: 'Request received', at: '2026-09-21T20:04:00-04:00', by: 'Customer' },
      { status: 'Under review', at: '2026-09-21T20:09:00-04:00', by: '[OWNER NAME]' },
      { status: 'Confirmed', at: '2026-09-21T20:14:00-04:00', by: '[OWNER NAME]', note: 'Inventory re-checked. Window confirmed with the customer.' },
    ],
  },
  {
    id: 'ord_0181',
    reference: 'FP-2609-0181',
    submittedAt: '2026-09-21T14:22:00-04:00',
    customer: {
      firstName: 'J.', lastName: 'Okafor', email: 'j.okafor@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
      dateOfBirthProvided: true, ageAcknowledged: true, idAcknowledged: true,
    },
    lines: [
      { productId: 'prd_app_logo_tee', name: 'Foreign Packz Logo Tee', brand: 'Foreign Packz', productClass: 'apparel', packageSize: 'L', quantity: 2, unitPriceCents: 4500, placeholderSeed: 'tee-front' },
    ],
    totals: { cannabisSubtotalCents: 0, retailSubtotalCents: 9000, subtotalCents: 9000, estimatedTaxCents: 1170, totalCents: 10170 },
    status: 'being-prepared',
    containsCannabis: false, containsShippable: true,
    customerNotes: 'Gift - no receipt in the box please.',
    attentionFlags: [],
    statusHistory: [
      { status: 'Request received', at: '2026-09-21T14:22:00-04:00', by: 'Customer' },
      { status: 'Confirmed', at: '2026-09-21T15:00:00-04:00', by: '[ORDER MANAGER NAME]' },
      { status: 'Being prepared', at: '2026-09-22T08:30:00-04:00', by: '[ORDER MANAGER NAME]', note: 'Apparel-only order. Eligible for shipping.' },
    ],
  },
  {
    id: 'ord_0180',
    reference: 'FP-2509-0180',
    submittedAt: '2026-09-20T18:58:00-04:00',
    customer: {
      firstName: 'M.', lastName: 'Chen', email: 'm.chen@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
      dateOfBirthProvided: true, ageAcknowledged: true, idAcknowledged: true,
    },
    lines: [
      { productId: 'prd_edible_fruit_chews', name: 'Fruit Chews', brand: 'Cross Street Provisions', productClass: 'cannabis', packageSize: '10 pieces', quantity: 1, unitPriceCents: 3000, placeholderSeed: 'edible-a' },
    ],
    totals: { cannabisSubtotalCents: 3000, retailSubtotalCents: 0, subtotalCents: 3000, estimatedTaxCents: 390, totalCents: 3390 },
    status: 'declined',
    delivery: {
      status: 'declined',
      addressLine1: '[CUSTOMER ADDRESS LINE 1]', city: 'Jersey City', state: 'NJ', zip: '07302',
      preferredWindow: 'Tonight, 9:00 PM - 10:00 PM', confirmedWindow: null, offeredWindows: [],
      customerResponseDueAt: null, feeCents: 0, meetsMinimum: false, inZone: false,
      declineReason: 'outside-service-area',
    },
    containsCannabis: true, containsShippable: false,
    customerNotes: '',
    attentionFlags: ['out-of-zone', 'minimum-not-met'],
    statusHistory: [
      { status: 'Request received', at: '2026-09-20T18:58:00-04:00', by: 'Customer' },
      { status: 'Declined', at: '2026-09-20T19:03:00-04:00', by: '[OWNER NAME]', note: 'Address is outside the approved service area. No inventory was reserved.' },
    ],
  },
];

export function getOrderByReference(reference: string): OrderRequest | undefined {
  return ORDER_REQUESTS.find((o) => o.reference.toLowerCase() === reference.toLowerCase());
}
