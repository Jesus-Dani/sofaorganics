import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Phase-2 stand-in for the real Paystack webhook (app/api/webhooks/paystack/route.ts).
 * Swap the button that calls this for a real Paystack redirect once
 * PAYSTACK_SECRET_KEY exists — see lib/paystack/client.ts.
 */
export async function POST(_request: Request, { params }: { params: { orderId: string } }) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("mark_order_paid", { p_order_id: params.orderId });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }

  return NextResponse.json({ ok: true });
}
