import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Unused until NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 * (see .env.example). lib/data/products.ts will read from this client instead
 * of the local seed data once a project is provisioned.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase env vars are not set — see .env.example.");
  }
  return createClient<Database>(url, anonKey);
}
