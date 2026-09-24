'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BrandImage } from '@/components/ui/BrandImage';
import { Button, ButtonLink } from '@/components/ui/Button';
import { StockBadge, TagBadge } from '@/components/ui/Badge';
import { AgeBadge } from '@/components/ui/Notice';
import { RestockModal } from '@/components/commerce/RestockModal';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { isPurchasable, publicStatus } from '@/lib/inventory';
import { categoryLabel } from '@/lib/mock/catalog';
import { shopifyProductIdFor } from '@/lib/shopify';
import type { Product } from '@/lib/types';

/**
 * Product card.
 * A sold-out card never exposes Add to Cart. It offers a restock notification instead, so
 * a customer can never queue an item the business cannot supply.
 */
export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart();
  const [restockOpen, setRestockOpen] = useState(false);
  const status = publicStatus(product);
  const available = isPurchasable(product);
  // Shopify owns stock, variants and the cart for apparel it is configured for. Adding
  // such a product to this site's cart would strand it somewhere that cannot take payment,
  // so the card sends the customer to the product page and its Shopify buy button instead.
  const soldByShopify = shopifyProductIdFor(product.slug, product.productClass) !== null;
  const isCannabis = product.productClass === 'cannabis';
  const href = product.productClass === 'apparel' ? `/apparel/${product.slug}` : `/shop/${product.slug}`;
  const price = product.salePriceCents ?? product.priceCents;

  return (
    <>
      <article
        className={`group fp-card flex h-full flex-col overflow-hidden transition-transform duration-300 ease-fp hover:-translate-y-1 hover:shadow-lift ${className ?? ''}`}
      >
        <Link href={href} className="relative block focus-visible:outline-offset-[-2px]">
          <BrandImage
            seed={product.media[0]?.placeholderSeed ?? product.slug}
            alt={product.media[0]?.altText ?? product.name}
            ratio="portrait"
            className="transition-transform duration-500 ease-fp group-hover:scale-[1.03]"
          />
          {/* Stock status is the actionable badge, so it keeps the corner at every width.
              Featured and New appear from sm: up, where two badges fit side by side without
              colliding on the two-column phone grid. */}
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-1.5">
            <div className="hidden flex-wrap gap-1.5 sm:flex">
              {product.featured ? <TagBadge tone="bone">Featured</TagBadge> : null}
              {product.isNew ? <TagBadge tone="acid">New</TagBadge> : null}
            </div>
            <StockBadge status={status} className="ml-auto" />
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 text-[10px] uppercase leading-relaxed tracking-[0.08em] text-chrome-dim sm:text-[11px] sm:tracking-[0.16em]">
              {product.brand} &middot; {categoryLabel(product.category)}
            </p>
            {isCannabis ? <AgeBadge className="shrink-0" /> : null}
          </div>
          {/* Featured and New move inline on a phone, where the image corner has no room. */}
          {product.featured || product.isNew ? (
            <div className="flex flex-wrap gap-1.5 sm:hidden">
              {product.featured ? <TagBadge tone="bone">Featured</TagBadge> : null}
              {product.isNew ? <TagBadge tone="acid">New</TagBadge> : null}
            </div>
          ) : null}

          <h3 className="text-[17px] leading-tight">
            <Link href={href} className="transition-colors hover:text-acid">
              {product.name}
            </Link>
          </h3>

          <p className="text-[13px] text-chrome">{product.packageSize}</p>

          {product.productClass !== 'cannabis' ? (
            <p className="text-[11px] uppercase tracking-[0.12em] text-chrome-dim">
              Apparel shipping available
            </p>
          ) : null}

          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="font-display text-xl text-bone">{formatPrice(price)}</span>
            {product.salePriceCents ? (
              <span className="text-[13px] text-chrome-dim line-through">
                {formatPrice(product.priceCents)}
              </span>
            ) : null}
          </div>

          {soldByShopify ? (
            <ButtonLink href={href} size="sm" fullWidth>
              View product
            </ButtonLink>
          ) : available ? (
            <Button size="sm" fullWidth onClick={() => addItem(product, 1)}>
              Add to Cart
            </Button>
          ) : (
            <Button size="sm" variant="secondary" fullWidth onClick={() => setRestockOpen(true)}>
              Notify Me When Available
            </Button>
          )}
        </div>
      </article>

      <RestockModal
        open={restockOpen}
        onClose={() => setRestockOpen(false)}
        productName={product.name}
        isCannabis={isCannabis}
      />
    </>
  );
}
