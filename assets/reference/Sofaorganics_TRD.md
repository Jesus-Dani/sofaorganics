# Technical Requirements Document (TRD)
## Sofaorganics E-Commerce Website

**Date:** August 17, 2026
**Status:** v1.5 — full technology stack completed, explicitly client-confirmed item-by-item, zero open technical decisions
**Companion docs:** Sofaorganics_PRD.md, Sofaorganics_UI_Design.md

**Changes since v1.1:** completed every remaining stack layer (data access, styling/components, forms, testing, CI/CD, background jobs, SEO) with concrete choices instead of open questions; added manual (phone/WhatsApp) order entry, CSV export, and admin security to the admin spec; confirmed discount codes are out of scope for v1.

**Changes since v1.2:** every stack item in §1.1 was walked through individually with the client and explicitly confirmed (styling, component base, icons, fonts, forms/validation, client data fetching, data access layer, migrations approach, scheduled jobs, testing, CI/CD, SEO setup) — none of these are the author's unilateral call anymore.

**Changes since v1.3:** analytics locked to Plausible; error monitoring explicitly declined for v1 (client-confirmed, with the trade-off documented in §10) — no technical decisions remain open in this document.

**Changes since v1.4:** the UI Design Document's v2 direction pivot (new color palette, serif typography, removed doodle system) removes the doodle-SVG asset work referenced in §1.1 and §9 — no other technical decisions are affected, since this was a visual/content change, not an architecture change.

---

## 1. Architecture Overview

Fully custom-coded application (no SaaS commerce platform). Single-language stack (TypeScript) across frontend and backend logic, backed by Supabase as the primary backend-as-a-service layer.

```
┌──────────────────────────────────────────┐
│   Next.js 14+ (App Router), TypeScript     │  ← Storefront + Admin (same codebase, route-gated)
│   Tailwind CSS + Radix UI primitives       │
│   TanStack Query (client data) + RHF/Zod   │
└─────────────────┬───────────────────────────┘
                  │ Server Components / Route Handlers / Edge Functions
                  ▼
┌──────────────────────────┐      ┌──────────────────────┐
│       Supabase            │◄────►│   Paystack API         │
│  - Postgres (data)        │      │  (checkout, webhooks,  │
│  - Auth (customers+admin) │      │   subscriptions)       │
│  - Storage (images)       │      └──────────────────────┘
│  - Row Level Security     │
│  - pg_cron (scheduled)    │      ┌──────────────────────┐
└─────────────┬──────────────┘◄────►│  Resend (email)        │
              │                     └──────────────────────┘
              ▼
┌──────────────────────────┐      ┌──────────────────────┐
│   Vercel (hosting/CDN)    │      │  Plausible (analytics) │
└──────────────────────────┘      │  no error monitoring   │
                                    │  in v1                 │
                                    └──────────────────────┘
```

