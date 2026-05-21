import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, safeCompare } from '@/lib/ahorro/blink';

const WEBHOOK_SECRET = process.env.BLINK_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // ── Timing-safe header guard ───────────────────────────────────────────────
  if (!WEBHOOK_SECRET) {
    console.error('[Blink Webhook] BLINK_WEBHOOK_SECRET no configurada');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const signature =
    request.headers.get('x-blink-signature') ??
    request.headers.get('X-Blink-Signature') ??
    request.headers.get('x-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  const bodyText = await request.text();

  const isValid = await verifySignature(bodyText, signature, WEBHOOK_SECRET);
  if (!isValid) {
    console.warn('[Blink Webhook] Rejected: invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── Payload válido: TODO idempotencia + business logic ──────────────────────
  console.log('[Blink Webhook] Payload:', bodyText.slice(0, 300));

  // ── Cookie de acceso (vide lib/ahorro/constants.ts) ─────────────────────────
  const maxAge = 30 * 24 * 60 * 60;
  const cookieHeader = `ahorro_access_granted=true; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite="Strict"`;

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { 'Set-Cookie': cookieHeader } }
  );
}
