"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/cart-context";

/**
 * Clears the cart once we're actually on the confirmation page for a paid order —
 * not the instant checkout submits. Clearing earlier (while the checkout form was
 * still mounted) flashed a "cart is empty" state, and would wipe the cart even if
 * the customer abandoned payment on Paystack without completing it.
 */
export function ClearCartOnMount({ shouldClear }: { shouldClear: boolean }) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (shouldClear) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldClear]);

  return null;
}
