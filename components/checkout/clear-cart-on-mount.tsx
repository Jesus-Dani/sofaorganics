"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/cart-context";

/**
 * Clears the cart once we're actually on the confirmation page for a paid order —
 * not the instant checkout submits. Clearing earlier (while the checkout form was
 * still mounted) flashed a "cart is empty" state, and would wipe the cart even if
 * the customer abandoned payment on Paystack without completing it.
 *
 * Must wait for hydrated: on a fresh page load (e.g. the full-page redirect back
 * from Paystack), this component's mount effect fires before CartProvider's own
 * localStorage-read effect (children fire before parents on initial mount) — clearing
 * immediately would just get silently overwritten a moment later when hydration sets
 * lines from whatever was still in localStorage.
 */
export function ClearCartOnMount({ shouldClear }: { shouldClear: boolean }) {
  const { hydrated, clearCart } = useCart();

  useEffect(() => {
    if (shouldClear && hydrated) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldClear, hydrated]);

  return null;
}
