"use client";

import { useRouter } from "next/navigation";
import type { ShopQuery } from "@/lib/shop/filters";
import { buildShopHref } from "@/lib/shop/filters";

const SORT_LABELS: Record<ShopQuery["sort"], string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A to Z",
};

export function SortControl({ query }: { query: ShopQuery }) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm text-text-muted">
      Sort
      <select
        value={query.sort}
        onChange={(e) => router.push(buildShopHref(query, { sort: e.target.value as ShopQuery["sort"] }))}
        className="border border-border bg-background px-3 py-2 text-sm text-text focus:outline-none"
      >
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
