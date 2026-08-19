import Link from "next/link";
import type { ProductFacetTag } from "@/lib/data/types";

const BASE_PATH: Record<ProductFacetTag["facetType"], string> = {
  type: "/shop/type",
  origin: "/shop/origin",
  use_case: "/shop/use-case",
};

export function FacetPills({ facets }: { facets: ProductFacetTag[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {facets.map((facet) => (
        <Link
          key={`${facet.facetType}-${facet.slug}`}
          href={`${BASE_PATH[facet.facetType]}/${facet.slug}`}
          className="bg-secondary/40 px-3 py-1 text-xs font-medium text-text hover:bg-secondary"
        >
          {facet.label}
        </Link>
      ))}
    </div>
  );
}
