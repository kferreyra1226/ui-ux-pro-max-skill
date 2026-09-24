import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Notice } from '@/components/ui/Notice';
import { BRAND, LEGAL, POLICY_LINKS, SUPPORT } from '@/lib/config';

/**
 * Policy pages.
 * Every body below is a structural placeholder. Policy text must be drafted or reviewed by
 * a New York cannabis attorney before launch. Do not publish these as written.
 */
const POLICIES: Record<string, { title: string; intro: string; sections: [string, string][] }> = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'How this business collects, uses, stores and deletes personal information.',
    sections: [
      ['Information collected', '[PLACEHOLDER - contact details, order request details, age acknowledgement records, device and analytics data.]'],
      ['How it is used', '[PLACEHOLDER - fulfilling order requests, age and identity verification, required record keeping, support.]'],
      ['Sharing', '[PLACEHOLDER - compliant POS, payment provider, verification vendor, messaging provider, state reporting where required.]'],
      ['Retention and deletion', '[PLACEHOLDER - retention periods driven by New York record-keeping requirements.]'],
      ['Your choices', '[PLACEHOLDER - marketing opt-out, access and deletion requests, how to contact the business.]'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'The terms that apply when you use this site and submit an order request.',
    sections: [
      ['Eligibility', `[PLACEHOLDER - adults ${BRAND.minimumAge}+ only, valid government-issued photo ID required, recipient must match the order.]`],
      ['Order requests', '[PLACEHOLDER - a request is an offer, not a contract. Acceptance is at the business’s discretion and subject to inventory and law.]'],
      ['Pricing and taxes', '[PLACEHOLDER - pricing, applicable taxes and any fees.]'],
      ['Shipping', '[PLACEHOLDER - apparel and non-cannabis accessories only. Cannabis is never shipped.]'],
      ['Limitations', '[PLACEHOLDER - drafted by counsel.]'],
    ],
  },
  accessibility: {
    title: 'Accessibility',
    intro: 'This site is built to be usable with a keyboard, a screen reader and at any text size.',
    sections: [
      ['Our approach', 'Every interactive element is reachable by keyboard with a visible focus ring, form fields are labelled and errors are announced, colour is never the only way information is conveyed, and tap targets are at least 44 by 44 pixels.'],
      ['Known gaps', '[PLACEHOLDER - list any known issues and the timeline to fix them after an accessibility audit.]'],
      ['Feedback', `If something on this site is hard to use, contact ${SUPPORT.email} and we will work with you directly.`],
    ],
  },
  'responsible-use': {
    title: 'Responsible Use',
    intro: 'Guidance for adult consumers and a reminder of what this business will and will not do.',
    sections: [
      ['For adults only', `Cannabis products are for adults ${BRAND.minimumAge} and over. Keep products in their original child-resistant packaging and out of reach of children and pets.`],
      ['Do not drive', 'Do not drive or operate machinery after use.'],
      ['No claims', 'This business makes no medical or health claims about any product. Talk to a healthcare professional about your own situation.'],
      ['Help', '[PLACEHOLDER - New York support and helpline resources, confirmed by the business before launch.]'],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return { title: policy?.title ?? 'Legal', description: policy?.intro };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  return (
    <div className="fp-shell py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="fp-eyebrow mb-3">Legal</p>
        <h1 className="text-[clamp(2rem,7vw,3.5rem)]">{policy.title}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-chrome">{policy.intro}</p>

        <Notice tone="warning" className="mt-8" title="Draft placeholder">
          This page is a structural placeholder. Final policy language must be drafted or
          reviewed by a New York cannabis attorney and approved by the business owner before
          launch. Nothing here is legal advice or an enforceable policy.
        </Notice>

        <div className="mt-10 space-y-8">
          {policy.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-[clamp(1.25rem,4vw,1.625rem)]">{heading}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-chrome">{body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-ink-line pt-6">
          <p className="fp-eyebrow mb-3">Other policies</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {POLICY_LINKS.filter((l) => !l.href.endsWith(slug)).map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[14px] text-chrome underline underline-offset-4 transition-colors hover:text-bone">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-[12px] leading-relaxed text-chrome-dim">{LEGAL.prototypeNotice}</p>
      </div>
    </div>
  );
}
