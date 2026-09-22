import Link from 'next/link';
import { ProductGallery } from '@/components/commerce/ProductGallery';
import { AddToCartPanel } from '@/components/commerce/AddToCartPanel';
import { ProductCard } from '@/components/commerce/ProductCard';
import { StockBadge } from '@/components/ui/Badge';
import { AgeBadge, Notice } from '@/components/ui/Notice';
import { SectionHeading } from '@/components/site/Section';
import { LEGAL } from '@/lib/config';
import { formatPrice } from '@/lib/format';
import { publicStatus } from '@/lib/inventory';
import { categoryLabel } from '@/lib/mock/catalog';
import { PUBLIC_PRODUCTS } from '@/lib/mock/products';
import type { Product } from '@/lib/types';

/** Shared product detail layout used by both the cannabis menu and the apparel shop. */
export function ProductDetail({ product }: { product: Product }) {
  const isCannabis = product.productClass === 'cannabis';
  const status = publicStatus(product);
  const price = product.salePriceCents ?? product.priceCents;
  const related = PUBLIC_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  ).slice(0, 4);
  const backHref = product.productClass === 'apparel' ? '/apparel' : '/shop';

  return (
    <div className="fp-shell py-8 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-[12px] uppercase tracking-[0.14em] text-chrome-dim">
        <Link href={backHref} className="transition-colors hover:text-bone">
          {product.productClass === 'apparel' ? 'Apparel' : 'Menu'}
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span className="text-chrome">{categoryLabel(product.category)}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery media={product.media} productName={product.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[12px] uppercase tracking-[0.16em] text-chrome-dim">
              {product.brand} &middot; {categoryLabel(product.category)}
            </p>
            {isCannabis ? <AgeBadge /> : null}
          </div>

          <h1 className="mt-3 text-[clamp(1.875rem,6vw,3rem)]">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="font-display text-3xl text-bone">{formatPrice(price)}</span>
            {product.salePriceCents ? (
              <span className="text-[15px] text-chrome-dim line-through">{formatPrice(product.priceCents)}</span>
            ) : null}
            <StockBadge status={status} />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-ink-line py-5 text-[14px]">
            <Spec label="Package size" value={product.packageSize} />
            <Spec label="Format" value={product.format} />
            <Spec label="Brand" value={product.brand} />
            <Spec label="Category" value={categoryLabel(product.category)} />
          </dl>

          <p className="mt-6 text-[15px] leading-relaxed text-bone/85">{product.description}</p>

          <div className="mt-8">
            <AddToCartPanel product={product} sizes={product.apparelInfo?.sizes} />
          </div>

          <div className="mt-6 space-y-3">
            {isCannabis ? (
              <Notice tone="legal" title="Fulfillment">{LEGAL.noShipping}</Notice>
            ) : (
              <Notice tone="neutral" title="Shipping">
                Apparel shipping only &mdash; cannabis products are never shipped.
                {product.apparelInfo ? ` ${product.apparelInfo.shippingInfo}` : ''}
              </Notice>
            )}
            <Notice tone="warning" title="Before you order">
              {LEGAL.productAvailabilityNote}
            </Notice>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- regulated product information */}
      {isCannabis && product.cannabisInfo ? (
        <section className="mt-14 md:mt-20" aria-labelledby="fp-product-info">
          <h2 id="fp-product-info" className="text-[clamp(1.5rem,4.5vw,2rem)]">Product information</h2>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-chrome-dim">
            Every field below is supplied from the licensed inventory record for this specific
            lot. Values shown as bracketed placeholders are not yet connected to the
            seed-to-sale and lab documentation systems.
          </p>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border border-ink-line bg-ink-line md:grid-cols-2">
            <InfoRow label="Ingredients" value={product.cannabisInfo.ingredients} />
            <InfoRow label="Warnings" value={product.cannabisInfo.warnings} />
            <InfoRow label="Potency / cannabinoid information" value={product.cannabisInfo.potency} />
            <InfoRow label="Lot / batch number" value={product.cannabisInfo.lotNumber} />
            <InfoRow label="Expiration date" value={product.cannabisInfo.expirationDate} />
            <InfoRow label="Lab testing / COA" value={product.cannabisInfo.labDocumentUrl} />
            <InfoRow label="Product tracking reference" value={product.cannabisInfo.trackingReference} />
          </dl>
          <Notice tone="legal" title="Responsible use" className="mt-6">
            {LEGAL.responsibleUse}
          </Notice>
        </section>
      ) : null}

      {/* --------------------------------------------------- apparel specifications */}
      {product.apparelInfo ? (
        <section className="mt-14 md:mt-20" aria-labelledby="fp-apparel-info">
          <h2 id="fp-apparel-info" className="text-[clamp(1.5rem,4.5vw,2rem)]">Details</h2>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border border-ink-line bg-ink-line md:grid-cols-2">
            <InfoRow label="Fit notes" value={product.apparelInfo.fitNotes} />
            <InfoRow label="Material" value={product.apparelInfo.material} />
            <InfoRow label="Care" value={product.apparelInfo.careInstructions} />
            <InfoRow label="Colorways" value={product.apparelInfo.colorways.join(', ')} />
            <InfoRow label="Shipping" value={product.apparelInfo.shippingInfo} />
            <InfoRow label="Returns" value={product.apparelInfo.returnPolicy} />
          </dl>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16 md:mt-24" aria-labelledby="fp-related">
          <SectionHeading title="Related products" className="mb-6" />
          <h2 id="fp-related" className="sr-only">Related products</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-chrome-dim">{label}</dt>
      <dd className="mt-0.5 text-bone/90">{value}</dd>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-card p-5">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-chrome-dim">{label}</dt>
      <dd className="mt-2 text-[14px] leading-relaxed text-bone/85">{value}</dd>
    </div>
  );
}
