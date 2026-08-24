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

const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name"),
    lastName: z.string().trim().min(1, "Enter your last name"),
    phone: z.string().trim().min(7, "Enter a valid phone number"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(8, "At least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type SignupValues = z.infer<typeof signupSchema>;

export default function AccountSignupPage() {
  return (
    <Suspense fallback={null}>
      <AccountSignupForm />
    </Suspense>
  );
}

function AccountSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const loginHref = redirectTo !== "/" ? `/account/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/account/login";
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = handleSubmit(async ({ firstName, lastName, phone, email, password }) => {
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

    // Upsert rather than update: the auth.users insert trigger normally creates this
    // row already, but upserting is resilient even if that row doesn't exist yet for
    // any reason, instead of silently no-op'ing like a plain update would.
    await supabase
      .from("customer_profiles")
      .upsert({ id: data.user.id, full_name: `${firstName} ${lastName}`.trim(), phone }, { onConflict: "id" });
    router.push(redirectTo);
  });

  if (needsConfirmation) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16 text-center">
        <p className="eyebrow mb-4">Almost there</p>
        <h1 className="text-2xl">Check your email</h1>
        <p className="mt-3 text-sm text-text">
          We&apos;ve sent a confirmation link. Once you confirm, come back and sign in.
        </p>
        <Link href={loginHref} className="mt-6 text-sm font-medium text-primary underline">
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-text">
              First name
            </label>
            <input
              id="firstName"
              {...register("firstName")}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <FieldError id="firstName-error" message={errors.firstName?.message} />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-text">
              Last name
            </label>
            <input
              id="lastName"
              {...register("lastName")}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <FieldError id="lastName-error" message={errors.lastName?.message} />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <FieldError id="phone-error" message={errors.phone?.message} />
        </div>
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
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-text">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <FieldError id="confirmPassword-error" message={errors.confirmPassword?.message} />
        </div>

        {error && (
          <p className="flex items-start gap-1.5 text-xs text-text">
            <WarningCircle size={13} className="mt-0.5 shrink-0 text-accent" aria-hidden />
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
        <Link href={loginHref} className="font-medium text-primary underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
