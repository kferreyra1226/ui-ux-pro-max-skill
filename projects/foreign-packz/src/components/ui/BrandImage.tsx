import { cx } from '@/lib/format';

/**
 * Branded placeholder artwork.
 *
 * There is no stock photography in this prototype, and no copyrighted or real cannabis
 * brand artwork is used anywhere. Every product and editorial image is generated here as
 * an inline gradient + grid + monogram composition derived deterministically from a seed,
 * so the same product always renders the same artwork and nothing is ever a broken image.
 *
 * PRODUCTION: when an owner-uploaded photo exists, render it with next/image and keep this
 * component as the fallback for products that have no published media yet.
 */

const PALETTES: [string, string, string][] = [
  ['#13302A', '#1C614A', '#0C1A17'],
  ['#1A1A1A', '#2E2E2E', '#101010'],
  ['#14332B', '#25765C', '#0E1F1A'],
  ['#232323', '#3A3A3A', '#141414'],
  ['#1B2B24', '#1C614A', '#121212'],
];

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export type BrandImageRatio = 'square' | 'portrait' | 'wide' | 'hero';

const RATIO_CLASS: Record<BrandImageRatio, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  wide: 'aspect-[16/10]',
  hero: 'aspect-[4/5] md:aspect-[16/9]',
};

interface BrandImageProps {
  seed: string;
  /** Used as the accessible label. Decorative artwork passes an empty string. */
  alt: string;
  ratio?: BrandImageRatio;
  className?: string;
  /** Short overlay word, e.g. a category name. Kept to a couple of characters or a label. */
  caption?: string;
  tone?: 'dark' | 'bone';
}

export function BrandImage({
  seed, alt, ratio = 'portrait', className, caption, tone = 'dark',
}: BrandImageProps) {
  const h = hash(seed);
  const [a, b, c] = PALETTES[h % PALETTES.length];
  const angle = 20 + (h % 7) * 15;
  const offsetX = 20 + (h % 5) * 12;
  const offsetY = 24 + ((h >> 3) % 5) * 10;
  const rotate = ((h >> 5) % 7) - 3;

  return (
    <div
      className={cx(
        'fp-grain relative isolate overflow-hidden bg-ink-soft',
        RATIO_CLASS[ratio],
        className,
      )}
      role="img"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {/* Base gradient derived from the seed */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(${angle}deg, ${a} 0%, ${b} 52%, ${c} 100%)` }}
      />
      {/* Soft light pool, keeps the composition from reading flat */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(60% 50% at ${offsetX}% ${offsetY}%, rgba(244,240,232,.22), transparent 70%)`,
        }}
      />
      {/* Map / grid line texture */}
      <div className="fp-grid-lines absolute inset-0 opacity-60" />
      {/* Chrome monogram */}
      <div className="absolute inset-0 grid place-items-center">
        <span
          aria-hidden="true"
          className="select-none font-display text-[22vw] leading-none tracking-tight text-bone/[.07] sm:text-[8rem]"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          FP
        </span>
      </div>
      {/* Hairline frame */}
      <div className="absolute inset-3 border border-bone/10" />
      {caption ? (
        <span
          className={cx(
            'absolute bottom-3 left-3 rounded-xs px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
            tone === 'bone' ? 'bg-bone/90 text-ink' : 'bg-ink/80 text-chrome',
          )}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}
