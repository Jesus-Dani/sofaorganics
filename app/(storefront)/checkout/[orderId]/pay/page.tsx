import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PaySimulator } from "@/components/checkout/pay-simulator";

export const metadata: Metadata = { title: "Payment" };

export default async function PayPage({ params }: { params: { orderId: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: order, error } = await supabase.rpc("get_order_confirmation", { p_order_id: params.orderId });

  if (error || !order) notFound();
  if (order.status !== "pending") {
    // Already paid (or otherwise resolved) — send straight to the confirmation page.
    redirect(`/checkout/${params.orderId}/confirmation`);
  }

  return (
    <div className="wrap max-w-lg py-16 text-center">
      <p className="eyebrow mb-4">Order #{order.id.slice(0, 8)}</p>
      <h1 className="text-[28px]">Complete your payment</h1>
      <p className="mt-4 text-text-muted">
        Real Paystack isn&apos;t connected yet, so this button stands in for it and keeps the flow
        fully testable. It marks the order paid exactly the way the real webhook will.
      </p>
      <PaySimulator orderId={order.id} grandTotal={order.grand_total} currency={order.currency} />
    </div>
  );
}
