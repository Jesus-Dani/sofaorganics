import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { SEED_PRODUCTS } from "@/lib/data/seed/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { FacetPills } from "@/components/product/facet-pills";
import { PetSafeBadge } from "@/components/product/pet-safe-badge";
import { PetSafeNotes } from "@/components/product/pet-safe-notes";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { RelatedProducts } from "@/components/product/related-products";
import { getWishlistedVariantIds } from "@/lib/customer/wishlist";

export function generateStaticParams() {
  return SEED_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };

  const cover = product.images[0];
  const images = cover && !cover.isPlaceholder ? [{ url: cover.src, alt: cover.alt }] : undefined;

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description: product.description, type: "website", images },
    twitter: { card: "summary_large_image", title: product.name, description: product.description, images },
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [related, wishlistedIds] = await Promise.all([getRelatedProducts(product), getWishlistedVariantIds()]);
  const wishlistedVariantIds = [...wishlistedIds];

  const cover = product.images[0];
  const lowestPriceVariant =
    product.variants.length > 0 ? product.variants.reduce((min, v) => (v.price < min.price ? v : min)) : undefined;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: cover && !cover.isPlaceholder ? [cover.src] : undefined,
    offers: lowestPriceVariant
      ? {
          "@type": "Offer",
          url: `${SITE_URL}/products/${product.slug}`,
          priceCurrency: lowestPriceVariant.currency,
          price: lowestPriceVariant.price,
          availability: product.variants.some((v) => v.stockStatus !== "out_of_stock")
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        }
      : undefined,
  };

  return (
    <div className="wrap py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div className="grid gap-12 md:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <FacetPills facets={product.facets} />
          <h1 className="mt-4 text-[32px] leading-tight">{product.name}</h1>
          {product.isPetSafe && <PetSafeBadge className="mt-3" />}

          <div className="mt-6">
            <AddToCartForm product={product} wishlistedVariantIds={wishlistedVariantIds} />
          </div>

          <p className="mt-8 max-w-prose text-[15px] leading-relaxed text-text">{product.description}</p>

          {product.isPetSafe && product.petSafeNote && (
            <div className="mt-6">
              <PetSafeNotes note={product.petSafeNote} />
            </div>
          )}

          <p className="mt-8 text-xs text-text-muted">
            Herbal and wellness products are not intended to diagnose, treat, cure, or prevent any disease. See our{" "}
            <a href="/legal/disclaimer" className="underline">
              full disclaimer
            </a>
            .
          </p>
        </div>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
