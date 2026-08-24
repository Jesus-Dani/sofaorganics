import { notFound } from "next/navigation";
import { getOrderForAdmin } from "@/lib/admin/orders";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { formatCurrency } from "@/lib/utils/format-currency";

export const metadata = { title: "Order · Admin" };

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderForAdmin(params.id);
  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl">{order.guest_name ?? order.guest_email ?? "Registered customer"}</h1>
          <p className="mt-1 text-sm text-text-muted">
            {new Date(order.created_at).toLocaleString()} ·{" "}
            <span className="capitalize">{order.source}</span> order · placed by {order.created_by}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <section className="mb-8 overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-text">{item.product_name}</td>
                <td className="px-4 py-3 text-text">{item.size_label}</td>
                <td className="px-4 py-3 text-text">{item.quantity}</td>
                <td className="px-4 py-3 text-text">{formatCurrency(item.unit_price, order.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase text-text-muted">Customer</h2>
          <p className="text-sm text-text">{order.guest_name ?? "—"}</p>
          <p className="text-sm text-text">{order.guest_email ?? "—"}</p>
          <p className="text-sm text-text">{order.guest_phone ?? "—"}</p>
          <p className="mt-2 text-sm text-text">Payment: {order.payment_method ?? "—"}</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase text-text-muted">Shipping address</h2>
          {order.shipping_address ? (
            <div className="text-sm text-text">
              <p>{order.shipping_address.line1}</p>
              {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}
              </p>
              <p>
                {order.shipping_address.country} {order.shipping_address.postal_code}
              </p>
            </div>
          ) : (
            <p className="text-sm text-text">No shipping address on file.</p>
          )}
        </div>
      </section>

      <section className="border-t border-border pt-4">
        <div className="flex justify-between text-sm text-text">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal, order.currency)}</span>
        </div>
        <div className="flex justify-between text-sm text-text">
          <span>Shipping</span>
          <span>{formatCurrency(order.shipping_total, order.currency)}</span>
        </div>
        <div className="flex justify-between text-sm text-text">
          <span>Tax</span>
          <span>{formatCurrency(order.tax_total, order.currency)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-medium text-text">
          <span>Total</span>
          <span>{formatCurrency(order.grand_total, order.currency)}</span>
        </div>
      </section>
    </div>
  );
}
