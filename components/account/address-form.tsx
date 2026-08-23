"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upsertAddress } from "@/lib/customer/actions";
import { addressFormSchema, type AddressFormValues } from "@/lib/customer/schema";
import { FieldError } from "@/components/ui/field-error";
import type { AddressRow } from "@/types/database.types";

export function AddressForm({ address, onDone }: { address?: AddressRow; onDone: () => void }) {
  const router = useRouter();
  const [saveError, setSaveError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      id: address?.id,
      label: address?.label ?? "",
      line1: address?.line1 ?? "",
      line2: address?.line2 ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      country: address?.country ?? "Nigeria",
      postalCode: address?.postal_code ?? "",
      isDefault: address?.is_default ?? false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSaveError(null);
    try {
      await upsertAddress(values);
      router.refresh();
      onDone();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save this address");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-border p-5">
      <div>
        <label htmlFor="address-label" className="mb-1.5 block text-sm font-medium text-text">
          Label (optional)
        </label>
        <input
          id="address-label"
          {...register("label")}
          placeholder="e.g. Home, Office"
          className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="address-line1" className="mb-1.5 block text-sm font-medium text-text">
          Street address
        </label>
        <input
          id="address-line1"
          {...register("line1")}
          className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
        <FieldError message={errors.line1?.message} />
      </div>
      <div>
        <label htmlFor="address-line2" className="mb-1.5 block text-sm font-medium text-text">
          Apartment, suite, etc. (optional)
        </label>
        <input
          id="address-line2"
          {...register("line2")}
          className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="address-city" className="mb-1.5 block text-sm font-medium text-text">
            City
          </label>
          <input
            id="address-city"
            {...register("city")}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <FieldError message={errors.city?.message} />
        </div>
        <div>
          <label htmlFor="address-state" className="mb-1.5 block text-sm font-medium text-text">
            State
          </label>
          <input
            id="address-state"
            {...register("state")}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <FieldError message={errors.state?.message} />
        </div>
      </div>
      <div>
        <label htmlFor="address-postal-code" className="mb-1.5 block text-sm font-medium text-text">
          Postal code (optional)
        </label>
        <input
          id="address-postal-code"
          {...register("postalCode")}
          className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-text">
        <input type="checkbox" {...register("isDefault")} />
        Set as default address
      </label>

      <FieldError message={saveError ?? undefined} />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary px-6 py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Save address"}
        </button>
        <button type="button" onClick={onDone} className="px-6 py-2.5 text-sm font-medium text-text-muted hover:text-text">
          Cancel
        </button>
      </div>
    </form>
  );
}
