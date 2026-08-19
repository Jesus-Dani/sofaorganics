import Image from "next/image";
import Link from "next/link";
import { Leaf, Flask, HandHeart } from "@phosphor-icons/react/dist/ssr";

const TRUST_POINTS = [
  { icon: Leaf, label: "Hand-sourced, not mass-farmed" },
  { icon: Flask, label: "No fillers or additives" },
  { icon: HandHeart, label: "Rooted in root-cause practice" },
];

export function Hero() {
  return (
    <section className="bg-background-alt">
      <div className="wrap grid items-center gap-14 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="eyebrow mb-4">Est. 2026 · Port Harcourt</p>
          <h1 className="max-w-xl font-serif text-4xl leading-[1.15] text-text md:text-[44px]">
            Herbs your grandmother would recognize.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted">
            Sofa Organics sources Ayurvedic and African herbs, spices, and oils the way they&apos;ve
            always been prepared — whole, unformulated, and explained plainly, so you know what
            you&apos;re putting in your body and why.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block bg-primary px-8 py-4 text-[14.5px] font-medium text-background transition-opacity hover:opacity-90"
          >
            Shop the catalog
          </Link>

          <dl className="mt-12 flex flex-wrap gap-x-9 gap-y-5">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex max-w-[130px] flex-col items-start gap-2">
                <Icon size={22} weight="light" className="text-primary" aria-hidden />
                <dt className="text-xs leading-snug text-text">{label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative aspect-[5/4] overflow-hidden">
          <Image
            src="/images/hero/hero-flatlay.jpeg"
            alt="Mortar bowl of dried herbs, a dropper bottle, and a kraft pouch of Sofa Organics gingko leaves on a sunlit table"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
