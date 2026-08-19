import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ORIGIN_FACETS } from "@/lib/data/seed/facets";
import { parseShopQuery } from "@/lib/shop/filters";
import { ShopView } from "@/components/shop/shop-view";

export function generateStaticParams() {
  return ORIGIN_FACETS.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const facet = ORIGIN_FACETS.find((f) => f.slug === params.slug);
  return { title: facet ? facet.label : "Shop" };
}

export default function ShopByOriginPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const facet = ORIGIN_FACETS.find((f) => f.slug === params.slug);
  if (!facet) notFound();

  const query = parseShopQuery(searchParams, { origin: facet.slug });
  return <ShopView query={query} title={`${facet.label} Origin`} />;
}
