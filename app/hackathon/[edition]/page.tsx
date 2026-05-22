// ============================================================
// HACKATHON EDITION PAGE — Edition landing page
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ✅ Importar estilos específicos del hackathon
import "@/styles/hackathon.css";

// Components - Display
import EditionHero from "@/components/hackathon/hero/EditionHero";
import Timeline from "@/components/hackathon/display/Timeline";
import Prizes from "@/components/hackathon/display/Prizes";
import EvaluationCriteriaSection from "@/components/hackathon/display/EvaluationCriteriaSection";
import SponsorsGrid from "@/components/hackathon/display/SponsorsGrid";

// Components - Content
import TechnicalConceptsSection from "@/components/hackathon/content/TechnicalConceptsSection";
import DeliverablesSection from "@/components/hackathon/content/DeliverablesSection";
import AntiPatternsSection from "@/components/hackathon/content/AntiPatternsSection";
import StackSection from "@/components/hackathon/content/StackSection";
import FAQSection from "@/components/hackathon/content/FAQSection";
import RulesSection from "@/components/hackathon/content/RulesSection";

// ✅ Componente Arcade/CTA adaptado para Links Externos (Luma Events)
import ArcadeButton from "@/components/ui/ArcadeButton"; 

// Lib
import { getEditionConfig, listActiveEditions } from "@/lib/hackathon/editions";

// ============================================================
// GENERAR METADATOS DINÁMICOS (SEO) — Versión robusta
// ============================================================
export async function generateMetadata({ 
  params 
}: { 
  params: { edition: string } 
}): Promise<Metadata> {
  const edition = await getEditionConfig(params.edition);
  
  if (!edition) {
    return {
      title: "Hackathon no encontrado | Acepta Bitcoin",
      description: "La edición solicitada no existe o está en borrador.",
    };
  }
  
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aceptabitcoin.org"),
    title: `${edition.title} | Hackathon Bitcoin México`,
    description: edition.tagline,
    openGraph: {
      title: edition.title,
      description: edition.tagline,
      type: "website",
      images: [
        {
          url: `/hackathon/logos/${edition.slug}-og.jpg`,
          width: 1200,
          height: 630,
          alt: edition.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: edition.title,
      description: edition.tagline,
    },
  };
}

// ============================================================
// GENERAR RUTAS ESTÁTICAS (SSG) — CRÍTICO para evitar 404
// ============================================================
export async function generateStaticParams() {
  const editions = await listActiveEditions();
  
  return editions.map((edition) => ({
    edition: edition.slug,
  }));
}

// ============================================================
// PÁGINA PRINCIPAL (Server Component)
// ============================================================
interface EditionPageProps {
  params: { edition: string };
}

export default async function EditionPage({ params }: EditionPageProps) {
  // ✅ Await + validación ANTES de cualquier JSX
  const edition = await getEditionConfig(params.edition);
  
  if (!edition || edition.status === "draft") {
    notFound(); // ✅ Esto debe ejecutarse antes del return
  }

  // ✅ Nueva URL Única de Registro en Luma
  const registrationUrl = "https://luma.com/kzdw3pek";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <EditionHero edition={edition} />
      
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-24 relative z-10">
        
        {/* Línea del tiempo */}
        <section id="timeline">
          <Timeline items={edition.timeline} />
        </section>

        {/* Premios */}
        <section id="prizes">
          <Prizes prizes={edition.prizes} paidInBitcoin={true} />
        </section>

        {/* === SECCIONES TÉCNICAS ESPECÍFICAS (SSOT) === */}
        
        {edition.evaluationCriteria && (
          <section id="evaluation">
            <EvaluationCriteriaSection criteria={edition.evaluationCriteria} />
          </section>
        )}
        
        {edition.deliverables && (
          <section id="deliverables">
            <DeliverablesSection deliverables={edition.deliverables} />
          </section>
        )}

        {edition.technicalConcepts && (
          <section id="concepts">
            <TechnicalConceptsSection concepts={edition.technicalConcepts} />
          </section>
        )}

        {edition.antiPatterns && (
          <section id="antipatterns">
            <AntiPatternsSection antiPatterns={edition.antiPatterns} />
          </section>
        )}

        {edition.stack && (
          <section id="stack">
            <StackSection stack={edition.stack} /> 
          </section>
        )}

        {/* Sponsors */}
        {edition.sponsors?.length > 0 && (
          <section id="sponsors">
            <h2 className="font-serif text-3xl text-white mb-8">Aliados y Sponsors</h2>
            <SponsorsGrid sponsors={edition.sponsors} />
          </section>
        )}

        {/* Reglas Generales */}
        {edition.rules && (
          <section id="rules">
            <RulesSection rules={edition.rules} />
          </section>
        )}

        {/* Registro / CTA Final */}
        {edition.status === "upcoming" && (
          <section id="register" className="py-20 border-t border-matrix/20 text-center">
            <h2 className="font-serif text-4xl text-white mb-6">¿Listo para el reto?</h2>
            <p className="font-mono text-gray-400 mb-10 max-w-2xl mx-auto">
              Las inscripciones están abiertas a través de nuestra plataforma oficial en Luma. Forma tu equipo de 2 a 4 personas y asegura tu lugar.
            </p>
            <div className="flex justify-center">
              {/* Usamos la etiqueta nativa <a> con ArcadeButton para enlaces externos obedeciendo el Design System */}
              <a 
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <ArcadeButton className="px-10 py-4 bg-bitcoin text-black font-bold hover:shadow-[0_0_20px_rgba(247,147,26,0.5)] transition-all uppercase tracking-wider text-base">
                  ⚡ REGISTRAR MI EQUIPO EN LUMA
                </ArcadeButton>
              </a>
            </div>
          </section>
        )}

        {/* Preguntas Frecuentes */}
        {edition.faqs && (
          <section id="faq">
            <FAQSection faqs={edition.faqs} />
            <div className="mt-12 text-center border-t border-white/5 pt-8">
              <span className="text-gray-500 text-xs font-mono block mb-4">
                ¿Tienes dudas específicas o requieres soporte con tu registro?
              </span>
              <a 
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-matrix hover:text-matrix-glow font-mono text-sm underline transition-colors"
              >
                Ir a la página del evento de Luma →
              </a>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}