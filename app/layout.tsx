import type { Metadata } from "next";
import { Playfair_Display, Karla } from "next/font/google";
import { AppProviders } from "@/app/providers";
import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_DESCRIPTION =
  "Ayurvedic and African herbs, spices, and oils, guided by a functional-medicine approach. Rooted in tradition, sold with wellness-support honesty.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sofa Organics: Ayurvedic & African Herbs, Spices, and Oils",
    template: "%s | Sofa Organics",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: "Sofa Organics",
    type: "website",
    locale: "en_NG",
    title: "Sofa Organics: Ayurvedic & African Herbs, Spices, and Oils",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sofa Organics: Ayurvedic & African Herbs, Spices, and Oils",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${karla.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
