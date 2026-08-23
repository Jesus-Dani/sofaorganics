import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TYPE_FACETS, ORIGIN_FACETS, USE_CASE_FACETS } from "@/lib/data/seed/facets";
import { parseShopQuery } from "@/lib/shop/filters";
import { ShopView } from "@/components/shop/shop-view";
import type { Facet, ProductFilters } from "@/lib/data/types";

/**
 * Handles /shop/type/[slug], /shop/origin/[slug], and /shop/use-case/[slug] in one
 * route — three separate near-identical page files previously each did nothing but
 * pick a facet array, set one ProductFilters key, and render ShopView.
 */
type FacetTypeSegment = "type" | "origin" | "use-case";

const FACET_CONFIG: Record<
  FacetTypeSegment,
  {
    facets: Facet[];
    queryKey: keyof ProductFilters;
    title: (facet: Facet) => string;
    description?: (facet: Facet) => string;
  }
> = {
  type: {
    facets: TYPE_FACETS,
    queryKey: "type",
    title: (facet) => facet.label,
  },
  origin: {
    facets: ORIGIN_FACETS,
    queryKey: "origin",
    title: (facet) => `${facet.label} Origin`,
  },
  "use-case": {
    facets: USE_CASE_FACETS,
    queryKey: "useCase",
    title: (facet) => facet.label,
    description: () =>
      "Traditionally used to support this area of wellness, always paired with a plain-language explanation on the product page, never a cure claim.",
  },
};

export function generateStaticParams() {
  return (Object.keys(FACET_CONFIG) as FacetTypeSegment[]).flatMap((facetType) =>
    FACET_CONFIG[facetType].facets.map((f) => ({ facetType, slug: f.slug }))
  );
}

export function generateMetadata({ params }: { params: { facetType: string; slug: string } }): Metadata {
  const config = FACET_CONFIG[params.facetType as FacetTypeSegment];
  const facet = config?.facets.find((f) => f.slug === params.slug);
  return { title: facet ? config.title(facet) : "Shop" };
}

export default function ShopByFacetPage({
  params,
  searchParams,
}: {
  params: { facetType: string; slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const config = FACET_CONFIG[params.facetType as FacetTypeSegment];
  if (!config) notFound();

  const facet = config.facets.find((f) => f.slug === params.slug);
  if (!facet) notFound();

  const query = parseShopQuery(searchParams, { [config.queryKey]: facet.slug });
  return <ShopView query={query} title={config.title(facet)} description={config.description?.(facet)} />;
}
