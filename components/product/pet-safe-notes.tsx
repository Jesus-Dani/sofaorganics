"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { CaretDown, PawPrint } from "@phosphor-icons/react/dist/ssr";

export function PetSafeNotes({ note }: { note: string }) {
  return (
    <Accordion.Root type="single" collapsible className="border border-primary/40">
      <Accordion.Item value="pet-safe">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left">
            <span className="flex items-center gap-2 text-sm font-medium text-primary">
              <PawPrint size={16} weight="bold" aria-hidden />
              Pet-safe usage notes
            </span>
            <CaretDown size={14} aria-hidden className="text-primary transition-transform group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="px-4 pb-4 text-sm leading-relaxed text-text-muted">{note}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
