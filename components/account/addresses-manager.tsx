"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { AddressForm } from "@/components/account/address-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAddress } from "@/lib/customer/actions";
import type { AddressRow } from "@/types/database.types";

export function AddressesManager({ addresses }: { addresses: AddressRow[] }) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  if (editingId === "new") {
    return <AddressForm onDone={() => setEditingId(null)} />;
  }

  const editing = addresses.find((a) => a.id === editingId);
  if (editing) {
    return <AddressForm address={editing} onDone={() => setEditingId(null)} />;
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div key={address.id} className="flex items-start justify-between border border-border p-5">
          <div className="text-sm text-text">
            {address.is_default && <p className="mb-1 text-xs font-semibold uppercase text-primary">Default</p>}
            {address.label && <p className="font-medium text-text">{address.label}</p>}
            <p>{address.line1}</p>
            {address.line2 && <p>{address.line2}</p>}
            <p>
              {address.city}, {address.state}
            </p>
            <p>{address.country}</p>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setEditingId(address.id)} className="text-xs font-medium text-primary hover:opacity-80">
              Edit
            </button>
            <DeleteButton onDelete={() => deleteAddress(address.id)} confirmMessage="Delete this address?" />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setEditingId("new")}
        className="flex items-center gap-1.5 border border-dashed border-border px-4 py-3 text-sm font-medium text-text-muted hover:border-primary hover:text-primary"
      >
        <Plus size={14} aria-hidden />
        Add a new address
      </button>
    </div>
  );
}
