import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-[28px]">We couldn&apos;t find that page.</h1>
      <p className="mx-auto mt-4 max-w-sm text-[15px] text-text-muted">
        It may have moved, or the link might be off. Try the shop, or head back home.
      </p>
      <div className="mt-7 flex items-center justify-center gap-4">
        <Link href="/" className="bg-primary px-6 py-3 text-sm font-medium text-background">
          Go home
        </Link>
        <Link href="/shop" className="text-sm font-medium text-primary underline">
          Shop all products
        </Link>
      </div>
    </div>
  );
}
