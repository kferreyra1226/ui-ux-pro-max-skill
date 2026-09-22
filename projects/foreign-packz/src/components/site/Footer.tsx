import Link from 'next/link';
import { BRAND, LEGAL, POLICY_LINKS, SOCIAL_LINKS, SUPPORT } from '@/lib/config';

const SHOP_LINKS = [
  { href: '/shop', label: 'Shop 21+ Menu' },
  { href: '/apparel', label: 'Apparel' },
  { href: '/shop?category=accessories', label: 'Accessories' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/support', label: 'Support' },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-line bg-ink-soft">
      <div className="fp-shell py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl tracking-[0.04em] text-bone">FOREIGN PACKZ</p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-chrome">
              {BRAND.taglineAlt} Adult-use cannabis and limited apparel from {BRAND.city}.
            </p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-chrome-dim">
              {LEGAL.licensedBadge}
            </p>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={[...POLICY_LINKS]} />
        </div>

        <div className="fp-chrome-rule my-10" aria-hidden="true" />

        <div className="grid gap-6 text-[12px] leading-relaxed text-chrome-dim md:grid-cols-2">
          <div className="space-y-2">
            <p><span className="text-chrome">Legal entity:</span> {BRAND.legalName}</p>
            <p><span className="text-chrome">Licence type:</span> {BRAND.licenseType}</p>
            <p><span className="text-chrome">Licence number:</span> {BRAND.licenseNumber}</p>
            <p><span className="text-chrome">Approved premises:</span> {BRAND.premises}</p>
          </div>
          <div className="space-y-2">
            <p><span className="text-chrome">Support:</span> {SUPPORT.email} / {SUPPORT.phone}</p>
            <p><span className="text-chrome">Hours:</span> {SUPPORT.hours}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {SOCIAL_LINKS.map((s) => (
                <span key={s.label} className="text-chrome">
                  {s.label}: <span className="text-chrome-dim">{s.href}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3 rounded-sm border border-ink-line bg-ink px-4 py-4">
          <p className="text-[12px] leading-relaxed text-chrome">{LEGAL.responsibleUse}</p>
          <p className="text-[12px] leading-relaxed text-chrome">{LEGAL.noShipping}</p>
          <p className="text-[12px] leading-relaxed text-chrome-dim">{LEGAL.prototypeNotice}</p>
        </div>

        <p className="mt-8 text-[11px] text-chrome-dim">
          &copy; {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <p className="fp-eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14px] text-chrome transition-colors hover:text-bone">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
