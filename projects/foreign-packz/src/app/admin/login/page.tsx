'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { useAdminSession } from '@/context/AdminSessionContext';
import { BRAND } from '@/lib/config';

/**
 * Owner / staff sign-in.
 *
 * SECURITY - there is deliberately no credential in this file and none may be added.
 * No master key field, no hard-coded password, no backdoor, no shared universal login.
 * This form validates the shape of the input, shows the multi-factor step, and then marks
 * the prototype session as signed in. It authenticates nobody.
 *
 * PRODUCTION INTEGRATION POINT - Authentication (all of this is required before launch):
 * - Individual accounts, passwords stored only as Argon2id or bcrypt hashes.
 * - Multi-factor authentication enforced for every account (authenticator app or a secure
 *   one-time code). No MFA bypass, no "remember this device" without a second factor.
 * - Server-issued HTTP-only, Secure, SameSite session cookie with idle and absolute expiry.
 * - CSRF tokens on every state-changing request.
 * - Rate limiting, bot protection and account lockout after repeated failed attempts, with
 *   each failure written to the audit log including IP and device.
 * - Recovery only through verified owner identity and single-use recovery codes. Never a
 *   bare public reset link.
 * - Independent review by a qualified security professional before launch.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAdminSession();
  const [stage, setStage] = useState<'credentials' | 'mfa'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submitCredentials(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = 'Enter your work email address.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // PRODUCTION: the server verifies the hash, counts failures, applies lockout and only
    // then issues the MFA challenge. Nothing is verified here.
    setStage('mfa');
  }

  function submitMfa(event: FormEvent) {
    event.preventDefault();
    if (code.trim().length < 6) {
      setErrors({ code: 'Enter the 6-digit code from your authenticator app.' });
      return;
    }
    signIn();
    router.push('/admin');
  }

  return (
    <div className="fp-grain relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-5 py-16">
      <div className="fp-grid-lines absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <p className="fp-eyebrow mb-3 text-center">{BRAND.name}</p>
        <h1 className="text-center text-[clamp(1.75rem,6vw,2.5rem)]">Staff sign in</h1>
        <p className="mt-3 text-center text-[13px] leading-relaxed text-chrome">
          Individual staff accounts only. Multi-factor authentication is required.
        </p>

        <div className="fp-card mt-8 p-6">
          {stage === 'credentials' ? (
            <form onSubmit={submitCredentials} className="space-y-5" noValidate>
              <TextField
                label="Work email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                error={errors.email}
              />
              <TextField
                label="Password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                error={errors.password}
              />
              <Button type="submit" size="lg" fullWidth>Continue</Button>
            </form>
          ) : (
            <form onSubmit={submitMfa} className="space-y-5" noValidate>
              <Notice tone="neutral" title="Multi-factor authentication">
                Enter the 6-digit code from your authenticator app. In production this step
                cannot be skipped, and a failed code counts toward account lockout.
              </Notice>
              <TextField
                label="Authentication code"
                inputMode="numeric"
                maxLength={6}
                required
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setErrors({}); }}
                error={errors.code}
                hint="Prototype: any 6 digits continue. No code is verified."
              />
              <Button type="submit" size="lg" fullWidth>Sign in</Button>
              <Button type="button" variant="ghost" size="sm" fullWidth onClick={() => setStage('credentials')}>
                Back
              </Button>
            </form>
          )}
        </div>

        <Notice tone="warning" className="mt-6" title="Prototype authentication">
          This screen does not authenticate anyone. There is no password, hash, token or
          shared credential in this prototype. Secure password hashing, enforced MFA,
          HTTP-only session cookies, CSRF protection, rate limiting, bot protection, account
          lockout, session expiry, encrypted secrets, audit logging and an independent
          security review must all be implemented before launch.
        </Notice>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-chrome-dim">
          Lost access? Account recovery requires verified owner identity and single-use
          recovery codes. Contact the account owner directly &mdash; there is no public reset link.
        </p>
      </div>
    </div>
  );
}
