import Link from 'next/link';
import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

export function SectionHeading({
  eyebrow, title, description, action, className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cx('mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10', className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="fp-eyebrow mb-3">{eyebrow}</p> : null}
        <h2 className="text-[clamp(1.75rem,5.5vw,2.75rem)]">{title}</h2>
        {description ? (
          <p className="mt-3 text-[15px] leading-relaxed text-chrome">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-[44px] items-center border-b border-chrome/40 pb-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-chrome transition-colors hover:border-bone hover:text-bone"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function Section({
  children, className, bone, id,
}: { children: ReactNode; className?: string; bone?: boolean; id?: string }) {
  return (
    <section id={id} className={cx('fp-section', bone && 'bg-bone text-ink', className)}>
      <div className="fp-shell">{children}</div>
    </section>
  );
}
