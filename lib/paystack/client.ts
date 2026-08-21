/**
 * Real Paystack integration (TRD §4) — written to spec but unused while
 * PAYSTACK_SECRET_KEY is unset. Checkout currently calls the "Simulate
 * Payment" route (app/api/checkout/[orderId]/simulate-payment/route.ts)
 * instead of initializeTransaction below. Swap that call for this one, and
 * point Paystack's dashboard webhook at app/api/webhooks/paystack/route.ts,
 * once real keys exist.
 */

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set — Paystack is not configured yet.");
  return key;
}

export interface InitializeTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export async function initializeTransaction(params: {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, string>;
}): Promise<InitializeTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountNaira * 100), // Paystack expects kobo
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const json = await response.json();
  if (!response.ok || !json.status) {
    throw new Error(json.message ?? "Failed to initialize Paystack transaction");
  }

  return {
    authorizationUrl: json.data.authorization_url,
    accessCode: json.data.access_code,
    reference: json.data.reference,
  };
}

export async function verifyTransaction(reference: string): Promise<{ status: string; amount: number }> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
  });

  const json = await response.json();
  if (!response.ok || !json.status) {
    throw new Error(json.message ?? "Failed to verify Paystack transaction");
  }

  return { status: json.data.status, amount: json.data.amount / 100 };
}

/** HMAC SHA512 of the raw request body, per Paystack's webhook signature spec. */
export async function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): Promise<boolean> {
  if (!signatureHeader) return false;
  const crypto = await import("node:crypto");
  const expected = crypto.createHmac("sha512", getSecretKey()).update(rawBody).digest("hex");
  return expected === signatureHeader;
}
