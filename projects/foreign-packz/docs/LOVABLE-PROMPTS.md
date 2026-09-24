# Foreign Packz — Lovable build prompts

Lovable builds on **Vite + React + TypeScript + Tailwind + shadcn/ui + react-router-dom**.
The repo in `projects/foreign-packz` is Next.js App Router, so it cannot be pasted in
directly — `next/link`, `next/navigation`, `app/` routing and server components have no
equivalent there. These prompts rebuild the same site natively in Lovable's stack.

**How to use:** paste them **one at a time, in order**, waiting for each to finish. Lovable
drops requirements from very long prompts, so one giant paste will give you a thinner site
than seven focused ones. Prompt 0 is the standing rule set — if Lovable ever drifts on the
compliance behaviour, paste it again.

---

## Prompt 0 — Standing rules (paste first, re-paste any time it drifts)

```
You are building a front-end prototype for Foreign Packz, a New York licensed adult-use
cannabis and streetwear brand. Before writing any code, take these rules as permanent
constraints for this project. They are not stylistic preferences.

HARD RULES, ENFORCED IN CODE NOT JUST IN COPY
1. Cannabis is never shippable. Write the cart logic so a cannabis line ignores any
   "shippingEligible" flag entirely, and a cart containing cannabis can never reach a
   shipping checkout flow. Shipping is offered only when every line is non-cannabis.
2. Zero stock always reads "Sold Out". Derive the customer-facing status from the quantity
   in a helper function, never from a stored status field, so a stale value can't sell
   something that is gone. A sold-out product must not render an Add to Cart button at all.
3. Inventory is deducted only after a human accepts a request. Submitting a cannabis order
   reserves nothing. Nothing in this app may move an order to "Confirmed" automatically —
   no timer, no capacity rule, no time-slot allocator.

NEVER BUILD
- Any payment processing, real or simulated. The payment step is a visual placeholder that
  collects nothing and sends nothing.
- Any real authentication. No password, hash, token, master key, backdoor or shared login
  anywhere in the codebase.
- Any invented licence number, legal entity name, address or compliance claim. Use bracketed
  placeholders: [LICENSE NUMBER], [APPROVED LICENSED PREMISES], [SUPPORT EMAIL],
  [SUPPORT PHONE], [BUSINESS HOURS].
- Any medical claim, health claim, or claim about effect or strength. No "cures", "treats",
  "guaranteed", "best high", "strongest".

LANGUAGE
A cannabis order is a REQUEST, never a confirmed order. Buttons say "Continue to Order
Request". Status says "Order request received — awaiting review". Never say confirmed,
scheduled, paid, ready or fulfilled until a status has actually been set by a person.

Confirm you have these rules, then wait for my next message.
```

---

## Prompt 1 — Design system, shell and home page

