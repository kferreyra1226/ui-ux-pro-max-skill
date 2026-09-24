import type { Metadata } from 'next';
import { FaqSearch } from '@/components/site/FaqSearch';
import { FAQ_ITEMS } from '@/lib/mock/content';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers about adult-use access, order requests, products, apparel and support.',
};

export default function FaqPage() {
  return (
    <div className="fp-shell py-10 md:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="fp-eyebrow mb-3">Support</p>
        <h1 className="text-[clamp(2.25rem,8vw,4rem)]">Questions</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-chrome">
          Answers below describe how this business intends to operate. Anything shown as a
          placeholder is confirmed by the business before launch and is not a legal promise.
        </p>
      </header>
      <FaqSearch items={FAQ_ITEMS} />
    </div>
  );
}
