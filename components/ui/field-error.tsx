import { WarningCircle } from "@phosphor-icons/react/dist/ssr";

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-text">
      <WarningCircle size={13} className="text-accent" aria-hidden />
      {message}
    </p>
  );
}
