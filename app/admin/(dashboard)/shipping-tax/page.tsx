import { getShippingRulesForAdmin, getTaxRulesForAdmin } from "@/lib/admin/shipping-tax";
import { ShippingRulesTable } from "@/components/admin/shipping-rules-table";
import { TaxRulesTable } from "@/components/admin/tax-rules-table";

export const metadata = { title: "Shipping & Tax · Admin" };

export default async function ShippingTaxPage() {
  const [shippingRules, taxRules] = await Promise.all([getShippingRulesForAdmin(), getTaxRulesForAdmin()]);

  return (
    <div className="max-w-2xl space-y-10">
      <h1 className="text-2xl">Shipping & Tax</h1>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">Shipping zones</h2>
        <ShippingRulesTable rules={shippingRules} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">Tax rules</h2>
        <TaxRulesTable rules={taxRules} />
      </section>
    </div>
  );
}
