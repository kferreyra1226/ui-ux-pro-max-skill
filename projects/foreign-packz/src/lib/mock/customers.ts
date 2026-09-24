import type { Customer } from '@/lib/types';

/**
 * MOCK CUSTOMER RECORDS.
 * PRODUCTION INTEGRATION POINT - Secure database: customer records must be stored
 * encrypted at rest, minimised to what fulfilment requires, and exposed by role.
 * Only Super Admin sees full personal data; Inventory Manager sees none of it.
 */
export const CUSTOMERS: Customer[] = [
  {
    id: 'cus_001', firstName: 'A.', lastName: 'Rivera', email: 'a.rivera@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
    requestCount: 12, completedCount: 11, cancelledCount: 1,
    ageAcknowledgedAt: '2026-09-21T19:02:00-04:00', marketingOptIn: true,
    createdAt: '2026-02-14T18:00:00-05:00', notes: '',
  },
  {
    id: 'cus_002', firstName: 'J.', lastName: 'Okafor', email: 'j.okafor@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
    requestCount: 4, completedCount: 4, cancelledCount: 0,
    ageAcknowledgedAt: '2026-09-20T20:41:00-04:00', marketingOptIn: false,
    createdAt: '2026-06-03T20:00:00-04:00', notes: '',
  },
  {
    id: 'cus_003', firstName: 'M.', lastName: 'Chen', email: 'm.chen@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
    requestCount: 7, completedCount: 4, cancelledCount: 3,
    ageAcknowledgedAt: '2026-09-22T09:30:00-04:00', marketingOptIn: true,
    createdAt: '2026-04-27T15:00:00-04:00', notes: 'Three cancellations in 30 days - flagged for review before acceptance.',
  },
  {
    id: 'cus_004', firstName: 'D.', lastName: 'Santos', email: 'd.santos@[EXAMPLE DOMAIN]', phone: '[CUSTOMER PHONE]',
    requestCount: 1, completedCount: 0, cancelledCount: 0,
    ageAcknowledgedAt: '2026-09-22T10:15:00-04:00', marketingOptIn: true,
    createdAt: '2026-09-22T10:10:00-04:00', notes: 'First request.',
  },
];
