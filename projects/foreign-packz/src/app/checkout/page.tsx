import type { Metadata } from 'next';
import { CheckoutFlow } from '@/components/commerce/CheckoutFlow';

export const metadata: Metadata = {
  title: 'Order Request',
  description: 'Submit an order request. Cannabis orders are reviewed by the business before confirmation.',
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
