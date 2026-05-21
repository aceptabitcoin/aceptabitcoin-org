import { NextRequest, NextResponse } from 'next/server';

// ── Env ───────────────────────────────────────────────────────────────────────
const W = (key: string) => process.env[key];
const getSecret = () => W('LNBITS_WEBHOOK_SECRET');

// ── Timing-safe string comparison (bitwise XOR, constant-time) ────────────────
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ── Derive Hex-key from ASCII <SECRET_3ebc67ee>. */h
// En web standard se usa SHA-256(secret) como clave, sin toHex.
// El "hex-secret" (criptografía) no se usa aquí porque el firmante envía un HMAC estándar.
// ─────────────────────────────────────────────────────────────────────────────
async function verifySignature(bodyText: string, signature: string, secret: string): Promise<boolean> {
  const bodyBuffer   = new TextEncoder().encode(bodyText);
  const secretBuffer = new TextEncoder().encode(secret);

  const cryptoKey    = await crypto.subtle.importKey('raw', secretBuffer, 'HMAC', false, ['sign']);
  const rawSigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, bodyBuffer);
  const expectedSig  = Array.from(new Uint8Array(rawSigBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return safeCompare(signature, expectedSig);
}

// ── Webhook entrypoint ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // 1. Guard secret
  const secret = getSecret();
  if (!secret) {
    console.error('[LNbits Webhook] LNBITS_WEBHOOK_SECRET no configurada');
    return NextResponse.json({ error: 'Internal configuration error' }, { status: 500 });
  }

  // 2. Read raw body BEFORE parsing (signature is over raw bytes)
  const bodyText = await request.text();

  // 3. Fetch signature header (lnbits webhooks use X-Signature)
  const signature = request.headers.get('x-signature') ?? request.headers.get('X-Signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  // 4. Validate
  const isValid = await verifySignature(bodyText, signature, secret);

  if (!isValid) {
    console.warn('[LNbits Webhook] Invalid signature rejected');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // 5. Parse payload (only after signature passes)
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: 'Malformed body' }, { status: 400 });
  }

  // 6. TODO: business logic — filtering, idempotency, acknowledgment ──────────
  console.log('[LNbits Webhook] Payload recibido:', JSON.stringify(payload).slice(0, 500));

  return NextResponse.json({ ok: true });
}
