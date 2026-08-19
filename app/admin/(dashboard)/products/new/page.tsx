import { redirect } from "next/navigation";
import { createDraftProduct } from "@/lib/admin/actions";

export default async function NewProductPage() {
  const id = await createDraftProduct();
  redirect(`/admin/products/${id}/edit`);
}