```
Set up the project and build the home page.

STACK: React + TypeScript + Tailwind + shadcn/ui + react-router-dom. Mobile-first, and it
has to feel right on an iPhone specifically.

BRAND: Foreign Packz. New York lifestyle brand, adult-use cannabis plus limited streetwear
drops. Voice is confident, concise, refined, mature. Short sentences. No hype.
Tagline options: "Elevated taste." / "Curated locally. Built for the city."

COLOUR — put these in tailwind.config.ts as named tokens, not inline hex:
- ink #101010 primary surface, ink-soft #171717 raised, ink-card #1B1B1B cards,
  ink-line #2A2A2A hairlines
- bone #F4F0E8 for type and for inverted light sections
- emerald #1C614A as the ONLY action colour (emerald-soft #25765C, emerald-deep #134536)
- chrome #B7B7B7 secondary text, chrome-dim #8A8A8A
- acid #B6D85C used sparingly: focus rings, a "New" badge, one or two accents per page
- amber #D9A441 warning, red #D4544A error — reserved, so they always mean something

TYPE — load from Google Fonts:
- Anton for display. Uppercase, letter-spacing 0.01em, line-height 1. Do NOT go below
  line-height 1 on stacked headlines or the caps collide.
- Inter for everything a customer reads carefully: body, product detail, forms, checkout.

SPACING: 4px base. Two page tokens that step up at md: --fp-gutter 20px → 32px and
--fp-section 64px → 96px. Content shell max-width 1240px.

TEXTURE — three reusable utility classes, no image files:
- .fp-grain — inline SVG feTurbulence film grain at 35% opacity, overlay blend
- .fp-grid-lines — 48px map-inspired grid from rgba(183,183,183,.07) lines
- .fp-chrome-rule — a 1px horizontal chrome gradient divider

IMAGERY — there is no photography. Build a <BrandImage seed alt ratio caption> component
that generates artwork deterministically from a seed string: hash the seed, pick one of five
dark gradient palettes, add a radial light pool, the grid texture, a large "FP" monogram at
7% bone opacity rotated a few degrees, and a hairline inset frame. Same seed always gives
the same artwork. Use it everywhere a photo would go. Never a broken image, never stock
photography, never real cannabis brand artwork.

CARDS: hairline border, ink-card fill, 14px radius, layered shadow. On hover lift 1px over
300ms and scale the image 3%. Nothing louder than that.

BUTTONS: variants primary (emerald), secondary (chrome outline), ghost, bone (inverse),
danger. Sizes with min-height 40/48/56px. Uppercase, letter-spacing 0.12em.

ACCESSIBILITY — non-negotiable: every field labelled, errors announced with role="alert"
and aria-describedby, aria-invalid rather than colour alone, a visible acid-lime focus ring
on everything interactive, a skip link, focus trapped in dialogs, 44px minimum tap targets,
and prefers-reduced-motion honoured.

BUILD THESE:
1. A full-screen 21+ age gate shown before any cannabis content. Foreign Packz wordmark,
   headline "Adult-use access only.", body "You must be 21 or older to enter Foreign Packz.",
   primary button "I am 21+", secondary "Exit", then this small print verbatim: "Age
   confirmation is required to browse cannabis products. Valid government-issued
   identification is required before cannabis products can be released to a customer." Plus
   a bracketed responsible-use notice placeholder. Store the confirmation in a cookie for 24
   hours. Exit routes to /exit, a neutral page with no cannabis content at all.
   Add a code comment: this is an access affordance, NOT age verification, and is not a
   replacement for compliant age/identity verification at checkout or handoff.
2. A sticky header: wordmark, nav (Shop, Apparel, About, FAQ, Support), cart icon with a
   count badge. Give it a SOLID ink background, not translucent — a translucent bar lets the
   strip above it bleed through while scrolling.
3. Above the header, a thin live status strip: a coloured dot plus "Delivery requests are
   limited right now and subject to approval."
4. A sticky bottom tab bar on mobile only: Home, Shop, Apparel, Cart, Support. Inside the
   iPhone safe area (env(safe-area-inset-bottom)), 60px tall targets.
5. Home page: full-bleed hero using BrandImage with a gradient scrim, eyebrow "Licensed
   adult-use business. 21+ only.", headline "FOREIGN PACKZ" stacked on two lines,
   subheadline "Premium adult-use cannabis. Limited streetwear drops.", supporting line
   "Curated cannabis products, premium accessories, and New York-inspired apparel for adults
   21+.", buttons "Shop 21+ Menu" and "Explore Apparel".
   Then: Shop by Category cards (Flower, Pre-Rolls, Vapes, Edibles, Concentrates,
   Accessories, Apparel — cannabis ones get a 21+ caption); a "Popular Right Now" horizontal
   snap-scroll carousel; a "New In" grid; a split-screen apparel drop editorial section; a
   "Why Foreign Packz" grid (licensed inventory, curated selection, live availability,
   adult-only responsible service, local identity); a "How It Works" section on a bone
   background with four steps (browse the 21+ menu, build your order request, receive
   confirmation after order review, complete required age and identity verification before
   handoff); a four-question FAQ preview using accordions; and a newsletter signup whose
   consent checkbox reads "I confirm I am 21 or older and consent to receive cannabis-related
   messages from Foreign Packz. Message and data rates may apply. Reply STOP to opt out."
6. A footer with the licence placeholders, policy links (privacy, terms, accessibility,
   responsible use), social placeholders, a responsible-use notice, and this line: "Cannabis
   products are never shipped by mail, UPS, USPS, FedEx or any other carrier. Apparel and
   non-cannabis accessories are the only items eligible for shipping."
```

---

