import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllOrdersForAdmin } from "@/lib/admin/orders";
import { toCsv } from "@/lib/utils/csv";

export async function GET() {
  await requireAdmin();
  const orders = await getAllOrdersForAdmin();

  const csv = toCsv(
    ["Order ID", "Customer", "Email", "Phone", "Source", "Status", "Items", "Subtotal", "Shipping", "Tax", "Total", "Currency", "Created At"],
    orders.map((o) => [
      o.id,
      o.guest_name,
      o.guest_email,
      o.guest_phone,
      o.source,
      o.status,
      o.item_count,
      o.subtotal,
      o.shipping_total,
      o.tax_total,
      o.grand_total,
      o.currency,
      o.created_at,
    ])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
