import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { BlogPostRow, BlogPostStatus } from "@/types/database.types";

export async function getAllPostsForAdmin(filters: { search?: string; status?: BlogPostStatus } = {}): Promise<
  BlogPostRow[]
> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPostForEdit(id: string): Promise<BlogPostRow | null> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
