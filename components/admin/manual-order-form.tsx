"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { createManualOrder } from "@/lib/admin/actions";
import { manualOrderFormSchema, type ManualOrderFormValues } from "@/lib/admin/schema";
import { formatCurrency } from "@/lib/utils/format-currency";
import { FieldError } from "@/components/ui/field-error";
import type { SellableVariant } from "@/lib/admin/products";

export function ManualOrderForm({ variants }: { variants: SellableVariant[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [includeShipping, setIncludeShipping] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ManualOrderFormValues>({
    resolver: zodResolver(manualOrderFormSchema),
    defaultValues: { lineItems: [], customerName: "", customerPhone: "", paymentMethod: "" },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lineItems" });
  const lineItems = watch("lineItems");
  const total = lineItems.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);

  const results = query.trim()
    ? variants
        .filter(
          (v) =>
            `${v.productName} ${v.sizeLabel}`.toLowerCase().includes(query.trim().toLowerCase()) ||
            v.sku.toLowerCase().includes(query.trim().toLowerCase())
        )
        .slice(0, 8)
    : [];

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const orderId = await createManualOrder({ ...values, shipping: includeShipping ? values.shipping : undefined });
      router.push(`/admin/orders/${orderId}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Couldn't create the order");
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-8 pb-16">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">Items</h2>
        <div className="relative mb-3 max-w-sm">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name or SKU"
            className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          {results.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full border border-border bg-background shadow-lg">
              {results.map((variant) => (
                <li key={variant.variantId}>
                  <button
                    type="button"
                    onClick={() => {
                      append({ variantId: variant.variantId, quantity: 1, unitPrice: variant.price });
                      setQuery("");
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-background-alt"
                  >
                    <span>
                      {variant.productName} — {variant.sizeLabel}
                    </span>
                    <span className="text-text-muted">{formatCurrency(variant.price, variant.currency)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {fields.length > 0 && (
          <div className="space-y-2">
            {fields.map((field, index) => {
              const variant = variants.find((v) => v.variantId === field.variantId);
              return (
                <div key={field.id} className="grid grid-cols-[1fr_100px_140px_auto] items-end gap-2 border border-border p-3">
                  <div>
                    <p className="text-xs text-text-muted">Product</p>
                    <p className="text-sm text-text">
                      {variant ? `${variant.productName} — ${variant.sizeLabel}` : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Qty</label>
                    <input
                      type="number"
                      {...register(`lineItems.${index}.quantity` as const)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Price (₦)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`lineItems.${index}.unitPrice` as const)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label="Remove item"
                    className="mb-1 flex h-9 w-9 items-center justify-center text-text-muted hover:text-accent"
                  >
                    <Trash size={15} aria-hidden />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {errors.lineItems && typeof errors.lineItems.message === "string" && <FieldError message={errors.lineItems.message} />}

        {fields.length > 0 && (
          <p className="mt-3 text-right text-sm font-medium text-text">Total: {formatCurrency(total, "NGN")}</p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">Customer</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Name</label>
            <input
              {...register("customerName")}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <FieldError message={errors.customerName?.message} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Phone</label>
            <input
              {...register("customerPhone")}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <FieldError message={errors.customerPhone?.message} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Payment method</label>
            <input
              {...register("paymentMethod")}
              placeholder="e.g. Cash, Bank transfer, Paid via WhatsApp link"
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <FieldError message={errors.paymentMethod?.message} />
          </div>
        </div>
      </section>

      <section>
        <label className="flex items-center gap-2 text-sm font-medium text-text">
          <input type="checkbox" checked={includeShipping} onChange={(e) => setIncludeShipping(e.target.checked)} />
          Add a shipping address
        </label>
        {includeShipping && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              {...register("shipping.line1")}
              placeholder="Address line 1"
              className="col-span-2 border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <input
              {...register("shipping.line2")}
              placeholder="Address line 2 (optional)"
              className="col-span-2 border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <input
              {...register("shipping.city")}
              placeholder="City"
              className="border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <input
              {...register("shipping.state")}
              placeholder="State"
              className="border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <input
              {...register("shipping.postalCode")}
              placeholder="Postal code (optional)"
              className="border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        )}
      </section>

      {submitError && <FieldError message={submitError} />}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary px-8 py-3.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Creating…" : "Create order"}
      </button>
    </form>
  );
}
