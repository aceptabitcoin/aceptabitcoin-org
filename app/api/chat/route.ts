import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getSystemPrompt } from '@/lib/prompts/bob-agent';
// ⚠️ Asegúrate que esta ruta existe en tu proyecto o ajusta el import según tu estructura vectorial
import { searchWhitepaper } from '@/lib/vector/search';

export const runtime = 'edge';

// Move instantiation inside POST to avoid build-time errors when GROQ_API_KEY is missing
const getGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY || 'stub_key' });

// ─── Rate Limiter (in-memory) ─────────────────────────────────────────────────
interface RateEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 60_000;

const rateMap = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, retryAfter: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true };
}
// ───────────────────────────────────────────────────────────────────────────────

async function searchWithTimeout(query: string, timeoutMs = 2000) {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('RAG_TIMEOUT')), timeoutMs)
  );
  try {
    const results = await Promise.race([searchWhitepaper(query, 3), timeout]);
    return results as any[];
  } catch {
    return [];
  }
}

function formatRAGContext(docs: any[]): string {
  if (!docs?.length) return '';
  return '\n\n📚 Referencia del Protocolo:\n' + docs
    .map((d, i) => `[${i + 1}] ${(d.metadata?.text || d.text || '').slice(0, 350)}`)
    .join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const status = checkRateLimit(ip);

    if (!status.allowed) {
      return NextResponse.json(
        { error: 'Too Many Requests', retryAfter: Math.ceil(status.retryAfter! / 1000) },
        { status: 429 }
      );
    }

    const { message, context = 'fundamentos', lang = 'es', useRAG = true } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    let systemPrompt = getSystemPrompt(context, lang);

    if (useRAG) {
      const docs = await searchWithTimeout(message.slice(0, 150));
      if (docs.length) {
        systemPrompt += formatRAGContext(docs);
      }
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    return NextResponse.json({
      response: completion.choices[0]?.message?.content?.trim() || '⚠️ No pude procesar eso. Intenta reformular.',
    });
  } catch (err) {
    console.error('[BOB-API] Error:', err);
    return NextResponse.json(
      { response: '⚠️ Error de conexión. B.O.B. se está reiniciando... Intenta de nuevo.' },
      { status: 500 }
    );
  }
}