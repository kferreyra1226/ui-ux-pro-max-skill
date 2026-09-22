import type { AvailabilityStatus, Product, PublicStockStatus } from '@/lib/types';

/**
 * Inventory rules.
 *
 * PRODUCTION INTEGRATION POINT - Live inventory:
 * These helpers derive display state from a quantity. The authoritative quantity, the
 * temporary hold and the permanent deduction all belong in a transactional server-side
 * store so two customers cannot both take the last unit. Deduction happens only after a
 * human owner accepts a request - never on submit.
 */

/** Stock can never go below zero, in the UI or anywhere else. */
export function clampStock(quantity: number): number {
  return Math.max(0, Math.floor(quantity));
}

/** Zero stock always reads Sold Out, whatever the stored status says. */
export function derivedStatus(product: Pick<Product, 'stockQuantity' | 'lowStockThreshold' | 'status'>): AvailabilityStatus {
  if (product.status === 'hidden' || product.status === 'draft') return product.status;
  const qty = clampStock(product.stockQuantity);
  if (qty === 0) return 'sold-out';
  if (qty <= product.lowStockThreshold) return 'low-stock';
  return 'in-stock';
}

export function publicStatus(product: Pick<Product, 'stockQuantity' | 'lowStockThreshold' | 'status'>): PublicStockStatus {
  const status = derivedStatus(product);
  return status === 'hidden' || status === 'draft' ? 'sold-out' : status;
}

export function isPurchasable(product: Pick<Product, 'stockQuantity' | 'lowStockThreshold' | 'status'>): boolean {
  return publicStatus(product) !== 'sold-out';
}

export const STOCK_LABELS: Record<PublicStockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'sold-out': 'Sold Out',
};

export const STATUS_LABELS: Record<AvailabilityStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'sold-out': 'Sold Out',
  hidden: 'Hidden',
  draft: 'Draft',
};

export const ADJUSTMENT_REASONS = [
  { value: 'restock', label: 'Restock' },
  { value: 'sale', label: 'Sale' },
  { value: 'damage', label: 'Damage' },
  { value: 'expired', label: 'Expired product' },
  { value: 'return', label: 'Return' },
  { value: 'compliance-hold', label: 'Compliance hold' },
  { value: 'inventory-correction', label: 'Inventory correction' },
  { value: 'other', label: 'Other' },
] as const;

/** Total retail value of on-hand stock. Placeholder metric until the POS is connected. */
export function inventoryValueCents(products: Product[]): number {
  return products
    .filter((p) => !p.archived)
    .reduce((sum, p) => sum + clampStock(p.stockQuantity) * (p.salePriceCents ?? p.priceCents), 0);
}
