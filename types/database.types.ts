/**
 * Hand-written stand-in for `supabase gen types typescript`.
 * Mirrors supabase/migrations/0001_catalog_schema.sql exactly.
 * Regenerate for real (`supabase gen types typescript --project-id <id>`) once
 * a live Supabase project exists, then delete this comment block.
 */

export type ProductStatus = "draft" | "published" | "archived";
export type FacetType = "type" | "origin" | "use_case";

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          status: ProductStatus;
          is_pet_safe: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size_label: string;
          price: number;
          currency: string;
          stock_quantity: number;
          low_stock_threshold: number;
          subscription_eligible: boolean;
          sku: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["product_images"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };
      facets: {
        Row: {
          id: string;
          facet_type: FacetType;
          label: string;
          slug: string;
        };
        Insert: Omit<Database["public"]["Tables"]["facets"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["facets"]["Insert"]>;
      };
      product_facets: {
        Row: {
          product_id: string;
          facet_id: string;
        };
        Insert: Database["public"]["Tables"]["product_facets"]["Row"];
        Update: Partial<Database["public"]["Tables"]["product_facets"]["Row"]>;
      };
    };
  };
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];
export type FacetRow = Database["public"]["Tables"]["facets"]["Row"];
