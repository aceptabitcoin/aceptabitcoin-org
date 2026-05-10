// ============================================================
// HACKATHON RESOURCES PAGE — Workshops, guides, docs
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { BookOpen, FileText, Video, Code, Download } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recursos | Hackathon Bitcoin México",
  description: "Workshops, guías y documentación para participantes",
};

const RESOURCES = [
  {
    title: "Guía del Participante",
    description: "Todo lo que necesitas saber para el hackathon",
    icon: BookOpen,
    href: "/public/hackathon/docs/guia-participante-2026-2.pdf",
    type: "PDF",
  },
  {
    title: "API Documentation",
    description: "Endpoints y ejemplos para integraciones",
    icon: Code,
    href: "#",
    type: "Docs",
  },
  {
    title: "Lightning Setup Guide",
    description: "Configuración de desarrollo Lightning Network",
    icon: Download,
    href: "/public/hackathon/docs/lightning-setup-guide.pdf",
    type: "PDF",
  },
  {
    title: "NIP-99 Cheatsheet",
    description: "Referencia rápida para estándares Nostr",
    icon: FileText,
    href: "/public/hackathon/docs/nip99-cheatsheet.pdf",
    type: "PDF",
  },
  {
    title: "Workshop Recordings",
    description: "Grabaciones de talleres previos",
    icon: Video,
    href: "#",
    type: "Video",
  },
];

export default function ResourcesPage() {
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
              <h1 className="font-serif text-4xl font-bold text-white">
                Recursos
              </h1>
              <p className="font-mono text-gray-400 mt-1">
                Guías, documentación y materiales para participantes
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCES.map((resource, idx) => (
            <Link
              key={idx}
              href={resource.href}
              className="hackathon-resource-card group"
              target={resource.type === "PDF" ? "_blank" : undefined}
            >
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
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}