import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getCustomerId } from "@/lib/customer/auth";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const customerId = await getCustomerId();

  return (
    <>
      <Header isSignedIn={Boolean(customerId)} />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
