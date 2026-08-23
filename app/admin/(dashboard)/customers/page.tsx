import Link from "next/link";
import { getAllCustomersForAdmin } from "@/lib/admin/customers";
import { formatCurrency } from "@/lib/utils/format-currency";

export const metadata = { title: "Customers · Admin" };

export default async function AdminCustomersPage() {
  const customers = await getAllCustomersForAdmin();
  const sorted = [...customers].sort((a, b) => b.total_spent - a.total_spent);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl">Customers</h1>
        <a
          href="/admin/customers/export"
          className="border border-border px-4 py-2.5 text-sm font-medium text-text hover:border-primary"
        >
          Export CSV
        </a>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Lifetime spend</th>
              <th className="px-4 py-3">Last order</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((customer) => (
              <tr key={customer.customer_key} className="border-b border-border last:border-0 hover:bg-background-alt">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${encodeURIComponent(customer.customer_id ?? customer.email ?? customer.phone ?? "")}`}
                    className="font-medium text-text hover:text-primary"
                  >
                    {customer.full_name ?? "Unnamed customer"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted">{customer.email ?? customer.phone ?? "—"}</td>
                <td className="px-4 py-3 text-text-muted">{customer.is_guest ? "Guest / Manual" : "Registered"}</td>
                <td className="px-4 py-3 text-text-muted">{customer.order_count}</td>
                <td className="px-4 py-3 text-text-muted">{formatCurrency(customer.total_spent, "NGN")}</td>
                <td className="px-4 py-3 text-text-muted">{new Date(customer.last_order_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
