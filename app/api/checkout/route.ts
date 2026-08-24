import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkoutRequestSchema } from "@/lib/checkout/schema";

/** create_guest_order raises raw Postgres exceptions (e.g. with a SKU) — translate the
 * ones a customer can actually hit into plain language instead of surfacing them as-is. */
function toCustomerFacingError(message: string): string {
  if (message.startsWith("Insufficient stock for")) {
    return "One item in your cart just sold out — please update the quantity or remove it and try again.";
  }
  if (message.startsWith("Product variant") && message.includes("not found")) {
    return "One item in your cart is no longer available — please remove it and try again.";
  }
  return message;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout data", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { cartItems, name, email, phone, line1, line2, city, state, postalCode, shippingZone } = parsed.data;
  const supabase = createSupabaseServerClient();

  const { data: orderId, error } = await supabase.rpc("create_guest_order", {
    p_cart_items: cartItems.map((item) => ({ variant_id: item.variantId, quantity: item.quantity })),
    p_shipping: { line1, line2: line2 || null, city, state, postal_code: postalCode || null },
    p_contact: { name, email, phone },
    p_shipping_zone: shippingZone,
  });

  if (error) {
    return NextResponse.json({ error: toCustomerFacingError(error.message) }, { status: 422 });
  }

  return NextResponse.json({ orderId });
}
