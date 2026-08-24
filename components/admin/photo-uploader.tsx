"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowDown, ArrowUp, Trash, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { ProductImage } from "@/lib/data/types";

export function PhotoUploader({ productId, images }: { productId: string; images: ProductImage[] }) {
  const router = useRouter();
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    setError(null);
    setIsUploading(true);
    const supabase = createSupabaseBrowserClient();

    try {
      let nextSortOrder = images.length;
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;

        const path = `${productId}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file);
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);
        const { error: insertError } = await supabase.from("product_images").insert({
          product_id: productId,
          storage_path: publicUrl.publicUrl,
          alt_text: file.name.replace(/\.[^.]+$/, ""),
          sort_order: nextSortOrder++,
        });
        if (insertError) throw insertError;
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!window.confirm("Delete this photo? This can't be undone.")) return;
    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await supabase.from("product_images").delete().eq("id", imageId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    router.refresh();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const supabase = createSupabaseBrowserClient();
    const a = images[index];
    const b = images[target];
    if (!a?.id || !b?.id) return;

    await Promise.all([
      supabase.from("product_images").update({ sort_order: target }).eq("id", a.id),
      supabase.from("product_images").update({ sort_order: index }).eq("id", b.id),
    ]);
    router.refresh();
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary-tint" : "border-border"
        }`}
      >
        <UploadSimple size={22} className="text-text-muted" aria-hidden />
        <p className="text-sm text-text-muted">
          {isUploading ? "Uploading…" : "Drag photos here, or click to browse"}
        </p>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </label>

      {error && <p className="mt-2 text-xs text-text">{error}</p>}

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <li key={image.id} className="relative aspect-square overflow-hidden border border-border">
              <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="150px" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-text/70 px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move earlier"
                  className="text-background disabled:opacity-30"
                >
                  <ArrowUp size={14} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => image.id && deleteImage(image.id)}
                  aria-label="Delete photo"
                  className="text-background hover:text-accent"
                >
                  <Trash size={14} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === images.length - 1}
                  aria-label="Move later"
                  className="text-background disabled:opacity-30"
                >
                  <ArrowDown size={14} aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
