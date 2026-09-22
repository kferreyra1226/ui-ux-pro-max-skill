'use client';

import { useState } from 'react';
import {
  AdminPageHeader, ConfirmAction, DataTable, MockDataBanner, RequirePermission, type Column,
} from '@/components/admin/primitives';
import { ProductPhotos } from '@/components/admin/ProductPhotos';
import { AvailabilityChip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { formatDate, formatPrice } from '@/lib/format';
import { STATUS_LABELS, derivedStatus } from '@/lib/inventory';
import { CATEGORIES, categoryLabel } from '@/lib/mock/catalog';
import { PRODUCTS } from '@/lib/mock/products';
import type { Product } from '@/lib/types';

/**
 * Product create / edit.
 *
 * PRODUCTION: every field written here must be validated server-side, persisted in the
 * secure database, mirrored to the licensed POS where the POS is the system of record, and
 * recorded in the audit log with the previous and new value.
 */
export default function AdminProductsPage() {
  const [editing, setEditing] = useState<Product | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Product | null>(null);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      render: (p) => (
        <div>
          <p className="font-semibold text-bone">{p.name}</p>
          <p className="mt-0.5 text-[12px] text-chrome-dim">{p.sku} &middot; {categoryLabel(p.category)}</p>
        </div>
      ),
    },
    { key: 'class', header: 'Type', hideOnMobile: true, render: (p) => <span className="capitalize text-chrome">{p.productClass}</span> },
    { key: 'brand', header: 'Brand', hideOnMobile: true, render: (p) => p.brand },
    { key: 'price', header: 'Price', align: 'right', render: (p) => <span className="tabular-nums">{formatPrice(p.salePriceCents ?? p.priceCents)}</span> },
    { key: 'status', header: 'Availability', render: (p) => <AvailabilityChip status={derivedStatus(p)} label={STATUS_LABELS[derivedStatus(p)]} /> },
    { key: 'updated', header: 'Updated', hideOnMobile: true, render: (p) => <span className="text-chrome">{formatDate(p.updatedAt)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>Edit</Button>
          <Button size="sm" variant="ghost" onClick={() => setArchiveTarget(p)}>Archive</Button>
        </div>
      ),
    },
  ];

  if (editing) {
    return (
      <RequirePermission permission="products.edit">
        <AdminPageHeader
          title={`Edit - ${editing.name}`}
          description="Product details, regulated information and photos."
          actions={<Button variant="secondary" onClick={() => setEditing(null)}>Back to products</Button>}
        />
        <ProductEditor product={editing} />
      </RequirePermission>
    );
  }

  return (
    <RequirePermission permission="products.edit">
      <AdminPageHeader
        title="Products"
        description="Create, edit and archive products. Records are archived rather than deleted so history survives."
        actions={
          <>
            <Button variant="secondary" onClick={() => setBulkPriceOpen(true)}>Mass price change</Button>
            <Button>Add product</Button>
          </>
        }
      />
      <MockDataBanner>
        The catalog below is mock data held in this prototype. Nothing is saved.
      </MockDataBanner>
      <DataTable columns={columns} rows={PRODUCTS} getKey={(p) => p.id} caption="Products" />

      <ConfirmAction
        open={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => setArchiveTarget(null)}
        title={`Archive ${archiveTarget?.name ?? ''}`}
        description="Archiving hides the product from customers while keeping the record, its history and its audit trail. Products are never permanently deleted."
        confirmLabel="Archive product"
        requireReason
      />
      <ConfirmAction
        open={bulkPriceOpen}
        onClose={() => setBulkPriceOpen(false)}
        onConfirm={() => setBulkPriceOpen(false)}
        title="Mass price change"
        description="Changing many prices at once is high risk. Super Admin confirmation and a recorded reason are required, and every affected product gets its own audit row."
        confirmLabel="Confirm price change"
        requireReason
        superAdminOnly
      />
    </RequirePermission>
  );
}

