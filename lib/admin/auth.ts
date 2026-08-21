import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-side admin check (TRD §8: never client-side-only) — backed by is_admin(), not a JWT claim.
 * Wrapped in React's cache() because the layout, every page's data fetcher, and every Server Action
 * all call this independently — without memoizing, a single page view was firing this same
 * getUser() + is_admin RPC pair 3+ times in a row before any real data query even ran. cache() dedupes
 * repeat calls within one request to a single network round trip, with no change to the security
 * guarantee (still re-verified fresh on every new request, just not redundantly within it).
 */
export const getAdminUserId = cache(async (): Promise<string | null> => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin", { uid: user.id });
  return isAdmin ? user.id : null;
});

/** Use at the top of admin Server Components/Server Actions. Redirects non-admins to login. */
export async function requireAdmin(): Promise<string> {
  const adminId = await getAdminUserId();
  if (!adminId) redirect("/admin/login");
  return adminId;
}
