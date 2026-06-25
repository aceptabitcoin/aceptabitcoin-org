import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getSystemPrompt, getRAGFilter, isValidContext } from '@/lib/prompts/bob-agent';
import { searchWhitepaper } from '@/lib/vector/search';

// ⚠️ SIN runtime = 'edge' → Corre en Node.js por defecto
// El Map en memoria funciona correctamente en este runtime

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY no configurada en variables de entorno');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

// ─── Rate Limiter en memoria (Node.js runtime) ───────────────────────────────
interface RateEntry {
  count: number;
  resetAt: number;
}

const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, RateEntry>();

let lastCleanup = Date.now();

function cleanupRateMap() {
  const now = Date.now();
  // Limpieza perezosa cada 5 minutos para ahorrar CPU
  if (now - lastCleanup > 300_000) {
    rateMap.forEach((entry, key) => {
      if (now >= entry.resetAt) rateMap.delete(key);
    });
    lastCleanup = now;
  }
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  cleanupRateMap();
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
    return (results || []) as any[];
  } catch {
    return [];
  }
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

    const { 
      message, 
      messages = [], 
      context = 'fundamentos', 
      lang = 'es', 
      useRAG = true 
    } = await req.json();

    // Validar contexto
    let contextValid = context;
    if (!isValidContext(context)) {
      console.warn(`[BOB-API] Contexto inválido: ${context}, usando 'fundamentos'`);
      contextValid = 'fundamentos';
    }

    const currentMessage = message || messages[messages.length - 1]?.content;

    if (!currentMessage || typeof currentMessage !== 'string') {
      return NextResponse.json({ error: 'Message text or messages history required' }, { status: 400 });
    }

    // 1. System prompt cypherpunk de B.O.B.
    const systemPromptBase = getSystemPrompt(contextValid, lang);

    // 2. RAG con timeout y filtro específico del contexto
    let ragContextText = '';
    if (useRAG) {
      const ragFilter = getRAGFilter(contextValid);
      const queryWithFilter = `${currentMessage.slice(0, 150)} ${ragFilter}`;
      
      const docs = await searchWithTimeout(queryWithFilter);
      if (docs && docs.length > 0) {
        ragContextText = '\n\n[CONTEXTO TÉCNICO ADICIONAL DEL WHITEPAPER]:\n' + docs
          .map((d, i) => `[Doc ${i + 1}] ${(d.metadata?.text || d.text || '').slice(0, 350)}`)
          .join('\n');
      }
    }

    // 3. Formatear historial de mensajes
    let formattedMessages = messages.length > 0
      ? messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      : [{ role: 'user', content: currentMessage }];

    // Inyección de RAG en el último mensaje de usuario
    if (ragContextText && formattedMessages.length > 0) {
      const lastIdx = formattedMessages.length - 1;
      if (formattedMessages[lastIdx].role === 'user') {
        formattedMessages[lastIdx].content += `\n\nResponde usando preferencialmente esta información si es pertinente:${ragContextText}`;
      }
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPromptBase },
        ...formattedMessages,
      ],
      temperature: 0.5,
      max_tokens: 600,
    });

    return NextResponse.json({
      response: completion.choices[0]?.message?.content?.trim() || '⚠️ No pude procesar eso. Intenta reformular.',
    });
  } catch (err) {
    console.error('[BOB-API] Error:', err);
    return NextResponse.json(
      { response: '⚠️ Error de conexión en el nodo B.O.B. Intenta de nuevo en unos momentos.' },
      { status: 500 }
    );
  }
}