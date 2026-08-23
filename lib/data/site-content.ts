import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteContentKey } from "@/types/database.types";

// Named distinctly from lib/admin/site-content.ts's getSiteContentByKey (same name, different
// return shape — that one returns the full row for editing, this returns just the rendered
// body for public display) to avoid an easy-to-miscopy footgun between the two.
export async function getSiteContentBodyByKey(key: SiteContentKey): Promise<string> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("site_content").select("body_richtext").eq("key", key).maybeSingle();
  if (error) throw error;
  return data?.body_richtext ?? "";
}
