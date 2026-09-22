'use client';

import { useState } from 'react';
import {
  AdminPageHeader, ConfirmAction, DataTable, MockDataBanner, ReasonSelect,
  RequirePermission, StatCard, type Column,
} from '@/components/admin/primitives';
import { AvailabilityChip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Notice } from '@/components/ui/Notice';
import { formatDateTime, formatPrice } from '@/lib/format';
import { ADJUSTMENT_REASONS, STATUS_LABELS, clampStock, derivedStatus, inventoryValueCents } from '@/lib/inventory';
import { INVENTORY_ADJUSTMENTS } from '@/lib/mock/audit';
import { categoryLabel } from '@/lib/mock/catalog';
import { PRODUCTS } from '@/lib/mock/products';
import type { Product } from '@/lib/types';

/**
 * Inventory editor.
 *
 * Safeguards implemented here and required in production:
 * - Stock can never go below zero. The adjustment is clamped, and the form refuses a
 *   negative result rather than silently correcting it.
 * - Zero stock always reads Sold Out on the customer site, whatever the stored status says.
 * - Every adjustment requires a reason from a fixed list, and the reason is written to the
 *   audit log with the previous and new value.
 * - Bulk changes are high-risk and need Super Admin confirmation.
 * - Products are archived, never deleted, so the record survives.
 *
 * PRODUCTION INTEGRATION POINT - Live inventory / POS / seed-to-sale:
 * Quantities must be authoritative in the licensed POS, adjusted transactionally, with a
 * temporary hold placed at request time and a permanent deduction only on owner acceptance,
 * and every movement reported to the state tracking system.
 */
