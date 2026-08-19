-- Catalog schema — TRD §2.1. Scoped to storefront-foundation phase; orders,
-- customers, admin, subscriptions, etc. arrive as their own migrations in
-- later phases.

create extension if not exists pg_trgm;

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null, -- wellness-framed copy per PRD §4.2, never disease-cure claims
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_pet_safe boolean not null default false,
  pet_safe_note text, -- shown in the PDP's collapsible pet-safe section when is_pet_safe is true
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_search_vector_idx on products using gin (search_vector);
create index products_status_idx on products (status);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  size_label text not null,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'NGN',
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 10 check (low_stock_threshold >= 0),
  subscription_eligible boolean not null default false,
  sku text not null unique
);

create index product_variants_product_id_idx on product_variants (product_id);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  storage_path text not null,
  alt_text text not null,
  sort_order integer not null default 0
);

create index product_images_product_id_idx on product_images (product_id);

create table facets (
  id uuid primary key default gen_random_uuid(),
  facet_type text not null check (facet_type in ('type', 'origin', 'use_case')),
  label text not null,
  slug text not null unique
);

create table product_facets (
  product_id uuid not null references products (id) on delete cascade,
  facet_id uuid not null references facets (id) on delete cascade,
  primary key (product_id, facet_id)
);

create index product_facets_facet_id_idx on product_facets (facet_id);

-- RLS: public (anon) read access to published products only. Admin write
-- policies arrive with the admin-panel migration in a later phase.

alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table facets enable row level security;
alter table product_facets enable row level security;

create policy "Published products are publicly readable"
  on products for select
  using (status = 'published');

create policy "Variants of published products are publicly readable"
  on product_variants for select
  using (exists (
    select 1 from products
    where products.id = product_variants.product_id and products.status = 'published'
  ));

create policy "Images of published products are publicly readable"
  on product_images for select
  using (exists (
    select 1 from products
    where products.id = product_images.product_id and products.status = 'published'
  ));

create policy "Facets are publicly readable"
  on facets for select
  using (true);

create policy "Product-facet links of published products are publicly readable"
  on product_facets for select
  using (exists (
    select 1 from products
    where products.id = product_facets.product_id and products.status = 'published'
  ));
