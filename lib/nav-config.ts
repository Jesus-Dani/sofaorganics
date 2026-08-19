import { ORIGIN_FACETS, TYPE_FACETS, USE_CASE_FACETS } from "@/lib/data/seed/facets";
import type { Facet } from "@/lib/data/types";

export interface NavDropdown {
  kind: "dropdown";
  label: string;
  basePath: string;
  facets: Facet[];
  allHref?: string;
  allLabel?: string;
}

export interface NavLink {
  kind: "link";
  label: string;
  href: string;
  accent?: boolean;
}

export type NavItem = NavDropdown | NavLink;

/**
 * Separate top-level items per facet group, each a simple single-column
 * dropdown, matching the Starwest reference's nav pattern (a "By Health
 * Goal" dropdown of its own, not everything nested under one mega-menu).
 */
export const PRIMARY_NAV: NavItem[] = [
  { kind: "dropdown", label: "Shop", basePath: "/shop/type", facets: TYPE_FACETS, allHref: "/shop", allLabel: "Shop All" },
  { kind: "dropdown", label: "By Origin", basePath: "/shop/origin", facets: ORIGIN_FACETS },
  { kind: "dropdown", label: "By Health Goal", basePath: "/shop/use-case", facets: USE_CASE_FACETS },
  { kind: "link", label: "Pet-Safe", href: "/shop?pet_safe=1", accent: true },
  { kind: "link", label: "Our Story", href: "/about" },
  { kind: "link", label: "Journal", href: "/blog" },
  { kind: "link", label: "Contact", href: "/contact" },
];

export const TYPE_FACETS_FOR_FOOTER = TYPE_FACETS;

export const WHATSAPP_NUMBER = "2348032343038";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
