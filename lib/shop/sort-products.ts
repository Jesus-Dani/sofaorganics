import type { Product } from "@/lib/data/types";
import type { SortOption } from "@/lib/shop/filters";

function lowestPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => lowestPrice(b) - lowestPrice(a));
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return sorted;
  }
}
