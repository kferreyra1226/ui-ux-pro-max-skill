/**
 * Foreign Packz - brand, legal and integration configuration.
 *
 * Every value that depends on the real business is a bracketed placeholder on purpose.
 * Do NOT replace a placeholder with an invented licence number, legal entity name or
 * compliance claim. These are filled in by the business owner after review by a New York
 * cannabis attorney / compliance professional.
 */

export const BRAND = {
  name: 'Foreign Packz',
  /** Legal entity that holds the licence. Supplied by the owner. */
  legalName: '[REGISTERED BUSINESS / LEGAL ENTITY NAME]',
  /** New York adult-use licence number. Never hard-code a fabricated value. */
  licenseNumber: '[LICENSE NUMBER]',
  /** Licence type, e.g. retail dispensary. Supplied by the owner. */
  licenseType: '[NEW YORK LICENSE TYPE]',
  /** The approved premises this business may operate from. */
  premises: '[APPROVED LICENSED PREMISES]',
  tagline: 'Elevated taste.',
  taglineAlt: 'Curated locally. Built for the city.',
  city: 'New York',
  minimumAge: 21,
  timezone: 'America/New_York',
} as const;

export const SUPPORT = {
  email: '[SUPPORT EMAIL]',
  phone: '[SUPPORT PHONE]',
  sms: '[SUPPORT SMS NUMBER]',
  hours: '[BUSINESS HOURS]',
  responseTime: '[SUPPORT RESPONSE TIME]',
} as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: '[INSTAGRAM URL]' },
  { label: 'TikTok', href: '[TIKTOK URL]' },
  { label: 'X', href: '[X URL]' },
] as const;

/**
 * Legal copy used verbatim across the site. Treat these strings as compliance content:
 * changes require owner approval in the admin Content module and legal review.
 */
export const LEGAL = {
  ageGateHeadline: 'Adult-use access only.',
  ageGateBody: `You must be ${BRAND.minimumAge} or older to enter ${BRAND.name}.`,
  ageGateFinePrint:
    'Age confirmation is required to browse cannabis products. Valid government-issued identification is required before cannabis products can be released to a customer.',
  ageGateNotice:
    '[RESPONSIBLE-USE AND LEGAL NOTICE PLACEHOLDER - to be supplied and approved by a New York cannabis attorney / compliance professional before launch.]',
  licensedBadge: 'Licensed adult-use business. 21+ only.',
  noShipping:
    'Cannabis products are never shipped by mail, UPS, USPS, FedEx or any other carrier. Apparel and non-cannabis accessories are the only items eligible for shipping.',
  cartCannabisNotice:
    'Cannabis products are not shipped. Order fulfillment is subject to approval, legal requirements, and age/identity verification.',
  mixedCartNotice:
    'This order contains both cannabis and apparel. These may require separate fulfillment methods. Apparel can be shipped; cannabis cannot.',
  checkoutAcknowledgement:
    'I understand that valid government-issued photo ID is required before cannabis products can be released, and the recipient must match the name on this order.',
  orderReviewNotice:
    'Cannabis availability and order fulfillment are subject to inventory confirmation, required age/ID verification, and all applicable laws and business policies.',
  preSubmitNotice:
    'Submitting an order request does not guarantee acceptance or availability. You will receive a confirmation after business review.',
  deliveryPreSubmitNotice:
    'Your delivery request is not confirmed until it is reviewed and accepted by the business.',
  productAvailabilityNote:
    'Final availability and order acceptance are subject to business review, compliant inventory systems, and required age/identity verification.',
  paymentPlaceholder: 'Payment integration pending cannabis-compliant payment provider setup.',
  idReminder:
    'Valid government-issued photo ID and age verification are required before cannabis products can be released.',
  responsibleUse:
    'For adults 21 and over. Keep out of reach of children and pets. Do not drive or operate machinery after use. [RESPONSIBLE-USE NOTICE PLACEHOLDER - final wording subject to legal review.]',
  marketingConsent: `I confirm I am ${BRAND.minimumAge} or older and consent to receive cannabis-related messages from ${BRAND.name}. Message and data rates may apply. Reply STOP to opt out.`,
  prototypeNotice:
    'This site is a front-end design prototype. Payment, age and identity verification, cannabis point of sale, live inventory, seed-to-sale tracking, tax and order fulfillment are placeholders that require licensed, compliant vendor setup and legal review. This prototype does not by itself make any business legally compliant.',
  adminComplianceNotice:
    'This dashboard is a business-management prototype. Before launch, connect it to the company’s actual New York license type, approved premises, cannabis-compliant POS/payment system, age/ID verification process, tax obligations, delivery rules, product tracking, security procedures, and required seed-to-sale reporting system. Do not use this dashboard to conduct activity outside the business’s approved license, premises, or applicable law.',
} as const;

