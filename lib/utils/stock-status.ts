import type { StockStatus } from "@/types/database.types";

/** Derived at query time, never stored — mirrors TRD §5 stock-status logic. */
export function deriveStockStatus(stockQuantity: number, lowStockThreshold: number): StockStatus {
  if (stockQuantity <= 0) return "out_of_stock";
  if (stockQuantity <= lowStockThreshold) return "low_stock";
  return "in_stock";
}

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

/** Best status across a product's variants — used on cards where only one badge fits. */
export function aggregateStockStatus(statuses: StockStatus[]): StockStatus {
  if (statuses.includes("in_stock")) return "in_stock";
  if (statuses.includes("low_stock")) return "low_stock";
  return "out_of_stock";
}
