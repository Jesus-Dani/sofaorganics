import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Journal" };

export default function BlogIndexPage() {
  return (
    <div className="wrap py-20 text-center">
      <p className="eyebrow mb-4">Journal</p>
      <h1 className="text-[28px]">The full Journal is coming soon.</h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-muted">
        Plain-language explainers on what these herbs are, traditionally, and how to actually use
        them are next up in the build. In the meantime, the shop has the same wellness-support
        notes on every product page.
      </p>
      <Link href="/shop" className="mt-7 inline-block bg-primary px-6 py-3 text-sm font-medium text-background">
        Browse the shop
      </Link>
    </div>
  );
}
