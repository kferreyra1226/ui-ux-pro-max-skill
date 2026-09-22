'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BrandImage } from '@/components/ui/BrandImage';
import { Button } from '@/components/ui/Button';
import { StockBadge, TagBadge } from '@/components/ui/Badge';
import { AgeBadge } from '@/components/ui/Notice';
import { RestockModal } from '@/components/commerce/RestockModal';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { isPurchasable, publicStatus } from '@/lib/inventory';
import { categoryLabel } from '@/lib/mock/catalog';
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
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.featured ? <TagBadge tone="bone">Featured</TagBadge> : null}
            {product.isNew ? <TagBadge tone="acid">New</TagBadge> : null}
          </div>
          <div className="absolute right-3 top-3">
            <StockBadge status={status} />
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center gap-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-chrome-dim">
              {product.brand} &middot; {categoryLabel(product.category)}
            </p>
            {isCannabis ? <AgeBadge /> : null}
          </div>

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

          {available ? (
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
