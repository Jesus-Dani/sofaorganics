import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils/format-currency";
import { aggregateStockStatus } from "@/lib/utils/stock-status";
import { StockBadge } from "@/components/product/stock-badge";
import { PlaceholderPhoto } from "@/components/ui/placeholder-photo";
import { WishlistToggleButton } from "@/components/product/wishlist-toggle-button";
import { getWishlistedVariantIds } from "@/lib/customer/wishlist";

export async function ProductCard({ product }: { product: Product }) {
  const lowestPriceVariant =
    product.variants.length > 0 ? product.variants.reduce((min, v) => (v.price < min.price ? v : min)) : undefined;
  const currency = lowestPriceVariant?.currency ?? "NGN";
  const status = aggregateStockStatus(product.variants.map((v) => v.stockStatus));
  const cover = product.images[0];
  const wishlistedIds = lowestPriceVariant ? await getWishlistedVariantIds() : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block border border-border bg-background transition-colors hover:border-primary"
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
        {lowestPriceVariant && (
          <WishlistToggleButton
            variantId={lowestPriceVariant.id}
            initialSaved={wishlistedIds?.has(lowestPriceVariant.id) ?? false}
            className="absolute right-2 top-2"
          />
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-serif text-base text-text">{product.name}</h3>
        <StockBadge status={status} />
        <p className="text-sm font-semibold text-text">From {formatCurrency(lowestPriceVariant?.price ?? 0, currency)}</p>
      </div>
    </Link>
  );
}
