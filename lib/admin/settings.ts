import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { StoreSettingsRow } from "@/types/database.types";

export async function getStoreSettings(): Promise<StoreSettingsRow> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("store_settings").select("*").limit(1).single();
  if (error) throw error;
  return data;
}
