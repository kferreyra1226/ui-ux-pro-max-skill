/**
 * Foreign Packz - domain model.
 *
 * These interfaces are shaped like real database tables so the mock data in src/lib/mock
 * can be swapped for a compliant POS / inventory API and a secure database without
 * reshaping the UI layer.
 */

/* ------------------------------------------------------------------ catalog */

export type ProductClass = 'cannabis' | 'apparel' | 'accessory';

export type CannabisCategory =
  | 'flower'
  | 'pre-rolls'
  | 'vapes'
  | 'edibles'
  | 'concentrates';

export type CatalogCategory = CannabisCategory | 'accessories' | 'apparel';

export type AvailabilityStatus = 'in-stock' | 'low-stock' | 'sold-out' | 'hidden' | 'draft';

/** Derived, customer-facing subset of AvailabilityStatus. */
export type PublicStockStatus = 'in-stock' | 'low-stock' | 'sold-out';

export interface ProductMedia {
  id: string;
  /** Deterministic seed for the branded placeholder renderer. Replaced by a storage key. */
  placeholderSeed: string;
  /** Production: signed CDN URL for the optimized derivative. Null while prototype. */
  url: string | null;
  altText: string;
  /** Never rendered on the customer site. */
  internalNote?: string;
  role: 'cover' | 'gallery' | 'front' | 'back' | 'detail' | 'lifestyle' | 'size-guide' | 'colorway';
  status: 'draft' | 'published' | 'hidden';
  sortOrder: number;
  fileName: string;
  fileSizeBytes: number;
  width: number;
  height: number;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
}

/** Regulated product information. Values are owner-supplied placeholders in this prototype. */
export interface CannabisProductInfo {
  ingredients: string;
  warnings: string;
  potency: string;
  lotNumber: string;
  expirationDate: string;
  /** Certificate of analysis. Placeholder until lab documents are hosted. */
  labDocumentUrl: string;
  /** Seed-to-sale identifier from the state tracking system. */
  trackingReference: string;
}

export interface ApparelInfo {
  sizes: string[];
  fitNotes: string;
  material: string;
  careInstructions: string;
  shippingInfo: string;
  returnPolicy: string;
  colorways: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  productClass: ProductClass;
  category: CatalogCategory;
  /** Free-form format label, e.g. "3.5g jar", "Pack of 5", "1g cartridge". */
  format: string;
  packageSize: string;
  description: string;
  /** Price in cents to avoid float rounding. */
  priceCents: number;
  /** Only populated where business policy and applicable law allow a sale price. */
  salePriceCents: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  status: AvailabilityStatus;
  featured: boolean;
  isNew: boolean;
  pickupEligible: boolean;
  deliveryEligible: boolean;
  /** Cannabis is never shippable. Enforced in lib/cart.ts, not just in the UI. */
  shippingEligible: boolean;
  media: ProductMedia[];
  cannabisInfo?: CannabisProductInfo;
  apparelInfo?: ApparelInfo;
  /** Internal only - never serialized to a customer-facing response. */
  staffNotes: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

/* --------------------------------------------------------------------- cart */

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  productClass: ProductClass;
  category: CatalogCategory;
  packageSize: string;
  unitPriceCents: number;
  quantity: number;
  placeholderSeed: string;
  /** Snapshot of stock at the time the line was added; re-checked at checkout. */
  stockAtAdd: number;
}

export interface CartTotals {
  cannabisSubtotalCents: number;
  retailSubtotalCents: number;
  subtotalCents: number;
  estimatedTaxCents: number;
  totalCents: number;
}

/* ------------------------------------------------------------ order request */

export type OrderRequestStatus =
  | 'request-received'
  | 'under-review'
  | 'confirmed'
  | 'being-prepared'
  | 'ready-for-approved-fulfillment'
  | 'completed'
  | 'declined'
  | 'cancelled';

/** Manual delivery approval workflow. Nothing here auto-confirms. */
export type DeliveryRequestStatus =
  | 'awaiting-owner-review'
  | 'alternative-time-offered'
  | 'awaiting-customer-response'
  | 'confirmed'
  | 'being-packed'
  | 'out-for-delivery'
  | 'delivered'
  | 'declined'
  | 'cancelled'
  | 'expired';

export type DeclineReason =
  | 'outside-service-area'
  | 'delivery-unavailable'
  | 'requested-time-unavailable'
  | 'item-out-of-stock'
  | 'minimum-order-not-met'
  | 'unable-to-fulfill'
  | 'other';

export interface OrderRequestLine {
  productId: string;
  name: string;
  brand: string;
  productClass: ProductClass;
  packageSize: string;
  quantity: number;
  unitPriceCents: number;
  placeholderSeed: string;
}

export interface OrderRequest {
  id: string;
  /** Human-readable request number shown to the customer, e.g. FP-2409-0184. */
  reference: string;
  submittedAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    /** Stored only as an acknowledgement flag in this prototype. */
    dateOfBirthProvided: boolean;
    ageAcknowledged: boolean;
    idAcknowledged: boolean;
  };
  lines: OrderRequestLine[];
  totals: CartTotals;
  status: OrderRequestStatus;
  /** Present only when the customer asked for delivery. */
  delivery?: {
    status: DeliveryRequestStatus;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    preferredWindow: string;
    confirmedWindow: string | null;
    offeredWindows: string[];
    /** Owner-configurable response deadline once alternatives are offered. */
    customerResponseDueAt: string | null;
    feeCents: number;
    meetsMinimum: boolean;
    inZone: boolean;
    declineReason: DeclineReason | null;
  };
  containsCannabis: boolean;
  containsShippable: boolean;
  customerNotes: string;
  /** Owner-only triage flags surfaced in the review inbox. */
  attentionFlags: AttentionFlag[];
  statusHistory: { status: string; at: string; by: string; note?: string }[];
}

