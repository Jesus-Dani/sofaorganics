# Product Requirements Document (PRD)
## Sofaorganics E-Commerce Website

**Prepared for:** Sofaorganics
**Date:** August 17, 2026
**Status:** v1.1 — updated after brand-asset review (Google Drive) and admin/ops decision-lock round
**Companion docs:** Sofaorganics_TRD.md, Sofaorganics_UI_Design.md

**Changes since v1.0:** incorporated real brand assets found in the client's Google Drive (logo, existing flyers, product photos); added a compliance/health-claims decision; added returns policy, support channel, order tracking, reviews, and pet-product decisions; added a full admin/back-office specification; added draft use-case taxonomy.

---

## 1. Executive Summary

Sofaorganics sells Ayurvedic and African herbs, spices, and oils, guided by a master herbalist who practices functional medicine — diagnosing root causes rather than selling pre-made formulations. The business wants a custom-built e-commerce website that sells products online, reaches new customers, looks professional, and reduces manual order handling, while communicating **authenticity** and making visitors feel **welcomed**.

This PRD defines the full-scope v1 build: a custom-coded storefront (not a SaaS platform) with a multi-faceted product catalog, an educational blog/wellness hub, accounts with wishlist, optional subscribe-and-save, Paystack-powered checkout for the Nigerian market, and a self-service admin panel the business owner will use to build out the entire catalog personally.

---

## 2. Goals & Success Metrics

### 2.1 Business goals (from discovery)
Increase online sales; reach new customers; make purchasing easier; make the brand look more professional; showcase products better; increase repeat purchases; build customer trust; make product discovery easier; reduce the need to process orders manually.

### 2.2 Success metrics
| Metric | Target signal |
|---|---|
| Conversion rate (visits → completed orders) | Track from launch baseline, aim for steady month-over-month improvement |
| Manual order handling volume | Reduction in orders requiring manual phone/WhatsApp intervention |
| Repeat purchase rate | % of customers with 2+ orders within 90 days; "Buy Again" and subscribe-and-save adoption |
| Wishlist → purchase conversion | % of wishlisted items eventually purchased |
| Search/filter usage | % of sessions using type/origin/use-case/pet-safe filters |
| Blog → product traffic | % of blog readers who click through to a product/category |

---

## 3. Target Users

- **Primary customer:** Broad — "everyone," including pet owners buying for animals.
- **Site owner/admin:** The Sofaorganics business owner, who will personally build out the entire product catalog through the admin panel and manage the store solo (no staff accounts in v1 — see §7).

### User needs surfaced in discovery
Finding products easily; a simple checkout process; discovering new products; saving products for later (wishlist); easy navigation; fast and convenient shopping; knowing stock availability before purchasing.

---

## 4. Brand Foundation (revised — v2 visual direction)

Sofaorganics already has a logo and marketing materials in active use, retrieved from the client's Google Drive. An earlier version of this PRD locked a color/illustration system sampled directly from that logo; the client has since supplied specific reference sites (Starwest Botanicals, Rebecca's Herbal Apothecary) and a named color palette ("Sage Garden" by Digital Garden Girl) and asked that this **fully replace** the logo-sampled system. Full rationale and exact tokens are in the UI Design Document §2–§3; summarized here:

- **Logo:** "Sofa Organics" wordmark in black script type, paired with a leaf-swoosh mark, with "HERBALS" as a small-caps subline. **Open item:** the logo's original colors (gradient green) no longer match the new site palette — see §11.
- **Color palette (replaces the logo-sampled greens):** Olive Grove `#4E5026` (primary), Sage Garden `#C8BA7E` (secondary), Rusted Terra `#CB6843` (accent, approved as "terracotta, not red"), Soft Lily `#F6F2EB` (background), Espresso Soil `#49392C` (text). Full token mapping and derived tints in the UI Design Document §2.
- **Typography:** elegant serif for headings/logo-adjacent text (heritage/apothecary feel, matching the reference sites), clean sans for body copy — see UI doc §3.
- **Feel:** Clean, Modern, Soft, Professional, Simple, now expressed with more heritage/apothecary warmth than the earlier playful-illustration direction — Youthful and Bold remain valid but are carried by warmth (serif type, earthy palette, photography) rather than doodle illustration.
- **First-visit takeaway:** Simplicity
- **Emotional response:** Welcomed, Comfortable, Inspired, Trustworthy, Modern, Bold
- **Must preserve:** existing logo — though see the open item above regarding color mismatch
- **Must avoid:** pure red in brand/UI chrome — true error states are the one exception, and now reuse Rusted Terra rather than a separate red token (see UI doc §6.6a for the accepted trade-off).
- **Core brand message:** Authenticity — no pre-made formulations, root-cause functional medicine approach

### 4.1 Background/illustration system (revised — doodle system removed)
The hand-drawn botanical doodle background system locked in earlier versions of this PRD is **removed**, replaced by a simpler treatment directly modeled on the Starwest Botanicals reference: category/feature tiles use flat solid-color blocks (from the new palette) behind product photography, with rounded corners as a scoped exception to the otherwise sharp-corner UI language. General page backgrounds are Soft Lily throughout, with no pattern or illustration layer. Full detail in UI Design Document §5.2.

