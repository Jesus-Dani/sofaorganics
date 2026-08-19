import { deriveStockStatus } from "@/lib/utils/stock-status";
import type { Product, ProductFacetTag, ProductImage, ProductVariant } from "@/lib/data/types";
import type { FacetType, ProductStatus } from "@/types/database.types";

export interface ProductQueryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  is_pet_safe: boolean;
  pet_safe_note: string | null;
  product_variants: {
    id: string;
    size_label: string;
    price: number;
    currency: string;
    stock_quantity: number;
    low_stock_threshold: number;
    sku: string;
  }[];
  product_images: { id: string; storage_path: string; alt_text: string; sort_order: number }[];
  product_facets: { facets: { id: string; facet_type: FacetType; label: string; slug: string } | null }[];
}

export function mapProductRow(row: ProductQueryRow): Product {
  const variants: ProductVariant[] = row.product_variants.map((v) => ({
    id: v.id,
    sizeLabel: v.size_label,
    price: v.price,
    currency: v.currency,
    stockQuantity: v.stock_quantity,
    lowStockThreshold: v.low_stock_threshold,
    stockStatus: deriveStockStatus(v.stock_quantity, v.low_stock_threshold),
    sku: v.sku,
  }));

  const images: ProductImage[] = [...row.product_images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({
      id: img.id,
      src: img.storage_path,
      alt: img.alt_text,
      sortOrder: img.sort_order,
      isPlaceholder: false,
    }));

  const facets: ProductFacetTag[] = row.product_facets
    .map((pf) => pf.facets)
    .filter((f): f is NonNullable<typeof f> => f !== null)
    .map((f) => ({ facetId: f.id, facetType: f.facet_type, label: f.label, slug: f.slug }));

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    status: row.status,
    isPetSafe: row.is_pet_safe,
    petSafeNote: row.pet_safe_note ?? undefined,
    images,
    variants,
    facets,
  };
}

export const PRODUCT_SELECT = `
  id, name, slug, description, status, is_pet_safe, pet_safe_note,
  product_variants ( id, size_label, price, currency, stock_quantity, low_stock_threshold, sku ),
  product_images ( id, storage_path, alt_text, sort_order ),
  product_facets ( facets ( id, facet_type, label, slug ) )
`;
