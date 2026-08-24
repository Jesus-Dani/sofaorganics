"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { FieldError } from "@/components/ui/field-error";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
type LoginValues = z.infer<typeof loginSchema>;

export default function AccountLoginPage() {
  return (
    <Suspense fallback={null}>
      <AccountLoginForm />
    </Suspense>
  );
}

function AccountLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/account";
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(redirectTo);
  });

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email) {
      setError("Enter your email above first, then click \"Forgot password\".");
      return;
    }
    setError(null);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    setResetSent(true);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-2 text-center">Sofa Organics</p>
      <h1 className="mb-6 text-center text-2xl">Sign in</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <FieldError id="password-error" message={errors.password?.message} />
        </div>

        {error && (
          <p className="flex items-start gap-1.5 text-xs text-text">
            <WarningCircle size={13} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            {error}
          </p>
        )}
        {resetSent && <p className="text-xs text-primary">Check your email for a password reset link.</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary py-3.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs">
        <button type="button" onClick={handleForgotPassword} className="text-text-muted underline hover:text-primary">
          Forgot password?
        </button>
        <Link
          href={redirectTo !== "/account" ? `/account/signup?redirectTo=${encodeURIComponent(redirectTo)}` : "/account/signup"}
          className="font-medium text-primary underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
