/**
 * Shopify Buy Button configuration — APPAREL ONLY.
 *
 * Shopify's acceptable use policy prohibits anything over 0.3% THC, so no cannabis product
 * may ever be mapped here. `shopifyProductIdFor` refuses a non-apparel product outright
 * rather than relying on the caller to remember.
 *
 * Cannabis stays on this site as a cash, request-based flow that a person approves. Apparel
 * moves to Shopify for card payment and shipping. That split is a platform rule, not a
 * preference.
 *
 * TO GO LIVE, fill in the three values below from the Shopify admin:
 *   1. Sales channels → Buy Button → create a product Buy Button. The generated snippet
 *      contains `domain` and `storefrontAccessToken`.
 *   2. Copy each apparel product's numeric Shopify product ID into PRODUCT_IDS, keyed by
 *      the slug used in src/lib/mock/products.ts.
 * Until then `isShopifyConfigured` is false and the site keeps its current behaviour, so an
 * unconfigured deployment never ships a broken buy button.
 *
 * The storefront access token is a public, read-only client credential. Shopify intends it
 * to appear in page source. It is NOT a secret and must never be confused with an Admin API
 * token, which is a secret and must never appear in this file or anywhere client-side.
 */

export const SHOPIFY_DOMAIN = '';
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = '';

/** Maps this site's apparel slugs to Shopify product IDs. */
export const PRODUCT_IDS: Record<string, string> = {
  'foreign-packz-logo-tee': '',
  'monogram-heavyweight-hoodie': '',
  'city-grid-cap': '',
  'canvas-carry-tote': '',
};

export const isShopifyConfigured =
  SHOPIFY_DOMAIN.length > 0 && SHOPIFY_STOREFRONT_ACCESS_TOKEN.length > 0;

/**
 * The Shopify product ID for an apparel slug, or null.
 *
 * Returns null for any product that is not apparel, whatever PRODUCT_IDS contains. This is
 * the code-level guarantee that cannabis can never reach a Shopify checkout.
 */
export function shopifyProductIdFor(
  slug: string,
  productClass: 'cannabis' | 'apparel' | 'accessory',
): string | null {
  if (productClass !== 'apparel') return null;
  if (!isShopifyConfigured) return null;
  const id = PRODUCT_IDS[slug];
  return id && id.length > 0 ? id : null;
}

/** Buy Button JS SDK, loaded from Shopify's CDN on apparel pages only. */
export const BUY_BUTTON_SDK_URL =
  'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

/**
 * Brand styling passed to the Buy Button so Shopify's injected UI matches the site.
 * Values mirror the design tokens in tailwind.config.ts.
 */
export const BUY_BUTTON_STYLES = {
  emerald: '#1C614A',
  emeraldHover: '#25765C',
  bone: '#F4F0E8',
  ink: '#101010',
  inkCard: '#1B1B1B',
  inkLine: '#2A2A2A',
  chrome: '#B7B7B7',
} as const;
