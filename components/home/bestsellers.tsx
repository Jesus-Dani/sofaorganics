import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";

export async function Bestsellers() {
  const products = await getFeaturedProducts(5);

  return (
    <section className="py-16 md:py-20">
      <div className="wrap">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl">Bestsellers</h2>
          <Link href="/shop" className="text-sm font-medium text-accent hover:underline">
            View all products →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
