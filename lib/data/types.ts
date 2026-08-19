import type { FacetType, ProductStatus, StockStatus } from "@/types/database.types";

export interface ProductVariant {
  id: string;
  sizeLabel: string;
  price: number;
  currency: string;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  sku: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  isPlaceholder: boolean;
}

export interface ProductFacetTag {
  facetType: FacetType;
  label: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  isPetSafe: boolean;
  petSafeNote?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  facets: ProductFacetTag[];
}

export interface Facet {
  facetType: FacetType;
  label: string;
  slug: string;
}

export interface ProductFilters {
  type?: string;
  origin?: string;
  useCase?: string;
  petSafe?: boolean;
}
