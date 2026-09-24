'use client';

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { cx } from '@/lib/format';

/**
 * Accessible form primitives.
 * Every control is labelled, errors are announced through aria-describedby + role="alert",
 * and invalid state is carried by aria-invalid rather than colour alone.
 */

const CONTROL =
  'w-full rounded-sm border bg-ink-soft px-4 py-3 text-base text-bone placeholder:text-chrome-dim transition-colors duration-150 disabled:opacity-50';

interface BaseProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

function Shell({
  id, label, hint, error, required, children, className,
}: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-[12px] font-semibold uppercase tracking-[0.16em] text-chrome">
        {label}
        {required ? <span className="ml-1 text-acid" aria-hidden="true">*</span> : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[13px] leading-snug text-chrome-dim">{hint}</p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[13px] font-medium text-danger">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label, hint, error, required, className, ...rest
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = rest.id ?? generated;
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        {...rest}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(CONTROL, error ? 'border-danger' : 'border-ink-line focus:border-chrome')}
      />
    </Shell>
  );
}

export function TextAreaField({
  label, hint, error, required, className, ...rest
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generated = useId();
  const id = rest.id ?? generated;
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        {...rest}
        id={id}
        required={required}
        rows={rest.rows ?? 4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(CONTROL, 'resize-y', error ? 'border-danger' : 'border-ink-line focus:border-chrome')}
      />
    </Shell>
  );
}

export function SelectField({
  label, hint, error, required, className, children, ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const generated = useId();
  const id = rest.id ?? generated;
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        {...rest}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(CONTROL, 'appearance-none pr-10', error ? 'border-danger' : 'border-ink-line focus:border-chrome')}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23B7B7B7' stroke-width='1.6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
        }}
      >
        {children}
      </select>
    </Shell>
  );
}

export function CheckboxField({
  label, error, id: providedId, description, ...rest
}: { label: ReactNode; error?: string; description?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = providedId ?? generated;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          {...rest}
          type="checkbox"
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : description ? `${id}-desc` : undefined}
          className={cx(
            'mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-xs border-2 bg-ink-soft accent-emerald',
            error ? 'border-danger' : 'border-chrome/50',
          )}
        />
        <label htmlFor={id} className="cursor-pointer text-[14px] leading-snug text-bone/90">
          {label}
        </label>
      </div>
      {description ? (
        <p id={`${id}-desc`} className="pl-8 text-[13px] text-chrome-dim">{description}</p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="pl-8 text-[13px] font-medium text-danger">{error}</p>
      ) : null}
    </div>
  );
}
