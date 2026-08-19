/**
 * Hand-written stand-in for `supabase gen types typescript`. Mirrors
 * supabase/migrations/0001_catalog_schema.sql and 0002_checkout_schema.sql,
 * and has been verified against the live project (seed data read, RPC calls,
 * and RLS rejection all confirmed working through this file's types).
 * `supabase gen types typescript --db-url ...` still couldn't be run directly
 * from this machine (the direct-connection host is IPv6-only and this
 * network has no IPv6 route) — regenerate for real from a machine with IPv6,
 * or via `supabase login` + `--project-id`, next time this schema changes.
 */

export type ProductStatus = "draft" | "published" | "archived";
export type FacetType = "type" | "origin" | "use_case";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
export type OrderSource = "online" | "manual";
export type BlogPostStatus = "draft" | "published";

export interface Database {
  public: {
    Views: Record<string, never>;
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          status: ProductStatus;
          is_pet_safe: boolean;
          pet_safe_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [];
      };
      product_facets: {
        Row: {
          product_id: string;
          facet_id: string;
        };
        Insert: Database["public"]["Tables"]["product_facets"]["Row"];
        Update: Partial<Database["public"]["Tables"]["product_facets"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "product_facets_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_facets_facet_id_fkey";
            columns: ["facet_id"];
            referencedRelation: "facets";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_profiles: {
        Row: { id: string; full_name: string | null; phone: string | null; created_at: string };
        Insert: { id: string; full_name?: string | null; phone?: string | null; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["customer_profiles"]["Insert"]>;
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string | null;
          label: string | null;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          country: string;
          postal_code: string | null;
          is_default: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["addresses"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customer_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      shipping_rules: {
        Row: {
          id: string;
          zone_name: string;
          rate: number;
          rate_type: "flat";
          min_weight: number | null;
          max_weight: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["shipping_rules"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["shipping_rules"]["Insert"]>;
        Relationships: [];
      };
      tax_rules: {
        Row: { id: string; region: string; rate_percent: number };
        Insert: Omit<Database["public"]["Tables"]["tax_rules"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["tax_rules"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          guest_email: string | null;
          guest_name: string | null;
          guest_phone: string | null;
          source: OrderSource;
          payment_method: string | null;
          status: OrderStatus;
          subtotal: number;
          shipping_total: number;
          tax_total: number;
          grand_total: number;
          currency: string;
          paystack_reference: string | null;
          shipping_address_id: string | null;
          created_by: "customer" | "admin";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customer_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey";
            columns: ["shipping_address_id"];
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_variant_id: string;
          quantity: number;
          unit_price: number;
          is_subscription: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey";
            columns: ["product_variant_id"];
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: { id: string; created_at: string };
        Insert: { id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          body_richtext: string;
          cover_image_path: string | null;
          status: BlogPostStatus;
          related_product_ids: string[];
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: { uid: string };
        Returns: boolean;
      };
      admin_bootstrap_available: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      claim_admin_bootstrap: {
        Args: Record<string, never>;
        Returns: void;
      };
      create_guest_order: {
        Args: {
          p_cart_items: { variant_id: string; quantity: number }[];
          p_shipping: {
            line1: string;
            line2?: string | null;
            city: string;
            state: string;
            country?: string;
            postal_code?: string | null;
          };
          p_contact: { name: string; email: string; phone: string };
          p_shipping_zone: string;
        };
        Returns: string;
      };
      mark_order_paid: {
        Args: { p_order_id: string };
        Returns: void;
      };
      get_order_confirmation: {
        Args: { p_order_id: string };
        Returns: OrderConfirmation;
      };
      claim_order_as_customer: {
        Args: { p_order_id: string; p_customer_id: string };
        Returns: void;
      };
    };
  };
}

export interface OrderConfirmation {
  id: string;
  status: OrderStatus;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;
  currency: string;
  created_at: string;
  customer_id: string | null;
  shipping_address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    country: string;
    postal_code: string | null;
  } | null;
  items: {
    product_name: string;
    product_slug: string;
    size_label: string;
    quantity: number;
    unit_price: number;
  }[];
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];
export type FacetRow = Database["public"]["Tables"]["facets"]["Row"];
export type ShippingRuleRow = Database["public"]["Tables"]["shipping_rules"]["Row"];
export type TaxRuleRow = Database["public"]["Tables"]["tax_rules"]["Row"];
export type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];
