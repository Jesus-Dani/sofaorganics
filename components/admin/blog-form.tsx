"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { deleteBlogPost, upsertBlogPost } from "@/lib/admin/actions";
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/admin/schema";
import { slugify } from "@/lib/utils/slugify";
import { CoverImageUploader } from "@/components/admin/cover-image-uploader";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { RelatedProductsPicker, type PickableProduct } from "@/components/admin/related-products-picker";
import { DeleteButton } from "@/components/admin/delete-button";
import { FieldError } from "@/components/ui/field-error";
import type { BlogPostRow } from "@/types/database.types";

export function BlogForm({ post, products }: { post: BlogPostRow; products: PickableProduct[] }) {
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
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      bodyRichtext: post.body_richtext,
      coverImagePath: post.cover_image_path,
      status: post.status,
      relatedProductIds: post.related_product_ids,
    },
  });

  const title = watch("title");
  const coverImagePath = watch("coverImagePath");
  const relatedProductIds = watch("relatedProductIds");

  const onSubmit = handleSubmit(async (values) => {
    setSaveError(null);
    try {
      await upsertBlogPost(values);
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save the post");
    }
  });

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-8 pb-16">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text">Title</label>
        <input
          {...register("title")}
          className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
        <FieldError message={errors.title?.message} />
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
            onClick={() => setValue("slug", slugify(title))}
            className="border border-border px-3 text-xs font-medium text-text-muted hover:border-primary"
          >
            Generate from title
          </button>
        </div>
        <FieldError message={errors.slug?.message} />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-text">Cover image</p>
        <CoverImageUploader bucket="blog-images" folder={post.id} value={coverImagePath} onChange={(url) => setValue("coverImagePath", url)} />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-text">Body</p>
        <Controller
          control={control}
          name="bodyRichtext"
          render={({ field }) => <TiptapEditor value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-text">Related products</p>
        <RelatedProductsPicker
          products={products}
          selectedIds={relatedProductIds}
          onChange={(ids) => setValue("relatedProductIds", ids)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text">Status</label>
        <select
          {...register("status")}
          className="border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {saveError && <FieldError message={saveError} />}
      {savedAt && !saveError && <p className="text-sm text-primary">Saved.</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary px-8 py-3.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : "Save post"}
        </button>
        <DeleteButton
          onDelete={() => deleteBlogPost(post.id)}
          confirmMessage={`Delete "${post.title}"? This can't be undone.`}
          redirectTo="/admin/blog"
          label="Delete post"
        />
      </div>
    </form>
  );
}
