// lib/blink.ts
// ============================================================
// BLINK.SV GRAPHQL CLIENT — Caja Registradora
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

const BLINK_API_URL = process.env.BLINK_API_URL || 'https://api.blink.sv/graphql';
const BLINK_API_KEY = process.env.BLINK_API_KEY;
const BLINK_WALLET_ID = process.env.BLINK_WALLET_ID;

const LIGHTNING_ADDRESS = "aceptabitcoin@blink.sv";

// ── Format sats ──
export function formatSats(sats: number): string {
  if (sats >= 100_000_000) return `${(sats / 100_000_000).toFixed(4)} ₿`;
  if (sats >= 10_000) return `${Math.round(sats / 1000)}k sats`;
  return `${sats} sats`;
}

// ── GraphQL request helper ──
async function blinkRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!BLINK_API_KEY || !BLINK_WALLET_ID) {
    throw new Error('Blink API credentials no configurados. Revisa las variables de entorno.');
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

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    throw new Error(result.errors[0].message || 'Error en Blink API');
  }

  return result.data as T;
}

// ── Obtener precio actual de Bitcoin (usando el sistema que ya tienes en el proyecto) ──
async function getCurrentBTCPrice(): Promise<number> {
  try {
    // Intentamos usar tu sistema existente de mercado
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', {
      cache: 'no-store',
      next: { revalidate: 30 }
    });
    
    const data = await res.json();
    return parseFloat(data.price);
  } catch (error) {
    console.warn('[Blink] No se pudo obtener precio de Binance, usando fallback');
    return 105000; // fallback conservador (mayo 2026)
  }
}

// ── Crear Invoice Lightning (SATS o USD/Stablesats) ──
export async function createLightningInvoice({
  amount,
  currency = 'SATS',
  memo = 'Pago - Acepta Bitcoin México',
  metadata,
}: {
  amount: number;
  currency?: 'SATS' | 'USD';
  memo?: string;
  metadata?: Record<string, any>;
}): Promise<{ 
  invoice: string; 
  expiresAt: string; 
  amountInSats?: number;
}> {

  const finalMemo = `${memo} | ${metadata?.service ? SERVICE_LABELS[metadata.service as keyof typeof SERVICE_LABELS] : ''}`;

  if (currency === 'USD') {
    // === USO DE STABLESATS (Recomendado) ===
    const query = `
      mutation LnUsdInvoiceCreate($input: LnUsdInvoiceCreateInput!) {
        lnUsdInvoiceCreate(input: $input) {
          invoice {
            paymentRequest
            expiresAt
            satoshis
          }
          errors {
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        recipientWalletId: BLINK_WALLET_ID,
        amount: Math.round(amount * 100), // USD → cents
        memo: finalMemo,
      },
    };

    const data = await blinkRequest<{
      lnUsdInvoiceCreate: {
        invoice: { paymentRequest: string; expiresAt: string; satoshis?: number };
        errors?: Array<{ message: string }>;
      };
    }>(query, variables);

    if (data.lnUsdInvoiceCreate.errors?.length) {
      throw new Error(data.lnUsdInvoiceCreate.errors[0].message);
    }

    return {
      invoice: data.lnUsdInvoiceCreate.invoice.paymentRequest,
      expiresAt: data.lnUsdInvoiceCreate.invoice.expiresAt,
      amountInSats: data.lnUsdInvoiceCreate.invoice.satoshis,
    };

  } else {
    // === Invoice en SATS (BTC) ===
    const query = `
      mutation LnInvoiceCreateOnBehalfOfRecipient($input: LnInvoiceCreateOnBehalfOfRecipientInput!) {
        lnInvoiceCreateOnBehalfOfRecipient(input: $input) {
          invoice {
            paymentRequest
            expiresAt
          }
          errors {
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        recipientWalletId: BLINK_WALLET_ID,
        amount: Math.round(amount), // en sats
        memo: finalMemo,
      },
    };

    const data = await blinkRequest<any>(query, variables);

    if (data.lnInvoiceCreateOnBehalfOfRecipient.errors?.length) {
      throw new Error(data.lnInvoiceCreateOnBehalfOfRecipient.errors[0].message);
    }

    return {
      invoice: data.lnInvoiceCreateOnBehalfOfRecipient.invoice.paymentRequest,
      expiresAt: data.lnInvoiceCreateOnBehalfOfRecipient.invoice.expiresAt,
    };
  }
}

// ── Obtener dirección On-Chain ──
export async function getOnChainAddress(): Promise<{ address: string; expiresAt?: string }> {
  const query = `
    query OnChainAddressCreate($input: OnChainAddressCreateInput!) {
      onChainAddressCreate(input: $input) {
        address
        expiresAt
        errors {
          message
        }
      }
    }
  `;

  const variables = { input: { walletId: BLINK_WALLET_ID } };

  const data = await blinkRequest<any>(query, variables);

  if (data.onChainAddressCreate.errors?.length) {
    throw new Error(data.onChainAddressCreate.errors[0].message);
  }

  return {
    address: data.onChainAddressCreate.address,
    expiresAt: data.onChainAddressCreate.expiresAt,
  };
}

// Helper para labels (opcional)
const SERVICE_LABELS = {
  consultoria: "Consultoría",
  curso: "Curso",
  diseno: "Diseño Web",
  charla: "Charla",
  donacion: "Donación",
} as const;