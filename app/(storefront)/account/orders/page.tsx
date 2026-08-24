import Link from "next/link";
import { getOrdersForCustomer } from "@/lib/customer/orders";
import { formatCurrency } from "@/lib/utils/format-currency";
import { BuyAgainButton } from "@/components/account/buy-again-button";

export const metadata = { title: "My Orders" };

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default async function AccountOrdersPage() {
  const orders = await getOrdersForCustomer();

  return (
    <div className="wrap max-w-2xl py-14 md:py-20">
      <p className="eyebrow mb-2">My Account</p>
      <h1 className="text-[28px]">Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-10 border border-dashed border-border py-16 text-center">
          <p className="text-text">No orders yet.</p>
          <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-primary underline">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border p-5">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/account/orders/${order.id}`} className="font-medium text-text hover:text-primary">
                    Order #{order.id.slice(0, 8)}
                  </Link>
                  <p className="mt-1 text-sm text-text-muted">
                    {STATUS_LABEL[order.status] ?? order.status} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text">{formatCurrency(order.grand_total, order.currency)}</p>
                  <div className="mt-2">
                    <BuyAgainButton orderId={order.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
