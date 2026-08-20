import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllCustomersForAdmin } from "@/lib/admin/customers";
import { toCsv } from "@/lib/utils/csv";

export async function GET() {
  await requireAdmin();
  const customers = await getAllCustomersForAdmin();

  const csv = toCsv(
    ["Name", "Email", "Phone", "Type", "Order Count", "Total Spent", "Avg Order Value", "First Order", "Last Order"],
    customers.map((c) => [
      c.full_name,
      c.email,
      c.phone,
      c.is_guest ? "Guest/Manual" : "Registered",
      c.order_count,
      c.total_spent,
      c.avg_order_value,
      c.first_order_at,
      c.last_order_at,
    ])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
