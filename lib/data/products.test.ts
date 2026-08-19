import { describe, expect, it } from "vitest";
import { getPublishedProducts, getProductBySlug, searchProducts } from "@/lib/data/products";

describe("getPublishedProducts", () => {
  it("returns every published product with no filters", async () => {
    const products = await getPublishedProducts();
    expect(products.length).toBeGreaterThan(10);
  });

  it("filters by a single facet across type/origin/use case", async () => {
    const products = await getPublishedProducts({ useCase: "memory-focus" });
    expect(products.every((p) => p.facets.some((f) => f.slug === "memory-focus"))).toBe(true);
    expect(products.some((p) => p.slug === "gingko-leaves")).toBe(true);
  });

  it("combines facets with AND", async () => {
    const products = await getPublishedProducts({ type: "oils", origin: "african" });
    expect(
      products.every(
        (p) =>
          p.facets.some((f) => f.facetType === "type" && f.slug === "oils") &&
          p.facets.some((f) => f.facetType === "origin" && f.slug === "african")
      )
    ).toBe(true);
  });

  it("filters to pet-safe products only", async () => {
    const products = await getPublishedProducts({ petSafe: true });
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.isPetSafe)).toBe(true);
  });
});

describe("getProductBySlug", () => {
  it("finds a real seeded product", async () => {
    const product = await getProductBySlug("cayenne-pepper");
    expect(product?.name).toBe("Cayenne Pepper");
  });

  it("returns null for an unknown slug", async () => {
    expect(await getProductBySlug("not-a-real-product")).toBeNull();
  });
});

describe("searchProducts", () => {
  it("matches on name", async () => {
    const results = await searchProducts("moringa");
    expect(results.some((p) => p.slug === "moringa-root-extract-powder")).toBe(true);
  });

  it("returns nothing for an empty query", async () => {
    expect(await searchProducts("   ")).toEqual([]);
  });
});
