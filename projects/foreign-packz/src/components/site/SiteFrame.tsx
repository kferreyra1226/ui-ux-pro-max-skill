'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AgeGate } from '@/components/site/AgeGate';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { MobileTabBar } from '@/components/site/MobileTabBar';
import { CartDrawer } from '@/components/commerce/CartDrawer';

/**
 * Chooses the shell for the current route.
 * The staff dashboard has its own navigation and must never render the customer header,
 * footer, cart or the 21+ gate over it. Everything else gets the full storefront chrome.
 */
export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main" className="fp-skip-link">Skip to content</a>
      <AgeGate />
      <Header />
      <main id="main" className="pb-[var(--fp-tabbar)] md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
      <CartDrawer />
    </>
  );
}
