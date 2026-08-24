"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldError } from "@/components/ui/field-error";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Say a little more so we can help"),
});
type ContactValues = z.infer<typeof contactSchema>;

/**
 * UI + validation only for this phase — no Route Handler/Resend wiring yet
 * (that arrives with transactional email in a later phase). Submitting shows
 * a local confirmation and directs the visitor to WhatsApp in the meantime.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitted(true);
    reset();
  });

  if (submitted) {
    return (
      <div className="border border-primary/40 bg-primary-tint px-5 py-4 text-sm text-text">
        Thanks, we&apos;ve noted your message. For a faster reply, message us directly on WhatsApp.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <FieldError id="name-error" message={errors.name?.message} />
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
          className="w-full border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="w-full border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <FieldError id="message-error" message={errors.message?.message} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary px-8 py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
