import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteFrame } from '@/components/site/SiteFrame';
import { AgeGateProvider } from '@/context/AgeGateContext';
import { CartProvider } from '@/context/CartContext';
import { BRAND } from '@/lib/config';

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} - Premium adult-use cannabis and limited streetwear`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    'Curated cannabis products, premium accessories, and New York-inspired apparel for adults 21+. Licensed adult-use business.',
  // PRODUCTION: review robots/indexing rules with counsel. Cannabis advertising and
  // search indexing are regulated and platform policies differ.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // iPhone safe-area support for the sticky tab bar
  themeColor: '#101010',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AgeGateProvider>
          <CartProvider>
            <SiteFrame>{children}</SiteFrame>
          </CartProvider>
        </AgeGateProvider>
      </body>
    </html>
  );
}
