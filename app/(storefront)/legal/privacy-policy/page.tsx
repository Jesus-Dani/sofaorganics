import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getSiteContentBodyByKey } from "@/lib/data/site-content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPolicyPage() {
  const bodyHtml = await getSiteContentBodyByKey("privacy_policy");
  return <LegalPage title="Privacy Policy" bodyHtml={bodyHtml} />;
}
