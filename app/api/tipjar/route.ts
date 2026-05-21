// app/api/tipjar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createLightningInvoice, getOnChainAddress } from '@/lib/blink';
import { z } from 'zod';

// ================================================
// TIPJAR API — Caja Registradora AceptaBitcoin
// ================================================

const LIGHTNING_ADDRESS = "aceptabitcoin@blink.sv";

// ─── Rate Limiter (in-memory, por IP) ─────────────────────────────────────────
const TIP_LIMIT_PER_IP = 3;
const TIP_LIMIT_WINDOW_MS = 5 * 60_000; // 5 minutos

const tipLimits = new Map<string, number>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || "127.0.0.1"
  );
}

function checkTipRateLimit(ip: string): boolean {
  const count = (tipLimits.get(ip) || 0) + 1;

  if (count > TIP_LIMIT_PER_IP) {
    return false;
  }

  tipLimits.set(ip, count);

  // Resetear el contador de esta IP después del tiempo de ventana
  setTimeout(() => {
    tipLimits.delete(ip);
  }, TIP_LIMIT_WINDOW_MS);

  return true;
}
// ───────────────────────────────────────────────────────────────────────────────

const CreateInvoiceSchema = z.object({
  action: z.literal('create-invoice'),
  amount: z.number().positive().int().max(10_000_000), // ~10 BTC max
  currency: z.enum(['SATS', 'USD']),
  memo: z.string().optional(),
  service: z.enum(['consultoria', 'curso', 'diseno', 'charla', 'donacion']).optional(),
});

const GetOnchainSchema = z.object({
  action: z.literal('get-onchain'),
});

const RequestSchema = z.union([CreateInvoiceSchema, GetOnchainSchema]);

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limiting ──────────────────────────────────────────────────────────
    const ip = getClientIp(request);
    if (!checkTipRateLimit(ip)) {
      return NextResponse.json(
        { error: "Límite de donaciones alcanzado" },
        { status: 429 }
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

    const { action } = parsed.data;

    if (action === 'create-invoice') {
      const { amount, currency, memo, service } = parsed.data;

      const finalMemo = memo || 
        `Servicio: ${service || 'General'} - Acepta Bitcoin México`;

      const result = await createLightningInvoice({
        amount,
        currency,
        memo: finalMemo,
        metadata: { 
          service,
          source: 'caja-registradora',
          lightningAddress: LIGHTNING_ADDRESS 
        },
      });

      return NextResponse.json({
        success: true,
        invoice: result.invoice,
        expiresAt: result.expiresAt,
        amountInSats: result.amountInSats, // sats reales
        currency: currency,
        memo: finalMemo,
      });
    }

    if (action === 'get-onchain') {
      const result = await getOnChainAddress();
      
      return NextResponse.json({
        success: true,
        address: result.address,
        expiresAt: result.expiresAt, // si Blink lo provee
      });
    }

    return NextResponse.json({ success: false, error: 'Acción no soportada' }, { status: 400 });

  } catch (error: any) {
    console.error('[TipJar API] Error crítico:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor. Intenta nuevamente.' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Caja Registradora API - Acepta Bitcoin México",
    version: "v3.0",
    lightningAddress: LIGHTNING_ADDRESS,
    supportedActions: ['create-invoice', 'get-onchain'],
    currencies: ['SATS', 'USD'],
    documentation: "Ver TipJarSection.tsx para uso frontend",
  });
}