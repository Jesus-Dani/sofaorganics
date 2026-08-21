import type { Metadata } from "next";
import { getShippingZones, getTaxRate } from "@/lib/data/shipping-tax";
import { getCustomerId } from "@/lib/customer/auth";
import { getAddressesForCustomerId } from "@/lib/customer/addresses";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const customerId = await getCustomerId();
  const [zones, taxRule, savedAddresses] = await Promise.all([
    getShippingZones(),
    getTaxRate(),
    customerId ? getAddressesForCustomerId(customerId) : Promise.resolve([]),
  ]);

  return (
    <div className="wrap py-10 md:py-14">
      <h1 className="text-[32px]">Checkout</h1>
      <CheckoutForm zones={zones} taxRatePercent={taxRule?.rate_percent ?? 0} savedAddresses={savedAddresses} />
    </div>
  );
}
