"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import {
  List,
  X,
  SquaresFour,
  Package,
  ShoppingBag,
  Users,
  Truck,
  NotePencil,
  FileText,
  Gear,
} from "@phosphor-icons/react/dist/ssr";
import { SignOutButton } from "@/components/ui/sign-out-button";

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

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {NAV.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          prefetch={false}
          onClick={onNavigate}
          className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text hover:bg-background hover:text-primary"
        >
          <Icon size={17} aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}

/** Static nav list for the always-visible desktop sidebar (md: and up). */
export function AdminSidebarNav() {
  return <NavLinks />;
}

/** Hamburger + slide-in drawer for the mobile admin top bar (below md:). */
export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" aria-label="Open admin menu" className="flex items-center justify-center p-1 md:hidden">
          <List size={22} aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-text/40 md:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col justify-between overflow-y-auto bg-background-alt p-5 md:hidden">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <Dialog.Title className="font-serif text-lg">Admin menu</Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" aria-label="Close menu" className="p-1">
                  <X size={20} aria-hidden />
                </button>
              </Dialog.Close>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
          <div className="space-y-3 border-t border-border pt-4">
            <Link
              href="/"
              prefetch={false}
              onClick={() => setOpen(false)}
              className="block text-sm text-text-muted hover:text-primary"
            >
              View store →
            </Link>
            <SignOutButton redirectTo="/admin/login" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
