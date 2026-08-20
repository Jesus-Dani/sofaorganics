import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { mapProductRow, PRODUCT_SELECT, type ProductQueryRow } from "@/lib/data/map-product-row";
import type { Product } from "@/lib/data/types";
import type { ProductStatus } from "@/types/database.types";

/** Unlike lib/data/products.ts (public, published-only), this sees every status — admin-only. */
export async function getAllProductsForAdmin(
  filters: { search?: string; status?: ProductStatus } = {}
): Promise<Product[]> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  let query = supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ProductQueryRow[]).map(mapProductRow);
}

export async function getProductForEdit(id: string): Promise<Product | null> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapProductRow(data as unknown as ProductQueryRow);
}

export interface SellableVariant {
  variantId: string;
  productName: string;
  sizeLabel: string;
  price: number;
  currency: string;
  stockQuantity: number;
  sku: string;
}

/** Flattened, published-only variant list for the manual-order line-item picker (TRD §6.3). */
export async function getSellableVariantsForAdmin(): Promise<SellableVariant[]> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_variants")
    .select("id, size_label, price, currency, stock_quantity, sku, products!inner(name, status)")
    .eq("products.status", "published");
  if (error) throw error;

  type Row = {
    id: string;
    size_label: string;
    price: number;
    currency: string;
    stock_quantity: number;
    sku: string;
    products: { name: string };
  };
  return (data as unknown as Row[]).map((row) => ({
    variantId: row.id,
    productName: row.products.name,
    sizeLabel: row.size_label,
    price: row.price,
    currency: row.currency,
    stockQuantity: row.stock_quantity,
    sku: row.sku,
  }));
}
