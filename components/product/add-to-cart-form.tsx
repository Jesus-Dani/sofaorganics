"use client";

import { useMemo, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { CaretDown, Check, Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import type { Product } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils/format-currency";
import { StockBadge } from "@/components/product/stock-badge";
import { useCart } from "@/components/cart/cart-context";

export function AddToCartForm({ product }: { product: Product }) {
  const { addLine, openCart } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  if (!variant) return null;

  const outOfStock = variant.stockStatus === "out_of_stock";
  const cover = product.images[0];

  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-3">
        <p className="text-2xl font-semibold text-text">{formatCurrency(variant.price, variant.currency)}</p>
        <StockBadge status={variant.stockStatus} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text">Size</label>
        <Select.Root value={variant.id} onValueChange={(v) => setVariantId(v)}>
          <Select.Trigger className="flex w-full items-center justify-between border border-border px-4 py-3 text-sm text-text">
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
          type="button"
          disabled={outOfStock}
          onClick={() => {
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
          }}
          className="flex-1 bg-primary py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-background-alt disabled:text-text-muted"
        >
          {outOfStock ? "Out of Stock" : justAdded ? "Added" : "Add to Cart"}
        </button>
      </div>

      <button type="button" onClick={openCart} className="text-xs text-text-muted underline">
        View cart
      </button>
    </div>
  );
}
