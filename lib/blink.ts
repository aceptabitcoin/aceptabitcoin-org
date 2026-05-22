// ============================================================
// BLINK.SV GRAPHQL CLIENT — Caja Registradora
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import * as Sentry from '@sentry/nextjs';

const BLINK_API_URL = process.env.BLINK_API_URL || 'https://api.blink.sv/graphql';
const BLINK_API_KEY = process.env.BLINK_API_KEY;
const BLINK_WALLET_ID = process.env.BLINK_WALLET_ID;

// ── Configuración de resiliencia ─────────────────────────────
const BLINK_REQUEST_TIMEOUT_MS = 15_000; // 15 segundos
const BLINK_MAX_RETRIES = 3;
const BLINK_RETRY_DELAY_MS = 500; // Base para backoff exponencial

// ── Tipado estricto para metadata ────────────────────────────
export interface BlinkInvoiceMetadata {
  service?: 'general' | 'consultoria' | 'curso' | 'diseno' | 'charla' | 'donacion';
  source: 'caja-registradora' | 'hackathon' | 'tianguis';
  lightningAddress?: string;
  [key: string]: unknown;
}

// ── Labels de servicios (movido arriba para evitar TDZ) ───────
export const SERVICE_LABELS = {
  general: "General",
  consultoria: "Consultoría",
  curso: "Curso",
  diseno: "Diseño Web",
  charla: "Charla",
  donacion: "Donación",
} as const;

// ── Validación de montos (doble capa de seguridad) ───────────
function validateInvoiceAmount(amount: number, currency: 'SATS' | 'USD'): void {
  const limits = {
    SATS: { min: 1, max: 21_000_000 }, // ~0.21 BTC
    USD: { min: 1, max: 5000 },
  };
  const { min, max } = limits[currency];
  
  if (!Number.isInteger(amount) || amount < min || amount > max) {
    throw new Error(
      `Monto inválido para ${currency}: debe estar entre ${min} y ${max}`
    );
  }
}

// ── Format sats para UI ──────────────────────────────────────
export function formatSats(sats: number): string {
  if (sats >= 100_000_000) return `${(sats / 100_000_000).toFixed(4)} ₿`;
  if (sats >= 10_000) return `${Math.round(sats / 1000)}k sats`;
  return `${sats} sats`;
}

// ── Helper: Sleep para retries ───────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── GraphQL request con retry + timeout + Sentry ─────────────
async function blinkRequest<T>(
  query: string, 
  variables?: Record<string, unknown>,
  operationName?: string
): Promise<T> {
  if (!BLINK_API_KEY || !BLINK_WALLET_ID) {
    const error = new Error('Blink API credentials no configurados. Revisa las variables de entorno.');
    Sentry.captureException(error, { tags: { module: 'blink', operation: operationName } });
    throw error;
  }

  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= BLINK_MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), BLINK_REQUEST_TIMEOUT_MS);
    
    try {
      const response = await fetch(BLINK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': BLINK_API_KEY,
          'X-Request-ID': crypto.randomUUID?.() || Date.now().toString(),
        },
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Blink HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors?.length) {
        const error = new Error(result.errors[0].message || 'Error en Blink API');
        Sentry.captureException(error, {
          tags: { module: 'blink', operation: operationName },
          extra: { graphqlErrors: result.errors, query, variables }
        });
        throw error;
      }

      return result.data as T;

    } catch (error: any) {
      clearTimeout(timeoutId);
      lastError = error;

      // No reintentar errores de validación o autenticación
      if (error.message?.includes('credentials') || error.message?.includes('401')) {
        break;
      }

      // Backoff exponencial antes del siguiente intento
      if (attempt < BLINK_MAX_RETRIES) {
        const delay = BLINK_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delay);
        continue;
      }

      // Agotar reintentos → registrar en Sentry y lanzar
      Sentry.captureException(lastError, {
        tags: { module: 'blink', operation: operationName, retryExhausted: true },
        extra: { attempts: BLINK_MAX_RETRIES, query, variables }
      });
      throw lastError;
    }
  }

  throw lastError || new Error('Error desconocido en Blink API');
}

// ── Obtener precio BTC (Binance) con fallback conservador ────
export async function getCurrentBTCPrice(): Promise<number> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5_000);
    
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', {
      cache: 'no-store',
      next: { revalidate: 30 },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const data = await res.json();
    return parseFloat(data.price);
  } catch (error) {
    console.warn('[Blink] Fallback: precio BTC de Binance no disponible');
    Sentry.captureMessage('Binance price fallback triggered', { 
      level: 'warning', 
      tags: { module: 'blink', source: 'getCurrentBTCPrice' } 
    });
    return 105000; // Fallback conservador para mercado 2026
  }
}

// ── Crear Invoice Lightning (SATS o USD/Stablesats) ──────────
/**
 * Crea una factura Lightning vía Blink.sv
 * @param amount - Monto en SATS o USD según currency
 * @param currency - 'SATS' para Bitcoin nativo, 'USD' para Stablesats
 * @param memo - Descripción opcional de la transacción
 * @param metadata - Metadatos estructurados para trazabilidad
 */
