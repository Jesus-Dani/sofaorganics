import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const TILES = [
  {
    title: "Whole Leaves",
    tagline: "Roots, barks, and whole leaves, from root to bloom.",
    href: "/shop/type/whole-leaves",
    cta: "Shop Whole Leaves",
    image: "/images/categories/botanicals.jpeg",
    alt: "A circular arrangement of ground spices and botanicals in small bowls and spoons",
  },
  {
    title: "Herbs & Spices",
    tagline: "Flavorful, functional staples for the kitchen and the medicine cabinet.",
    href: "/shop/type/seeds-spices",
    cta: "Shop Herbs & Spices",
    image: "/images/categories/herbs-spices.jpeg",
    alt: "Cinnamon sticks, walnuts, dried herbs, and turmeric powder in a stone mortar and pestle",
  },
];

export function CategoryTiles() {
  return (
    <section className="py-16 md:py-20">
      <div className="wrap">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-2xl">Shop by category</h2>
          <Link href="/shop" className="text-sm font-medium text-accent hover:underline">
            View all categories →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TILES.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="group relative aspect-square overflow-hidden rounded-tile"
            >
              <Image
                src={tile.image}
                alt={tile.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-text/80 via-text/30 to-transparent p-6 pt-16">
                <h3 className="font-serif text-2xl text-background">{tile.title}</h3>
                <p className="mt-1.5 text-sm text-background/90">{tile.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-background">
                  {tile.cta} <ArrowRight size={14} aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
