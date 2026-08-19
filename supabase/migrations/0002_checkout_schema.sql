-- Checkout schema — TRD §2.2-§2.5, scoped to what Cart & Checkout needs.
-- Accounts (login, order history, saved addresses UI), admin, and subscriptions
-- get their own migrations in later phases.
--
-- Design: orders/order_items/addresses/customer_profiles carry NO public RLS
-- policies at all — every read/write a browser needs goes through one of the
-- four security-definer RPC functions below, which re-price every line from
-- product_variants server-side (a client can never submit its own total) and
-- run as the migration-applying role, which owns these tables and therefore
-- bypasses RLS by default (standard Postgres behavior, not a special grant).

create table customer_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

alter table customer_profiles enable row level security;

create policy "Users can view their own profile"
  on customer_profiles for select
  using (auth.uid() = id);

create policy "Users can create their own profile"
  on customer_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on customer_profiles for update
  using (auth.uid() = id);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customer_profiles (id) on delete cascade, -- nullable: guest checkout has no customer
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  country text not null default 'Nigeria',
  postal_code text,
  is_default boolean not null default false
);

alter table addresses enable row level security;
-- No public policies — written only via create_guest_order(); a future
-- "saved addresses" screen (Accounts phase) can add an owner-scoped policy then.

create table shipping_rules (
  id uuid primary key default gen_random_uuid(),
  zone_name text not null unique,
  rate numeric(12, 2) not null check (rate >= 0),
  rate_type text not null default 'flat' check (rate_type in ('flat')),
  min_weight numeric,
  max_weight numeric
);

alter table shipping_rules enable row level security;

create policy "Shipping zones are publicly readable"
  on shipping_rules for select
  using (true);

create table tax_rules (
  id uuid primary key default gen_random_uuid(),
  region text not null,
  rate_percent numeric(5, 2) not null default 0 check (rate_percent >= 0)
);

alter table tax_rules enable row level security;

