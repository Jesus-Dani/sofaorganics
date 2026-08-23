import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { SignOutButton } from "@/components/ui/sign-out-button";
import { AdminSidebarNav, AdminMobileNav } from "@/components/admin/admin-nav";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col font-sans md:flex-row">
      <header className="flex items-center justify-between border-b border-border bg-background-alt px-5 py-4 md:hidden">
        <Link href="/admin" prefetch={false} className="font-serif text-lg text-text">
          Sofa Organics
          <span className="mt-0.5 block text-xs font-sans font-medium uppercase tracking-wide text-text-muted">
            Admin
          </span>
        </Link>
        <AdminMobileNav />
      </header>

      <aside className="hidden w-56 shrink-0 flex-col justify-between border-r border-border bg-background-alt p-5 md:flex">
        <div>
          <Link href="/admin" prefetch={false} className="mb-8 block font-serif text-lg text-text">
            Sofa Organics
            <span className="mt-0.5 block text-xs font-sans font-medium uppercase tracking-wide text-text-muted">
              Admin
            </span>
          </Link>
          <AdminSidebarNav />
        </div>
        <div className="space-y-3 border-t border-border pt-4">
          <Link href="/" prefetch={false} className="block text-sm text-text-muted hover:text-primary">
            View store →
          </Link>
          <SignOutButton redirectTo="/admin/login" />
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden bg-background p-4 md:p-8">{children}</main>
    </div>
  );
}