## Prompt 2 — Types, mock data, menu and product detail

```
Add the data model and the cannabis menu.

TYPES — model these like database tables in src/types.ts so they can be swapped for a real
POS client later. Money in CENTS everywhere, never floats:
Product { id, slug, name, brand, sku, productClass: 'cannabis'|'apparel'|'accessory',
category, format, packageSize, description, priceCents, salePriceCents|null, stockQuantity,
lowStockThreshold, status: 'in-stock'|'low-stock'|'sold-out'|'hidden'|'draft', featured,
isNew, pickupEligible, deliveryEligible, shippingEligible, media[], cannabisInfo?,
apparelInfo?, staffNotes, createdAt, updatedAt, archived }
CannabisProductInfo { ingredients, warnings, potency, lotNumber, expirationDate,
labDocumentUrl, trackingReference } — every value a bracketed placeholder.
ApparelInfo { sizes[], fitNotes, material, careInstructions, shippingInfo, returnPolicy,
colorways[] }
ProductMedia { id, placeholderSeed, url|null, altText, internalNote?, role, status:
'draft'|'published'|'hidden', sortOrder, fileName, fileSizeBytes, width, height, uploadedAt,
uploadedBy, tags[] }

MOCK CATALOG — 11 products:
- Foreign Packz Select Flower, Foreign Packz, flower, 3.5g, $55.00, stock 4, threshold 6,
  featured
- Premium Pre-Roll Pack, Foreign Packz, pre-rolls, 5 x 0.5g, $45.00, stock 28, featured
- Live Resin Vape, Halsted Extracts, vapes, 1g cartridge, $60.00, stock 16, new
- Fruit Chews, Cross Street Provisions, edibles, 10 pieces, $30.00, stock 0
- Small Batch Badder, Halsted Extracts, concentrates, 1g, $50.00, stock 7, new
- Machined Aluminum Grinder, accessory, $40.00, stock 22, shippable
- Carbon Stash Case, accessory, $65.00 with $55.00 sale price, stock 3, shippable
- Foreign Packz Logo Tee, apparel, S–XXL, $45.00, stock 41, featured + new, shippable
- Monogram Heavyweight Hoodie, apparel, $120.00, stock 9, threshold 10, featured, shippable
- City Grid Cap, apparel, $40.00, stock 0, shippable
- Canvas Carry Tote, apparel, $35.00, stock 34, new, shippable
Cannabis products must have shippingEligible false. Descriptions describe the package and
the format only — no effects, no potency claims, no medical language.

HELPERS in src/lib/inventory.ts: clampStock (never below zero), derivedStatus (zero always
returns sold-out, at-or-below threshold returns low-stock), publicStatus, isPurchasable.
Every component reads status through these, never from the raw field.

BUILD:
1. /shop — the menu. Age-gated: render nothing but a confirm panel until the visitor has
   passed the 21+ step. A horizontal snap-scroll category chip rail at the top (the fastest
   filter, always visible, thumb-reachable). A collapsible Filters panel with brand, product
   format, price range and availability. A sort select: Featured, Newest, Price low to high,
   Price high to low. Read ?category= and ?sort= from the URL for deep links. Announce the
   result count with aria-live.
   Keep the notices above the grid to ONE compact line on mobile, so products are reachable
   without a long scroll. Put the full fulfillment notice below the grid.
2. Product card: BrandImage, stock badge top-right of the image at every width, Featured/New
   badges top-left from the sm breakpoint up and inline below the brand line on phones —
   at two columns on a phone they overlap if both sit in the image corners. Brand, category,
   a 21+ marker for cannabis, package size, price, and either Add to Cart or, when sold out,
   a disabled purchase path plus a "Notify Me When Available" button opening a restock modal.
3. /shop/:slug — product detail. Swipeable snap gallery with position dots on mobile,
   thumbnail selector beside a large image on desktop. Name, brand, category, package size,
   price, live stock badge, quantity stepper with 44px controls, add to cart, 21+ marker,
   description. Then a "Product information" section rendering ingredients, warnings,
   potency, lot/batch number, expiration date, lab documentation link and tracking reference
   as a labelled grid of placeholders. A responsible-use notice. Related products. When sold
   out: disable purchase, show "Sold Out", show the restock capture.
   Include this line verbatim: "Final availability and order acceptance are subject to
   business review, compliant inventory systems, and required age/identity verification."
   Never render draft or hidden media to a customer.
```