### 1.1 Complete technology stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+, App Router, TypeScript (strict mode) | SSR/SEO for product & blog pages |
| Styling | **Tailwind CSS**, configured with design tokens (colors, 8px spacing scale, near-zero border-radius) taken directly from the UI Design Document | Utility-first maps cleanly to the locked sharp-corner/balanced-density design language; no separate CSS-in-JS layer needed |
| Component primitives | **Radix UI** (unstyled, accessible primitives: dropdown, dialog, popover, accordion) styled with Tailwind | Gives accessible behavior for the size dropdown, mega-menu, filter sheet, modals "for free" while keeping the fully custom sharp/monochrome-green visual language — avoids both building interaction logic from scratch and importing a generic-looking prebuilt UI kit |
| Icons | Phosphor Icons (React package) | Matches the UI doc's "simple single-weight line icon" direction |
| Fonts | Self-hosted via `next/font` (e.g. Nunito or Karla, humanist sans per UI doc §3) | Better performance/privacy than a runtime Google Fonts CDN call |
| Forms & validation | **React Hook Form + Zod** | One schema per form (checkout, product entry, manual order, account) shared between client-side validation and server-side re-validation in the corresponding Route Handler — single source of truth, prevents "looked valid on the client, rejected oddly on the server" bugs |
| Client data/state | **TanStack Query** for interactive client-side data (cart, wishlist toggles, admin tables with pagination/search/filter); Next.js Server Components for initial SEO-critical page loads (product/category/blog pages) | Hybrid: no heavy global state library (e.g. Redux) needed — server state lives in Postgres/Query cache, local UI state (menu open, modal open) is plain React state |
| Database | Supabase Postgres | Relational integrity for orders/inventory/variants |
| Data access layer | **Supabase JS client (`@supabase/supabase-js`) with auto-generated TypeScript types** (`supabase gen types typescript`) directly from the Postgres schema | No separate ORM (Prisma/Drizzle) — the Postgres schema is the single source of truth; generated types keep the frontend in sync with it automatically on every schema change |
| Migrations | Supabase CLI migration files, version-controlled in `supabase/migrations/`, applied via CI | Schema changes are reviewable in pull requests, not made ad hoc in the Supabase dashboard against production |
| Background/scheduled jobs | **Postgres `pg_cron`** (built into Supabase) triggering Edge Functions | Drives subscription renewal checks and the low-stock notification sweep — no separate job-queue service required |
| Auth | Supabase Auth — customer accounts + **one admin account with a `role = 'admin'` claim**, standard email + password (client-confirmed: no 2FA for v1) | Admin routes/mutations check `role === 'admin'` **server-side** (middleware + Route Handler checks), never client-side-only. Supabase's built-in password-reset flow (routed through Resend SMTP) covers admin account recovery. |
| File storage | Supabase Storage | Product photos, blog images (no doodle SVG assets — that system was removed in the UI doc's v2 direction pivot; see UI doc §5.2) |
| Hosting | Vercel | Native Next.js support, preview deployments per PR |
| Payments | Paystack | NGN primary market; see §4 |
| Search | Postgres full-text search (`tsvector`/GIN index) | Revisit a dedicated search service only if catalog size/relevance outgrows this |
| Transactional/notification email | **Resend** | Order confirmations, owner new-order/low-stock alerts, password resets |
| Analytics | **Plausible (client-confirmed)** | Privacy-conscious visitor analytics, ties to PRD §2.2 success metrics |
| Error monitoring | **None for v1 (client-confirmed)** | Owner opted out of automated error alerts for launch — see §10 for the accepted trade-off |
| Testing | **Vitest + React Testing Library** (unit/component); **Playwright** (end-to-end) | E2E covers: browse→filter→cart→checkout, wishlist, manual admin order creation, CSV bulk import |
| CI/CD | **GitHub Actions** (lint, type-check, unit tests on every PR; Playwright on PRs into `main`) + **Vercel** (preview per PR, production on merge to `main`) | |
| SEO | Next.js Metadata API for per-page titles/descriptions/OG images; sitemap route generated from products+posts; JSON-LD `Product`, `Article`, and `Organization` structured data | Supports the "reach new customers" goal |

This table is the definitive stack reference — no remaining "TBD" items except the two explicitly flagged (analytics tool, error-monitoring tool), which are recommended defaults pending a quick client sign-off rather than open engineering questions.

---

## 2. Data Model

### 2.1 Catalog
```sql
products (
  id uuid pk, name text, slug text unique,
  description text,          -- wellness-framed copy per PRD §4.2, not disease-cure claims
  status text,                -- draft | published | archived
  is_pet_safe boolean default false,
  created_at timestamptz, updated_at timestamptz
)

product_variants (
  id uuid pk, product_id uuid fk -> products.id,
  size_label text,             -- standard (100g..25kg) or custom one-off
  price numeric, currency text default 'NGN',
  stock_quantity integer, low_stock_threshold integer default 10,
  subscription_eligible boolean default false,
  sku text unique
)
-- stock_status (in_stock | low_stock | out_of_stock) derived at query time, not stored.

product_images ( id uuid pk, product_id uuid fk, storage_path text, alt_text text, sort_order integer )
facets ( id uuid pk, facet_type text, label text, slug text unique )  -- 'type' | 'origin' | 'use_case'
product_facets ( product_id uuid fk, facet_id uuid fk, primary key (product_id, facet_id) )
```
`is_pet_safe` is a boolean flag, not a facet row — matches the locked "own filter, not own category" decision.

### 2.2 Customers, Accounts, Wishlist
```sql
customer_profiles ( id uuid pk references auth.users(id), full_name text, phone text, created_at timestamptz )
addresses ( id uuid pk, customer_id uuid fk, label text, line1 text, line2 text, city text, state text, country text, postal_code text, is_default boolean )
wishlist_items ( id uuid pk, customer_id uuid fk, product_variant_id uuid fk, created_at timestamptz )
```

### 2.3 Orders, Order Items, Manual Orders & Reorder
```sql
orders (
  id uuid pk,
  customer_id uuid fk nullable,       -- nullable for guest checkout AND manual orders without an account
  guest_email text nullable,
  guest_name text nullable,           -- populated for manual/phone orders
  guest_phone text nullable,          -- populated for manual/phone orders
  source text default 'online',       -- 'online' | 'manual'  ← new, supports admin-created phone/WhatsApp orders
  payment_method text nullable,       -- e.g. 'paystack' | 'cash' | 'bank_transfer' — set on manual orders
  status text,                         -- pending | paid | shipped | delivered | cancelled | refunded
  subtotal numeric, shipping_total numeric, tax_total numeric, grand_total numeric,
  currency text default 'NGN',
  paystack_reference text nullable,    -- null for manual orders
  shipping_address_id uuid fk nullable,
  created_by text default 'customer',  -- 'customer' | 'admin' — audit trail for manual entry
  created_at timestamptz
)

order_items (
  id uuid pk, order_id uuid fk, product_variant_id uuid fk,
  quantity integer, unit_price numeric, is_subscription boolean default false
)
```
**Manual order creation (admin):** owner searches/selects product variants (pre-filled price is editable, to allow phone-order negotiated pricing), enters customer name/phone (no account required), selects a payment method note (cash/bank transfer/other — Paystack optional if the owner sends a payment link instead), and submits. Stock decrements identically to an online order, so inventory stays accurate regardless of sales channel — directly closes the gap between the website and the existing phone/WhatsApp ordering habit.

**"Buy Again"** re-adds a past order's `order_items` to the current cart, re-validating current stock/price. No separate table needed. Only available on `source = 'online'` orders tied to a customer account.

**Order status** stays a simple enum, updated manually by the owner — no courier-tracking field in v1 (unchanged from v1.1).

### 2.4 Subscriptions (optional, opt-in)
```sql
subscriptions ( id uuid pk, customer_id uuid fk, product_variant_id uuid fk, frequency_days integer, status text, next_order_date date, paystack_subscription_code text, created_at timestamptz )
```

### 2.5 Shipping & Tax Rules
```sql
shipping_rules ( id uuid pk, zone_name text, rate numeric, rate_type text, min_weight numeric nullable, max_weight numeric nullable )
tax_rules ( id uuid pk, region text, rate_percent numeric )
```

### 2.6 CMS-Editable Legal/Policy Content
```sql
site_content ( id uuid pk, key text unique, body_richtext text, updated_at timestamptz )
-- keys: 'disclaimer', 'returns_policy', 'privacy_policy', 'terms'
```
Editable from admin without a code deploy — both the disclaimer and returns policy are placeholder-pending-legal-review (PRD §6.7) and will need updating post-launch.

### 2.7 Blog / Education Hub
```sql
blog_posts ( id uuid pk, title text, slug text unique, body_richtext text, cover_image_path text, status text, related_product_ids uuid[], published_at timestamptz )
```

### 2.8 Store Settings
```sql
store_settings (
  id uuid pk,
  business_name text, whatsapp_number text, contact_email text, social_links jsonb,
  notify_on_new_order boolean default true,
  notify_on_low_stock boolean default true
)
-- Single row table backing the Admin > Settings screen (§6.8).
```

**Explicitly out of scope (confirmed):** discount/promo codes — no `discounts` table in v1; revisit if the client wants promotions later.

---

## 3. Search & Filtering

Generated `tsvector` column on `products` (name + description), GIN-indexed. Facet filtering via joins against `product_facets` (AND across facet types, OR within a type); `is_pet_safe = true` as an additional `WHERE` filter.

---

## 4. Payments: Paystack Integration

1. Server-side Route Handler creates a pending `order` (`source = 'online'`), calls Paystack's Initialize Transaction API.
2. Paystack webhook (`charge.success`) — **signature-verified** — marks `order.status = paid`, decrements `stock_quantity`, triggers order-confirmation email via Resend.
3. Subscriptions use Paystack's Subscriptions/Plans API; a webhook on recurring charge success creates a new `order` + `order_items` automatically.
4. **Manual orders bypass Paystack entirely** — the admin marks payment received directly (§2.3); no webhook involved.
5. Currency: NGN at launch; schema stores `currency` per row for future-proofing.
6. PCI scope: card data never touches Sofaorganics servers.

---

## 5. Inventory & Stock Status Logic

`stock_status` derived from `stock_quantity` vs `low_stock_threshold` at query time. Stock decrements transactionally on confirmed payment (online) or admin submission (manual), with a short soft-hold during active online checkout. Out-of-stock variants remain visible but not purchasable.

---

## 6. Admin Panel — Full Specification

Single `/admin` route segment in the same Next.js app, gated to the one owner account via `role = 'admin'` (server-side middleware + RLS, never client-side-only gating). Standard email + password login (no 2FA in v1, per client decision), with Supabase's built-in password-reset flow available.

### 6.1 Dashboard (home screen)
Sales overview: revenue over a selectable date range, top-selling products, recent orders list, active low-stock alerts. Pulls from the same aggregation queries as §6.7.

### 6.2 Products
- **List:** search, filter by status (draft/published/archived) and facet, pagination, bulk actions (publish/unpublish/archive/delete selected)
- **Detail/Edit:** one page, sections for General Info, Photos (drag-and-drop upload + reorder), Sizes & Pricing (standard-size checklist + custom-size rows), Tags (existing-tag picker + add-new-on-the-fly, per facet type), Pet-Safe toggle, Publish/Draft/Archive status
- **Bulk CSV import:** upload → column-mapping/preview screen with **row-level** error reporting (not all-or-nothing) → commit. Duplicate detection by SKU.
- **CSV export:** full product list, including variants, for backup/offline use

### 6.3 Orders
- **List:** search, filter by status and source (online/manual), pagination
- **Detail:** items, customer info, shipping address, status-update control, payment method, source badge (Online/Manual), audit note of who created it
- **New Manual Order:** product/variant search-and-add, editable price per line, customer name/phone entry, payment-method note, submit — see §2.3
- **CSV export:** orders for accounting/backup

### 6.4 Customers
- **List:** search by name/phone/email; filter by type (registered account vs. guest/manual-order customer); sortable by lifetime spend, order count, or last-order date; pagination. Each row surfaces name, contact info, order count, and lifetime spend at a glance.
- **Detail (Customer Profile):** contact info + saved addresses; lifetime metrics — total orders, total spent, average order value, first order date, last order date; and that customer's **full order history**, shown with the same list/detail pattern as the main Orders screen (§6.3) — filterable by status, and clicking through opens the same order-detail view used elsewhere in admin, rather than a separate one-off layout.
- Covers **both** registered accounts and guest/manual-order customers (matched by phone/email when no account exists), so phone/WhatsApp customers show up here too, not just website signups.
- This is a derived/aggregated view (`SUM`/`COUNT` over `orders`/`order_items` grouped by customer, or by guest phone/email when there's no account) — no new table beyond what's already modeled in §2.3.
- **CSV export** of the customer list includes the lifetime-metric columns (total orders, total spent, last order date), not just contact info.

### 6.5 Blog
Create/edit/publish/unpublish, rich text editor, cover image upload, related-product linking.

### 6.6 Shipping & Tax
Zone/rate and region/tax-rate CRUD screens (§2.5).

### 6.7 Site Content (Legal/Policies)
Rich text editor for `site_content` rows — disclaimer, returns policy, privacy policy, terms — editable without a code deploy, since these start as placeholders pending legal review.

### 6.8 Settings
Business info (name, WhatsApp number, contact email, social links), notification toggles (new order / low stock — backing `store_settings`, §2.8), and admin password change.

### 6.9 Notifications
Resend-powered email to the owner on new order (online or manual) and on any variant crossing into low stock, implemented via a Postgres trigger/Edge Function reacting to table writes (not polling). Toggleable from Settings (§6.8) — this replaces the earlier "recommended default, please confirm" note now that notification behavior lives in `store_settings` and can simply be turned off if unwanted.

### 6.10 Reporting
Direct Postgres aggregation views (not a third-party analytics dependency) power the dashboard's revenue/top-products/order-count figures — distinct from the optional site-visitor analytics tool in §1.1.

**Deliberately excluded from v1:** multi-staff roles/permissions, discount/promo codes, printable packing slips, courier-tracking integration, product reviews.

---

## 7. Hosting, Environments & Deployment

Vercel connected to GitHub, preview deployments per PR, production on merge to `main`. Separate Supabase projects for dev/staging vs. production, with migrations applied to each via CI (§1.1). Secrets (Paystack keys, Supabase service role key, Resend API key) stored only in Vercel environment variables.

---

## 8. Security

RLS on all customer-facing tables. Admin write access restricted to the single `role = 'admin'` account, enforced server-side. Webhook signature verification mandatory for Paystack callbacks. Standard Supabase Auth password policy + login rate-limiting (applies to both customer and admin logins). Input validation client- and server-side via shared Zod schemas (§1.1). Legal content served from `site_content` for no-deploy updates.

---

## 9. Performance

Server-rendered/ISR product and blog pages. Images via Supabase Storage + Next.js Image component. The doodle-background SVG system referenced in earlier versions of this document is no longer part of the build — the UI doc's v2 direction pivot replaced it with flat solid-color section backgrounds, which carry no meaningful performance cost.

---

## 10. Monitoring & Observability

**Analytics:** Plausible, client-confirmed — tracks page views, conversion funnel, and filter usage per PRD §2.2.

**Error monitoring: none for v1**, client-confirmed. Accepted trade-off: if something breaks in production (e.g. checkout failing for a subset of users), the owner will only find out via a customer complaint or manual spot-checking, not an automated alert. This is a reasonable choice for a lean v1 launch — flagging it here so it's a documented, informed decision rather than a gap discovered later. Revisit if order volume grows or issues start surfacing this way.

---

## 11. Remaining Open Items

All purely technical decisions are now closed. What's left is non-technical:

1. **Exact source logo file** — hex values in the UI doc are sampled from a compressed flyer photo pending the client's vector/high-res file.

Everything else previously listed as open (email provider, admin auth mechanism, notification behavior, ORM/data-layer choice, styling/testing/CI approach, manual order entry, CSV export, discount codes, use-case taxonomy) is now locked — the use-case taxonomy was reviewed and finalized category-by-category with the client (final 13-category list in PRD §5.3).

---

## 12. Traceability

All technical decisions here map to the locked decisions in the PRD's decision log. Visual/component specification lives in the companion **UI Design Document**.
