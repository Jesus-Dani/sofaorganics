import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getSiteContentBodyByKey } from "@/lib/data/site-content";

export const metadata: Metadata = { title: "Terms of Service" };

export default async function TermsPage() {
  const bodyHtml = await getSiteContentBodyByKey("terms");
  return <LegalPage title="Terms of Service" bodyHtml={bodyHtml} />;
}
