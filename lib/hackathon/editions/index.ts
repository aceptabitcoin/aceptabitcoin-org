import { HackathonEdition } from "./types";
import { edition2026_1 } from "./2026-1"; // Ya completada
import { edition2026_2 } from "./2026-2"; // Custody UI
import { edition2026_3 } from "./2026-3"; // Tianguis

const editions: Record<string, HackathonEdition> = {
  "2026-1": { ...edition2026_1, status: "completed" },
  "2026-2": edition2026_2, // ← Próximo hackathon
  "2026-3": edition2026_3,
  
  // Aliases amigables
  "custody-ui-2026": edition2026_2,
  "tianguis-2026": edition2026_3,
};

export async function getEditionConfig(slug: string): Promise<HackathonEdition | null> {
  return Promise.resolve(editions[slug] || null);
}

export async function listActiveEditions(): Promise<HackathonEdition[]> {
  return Promise.resolve(
    Object.values(editions).filter(ed => ed.status !== "draft")
  );
}

export async function getNextEdition(): Promise<HackathonEdition | null> {
  const editions = await listActiveEditions();
  return editions.find(ed => ed.status === "upcoming") || null;
}
