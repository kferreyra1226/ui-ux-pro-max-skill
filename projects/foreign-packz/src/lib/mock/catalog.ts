import type { CatalogCategory } from '@/lib/types';

export interface CategoryMeta {
  slug: CatalogCategory;
  label: string;
  blurb: string;
  ageRestricted: boolean;
  seed: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: 'flower', label: 'Flower', blurb: 'Jarred, sealed, small batch.', ageRestricted: true, seed: 'cat-flower' },
  { slug: 'pre-rolls', label: 'Pre-Rolls', blurb: 'Packed and ready.', ageRestricted: true, seed: 'cat-preroll' },
  { slug: 'vapes', label: 'Vapes', blurb: 'Cartridges and hardware.', ageRestricted: true, seed: 'cat-vape' },
  { slug: 'edibles', label: 'Edibles', blurb: 'Portioned and labeled.', ageRestricted: true, seed: 'cat-edible' },
  { slug: 'concentrates', label: 'Concentrates', blurb: 'For experienced adults.', ageRestricted: true, seed: 'cat-concentrate' },
  { slug: 'accessories', label: 'Accessories', blurb: 'Storage, grinders, carry.', ageRestricted: false, seed: 'cat-accessory' },
  { slug: 'apparel', label: 'Apparel', blurb: 'Limited New York drops.', ageRestricted: false, seed: 'cat-apparel' },
];

export const CANNABIS_CATEGORIES = CATEGORIES.filter((c) => c.ageRestricted);

export function categoryLabel(slug: CatalogCategory): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
