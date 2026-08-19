"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";
import {
  blogPostFormSchema,
  facetTypeSchema,
  productFormSchema,
  type BlogPostFormValues,
  type ProductFormValues,
} from "@/lib/admin/schema";
import type { FacetType } from "@/types/database.types";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export async function createDraftProduct(): Promise<string> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: "Untitled Product",
      slug: `untitled-${randomSuffix()}`,
      description: "",
      status: "draft",
      is_pet_safe: false,
      pet_safe_note: null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

export async function upsertProduct(values: ProductFormValues) {
  await requireAdmin();
  const parsed = productFormSchema.parse(values);
  const supabase = createSupabaseServerClient();

  const { error: productError } = await supabase
    .from("products")
    .update({
      name: parsed.name,
      slug: parsed.slug,
      description: parsed.description,
      status: parsed.status,
      is_pet_safe: parsed.isPetSafe,
      pet_safe_note: parsed.isPetSafe ? parsed.petSafeNote ?? null : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.id);
  if (productError) throw new Error(productError.message);

  for (const variant of parsed.variants) {
    if (variant.id) {
      const { error } = await supabase
        .from("product_variants")
        .update({
          size_label: variant.sizeLabel,
          price: variant.price,
          stock_quantity: variant.stockQuantity,
          low_stock_threshold: variant.lowStockThreshold,
          sku: variant.sku,
        })
        .eq("id", variant.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("product_variants").insert({
        product_id: parsed.id,
        size_label: variant.sizeLabel,
        price: variant.price,
        currency: "NGN",
        stock_quantity: variant.stockQuantity,
        low_stock_threshold: variant.lowStockThreshold,
        subscription_eligible: false,
        sku: variant.sku,
      });
      if (error) throw new Error(error.message);
    }
  }

  const { error: deleteFacetsError } = await supabase.from("product_facets").delete().eq("product_id", parsed.id);
  if (deleteFacetsError) throw new Error(deleteFacetsError.message);

  if (parsed.facetIds.length > 0) {
    const { error: insertFacetsError } = await supabase
      .from("product_facets")
      .insert(parsed.facetIds.map((facet_id) => ({ product_id: parsed.id, facet_id })));
    if (insertFacetsError) throw new Error(insertFacetsError.message);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${parsed.id}/edit`);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/products/${parsed.slug}`);
}

export async function createFacet(facetType: FacetType, label: string) {
  await requireAdmin();
  const type = facetTypeSchema.parse(facetType);
  const trimmed = label.trim();
  if (trimmed.length < 2) throw new Error("Tag label is too short");

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("facets")
    .insert({ facet_type: type, label: trimmed, slug: slugify(trimmed) })
    .select("id, facet_type, label, slug")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  return data;
}

export async function createDraftBlogPost(): Promise<string> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: "Untitled Post",
      slug: `untitled-${randomSuffix()}`,
      body_richtext: "",
      cover_image_path: null,
      status: "draft",
      related_product_ids: [],
      published_at: null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

export async function upsertBlogPost(values: BlogPostFormValues) {
  await requireAdmin();
  const parsed = blogPostFormSchema.parse(values);
  const supabase = createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at")
    .eq("id", parsed.id)
    .maybeSingle();

  const publishedAt =
    parsed.status === "published" ? existing?.published_at ?? new Date().toISOString() : null;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: parsed.title,
      slug: parsed.slug,
      body_richtext: parsed.bodyRichtext,
      cover_image_path: parsed.coverImagePath,
      status: parsed.status,
      related_product_ids: parsed.relatedProductIds,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${parsed.id}/edit`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.slug}`);
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
