'use client';

import { useMemo, useState } from 'react';
import { BrandImage } from '@/components/ui/BrandImage';
import { Button } from '@/components/ui/Button';
import { TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { TagBadge } from '@/components/ui/Badge';
import { cx, formatBytes } from '@/lib/format';
import {
  ACCEPTED_UPLOAD_LABEL, ACCEPTED_UPLOAD_TYPES, DERIVATIVES, MAX_UPLOAD_BYTES,
  QUALITY_CHECKLIST, RECOMMENDED_RATIO,
} from '@/lib/mock/media';
import type { ProductMedia } from '@/lib/types';

/**
 * Product Photos editor.
 *
 * PRODUCTION INTEGRATION POINT - Media storage and processing:
 * - Uploads go straight to secure cloud object storage through short-lived signed URLs.
 *   The file never passes through the application server.
 * - Validate the real file type server-side by sniffing the bytes, not by trusting the
 *   extension or the browser-reported MIME type, and reject anything else.
 * - Scan every upload for malware before it is reachable.
 * - Generate the derivatives listed in DERIVATIVES as WebP or AVIF, keep the original
 *   private, and serve the public renditions from a CDN with lazy loading.
 * - Draft and hidden media must not be publicly reachable by URL.
 * - Every upload, replacement, reorder, hide and delete writes an audit row.
 *
 * Nothing in this component uploads, stores, converts or transmits a file. Selecting files
 * only reads their name, size and type locally to demonstrate the validation rules.
 */
export function ProductPhotos({ media: initial, productName }: { media: ProductMedia[]; productName: string }) {
  const [media, setMedia] = useState<ProductMedia[]>([...initial].sort((a, b) => a.sortOrder - b.sortOrder));
  const [preview, setPreview] = useState<'card' | 'detail' | 'mobile'>('card');
  const [selectedId, setSelectedId] = useState<string | null>(media[0]?.id ?? null);
  const [uploadNotes, setUploadNotes] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const selected = useMemo(() => media.find((m) => m.id === selectedId) ?? null, [media, selectedId]);
  const coverId = media.find((m) => m.role === 'cover')?.id ?? media[0]?.id;

  /** Local-only validation so the owner sees exactly what the server will enforce. */
  function inspectFiles(files: FileList | null) {
    if (!files) return;
    const notes = Array.from(files).map((file) => {
      if (!ACCEPTED_UPLOAD_TYPES.includes(file.type) && !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)) {
        return `Rejected ${file.name}: unsupported file type. Accepted: ${ACCEPTED_UPLOAD_LABEL}.`;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        return `Rejected ${file.name}: ${formatBytes(file.size)} exceeds the ${formatBytes(MAX_UPLOAD_BYTES)} limit.`;
      }
      return `Accepted ${file.name} (${formatBytes(file.size)}). In production this would upload, convert to WebP or AVIF and generate ${DERIVATIVES.length} renditions.`;
    });
    setUploadNotes(notes);
  }

  function move(id: string, direction: -1 | 1) {
    setMedia((current) => {
      const index = current.findIndex((m) => m.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((m, i) => ({ ...m, sortOrder: i }));
    });
  }

  function setCover(id: string) {
    setMedia((current) =>
      current.map((m) => ({ ...m, role: m.id === id ? 'cover' : m.role === 'cover' ? 'gallery' : m.role })),
    );
  }

  function setStatus(id: string, status: ProductMedia['status']) {
    setMedia((current) => current.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  function remove(id: string) {
    // A cover image cannot be deleted until another cover is chosen.
    if (id === coverId) return;
    setMedia((current) => current.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <section aria-labelledby="fp-product-photos" className="rounded-lg border border-ink-line bg-ink-card p-5">
      <h2 id="fp-product-photos" className="text-xl">Product Photos</h2>
      <p className="mt-2 text-[13px] leading-relaxed text-chrome">
        Cover photo, gallery order, alt text and publish status. Recommended ratio: {RECOMMENDED_RATIO}.
        Maximum {formatBytes(MAX_UPLOAD_BYTES)} per image. Accepted: {ACCEPTED_UPLOAD_LABEL}.
      </p>

      {/* ------------------------------------------------------------ upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); inspectFiles(e.dataTransfer.files); }}
        className={cx(
          'mt-5 rounded-sm border-2 border-dashed p-6 text-center transition-colors',
          dragOver ? 'border-acid bg-acid/5' : 'border-ink-line',
        )}
      >
        <p className="text-[14px] text-bone/90">Drag photos here, or choose a source</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <label className="inline-flex min-h-[44px] cursor-pointer items-center rounded-sm border border-chrome/40 px-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-bone transition-colors hover:bg-bone/5">
            Upload from device
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              className="sr-only"
              onChange={(e) => inspectFiles(e.target.files)}
            />
          </label>
          {/* capture="environment" opens the camera directly on iOS and Android where the
              browser allows it, and falls back to the file picker elsewhere. */}
          <label className="inline-flex min-h-[44px] cursor-pointer items-center rounded-sm border border-chrome/40 px-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-bone transition-colors hover:bg-bone/5">
            Take a photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => inspectFiles(e.target.files)}
            />
          </label>
        </div>
        <p className="mt-3 text-[12px] text-chrome-dim">
          Prototype: files are inspected locally and never uploaded, stored or transmitted.
        </p>
      </div>

      {uploadNotes.length > 0 ? (
        <ul className="mt-4 space-y-2" aria-live="polite">
          {uploadNotes.map((note) => (
            <li
              key={note}
              className={cx(
                'rounded-sm border px-3 py-2 text-[13px]',
                note.startsWith('Rejected')
                  ? 'border-danger/50 bg-danger/10 text-danger'
                  : 'border-emerald/50 bg-emerald/10 text-[#7FD8B6]',
              )}
            >
              {note}
            </li>
          ))}
        </ul>
      ) : null}

      {/* -------------------------------------------------------------- gallery */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="fp-eyebrow mb-3">Gallery order</p>
          <ul className="space-y-3">
            {media.map((m, index) => (
              <li
                key={m.id}
                className={cx(
                  'flex gap-3 rounded-sm border p-3',
                  selectedId === m.id ? 'border-bone' : 'border-ink-line',
                )}
              >
                <BrandImage seed={m.placeholderSeed} alt="" ratio="square" className="h-20 w-20 shrink-0 rounded-sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {m.id === coverId ? <TagBadge tone="bone">Cover</TagBadge> : null}
                    <TagBadge tone={m.status === 'published' ? 'emerald' : 'chrome'}>{m.status}</TagBadge>
                    <span className="text-[11px] text-chrome-dim">{m.role}</span>
                  </div>
                  <p className="mt-1.5 truncate text-[13px] text-bone/90">{m.altText || 'No alt text'}</p>
                  <p className="mt-0.5 text-[11px] text-chrome-dim">
                    {m.fileName} &middot; {m.width}&times;{m.height} &middot; {formatBytes(m.fileSizeBytes)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <MiniButton onClick={() => move(m.id, -1)} disabled={index === 0} label="Move up" />
                    <MiniButton onClick={() => move(m.id, 1)} disabled={index === media.length - 1} label="Move down" />
                    <MiniButton onClick={() => setSelectedId(m.id)} label="Edit" />
                    <MiniButton onClick={() => setCover(m.id)} disabled={m.id === coverId} label="Set as cover" />
                    <MiniButton
                      onClick={() => setStatus(m.id, m.status === 'hidden' ? 'published' : 'hidden')}
                      label={m.status === 'hidden' ? 'Restore' : 'Hide'}
                    />
                    <MiniButton
                      onClick={() => remove(m.id)}
                      disabled={m.id === coverId}
                      label="Delete"
                      title={m.id === coverId ? 'Choose another cover image before deleting this one.' : undefined}
                      danger
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] leading-relaxed text-chrome-dim">
            The cover photo cannot be deleted until another image is set as the cover. Hiding
            an image removes it from the customer site without destroying the record, and it
            can be restored later.
          </p>
        </div>

        {/* ------------------------------------------------------------ inspector */}
        <div className="space-y-5">
          <div>
            <p className="fp-eyebrow mb-3">Preview</p>
            <div className="flex gap-2">
              {(['card', 'detail', 'mobile'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreview(p)}
                  aria-pressed={preview === p}
                  className={cx(
                    'min-h-[40px] rounded-sm border px-3 text-[12px] font-semibold capitalize transition-colors',
                    preview === p ? 'border-bone bg-bone text-ink' : 'border-ink-line text-chrome',
                  )}
                >
                  {p === 'card' ? 'Product card' : p === 'detail' ? 'Detail page' : 'Mobile'}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-sm border border-ink-line bg-ink-soft p-4">
              <div className={cx('mx-auto', preview === 'card' && 'max-w-[200px]', preview === 'mobile' && 'max-w-[240px]')}>
                <BrandImage
                  seed={(media.find((m) => m.id === coverId) ?? media[0])?.placeholderSeed ?? productName}
                  alt=""
                  ratio={preview === 'detail' ? 'portrait' : preview === 'card' ? 'portrait' : 'square'}
                  className="rounded-sm"
                />
                <p className="mt-2 truncate text-[13px] font-semibold text-bone">{productName}</p>
                <p className="text-[11px] text-chrome-dim">
                  {preview === 'detail' ? 'Detail page, desktop' : preview === 'card' ? 'Grid card' : 'Mobile card'}
                </p>
              </div>
            </div>
          </div>

          {selected ? (
            <div className="space-y-4">
              <p className="fp-eyebrow">Selected image</p>
              <TextField
                label="Alt text"
                value={selected.altText}
                onChange={(e) =>
                  setMedia((current) => current.map((m) => (m.id === selected.id ? { ...m, altText: e.target.value } : m)))
                }
                hint="Describe what is in the photo for screen reader users. Never leave this empty on a product image."
              />
              <TextAreaField
                label="Internal note"
                rows={2}
                value={selected.internalNote ?? ''}
                onChange={(e) =>
                  setMedia((current) => current.map((m) => (m.id === selected.id ? { ...m, internalNote: e.target.value } : m)))
                }
                hint="Staff only. Never shown to customers."
              />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary">Crop</Button>
                <Button size="sm" variant="secondary">Rotate</Button>
                <Button size="sm" variant="secondary">Reframe</Button>
              </div>
              <p className="text-[12px] text-chrome-dim">
                Crop, rotate and reframe are applied before saving. Placeholder controls in this prototype.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------ quality checklist */}
      <div className="mt-6 rounded-sm border border-ink-line bg-ink-soft p-5">
        <p className="fp-eyebrow mb-3">Image quality checklist</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {QUALITY_CHECKLIST.map((item) => (
            <li key={item.id} className="flex items-start gap-2 text-[13px]">
              <span aria-hidden="true" className={cx('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', item.blocking ? 'bg-danger' : 'bg-chrome')} />
              <span className={item.blocking ? 'text-bone/90' : 'text-chrome'}>
                {item.label}
                {item.blocking ? <span className="ml-1 text-[11px] uppercase tracking-[0.1em] text-danger">required</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Notice tone="warning" className="mt-5" title="Rights and advertising rules">
        Do not upload copyrighted brand artwork the business does not have the rights to use.
        Cannabis advertising and packaging rules restrict what may appear in a product image.
        Have the image policy reviewed by a compliance professional before publishing.
      </Notice>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary">Save as draft</Button>
        <Button>Save and publish</Button>
      </div>
    </section>
  );
}

function MiniButton({
  onClick, label, disabled, danger, title,
}: { onClick: () => void; label: string; disabled?: boolean; danger?: boolean; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cx(
        'min-h-[36px] rounded-xs border px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        danger ? 'border-danger/40 text-danger hover:bg-danger/10' : 'border-ink-line text-chrome hover:text-bone',
      )}
    >
      {label}
    </button>
  );
}
