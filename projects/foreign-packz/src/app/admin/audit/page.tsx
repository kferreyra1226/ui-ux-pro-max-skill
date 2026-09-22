'use client';

import { useMemo, useState } from 'react';
import { AdminPageHeader, DataTable, MockDataBanner, type Column } from '@/components/admin/primitives';
import { TagBadge } from '@/components/ui/Badge';
import { TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { useAdminSession } from '@/context/AdminSessionContext';
import { formatDateTime } from '@/lib/format';
import { ACTION_LABELS, AUDIT_LOG } from '@/lib/mock/audit';
import { ROLE_LABELS } from '@/lib/mock/staff';
import type { AuditLogEntry } from '@/lib/types';

/**
 * Audit log viewer - Super Admin only.
 *
 * PRODUCTION: audit rows are append-only and written server-side in the same transaction as
 * the change they describe. They cannot be edited or deleted from this dashboard, they are
 * retained per the business retention policy, and viewing them is itself a logged action.
 */
export default function AdminAuditPage() {
  const { role } = useAdminSession();
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AUDIT_LOG;
    return AUDIT_LOG.filter((e) =>
      [e.actorName, ACTION_LABELS[e.action] ?? e.action, e.subject, e.oldValue ?? '', e.newValue ?? '', e.reason ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  if (role !== 'super-admin') {
    return (
      <>
        <AdminPageHeader title="Audit Logs" />
        <Notice tone="danger" title="Restricted to Super Admin">
          Audit logs are visible only to the Super Admin / Owner. In production the server
          rejects this request for any other role, not just the interface.
        </Notice>
      </>
    );
  }

  const columns: Column<AuditLogEntry>[] = [
    { key: 'at', header: 'When', render: (e) => <span className="whitespace-nowrap text-chrome">{formatDateTime(e.at)}</span> },
    {
      key: 'actor',
      header: 'Admin user',
      render: (e) => (
        <div>
          <p className="text-bone/90">{e.actorName}</p>
          <p className="mt-0.5 text-[11px] text-chrome-dim">{ROLE_LABELS[e.actorRole]}</p>
        </div>
      ),
    },
    { key: 'action', header: 'Action', render: (e) => <TagBadge tone={e.action.startsWith('auth.login-failed') ? 'acid' : 'chrome'}>{ACTION_LABELS[e.action] ?? e.action}</TagBadge> },
    { key: 'subject', header: 'Affected item', render: (e) => <span className="text-bone/90">{e.subject}</span> },
    { key: 'old', header: 'Old value', hideOnMobile: true, render: (e) => <span className="text-chrome-dim">{e.oldValue ?? '-'}</span> },
    { key: 'new', header: 'New value', hideOnMobile: true, render: (e) => <span className="text-chrome">{e.newValue ?? '-'}</span> },
    { key: 'reason', header: 'Reason', hideOnMobile: true, render: (e) => <span className="text-chrome-dim">{e.reason ?? '-'}</span> },
    {
      key: 'origin',
      header: 'IP / device',
      hideOnMobile: true,
      render: (e) => (
        <span className="text-[11px] text-chrome-dim">
          {e.ipAddress}
          <br />
          {e.device}
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Audit Logs"
        description="Who did what, when, from what value to what value, and why."
      />

      <MockDataBanner>
        Sample rows. Production audit entries are append-only, written server-side and cannot
        be edited or deleted from this dashboard.
      </MockDataBanner>

      <div className="mb-5 max-w-md">
        <TextField label="Search the log" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Account, action, item or reason" />
      </div>

      <DataTable columns={columns} rows={rows} getKey={(e) => e.id} caption="Audit log" empty="No entries match that search." />

      <section className="mt-8">
        <h2 className="text-xl">What is logged</h2>
        <ul className="mt-3 grid gap-2 text-[13px] text-chrome sm:grid-cols-2">
          {[
            'Product created, edited or archived',
            'Inventory changed, with the reason',
            'Price changed',
            'Order-request status changed',
            'Delivery request accepted, declined or rescheduled',
            'Delivery-zone changes',
            'Refunds and cancellations',
            'Staff account and role changes',
            'Website content updated',
            'Settings and compliance configuration changed',
            'Schedule and availability changes',
            'Photo uploaded, replaced, hidden, deleted or reordered',
            'Failed and successful admin sign-ins',
            'Report exports',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-chrome-dim" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
