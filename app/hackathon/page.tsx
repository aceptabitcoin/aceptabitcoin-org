// ============================================================
// HACKATHON INDEX PAGE — Edition directory / auto-redirect
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { redirect } from "next/navigation";
import { getNextEdition, listActiveEditions } from "@/lib/hackathon/editions";
import HackathonContainer from "@/components/hackathon/layout/HackathonContainer";
import type { Metadata } from "next";

// ✅ Importar estilos específicos del hackathon
import "@/styles/hackathon.css";

export const metadata: Metadata = {
  title: "Bitcoin Hackathon • Acepta Bitcoin México",
  description:
    "Construye interfaces de auto-custodia para Bitcoin. Ediciones activas, recursos y registro.",
};

export default async function HackathonIndexPage() {
  // Opción A: Redirect directo a la próxima edición (UX limpia)
  const nextEdition = await getNextEdition();
  if (nextEdition) {
    redirect(`/hackathon/${nextEdition.slug}`);
  }

  // Fallback: Si no hay edición "upcoming", listar las activas
  const editions = await listActiveEditions();

  return (
    <HackathonContainer>
      <div className="hackathon-container min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-3xl md:text-5xl mb-4 text-white">
          Bitcoin Hackathon México
        </h1>
        <p className="font-mono text-sm md:text-base text-gray-400 mb-8 max-w-2xl">
          Ediciones activas — selecciona una para comenzar:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 w-full max-w-lg">
          {editions.map((edition) => (
            <a
              key={edition.slug}
              href={`/hackathon/${edition.slug}`}
              className="hackathon-panel hackathon-card hover:border-matrix/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-gray-500">
                  {edition.id}
                </span>
                <span
                  className={`hackathon-badge hackathon-badge--${edition.status}`}
                >
                  {edition.status === "upcoming"
                    ? "Próxima"
                    : edition.status === "live"
                      ? "En curso"
                      : "Completada"}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-white mb-1">
                {edition.title}
              </h3>
              <p className="font-mono text-xs text-gray-400 line-clamp-2">
                {edition.tagline}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-8 font-mono text-[10px] text-gray-600">
          ¿Buscas una edición específica? Usa:{" "}
          <code className="text-matrix">/hackathon/[slug]</code>
        </div>
      </div>
    </HackathonContainer>
  );
}