---

## Prompt 3 — Cart, checkout and order request confirmation

```
Add the cart and the order request flow.

CART — a slide-out drawer and a full /cart page sharing the same logic.
- Group cannabis lines and apparel/accessory lines into separate labelled sections, always.
- Cannabis section note: "Pickup or approved delivery only. Never shipped."
- If the cart contains cannabis, show: "Cannabis products are not shipped. Order fulfillment
  is subject to approval, legal requirements, and age/identity verification."
- If it contains both, add: "This order contains both cannabis and apparel. These may require
  separate fulfillment methods. Apparel can be shipped; cannabis cannot."
- Subtotal, an estimated tax PLACEHOLDER clearly labelled as such, and total. Add a line
  saying the final amount comes from a connected tax system, not this page.
- The continue button reads "Continue to Checkout" only when every line is non-cannabis;
  otherwise "Continue to Order Request".

CHECKOUT at /checkout — five steps with a horizontal step indicator:
1. Your details — first name, last name, email, mobile. For cannabis carts also a date of
   birth field, a 21+ confirmation checkbox, and a required acknowledgment reading exactly:
   "I understand that valid government-issued photo ID is required before cannabis products
   can be released, and the recipient must match the name on this order." Under it, a notice
   saying checking a box is a declaration, not verification.
2. Fulfillment — radio options. Cannabis carts get "Request delivery" and "Request pickup";
   non-cannabis carts get "Ship my order". Delivery asks for address, city and a 5-digit ZIP
   validated against a mock service-area list, plus a preferred time window described as a
   preference only. Reject an out-of-zone ZIP with a clear error telling them to choose
   pickup. Show: "Your delivery request is not confirmed until it is reviewed and accepted
   by the business."
3. Order review — exact items, quantities, subtotal, tax placeholder, total, and this notice
   verbatim: "Cannabis availability and order fulfillment are subject to inventory
   confirmation, required age/ID verification, and all applicable laws and business
   policies." No pickup or delivery choices on this step.
4. Payment — VISUAL ONLY. Three dashed placeholder blocks labelled Payment method, Card or
   account details, Billing address, each reading "[PLACEHOLDER — configured by the connected
   payment provider]". Display: "Payment integration pending cannabis-compliant payment
   provider setup." Collect nothing. Submit nothing. Charge nothing.
5. Submit — a summary, then verbatim: "Submitting an order request does not guarantee
   acceptance or availability. You will receive a confirmation after business review."
   Button: "Submit Order Request".

CONFIRMATION at /order-request?ref=… — a request number is issued at submit time, so pass it
as a query parameter, never a prebuilt route.
Status reads "Order request received — awaiting review", or for delivery "Delivery request
received — awaiting owner review". Explain: "We will review inventory, fulfillment
availability, and required order details before confirming your request." Add: "Valid
government-issued photo ID and age verification are required before cannabis products can be
released."
A vertical status tracker: Request Received → Under Review → Confirmed → Being Prepared →
Ready for Approved Fulfillment → Completed. Declined and cancelled render their own message
saying no inventory was reserved and no payment was taken.
A placeholder list of the six future notifications: request received, request confirmed, item
unavailable or substitution needed, additional information required, fulfillment update,
order completed. Note that none is sent by this prototype.
Never promise an ETA, a time window or a driver before acceptance.
```

---

## Prompt 4 — Apparel, about, FAQ, support, policies

