"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { CaretDown, PawPrint } from "@phosphor-icons/react/dist/ssr";
import { MEGA_MENU_COLUMNS, USE_CASE_COLUMN } from "@/lib/nav-config";

export function MegaMenu() {
  const useCaseFacets = USE_CASE_COLUMN.facets;
  const midpoint = Math.ceil(useCaseFacets.length / 2);
  const useCaseColumns = [useCaseFacets.slice(0, midpoint), useCaseFacets.slice(midpoint)];

  return (
    <NavigationMenu.Root className="relative hidden md:block">
      <NavigationMenu.List className="flex items-center gap-8">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex items-center gap-1.5 py-4 text-[14.5px] text-text data-[state=open]:text-primary">
            Shop
            <CaretDown size={12} weight="bold" aria-hidden className="transition-transform group-data-[state=open]:rotate-180" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-full z-30 w-[720px] border border-border bg-background p-8 shadow-lg">
            <div className="grid grid-cols-4 gap-8">
              {MEGA_MENU_COLUMNS.map((column) => (
                <div key={column.title}>
                  <p className="eyebrow mb-3">{column.title}</p>
                  <ul className="space-y-2.5">
                    {column.facets.map((facet) => (
                      <li key={facet.slug}>
                        <NavigationMenu.Link asChild>
                          <Link
                            href={`${column.basePath}/${facet.slug}`}
                            className="text-sm text-text hover:text-primary"
                          >
                            {facet.label}
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-2">
                <p className="eyebrow mb-3">{USE_CASE_COLUMN.title}</p>
                <div className="grid grid-cols-2 gap-x-6">
                  {useCaseColumns.map((column, i) => (
                    <ul key={i} className="space-y-2.5">
                      {column.map((facet) => (
                        <li key={facet.slug}>
                          <NavigationMenu.Link asChild>
                            <Link
                              href={`${USE_CASE_COLUMN.basePath}/${facet.slug}`}
                              className="text-sm text-text hover:text-primary"
                            >
                              {facet.label}
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <NavigationMenu.Link asChild>
                <Link
                  href="/shop?pet_safe=1"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <PawPrint size={16} weight="bold" aria-hidden />
                  Shop everything that&apos;s pet-safe →
                </Link>
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/about" className="py-4 text-[14.5px] text-text hover:text-primary">
              Our Story
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/blog" className="py-4 text-[14.5px] text-text hover:text-primary">
              Journal
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/contact" className="py-4 text-[14.5px] text-text hover:text-primary">
              Contact
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
