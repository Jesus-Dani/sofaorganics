import { getAddressesForCustomer } from "@/lib/customer/addresses";
import { AddressesManager } from "@/components/account/addresses-manager";

export const metadata = { title: "My Addresses" };

export default async function AddressesPage() {
  const addresses = await getAddressesForCustomer();

  return (
    <div className="wrap max-w-2xl py-14 md:py-20">
      <p className="eyebrow mb-2">My Account</p>
      <h1 className="mb-8 text-[28px]">Saved Addresses</h1>
      <AddressesManager addresses={addresses} />
    </div>
  );
}
