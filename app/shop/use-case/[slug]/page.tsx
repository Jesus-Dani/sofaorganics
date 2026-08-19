import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { USE_CASE_FACETS } from "@/lib/data/seed/facets";
import { parseShopQuery } from "@/lib/shop/filters";
import { ShopView } from "@/components/shop/shop-view";

export function generateStaticParams() {
  return USE_CASE_FACETS.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const facet = USE_CASE_FACETS.find((f) => f.slug === params.slug);
  return { title: facet ? facet.label : "Shop" };
}

export default function ShopByUseCasePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const facet = USE_CASE_FACETS.find((f) => f.slug === params.slug);
  if (!facet) notFound();

  const query = parseShopQuery(searchParams, { useCase: facet.slug });
  return (
    <ShopView
      query={query}
      title={facet.label}
      description="Traditionally used to support this area of wellness — always paired with a plain-language explanation on the product page, never a cure claim."
    />
  );
}
