import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BlogPostRow } from "@/types/database.types";

export async function getPublishedPosts(): Promise<BlogPostRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data;
}

// cache()'d because both generateMetadata() and the page component call this for the same
// slug on every article render — without it, that's two identical DB round trips per visit.
export const getPublishedPostBySlug = cache(async (slug: string): Promise<BlogPostRow | null> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
});
