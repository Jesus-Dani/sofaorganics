import Link from "next/link";
import { X } from "@phosphor-icons/react/dist/ssr";
import { findFacet } from "@/lib/data/seed/facets";
import { buildShopHref, type ShopQuery } from "@/lib/shop/filters";

export function ActiveFilterChips({ query }: { query: ShopQuery }) {
  const chips: { label: string; href: string }[] = [];

  if (query.type) {
    chips.push({ label: findFacet(query.type)?.label ?? query.type, href: buildShopHref(query, { type: undefined }) });
  }
  if (query.origin) {
    chips.push({ label: findFacet(query.origin)?.label ?? query.origin, href: buildShopHref(query, { origin: undefined }) });
  }
  if (query.useCase) {
    chips.push({ label: findFacet(query.useCase)?.label ?? query.useCase, href: buildShopHref(query, { useCase: undefined }) });
  }
  if (query.petSafe) {
    chips.push({ label: "Pet-safe", href: buildShopHref(query, { petSafe: false }) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className="flex items-center gap-1.5 border border-border bg-background-alt px-3 py-1.5 text-xs font-medium text-text hover:border-accent"
        >
          {chip.label}
          <X size={11} aria-hidden />
        </Link>
      ))}
      <Link href="/shop" className="text-xs font-medium text-text-muted underline">
        Clear all
      </Link>
    </div>
  );
}