export const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Accessibility', href: '/legal/accessibility' },
  { label: 'Responsible Use', href: '/legal/responsible-use' },
] as const;

/**
 * Every place a real, regulated third-party system must be wired in.
 * The admin Settings screen renders this list so the owner can see exactly what is
 * still a placeholder. Nothing here is implemented in this prototype.
 */
export const INTEGRATION_POINTS = [
  {
    id: 'age-verification',
    label: 'Age & identity verification',
    detail:
      'Server-side, vendor-backed ID verification at checkout and at final handoff. The cookie-based age gate is a UI affordance only and is not verification.',
    owner: 'Compliance vendor + legal review',
  },
  {
    id: 'pos',
    label: 'Licensed cannabis POS',
    detail: 'All cannabis sales must be recorded through the licensed point-of-sale system.',
    owner: 'Licensed POS vendor',
  },
  {
    id: 'inventory',
    label: 'Live inventory',
    detail: 'Read-through inventory with transactional holds so the last unit cannot be oversold.',
    owner: 'POS / inventory vendor',
  },
  {
    id: 'seed-to-sale',
    label: 'Seed-to-sale tracking',
    detail: 'Required New York state reporting for every cannabis unit received and sold.',
    owner: 'State-designated tracking system',
  },
  {
    id: 'payments',
    label: 'Payment provider',
    detail: 'Cannabis-compliant payment processing. No payment is captured in this prototype.',
    owner: 'Compliant payment provider',
  },
  {
    id: 'tax',
    label: 'Tax calculation',
    detail: 'New York adult-use cannabis excise and sales tax. All tax shown here is a placeholder.',
    owner: 'Tax engine + accountant',
  },
  {
    id: 'orders',
    label: 'Transactional order handling',
    detail: 'Durable order records, owner review queue, and status transitions in a real database.',
    owner: 'Backend engineering',
  },
  {
    id: 'notifications',
    label: 'SMS / email notifications',
    detail: 'Consent-tracked transactional messaging with opt-out handling.',
    owner: 'Messaging provider',
  },
  {
    id: 'database',
    label: 'Secure database',
    detail: 'Encrypted storage of customer and order data with retention and deletion policy.',
    owner: 'Backend engineering',
  },
  {
    id: 'auth',
    label: 'Authentication',
    detail:
      'Hashed passwords, enforced MFA, HTTP-only session cookies, CSRF protection, rate limiting and lockout.',
    owner: 'Security professional',
  },
  {
    id: 'media',
    label: 'Media storage & delivery',
    detail:
      'Signed upload URLs, server-side file validation, malware scanning, derivative generation and CDN delivery.',
    owner: 'Backend engineering',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    detail: 'Privacy-reviewed analytics. No cannabis purchase data may leak to ad networks.',
    owner: 'Legal review',
  },
] as const;

export type IntegrationPointId = (typeof INTEGRATION_POINTS)[number]['id'];

/** Placeholder tax rate used only to render the checkout layout. Not a real rate. */
export const TAX_PLACEHOLDER_RATE = 0.13;

/** Cookie/session key used to remember that the visitor confirmed 21+. */
export const AGE_GATE_STORAGE_KEY = 'fp_age_ack';
export const AGE_GATE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h, re-ask daily
