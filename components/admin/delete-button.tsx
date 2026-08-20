"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "@phosphor-icons/react/dist/ssr";

export function DeleteButton({
  onDelete,
  confirmMessage,
  redirectTo,
  label = "Delete",
  className = "",
}: {
  onDelete: () => Promise<void>;
  confirmMessage: string;
  redirectTo?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      try {
        await onDelete();
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't delete");
      }
    });
  };

  return (
    <span>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`flex items-center gap-1.5 text-text-muted hover:text-accent disabled:opacity-50 ${className}`}
      >
        <Trash size={14} aria-hidden />
        {isPending ? "Deleting…" : label}
      </button>
      {error && <span className="ml-2 text-xs text-accent">{error}</span>}
    </span>
  );
}