export async function createLightningInvoice({
  amount,
  currency = 'SATS',
  memo = 'Pago - Acepta Bitcoin México',
  metadata,
}: {
  amount: number;
  currency?: 'SATS' | 'USD';
  memo?: string;
  metadata?: BlinkInvoiceMetadata;
}): Promise<{ 
  invoice: string; 
  expiresAt: string; 
  amountInSats: number;
}> {
  // Validación temprana antes de llamar a Blink
  validateInvoiceAmount(amount, currency);

  const serviceTag = metadata?.service 
    ? SERVICE_LABELS[metadata.service as keyof typeof SERVICE_LABELS] 
    : '';
  const finalMemo = serviceTag ? `${memo} | ${serviceTag}` : memo;

  try {
    if (currency === 'USD') {
      // === STABLESATS: Liquidación inmediata en USD ===
      const query = `
        mutation LnUsdInvoiceCreate($input: LnUsdInvoiceCreateInput!) {
          lnUsdInvoiceCreate(input: $input) {
            invoice {
              paymentRequest
              expiresAt
              satoshis
            }
            errors { message }
          }
        }
      `;

      const variables = {
        input: {
          recipientWalletId: BLINK_WALLET_ID,
          amount: Math.round(amount * 100), // USD → centavos
          memo: finalMemo,
        },
      };

      const data = await blinkRequest<{
        lnUsdInvoiceCreate: {
          invoice: { paymentRequest: string; expiresAt: string; satoshis?: number };
          errors?: Array<{ message: string }>;
        };
      }>(query, variables, 'LnUsdInvoiceCreate');

      if (data.lnUsdInvoiceCreate.errors?.length) {
        throw new Error(data.lnUsdInvoiceCreate.errors[0].message);
      }

      const satoshis = data.lnUsdInvoiceCreate.invoice.satoshis;
      if (satoshis === undefined) {
        throw new Error('Blink no retornó satoshis equivalentes para invoice USD');
      }

      return {
        invoice: data.lnUsdInvoiceCreate.invoice.paymentRequest,
        expiresAt: data.lnUsdInvoiceCreate.invoice.expiresAt,
        amountInSats: satoshis,
      };

    } else {
      // === SATS: Bitcoin nativo ===
      const query = `
        mutation LnInvoiceCreateOnBehalfOfRecipient($input: LnInvoiceCreateOnBehalfOfRecipientInput!) {
          lnInvoiceCreateOnBehalfOfRecipient(input: $input) {
            invoice {
              paymentRequest
              expiresAt
            }
            errors { message }
          }
        }
      `;

      const variables = {
        input: {
          recipientWalletId: BLINK_WALLET_ID,
          amount: Math.round(amount), // Satoshis exactos
          memo: finalMemo,
        },
      };

      const data = await blinkRequest<{
        lnInvoiceCreateOnBehalfOfRecipient: {
          invoice: { paymentRequest: string; expiresAt: string };
          errors?: Array<{ message: string }>;
        };
      }>(query, variables, 'LnInvoiceCreateOnBehalfOfRecipient');

      if (data.lnInvoiceCreateOnBehalfOfRecipient.errors?.length) {
        throw new Error(data.lnInvoiceCreateOnBehalfOfRecipient.errors[0].message);
      }

      return {
        invoice: data.lnInvoiceCreateOnBehalfOfRecipient.invoice.paymentRequest,
        expiresAt: data.lnInvoiceCreateOnBehalfOfRecipient.invoice.expiresAt,
        amountInSats: Math.round(amount),
      };
    }
  } catch (error: any) {
    // Re-throw con contexto adicional para Sentry
    error.context = { amount, currency, memo, metadata };
    throw error;
  }
}

// ── Obtener dirección On-Chain (Mutation corregida) ──────────
/**
 * Genera una nueva dirección Bitcoin on-chain para recibir pagos
 * @returns Dirección y timestamp opcional de expiración
 */
export async function getOnChainAddress(): Promise<{ 
  address: string; 
  expiresAt?: string;
  createdAt: string;
}> {
  const query = `
    mutation OnChainAddressCreate($input: OnChainAddressCreateInput!) {
      onChainAddressCreate(input: $input) {
        address
        createdAt
        errors { message }
      }
    }
  `;

  const variables = { input: { walletId: BLINK_WALLET_ID } };

  const data = await blinkRequest<{
    onChainAddressCreate: {
      address: string;
      createdAt: string;
      errors?: Array<{ message: string }>;
    };
  }>(query, variables, 'OnChainAddressCreate');

  if (data.onChainAddressCreate.errors?.length) {
    throw new Error(data.onChainAddressCreate.errors[0].message);
  }

  return {
    address: data.onChainAddressCreate.address,
    expiresAt: undefined, // Blink no retorna vencimiento explícito para on-chain
    createdAt: data.onChainAddressCreate.createdAt,
  };
}

// ── Health check proactivo para monitoreo ────────────────────
/**
 * Verifica conectividad y estado básico de la API de Blink
 * @returns true si la API responde correctamente
 */
export async function checkBlinkHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5_000);
    
    const response = await fetch(BLINK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }), // Query mínima de introspección
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}