// ============================================================
// HACKATHON EDITION HERO — Featured hero for edition pages
// Acepta Bitcoin México | Oracle System v2.0
// Design System: "Bitcoin Matrix" v2.0
// Hydration Guards: ✅ Applied per MANTENIMIENTO.md
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CountdownTimer from "@/components/hackathon/display/CountdownTimer";

export default function EditionHero({
  className,
  edition,
}: {
  className?: string;
  edition?: {
    title: string;
    slug: string;
    dates?: {
      start: string;
      end: string;
      timezone: string;
    };
    locations?: Array<{
      city: string;
      venue: string;
      address?: string;
      isPrimary?: boolean;
    }>;
  };
}) {
  // 🧠 Fallbacks seguros para evitar errores si edition no está completo
  const targetDate = edition?.dates?.start ?? "2026-06-05T09:00:00-06:00";
  const timezone = edition?.dates?.timezone ?? "America/Mexico_City";
  const primaryLocation = edition?.locations?.find(loc => loc.isPrimary) ?? edition?.locations?.[0];

  // 🔒 Hydration Guard: isMounted para evitar mismatches SSR/CSR
  // Según MANTENIMIENTO.md: componentes con datos dinámicos requieren este patrón
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 📅 Formateo seguro de fechas (solo en cliente para evitar mismatch)
  const formatDate = (dateString: string) => {
    if (!isMounted) return "5–7 Jun, 2026"; // Fallback estático para SSR
    try {
      return new Date(dateString).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "5–7 Jun, 2026";
    }
  };

  return (
    <section 
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-black via-black/95 to-transparent",
        className
      )}
      // 🔒 suppressHydrationWarning en el contenedor principal por contenido dinámico
      suppressHydrationWarning
    >
      {/* Decorative elements — DS Grid + Glow (estáticos, seguros para SSR) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-bitcoin/5 blur-[100px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-matrix/5 blur-[80px] rounded-full" />
        <div
          className="absolute inset-0 bg-[radial-gradient(rgba(0,255,65,0.15)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 space-y-8">
        
        {/* ═══════════════════════════════════════════════════════
            MAIN TITLE — DS: Serif titles + Matrix accents
            ═══════════════════════════════════════════════════════ */}
        <h1 
          className="font-serif text-4xl md:text-6xl font-bold leading-[1.15] tracking-tight max-w-5xl mx-auto text-center"
          suppressHydrationWarning
        >
          <span className="text-[#FAFAFA]">2do Hackathon</span>{" "}
          <span className="text-matrix">Aceptabitcoin.org</span>
          <br />
          <span className="text-[#FAFAFA]">Bitcoin</span>{" "}
          <span className="text-bitcoin drop-shadow-[0_0_30px_rgba(247,147,26,0.4)]">
            Self Custody UI Challenge
          </span>
          <br />
          <span className="text-[#FAFAFA] text-3xl md:text-5xl">ArcadiaB</span>
        </h1>

        {/* Subtitle — DS: Mono for technical descriptions */}
        <p 
          className="font-mono text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-center"
          suppressHydrationWarning
        >
          La edición más ambiciosa de nuestro hackathon.
          <span className="text-matrix">
            {" "}
            48 horas de innovación Bitcoin en Mérida, Yucatán.
          </span>
        </p>

        {/* ═══════════════════════════════════════════════════════
            COUNTDOWN TIMER — Reintegrado con protección de hidratación
            Según MANTENIMIENTO.md: CountdownTimer ya tiene implementación robusta (commit 9e5f23f)
            ═══════════════════════════════════════════════════════ */}
        {isMounted && (
          <div className="flex justify-center" suppressHydrationWarning>
            <CountdownTimer
              targetDate={targetDate}
              timezone={timezone}
              labels={{ days: "Días", hours: "Hrs", minutes: "Min", seconds: "Seg" }}
              withContainer={true}
              className="mx-auto"
            />
          </div>
        )}

        {/* Metadata strip — DS: Mono + subtle borders */}
        {/* 🔒 suppressHydrationWarning + fechas renderizadas solo en cliente */}
        <div 
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm font-mono text-gray-500 mt-4"
          suppressHydrationWarning
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-matrix flex-shrink-0" aria-hidden="true" />
            <span className="text-gray-400">
              {isMounted && edition?.dates?.start 
                ? formatDate(edition.dates.start)
                : "5–7 Jun, 2026"
              }
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-matrix flex-shrink-0" aria-hidden="true" />
            <span className="text-gray-400">
              {primaryLocation?.venue ?? "Tecnológico de Software Mérida"}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-matrix flex-shrink-0" aria-hidden="true" />
            <span className="text-gray-400">Hasta 300 participantes</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-matrix flex-shrink-0" aria-hidden="true" />
            <span className="text-bitcoin font-bold">Registro abierto</span>
          </span>
        </div>

        {/* CTA — DS: ArcadeButton style + enhanced glow */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a
            href="https://luma.com/kzdw3pek"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group relative inline-flex items-center justify-center px-8 py-4",
              "font-vt323 font-bold text-lg rounded-xl",
              "bg-bitcoin text-black",
              "transition-all duration-300",
              "hover:shadow-[0_0_20px_rgba(247,147,26,0.5)]",
              "hover:shadow-[0_0_60px_rgba(247,147,26,0.3)]",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              Registrarse Ahora
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </span>
            {/* Arcadepad glow overlay */}
            <span className="absolute -inset-1 bg-gradient-to-r from-bitcoin/20 via-amber-500/10 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </a>
          <a
            href={`/hackathon/${edition?.slug ?? "custody-ui-2026"}/resources`}
            className={cn(
              "group inline-flex items-center justify-center px-8 py-4",
              "font-vt323 font-bold text-lg rounded-xl",
              "border border-matrix/30 text-matrix",
              "hover:border-matrix hover:bg-matrix/10",
              "hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]",
              "hover:shadow-[0_0_40px_rgba(0,255,65,0.2)]",
              "transition-all duration-300",
              "hover:scale-105 active:scale-95"
            )}
          >
            Explorar Recursos
          </a>
        </div>
      </div>
    </section>
  );
}