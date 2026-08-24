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

/**
 * Use at the top of account Server Components/Server Actions. Redirects signed-out
 * visitors to login. Pass the page a signed-out visitor was actually on (e.g. via
 * usePathname() in the calling Client Component) so login sends them back there
 * instead of the generic /account dashboard — matters most for actions triggered
 * from a shop-browsing context, like the wishlist toggle.
 */
export async function requireCustomer(redirectTo?: string): Promise<string> {
  const customerId = await getCustomerId();
  if (!customerId) {
    redirect(redirectTo ? `/account/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/account/login");
  }
  return customerId;
}
