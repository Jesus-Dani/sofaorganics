-- Admin ops schema — TRD §6.1, §6.3, §6.4, §6.6, §6.7, §6.8. Opens admin access to
-- the checkout tables from 0002 (built only for guest checkout's RPCs, so they carry
-- almost no RLS today), adds manual-order + customer-aggregation RPCs, and adds
-- site_content / store_settings for the Site Content and Settings admin screens.
--
-- Design: same split as 0003 — plain is_admin()-gated RLS for straightforward
-- reads/writes (the admin has a real session), SECURITY DEFINER RPCs only where
-- that's not enough: create_manual_order() needs an atomic multi-table write (same
-- shape as create_guest_order), and admin_list_customers() needs to join auth.users
-- for email, which PostgREST never exposes via RLS-visible tables/views.

-- ---------------------------------------------------------------------------
-- Admin read/write access on checkout tables (0002 only had guest-RPC access)
-- ---------------------------------------------------------------------------

create policy "Admins can read all orders" on orders for select using (is_admin(auth.uid()));
create policy "Admins can update orders" on orders for update using (is_admin(auth.uid()));

create policy "Admins can read all order items" on order_items for select using (is_admin(auth.uid()));

create policy "Admins can read all addresses" on addresses for select using (is_admin(auth.uid()));

create policy "Admins can read all customer profiles" on customer_profiles for select using (is_admin(auth.uid()));

create policy "Admins can insert shipping rules" on shipping_rules for insert with check (is_admin(auth.uid()));
create policy "Admins can update shipping rules" on shipping_rules for update using (is_admin(auth.uid()));
create policy "Admins can delete shipping rules" on shipping_rules for delete using (is_admin(auth.uid()));

