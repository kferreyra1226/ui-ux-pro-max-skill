import type { AuditLogEntry, InventoryAdjustment } from '@/lib/types';

/**
 * MOCK AUDIT TRAIL. Visible to Super Admin only.
 * PRODUCTION: audit rows are append-only, written server-side inside the same transaction
 * as the change they describe, retained per the business retention policy, and never
 * editable or deletable from the dashboard.
 */
export const AUDIT_LOG: AuditLogEntry[] = [
  { id: 'aud_0031', at: '2026-09-22T10:15:00-04:00', actorId: 'stf_owner', actorName: '[OWNER NAME]', actorRole: 'super-admin', action: 'schedule.changed', subject: 'Delivery request hours - Monday', oldValue: '18:00-22:00', newValue: '18:00-23:00', reason: 'Extended hours for one day', ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'iPhone / Safari' },
  { id: 'aud_0030', at: '2026-09-22T09:55:00-04:00', actorId: 'stf_owner', actorName: '[OWNER NAME]', actorRole: 'super-admin', action: 'delivery.alternative-offered', subject: 'FP-2609-0183', oldValue: 'Awaiting owner review', newValue: 'Alternative time offered', reason: 'Requested window is outside delivery request hours', ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'iPhone / Safari' },
  { id: 'aud_0029', at: '2026-09-22T09:41:00-04:00', actorId: 'stf_inv_01', actorName: '[INVENTORY MANAGER NAME]', actorRole: 'inventory-manager', action: 'inventory.adjusted', subject: 'Foreign Packz Select Flower', oldValue: '6', newValue: '4', reason: 'Sale', ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'Desktop / Chrome' },
  { id: 'aud_0028', at: '2026-09-22T08:31:00-04:00', actorId: 'stf_ord_01', actorName: '[ORDER MANAGER NAME]', actorRole: 'order-manager', action: 'order.status-changed', subject: 'FP-2609-0181', oldValue: 'Confirmed', newValue: 'Being prepared', reason: null, ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'Desktop / Chrome' },
  { id: 'aud_0027', at: '2026-09-22T07:58:00-04:00', actorId: 'unknown', actorName: 'Unknown', actorRole: 'order-manager', action: 'auth.login-failed', subject: '[ORDER MANAGER EMAIL]', oldValue: null, newValue: 'Attempt 3 of 5 before lockout', reason: null, ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'Unrecognised device' },
  { id: 'aud_0026', at: '2026-09-21T20:14:00-04:00', actorId: 'stf_owner', actorName: '[OWNER NAME]', actorRole: 'super-admin', action: 'delivery.accepted', subject: 'FP-2609-0182', oldValue: 'Awaiting owner review', newValue: 'Confirmed - window 8:30 PM - 10:00 PM', reason: 'Stock re-checked at acceptance', ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'iPhone / Safari' },
  { id: 'aud_0025', at: '2026-09-20T19:03:00-04:00', actorId: 'stf_owner', actorName: '[OWNER NAME]', actorRole: 'super-admin', action: 'delivery.declined', subject: 'FP-2509-0180', oldValue: 'Awaiting owner review', newValue: 'Declined', reason: 'Outside service area', ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'iPhone / Safari' },
  { id: 'aud_0024', at: '2026-09-20T08:30:00-04:00', actorId: 'stf_inv_01', actorName: '[INVENTORY MANAGER NAME]', actorRole: 'inventory-manager', action: 'inventory.adjusted', subject: 'Fruit Chews', oldValue: '2', newValue: '0', reason: 'Sale', ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'Desktop / Chrome' },
  { id: 'aud_0023', at: '2026-09-19T16:44:00-04:00', actorId: 'stf_inv_01', actorName: '[INVENTORY MANAGER NAME]', actorRole: 'inventory-manager', action: 'media.uploaded', subject: 'Small Batch Badder - cover photo', oldValue: null, newValue: 'concentrate-a.webp', reason: null, ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'iPhone / Safari' },
  { id: 'aud_0022', at: '2026-09-15T12:00:00-04:00', actorId: 'stf_con_01', actorName: '[CONTENT MANAGER NAME]', actorRole: 'content-manager', action: 'content.updated', subject: 'Homepage hero subheadline', oldValue: 'Premium cannabis. New drops.', newValue: 'Premium adult-use cannabis. Limited streetwear drops.', reason: null, ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'Desktop / Firefox' },
  { id: 'aud_0021', at: '2026-09-12T11:20:00-04:00', actorId: 'stf_owner', actorName: '[OWNER NAME]', actorRole: 'super-admin', action: 'staff.role-changed', subject: '[CONTENT MANAGER NAME]', oldValue: 'Active', newValue: 'Deactivated', reason: 'End of contract', ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'Desktop / Chrome' },
  { id: 'aud_0020', at: '2026-09-01T09:00:00-04:00', actorId: 'stf_owner', actorName: '[OWNER NAME]', actorRole: 'super-admin', action: 'price.changed', subject: 'Carbon Stash Case', oldValue: '$65.00', newValue: '$55.00 sale price', reason: 'Owner-approved promotion', ipAddress: '[IP RECORDED SERVER-SIDE]', device: 'Desktop / Chrome' },
];

export const INVENTORY_ADJUSTMENTS: InventoryAdjustment[] = [
  { id: 'inv_0009', productId: 'prd_flower_select', at: '2026-09-22T09:41:00-04:00', byName: '[INVENTORY MANAGER NAME]', delta: -2, from: 6, to: 4, reason: 'sale', note: 'Counter sale' },
  { id: 'inv_0008', productId: 'prd_flower_select', at: '2026-09-18T09:41:00-04:00', byName: '[OWNER NAME]', delta: 6, from: 0, to: 6, reason: 'restock', note: 'Lot received and logged' },
  { id: 'inv_0007', productId: 'prd_edible_fruit_chews', at: '2026-09-20T08:30:00-04:00', byName: '[INVENTORY MANAGER NAME]', delta: -2, from: 2, to: 0, reason: 'sale', note: '' },
  { id: 'inv_0006', productId: 'prd_app_hoodie', at: '2026-09-20T10:05:00-04:00', byName: '[INVENTORY MANAGER NAME]', delta: -3, from: 12, to: 9, reason: 'sale', note: 'Sizes M and L' },
  { id: 'inv_0005', productId: 'prd_concentrate_badder', at: '2026-09-19T16:44:00-04:00', byName: '[OWNER NAME]', delta: -1, from: 8, to: 7, reason: 'compliance-hold', note: 'Pulled one unit pending COA confirmation' },
];

export const ACTION_LABELS: Record<string, string> = {
  'product.created': 'Product created',
  'product.updated': 'Product edited',
  'product.archived': 'Product archived',
  'inventory.adjusted': 'Inventory changed',
  'price.changed': 'Price changed',
  'order.status-changed': 'Order status changed',
  'delivery.accepted': 'Delivery request accepted',
  'delivery.declined': 'Delivery request declined',
  'delivery.alternative-offered': 'Alternative time offered',
  'staff.role-changed': 'Staff role changed',
  'content.updated': 'Website content updated',
  'settings.changed': 'Settings changed',
  'schedule.changed': 'Schedule changed',
  'media.uploaded': 'Photo uploaded',
  'media.replaced': 'Photo replaced',
  'media.hidden': 'Photo hidden',
  'media.deleted': 'Photo deleted',
  'media.reordered': 'Photos reordered',
  'auth.login-failed': 'Failed login attempt',
  'auth.login-succeeded': 'Admin signed in',
  'report.exported': 'Report exported',
};
