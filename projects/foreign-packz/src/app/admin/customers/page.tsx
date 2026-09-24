'use client';

import { AdminPageHeader, DataTable, MockDataBanner, RequirePermission, type Column } from '@/components/admin/primitives';
import { TagBadge } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { useAdminSession } from '@/context/AdminSessionContext';
import { formatDate } from '@/lib/format';
import { CUSTOMERS } from '@/lib/mock/customers';
import type { Customer } from '@/lib/types';

/**
 * Customer records.
 * Data minimisation matters here: an Order & Delivery Manager sees only what fulfilment
 * requires, an Inventory Manager sees nothing, and full personal data is Super Admin only.
 */
export default function AdminCustomersPage() {
  const { can } = useAdminSession();
  const showFull = can('customers.view-full');

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      render: (c) => (
        <div>
          <p className="font-semibold text-bone">{c.firstName} {c.lastName}</p>
          <p className="mt-0.5 text-[12px] text-chrome-dim">Since {formatDate(c.createdAt)}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      hideOnMobile: true,
      render: (c) =>
        showFull ? (
          <div className="text-[12px] text-chrome">
            <p>{c.email}</p>
            <p>{c.phone}</p>
          </div>
        ) : (
          <span className="text-[12px] text-chrome-dim">Restricted for this role</span>
        ),
    },
    { key: 'requests', header: 'Requests', align: 'right', render: (c) => <span className="tabular-nums">{c.requestCount}</span> },
    { key: 'completed', header: 'Completed', align: 'right', hideOnMobile: true, render: (c) => <span className="tabular-nums">{c.completedCount}</span> },
    {
      key: 'cancelled',
      header: 'Cancelled',
      align: 'right',
      render: (c) => (
        <span className={c.cancelledCount >= 3 ? 'font-semibold tabular-nums text-warn' : 'tabular-nums'}>
          {c.cancelledCount}
        </span>
      ),
    },
    {
      key: 'age',
      header: '21+ acknowledged',
      hideOnMobile: true,
      render: (c) => (c.ageAcknowledgedAt ? <TagBadge tone="emerald">{formatDate(c.ageAcknowledgedAt)}</TagBadge> : <TagBadge>Not recorded</TagBadge>),
    },
    {
      key: 'marketing',
      header: 'Marketing',
      hideOnMobile: true,
      render: (c) => (c.marketingOptIn ? <TagBadge tone="emerald">Opted in</TagBadge> : <TagBadge>No</TagBadge>),
    },
  ];

  return (
    <RequirePermission permission="customers.view">
      <AdminPageHeader
        title="Customers"
        description="Request history and consent records. Personal data is restricted by role."
      />
      <MockDataBanner>
        Customer records are mock data with placeholder contact details.
      </MockDataBanner>

      <Notice tone="warning" className="mb-6" title="Data minimisation">
        {showFull
          ? 'You are viewing full customer records as Super Admin. In production, access to this screen is itself written to the audit log, data is encrypted at rest and a retention policy applies.'
          : 'This role sees only the fields fulfilment requires. Full personal data is restricted to the Super Admin / Owner.'}
      </Notice>

      <DataTable columns={columns} rows={CUSTOMERS} getKey={(c) => c.id} caption="Customers" />

      <p className="mt-4 text-[12px] leading-relaxed text-chrome-dim">
        Age acknowledgement recorded here is a self-declaration made at the age gate. It is not
        verification and must never be treated as proof of age. Identity and age are verified by
        a compliant service and by checking a valid government-issued photo ID before release.
      </p>
    </RequirePermission>
  );
}
