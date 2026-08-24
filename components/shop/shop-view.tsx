import { getPublishedProducts } from "@/lib/data/products";
import { sortProducts } from "@/lib/shop/sort-products";
import type { ShopQuery } from "@/lib/shop/filters";
import { FilterGroups } from "@/components/shop/filter-groups";
import { FilterSheet } from "@/components/shop/filter-sheet";
import { ActiveFilterChips } from "@/components/shop/active-filter-chips";
import { SortControl } from "@/components/shop/sort-control";
import { ProductCard } from "@/components/product/product-card";

export async function ShopView({
  query,
  title,
  description,
}: {
  query: ShopQuery;
  title: string;
  description?: string;
}) {
  const products = sortProducts(
    await getPublishedProducts({ type: query.type, origin: query.origin, useCase: query.useCase, petSafe: query.petSafe }),
    query.sort
  );

  return (
    <div className="wrap py-10 md:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-[32px]">{title}</h1>
        {description && <p className="mt-2 text-text">{description}</p>}
      </div>

      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <FilterGroups query={query} />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <FilterSheet query={query} />
            <p className="hidden text-sm text-text-muted sm:block">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
            <SortControl query={query} />
          </div>

          <ActiveFilterChips query={query} />

          {products.length === 0 ? (
            <div className="border border-dashed border-border py-16 text-center">
              <p className="text-text">No products match these filters yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
