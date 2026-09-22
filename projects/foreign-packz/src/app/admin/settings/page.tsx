'use client';

import { useState } from 'react';
import { AdminPageHeader, ConfirmAction, MockDataBanner, RequirePermission } from '@/components/admin/primitives';
import { Button } from '@/components/ui/Button';
import { TagBadge } from '@/components/ui/Badge';
import { TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { BRAND, INTEGRATION_POINTS, LEGAL, SUPPORT } from '@/lib/config';

/**
 * Settings and integrations.
 * The business, licence and compliance fields on this screen are the ones that must match
 * reality exactly. Nothing here may be filled in with an invented value.
 */
export default function AdminSettingsPage() {
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <RequirePermission permission="settings.manage">
      <AdminPageHeader
        title="Settings"
        description="Business and licence details, support contacts, and the integrations that must be connected before launch."
      />

      <MockDataBanner>Settings are not saved in this prototype.</MockDataBanner>

      <Notice tone="danger" className="mb-6" title="Do not invent a value">
        Every licence, premises and compliance field must be the business&rsquo;s real, current
        information, supplied by the owner and confirmed by a cannabis compliance
        professional. A placeholder is safer than a wrong value.
      </Notice>

      <section className="rounded-lg border border-ink-line bg-ink-card p-5">
        <h2 className="text-xl">Business and licence</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TextField label="Brand name" defaultValue={BRAND.name} />
          <TextField label="Legal entity name" defaultValue={BRAND.legalName} />
          <TextField label="New York licence type" defaultValue={BRAND.licenseType} />
          <TextField label="Licence number" defaultValue={BRAND.licenseNumber} />
          <TextField label="Approved licensed premises" defaultValue={BRAND.premises} className="lg:col-span-2" />
          <TextField label="Time zone" defaultValue={BRAND.timezone} disabled hint="All hours, notifications and schedules use America/New_York." />
          <TextField label="Minimum age" defaultValue={String(BRAND.minimumAge)} disabled />
        </div>
        <Button className="mt-5" onClick={() => setConfirming('business')}>Save business details</Button>
      </section>

      <section className="mt-6 rounded-lg border border-ink-line bg-ink-card p-5">
        <h2 className="text-xl">Support contact</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TextField label="Support email" defaultValue={SUPPORT.email} />
          <TextField label="Support phone" defaultValue={SUPPORT.phone} />
          <TextField label="Support SMS" defaultValue={SUPPORT.sms} />
          <TextField label="Business hours" defaultValue={SUPPORT.hours} />
        </div>
        <Button className="mt-5" onClick={() => setConfirming('support')}>Save support details</Button>
      </section>

      <section className="mt-6" aria-labelledby="fp-integrations">
        <h2 id="fp-integrations" className="mb-2 text-xl">Integrations</h2>
        <p className="mb-4 max-w-3xl text-[13px] leading-relaxed text-chrome">
          None of the systems below is connected. Each one is required before this site can
          take a real order, and several are legal obligations rather than conveniences.
        </p>
        <ul className="grid gap-3 lg:grid-cols-2">
          {INTEGRATION_POINTS.map((point) => (
            <li key={point.id} className="rounded-lg border border-ink-line bg-ink-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[16px]">{point.label}</h3>
                <TagBadge tone="acid">Not connected</TagBadge>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-chrome">{point.detail}</p>
              <p className="mt-2 text-[12px] text-chrome-dim">Owner: {point.owner}</p>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => setConfirming(point.id)}>
                Configure
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-lg border border-warn/40 bg-warn/5 p-5">
        <h2 className="text-xl text-warn">Compliance notice</h2>
        <p className="mt-3 text-[13px] leading-relaxed text-bone/85">{LEGAL.adminComplianceNotice}</p>
      </section>

      <ConfirmAction
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        onConfirm={() => setConfirming(null)}
        title="Change a compliance setting"
        description="Licence details, premises, integrations and legal configuration are compliance settings. Changing one requires Super Admin confirmation and is written to the audit log with the previous and new value."
        confirmLabel="Save change"
        requireReason
        superAdminOnly
      />
    </RequirePermission>
  );
}
