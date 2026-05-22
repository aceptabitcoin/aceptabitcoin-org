// ============================================================
// HACKATHON RESOURCES PAGE — Workshops, guides, docs
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { BookOpen, FileText, Video, Code, Download, Bot, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditionConfig, listActiveEditions } from "@/lib/hackathon/editions";
import type { Metadata } from "next";

// ✅ Importar estilos específicos del hackathon
import "@/styles/hackathon.css";

export async function generateMetadata({ params }: { params: { edition: string } }): Promise<Metadata> {
  const edition = await getEditionConfig(params.edition);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aceptabitcoin.org"),
    title: `Recursos | ${edition?.title || "Hackathon Bitcoin México"}`,
    description: "Workshops, guías y documentación para participantes",
  };
}

export async function generateStaticParams() {
  const editions = await listActiveEditions();
  return editions.map((edition) => ({
    edition: edition.slug,
  }));
}

// ── Critical Resources (shown first, featured cards) ──
const CRITICAL_RESOURCES = [
  {
    id: "guide-pdf",
    title: "Guía del Participante",
    description:
      "Conceptos mínimos, glosario y flujo de generación de descriptores. 15 min de lectura.",
    type: "PDF" as const,
    href: "/hackathon/docs/guia-participante-2026-2.pdf",
    badge: "matrix" as const,
    featured: true,
    icon: FileText,
    external: false,
  },
  {
    id: "ai-assistant",
    title: "AI Study Assistant",
    description:
      "Chat interactivo con NotebookLM. Pregunta sobre descriptors, miniscript o timelocks en tiempo real.",
    type: "External" as const,
    href: "https://notebooklm.google.com/notebook/08c92eb6-0d67-4ceb-afb4-6040adb3b2c5",
    badge: "ai" as const,
    featured: true,
    icon: Bot,
    external: true,
  },
];

// ── Standard Resources (grid below) ──
const STANDARD_RESOURCES = [
  {
    title: "API Documentation",
    description: "Endpoints y ejemplos para integraciones",
    icon: Code,
    href: "#",
    type: "Docs",
    external: false,
  },
  {
    title: "Lightning Setup Guide",
    description: "Configuración de desarrollo Lightning Network",
    icon: Download,
    href: "/hackathon/docs/lightning-setup-guide.pdf",
    type: "PDF",
    external: true,
  },
  {
    title: "NIP-99 Cheatsheet",
    description: "Referencia rápida para estándares Nostr",
    icon: FileText,
    href: "/hackathon/docs/nip99-cheatsheet.pdf",
    type: "PDF",
    external: true,
  },
  {
    title: "Workshop Recordings",
    description: "Grabaciones de talleres previos",
    icon: Video,
    // ✅ Link actualizado a la playlist oficial de YouTube
    href: "https://youtube.com/playlist?list=PLDoK2v4GlcLedQyeUbY2S-xb6gQUd9kGL&si=Gq-EOFW25Un0viHS",
    type: "Video",
    external: true,
  },
];

// ============================================================
// PAGE COMPONENT
// ============================================================
export default async function ResourcesPage({
  params,
}: {
  params: { edition: string };
}) {
  const edition = await getEditionConfig(params.edition);

  if (!edition) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-matrix/10 border border-matrix/20">
              <BookOpen className="h-8 w-8 text-matrix" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
                Recursos{" "}
                <span className="text-bitcoin text-lg opacity-50">
                  // {edition.title}
                </span>
              </h1>
              <p className="font-mono text-sm text-gray-400 mt-1">
                Herramientas para construir sin romper la soberanía
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* ===== CRITICAL RESOURCES (TOP ROW) ===== */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {CRITICAL_RESOURCES.map((resource) => (
            <a
              key={resource.id}
              href={resource.href}
              target={resource.external ? "_blank" : undefined}
              rel={resource.external ? "noopener noreferrer" : undefined}
              className={`hackathon-resource-card ${
                resource.featured ? "hackathon-resource-card--featured" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icono dinámico */}
                <div
                  className={`hackathon-resource-icon ${
                    resource.badge === "ai" ? "hackathon-resource-icon--ai" : ""
                  }`}
                >
                  <resource.icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg font-semibold truncate text-white">
                      {resource.title}
                    </h3>
                    <span
                      className={`hackathon-badge hackathon-badge--${resource.badge}`}
                    >
                      {resource.badge === "ai" ? "AI" : "PDF"}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-gray-400 mb-3 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* CTA contextual */}
                  <div className="flex items-center gap-2">
                    <span className="hackathon-btn hackathon-btn--ghost text-xs py-1 px-2">
                      {resource.external ? "Abrir en nueva pestaña →" : "Descargar PDF ↓"}
                    </span>
                    {resource.type === "PDF" && (
                      <span className="font-mono text-[10px] text-gray-500">
                        ~2.1 MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* ===== STANDARD RESOURCES (GRID) ===== */}
        <h2 className="font-serif text-xl text-white mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-matrix" />
          Materiales Adicionales
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STANDARD_RESOURCES.map((resource, idx) => {
            const isExternal = resource.external;
            const CardContent = (
              <>
                <div className="hackathon-resource-icon group-hover:text-bitcoin transition-colors">
                  <resource.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="hackathon-resource-title">{resource.title}</h3>
                  <p className="hackathon-resource-desc">{resource.description}</p>
                  <div className="mt-2">
                    <span className="hackathon-badge hackathon-badge--matrix">
                      {resource.type}
                    </span>
                  </div>
                </div>
              </>
            );

            // ✅ Si es externo (como YouTube o PDFs externos), usamos <a> para evitar problemas de enrutamiento interno en Next.js
            return isExternal ? (
              <a
                key={idx}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hackathon-resource-card group"
              >
                {CardContent}
              </a>
            ) : (
              <Link key={idx} href={resource.href} className="hackathon-resource-card group">
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* ===== EDITION-SPECIFIC RESOURCES (from config) ===== */}
        {edition.resources && edition.resources.length > 0 && (
          <>
            <h2 className="font-serif text-xl text-white mt-16 mb-6 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-bitcoin" />
              Recursos de la Edición
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {edition.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hackathon-resource-card group"
                >
                  <div className="hackathon-resource-icon group-hover:text-bitcoin transition-colors">
                    {resource.type === "video" ? (
                      <Video className="h-6 w-6" />
                    ) : resource.type === "workshop" ? (
                      <Code className="h-6 w-6" />
                    ) : (
                      <BookOpen className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="hackathon-resource-title">{resource.title}</h3>
                    {resource.description && (
                      <p className="hackathon-resource-desc">{resource.description}</p>
                    )}
                    <div className="mt-2">
                      <span className="hackathon-badge hackathon-badge--upcoming">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}