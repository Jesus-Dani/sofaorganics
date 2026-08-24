import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/data/blog";
import { ArticleCard } from "@/components/blog/article-card";

export const metadata: Metadata = {
  title: "Journal",
  description: "Plain-language explainers on what these herbs are, traditionally, and how to actually use them.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="wrap py-10 md:py-14">
      <div className="mb-10 max-w-xl">
        <p className="eyebrow mb-3">Journal</p>
        <h1 className="text-[32px]">Notes from the apothecary</h1>
        <p className="mt-2 text-text">
          Plain-language explainers on what these herbs are, traditionally, and how to actually use them.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border border-dashed border-border py-16 text-center">
          <p className="text-text">The first articles are on their way.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
