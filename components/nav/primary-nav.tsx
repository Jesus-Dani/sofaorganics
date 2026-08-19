"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { PRIMARY_NAV } from "@/lib/nav-config";

export function PrimaryNav() {
  return (
    <NavigationMenu.Root className="relative hidden md:block">
      <NavigationMenu.List className="flex items-center gap-7">
        {PRIMARY_NAV.map((item) => {
          if (item.kind === "link") {
            return (
              <NavigationMenu.Item key={item.label}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={item.href}
                    className={`py-4 text-[14.5px] ${item.accent ? "font-semibold text-accent" : "text-text hover:text-primary"}`}
                  >
                    {item.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item key={item.label} className="relative">
              <NavigationMenu.Trigger className="group flex items-center gap-1.5 py-4 text-[14.5px] text-text data-[state=open]:text-primary">
                {item.label}
                <CaretDown
                  size={12}
                  weight="bold"
                  aria-hidden
                  className="transition-transform group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute left-0 top-full z-30 min-w-[220px] border border-border bg-background py-3 shadow-lg">
                {item.allHref && (
                  <NavigationMenu.Link asChild>
                    <Link
                      href={item.allHref}
                      className="block border-b border-border px-5 py-2.5 text-sm font-semibold text-primary hover:bg-background-alt"
                    >
                      {item.allLabel ?? "Shop All"}
                    </Link>
                  </NavigationMenu.Link>
                )}
                <ul className="py-1">
                  {item.facets.map((facet) => (
                    <li key={facet.slug}>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={`${item.basePath}/${facet.slug}`}
                          className="block px-5 py-2.5 text-sm text-text hover:bg-background-alt hover:text-primary"
                        >
                          {facet.label}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
