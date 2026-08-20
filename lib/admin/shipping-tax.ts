import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { ShippingRuleRow, TaxRuleRow } from "@/types/database.types";

export async function getShippingRulesForAdmin(): Promise<ShippingRuleRow[]> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("shipping_rules").select("*").order("zone_name");
  if (error) throw error;
  return data;
}

export async function getTaxRulesForAdmin(): Promise<TaxRuleRow[]> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("tax_rules").select("*").order("region");
  if (error) throw error;
  return data;
}
