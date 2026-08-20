import { getSellableVariantsForAdmin } from "@/lib/admin/products";
import { ManualOrderForm } from "@/components/admin/manual-order-form";

export const metadata = { title: "New Manual Order · Admin" };

export default async function NewManualOrderPage() {
  const variants = await getSellableVariantsForAdmin();

  return (
    <div>
      <h1 className="mb-6 text-2xl">New Manual Order</h1>
      <ManualOrderForm variants={variants} />
    </div>
  );
}
