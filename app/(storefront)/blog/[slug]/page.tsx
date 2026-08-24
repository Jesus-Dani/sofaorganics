import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/data/blog";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PRODUCT_SELECT, mapProductRow, type ProductQueryRow } from "@/lib/data/map-product-row";
import { RelatedProducts } from "@/components/product/related-products";

// No generateStaticParams here — blog posts are created/published live through
// the admin, and lib/data/blog.ts needs a request-scoped cookies() client that
// isn't available at build time. Renders on demand instead (same reasoning as
// products would need if they moved off the build-time seed list).

/** Strip HTML tags and trim to a plain-text meta description. */
function toDescription(bodyRichtext: string, maxLength = 155): string {
  const text = bodyRichtext.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) return { title: "Article not found" };

  const description = toDescription(post.body_richtext);
  const images = post.cover_image_path ? [{ url: post.cover_image_path }] : undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description, type: "article", images },
    twitter: { card: "summary_large_image", title: post.title, description, images },
  };
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) notFound();

  let relatedProducts: Awaited<ReturnType<typeof mapProductRow>>[] = [];
  if (post.related_product_ids.length > 0) {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "published")
      .in("id", post.related_product_ids);
    relatedProducts = ((data as unknown as ProductQueryRow[]) ?? []).map(mapProductRow);
  }

  return (
    <article className="wrap max-w-2xl py-10 md:py-14">
      <h1 className="text-[32px] leading-tight md:text-4xl">{post.title}</h1>
      {post.published_at && (
        <p className="mt-3 text-sm text-text-muted">
          {new Date(post.published_at).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      )}

      {post.cover_image_path && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden">
          <Image src={post.cover_image_path} alt={post.title} fill className="object-cover" sizes="(min-width: 768px) 672px, 100vw" priority />
        </div>
      )}

      <div className="prose prose-lg mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.body_richtext }} />

      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
    </article>
  );
}
