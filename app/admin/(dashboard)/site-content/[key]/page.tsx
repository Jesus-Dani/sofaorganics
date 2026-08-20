import { notFound } from "next/navigation";
import { getSiteContentByKey } from "@/lib/admin/site-content";
import { SiteContentForm } from "@/components/admin/site-content-form";
import type { SiteContentKey } from "@/types/database.types";

export const metadata = { title: "Edit Site Content · Admin" };

const VALID_KEYS: SiteContentKey[] = ["disclaimer", "returns_policy", "privacy_policy", "terms"];

const LABELS: Record<SiteContentKey, string> = {
  disclaimer: "Disclaimer",
  returns_policy: "Returns Policy",
  privacy_policy: "Privacy Policy",
  terms: "Terms of Service",
};

export default async function SiteContentEditPage({ params }: { params: { key: string } }) {
  if (!VALID_KEYS.includes(params.key as SiteContentKey)) notFound();
  const key = params.key as SiteContentKey;
  const row = await getSiteContentByKey(key);
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl">{LABELS[key]}</h1>
      <SiteContentForm contentKey={key} bodyRichtext={row.body_richtext} />
    </div>
  );
}
