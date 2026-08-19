import Link from "next/link";
import { PawPrint } from "@phosphor-icons/react/dist/ssr";
import { ORIGIN_FACETS, TYPE_FACETS, USE_CASE_FACETS } from "@/lib/data/seed/facets";
import { buildShopHref, type ShopQuery } from "@/lib/shop/filters";

function FacetGroup({
  title,
  facets,
  activeSlug,
  query,
  paramKey,
}: {
  title: string;
  facets: { label: string; slug: string }[];
  activeSlug: string | undefined;
  query: ShopQuery;
  paramKey: "type" | "origin" | "useCase";
}) {
  return (
    <div className="border-b border-border py-5 first:pt-0">
      <p className="mb-3 text-sm font-semibold text-text">{title}</p>
      <ul className="space-y-2">
        {facets.map((facet) => {
          const active = activeSlug === facet.slug;
          return (
            <li key={facet.slug}>
              <Link
                href={buildShopHref(query, { [paramKey]: active ? undefined : facet.slug } as Partial<ShopQuery>)}
                className={`text-sm ${active ? "font-semibold text-primary" : "text-text-muted hover:text-text"}`}
              >
                {facet.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FilterGroups({ query }: { query: ShopQuery }) {
  return (
    <div>
      <FacetGroup title="Type" facets={TYPE_FACETS} activeSlug={query.type} query={query} paramKey="type" />
      <FacetGroup title="Origin" facets={ORIGIN_FACETS} activeSlug={query.origin} query={query} paramKey="origin" />
      <FacetGroup title="Use Case" facets={USE_CASE_FACETS} activeSlug={query.useCase} query={query} paramKey="useCase" />
      <div className="py-5">
        <Link
          href={buildShopHref(query, { petSafe: !query.petSafe })}
          className={`flex items-center gap-2 text-sm ${
            query.petSafe ? "font-semibold text-primary" : "text-text-muted hover:text-text"
          }`}
        >
          <PawPrint size={16} weight={query.petSafe ? "fill" : "regular"} aria-hidden />
          Pet-safe only
        </Link>
      </div>
    </div>
  );
}
