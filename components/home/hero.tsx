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
    <section className="relative aspect-video w-full overflow-hidden bg-background-alt">
      <Image
        src="/images/hero/hero-flatlay.jpeg"
        alt="Mortar bowl of dried herbs, a dropper bottle, and a kraft pouch of Sofa Organics gingko leaves on a sunlit table"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent sm:to-background/0" />

      <div className="wrap relative flex h-full items-center">
        <div className="max-w-md">
          <h1 className="font-serif text-[28px] leading-[1.15] text-text sm:text-4xl md:text-[44px]">
            Herbs for a Healthier Life
          </h1>
          <Link
            href="/shop"
            className="mt-5 inline-block bg-primary px-6 py-3.5 text-[14.5px] font-medium text-background transition-opacity hover:opacity-90 sm:mt-8 sm:px-8 sm:py-4"
          >
            Shop the catalog
          </Link>

          <dl className="mt-6 hidden flex-wrap gap-x-9 gap-y-5 md:mt-12 md:flex">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex max-w-[130px] flex-col items-start gap-2">
                <Icon size={22} weight="light" className="text-primary" aria-hidden />
                <dt className="text-xs leading-snug text-text">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
