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

  const handleClick = () => {
    startTransition(async () => {
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
      await toggleWishlistItem(item.variantId, true); // moves it: remove from wishlist once added to cart
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || item.stockQuantity === 0}
      className="w-full border border-border py-2 text-xs font-medium text-text hover:border-primary disabled:opacity-50"
    >
      {item.stockQuantity === 0 ? "Out of Stock" : isPending ? "Moving…" : "Move to Cart"}
    </button>
  );
}
