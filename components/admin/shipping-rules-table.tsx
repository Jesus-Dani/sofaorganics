"use client";

import { upsertShippingRule, deleteShippingRule } from "@/lib/admin/actions";
import { EditableRulesTable } from "@/components/admin/editable-rules-table";
import type { ShippingRuleRow } from "@/types/database.types";

export function ShippingRulesTable({ rules }: { rules: ShippingRuleRow[] }) {
  return (
    <EditableRulesTable
      rules={rules}
      column1Label="Zone"
      column2Label="Rate (₦)"
      newPlaceholder="New zone name"
      addLabel="Add zone"
      getLabel1={(rule) => rule.zone_name}
      getValue2={(rule) => rule.rate}
      onSave={(id, zoneName, rate) => upsertShippingRule({ id, zoneName, rate })}
      onAdd={(zoneName, rate) => upsertShippingRule({ zoneName, rate })}
      onDelete={deleteShippingRule}
      confirmMessage={(rule) => `Delete "${rule.zone_name}"?`}
    />
  );
}
