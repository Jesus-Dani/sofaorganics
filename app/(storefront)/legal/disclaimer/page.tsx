import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getSiteContentByKey } from "@/lib/data/site-content";

export const metadata: Metadata = { title: "Disclaimer" };

export default async function DisclaimerPage() {
  const bodyHtml = await getSiteContentByKey("disclaimer");
  return <LegalPage title="Disclaimer" bodyHtml={bodyHtml} />;
}
