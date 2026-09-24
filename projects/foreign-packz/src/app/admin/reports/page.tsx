'use client';

import { useState } from 'react';
import { AdminPageHeader, ConfirmAction, DataTable, MockDataBanner, RequirePermission, StatCard, type Column } from '@/components/admin/primitives';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { OrderStatusChip } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/format';
import { derivedStatus, inventoryValueCents } from '@/lib/inventory';
import { ORDER_REQUESTS } from '@/lib/mock/orders';
import { PRODUCTS } from '@/lib/mock/products';
import type { Product } from '@/lib/types';

/** Reports. Every figure is illustrative until the POS and a secure database are connected. */
export default function AdminReportsPage() {
  const [exporting, setExporting] = useState(false);
  const lowStock = PRODUCTS.filter((p) => derivedStatus(p) === 'low-stock' || derivedStatus(p) === 'sold-out');

  // Illustrative engagement figures. Real values require analytics that has been privacy
  // reviewed so cannabis purchase behaviour never leaks to an ad network.
  const engagement = PRODUCTS.slice(0, 6).map((p, i) => ({
    product: p,
    views: 480 - i * 62,
    addToCart: 140 - i * 18,
  }));

  const inventoryColumns: Column<Product>[] = [
    { key: 'name', header: 'Product', render: (p) => <span className="font-semibold text-bone">{p.name}</span> },
    { key: 'sku', header: 'SKU', hideOnMobile: true, render: (p) => <code className="text-chrome">{p.sku}</code> },
    { key: 'stock', header: 'On hand', align: 'right', render: (p) => <span className="tabular-nums">{p.stockQuantity}</span> },
    { key: 'threshold', header: 'Threshold', align: 'right', hideOnMobile: true, render: (p) => <span className="tabular-nums text-chrome">{p.lowStockThreshold}</span> },
    { key: 'value', header: 'Value at retail', align: 'right', render: (p) => <span className="tabular-nums">{formatPrice(p.stockQuantity * (p.salePriceCents ?? p.priceCents))}</span> },
  ];

  return (
    <RequirePermission permission="reports.view">
      <AdminPageHeader
        title="Reports"
        description="Sales, inventory, engagement and request-status reporting."
        actions={<Button variant="secondary" onClick={() => setExporting(true)}>Export</Button>}
      />

      <MockDataBanner>
        Every number on this screen is mock data. Reports are meaningful only once connected
        to the licensed POS and a secure production database.
      </MockDataBanner>

      <section aria-labelledby="fp-sales" className="mb-8">
        <h2 id="fp-sales" className="mb-4 text-xl">Sales</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Today" value="[POS FIGURE]" note="From the licensed POS." />
          <StatCard label="This week" value="[POS FIGURE]" note="From the licensed POS." />
          <StatCard label="This month" value="[POS FIGURE]" note="From the licensed POS." />
          <StatCard label="Apparel performance" value="[APPAREL FIGURE]" note="Tracked separately from cannabis." />
        </div>
      </section>

      <section aria-labelledby="fp-inv-report" className="mb-8">
        <h2 id="fp-inv-report" className="mb-2 text-xl">Inventory report</h2>
        <p className="mb-4 text-[13px] text-chrome">
          Total value at retail across all active products: {formatPrice(inventoryValueCents(PRODUCTS))} (placeholder).
        </p>
        <DataTable columns={inventoryColumns} rows={PRODUCTS.filter((p) => !p.archived)} getKey={(p) => p.id} caption="Inventory report" />
      </section>

      <section aria-labelledby="fp-low-report" className="mb-8">
        <h2 id="fp-low-report" className="mb-4 text-xl">Low stock and sold out</h2>
        <DataTable
          columns={inventoryColumns}
          rows={lowStock}
          getKey={(p) => p.id}
          caption="Low stock report"
          empty="Nothing is low or sold out right now."
        />
      </section>

      <section aria-labelledby="fp-engagement" className="mb-8">
        <h2 id="fp-engagement" className="mb-4 text-xl">Most viewed and most added to cart</h2>
        <div className="overflow-x-auto rounded-lg border border-ink-line">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <caption className="sr-only">Product engagement</caption>
            <thead>
              <tr className="bg-ink-soft">
                {['Product', 'Views', 'Added to cart', 'Add rate'].map((h, i) => (
                  <th key={h} scope="col" className={`px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-chrome-dim ${i > 0 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-line bg-ink-card">
              {engagement.map((row) => (
                <tr key={row.product.id}>
                  <td className="px-4 py-3 text-[13px] text-bone/90">{row.product.name}</td>
                  <td className="px-4 py-3 text-right text-[13px] tabular-nums text-chrome">{row.views}</td>
                  <td className="px-4 py-3 text-right text-[13px] tabular-nums text-chrome">{row.addToCart}</td>
                  <td className="px-4 py-3 text-right text-[13px] tabular-nums text-bone/90">
                    {Math.round((row.addToCart / row.views) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-chrome-dim">
          Engagement figures are illustrative. Analytics must be privacy reviewed before
          launch so that cannabis browsing or purchase behaviour is never shared with an
          advertising network.
        </p>
      </section>

      <section aria-labelledby="fp-status-report">
        <h2 id="fp-status-report" className="mb-4 text-xl">Order-request status report</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER_REQUESTS.map((o) => (
            <li key={o.id} className="rounded-lg border border-ink-line bg-ink-card p-4">
              <p className="font-semibold text-bone">{o.reference}</p>
              <p className="mt-1 text-[12px] text-chrome-dim">{formatPrice(o.totals.totalCents)}</p>
              <div className="mt-2"><OrderStatusChip status={o.status} /></div>
            </li>
          ))}
        </ul>
      </section>

      <Notice tone="warning" className="mt-8" title="Export controls">
        Exports contain business and customer data. Export is permitted only for roles holding
        the export permission, every export is written to the audit log with the account and
        the data range, and exported files must be handled under the business data policy.
      </Notice>

      <ConfirmAction
        open={exporting}
        onClose={() => setExporting(false)}
        onConfirm={() => setExporting(false)}
        title="Export report data"
        description="Exporting business and customer data is a logged action. Confirm the purpose, which is recorded with your account and the time."
        confirmLabel="Export"
        requireReason
        superAdminOnly
      />
    </RequirePermission>
  );
}
