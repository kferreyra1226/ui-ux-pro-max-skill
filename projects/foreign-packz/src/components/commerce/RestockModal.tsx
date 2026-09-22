'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckboxField, TextField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Notice } from '@/components/ui/Notice';
import { LEGAL } from '@/lib/config';

/**
 * Restock notification capture.
 * PRODUCTION INTEGRATION POINT - SMS / email notifications:
 * Store the consent record with a timestamp, honour STOP replies, and never send
 * cannabis-related messages to anyone who has not confirmed being 21 or over.
 * Nothing is sent from this prototype.
 */
export function RestockModal({
  open, onClose, productName, isCannabis,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  isCannabis: boolean;
}) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Enter an email address so we can notify you.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (isCannabis && !consent) next.consent = 'Confirm you are 21 or older to receive cannabis-related messages.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitted(true);
  }

  function handleClose() {
    setSubmitted(false);
    setErrors({});
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Notify me when available"
      description={`We will let you know when ${productName} is back. Availability is never guaranteed and a notification is not a reservation.`}
      size="sm"
    >
      {submitted ? (
        <div className="space-y-4">
          <Notice tone="success" title="You are on the list">
            We will send one notification when this item is back in stock. This does not hold or
            reserve any product for you.
          </Notice>
          <Button fullWidth onClick={handleClose}>Close</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
          />
          <TextField
            label="Mobile number (optional)"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            hint="Used only for restock alerts. Message and data rates may apply."
          />
          {isCannabis ? (
            <CheckboxField
              label={LEGAL.marketingConsent}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              error={errors.consent}
            />
          ) : null}
          <p className="text-[12px] leading-relaxed text-chrome-dim">
            Notification delivery is a placeholder in this prototype. No message is sent.
          </p>
          <Button type="submit" fullWidth>Notify me</Button>
        </form>
      )}
    </Modal>
  );
}
