import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/format-currency";
import { CreateAccountPrompt } from "@/components/checkout/create-account-prompt";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function ConfirmationPage({ params }: { params: { orderId: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: order, error } = await supabase.rpc("get_order_confirmation", { p_order_id: params.orderId });

  if (error || !order) notFound();

  return (
    <div className="wrap max-w-2xl py-14 md:py-20">
      <div className="text-center">
        <CheckCircle size={40} weight="fill" className="mx-auto text-primary" aria-hidden />
        <p className="eyebrow mt-4 mb-2">
          Order #{order.id.slice(0, 8)} — {order.status === "paid" ? "Paid" : order.status}
        </p>
        <h1 className="text-[28px]">Thank you, {order.guest_name?.split(" ")[0] ?? "there"}.</h1>
        <p className="mt-2 text-text-muted">
          We&apos;ve got your order. A confirmation would normally go to {order.guest_email}, though
          email sending isn&apos;t wired up yet — this page is the record for now.
        </p>
      </div>

      <div className="mt-10 border border-border p-6">
        <h2 className="mb-4 font-serif text-lg">Items</h2>
        <ul className="space-y-2 border-b border-border pb-4 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-text-muted">
              <span>
                {item.product_name} ({item.size_label}) × {item.quantity}
              </span>
              <span>{formatCurrency(item.unit_price * item.quantity, order.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Subtotal</span>
            <span>{formatCurrency(order.subtotal, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Shipping</span>
            <span>{formatCurrency(order.shipping_total, order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Tax</span>
            <span>{formatCurrency(order.tax_total, order.currency)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-text">
            <span>Total</span>
            <span>{formatCurrency(order.grand_total, order.currency)}</span>
          </div>
        </div>

        {order.shipping_address && (
          <div className="mt-6 border-t border-border pt-4 text-sm text-text-muted">
            <p className="mb-1 font-medium text-text">Shipping to</p>
            <p>{order.shipping_address.line1}</p>
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state}
            </p>
            <p>{order.shipping_address.country}</p>
          </div>
        )}
      </div>

      {!order.customer_id && <CreateAccountPrompt orderId={order.id} defaultEmail={order.guest_email ?? ""} />}

      <div className="mt-8 text-center">
        <Link href="/shop" className="text-sm font-medium text-primary underline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
