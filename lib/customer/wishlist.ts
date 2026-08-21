import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCustomerId, requireCustomer } from "@/lib/customer/auth";

export interface WishlistCard {
  variantId: string;
  productSlug: string;
  productName: string;
  sizeLabel: string;
  price: number;
  currency: string;
  stockQuantity: number;
  image: string;
}

export async function getWishlistForCustomer(): Promise<WishlistCard[]> {
  const customerId = await requireCustomer();
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("wishlist_items")
    .select(
      "product_variants(id, size_label, price, currency, stock_quantity, products(name, slug, product_images(storage_path)))"
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  type Row = {
    product_variants: {
      id: string;
      size_label: string;
      price: number;
      currency: string;
      stock_quantity: number;
      products: { name: string; slug: string; product_images: { storage_path: string }[] };
    } | null;
  };

  return (data as unknown as Row[])
    .filter((row) => row.product_variants)
    .map((row) => {
      const variant = row.product_variants!;
      return {
        variantId: variant.id,
        productSlug: variant.products.slug,
        productName: variant.products.name,
        sizeLabel: variant.size_label,
        price: variant.price,
        currency: variant.currency,
        stockQuantity: variant.stock_quantity,
        image: variant.products.product_images[0]?.storage_path ?? "",
      };
    });
}

/**
 * For rendering the toggle state on product cards/PDP — deliberately uses getCustomerId(),
 * NOT requireCustomer(): these are public shop pages, so a signed-out visitor must see an
 * empty set, not get redirected to login just for browsing. Wrapped in cache() so every
 * ProductCard in a grid calling this independently collapses to a single query per request
 * instead of one per card.
 */
export const getWishlistedVariantIds = cache(async (): Promise<Set<string>> => {
  const customerId = await getCustomerId();
  if (!customerId) return new Set();

  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("wishlist_items").select("product_variant_id").eq("customer_id", customerId);
  return new Set((data ?? []).map((row) => row.product_variant_id));
});
