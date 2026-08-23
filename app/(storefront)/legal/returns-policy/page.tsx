import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getSiteContentBodyByKey } from "@/lib/data/site-content";

export const metadata: Metadata = { title: "Returns Policy" };

export default async function ReturnsPolicyPage() {
  const bodyHtml = await getSiteContentBodyByKey("returns_policy");
  return <LegalPage title="Returns Policy" bodyHtml={bodyHtml} />;
}
