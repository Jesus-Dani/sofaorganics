import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const TILES = [
  {
    title: "Botanicals",
    tagline: "Roots, barks, and whole leaves — from root to bloom.",
    href: "/shop/type/whole-leaves",
    cta: "Shop Botanicals",
    bg: "bg-secondary-tint",
    image: "/images/products/gingko-leaves.jpeg",
    alt: "Sofa Organics Gingko Leaves in a bowl with fresh gingko sprigs",
  },
  {
    title: "Herbs & Spices",
    tagline: "Flavorful, functional staples for the kitchen and the medicine cabinet.",
    href: "/shop/type/seeds-spices",
    cta: "Shop Herbs & Spices",
    bg: "bg-accent-tint",
    image: "/images/products/cayenne-pepper.jpeg",
    alt: "Sofa Organics Cayenne Pepper beside fresh red chillies and black pepper",
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
              className={`group relative flex aspect-[16/11] flex-col justify-end overflow-hidden rounded-tile p-8 ${tile.bg}`}
            >
              <div className="absolute right-6 top-6 h-[62%] w-[52%] overflow-hidden rounded-tile shadow-sm transition-transform duration-500 group-hover:scale-105 md:right-8 md:top-8">
                <Image src={tile.image} alt={tile.alt} fill className="object-cover" sizes="(min-width: 1024px) 26vw, 50vw" />
              </div>
              <div className="relative z-10 max-w-[55%]">
                <h3 className="font-serif text-2xl text-text">{tile.title}</h3>
                <p className="mt-1.5 text-sm text-text/85">{tile.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-text">
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
