import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FacetRow } from "@/types/database.types";

/** Live facets table — the admin tag picker's source of truth (not the static taxonomy file, since admins can add tags on the fly). */
export async function getAllFacets(): Promise<FacetRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("facets").select("*").order("facet_type").order("label");
  if (error) throw error;
  return data;
}
