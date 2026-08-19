-- Admin auth + Blog schema — TRD §1.1 (admin role), §2.7 (blog_posts), §8 (server-side
-- admin checks). Scoped to what the admin panel needs this phase: products + blog.
--
-- Design: a plain admin_users table + is_admin() helper, checked directly in RLS
-- policies — the admin has a real authenticated session (unlike guest checkout in
-- 0002), so role-gated RLS is the right tool here, not security-definer RPCs for
-- every mutation. is_admin() itself must be security definer so it can read
-- admin_users regardless of the caller's own RLS visibility into that table.

create table admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;
-- No policies — nobody selects this table directly; only through the
-- security-definer functions below.

create or replace function is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admin_users where id = uid);
$$;

grant execute on function is_admin(uuid) to anon, authenticated;

create or replace function admin_bootstrap_available()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select not exists (select 1 from admin_users);
$$;

grant execute on function admin_bootstrap_available() to anon, authenticated;

-- Self-closing: only works while admin_users is empty, so this can only ever
-- create the first (and only, per PRD §7 "single admin account") admin.
create or replace function claim_admin_bootstrap()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Must be signed in to claim admin access';
  end if;
  if exists (select 1 from admin_users) then
    raise exception 'An admin account already exists';
  end if;
  insert into admin_users (id) values (auth.uid());
end;
$$;

grant execute on function claim_admin_bootstrap() to authenticated;

-- ---------------------------------------------------------------------------
-- Admin write access on catalog tables (0001 only had public read policies)
-- ---------------------------------------------------------------------------

create policy "Admins can read all products" on products for select using (is_admin(auth.uid()));
create policy "Admins can insert products" on products for insert with check (is_admin(auth.uid()));
create policy "Admins can update products" on products for update using (is_admin(auth.uid()));
create policy "Admins can delete products" on products for delete using (is_admin(auth.uid()));

create policy "Admins can read all product variants" on product_variants for select using (is_admin(auth.uid()));
create policy "Admins can insert product variants" on product_variants for insert with check (is_admin(auth.uid()));
create policy "Admins can update product variants" on product_variants for update using (is_admin(auth.uid()));
-- No delete policy for variants — see plan's known simplification (a variant that's
-- ever been ordered can't be deleted anyway without violating the order_items FK).

create policy "Admins can read all product images" on product_images for select using (is_admin(auth.uid()));
create policy "Admins can insert product images" on product_images for insert with check (is_admin(auth.uid()));
create policy "Admins can update product images" on product_images for update using (is_admin(auth.uid()));
create policy "Admins can delete product images" on product_images for delete using (is_admin(auth.uid()));

create policy "Admins can insert facets" on facets for insert with check (is_admin(auth.uid()));

create policy "Admins can insert product facets" on product_facets for insert with check (is_admin(auth.uid()));
create policy "Admins can delete product facets" on product_facets for delete using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- blog_posts — TRD §2.7
-- ---------------------------------------------------------------------------

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body_richtext text not null default '',
  cover_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  related_product_ids uuid[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_idx on blog_posts (status);

alter table blog_posts enable row level security;

create policy "Published posts are publicly readable" on blog_posts for select using (status = 'published');
create policy "Admins can read all posts" on blog_posts for select using (is_admin(auth.uid()));
create policy "Admins can insert posts" on blog_posts for insert with check (is_admin(auth.uid()));
create policy "Admins can update posts" on blog_posts for update using (is_admin(auth.uid()));
create policy "Admins can delete posts" on blog_posts for delete using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Storage — product photos + blog cover images, public read, admin write
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true);

create policy "Public can read product images"
  on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins can upload product images"
  on storage.objects for insert with check (bucket_id = 'product-images' and is_admin(auth.uid()));
create policy "Admins can update product images"
  on storage.objects for update using (bucket_id = 'product-images' and is_admin(auth.uid()));
create policy "Admins can delete product images"
  on storage.objects for delete using (bucket_id = 'product-images' and is_admin(auth.uid()));

create policy "Public can read blog images"
  on storage.objects for select using (bucket_id = 'blog-images');
create policy "Admins can upload blog images"
  on storage.objects for insert with check (bucket_id = 'blog-images' and is_admin(auth.uid()));
create policy "Admins can update blog images"
  on storage.objects for update using (bucket_id = 'blog-images' and is_admin(auth.uid()));
create policy "Admins can delete blog images"
  on storage.objects for delete using (bucket_id = 'blog-images' and is_admin(auth.uid()));
