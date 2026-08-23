"use client";

import { useState, useTransition } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { createFacet } from "@/lib/admin/actions";
import type { FacetRow, FacetType } from "@/types/database.types";

export function FacetPicker({
  facetType,
  label,
  allFacets,
  selectedIds,
  onChange,
}: {
  facetType: FacetType;
  label: string;
  allFacets: FacetRow[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [newLabel, setNewLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Newly created facets aren't in `allFacets` until the parent's data reloads (e.g. after
  // saving triggers router.refresh()) — without tracking them locally too, a facet just
  // created via "Add" would vanish from view immediately, even though it saved correctly.
  const [locallyCreated, setLocallyCreated] = useState<FacetRow[]>([]);
  const options = [...allFacets, ...locallyCreated.filter((f) => !allFacets.some((existing) => existing.id === f.id))].filter(
    (f) => f.facet_type === facetType
  );

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  const addNew = () => {
    const trimmed = newLabel.trim();
    if (trimmed.length < 2) return;
    setError(null);
    startTransition(async () => {
      try {
        const facet = await createFacet(facetType, trimmed);
        setLocallyCreated((prev) => [...prev, facet]);
        onChange([...selectedIds, facet.id]);
        setNewLabel("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't add tag");
      }
    });
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-text">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((facet) => {
          const active = selectedIds.includes(facet.id);
          return (
            <button
              key={facet.id}
              type="button"
              onClick={() => toggle(facet.id)}
              className={`border px-3 py-1.5 text-xs font-medium ${
                active ? "border-primary bg-primary text-background" : "border-border text-text hover:border-primary"
              }`}
            >
              {facet.label}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addNew();
            }
          }}
          placeholder={`Add a new ${label.toLowerCase()} tag`}
          className="flex-1 border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={addNew}
          disabled={isPending || newLabel.trim().length < 2}
          className="flex items-center gap-1 border border-primary px-2.5 py-1.5 text-xs font-medium text-primary disabled:opacity-40"
        >
          <Plus size={12} aria-hidden />
          Add
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}
