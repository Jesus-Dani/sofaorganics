"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/admin/actions";
import type { OrderStatus } from "@/types/database.types";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (next: OrderStatus) => {
    setError(null);
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, next);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't update status");
      }
    });
  };

  return (
    <div>
      <select
        defaultValue={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-text">{error}</p>}
    </div>
  );
}
