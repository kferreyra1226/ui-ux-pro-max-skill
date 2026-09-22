'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckboxField, SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';

const TOPICS = [
  'Order request help',
  'Apparel order help',
  'Product question',
  'Policies and legal notices',
  'Something else',
];

/**
 * Support contact form.
 * PRODUCTION INTEGRATION POINT - Transactional handling & secure database:
 * Submissions must post to an authenticated server endpoint, be stored encrypted with a
 * retention policy, and never be emailed in plain text with personal details.
 */
export function SupportForm() {
  const [values, setValues] = useState({ name: '', email: '', reference: '', topic: TOPICS[0], message: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function set(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = 'Enter your name.';
    if (!values.email.trim()) next.email = 'Enter an email address.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) next.email = 'Enter a valid email address.';
    if (!values.message.trim()) next.message = 'Tell us what you need help with.';
    if (!consent) next.consent = 'You must agree before we can handle your message.';
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  if (sent) {
    return (
      <Notice tone="success" title="Message received">
        In this prototype nothing is sent or stored. Once a secure backend is connected, a
        support agent replies within {'[SUPPORT RESPONSE TIME]'} during support hours.
      </Notice>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" required autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
        <TextField label="Email" type="email" required autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Topic" value={values.topic} onChange={(e) => set('topic', e.target.value)}>
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
        <TextField
          label="Request number (optional)"
          value={values.reference}
          onChange={(e) => set('reference', e.target.value)}
          placeholder="FP-0000-0000"
          hint="Speeds things up if your question is about an existing request."
        />
      </div>
      <TextAreaField label="How can we help?" required rows={6} value={values.message} onChange={(e) => set('message', e.target.value)} error={errors.message} />

      <CheckboxField
        label="I agree that the information I submit will be used to respond to this request."
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        error={errors.consent}
        description="Do not include sensitive personal information, images of identification documents, or payment details in this form."
      />

      <Notice tone="neutral" title="Privacy">
        Information submitted here is used only to answer your question. [PRIVACY NOTICE
        PLACEHOLDER - retention period, who can access the message, and how to request
        deletion are confirmed by the business and reviewed by counsel before launch.]
      </Notice>

      <Button type="submit" size="lg">Send message</Button>
    </form>
  );
}
