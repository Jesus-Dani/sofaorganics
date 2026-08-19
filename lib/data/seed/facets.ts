import type { Facet } from "@/lib/data/types";

/** Locked taxonomy — PRD §5.3. Facet slugs are the single source of truth for filter URLs. */

export const TYPE_FACETS: Facet[] = [
  { facetType: "type", label: "Powders", slug: "powders" },
  { facetType: "type", label: "Oils", slug: "oils" },
  { facetType: "type", label: "Whole Leaves", slug: "whole-leaves" },
  { facetType: "type", label: "Roots", slug: "roots" },
  { facetType: "type", label: "Barks", slug: "barks" },
  { facetType: "type", label: "Seeds & Spices", slug: "seeds-spices" },
];

export const ORIGIN_FACETS: Facet[] = [
  { facetType: "origin", label: "Ayurvedic", slug: "ayurvedic" },
  { facetType: "origin", label: "African", slug: "african" },
];

export const USE_CASE_FACETS: Facet[] = [
  { facetType: "use_case", label: "Digestion & Gut Health", slug: "digestion-gut-health" },
  { facetType: "use_case", label: "Male Reproductive Health", slug: "male-reproductive-health" },
  { facetType: "use_case", label: "Female Reproductive Health", slug: "female-reproductive-health" },
  { facetType: "use_case", label: "Hormonal Balance", slug: "hormonal-balance" },
  { facetType: "use_case", label: "Immune Support", slug: "immune-support" },
  { facetType: "use_case", label: "Stress & Sleep Support", slug: "stress-sleep-support" },
  { facetType: "use_case", label: "Skin Care", slug: "skin-care" },
  { facetType: "use_case", label: "Hair Care", slug: "hair-care" },
  { facetType: "use_case", label: "Joint & Mobility Support", slug: "joint-mobility-support" },
  { facetType: "use_case", label: "Metabolic Wellness", slug: "metabolic-wellness" },
  { facetType: "use_case", label: "Heart Health", slug: "heart-health" },
  { facetType: "use_case", label: "Blood Pressure Support", slug: "blood-pressure-support" },
  { facetType: "use_case", label: "Memory & Focus", slug: "memory-focus" },
];

export const ALL_FACETS = [...TYPE_FACETS, ...ORIGIN_FACETS, ...USE_CASE_FACETS];

export function findFacet(slug: string): Facet | undefined {
  return ALL_FACETS.find((f) => f.slug === slug);
}