create policy "Tax rules are publicly readable"
  on tax_rules for select
  using (true);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customer_profiles (id),
  guest_email text,
  guest_name text,
  guest_phone text,
  source text not null default 'online' check (source in ('online', 'manual')),
  payment_method text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(12, 2) not null,
  shipping_total numeric(12, 2) not null default 0,
  tax_total numeric(12, 2) not null default 0,
  grand_total numeric(12, 2) not null,
  currency text not null default 'NGN',
  paystack_reference text,
  shipping_address_id uuid references addresses (id),
  created_by text not null default 'customer' check (created_by in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table orders enable row level security;
-- No public policies — written only via the RPCs below.

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_variant_id uuid not null references product_variants (id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null,
  is_subscription boolean not null default false
);

alter table order_items enable row level security;
-- No public policies — written only via the RPCs below.

-- Seed defaults so checkout works before the admin phase's shipping/tax screens exist.
insert into shipping_rules (zone_name, rate) values
  ('Within Port Harcourt', 1500),
  ('Rest of Rivers State', 2500),
  ('Rest of Nigeria', 4000);

-- 0% placeholder — a real rate is the owner's call once admin (Shipping & Tax) ships;
-- seeding a nonzero figure here would assert a business/legal decision I have no authority to make.
insert into tax_rules (region, rate_percent) values ('Nigeria', 0);

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

create or replace function create_guest_order(
  p_cart_items jsonb, -- [{ "variant_id": uuid, "quantity": int }, ...]
  p_shipping jsonb,   -- { line1, line2, city, state, country, postal_code }
  p_contact jsonb,    -- { name, email, phone }
  p_shipping_zone text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_variant product_variants%rowtype;
  v_quantity integer;
  v_subtotal numeric := 0;
  v_shipping_total numeric;
  v_tax_rate numeric;
  v_tax_total numeric;
  v_grand_total numeric;
  v_address_id uuid;
  v_order_id uuid;
begin
  if p_cart_items is null or jsonb_array_length(p_cart_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  for v_item in select * from jsonb_array_elements(p_cart_items) loop
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Invalid quantity for cart item';
    end if;

    select * into v_variant from product_variants where id = (v_item ->> 'variant_id')::uuid;
    if not found then
      raise exception 'Product variant % not found', v_item ->> 'variant_id';
    end if;
    if v_variant.stock_quantity < v_quantity then
      raise exception 'Insufficient stock for %', v_variant.sku;
    end if;

    v_subtotal := v_subtotal + (v_variant.price * v_quantity);
  end loop;

  select rate into v_shipping_total from shipping_rules where zone_name = p_shipping_zone;
  if v_shipping_total is null then
    raise exception 'Unknown shipping zone: %', p_shipping_zone;
  end if;

  select rate_percent into v_tax_rate from tax_rules order by id limit 1;
  v_tax_rate := coalesce(v_tax_rate, 0);
  v_tax_total := round(v_subtotal * v_tax_rate / 100, 2);
  v_grand_total := v_subtotal + v_shipping_total + v_tax_total;

  insert into addresses (customer_id, label, line1, line2, city, state, country, postal_code, is_default)
  values (
    null,
    'Shipping',
    p_shipping ->> 'line1',
    p_shipping ->> 'line2',
    p_shipping ->> 'city',
    p_shipping ->> 'state',
    coalesce(p_shipping ->> 'country', 'Nigeria'),
    p_shipping ->> 'postal_code',
    false
  )
  returning id into v_address_id;

  insert into orders (
    customer_id, guest_email, guest_name, guest_phone, source, status,
    subtotal, shipping_total, tax_total, grand_total, currency,
    shipping_address_id, created_by
  ) values (
    null, p_contact ->> 'email', p_contact ->> 'name', p_contact ->> 'phone', 'online', 'pending',
    v_subtotal, v_shipping_total, v_tax_total, v_grand_total, 'NGN',
    v_address_id, 'customer'
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_cart_items) loop
    select * into v_variant from product_variants where id = (v_item ->> 'variant_id')::uuid;
    insert into order_items (order_id, product_variant_id, quantity, unit_price)
    values (v_order_id, v_variant.id, (v_item ->> 'quantity')::integer, v_variant.price);
  end loop;

  return v_order_id;
end;
$$;

-- Phase-2 stand-in for the real Paystack webhook — same effect (status -> paid,
-- stock decremented), callable by anyone holding the order's UUID (the UUID is
-- the capability token here, same trade-off as get_order_confirmation below).
-- SECURITY NOTE: once real Paystack lands, revoke the anon/authenticated grants
-- below and have only the signature-verified webhook route reach this path.
create or replace function mark_order_paid(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  v_item record;
  v_updated integer;
begin
  select * into v_order from orders where id = p_order_id;
  if not found then
    raise exception 'Order not found';
  end if;
  if v_order.status <> 'pending' then
    raise exception 'Order is not pending (current status: %)', v_order.status;
  end if;

  for v_item in select * from order_items where order_id = p_order_id loop
    update product_variants
    set stock_quantity = stock_quantity - v_item.quantity
    where id = v_item.product_variant_id and stock_quantity >= v_item.quantity;

    get diagnostics v_updated = row_count;
    if v_updated = 0 then
      raise exception 'Insufficient stock to complete payment for one or more items';
    end if;
  end loop;

  update orders set status = 'paid' where id = p_order_id;
end;
$$;

create or replace function get_order_confirmation(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'id', o.id,
    'status', o.status,
    'guest_name', o.guest_name,
    'guest_email', o.guest_email,
    'guest_phone', o.guest_phone,
    'subtotal', o.subtotal,
    'shipping_total', o.shipping_total,
    'tax_total', o.tax_total,
    'grand_total', o.grand_total,
    'currency', o.currency,
    'created_at', o.created_at,
    'customer_id', o.customer_id,
    'shipping_address', (
      select jsonb_build_object(
        'line1', a.line1, 'line2', a.line2, 'city', a.city,
        'state', a.state, 'country', a.country, 'postal_code', a.postal_code
      )
      from addresses a where a.id = o.shipping_address_id
    ),
    'items', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'product_name', p.name,
        'product_slug', p.slug,
        'size_label', pv.size_label,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price
      )), '[]'::jsonb)
      from order_items oi
      join product_variants pv on pv.id = oi.product_variant_id
      join products p on p.id = pv.product_id
      where oi.order_id = o.id
    )
  )
  into v_result
  from orders o
  where o.id = p_order_id;

  if v_result is null then
    raise exception 'Order not found';
  end if;

  return v_result;
end;
$$;

create or replace function claim_order_as_customer(p_order_id uuid, p_customer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or auth.uid() <> p_customer_id then
    raise exception 'Not authorized to claim this order';
  end if;

  update orders
  set customer_id = p_customer_id
  where id = p_order_id and customer_id is null;
end;
$$;

grant execute on function create_guest_order(jsonb, jsonb, jsonb, text) to anon, authenticated;
grant execute on function mark_order_paid(uuid) to anon, authenticated;
grant execute on function get_order_confirmation(uuid) to anon, authenticated;
grant execute on function claim_order_as_customer(uuid, uuid) to authenticated;
