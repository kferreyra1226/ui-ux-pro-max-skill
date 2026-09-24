'use client';

import { useState } from 'react';
import { AdminPageHeader, ConfirmAction, DataTable, MockDataBanner, RequirePermission, type Column } from '@/components/admin/primitives';
import { Button } from '@/components/ui/Button';
import { TagBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { TextAreaField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { formatDate } from '@/lib/format';
import { CONTENT_BLOCKS } from '@/lib/mock/content';
import type { ContentBlock } from '@/lib/types';

/**
 * Content management.
 * A Content Manager may draft anything, but a block flagged `requiresOwnerApproval` carries
 * legal or compliance copy and can only be published by the Super Admin / Owner.
 */
export default function AdminContentPage() {
  const [previewing, setPreviewing] = useState<ContentBlock | null>(null);
  const [publishing, setPublishing] = useState<ContentBlock | null>(null);

  const columns: Column<ContentBlock>[] = [
    {
      key: 'label',
      header: 'Content block',
      render: (b) => (
        <div>
          <p className="font-semibold text-bone">{b.label}</p>
          <p className="mt-0.5 text-[12px] text-chrome-dim"><code>{b.key}</code></p>
        </div>
      ),
    },
    { key: 'area', header: 'Area', hideOnMobile: true, render: (b) => <span className="capitalize text-chrome">{b.area}</span> },
    {
      key: 'value',
      header: 'Current value',
      hideOnMobile: true,
      render: (b) => <span className="line-clamp-2 max-w-md text-chrome">{b.value}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (b) => (
        <div className="space-y-1.5">
          <TagBadge tone={b.status === 'published' ? 'emerald' : b.status === 'pending-approval' ? 'acid' : 'chrome'}>
            {b.status === 'pending-approval' ? 'Pending approval' : b.status}
          </TagBadge>
          {b.requiresOwnerApproval ? <TagBadge tone="chrome">Owner approval</TagBadge> : null}
        </div>
      ),
    },
    { key: 'updated', header: 'Updated', hideOnMobile: true, render: (b) => <span className="text-chrome">{formatDate(b.updatedAt)}<br />{b.updatedBy}</span> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (b) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPreviewing(b)}>Preview</Button>
          <Button size="sm" variant="ghost" onClick={() => setPublishing(b)}>Publish</Button>
        </div>
      ),
    },
  ];

  return (
    <RequirePermission permission="content.edit">
      <AdminPageHeader
        title="Content"
        description="Homepage hero, banners, collections, apparel campaign copy, the about page, FAQ, support details and policy pages."
      />

      <MockDataBanner>Content edits are not saved in this prototype.</MockDataBanner>

      <Notice tone="warning" className="mb-6" title="Legal and compliance copy">
        Blocks marked &ldquo;Owner approval&rdquo; carry legal notices, warnings or compliance
        language. A Content Manager can draft a change, but only the Super Admin / Owner can
        publish it, and substantive changes should be reviewed by counsel first.
      </Notice>

      <DataTable columns={columns} rows={CONTENT_BLOCKS} getKey={(b) => b.id} caption="Content blocks" />

      <Modal
        open={previewing !== null}
        onClose={() => setPreviewing(null)}
        title={`Preview - ${previewing?.label ?? ''}`}
        description="How this copy appears on the customer site before it is published."
        size="md"
      >
        {previewing ? (
          <div className="space-y-4">
            <div className="rounded-sm border border-ink-line bg-ink-soft p-5">
              <p className="text-[15px] leading-relaxed text-bone/90">{previewing.value}</p>
            </div>
            <TextAreaField label="Edit copy" rows={4} defaultValue={previewing.value} />
            <p className="text-[12px] text-chrome-dim">
              Previewing does not publish. The live site is unchanged until the block is published.
            </p>
          </div>
        ) : null}
      </Modal>

      <ConfirmAction
        open={publishing !== null}
        onClose={() => setPublishing(null)}
        onConfirm={() => setPublishing(null)}
        title={`Publish - ${publishing?.label ?? ''}`}
        description="Publishing replaces the copy on the live customer site immediately and writes an audit row with the previous and new value."
        confirmLabel="Publish"
        requireReason={publishing?.requiresOwnerApproval}
        superAdminOnly={publishing?.requiresOwnerApproval}
      />
    </RequirePermission>
  );
}
