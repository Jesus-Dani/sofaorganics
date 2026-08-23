"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upsertStoreSettings } from "@/lib/admin/actions";
import { storeSettingsFormSchema, type StoreSettingsFormValues } from "@/lib/admin/schema";
import { FieldError } from "@/components/ui/field-error";
import type { StoreSettingsRow } from "@/types/database.types";

export function SettingsForm({ settings }: { settings: StoreSettingsRow }) {
  const router = useRouter();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsFormSchema),
    defaultValues: {
      businessName: settings.business_name,
      whatsappNumber: settings.whatsapp_number ?? "",
      contactEmail: settings.contact_email ?? "",
      notifyOnNewOrder: settings.notify_on_new_order,
      notifyOnLowStock: settings.notify_on_low_stock,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSaveError(null);
    try {
      await upsertStoreSettings(settings.id, values);
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save settings");
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text">Business info</h2>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Business name</label>
          <input
            {...register("businessName")}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <FieldError message={errors.businessName?.message} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">WhatsApp number</label>
          <input
            {...register("whatsappNumber")}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Contact email</label>
          <input
            {...register("contactEmail")}
            className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <FieldError message={errors.contactEmail?.message} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Notifications</h2>
        <p className="text-xs text-text-muted">
          Email notifications aren&apos;t wired up yet — these toggles save your preference for when they are.
        </p>
        <label className="flex items-center gap-2 text-sm text-text">
          <input type="checkbox" {...register("notifyOnNewOrder")} />
          Notify me on new orders
        </label>
        <label className="flex items-center gap-2 text-sm text-text">
          <input type="checkbox" {...register("notifyOnLowStock")} />
          Notify me when stock is low
        </label>
      </section>

      {saveError && <FieldError message={saveError} />}
      {savedAt && !saveError && <p className="text-sm text-primary">Saved.</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary px-8 py-3.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
