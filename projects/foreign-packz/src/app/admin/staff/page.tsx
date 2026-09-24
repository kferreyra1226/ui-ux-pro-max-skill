'use client';

import { useState } from 'react';
import { AdminPageHeader, ConfirmAction, DataTable, MockDataBanner, RequirePermission, type Column } from '@/components/admin/primitives';
import { Button } from '@/components/ui/Button';
import { TagBadge } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { formatDateTime } from '@/lib/format';
import { ROLE_LABELS, ROLE_PERMISSIONS, ROLE_SUMMARY, STAFF } from '@/lib/mock/staff';
import type { StaffRole, StaffUser } from '@/lib/types';

export default function AdminStaffPage() {
  const [confirming, setConfirming] = useState<{ user: StaffUser; action: string } | null>(null);

  const columns: Column<StaffUser>[] = [
    {
      key: 'name',
      header: 'Staff member',
      render: (s) => (
        <div>
          <p className="font-semibold text-bone">{s.name}</p>
          <p className="mt-0.5 text-[12px] text-chrome-dim">{s.email}</p>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (s) => <TagBadge tone={s.role === 'super-admin' ? 'acid' : 'chrome'}>{ROLE_LABELS[s.role]}</TagBadge> },
    {
      key: 'mfa',
      header: 'MFA',
      render: (s) => (s.mfaEnabled ? <TagBadge tone="emerald">Enabled</TagBadge> : <TagBadge tone="acid">Not enabled</TagBadge>),
    },
    { key: 'active', header: 'Status', render: (s) => (s.active ? <TagBadge tone="emerald">Active</TagBadge> : <TagBadge>Deactivated</TagBadge>) },
    { key: 'last', header: 'Last active', hideOnMobile: true, render: (s) => <span className="text-chrome">{formatDateTime(s.lastActiveAt)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (s) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setConfirming({ user: s, action: 'Change role' })}>Change role</Button>
          <Button size="sm" variant="danger" onClick={() => setConfirming({ user: s, action: s.active ? 'Deactivate account' : 'Reactivate account' })}>
            {s.active ? 'Deactivate' : 'Reactivate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <RequirePermission permission="staff.manage">
      <AdminPageHeader
        title="Staff & Permissions"
        description="Individual staff accounts and what each role may do."
        actions={<Button>Create staff account</Button>}
      />

      <MockDataBanner>
        Staff records are placeholders. No password, hash or credential exists anywhere in
        this prototype, and none may be added.
      </MockDataBanner>

      <Notice tone="warning" className="mb-6" title="Account security">
        Every account is individual. There is no shared login, no master key and no backdoor.
        Multi-factor authentication is required for every account before launch. Passwords are
        stored only as secure hashes and are never displayed or recoverable. Deactivating an
        account takes effect immediately and ends its active sessions.
      </Notice>

      <DataTable columns={columns} rows={STAFF} getKey={(s) => s.id} caption="Staff accounts" />

      <section className="mt-10" aria-labelledby="fp-roles">
        <h2 id="fp-roles" className="mb-4 text-xl">Role permissions</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {(Object.keys(ROLE_LABELS) as StaffRole[]).map((role) => (
            <div key={role} className="rounded-lg border border-ink-line bg-ink-card p-5">
              <h3 className="text-[17px]">{ROLE_LABELS[role]}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-chrome">{ROLE_SUMMARY[role]}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {ROLE_PERMISSIONS[role].map((p) => (
                  <li key={p} className="rounded-xs border border-ink-line px-2 py-0.5 text-[11px] text-chrome-dim">{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-chrome-dim">
          Least privilege applies. Every permission is re-checked server-side on each request
          in production; hiding a screen in the interface protects nothing on its own.
        </p>
      </section>

      <ConfirmAction
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        onConfirm={() => setConfirming(null)}
        title={`${confirming?.action ?? ''} - ${confirming?.user.name ?? ''}`}
        description="Staff permission and account changes are high risk. They require Super Admin confirmation and are written to the audit log with the previous and new value."
        confirmLabel="Confirm change"
        requireReason
        superAdminOnly
      />
    </RequirePermission>
  );
}
