import { SEED_PRODUCTS } from "@/lib/data/seed/products";
import type { Product, ProductFilters } from "@/lib/data/types";

/**
 * Repository layer. Signatures match what a Supabase-backed implementation will
 * use (async, filter object in, Product[] out) so swapping the body for real
 * `@supabase/supabase-js` queries later doesn't touch any caller.
 */

async function readAll(): Promise<Product[]> {
  return SEED_PRODUCTS.filter((p) => p.status === "published");
}

export async function getPublishedProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const products = await readAll();
  return products.filter((product) => {
    if (filters.type && !product.facets.some((f) => f.facetType === "type" && f.slug === filters.type)) {
      return false;
    }
    if (filters.origin && !product.facets.some((f) => f.facetType === "origin" && f.slug === filters.origin)) {
      return false;
    }
    if (filters.useCase && !product.facets.some((f) => f.facetType === "use_case" && f.slug === filters.useCase)) {
      return false;
    }
    if (filters.petSafe && !product.isPetSafe) {
      return false;
    }
    return true;
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await readAll();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const products = await readAll();
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await readAll();
  const useCaseSlugs = new Set(
    product.facets.filter((f) => f.facetType === "use_case").map((f) => f.slug)
  );
  return products
    .filter((p) => p.id !== product.id && p.facets.some((f) => f.facetType === "use_case" && useCaseSlugs.has(f.slug)))
    .slice(0, limit);
}

export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
  const products = await readAll();
  return products.slice(0, limit);
}
