'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/commerce/ProductCard';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/Field';
import { cx } from '@/lib/format';
import { publicStatus } from '@/lib/inventory';
import { CATEGORIES } from '@/lib/mock/catalog';
import type { CatalogCategory, Product } from '@/lib/types';

type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';
type AvailabilityFilter = 'any' | 'in-stock' | 'low-stock' | 'sold-out';

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
];

const PRICE_RANGES = [
  { value: 'any', label: 'Any price', min: 0, max: Infinity },
  { value: 'under-40', label: 'Under $40', min: 0, max: 3999 },
  { value: '40-60', label: '$40 - $60', min: 4000, max: 6000 },
  { value: 'over-60', label: 'Over $60', min: 6001, max: Infinity },
];

/**
 * Cannabis menu with filters.
 * Filtering is client-side over mock data. PRODUCTION: move this to a server query against
 * the live inventory system so a customer never sees a stale quantity.
 */
export function ShopFilters({
  products, brands, formats,
}: {
  products: Product[];
  brands: string[];
  formats: string[];
}) {
  // Deep links such as /shop?category=flower are read here rather than on the server, so
  // the menu stays a static document.
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? undefined;
  const initialSort = searchParams.get('sort') ?? undefined;

  const [category, setCategory] = useState<CatalogCategory | 'all'>(
    (CATEGORIES.some((c) => c.slug === initialCategory) ? (initialCategory as CatalogCategory) : 'all'),
  );
  const [brand, setBrand] = useState('all');
  const [format, setFormat] = useState('all');
  const [priceRange, setPriceRange] = useState('any');
  const [availability, setAvailability] = useState<AvailabilityFilter>('any');
  const [sort, setSort] = useState<SortKey>(
    SORTS.some((s) => s.value === initialSort) ? (initialSort as SortKey) : 'featured',
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.value === priceRange) ?? PRICE_RANGES[0];
    const filtered = products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      if (format !== 'all' && p.format !== format) return false;
      const price = p.salePriceCents ?? p.priceCents;
      if (price < range.min || price > range.max) return false;
      if (availability !== 'any' && publicStatus(p) !== availability) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (a.salePriceCents ?? a.priceCents) - (b.salePriceCents ?? b.priceCents));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.salePriceCents ?? b.priceCents) - (a.salePriceCents ?? a.priceCents));
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [products, category, brand, format, priceRange, availability, sort]);

  const activeCount =
    (category !== 'all' ? 1 : 0) + (brand !== 'all' ? 1 : 0) + (format !== 'all' ? 1 : 0) +
    (priceRange !== 'any' ? 1 : 0) + (availability !== 'any' ? 1 : 0);

  function reset() {
    setCategory('all');
    setBrand('all');
    setFormat('all');
    setPriceRange('any');
    setAvailability('any');
  }

  return (
    <div>
      {/* Category rail - the fastest filter, always visible and thumb-reachable */}
      <div className="fp-rail -mx-[var(--fp-gutter)] mb-5 px-[var(--fp-gutter)]" role="group" aria-label="Filter by category">
        <CategoryChip label="All" active={category === 'all'} onClick={() => setCategory('all')} />
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.slug}
            label={c.label}
            active={category === c.slug}
            onClick={() => setCategory(c.slug)}
          />
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="fp-filter-panel"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-ink-line px-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:bg-bone/5"
        >
          Filters
          {activeCount > 0 ? (
            <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-emerald px-1 text-[11px] text-white">
              {activeCount}
            </span>
          ) : null}
        </button>

        <div className="flex items-center gap-3">
          <p aria-live="polite" className="text-[13px] text-chrome">
            {visible.length} {visible.length === 1 ? 'product' : 'products'}
          </p>
          <label className="sr-only" htmlFor="fp-sort">Sort by</label>
          <select
            id="fp-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="min-h-[44px] rounded-sm border border-ink-line bg-ink-soft px-3 text-[13px] text-bone"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>Sort: {s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtersOpen ? (
        <div id="fp-filter-panel" className="fp-card mb-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </SelectField>
          <SelectField label="Product format" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="all">All formats</option>
            {formats.map((f) => <option key={f} value={f}>{f}</option>)}
          </SelectField>
          <SelectField label="Price range" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            {PRICE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </SelectField>
          <SelectField
            label="Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value as AvailabilityFilter)}
          >
            <option value="any">Any availability</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="sold-out">Sold Out</option>
          </SelectField>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button variant="ghost" size="sm" onClick={reset} disabled={activeCount === 0}>
              Clear all filters
            </Button>
          </div>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <div className="fp-card p-10 text-center">
          <p className="text-[15px] text-chrome">No products match these filters.</p>
          <Button variant="secondary" size="sm" className="mt-5" onClick={reset}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {visible.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'min-h-[44px] shrink-0 rounded-sm border px-4 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors',
        active
          ? 'border-bone bg-bone text-ink'
          : 'border-ink-line text-chrome hover:border-chrome/60 hover:text-bone',
      )}
    >
      {label}
    </button>
  );
}
