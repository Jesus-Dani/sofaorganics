"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { FieldError } from "@/components/ui/field-error";

const passwordSchema = z.object({
  password: z.string().min(8, "At least 8 characters"),
});
type PasswordValues = z.infer<typeof passwordSchema>;

export function PasswordChangeForm() {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = handleSubmit(async ({ password }) => {
    setSaveError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setSaveError(error.message);
      return;
    }
    reset({ password: "" });
    setSavedAt(Date.now());
  });

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <h2 className="text-lg font-semibold text-text">Change password</h2>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text">New password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>
      <FieldError id="password-save-error" message={saveError ?? undefined} />
      {savedAt && !saveError && <p className="text-sm text-primary">Password updated.</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-border px-6 py-3 text-sm font-medium text-text hover:border-primary disabled:opacity-60"
      >
        {isSubmitting ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