```
Add the remaining customer pages.

/apparel — the drop, deliberately separate from cannabis and with NO age gate.
Editorial banner "Foreign Packz — Limited Drop" over a BrandImage scrim. Category cards for
graphic tees, hoodies, hats, bags and accessories. The apparel product grid. A Drop Calendar
of three entries with bracketed date placeholders and statuses (coming soon, announced, sold
out). A lookbook gallery of six BrandImage tiles in mixed ratios. An email capture for drop
announcements that states it never receives cannabis-related messages.
Label clearly: "Apparel shipping only — cannabis products are never shipped."

/apparel/:slug — front and back images, size selector as a radio group styled as buttons,
fit notes, material, care information, live inventory, shipping and return information.

/about — hero, brand mission, a "What we commit to" grid (adults 21 and over only, no
shipping of cannabis, no claims we cannot stand behind, nothing confirmed automatically), a
compliance information block on a bone background listing legal entity, licence type, licence
number, approved premises and service area as bracketed placeholders, a community section,
and a support CTA. Lead copy: "Foreign Packz is a New York lifestyle brand centered on
adult-use cannabis culture, intentional product curation, premium local identity, and
limited streetwear drops."

/faq — searchable, with category chips and accordions. Five categories: adult-use access,
orders, products, apparel, support. Fifteen questions covering: who can browse and purchase,
why age confirmation is required, what ID is required, whether a request is automatically
accepted (no), what happens after submitting, what happens if an item becomes unavailable,
how to change or cancel, how to tell if something is in stock, what Low Stock means, where to
find warnings and lab information, whether apparel ships (yes, and cannabis never does), the
return policy (a placeholder), when drops release, how to contact support, where to find
policies. Answers must not promise anything beyond the placeholders.

/support — contact form (name, email, topic, optional request number, message, consent
checkbox), support email/phone/SMS/hours placeholders, a weekly support hours table in
America/New_York, order-request help, apparel help, an FAQ link, a privacy notice telling
people not to send ID images or payment details, and an emergency notice pointing to 911 and
Poison Control rather than this form.

/legal/:slug — privacy, terms, accessibility, responsible-use. Each a structural placeholder
with a prominent warning that final language must be drafted or reviewed by a New York
cannabis attorney and must not ship as written.

Also add a 404 page.
```

---

## Prompt 5 — Owner dashboard foundation

```
Add the staff dashboard at /admin. It has its own chrome — the customer header, footer, cart
and age gate must never render over it.

SIGN IN at /admin/login: email and password fields, then a separate multi-factor step asking
for a 6-digit code. It authenticates nobody: there is no password, hash, token or credential
anywhere. Add a prominent notice and a code comment listing what production requires —
individual accounts, Argon2id or bcrypt hashes, enforced MFA, server-issued HTTP-only Secure
SameSite session cookies, CSRF protection, rate limiting, bot protection, account lockout,
session expiry, encrypted secrets, audit logging, and an independent security review. Account
recovery needs verified owner identity and single-use recovery codes, never a bare public
reset link.

ROLES — Super Admin/Owner, Inventory Manager, Order & Delivery Manager, Content Manager. A
permission list per role, least privilege, with a helper that checks a permission. Add a
"Preview as role" selector in the sidebar, clearly labelled a prototype control that grants
nothing. Add a comment that the client-side check only hides UI and every permission must be
re-checked server-side in production.

SHELL: desktop left sidebar grouped into Operations, Catalog, Business, Administration, plus
a mobile slide-over menu and a 4-item bottom tab bar (Overview, Orders, Delivery, Inventory).
Nav: Overview, Order Requests, Delivery Requests, Hours & Availability, Inventory, Products,
Categories, Apparel, Media Library, Customers, Delivery Zones, Promotions, Content, Reports,
Staff & Permissions, Audit Logs, Settings, Logout. Hide items the selected role can't use.

A PERSISTENT compliance notice on every admin screen, collapsible to one line on mobile so it
doesn't bury the page: "This dashboard is a business-management prototype. Before launch,
connect it to the company's actual New York license type, approved premises,
cannabis-compliant POS/payment system, age/ID verification process, tax obligations, delivery
rules, product tracking, security procedures, and required seed-to-sale reporting system. Do
not use this dashboard to conduct activity outside the business's approved license, premises,
or applicable law."

SHARED COMPONENTS: StatCard, DataTable (horizontal scroll rather than a broken layout, with
secondary columns hidden below lg), ConfirmAction (a dialog that can require a typed reason
and can require Super Admin), and a "Mock data" banner.

SCREENS:
- Overview: today's request count, awaiting review, confirmed, declined/cancelled; sales
  figures as [POS FIGURE] placeholders; low stock, sold out, active products, inventory
  value; a quick-actions grid; an alerts list covering low inventory, sold out, requests
  awaiting review, failed admin login attempts, unusual cancellations and unconnected
  integrations; recent requests; recent activity.
- Order Requests: filterable table of requests with status chips. Five mock requests covering
  awaiting review, alternative time offered, confirmed, being prepared, and declined for
  being outside the service area.
- Inventory: table with on-hand, threshold, derived availability and eligibility. An Adjust
  dialog taking a CHANGE (not a new total) and requiring a reason from a fixed list —
  restock, sale, damage, expired, return, compliance hold, inventory correction, other.
  Refuse any adjustment that would take stock below zero and say so in the error. A per
  product activity history showing who changed what, when, from what value to what, and why.
  Bulk adjustments require Super Admin confirmation and a reason.
- Products: list plus an editor with details, regulated cannabis fields, apparel fields and
  internal staff notes that are never customer-visible. Archive instead of delete. Mass price
  changes require Super Admin confirmation. Shipping-eligible must be locked off for cannabis.
- Categories, Apparel, Customers (personal data restricted by role), Delivery Zones (ZIP,
  fee, minimum; service-area changes are compliance settings needing Super Admin), Promotions
  (cannabis promotions BLOCKED pending legal review, apparel promotions allowed), Content
  (preview before publish; blocks carrying legal copy need owner approval), Reports (all
  figures marked mock; exports logged and permission-gated), Settings (business and licence
  placeholders plus a list of every unconnected integration).
- Audit Logs: SUPER ADMIN ONLY — other roles get a refusal notice. Searchable table of admin
  user, date/time, action, affected item, old value, new value, reason, IP and device. Note
  that production rows are append-only and written server-side in the same transaction.
```

