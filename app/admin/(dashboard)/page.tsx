import Link from "next/link";
import { getDashboardStats } from "@/lib/admin/dashboard";
import { formatCurrency } from "@/lib/utils/format-currency";

export const metadata = { title: "Dashboard · Admin" };

const RANGES = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "All time", value: 3650 },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const rangeDays = Number(searchParams.range) || 30;
  const stats = await getDashboardStats(rangeDays);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl">Dashboard</h1>
        <div className="flex gap-2">
          {RANGES.map((range) => (
            <Link
              key={range.value}
              href={`/admin?range=${range.value}`}
              className={`border px-3 py-1.5 text-xs font-medium ${
                rangeDays === range.value ? "border-primary text-primary" : "border-border text-text-muted hover:border-primary"
              }`}
            >
              {range.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="border border-border p-5">
          <p className="text-xs uppercase text-text-muted">Revenue</p>
          <p className="mt-1 text-2xl text-text">{formatCurrency(stats.revenue, "NGN")}</p>
        </div>
        <div className="border border-border p-5">
          <p className="text-xs uppercase text-text-muted">Orders</p>
          <p className="mt-1 text-2xl text-text">{stats.orderCount}</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text">Top products</h2>
          <div className="border border-border">
            {stats.topProducts.length === 0 && <p className="p-4 text-sm text-text-muted">No sales in this range yet.</p>}
            {stats.topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0">
                <span className="text-sm text-text">{product.name}</span>
                <span className="text-sm text-text-muted">
                  {product.unitsSold} sold · {formatCurrency(product.revenue, "NGN")}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-text">Low stock alerts</h2>
          <div className="border border-border">
            {stats.lowStockVariants.length === 0 && <p className="p-4 text-sm text-text-muted">Nothing running low.</p>}
            {stats.lowStockVariants.map((v, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0">
                <span className="text-sm text-text">
                  {v.productName} — {v.sizeLabel}
                </span>
                <span className="text-sm text-accent">{v.stockQuantity} left</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-text">Recent orders</h2>
        <div className="border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-background-alt">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-text hover:text-primary">
                      {order.guest_name ?? order.guest_email ?? "Registered customer"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-muted capitalize">{order.status}</td>
                  <td className="px-4 py-3 text-text-muted">{formatCurrency(order.grand_total, order.currency)}</td>
                  <td className="px-4 py-3 text-text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
