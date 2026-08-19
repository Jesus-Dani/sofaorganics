import type { StockStatus } from "@/types/database.types";
import { STOCK_STATUS_LABEL } from "@/lib/utils/stock-status";

const STYLES: Record<StockStatus, string> = {
  in_stock: "bg-primary-tint text-primary",
  low_stock: "bg-secondary text-text",
  out_of_stock: "bg-background-alt text-text-muted",
};

export function StockBadge({ status, className = "" }: { status: StockStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${STYLES[status]} ${className}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          status === "in_stock" ? "bg-primary" : status === "low_stock" ? "bg-text" : "bg-text-muted"
        }`}
      />
      {STOCK_STATUS_LABEL[status]}
    </span>
  );
}
