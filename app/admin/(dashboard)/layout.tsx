import Link from "next/link";
import {
  SquaresFour,
  Package,
  ShoppingBag,
  Users,
  Truck,
  NotePencil,
  FileText,
  Gear,
} from "@phosphor-icons/react/dist/ssr";
import { requireAdmin } from "@/lib/admin/auth";
import { SignOutButton } from "@/components/admin/sign-out-button";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: SquaresFour },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Shipping & Tax", href: "/admin/shipping-tax", icon: Truck },
  { label: "Blog", href: "/admin/blog", icon: NotePencil },
  { label: "Site Content", href: "/admin/site-content", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Gear },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen font-sans">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-border bg-background-alt p-5">
        <div>
          <Link href="/admin" prefetch={false} className="mb-8 block font-serif text-lg text-text">
            Sofa Organics
            <span className="mt-0.5 block text-xs font-sans font-medium uppercase tracking-wide text-text-muted">
              Admin
            </span>
          </Link>
          <nav className="space-y-1">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                prefetch={false}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text hover:bg-background hover:text-primary"
              >
                <Icon size={17} aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-3 border-t border-border pt-4">
          <Link href="/" prefetch={false} className="block text-sm text-text-muted hover:text-primary">
            View store →
          </Link>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 bg-background p-8">{children}</main>
    </div>
  );
}
