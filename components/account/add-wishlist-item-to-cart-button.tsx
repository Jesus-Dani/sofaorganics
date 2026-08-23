"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { toggleWishlistItem } from "@/lib/customer/actions";
import type { WishlistCard } from "@/lib/customer/wishlist";

export function AddWishlistItemToCartButton({ item }: { item: WishlistCard }) {
  const router = useRouter();
  const { addLine } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      try {
        // Remove from the wishlist first — only add to cart once that's confirmed,
        // so a failure here can't leave the item duplicated in both places.
        await toggleWishlistItem(item.variantId, true);
        addLine(
          {
            productSlug: item.productSlug,
            productName: item.productName,
            image: item.image,
            sizeLabel: item.sizeLabel,
            variantId: item.variantId,
            unitPrice: item.price,
            currency: item.currency,
          },
          1
        );
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't move this item to your cart");
      }
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || item.stockQuantity === 0}
        className="w-full border border-border py-2 text-xs font-medium text-text hover:border-primary disabled:opacity-50"
      >
        {item.stockQuantity === 0 ? "Out of Stock" : isPending ? "Moving…" : "Move to Cart"}
      </button>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}
