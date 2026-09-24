'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { RestockModal } from '@/components/commerce/RestockModal';
import { ShopifyBuyButton } from '@/components/commerce/ShopifyBuyButton';
import { useCart } from '@/context/CartContext';
import { clampStock, isPurchasable } from '@/lib/inventory';
import { shopifyProductIdFor } from '@/lib/shopify';
import type { Product } from '@/lib/types';

/**
 * Purchase controls.
 *
 * A sold-out product offers a restock notification and nothing else.
 *
 * Apparel with a configured Shopify product takes card payment through Shopify's Buy
 * Button. Everything else — cannabis and accessories — uses this site's own cart, which
 * for cannabis leads to an owner-approved request paid in cash, never a card checkout.
 * `shopifyProductIdFor` returns null for any non-apparel product, so that routing cannot
 * be got wrong from here.
 */
export function AddToCartPanel({ product, sizes }: { product: Product; sizes?: string[] }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(sizes?.[0] ?? '');
  const [restockOpen, setRestockOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const available = isPurchasable(product);
  const stock = clampStock(product.stockQuantity);
  const shopifyProductId = shopifyProductIdFor(product.slug, product.productClass);

  if (!available) {
    return (
      <>
        <div className="space-y-4">
          <div className="rounded-sm border border-ink-line bg-ink-soft px-4 py-4 text-center">
            <p className="font-display text-xl text-chrome">Sold Out</p>
            <p className="mt-1 text-[13px] text-chrome-dim">
              This item is unavailable. Adding it to a cart is disabled.
            </p>
          </div>
          <Button size="lg" fullWidth variant="secondary" onClick={() => setRestockOpen(true)}>
            Notify Me When Available
          </Button>
        </div>
        <RestockModal
          open={restockOpen}
          onClose={() => setRestockOpen(false)}
          productName={product.name}
          isCannabis={product.productClass === 'cannabis'}
        />
      </>
    );
  }

  // Shopify owns the variant selector, stock and price for apparel it is configured for,
  // so this site does not render a second set of controls that could disagree with it.
  if (shopifyProductId) {
    return <ShopifyBuyButton productId={shopifyProductId} productName={product.name} />;
  }

  return (
    <div className="space-y-5">
      {sizes && sizes.length > 1 ? (
        <fieldset>
          <legend className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-chrome">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <label
                key={s}
                className={`min-h-[44px] cursor-pointer select-none rounded-sm border px-4 py-3 text-[14px] font-semibold transition-colors ${
                  size === s ? 'border-bone bg-bone text-ink' : 'border-ink-line text-bone hover:border-chrome/60'
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  value={s}
                  checked={size === s}
                  onChange={() => setSize(s)}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper value={quantity} max={stock} onChange={setQuantity} />
        <p className="text-[13px] text-chrome">
          {stock} {stock === 1 ? 'unit' : 'units'} on hand
        </p>
      </div>

      <Button
        size="lg"
        fullWidth
        onClick={() => {
          addItem(product, quantity);
          setAdded(true);
        }}
      >
        Add to Cart
      </Button>
      <p aria-live="polite" className="sr-only">
        {added ? `${product.name} added to your cart.` : ''}
      </p>
    </div>
  );
}
