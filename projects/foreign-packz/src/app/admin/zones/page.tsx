'use client';

import { useState } from 'react';
import { AdminPageHeader, ConfirmAction, DataTable, MockDataBanner, RequirePermission, type Column } from '@/components/admin/primitives';
import { Button } from '@/components/ui/Button';
import { TagBadge } from '@/components/ui/Badge';
import { TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { formatPrice } from '@/lib/format';
import { DELIVERY_ZONES } from '@/lib/mock/availability';
import type { DeliveryZone } from '@/lib/types';

export default function AdminZonesPage() {
  const [confirming, setConfirming] = useState<string | null>(null);

  const columns: Column<DeliveryZone>[] = [
    { key: 'name', header: 'Zone', render: (z) => <span className="font-semibold text-bone">{z.name}</span> },
    { key: 'zips', header: 'ZIP codes', render: (z) => <span className="text-chrome">{z.zips.join(', ')}</span> },
    { key: 'fee', header: 'Delivery fee', align: 'right', render: (z) => <span className="tabular-nums">{formatPrice(z.feeCents)}</span> },
    { key: 'min', header: 'Minimum order', align: 'right', render: (z) => <span className="tabular-nums">{formatPrice(z.minimumOrderCents)}</span> },
    { key: 'active', header: 'Status', render: (z) => (z.active ? <TagBadge tone="emerald">Active</TagBadge> : <TagBadge>Inactive</TagBadge>) },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (z) => (
        <Button size="sm" variant="secondary" onClick={() => setConfirming(z.id)}>
          {z.active ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ];

  return (
    <RequirePermission permission="delivery.manage">
      <AdminPageHeader
        title="Delivery Zones"
        description="Service ZIP codes, delivery fees and minimum order values."
        actions={<Button>Add zone</Button>}
      />

      <MockDataBanner>
        Zone names and ZIP codes are placeholders. The real service area must match what the
        business is actually licensed and approved to serve.
      </MockDataBanner>

      <Notice tone="warning" className="mb-6" title="Service area is a legal boundary">
        A delivery address outside the approved service area must never be accepted. Out-of-zone
        requests are flagged in the Delivery Requests inbox and are declined with the reason
        &ldquo;Outside service area&rdquo;. Cannabis is never shipped to any address, in or out of zone.
      </Notice>

      <DataTable columns={columns} rows={DELIVERY_ZONES} getKey={(z) => z.id} caption="Delivery zones" />

      <section className="mt-8 rounded-lg border border-ink-line bg-ink-card p-5">
        <h2 className="text-xl">Add a service ZIP code</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <TextField label="ZIP code" inputMode="numeric" maxLength={5} placeholder="11221" />
          <TextField label="Delivery fee (USD)" inputMode="decimal" placeholder="8.00" />
          <TextField label="Minimum order (USD)" inputMode="decimal" placeholder="60.00" />
        </div>
        <Button className="mt-4" onClick={() => setConfirming('new')}>Add ZIP code</Button>
        <p className="mt-3 text-[12px] leading-relaxed text-chrome-dim">
          Confirm with counsel that every ZIP code added here is inside the area this licence
          permits the business to serve.
        </p>
      </section>

      <ConfirmAction
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        onConfirm={() => setConfirming(null)}
        title="Change the service area"
        description="Service-area changes affect which customers can submit a delivery request. This is a compliance setting: it requires Super Admin confirmation and is written to the audit log."
        confirmLabel="Save change"
        requireReason
        superAdminOnly
      />
    </RequirePermission>
  );
}
