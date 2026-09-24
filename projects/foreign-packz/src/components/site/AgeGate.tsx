'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAgeGate } from '@/context/AgeGateContext';
import { BRAND, LEGAL } from '@/lib/config';
import { Button } from '@/components/ui/Button';

/**
 * Full-screen 21+ access gate.
 *
 * This screen is an access control affordance, NOT age or identity verification.
 * It records a self-declaration in a cookie so that cannabis content is not shown to a
 * visitor who has not confirmed being 21 or over. It does not verify anyone's age.
 * Compliant, vendor-backed age and identity verification must still happen server-side at
 * checkout, and a valid government-issued photo ID must still be checked in person before
 * any cannabis product is released. Do not treat a passed age gate as a verified customer.
 *
 * PRODUCTION: also enforce this on the server (Next.js middleware on /shop and product
 * routes) so cannabis markup is never sent to an unconfirmed client.
 */
export function AgeGate() {
  const { state, loading, confirm, decline } = useAgeGate();
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state === 'unknown' && !loading) headingRef.current?.focus();
  }, [state, loading]);

  useEffect(() => {
    if (state === 'declined') router.push('/exit');
  }, [state, router]);

  // Nothing renders until the cookie has been read, so returning adults never see a flash.
  if (loading || state === 'confirmed') return null;
  if (state === 'declined') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fp-age-gate-title"
      className="fp-grain fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-ink"
    >
      <div className="fp-grid-lines absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(70% 55% at 50% 12%, rgba(28,97,74,.34), transparent 72%)' }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col justify-center px-6 py-12">
        <p className="fp-eyebrow mb-8 text-center">{BRAND.name}</p>

        <div className="fp-chrome-rule mb-10" aria-hidden="true" />

        <h1
          id="fp-age-gate-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-center text-[clamp(2.25rem,9vw,3.25rem)] outline-none"
        >
          {LEGAL.ageGateHeadline}
        </h1>

        <p className="mt-5 text-center text-base leading-relaxed text-bone/80">
          {LEGAL.ageGateBody}
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <Button size="lg" fullWidth onClick={confirm} data-autofocus>
            I am {BRAND.minimumAge}+
          </Button>
          <Button size="lg" variant="secondary" fullWidth onClick={decline}>
            Exit
          </Button>
        </div>

        <p className="mt-8 text-center text-[13px] leading-relaxed text-chrome">
          {LEGAL.ageGateFinePrint}
        </p>

        <div className="mt-8 rounded-sm border border-ink-line bg-ink-soft/80 px-4 py-3.5">
          <p className="text-[12px] leading-relaxed text-chrome-dim">{LEGAL.ageGateNotice}</p>
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.18em] text-chrome-dim">
          {LEGAL.licensedBadge}
        </p>
      </div>
    </div>
  );
}
