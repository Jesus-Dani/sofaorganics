"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { upsertSiteContent } from "@/lib/admin/actions";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import type { SiteContentKey } from "@/types/database.types";

export function SiteContentForm({ contentKey, bodyRichtext }: { contentKey: SiteContentKey; bodyRichtext: string }) {
  const router = useRouter();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { bodyRichtext } });

  const onSubmit = handleSubmit(async (values) => {
    setSaveError(null);
    try {
      await upsertSiteContent({ key: contentKey, bodyRichtext: values.bodyRichtext });
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save");
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <Controller
        control={control}
        name="bodyRichtext"
        render={({ field }) => <TiptapEditor value={field.value} onChange={field.onChange} />}
      />
      {saveError && <p className="text-sm text-accent">{saveError}</p>}
      {savedAt && !saveError && <p className="text-sm text-primary">Saved.</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary px-8 py-3.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
