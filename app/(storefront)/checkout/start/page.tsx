import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerId } from "@/lib/customer/auth";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutStartPage() {
  // Already signed in — nothing to prompt, go straight to checkout.
  const customerId = await getCustomerId();
  if (customerId) redirect("/checkout");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-2 text-center">Sofa Organics</p>
      <h1 className="mb-2 text-center text-2xl">Checkout</h1>
      <p className="mb-8 text-center text-sm text-text">
        Sign in or create an account to save your details for next time, or continue as a guest.
      </p>

      <div className="space-y-3">
        <Link
          href="/account/login?redirectTo=/checkout"
          className="block w-full bg-primary py-3.5 text-center text-sm font-medium text-background hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/account/signup?redirectTo=/checkout"
          className="block w-full border border-border py-3.5 text-center text-sm font-medium text-text hover:border-primary"
        >
          Create an account
        </Link>
        <Link
          href="/checkout"
          className="block w-full py-3.5 text-center text-sm font-medium text-text-muted underline hover:text-primary"
        >
          Continue as guest
        </Link>
      </div>
    </div>
  );
}
