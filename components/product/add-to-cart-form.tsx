"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { CaretDown, Check, Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import type { Product } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils/format-currency";
import { StockBadge } from "@/components/product/stock-badge";
import { WishlistToggleButton } from "@/components/product/wishlist-toggle-button";
import { useCart } from "@/components/cart/cart-context";

export function AddToCartForm({
  product,
  wishlistedVariantIds,
}: {
  product: Product;
  wishlistedVariantIds: string[];
}) {
  const { addLine, openCart } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  // Sticky mobile bar only appears once the main Add to Cart button has scrolled
  // out of view — avoids showing two identical calls-to-action at once.
  useEffect(() => {
    const target = mainButtonRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry && setShowStickyBar(!entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // The floating WhatsApp button shares the bottom-right corner with this bar —
  // push it up out of the way while the sticky bar is showing.
  useEffect(() => {
    document.documentElement.style.setProperty("--whatsapp-bottom-offset", showStickyBar ? "5.5rem" : "1.5rem");
    return () => document.documentElement.style.setProperty("--whatsapp-bottom-offset", "1.5rem");
  }, [showStickyBar]);

  if (!variant) return null;

  const outOfStock = variant.stockStatus === "out_of_stock";
  const cover = product.images[0];

  const handleAdd = () => {
    addLine(
      {
        productSlug: product.slug,
        productName: product.name,
        image: cover && !cover.isPlaceholder ? cover.src : "",
        sizeLabel: variant.sizeLabel,
        variantId: variant.id,
        unitPrice: variant.price,
        currency: variant.currency,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-3">
        <p className="text-2xl font-semibold text-text">{formatCurrency(variant.price, variant.currency)}</p>
        <StockBadge status={variant.stockStatus} />
      </div>

      <div>
        <label id="variant-size-label" className="mb-1.5 block text-sm font-medium text-text">Size</label>
        <Select.Root value={variant.id} onValueChange={(v) => setVariantId(v)}>
          <Select.Trigger
            aria-labelledby="variant-size-label"
            className="flex w-full items-center justify-between border border-border px-4 py-3 text-sm text-text"
          >
            <Select.Value />
            <Select.Icon>
              <CaretDown size={14} aria-hidden />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-50 border border-border bg-background shadow-lg">
              <Select.Viewport>
                {product.variants.map((v) => (
                  <Select.Item
                    key={v.id}
                    value={v.id}
                    disabled={v.stockStatus === "out_of_stock"}
                    className="flex cursor-pointer items-center justify-between gap-6 px-4 py-2.5 text-sm text-text outline-none data-[highlighted]:bg-background-alt data-[disabled]:cursor-not-allowed data-[disabled]:text-text-muted"
                  >
                    <Select.ItemText>
                      {v.sizeLabel} · {formatCurrency(v.price, v.currency)}
                      {v.stockStatus === "out_of_stock" ? " (Out of Stock)" : ""}
                    </Select.ItemText>
                    <Select.ItemIndicator>
                      <Check size={14} aria-hidden />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center"
          >
            <Minus size={14} aria-hidden />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center"
          >
            <Plus size={14} aria-hidden />
          </button>
        </div>

        <button
          ref={mainButtonRef}
          type="button"
          disabled={outOfStock}
          onClick={handleAdd}
          className="flex-1 bg-primary py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-background-alt disabled:text-text-muted"
        >
          {outOfStock ? "Out of Stock" : justAdded ? "Added" : "Add to Cart"}
        </button>

        <WishlistToggleButton
          key={variant.id}
          variantId={variant.id}
          initialSaved={wishlistedVariantIds.includes(variant.id)}
          className="h-[46px] w-[46px] border border-border"
        />
      </div>

      <button type="button" onClick={openCart} className="text-xs text-text-muted underline">
        View cart
      </button>

      <div
        aria-hidden={!showStickyBar}
        className={`fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-border bg-background px-5 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] transition-transform duration-200 md:hidden ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <p className="text-base font-semibold text-text">{formatCurrency(variant.price, variant.currency)}</p>
        <button
          type="button"
          disabled={outOfStock || !showStickyBar}
          onClick={handleAdd}
          className="flex-1 bg-primary py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-background-alt disabled:text-text-muted"
        >
          {outOfStock ? "Out of Stock" : justAdded ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
