import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Sofa Organics is built around a functional-medicine approach to herbalism — root causes, not formulations.",
};

export default function AboutPage() {
  return (
    <div className="wrap py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow mb-4">Our Story</p>
          <h1 className="max-w-lg text-[32px] leading-tight md:text-4xl">
            A herbalist who asks why, before reaching for a jar.
          </h1>
          <div className="mt-6 max-w-lg space-y-4 text-[15px] leading-relaxed text-text-muted">
            <p>
              Sofa Organics started with a simple frustration: most herbal shops sell blends — pre-mixed,
              proprietary, and impossible to actually understand. Behind Sofa Organics is a master
              herbalist who practices functional medicine, meaning the starting question is always
              &ldquo;what&apos;s the root cause?&rdquo; rather than &ldquo;what can I sell you?&rdquo;
            </p>
            <p>
              That&apos;s why every product here is sold as itself. No secret formulations, no
              proprietary blends you can&apos;t look up. If it&apos;s cayenne pepper, the bag says
              cayenne pepper, and the description tells you what it&apos;s traditionally used to
              support — plainly, honestly, without promising it will cure anything.
            </p>
            <p>
              The catalog spans two traditions we trust: Ayurvedic staples like ashwagandha and
              triphala, alongside West African roots, barks, and oils like moringa and shea butter.
              Both are tagged clearly by origin, so you always know where what you&apos;re holding
              comes from.
            </p>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src="/images/hero/hero-flatlay.jpeg"
            alt="Mortar bowl of dried herbs and a kraft pouch of Sofa Organics gingko leaves"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover object-[65%_center]"
          />
        </div>
      </div>
    </div>
  );
}
