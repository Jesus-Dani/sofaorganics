"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/data/types";
import { PlaceholderPhoto } from "@/components/ui/placeholder-photo";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [active, setActive] = useState(0);
  const image = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-background-alt">
        {image && !image.isPlaceholder ? (
          <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        ) : (
          <PlaceholderPhoto label={image?.alt ?? productName} />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.src || i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative h-16 w-16 overflow-hidden border ${i === active ? "border-primary" : "border-border"}`}
            >
              {!img.isPlaceholder ? (
                <Image src={img.src} alt={img.alt} fill sizes="64px" className="object-cover" />
              ) : (
                <PlaceholderPhoto label="" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
