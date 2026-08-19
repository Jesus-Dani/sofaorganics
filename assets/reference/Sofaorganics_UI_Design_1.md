# UI Design Document
## Sofaorganics E-Commerce Website

**Date:** August 17, 2026
**Status:** v2.0 — full visual direction pivot based on client-supplied reference sites and color palette
**Companion docs:** Sofaorganics_PRD.md, Sofaorganics_TRD.md

**Changes since v1.0:** replaced placeholder colors with values sampled from the real logo; replaced the "minimal flat-lay" imagery assumption with the client's actual warm/editorial photo style plus a hand-drawn doodle illustration system; added pet-safe filter, WhatsApp support, Buy Again, and removed reviews per locked decisions.

**Changes since v1.1:** the "no red anywhere" rule was revised to permit red for true error states only.

**Changes since v1.2 (this update):** a major direction pivot after the client shared reference sites (Starwest Botanicals, Rebecca's Herbal Apothecary) and a specific color palette ("Sage Garden" by Digital Garden Girl). Specifically: (1) typography moves from humanist sans to serif headings + sans body; (2) the entire color system is replaced — the logo-sampled greens are out, the new 5-color Sage Garden palette is in; (3) the hand-drawn doodle background system is removed, replaced with flat solid-color blocks behind photography in section backgrounds; (4) error states now reuse the palette's Rusted Terra rather than a separate red. This supersedes conflicting decisions in earlier versions of this document — see §9 for the one new open item this raises.

---

## 1. Design Principles (locked)

Clean, Modern, Soft, Professional, Simple, with the reference-site pivot pulling the tone slightly more toward **heritage/apothecary elegance** than the earlier "youthful/bold" framing — Youthful and Bold remain valid emotional targets but are now expressed through warmth (serif type, earthy palette, product photography) rather than playful illustration. Emotional targets: Welcomed, Comfortable, Inspired, Trustworthy, Modern, Bold. Brand message to reinforce visually: Authenticity. Constraint: **no pure red in brand/UI chrome** — true error states are the one exception, and now use the palette's own Rusted Terra rather than a separate red (see §2, §6.6a).

---

## 2. Color System (replaced — "Sage Garden" palette)

The client supplied a specific 5-color palette ("Sage Garden" by Digital Garden Girl) as direct reference and confirmed it should **fully replace** the earlier logo-sampled green system, accepting that the logo itself may need recoloring to match — see the open item in §9.

| Token | Name | Hex | Role |
|---|---|---|---|
| `primary` | Olive Grove | `#4E5026` | Primary brand/action color — buttons, links, active nav states, logo-adjacent UI. Replaces the old green-600/900. |
| `secondary` | Sage Garden | `#C8BA7E` | Secondary accent — hover states, secondary buttons, tags/pills, section backgrounds, **and the Low Stock badge** (its warm khaki tone already reads as "caution" without needing a separate gold). |
| `accent` | Rusted Terra | `#CB6843` | Tertiary accent, used sparingly — CTAs that need to pop, promo banners, sale/highlight badges, **and true error states** (see §6.6a). Approved by the client as "terracotta, not red." |
| `background` | Soft Lily | `#F6F2EB` | Primary background — replaces both the old white and off-white; warmer than pure white throughout. |
| `text` | Espresso Soil | `#49392C` | Primary text color — replaces the old near-black/charcoal. A warm dark brown, not a cool black, consistent with the earthy palette. |

Derived tints (for use where a lighter version of a palette color is needed — e.g. badge backgrounds, subtle section fills):
| Token | Derivation | Approx. Hex | Usage |
|---|---|---|---|
| `primary-tint` | Olive Grove, ~85% lightened | `#E4E6DA` | In Stock badge background |
| `background-alt` | Soft Lily, slightly deepened | `#EFE9DE` | Alternate section background, card borders |
| `text-muted` | Espresso Soil, ~40% lightened | `#8A7B6E` | Secondary/meta text |
| `surface-error-tint` | Rusted Terra, ~85% lightened | `#F5DED4` | Error banner background (paired with full-strength Rusted Terra text/icon) |

**No white or near-white pure background remains** — Soft Lily is the base everywhere a white background would previously have been used, which is a deliberate part of the warmer, less "clinical" feel from the reference sites.

**Open item:** exact tint percentages above are starting points, not final — confirm against the client's actual logo file once recolored (§9) and validate contrast ratios per §8 before dev handoff.

---

## 3. Typography (revised — serif headings, sans body)

**Headings, logo-adjacent text, product names:** an elegant serif, matching the heritage/apothecary feel of the reference sites (Starwest's "STARWEST BOTANICALS," Rebecca's "REBECCA'S HERBAL APOTHECARY" wordmarks) — e.g., **Playfair Display**, **Cormorant**, or **EB Garamond**. Small-caps treatment for supporting label text (e.g. "EST. 2026," category eyebrows) is an option worth prototyping, matching the reference sites' use of small-caps under the main wordmark.

**Body text, UI labels, buttons, form fields:** a clean, highly legible sans-serif — e.g., **Karla**, **Inter**, or similar — kept from the earlier humanist-sans direction specifically for readability at small sizes (product descriptions, admin tables, form inputs). This split (serif headings + sans body) is exactly what both reference sites do.

| Style | Size / Line-height | Weight | Font | Usage |
|---|---|---|---|---|
| Display | 40–48px / 1.15 | Regular/Medium, serif | Serif | Homepage hero headline |
| H1 | 32px / 1.2 | Medium, serif | Serif | Page titles |
| H2 | 24px / 1.25 | Medium, serif | Serif | Section headers |
| H3 | 18px / 1.3 | Regular, serif | Serif | Card titles, product names |
| Body | 16px / 1.6 | Regular (400) | Sans | Paragraph copy |
| Small | 14px / 1.5 | Regular (400) | Sans | Captions, meta info, stock labels |
| Button/Label | 15px / 1.2 | Medium (500) | Sans | Buttons, tags, nav items |

Sentence case throughout, not ALL CAPS, except optional small-caps for eyebrow/label text as noted above.

---

## 4. Shape, Spacing & Grid

Unchanged from prior lock: sharp/square shape language (near-zero border-radius on buttons, inputs, product tiles) — though the reference sites' **category tiles specifically use rounded corners** on their solid-color image blocks (see §5.2), which is a deliberate, scoped exception, not a reversal of the general sharp-corner rule. Balanced spacing on an 8px grid. Product grid: 4 columns desktop / 2 tablet / 1–2 mobile, 24px gutters. Max content width ~1280px.

| Breakpoint | Width |
|---|---|
| Mobile | 0–599px |
| Tablet | 600–1023px |
| Desktop | 1024–1439px |
| Large desktop | 1440px+ |

---

## 5. Imagery & Background Treatment (revised — doodle system removed)

### 5.1 Photography
Unchanged: the client's warm/editorial photography direction (wooden bowls, mortar and pestle, natural surfaces) remains the product photography style, standardized to square crops per the sharp-corner language. Reshoot/re-edit flagged as a content-production task (§9).

### 5.2 Section background treatment (replaces the doodle illustration system)
The hand-drawn doodle background system from earlier versions of this document is **removed**. In its place, following the Starwest Botanicals reference directly:

- **Category/feature tiles:** large blocks with a **flat solid color fill** from the palette (Sage Garden or a light tint of Olive Grove/Soft Lily-alt — not pink/peach as in the reference, adapted to this brand's palette), rounded corners (a scoped exception to the sharp-corner rule, matching the reference), with product photography sitting on top and the category name in serif overlaid near the bottom plus a short tagline — directly modeled on Starwest's "Shop By Category" tiles.
- **General page backgrounds:** Soft Lily throughout (§2) — no pattern, no texture, no illustration layer.
- **No decorative doodle/illustration asset system is built.** This removes the SVG doodle-asset production work entirely (see TRD §9 for the corresponding technical change).

---

## 6. Core Components

### 6.1 Navigation (Mega-menu, multi-facet)
Logo (left, serif wordmark), primary nav (sans), search/account/wishlist/cart icons (right). "Shop" mega-menu opens into three columns — **By Type**, **By Origin**, **By Use Case** (13-category list, PRD §5.3) — plus a **Pet-Safe** filter toggle in the shop/filter UI (not a mega-menu column). Given 13 use-case categories, lay out "By Use Case" as two sub-columns or a scrollable list. A "By Health Goal"-style dropdown (per the Starwest reference) is a good direct model for this. Mobile: hamburger with the same groupings as accordions. Background: Soft Lily or white-adjacent per §2; sticky on scroll.

### 6.2 Homepage (Hybrid layout)
1. Hero: short story-led headline (serif)/subhead (sans) over a Soft Lily or photography background — **no doodle texture** — primary CTA button in `primary` (Olive Grove)
2. Featured category tiles — solid-color blocks per §5.2, modeled on Starwest's category tiles
3. Featured/best-selling products grid
4. Trust band: "Why Sofaorganics" — wellness-support language per PRD §4.2
5. Blog/education teaser
6. Footer: nav, disclaimer/returns-policy links, WhatsApp + contact, legal, social

### 6.3 Product Card
Square-cornered image frame, product name (serif, H3), "From ₦X" price, stock badge inline below name (§6.5), wishlist toggle icon. Card click goes to the Product Detail Page (no quick-add, since size selection is required first).

### 6.4 Product Detail Page
Image gallery (standardized editorial photography) · product name (serif) · type/origin/use-case tags as pill labels (`secondary`/Sage Garden bg) · a small **"Pet-Safe"** badge/icon when applicable, with pet dosing notes in a dedicated collapsible section · price · size dropdown · stock badge · quantity stepper · Add to Cart (`primary` fill) · Add to Wishlist · description (sans, wellness-support language) · related products · disclaimer snippet link.

### 6.5 Stock Status Badge
- **In Stock:** `primary-tint` bg / `primary` (Olive Grove) text
- **Low Stock:** `secondary` (Sage Garden `#C8BA7E`) bg / `text` (Espresso Soil) text — its natural khaki warmth reads as advisory without a separate gold token
- **Out of Stock:** a light neutral tint (see `background-alt`) / `text-muted` — purchase button disabled

### 6.6 Buttons
Primary: `primary` (Olive Grove) fill, Soft Lily text, sharp corners. Secondary: outline in Olive Grove, transparent fill. Tertiary: text-only, Olive Grove, underline on hover. Accent/CTA-emphasis buttons (e.g. a promo banner's action button) may use `accent` (Rusted Terra) fill — this is the one place the tertiary accent appears as a solid fill, used sparingly so it keeps its "this is special" meaning. 44px minimum touch target.

### 6.6a Form & System Error States (revised)
- Form validation errors: `accent` (Rusted Terra) text/border on the offending field, short inline message below it, **plus a non-color cue (icon + text)** — this is the safeguard that keeps errors distinguishable from decorative Rusted Terra use elsewhere (buttons, promo banners), per accessibility notes in §8.
- Failed payment/checkout errors: `surface-error-tint` background banner (light Rusted Terra tint) with clear message and retry action, Rusted Terra icon.
- Toasts/system error banners: same treatment.
- **Trade-off accepted by the client:** Rusted Terra now serves double duty as both a decorative accent and the error color — mitigated only by consistent icon+text pairing, not color alone.

### 6.7 Filters (Shop/Category pages)
Sidebar (desktop) / slide-up sheet (mobile) with collapsible groups: **Type, Origin, Use Case, Pet-Safe** (toggle). Active filter chips above the grid. Sort control top-right.

### 6.8 Wishlist Page (account-gated)
Grid of saved cards with "Move to Cart" (opens size selector). Friendly empty state — previously specified as "doodle-illustrated"; now uses a simple Soft Lily/solid-color-block treatment consistent with §5.2 instead.

### 6.9 Cart & Checkout
Cart: line items with variant, quantity stepper, remove, subtotal + shipping/tax estimate, primary Checkout button. Checkout: guest-first with post-purchase account prompt. Subscribe-and-save toggle at line-item level, unchecked by default.

### 6.10 Account / Order History
Order list with simple status labels (Pending / Shipped / Delivered) and a **"Buy Again"** button per past order.

### 6.11 Blog / Education Hub
Article grid matching product-card shape/spacing language. Article page: readable measure (~65–75 characters/line), serif pull-quotes for mission statements, related-products module. Wellness-support tone per PRD §4.2.

### 6.12 Support Access
Persistent WhatsApp button (floating or in header/footer) alongside a standard contact form.

### 6.13 Admin Panel (internal tool)
Simpler, denser UI kit (tables, forms), sans-serif throughout (serif reserved for customer-facing brand moments, not utilitarian admin screens) with `primary` (Olive Grove) accent for primary actions. Key screens unchanged from prior lock: Dashboard, Product entry (sectioned single page), CSV bulk import, Stock quick-edit, Orders (list/detail + New Manual Order), Customers list/profile, Sales dashboard, Shipping & Tax rules, Blog editor, Site content editor, Settings.

---

## 7. Iconography

Simple, single-weight line icons (e.g., Feather/Phosphor-style) matching "clean, modern, soft," rendered in `text` (Espresso Soil) or `primary` (Olive Grove) depending on context. The earlier note distinguishing icons from doodles no longer applies since the doodle system is removed (§5.2).

---

## 8. Accessibility Notes

WCAG AA contrast for all text/background pairs — **re-verify specifically for this new palette**, since several combinations (e.g. Sage Garden `#C8BA7E` text-on-background uses) are lower-contrast than the old palette and need real checking, not assumption, before dev handoff. All interactive elements keyboard-operable. Stock status **and** form/system errors are conveyed via color **and** text/icon, never color alone — this is the specific mitigation for Rusted Terra's dual decorative/error role (§6.6a). Alt text on all product/blog images.

---

## 9. Open Items

1. **Exact production logo file** — now a higher-priority item than before: the client confirmed the new Sage Garden palette should fully replace the logo-sampled greens, which means the **existing logo likely needs to be recolored** to match this new palette (or a deliberate mismatch between logo and site palette is accepted). Needs a decision before final asset production.
2. **Reshoot/re-edit decision for product photography** — flagged as a content-production task.
3. **Contrast validation for the new palette** — see §8; not yet checked against real WCAG ratios.
4. **Font licensing** — confirm licensing/self-hosting terms for the specific serif (Playfair Display, Cormorant, or EB Garamond) and sans body font once one is chosen from the options in §3.

~~Doodle animation reconsideration~~ — moot, the doodle system itself is now removed (§5.2).
~~Final use-case taxonomy~~ — closed, see PRD §5.3.
