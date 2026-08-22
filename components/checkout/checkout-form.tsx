"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/components/cart/cart-context";
import { checkoutSchema, type CheckoutValues } from "@/lib/checkout/schema";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { AddressRow, ShippingRuleRow } from "@/types/database.types";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-accent">
      <WarningCircle size={13} aria-hidden />
      {message}
    </p>
  );
}

export function CheckoutForm({
  zones,
  taxRatePercent,
  savedAddresses,
}: {
  zones: ShippingRuleRow[];
  taxRatePercent: number;
  savedAddresses: AddressRow[];
}) {
  const router = useRouter();
  const { lines, subtotal } = useCart();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { shippingZone: zones[0]?.zone_name ?? "" },
  });

  const selectedZone = watch("shippingZone");
  const shippingTotal = useMemo(
    () => zones.find((z) => z.zone_name === selectedZone)?.rate ?? 0,
    [zones, selectedZone]
  );
  const taxTotal = useMemo(() => Math.round((subtotal * taxRatePercent) / 100), [subtotal, taxRatePercent]);
  const grandTotal = subtotal + shippingTotal + taxTotal;
  const currency = lines[0]?.currency ?? "NGN";

  if (lines.length === 0) {
    return (
      <div className="mt-10 border border-dashed border-border py-16 text-center">
        <p className="text-text-muted">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-primary underline">
          Browse the shop
        </Link>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          cartItems: lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity })),
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error ?? "Something went wrong placing your order.");
      }

      // Cart is cleared once we actually reach the confirmation page (a real "paid"
      // signal), not here — clearing it now, while this form is still mounted, made
      // it re-render with lines.length === 0 and flash the "cart is empty" state
      // before the navigation to /pay (and then Paystack) even finished. It also
      // wiped the cart even if the customer abandoned payment on Paystack.
      router.push(`/checkout/${json.orderId}/pay`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong placing your order.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-10 md:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-serif">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
                Full name
              </label>
              <input
                id="name"
                {...register("name")}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-serif">Shipping address</h2>
          {savedAddresses.length > 0 && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-text">Use a saved address</label>
              <select
                defaultValue=""
                onChange={(e) => {
                  const address = savedAddresses.find((a) => a.id === e.target.value);
                  if (!address) return;
                  setValue("line1", address.line1);
                  setValue("line2", address.line2 ?? "");
                  setValue("city", address.city);
                  setValue("state", address.state);
                  setValue("postalCode", address.postal_code ?? "");
                }}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">Enter a new address below…</option>
                {savedAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.label ? `${address.label} — ` : ""}
                    {address.line1}, {address.city}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="line1" className="mb-1.5 block text-sm font-medium text-text">
                Street address
              </label>
              <input
                id="line1"
                {...register("line1")}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <FieldError message={errors.line1?.message} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="line2" className="mb-1.5 block text-sm font-medium text-text">
                Apartment, suite, etc. (optional)
              </label>
              <input
                id="line2"
                {...register("line2")}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-text">
                City
              </label>
              <input
                id="city"
                {...register("city")}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <FieldError message={errors.city?.message} />
            </div>
            <div>
              <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-text">
                State
              </label>
              <input
                id="state"
                {...register("state")}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <FieldError message={errors.state?.message} />
            </div>
            <div>
              <label htmlFor="postalCode" className="mb-1.5 block text-sm font-medium text-text">
                Postal code (optional)
              </label>
              <input
                id="postalCode"
                {...register("postalCode")}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-serif">Shipping method</h2>
          <div className="space-y-2">
            {zones.map((zone) => (
              <label
                key={zone.zone_name}
                className="flex cursor-pointer items-center justify-between border border-border px-4 py-3 text-sm has-[:checked]:border-primary"
              >
                <span className="flex items-center gap-3">
                  <input type="radio" value={zone.zone_name} {...register("shippingZone")} />
                  {zone.zone_name}
                </span>
                <span className="font-medium">{formatCurrency(zone.rate, "NGN")}</span>
              </label>
            ))}
          </div>
          <FieldError message={errors.shippingZone?.message} />
        </section>
      </div>

      <div className="h-fit space-y-4 border border-border p-6">
        <h2 className="text-lg font-serif">Order summary</h2>
        <ul className="space-y-2 border-b border-border pb-4 text-sm">
          {lines.map((line) => (
            <li key={line.variantId} className="flex justify-between text-text-muted">
              <span>
                {line.productName} ({line.sizeLabel}) × {line.quantity}
              </span>
              <span>{formatCurrency(line.unitPrice * line.quantity, line.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Subtotal</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Shipping</span>
            <span>{formatCurrency(shippingTotal, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Tax ({taxRatePercent}%)</span>
            <span>{formatCurrency(taxTotal, currency)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-text">
            <span>Total</span>
            <span>{formatCurrency(grandTotal, currency)}</span>
          </div>
        </div>

        {submitError && (
          <div className="flex items-start gap-2 border border-accent bg-error-surface px-3 py-2.5 text-xs text-accent">
            <WarningCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Placing order…" : "Place order"}
        </button>
      </div>
    </form>
  );
}