create policy "Admins can insert tax rules" on tax_rules for insert with check (is_admin(auth.uid()));
create policy "Admins can update tax rules" on tax_rules for update using (is_admin(auth.uid()));
create policy "Admins can delete tax rules" on tax_rules for delete using (is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- Manual orders — TRD §2.3 / §6.3 "New Manual Order"
-- ---------------------------------------------------------------------------

-- Manual orders record a sale that's already happened (cash/bank transfer taken over
-- the phone before the admin types it in) — there's no separate payment-confirmation
-- event to wait for like Paystack's webhook, so this inserts straight to status =
-- 'paid' and decrements stock inline, rather than modeling a fake 'pending' step.
create or replace function create_manual_order(
  p_line_items jsonb, -- [{ "variant_id": uuid, "quantity": int, "unit_price": numeric }, ...]
  p_customer jsonb,   -- { "name": text, "phone": text }
  p_payment_method text,
  p_shipping jsonb default null -- { line1, line2, city, state, country, postal_code } or null
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
  v_unit_price numeric;
  v_subtotal numeric := 0;
  v_address_id uuid;
  v_order_id uuid;
  v_updated integer;
begin
  if not is_admin(auth.uid()) then
    raise exception 'Not authorized';
  end if;

  if p_line_items is null or jsonb_array_length(p_line_items) = 0 then
    raise exception 'Order must have at least one item';
  end if;

  for v_item in select * from jsonb_array_elements(p_line_items) loop
    v_quantity := (v_item ->> 'quantity')::integer;
    v_unit_price := (v_item ->> 'unit_price')::numeric;
    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Invalid quantity for order item';
    end if;
    if v_unit_price is null or v_unit_price < 0 then
      raise exception 'Invalid price for order item';
    end if;

    select * into v_variant from product_variants where id = (v_item ->> 'variant_id')::uuid;
    if not found then
      raise exception 'Product variant % not found', v_item ->> 'variant_id';
    end if;

    v_subtotal := v_subtotal + (v_unit_price * v_quantity);
  end loop;

  if p_shipping is not null then
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
  end if;

  insert into orders (
    customer_id, guest_email, guest_name, guest_phone, source, payment_method, status,
    subtotal, shipping_total, tax_total, grand_total, currency,
    shipping_address_id, created_by
  ) values (
    null, null, p_customer ->> 'name', p_customer ->> 'phone', 'manual', p_payment_method, 'paid',
    v_subtotal, 0, 0, v_subtotal, 'NGN',
    v_address_id, 'admin'
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_line_items) loop
    v_quantity := (v_item ->> 'quantity')::integer;
    v_unit_price := (v_item ->> 'unit_price')::numeric;

    insert into order_items (order_id, product_variant_id, quantity, unit_price)
    values (v_order_id, (v_item ->> 'variant_id')::uuid, v_quantity, v_unit_price);

    update product_variants
    set stock_quantity = stock_quantity - v_quantity
    where id = (v_item ->> 'variant_id')::uuid and stock_quantity >= v_quantity;

    get diagnostics v_updated = row_count;
    if v_updated = 0 then
      raise exception 'Insufficient stock for variant %', v_item ->> 'variant_id';
    end if;
  end loop;

  return v_order_id;
end;
$$;

grant execute on function create_manual_order(jsonb, jsonb, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Customer aggregation — TRD §6.4 (derived view over orders, no new table)
-- ---------------------------------------------------------------------------

-- Needs auth.users.email, which PostgREST never exposes via RLS-visible
-- tables/views — a SECURITY DEFINER function is the only way to join it in.
-- Call with no args for the admin Customers list; pass p_customer_id or
-- p_guest_key (a guest's email for online checkout, or phone for a manual
-- order — manual orders never collect an email, only name/phone) to filter
-- to one customer for the Detail page.
create or replace function admin_list_customers(p_customer_id uuid default null, p_guest_key text default null)
returns table (
  customer_key text,
  customer_id uuid,
  is_guest boolean,
  full_name text,
  email text,
  phone text,
  order_count bigint,
  total_spent numeric,
  avg_order_value numeric,
  first_order_at timestamptz,
  last_order_at timestamptz
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if not is_admin(auth.uid()) then
    raise exception 'Not authorized';
  end if;

  return query
  select
    coalesce(o.customer_id::text, lower(o.guest_email), o.guest_phone) as customer_key,
    o.customer_id,
    (o.customer_id is null) as is_guest,
    coalesce(cp.full_name, max(o.guest_name)) as full_name,
    coalesce(u.email, max(o.guest_email)) as email,
    coalesce(cp.phone, max(o.guest_phone)) as phone,
    count(*) as order_count,
    sum(o.grand_total) as total_spent,
    avg(o.grand_total) as avg_order_value,
    min(o.created_at) as first_order_at,
    max(o.created_at) as last_order_at
  from orders o
  left join customer_profiles cp on cp.id = o.customer_id
  left join auth.users u on u.id = o.customer_id
  where
    (p_customer_id is null and p_guest_key is null)
    or (p_customer_id is not null and o.customer_id = p_customer_id)
    or (
      p_guest_key is not null and o.customer_id is null
      and (lower(o.guest_email) = lower(p_guest_key) or o.guest_phone = p_guest_key)
    )
  group by coalesce(o.customer_id::text, lower(o.guest_email), o.guest_phone), o.customer_id, cp.full_name, cp.phone, u.email;
end;
$$;

grant execute on function admin_list_customers(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- site_content — TRD §2.6 / §6.7, CMS-editable legal/policy pages
-- ---------------------------------------------------------------------------

create table site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  body_richtext text not null default '',
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "Site content is publicly readable" on site_content for select using (true);
create policy "Admins can insert site content" on site_content for insert with check (is_admin(auth.uid()));
create policy "Admins can update site content" on site_content for update using (is_admin(auth.uid()));

insert into site_content (key, body_richtext) values
  ('disclaimer', '<p>The products sold on this site are traditional herbs, spices, and oils. They are not intended to diagnose, treat, cure, or prevent any disease, and no statement on this site has been evaluated by a regulatory body such as NAFDAC.</p><p>Product descriptions reflect traditional and wellness-support use only. If you are pregnant, nursing, taking medication, or managing a medical condition, speak with a qualified healthcare provider before using any herbal product.</p><p>Pet-safe notes on individual product pages are general guidance, not veterinary advice. Check with your vet before introducing any new product to your pet''s routine.</p>'),
  ('returns_policy', '<p>Because these are consumable herbal products, we can only accept returns on unopened, unused items in their original packaging, requested within 7 days of delivery.</p><p>If an item arrives damaged, incorrect, or defective, contact us within 48 hours of delivery with a photo and we''ll arrange a replacement or refund at no cost to you.</p><p>To start a return, message us on WhatsApp or use the contact form with your order details.</p>'),
  ('privacy_policy', '<p>We collect the information needed to fulfil an order (name, contact details, and shipping address), and, if you create an account, your order history and saved details.</p><p>Payment is processed by Paystack; we never see or store your full card details. We use your email or phone number only to send order updates, unless you''ve opted into other communication.</p><p>We don''t sell your personal information to third parties. You can ask us to update or delete your data at any time by contacting us.</p>'),
  ('terms', '<p>By placing an order with Sofa Organics, you agree to provide accurate shipping and contact information, and to pay the listed price in effect at checkout, including any applicable shipping and tax.</p><p>Prices, stock levels, and product availability are subject to change without notice. Orders are confirmed once payment is received; we''ll contact you directly if an item you ordered goes out of stock before we can fulfil it.</p><p>Use of this site is also governed by our Disclaimer and Privacy Policy, linked in the footer.</p>');

-- ---------------------------------------------------------------------------
-- store_settings — TRD §2.8 / §6.8, single-row settings table
-- ---------------------------------------------------------------------------

create table store_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default '',
  whatsapp_number text,
  contact_email text,
  social_links jsonb not null default '{}'::jsonb,
  notify_on_new_order boolean not null default true,
  notify_on_low_stock boolean not null default true
);

alter table store_settings enable row level security;

create policy "Store settings are publicly readable" on store_settings for select using (true);
create policy "Admins can update store settings" on store_settings for update using (is_admin(auth.uid()));

insert into store_settings (business_name, whatsapp_number, contact_email, social_links) values
  ('Sofa Organics', '2348032343038', 'hello@sofaorganics.com', '{}'::jsonb);
