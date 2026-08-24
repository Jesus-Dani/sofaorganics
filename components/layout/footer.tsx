import Link from "next/link";
import { InstagramLogo, FacebookLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import { TYPE_FACETS_FOR_FOOTER, WHATSAPP_LINK } from "@/lib/nav-config";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      ...TYPE_FACETS_FOR_FOOTER.slice(0, 4).map((f) => ({ label: f.label, href: `/shop/type/${f.slug}` })),
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Journal", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Disclaimer", href: "/legal/disclaimer" },
      { label: "Returns Policy", href: "/legal/returns-policy" },
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms of Service", href: "/legal/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-alt">
      <div className="wrap grid grid-cols-2 gap-10 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <span className="block font-serif text-2xl font-semibold text-text">SOFA Organics</span>
          <p className="mt-3 max-w-xs text-sm text-text">
            Ayurvedic and African herbs, spices, and oils, guided by a functional-medicine approach.
            Rooted in tradition, sold with a wellness-support promise, never a cure claim.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary underline">
              Chat on WhatsApp
            </a>
          </div>
          <div className="mt-6 flex items-center gap-4 text-text-muted">
            <a href="#" aria-label="Sofa Organics on Instagram"><InstagramLogo size={20} /></a>
            <a href="#" aria-label="Sofa Organics on Facebook"><FacebookLogo size={20} /></a>
            <a href="#" aria-label="Sofa Organics on TikTok"><TiktokLogo size={20} /></a>
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="eyebrow mb-4">{column.title}</p>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-muted hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border py-6">
        <div className="wrap flex flex-col items-center justify-between gap-2 text-xs text-text sm:flex-row">
          <p>© {new Date().getFullYear()} Sofa Organics. All rights reserved.</p>
          <p>Herbal and wellness products are not intended to diagnose, treat, cure, or prevent any disease.</p>
        </div>
      </div>
    </footer>
  );
}
