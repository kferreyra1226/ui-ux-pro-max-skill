'use client';

import { cx } from '@/lib/format';

/** 44px targets on both controls so it works one-handed. */
export function QuantityStepper({
  value, onChange, max, min = 1, label = 'Quantity', className,
}: {
  value: number;
  onChange: (next: number) => void;
  max: number;
  min?: number;
  label?: string;
  className?: string;
}) {
  const ceiling = Math.max(min, max);
  return (
    <div className={cx('inline-flex items-center rounded-sm border border-ink-line bg-ink-soft', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className="grid h-11 w-11 place-items-center text-lg text-bone transition-colors hover:bg-bone/5 disabled:text-chrome-dim"
      >
        <span aria-hidden="true">&minus;</span>
      </button>
      <span
        aria-live="polite"
        className="min-w-[44px] text-center text-base font-semibold tabular-nums text-bone"
      >
        {value}
        <span className="sr-only"> {label}</span>
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(ceiling, value + 1))}
        disabled={value >= ceiling}
        aria-label={`Increase ${label.toLowerCase()}`}
        className="grid h-11 w-11 place-items-center text-lg text-bone transition-colors hover:bg-bone/5 disabled:text-chrome-dim"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
