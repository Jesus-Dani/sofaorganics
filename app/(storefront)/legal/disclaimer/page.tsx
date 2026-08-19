import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <p>
        The products sold on this site are traditional herbs, spices, and oils. They are not
        intended to diagnose, treat, cure, or prevent any disease, and no statement on this site
        has been evaluated by a regulatory body such as NAFDAC.
      </p>
      <p>
        Product descriptions reflect traditional and wellness-support use only. If you are
        pregnant, nursing, taking medication, or managing a medical condition, speak with a
        qualified healthcare provider before using any herbal product.
      </p>
      <p>
        Pet-safe notes on individual product pages are general guidance, not veterinary advice.
        Check with your vet before introducing any new product to your pet&apos;s routine.
      </p>
    </LegalPage>
  );
}
