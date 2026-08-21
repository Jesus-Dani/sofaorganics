"use client";

import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AccountSignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/account/login");
        router.refresh();
      }}
      className="flex items-center gap-2 text-sm text-text-muted hover:text-accent"
    >
      <SignOut size={16} aria-hidden />
      Sign out
    </button>
  );
}
