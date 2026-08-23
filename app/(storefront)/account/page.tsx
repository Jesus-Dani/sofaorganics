import Link from "next/link";
import { requireCustomer } from "@/lib/customer/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/ui/sign-out-button";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const customerId = await requireCustomer();
  const supabase = createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("full_name, phone")
    .eq("id", customerId)
    .maybeSingle();

  return (
    <div className="wrap max-w-2xl py-14 md:py-20">
      <p className="eyebrow mb-2">My Account</p>
      <h1 className="text-[28px]">{profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome back"}</h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/account/orders" className="border border-border p-6 text-center hover:border-primary">
          <p className="font-serif text-lg">Orders</p>
          <p className="mt-1 text-sm text-text-muted">History & Buy Again</p>
        </Link>
        <Link href="/account/wishlist" className="border border-border p-6 text-center hover:border-primary">
          <p className="font-serif text-lg">Wishlist</p>
          <p className="mt-1 text-sm text-text-muted">Saved items</p>
        </Link>
        <Link href="/account/addresses" className="border border-border p-6 text-center hover:border-primary">
          <p className="font-serif text-lg">Addresses</p>
          <p className="mt-1 text-sm text-text-muted">Saved shipping details</p>
        </Link>
      </div>

      <div className="mt-10">
        <SignOutButton redirectTo="/account/login" />
      </div>
    </div>
  );
}
