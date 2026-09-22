'use client';

import Link from 'next/link';
import { AdminPageHeader, MockDataBanner, StatCard } from '@/components/admin/primitives';
import { OwnerStatusPanel } from '@/components/admin/OwnerStatusPanel';
import { OrderStatusChip } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { formatDateTime, formatPrice } from '@/lib/format';
import { derivedStatus, inventoryValueCents } from '@/lib/inventory';
import { INTEGRATION_POINTS } from '@/lib/config';
import { ACTION_LABELS, AUDIT_LOG } from '@/lib/mock/audit';
import { ORDER_REQUESTS } from '@/lib/mock/orders';
import { PRODUCTS } from '@/lib/mock/products';

const QUICK_ACTIONS = [
  { label: 'Add product', href: '/admin/products' },
  { label: 'Update stock', href: '/admin/inventory' },
  { label: 'Change a price', href: '/admin/inventory' },
  { label: 'Mark item sold out', href: '/admin/inventory' },
  { label: 'View new requests', href: '/admin/orders' },
  { label: 'Delivery requests', href: '/admin/deliveries' },
  { label: 'Pause deliveries', href: '/admin/hours' },
  { label: 'Pause pickup', href: '/admin/hours' },
  { label: 'Add a service ZIP code', href: '/admin/zones' },
  { label: 'Create a staff account', href: '/admin/staff' },
];

