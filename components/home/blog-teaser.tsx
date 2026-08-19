import Link from "next/link";
import { PlaceholderPhoto } from "@/components/ui/placeholder-photo";

const TEASERS = [
  { title: "Reading a herb label like an herbalist does", alt: "Cup of amber herbal tea beside dried leaves" },
  { title: "Whole leaf vs. extract powder: what actually changes", alt: "Amber dropper bottles on a wooden board" },
  { title: "A beginner's guide to steeping bitters", alt: "Dried herbs in a ceramic bowl with a wooden spoon" },
];

export function BlogTeaser() {
  return (
    <section className="py-16 md:py-20">
      <div className="wrap grid gap-8 md:grid-cols-[0.9fr_1.6fr] md:items-end">
        <div>
          <h2 className="text-2xl">Notes from the apothecary</h2>
          <p className="mt-2 max-w-xs text-sm text-text-muted">
            Plain-language explainers on what these herbs are, traditionally, and how to actually use them.
          </p>
          <Link href="/blog" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
            Read our articles →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {TEASERS.map((teaser) => (
            <div key={teaser.title} className="aspect-[4/5] overflow-hidden">
              <PlaceholderPhoto label={teaser.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
