import Link from "next/link";
import Image from "next/image";
import { getWishlistForCustomer } from "@/lib/customer/wishlist";
import { formatCurrency } from "@/lib/utils/format-currency";
import { WishlistToggleButton } from "@/components/product/wishlist-toggle-button";
import { AddWishlistItemToCartButton } from "@/components/account/add-wishlist-item-to-cart-button";

export const metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const items = await getWishlistForCustomer();

  return (
    <div className="wrap max-w-4xl py-14 md:py-20">
      <p className="eyebrow mb-2">My Account</p>
      <h1 className="text-[28px]">Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 border border-dashed border-border py-16 text-center">
          <p className="text-text">Nothing saved yet.</p>
          <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-primary underline">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.variantId} className="border border-border bg-background">
              <div className="relative aspect-square overflow-hidden bg-background-alt">
                {item.image ? (
                  <Image src={item.image} alt={item.productName} fill sizes="25vw" className="object-cover" />
                ) : null}
                <WishlistToggleButton variantId={item.variantId} initialSaved className="absolute right-2 top-2" />
              </div>
              <div className="space-y-2 p-4">
                <Link href={`/products/${item.productSlug}`} className="block font-serif text-base text-text hover:text-primary">
                  {item.productName}
                </Link>
                <p className="text-sm text-text-muted">{item.sizeLabel}</p>
                <p className="text-sm font-semibold text-text">{formatCurrency(item.price, item.currency)}</p>
                <AddWishlistItemToCartButton item={item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
