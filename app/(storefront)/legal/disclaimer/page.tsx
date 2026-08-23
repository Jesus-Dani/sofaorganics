import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getSiteContentBodyByKey } from "@/lib/data/site-content";

export const metadata: Metadata = { title: "Disclaimer" };

export default async function DisclaimerPage() {
  const bodyHtml = await getSiteContentBodyByKey("disclaimer");
  return <LegalPage title="Disclaimer" bodyHtml={bodyHtml} />;
}
