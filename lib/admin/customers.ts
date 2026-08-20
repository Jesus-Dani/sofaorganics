import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import type { CustomerSummary, OrderRow } from "@/types/database.types";

export async function getAllCustomersForAdmin(): Promise<CustomerSummary[]> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_list_customers", {});
  if (error) throw error;
  return data ?? [];
}

/**
 * `key` is a customer_id (uuid) for registered customers, or a URL-decoded guest
 * email/phone otherwise (email for online guest checkout, phone for a manual order
 * — manual orders never collect an email).
 */
export async function getCustomerDetail(key: string): Promise<CustomerSummary | null> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key);

  const { data, error } = await supabase.rpc(
    "admin_list_customers",
    isUuid ? { p_customer_id: key } : { p_guest_key: key }
  );
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function getCustomerOrders(customer: CustomerSummary): Promise<OrderRow[]> {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (customer.customer_id) {
    query = query.eq("customer_id", customer.customer_id);
  } else if (customer.email) {
    query = query.is("customer_id", null).eq("guest_email", customer.email);
  } else {
    query = query.is("customer_id", null).eq("guest_phone", customer.phone ?? "");
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
