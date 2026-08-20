import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerDetail, getCustomerOrders } from "@/lib/admin/customers";
import { formatCurrency } from "@/lib/utils/format-currency";

export const metadata = { title: "Customer · Admin" };

export default async function AdminCustomerDetailPage({ params }: { params: { key: string } }) {
  const customer = await getCustomerDetail(params.key);
  if (!customer) notFound();
  const orders = await getCustomerOrders(customer);

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl">{customer.full_name ?? "Unnamed customer"}</h1>
      <p className="mb-6 text-sm text-text-muted">{customer.is_guest ? "Guest / Manual customer" : "Registered account"}</p>

      <section className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase text-text-muted">Contact</h2>
          <p className="text-sm text-text-muted">{customer.email ?? "No email"}</p>
          <p className="text-sm text-text-muted">{customer.phone ?? "No phone"}</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase text-text-muted">Lifetime metrics</h2>
          <p className="text-sm text-text-muted">Orders: {customer.order_count}</p>
          <p className="text-sm text-text-muted">Total spent: {formatCurrency(customer.total_spent, "NGN")}</p>
          <p className="text-sm text-text-muted">Average order: {formatCurrency(customer.avg_order_value, "NGN")}</p>
          <p className="text-sm text-text-muted">
            First order: {new Date(customer.first_order_at).toLocaleDateString()}
          </p>
          <p className="text-sm text-text-muted">
            Last order: {new Date(customer.last_order_at).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text">Order history</h2>
        <div className="border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-background-alt">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium capitalize text-text hover:text-primary">
                      {order.status}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{formatCurrency(order.grand_total, order.currency)}</td>
                  <td className="px-4 py-3 text-text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
