# Answers to Lovable's scoping questions

Paste the block below into Lovable. Everything in it is already decided in the Next.js
reference build, except two points marked **CHANGE** where the reference is wrong and
Lovable should not copy it.

---

```
Good questions. Answers below — I have a view on all of them.

CATALOG & CART

1. One storefront, two clearly separated sections. Cannabis lives behind the age gate,
streetwear does not. Do not build two separate sites — the brand is one brand, the law is
what differs.

A mixed cart is ALLOWED. Do not block it and do not split it into two requests. Blocking
punishes the customer for a rule that is ours, and splitting doubles the work for the one
person reviewing requests. Instead: group the cart into two labelled sections, "Cannabis
— 21+" and "Apparel & accessories", each with its own note.

The rule that actually matters: the moment a cannabis line is present, the shipping option
disappears entirely and the whole cart becomes a request. Not disabled — gone. Write that
as a cart-level function (shippingAllowed = every line is non-cannabis), not as a
conditional in the checkout component, so it cannot be bypassed by a new code path later.

2. Yes, streetwear can ride along on a cannabis pickup request. Apparel is not regulated;
making someone do two transactions to collect a tee and a pre-roll is bad service for no
legal benefit. Streetwear can ALSO ship on its own. The reverse is never true: cannabis
never ships, in any combination, ever.

THE REQUEST FLOW

3. Pickup AND delivery, both request-only. Build pickup now; delivery is a later phase —
do not build the delivery inbox yet.

The customer picks a PREFERRED window, labelled in the UI as a preference and not a
booking. Then a human confirms it, offers alternative windows, or declines. No slot
allocator, no capacity rule, no auto-accept, and no ETA shown before a person accepts.

4. Both, and they do different jobs. A full-screen gate before any cannabis content, stored
as a 24-hour cookie. A second guard on cannabis routes as defence in depth. Then at
submission, a 21+ confirmation checkbox plus a separate ID acknowledgment checkbox.

Store only a boolean and a timestamp. The date-of-birth field is a clearly labelled
placeholder that stores nothing — real date-of-birth checking belongs to a verification
vendor, not to a text input. Put a comment on the age gate saying it is an access
affordance and NOT verification, so nobody later mistakes a passed gate for a verified
customer.

5. Keep it minimal. First name, last name, email, mobile, optional notes to the business.
Plus the two acknowledgments above. Delivery later adds address and preferred window.

Nothing else. No ID numbers, no uploaded documents, no real date of birth. Every extra
field is a liability on a regulated order.

STATUS & ACCOUNTS

6. Option (a): a reference code in the URL, /order-request?ref=FP-2609-0184. Skip the fake
magic link — a visual-only auth flow teaches the wrong mental model to whoever builds the
real one.

Add a comment where you read that parameter: in production this needs a signed or
authenticated link, because as written anyone can change the reference and read someone
else's order. That is fine for a prototype and fatal in production, so it should be written
down rather than discovered later.

7. Yes, build the admin view. Unlisted route at /admin/login, mock email and password
followed by a multi-factor step that authenticates nobody. No password, hash, token, master
key or shared credential anywhere in the codebase. Put a comment listing what production
requires: individual accounts, Argon2id or bcrypt hashes, enforced MFA, server-issued
HTTP-only Secure SameSite cookies, CSRF protection, rate limiting, account lockout, and an
independent security review.

Status ladder:
Request Received → Under Review → Confirmed → Being Prepared → Ready for Approved
Fulfillment → Completed
Terminal: Declined, Cancelled.

Use "Ready for Approved Fulfillment" rather than "Ready for Pickup". It stays correct once
delivery exists, and it does not promise a handoff before ID has actually been checked.

Every status change writes an audit entry: who, when, old value, new value, reason.

INVENTORY

8. Bands only, customer-side: In Stock / Low Stock / Sold Out. Raw numbers in the admin
only.

**CHANGE — do not copy the reference build here.** My existing version prints "4 units on
hand" on the cannabis product page. That was a mistake. On a regulated product it reads as
scarcity marketing, and it leaks operational data to anyone browsing. Bands only, on both
cannabis and apparel.

Derive the band from the quantity in a helper function, never from a stored status field,
so a stale value can never sell something that is gone.

9. Recheck stock at the moment of acceptance, every time. If it is short, the owner CANNOT
accept — the accept action fails and shows what is actually available. They then either
contact the customer to drop or swap that line, or decline with the reason "Item out of
stock".

Never partial-accept silently. Never allow negative stock. The decline path reserves
nothing and releases any temporary hold.

STREETWEAR

10. Visual placeholder only. An address form, a flat placeholder shipping line, and that is
it — no rates, no carrier selection, no labels, no tracking numbers. Label the section as
pending a real fulfillment integration so it is obvious it is not wired up.

11. Per-variant quantity, yes. Sold Out is per size.

**CHANGE — do not copy the reference build here either.** Mine has a single stockQuantity
per product plus a sizes array, which means a hoodie that is sold out in M still shows In
Stock. Wrong for apparel.

Model it as variants: [{ size, sku, stockQuantity }]. Derive the product-level band from
the sum across variants, disable individual size buttons at zero, and disable Add to Cart
until a size with stock is selected.

BRAND & VISUAL

12. Hybrid, and the ratio matters: premium editorial structure, with grit only as texture.
Near-black surfaces, generous spacing, hairline borders, restrained motion. The grit is a
subtle film grain, a faint map-grid line texture, and a thin chrome gradient rule. No tape,
no stencil, no spray-paint, no smoke. It has to read as a licensed retailer, not as a plug
page — that distinction is the whole brand.

13. Defined from scratch. Use these exactly, as named tokens in tailwind.config.ts rather
than inline hex:

- ink #101010 primary surface, ink-soft #171717 raised, ink-card #1B1B1B cards,
  ink-line #2A2A2A hairlines
- bone #F4F0E8 for type and inverted light sections
- emerald #1C614A as the ONLY action colour (soft #25765C, deep #134536)
- chrome #B7B7B7 secondary text, chrome-dim #8A8A8A
- acid #B6D85C sparingly: focus rings, a "New" badge, one or two accents per page
- amber #D9A441 warning, red #D4544A error — reserved, so they always mean something

Type: Anton for display, uppercase, letter-spacing 0.01em, line-height 1. Do not go below
line-height 1 on stacked headlines or the capitals collide. Inter for everything a customer
reads carefully.

Logo: wordmark "FOREIGN PACKZ" set in Anton. The mark is an "FP" monogram, used at low
opacity as a watermark inside product image placeholders.

Everything else, take your sensible defaults. One ask: re-read the rules from my first
message before you write the cart logic and the accept action. Those two places are where
this build either holds the line or quietly breaks it.
```
