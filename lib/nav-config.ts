import { ORIGIN_FACETS, TYPE_FACETS, USE_CASE_FACETS } from "@/lib/data/seed/facets";

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/blog" },
];

export const MEGA_MENU_COLUMNS = [
  { title: "By Type", basePath: "/shop/type", facets: TYPE_FACETS },
  { title: "By Origin", basePath: "/shop/origin", facets: ORIGIN_FACETS },
] as const;

export const USE_CASE_COLUMN = {
  title: "By Use Case",
  basePath: "/shop/use-case",
  facets: USE_CASE_FACETS,
};

export const WHATSAPP_NUMBER = "2348032343038";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
