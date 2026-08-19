"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";

export interface PickableProduct {
  id: string;
  name: string;
}

export function RelatedProductsPicker({
  products,
  selectedIds,
  onChange,
}: {
  products: PickableProduct[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = products.filter((p) => selectedIds.includes(p.id));
  const results = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()) && !selectedIds.includes(p.id))
    : [];

  return (
    <div>
      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selected.map((p) => (
            <span key={p.id} className="flex items-center gap-1.5 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-text">
              {p.name}
              <button type="button" onClick={() => onChange(selectedIds.filter((id) => id !== p.id))} aria-label={`Remove ${p.name}`}>
                <X size={11} aria-hidden />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative max-w-sm">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products to link"
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        {results.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full border border-border bg-background shadow-lg">
            {results.slice(0, 6).map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange([...selectedIds, p.id]);
                    setQuery("");
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-background-alt"
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
