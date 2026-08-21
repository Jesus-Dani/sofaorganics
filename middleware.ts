import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const ADMIN_PUBLIC_PATHS = ["/admin/login", "/admin/setup"];

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
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const { data: isAdmin } = await supabase.rpc("is_admin", { uid: user.id });
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
