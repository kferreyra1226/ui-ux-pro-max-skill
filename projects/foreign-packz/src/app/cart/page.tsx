import type { Metadata } from 'next';
import { CartPageView } from '@/components/commerce/CartPageView';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review your cannabis order request and apparel items before continuing.',
};

export default function CartPage() {
  return <CartPageView />;
}
