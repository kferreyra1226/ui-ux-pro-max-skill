'use client';

import { AdminPageHeader, DataTable, MockDataBanner, RequirePermission, type Column } from '@/components/admin/primitives';
import { Button } from '@/components/ui/Button';
import { TagBadge } from '@/components/ui/Badge';
import { CATEGORIES, type CategoryMeta } from '@/lib/mock/catalog';
import { PRODUCTS } from '@/lib/mock/products';

export default function AdminCategoriesPage() {
  const columns: Column<CategoryMeta>[] = [
    { key: 'label', header: 'Category', render: (c) => <span className="font-semibold text-bone">{c.label}</span> },
    { key: 'slug', header: 'Slug', hideOnMobile: true, render: (c) => <code className="text-chrome">{c.slug}</code> },
    { key: 'blurb', header: 'Customer blurb', hideOnMobile: true, render: (c) => c.blurb },
    {
      key: 'age',
      header: 'Age restricted',
      render: (c) => (c.ageRestricted ? <TagBadge tone="acid">21+ only</TagBadge> : <TagBadge>Open</TagBadge>),
    },
    {
      key: 'count',
      header: 'Products',
      align: 'right',
      render: (c) => <span className="tabular-nums">{PRODUCTS.filter((p) => p.category === c.slug && !p.archived).length}</span>,
    },
    { key: 'actions', header: 'Actions', align: 'right', render: () => <Button size="sm" variant="secondary">Edit</Button> },
  ];

  return (
    <RequirePermission permission="products.edit">
      <AdminPageHeader
        title="Categories"
        description="Category names, customer-facing copy and which categories sit behind the 21+ gate."
        actions={<Button>Add category</Button>}
      />
      <MockDataBanner>Categories are defined in code in this prototype and are not editable here.</MockDataBanner>
      <DataTable columns={columns} rows={CATEGORIES} getKey={(c) => c.slug} caption="Categories" />
    </RequirePermission>
  );
}
