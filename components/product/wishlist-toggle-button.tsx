"use client";

import { useState, useTransition } from "react";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { toggleWishlistItem } from "@/lib/customer/actions";

export function WishlistToggleButton({
  variantId,
  initialSaved,
  className = "",
}: {
  variantId: string;
  initialSaved: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      try {
        await toggleWishlistItem(variantId, saved);
      } catch (err) {
        // A signed-out click makes the action redirect to /account/login — Next.js
        // signals that via a thrown error tagged with a NEXT_REDIRECT digest, which
        // must propagate (not be swallowed as a failure) so the navigation happens.
        const digest = (err as { digest?: string } | null)?.digest;
        if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) throw err;
        setSaved(!next);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      className={`flex h-8 w-8 items-center justify-center bg-background/90 text-text transition-colors hover:text-accent disabled:opacity-60 ${className}`}
    >
      <Heart size={18} weight={saved ? "fill" : "regular"} className={saved ? "text-accent" : undefined} aria-hidden />
    </button>
  );
}
