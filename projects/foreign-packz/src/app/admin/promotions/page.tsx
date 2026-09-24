'use client';

import { AdminPageHeader, MockDataBanner, RequirePermission } from '@/components/admin/primitives';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { SelectField, TextField } from '@/components/ui/Field';

/**
 * Promotions.
 * Cannabis discounting, bundling and loyalty incentives are restricted in New York. Nothing
 * on this screen may be enabled for a cannabis product until counsel confirms the specific
 * promotion type is permitted for this licence.
 */
export default function AdminPromotionsPage() {
  return (
    <RequirePermission permission="products.edit">
      <AdminPageHeader
        title="Promotions"
        description="Apparel promotions and, only where the law allows, cannabis pricing adjustments."
        actions={<Button>Create promotion</Button>}
      />

      <MockDataBanner>No promotion in this prototype is active or applied at checkout.</MockDataBanner>

      <Notice tone="danger" className="mb-6" title="Legal review required before any cannabis promotion">
        New York restricts cannabis discounting, bundling, giveaways, loyalty rewards and
        advertising. Do not enable a promotion on a cannabis product until a New York cannabis
        attorney confirms that specific promotion type is permitted for this licence type.
        Apparel promotions are not subject to the same restrictions.
      </Notice>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-ink-line bg-ink-card p-5">
          <h2 className="text-xl">Apparel promotion</h2>
          <div className="mt-4 space-y-4">
            <TextField label="Promotion name" placeholder="Drop 03 launch" />
            <SelectField label="Type" defaultValue="percent">
              <option value="percent">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
              <option value="shipping">Free apparel shipping</option>
            </SelectField>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Starts" type="date" />
              <TextField label="Ends" type="date" />
            </div>
            <Button>Save promotion</Button>
          </div>
        </section>

        <section className="rounded-lg border border-danger/40 bg-ink-card p-5">
          <h2 className="text-xl">Cannabis price adjustment</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-chrome">
            Disabled until the business records written confirmation that the adjustment type
            is permitted. A sale price can still be set per product in the product editor
            where business policy and applicable law allow it.
          </p>
          <div className="mt-4 space-y-4 opacity-60">
            <TextField label="Promotion name" disabled placeholder="Blocked pending legal review" />
            <SelectField label="Type" disabled defaultValue="percent">
              <option value="percent">Percentage off</option>
            </SelectField>
            <Button disabled>Blocked pending legal review</Button>
          </div>
        </section>
      </div>
    </RequirePermission>
  );
}
