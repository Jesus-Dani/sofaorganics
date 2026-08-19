import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_LINK } from "@/lib/nav-config";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="wrap py-20 text-center">
      <p className="eyebrow mb-4">Account</p>
      <h1 className="text-[28px]">Accounts are on the way.</h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-muted">
        Sign-in, order history, and wishlist are being built next. For now, browse the shop as a
        guest (your cart stays on this device), or reach us on WhatsApp for anything account-related.
      </p>
      <div className="mt-7 flex items-center justify-center gap-4">
        <Link href="/shop" className="bg-primary px-6 py-3 text-sm font-medium text-background">
          Continue shopping
        </Link>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary underline">
          Message us
        </a>
      </div>
    </div>
  );
}
