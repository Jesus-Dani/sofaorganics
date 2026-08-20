import Link from "next/link";
import { getAllSiteContent } from "@/lib/admin/site-content";

export const metadata = { title: "Site Content · Admin" };

const LABELS: Record<string, string> = {
  disclaimer: "Disclaimer",
  returns_policy: "Returns Policy",
  privacy_policy: "Privacy Policy",
  terms: "Terms of Service",
};

export default async function SiteContentPage() {
  const rows = await getAllSiteContent();

  return (
    <div>
      <h1 className="mb-6 text-2xl">Site Content</h1>
      <div className="border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border last:border-0 hover:bg-background-alt">
                <td className="px-4 py-3">
                  <Link href={`/admin/site-content/${row.key}`} className="font-medium text-text hover:text-primary">
                    {LABELS[row.key] ?? row.key}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text-muted">{new Date(row.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
