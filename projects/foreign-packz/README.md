# Foreign Packz

A responsive, mobile-first front-end prototype for a New York licensed adult-use cannabis
and streetwear brand. Next.js App Router, TypeScript, Tailwind CSS, mock data throughout.

> **This is a design prototype, not a compliance system.** Payment, age and identity
> verification, cannabis point of sale, live inventory, seed-to-sale tracking, tax and order
> fulfillment are all placeholders. Nothing here makes any business legally compliant. The
> "Before Launch" checklist at the end of this file lists what must be reviewed and
> connected, and by whom.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

---

## 1. Brand and UX strategy

**Positioning.** A New York lifestyle brand with two halves: a curated adult-use cannabis
menu and limited streetwear drops. The design has to read as a licensed, confident local
retailer, not a plug page. Everything that signals legitimacy is made visible rather than
hidden: licence placeholders in the footer, live stock status on every card, plain
statements about what is and is not shipped.

**Voice.** Confident, concise, refined, mature. Short sentences. No hype, no medical or
health claims, no language about strength or effect. Where the law is the reason for
something, the copy says so instead of apologising for it.

**The core UX decision.** A cannabis order is a *request*, never a confirmed order. That
single idea drives the whole flow: the button says "Continue to Order Request", the
confirmation page says "Order request received — awaiting review", the admin screen is a
review inbox, and no timer, capacity rule or slot allocator anywhere can accept a request
on the owner's behalf. Every path a customer can walk ends in a human decision.

**Three rules enforced in code, not just in copy.**

1. Cannabis is never shippable. `lib/cart.ts` ignores `shippingEligible` on a cannabis
   product, so a cart containing cannabis can never reach an apparel shipping flow.
2. Zero stock always reads Sold Out. `lib/inventory.ts` derives the customer-facing status
   from the quantity, so a stale stored status cannot sell something that is gone.
3. Inventory is deducted only after a person accepts. Submitting reserves nothing.

**Mobile first, iPhone first.** The sticky bottom tab bar sits inside the safe area, every
target is at least 44px, the category filter is a one-handed horizontal rail, and the
product gallery is a swipe rail on phones and a thumbnail selector on desktop.

**Accessibility as a baseline.** Labelled fields, errors announced through `role="alert"`
and `aria-describedby`, `aria-invalid` rather than colour alone, a visible acid-lime focus
ring on every interactive element, a skip link, focus trapping in dialogs, and
`prefers-reduced-motion` honoured.

---

## 2. Site map

**Customer**

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, categories, popular rail, new in, apparel editorial, why, how it works, FAQ preview, newsletter |
| `/exit` | Neutral non-cannabis landing page for visitors who exit the age gate |
| `/shop` | Cannabis menu with category, brand, price, format and availability filters plus sorting |
| `/shop/[slug]` | Product detail with gallery, regulated product information and related products |
| `/apparel` | Drop banner, categories, products, drop calendar, lookbook, drop list signup |
| `/apparel/[slug]` | Apparel detail with sizes, fit, material, care, shipping and returns |
| `/cart` | Full cart, cannabis and shippable items grouped separately |
| `/checkout` | Five-step order request: details, fulfillment, review, payment placeholder, submit |
| `/order-request/[reference]` | Confirmation, status tracker and notification placeholders |
| `/about` | Brand story, responsible-use commitments, licence placeholders, community |
| `/faq` | Searchable FAQ across five categories |
| `/support` | Contact form, support hours, order help, privacy and safety notices |
| `/legal/[slug]` | Privacy, terms, accessibility, responsible use (structural placeholders) |

The age gate is not a route. It is a full-screen overlay rendered above any page until the
visitor confirms, with a second in-page guard (`AgeRequired`) on cannabis content.

**Staff dashboard** — all under `/admin`, behind a mock sign-in with an MFA step.

Overview, Order Requests, Delivery Requests, Hours & Availability, Inventory, Products,
Categories, Apparel, Media Library, Customers, Delivery Zones, Promotions, Content,
Reports, Staff & Permissions, Audit Logs, Settings.

---

## 3. Visual design system

**Colour.** Near-black `#101010` primary surface, `#171717` raised, `#1B1B1B` cards,
`#2A2A2A` hairlines. Warm off-white `#F4F0E8` for type and for inverted sections. Deep
emerald `#1C614A` as the single action colour. Muted chrome `#B7B7B7` for secondary text.
Acid lime `#B6D85C` used sparingly: focus rings, a "New" badge, one or two accents per
page. Amber and red are reserved for warning and error so they always mean something.

**Type.** Anton for display, condensed and editorial, set uppercase with a line-height of 1
so stacked lines do not collide. Inter for everything a customer has to read carefully:
body copy, product detail, forms, checkout, admin tables. Both are self-hosted from
`public/fonts` as latin-subset woff2 (about 67 KB together), which removes a render-blocking
third-party request and keeps browsing a cannabis menu from being visible to another party.

