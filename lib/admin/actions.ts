"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";
import {
  blogPostFormSchema,
  facetTypeSchema,
  manualOrderFormSchema,
  orderStatusSchema,
  productFormSchema,
  shippingRuleFormSchema,
  siteContentFormSchema,
  storeSettingsFormSchema,
  taxRuleFormSchema,
  type BlogPostFormValues,
  type ManualOrderFormValues,
  type ProductFormValues,
  type ShippingRuleFormValues,
  type SiteContentFormValues,
  type StoreSettingsFormValues,
  type TaxRuleFormValues,
} from "@/lib/admin/schema";
import type { FacetType, OrderStatus } from "@/types/database.types";

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

  const existingVariants = parsed.variants.filter((v) => v.id);
  const newVariants = parsed.variants.filter((v) => !v.id);
  const uniqueFacetIds = [...new Set(parsed.facetIds)];

  // The product update, variant writes, and facet replacement don't depend on each
  // other (different rows, no FK ordering issue) — run them concurrently instead of
  // one round trip at a time. Variant writes are also batched (one upsert call for
  // existing variants, one insert for new ones) instead of a per-variant loop: besides
  // being N round trips for N variants, a loop meant that one variant failing partway
  // through (e.g. a duplicate SKU) left the earlier variants in the loop already
  // committed with no rollback — a real partial-write bug, not just a perf concern.
  const [productResult, existingVariantsResult, newVariantsResult, facetsResult] = await Promise.all([
    supabase
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
      .eq("id", parsed.id),
    // upsert() requires the full row shape, not just the changed columns — currency and
    // subscription_eligible aren't editable from this form, so this pins them to the same
    // values every insert already uses. Fine today since nothing in the app ever sets
    // subscription_eligible true (Subscribe & Save is out of scope); revisit if that changes.
    existingVariants.length > 0
      ? supabase.from("product_variants").upsert(
          existingVariants.map((v) => ({
            id: v.id as string,
            product_id: parsed.id,
            size_label: v.sizeLabel,
            price: v.price,
            currency: "NGN",
            stock_quantity: v.stockQuantity,
            low_stock_threshold: v.lowStockThreshold,
            subscription_eligible: false,
            sku: v.sku,
          })),
          { onConflict: "id" }
        )
      : Promise.resolve({ error: null }),
    newVariants.length > 0
      ? supabase.from("product_variants").insert(
          newVariants.map((v) => ({
            product_id: parsed.id,
            size_label: v.sizeLabel,
            price: v.price,
            currency: "NGN",
            stock_quantity: v.stockQuantity,
            low_stock_threshold: v.lowStockThreshold,
            subscription_eligible: false,
            sku: v.sku,
          }))
        )
      : Promise.resolve({ error: null }),
    (async () => {
      const { error: deleteFacetsError } = await supabase.from("product_facets").delete().eq("product_id", parsed.id);
      if (deleteFacetsError) return { error: deleteFacetsError };
      if (uniqueFacetIds.length === 0) return { error: null };
      return supabase
        .from("product_facets")
        .upsert(
          uniqueFacetIds.map((facet_id) => ({ product_id: parsed.id, facet_id })),
          { onConflict: "product_id,facet_id", ignoreDuplicates: true }
        );
    })(),
  ]);

  if (productResult.error) throw new Error(productResult.error.message);
  if (existingVariantsResult.error) throw new Error(existingVariantsResult.error.message);
  if (newVariantsResult.error) throw new Error(newVariantsResult.error.message);
  if (facetsResult.error) throw new Error(facetsResult.error.message);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${parsed.id}/edit`);
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/products/${parsed.slug}`);
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  // Cleans up uploaded photos first — cascading the DB row wouldn't remove the
  // actual Storage objects, just the product_images rows pointing at them.
  const { data: images } = await supabase.from("product_images").select("storage_path").eq("product_id", id);
  const paths = (images ?? [])
    .map((img) => {
      const marker = "/object/public/product-images/";
      const idx = img.storage_path.indexOf(marker);
      return idx === -1 ? null : img.storage_path.slice(idx + marker.length);
    })
    .filter((p): p is string => Boolean(p));
  if (paths.length > 0) {
    await supabase.storage.from("product-images").remove(paths);
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") {
      throw new Error("This product has order history and can't be deleted — set it to Archived instead.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
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

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  const parsed = orderStatusSchema.parse(status);
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("orders").update({ status: parsed }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function createManualOrder(values: ManualOrderFormValues): Promise<string> {
  await requireAdmin();
  const parsed = manualOrderFormSchema.parse(values);
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.rpc("create_manual_order", {
    p_line_items: parsed.lineItems.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })),
    p_customer: { name: parsed.customerName, phone: parsed.customerPhone },
    p_payment_method: parsed.paymentMethod,
    p_shipping: parsed.shipping
      ? {
          line1: parsed.shipping.line1,
          line2: parsed.shipping.line2 || null,
          city: parsed.shipping.city,
          state: parsed.shipping.state,
          country: parsed.shipping.country,
          postal_code: parsed.shipping.postalCode || null,
        }
      : null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/customers");
  return data;
}

export async function upsertShippingRule(values: ShippingRuleFormValues) {
  await requireAdmin();
  const parsed = shippingRuleFormSchema.parse(values);
  const supabase = createSupabaseServerClient();

  const { error } = parsed.id
    ? await supabase
        .from("shipping_rules")
        .update({ zone_name: parsed.zoneName, rate: parsed.rate })
        .eq("id", parsed.id)
    : await supabase
        .from("shipping_rules")
        .insert({ zone_name: parsed.zoneName, rate: parsed.rate, rate_type: "flat", min_weight: null, max_weight: null });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/shipping-tax");
}

export async function deleteShippingRule(id: string) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("shipping_rules").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/shipping-tax");
}

export async function upsertTaxRule(values: TaxRuleFormValues) {
  await requireAdmin();
  const parsed = taxRuleFormSchema.parse(values);
  const supabase = createSupabaseServerClient();

  const { error } = parsed.id
    ? await supabase
        .from("tax_rules")
        .update({ region: parsed.region, rate_percent: parsed.ratePercent })
        .eq("id", parsed.id)
    : await supabase.from("tax_rules").insert({ region: parsed.region, rate_percent: parsed.ratePercent });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/shipping-tax");
}

export async function deleteTaxRule(id: string) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("tax_rules").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/shipping-tax");
}

export async function upsertSiteContent(values: SiteContentFormValues) {
  await requireAdmin();
  const parsed = siteContentFormSchema.parse(values);
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("site_content")
    .update({ body_richtext: parsed.bodyRichtext, updated_at: new Date().toISOString() })
    .eq("key", parsed.key);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/site-content");
  revalidatePath(`/legal/${parsed.key.replace(/_/g, "-")}`);
}

export async function upsertStoreSettings(id: string, values: StoreSettingsFormValues) {
  await requireAdmin();
  const parsed = storeSettingsFormSchema.parse(values);
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("store_settings")
    .update({
      business_name: parsed.businessName,
      whatsapp_number: parsed.whatsappNumber || null,
      contact_email: parsed.contactEmail || null,
      notify_on_new_order: parsed.notifyOnNewOrder,
      notify_on_low_stock: parsed.notifyOnLowStock,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
}
