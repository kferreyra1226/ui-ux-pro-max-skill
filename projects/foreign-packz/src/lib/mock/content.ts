import type { ContentBlock, FaqItem } from '@/lib/types';

/**
 * MOCK SITE CONTENT.
 * Blocks flagged `requiresOwnerApproval` are legal or compliance copy: a Content Manager
 * may draft an edit, but only the Super Admin / Owner can publish it.
 */
export const CONTENT_BLOCKS: ContentBlock[] = [
  { id: 'cnt_hero_head', key: 'home.hero.headline', label: 'Homepage hero headline', area: 'homepage', value: 'FOREIGN PACKZ', requiresOwnerApproval: false, status: 'published', updatedAt: '2026-09-15T12:00:00-04:00', updatedBy: '[CONTENT MANAGER NAME]' },
  { id: 'cnt_hero_sub', key: 'home.hero.subheadline', label: 'Homepage hero subheadline', area: 'homepage', value: 'Premium adult-use cannabis. Limited streetwear drops.', requiresOwnerApproval: false, status: 'published', updatedAt: '2026-09-15T12:00:00-04:00', updatedBy: '[CONTENT MANAGER NAME]' },
  { id: 'cnt_banner', key: 'home.banner', label: 'Promotional banner', area: 'banner', value: 'Drop 04 announced. Join the drop list for the release window.', requiresOwnerApproval: false, status: 'draft', updatedAt: '2026-09-21T16:30:00-04:00', updatedBy: '[CONTENT MANAGER NAME]' },
  { id: 'cnt_collection', key: 'home.collection.featured', label: 'Featured product collection', area: 'homepage', value: 'Popular Right Now', requiresOwnerApproval: false, status: 'published', updatedAt: '2026-08-04T10:00:00-04:00', updatedBy: '[OWNER NAME]' },
  { id: 'cnt_apparel_campaign', key: 'apparel.campaign.headline', label: 'Apparel campaign headline', area: 'apparel', value: 'Foreign Packz - Limited Drop', requiresOwnerApproval: false, status: 'published', updatedAt: '2026-09-10T09:00:00-04:00', updatedBy: '[CONTENT MANAGER NAME]' },
  { id: 'cnt_about', key: 'about.mission', label: 'About page mission copy', area: 'about', value: 'Foreign Packz is a New York lifestyle brand centered on adult-use cannabis culture, intentional product curation, premium local identity, and limited streetwear drops.', requiresOwnerApproval: false, status: 'published', updatedAt: '2026-07-22T11:00:00-04:00', updatedBy: '[OWNER NAME]' },
  { id: 'cnt_legal_age', key: 'legal.age-gate.notice', label: 'Age gate legal notice', area: 'policy', value: '[RESPONSIBLE-USE AND LEGAL NOTICE PLACEHOLDER]', requiresOwnerApproval: true, status: 'pending-approval', updatedAt: '2026-09-19T14:00:00-04:00', updatedBy: '[CONTENT MANAGER NAME]' },
  { id: 'cnt_legal_warn', key: 'legal.product.warnings', label: 'Product warning text', area: 'policy', value: '[REQUIRED NEW YORK WARNING TEXT PLACEHOLDER]', requiresOwnerApproval: true, status: 'pending-approval', updatedAt: '2026-09-19T14:05:00-04:00', updatedBy: '[CONTENT MANAGER NAME]' },
  { id: 'cnt_support', key: 'support.contact', label: 'Support contact details', area: 'support', value: '[SUPPORT EMAIL] / [SUPPORT PHONE]', requiresOwnerApproval: false, status: 'published', updatedAt: '2026-06-30T10:00:00-04:00', updatedBy: '[OWNER NAME]' },
];

export const FAQ_ITEMS: FaqItem[] = [
  { id: 'faq_01', category: 'adult-use-access', question: 'Who can browse and purchase cannabis products?', answer: 'Adults 21 and over. You confirm your age before any cannabis page loads, and valid government-issued photo ID is checked before any cannabis product is released to you.' },
  { id: 'faq_02', category: 'adult-use-access', question: 'Why is age confirmation required?', answer: 'Cannabis is an adult-use product in New York. Age confirmation keeps the cannabis menu behind an adult-only step. It is a first step, not the full check: identity and age are verified again before a product is handed over.' },
  { id: 'faq_03', category: 'adult-use-access', question: 'What identification is required?', answer: 'A valid, unexpired government-issued photo ID. The person receiving the order must match the name on the order. Specific accepted document types are confirmed by the business at [SUPPORT EMAIL].' },
  { id: 'faq_04', category: 'orders', question: 'Is my order request automatically accepted?', answer: 'No. Every cannabis order is submitted as a request. Nothing is confirmed, scheduled or paid until the business reviews it and accepts it.' },
  { id: 'faq_05', category: 'orders', question: 'What happens after I submit an order request?', answer: 'The status reads "Order request received - awaiting review." We check inventory, fulfillment availability and the order details, then send a confirmation or let you know we cannot accept the request.' },
  { id: 'faq_06', category: 'orders', question: 'What happens if an item becomes unavailable?', answer: 'We contact you before anything is confirmed. You can remove the item, pick something else, or cancel the request. Nothing is charged for an item we cannot supply.' },
  { id: 'faq_07', category: 'orders', question: 'Can I change or cancel an order request?', answer: 'Yes, while the request is still awaiting review. Contact support with your request number and we will update or cancel it.' },
  { id: 'faq_08', category: 'products', question: 'How do I know if an item is in stock?', answer: 'Every product card and product page shows its current status: In Stock, Low Stock or Sold Out. Stock is re-checked again before a request is accepted.' },
  { id: 'faq_09', category: 'products', question: 'What does "Low Stock" mean?', answer: 'The remaining quantity is at or below the threshold set for that product. The item is still available, but it may sell out before your request is reviewed.' },
  { id: 'faq_10', category: 'products', question: 'Where can I find product warnings, ingredients, batch details, and lab information?', answer: 'On each cannabis product page under Product information. That section carries ingredients, required warnings, potency details, the lot or batch number and the lab documentation link for that product.' },
  { id: 'faq_11', category: 'apparel', question: 'Can apparel be shipped?', answer: 'Yes. Apparel and non-cannabis accessories are the only items eligible for shipping. Cannabis products are never shipped by any carrier.' },
  { id: 'faq_12', category: 'apparel', question: 'What is the apparel return policy?', answer: '[APPAREL RETURN POLICY PLACEHOLDER - return window, item condition and the return process are confirmed by the business before launch.]' },
  { id: 'faq_13', category: 'apparel', question: 'When will new drops release?', answer: 'Release windows are posted on the Apparel page under Drop Calendar. Join the drop list to be notified when a window is announced.' },
  { id: 'faq_14', category: 'support', question: 'How can I contact Foreign Packz?', answer: 'Email [SUPPORT EMAIL] or call [SUPPORT PHONE] during [BUSINESS HOURS]. The support form on the Support page reaches the same inbox.' },
  { id: 'faq_15', category: 'support', question: 'Where can I view policies and legal notices?', answer: 'Privacy, terms, accessibility and the responsible-use notice are linked in the footer of every page.' },
];

export const FAQ_CATEGORIES = [
  { key: 'adult-use-access', label: 'Adult-use access' },
  { key: 'orders', label: 'Orders' },
  { key: 'products', label: 'Products' },
  { key: 'apparel', label: 'Apparel' },
  { key: 'support', label: 'Support' },
] as const;
