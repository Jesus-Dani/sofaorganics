"use client";

import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, Trash, X } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/components/cart/cart-context";
import { formatCurrency } from "@/lib/utils/format-currency";
import { PlaceholderPhoto } from "@/components/ui/placeholder-photo";

export function CartDrawer() {
  const { lines, isOpen, closeCart, openCart, setQuantity, removeLine, itemCount, subtotal } = useCart();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(next) => (next ? openCart() : closeCart())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-text/40" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <Dialog.Title className="font-serif text-lg">
              Your Cart {itemCount > 0 ? `(${itemCount})` : ""}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close cart" className="p-1">
                <X size={20} aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-text-muted">Your cart is empty.</p>
              <Dialog.Close asChild>
                <Link href="/shop" className="text-sm font-medium text-primary underline">
                  Browse the shop →
                </Link>
              </Dialog.Close>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="space-y-5">
                {lines.map((line) => (
                  <li key={line.variantId} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-background-alt">
                      {line.image ? (
                        <Image src={line.image} alt={line.productName} fill className="object-cover" sizes="80px" />
                      ) : (
                        <PlaceholderPhoto label={line.productName} />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-text">{line.productName}</p>
                          <p className="text-xs text-text-muted">{line.sizeLabel}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(line.variantId)}
                          aria-label={`Remove ${line.productName} from cart`}
                          className="text-text-muted hover:text-accent"
                        >
                          <Trash size={16} aria-hidden />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center"
                          >
                            <Minus size={12} aria-hidden />
                          </button>
                          <span className="w-6 text-center text-sm">{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center"
                          >
                            <Plus size={12} aria-hidden />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatCurrency(line.unitPrice * line.quantity, line.currency)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lines.length > 0 && (
            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-semibold text-text">
                  {formatCurrency(subtotal, lines[0]?.currency ?? "NGN")}
                </span>
              </div>
              <Dialog.Close asChild>
                <Link
                  href="/checkout"
                  className="block w-full bg-primary py-3.5 text-center text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Proceed to Checkout
                </Link>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Link href="/cart" className="mt-2 block text-center text-xs text-text-muted underline">
                  View full cart
                </Link>
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