**Spacing.** A 4px base with two page-level tokens that step up at the `md` breakpoint:
`--fp-gutter` 20 → 32px and `--fp-section` 64 → 96px. One shell width of 1240px.

**Cards.** Hairline border, `#1B1B1B` fill, 14px radius, layered shadow. On hover they lift
1px over 300ms and the image scales 3%, which is enough motion to feel responsive without
becoming a carousel of movement.

**Buttons.** Five variants (primary emerald, secondary outline, ghost, bone inverse,
danger) and three sizes, all uppercase with wide tracking and a minimum height of 40, 48 or
56px.

**Texture.** Three reusable treatments carry the luxury-streetwear feel without a single
image request: an inline SVG film grain, a 48px map-inspired grid overlay, and a chrome
gradient rule used as a divider.

**Imagery.** There is no stock photography and no copyrighted or real cannabis brand
artwork anywhere. `BrandImage` generates every product and editorial image deterministically
from a seed string: a gradient picked from five brand palettes, a light pool, the grid
texture, an FP monogram and a hairline frame. The same product always renders the same
artwork, and a product with no published photo shows branded placeholder art rather than a
broken image.

---

## 4. Component architecture and data model

```
src/
├── app/                    routes (App Router), one folder per page above
├── components/
│   ├── ui/                 BrandImage, Button, Field, Modal, Notice, Badge
│   ├── site/               AgeGate, SiteFrame, Header, MobileTabBar, Footer,
│   │                       Section, Newsletter, FaqSearch, SupportForm
│   ├── commerce/           ProductCard, ProductGallery, ProductDetail, ShopFilters,
│   │                       AddToCartPanel, QuantityStepper, CartDrawer, CartPageView,
│   │                       CheckoutFlow, OrderStatusTracker, RestockModal, AgeRequired
│   └── admin/              AdminShell, primitives (DataTable, StatCard, ConfirmAction,
│                           RequirePermission), OwnerStatusPanel, ProductPhotos
├── context/                CartContext, AgeGateContext, AdminSessionContext
└── lib/
    ├── config.ts           brand, legal copy, integration points, placeholders
    ├── types.ts            the whole domain model
    ├── cart.ts             cart rules, including the no-shipping rule
    ├── inventory.ts        stock derivation and clamping
    ├── availability.ts     New York schedules, delivery modes, next opening
    ├── format.ts           money, dates, bytes
    └── mock/               products, catalog, orders, customers, staff, audit,
                            availability, content, media
```

`lib/types.ts` models the domain as database tables so the mock modules can be swapped for
a real client without reshaping the UI: `Product` (with `CannabisProductInfo` and
`ApparelInfo`), `ProductMedia`, `CartLine`, `OrderRequest` (with an optional `delivery`
block carrying its own status machine), `Customer`, `StaffUser`, `Permission`,
`AuditLogEntry`, `InventoryAdjustment`, `ServiceSchedule`, `AvailabilityState`,
`DeliveryZone`, `ContentBlock`.

Money is stored in cents everywhere. Two status enums are deliberately separate:
`OrderRequestStatus` for the order and `DeliveryRequestStatus` for the manual approval
workflow, because a request can be under review as an order while its delivery leg is
waiting on a customer to answer an alternative-time offer.

**Mock data included.** Eleven products across flower, pre-rolls, vapes, edibles,
concentrates, accessories and apparel, covering in-stock, low-stock and sold-out. Five order
requests covering awaiting review, alternative time offered, confirmed, being prepared and
declined-out-of-zone. Four staff accounts across the four roles, twelve audit entries
including a failed login, five inventory adjustments, five service schedules, four delivery
zones, a drop calendar, nine content blocks, fifteen FAQ answers and a media library.

---

## 5. What is deliberately not built

- **No payment processing of any kind.** Step 4 of checkout is a visual layout only. It
  collects nothing and sends nothing.
- **No real authentication.** There is no password, hash, token, master key, backdoor or
  shared credential anywhere in this repository, and none may be added. The admin sign-in
  validates input shape, shows the MFA step, and sets a prototype flag.
- **No automatic acceptance.** Nothing in this codebase can move a request to Confirmed
  except a person clicking Accept.
- **No uploads.** The media manager reads a selected file's name, size and type locally to
  demonstrate validation, then discards it.
- **No invented licence numbers, legal entity names or compliance claims.** Every such value
  is a bracketed placeholder: `[LICENSE NUMBER]`, `[APPROVED LICENSED PREMISES]`,
  `[SUPPORT EMAIL]`, `[SUPPORT PHONE]`, `[BUSINESS HOURS]` and others.

---

## 6. Before Launch checklist

