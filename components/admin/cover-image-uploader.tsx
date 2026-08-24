"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Trash, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function CoverImageUploader({
  bucket,
  folder,
  value,
  onChange,
}: {
  bucket: "product-images" | "blog-images";
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const path = `${folder}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <div className="relative aspect-[16/9] w-full max-w-sm overflow-hidden border border-border">
        <Image src={value} alt="Cover" fill className="object-cover" sizes="384px" />
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Remove cover image"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-text/70 text-background hover:text-accent"
        >
          <Trash size={14} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex max-w-sm cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border p-8 text-center hover:border-primary"
      >
        <UploadSimple size={20} className="text-text-muted" aria-hidden />
        <p className="text-sm text-text-muted">{isUploading ? "Uploading…" : "Click to upload a cover image"}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </div>
      {error && <p className="mt-2 text-xs text-text">{error}</p>}
    </div>
  );
}
