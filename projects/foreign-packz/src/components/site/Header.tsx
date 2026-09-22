'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { AVAILABILITY } from '@/lib/mock/availability';
import { deliveryMessage, deliveryTone } from '@/lib/availability';
import { BRAND } from '@/lib/config';
import { cx, isRoute } from '@/lib/format';

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/apparel', label: 'Apparel' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/support', label: 'Support' },
];

const TONE_DOT = {
  open: 'bg-[#7FD8B6]',
  limited: 'bg-warn',
  closed: 'bg-chrome-dim',
} as const;

export function Header() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const tone = deliveryTone(AVAILABILITY);

  return (
    <>
      {/* Live availability strip: the customer sees the current request status everywhere. */}
      <div className="border-b border-ink-line bg-ink-soft">
        <div className="fp-shell flex items-center justify-center gap-2 py-2 text-center">
          <span aria-hidden="true" className={cx('h-1.5 w-1.5 shrink-0 rounded-full', TONE_DOT[tone])} />
          <p className="text-[11px] leading-snug tracking-[0.04em] text-chrome">
            {deliveryMessage(AVAILABILITY)}
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-ink-line bg-ink">
        <div className="fp-shell flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.04em] text-bone md:text-2xl"
            aria-label={`${BRAND.name} home`}
          >
            FOREIGN<span className="text-emerald-soft">&nbsp;</span>PACKZ
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = isRoute(pathname, item.href) || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'rounded-sm px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors',
                    active ? 'text-bone' : 'text-chrome hover:text-bone',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={openDrawer}
              className="relative grid h-11 w-11 place-items-center rounded-sm text-bone transition-colors hover:bg-bone/5"
              aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
            >
              <CartIcon />
              {count > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-emerald px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="fp-mobile-menu"
              className="grid h-11 w-11 place-items-center rounded-sm text-bone transition-colors hover:bg-bone/5 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span aria-hidden="true" className="flex flex-col gap-[5px]">
                <span className={cx('block h-[1.5px] w-5 bg-current transition-transform', menuOpen && 'translate-y-[6.5px] rotate-45')} />
                <span className={cx('block h-[1.5px] w-5 bg-current transition-opacity', menuOpen && 'opacity-0')} />
                <span className={cx('block h-[1.5px] w-5 bg-current transition-transform', menuOpen && '-translate-y-[6.5px] -rotate-45')} />
              </span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            id="fp-mobile-menu"
            aria-label="Mobile"
            className="border-t border-ink-line bg-ink px-[var(--fp-gutter)] pb-4 pt-2 md:hidden"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-ink-line py-4 text-base font-semibold uppercase tracking-[0.12em] text-bone last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
    </>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h2l1.6 8.4A1.5 1.5 0 008.07 14.6h6.3a1.5 1.5 0 001.47-1.2L17 7H5.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="17" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="17" r="1.1" fill="currentColor" />
    </svg>
  );
}
