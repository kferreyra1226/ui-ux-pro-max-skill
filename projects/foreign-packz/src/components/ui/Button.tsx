'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'bone' | 'danger';
type Size = 'sm' | 'md' | 'lg';

/** Every target is at least 44px tall so it stays comfortable one-handed on an iPhone. */
const SIZES: Record<Size, string> = {
  sm: 'min-h-[40px] px-4 text-[13px]',
  md: 'min-h-[48px] px-6 text-sm',
  lg: 'min-h-[56px] px-8 text-base',
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-emerald text-white hover:bg-emerald-soft active:bg-emerald-deep disabled:bg-ink-line disabled:text-chrome-dim',
  secondary:
    'border border-chrome/40 bg-transparent text-bone hover:border-chrome hover:bg-bone/5 disabled:border-ink-line disabled:text-chrome-dim',
  ghost: 'bg-transparent text-chrome hover:text-bone hover:bg-bone/5',
  bone: 'bg-bone text-ink hover:bg-white active:bg-bone-soft disabled:bg-bone-line disabled:text-chrome-dim',
  danger: 'border border-danger/60 text-danger hover:bg-danger/10',
};

const BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-sm font-semibold uppercase tracking-[0.12em] transition-all duration-200 ease-fp disabled:cursor-not-allowed';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary', size = 'md', fullWidth, className, children, ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(BASE, SIZES[size], VARIANTS[variant], fullWidth && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href, variant = 'primary', size = 'md', fullWidth, className, children, ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean }) {
  return (
    <Link
      href={href}
      className={cx(BASE, SIZES[size], VARIANTS[variant], fullWidth && 'w-full', className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
