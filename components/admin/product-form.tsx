"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { deleteProduct, upsertProduct } from "@/lib/admin/actions";
import { productFormSchema, STANDARD_SIZES, type ProductFormValues } from "@/lib/admin/schema";
import { slugify } from "@/lib/utils/slugify";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { FacetPicker } from "@/components/admin/facet-picker";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Product } from "@/lib/data/types";
import type { FacetRow } from "@/types/database.types";

function suggestSku(name: string, sizeLabel: string): string {
  const prefix = slugify(name).split("-").slice(0, 2).join("").slice(0, 6).toUpperCase() || "SKU";
  return `${prefix}-${sizeLabel.toUpperCase()}`;
}

export function ProductForm({ product, allFacets }: { product: Product; allFacets: FacetRow[] }) {
  const router = useRouter();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      status: product.status === "archived" ? "archived" : product.status === "published" ? "published" : "draft",
      isPetSafe: product.isPetSafe,
      petSafeNote: product.petSafeNote ?? "",
      variants: product.variants.map((v) => ({
        id: v.id,
        sizeLabel: v.sizeLabel,
        price: v.price,
        stockQuantity: v.stockQuantity,
        lowStockThreshold: v.lowStockThreshold,
        sku: v.sku,
      })),
      facetIds: product.facets.map((f) => f.facetId).filter((id): id is string => Boolean(id)),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const isPetSafe = watch("isPetSafe");
  const name = watch("name");
  const facetIds = watch("facetIds");

  const standardFieldIndex = (size: string) => fields.findIndex((f) => f.sizeLabel === size);

  const onSubmit = handleSubmit(async (values) => {
    setSaveError(null);
    try {
      await upsertProduct(values);
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save the product");
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-10 pb-16">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">General Info</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Name</label>
            <input
              {...register("name")}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            {errors.name && <FieldError message={errors.name.message} />}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Slug</label>
            <div className="flex gap-2">
              <input
                {...register("slug")}
                className="flex-1 border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setValue("slug", slugify(name))}
                className="border border-border px-3 text-xs font-medium text-text-muted hover:border-primary"
              >
                Generate from name
              </button>
            </div>
            {errors.slug && <FieldError message={errors.slug.message} />}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Description</label>
            <textarea
              rows={4}
              {...register("description")}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            {errors.description && <FieldError message={errors.description.message} />}
          </div>
          <label className="flex items-center gap-2 text-sm text-text">
            <input type="checkbox" {...register("isPetSafe")} />
            Pet-safe
          </label>
          {isPetSafe && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Pet-safe note</label>
              <textarea
                rows={3}
                {...register("petSafeNote")}
                placeholder="Dosing/usage guidance shown in the PDP's pet-safe section"
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">Photos</h2>
        <PhotoUploader productId={product.id} images={product.images} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">Sizes & Pricing</h2>
        <div className="space-y-2">
          {STANDARD_SIZES.map((size) => {
            const index = standardFieldIndex(size);
            const isChecked = index !== -1;
            const isLocked = isChecked && Boolean(fields[index]?.id);
            return (
              <div key={size} className="border border-border p-3">
                <label className="flex items-center gap-2 text-sm font-medium text-text">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isLocked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        append({ sizeLabel: size, price: 0, stockQuantity: 0, lowStockThreshold: 10, sku: suggestSku(name, size) });
                      } else if (index !== -1) {
                        remove(index);
                      }
                    }}
                  />
                  {size}
                  {isLocked && <span className="text-xs font-normal text-text-muted">(saved, set stock to 0 to retire)</span>}
                </label>
                {isChecked && (
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">Price (₦)</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register(`variants.${index}.price` as const)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">Stock</label>
                      <input
                        type="number"
                        {...register(`variants.${index}.stockQuantity` as const)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">SKU</label>
                      <input
                        {...register(`variants.${index}.sku` as const)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-text">Custom sizes</p>
          <div className="space-y-2">
            {fields.map((field, index) => {
              if ((STANDARD_SIZES as readonly string[]).includes(field.sizeLabel)) return null;
              const isLocked = Boolean(field.id);
              return (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-end gap-2 border border-border p-3">
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Size label</label>
                    <input
                      {...register(`variants.${index}.sizeLabel` as const)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Price (₦)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.price` as const)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Stock</label>
                    <input
                      type="number"
                      {...register(`variants.${index}.stockQuantity` as const)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">SKU</label>
                    <input
                      {...register(`variants.${index}.sku` as const)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => !isLocked && remove(index)}
                    disabled={isLocked}
                    aria-label="Remove size"
                    className="mb-1 flex h-9 w-9 items-center justify-center text-text-muted hover:text-accent disabled:opacity-30"
                  >
                    <Trash size={15} aria-hidden />
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() =>
              append({ sizeLabel: "", price: 0, stockQuantity: 0, lowStockThreshold: 10, sku: suggestSku(name, "CUSTOM") })
            }
            className="mt-2 flex items-center gap-1.5 border border-border px-3 py-2 text-xs font-medium text-text hover:border-primary"
          >
            <Plus size={13} aria-hidden />
            Add custom size
          </button>
        </div>
        {errors.variants && typeof errors.variants.message === "string" && <FieldError message={errors.variants.message} />}
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-text">Tags</h2>
        <FacetPicker
          facetType="type"
          label="Type"
          allFacets={allFacets}
          selectedIds={facetIds}
          onChange={(ids) => setValue("facetIds", mergeFacetIds(allFacets, facetIds, "type", ids))}
        />
        <FacetPicker
          facetType="origin"
          label="Origin"
          allFacets={allFacets}
          selectedIds={facetIds}
          onChange={(ids) => setValue("facetIds", mergeFacetIds(allFacets, facetIds, "origin", ids))}
        />
        <FacetPicker
          facetType="use_case"
          label="Use Case"
          allFacets={allFacets}
          selectedIds={facetIds}
          onChange={(ids) => setValue("facetIds", mergeFacetIds(allFacets, facetIds, "use_case", ids))}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">Publish</h2>
        <select
          {...register("status")}
          className="border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </section>

      {saveError && <FieldError message={saveError} />}
      {savedAt && !saveError && <p className="text-sm text-primary">Saved.</p>}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary px-8 py-3.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Save product"}
        </button>
        <DeleteButton
          onDelete={() => deleteProduct(product.id)}
          confirmMessage={`Delete "${product.name}"? This can't be undone.`}
          redirectTo="/admin/products"
          label="Delete product"
        />
      </div>
    </form>
  );
}

/** A given facetType's selection is fully replaced by `ids`; ids from other facet types are kept as-is. */
function mergeFacetIds(allFacets: FacetRow[], current: string[], facetType: string, ids: string[]): string[] {
  const otherTypeIds = current.filter((id) => allFacets.find((f) => f.id === id)?.facet_type !== facetType);
  return [...otherTypeIds, ...ids];
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-accent">
      <WarningCircle size={13} aria-hidden />
      {message}
    </p>
  );
}