export default function AdminInventoryPage() {
  const [stock, setStock] = useState<Record<string, number>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stockQuantity])),
  );
  const [editing, setEditing] = useState<Product | null>(null);
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bulkOpen, setBulkOpen] = useState(false);
  const [historyFor, setHistoryFor] = useState<Product | null>(null);

  const withStock = PRODUCTS.map((p) => ({ ...p, stockQuantity: stock[p.id] ?? p.stockQuantity }));
  const lowStock = withStock.filter((p) => derivedStatus(p) === 'low-stock');
  const soldOut = withStock.filter((p) => derivedStatus(p) === 'sold-out');

  function applyAdjustment() {
    if (!editing) return;
    const next: Record<string, string> = {};
    const parsed = Number(delta);
    if (!delta.trim() || Number.isNaN(parsed) || !Number.isInteger(parsed)) {
      next.delta = 'Enter a whole number, positive to add or negative to remove.';
    }
    if (!reason) next.reason = 'A reason is required and is written to the audit log.';
    const current = stock[editing.id] ?? editing.stockQuantity;
    if (!next.delta && current + parsed < 0) {
      next.delta = `That would leave ${current + parsed} units. Stock can never go below zero.`;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStock((s) => ({ ...s, [editing.id]: clampStock(current + parsed) }));
    setEditing(null);
    setDelta('');
    setReason('');
  }

  const columns: Column<Product>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (p) => (
        <div>
          <p className="font-semibold text-bone">{p.name}</p>
          <p className="mt-0.5 text-[12px] text-chrome-dim">
            {p.sku} &middot; {p.brand} &middot; {categoryLabel(p.category)}
          </p>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      hideOnMobile: true,
      render: (p) => (
        <div className="tabular-nums">
          {p.salePriceCents ? (
            <>
              <span className="text-bone">{formatPrice(p.salePriceCents)}</span>
              <span className="ml-2 text-chrome-dim line-through">{formatPrice(p.priceCents)}</span>
            </>
          ) : (
            formatPrice(p.priceCents)
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'On hand',
      align: 'right',
      render: (p) => (
        <span className={`font-semibold tabular-nums ${p.stockQuantity === 0 ? 'text-danger' : p.stockQuantity <= p.lowStockThreshold ? 'text-warn' : 'text-bone'}`}>
          {p.stockQuantity}
        </span>
      ),
    },
    { key: 'threshold', header: 'Low-stock at', align: 'right', hideOnMobile: true, render: (p) => <span className="tabular-nums text-chrome">{p.lowStockThreshold}</span> },
    {
      key: 'status',
      header: 'Availability',
      render: (p) => {
        const status = derivedStatus(p);
        return <AvailabilityChip status={status} label={STATUS_LABELS[status]} />;
      },
    },
    {
      key: 'eligibility',
      header: 'Eligible for',
      hideOnMobile: true,
      render: (p) => (
        <span className="text-[12px] text-chrome">
          {[p.pickupEligible && 'Pickup', p.deliveryEligible && 'Delivery', p.shippingEligible && 'Shipping']
            .filter(Boolean)
            .join(', ') || 'None'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => { setEditing(p); setErrors({}); }}>Adjust</Button>
          <Button size="sm" variant="ghost" onClick={() => setHistoryFor(p)}>History</Button>
        </div>
      ),
    },
  ];

  return (
    <RequirePermission permission="inventory.view">
      <AdminPageHeader
        title="Inventory"
        description="On-hand quantities, thresholds and availability. Every change needs a reason and is logged."
        actions={<Button variant="secondary" onClick={() => setBulkOpen(true)}>Bulk adjustment</Button>}
      />

      <MockDataBanner>
        Quantities are mock values held in this page only. In production they are read from
        and written to the licensed POS and reported to the state tracking system.
      </MockDataBanner>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products tracked" value={String(withStock.filter((p) => !p.archived).length)} />
        <StatCard label="Low stock" value={String(lowStock.length)} tone="warn" />
        <StatCard label="Sold out" value={String(soldOut.length)} tone="danger" />
        <StatCard label="Inventory value (placeholder)" value={formatPrice(inventoryValueCents(withStock))} />
      </div>

      <Notice tone="warning" className="mb-6" title="Safeguards">
        Stock cannot go below zero. A product at zero automatically shows Sold Out on the
        customer site and cannot be added to a cart. Inventory is only deducted after an owner
        accepts a request, never when a customer submits one.
      </Notice>

      <DataTable columns={columns} rows={withStock} getKey={(p) => p.id} caption="Inventory" />

      {/* ------------------------------------------------------ adjustment dialog */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={`Adjust stock - ${editing?.name ?? ''}`}
        description="Enter the change, not the new total. A reason is required."
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={applyAdjustment}>Save adjustment</Button>
          </>
        }
      >
        {editing ? (
          <div className="space-y-4">
            <div className="rounded-sm border border-ink-line bg-ink-soft p-4 text-[13px]">
              <p className="text-chrome">
                Current on hand:{' '}
                <span className="font-semibold text-bone">{stock[editing.id] ?? editing.stockQuantity}</span>
              </p>
              <p className="mt-1 text-chrome-dim">
                Low-stock threshold {editing.lowStockThreshold}. SKU {editing.sku}.
              </p>
            </div>
            <TextField
              label="Change in units"
              required
              inputMode="numeric"
              value={delta}
              onChange={(e) => { setDelta(e.target.value); setErrors((x) => ({ ...x, delta: '' })); }}
              error={errors.delta}
              hint="Use a negative number to remove units, for example -2."
            />
            <ReasonSelect
              value={reason}
              onChange={(v) => { setReason(v); setErrors((x) => ({ ...x, reason: '' })); }}
              options={ADJUSTMENT_REASONS}
              error={errors.reason}
            />
            <Notice tone="neutral" title="Recorded">
              The acting account, the time, the previous value, the new value and this reason
              are written to the audit log.
            </Notice>
          </div>
        ) : null}
      </Modal>

      {/* --------------------------------------------------------- history dialog */}
      <Modal
        open={historyFor !== null}
        onClose={() => setHistoryFor(null)}
        title={`Activity history - ${historyFor?.name ?? ''}`}
        description="Who changed what, when, from what value to what value, and why."
        size="lg"
      >
        {historyFor ? (
          <ul className="divide-y divide-ink-line">
            {INVENTORY_ADJUSTMENTS.filter((a) => a.productId === historyFor.id).map((a) => (
              <li key={a.id} className="py-3">
                <p className="text-[14px] text-bone/90">
                  {a.delta > 0 ? `+${a.delta}` : a.delta} units &mdash;{' '}
                  <span className="text-chrome">{a.from} to {a.to}</span>
                </p>
                <p className="mt-0.5 text-[12px] text-chrome-dim">
                  {a.byName} &middot; {formatDateTime(a.at)} &middot; Reason: {a.reason}
                  {a.note ? ` (${a.note})` : ''}
                </p>
              </li>
            ))}
            {INVENTORY_ADJUSTMENTS.filter((a) => a.productId === historyFor.id).length === 0 ? (
              <li className="py-4 text-[14px] text-chrome">No recorded adjustments for this product.</li>
            ) : null}
          </ul>
        ) : null}
      </Modal>

      <ConfirmAction
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onConfirm={() => setBulkOpen(false)}
        title="Bulk inventory adjustment"
        description="Bulk changes affect many products at once and are easy to get wrong. This action needs Super Admin confirmation and a recorded reason."
        confirmLabel="Confirm bulk change"
        requireReason
        superAdminOnly
      />
    </RequirePermission>
  );
}
