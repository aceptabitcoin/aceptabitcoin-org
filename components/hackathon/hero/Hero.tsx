// ============================================================
// HACKATHON EDITION HERO — Featured hero for edition pages
// Acepta Bitcoin México | Oracle System v2.0
// Design System: "Bitcoin Matrix" v2.0
// Hydration Guards: ✅ Applied per MANTENIMIENTO.md
// Registration: ✅ Updated to Luma event (kzdw3pek)
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { Zap, Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ URL ÚNICA DE REGISTRO — Luma Events
const LUMA_REGISTRATION_URL = "https://luma.com/kzdw3pek";

export default function EditionHero({
  className,
}: {
  className?: string;
}) {
  // 🔒 Hydration Guard: isMounted para evitar mismatches SSR/CSR
  // Según MANTENIMIENTO.md: componentes con datos dinámicos requieren este patrón
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 📅 Formateo seguro de fechas (solo en cliente para evitar mismatch)
  const formatDate = (dateString: string) => {
    if (!isMounted) return "13–14 Jun, 2026"; // Fallback estático para SSR
    try {
      return new Date(dateString).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "13–14 Jun, 2026";
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
        
        {/* Marquee / Badge — DS: Mono + Bitcoin accent */}
        <div 
          className="inline-flex items-center gap-2 rounded-full border border-bitcoin/30 bg-bitcoin/10 px-4 py-1.5 mx-auto"
          suppressHydrationWarning
        >
          <Zap className="h-3.5 w-3.5 text-bitcoin animate-pulse flex-shrink-0" aria-hidden="true" />
          <span className="font-mono text-[10px] text-bitcoin uppercase tracking-[0.2em]">
            Hackathon Bitcoin México 2026
          </span>
        </div>

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
          <span className="text-[#FAFAFA] text-3xl md:text-5xl">ArcadiaB Hackathon</span>
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

        {/* Metadata strip — DS: Mono + subtle borders */}
        {/* 🔒 suppressHydrationWarning + fechas renderizadas solo en cliente */}
        <div 
          className="flex flex-wrap items-center justify-center gap-6 text-sm font-mono text-gray-500 mt-8"
          suppressHydrationWarning
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-matrix flex-shrink-0" aria-hidden="true" />
            <span className="text-gray-400">
              {isMounted 
                ? formatDate("2026-06-13T09:00:00-06:00") 
                : "13–14 Jun, 2026"
              }
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-matrix flex-shrink-0" aria-hidden="true" />
            <span className="text-gray-400">Centro de Convenciones Yucatán</span>
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

        {/* CTA — DS: ArcadeButton style + glow */}
        {/* ✅ Enlaces externos a Luma con atributos de seguridad */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <a
            href={LUMA_REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group relative inline-flex items-center justify-center px-8 py-4",
              "font-vt323 font-bold text-lg rounded-xl",
              "bg-bitcoin text-black transition-all duration-300",
              "hover:shadow-[0_0_30px_rgba(247,147,26,0.5)]",
              "focus:outline-none focus:ring-2 focus:ring-bitcoin/50"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              Registrarse Ahora
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </span>
          </a>
          <a
            href="/hackathon/[edition]/resources"
            className={cn(
              "group inline-flex items-center justify-center px-8 py-4",
              "font-vt323 font-bold text-lg rounded-xl",
              "border border-matrix/30 text-matrix",
              "hover:border-matrix hover:bg-matrix/10 transition-all duration-300"
            )}
          >
            Explorar Recursos
          </a>
        </div>
      </div>
    </section>
  );
}