import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-side customer session check — any authenticated user, no role/admin
 * check at all (that's the separate lib/admin/auth.ts gate). Wrapped in
 * React's cache() for the same reason as getAdminUserId: multiple call sites
 * (layout, page fetchers, actions) shouldn't each pay for their own network
 * round trip within the same request.
 */
export const getCustomerId = cache(async (): Promise<string | null> => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
});

/** Use at the top of account Server Components/Server Actions. Redirects signed-out visitors to login. */
export async function requireCustomer(): Promise<string> {
  const customerId = await getCustomerId();
  if (!customerId) redirect("/account/login");
  return customerId;
}
