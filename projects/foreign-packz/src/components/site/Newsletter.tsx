'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckboxField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { LEGAL } from '@/lib/config';

/**
 * Newsletter / SMS signup.
 * PRODUCTION INTEGRATION POINT - SMS / email notifications:
 * Consent must be stored with a timestamp and the exact wording shown, opt-out must be
 * honoured, and cannabis-related messaging requires a confirmed 21+ recipient.
 */
export function Newsletter({
  variant = 'cannabis', title, description,
}: {
  variant?: 'cannabis' | 'apparel';
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Enter an email address.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (variant === 'cannabis' && !consent) {
      next.consent = `Confirm you are 21 or older before we can send cannabis-related messages.`;
    }
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  }

  if (done) {
    return (
      <Notice tone="success" title="You are on the list">
        Your preference is recorded in this prototype only. No message is sent until a
        consent-tracked messaging provider is connected.
      </Notice>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {title ? <h3 className="text-xl">{title}</h3> : null}
      {description ? <p className="text-[14px] leading-relaxed text-chrome">{description}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          required
          className="flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
        />
        <Button type="submit" size="md" className="sm:mb-0">
          {variant === 'apparel' ? 'Join the drop list' : 'Sign up'}
        </Button>
      </div>
      {variant === 'cannabis' ? (
        <CheckboxField
          label={LEGAL.marketingConsent}
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          error={errors.consent}
        />
      ) : (
        <p className="text-[12px] leading-relaxed text-chrome-dim">
          Apparel drop announcements only. No cannabis-related messages are sent to this list.
        </p>
      )}
    </form>
  );
}
