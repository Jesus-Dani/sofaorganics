import Image from "next/image";
import Link from "next/link";

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
      <div className="wrap relative flex h-full items-center">
        <div className="max-w-md">
          <h1 className="font-serif text-[28px] leading-[1.15] text-text sm:text-4xl md:text-[44px]">
            Herbs for a Healthier Life
          </h1>
          <Link
            href="/shop"
            className="mt-5 inline-block border-2 border-background px-6 py-3.5 text-[14.5px] font-medium text-background transition-colors hover:bg-background hover:text-primary sm:mt-8 sm:px-8 sm:py-4"
          >
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}
