/** Currency is per-row in the schema (TRD §2.1), never hardcoded to NGN — always pass it through. */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
