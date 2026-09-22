import type { Permission, StaffRole, StaffUser } from '@/lib/types';

/**
 * MOCK STAFF DIRECTORY AND ROLE MATRIX.
 *
 * PRODUCTION INTEGRATION POINT - Authentication & authorization:
 * There is no password, hash, token or session secret anywhere in this prototype and there
 * must never be a shared or hard-coded credential. In production each staff member has an
 * individual account with an Argon2id/bcrypt password hash, enforced MFA, an HTTP-only
 * session cookie, CSRF protection, rate limiting, lockout after repeated failures and a
 * server-side permission check on every request. The client-side role check below is a
 * layout affordance, never a security boundary.
 */

export const ROLE_LABELS: Record<StaffRole, string> = {
  'super-admin': 'Super Admin / Owner',
  'inventory-manager': 'Inventory Manager',
  'order-manager': 'Order & Delivery Manager',
  'content-manager': 'Content Manager',
};

export const ROLE_SUMMARY: Record<StaffRole, string> = {
  'super-admin': 'Full access to every admin setting, staff, compliance configuration and audit logs.',
  'inventory-manager':
    'Adds, edits, archives and restocks products. No access to credentials, payment settings, licence information, legal policies or staff roles.',
  'order-manager':
    'Works incoming requests through their statuses and assigns delivery windows. Sees only the customer fields needed to fulfil an order.',
  'content-manager':
    'Edits approved site content, apparel collections, banners and FAQ. No access to inventory, orders, payments, legal notices or permissions.',
};

const ALL_PERMISSIONS: Permission[] = [
  'orders.view', 'orders.update', 'orders.refund', 'delivery.manage',
  'inventory.view', 'inventory.edit', 'products.edit', 'products.archive', 'media.manage',
  'content.edit', 'content.publish', 'customers.view', 'customers.view-full',
  'reports.view', 'reports.export', 'staff.manage', 'audit.view', 'settings.manage',
  'compliance.manage', 'schedule.manage',
];

/** Least privilege: every role below Super Admin gets only what its job needs. */
export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  'super-admin': ALL_PERMISSIONS,
  'inventory-manager': [
    'inventory.view', 'inventory.edit', 'products.edit', 'products.archive',
    'media.manage', 'orders.view', 'reports.view',
  ],
  'order-manager': [
    'orders.view', 'orders.update', 'delivery.manage', 'customers.view', 'inventory.view', 'reports.view',
  ],
  'content-manager': ['content.edit', 'media.manage', 'reports.view'],
};

export function can(role: StaffRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export const STAFF: StaffUser[] = [
  {
    id: 'stf_owner',
    name: '[OWNER NAME]',
    email: '[OWNER EMAIL]',
    role: 'super-admin',
    active: true,
    mfaEnabled: true,
    lastActiveAt: '2026-09-22T09:12:00-04:00',
    createdAt: '2026-01-15T10:00:00-05:00',
  },
  {
    id: 'stf_inv_01',
    name: '[INVENTORY MANAGER NAME]',
    email: '[INVENTORY MANAGER EMAIL]',
    role: 'inventory-manager',
    active: true,
    mfaEnabled: true,
    lastActiveAt: '2026-09-21T17:40:00-04:00',
    createdAt: '2026-03-02T10:00:00-05:00',
  },
  {
    id: 'stf_ord_01',
    name: '[ORDER MANAGER NAME]',
    email: '[ORDER MANAGER EMAIL]',
    role: 'order-manager',
    active: true,
    mfaEnabled: false,
    lastActiveAt: '2026-09-22T08:05:00-04:00',
    createdAt: '2026-05-19T10:00:00-04:00',
  },
  {
    id: 'stf_con_01',
    name: '[CONTENT MANAGER NAME]',
    email: '[CONTENT MANAGER EMAIL]',
    role: 'content-manager',
    active: false,
    mfaEnabled: true,
    lastActiveAt: '2026-08-30T12:20:00-04:00',
    createdAt: '2026-06-11T10:00:00-04:00',
  },
];
