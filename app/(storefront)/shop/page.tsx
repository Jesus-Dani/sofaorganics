import type { Metadata } from "next";
import { parseShopQuery } from "@/lib/shop/filters";
import { ShopView } from "@/components/shop/shop-view";

export const metadata: Metadata = {
  title: "Shop",
  description: "Ayurvedic and African herbs, spices, and oils, filterable by type, origin, use case, and pet-safety.",
  // Filter query params (?type=, ?origin=, etc.) shouldn't fragment this into
  // near-duplicate pages in search results — always point back to the clean URL.
  alternates: { canonical: "/shop" },
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = parseShopQuery(searchParams);
  return <ShopView query={query} title="Shop all products" />;
}
