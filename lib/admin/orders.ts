import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { OrderRow, OrderStatus, OrderSource } from "@/types/database.types";

export interface OrderListItem extends OrderRow {
  item_count: number;
}

export interface OrderItemDetail {
  id: string;
  quantity: number;
  unit_price: number;
  is_subscription: boolean;
  product_name: string;
  product_slug: string;
  size_label: string;
}

export interface OrderDetail extends OrderRow {
  items: OrderItemDetail[];
  shipping_address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    country: string;
    postal_code: string | null;
  } | null;
}

export async function getAllOrdersForAdmin(
  filters: { search?: string; status?: OrderStatus; source?: OrderSource } = {}
): Promise<OrderListItem[]> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from("orders")
    .select("*, order_items(count)")
    .order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.source) query = query.eq("source", filters.source);
  if (filters.search) {
    const term = filters.search.trim();
    query = query.or(`guest_name.ilike.%${term}%,guest_email.ilike.%${term}%,guest_phone.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data as unknown as (OrderRow & { order_items: { count: number }[] })[]).map((row) => ({
    ...row,
    item_count: row.order_items[0]?.count ?? 0,
  }));
}

export async function getOrderForAdmin(id: string): Promise<OrderDetail | null> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  const { data: order, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, quantity, unit_price, is_subscription, product_variants(size_label, products(name, slug))")
    .eq("order_id", id);
  if (itemsError) throw itemsError;

  let shippingAddress: OrderDetail["shipping_address"] = null;
  if (order.shipping_address_id) {
    const { data: address } = await supabase
      .from("addresses")
      .select("line1, line2, city, state, country, postal_code")
      .eq("id", order.shipping_address_id)
      .maybeSingle();
    shippingAddress = address ?? null;
  }

  type ItemRow = {
    id: string;
    quantity: number;
    unit_price: number;
    is_subscription: boolean;
    product_variants: { size_label: string; products: { name: string; slug: string } } | null;
  };

  return {
    ...order,
    shipping_address: shippingAddress,
    items: (items as unknown as ItemRow[]).map((row) => ({
      id: row.id,
      quantity: row.quantity,
      unit_price: row.unit_price,
      is_subscription: row.is_subscription,
      product_name: row.product_variants?.products.name ?? "Unknown product",
      product_slug: row.product_variants?.products.slug ?? "",
      size_label: row.product_variants?.size_label ?? "",
    })),
  };
}
