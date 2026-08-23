"use client";

import { upsertTaxRule, deleteTaxRule } from "@/lib/admin/actions";
import { EditableRulesTable } from "@/components/admin/editable-rules-table";
import type { TaxRuleRow } from "@/types/database.types";

export function TaxRulesTable({ rules }: { rules: TaxRuleRow[] }) {
  return (
    <EditableRulesTable
      rules={rules}
      column1Label="Region"
      column2Label="Rate (%)"
      newPlaceholder="New region"
      addLabel="Add region"
      getLabel1={(rule) => rule.region}
      getValue2={(rule) => rule.rate_percent}
      onSave={(id, region, ratePercent) => upsertTaxRule({ id, region, ratePercent })}
      onAdd={(region, ratePercent) => upsertTaxRule({ region, ratePercent })}
      onDelete={deleteTaxRule}
      confirmMessage={(rule) => `Delete "${rule.region}"?`}
    />
  );
}
