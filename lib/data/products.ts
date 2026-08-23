import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProductRow, PRODUCT_SELECT, type ProductQueryRow } from "@/lib/data/map-product-row";
import type { Product, ProductFilters } from "@/lib/data/types";

/**
 * Repository layer — queries the live Supabase project. Public products are
 * readable by the anon/publishable key under RLS (see
 * supabase/migrations/0001_catalog_schema.sql); every mutation for checkout
 * goes through the security-definer RPCs in 0002_checkout_schema.sql instead
 * of this file.
 */

async function productIdsForFacetSlug(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  slug: string
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("product_facets")
    .select("product_id, facets!inner(slug)")
    .eq("facets.slug", slug);

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.product_id));
}

function intersect(sets: Set<string>[]): Set<string> {
  if (sets.length === 0) return new Set();
  return sets.reduce((acc, set) => new Set([...acc].filter((id) => set.has(id))));
}

export async function getPublishedProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = createSupabaseServerClient();

  const facetSlugs = [filters.type, filters.origin, filters.useCase].filter(
    (v): v is string => Boolean(v)
  );

  let matchingIds: string[] | null = null;
  if (facetSlugs.length > 0) {
    const idSets = await Promise.all(facetSlugs.map((slug) => productIdsForFacetSlug(supabase, slug)));
    matchingIds = [...intersect(idSets)];
    if (matchingIds.length === 0) return [];
  }

  let query = supabase.from("products").select(PRODUCT_SELECT).eq("status", "published");
  if (filters.petSafe) query = query.eq("is_pet_safe", true);
  if (matchingIds) query = query.in("id", matchingIds);

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as ProductQueryRow[]).map(mapProductRow);
}

// cache()'d because both generateMetadata() and the page component call this for the same
// slug on every product-page render — without it, that's two identical DB round trips per visit.
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapProductRow(data as unknown as ProductQueryRow);
});

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .textSearch("search_vector", q, { type: "websearch", config: "english" });

  if (error) throw error;
  return (data as unknown as ProductQueryRow[]).map(mapProductRow);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const useCaseSlugs = product.facets.filter((f) => f.facetType === "use_case").map((f) => f.slug);
  if (useCaseSlugs.length === 0) return [];

  const supabase = createSupabaseServerClient();
  const idSets = await Promise.all(useCaseSlugs.map((slug) => productIdsForFacetSlug(supabase, slug)));
  const relatedIds = [...new Set(idSets.flatMap((s) => [...s]))].filter((id) => id !== product.id);
  if (relatedIds.length === 0) return [];

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .in("id", relatedIds.slice(0, limit));

  if (error) throw error;
  return (data as unknown as ProductQueryRow[]).map(mapProductRow);
}

export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Homepage bestsellers only shows products with real photography — a
  // placeholder tile looks unfinished in this row (the full /shop grid is
  // where placeholder products belong, since that's the whole catalog).
  const products = (data as unknown as ProductQueryRow[]).map(mapProductRow);
  return products.filter((p) => p.images.length > 0).slice(0, limit);
}
