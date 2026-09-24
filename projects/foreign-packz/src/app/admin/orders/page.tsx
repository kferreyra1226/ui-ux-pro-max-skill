'use client';

import { useState } from 'react';
import { AdminPageHeader, DataTable, MockDataBanner, RequirePermission, type Column } from '@/components/admin/primitives';
import { DeliveryStatusChip, OrderStatusChip, ORDER_STATUS_LABELS } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { formatDateTime, formatPrice } from '@/lib/format';
import { ORDER_REQUESTS } from '@/lib/mock/orders';
import type { OrderRequest, OrderRequestStatus } from '@/lib/types';

const FILTERS: { key: 'all' | OrderRequestStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'request-received', label: 'New' },
  { key: 'under-review', label: 'Under review' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'being-prepared', label: 'Being prepared' },
  { key: 'completed', label: 'Completed' },
  { key: 'declined', label: 'Declined' },
];

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<'all' | OrderRequestStatus>('all');
  const rows = ORDER_REQUESTS.filter((o) => filter === 'all' || o.status === filter);

  const columns: Column<OrderRequest>[] = [
    {
      key: 'reference',
      header: 'Request',
      render: (o) => (
        <div>
          <p className="font-semibold text-bone">{o.reference}</p>
          <p className="mt-0.5 text-[12px] text-chrome-dim">{formatDateTime(o.submittedAt)}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (o) => (
        <div>
          <p>{o.customer.firstName} {o.customer.lastName}</p>
          {/* Contact details are limited to what fulfilment requires. Inventory Manager
              never sees this column, and full personal data stays with Super Admin. */}
          <p className="mt-0.5 text-[12px] text-chrome-dim">{o.customer.phone}</p>
        </div>
      ),
    },
    {
      key: 'contents',
      header: 'Contents',
      hideOnMobile: true,
      render: (o) => (
        <div>
          <p>{o.lines.length} {o.lines.length === 1 ? 'line' : 'lines'}</p>
          <p className="mt-0.5 text-[12px] text-chrome-dim">
            {o.containsCannabis ? 'Cannabis (21+)' : 'Apparel / accessories'}
            {o.containsShippable && o.containsCannabis ? ' + shippable' : ''}
          </p>
        </div>
      ),
    },
    {
      key: 'fulfillment',
      header: 'Fulfillment',
      hideOnMobile: true,
      render: (o) =>
        o.delivery ? (
          <div className="space-y-1.5">
            <DeliveryStatusChip status={o.delivery.status} />
            <p className="text-[12px] text-chrome-dim">
              {o.delivery.confirmedWindow ?? `Preferred: ${o.delivery.preferredWindow}`}
            </p>
          </div>
        ) : (
          <span className="text-chrome-dim">{o.containsShippable ? 'Shipping' : 'Pickup'}</span>
        ),
    },
    { key: 'total', header: 'Total', align: 'right', render: (o) => <span className="tabular-nums">{formatPrice(o.totals.totalCents)}</span> },
    { key: 'status', header: 'Status', render: (o) => <OrderStatusChip status={o.status} /> },
  ];

  return (
    <RequirePermission permission="orders.view">
      <AdminPageHeader
        title="Order Requests"
        description="Every cannabis order arrives here as a request. Nothing is accepted automatically, and no inventory moves until a person accepts it."
      />

      <MockDataBanner>
        These records are mock data. Connecting a secure database and the licensed POS
        replaces this list with the real request queue.
      </MockDataBanner>

      <Notice tone="warning" className="mb-6" title="Status language">
        A request is not an order. Do not tell a customer a request is confirmed, scheduled,
        paid, ready or fulfilled until the corresponding status has actually been set here.
      </Notice>

      <div className="fp-rail mb-6 gap-2" role="group" aria-label="Filter requests by status">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`min-h-[44px] shrink-0 rounded-sm border px-4 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
              filter === f.key ? 'border-bone bg-bone text-ink' : 'border-ink-line text-chrome hover:text-bone'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getKey={(o) => o.id}
        caption="Order requests"
        empty="No requests with this status."
      />

      <section className="mt-10" aria-labelledby="fp-status-flow">
        <h2 id="fp-status-flow" className="text-xl">Status flow</h2>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-chrome">
          An Order & Delivery Manager may move a request through these statuses. They cannot
          change pricing, inventory, payment settings, licence details or legal configuration.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(ORDER_STATUS_LABELS) as OrderRequestStatus[]).map((s) => (
            <li key={s}>
              <OrderStatusChip status={s} />
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary">Open request detail</Button>
          <Button size="sm" variant="secondary">Contact customer</Button>
          <Button size="sm" variant="danger">Cancel request</Button>
        </div>
        <p className="mt-3 text-[12px] text-chrome-dim">
          Each action writes an audit row with the acting account, the time, the previous
          status, the new status and any reason given.
        </p>
      </section>
    </RequirePermission>
  );
}
