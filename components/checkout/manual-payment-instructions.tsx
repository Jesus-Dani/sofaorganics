"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check } from "@phosphor-icons/react/dist/ssr";
import { formatCurrency } from "@/lib/utils/format-currency";
import { WHATSAPP_NUMBER } from "@/lib/nav-config";

const ACCOUNT_NAME = "Sofa Herbs And Spices Nigeria Ltd - Sandra Ojeikere Anaba";
const ACCOUNT_NUMBER = "6632620644";
const BANK_NAME = "Moniepoint MFB";

interface OrderItem {
  product_name: string;
  size_label: string;
  quantity: number;
  unit_price: number;
}

export function ManualPaymentInstructions({
  orderId,
  guestName,
  grandTotal,
  currency,
  items,
  isSignedIn,
}: {
  orderId: string;
  guestName: string | null;
  grandTotal: number;
  currency: string;
  items: OrderItem[];
  isSignedIn: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const itemLines = items.map((item) => `- ${item.product_name} (${item.size_label}) x${item.quantity}`).join("\n");
  const message = [
    `Hi, my name is ${guestName ?? "..."}.`,
    `I've just made a bank transfer for order #${orderId.slice(0, 8)}:`,
    itemLines,
    `Total: ${formatCurrency(grandTotal, currency)}`,
    `My payment receipt is attached.`,
  ].join("\n");

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="wrap max-w-lg py-16">
      <p className="eyebrow mb-2 text-center">Order #{orderId.slice(0, 8)}</p>
      <h1 className="text-center text-[28px]">Complete your payment</h1>
      <p className="mt-3 text-center text-sm text-text">
        Transfer the amount below, then send us your receipt on WhatsApp so we can confirm it and start
        processing your order.
      </p>

      <div className="mt-8 border border-border p-6">
        <p className="text-sm text-text-muted">Amount due</p>
        <p className="mt-1 text-2xl font-semibold text-text">{formatCurrency(grandTotal, currency)}</p>

        <div className="mt-6 space-y-1.5 border-t border-border pt-5 text-sm">
          <p className="mb-2 font-medium text-text">Bank transfer details</p>
          <p className="text-text">{ACCOUNT_NAME}</p>
          <p className="text-text">{BANK_NAME}</p>
          <div className="flex items-center gap-2">
            <span className="text-text">{ACCOUNT_NUMBER}</span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy account number"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {copied ? (
                <>
                  <Check size={13} aria-hidden /> Copied
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full bg-primary py-3.5 text-center text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Send receipt on WhatsApp
        </a>
        <p className="mt-3 text-xs text-text-muted">
          This opens WhatsApp with your order details already filled in — just attach a photo of your
          receipt before sending.
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-text-muted">
        We&apos;ll update your order to Paid once we&apos;ve confirmed your transfer.
      </p>

      <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm">
        {isSignedIn && (
          <Link href={`/account/orders/${orderId}`} className="font-medium text-primary underline">
            View this order in your account
          </Link>
        )}
        <Link href="/shop" className="text-text-muted underline hover:text-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
