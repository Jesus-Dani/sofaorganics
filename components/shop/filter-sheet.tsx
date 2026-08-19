"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sliders, X } from "@phosphor-icons/react/dist/ssr";
import type { ShopQuery } from "@/lib/shop/filters";
import { FilterGroups } from "@/components/shop/filter-groups";

export function FilterSheet({ query }: { query: ShopQuery }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium text-text md:hidden"
        >
          <Sliders size={16} aria-hidden />
          Filters
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-text/40 md:hidden" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-tile bg-background p-6 md:hidden">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="font-serif text-lg">Filters</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close filters" className="p-1">
                <X size={20} aria-hidden />
              </button>
            </Dialog.Close>
          </div>
          <FilterGroups query={query} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
