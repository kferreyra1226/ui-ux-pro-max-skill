'use client';

import type { ReactNode } from 'react';
import { useAgeGate } from '@/context/AgeGateContext';
import { Button } from '@/components/ui/Button';
import { LEGAL } from '@/lib/config';

/**
 * Renders cannabis content only after the visitor has confirmed being 21+.
 *
 * This is a client-side guard over content the server already sent, which is fine for a
 * prototype but NOT sufficient in production. Gate the route in middleware so the markup
 * never reaches an unconfirmed client, and treat this component as defence in depth.
 */
export function AgeRequired({
  children, title, body,
}: {
  children: ReactNode;
  title: string;
  body: string;
}) {
  const { state, loading, confirm } = useAgeGate();

  if (loading) {
    return (
      <div className="fp-card grid min-h-[280px] place-items-center p-10">
        <p className="text-[13px] uppercase tracking-[0.16em] text-chrome-dim">Checking access&hellip;</p>
      </div>
    );
  }

  if (state !== 'confirmed') {
    return (
      <div className="fp-card fp-grid-lines mx-auto max-w-lg p-8 text-center md:p-12">
        <h2 className="text-2xl">{title}</h2>
        <p className="mt-4 text-[14px] leading-relaxed text-chrome">{body}</p>
        <Button size="lg" className="mt-8" onClick={confirm}>I am 21+</Button>
        <p className="mt-6 text-[12px] leading-relaxed text-chrome-dim">{LEGAL.ageGateFinePrint}</p>
      </div>
    );
  }

  return <>{children}</>;
}
