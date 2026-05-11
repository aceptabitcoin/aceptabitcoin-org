// lib/blink.ts
// ============================================================
// BLINK.SV GRAPHQL CLIENT — TipJar Integration
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

const BLINK_API_URL = process.env.BLINK_API_URL || 'https://api.blink.sv/graphql';
const BLINK_API_KEY = process.env.BLINK_API_KEY;
const BLINK_WALLET_ID = process.env.BLINK_WALLET_ID;

// ── Format sats to human-readable ──
export function formatSats(sats: number): string {
  if (sats >= 100_000_000) return `${(sats / 100_000_000).toFixed(8)} ₿`;
  if (sats >= 100_000) return `${(sats / 100_000).toFixed(3)} ₿`;
  if (sats >= 1_000) return `${Math.round(sats / 1_000)}k sats`;
  return `${sats} sats`;
}

// ── GraphQL request helper (server-side only) ──
async function blinkRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!BLINK_API_KEY || !BLINK_WALLET_ID) {
    throw new Error('Blink API credentials not configured');
  }

  const response = await fetch(BLINK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': BLINK_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message || 'Blink API error');
  }
  return result.data as T;
}

// ── Create Lightning Invoice (Server Action / API Route) ──
export async function createLightningInvoice({
  amount,
  currency = 'BTC',
  memo = 'Donación - Acepta Bitcoin México',
}: {
  amount: number; // in sats if BTC, cents if USD
  currency?: 'BTC' | 'USD';
  memo?: string;
}): Promise<{ invoice: string; expiresAt: string }> {
  // Convert USD to sats if needed (simplified: 1 USD ≈ 1000 sats for demo)
  // In production, fetch real BTC/USD rate from Binance API
  const amountInSats = currency === 'USD' ? Math.round(amount * 1000) : amount;

  const query = `
    mutation LnInvoiceCreateOnBehalfOfRecipient($input: LnInvoiceCreateOnBehalfOfRecipientInput!) {
      lnInvoiceCreateOnBehalfOfRecipient(input: $input) {
        invoice {
          paymentRequest
          expiresAt
        }
        errors {
          message
          path
        }
      }
    }
  `;

  const variables = {
    input: {
      recipientWalletId: BLINK_WALLET_ID,
      amount: amountInSats,
      memo,
    },
  };

  const data = await blinkRequest<{
    lnInvoiceCreateOnBehalfOfRecipient: {
      invoice: { paymentRequest: string; expiresAt: string };
      errors: Array<{ message: string; path: string[] }>;
    };
  }>(query, variables);

  if (data.lnInvoiceCreateOnBehalfOfRecipient.errors?.length) {
    throw new Error(data.lnInvoiceCreateOnBehalfOfRecipient.errors[0].message);
  }

  return {
    invoice: data.lnInvoiceCreateOnBehalfOfRecipient.invoice.paymentRequest,
    expiresAt: data.lnInvoiceCreateOnBehalfOfRecipient.invoice.expiresAt,
  };
}

// ── Get On-Chain Address (Server Action / API Route) ──
export async function getOnChainAddress(): Promise<{ address: string }> {
  const query = `
    query OnChainAddressCreate($input: OnChainAddressCreateInput!) {
      onChainAddressCreate(input: $input) {
        address
        errors {
          message
          path
        }
      }
    }
  `;

  const variables = {
    input: {
      walletId: BLINK_WALLET_ID,
    },
  };

  const data = await blinkRequest<{
    onChainAddressCreate: {
      address: string;
      errors: Array<{ message: string; path: string[] }>;
    };
  }>(query, variables);

  if (data.onChainAddressCreate.errors?.length) {
    throw new Error(data.onChainAddressCreate.errors[0].message);
  }

  return { address: data.onChainAddressCreate.address };
}
