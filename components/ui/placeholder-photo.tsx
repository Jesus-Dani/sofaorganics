/** Matches the mockup's own labeled hatch-pattern placeholder — never a gradient blob. */
export function PlaceholderPhoto({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[repeating-linear-gradient(135deg,rgba(73,57,44,0.06)_0_10px,rgba(73,57,44,0.02)_10px_20px)] p-3 text-center ${className}`}
    >
      <span className="text-[11px] uppercase tracking-wide text-text/45">{label}</span>
    </div>
  );
}
