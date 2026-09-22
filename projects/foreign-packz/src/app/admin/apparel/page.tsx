'use client';

import { AdminPageHeader, DataTable, MockDataBanner, RequirePermission, type Column } from '@/components/admin/primitives';
import { AvailabilityChip, TagBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { formatPrice } from '@/lib/format';
import { STATUS_LABELS, derivedStatus } from '@/lib/inventory';
import { DROP_CALENDAR } from '@/lib/mock/availability';
import { PRODUCTS } from '@/lib/mock/products';
import type { Product } from '@/lib/types';

const APPAREL = PRODUCTS.filter((p) => p.productClass === 'apparel');

export default function AdminApparelPage() {
  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Item',
      render: (p) => (
        <div>
          <p className="font-semibold text-bone">{p.name}</p>
          <p className="mt-0.5 text-[12px] text-chrome-dim">{p.sku} &middot; {p.format}</p>
        </div>
      ),
    },
    { key: 'sizes', header: 'Sizes', hideOnMobile: true, render: (p) => p.apparelInfo?.sizes.join(', ') ?? '-' },
    { key: 'colors', header: 'Colorways', hideOnMobile: true, render: (p) => p.apparelInfo?.colorways.join(', ') ?? '-' },
    { key: 'price', header: 'Price', align: 'right', render: (p) => <span className="tabular-nums">{formatPrice(p.priceCents)}</span> },
    { key: 'stock', header: 'On hand', align: 'right', render: (p) => <span className="tabular-nums">{p.stockQuantity}</span> },
    { key: 'status', header: 'Availability', render: (p) => <AvailabilityChip status={derivedStatus(p)} label={STATUS_LABELS[derivedStatus(p)]} /> },
    { key: 'media', header: 'Photos', align: 'right', hideOnMobile: true, render: (p) => <span className="tabular-nums text-chrome">{p.media.length}</span> },
    { key: 'actions', header: 'Actions', align: 'right', render: () => <Button size="sm" variant="secondary">Edit</Button> },
  ];

  return (
    <RequirePermission permission="products.edit">
      <AdminPageHeader
        title="Apparel"
        description="Drops, sizes, colorways and campaign media. Apparel is the only shippable part of the catalog."
        actions={<Button>Add apparel item</Button>}
      />
      <MockDataBanner>Apparel records are mock data. Nothing saved here persists.</MockDataBanner>

      <Notice tone="legal" className="mb-6" title="Shipping">
        Apparel and non-cannabis accessories are the only items eligible for shipping.
        Cannabis is never shipped. Keep apparel fulfilment hours separate from cannabis
        request hours on the Hours &amp; Availability screen.
      </Notice>

      <DataTable columns={columns} rows={APPAREL} getKey={(p) => p.id} caption="Apparel" />

      <section className="mt-10" aria-labelledby="fp-drops">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="fp-drops" className="text-xl">Drop calendar</h2>
          <Button size="sm" variant="secondary">Add drop</Button>
        </div>
        <ul className="grid gap-3 md:grid-cols-3">
          {DROP_CALENDAR.map((drop) => (
            <li key={drop.id} className="rounded-lg border border-ink-line bg-ink-card p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.14em] text-chrome-dim">{drop.window}</span>
                <TagBadge tone={drop.status === 'sold-out' ? 'chrome' : 'emerald'}>{drop.status}</TagBadge>
              </div>
              <h3 className="mt-2 text-[17px]">{drop.name}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-chrome">{drop.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="fp-apparel-media">
        <h2 id="fp-apparel-media" className="text-xl">Apparel media roles</h2>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-chrome">
          Each apparel item supports front, back, detail, on-body lifestyle, size guide and
          colorway images, plus an association to a lookbook campaign. Manage them in the
          Product Photos section of the product editor or from the Media Library.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {['Front', 'Back', 'Detail / close-up', 'On-body lifestyle', 'Size guide', 'Colorway', 'Lookbook / campaign'].map((role) => (
            <li key={role}><TagBadge>{role}</TagBadge></li>
          ))}
        </ul>
      </section>
    </RequirePermission>
  );
}
