import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getAllOrdersForAdmin } from "@/lib/admin/orders";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { OrderSource, OrderStatus } from "@/types/database.types";

export const metadata = { title: "Orders · Admin" };

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const status = typeof searchParams.status === "string" ? (searchParams.status as OrderStatus) : undefined;
  const source = typeof searchParams.source === "string" ? (searchParams.source as OrderSource) : undefined;
  const orders = await getAllOrdersForAdmin({ search, status, source });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl">Orders</h1>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/admin/orders/export"
            className="border border-border px-4 py-2.5 text-sm font-medium text-text hover:border-primary"
          >
            Export CSV
          </a>
          <Link
            href="/admin/orders/new"
            className="flex items-center gap-1.5 bg-primary px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            <Plus size={15} aria-hidden />
            New manual order
          </Link>
        </div>
      </div>

      <form className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={search}
          placeholder="Search by name, email, or phone"
          className="flex-1 border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:max-w-xs"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          name="source"
          defaultValue={source ?? ""}
          className="border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">All sources</option>
          <option value="online">Online</option>
          <option value="manual">Manual</option>
        </select>
        <button type="submit" className="border border-border px-4 py-2 text-sm font-medium text-text hover:border-primary">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-background-alt">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-text hover:text-primary">
                    {order.guest_name ?? order.guest_email ?? "Registered customer"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text capitalize">{order.source}</td>
                <td className="px-4 py-3 text-text">{STATUS_LABEL[order.status]}</td>
                <td className="px-4 py-3 text-text">{order.item_count}</td>
                <td className="px-4 py-3 text-text">{formatCurrency(order.grand_total, order.currency)}</td>
                <td className="px-4 py-3 text-text">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                  No orders match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