### 4.2 Health claims — compliance decision (important, locked)
Existing marketing materials include language claiming products **"cure disease"** (naming fibroid, infertility, arthritis, low sperm count, hypertension, diabetes, stroke, memory loss, typhoid), branding the founder as "The One and Only Herbal Doctor," and describing products as "Scientifically Formulated" — the last of which also contradicts the client's own stated differentiator ("I am also not selling formulations").

**Decision: the new website will NOT carry forward disease-cure language.** All product and site copy will be reframed around traditional/wellness-support use (e.g., "traditionally used to support digestive health" rather than "cures typhoid"). This reduces legal exposure under regulatory frameworks that prohibit unsubstantiated disease-cure claims for products sold without drug approval (e.g., NAFDAC in Nigeria; comparable rules apply in most markets). **This is a content/copywriting requirement for whoever writes final product and marketing copy, not just a design note — flag prominently during content production.**

---

## 5. Product Catalog & Taxonomy

### 5.1 Product types sold
Ayurvedic and African herbs, spices, and oils — examples: hexane-free castor oil, triphala, ashwagandha, manjakani, olive leaves, wormwood, black walnut hull, cloves, avocado oil, jojoba oil, coconut oil, shea butter, frankincense oil, and others.

### 5.2 Product categories (by form)
Powders, extra virgin oils, whole leaves, roots, barks, and similar forms.

### 5.3 Multi-facet taxonomy (locked navigation model)
Products are discoverable through **facets**, combinable via filters:

1. **By type/form** — e.g., Powders, Oils, Whole Leaves, Roots, Barks
2. **By origin tradition** — e.g., Ayurvedic, African
3. **By health use-case** — draft list below, pending herbalist approval
4. **Pet-safe filter** — a cross-cutting filter tag (not a standalone landing category) marking which products are safe for pet use; pet-specific dosing/usage guidance appears inline on the relevant product's page rather than on a separate hub

#### Use-case taxonomy (LOCKED — reviewed item-by-item with the client)
Reframed in compliant wellness-support language and confirmed one category at a time:
- Digestion & Gut Health
- Male Reproductive Health
- Female Reproductive Health
- Hormonal Balance
- Immune Support
- Stress & Sleep Support
- Skin Care
- Hair Care
- Joint & Mobility Support
- Metabolic Wellness (blood sugar support)
- Heart Health
- Blood Pressure Support
- Memory & Focus

This is the final v1 taxonomy (13 categories) — reproductive health, skin/hair, and cardiovascular were each explicitly split into two categories rather than kept combined.

### 5.4 Product variations
Products may have size/pack-size variations: 100g, 250g, 500g, 1kg, 5kg, 25kg (not all products carry all sizes). Selection UI: dropdown on the product page. Each size has its own price and stock level.

### 5.5 Pre-purchase information requirements
Stock availability is the top pre-purchase concern. Every product/variant shows a stock status badge: **In Stock / Low Stock / Out of Stock**. Out-of-stock variants remain visible but are not purchasable.

---

## 6. Core Features (Full Build Scope)

### 6.1 Storefront
- Homepage: hybrid layout — short story-led hero followed by featured products/categories
- Mega-menu navigation across type, origin, and use-case facets, plus a pet-safe filter
- Filterable shop/category pages combining facets
- Product detail pages with size dropdown, stock badge, wellness-framed descriptions, related products
- Full-text product search
- Blog/education hub

### 6.2 Cart & Checkout
- Persistent cart (account-linked when logged in; session-based for guests)
- Guest checkout with optional account creation at end of checkout
- Flat/rule-based shipping and tax, configured by the owner in admin
- Paystack payment integration (NGN)
- Order confirmation email

### 6.3 Accounts & Wishlist
- Account creation/login
- Order history with **"Buy Again"** one-click reorder (new, locked — supports the repeat-purchase goal)
- Order status shown as a simple label: Pending / Shipped / Delivered (owner updates manually in admin — no courier-tracking integration in v1)
- Wishlist requires an account
- Saved shipping/billing details

### 6.4 Subscribe & Save (optional, non-compulsory)
Opt-in recurring auto-delivery on eligible consumables; one-time purchase remains the default. Manageable from the customer's account.

### 6.5 Blog / Education Hub
Included in v1. Same compliant, wellness-framed tone as product copy (§4.2). Manageable through the same admin panel as products.

### 6.6 Reviews
**Not included in v1** (locked decision) — revisit once order volume is established.

### 6.7 Support & Policies
- **Support channel:** WhatsApp button (matches existing customer habit — client currently takes orders via WhatsApp) plus a standard on-site contact form
- **Returns/refunds policy:** to be drafted as a standard herbal-product policy (e.g., unopened items only, defects/wrong-item exceptions), flagged for the client's/legal review before publishing — same treatment as the health-claims disclaimer
- **Legal disclaimer:** standard herbal/wellness disclaimer placeholder, flagged for legal review before launch

---

## 7. Admin / Back-Office (full specification)

The owner will personally build the entire product catalog through this interface — it is a first-class part of the product, not an afterthought.

