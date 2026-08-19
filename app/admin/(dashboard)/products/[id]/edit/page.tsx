import { notFound } from "next/navigation";
import { getProductForEdit } from "@/lib/admin/products";
import { getAllFacets } from "@/lib/data/facets";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Edit Product · Admin" };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, allFacets] = await Promise.all([getProductForEdit(params.id), getAllFacets()]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl">{product.name}</h1>
      <ProductForm product={product} allFacets={allFacets} />
    </div>
  );
}
