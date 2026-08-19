import type { Metadata } from "next";
import { parseShopQuery } from "@/lib/shop/filters";
import { ShopView } from "@/components/shop/shop-view";

export const metadata: Metadata = {
  title: "Shop",
  description: "Ayurvedic and African herbs, spices, and oils — filterable by type, origin, use case, and pet-safety.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = parseShopQuery(searchParams);
  return <ShopView query={query} title="Shop all products" />;
}
