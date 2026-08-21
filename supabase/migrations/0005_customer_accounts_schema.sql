-- Customer accounts schema — PRD §6.3 (login/signup, order history + Buy Again,
-- wishlist, saved addresses) and the plumbing real Paystack needs (TRD §4).
--
-- Fixes a latent bug first: orders.customer_id and addresses.customer_id both
-- reference customer_profiles(id), not auth.users(id) directly, but nothing
-- anywhere has ever created a customer_profiles row on signup. The already-shipped
-- claim_order_as_customer() sets orders.customer_id = auth.uid() with no profile
-- row to satisfy that foreign key — this trigger is the fix, and a prerequisite
-- for everything else below that writes customer_id.

create or replace function handle_new_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into customer_profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_customer();

-- ---------------------------------------------------------------------------
-- Customer self-access RLS — orders/order_items/addresses had none at all
-- (only guest RPCs + the admin policies from 0004). These two (orders,
-- order_items) must ship together: order_items' policy subquery reads orders
-- under the querying role's own RLS visibility, so it only resolves once the
-- orders self-SELECT policy exists too.
-- ---------------------------------------------------------------------------

drop policy if exists "Customers can read their own orders" on orders;
create policy "Customers can read their own orders" on orders for select using (customer_id = auth.uid());

drop policy if exists "Customers can read their own order items" on order_items;
create policy "Customers can read their own order items" on order_items for select using (
  exists (select 1 from orders o where o.id = order_items.order_id and o.customer_id = auth.uid())
);

-- Saved addresses (distinct from the per-order shipping snapshot create_guest_order
-- writes — this is the "manage my saved addresses" feature on the account page).
drop policy if exists "Customers can read their own addresses" on addresses;
create policy "Customers can read their own addresses" on addresses for select using (customer_id = auth.uid());
drop policy if exists "Customers can insert their own addresses" on addresses;
create policy "Customers can insert their own addresses" on addresses for insert with check (customer_id = auth.uid());
drop policy if exists "Customers can update their own addresses" on addresses;
create policy "Customers can update their own addresses" on addresses for update using (customer_id = auth.uid());
drop policy if exists "Customers can delete their own addresses" on addresses;
create policy "Customers can delete their own addresses" on addresses for delete using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Wishlist — TRD §2.2, account-gated (PRD §6.3)
-- ---------------------------------------------------------------------------

create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customer_profiles (id) on delete cascade,
  product_variant_id uuid not null references product_variants (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_variant_id)
);

create index if not exists wishlist_items_customer_id_idx on wishlist_items (customer_id);

alter table wishlist_items enable row level security;

drop policy if exists "Customers can read their own wishlist" on wishlist_items;
create policy "Customers can read their own wishlist" on wishlist_items for select using (customer_id = auth.uid());
drop policy if exists "Customers can insert their own wishlist items" on wishlist_items;
create policy "Customers can insert their own wishlist items" on wishlist_items for insert with check (customer_id = auth.uid());
drop policy if exists "Customers can delete their own wishlist items" on wishlist_items;
create policy "Customers can delete their own wishlist items" on wishlist_items for delete using (customer_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Account-linked checkout — PRD §6.2 "account-linked when logged in"
-- ---------------------------------------------------------------------------

-- One-line behavior change: a signed-in customer's session already carries
-- auth.uid() into this SECURITY DEFINER call (same mechanism
-- claim_order_as_customer already relies on) — guests remain unaffected since
-- auth.uid() is null for them. The addresses insert below is deliberately left
-- as a per-order snapshot, not tied into "saved addresses" (see comment above).
create or replace function create_guest_order(
  p_cart_items jsonb,
  p_shipping jsonb,
  p_contact jsonb,
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
    auth.uid(), p_contact ->> 'email', p_contact ->> 'name', p_contact ->> 'phone', 'online', 'pending',
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

-- ---------------------------------------------------------------------------
-- Paystack reference lookup — TRD §4, admin reconciliation
-- ---------------------------------------------------------------------------

-- Same capability-token trust level as get_order_confirmation (guarded to
-- status = 'pending' so it can't overwrite a settled order's reference).
create or replace function record_paystack_reference(p_order_id uuid, p_reference text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update orders
  set paystack_reference = p_reference
  where id = p_order_id and status = 'pending';
end;
$$;

grant execute on function record_paystack_reference(uuid, text) to anon, authenticated;
