import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { OrderRow } from "@/types/database.types";

export interface DashboardStats {
  revenue: number;
  orderCount: number;
  topProducts: { name: string; revenue: number; unitsSold: number }[];
  recentOrders: OrderRow[];
  lowStockVariants: { productName: string; sizeLabel: string; stockQuantity: number; lowStockThreshold: number }[];
}

/** Direct Postgres/JS aggregation (TRD §6.10) — no third-party analytics dependency. */
export async function getDashboardStats(rangeDays: number): Promise<DashboardStats> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString();

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .neq("status", "cancelled")
    .gte("created_at", since)
    .order("created_at", { ascending: false });
  if (ordersError) throw ordersError;

  const revenue = orders.reduce((sum, o) => sum + o.grand_total, 0);
  const orderIds = orders.map((o) => o.id);

  type LineRow = {
    quantity: number;
    unit_price: number;
    order_id: string;
    product_variants: { products: { name: string } } | null;
  };

  let topProducts: DashboardStats["topProducts"] = [];
  if (orderIds.length > 0) {
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("quantity, unit_price, order_id, product_variants(products(name))")
      .in("order_id", orderIds);
    if (itemsError) throw itemsError;

    const totals = new Map<string, { revenue: number; unitsSold: number }>();
    for (const item of items as unknown as LineRow[]) {
      const name = item.product_variants?.products.name ?? "Unknown product";
      const existing = totals.get(name) ?? { revenue: 0, unitsSold: 0 };
      existing.revenue += item.unit_price * item.quantity;
      existing.unitsSold += item.quantity;
      totals.set(name, existing);
    }
    topProducts = [...totals.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  const { data: lowStock, error: lowStockError } = await supabase
    .from("product_variants")
    .select("stock_quantity, low_stock_threshold, size_label, products!inner(name, status)")
    .eq("products.status", "published");
  if (lowStockError) throw lowStockError;

  type VariantRow = { stock_quantity: number; low_stock_threshold: number; size_label: string; products: { name: string } };
  const lowStockVariants = (lowStock as unknown as VariantRow[])
    .filter((v) => v.stock_quantity <= v.low_stock_threshold)
    .map((v) => ({
      productName: v.products.name,
      sizeLabel: v.size_label,
      stockQuantity: v.stock_quantity,
      lowStockThreshold: v.low_stock_threshold,
    }));

  return {
    revenue,
    orderCount: orders.length,
    topProducts,
    recentOrders: orders.slice(0, 5),
    lowStockVariants,
  };
}
