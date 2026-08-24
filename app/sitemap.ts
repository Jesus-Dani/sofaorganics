import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/data/products";
import { getPublishedPosts } from "@/lib/data/blog";
import { TYPE_FACETS, ORIGIN_FACETS, USE_CASE_FACETS } from "@/lib/data/seed/facets";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_PATHS = [
  "",
  "/shop",
  "/about",
  "/blog",
  "/contact",
  "/legal/disclaimer",
  "/legal/privacy-policy",
  "/legal/returns-policy",
  "/legal/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getPublishedProducts({}), getPublishedPosts()]);

  const staticEntries = STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}` }));

  const facetEntries = [
    ...TYPE_FACETS.map((f) => ({ url: `${SITE_URL}/shop/type/${f.slug}` })),
    ...ORIGIN_FACETS.map((f) => ({ url: `${SITE_URL}/shop/origin/${f.slug}` })),
    ...USE_CASE_FACETS.map((f) => ({ url: `${SITE_URL}/shop/use-case/${f.slug}` })),
  ];

  const productEntries = products.map((product) => ({ url: `${SITE_URL}/products/${product.slug}` }));
  const postEntries = posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}` }));

  return [...staticEntries, ...facetEntries, ...productEntries, ...postEntries];
}
