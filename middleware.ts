import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const ADMIN_PUBLIC_PATHS = ["/admin/login", "/admin/setup"];
const ACCOUNT_PUBLIC_PATHS = ["/account/login", "/account/signup", "/account/reset-password"];

export async function middleware(request: NextRequest) {
  // Next.js prefetches every visible Link's RSC payload in the background. If a
  // prefetch lands mid-refresh-token-rotation, it can get redirected to login and
  // Next.js caches that response — so a *real* click later reuses the stale
  // redirect even though the session is fine by then. Prefetches don't need a
  // live session (the real navigation re-checks), so skip the gate for them
  // entirely rather than let them race the refresh token or poison the cache.
  if (request.headers.get("next-router-prefetch")) {
    return NextResponse.next();
  }

  const { response, supabase, user } = await updateSupabaseSession(request);

  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isPublicAdminPath = ADMIN_PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isAdminPath && !isPublicAdminPath) {
    if (!user) {
      return redirectPreservingCookies(request, response, "/admin/login");
    }
    const { data: isAdmin } = await supabase.rpc("is_admin", { uid: user.id });
    if (!isAdmin) {
      return redirectPreservingCookies(request, response, "/admin/login");
    }
  }

  const isAccountPath = pathname.startsWith("/account");
  const isPublicAccountPath = ACCOUNT_PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isAccountPath && !isPublicAccountPath && !user) {
    return redirectPreservingCookies(request, response, "/account/login");
  }

  return response;
}

// getUser() above may have just rotated the refresh token, writing the new cookie onto
// `response`. A bare NextResponse.redirect(...) is a brand-new response with none of
// that — the browser would keep the now-invalidated old cookie, and every request after
// this one would fail to refresh, bouncing back to login permanently until cookies are
// cleared. Copying response's cookies onto the redirect keeps the rotation intact.
function redirectPreservingCookies(request: NextRequest, response: NextResponse, path: string) {
  const redirectResponse = NextResponse.redirect(new URL(path, request.url));
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