function ProductEditor({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-ink-line bg-ink-card p-5">
        <h2 className="text-xl">Details</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TextField label="Product name" defaultValue={product.name} />
          <TextField label="Internal SKU" defaultValue={product.sku} hint="Never shown to customers." />
          <SelectField label="Category" defaultValue={product.category}>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </SelectField>
          <TextField label="Brand" defaultValue={product.brand} />
          <TextField label="Product type / format" defaultValue={product.format} />
          <TextField label="Package size" defaultValue={product.packageSize} />
          <TextField label="Price (USD)" defaultValue={(product.priceCents / 100).toFixed(2)} inputMode="decimal" />
          <TextField
            label="Sale price (USD)"
            defaultValue={product.salePriceCents ? (product.salePriceCents / 100).toFixed(2) : ''}
            inputMode="decimal"
            hint="Only where business policy and applicable law allow a discounted cannabis price. Confirm with counsel before using."
          />
          <TextField label="Stock quantity" defaultValue={String(product.stockQuantity)} inputMode="numeric" hint="Adjust stock from the Inventory screen so a reason is recorded." />
          <TextField label="Low-stock threshold" defaultValue={String(product.lowStockThreshold)} inputMode="numeric" />
          <SelectField label="Availability" defaultValue={derivedStatus(product)}>
            {(Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </SelectField>
          <div className="grid gap-3">
            <Toggle label="Pickup eligible" defaultChecked={product.pickupEligible} />
            <Toggle label="Delivery eligible" defaultChecked={product.deliveryEligible} />
            <Toggle
              label="Shipping eligible"
              defaultChecked={product.shippingEligible}
              disabled={product.productClass === 'cannabis'}
              note={product.productClass === 'cannabis' ? 'Cannabis can never be shipped. This is enforced in code, not only here.' : undefined}
            />
          </div>
        </div>
        <TextAreaField label="Description" className="mt-5" rows={4} defaultValue={product.description} hint="No medical or health claims, and no claims about effect or strength." />
      </section>

      {product.cannabisInfo ? (
        <section className="rounded-lg border border-ink-line bg-ink-card p-5">
          <h2 className="text-xl">Regulated product information</h2>
          <Notice tone="warning" className="mt-3" title="Compliance fields">
            These values must match the lot record and the lab documentation for this specific
            batch. Do not enter an approximate or copied value.
          </Notice>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <TextAreaField label="Ingredients" rows={3} defaultValue={product.cannabisInfo.ingredients} />
            <TextAreaField label="Warnings" rows={3} defaultValue={product.cannabisInfo.warnings} />
            <TextField label="Potency details" defaultValue={product.cannabisInfo.potency} />
            <TextField label="Lot / batch number" defaultValue={product.cannabisInfo.lotNumber} />
            <TextField label="Expiration date" defaultValue={product.cannabisInfo.expirationDate} />
            <TextField label="Lab documentation link" defaultValue={product.cannabisInfo.labDocumentUrl} />
            <TextField label="Seed-to-sale tracking reference" defaultValue={product.cannabisInfo.trackingReference} />
          </div>
        </section>
      ) : null}

      {product.apparelInfo ? (
        <section className="rounded-lg border border-ink-line bg-ink-card p-5">
          <h2 className="text-xl">Apparel details</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <TextField label="Sizes" defaultValue={product.apparelInfo.sizes.join(', ')} />
            <TextField label="Colorways" defaultValue={product.apparelInfo.colorways.join(', ')} />
            <TextAreaField label="Fit notes" rows={2} defaultValue={product.apparelInfo.fitNotes} />
            <TextAreaField label="Material" rows={2} defaultValue={product.apparelInfo.material} />
            <TextAreaField label="Care information" rows={2} defaultValue={product.apparelInfo.careInstructions} />
            <TextAreaField label="Shipping and returns" rows={2} defaultValue={product.apparelInfo.returnPolicy} />
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-ink-line bg-ink-card p-5">
        <h2 className="text-xl">Internal staff notes</h2>
        <TextAreaField
          label="Notes"
          className="mt-4"
          rows={3}
          defaultValue={product.staffNotes}
          hint="Never visible to customers and never included in a customer-facing response."
        />
      </section>

      <ProductPhotos media={product.media} productName={product.name} />

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary">Save as draft</Button>
        <Button>Save and publish</Button>
      </div>
    </div>
  );
}

function Toggle({
  label, defaultChecked, disabled, note,
}: { label: string; defaultChecked: boolean; disabled?: boolean; note?: string }) {
  return (
    <div>
      <label className="flex items-center gap-3 text-[14px] text-bone/90">
        <input type="checkbox" defaultChecked={defaultChecked && !disabled} disabled={disabled} className="h-5 w-5 accent-emerald" />
        {label}
      </label>
      {note ? <p className="mt-1 pl-8 text-[12px] text-chrome-dim">{note}</p> : null}
    </div>
  );
}
