import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Returns Policy" };

export default function ReturnsPolicyPage() {
  return (
    <LegalPage title="Returns Policy">
      <p>
        Because these are consumable herbal products, we can only accept returns on unopened,
        unused items in their original packaging, requested within 7 days of delivery.
      </p>
      <p>
        If an item arrives damaged, incorrect, or defective, contact us within 48 hours of
        delivery with a photo and we&apos;ll arrange a replacement or refund at no cost to you.
      </p>
      <p>
        To start a return, message us on WhatsApp or use the contact form with your order details.
      </p>
    </LegalPage>
  );
}
