"use server";

import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/customer/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrderLineItemsForReorder, type ReorderLine } from "@/lib/customer/orders";
import { addressFormSchema, type AddressFormValues } from "@/lib/customer/schema";

export async function reorderItems(orderId: string): Promise<ReorderLine[]> {
  return getOrderLineItemsForReorder(orderId);
}

export async function toggleWishlistItem(variantId: string, isSaved: boolean, currentPath?: string): Promise<void> {
  const customerId = await requireCustomer(currentPath);
  const supabase = createSupabaseServerClient();

  if (isSaved) {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("customer_id", customerId)
      .eq("product_variant_id", variantId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("wishlist_items")
      .upsert({ customer_id: customerId, product_variant_id: variantId }, { onConflict: "customer_id,product_variant_id" });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/account/wishlist");
}

export async function upsertAddress(values: AddressFormValues): Promise<void> {
  const customerId = await requireCustomer();
  const parsed = addressFormSchema.parse(values);
  const supabase = createSupabaseServerClient();

  if (parsed.isDefault) {
    const { error: clearDefaultError } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("customer_id", customerId);
    if (clearDefaultError) throw new Error(clearDefaultError.message);
  }

  const payload = {
    customer_id: customerId,
    label: parsed.label || null,
    line1: parsed.line1,
    line2: parsed.line2 || null,
    city: parsed.city,
    state: parsed.state,
    country: parsed.country,
    postal_code: parsed.postalCode || null,
    is_default: parsed.isDefault,
  };

  const { error } = parsed.id
    ? await supabase.from("addresses").update(payload).eq("id", parsed.id).eq("customer_id", customerId)
    : await supabase.from("addresses").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/account/addresses");
}

export async function deleteAddress(id: string): Promise<void> {
  const customerId = await requireCustomer();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("addresses").delete().eq("id", id).eq("customer_id", customerId);
  if (error) throw new Error(error.message);
  revalidatePath("/account/addresses");
}
