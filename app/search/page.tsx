import type { Metadata } from "next";
import { searchProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { SearchBar } from "@/components/nav/search-bar";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="wrap py-10 md:py-14">
      <h1 className="text-[32px]">Search</h1>
      <SearchBar className="mt-6 max-w-md" />

      {q && (
        <p className="mt-6 text-sm text-text-muted">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
        </p>
      )}

      {q && results.length === 0 && (
        <div className="mt-8 border border-dashed border-border py-16 text-center">
          <p className="text-text-muted">
            Nothing matched that search. Try a shorter term, or{" "}
            <a href="/shop" className="underline">
              browse the full shop
            </a>
            .
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
