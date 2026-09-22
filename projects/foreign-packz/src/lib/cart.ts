import { TAX_PLACEHOLDER_RATE } from '@/lib/config';
import type { CartLine, CartTotals, Product } from '@/lib/types';

/**
 * Cart rules.
 *
 * The single hard rule enforced here rather than in the UI: a cannabis line is never
 * shippable, so a cart containing cannabis can never reach an apparel shipping flow.
 * `shippingEligible` on a cannabis product is ignored by design.
 */

export function isCannabis(line: Pick<CartLine, 'productClass'>): boolean {
  return line.productClass === 'cannabis';
}

export function lineIsShippable(line: Pick<CartLine, 'productClass'>): boolean {
  return line.productClass !== 'cannabis';
}

export function cartHasCannabis(lines: CartLine[]): boolean {
  return lines.some(isCannabis);
}

export function cartHasRetail(lines: CartLine[]): boolean {
  return lines.some((l) => !isCannabis(l));
}

export type CartKind = 'empty' | 'cannabis-only' | 'retail-only' | 'mixed';

export function cartKind(lines: CartLine[]): CartKind {
  if (lines.length === 0) return 'empty';
  const cannabis = cartHasCannabis(lines);
  const retail = cartHasRetail(lines);
  if (cannabis && retail) return 'mixed';
  return cannabis ? 'cannabis-only' : 'retail-only';
}

/** Shipping is offered only when every line in the cart is a non-cannabis item. */
export function shippingAllowed(lines: CartLine[]): boolean {
  return lines.length > 0 && lines.every(lineIsShippable);
}

export function totals(lines: CartLine[]): CartTotals {
  const cannabisSubtotalCents = lines
    .filter(isCannabis)
    .reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
  const retailSubtotalCents = lines
    .filter((l) => !isCannabis(l))
    .reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
  const subtotalCents = cannabisSubtotalCents + retailSubtotalCents;
  // PRODUCTION INTEGRATION POINT - Tax: replace with the connected tax engine.
  // New York adult-use cannabis carries excise and local taxes this flat rate does not model.
  const estimatedTaxCents = Math.round(subtotalCents * TAX_PLACEHOLDER_RATE);
  return {
    cannabisSubtotalCents,
    retailSubtotalCents,
    subtotalCents,
    estimatedTaxCents,
    totalCents: subtotalCents + estimatedTaxCents,
  };
}

export function toCartLine(product: Product, quantity: number): CartLine {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    productClass: product.productClass,
    category: product.category,
    packageSize: product.packageSize,
    unitPriceCents: product.salePriceCents ?? product.priceCents,
    quantity,
    placeholderSeed: product.media[0]?.placeholderSeed ?? product.slug,
    stockAtAdd: product.stockQuantity,
  };
}

export function countItems(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.quantity, 0);
}

/** Generates a request reference for the prototype. Production issues this server-side. */
export function generateReference(now: Date = new Date()): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `FP-${yy}${mm}-${seq}`;
}
