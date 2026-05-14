/**
 * Módulo stub para búsqueda vectorial.
 * Reemplazar con implementación real cuando se configure la infraestructura Upstash.
 */

export interface SearchResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
}

export async function searchWhitepaper(query: string, topK = 5): Promise<SearchResult[]> {
  // Stub: retorna array vacío hasta que se configure Upstash Vector
  return [];
}