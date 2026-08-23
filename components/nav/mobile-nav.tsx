"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import * as Accordion from "@radix-ui/react-accordion";
import { List, X, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { PRIMARY_NAV } from "@/lib/nav-config";

export function MobileNav({ isSignedIn }: { isSignedIn: boolean }) {
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

          <nav className="flex flex-col">
            <Accordion.Root type="multiple" className="border-t border-border">
              {PRIMARY_NAV.map((item) => {
                if (item.kind === "link") {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block border-b border-border py-3.5 text-base ${item.accent ? "font-semibold text-accent" : "text-text"}`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <Accordion.Item key={item.label} value={item.label} className="border-b border-border">
                    <Accordion.Header>
                      <Accordion.Trigger className="group flex w-full items-center justify-between py-3.5 text-left text-base text-text">
                        {item.label}
                        <CaretDown size={14} aria-hidden className="transition-transform group-data-[state=open]:rotate-180" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="overflow-hidden pb-3">
                      <ul className="space-y-2.5">
                        {item.allHref && (
                          <li>
                            <Link
                              href={item.allHref}
                              onClick={() => setOpen(false)}
                              className="text-sm font-semibold text-primary"
                            >
                              {item.allLabel ?? "Shop All"}
                            </Link>
                          </li>
                        )}
                        {item.facets.map((facet) => (
                          <li key={facet.slug}>
                            <Link
                              href={`${item.basePath}/${facet.slug}`}
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
                );
              })}
            </Accordion.Root>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <Link
                href={isSignedIn ? "/account" : "/account/login"}
                prefetch={false}
                onClick={() => setOpen(false)}
              >
                {isSignedIn ? "Account" : "Sign in"}
              </Link>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