- **Access:** single admin account (the business owner). No multi-staff roles/permissions in v1 — simplifies both the UI and the underlying access-control build.
- **Product entry:** a single, well-organized product page (sections for General Info, Photos, Sizes & Pricing, Tags, Publish) rather than a rigid multi-step wizard — matches the pattern used by high-end e-commerce admin tools (e.g., Shopify), where everything is visible and editable without losing context.
- **Size/variant entry:** supports **both** a quick checklist of the standard sizes (100g–25kg, tick + fill price/stock) **and** the ability to manually add a custom one-off size when needed.
- **Facet tagging:** pick from existing type/origin/use-case tags, **or** add a new tag on the fly while editing a product.
- **Bulk import:** CSV/spreadsheet bulk upload included, in addition to the one-by-one form, to speed up initial catalog population at launch.
- **Stock management:** quick stock-quantity edits; In Stock/Low Stock/Out of Stock badges derive automatically from quantity vs. a configurable threshold.
- **Order management:** view orders, update status (Pending/Shipped/Delivered), plus manual order entry for phone/WhatsApp sales so they're logged and deduct stock like any other order. No printable packing slip in v1 (explicitly not needed).
- **Customer management:** full customer list (registered accounts and guest/phone customers alike) with search and sort by lifetime spend/order count; each customer's profile shows contact info plus lifetime metrics (total orders, total spent, average order value, first/last order date) and their complete order history in the same view used for order management elsewhere in admin.
- **Data export:** orders, products, and customers (with lifetime metrics) can be exported to CSV for backup or use in accounting tools.
- **Notifications:** automatic email alerts to the owner for new orders and for low-stock events (recommended default — a single owner shouldn't have to babysit a dashboard; confirm this fits before build).
- **Sales dashboard:** basic reporting included at launch — revenue over time, top-selling products, order counts.
- **Shipping & tax rule configuration**
- **Blog post management** (create/edit/publish/unpublish)

---

## 8. Information Architecture (site map, v1)

- Home
- Shop (facets: Type, Origin, Use Case, Pet-Safe)
  - Product Detail Page
- Blog / Education Hub
- About / Our Story
- Wishlist (account-gated)
- Account (Order History + Buy Again, Manage Subscriptions, Saved Details)
- Cart / Checkout
- Contact (WhatsApp + form)
- Legal (Disclaimer, Returns Policy, Privacy Policy, Terms of Service)

---

## 9. Non-Functional Requirements

Performance (fast, mobile-first), SEO (server-rendered product/blog pages), accessibility (contrast, alt text, keyboard nav — see UI doc §8), security (PCI via Paystack, secure auth), localization readiness (currency field not hard-coded to NGN even though NGN is the v1 market).

---

## 10. Out of Scope for v1 (deferred, not cut)

Multi-currency/multi-country checkout beyond Nigeria; loyalty/points program; recommendation quiz engine; native mobile app; multi-language content; staff/multi-admin roles; product reviews; courier tracking-number integration; printable packing slips.

---

## 11. Open Items / Pre-Launch Follow-Ups

1. **Legal review of the disclaimer and returns-policy placeholder text** — explicitly deprioritized by the client for now; revisit closer to actual launch. Flagging again here so it isn't forgotten, given the health-claims exposure this is meant to cover.
2. **Logo color reconciliation (new, higher priority):** the client confirmed the new Sage Garden palette (§4) should fully replace the logo-sampled greens. Since the actual logo is gradient green, it needs either (a) a full recolor to match Olive Grove/Sage Garden/Rusted Terra, or (b) an explicit decision to accept a mismatch between the logo and the site palette. This should be resolved together with the logo vectorization work below, not after it.
3. **Paystack business account setup:** confirm whether Sofa Organics is registered with Nigeria's CAC (and if so, which registration type — Business Name vs. Incorporated Company) before collecting compliance documents, since the required document set differs by type. At minimum expect to need: a government-issued ID matching her BVN and bank account name exactly, her BVN, a personal/business bank account for payouts, and — if registered — the corresponding CAC certificate/number and proof of address. Confirm directly with the business owner rather than assuming a registration status.

**Closed this round:**
- ~~Doodle animation~~ — moot; the doodle system itself was removed in the v2 direction pivot (§4.1).
- ~~Exact logo file~~ — no vector source file exists; **decision: have the logo professionally recreated/vectorized from the flyer artwork** as a pre-launch production task (not something to approximate in code). Now bundled with item 2 above, since recoloring and vectorizing should happen together.
- ~~Domain name~~ — **locked: sofaorganics.com**, pending an availability check.
- ~~Business email~~ — a new Gmail account will be created first; a branded domain email (e.g. via Google Workspace on sofaorganics.com) can be revisited once the domain is secured.
- ~~Analytics/error-monitoring tools~~ — **closed**: Plausible (analytics) and no error monitoring for v1, see TRD §10.
- ~~Use-case taxonomy final approval~~ — **closed**: reviewed and locked category-by-category with the client, see §5.3.
- ~~Confirm email-alert notification default~~ — **closed**: notification toggles are now a Settings-screen feature per the TRD, not a fixed default.