export type AttentionFlag =
  | 'out-of-zone'
  | 'low-stock'
  | 'duplicate-order'
  | 'invalid-time'
  | 'repeated-cancellations'
  | 'minimum-not-met'
  | 'pending-too-long';

/* ---------------------------------------------------------------- customers */

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Aggregate only. Full personal data is restricted by role. */
  requestCount: number;
  completedCount: number;
  cancelledCount: number;
  ageAcknowledgedAt: string | null;
  marketingOptIn: boolean;
  createdAt: string;
  notes: string;
}

/* ------------------------------------------------------------ staff & roles */

export type StaffRole = 'super-admin' | 'inventory-manager' | 'order-manager' | 'content-manager';

export type Permission =
  | 'orders.view'
  | 'orders.update'
  | 'orders.refund'
  | 'delivery.manage'
  | 'inventory.view'
  | 'inventory.edit'
  | 'products.edit'
  | 'products.archive'
  | 'media.manage'
  | 'content.edit'
  | 'content.publish'
  | 'customers.view'
  | 'customers.view-full'
  | 'reports.view'
  | 'reports.export'
  | 'staff.manage'
  | 'audit.view'
  | 'settings.manage'
  | 'compliance.manage'
  | 'schedule.manage';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  mfaEnabled: boolean;
  lastActiveAt: string;
  createdAt: string;
}

/* -------------------------------------------------------------- audit trail */

export type AuditAction =
  | 'product.created'
  | 'product.updated'
  | 'product.archived'
  | 'inventory.adjusted'
  | 'price.changed'
  | 'order.status-changed'
  | 'delivery.accepted'
  | 'delivery.declined'
  | 'delivery.alternative-offered'
  | 'staff.role-changed'
  | 'content.updated'
  | 'settings.changed'
  | 'schedule.changed'
  | 'media.uploaded'
  | 'media.replaced'
  | 'media.hidden'
  | 'media.deleted'
  | 'media.reordered'
  | 'auth.login-failed'
  | 'auth.login-succeeded'
  | 'report.exported';

export interface AuditLogEntry {
  id: string;
  at: string;
  actorId: string;
  actorName: string;
  actorRole: StaffRole;
  action: AuditAction;
  /** What the action affected, e.g. "Foreign Packz Select Flower" or "FP-2409-0184". */
  subject: string;
  oldValue: string | null;
  newValue: string | null;
  reason: string | null;
  /** Recorded server-side in production; shown here as a placeholder. */
  ipAddress: string;
  device: string;
}

export type InventoryAdjustmentReason =
  | 'restock'
  | 'sale'
  | 'damage'
  | 'expired'
  | 'return'
  | 'compliance-hold'
  | 'inventory-correction'
  | 'other';

export interface InventoryAdjustment {
  id: string;
  productId: string;
  at: string;
  byName: string;
  delta: number;
  from: number;
  to: number;
  reason: InventoryAdjustmentReason;
  note: string;
}

/* -------------------------------------------------- hours, zones, availability */

export interface TimeBlock {
  start: string; // "18:00" in America/New_York
  end: string; // "22:00"
  label?: string;
}

export interface DaySchedule {
  enabled: boolean;
  blocks: TimeBlock[];
  breaks: TimeBlock[];
}

export type ScheduleKey =
  | 'delivery-requests'
  | 'pickup-requests'
  | 'order-review'
  | 'apparel-fulfillment'
  | 'customer-support';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ServiceSchedule {
  key: ScheduleKey;
  label: string;
  description: string;
  days: Record<Weekday, DaySchedule>;
}

export type DeliveryMode =
  | 'open'
  | 'limited'
  | 'fully-booked'
  | 'temporarily-closed'
  | 'closed-until'
  | 'closed-today';

export type OwnerStatus =
  | 'available'
  | 'reviewing-orders'
  | 'packing-orders'
  | 'out-for-delivery'
  | 'on-break'
  | 'unavailable';

export interface AvailabilityState {
  deliveryMode: DeliveryMode;
  /** ISO timestamp used when deliveryMode is 'closed-until'. */
  closedUntil: string | null;
  pickupOpen: boolean;
  apparelOnlyMode: boolean;
  ownerStatus: OwnerStatus;
  /** Owner-set ceiling for a one-person operation. */
  maxActiveDeliveries: number;
  activeDeliveries: number;
  /** Minutes a customer has to answer an alternative-time offer. */
  customerResponseMinutes: number;
  /** Minutes a temporary inventory hold survives before automatic release. 0 disables holds. */
  inventoryHoldMinutes: number;
  customerMessage: string;
  internalNote: string;
  updatedAt: string;
  updatedBy: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  zips: string[];
  feeCents: number;
  minimumOrderCents: number;
  active: boolean;
}

/* ------------------------------------------------------------ site content */

export interface ContentBlock {
  id: string;
  key: string;
  label: string;
  area: 'homepage' | 'apparel' | 'about' | 'faq' | 'support' | 'policy' | 'banner';
  value: string;
  /** Legal / compliance copy needs Super Admin approval before it can publish. */
  requiresOwnerApproval: boolean;
  status: 'published' | 'pending-approval' | 'draft';
  updatedAt: string;
  updatedBy: string;
}

export interface FaqItem {
  id: string;
  category: 'adult-use-access' | 'orders' | 'products' | 'apparel' | 'support';
  question: string;
  answer: string;
}

export interface DropEvent {
  id: string;
  name: string;
  window: string;
  status: 'announced' | 'coming-soon' | 'sold-out';
  note: string;
}
