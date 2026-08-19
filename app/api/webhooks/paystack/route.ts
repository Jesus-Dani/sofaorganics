import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/paystack/client";

/**
 * Real webhook per TRD §4 — signature-verified, marks the order paid on
 * charge.success. Won't receive traffic until PAYSTACK_SECRET_KEY is set and
 * this URL is registered in the Paystack dashboard; the live checkout flow
 * uses the "Simulate Payment" route instead for now (see plan §5).
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const isValid = await verifyWebhookSignature(rawBody, signature).catch(() => false);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const orderId = event.data?.metadata?.order_id;
  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id in metadata" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("mark_order_paid", { p_order_id: orderId });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }

  return NextResponse.json({ received: true });
}
