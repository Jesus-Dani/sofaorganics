import { WarningCircle } from "@phosphor-icons/react/dist/ssr";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-accent">
      <WarningCircle size={13} aria-hidden />
      {message}
    </p>
  );
}
