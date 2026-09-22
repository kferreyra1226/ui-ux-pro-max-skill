import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

type Tone = 'neutral' | 'legal' | 'warning' | 'success' | 'danger';

const TONES: Record<Tone, string> = {
  neutral: 'border-ink-line bg-ink-soft text-chrome',
  legal: 'border-emerald/40 bg-emerald/10 text-bone/90',
  warning: 'border-warn/40 bg-warn/10 text-warn',
  success: 'border-emerald/50 bg-emerald/15 text-bone/90',
  danger: 'border-danger/50 bg-danger/10 text-danger',
};

/**
 * Compliance and status notices. Legal copy uses this so it reads consistently and is
 * never styled as decorative fine print the customer can miss.
 */
export function Notice({
  tone = 'neutral', title, children, className, icon,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div className={cx('rounded-sm border px-4 py-3.5', TONES[tone], className)}>
      {title ? (
        <p className="mb-1 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em]">
          {icon}
          {title}
        </p>
      ) : null}
      <div className="text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}

/** Small inline marker used wherever a 21+ restriction applies. */
export function AgeBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-xs border border-chrome/40 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-chrome',
        className,
      )}
    >
      21+
    </span>
  );
}
