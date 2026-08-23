import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { getAllProductsForAdmin } from "@/lib/admin/products";
import { deleteProduct } from "@/lib/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { StockBadge } from "@/components/product/stock-badge";
import { aggregateStockStatus } from "@/lib/utils/stock-status";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { ProductStatus } from "@/types/database.types";

export const metadata = { title: "Products · Admin" };

const STATUS_LABEL: Record<ProductStatus, string> = { draft: "Draft", published: "Published", archived: "Archived" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const status = typeof searchParams.status === "string" ? (searchParams.status as ProductStatus) : undefined;
  const products = await getAllProductsForAdmin({ search, status });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 bg-primary px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus size={15} aria-hidden />
          New product
        </Link>
      </div>

      <form className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          name="q"
          defaultValue={search}
          placeholder="Search by name"
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none sm:max-w-xs sm:flex-1"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none sm:w-auto"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <button
          type="submit"
          className="w-full border border-border px-4 py-2 text-sm font-medium text-text hover:border-primary sm:w-auto"
        >
          Filter
        </button>
      </form>

      <div className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stockStatus = aggregateStockStatus(product.variants.map((v) => v.stockStatus));
                const lowest = product.variants.length
                  ? Math.min(...product.variants.map((v) => v.price))
                  : null;
                return (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-background-alt">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="font-medium text-text hover:text-primary">
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{STATUS_LABEL[product.status]}</td>
                    <td className="px-4 py-3">
                      <StockBadge status={stockStatus} />
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {lowest !== null ? formatCurrency(lowest, product.variants[0]?.currency ?? "NGN") : "No sizes yet"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton
                        onDelete={deleteProduct.bind(null, product.id)}
                        confirmMessage={`Delete "${product.name}"? This can't be undone.`}
                      />
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                    No products match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
