"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format-currency";

export function PaySimulator({
  orderId,
  grandTotal,
  currency,
}: {
  orderId: string;
  grandTotal: number;
  currency: string;
}) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulatePayment = async () => {
    setIsPaying(true);
    setError(null);
    try {
      const response = await fetch(`/api/checkout/${orderId}/simulate-payment`, { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Payment simulation failed.");
      router.push(`/checkout/${orderId}/confirmation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment simulation failed.");
      setIsPaying(false);
    }
  };

  return (
    <div className="mt-8 border border-border p-6">
      <p className="text-sm text-text-muted">Amount due</p>
      <p className="mt-1 text-2xl font-semibold text-text">{formatCurrency(grandTotal, currency)}</p>
      <button
        type="button"
        onClick={handleSimulatePayment}
        disabled={isPaying}
        className="mt-5 w-full bg-accent py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPaying ? "Processing…" : "Simulate Payment"}
      </button>
      {error && <p className="mt-3 text-xs text-accent">{error}</p>}
    </div>
  );
}
