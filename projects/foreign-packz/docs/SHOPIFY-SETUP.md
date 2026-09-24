# Turning on Shopify checkout for apparel

Apparel takes card payment through Shopify. Cannabis does not, and cannot: Shopify's
acceptable use policy prohibits anything over 0.3% THC. Cannabis stays on this site as a
cash, request-based flow that a person approves.

The integration is already built. It stays dormant until the three values in
`src/lib/shopify.ts` are filled in, so an unconfigured deployment behaves exactly as it
does today rather than showing a broken buy button.

## What the owner does in Shopify

1. Create the Shopify account. The Starter plan (about $5/month) includes Buy Buttons.
   When signing up, disclose that the brand is associated with a cannabis business and keep
   the written approval. Selling apparel is permitted; the risk is an underwriter finding
   the association later and freezing the account.
2. Add each apparel product, with a **variant per size** carrying its own stock count.
3. Go to **Sales channels → Buy Button** and create a Buy Button for any one product.
   The generated snippet contains the two values needed below. Copy them, then discard the
   snippet — the code here builds the button itself.
4. Open each apparel product in the admin. The numeric ID at the end of the URL
   (`/admin/products/1234567890`) is that product's Shopify product ID.

## What goes in the code

Edit `src/lib/shopify.ts`:

```ts
export const SHOPIFY_DOMAIN = 'your-store.myshopify.com';
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'the token from the Buy Button snippet';

export const PRODUCT_IDS: Record<string, string> = {
  'foreign-packz-logo-tee': '1234567890',
  'monogram-heavyweight-hoodie': '2345678901',
  'city-grid-cap': '3456789012',
  'canvas-carry-tote': '4567890123',
};
```

Then rebuild and deploy:

```bash
npm run build:preview
```

The storefront access token is a **public, read-only client credential**. Shopify intends
it to appear in page source. It is not a secret. An **Admin API** token is a secret and must
never appear in this file or anywhere client-side.

## What changes on the site

| | Before | After |
| --- | --- | --- |
| Apparel product page | This site's Add to Cart | Shopify variant picker and Add to Cart |
| Apparel cards | Add to Cart | View product |
| Apparel cart | This site's cart | Shopify's cart, checkout on Shopify's domain |
| Cannabis and accessories | Unchanged | Unchanged |

A customer may hold a cannabis request on this site and an apparel order in Shopify at the
same time. They do not merge, and they must not.

## Safeguards

`shopifyProductIdFor` returns null for any product that is not apparel, whatever
`PRODUCT_IDS` contains. Mapping a cannabis slug to a Shopify ID by mistake does nothing.
That guard is covered by a test, and it is the reason this routing cannot be got wrong from
a calling component.

An apparel product with no mapped ID falls back to this site's own cart, so a partial
rollout is safe.

If Shopify's script fails to load, the page shows a message pointing the customer at
support rather than a dead button.

## Shipping labels

Install the **Pirate Ship** app from the Shopify App Store. It imports paid, unfulfilled
orders, prints discounted USPS and UPS labels, then marks the order fulfilled in Shopify and
sends the tracking number back to the customer. It is free; you pay postage only.

## Still required before taking real money

- Business entity and bank account for the apparel side, separate from cannabis
- The real return policy and shipping window, replacing the placeholders on the site
- The remaining bracketed business details in `src/lib/config.ts`
