import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        By placing an order with Sofa Organics, you agree to provide accurate shipping and contact
        information, and to pay the listed price in effect at checkout, including any applicable
        shipping and tax.
      </p>
      <p>
        Prices, stock levels, and product availability are subject to change without notice.
        Orders are confirmed once payment is received; we&apos;ll contact you directly if an item
        you ordered goes out of stock before we can fulfil it.
      </p>
      <p>
        Use of this site is also governed by our Disclaimer and Privacy Policy, linked in the
        footer.
      </p>
    </LegalPage>
  );
}
