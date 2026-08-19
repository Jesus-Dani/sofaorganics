"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const accountSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "At least 8 characters"),
});
type AccountValues = z.infer<typeof accountSchema>;

type Status = "idle" | "success" | "needs-confirmation";

/**
 * PRD's "optional account creation at end of checkout" — a minimal slice,
 * not the full Accounts phase (no login page or order-history UI yet).
 */
export function CreateAccountPrompt({ orderId, defaultEmail }: { orderId: string; defaultEmail: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountValues>({ resolver: zodResolver(accountSchema), defaultValues: { email: defaultEmail } });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);
    const supabase = createSupabaseBrowserClient();

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.session || !data.user) {
      // Email confirmation is required by the project's auth settings — no
      // active session yet, so the order-claim RPC (which checks auth.uid())
      // has to wait until the customer confirms and signs in.
      setStatus("needs-confirmation");
      return;
    }

    const { error: claimError } = await supabase.rpc("claim_order_as_customer", {
      p_order_id: orderId,
      p_customer_id: data.user.id,
    });
    if (claimError) {
      setError(claimError.message);
      return;
    }

    setStatus("success");
  });

  if (status === "success") {
    return (
      <div className="mt-8 border border-primary/40 bg-primary-tint px-5 py-4 text-sm text-text">
        Account created and this order is linked to it.
      </div>
    );
  }

  if (status === "needs-confirmation") {
    return (
      <div className="mt-8 border border-primary/40 bg-primary-tint px-5 py-4 text-sm text-text">
        Almost there — check your email to confirm your new account. Order history and Buy Again
        arrive with the full Accounts phase; this order is safely on record either way.
      </div>
    );
  }

  return (
    <div className="mt-8 border border-border p-6">
      <h2 className="font-serif text-lg">Save your details for next time?</h2>
      <p className="mt-1 text-sm text-text-muted">
        Optional — create an account and this order will be attached to it. Full order history and
        Buy Again are coming in a later phase.
      </p>
      <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="account-email" className="mb-1.5 block text-sm font-medium text-text">
            Email
          </label>
          <input
            id="account-email"
            type="email"
            {...register("email")}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-accent">
              <WarningCircle size={13} aria-hidden />
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="account-password" className="mb-1.5 block text-sm font-medium text-text">
            Password
          </label>
          <input
            id="account-password"
            type="password"
            {...register("password")}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-accent">
              <WarningCircle size={13} aria-hidden />
              {errors.password.message}
            </p>
          )}
        </div>
        {error && (
          <p className="sm:col-span-2 flex items-center gap-1.5 text-xs text-accent">
            <WarningCircle size={13} aria-hidden />
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="sm:col-span-2 bg-primary py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
