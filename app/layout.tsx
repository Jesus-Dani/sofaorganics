import type { Metadata } from "next";
import { Playfair_Display, Karla } from "next/font/google";
import { AppProviders } from "@/app/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WhatsAppButton } from "@/components/whatsapp-button";
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

export const metadata: Metadata = {
  title: {
    default: "Sofa Organics — Ayurvedic & African Herbs, Spices, and Oils",
    template: "%s | Sofa Organics",
  },
  description:
    "Ayurvedic and African herbs, spices, and oils, guided by a functional-medicine approach. Rooted in tradition, sold with wellness-support honesty.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${karla.variable}`}>
      <body>
        <AppProviders>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </AppProviders>
      </body>
    </html>
  );
}
