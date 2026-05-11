// ============================================================
// HACKATHON REGISTRATION PAGE — Team registration form
// Acepta Bitcoin México | Oracle System v2.0
// ============================================================

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { REGISTRATION_DEFAULTS } from "@/lib/hackathon/validation";
import RegistrationForm from "@/components/hackathon/forms/RegistrationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | Hackathon Bitcoin México",
  description: "Formulario de registro para equipos participantes",
};

export default async function RegisterPage({ params }: { params: { edition: string } }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href={`/hackathon/${params.edition}`}
            className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-matrix transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al Hackathon
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-bold text-white">
              Registro de Equipo
            </h1>
            <p className="font-mono text-gray-400">
              Completa el formulario para participar en el Hackathon Bitcoin
              México 2026
            </p>
          </div>

          {/* Registration Form */}
          <RegistrationForm defaults={REGISTRATION_DEFAULTS} edition={params.edition} />
        </div>
      </main>
    </div>
  );
}