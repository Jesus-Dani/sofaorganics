import { notFound } from "next/navigation";
import { getOrderForCustomer } from "@/lib/customer/orders";
import { formatCurrency } from "@/lib/utils/format-currency";
import { BuyAgainButton } from "@/components/account/buy-again-button";

export const metadata = { title: "Order Details" };

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function AccountOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderForCustomer(params.id);
  if (!order) notFound();

  return (
    <div className="wrap max-w-2xl py-14 md:py-20">
      <p className="eyebrow mb-2">My Account</p>
      <div className="flex items-center justify-between">
        <h1 className="text-[28px]">Order #{order.id.slice(0, 8)}</h1>
        <BuyAgainButton orderId={order.id} />
      </div>
      <p className="mt-2 text-sm text-text-muted">
        {STATUS_LABEL[order.status] ?? order.status} · {new Date(order.created_at).toLocaleString()}
      </p>

      <div className="mt-8 border border-border p-6">
        <h2 className="mb-4 font-serif text-lg">Items</h2>
        <ul className="space-y-2 border-b border-border pb-4 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-text-muted">
              <span>
                {item.productName} ({item.sizeLabel}) × {item.quantity}
              </span>
              <span>{formatCurrency(item.unitPrice * item.quantity, order.currency)}</span>
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

        {order.shippingAddress && (
          <div className="mt-6 border-t border-border pt-4 text-sm text-text-muted">
            <p className="mb-1 font-medium text-text">Shipped to</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        )}
      </div>
    </div>
  );
}
