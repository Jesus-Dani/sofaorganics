"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const setupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "At least 8 characters"),
});
type SetupValues = z.infer<typeof setupSchema>;

type Status = "checking" | "closed" | "already-admin" | "form" | "claiming";

/**
 * Self-closing bootstrap for the one admin account (PRD §7). One form, no
 * separate manual "claim" step: submitting tries sign-in then sign-up, and
 * claims automatically the moment a session exists. If email confirmation is
 * on and no session comes back, the same form stays up so re-submitting the
 * same details after confirming finishes the job. If the user arrives already
 * signed in (e.g. clicked a confirmation link), claiming happens immediately
 * on load with no button to click.
 */
export default function AdminSetupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupValues>({ resolver: zodResolver(setupSchema) });

  const claimAdmin = async () => {
    const supabase = createSupabaseBrowserClient();
    const { error: claimError } = await supabase.rpc("claim_admin_bootstrap");
    if (claimError) {
      setError(claimError.message);
      setStatus("form");
      return;
    }
    router.push("/admin");
  };

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    (async () => {
      const { data: available } = await supabase.rpc("admin_bootstrap_available");
      if (!available) {
        const { data: isAdmin } = await supabase.rpc("is_admin", {
          uid: (await supabase.auth.getUser()).data.user?.id ?? "",
        });
        setStatus(isAdmin ? "already-admin" : "closed");
        return;
      }
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setStatus("claiming");
        await claimAdmin();
        return;
      }
      setStatus("form");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);

    const supabase = createSupabaseBrowserClient();

    // Try signing in first — covers "signed up earlier but the session was
    // lost before claiming" without needing /admin/login, which (correctly)
    // signs non-admins back out and would wipe this session again.
    const signInResult = await supabase.auth.signInWithPassword({ email, password });
    if (signInResult.data.session) {
      setStatus("claiming");
      await claimAdmin();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (!data.session) {
      setError("Check your email to confirm your account, then submit this form again with the same details to finish.");
      return;
    }
    setStatus("claiming");
    await claimAdmin();
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-4 text-center">Admin Setup</p>

      {status === "checking" && <p className="text-center text-text-muted">Checking…</p>}
      {status === "claiming" && <p className="text-center text-text-muted">Setting up your admin account…</p>}

      {status === "closed" && (
        <p className="text-center text-text-muted">
          An admin account already exists. <a href="/admin/login" className="underline text-primary">Sign in</a>.
        </p>
      )}

      {status === "already-admin" && (
        <p className="text-center text-text-muted">
          You&apos;re already the admin. <a href="/admin" className="underline text-primary">Go to admin</a>.
        </p>
      )}

      {status === "form" && (
        <form onSubmit={onSubmit} className="space-y-4">
          <p className="text-center text-sm text-text-muted">
            Enter the email and password for the store&apos;s one admin account. If it doesn&apos;t exist yet, this
            creates it.
          </p>
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
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-accent">
                <WarningCircle size={13} aria-hidden />
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text">
              Password
            </label>
            <input
              id="password"
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary py-3.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Continuing…" : "Continue"}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-4 flex items-start gap-1.5 text-center text-xs text-accent">
          <WarningCircle size={13} className="mt-0.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
