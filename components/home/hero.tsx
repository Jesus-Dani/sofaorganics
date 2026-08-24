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
        <div className="mt-8 max-w-md sm:mt-14">
          <h1 className="font-serif text-2xl leading-[1.15] text-text sm:text-3xl md:text-[36px]">
            Herbs for a
            <br />
            Healthier Life
          </h1>
          <Link
            href="/shop"
            className="mt-10 inline-block text-[14.5px] font-medium text-text underline underline-offset-4 transition-opacity hover:opacity-80 sm:mt-14 sm:text-base"
          >
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}
