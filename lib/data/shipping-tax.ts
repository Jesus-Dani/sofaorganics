import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ShippingRuleRow, TaxRuleRow } from "@/types/database.types";

export async function getShippingZones(): Promise<ShippingRuleRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("shipping_rules").select("*").order("rate", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTaxRate(): Promise<TaxRuleRow | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("tax_rules").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return data;
}
