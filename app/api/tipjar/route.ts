// app/api/tipjar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createLightningInvoice, getOnChainAddress } from '@/lib/blink';

export async function POST(request: NextRequest) {
  try {
    const { action, amount, currency, memo } = await request.json();

    if (action === 'create-invoice') {
      const { invoice, expiresAt } = await createLightningInvoice({
        amount: Number(amount),
        currency: currency as 'BTC' | 'USD',
        memo: memo || 'Donación - Acepta Bitcoin México',
      });
      return NextResponse.json({ success: true, invoice, expiresAt });
    }

    if (action === 'get-onchain') {
      const { address } = await getOnChainAddress();
      return NextResponse.json({ success: true, address });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    console.error('[TipJar API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TipJar API - Blink.sv Proxy',
    endpoints: {
      POST: {
        'create-invoice': '{ amount, currency: "BTC"|"USD", memo? }',
        'get-onchain': '{}',
      },
    },
  });
}
