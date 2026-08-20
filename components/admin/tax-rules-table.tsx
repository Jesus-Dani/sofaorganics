"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { upsertTaxRule, deleteTaxRule } from "@/lib/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import type { TaxRuleRow } from "@/types/database.types";

function Row({ rule }: { rule: TaxRuleRow }) {
  const router = useRouter();
  const [region, setRegion] = useState(rule.region);
  const [ratePercent, setRatePercent] = useState(String(rule.rate_percent));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await upsertTaxRule({ id: rule.id, region, ratePercent: Number(ratePercent) });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save");
      }
    });
  };

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-2">
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          step="0.01"
          value={ratePercent}
          onChange={(e) => setRatePercent(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </td>
      <td className="px-4 py-2 text-right">
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="text-sm font-medium text-primary hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
          <DeleteButton onDelete={() => deleteTaxRule(rule.id)} confirmMessage={`Delete "${rule.region}"?`} />
        </div>
        {error && (
          <p className="mt-1 flex items-center justify-end gap-1 text-xs text-accent">
            <WarningCircle size={12} aria-hidden />
            {error}
          </p>
        )}
      </td>
    </tr>
  );
}

function NewRow() {
  const router = useRouter();
  const [region, setRegion] = useState("");
  const [ratePercent, setRatePercent] = useState("0");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    startTransition(async () => {
      try {
        await upsertTaxRule({ region, ratePercent: Number(ratePercent) });
        setRegion("");
        setRatePercent("0");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't add");
      }
    });
  };

  return (
    <tr>
      <td className="px-4 py-2">
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="New region"
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          step="0.01"
          value={ratePercent}
          onChange={(e) => setRatePercent(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </td>
      <td className="px-4 py-2 text-right">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || !region.trim()}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 disabled:opacity-50"
        >
          <Plus size={13} aria-hidden />
          {isPending ? "Adding…" : "Add region"}
        </button>
        {error && <p className="mt-1 text-xs text-accent">{error}</p>}
      </td>
    </tr>
  );
}

export function TaxRulesTable({ rules }: { rules: TaxRuleRow[] }) {
  return (
    <div className="border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
            <th className="px-4 py-3">Region</th>
            <th className="px-4 py-3">Rate (%)</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <Row key={rule.id} rule={rule} />
          ))}
          <NewRow />
        </tbody>
      </table>
    </div>
  );
}
