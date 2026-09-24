import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND, SUPPORT } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Thanks for stopping by',
  description: 'A neutral landing page for visitors who have not confirmed they are 21 or over.',
};

/**
 * NEUTRAL EXIT PAGE.
 * Shown when a visitor exits the age gate. It carries no cannabis content, no product
 * imagery and no menu, only a way back and a support contact.
 */
export default function ExitPage() {
  return (
    <div className="fp-grain relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="fp-grid-lines absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-lg px-6 py-20 text-center">
        <p className="fp-eyebrow mb-6">{BRAND.name}</p>
        <h1 className="text-[clamp(2rem,8vw,3rem)]">Thanks for stopping by.</h1>
        <p className="mt-5 text-base leading-relaxed text-chrome">
          This site is for adults {BRAND.minimumAge} and over. You can come back any time once
          you are able to confirm your age.
        </p>
        <p className="mt-4 text-[13px] leading-relaxed text-chrome-dim">
          Apparel and non-cannabis accessories are a separate part of this brand. If you need
          help with an existing apparel order, contact {SUPPORT.email}.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-[48px] items-center rounded-sm border border-chrome/40 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-bone transition-colors hover:bg-bone/5"
        >
          Return to the age check
        </Link>
      </div>
    </div>
  );
}
