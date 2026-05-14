import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getSystemPrompt } from '@/lib/prompts/bob-agent';
// ⚠️ Asegúrate que esta ruta existe en tu proyecto o ajusta el import según tu estructura vectorial
import { searchWhitepaper } from '@/lib/vector/search';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export const runtime = 'edge';

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