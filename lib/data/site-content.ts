import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteContentKey } from "@/types/database.types";

export async function getSiteContentByKey(key: SiteContentKey): Promise<string> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("site_content").select("body_richtext").eq("key", key).maybeSingle();
  if (error) throw error;
  return data?.body_richtext ?? "";
}
