import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        We collect the information needed to fulfil an order (name, contact details, and shipping
        address), and, if you create an account, your order history and saved details.
      </p>
      <p>
        Payment is processed by Paystack; we never see or store your full card details. We use your
        email or phone number only to send order updates, unless you&apos;ve opted into other
        communication.
      </p>
      <p>
        We don&apos;t sell your personal information to third parties. You can ask us to update or
        delete your data at any time by contacting us.
      </p>
    </LegalPage>
  );
}
