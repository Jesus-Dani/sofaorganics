import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { initializeTransaction, verifyTransaction } from "@/lib/paystack/client";
import { ManualPaymentInstructions } from "@/components/checkout/manual-payment-instructions";

export const metadata: Metadata = { title: "Payment" };

// Paystack is fully wired (see lib/paystack/client.ts) but intentionally not live —
// only test-mode keys exist so far. Every customer gets the manual bank-transfer +
// WhatsApp-receipt flow below regardless of PAYSTACK_SECRET_KEY until this is
// flipped to true once real live keys are confirmed and tested.
const PAYSTACK_LIVE = false;

export default async function PayPage({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createSupabaseServerClient();
  const { data: order, error } = await supabase.rpc("get_order_confirmation", { p_order_id: params.orderId });

  if (error || !order) notFound();
  if (order.status !== "pending") {
    // Already paid (or otherwise resolved) — send straight to the confirmation page.
    // Also covers hitting "back" after a successful payment: no double-charge risk.
    redirect(`/checkout/${params.orderId}/confirmation`);
  }

  if (!PAYSTACK_LIVE) {
    return (
      <ManualPaymentInstructions
        orderId={order.id}
        guestName={order.guest_name}
        grandTotal={order.grand_total}
        currency={order.currency}
        items={order.items}
      />
    );
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_LIVE is true but PAYSTACK_SECRET_KEY is not set.");
  }

  const reference = firstParam(searchParams.reference) ?? firstParam(searchParams.trxref);

  // Paystack just redirected the customer's browser back here after an attempt.
  if (reference) {
    const verification = await verifyTransaction(reference).catch(() => null);

    if (verification?.status === "success") {
      const { error: markPaidError } = await supabase.rpc("mark_order_paid", { p_order_id: order.id });
      // The webhook may have already won the race and marked it paid first — that's fine,
      // not a real failure, so only re-render the error state for a genuinely different problem.
      if (markPaidError && !markPaidError.message.includes("not pending")) {
        return <PaymentFailedState orderId={order.id} message={markPaidError.message} />;
      }
      redirect(`/checkout/${order.id}/confirmation`);
    }

    return <PaymentFailedState orderId={order.id} message="That payment didn't go through." />;
  }

  // Still pending, no reference yet — kick off a fresh Paystack transaction.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const result = await initializeTransaction({
    email: order.guest_email ?? "",
    amountNaira: order.grand_total,
    reference: order.id,
    callbackUrl: `${siteUrl}/checkout/${order.id}/pay`,
    metadata: { order_id: order.id },
  });

  await supabase.rpc("record_paystack_reference", { p_order_id: order.id, p_reference: result.reference });

  redirect(result.authorizationUrl);
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function PaymentFailedState({ orderId, message }: { orderId: string; message: string }) {
  return (
    <div className="wrap max-w-lg py-16 text-center">
      <h1 className="text-[28px]">Payment didn&apos;t go through</h1>
      <p className="mt-4 text-text-muted">{message}</p>
      <Link href={`/checkout/${orderId}/pay`} className="mt-6 inline-block bg-primary px-6 py-3 text-sm font-medium text-background">
        Try again
      </Link>
    </div>
  );
}