Nothing in this section is optional, and none of it can be completed by a developer alone.

### New York cannabis attorney / compliance professional

- [ ] Confirm the licence type, approved premises and exactly which activities this site may
      advertise and transact, then supply the real values for every `[PLACEHOLDER]` in
      `src/lib/config.ts`.
- [ ] Draft or approve all legal copy: the age-gate notice, product warnings, responsible-use
      notice, privacy policy, terms of service, and the refund and cancellation policy. The
      four pages under `/legal` are structural placeholders and must not ship as written.
- [ ] Approve the required New York warning wording, symbols and placement for every product
      category, and confirm where it must appear on the page.
- [ ] Review all customer-facing copy for prohibited claims, including anything that could
      read as a medical, health, effect or strength claim.
- [ ] Rule on advertising and marketing: whether email and SMS marketing is permitted for
      cannabis, what the drop list may say, and whether the site may be indexed by search
      engines (`robots` is currently set to noindex as a safe default).
- [ ] Rule on every promotion type before any is enabled. Discounting, bundling, giveaways
      and loyalty rewards are restricted; the Promotions screen blocks cannabis promotions
      pending this review.
- [ ] Confirm the approved delivery service area and that every ZIP code configured under
      Delivery Zones is inside it.
- [ ] Confirm the age and identity verification procedure at checkout and at final handoff,
      and what must be recorded and retained.
- [ ] Confirm record-keeping and data-retention obligations for order, customer and audit
      records.

### Licensed cannabis POS vendor

- [ ] Make the POS the system of record for inventory, and replace `src/lib/mock/products.ts`
      with a read-through client.
- [ ] Implement transactional holds so two customers cannot both take the last unit, with the
      permanent deduction happening only on owner acceptance.
- [ ] Wire seed-to-sale reporting for every unit received, adjusted and sold.
- [ ] Map lot and batch numbers, expiration dates and lab documentation to the fields already
      present on `CannabisProductInfo`.
- [ ] Reconcile the dashboard's inventory adjustment reasons with the POS's own reason codes.

### Secure payment provider

- [ ] Select a cannabis-compliant processor and confirm in writing that it permits this
      licence type and transaction model.
- [ ] Implement payment server-side. Card data must never touch this application.
- [ ] Decide and document whether any amount is authorised before owner acceptance, and make
      the checkout copy match that decision exactly.
- [ ] Connect a tax engine. The flat placeholder rate in `src/lib/config.ts` does not model
      New York cannabis excise or local taxes and must be removed.

### Developer / security professional

- [ ] Replace the mock admin session with server-issued HTTP-only, Secure, SameSite cookies,
      individual accounts, Argon2id or bcrypt password hashes, and enforced MFA.
- [ ] Add CSRF protection, rate limiting, bot protection and account lockout on the login
      route, and log every failed attempt with IP and device.
- [ ] Re-check every permission server-side on every request. The `RequirePermission`
      component hides UI and protects nothing.
- [ ] Gate cannabis routes in middleware so cannabis markup is never sent to a client that has
      not confirmed 21+.
- [ ] Re-validate the cart server-side at submission against live inventory, and again
      immediately before owner acceptance.
- [ ] Build the audit log as append-only rows written in the same transaction as the change,
      not editable or deletable from the dashboard.
- [ ] Implement media uploads properly: signed upload URLs to secure object storage,
      byte-level file type validation, malware scanning, derivative generation to WebP or
      AVIF, CDN delivery, and access control so draft and hidden media are unreachable.
- [ ] Encrypt customer data at rest, implement the retention and deletion policy, and add
      backups with a tested restore.
- [ ] Build the account recovery workflow around verified owner identity and single-use
      recovery codes. No bare public reset link.
- [ ] Commission an independent security review and an accessibility audit before launch.
- [ ] Review analytics so that cannabis browsing or purchase behaviour never reaches an
      advertising network.

### Business owner

- [ ] Supply the real legal entity name, licence type, licence number and approved premises.
- [ ] Supply the support email, phone, SMS number, business hours and response-time
      commitment.
- [ ] Set the real schedules under Hours & Availability, in America/New_York, and confirm they
      match what the licence permits.
- [ ] Set the delivery fee, minimum order and service area for each zone.
- [ ] Set low-stock thresholds per product and decide who may adjust inventory.
- [ ] Create individual staff accounts and assign the least-privilege role each person needs.
      Never share an account.
- [ ] Supply rights-cleared product and campaign photography. Everything currently rendered is
      generated placeholder artwork.
- [ ] Write and approve the apparel return policy and fulfillment window.
- [ ] Decide how many active deliveries can be handled at once, and confirm the understanding
      that no setting in this dashboard ever accepts an order automatically.
- [ ] Read and accept that this prototype, on its own, makes nothing about the business
      legally compliant.