---

## Prompt 6 — Manual delivery approval and owner-controlled hours

```
Add the manual approval workflow. Nothing in it may ever accept a request automatically.

DELIVERY REQUESTS INBOX at /admin/deliveries — a card per request showing order number and
time submitted, customer name/phone/email, delivery address, preferred window, items and
total, delivery fee and whether the minimum is met, current inventory availability, service
area eligibility, the 21+/ID acknowledgment, customer notes, and attention flags (out of
zone, low stock, duplicate order, invalid time, repeated cancellations, minimum not met,
pending too long).

Actions per request: Accept, Decline, Offer a different time, Switch to pickup, Contact
customer, Cancel, Flag for review.

- ACCEPT opens a dialog requiring the owner to choose a delivery window, with a warning to
  re-check stock, address eligibility and their own availability first. On accept: status
  becomes Confirmed and the customer message reads "Your delivery request has been accepted
  for [TIME WINDOW]. Please have a valid government-issued ID ready. The recipient must match
  the name on the order." Only now is inventory reserved.
- DECLINE requires a reason from a fixed list: outside service area, delivery unavailable,
  requested time unavailable, item out of stock, minimum order not met, unable to fulfill,
  other. Nothing is reserved. Customer message: "We're unable to accept this delivery request
  at this time. You may choose pickup or try again later."
- OFFER A DIFFERENT TIME lets the owner select one or more windows and a response deadline
  (15/20/30/45 minutes). Status becomes "Alternative time offered". Explain in the UI that if
  the customer doesn't respond in time the request expires and any temporary hold is
  released, and that once they choose it comes back to the owner for final acceptance.
Every action writes an audit entry.

Delivery request statuses: awaiting owner review, alternative time offered, awaiting customer
response, confirmed, being packed, out for delivery, delivered, declined, cancelled, expired.

HOURS & AVAILABILITY at /admin/hours — America/New_York for everything.
Five separate schedules: delivery request hours, pickup request hours, order review hours,
apparel fulfillment hours, customer support hours. Per day: on/off, multiple time blocks,
breaks, copy a day to every weekday or all days, save as a template, schedule a future change.
Delivery modes: open, limited, fully booked, temporarily closed, closed until a set time,
closed for today — each with its exact customer-facing message:
- "Delivery requests are open and reviewed manually before confirmation."
- "Delivery requests are limited right now and subject to approval."
- "Delivery requests are currently full. Please check back later or choose pickup."
- "Delivery requests are closed. They reopen at [TIME]."
- "Delivery requests are unavailable today."
Temporary override buttons: close now, reopen now, close until a time, mark limited, mark
fully booked, close pickup, close for the day, extend hours for a day, add a break, apparel
only mode, plus a customer-facing custom message and an internal reason (out for delivery,
restocking, personal appointment, weather, inventory count, holiday).
EVERY change requires confirmation before saving, updates the customer site immediately, and
writes an audit entry with old value, new value and reason.

ONE-PERSON MODE on the Overview: an owner status selector (available, reviewing orders,
packing orders, out for delivery, on break, unavailable), a maximum-active-deliveries ceiling
with a current count, a customer response window, and an optional temporary inventory hold
(off/10/15/30 min) that releases automatically on decline, cancellation or expiry.
State clearly in the UI that availability settings never approve an order.

CUSTOMER SIDE: surface the delivery status on the home page, the menu, the cart and checkout.
When requests are closed, disable "Request Delivery" and show the next opening time. Offer
pickup when pickup is open. A pending request shows "Awaiting owner review", never
"Confirmed". Never show a guaranteed ETA before acceptance.
```

