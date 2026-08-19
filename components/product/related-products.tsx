import type { Product } from "@/lib/data/types";
import { ProductCard } from "@/components/product/product-card";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-border py-14">
      <h2 className="mb-6 text-2xl">You may also like</h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
