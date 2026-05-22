// app/api/tipjar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createLightningInvoice, getOnChainAddress } from '@/lib/blink';
import { z } from 'zod';

// ================================================
// TIPJAR API — Caja Registradora AceptaBitcoin (v3.0)
// ================================================

// Fallback seguro usando la variable de entorno definida en MANTENIMIENTO.md
const LIGHTNING_ADDRESS = process.env.NEXT_PUBLIC_TIP_JAR_LN_ADDRESS || "aceptabitcoin@blink.sv";

// ─── Rate Limiter Serverless-Friendly (Sin setTimeouts) ────────────────────────
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const tipLimits = new Map<string, RateLimitRecord>();
const TIP_LIMIT_PER_IP = 5; // Flexible para pruebas de UX en producción
const TIP_LIMIT_WINDOW_MS = 5 * 60_000; // 5 minutos

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || "127.0.0.1"
  );
}

function checkTipRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = tipLimits.get(ip);

  // Limpieza pasiva de registros expirados para evitar fugas de memoria en Vercel
  if (record && now > record.resetTime) {
    tipLimits.delete(ip);
  }

  const currentRecord = tipLimits.get(ip);

  if (!currentRecord) {
    tipLimits.set(ip, { count: 1, resetTime: now + TIP_LIMIT_WINDOW_MS });
    return true;
  }

  if (currentRecord.count >= TIP_LIMIT_PER_IP) {
    return false;
  }

  currentRecord.count += 1;
  return true;
}
// ───────────────────────────────────────────────────────────────────────────────

// Esquema refinado para evitar cobros absurdos por error de entrada
const CreateInvoiceSchema = z.object({
  action: z.literal('create-invoice'),
  amount: z.number().positive().int(), 
  currency: z.enum(['SATS', 'USD']),
  memo: z.string().max(160).optional(), // Blink trunca memos >160 chars
  service: z.enum(['general', 'consultoria', 'curso', 'diseno', 'charla', 'donacion']).optional(),
}).refine((data) => {
  if (data.currency === 'USD' && data.amount > 5000) {
    return false; // Límite prudente: $5,000 USD por transacción pública
  }
  if (data.currency === 'SATS' && data.amount > 21_000_000) {
    return false; // Límite: 21M sats (~0.21 BTC)
  }
  return true;
}, {
  message: "El monto excede los límites máximos de seguridad de la Caja Registradora.",
  path: ["amount"]
});

const GetOnchainSchema = z.object({
  action: z.literal('get-onchain'),
});

const RequestSchema = z.union([CreateInvoiceSchema, GetOnchainSchema]);

// Tipos para respuestas API (mejor DX + type safety)
type TipJarSuccessResponse = {
  success: true;
  invoice?: string;
  address?: string;
  expiresAt?: string | null;
  amountInSats?: number;
  currency?: 'SATS' | 'USD';
  memo?: string;
};

type TipJarErrorResponse = {
  success: false;
  error: string;
  details?: unknown;
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<TipJarSuccessResponse | TipJarErrorResponse>> {
  try {
    // ── Rate Limiting ──────────────────────────────────────────────────────────
    const ip = getClientIp(request);
    if (!checkTipRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Límite de solicitudes alcanzado. Intenta en 5 minutos." },
        { 
          status: 429, 
          headers: { 'Retry-After': '300' } // 5 minutos en segundos para clientes programáticos
        }
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos', 
          details: parsed.error.issues 
        },
        { status: 400 }
      );
    }

    const requestData = parsed.data;

    if (requestData.action === 'create-invoice') {
      const { amount, currency, memo, service } = requestData;

      // Memo sanitizado: trim + fallback con servicio en minúsculas para consistencia con enum
      const finalMemo = memo?.trim() || 
        `Servicio: ${service || 'general'} - Acepta Bitcoin México`;

      // Llamada a la abstracción de Blink con manejo estricto de tipos
      const result = await createLightningInvoice({
        amount,
        currency,
        memo: finalMemo,
        metadata: { 
          service: service || 'general',
          source: 'caja-registradora',
          lightningAddress: LIGHTNING_ADDRESS 
        },
      });

      return NextResponse.json({
        success: true,
        invoice: result.invoice,
        expiresAt: result.expiresAt,
        amountInSats: result.amountInSats, // Siempre exponer sats calculados por Blink (independiente de currency)
        currency: currency,
        memo: finalMemo,
      });
    }

    if (requestData.action === 'get-onchain') {
      const result = await getOnChainAddress();
      
      return NextResponse.json({
        success: true,
        address: result.address,
        expiresAt: result.expiresAt,
      });
    }

    return NextResponse.json({ success: false, error: 'Acción no soportada' }, { status: 400 });

  } catch (error: any) {
    // Logging estructurado para Sentry: contexto completo para debugging en producción
    console.error('[TipJar API] Error crítico:', {
      message: error.message || 'Unknown Error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno en el nodo de pagos. Intenta nuevamente.' 
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  // Health check simple — en futuro podríamos consultar estado real de Blink
  return NextResponse.json({
    name: "Caja Registradora API - Acepta Bitcoin México",
    version: "v3.0",
    lightningAddress: LIGHTNING_ADDRESS,
    supportedActions: ['create-invoice', 'get-onchain'],
    currencies: ['SATS', 'USD'],
    status: "OPERATIONAL", // Podría ser dinámico: consultar salud de Blink en v3.1
    rateLimit: {
      perIp: TIP_LIMIT_PER_IP,
      windowMs: TIP_LIMIT_WINDOW_MS,
    },
  });
}