"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import * as Accordion from "@radix-ui/react-accordion";
import { List, X, CaretDown, PawPrint } from "@phosphor-icons/react/dist/ssr";
import { MEGA_MENU_COLUMNS, USE_CASE_COLUMN } from "@/lib/nav-config";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" aria-label="Open menu" className="flex items-center justify-center p-1 md:hidden">
          <List size={22} aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-text/40 md:hidden" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm overflow-y-auto bg-background p-6 md:hidden">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="font-serif text-lg">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close menu" className="p-1">
                <X size={20} aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-1">
            <Link href="/shop" onClick={() => setOpen(false)} className="py-3 text-base text-text">
              Shop All
            </Link>

            <Accordion.Root type="multiple" className="border-t border-border">
              {[...MEGA_MENU_COLUMNS, USE_CASE_COLUMN].map((column) => (
                <Accordion.Item key={column.title} value={column.title} className="border-b border-border">
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full items-center justify-between py-3.5 text-left text-base text-text">
                      {column.title}
                      <CaretDown size={14} aria-hidden className="transition-transform group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden pb-3">
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                      {column.facets.map((facet) => (
                        <li key={facet.slug}>
                          <Link
                            href={`${column.basePath}/${facet.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-sm text-text-muted hover:text-primary"
                          >
                            {facet.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>

            <Link
              href="/shop?pet_safe=1"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-primary"
            >
              <PawPrint size={16} weight="bold" aria-hidden />
              Shop pet-safe products →
            </Link>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 text-sm">
              <Link href="/about" onClick={() => setOpen(false)}>Our Story</Link>
              <Link href="/blog" onClick={() => setOpen(false)}>Journal</Link>
              <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
              <Link href="/account" onClick={() => setOpen(false)}>Account</Link>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
