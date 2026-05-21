import { BlinkInvoice } from './types';

// ── Timing-safe string comparison ─────────────────────────────────────────────
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ── HMAC-SHA256 verification against raw body ─────────────────────────────────
export async function verifySignature(
  bodyText: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const bodyBuffer   = new TextEncoder().encode(bodyText);
  const secretBuffer = new TextEncoder().encode(secret);

  const cryptoKey = await crypto.subtle.importKey('raw', secretBuffer, 'HMAC', false, [
    'sign',
  ]);
  const rawSigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, bodyBuffer);

  const expectedSig = Array.from(new Uint8Array(rawSigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return safeCompare(signature, expectedSig);
}

// ── Stub: crear invoice Blink ─────────────────────────────────────────────────
export async function createBlinkInvoice(params: {
  satAmount: number;
  memo: string;
}): Promise<BlinkInvoice> {
  // TODO: reemplazar por llamada real a Blink GraphQL API
  throw new Error('createBlinkInvoice: no implementada aún');
}

// ── Stub: verificar estado de invoice ─────────────────────────────────────────
export async function checkInvoiceStatus(invoiceId: string): Promise<BlinkInvoice['status']> {
  // TODO: reemplazar por llamada real a Blink GraphQL API
  throw new Error('checkInvoiceStatus: no implementada aún');
}
