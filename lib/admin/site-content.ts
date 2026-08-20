import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { SiteContentKey, SiteContentRow } from "@/types/database.types";

export async function getAllSiteContent(): Promise<SiteContentRow[]> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("site_content").select("*").order("key");
  if (error) throw error;
  return data;
}

export async function getSiteContentByKey(key: SiteContentKey): Promise<SiteContentRow | null> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("site_content").select("*").eq("key", key).maybeSingle();
  if (error) throw error;
  return data;
}
