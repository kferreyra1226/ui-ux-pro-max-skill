'use client';

import { useMemo, useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { cx } from '@/lib/format';
import { FAQ_CATEGORIES } from '@/lib/mock/content';
import type { FaqItem } from '@/lib/types';

/** Searchable FAQ. Search and category filters compose, and results are announced. */
export function FaqSearch({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return `${item.question} ${item.answer}`.toLowerCase().includes(q);
    });
  }, [items, query, category]);

  const grouped = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: results.filter((r) => r.category === cat.key),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <TextField
          label="Search the FAQ"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try ID, shipping, low stock..."
        />
        <p aria-live="polite" className="pb-3 text-[13px] text-chrome">
          {results.length} {results.length === 1 ? 'answer' : 'answers'}
        </p>
      </div>

      <div className="fp-rail mt-6 gap-2" role="group" aria-label="Filter by category">
        <Chip label="All" active={category === 'all'} onClick={() => setCategory('all')} />
        {FAQ_CATEGORIES.map((c) => (
          <Chip key={c.key} label={c.label} active={category === c.key} onClick={() => setCategory(c.key)} />
        ))}
      </div>

      {grouped.length === 0 ? (
        <div className="fp-card mt-8 p-10 text-center">
          <p className="text-[15px] text-chrome">No answers match that search.</p>
          <p className="mt-2 text-[13px] text-chrome-dim">Contact support and we will answer directly.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {grouped.map((group) => (
            <section key={group.key} aria-labelledby={`faq-${group.key}`}>
              <h2 id={`faq-${group.key}`} className="text-[clamp(1.375rem,4vw,1.75rem)]">{group.label}</h2>
              <div className="mt-4 divide-y divide-ink-line border-y border-ink-line">
                {group.items.map((item) => (
                  <details key={item.id} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-bone">
                      {item.question}
                      <span aria-hidden="true" className="shrink-0 text-chrome transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-chrome">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'min-h-[44px] shrink-0 rounded-sm border px-4 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors',
        active ? 'border-bone bg-bone text-ink' : 'border-ink-line text-chrome hover:border-chrome/60 hover:text-bone',
      )}
    >
      {label}
    </button>
  );
}
