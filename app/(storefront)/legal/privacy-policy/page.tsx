import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getSiteContentByKey } from "@/lib/data/site-content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPolicyPage() {
  const bodyHtml = await getSiteContentByKey("privacy_policy");
  return <LegalPage title="Privacy Policy" bodyHtml={bodyHtml} />;
}
