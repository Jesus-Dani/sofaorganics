"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { upsertShippingRule, deleteShippingRule } from "@/lib/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import type { ShippingRuleRow } from "@/types/database.types";

function Row({ rule }: { rule: ShippingRuleRow }) {
  const router = useRouter();
  const [zoneName, setZoneName] = useState(rule.zone_name);
  const [rate, setRate] = useState(String(rule.rate));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await upsertShippingRule({ id: rule.id, zoneName, rate: Number(rate) });
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
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
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
          <DeleteButton onDelete={() => deleteShippingRule(rule.id)} confirmMessage={`Delete "${rule.zone_name}"?`} />
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
  const [zoneName, setZoneName] = useState("");
  const [rate, setRate] = useState("0");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    startTransition(async () => {
      try {
        await upsertShippingRule({ zoneName, rate: Number(rate) });
        setZoneName("");
        setRate("0");
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
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
          placeholder="New zone name"
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </td>
      <td className="px-4 py-2 text-right">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || !zoneName.trim()}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 disabled:opacity-50"
        >
          <Plus size={13} aria-hidden />
          {isPending ? "Adding…" : "Add zone"}
        </button>
        {error && <p className="mt-1 text-xs text-accent">{error}</p>}
      </td>
    </tr>
  );
}

export function ShippingRulesTable({ rules }: { rules: ShippingRuleRow[] }) {
  return (
    <div className="border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
            <th className="px-4 py-3">Zone</th>
            <th className="px-4 py-3">Rate (₦)</th>
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
