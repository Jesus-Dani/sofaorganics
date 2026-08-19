import type { ProductFilters } from "@/lib/data/types";

export type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export interface ShopQuery extends ProductFilters {
  sort: SortOption;
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const SORT_OPTIONS: SortOption[] = ["featured", "price-asc", "price-desc", "name-asc"];

export function parseShopQuery(searchParams: RawSearchParams, overrides: Partial<ProductFilters> = {}): ShopQuery {
  const sortRaw = first(searchParams.sort);
  return {
    type: overrides.type ?? first(searchParams.type),
    origin: overrides.origin ?? first(searchParams.origin),
    useCase: overrides.useCase ?? first(searchParams.use_case),
    petSafe: overrides.petSafe ?? first(searchParams.pet_safe) === "1",
    sort: SORT_OPTIONS.includes(sortRaw as SortOption) ? (sortRaw as SortOption) : "featured",
  };
}

/** Builds an /shop href with `updates` merged in; a key set to undefined removes it. */
export function buildShopHref(current: ShopQuery, updates: Partial<ShopQuery>): string {
  const merged: Record<string, string | undefined> = {
    type: updates.type !== undefined ? updates.type : current.type,
    origin: updates.origin !== undefined ? updates.origin : current.origin,
    use_case: updates.useCase !== undefined ? updates.useCase : current.useCase,
    pet_safe: (updates.petSafe !== undefined ? updates.petSafe : current.petSafe) ? "1" : undefined,
    sort: (updates.sort ?? current.sort) === "featured" ? undefined : updates.sort ?? current.sort,
  };

  const params = new URLSearchParams();
  Object.entries(merged).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}
