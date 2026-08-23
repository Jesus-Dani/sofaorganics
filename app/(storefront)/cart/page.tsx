"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/components/cart/cart-context";
import { formatCurrency } from "@/lib/utils/format-currency";
import { PlaceholderPhoto } from "@/components/ui/placeholder-photo";

export default function CartPage() {
  const { lines, setQuantity, removeLine, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="wrap py-20 text-center">
        <p className="eyebrow mb-4">Cart</p>
        <h1 className="text-[28px]">Your cart is empty.</h1>
        <Link href="/shop" className="mt-6 inline-block bg-primary px-6 py-3 text-sm font-medium text-background">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap py-10 md:py-14">
      <h1 className="text-[32px]">Your Cart</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-border border-y border-border">
          {lines.map((line) => (
            <li key={line.variantId} className="flex gap-4 py-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-background-alt">
                {line.image ? (
                  <Image src={line.image} alt={line.productName} fill className="object-cover" sizes="96px" />
                ) : (
                  <PlaceholderPhoto label={line.productName} />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg text-text">{line.productName}</p>
                    <p className="text-sm text-text-muted">{line.sizeLabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.variantId)}
                    aria-label={`Remove ${line.productName}`}
                    className="text-text-muted hover:text-accent"
                  >
                    <Trash size={17} aria-hidden />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center"
                    >
                      <Minus size={13} aria-hidden />
                    </button>
                    <span className="w-8 text-center text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center"
                    >
                      <Plus size={13} aria-hidden />
                    </button>
                  </div>
                  <p className="font-semibold text-text">{formatCurrency(line.unitPrice * line.quantity, line.currency)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit border border-border p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Subtotal</span>
            <span className="font-semibold text-text">{formatCurrency(subtotal, lines[0]?.currency ?? "NGN")}</span>
          </div>
          <p className="mt-1 text-xs text-text-muted">Shipping and tax are calculated at checkout.</p>
          <Link
            href="/checkout/start"
            prefetch={false}
            className="mt-5 block w-full bg-primary py-3.5 text-center text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
