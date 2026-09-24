'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SelectField, TextAreaField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { useAdminSession } from '@/context/AdminSessionContext';
import { cx } from '@/lib/format';
import type { Permission } from '@/lib/types';

/** Page heading with optional actions and a short description. */
export function AdminPageHeader({
  title, description, actions,
}: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-[clamp(1.5rem,4.5vw,2.25rem)]">{title}</h1>
        {description ? (
          <p className="mt-2 text-[14px] leading-relaxed text-chrome">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

/** Hides a screen or a control from roles that do not hold the permission. */
export function RequirePermission({
  permission, children, fallbackTitle = 'Not available for this role',
}: { permission: Permission; children: ReactNode; fallbackTitle?: string }) {
  const { can } = useAdminSession();
  if (can(permission)) return <>{children}</>;
  return (
    <Notice tone="neutral" title={fallbackTitle}>
      This screen is outside the permissions granted to the role currently selected. In
      production the server rejects the request as well, not just the interface.
    </Notice>
  );
}

export function StatCard({
  label, value, note, tone = 'neutral',
}: {
  label: string;
  value: string;
  note?: string;
  tone?: 'neutral' | 'warn' | 'danger' | 'good';
}) {
  const tones = {
    neutral: 'border-ink-line',
    warn: 'border-warn/40',
    danger: 'border-danger/40',
    good: 'border-emerald/40',
  } as const;
  const valueTones = {
    neutral: 'text-bone',
    warn: 'text-warn',
    danger: 'text-danger',
    good: 'text-[#7FD8B6]',
  } as const;
  return (
    <div className={cx('rounded-lg border bg-ink-card p-5', tones[tone])}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-chrome-dim">{label}</p>
      <p className={cx('mt-2 font-display text-3xl tabular-nums', valueTones[tone])}>{value}</p>
      {note ? <p className="mt-1.5 text-[12px] leading-snug text-chrome-dim">{note}</p> : null}
    </div>
  );
}

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Hidden below lg so the table never overflows a phone screen. */
  hideOnMobile?: boolean;
  align?: 'left' | 'right';
}

/**
 * Admin data table.
 * Wide tables scroll horizontally rather than breaking the layout, and secondary columns
 * drop out on small screens (UX guideline: Responsive - table handling).
 */
export function DataTable<T>({
  columns, rows, getKey, empty = 'Nothing to show.', caption,
}: {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
  empty?: string;
  caption?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-ink-line bg-ink-card p-10 text-center">
        <p className="text-[14px] text-chrome">{empty}</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-line">
      <table className="w-full min-w-[640px] border-collapse text-left">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="bg-ink-soft">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cx(
                  'whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-chrome-dim',
                  col.align === 'right' && 'text-right',
                  col.hideOnMobile && 'hidden lg:table-cell',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-line bg-ink-card">
          {rows.map((row) => (
            <tr key={getKey(row)} className="transition-colors hover:bg-bone/[.03]">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cx(
                    'px-4 py-3.5 align-top text-[13px] text-bone/90',
                    col.align === 'right' && 'text-right',
                    col.hideOnMobile && 'hidden lg:table-cell',
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Confirmation dialog for high-risk actions.
 * Bulk inventory changes, mass price changes, bulk archival, compliance settings and staff
 * permission changes all route through this, and a reason is recorded in the audit log.
 */
export function ConfirmAction({
  open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', requireReason, superAdminOnly,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  requireReason?: boolean;
  superAdminOnly?: boolean;
}) {
  const { role } = useAdminSession();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const blocked = superAdminOnly && role !== 'super-admin';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            variant={blocked ? 'secondary' : 'primary'}
            disabled={blocked}
            onClick={() => {
              if (requireReason && !reason.trim()) {
                setError('A reason is required and is written to the audit log.');
                return;
              }
              onConfirm(reason.trim());
              setReason('');
              setError('');
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {superAdminOnly ? (
          <Notice tone={blocked ? 'danger' : 'warning'} title="Super Admin confirmation required">
            {blocked
              ? 'The role currently selected cannot perform this action. A Super Admin must confirm it.'
              : 'This is a high-risk action. It is recorded in the audit log with your account, the time, the previous value and the new value.'}
          </Notice>
        ) : null}
        {requireReason ? (
          <TextAreaField
            label="Reason"
            required
            rows={3}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(''); }}
            error={error}
            hint="Stored in the audit log alongside the change."
          />
        ) : null}
      </div>
    </Modal>
  );
}

/** Reason picker used by inventory adjustments. */
export function ReasonSelect({
  value, onChange, options, label = 'Reason', error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  label?: string;
  error?: string;
}) {
  return (
    <SelectField label={label} required value={value} onChange={(e) => onChange(e.target.value)} error={error}>
      <option value="">Select a reason</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </SelectField>
  );
}

/** Marks a screen or panel whose data is not yet connected to a production system. */
export function MockDataBanner({ children }: { children: ReactNode }) {
  return (
    <Notice tone="neutral" title="Mock data" className="mb-6">
      {children}
    </Notice>
  );
}
