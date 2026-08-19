import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkoutRequestSchema } from "@/lib/checkout/schema";

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
    return NextResponse.json({ error: error.message }, { status: 422 });
  }

  return NextResponse.json({ orderId });
}
