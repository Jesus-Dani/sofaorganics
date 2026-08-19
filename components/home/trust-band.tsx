import { Leaf, MapPinLine, Package, ClipboardText } from "@phosphor-icons/react/dist/ssr";

const POINTS = [
  {
    icon: Leaf,
    title: "No pre-made formulations",
    body: "Every herb is sold as itself — whole leaf, root, or oil — the way it would be handed to you in person.",
  },
  {
    icon: ClipboardText,
    title: "Root-cause, not quick-fix",
    body: "Product copy is written in wellness-support language throughout, not disease-cure claims.",
  },
  {
    icon: MapPinLine,
    title: "Two sourcing traditions, tagged",
    body: "Ayurvedic staples alongside West African roots, barks, and oils, filterable by origin on every product.",
  },
  {
    icon: Package,
    title: "Real stock, not a guess",
    body: "Every size shows In Stock, Low Stock, or Out of Stock before you add it to your cart.",
  },
];

export function TrustBand() {
  return (
    <section className="border-y border-border bg-background-alt py-14">
      <div className="wrap grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-4">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-text">
              <Icon size={20} weight="light" aria-hidden />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-text">{title}</h4>
              <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