export default function AdminOverviewPage() {
  const awaiting = ORDER_REQUESTS.filter((o) => o.status === 'request-received' || o.status === 'under-review');
  const confirmed = ORDER_REQUESTS.filter((o) => o.status === 'confirmed' || o.status === 'being-prepared');
  const lowStock = PRODUCTS.filter((p) => derivedStatus(p) === 'low-stock');
  const soldOut = PRODUCTS.filter((p) => derivedStatus(p) === 'sold-out');
  const failedLogins = AUDIT_LOG.filter((a) => a.action === 'auth.login-failed');
  const cancellations = ORDER_REQUESTS.filter((o) => o.status === 'declined' || o.status === 'cancelled');

  const alerts = [
    lowStock.length > 0 && { tone: 'warning' as const, title: 'Low inventory', body: `${lowStock.length} product${lowStock.length === 1 ? '' : 's'} at or below the low-stock threshold.`, href: '/admin/inventory' },
    soldOut.length > 0 && { tone: 'danger' as const, title: 'Sold out', body: `${soldOut.length} product${soldOut.length === 1 ? '' : 's'} at zero. The customer site shows Sold Out automatically.`, href: '/admin/inventory' },
    awaiting.length > 0 && { tone: 'warning' as const, title: 'Requests awaiting review', body: `${awaiting.length} request${awaiting.length === 1 ? '' : 's'} need a decision. Nothing is accepted automatically.`, href: '/admin/orders' },
    failedLogins.length > 0 && { tone: 'danger' as const, title: 'Failed admin login attempts', body: `${failedLogins.length} failed attempt recorded. Review the audit log and confirm lockout is configured.`, href: '/admin/audit' },
    cancellations.length > 1 && { tone: 'warning' as const, title: 'Declines and cancellations', body: `${cancellations.length} requests declined or cancelled recently. Check whether the cause is inventory or service area.`, href: '/admin/orders' },
    { tone: 'danger' as const, title: 'Integration and compliance sync', body: `${INTEGRATION_POINTS.length} required integrations are still placeholders, including the licensed POS, live inventory and seed-to-sale reporting.`, href: '/admin/settings' },
  ].filter(Boolean) as { tone: 'warning' | 'danger'; title: string; body: string; href: string }[];

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Everything on this screen is mock data. No figure here is a real sales, tax or inventory record."
      />

      <MockDataBanner>
        Sales, inventory value and request counts are illustrative. They become real only once
        the licensed POS, live inventory system and a secure production database are connected.
      </MockDataBanner>

      <OwnerStatusPanel />

      {/* ------------------------------------------------------------- key numbers */}
      <section aria-labelledby="fp-today" className="mt-8">
        <h2 id="fp-today" className="mb-4 text-xl">Today</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Requests today" value={String(ORDER_REQUESTS.filter((o) => o.submittedAt.startsWith('2026-09-22')).length)} note="Submitted since midnight, New York time." />
          <StatCard label="Awaiting review" value={String(awaiting.length)} tone="warn" note="Need a manual decision." />
          <StatCard label="Confirmed orders" value={String(confirmed.length)} tone="good" note="Accepted by a person." />
          <StatCard label="Declined / cancelled" value={String(cancellations.length)} note="No inventory was reserved." />
        </div>
      </section>

      <section aria-labelledby="fp-business" className="mt-8">
        <h2 id="fp-business" className="mb-4 text-xl">This week and month</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Sales today (placeholder)" value="[POS FIGURE]" note="Read from the licensed POS." />
          <StatCard label="Sales this week (placeholder)" value="[POS FIGURE]" note="Read from the licensed POS." />
          <StatCard label="Sales this month (placeholder)" value="[POS FIGURE]" note="Read from the licensed POS." />
          <StatCard label="Apparel sales (placeholder)" value="[APPAREL FIGURE]" note="Separate from cannabis sales." />
        </div>
      </section>

      <section aria-labelledby="fp-inventory" className="mt-8">
        <h2 id="fp-inventory" className="mb-4 text-xl">Inventory</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Low stock" value={String(lowStock.length)} tone="warn" note="At or below threshold." />
          <StatCard label="Sold out" value={String(soldOut.length)} tone="danger" note="Automatically hidden from purchase." />
          <StatCard label="Active products" value={String(PRODUCTS.filter((p) => !p.archived).length)} />
          <StatCard
            label="Inventory value (placeholder)"
            value={formatPrice(inventoryValueCents(PRODUCTS))}
            note="Calculated from mock quantities and prices."
          />
        </div>
      </section>

      {/* ---------------------------------------------------------- quick actions */}
      <section aria-labelledby="fp-quick" className="mt-10">
        <h2 id="fp-quick" className="mb-4 text-xl">Quick actions</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {QUICK_ACTIONS.map((action) => (
            <li key={action.label}>
              <Link
                href={action.href}
                className="flex min-h-[56px] items-center rounded-sm border border-ink-line bg-ink-card px-4 text-[13px] font-semibold text-bone transition-colors hover:border-chrome/50 hover:bg-bone/5"
              >
                {action.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------------------------- alerts */}
      <section aria-labelledby="fp-alerts" className="mt-10">
        <h2 id="fp-alerts" className="mb-4 text-xl">Alerts</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {alerts.map((alert) => (
            <Notice key={alert.title} tone={alert.tone} title={alert.title}>
              {alert.body}{' '}
              <Link href={alert.href} className="underline underline-offset-2">Open</Link>
            </Notice>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- recent activity */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="fp-recent-requests">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="fp-recent-requests" className="text-xl">Recent requests</h2>
            <Link href="/admin/orders" className="text-[12px] uppercase tracking-[0.12em] text-chrome hover:text-bone">
              All requests
            </Link>
          </div>
          <ul className="divide-y divide-ink-line rounded-lg border border-ink-line bg-ink-card">
            {ORDER_REQUESTS.slice(0, 5).map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                <div>
                  <p className="text-[14px] font-semibold text-bone">{order.reference}</p>
                  <p className="mt-0.5 text-[12px] text-chrome-dim">
                    {order.customer.firstName} {order.customer.lastName} &middot; {formatDateTime(order.submittedAt)}
                  </p>
                </div>
                <OrderStatusChip status={order.status} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="fp-recent-activity">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="fp-recent-activity" className="text-xl">Recent activity</h2>
            <Link href="/admin/audit" className="text-[12px] uppercase tracking-[0.12em] text-chrome hover:text-bone">
              Audit log
            </Link>
          </div>
          <ul className="divide-y divide-ink-line rounded-lg border border-ink-line bg-ink-card">
            {AUDIT_LOG.slice(0, 5).map((entry) => (
              <li key={entry.id} className="p-4">
                <p className="text-[14px] text-bone/90">
                  {ACTION_LABELS[entry.action] ?? entry.action} &mdash;{' '}
                  <span className="text-chrome">{entry.subject}</span>
                </p>
                <p className="mt-0.5 text-[12px] text-chrome-dim">
                  {entry.actorName} &middot; {formatDateTime(entry.at)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
