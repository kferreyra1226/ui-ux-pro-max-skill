import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="fp-shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="fp-eyebrow mb-4">404</p>
      <h1 className="text-[clamp(2rem,8vw,3.5rem)]">Not here</h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-chrome">
        That page does not exist, or the item is no longer listed.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/shop">Shop 21+ Menu</ButtonLink>
        <ButtonLink href="/apparel" variant="secondary">Explore Apparel</ButtonLink>
      </div>
      <Link href="/support" className="mt-6 text-[13px] text-chrome underline underline-offset-4 hover:text-bone">
        Contact support
      </Link>
    </div>
  );
}
