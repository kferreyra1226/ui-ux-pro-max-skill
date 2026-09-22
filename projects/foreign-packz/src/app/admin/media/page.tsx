'use client';

import { useMemo, useState } from 'react';
import { AdminPageHeader, ConfirmAction, MockDataBanner, RequirePermission } from '@/components/admin/primitives';
import { BrandImage } from '@/components/ui/BrandImage';
import { Button } from '@/components/ui/Button';
import { TagBadge } from '@/components/ui/Badge';
import { TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { cx, formatBytes, formatDate } from '@/lib/format';
import { MEDIA_FILTERS, MEDIA_LIBRARY, type MediaFilterKey } from '@/lib/mock/media';
import { getProductById } from '@/lib/mock/products';

/**
 * Media Library.
 *
 * PRODUCTION INTEGRATION POINT - Media storage:
 * Secure cloud object storage, signed upload URLs, server-side byte-level file validation,
 * malware scanning, derivative generation, access control and CDN delivery. Draft and
 * hidden media must not be publicly reachable. Upload, replace, hide, delete and reorder
 * each write an audit row naming the admin account and the affected asset.
 */
export default function AdminMediaPage() {
  const [filter, setFilter] = useState<MediaFilterKey>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'assign' | 'archive' | null>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEDIA_LIBRARY.filter((m) => {
      const product = m.productId ? getProductById(m.productId) : null;
      if (filter === 'cannabis' && product?.productClass !== 'cannabis') return false;
      if (filter === 'apparel' && product?.productClass !== 'apparel') return false;
      if (filter === 'accessories' && product?.productClass !== 'accessory') return false;
      if (filter === 'unused' && m.productId) return false;
      if (filter === 'draft' && m.status !== 'draft') return false;
      if (filter === 'published' && m.status !== 'published') return false;
      if (!q) return true;
      return [m.fileName, m.altText, m.productName ?? '', product?.sku ?? '', m.tags.join(' '), m.uploadedAt]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [filter, query]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <RequirePermission permission="media.manage">
      <AdminPageHeader
        title="Media Library"
        description="Every uploaded photo, where it is used, and who uploaded it."
        actions={
          <>
            <Button variant="secondary" disabled={selected.length === 0} onClick={() => setBulkAction('assign')}>
              Assign to product ({selected.length})
            </Button>
            <Button variant="danger" disabled={selected.length === 0} onClick={() => setBulkAction('archive')}>
              Archive selected
            </Button>
          </>
        }
      />

      <MockDataBanner>
        No file in this library exists on disk. Each tile renders the branded placeholder
        artwork described by its record.
      </MockDataBanner>

      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <TextField
          label="Search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Product name, SKU, filename, tag or upload date"
        />
        <p aria-live="polite" className="pb-3 text-[13px] text-chrome">
          {items.length} {items.length === 1 ? 'asset' : 'assets'}
        </p>
      </div>

      <div className="fp-rail mb-6 gap-2" role="group" aria-label="Filter media">
        {MEDIA_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={cx(
              'min-h-[44px] shrink-0 rounded-sm border px-4 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors',
              filter === f.key ? 'border-bone bg-bone text-ink' : 'border-ink-line text-chrome hover:text-bone',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-ink-line bg-ink-card p-12 text-center">
          <p className="text-[14px] text-chrome">No media matches this search.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => {
            const product = m.productId ? getProductById(m.productId) : null;
            const isCover = product?.media[0]?.id === m.id;
            const checked = selected.includes(m.id);
            return (
              <li key={m.id} className={cx('overflow-hidden rounded-lg border bg-ink-card', checked ? 'border-bone' : 'border-ink-line')}>
                <div className="relative">
                  <BrandImage seed={m.placeholderSeed} alt={m.altText} ratio="square" />
                  <label className="absolute left-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm bg-ink/80">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(m.id)}
                      className="h-4 w-4 accent-emerald"
                      aria-label={`Select ${m.fileName}`}
                    />
                  </label>
                  <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
                    {isCover ? <TagBadge tone="bone">Cover</TagBadge> : null}
                    <TagBadge tone={m.status === 'published' ? 'emerald' : 'chrome'}>{m.status}</TagBadge>
                  </div>
                </div>
                <div className="space-y-1 p-3">
                  <p className="truncate text-[13px] font-semibold text-bone">{m.fileName}</p>
                  <p className="text-[11px] text-chrome-dim">
                    {m.width}&times;{m.height} &middot; {formatBytes(m.fileSizeBytes)}
                  </p>
                  <p className="text-[11px] text-chrome-dim">
                    {formatDate(m.uploadedAt)} &middot; {m.uploadedBy}
                  </p>
                  <p className="truncate text-[11px] text-chrome">Used: {m.usage}</p>
                  {isCover ? (
                    <p className="text-[11px] text-warn">
                      Cover image. Choose another cover before deleting.
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Notice tone="warning" className="mt-8" title="Deletion rules">
        A photo that is currently a product&rsquo;s cover image cannot be deleted until another
        cover is selected. Bulk archival and deletion require Super Admin confirmation, and
        every upload, replacement, hide, delete and reorder is written to the audit log.
      </Notice>

      <ConfirmAction
        open={bulkAction === 'assign'}
        onClose={() => setBulkAction(null)}
        onConfirm={() => { setBulkAction(null); setSelected([]); }}
        title={`Assign ${selected.length} photo${selected.length === 1 ? '' : 's'} to a product`}
        description="The selected photos are attached to the chosen product's gallery. The product's cover image is not changed."
        confirmLabel="Assign photos"
      />
      <ConfirmAction
        open={bulkAction === 'archive'}
        onClose={() => setBulkAction(null)}
        onConfirm={() => { setBulkAction(null); setSelected([]); }}
        title={`Archive ${selected.length} photo${selected.length === 1 ? '' : 's'}`}
        description="Archiving removes these photos from the customer site while keeping the records. Any photo that is currently a cover image is skipped."
        confirmLabel="Archive photos"
        requireReason
        superAdminOnly
      />
    </RequirePermission>
  );
}
