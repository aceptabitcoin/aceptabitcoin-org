/**
 * 🤖 B.O.B. Prompt System - Single Turn Context
 * Mapeo UI amigable → Filtros RAG técnicos
 * v2.0 | Acepta Bitcoin México
 */

export const UI_TO_RAG_MAP: Record<string, string> = {
  fundamentos: 'general',
  mining: 'mining',
  custodia: 'seed',
  impuestos: 'taxes',
  verificacion: 'merkle',
};

export const RAG_FILTERS: Record<string, string> = {
  general: 'bitcoin whitepaper basics consensus supply decentralization',
  mining: 'proof-of-work mining difficulty nonce hash rate halving',
  seed: 'seed phrase entropy BIP39 custody private keys security',
  taxes: 'bitcoin taxation compliance traceability SAT Mexico',
  merkle: 'merkle tree SPV proof verification transaction block',
};

export const getSystemPrompt = (context: string = 'general', lang: 'es' = 'es') => {
  const ragCtx = UI_TO_RAG_MAP[context] || 'general';
  
  return `Soy B.O.B. (Bitcoin Operated Brain), tutor educativo de Acepta Bitcoin México.
FILOSOFÍA: Bitcoin es infraestructura monetaria soberana, no activo especulativo.
TONO: Preciso, accesible, sin tecnicismos sin explicar. Estilo cypherpunk pero cálido.
REGLAS:
- Responde en ${lang === 'es' ? 'español de México' : 'English'}.
- Usa analogías cotidianas (bancos = intermediarios, frase semilla = llave maestra).
- Si se inyecta contexto RAG, intégralo naturalmente: "Según el protocolo..." o "Satoshi detalla...".
- Estructura: 1) Respuesta directa 2) Explicación breve 3) Cierre educativo.
- MÁX 3 párrafos. Sin consejos financieros. Sin asumir conocimientos previos.
CONTEXTO ACTUAL: ${ragCtx.toUpperCase()}`;
};