---

## Prompt 7 — Product photos and media library

```
Add owner-managed product media. Build it as a prototype: inspect selected files locally to
demonstrate the rules, then discard them. Upload nothing, store nothing, transmit nothing.

PRODUCT PHOTOS section inside the product editor:
Drag-and-drop zone, "Upload from device", and "Take a photo" using
<input type="file" accept="image/*" capture="environment"> so it opens the camera on iOS and
Android where allowed. Accept JPG, JPEG, PNG, WebP and HEIC/HEIF. Enforce a configurable
10 MB ceiling and show a clear rejection message naming the reason and the limit.
Gallery list with: set as cover, reorder up/down, edit, hide/restore, delete, alt text field,
internal note field (never customer-visible), and draft/published/hidden status.
A cover image CANNOT be deleted until another cover is selected — disable it and say why.
Preview toggles showing the cover as it appears on a product card, a detail page and mobile.
Crop, rotate and reframe controls. Save as draft and Save and publish.
An image quality checklist, with the compliance items marked required: good lighting, clear
label, not blurry, no personally identifiable information, no minors or youth-oriented
imagery, no unverified health or medical claims and no claim text over the image, nothing
violating cannabis advertising or packaging rules, no copyrighted brand artwork the business
lacks rights to.

MEDIA LIBRARY at /admin/media:
Grid of every asset. Search by product name, SKU, filename, tag or upload date. Filters: all,
cannabis, apparel, accessories, unused, draft, published. Bulk select, bulk assign to a
product, bulk archive behind Super Admin confirmation. Show file size, dimensions, upload
date, uploaded-by and where each photo is used. Mark cover images and block their deletion.

APPAREL MEDIA roles: front, back, detail/close-up, on-body lifestyle, size guide, colorway,
and lookbook/campaign association.

Add a comment block listing what production requires: secure cloud object storage, short-lived
signed upload URLs, server-side byte-level file type validation rather than trusting the
extension or reported MIME type, malware scanning, automatic conversion to WebP or AVIF,
four generated renditions (card thumbnail, standard, large detail, mobile), lazy loading, CDN
delivery, access control so draft and hidden media are never publicly reachable, and an audit
entry on every upload, replace, hide, delete and reorder.

CUSTOMER SIDE: use the owner-selected cover as the card image, a swipeable gallery on mobile,
a thumbnail selector on desktop, lazy loading, and the branded BrandImage placeholder when a
product has no published photo. Never expose internal notes, filenames, upload details or
draft images to a customer.
```

---

## After the build

Things Lovable tends to get wrong on this project — check each one and re-prompt if needed:

1. **A sold-out product still shows Add to Cart.** The button must not render at all.
2. **Cannabis reaches a shipping flow.** Test a mixed cart: shipping must disappear entirely.
3. **Something auto-confirms.** Search for any timer or capacity rule that changes a status.
4. **Invented licence numbers or addresses.** Everything real-world must stay bracketed.
5. **Stacked Anton headlines collide.** Line-height must not go below 1.
6. **Badges overlap on a two-column phone grid.** Keep only the stock badge in the image corner.
7. **The admin renders inside the customer header and footer.** They need separate shells.

The working Next.js reference implementation, the full data model and the Before Launch
checklist are in `projects/foreign-packz` on branch `claude/foreign-packz-ecommerce-4fy4oi`.
