import { PawPrint } from "@phosphor-icons/react/dist/ssr";

export function PetSafeBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border border-primary px-2.5 py-1 text-xs font-medium text-primary ${className}`}
    >
      <PawPrint size={14} weight="bold" aria-hidden />
      Pet-Safe
    </span>
  );
}
