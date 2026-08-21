"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reorderItems } from "@/lib/customer/actions";
import { useCart } from "@/components/cart/cart-context";

export function BuyAgainButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { addLine } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        const lines = await reorderItems(orderId);
        const available = lines.filter((line) => line.available);
        if (available.length === 0) {
          setError("None of these items are currently available to reorder.");
          return;
        }
        for (const line of available) {
          addLine(
            {
              productSlug: line.productSlug,
              productName: line.productName,
              image: line.image,
              sizeLabel: line.sizeLabel,
              variantId: line.variantId,
              unitPrice: line.unitPrice,
              currency: line.currency,
            },
            line.quantity
          );
        }
        router.push("/cart");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't reorder these items");
      }
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="border border-border px-4 py-2 text-xs font-medium text-text hover:border-primary disabled:opacity-50"
      >
        {isPending ? "Adding…" : "Buy Again"}
      </button>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}
