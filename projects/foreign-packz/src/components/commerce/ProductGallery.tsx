'use client';

import { useState } from 'react';
import { BrandImage } from '@/components/ui/BrandImage';
import { cx } from '@/lib/format';
import type { ProductMedia } from '@/lib/types';

/**
 * Product gallery.
 * Mobile: a swipeable, snap-scrolling rail with position dots.
 * Desktop: a large primary image with a thumbnail selector beside it.
 * Draft and hidden media are filtered out before this component ever sees them.
 */
export function ProductGallery({ media, productName }: { media: ProductMedia[]; productName: string }) {
  const published = media
    .filter((m) => m.status === 'published')
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const [active, setActive] = useState(0);

  // No published photo yet - show the branded placeholder, never a broken image.
  const items = published.length > 0
    ? published
    : [{
        id: 'placeholder', placeholderSeed: productName, altText: `${productName} - photo coming soon`,
      } as Pick<ProductMedia, 'id' | 'placeholderSeed' | 'altText'>];

  return (
    <div className="lg:flex lg:gap-4">
      {/* Desktop thumbnails */}
      {items.length > 1 ? (
        <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex" role="group" aria-label="Product images">
          {items.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${items.length}`}
              aria-pressed={i === active}
              className={cx(
                'overflow-hidden rounded-sm border transition-colors',
                i === active ? 'border-bone' : 'border-ink-line hover:border-chrome/60',
              )}
            >
              <BrandImage seed={m.placeholderSeed} alt="" ratio="square" />
            </button>
          ))}
        </div>
      ) : null}

      {/* Desktop primary */}
      <div className="hidden flex-1 lg:block">
        <BrandImage
          seed={items[active].placeholderSeed}
          alt={items[active].altText}
          ratio="portrait"
          className="rounded-lg"
        />
      </div>

      {/* Mobile swipe rail */}
      <div className="lg:hidden">
        <div
          className="fp-rail -mx-[var(--fp-gutter)] gap-3 px-[var(--fp-gutter)]"
          role="region"
          aria-label={`${productName} images, swipe to browse`}
          onScroll={(e) => {
            const el = e.currentTarget;
            const index = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
            setActive(Math.min(items.length - 1, Math.max(0, index)));
          }}
        >
          {items.map((m) => (
            <div key={m.id} className="w-full shrink-0">
              <BrandImage seed={m.placeholderSeed} alt={m.altText} ratio="portrait" className="rounded-lg" />
            </div>
          ))}
        </div>
        {items.length > 1 ? (
          <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
            {items.map((m, i) => (
              <span
                key={m.id}
                className={cx('h-1.5 rounded-full transition-all', i === active ? 'w-5 bg-bone' : 'w-1.5 bg-chrome/40')}
              />
            ))}
          </div>
        ) : null}
        <p className="sr-only" aria-live="polite">
          Image {active + 1} of {items.length}
        </p>
      </div>
    </div>
  );
}
