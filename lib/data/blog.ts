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

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
