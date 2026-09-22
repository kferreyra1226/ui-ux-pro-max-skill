import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderRequestView } from '@/app/order-request/OrderRequestView';

export const metadata: Metadata = {
  title: 'Order request received',
  description: 'Your order request has been received and is awaiting review by the business.',
};

/**
 * Order request confirmation.
 *
 * The request reference arrives as ?ref= rather than as a path segment, because a request
 * number is issued at submission time and cannot be known when the site is built.
 * PRODUCTION: serve this from the secure database behind an authenticated or signed link.
 */
export default function OrderRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="fp-shell py-16 text-center">
          <p className="text-[13px] uppercase tracking-[0.16em] text-chrome-dim">
            Loading your request&hellip;
          </p>
        </div>
      }
    >
      <OrderRequestView />
    </Suspense>
  );
}
