"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { DeleteButton } from "@/components/admin/delete-button";

/**
 * Generic two-column editable rule table (used for shipping zones and tax
 * regions — same shape, same interactions, previously two ~147-line
 * near-duplicate files). Callers are thin client-side wrappers so the Server
 * Action wiring stays a plain closure, not something passed across the
 * Server/Client boundary.
 */
export function EditableRulesTable<T extends { id: string }>({
  rules,
  column1Label,
  column2Label,
  newPlaceholder,
  addLabel,
  getLabel1,
  getValue2,
  onSave,
  onAdd,
  onDelete,
  confirmMessage,
}: {
  rules: T[];
  column1Label: string;
  column2Label: string;
  newPlaceholder: string;
  addLabel: string;
  getLabel1: (rule: T) => string;
  getValue2: (rule: T) => number;
  onSave: (id: string, label1: string, value2: number) => Promise<void>;
  onAdd: (label1: string, value2: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  confirmMessage: (rule: T) => string;
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-border bg-background-alt text-left text-xs uppercase text-text-muted">
            <th className="px-4 py-3">{column1Label}</th>
            <th className="px-4 py-3">{column2Label}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <Row
              key={rule.id}
              initialLabel1={getLabel1(rule)}
              initialValue2={getValue2(rule)}
              onSave={(label1, value2) => onSave(rule.id, label1, value2)}
              onDelete={() => onDelete(rule.id)}
              confirmMessage={confirmMessage(rule)}
            />
          ))}
          <NewRow newPlaceholder={newPlaceholder} addLabel={addLabel} onAdd={onAdd} />
        </tbody>
      </table>
    </div>
  );
}

function Row({
  initialLabel1,
  initialValue2,
  onSave,
  onDelete,
  confirmMessage,
}: {
  initialLabel1: string;
  initialValue2: number;
  onSave: (label1: string, value2: number) => Promise<void>;
  onDelete: () => Promise<void>;
  confirmMessage: string;
}) {
  const router = useRouter();
  const [label1, setLabel1] = useState(initialLabel1);
  const [value2, setValue2] = useState(String(initialValue2));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await onSave(label1, Number(value2));
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
          value={label1}
          onChange={(e) => setLabel1(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          step="0.01"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
          <DeleteButton onDelete={onDelete} confirmMessage={confirmMessage} />
        </div>
        {error && (
          <p className="mt-1 flex items-center justify-end gap-1 text-xs text-text">
            <WarningCircle size={12} className="text-accent" aria-hidden />
            {error}
          </p>
        )}
      </td>
    </tr>
  );
}

function NewRow({
  newPlaceholder,
  addLabel,
  onAdd,
}: {
  newPlaceholder: string;
  addLabel: string;
  onAdd: (label1: string, value2: number) => Promise<void>;
}) {
  const router = useRouter();
  const [label1, setLabel1] = useState("");
  const [value2, setValue2] = useState("0");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    startTransition(async () => {
      try {
        await onAdd(label1, Number(value2));
        setLabel1("");
        setValue2("0");
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
          value={label1}
          onChange={(e) => setLabel1(e.target.value)}
          placeholder={newPlaceholder}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          step="0.01"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </td>
      <td className="px-4 py-2 text-right">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || !label1.trim()}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 disabled:opacity-50"
        >
          <Plus size={13} aria-hidden />
          {isPending ? "Adding…" : addLabel}
        </button>
        {error && <p className="mt-1 text-xs text-text">{error}</p>}
      </td>
    </tr>
  );
}
