"use client";

import Link from "next/link";
import { ShoppingCart, User } from "@phosphor-icons/react/dist/ssr";
import { PrimaryNav } from "@/components/nav/primary-nav";
import { MobileNav } from "@/components/nav/mobile-nav";
import { SearchBar } from "@/components/nav/search-bar";
import { useCart } from "@/components/cart/cart-context";

export function Header({ isSignedIn }: { isSignedIn: boolean }) {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-background">
      <div className="bg-primary py-2.5 text-center text-[13px] text-background">
        Order by WhatsApp for same-day Port Harcourt pickup,{" "}
        <a href="/contact" className="underline">
          reach us here
        </a>
      </div>

      <div className="wrap flex items-center gap-6 py-5">
        <MobileNav isSignedIn={isSignedIn} />

        <Link href="/" className="shrink-0 leading-none">
          <span className="block font-serif text-[26px] font-semibold tracking-wide text-text">SOFA</span>
          <span className="eyebrow block text-[10px]">— Organics —</span>
        </Link>

        <SearchBar className="hidden max-w-md flex-1 md:flex" />

        <div className="ml-auto flex items-center gap-5 text-sm">
          <Link
            href={isSignedIn ? "/account" : "/account/login"}
            prefetch={false}
            className="hidden items-center gap-1.5 sm:flex"
          >
            <User size={18} aria-hidden />
            {isSignedIn ? "Account" : "Sign in"}
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center gap-1.5"
            aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <ShoppingCart size={19} aria-hidden />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-background">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="hidden border-t border-border md:block">
        <div className="wrap">
          <PrimaryNav />
        </div>
      </div>
    </header>
  );
}
