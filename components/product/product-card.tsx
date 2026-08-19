import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils/format-currency";
import { aggregateStockStatus } from "@/lib/utils/stock-status";
import { StockBadge } from "@/components/product/stock-badge";
import { PlaceholderPhoto } from "@/components/ui/placeholder-photo";

export function ProductCard({ product }: { product: Product }) {
  const lowestPrice = Math.min(...product.variants.map((v) => v.price));
  const currency = product.variants[0]?.currency ?? "NGN";
  const status = aggregateStockStatus(product.variants.map((v) => v.stockStatus));
  const cover = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block border border-border bg-background transition-colors hover:border-primary"
    >
      <div className="relative aspect-square overflow-hidden bg-background-alt">
        {cover && !cover.isPlaceholder ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 600px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <PlaceholderPhoto label={cover?.alt ?? product.name} />
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-serif text-base text-text">{product.name}</h3>
        <StockBadge status={status} />
        <p className="text-sm font-semibold text-text">From {formatCurrency(lowestPrice, currency)}</p>
      </div>
    </Link>
  );
}
