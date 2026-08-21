import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireCustomer } from "@/lib/customer/auth";
import type { AddressRow } from "@/types/database.types";

export async function getAddressesForCustomer(): Promise<AddressRow[]> {
  const customerId = await requireCustomer();
  return getAddressesForCustomerId(customerId);
}

/**
 * Non-redirecting variant for contexts guests also pass through (checkout) — the caller
 * must check getCustomerId() itself first, since requireCustomer() would redirect a guest
 * away from checkout entirely.
 */
export async function getAddressesForCustomerId(customerId: string): Promise<AddressRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("customer_id", customerId)
    .order("is_default", { ascending: false });
  if (error) throw error;
  return data;
}
