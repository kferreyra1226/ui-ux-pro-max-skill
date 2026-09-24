import { PRODUCTS } from '@/lib/mock/products';
import type { ProductMedia } from '@/lib/types';

/**
 * MOCK MEDIA LIBRARY.
 *
 * PRODUCTION INTEGRATION POINT - Media storage:
 * Uploads must go to secure cloud object storage through short-lived signed URLs, with
 * server-side MIME sniffing (not just the file extension), malware scanning, a configurable
 * size ceiling, derivative generation (thumbnail / standard / large / mobile as WebP or
 * AVIF), CDN delivery and access controls so draft and hidden media are never publicly
 * reachable. Nothing in this prototype writes a file anywhere.
 */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB, owner-configurable
export const ACCEPTED_UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
export const ACCEPTED_UPLOAD_LABEL = 'JPG, JPEG, PNG, WebP, HEIC/HEIF';
export const RECOMMENDED_RATIO = '4:5 portrait (1:1 square also supported)';

/** Derivatives generated server-side for every accepted upload. */
export const DERIVATIVES = [
  { key: 'thumb', label: 'Product-card thumbnail', size: '400 x 500' },
  { key: 'standard', label: 'Standard product image', size: '800 x 1000' },
  { key: 'large', label: 'Large product-detail image', size: '1600 x 2000' },
  { key: 'mobile', label: 'Mobile version', size: '600 x 750' },
];

/** Checklist shown beside every upload. Blocking items are compliance, not taste. */
export const QUALITY_CHECKLIST = [
  { id: 'lighting', label: 'Good lighting', blocking: false },
  { id: 'label', label: 'Clear label / package', blocking: false },
  { id: 'sharp', label: 'Not blurry', blocking: false },
  { id: 'pii', label: 'No personally identifiable information', blocking: true },
  { id: 'minors', label: 'No minors or youth-oriented imagery', blocking: true },
  { id: 'claims', label: 'No unverified health or medical claims, and no claim text over the image', blocking: true },
  { id: 'ads', label: 'No content that violates cannabis advertising or packaging rules', blocking: true },
  { id: 'rights', label: 'No copyrighted brand artwork the business does not have rights to use', blocking: true },
];

export interface MediaLibraryItem extends ProductMedia {
  productId: string | null;
  productName: string | null;
  usage: string;
}

/** Every product photo, plus a few unassigned campaign assets. */
export const MEDIA_LIBRARY: MediaLibraryItem[] = [
  ...PRODUCTS.flatMap((product) =>
    product.media.map<MediaLibraryItem>((m) => ({
      ...m,
      productId: product.id,
      productName: product.name,
      usage: m.role === 'cover' || m.sortOrder === 0 ? `${product.name} - cover` : `${product.name} - gallery`,
    })),
  ),
  {
    id: 'med_9001', placeholderSeed: 'campaign-street-01',
    url: null, altText: 'Campaign photograph, city street at night', role: 'lifestyle',
    status: 'published', sortOrder: 0, fileName: 'campaign-street-01.webp', fileSizeBytes: 640_000,
    width: 2000, height: 2500, uploadedAt: '2026-09-10T09:00:00-04:00', uploadedBy: '[CONTENT MANAGER NAME]',
    tags: ['campaign', 'lookbook'], productId: null, productName: null, usage: 'Apparel lookbook',
  },
  {
    id: 'med_9002', placeholderSeed: 'campaign-street-02',
    url: null, altText: 'Campaign photograph, rooftop at dusk', role: 'lifestyle',
    status: 'published', sortOrder: 1, fileName: 'campaign-street-02.webp', fileSizeBytes: 712_000,
    width: 2000, height: 2500, uploadedAt: '2026-09-10T09:02:00-04:00', uploadedBy: '[CONTENT MANAGER NAME]',
    tags: ['campaign', 'lookbook'], productId: null, productName: null, usage: 'Apparel lookbook',
  },
  {
    id: 'med_9003', placeholderSeed: 'campaign-street-03',
    url: null, altText: 'Campaign photograph, subway platform', role: 'lifestyle',
    status: 'draft', sortOrder: 2, fileName: 'campaign-street-03.heic', fileSizeBytes: 3_100_000,
    width: 3024, height: 4032, uploadedAt: '2026-09-21T18:30:00-04:00', uploadedBy: '[OWNER NAME]',
    tags: ['campaign'], productId: null, productName: null, usage: 'Unused',
  },
  {
    id: 'med_9004', placeholderSeed: 'size-guide-01',
    url: null, altText: 'Apparel size guide chart', role: 'size-guide',
    status: 'published', sortOrder: 0, fileName: 'size-guide-01.webp', fileSizeBytes: 120_000,
    width: 1200, height: 1200, uploadedAt: '2026-07-04T09:00:00-04:00', uploadedBy: '[CONTENT MANAGER NAME]',
    tags: ['apparel', 'size-guide'], productId: null, productName: null, usage: 'Apparel size guide',
  },
  {
    id: 'med_9005', placeholderSeed: 'hidden-old-tee',
    url: null, altText: 'Retired tee photograph', role: 'gallery',
    status: 'hidden', sortOrder: 9, fileName: 'old-tee-front.jpg', fileSizeBytes: 480_000,
    width: 1400, height: 1750, uploadedAt: '2026-04-01T09:00:00-04:00', uploadedBy: '[OWNER NAME]',
    tags: ['apparel', 'archive'], productId: null, productName: null, usage: 'Hidden - retired Drop 01 asset',
  },
];

export const MEDIA_FILTERS = [
  { key: 'all', label: 'All media' },
  { key: 'cannabis', label: 'Cannabis product' },
  { key: 'apparel', label: 'Apparel' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'unused', label: 'Unused media' },
  { key: 'draft', label: 'Draft media' },
  { key: 'published', label: 'Published media' },
] as const;

export type MediaFilterKey = (typeof MEDIA_FILTERS)[number]['key'];
