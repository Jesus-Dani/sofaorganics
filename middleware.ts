import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const ADMIN_PUBLIC_PATHS = ["/admin/login", "/admin/setup"];

export async function middleware(request: NextRequest) {
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
