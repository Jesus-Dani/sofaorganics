import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireCustomer } from "@/lib/customer/auth";
import type { OrderRow } from "@/types/database.types";

export async function getOrdersForCustomer(): Promise<OrderRow[]> {
  const customerId = await requireCustomer();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export interface CustomerOrderItem {
  id: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
  productName: string;
  productSlug: string;
  sizeLabel: string;
}

export interface CustomerOrderDetail extends OrderRow {
  items: CustomerOrderItem[];
  shippingAddress: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    country: string;
    postalCode: string | null;
  } | null;
}

export async function getOrderForCustomer(id: string): Promise<CustomerOrderDetail | null> {
  const customerId = await requireCustomer();
  const supabase = createSupabaseServerClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("customer_id", customerId)
    .maybeSingle();
  if (error) throw error;
  if (!order) return null;

  const [itemsResult, addressResult] = await Promise.all([
    supabase
      .from("order_items")
      .select("id, product_variant_id, quantity, unit_price, product_variants(size_label, products(name, slug))")
      .eq("order_id", id),
    order.shipping_address_id
      ? supabase
          .from("addresses")
          .select("line1, line2, city, state, country, postal_code")
          .eq("id", order.shipping_address_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (itemsResult.error) throw itemsResult.error;

  type ItemRow = {
    id: string;
    product_variant_id: string;
    quantity: number;
    unit_price: number;
    product_variants: { size_label: string; products: { name: string; slug: string } } | null;
  };

  return {
    ...order,
    shippingAddress: addressResult.data
      ? {
          line1: addressResult.data.line1,
          line2: addressResult.data.line2,
          city: addressResult.data.city,
          state: addressResult.data.state,
          country: addressResult.data.country,
          postalCode: addressResult.data.postal_code,
        }
      : null,
    items: (itemsResult.data as unknown as ItemRow[]).map((row) => ({
      id: row.id,
      productVariantId: row.product_variant_id,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      productName: row.product_variants?.products.name ?? "Unknown product",
      productSlug: row.product_variants?.products.slug ?? "",
      sizeLabel: row.product_variants?.size_label ?? "",
    })),
  };
}

export interface ReorderLine {
  variantId: string;
  productSlug: string;
  productName: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  image: string;
  available: boolean;
}

/** Re-validates current price/stock (TRD §2.3) rather than trusting the historical order_items row. */
export async function getOrderLineItemsForReorder(orderId: string): Promise<ReorderLine[]> {
  const customerId = await requireCustomer();
  const supabase = createSupabaseServerClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("id", orderId)
    .eq("customer_id", customerId)
    .maybeSingle();
  if (!order) return [];

  const { data: items, error } = await supabase
    .from("order_items")
    .select(
      "quantity, product_variants(id, size_label, price, currency, stock_quantity, products(name, slug, product_images(storage_path)))"
    )
    .eq("order_id", orderId);
  if (error) throw error;

  type Row = {
    quantity: number;
    product_variants: {
      id: string;
      size_label: string;
      price: number;
      currency: string;
      stock_quantity: number;
      products: { name: string; slug: string; product_images: { storage_path: string }[] };
    } | null;
  };

  return (items as unknown as Row[])
    .filter((row) => row.product_variants)
    .map((row) => {
      const variant = row.product_variants!;
      return {
        variantId: variant.id,
        productSlug: variant.products.slug,
        productName: variant.products.name,
        sizeLabel: variant.size_label,
        quantity: row.quantity,
        unitPrice: variant.price,
        currency: variant.currency,
        image: variant.products.product_images[0]?.storage_path ?? "",
        available: variant.stock_quantity >= row.quantity,
      };
    });
}
