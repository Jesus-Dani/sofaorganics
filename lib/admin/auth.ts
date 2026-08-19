import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Server-side admin check (TRD §8: never client-side-only) — backed by is_admin(), not a JWT claim. */
export async function getAdminUserId(): Promise<string | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin", { uid: user.id });
  return isAdmin ? user.id : null;
}

/** Use at the top of admin Server Components/Server Actions. Redirects non-admins to login. */
export async function requireAdmin(): Promise<string> {
  const adminId = await getAdminUserId();
  if (!adminId) redirect("/admin/login");
  return adminId;
}
