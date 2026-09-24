'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { cx, isRoute } from '@/lib/format';

/**
 * Sticky bottom tab bar, iPhone first.
 * Sits inside the safe area, every target is 56px+ tall and reachable with a thumb, and
 * the cart is a button rather than a link so the drawer opens in place.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();

  if (pathname.startsWith('/admin')) return null;

  const items = [
    { href: '/', label: 'Home', icon: <HomeIcon /> },
    { href: '/shop', label: 'Shop', icon: <BagIcon /> },
    { href: '/apparel', label: 'Apparel', icon: <ShirtIcon /> },
  ];

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-line bg-ink/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.href === '/'
            ? isRoute(pathname, '/')
            : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors',
                  active ? 'text-bone' : 'text-chrome-dim',
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex min-h-[60px] w-full flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-chrome-dim transition-colors"
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <CartIcon />
            Cart
            {count > 0 ? (
              <span className="absolute right-[22%] top-2 grid h-4 min-w-[16px] place-items-center rounded-full bg-emerald px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </button>
        </li>
        <li>
          <Link
            href="/support"
            aria-current={pathname.startsWith('/support') ? 'page' : undefined}
            className={cx(
              'flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors',
              pathname.startsWith('/support') ? 'text-bone' : 'text-chrome-dim',
            )}
          >
            <SupportIcon />
            Support
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const S = { stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 8.5L10 3l7 5.5V16a1 1 0 01-1 1h-3.5v-5h-5v5H4a1 1 0 01-1-1V8.5z" {...S} />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.5 6h11l-1 11h-9l-1-11z" {...S} />
      <path d="M7.5 8V5.5a2.5 2.5 0 015 0V8" {...S} />
    </svg>
  );
}
function ShirtIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 3l3 2 3-2 4 2.5-1.5 3L14 8v9H6V8L4.5 8.5 3 5.5 7 3z" {...S} />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h2l1.6 8.4a1.5 1.5 0 001.47 1.2h6.3a1.5 1.5 0 001.47-1.2L17 7H5.4" {...S} />
      <circle cx="8.5" cy="17" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="17" r="1.1" fill="currentColor" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" {...S} />
      <path d="M8 8a2 2 0 113 1.7c-.6.4-1 .8-1 1.6" {...S} />
      <circle cx="10" cy="14" r=".9" fill="currentColor" />
    </svg>
  );
}
