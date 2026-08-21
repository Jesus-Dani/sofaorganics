"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "At least 8 characters"),
});
type SignupValues = z.infer<typeof signupSchema>;

export default function AccountSignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = handleSubmit(async ({ fullName, email, password }) => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.session || !data.user) {
      setNeedsConfirmation(true);
      return;
    }

    await supabase.from("customer_profiles").update({ full_name: fullName }).eq("id", data.user.id);
    router.push("/account");
    router.refresh();
  });

  if (needsConfirmation) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16 text-center">
        <p className="eyebrow mb-4">Almost there</p>
        <h1 className="text-2xl">Check your email</h1>
        <p className="mt-3 text-sm text-text-muted">
          We&apos;ve sent a confirmation link. Once you confirm, come back and sign in.
        </p>
        <Link href="/account/login" className="mt-6 text-sm font-medium text-primary underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <p className="eyebrow mb-2 text-center">Sofa Organics</p>
      <h1 className="mb-6 text-center text-2xl">Create an account</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-text">
            Full name
          </label>
          <input
            id="fullName"
            {...register("fullName")}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          {errors.fullName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-accent">
              <WarningCircle size={13} aria-hidden />
              {errors.fullName.message}
            </p>
          )}
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

        {error && (
          <p className="flex items-start gap-1.5 text-xs text-accent">
            <WarningCircle size={13} className="mt-0.5 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary py-3.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-text-muted">
        Already have an account?{" "}
        <Link href="/account/login" className="font-medium text-primary underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
