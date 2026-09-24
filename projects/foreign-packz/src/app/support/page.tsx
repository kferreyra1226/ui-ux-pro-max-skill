import type { Metadata } from 'next';
import Link from 'next/link';
import { Notice } from '@/components/ui/Notice';
import { SupportForm } from '@/components/site/SupportForm';
import { describeDay } from '@/lib/availability';
import { SUPPORT } from '@/lib/config';
import { WEEKDAYS } from '@/lib/mock/availability';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Contact Foreign Packz about an order request, an apparel order or anything else.',
};

export default function SupportPage() {
  return (
    <div className="fp-shell py-10 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="fp-eyebrow mb-3">Support</p>
        <h1 className="text-[clamp(2.25rem,8vw,4rem)]">Get in touch</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-chrome">
          Questions about a request, an apparel order, a product detail or a policy. We answer
          during support hours, New York time.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <SupportForm />
        </div>

        <aside className="space-y-6">
          <div className="fp-card p-6">
            <h2 className="text-lg">Contact</h2>
            <dl className="mt-4 space-y-3 text-[14px]">
              <Item label="Email" value={SUPPORT.email} />
              <Item label="Phone" value={SUPPORT.phone} />
              <Item label="SMS" value={SUPPORT.sms} />
              <Item label="Hours" value={SUPPORT.hours} />
              <Item label="Typical response" value={SUPPORT.responseTime} />
            </dl>
          </div>

          <div className="fp-card p-6">
            <h2 className="text-lg">Support hours</h2>
            <p className="mt-2 text-[12px] text-chrome-dim">All times America/New_York.</p>
            <dl className="mt-4 space-y-2 text-[13px]">
              {WEEKDAYS.map((d) => (
                <div key={d.key} className="flex justify-between gap-4">
                  <dt className="text-chrome">{d.label}</dt>
                  <dd className="text-bone/90">{describeDay('customer-support', d.key)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="fp-card p-6">
            <h2 className="text-lg">Common topics</h2>
            <ul className="mt-4 space-y-3 text-[14px]">
              <li>
                <p className="font-semibold text-bone">Order request help</p>
                <p className="mt-1 text-[13px] leading-relaxed text-chrome">
                  Change, cancel or ask about a request while it is still awaiting review. Have
                  your request number ready.
                </p>
              </li>
              <li>
                <p className="font-semibold text-bone">Apparel order help</p>
                <p className="mt-1 text-[13px] leading-relaxed text-chrome">
                  Shipping, sizing, exchanges and returns for apparel and accessories.
                </p>
              </li>
              <li>
                <Link href="/faq" className="text-[14px] font-semibold text-acid underline underline-offset-4">
                  Read the full FAQ
                </Link>
              </li>
            </ul>
          </div>

          <Notice tone="warning" title="Emergency and safety">
            This form and inbox are not monitored continuously and must never be used to report
            an emergency. In an emergency, call 911. For poison or overdose concerns, contact
            Poison Control at 1-800-222-1222. [ADDITIONAL SAFETY RESOURCE PLACEHOLDER]
          </Notice>
        </aside>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-chrome">{label}</dt>
      <dd className="text-right text-bone/90">{value}</dd>
    </div>
  );
}
