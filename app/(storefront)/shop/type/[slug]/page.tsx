import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TYPE_FACETS } from "@/lib/data/seed/facets";
import { parseShopQuery } from "@/lib/shop/filters";
import { ShopView } from "@/components/shop/shop-view";

export function generateStaticParams() {
  return TYPE_FACETS.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const facet = TYPE_FACETS.find((f) => f.slug === params.slug);
  return { title: facet ? facet.label : "Shop" };
}

export default function ShopByTypePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const facet = TYPE_FACETS.find((f) => f.slug === params.slug);
  if (!facet) notFound();

  const query = parseShopQuery(searchParams, { type: facet.slug });
  return <ShopView query={query} title={facet.label} />;
}
