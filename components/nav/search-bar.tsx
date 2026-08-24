"use client";

import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

const searchSchema = z.object({
  q: z.string().trim().min(1, "Type something to search for"),
});
type SearchValues = z.infer<typeof searchSchema>;

export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const searchInputId = useId();
  const { register, handleSubmit } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { q: "" },
  });

  const onSubmit = handleSubmit(({ q }) => {
    router.push(`/search?q=${encodeURIComponent(q)}`);
  });

  return (
    <form
      onSubmit={onSubmit}
      className={`flex items-stretch border border-border bg-background ${className}`}
      role="search"
    >
      <label htmlFor={searchInputId} className="sr-only">
        Search products and articles
      </label>
      <input
        {...register("q")}
        id={searchInputId}
        type="text"
        placeholder="Search products, articles"
        className="flex-1 bg-transparent px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex items-center justify-center bg-primary px-4 text-background"
      >
        <MagnifyingGlass size={16} aria-hidden />
      </button>
    </form>
  );
}
